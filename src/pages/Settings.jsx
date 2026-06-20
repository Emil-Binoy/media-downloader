import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Bell } from 'lucide-react';

const Settings = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon size={28} className="text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-white/10 pb-2">Appearance</h2>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-white">Theme</div>
              <div className="text-sm text-gray-400">Choose your preferred visual style</div>
            </div>
            <div className="flex bg-white/5 rounded-lg p-1">
              <button className="px-4 py-2 rounded-md bg-white/10 text-white flex items-center gap-2 text-sm font-medium">
                <Moon size={16} /> Dark
              </button>
              <button className="px-4 py-2 rounded-md text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium disabled:opacity-50">
                <Sun size={16} /> Light (Soon)
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-white/10 pb-2">Preferences</h2>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-white">Notifications</div>
              <div className="text-sm text-gray-400">Show desktop notifications when downloads finish</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
