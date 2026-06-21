import { motion } from 'framer-motion';
import { Link as LinkIcon, ClipboardPaste, Settings2, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { id: 1, title: 'Copy Link', description: 'Copy the media link from your favorite app.', icon: <LinkIcon size={24} /> },
    { id: 2, title: 'Paste URL', description: 'Paste the copied link into the search bar.', icon: <ClipboardPaste size={24} /> },
    { id: 3, title: 'Choose Quality', description: 'Select your preferred video or audio format.', icon: <Settings2 size={24} /> },
    { id: 4, title: 'Download', description: 'Save the media directly to your device.', icon: <Download size={24} /> },
  ];

  return (
    <div id="how-it-works" className="py-16 sm:py-24 w-full max-w-6xl mx-auto px-4 scroll-mt-20">
      <div className="text-center mb-16 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Four simple steps to download media from anywhere.</p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-y-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-primary shadow-[0_0_30px_-5px_rgba(170,59,255,0.3)] mb-6 bg-[#09090b]">
                {step.icon}
              </div>
              <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full absolute top-12 border-[3px] border-[#09090b]">
                Step {step.id}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 mt-2">{step.title}</h3>
              <p className="text-gray-400 text-sm max-w-[200px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
