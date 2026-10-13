/**
 * SSH connection settings shared by deploy.js and remote.js, read from the
 * environment (.env locally, repository secrets in GitHub Actions).
 *
 * Auth: SSH_PRIVATE_KEY (key contents), SSH_PRIVATE_KEY_PATH, or SSH_PASSWORD.
 * SSH_HOST_FINGERPRINT ("SHA256:…") pins the server's host key so a
 * man-in-the-middle can't receive the deploy.
 */
const crypto = require('crypto');
const fs = require('fs');

module.exports = function sshConfig() {
  const cfg = {
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT || 22),
    username: process.env.SSH_USER,
    readyTimeout: 30_000,
  };

  if (process.env.SSH_PRIVATE_KEY) cfg.privateKey = process.env.SSH_PRIVATE_KEY.replace(/\\n/g, '\n');
  else if (process.env.SSH_PRIVATE_KEY_PATH) cfg.privateKey = fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH);
  else cfg.password = process.env.SSH_PASSWORD;
  if (process.env.SSH_PASSPHRASE) cfg.passphrase = process.env.SSH_PASSPHRASE;

  const pinned = process.env.SSH_HOST_FINGERPRINT?.trim().replace(/^SHA256:/, '').replace(/=+$/, '');
  if (pinned) {
    // The fingerprint is for the ED25519 key, so negotiate that key type.
    cfg.algorithms = { serverHostKey: ['ssh-ed25519'] };
    cfg.hostVerifier = (key) => {
      const actual = crypto.createHash('sha256').update(key).digest('base64').replace(/=+$/, '');
      if (actual !== pinned) {
        console.error(`❌ SSH host key mismatch: expected SHA256:${pinned}, got SHA256:${actual}`);
        return false;
      }
      return true;
    };
  }

  if (!cfg.host || !cfg.username) throw new Error('SSH_HOST and SSH_USER must be set');
  if (!cfg.password && !cfg.privateKey) throw new Error('Set SSH_PRIVATE_KEY, SSH_PRIVATE_KEY_PATH or SSH_PASSWORD');
  return cfg;
};
