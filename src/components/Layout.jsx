import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
      <footer className="py-8 mt-auto relative z-10 border-t border-white/10 bg-dark/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <img src="/logo.png" alt="Fetchly Logo" className="w-5 h-5 object-contain" />
            <span className="font-bold text-lg tracking-tight text-white font-sans">Fetchly</span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Fetchly. Premium media downloading.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
