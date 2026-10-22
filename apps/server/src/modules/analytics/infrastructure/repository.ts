import type pg from 'pg';

export interface ToolMetric {
  tool: string;
  engine: string;
  total: number;
  uniqueUsers: number;
  succeeded: number;
  failed: number;
}

export interface EngineMetric {
  engine: string;
  total: number;
}

export interface DailyTrend {
  date: string;
  jobs: number;
  uniqueUsers: number;
  succeeded: number;
}

export interface AnalyticsSummary {
  totalJobs: number;
  totalUniqueUsers: number;
  successfulJobs: number;
  failedJobs: number;
  successRate: number;
  todayJobs: number;
  todayUniqueUsers: number;
  last7DaysJobs: number;
  last7DaysUniqueUsers: number;
  tools: ToolMetric[];
  engines: EngineMetric[];
  trends: DailyTrend[];
}

export const toolEngineMap: Record<string, string> = {
  'merge-pdf': 'qpdf',
  'compress-pdf': 'qpdf',
  'edit-pdf-pages': 'qpdf',
  'protect-pdf': 'qpdf',
  'unlock-pdf': 'qpdf',
  'pdf-to-word': 'pymupdf',
  'pdf-to-excel': 'pymupdf',
  'pdf-to-images': 'pymupdf',
  'images-to-pdf': 'pymupdf',
  'page-numbers': 'pymupdf',
  'watermark-pdf': 'pymupdf',
  'word-to-pdf': 'libreoffice',
  'excel-to-pdf': 'libreoffice',
  'pptx-to-pdf': 'libreoffice',
  'ocr': 'tesseract',
};

export function analyticsRepository(pool: pg.Pool) {
  return {
    async getSummary(): Promise<AnalyticsSummary> {
      // 1. Overview counts
      const overviewRes = await pool.query<{
        total_jobs: string;
        successful_jobs: string;
        failed_jobs: string;
        total_users: string;
        today_jobs: string;
        today_users: string;
        week_jobs: string;
        week_users: string;
      }>(`
        SELECT
          COUNT(*)::text as total_jobs,
          COUNT(*) FILTER (WHERE state = 'succeeded')::text as successful_jobs,
          COUNT(*) FILTER (WHERE state = 'failed')::text as failed_jobs,
          COUNT(DISTINCT owner)::text as total_users,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::text as today_jobs,
          COUNT(DISTINCT owner) FILTER (WHERE created_at >= CURRENT_DATE)::text as today_users,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::text as week_jobs,
          COUNT(DISTINCT owner) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::text as week_users
        FROM jobs
      `);

      const overview = overviewRes.rows[0] ?? {
        total_jobs: '0',
        successful_jobs: '0',
        failed_jobs: '0',
        total_users: '0',
        today_jobs: '0',
        today_users: '0',
        week_jobs: '0',
        week_users: '0',
      };

      const totalJobs = Number(overview.total_jobs);
      const successfulJobs = Number(overview.successful_jobs);
      const failedJobs = Number(overview.failed_jobs);
      const totalUniqueUsers = Number(overview.total_users);
      const todayJobs = Number(overview.today_jobs);
      const todayUniqueUsers = Number(overview.today_users);
      const last7DaysJobs = Number(overview.week_jobs);
      const last7DaysUniqueUsers = Number(overview.week_users);
      const successRate = totalJobs > 0 ? Number(((successfulJobs / totalJobs) * 100).toFixed(1)) : 100;

      // 2. Tools breakdown
      const toolsRes = await pool.query<{
        tool: string;
        total: string;
        unique_users: string;
        succeeded: string;
        failed: string;
      }>(`
        SELECT
          tool,
          COUNT(*)::text as total,
          COUNT(DISTINCT owner)::text as unique_users,
          COUNT(*) FILTER (WHERE state = 'succeeded')::text as succeeded,
          COUNT(*) FILTER (WHERE state = 'failed')::text as failed
        FROM jobs
        GROUP BY tool
        ORDER BY COUNT(*) DESC
      `);

      const tools: ToolMetric[] = toolsRes.rows.map((row) => ({
        tool: row.tool,
        engine: toolEngineMap[row.tool] ?? 'other',
        total: Number(row.total),
        uniqueUsers: Number(row.unique_users),
        succeeded: Number(row.succeeded),
        failed: Number(row.failed),
      }));

      // 3. Engine breakdown
      const engineCounts: Record<string, number> = {};
      for (const t of tools) {
        engineCounts[t.engine] = (engineCounts[t.engine] ?? 0) + t.total;
      }
      const engines: EngineMetric[] = Object.entries(engineCounts)
        .map(([engine, total]) => ({ engine, total }))
        .sort((a, b) => b.total - a.total);

      // 4. Daily trends (last 14 days)
      const trendsRes = await pool.query<{
        day: string;
        jobs: string;
        unique_users: string;
        succeeded: string;
      }>(`
        SELECT
          date_trunc('day', created_at)::date::text as day,
          COUNT(*)::text as jobs,
          COUNT(DISTINCT owner)::text as unique_users,
          COUNT(*) FILTER (WHERE state = 'succeeded')::text as succeeded
        FROM jobs
        WHERE created_at >= CURRENT_DATE - INTERVAL '14 days'
        GROUP BY day
        ORDER BY day DESC
      `);

      const trends: DailyTrend[] = trendsRes.rows.map((row) => ({
        date: row.day,
        jobs: Number(row.jobs),
        uniqueUsers: Number(row.unique_users),
        succeeded: Number(row.succeeded),
      }));

      return {
        totalJobs,
        totalUniqueUsers,
        successfulJobs,
        failedJobs,
        successRate,
        todayJobs,
        todayUniqueUsers,
        last7DaysJobs,
        last7DaysUniqueUsers,
        tools,
        engines,
        trends,
      };
    },
  };
}
