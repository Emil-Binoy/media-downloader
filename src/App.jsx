import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Downloads from './pages/Downloads';
import Settings from './pages/Settings';
import FeaturesPage from './pages/FeaturesPage';
import PlatformsPage from './pages/PlatformsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/platforms" element={<PlatformsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
