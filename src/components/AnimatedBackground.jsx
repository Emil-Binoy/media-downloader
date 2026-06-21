import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-dark">
      {/* Primary Purple Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: ['-5%', '5%', '-5%'],
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/20 blur-[120px]"
      />
      
      {/* Secondary Blue Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: ['5%', '-5%', '5%'],
          y: ['5%', '-5%', '5%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-secondary/15 blur-[120px]"
      />
      
      {/* Deep Dark Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-dark/40 mix-blend-overlay"></div>
    </div>
  );
};

export default AnimatedBackground;
