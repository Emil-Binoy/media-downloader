import { Link, useLocation } from 'react-router-dom';
import { DownloadCloud, Home, Settings, Menu, X, Layout, Smartphone, HelpCircle, Star, Download } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Features', path: '/features', icon: <Star size={18} /> },
    { name: 'Platforms', path: '/platforms', icon: <Smartphone size={18} /> },
    { name: 'How It Works', path: '/how-it-works', icon: <Layout size={18} /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle size={18} /> },
    { name: 'Downloads', path: '/downloads', icon: <Download size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-dark/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
            onClick={() => setIsOpen(false)}
          >
            <img 
              src="/logo.png" 
              alt="Fetchly" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(170,59,255,0.5)]"
            />
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-white font-sans">
              Fetchly
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors z-10 ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-white/10 rounded-md -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark/95 border-b border-white/10 backdrop-blur-sm absolute left-0 w-full shadow-2xl shadow-black/50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 p-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
