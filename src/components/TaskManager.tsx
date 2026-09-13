import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Target, CheckCircle, ListTodo } from 'lucide-react';
import { Task, TaskCategory, SupportedLanguage } from '../types';
import { CATEGORIES } from '../data/trees';
import { getTranslation } from '../i18n/translations';

interface TaskManagerProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectActiveTask: (taskId: string | null) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  language: SupportedLanguage;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  language,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState<TaskCategory>('study');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      completed: false,
      priority,
      category,
      estimatedPomodoros: Math.max(1, estimatedPomodoros),
    });

    setNewTitle('');
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const priorityLabels = {
    high: {
      ar: 'عالية 🔥',
      en: 'High 🔥',
      color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    },
    medium: {
      ar: 'متوسطة ⚡',
      en: 'Medium ⚡',
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    },
    low: {
      ar: 'عادية 🌿',
      en: 'Low 🌿',
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    },
  };

  return (
    <div
      id="task-manager-section"
      className="w-full bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/90 dark:border-stone-800 transition-colors"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">
              {t('tasksTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('tasksSubtitle')}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('filterAll')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              filter === 'active'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('filterActive')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('filterCompleted')}
          </button>
        </div>
      </div>

      {/* Add Task Trigger / Form */}
      {!isAdding ? (
        <button
          id="btn-open-add-task"
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-stone-600 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs sm:text-sm font-bold transition-all cursor-pointer mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>{t('btnAddTask')}</span>
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 mb-4 space-y-3"
        >
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {t('addTaskPlaceholder')}
            </label>
            <input
              type="text"
              required
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t('addTaskPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-emerald-600 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Category */}
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                {t('selectCategory')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {language === 'ar' ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                {language === 'ar' ? 'الأولوية' : 'Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-medium"
              >
                <option value="high">{language === 'ar' ? 'عالية 🔥' : 'High 🔥'}</option>
                <option value="medium">{language === 'ar' ? 'متوسطة ⚡' : 'Medium ⚡'}</option>
                <option value="low">{language === 'ar' ? 'عادية 🌿' : 'Low 🌿'}</option>
              </select>
            </div>

            {/* Estimated Pomodoros */}
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                {t('estPomodoros')}
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={estimatedPomodoros}
                  onChange={(e) => setEstimatedPomodoros(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 text-xs text-center rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold font-mono"
                />
                <span className="text-sm">🌲</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold cursor-pointer"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {t('btnAddTask')}
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-stone-400 dark:text-stone-500">
            <CheckCircle className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-1.5 opacity-50" />
            <p className="text-xs">
              {t('noTasksFound')}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isActive = activeTaskId === task.id;
            const catObj = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[0];

            return (
              <div
                key={task.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500/20'
                    : task.completed
                    ? 'border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 opacity-65'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900/60'
                }`}
              >
                {/* Checkbox & Title */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        task.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-100'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {/* Category Chip */}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                        {catObj.icon} {language === 'ar' ? catObj.nameAr : catObj.nameEn}
                      </span>

                      {/* Priority Chip */}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${
                          priorityLabels[task.priority].color
                        }`}
                      >
                        {language === 'ar'
                          ? priorityLabels[task.priority].ar
                          : priorityLabels[task.priority].en}
                      </span>

                      {/* Pomodoros / Trees Progress */}
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono font-bold flex items-center gap-0.5">
                        <span>🌲</span>
                        <span>{task.completedPomodoros}/{task.estimatedPomodoros}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Focus Link & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  {!task.completed && (
                    <button
                      type="button"
                      onClick={() => onSelectActiveTask(isActive ? null : task.id)}
                      title={isActive ? t('focusingNow') : t('focusOnThisTask')}
                      className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-stone-600 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px]">
                        {isActive ? t('focusingNow') : t('focusOnThisTask')}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    title={language === 'ar' ? 'حذف المهمة' : 'Delete'}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
