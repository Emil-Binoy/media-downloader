import { motion } from 'framer-motion';
import { ArrowDownCircle, Info } from 'lucide-react';

const Hero = ({ onStartDownload, onHowItWorks }) => {
  return (
    <div className="flex flex-col items-center text-center pt-12 pb-6 sm:pt-16 sm:pb-8 md:pt-24 md:pb-10 px-4 relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6"
      >
        Download Videos, Posts, Images & Audio{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          From Anywhere
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-8 px-2 sm:px-0"
      >
        Fast and simple media downloading from multiple platforms with support for HD video and high-quality MP3 conversion.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none"
      >
        <button 
          onClick={onStartDownload}
          className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto rounded-full bg-gradient-primary text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base"
        >
          <ArrowDownCircle size={20} />
          Start Downloading
        </button>
        <button 
          onClick={onHowItWorks}
          className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto rounded-full glass-button text-white font-semibold text-sm sm:text-base"
        >
          <Info size={20} />
          How It Works
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
