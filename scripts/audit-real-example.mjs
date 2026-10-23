// Explicit local files only. No real fixture or derived content is added to Git or a database.
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

if (!process.argv[2]) throw new Error('Provide an explicitly authorized local PDF path.');
const root = resolve('.qa/engine-real');
await mkdir(root, { recursive: true });
await copyFile(resolve(process.argv[2]), resolve(root, 'source.pdf'));
if (process.argv[3]) await copyFile(resolve(process.argv[3]), resolve(root, 'previous.docx'));
const result = spawnSync('docker', ['run', '--rm', '--init', '--network', 'none', '--cpus', '1', '--memory', '1024m', '--pids-limit', '96', '--read-only', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges:true', '--tmpfs', '/tmp:size=402653184,mode=1777,noexec,nosuid', '--mount', `type=bind,source=${resolve('apps/server')},target=/source,readonly`, '--mount', `type=bind,source=${root},target=/audit`, 'docly-backend:local', '/opt/docly-python/bin/python', '-B', '/source/tests/quality/real_example.py'], { stdio: 'inherit', shell: false });
process.exitCode = result.status ?? 1;
