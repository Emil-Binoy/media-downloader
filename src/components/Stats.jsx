import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Stats = () => {
  const stats = [
    { label: 'Downloads', value: 1000, suffix: '+' },
    { label: 'Platforms Supported', value: 7, suffix: '+' },
    { label: 'HD Support', value: 1080, suffix: 'p' },
    { label: 'MP3 Conversion', value: 100, suffix: '%' },
  ];

  return (
    <div className="py-12 sm:py-16 w-full max-w-5xl mx-auto px-4 z-10 relative">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-gray-400 text-sm sm:text-base font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
