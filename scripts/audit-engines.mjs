import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const output = resolve('.qa/engine-audit');
mkdirSync(output, { recursive: true });
const image = spawnSync('docker', ['image', 'inspect', 'docly-backend:local', '--format', '{{.Id}}'], { encoding: 'utf8' });
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' });
const args = process.argv.slice(2);
const profiles = args.includes('--profiles');
const supplement = args.includes('--supplement');
const mode = supplement ? 'supplement' : profiles ? 'profiles' : args.includes('--performance-only') ? 'performance' : 'quality';
writeFileSync(resolve(output, `host-${mode}.json`), JSON.stringify({ timestamp: new Date().toISOString(), image: image.stdout.trim(), revision: revision.stdout.trim(), source: 'working tree mounted read-only; exact engine-source hashes in environment.json', cpus: 1, memoryMiB: 1024, pidLimit: 96 }, null, 2));
const entry = supplement ? '/source/tests/quality/supplement.py' : profiles ? '/source/tests/quality/candidates.py' : '/source/tests/quality/run.py';
const result = spawnSync('docker', ['run', '--rm', '--init', '--network', 'none', '--cpus', '1', '--memory', '1024m', '--pids-limit', '96', '--read-only', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges:true', '--tmpfs', '/tmp:size=402653184,mode=1777,noexec,nosuid', '--mount', `type=bind,source=${resolve('apps/server')},target=/source,readonly`, '--mount', `type=bind,source=${output},target=/audit`, 'docly-backend:local', '/opt/docly-python/bin/python', '-B', entry, ...(profiles || supplement ? [] : args)], { stdio: 'inherit', shell: false });
process.exitCode = result.status ?? 1;
