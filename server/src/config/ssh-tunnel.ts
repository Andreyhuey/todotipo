import crypto from 'crypto';
import fs from 'fs';
import net, { AddressInfo } from 'net';
import { Client, ConnectConfig } from 'ssh2';
import dotenv from 'dotenv';

dotenv.config();

/**
 * The database only listens on the hosting server's loopback interface, so
 * the API reaches it through an SSH local port forward:
 *
 *   API  ->  127.0.0.1:<local port>  ->  SSH  ->  <DB_REMOTE_HOST>:<DB_REMOTE_PORT>
 *
 * The tunnel is enabled when SSH_HOST is set. When the API itself runs on the
 * hosting server, leave SSH_HOST empty and the DB is reached directly.
 */
export interface TunnelInfo {
  host: string;
  port: number;
  close: () => void;
}

export const isTunnelEnabled = () => !!process.env.SSH_HOST;

const buildConnectConfig = (): ConnectConfig => {
  const keyPath = process.env.SSH_PRIVATE_KEY_PATH;
  const cfg: ConnectConfig = {
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT || 22),
    username: process.env.SSH_USER,
    keepaliveInterval: 15_000,
    readyTimeout: 20_000,
  };

  if (keyPath) {
    cfg.privateKey = fs.readFileSync(keyPath);
    if (process.env.SSH_PASSPHRASE) cfg.passphrase = process.env.SSH_PASSPHRASE;
  } else if (process.env.SSH_PRIVATE_KEY) {
    // Allows the key to be supplied inline (e.g. on hosts without a filesystem)
    cfg.privateKey = process.env.SSH_PRIVATE_KEY.replace(/\\n/g, '\n');
    if (process.env.SSH_PASSPHRASE) cfg.passphrase = process.env.SSH_PASSPHRASE;
  } else {
    cfg.password = process.env.SSH_PASSWORD;
  }

  // Pin the server's host key (as printed by `ssh-keygen -lf`, "SHA256:...")
  // to guard the tunnel against man-in-the-middle attacks.
  const fingerprint = process.env.SSH_HOST_FINGERPRINT?.replace(/^SHA256:/, '');
  if (fingerprint) {
    // The pinned fingerprint is for the ED25519 key, so negotiate that type.
    cfg.algorithms = { serverHostKey: ['ssh-ed25519'] };
    cfg.hostVerifier = (key: Buffer) =>
      crypto.createHash('sha256').update(key).digest('base64').replace(/=+$/, '') ===
      fingerprint.replace(/=+$/, '');
  }

  if (!cfg.username) throw new Error('SSH_USER is required when SSH_HOST is set');
  if (!cfg.password && !cfg.privateKey) {
    throw new Error(
      'Set SSH_PASSWORD, SSH_PRIVATE_KEY_PATH or SSH_PRIVATE_KEY to open the SSH tunnel'
    );
  }

  return cfg;
};

export const openSshTunnel = (
  remoteHost: string,
  remotePort: number
): Promise<TunnelInfo> =>
  new Promise((resolve, reject) => {
    const ssh = new Client();
    let server: net.Server | undefined;

    ssh.on('ready', () => {
      server = net.createServer((socket) => {
        ssh.forwardOut(
          socket.remoteAddress || '127.0.0.1',
          socket.remotePort || 0,
          remoteHost,
          remotePort,
          (err, stream) => {
            if (err) {
              console.error('❌ SSH forward failed:', err.message);
              socket.destroy();
              return;
            }
            socket.pipe(stream).pipe(socket);
            stream.on('error', () => socket.destroy());
            socket.on('error', () => stream.destroy());
          }
        );
      });

      const localPort = Number(process.env.SSH_LOCAL_PORT || 0);
      server.listen(localPort, '127.0.0.1', () => {
        const { port } = server!.address() as AddressInfo;
        console.log(
          `🔐 SSH tunnel ready: 127.0.0.1:${port} -> ${remoteHost}:${remotePort}`
        );
        resolve({
          host: '127.0.0.1',
          port,
          close: () => {
            server?.close();
            ssh.end();
          },
        });
      });
    });

    ssh.on('error', (err) => {
      server?.close();
      reject(new Error(`SSH connection failed: ${err.message}`));
    });

    ssh.on('close', () => {
      // If the tunnel drops after start-up the DB pool will fail; exit so the
      // process manager restarts us with a fresh tunnel.
      if (server?.listening) {
        console.error('❌ SSH tunnel closed unexpectedly');
        process.exit(1);
      }
    });

    try {
      ssh.connect(buildConnectConfig());
    } catch (err) {
      reject(err);
    }
  });
