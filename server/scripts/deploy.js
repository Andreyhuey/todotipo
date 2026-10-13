/**
 * Deploys the API to the cPanel Node.js app over SSH.
 *
 *   npm run deploy
 *
 * Builds locally, uploads dist/ + package files + production.env (as .env)
 * to ~/<DEPLOY_APP_ROOT>, installs production dependencies with the
 * CloudLinux selector and restarts the app. SSH settings come from .env
 * locally, or from repository secrets in GitHub Actions (see ssh-config.js).
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Client } = require('ssh2');
const sshConfig = require('./ssh-config');

const APP_ROOT = process.env.DEPLOY_APP_ROOT || 'oaken-api';
const ROOT = path.join(__dirname, '..');

const sh = (conn, cmd) =>
  new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('data', (d) => (out += d)).stderr.on('data', (d) => (out += d));
      stream.on('close', (code) => (code ? reject(new Error(`${cmd}\n${out}`)) : resolve(out)));
    });
  });

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

(async () => {
  if (!fs.existsSync(path.join(ROOT, 'production.env'))) {
    throw new Error('production.env is missing — copy .env and remove the SSH_* settings');
  }

  console.log('🔨 Building…');
  fs.rmSync(path.join(ROOT, 'dist'), { recursive: true, force: true });
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

  const conn = new Client();
  await new Promise((resolve, reject) =>
    conn
      .on('ready', resolve)
      .on('error', reject)
      .connect(sshConfig())
  );
  const sftp = await new Promise((resolve, reject) => conn.sftp((e, s) => (e ? reject(e) : resolve(s))));
  const home = (await sh(conn, 'echo $HOME')).trim();
  const remoteRoot = `${home}/${APP_ROOT}`;

  // Fresh dist/ each deploy so deleted files don't linger.
  await sh(conn, `rm -rf ${remoteRoot}/dist && mkdir -p ${remoteRoot}/dist`);

  const files = [
    ...walk(path.join(ROOT, 'dist')).map((p) => [p, path.relative(ROOT, p)]),
    [path.join(ROOT, 'package.json'), 'package.json'],
    [path.join(ROOT, 'package-lock.json'), 'package-lock.json'],
    [path.join(ROOT, 'production.env'), '.env'],
  ];
  const dirs = [...new Set(files.map(([, rel]) => path.posix.dirname(rel.split(path.sep).join('/'))))];
  await sh(conn, dirs.map((d) => `mkdir -p "${remoteRoot}/${d}"`).join(' && '));

  console.log(`📦 Uploading ${files.length} files to ~/${APP_ROOT}…`);
  for (const [local, rel] of files) {
    const remote = `${remoteRoot}/${rel.split(path.sep).join('/')}`;
    await new Promise((resolve, reject) => sftp.fastPut(local, remote, (e) => (e ? reject(e) : resolve())));
  }
  await sh(conn, `chmod 600 ${remoteRoot}/.env`);

  console.log('📥 Installing production dependencies (this can take a few minutes)…');
  await sh(conn, `cloudlinux-selector install-modules --json --interpreter nodejs --app-root ${APP_ROOT}`);

  console.log('🔁 Restarting…');
  await sh(conn, `cloudlinux-selector restart --json --interpreter nodejs --app-root ${APP_ROOT}`);
  conn.end();
  console.log('✅ Deployed');
})().catch((err) => {
  console.error('❌ Deploy failed:', err.message);
  process.exit(1);
});
