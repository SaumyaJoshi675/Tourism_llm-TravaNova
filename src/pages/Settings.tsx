import { motion } from 'motion/react';
import { Sun, Moon, Sparkles, Globe, Bell, Shield, User, Palette, Keyboard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { toast } from 'sonner@2.0.3';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Customize your experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <GlassCard hover={false}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Theme</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose your preferred theme
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme('light')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Sun className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                <p className="text-sm">Light</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme('dark')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Moon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <p className="text-sm">Dark</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme('glass')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  theme === 'glass'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                <p className="text-sm">Glass</p>
              </motion.button>
            </div>
          </div>
        </GlassCard>

        {/* Language Settings */}
        <GlassCard hover={false}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Language</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Select your preferred language
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === 'en'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <p className="text-lg mb-1">🇬🇧 English</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Default language</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage('hi')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === 'hi'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <p className="text-lg mb-1">🇮🇳 हिंदी</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Hindi language</p>
              </motion.button>
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard hover={false}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Notifications</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage your notification preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="mb-1">Event Reminders</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get notified about upcoming events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="mb-1">Travel Tips</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receive helpful travel tips
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="mb-1">New Features</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Updates about new features
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Privacy & Security */}
        <GlassCard hover={false}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Privacy & Security</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage your data and security settings
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span>Manage Account</span>
                </div>
                <span className="text-slate-400">→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span>Privacy Policy</span>
                </div>
                <span className="text-slate-400">→</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="secondary">Reset to Default</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}