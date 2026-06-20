require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express();
const PORT = process.env.PORT || 5000;

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
      noCallHome: true,
      noCheckCertificate: true,
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
  const { url, type, quality } = req.body;
  if (!url || !type) return res.status(400).json({ error: 'URL and type are required' });
  
  try {
    const titleInfo = await ytdlp(url, { dumpJson: true });
    const safeTitle = (titleInfo.title || 'media_download').replace(/[^a-z0-9]/gi, '_');
    
    let options = {
      noCheckCertificate: true,
      noWarnings: true,
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
        options.format = 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]';
      } else if (quality === '720') {
        options.format = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]';
      } else if (quality === '1080') {
        options.format = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]';
      } else {
        options.format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
      }
      options.mergeOutputFormat = 'mp4';
    } else {
      return res.status(400).json({ error: 'Invalid media type' });
    }
    
    res.header('Content-Disposition', `attachment; filename="${safeTitle}.${extension}"`);
    res.header('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');
    
    // For direct streaming, pipe the output
    // Note: yt-dlp needs stdout for data when `-o -` is used
    options.output = '-'; 
    
    const stream = ytdlp.exec(url, options, { stdio: ['ignore', 'pipe', 'ignore'] });
    
    stream.stdout.pipe(res);
    
    stream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) res.status(500).json({ error: 'Download failed' });
    });

  } catch (error) {
    console.error('Download error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to initialize download' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
