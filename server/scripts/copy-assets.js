// Copies non-TypeScript runtime files (email templates, status page) into dist/.
const fs = require('fs');
const path = require('path');
for (const dir of ['templates', 'public']) {
  fs.cpSync(path.join(__dirname, '..', 'src', dir), path.join(__dirname, '..', 'dist', dir), { recursive: true });
}
