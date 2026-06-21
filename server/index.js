require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ffmpegPath = require('ffmpeg-static');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set up temporary directory
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Cleanup old files in temp directory every hour (files older than 1 hour)
setInterval(() => {
  fs.readdir(tempDir, (err, files) => {
    if (err) return console.error('Error reading temp directory:', err);
    
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        if (now - stats.mtimeMs > 3600000) {
          fs.unlink(filePath, err => {
            if (err) console.error(`Error deleting old file ${filePath}:`, err);
          });
        }
      });
    });
  });
}, 3600000);

app.use(cors({ exposedHeaders: ['Content-Disposition'] }));
app.use(express.json());

// GET /api/media-info
app.get('/api/media-info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await ytdlp(url, {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      forceIpv4: true,
      extractorArgs: 'youtube:player_client=ios,android'
    });
    
    const { title, thumbnail, extractor, uploader, duration } = info;
    
    res.json({
      title,
      thumbnail,
      platform: extractor,
      creator: uploader,
      duration,
    });
  } catch (error) {
    console.error('Error fetching media info:', error.message);
    res.status(500).json({ error: 'Failed to fetch media information. Check if the URL is valid and supported.' });
  }
});

// POST /api/download
app.post('/api/download', async (req, res) => {
  const { url, type, quality, clientId, downloadId } = req.body;
  if (!url || !type) return res.status(400).json({ error: 'URL and type are required' });
  
  const tempId = crypto.randomBytes(16).toString('hex');
  let tempFilePath = '';
  
  try {
    const titleInfo = await ytdlp(url, { dumpJson: true });
    const safeTitle = (titleInfo.title || 'media_download').replace(/[^a-z0-9]/gi, '_');
    
    let options = {
      noCheckCertificate: true,
      noWarnings: true,
      ffmpegLocation: ffmpegPath,
      forceIpv4: true,
      extractorArgs: 'youtube:player_client=ios,android'
    };
    
    let extension = 'mp4';

    if (type === 'audio') {
      options.extractAudio = true;
      options.audioFormat = 'mp3';
      extension = 'mp3';
      
      if (quality === '128') {
        options.audioQuality = '128K';
      } else if (quality === '320') {
        options.audioQuality = '320K';
      } else {
        options.audioQuality = 0; // best
      }
    } else if (type === 'video') {
      extension = 'mp4';
      if (quality === '360') {
        options.format = 'bestvideo[vcodec^=avc][height<=360]+bestaudio[acodec^=mp4a]/bestvideo[height<=360]+bestaudio/best[height<=360]';
      } else if (quality === '720') {
        options.format = 'bestvideo[vcodec^=avc][height<=720]+bestaudio[acodec^=mp4a]/bestvideo[height<=720]+bestaudio/best[height<=720]';
      } else if (quality === '1080') {
        options.format = 'bestvideo[vcodec^=avc][height<=1080]+bestaudio[acodec^=mp4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]';
      } else {
        options.format = 'bestvideo[vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo+bestaudio/best';
      }
      options.mergeOutputFormat = 'mp4';
    } else {
      return res.status(400).json({ error: 'Invalid media type' });
    }
    
    // Fetch info with the selected format to check what will actually be downloaded
    const infoOptions = { ...options, dumpJson: true };
    const mediaInfo = await ytdlp(url, infoOptions);
    
    // If video, check if we need to fallback and re-encode
    if (type === 'video') {
      let needsRecode = false;
      if (mediaInfo.requested_formats) {
        const vFormat = mediaInfo.requested_formats.find(f => f.vcodec !== 'none');
        const aFormat = mediaInfo.requested_formats.find(f => f.acodec !== 'none');
        
        if (vFormat && vFormat.vcodec && !vFormat.vcodec.startsWith('avc')) needsRecode = true;
        if (aFormat && aFormat.acodec && !aFormat.acodec.startsWith('mp4a')) needsRecode = true;
      } else {
        if (mediaInfo.vcodec && mediaInfo.vcodec !== 'none' && !mediaInfo.vcodec.startsWith('avc')) needsRecode = true;
        if (mediaInfo.acodec && mediaInfo.acodec !== 'none' && !mediaInfo.acodec.startsWith('mp4a')) needsRecode = true;
      }

      if (needsRecode) {
        options.postprocessorArgs = ['ffmpeg:-c:v libx264 -c:a aac'];
      }
    }
    
    tempFilePath = path.join(tempDir, `${tempId}.${extension}`);
    options.output = tempFilePath;
    
    const ytDlpProcess = ytdlp.exec(url, options);
    
    let currentStage = 'Fetching metadata';
    const emitProgress = (data) => {
      if (clientId && downloadId) {
        io.to(clientId).emit('progress', { downloadId, ...data });
      }
    };

    ytDlpProcess.stdout.on('data', (data) => {
      const output = data.toString();
      
      if (output.includes('[youtube]') || output.includes('[info]')) {
        currentStage = 'Fetching metadata';
      } else if (output.includes('[download] Destination:')) {
        if (output.includes('.m4a') || output.includes('.webm') || output.includes('.mp3')) {
          currentStage = 'Downloading audio';
        } else {
          currentStage = 'Downloading video';
        }
      } else if (output.includes('[Merger]')) {
        currentStage = 'Merging streams';
      } else if (output.includes('[ExtractAudio]')) {
        currentStage = 'Extracting audio';
      } else if (output.includes('[FixupM4a]')) {
        currentStage = 'Finalizing';
      }

      // Match progress output: [download]  45.5% of 10.50MiB at 1.25MiB/s ETA 00:04
      const progressMatch = output.match(/\[download\]\s+(?<percent>[\d.]+)%\s+of\s+(~?)(?<size>[\d.]+[KMG]?iB)(?:\s+at\s+(?<speed>[\d.]+[KMG]?iB\/s))?(?:\s+ETA\s+(?<eta>[\d:]+))?/);
      
      if (progressMatch && progressMatch.groups) {
        emitProgress({
          percentage: parseFloat(progressMatch.groups.percent),
          size: progressMatch.groups.size,
          speed: progressMatch.groups.speed || 'Unknown',
          eta: progressMatch.groups.eta || 'Unknown',
          stage: currentStage
        });
      } else {
        emitProgress({ stage: currentStage });
      }
    });

    ytDlpProcess.on('error', (err) => {
      console.error('yt-dlp error:', err);
    });

    await ytDlpProcess;
    
    if (clientId && downloadId) {
      io.to(clientId).emit('completed', { downloadId });
    }

    if (!fs.existsSync(tempFilePath)) {
      throw new Error('Downloaded file not found');
    }
    
    await new Promise((resolve, reject) => {
      res.download(tempFilePath, `${safeTitle}.${extension}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  } catch (error) {
    console.error('Download error:', error.message);
    if (clientId && downloadId) {
      io.to(clientId).emit('error', { downloadId, message: 'Failed to download media' });
    }
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download media' });
    }
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.error('Error deleting temp file in finally block:', e);
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
