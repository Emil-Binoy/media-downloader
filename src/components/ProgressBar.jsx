import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, HardDrive, Clock, Activity } from 'lucide-react';

const ProgressBar = ({ progress, error, completed, onDismiss }) => {
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-between text-red-400 overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <button onClick={onDismiss} className="text-red-400 hover:text-red-300 text-sm font-medium px-2 py-1 bg-red-500/10 rounded-lg">Dismiss</button>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3 text-green-400 overflow-hidden"
      >
        <CheckCircle2 size={20} />
        <span>Download completed successfully!</span>
      </motion.div>
    );
  }

  const { percentage, speed, size, eta, stage } = progress || {};

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-white font-medium">
          <Loader2 size={16} className="animate-spin text-primary" />
          <span>{stage || 'Initializing...'}</span>
        </div>
        {percentage !== undefined && (
          <span className="text-primary font-bold">{percentage.toFixed(1)}%</span>
        )}
      </div>

      <div className="h-2 w-full bg-dark/50 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage || 0}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        />
      </div>

      {percentage !== undefined && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Activity size={14} className="text-secondary" />
            <span>{speed || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive size={14} className="text-white/60" />
            <span>{size || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Clock size={14} className="text-white/60" />
            <span>ETA: {eta || 'Unknown'}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressBar;
