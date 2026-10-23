#!/usr/bin/env node
const { execFileSync } = require('node:child_process');
const { resolve } = require('node:path');

try {
  process.loadEnvFile(resolve(process.cwd(), '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const toolEngineMap = {
  'merge-pdf': 'QPDF',
  'compress-pdf': 'QPDF',
  'edit-pdf-pages': 'QPDF',
  'protect-pdf': 'QPDF',
  'unlock-pdf': 'QPDF',
  'pdf-to-word': 'PyMuPDF',
  'pdf-to-excel': 'PyMuPDF',
  'pdf-to-images': 'PyMuPDF',
  'images-to-pdf': 'PyMuPDF',
  'page-numbers': 'PyMuPDF',
  'watermark-pdf': 'PyMuPDF',
  'word-to-pdf': 'LibreOffice',
  'excel-to-pdf': 'LibreOffice',
  'pptx-to-pdf': 'LibreOffice',
  ocr: 'Tesseract OCR',
};

const reportQuery = `
  SELECT json_build_object(
    'overview', (
      SELECT row_to_json(summary) FROM (
        SELECT
          COUNT(*)::int AS total_jobs,
          COUNT(*) FILTER (WHERE state = 'succeeded')::int AS successful_jobs,
          COUNT(*) FILTER (WHERE state = 'failed')::int AS failed_jobs,
          COUNT(DISTINCT owner)::int AS total_users,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::int AS today_jobs,
          COUNT(DISTINCT owner) FILTER (WHERE created_at >= CURRENT_DATE)::int AS today_users,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::int AS week_jobs,
          COUNT(DISTINCT owner) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::int AS week_users
        FROM jobs
      ) summary
    ),
    'tools', (
      SELECT COALESCE(json_agg(row_to_json(tool_stats) ORDER BY tool_stats.total DESC), '[]'::json)
      FROM (
        SELECT tool, COUNT(*)::int AS total, COUNT(DISTINCT owner)::int AS unique_users,
          COUNT(*) FILTER (WHERE state = 'succeeded')::int AS succeeded,
          COUNT(*) FILTER (WHERE state = 'failed')::int AS failed
        FROM jobs GROUP BY tool
      ) tool_stats
    ),
    'trend', (
      SELECT COALESCE(json_agg(row_to_json(daily_stats) ORDER BY daily_stats.day DESC), '[]'::json)
      FROM (
        SELECT date_trunc('day', created_at)::date::text AS day, COUNT(*)::int AS jobs,
          COUNT(DISTINCT owner)::int AS unique_users,
          COUNT(*) FILTER (WHERE state = 'succeeded')::int AS succeeded
        FROM jobs WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' GROUP BY 1
      ) daily_stats
    )
  )::text;
`;

function loadReport() {
  const output = execFileSync('docker', [
    'compose', 'exec', '-T', 'postgres', 'psql', '-U', 'docly', '-d', 'docly', '-t', '-A', '-c', reportQuery,
  ], { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(output.trim());
}

function printReport({ overview, tools, trend }) {
  const totalJobs = overview.total_jobs || 0;
  const successRate = totalJobs > 0 ? ((overview.successful_jobs / totalJobs) * 100).toFixed(1) : '100';
  const engineStats = {};

  for (const tool of tools) {
    const engine = toolEngineMap[tool.tool] || 'Diğer';
    engineStats[engine] = (engineStats[engine] || 0) + tool.total;
  }

  console.log('\n============================================================');
  console.log('       📊 DOCTORCONVERTER KULLANIM VE MOTOR RAPORU          ');
  console.log('============================================================');
  console.log('📌 GENEL METRİKLER:');
  console.log(`   • Toplam Tekil Oturum (iş sahibi): ${overview.total_users.toLocaleString()} oturum`);
  console.log(`   • Toplam Çalıştırılan İşlem:       ${totalJobs.toLocaleString()} işlem`);
  console.log(`   • Başarı Oranı:                    %${successRate}`);
  console.log(`   • Bugünkü Tekil Oturum:            ${overview.today_users.toLocaleString()} oturum (${overview.today_jobs} işlem)`);
  console.log(`   • Son 7 Günlük Tekil Oturum:       ${overview.week_users.toLocaleString()} oturum (${overview.week_jobs} işlem)`);
  console.log('------------------------------------------------------------');
  console.log('⚙️ MOTOR KULLANIM DAĞILIMI:');
  for (const [engine, count] of Object.entries(engineStats)) {
    const percentage = totalJobs > 0 ? ((count / totalJobs) * 100).toFixed(1) : '0.0';
    console.log(`   • ${engine.padEnd(16)}: ${count.toString().padStart(5)} işlem  (%${percentage})`);
  }
  if (Object.keys(engineStats).length === 0) console.log('   (Henüz motor işlemi kaydedilmedi)');

  console.log('------------------------------------------------------------');
  console.log('🛠️ ARAÇLARA GÖRE KULLANIM:');
  if (tools.length === 0) console.log('   (Henüz araç kullanımı bulunmuyor)');
  tools.forEach((tool, index) => {
    const engine = toolEngineMap[tool.tool] || 'Diğer';
    console.log(`   ${(index + 1).toString().padStart(2)}. ${tool.tool.padEnd(20)}: ${tool.total.toString().padStart(4)} işlem (${tool.unique_users} oturum) [${engine}]`);
  });

  console.log('------------------------------------------------------------');
  console.log('📅 GÜNLÜK TREND (Son 7 Gün):');
  if (trend.length === 0) console.log('   (Son 7 günde kayıtlı işlem yok)');
  trend.forEach((day) => {
    console.log(`   • ${day.day}: ${day.unique_users.toString().padStart(3)} oturum | ${day.jobs.toString().padStart(3)} işlem (Başarılı: ${day.succeeded})`);
  });
  console.log('============================================================\n');
}

try {
  printReport(loadReport());
} catch (error) {
  console.error('\n❌ Kullanım raporu alınamadı. Docker Compose servislerinin çalıştığını kontrol edin: pnpm infra:up');
  if (error.stderr) console.error(error.stderr.toString().trim());
  else console.error(error.message);
  process.exitCode = 1;
}
