import { motion } from 'framer-motion';
import { DownloadCloud } from 'lucide-react';

const Downloads = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 sm:py-12"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Downloads</h1>
      
      <div className="glass-card p-6 sm:p-12 text-center flex flex-col items-center mx-4 sm:mx-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
          <DownloadCloud size={28} className="sm:w-8 sm:h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-medium text-white mb-2">No downloads yet</h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-md">
          Media you download will appear in your device's default downloads folder. 
          History tracking feature is coming soon.
        </p>
      </div>
    </motion.div>
  );
};

export default Downloads;
