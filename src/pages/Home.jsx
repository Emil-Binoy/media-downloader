import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import UrlInput from '../components/UrlInput';
import MediaPreview from '../components/MediaPreview';
import { getMediaInfo, downloadMedia } from '../services/api';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [mediaInfo, setMediaInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [error, setError] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  
  const urlInputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleDownload = async (type, quality, clientId, downloadId, mediaIndex) => {
    setError('');
    try {
      await downloadMedia(currentUrl, type, quality, clientId, downloadId, mediaIndex);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to download media.');
      throw err; // Re-throw for the component to handle UI states
    }
  };

  const scrollToInput = () => {
    const el = document.getElementById('url-input');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // Give time for scroll to finish before focusing to avoid snapping
    setTimeout(() => {
      urlInputRef.current?.focus();
    }, 400);
  };

  const navigateToHowItWorks = () => {
    navigate('/how-it-works');
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[70vh]">
      <Hero onStartDownload={scrollToInput} onHowItWorks={navigateToHowItWorks} />
      
      <div className="w-full z-20 relative">
        <UrlInput ref={urlInputRef} onFetchInfo={handleFetchInfo} isLoading={isLoadingInfo} />
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 max-w-2xl w-full z-20 relative"
        >
          <AlertCircle size={20} />
          <p>{error}</p>
        </motion.div>
      )}

      {mediaInfo && (
        <div className="w-full z-20 relative">
          <MediaPreview 
            mediaInfo={mediaInfo} 
            onDownload={handleDownload} 
          />
        </div>
      )}
    </div>
  );
};

export default Home;
