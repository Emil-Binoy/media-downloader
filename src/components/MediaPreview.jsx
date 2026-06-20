import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, Download, Clock, User, Film, Music, CheckCircle2, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const formatDuration = (seconds) => {
  if (!seconds) return 'Unknown';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const MediaPreview = ({ mediaInfo, onDownload, isDownloading }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('video'); // 'video', 'audio', 'image'

  if (!mediaInfo) return null;

  const { title, thumbnail, platform, creator, duration } = mediaInfo;

  const handleDownloadClick = async (type, quality) => {
    try {
      await onDownload(type, quality);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const videoOptions = [
    { label: '1080p', quality: '1080' },
    { label: '720p', quality: '720' },
    { label: '360p', quality: '360' },
  ];

  const audioOptions = [
    { label: '320kbps MP3', quality: '320' },
    { label: '128kbps MP3', quality: '128' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-12 mb-12 glass-card overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Media Thumbnail Area */}
        <div className="md:w-2/5 relative">
          <img 
            src={thumbnail || 'https://via.placeholder.com/640x360.png?text=No+Thumbnail'} 
            alt={title} 
            className="w-full h-full object-cover min-h-[240px] md:min-h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md uppercase font-semibold tracking-wider">
                {platform || 'Media'}
              </span>
              {duration && (
                <span className="bg-dark/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock size={12} />
                  {formatDuration(duration)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info & Download Area */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2" title={title}>
            {title || 'Unknown Title'}
          </h2>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 pb-6 border-b border-white/10">
            <User size={16} />
            <span>{creator || 'Unknown Creator'}</span>
          </div>

          {/* Download Tabs */}
          <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Film size={16} /> Video
            </button>
            <button 
              onClick={() => setActiveTab('audio')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'audio' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Music size={16} /> Audio
            </button>
            <button 
              onClick={() => setActiveTab('image')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'image' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <ImageIcon size={16} /> Image
            </button>
          </div>

          {/* Download Options */}
          <div className="flex-grow space-y-3">
            {activeTab === 'video' && videoOptions.map((opt) => (
              <button 
                key={opt.quality}
                onClick={() => handleDownloadClick('video', opt.quality)}
                disabled={isDownloading}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Film size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">MP4 • {opt.label}</div>
                    <div className="text-xs text-gray-400">Standard Quality</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <Download size={20} />
                </div>
              </button>
            ))}

            {activeTab === 'audio' && audioOptions.map((opt) => (
              <button 
                key={opt.quality}
                onClick={() => handleDownloadClick('audio', opt.quality)}
                disabled={isDownloading}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Music size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{opt.label}</div>
                    <div className="text-xs text-gray-400">High Quality Audio</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <Download size={20} />
                </div>
              </button>
            ))}

            {activeTab === 'image' && (
              <div className="text-center p-6 text-gray-400 border border-dashed border-white/10 rounded-xl">
                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                <p>Image downloading depends on the platform.</p>
                <p className="text-sm mt-1">If the link is a post with images, click below.</p>
                <button 
                  onClick={() => handleDownloadClick('image', 'best')}
                  disabled={isDownloading}
                  className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                >
                  Download Images
                </button>
              </div>
            )}
          </div>

          {/* Status Overlay */}
          {isDownloading && (
            <div className="mt-4 p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center gap-3 text-blue-200">
              <Loader2 size={20} className="animate-spin" />
              <span>Processing and downloading... Please wait.</span>
            </div>
          )}

          {downloadSuccess && (
            <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center gap-3 text-green-400">
              <CheckCircle2 size={20} />
              <span>Download initiated successfully!</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MediaPreview;
