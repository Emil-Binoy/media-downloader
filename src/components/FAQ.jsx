import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors focus:outline-none"
      >
        <span className="font-semibold text-white pr-4">{question}</span>
        <ChevronDown 
          className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-4 pt-2 text-gray-400 border-t border-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: 'Is this service completely free?',
      answer: 'Yes, downloading media via Universal Media Downloader is completely free. We do not charge for premium qualities or mp3 conversion.'
    },
    {
      question: 'Are there any limits on download size or length?',
      answer: 'Currently, there are no hard limits, but extremely large videos (over a few gigabytes) may take longer to process and download depending on your connection.'
    },
    {
      question: 'Do I need to install any software?',
      answer: 'No! Everything runs directly in your browser. Just paste the link and download.'
    },
    {
      question: 'Why did my download fail?',
      answer: 'Some links might be private or from unsupported platforms. If a video is age-restricted or requires a login, the downloader might not be able to access it.'
    }
  ];

  return (
    <div id="faq" className="py-16 sm:py-24 w-full max-w-4xl mx-auto px-4 scroll-mt-20 z-10 relative">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to know about the downloader.</p>
      </div>

      <div className="flex flex-col">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <FAQItem question={faq.question} answer={faq.answer} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
