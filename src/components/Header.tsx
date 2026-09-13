import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellOff, Settings, Globe, Moon, Sun, ChevronDown } from 'lucide-react';
import { SoundType, SupportedLanguage, AppTheme } from '../types';
import { soundSynthesizer } from '../utils/sound';
import { LANGUAGES, getTranslation } from '../i18n/translations';

interface HeaderProps {
  onOpenSettings: () => void;
  isAlarmRinging: boolean;
  onStopAlarm: () => void;
  soundType: SoundType;
  volume: number;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  isAlarmRinging,
  onStopAlarm,
  soundType,
  volume,
  language,
  onChangeLanguage,
  theme,
  onToggleTheme,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => getTranslation(language, key);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTestBell = () => {
    soundSynthesizer.playSingleChime(soundType, volume);
  };

  const currentLangMeta = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <header className="w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 text-xl select-none">
            🌲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-stone-900 dark:text-stone-100 text-base sm:text-lg tracking-tight">
                {t('appTitle')}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {t('proBadge')}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Alarm Stop Button in Header if Ringing */}
          {isAlarmRinging && (
            <button
              id="btn-header-stop-alarm"
              type="button"
              onClick={onStopAlarm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <BellOff className="w-4 h-4 animate-bell-ring" />
              <span>{t('stopBell')}</span>
            </button>
          )}

          {/* Quick Bell Preview Button */}
          <button
            id="btn-quick-sound-test"
            type="button"
            onClick={handleTestBell}
            title={t('testBell')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">
              {t('testBell')}
            </span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            id="btn-header-theme-toggle"
            type="button"
            onClick={onToggleTheme}
            title={t('themeToggle')}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* Multi-Language Dropdown Menu */}
          <div className="relative" ref={langDropdownRef}>
            <button
              id="btn-language-selector"
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Change Language / تغيير اللغة"
            >
              <span className="text-sm">{currentLangMeta.flag}</span>
              <span className="text-[11px] font-medium hidden sm:inline">{currentLangMeta.nativeName}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langMenuOpen && (
              <div
                id="language-dropdown-menu"
                className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 border-b border-stone-100 dark:border-stone-700">
                  {t('tabLanguage')}
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                  {LANGUAGES.map(langItem => (
                    <button
                      key={langItem.code}
                      type="button"
                      onClick={() => {
                        onChangeLanguage(langItem.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left rtl:text-right transition-colors cursor-pointer ${
                        language === langItem.code
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{langItem.flag}</span>
                        <span>{langItem.nativeName}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 uppercase font-mono">
                        {langItem.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            id="btn-open-settings"
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={t('settings')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
