import { spawnSync } from 'node:child_process';
function run(args) {
  const result = spawnSync('docker', ['compose', ...args], { stdio: 'inherit', shell: false });
  if (result.status !== 0) throw new Error(`Backend test command failed (${result.status ?? 'startup'}).`);
}
let code = 0;
try {
  run(['build', 'engine']);
  run(['up', '-d', '--wait', 'postgres', 'engine', 'migrate', 'api', 'gateway']);
  run(['stop', 'worker']);
  run(['run', '--rm', '--no-deps', '-e', 'XDG_DATA_HOME=/tmp/vitest-data', 'worker', 'node', 'node_modules/vitest/vitest.mjs', 'run', '--testTimeout=30000', '--hookTimeout=30000', '--maxWorkers=1', '--no-file-parallelism', '--no-cache', '--fsModuleCachePath=/tmp/vitest-cache']);
} catch (error) { console.error(error.message); code = 1; }
finally {
  const restored = spawnSync('docker', ['compose', 'up', '-d', 'worker'], { stdio: 'inherit', shell: false });
  if (restored.status !== 0) code = 1;
}
process.exitCode = code;
