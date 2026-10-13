/**
 * Runs a shell command on the hosting server over SSH (credentials from .env).
 *   npm run remote -- "tail -50 ~/oaken-api/stderr.log"
 */
require('dotenv').config();
const fs = require('fs');
const { Client } = require('ssh2');
const sshConfig = require('./ssh-config');

const cmd = process.argv.slice(2).join(' ');
if (!cmd) {
  console.error('Usage: npm run remote -- "<command>"');
  process.exit(1);
}
const conn = new Client();
conn
  .on('ready', () =>
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      stream.on('data', (d) => process.stdout.write(d)).stderr.on('data', (d) => process.stderr.write(d));
      stream.on('close', (code) => {
        conn.end();
        process.exitCode = code || 0;
      });
    })
  )
  .on('error', (err) => {
    console.error('❌ SSH connection failed:', err.message);
    process.exitCode = 1;
  })
  .connect(sshConfig());
