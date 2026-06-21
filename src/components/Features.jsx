import { motion } from 'framer-motion';
import { Video, Music, Image as ImageIcon, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'HD Video Downloads',
      description: 'Download videos in the highest available quality, up to 1080p, without any watermarks.',
      icon: <Video size={24} className="text-purple-400" />
    },
    {
      title: 'MP3 Conversion',
      description: 'Extract and convert audio from any video to high-quality 320kbps MP3 format instantly.',
      icon: <Music size={24} className="text-blue-400" />
    },
    {
      title: 'Image Downloads',
      description: 'Save original quality images, carousels, and thumbnails from posts and profiles.',
      icon: <ImageIcon size={24} className="text-pink-400" />
    },
    {
      title: 'Fast Processing',
      description: 'Powered by advanced extraction tools for lightning-fast media parsing and download speeds.',
      icon: <Zap size={24} className="text-yellow-400" />
    }
  ];

  return (
    <div id="features" className="py-16 sm:py-24 w-full max-w-6xl mx-auto px-4 scroll-mt-20">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Premium Features</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to save your favorite media offline, built right into the browser.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card p-6 sm:p-8 hover:bg-white/10 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
