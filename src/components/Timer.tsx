import React, { useState } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Volume2, Sparkles, Target, ChevronDown, Bell } from 'lucide-react';
import { TimerMode, TreeType, Task, TaskCategory, AmbientSoundType, SupportedLanguage } from '../types';
import { ForestVisual } from './ForestVisual';
import { TREE_TYPES, CATEGORIES, AMBIENT_SOUNDS } from '../data/trees';
import { getTranslation } from '../i18n/translations';

interface TimerProps {
  mode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onGiveUp: () => void; // Gives up and withers tree
  onAdjustTime: (seconds: number) => void;
  onSetExactMinutes: (minutes: number) => void;
  treeType: TreeType;
  onSelectTreeType: (treeTypeId: string) => void;
  category: TaskCategory;
  onSelectCategory: (cat: TaskCategory) => void;
  activeTask: Task | null;
  onClearActiveTask: () => void;
  ambientSound: AmbientSoundType;
  onSelectAmbientSound: (ambient: AmbientSoundType) => void;
  onTestBell: () => void;
  language: SupportedLanguage;
}

export const Timer: React.FC<TimerProps> = ({
  mode,
  onSelectMode,
  timeLeft,
  totalTime,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onGiveUp,
  onSetExactMinutes,
  treeType,
  onSelectTreeType,
  category,
  onSelectCategory,
  activeTask,
  onClearActiveTask,
  ambientSound,
  onSelectAmbientSound,
  onTestBell,
  language,
}) => {
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [isTreeDropdownOpen, setIsTreeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  // Time calculations
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const isCompleted = timeLeft === 0 && totalTime > 0;

  // Radial progress ring math
  const radius = 136;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const modeTitles = {
    focus: { label: t('modeFocus'), icon: '🌲' },
    shortBreak: { label: t('modeShortBreak'), icon: '☕' },
    longBreak: { label: t('modeLongBreak'), icon: '🍃' },
  };

  const selectedCategoryObj = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  // Growth Stage
  const getGrowthStage = (prog: number) => {
    if (prog < 0.25) return `${t('treeStage1')} 🌱`;
    if (prog < 0.55) return `${t('treeStage2')} 🌿`;
    if (prog < 0.85) return `${t('treeStage3')} 🪴`;
    return `${t('treeStage4')} 🌳`;
  };

  const DURATION_PRESETS = [10, 15, 20, 25, 30, 45, 60, 90, 120];

  return (
    <div
      id="main-timer-card"
      className="w-full bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90 dark:border-stone-800 flex flex-col items-center relative overflow-hidden transition-colors"
    >
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 mb-5 max-w-sm w-full transition-colors">
        {(['focus', 'shortBreak', 'longBreak'] as const).map(m => {
          const isCurrent = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => onSelectMode(m)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs ring-1 ring-stone-900/5 dark:ring-stone-700'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <span>{modeTitles[m].icon}</span>
              <span>{modeTitles[m].label}</span>
            </button>
          );
        })}
      </div>

      {/* Top Controls: Tree Species & Category Selector */}
      {mode === 'focus' && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 w-full max-w-md">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{selectedCategoryObj.icon}</span>
              <span>{language === 'ar' ? selectedCategoryObj.nameAr : selectedCategoryObj.nameEn}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full mt-1.5 z-30 w-44 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 animate-in fade-in">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 text-start cursor-pointer"
                  >
                    <span>{cat.icon}</span>
                    <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tree Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => setIsTreeDropdownOpen(!isTreeDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{treeType.icon}</span>
              <span>{language === 'ar' ? treeType.nameAr : treeType.nameEn}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isTreeDropdownOpen && (
              <div className="absolute top-full mt-1.5 z-30 w-52 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 animate-in fade-in">
                {TREE_TYPES.map(tItem => (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => {
                      onSelectTreeType(tItem.id);
                      setIsTreeDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 text-start cursor-pointer"
                  >
                    <span className="text-base">{tItem.icon}</span>
                    <span>{language === 'ar' ? tItem.nameAr : tItem.nameEn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Linked Task Banner */}
      {mode === 'focus' && activeTask && (
        <div className="w-full max-w-sm mb-3">
          <div className="flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-stone-600 dark:text-stone-400 truncate">
                {t('activeTaskLabel')}
              </span>
              <span className="font-bold text-emerald-950 dark:text-emerald-200 truncate">
                "{activeTask.title}"
              </span>
            </div>
            <button
              type="button"
              onClick={onClearActiveTask}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 font-bold px-1.5 py-0.5 rounded cursor-pointer"
              title={t('unlinkTask')}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* THE RADIAL CIRCULAR TIMER & TREE CENTERPIECE */}
      <div className="relative flex items-center justify-center my-2 select-none">
        {/* Subtle Outer Glow Ring when Running */}
        {isRunning && (
          <div
            className="absolute inset-2 rounded-full blur-xl pointer-events-none transition-all duration-1000 animate-pulse-glow"
            style={{
              backgroundColor: mode === 'focus' ? (treeType.color || '#10b981') : '#0ea5e9',
            }}
          />
        )}

        {/* Outer Circular Progress Ring */}
        <svg
          className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 pointer-events-none"
          viewBox="0 0 300 300"
        >
          {/* Track Circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-stone-100 dark:text-stone-800"
          />
          {/* Subtle tick background */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray="4 8"
            fill="transparent"
            className="text-stone-200 dark:text-stone-700 opacity-60"
          />
          {/* Active Progress Arc */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke={mode === 'focus' ? (treeType.color || '#10b981') : '#0ea5e9'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear drop-shadow-sm"
          />
        </svg>

        {/* Tree Growing inside Circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
          <ForestVisual
            progress={progress}
            treeType={treeType}
            isPaused={!isRunning}
            isCompleted={isCompleted}
            language={language}
          />
        </div>

        {/* Growth Stage Badge on bottom rim */}
        {mode === 'focus' && (
          <div className="absolute bottom-2 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-800/90 shadow-xs border border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-700 dark:text-stone-200 backdrop-blur-xs flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{getGrowthStage(progress)}</span>
          </div>
        )}
      </div>

      {/* Digital Countdown Display */}
      <div className="text-center my-3">
        <div
          id="timer-countdown-display"
          className="font-mono text-5xl sm:text-6xl md:text-7xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight select-none"
        >
          {formattedTime}
        </div>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-1">
          {isRunning ? t('treeGrowing') : t('appSubtitle')}
        </p>
      </div>

      {/* Quick Duration Presets Chips (When Paused) */}
      {!isRunning && mode === 'focus' && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5 max-w-md">
          {DURATION_PRESETS.map(mins => {
            const isSelected = Math.round(totalTime / 60) === mins;
            return (
              <button
                key={mins}
                type="button"
                onClick={() => onSetExactMinutes(mins)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {mins} {language === 'ar' ? 'د' : 'm'}
              </button>
            );
          })}
        </div>
      )}

      {/* Ambient Soundscape Toolbar */}
      <div className="w-full max-w-md p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 mb-5 transition-colors">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>{t('ambientSound')}</span>
          </span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500">
            {language === 'ar' ? 'تعمل تلقائياً مع المؤقت' : 'Plays while timer runs'}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {AMBIENT_SOUNDS.map(amb => {
            const isSelected = ambientSound === amb.id;
            return (
              <button
                key={amb.id}
                type="button"
                onClick={() => onSelectAmbientSound(amb.id)}
                title={language === 'ar' ? amb.nameAr : amb.nameEn}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60'
                }`}
              >
                <span className="text-base leading-none mb-0.5">{amb.icon}</span>
                <span className="text-[9px] truncate max-w-full">
                  {amb.id === 'none'
                    ? (language === 'ar' ? 'صامت' : 'Off')
                    : amb.id === 'rain'
                    ? (language === 'ar' ? 'مطر' : 'Rain')
                    : amb.id === 'birds'
                    ? (language === 'ar' ? 'عصافير' : 'Birds')
                    : amb.id === 'wind'
                    ? (language === 'ar' ? 'رياح' : 'Wind')
                    : amb.id === 'campfire'
                    ? (language === 'ar' ? 'موقد' : 'Fire')
                    : (language === 'ar' ? 'ضجيج' : 'Noise')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-2.5 w-full max-w-sm">
        {/* Play/Pause Button */}
        <button
          id="btn-toggle-timer"
          type="button"
          onClick={onToggleTimer}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-base shadow-md transition-all active:scale-98 cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>{t('pause')}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{t('startFocus')}</span>
            </>
          )}
        </button>

        {/* Give Up Button (Active only when running focus session) */}
        {isRunning && mode === 'focus' ? (
          <button
            id="btn-give-up"
            type="button"
            onClick={() => setShowGiveUpConfirm(true)}
            title={t('giveUp')}
            className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        ) : (
          /* Reset Button */
          <button
            id="btn-reset-timer"
            type="button"
            onClick={onResetTimer}
            title={t('resume')}
            className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        {/* Instant Bell Chime Tester */}
        <button
          id="btn-quick-bell-test"
          type="button"
          onClick={onTestBell}
          title={t('testBell')}
          className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Give Up Warning Modal */}
      {showGiveUpConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-xl border border-stone-200 dark:border-stone-800 text-center transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
              {t('confirmGiveUpTitle')}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-5">
              {t('confirmGiveUpDesc')}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGiveUpConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold cursor-pointer transition-colors"
              >
                {t('btnKeepFocusing')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGiveUpConfirm(false);
                  onGiveUp();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {t('btnConfirmGiveUp')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
