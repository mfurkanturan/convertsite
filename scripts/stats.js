#!/usr/bin/env node
import pg from 'pg';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile(resolve(process.cwd(), '.env'));
} catch (e) {
  // If .env is missing, defaults will be used
}

const databaseUrl = process.env.DATABASE_URL || 'postgres://docly:docly-local@127.0.0.1:55432/docly';

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
  'ocr': 'Tesseract OCR',
};

async function run() {
  const pool = new pg.Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5000 });

  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
    console.error('\n❌ Veritabanına bağlanılamadı. Docker/Postgres çalışıyor mu kontrol edin.');
    console.error('Hata:', err.message);
    process.exit(1);
  }

  try {
    // 1. General Overview
    const overviewRes = await pool.query(`
      SELECT
        COUNT(*)::int as total_jobs,
        COUNT(*) FILTER (WHERE state = 'succeeded')::int as successful_jobs,
        COUNT(*) FILTER (WHERE state = 'failed')::int as failed_jobs,
        COUNT(DISTINCT owner)::int as total_users,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::int as today_jobs,
        COUNT(DISTINCT owner) FILTER (WHERE created_at >= CURRENT_DATE)::int as today_users,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::int as week_jobs,
        COUNT(DISTINCT owner) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::int as week_users
      FROM jobs
    `);

    const ov = overviewRes.rows[0];
    const totalJobs = ov.total_jobs || 0;
    const totalUsers = ov.total_users || 0;
    const successRate = totalJobs > 0 ? ((ov.successful_jobs / totalJobs) * 100).toFixed(1) : '100';

    // 2. Tools breakdown
    const toolsRes = await pool.query(`
      SELECT
        tool,
        COUNT(*)::int as total,
        COUNT(DISTINCT owner)::int as unique_users,
        COUNT(*) FILTER (WHERE state = 'succeeded')::int as succeeded,
        COUNT(*) FILTER (WHERE state = 'failed')::int as failed
      FROM jobs
      GROUP BY tool
      ORDER BY total DESC
    `);

    // 3. Engine calculation
    const engineStats = {};
    for (const row of toolsRes.rows) {
      const eng = toolEngineMap[row.tool] || 'Diğer';
      engineStats[eng] = (engineStats[eng] || 0) + row.total;
    }

    // 4. Daily trend (past 7 days)
    const trendRes = await pool.query(`
      SELECT
        date_trunc('day', created_at)::date::text as day,
        COUNT(*)::int as jobs,
        COUNT(DISTINCT owner)::int as unique_users,
        COUNT(*) FILTER (WHERE state = 'succeeded')::int as succeeded
      FROM jobs
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day DESC
    `);

    // Output formatted report
    console.log('\n============================================================');
    console.log('       📊 DOCTORCONVERTER KULLANIM VE MOTOR RAPORU          ');
    console.log('============================================================');
    console.log('📌 GENEL METRİKLER:');
    console.log(`   • Toplam Tekil Kullanıcı (Kişi): ${totalUsers.toLocaleString()} kişi`);
    console.log(`   • Toplam Çalıştırılan İşlem:     ${totalJobs.toLocaleString()} işlem`);
    console.log(`   • Başarı Oranı:                  %${successRate}`);
    console.log(`   • Bugünkü Tekil Kullanıcı:        ${ov.today_users.toLocaleString()} kişi (${ov.today_jobs} işlem)`);
    console.log(`   • Son 7 Günlük Kullanıcı:        ${ov.week_users.toLocaleString()} kişi (${ov.week_jobs} işlem)`);
    console.log('------------------------------------------------------------');
    console.log('⚙️ MOTOR KULLANIM DAĞILIMI:');
    for (const [engine, count] of Object.entries(engineStats)) {
      const pct = totalJobs > 0 ? ((count / totalJobs) * 100).toFixed(1) : 0;
      console.log(`   • ${engine.padEnd(16)}: ${count.toString().padStart(5)} işlem  (%${pct})`);
    }
    if (Object.keys(engineStats).length === 0) {
      console.log('   (Henüz motor işlemi kaydedilmedi)');
    }
    console.log('------------------------------------------------------------');
    console.log('🛠️ ARAÇLARA GÖRE KULLANIM:');
    if (toolsRes.rows.length === 0) {
      console.log('   (Henüz araç kullanımı bulunmuyor)');
    } else {
      toolsRes.rows.forEach((t, i) => {
        const engine = toolEngineMap[t.tool] || 'Diğer';
        console.log(`   ${(i + 1).toString().padStart(2)}. ${t.tool.padEnd(20)}: ${t.total.toString().padStart(4)} işlem (${t.unique_users} kişi) [${engine}]`);
      });
    }
    console.log('------------------------------------------------------------');
    console.log('📅 GÜNLÜK TREND (Son 7 Gün):');
    if (trendRes.rows.length === 0) {
      console.log('   (Son 7 günde kayıtlı işlem yok)');
    } else {
      trendRes.rows.forEach((d) => {
        console.log(`   • ${d.day}: ${d.unique_users.toString().padStart(3)} kişi | ${d.jobs.toString().padStart(3)} işlem (Başarılı: ${d.succeeded})`);
      });
    }
    console.log('============================================================\n');

  } catch (err) {
    console.error('Sorgu çalıştırılırken hata:', err.message);
  } finally {
    await pool.end();
  }
}

run();
