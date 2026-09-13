import React from 'react';
import { BellOff, Volume2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n/translations';

interface AlarmBannerProps {
  isRinging: boolean;
  onStopAlarm: () => void;
  language: SupportedLanguage;
}

export const AlarmBanner: React.FC<AlarmBannerProps> = ({
  isRinging,
  onStopAlarm,
  language,
}) => {
  if (!isRinging) return null;

  const t = (key: string) => getTranslation(language, key);

  return (
    <div
      id="alarm-floating-active-banner"
      className="sticky top-0 z-40 w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-lg animate-pulse"
    >
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-full bg-white/20 text-white animate-bounce">
            <Volume2 className="w-5 h-5" />
          </span>
          <p className="text-sm sm:text-base font-bold tracking-wide">
            🔔 {t('alarmBannerText')}
          </p>
        </div>

        <button
          id="btn-banner-stop-alarm"
          type="button"
          onClick={onStopAlarm}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <BellOff className="w-4 h-4 animate-bell-ring" />
          <span>{t('alarmStopNow')}</span>
        </button>
      </div>
    </div>
  );
};
