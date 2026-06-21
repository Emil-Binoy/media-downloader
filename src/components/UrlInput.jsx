import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

const UrlInput = ({ onFetchInfo, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://youtube.com/...)');
      return;
    }

    onFetchInfo(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
        <div className="relative flex items-center glass-card p-1.5 sm:p-2 rounded-2xl focus-within:border-purple-500/50 transition-colors">
          <div className="pl-3 sm:pl-4 pr-1 sm:pr-2 text-gray-400 hidden sm:block">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a link here..."
            className="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-500 text-base sm:text-lg py-3 sm:py-4 px-3 sm:px-2 w-full"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-white text-dark px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-70 flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
                <span className="hidden xs:inline sm:inline">Processing</span>
              </>
            ) : (
              'Fetch Link'
            )}
          </button>
        </div>
      </form>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm mt-3 ml-4"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default UrlInput;
