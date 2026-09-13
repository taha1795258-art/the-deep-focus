import React, { useEffect } from 'react';
import { Bell, BellOff, Coffee, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { TimerMode, SupportedLanguage } from '../types';
import { getTranslation } from '../i18n/translations';

interface AlarmModalProps {
  isOpen: boolean;
  onStopAlarm: () => void;
  mode: TimerMode;
  taskTitle?: string;
  language: SupportedLanguage;
  onStartBreak: () => void;
  onStartFocus: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  onStopAlarm,
  mode,
  taskTitle,
  language,
  onStartBreak,
  onStartFocus,
}) => {
  // Listen for Space or Escape key to stop alarm manually
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        e.preventDefault();
        onStopAlarm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStopAlarm]);

  if (!isOpen) return null;

  const t = (key: string) => getTranslation(language, key);
  const isFocus = mode === 'focus';
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div
      id="alarm-active-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="alarm-active-card"
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-emerald-500/40 p-6 sm:p-8 text-center overflow-hidden transition-colors"
      >
        {/* Animated background rings */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-100/60 dark:bg-amber-950/40 rounded-full blur-2xl pointer-events-none" />

        {/* Pulsing Bell Icon with soundwaves */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-emerald-500/30 animate-pulse" />
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg text-white">
            <Bell className="w-10 h-10 animate-bell-ring" />
          </div>
        </div>

        {/* Title & Status Message */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('alarmModalRinging')} 🔔</span>
        </div>

        <h2 id="alarm-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mb-2">
          {isFocus ? t('alarmModalFocusTitle') : t('alarmModalBreakTitle')}
        </h2>

        <div id="alarm-description" className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mb-6">
          {isFocus ? (
            taskTitle ? (
              <div>
                <span>{language === 'ar' ? 'أحسنت! كبرت شجرتك وأنجزت وقتك لمهمة:' : 'Great job! Your tree flourished while working on:'}</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  "{taskTitle}"
                </strong>
              </div>
            ) : (
              <span>{t('treeFinished')}</span>
            )
          ) : (
            <span>{t('takeBreak')}</span>
          )}
        </div>

        {/* PRIMARY ACTION: Huge Stop Bell Button */}
        <button
          id="btn-stop-alarm-manual"
          type="button"
          onClick={onStopAlarm}
          className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-lg shadow-lg shadow-rose-600/30 transition-all cursor-pointer mb-3"
          autoFocus
        >
          <BellOff className="w-6 h-6 animate-bell-ring text-white group-hover:scale-110 transition-transform" />
          <span>{t('alarmModalDismiss')}</span>
          <span className="text-xs bg-rose-700/80 px-2 py-0.5 rounded-md text-rose-100 font-mono hidden sm:inline-block">
            {t('alarmModalKeyHint')}
          </span>
        </button>

        {/* Quick Next Step Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          {isFocus ? (
            <>
              <button
                id="btn-alarm-start-break"
                type="button"
                onClick={() => {
                  onStopAlarm();
                  onStartBreak();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 text-sm font-semibold transition-colors cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{t('alarmStartBreak')}</span>
              </button>
              <button
                id="btn-alarm-start-another-focus"
                type="button"
                onClick={() => {
                  onStopAlarm();
                  onStartFocus();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60 text-sm font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{t('alarmNewFocus')}</span>
              </button>
            </>
          ) : (
            <button
              id="btn-alarm-resume-focus"
              type="button"
              onClick={() => {
                onStopAlarm();
                onStartFocus();
              }}
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <span>{t('alarmResumeFocus')}</span>
              <Arrow className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
