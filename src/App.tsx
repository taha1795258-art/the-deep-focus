/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  TimerMode,
  AppSettings,
  Task,
  PlantedTree,
  TaskCategory,
  AmbientSoundType,
  SupportedLanguage,
  AppTheme,
  FontFamilyPreference,
} from './types';
import { TREE_TYPES } from './data/trees';
import { soundSynthesizer } from './utils/sound';
import { Header } from './components/Header';
import { Timer } from './components/Timer';
import { TaskManager } from './components/TaskManager';
import { ForestGallery } from './components/ForestGallery';
import { AlarmModal } from './components/AlarmModal';
import { AlarmBanner } from './components/AlarmBanner';
import { SettingsModal } from './components/SettingsModal';
import { getTranslation } from './i18n/translations';

const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundType: 'classic-bell',
  volume: 80,
  continuousAlarm: true, // Rings continuously until stopped manually
  ringInterval: 3,
  tickingSound: false,
  vibrateOnComplete: true,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  screenWakeLock: false,
  ambientSound: 'none',
  ambientVolume: 50,
  selectedTreeType: 'oak',
  selectedCategory: 'study',
  strictMode: false,
  notificationsEnabled: false,
  language: 'ar',
  theme: 'system',
  fontFamily: 'cairo',
  enableAnimations: true,
};

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'إتمام قراءة ومراجعة المستندات المهمة',
    completed: false,
    priority: 'high',
    category: 'study',
    estimatedPomodoros: 2,
    completedPomodoros: 1,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-2',
    title: 'التخطيط لمهام الأسبوع الجديد',
    completed: true,
    priority: 'medium',
    category: 'work',
    estimatedPomodoros: 1,
    completedPomodoros: 1,
    createdAt: Date.now() - 7200000,
    completedAt: Date.now() - 3600000,
  },
];

const INITIAL_TREES: PlantedTree[] = [
  {
    id: 'tree-seed-1',
    treeTypeId: 'oak',
    treeName: 'شجرة السنديان العريقة',
    durationMinutes: 25,
    completedAt: Date.now() - 3600000,
    status: 'alive',
    category: 'study',
    taskId: 'task-2',
    taskTitle: 'التخطيط لمهام الأسبوع الجديد',
  },
];

