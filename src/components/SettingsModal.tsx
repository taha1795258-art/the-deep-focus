import React, { useState } from 'react';
import {
  X,
  Volume2,
  Bell,
  Clock,
  Check,
  Play,
  Moon,
  Sun,
  Laptop,
  Type,
  Sparkles,
  Globe,
  Database,
  Vibrate,
  ShieldAlert,
  Flame,
  Download,
  Trash2,
} from 'lucide-react';
import { AppSettings, SoundType, SupportedLanguage, AppTheme, FontFamilyPreference } from '../types';
import { SOUND_OPTIONS, TREE_TYPES } from '../data/trees';
import { soundSynthesizer } from '../utils/sound';
import { LANGUAGES, getTranslation } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  language: SupportedLanguage;
  onResetData?: () => void;
  onExportData?: () => void;
}

type SettingsTab = 'sound' | 'timer' | 'appearance' | 'language' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  language,
  onResetData,
  onExportData,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<SettingsTab>('sound');
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const t = (key: string) => getTranslation(localSettings.language || language, key);

  const handleSoundTest = (soundType: SoundType) => {
    setIsPlayingPreview(true);
    soundSynthesizer.playSingleChime(soundType, localSettings.volume);
    setTimeout(() => setIsPlayingPreview(false), 2200);
  };

  const handleTestTick = () => {
    soundSynthesizer.playTickSound(localSettings.volume);
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'sound', label: t('tabSound'), icon: <Bell className="w-4 h-4" /> },
    { id: 'timer', label: t('tabTimer'), icon: <Clock className="w-4 h-4" /> },
    { id: 'appearance', label: t('tabAppearance'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'language', label: t('tabLanguage'), icon: <Globe className="w-4 h-4" /> },
    { id: 'data', label: t('tabData'), icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="settings-modal-card"
        className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80">
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">
              {t('settingsTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('appSubtitle')}
            </p>
          </div>
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-stone-100/70 dark:bg-stone-800/60 border-b border-stone-200/60 dark:border-stone-700/60 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body with Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Sound & Bell */}
          {activeTab === 'sound' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Bell Sounds Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                    <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('bellSoundType')}</span>
                  </label>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {SOUND_OPTIONS.length} {t('seconds')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SOUND_OPTIONS.map(sound => {
                    const isSelected = localSettings.soundType === sound.id;
                    return (
                      <div
                        key={sound.id}
                        onClick={() => setLocalSettings(prev => ({ ...prev, soundType: sound.id }))}
                        className={`relative p-3 rounded-2xl border transition-all cursor-pointer text-start ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-600/30'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1">
                              {localSettings.language === 'ar' ? sound.nameAr : sound.nameEn}
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                              {localSettings.language === 'ar' ? sound.descriptionAr : sound.descriptionEn}
                            </p>
                          </div>

                          {/* Preview Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSoundTest(sound.id);
                            }}
                            title={t('testBell')}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 dark:bg-stone-800 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors shrink-0 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-stone-900 dark:text-stone-100">
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('bellVolume')}</span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {localSettings.volume}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="range-volume-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={localSettings.volume}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, volume: Number(e.target.value) }))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleSoundTest(localSettings.soundType)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    {t('testBell')}
                  </button>
                </div>
              </div>

              {/* Continuous Alarm Toggle */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t('continuousAlarmLabel')}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {t('continuousAlarmDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.continuousAlarm}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, continuousAlarm: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Repeat interval */}
                {localSettings.continuousAlarm && (
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
                    <span className="text-stone-700 dark:text-stone-300">
                      {t('ringIntervalLabel')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[2, 3, 5].map(sec => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setLocalSettings(prev => ({ ...prev, ringInterval: sec }))}
                          className={`px-2.5 py-1 rounded-lg font-mono font-bold cursor-pointer transition-colors ${
                            localSettings.ringInterval === sec
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {sec} {t('seconds')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ticking Clock Sound Toggle */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-2 rtl:pr-0 rtl:pl-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t('tickingSoundLabel')}
                    </p>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {t('tickingSoundDesc')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestTick}
                    className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200 cursor-pointer"
                    title="Test tick sound"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.tickingSound}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, tickingSound: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Vibration Toggle */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Vibrate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t('vibrationLabel')}
                    </p>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {t('vibrationDesc')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.vibrateOnComplete}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, vibrateOnComplete: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Timer & Flow */}
          {activeTab === 'timer' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Durations */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('focusDurationLabel')}</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-center">
                    <label className="text-xs text-stone-600 dark:text-stone-400 block mb-1">
                      {t('modeFocus')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={localSettings.focusDuration}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, focusDuration: Math.max(1, Number(e.target.value)) }))}
                      className="w-full px-2 py-1.5 text-center rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono font-bold text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">{t('statMinutes')}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-center">
                    <label className="text-xs text-stone-600 dark:text-stone-400 block mb-1">
                      {t('modeShortBreak')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={localSettings.shortBreakDuration}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, shortBreakDuration: Math.max(1, Number(e.target.value)) }))}
                      className="w-full px-2 py-1.5 text-center rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono font-bold text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">{t('statMinutes')}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-center">
                    <label className="text-xs text-stone-600 dark:text-stone-400 block mb-1">
                      {t('modeLongBreak')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={localSettings.longBreakDuration}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, longBreakDuration: Math.max(1, Number(e.target.value)) }))}
                      className="w-full px-2 py-1.5 text-center rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono font-bold text-stone-900 dark:text-stone-100 focus:outline-emerald-600"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">{t('statMinutes')}</span>
                  </div>
                </div>
              </div>

              {/* Auto-start toggles */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t('autoStartBreaksLabel')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.autoStartBreaks}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-700">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {t('autoStartPomodorosLabel')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.autoStartPomodoros}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, autoStartPomodoros: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Long break interval */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-700">
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {t('longBreakIntervalLabel')}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {[2, 3, 4, 5].map(count => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setLocalSettings(prev => ({ ...prev, longBreakInterval: count }))}
                        className={`w-8 h-8 rounded-xl font-mono font-bold text-xs cursor-pointer transition-colors ${
                          localSettings.longBreakInterval === count
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Screen Wake Lock */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-2 rtl:pr-0 rtl:pl-2">
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {t('screenWakeLockLabel')}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {t('screenWakeLockDesc')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.screenWakeLock}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, screenWakeLock: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Default Tree Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  {t('selectTree')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TREE_TYPES.map(tree => {
                    const isSelected = localSettings.selectedTreeType === tree.id;
                    return (
                      <button
                        key={tree.id}
                        type="button"
                        onClick={() => setLocalSettings(prev => ({ ...prev, selectedTreeType: tree.id }))}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900'
                        }`}
                      >
                        <span className="text-xl">{tree.icon}</span>
                        <span className="text-xs truncate">
                          {localSettings.language === 'ar' ? tree.nameAr : tree.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Appearance & Theme */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Theme Mode Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  {t('themeMode')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light' as AppTheme, label: t('themeLight'), icon: <Sun className="w-5 h-5 text-amber-500" /> },
                    { id: 'dark' as AppTheme, label: t('themeDark'), icon: <Moon className="w-5 h-5 text-indigo-400" /> },
                    { id: 'system' as AppTheme, label: t('themeSystem'), icon: <Laptop className="w-5 h-5 text-stone-500" /> },
                  ].map(themeOpt => {
                    const isSelected = localSettings.theme === themeOpt.id;
                    return (
                      <button
                        key={themeOpt.id}
                        type="button"
                        onClick={() => setLocalSettings(prev => ({ ...prev, theme: themeOpt.id }))}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer gap-2 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 ring-2 ring-emerald-600/30'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        {themeOpt.icon}
                        <span className="text-xs font-bold">{themeOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family Preference */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                  <Type className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('fontStyle')}</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'cairo' as FontFamilyPreference, name: 'خط كايرو (Cairo)', desc: 'خط عربي هندسي وواضح للشاشات الحديثة' },
                    { id: 'tajawal' as FontFamilyPreference, name: 'خط تجوال (Tajawal)', desc: 'خط عربي أنيق ناعم وسلس في القراءة' },
                    { id: 'ibm-plex' as FontFamilyPreference, name: 'آي بي إم بلكس (IBM Plex)', desc: 'خط عربي تقني وعملي جداً' },
                    { id: 'sans' as FontFamilyPreference, name: 'خط النظام (System Sans)', desc: 'خط النظام الافتراضي السريع' },
                  ].map(fontOpt => {
                    const isSelected = localSettings.fontFamily === fontOpt.id;
                    return (
                      <button
                        key={fontOpt.id}
                        type="button"
                        onClick={() => setLocalSettings(prev => ({ ...prev, fontFamily: fontOpt.id }))}
                        className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 bg-white dark:bg-stone-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {fontOpt.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                          {fontOpt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Animations Toggle */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {t('animationsToggle')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.enableAnimations}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, enableAnimations: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Language Selection */}
          {activeTab === 'language' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <label className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                {t('tabLanguage')}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LANGUAGES.map(langItem => {
                  const isSelected = localSettings.language === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      type="button"
                      onClick={() => setLocalSettings(prev => ({ ...prev, language: langItem.code }))}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 ring-2 ring-emerald-600/30'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{langItem.flag}</span>
                        <div className="text-start">
                          <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                            {langItem.nativeName}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            {langItem.name} ({langItem.dir.toUpperCase()})
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="p-1 rounded-full bg-emerald-600 text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Data & Backup */}
          {activeTab === 'data' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Export Data */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {t('exportDataBtn')}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {language === 'ar'
                      ? 'قم بتحميل نسخة احتياطية من جميع إنجازاتك وسجل غابتك ومهامك في ملف JSON.'
                      : 'Download a backup file of all your achievements, planted forest history, and tasks.'}
                  </p>
                </div>
                {onExportData && (
                  <button
                    type="button"
                    onClick={onExportData}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('exportDataBtn')}</span>
                  </button>
                )}
              </div>

              {/* Reset Data */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-3">
                <div className="flex items-start gap-2.5 text-rose-800 dark:text-rose-300">
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">{t('resetDataBtn')}</h4>
                    <p className="text-xs opacity-80 mt-0.5">
                      {t('resetConfirm')}
                    </p>
                  </div>
                </div>

                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('resetDataBtn')}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onResetData) onResetData();
                        setShowResetConfirm(false);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {language === 'ar' ? 'نعم، امسح كل البيانات الآن' : 'Yes, Delete Everything'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-end gap-3">
          <button
            id="btn-cancel-settings"
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-semibold transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            id="btn-save-settings"
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            {t('saveAndClose')}
          </button>
        </div>
      </div>
    </div>
  );
};
