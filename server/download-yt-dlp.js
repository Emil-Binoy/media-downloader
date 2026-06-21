const fs = require('fs');
const path = require('path');
const https = require('https');

const isWin = process.platform === 'win32';
const filename = isWin ? 'yt-dlp.exe' : 'yt-dlp';
const url = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${filename}`;

const binDir = path.join(__dirname, 'node_modules', 'yt-dlp-exec', 'bin');
const dest = path.join(binDir, filename);

if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

console.log(`Downloading yt-dlp from ${url} to ${dest}...`);

function download(downloadUrl) {
  https.get(downloadUrl, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
      download(response.headers.location);
    } else {
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        if (!isWin) {
          fs.chmodSync(dest, 0o755);
        }
        console.log('yt-dlp download completed successfully.');
      });
    }
  }).on('error', (err) => {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    console.error('Error downloading yt-dlp:', err.message);
  });
}

download(url);