export default function App() {
  // Settings with localStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('focus_forest_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Tasks with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('focus_forest_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Planted trees with localStorage persistence
  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>(() => {
    try {
      const saved = localStorage.getItem('focus_forest_trees');
      return saved ? JSON.parse(saved) : INITIAL_TREES;
    } catch {
      return INITIAL_TREES;
    }
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>('task-1');
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(settings.focusDuration * 60);
  const [totalTime, setTotalTime] = useState<number>(settings.focusDuration * 60);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  // Alarm states (Core request: bell ringing with manual dismissal)
  const [isAlarmRinging, setIsAlarmRinging] = useState<boolean>(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  const t = (key: string) => getTranslation(settings.language, key);

  // 1. Dark Mode Management
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkSystem) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen to system changes if in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // 2. Sync HTML dir and lang based on settings
  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings.language]);

  // 3. Font Family Preference Class
  const getFontFamilyClass = (font: FontFamilyPreference) => {
    switch (font) {
      case 'tajawal':
        return 'font-tajawal';
      case 'ibm-plex':
        return 'font-ibm';
      case 'sans':
        return 'font-sans';
      case 'cairo':
      default:
        return 'font-cairo';
    }
  };

  // 4. Save state to localStorage
  useEffect(() => {
    localStorage.setItem('focus_forest_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('focus_forest_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focus_forest_trees', JSON.stringify(plantedTrees));
  }, [plantedTrees]);

  // 5. Screen Wake Lock API integration
  useEffect(() => {
    const requestWakeLock = async () => {
      if (isRunning && settings.screenWakeLock && 'wakeLock' in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch {
          // Wake lock rejected or unsupported
        }
      }
    };

    if (isRunning && settings.screenWakeLock) {
      requestWakeLock();
    } else {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isRunning, settings.screenWakeLock]);

  // 6. Manage Ambient Sound playback based on running state
  useEffect(() => {
    if (isRunning && mode === 'focus' && settings.ambientSound !== 'none') {
      soundSynthesizer.updateAmbientSound(settings.ambientSound, settings.ambientVolume || 50);
    } else {
      soundSynthesizer.stopAmbientSound();
    }
  }, [isRunning, mode, settings.ambientSound, settings.ambientVolume]);

  // Selected tree object
  const currentTreeType =
    TREE_TYPES.find(tree => tree.id === settings.selectedTreeType) || TREE_TYPES[0];

  const activeTask = tasks.find(task => task.id === activeTaskId) || null;

  // Get duration for current mode in seconds
  const getModeDurationSeconds = useCallback((m: TimerMode, customSettings: AppSettings = settings) => {
    if (m === 'focus') return customSettings.focusDuration * 60;
    if (m === 'shortBreak') return customSettings.shortBreakDuration * 60;
    return customSettings.longBreakDuration * 60;
  }, [settings]);

  // Stop Alarm Manually handler (Crucial feature)
  const handleStopAlarm = useCallback(() => {
    soundSynthesizer.stopAlarm((ringing) => {
      setIsAlarmRinging(ringing);
    });
    setIsAlarmRinging(false);
    setIsAlarmModalOpen(false);
  }, []);

  // Global Keyboard Shortcuts (Space to toggle/stop, Esc to stop/dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isAlarmRinging) {
          handleStopAlarm();
        } else {
          setIsRunning(prev => !prev);
        }
      } else if (e.code === 'Escape') {
        if (isAlarmRinging) {
          handleStopAlarm();
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlarmRinging, isSettingsOpen, handleStopAlarm]);

  // When timer completes (00:00)
  const handleTimerCompletion = useCallback(() => {
    setIsRunning(false);
    soundSynthesizer.stopAmbientSound();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start Web Audio Bell sound alarm (repeating if continuousAlarm is set)
    const intervalMs = (settings.ringInterval || 3) * 1000;
    soundSynthesizer.startAlarm(
      settings.soundType,
      settings.volume,
      settings.continuousAlarm,
      (ringing) => setIsAlarmRinging(ringing),
      intervalMs
    );
    setIsAlarmRinging(true);
    setIsAlarmModalOpen(true);

    // Vibration on completion if supported & enabled
    if (settings.vibrateOnComplete && 'vibrate' in navigator) {
      try {
        navigator.vibrate([300, 100, 300, 100, 400]);
      } catch {
        // ignore
      }
    }

    // Browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const title =
          mode === 'focus'
            ? `🔔 ${t('alarmModalFocusTitle')}`
            : `🔔 ${t('alarmModalBreakTitle')}`;
        const body = t('alarmModalDesc');
        new Notification(title, { body, icon: '🌲' });
      } catch {
        // Notification failed or blocked
      }
    }

    // If focus session, celebrate & plant the tree!
    if (mode === 'focus') {
      if (settings.enableAnimations !== false) {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#facc15', '#ec4899', '#6366f1'],
          });
        } catch {
          // ignore
        }
      }

      const durationMins = Math.round(totalTime / 60);
      const newTree: PlantedTree = {
        id: 'tree-' + Date.now(),
        treeTypeId: currentTreeType.id,
        treeName: settings.language === 'ar' ? currentTreeType.nameAr : currentTreeType.nameEn,
        durationMinutes: durationMins,
        completedAt: Date.now(),
        status: 'alive',
        category: settings.selectedCategory || 'other',
        taskId: activeTask?.id,
        taskTitle: activeTask?.title,
      };
      setPlantedTrees(prev => [newTree, ...prev]);

      // If task was linked, increment completed pomodoro count
      if (activeTaskId) {
        setTasks(prev =>
          prev.map(task =>
            task.id === activeTaskId
              ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
              : task
          )
        );
      }

      const nextSessions = completedSessionsCount + 1;
      setCompletedSessionsCount(nextSessions);

      // Auto-start break logic if configured
      if (settings.autoStartBreaks) {
        const isLong = nextSessions % (settings.longBreakInterval || 4) === 0;
        const nextMode: TimerMode = isLong ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        const nextSecs = getModeDurationSeconds(nextMode);
        setTimeLeft(nextSecs);
        setTotalTime(nextSecs);
        setIsRunning(true);
      }
    } else {
      // Break finished, auto-start pomodoro if configured
      if (settings.autoStartPomodoros) {
        setMode('focus');
        const nextSecs = getModeDurationSeconds('focus');
        setTimeLeft(nextSecs);
        setTotalTime(nextSecs);
        setIsRunning(true);
      }
    }
  }, [
    mode,
    totalTime,
    settings,
    currentTreeType,
    activeTaskId,
    activeTask?.id,
    activeTask?.title,
    completedSessionsCount,
    getModeDurationSeconds,
    t,
  ]);

  // Main tick interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerCompletion();
            return 0;
          }

          // Optional ticking sound during countdown
          if (settings.tickingSound) {
            soundSynthesizer.playTickSound(settings.volume);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, handleTimerCompletion, settings.tickingSound, settings.volume]);

  // Mode change handler
  const handleSelectMode = (newMode: TimerMode) => {
    if (isRunning) {
      const confirmMsg =
        settings.language === 'ar'
          ? 'هل تريد تبديل الوضع وإعادة ضبط المؤقت الحالي؟'
          : 'Switch mode and reset current timer?';
      if (!window.confirm(confirmMsg)) return;
    }
    setIsRunning(false);
    soundSynthesizer.stopAmbientSound();
    setMode(newMode);
    const secs = getModeDurationSeconds(newMode);
    setTimeLeft(secs);
    setTotalTime(secs);
  };

  // Toggle Timer
  const handleToggleTimer = () => {
    if (timeLeft === 0) {
      const secs = getModeDurationSeconds(mode);
      setTimeLeft(secs);
      setTotalTime(secs);
    }
    setIsRunning(prev => !prev);
  };

  // Reset Timer
  const handleResetTimer = () => {
    setIsRunning(false);
    soundSynthesizer.stopAmbientSound();
    const secs = getModeDurationSeconds(mode);
    setTimeLeft(secs);
    setTotalTime(secs);
  };

  // Give Up Handler (Withers the tree)
  const handleGiveUp = () => {
    setIsRunning(false);
    soundSynthesizer.stopAmbientSound();

    const elapsedMinutes = Math.max(1, Math.round((totalTime - timeLeft) / 60));
    const witheredTree: PlantedTree = {
      id: 'tree-withered-' + Date.now(),
      treeTypeId: currentTreeType.id,
      treeName: settings.language === 'ar' ? currentTreeType.nameAr : currentTreeType.nameEn,
      durationMinutes: elapsedMinutes,
      completedAt: Date.now(),
      status: 'withered',
      category: settings.selectedCategory || 'other',
      taskId: activeTask?.id,
      taskTitle: activeTask?.title,
    };
    setPlantedTrees(prev => [witheredTree, ...prev]);

    // Reset timer
    const secs = getModeDurationSeconds(mode);
    setTimeLeft(secs);
    setTotalTime(secs);
  };

  // Adjust time by seconds (+5m / -5m)
  const handleAdjustTime = (deltaSeconds: number) => {
    setTimeLeft(prev => {
      const updated = Math.max(60, prev + deltaSeconds);
      setTotalTime(updated);
      return updated;
    });
  };

  // Set exact minutes from preset chips
  const handleSetExactMinutes = (mins: number) => {
    if (isRunning) return;
    const secs = mins * 60;
    setTimeLeft(secs);
    setTotalTime(secs);
    setSettings(prev => ({ ...prev, focusDuration: mins }));
  };

  // Tree selection
  const handleSelectTreeType = (treeTypeId: string) => {
    setSettings(prev => ({ ...prev, selectedTreeType: treeTypeId }));
  };

  // Category selection
  const handleSelectCategory = (cat: TaskCategory) => {
    setSettings(prev => ({ ...prev, selectedCategory: cat }));
  };

  // Ambient sound selection
  const handleSelectAmbientSound = (amb: AmbientSoundType) => {
    setSettings(prev => ({ ...prev, ambientSound: amb }));
    if (isRunning && mode === 'focus') {
      soundSynthesizer.updateAmbientSound(amb, settings.ambientVolume || 50);
    }
  };

  // Save Settings handler
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    if (!isRunning) {
      const newSecs = getModeDurationSeconds(mode, newSettings);
      setTimeLeft(newSecs);
      setTotalTime(newSecs);
    }
  };

  // Theme toggle helper from Header button
  const handleToggleTheme = () => {
    setSettings(prev => {
      const nextTheme: AppTheme = prev.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
  };

  // Language selector from Header dropdown
  const handleSelectLanguage = (newLang: SupportedLanguage) => {
    setSettings(prev => ({ ...prev, language: newLang }));
  };

  // Export Data JSON
  const handleExportData = () => {
    const exportPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      tasks,
      plantedTrees,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the-deep-focus-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset Data to defaults
  const handleResetData = () => {
    localStorage.removeItem('focus_forest_settings');
    localStorage.removeItem('focus_forest_tasks');
    localStorage.removeItem('focus_forest_trees');
    setSettings(DEFAULT_SETTINGS);
    setTasks(INITIAL_TASKS);
    setPlantedTrees(INITIAL_TREES);
    setIsRunning(false);
    setTimeLeft(DEFAULT_SETTINGS.focusDuration * 60);
    setTotalTime(DEFAULT_SETTINGS.focusDuration * 60);
  };

  // Tasks actions
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: 'task-' + Date.now(),
      completedPomodoros: 0,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const completed = !task.completed;
          return {
            ...task,
            completed,
            completedAt: completed ? Date.now() : undefined,
          };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div
      className={`min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-300 ${getFontFamilyClass(
        settings.fontFamily || 'cairo'
      )}`}
    >
      {/* Sticky Top Alert Banner when Bell is Ringing */}
      <AlarmBanner
        isRinging={isAlarmRinging}
        onStopAlarm={handleStopAlarm}
        language={settings.language}
      />

      {/* Application Navigation Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        isAlarmRinging={isAlarmRinging}
        onStopAlarm={handleStopAlarm}
        soundType={settings.soundType}
        volume={settings.volume}
        language={settings.language}
        onSelectLanguage={handleSelectLanguage}
        theme={settings.theme || 'system'}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Feature Banner explaining Bell alert & manual dismissal */}
        <div className="bg-emerald-900/5 dark:bg-emerald-950/30 border border-emerald-600/20 dark:border-emerald-800/40 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm transition-colors">
          <div className="flex items-center gap-2.5 text-emerald-950 dark:text-emerald-200">
            <span className="text-xl animate-float">🔔</span>
            <p>
              <strong>{t('alarmFeatureTitle')}:</strong> {t('alarmFeatureDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => soundSynthesizer.playSingleChime(settings.soundType, settings.volume)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            {t('testBell')}
          </button>
        </div>

        {/* Core Timer & Tree Visualizer with Circular Radial Ring */}
        <Timer
          mode={mode}
          onSelectMode={handleSelectMode}
          timeLeft={timeLeft}
          totalTime={totalTime}
          isRunning={isRunning}
          onToggleTimer={handleToggleTimer}
          onResetTimer={handleResetTimer}
          onGiveUp={handleGiveUp}
          onAdjustTime={handleAdjustTime}
          onSetExactMinutes={handleSetExactMinutes}
          treeType={currentTreeType}
          onSelectTreeType={handleSelectTreeType}
          category={settings.selectedCategory || 'study'}
          onSelectCategory={handleSelectCategory}
          activeTask={activeTask}
          onClearActiveTask={() => setActiveTaskId(null)}
          ambientSound={settings.ambientSound || 'none'}
          onSelectAmbientSound={handleSelectAmbientSound}
          onTestBell={() => soundSynthesizer.playSingleChime(settings.soundType, settings.volume)}
          language={settings.language}
        />

        {/* Tasks Section & Forest Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskManager
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectActiveTask={setActiveTaskId}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            language={settings.language}
          />

          <ForestGallery
            plantedTrees={plantedTrees}
            completedTasksCount={completedTasksCount}
            language={settings.language}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-stone-400 dark:text-stone-600 border-t border-stone-200/60 dark:border-stone-800 mt-auto">
        <p>
          {settings.language === 'ar'
            ? 'The Deep Focus • مؤقت بومودورو والتركيز العميق مع رنين منبه جرس وإيقاف يدوي'
            : 'The Deep Focus • Deep focus & pomodoro timer with bell sound alarm & manual dismiss'}
        </p>
      </footer>

      {/* Active Ringing Alarm Alert Modal (Core Requirement) */}
      <AlarmModal
        isOpen={isAlarmModalOpen}
        onStopAlarm={handleStopAlarm}
        mode={mode}
        taskTitle={activeTask?.title}
        language={settings.language}
        onStartBreak={() => handleSelectMode('shortBreak')}
        onStartFocus={() => handleSelectMode('focus')}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        language={settings.language}
        onExportData={handleExportData}
        onResetData={handleResetData}
      />
    </div>
  );
}
