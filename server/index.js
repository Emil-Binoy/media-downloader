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
const { instagramGetUrl } = require('instagram-url-direct');

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

// Set up cookies for YouTube bot bypass
const cookiesPath = path.join(__dirname, 'cookies.txt');
if (process.env.YOUTUBE_COOKIES) {
  // Replace literal '\n' with actual newlines in case the platform escapes them
  const cookiesContent = process.env.YOUTUBE_COOKIES.replace(/\\n/g, '\n');
  fs.writeFileSync(cookiesPath, cookiesContent);
  console.log('Loaded YouTube cookies from environment variable');
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
    const options = {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      forceIpv4: true,
      extractorArgs: 'youtube:player_client=ios,android'
    };
    if (fs.existsSync(cookiesPath)) options.cookies = cookiesPath;

    let title, thumbnail, extractor, uploader, duration;

    try {
      const info = await ytdlp(url, options);
      ({ title, thumbnail, extractor, uploader, duration } = info);
    } catch (ytdlpError) {
      if (url.includes('instagram.com')) {
        const igData = await instagramGetUrl(url);
        if (igData && igData.url_list && igData.url_list.length > 0) {
          title = igData.post_info?.caption ? igData.post_info.caption.substring(0, 50) : 'Instagram Post';
          thumbnail = igData.url_list[0];
          extractor = 'instagram';
          uploader = igData.post_info?.owner_username || 'Instagram User';
          duration = null;
        } else {
          throw ytdlpError;
        }
      } else {
        throw ytdlpError;
      }
    }
    
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

// GET /api/proxy-image
app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const buffer = await response.arrayBuffer();
    
    res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error proxying image:', error.message);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// POST /api/download
app.post('/api/download', async (req, res) => {
  const { url, type, quality, clientId, downloadId } = req.body;
  if (!url || !type) return res.status(400).json({ error: 'URL and type are required' });
  
  const tempId = crypto.randomBytes(16).toString('hex');
  let tempFilePath = '';
  
  try {
    let titleInfo = {};
    
    try {
      titleInfo = await ytdlp(url, { dumpJson: true });
    } catch (err) {
      if (url.includes('instagram.com')) {
        const igData = await instagramGetUrl(url);
        if (igData && igData.url_list && igData.url_list.length > 0) {
          titleInfo = {
            title: igData.post_info?.caption ? igData.post_info.caption.substring(0, 50) : 'Instagram Post',
            thumbnail: igData.url_list[0],
            url: igData.url_list[0]
          };
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
    
    const safeTitle = (titleInfo.title || 'media_download').replace(/[^a-z0-9]/gi, '_');
    
    let options = {
      noCheckCertificate: true,
      noWarnings: true,
      ffmpegLocation: ffmpegPath,
      forceIpv4: true,
      extractorArgs: 'youtube:player_client=ios,android'
    };
    if (fs.existsSync(cookiesPath)) options.cookies = cookiesPath;
    
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
      if (url.includes('instagram.com')) {
        options.format = 'best';
      } else if (quality === '360') {
        options.format = 'bestvideo[vcodec^=avc][height<=360]+bestaudio[acodec^=mp4a]/bestvideo[height<=360]+bestaudio/best[height<=360]';
      } else if (quality === '720') {
        options.format = 'bestvideo[vcodec^=avc][height<=720]+bestaudio[acodec^=mp4a]/bestvideo[height<=720]+bestaudio/best[height<=720]';
      } else if (quality === '1080') {
        options.format = 'bestvideo[vcodec^=avc][height<=1080]+bestaudio[acodec^=mp4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]';
      } else {
        options.format = 'bestvideo[vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo+bestaudio/best';
      }
      options.mergeOutputFormat = 'mp4';
    } else if (type === 'image') {
      extension = 'jpg';
      const imageUrl = titleInfo.thumbnail || titleInfo.url;
      if (!imageUrl) throw new Error('Could not find image URL');
      
      tempFilePath = path.join(tempDir, `${tempId}.${extension}`);
      
      const emitProgress = (data) => {
        if (clientId && downloadId) {
          io.to(clientId).emit('progress', { downloadId, ...data });
        }
      };
      
      emitProgress({ stage: 'Downloading image', percentage: 50 });
      
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
      
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(tempFilePath, Buffer.from(buffer));
      
      emitProgress({ stage: 'Finalizing', percentage: 100 });
      
      if (clientId && downloadId) {
        io.to(clientId).emit('completed', { downloadId });
      }

      await new Promise((resolve, reject) => {
        res.download(tempFilePath, `${safeTitle}.${extension}`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      return; // Early return for image downloads
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
