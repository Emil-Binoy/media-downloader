import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-white/10 mt-auto">
        &copy; {new Date().getFullYear()} Universal Media Downloader. Built for premium experience.
      </footer>
    </div>
  );
};

export default Layout;
