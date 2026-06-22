import { Link, useLocation } from 'react-router-dom';
import { DownloadCloud, Home, Settings, Menu, X, Layout, Smartphone, HelpCircle, Star, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Features', path: '/features', icon: <Star size={18} /> },
    { name: 'Platforms', path: '/platforms', icon: <Smartphone size={18} /> },
    { name: 'How It Works', path: '/how-it-works', icon: <Layout size={18} /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle size={18} /> },
  ];

  const actionLinks = [
    { name: 'Downloads', path: '/downloads', icon: <Download size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  const allLinks = [...navLinks, ...actionLinks];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-black/50 border-b border-white/10 shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full group-hover:bg-primary/50 transition-colors duration-300"></div>
              <img
                src="/logo.png"
                alt="Fetchly"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-white font-sans hidden sm:block">
              Fetchly
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <div className="flex items-center bg-white/5 rounded-full px-2 py-1.5 border border-white/10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors z-10 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary/20 rounded-full -z-10 border border-primary/30"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-white/10 ml-4">
              {actionLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`p-2.5 rounded-full transition-all duration-300 ${isActive
                        ? 'bg-primary text-white shadow-[0_0_15px_rgba(170,59,255,0.4)]'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    title={link.name}
                  >
                    {link.icon}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-dark border-b border-white/10 backdrop-blur-xl absolute left-0 w-full shadow-2xl shadow-black/50"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {allLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                          ? 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <div className={`${isActive ? 'text-primary' : 'text-gray-500'}`}>
                        {link.icon}
                      </div>
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
