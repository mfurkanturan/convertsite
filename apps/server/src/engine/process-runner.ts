import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isAbsolute } from 'node:path';
export class EngineFailure extends Error {
  constructor(public code: string) { super(code); }
}
const script = fileURLToPath(new URL('../../engine/python/main.py', import.meta.url));
// Same directory the API/worker write to; the isolated compose engine mounts it read-only at /data.
const dataDir = process.env.DATA_DIR ?? '/data';
if (!isAbsolute(dataDir)) throw new Error('DATA_DIR must be absolute for the engine');
export function runPython(payload: unknown, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('/usr/bin/prlimit', ['--as=2147483648', '--cpu=80', '--fsize=41943040', '--nofile=256', '--',
      '/opt/docly-python/bin/python', '-B', script], {
      detached: true, stdio: ['pipe', 'pipe', 'pipe'],
      env: { PATH: '/usr/bin:/bin', HOME: '/tmp', LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8',
        OMP_THREAD_LIMIT: '1', OMP_NUM_THREADS: '1', OPENBLAS_NUM_THREADS: '1', MKL_NUM_THREADS: '1', PYTHONDONTWRITEBYTECODE: '1', DOCLY_DATA_DIR: dataDir },
    });
    let stdout = ''; let stderr = ''; let bytes = 0; let overflow = false;
    child.stdin.on('error', () => { /* A cancelled child may close stdin before the payload is written. */ });
    child.stdin.end(JSON.stringify(payload));
    function kill() { if (child.pid) { try { process.kill(-child.pid, 'SIGKILL'); } catch { /* already exited */ } } }
    child.stdout.on('data', (chunk: Buffer) => { bytes += chunk.length; if (bytes > 131072) { overflow = true; kill(); } else stdout += chunk.toString('utf8'); });
    child.stderr.on('data', (chunk: Buffer) => { bytes += chunk.length; if (bytes > 131072) { overflow = true; kill(); } else stderr += chunk.toString('utf8'); });
    child.once('error', () => { signal.removeEventListener('abort', kill); reject(new EngineFailure('ENGINE_UNAVAILABLE')); });
    child.once('close', (code) => {
      signal.removeEventListener('abort', kill);
      if (signal.aborted) reject(new EngineFailure('PROCESSING_TIMEOUT'));
      else if (overflow) reject(new EngineFailure('LIMIT_EXCEEDED'));
      else if (code !== 0) reject(new EngineFailure(stderr.match(/DOCLY_ERROR:([A-Z_]+)/)?.[1] ?? 'INVALID_DOCUMENT'));
      else resolve(stdout);
    });
    signal.addEventListener('abort', kill, { once: true });
    if (signal.aborted) kill();
  });
}
