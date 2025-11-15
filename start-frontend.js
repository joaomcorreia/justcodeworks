const { spawn } = require('child_process');
const path = require('path');

// Change to frontend directory
process.chdir('C:\\projects\\justcodeworks\\frontend');

console.log('Starting Next.js development server...');
console.log('Working directory:', process.cwd());

// Start Next.js dev server
const nextProcess = spawn('npx', ['next', 'dev', '-p', '3008'], {
  stdio: 'inherit',
  shell: true,
  cwd: 'C:\\projects\\justcodeworks\\frontend'
});

nextProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});

nextProcess.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});