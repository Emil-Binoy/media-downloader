import { motion } from 'framer-motion';
import { ArrowDownCircle, Info } from 'lucide-react';

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center py-16 md:py-24 relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
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
        className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
      >
        Fast and simple media downloading from multiple platforms with support for HD video and high-quality MP3 conversion.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-primary text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all">
          <ArrowDownCircle size={20} />
          Start Downloading
        </button>
        <button className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-button text-white font-semibold">
          <Info size={20} />
          How It Works
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
