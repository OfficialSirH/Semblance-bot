import { stdout, stderr } from 'node:process';

stdout.on('data', (data: string) => {
  console.log(`stdout: ${data}`);
});

stderr.on('data', (data: string) => {
  console.error(`stderr: ${data}`);
});
