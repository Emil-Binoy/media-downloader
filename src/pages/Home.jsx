import { useState } from 'react';
import Hero from '../components/Hero';
import UrlInput from '../components/UrlInput';
import MediaPreview from '../components/MediaPreview';
import { getMediaInfo, downloadMedia } from '../services/api';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [mediaInfo, setMediaInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  const handleFetchInfo = async (url) => {
    setIsLoadingInfo(true);
    setError('');
    setMediaInfo(null);
    setCurrentUrl(url);

    try {
      const info = await getMediaInfo(url);
      setMediaInfo(info);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to retrieve media information. The link might be private or unsupported.');
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleDownload = async (type, quality) => {
    setIsDownloading(true);
    setError('');
    try {
      await downloadMedia(currentUrl, type, quality);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to download media.');
      throw err; // Re-throw for the component to handle UI states
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Hero />
      <UrlInput onFetchInfo={handleFetchInfo} isLoading={isLoadingInfo} />
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 max-w-2xl w-full"
        >
          <AlertCircle size={20} />
          <p>{error}</p>
        </motion.div>
      )}

      {mediaInfo && (
        <MediaPreview 
          mediaInfo={mediaInfo} 
          onDownload={handleDownload} 
          isDownloading={isDownloading} 
        />
      )}
    </div>
  );
};

export default Home;
