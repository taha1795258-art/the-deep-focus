export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export type SoundType = 'classic-bell' | 'zen-bowl' | 'crystal-chime' | 'school-bell' | 'digital-alarm';

export type AmbientSoundType = 'none' | 'rain' | 'birds' | 'wind' | 'campfire' | 'whitenoise';

export type TaskCategory = 'study' | 'work' | 'code' | 'reading' | 'health' | 'other';

export interface SoundOption {
  id: SoundType;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface TreeType {
  id: string;
  nameAr: string;
  nameEn: string;
  minMinutes: number;
  color: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: TaskCategory;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: number;
  completedAt?: number;
}

export interface PlantedTree {
  id: string;
  treeTypeId: string;
  treeName: string;
  durationMinutes: number;
  completedAt: number;
  status: 'alive' | 'withered';
  category?: TaskCategory;
  taskId?: string;
  taskTitle?: string;
}

export type SupportedLanguage = 'ar' | 'en' | 'fr' | 'es' | 'tr' | 'de' | 'ja' | 'id';

export type AppTheme = 'light' | 'dark' | 'system';

export type FontFamilyPreference = 'cairo' | 'tajawal' | 'ibm-plex' | 'sans';

export interface AppSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  soundType: SoundType;
  volume: number; // 0 to 100
  continuousAlarm: boolean; // keep ringing until stopped manually
  ringInterval: number; // repeat chime every X seconds (2, 3, 5)
  ambientSound: AmbientSoundType;
  ambientVolume: number; // 0 to 100
  selectedTreeType: string;
  selectedCategory: TaskCategory;
  strictMode: boolean;
  notificationsEnabled: boolean;
  language: SupportedLanguage;
  theme: AppTheme;
  fontFamily: FontFamilyPreference;
  enableAnimations: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number; // e.g. every 4 pomodoros
  tickingSound: boolean; // subtle clock tick
  screenWakeLock: boolean;
  vibrateOnComplete: boolean;
}
