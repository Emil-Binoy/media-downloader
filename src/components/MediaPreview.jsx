import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Download, Clock, User, Film, Music, CheckCircle2, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import ProgressBar from './ProgressBar';
import socket from '../services/socket';

const formatDuration = (seconds) => {
  if (!seconds) return 'Unknown';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const MediaPreview = ({ mediaInfo, onDownload }) => {
  const [activeTab, setActiveTab] = useState('video'); // 'video', 'audio', 'image'
  const [activeDownloads, setActiveDownloads] = useState({});

  useEffect(() => {
    const handleProgress = (data) => {
      setActiveDownloads(prev => ({
        ...prev,
        [data.downloadId]: { ...prev[data.downloadId], progress: data }
      }));
    };

    const handleCompleted = (data) => {
      setActiveDownloads(prev => ({
        ...prev,
        [data.downloadId]: { ...prev[data.downloadId], completed: true }
      }));
      setTimeout(() => {
        setActiveDownloads(prev => {
          const next = { ...prev };
          delete next[data.downloadId];
          return next;
        });
      }, 5000);
    };

    const handleError = (data) => {
      setActiveDownloads(prev => ({
        ...prev,
        [data.downloadId]: { ...prev[data.downloadId], error: data.message }
      }));
    };

    socket.on('progress', handleProgress);
    socket.on('completed', handleCompleted);
    socket.on('error', handleError);

    return () => {
      socket.off('progress', handleProgress);
      socket.off('completed', handleCompleted);
      socket.off('error', handleError);
    };
  }, []);

  if (!mediaInfo) return null;

  const { title, thumbnail, platform, creator, duration } = mediaInfo;

  const handleDownloadClick = async (type, quality) => {
    const downloadId = Math.random().toString(36).substring(2, 15);
    const clientId = socket.id;
    
    setActiveDownloads(prev => ({
      ...prev,
      [downloadId]: { type, quality, progress: { stage: 'Starting...' } }
    }));

    try {
      await onDownload(type, quality, clientId, downloadId);
    } catch (error) {
      console.error(error);
      setActiveDownloads(prev => ({
        ...prev,
        [downloadId]: { ...prev[downloadId], error: typeof error === 'string' ? error : 'Failed to start download' }
      }));
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
      className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 mb-8 sm:mb-12 glass-card overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Media Thumbnail Area */}
        <div className="md:w-2/5 relative">
          <img 
            src={thumbnail || 'https://via.placeholder.com/640x360.png?text=No+Thumbnail'} 
            alt={title} 
            className="w-full h-full object-cover min-h-[180px] sm:min-h-[240px] md:min-h-full"
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
        <div className="md:w-3/5 p-4 sm:p-6 md:p-8 flex flex-col">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2" title={title}>
            {title || 'Unknown Title'}
          </h2>
          
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-white/10">
            <User size={14} className="sm:w-4 sm:h-4" />
            <span className="truncate">{creator || 'Unknown Creator'}</span>
          </div>

          {/* Download Tabs */}
          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('video')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Film size={14} className="sm:w-4 sm:h-4" /> <span className="hidden xs:inline sm:inline">Video</span>
            </button>
            <button 
              onClick={() => setActiveTab('audio')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activeTab === 'audio' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Music size={14} className="sm:w-4 sm:h-4" /> <span className="hidden xs:inline sm:inline">Audio</span>
            </button>
            <button 
              onClick={() => setActiveTab('image')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activeTab === 'image' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <ImageIcon size={14} className="sm:w-4 sm:h-4" /> <span className="hidden xs:inline sm:inline">Image</span>
            </button>
          </div>

          {/* Download Options */}
          <div className="flex-grow space-y-3">
            {activeTab === 'video' && videoOptions.map((opt) => (
              <button 
                key={opt.quality}
                onClick={() => handleDownloadClick('video', opt.quality)}
                className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Film size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white text-sm sm:text-base">MP4 • {opt.label}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400">Standard Quality</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <Download size={18} className="sm:w-5 sm:h-5" />
                </div>
              </button>
            ))}

            {activeTab === 'audio' && audioOptions.map((opt) => (
              <button 
                key={opt.quality}
                onClick={() => handleDownloadClick('audio', opt.quality)}
                className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Music size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white text-sm sm:text-base">{opt.label}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400">High Quality Audio</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <Download size={18} className="sm:w-5 sm:h-5" />
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
                  className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                >
                  Download Images
                </button>
              </div>
            )}
          </div>

          {/* Active Downloads List */}
          <div className="mt-4 space-y-4">
            <AnimatePresence>
              {Object.entries(activeDownloads).map(([id, download]) => (
                <ProgressBar 
                  key={id}
                  progress={download.progress}
                  error={download.error}
                  completed={download.completed}
                  onDismiss={() => {
                    setActiveDownloads(prev => {
                      const next = { ...prev };
                      delete next[id];
                      return next;
                    });
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaPreview;
