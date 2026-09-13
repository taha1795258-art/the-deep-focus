import React, { useState } from 'react';
import { TreePine, Sparkles, BarChart3 } from 'lucide-react';
import { PlantedTree, SupportedLanguage } from '../types';
import { TREE_TYPES, CATEGORIES } from '../data/trees';
import { getTranslation } from '../i18n/translations';

interface ForestGalleryProps {
  plantedTrees: PlantedTree[];
  completedTasksCount: number;
  language: SupportedLanguage;
}

export const ForestGallery: React.FC<ForestGalleryProps> = ({
  plantedTrees,
  language,
}) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('all');

  const t = (key: string) => getTranslation(language, key);

  // Filter trees based on time
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const filteredTrees = plantedTrees.filter(tree => {
    if (timeFilter === 'today') return tree.completedAt >= todayStart.getTime();
    if (timeFilter === 'week') return tree.completedAt >= weekStart.getTime();
    return true;
  });

  const healthyTrees = filteredTrees.filter(tree => tree.status !== 'withered');
  const witheredTrees = filteredTrees.filter(tree => tree.status === 'withered');
  const totalFocusMinutes = healthyTrees.reduce((acc, tree) => acc + tree.durationMinutes, 0);
  const successRate = filteredTrees.length > 0 ? Math.round((healthyTrees.length / filteredTrees.length) * 100) : 100;

  // Category breakdown calculation
  const categoryMinutes: Record<string, number> = {};
  healthyTrees.forEach(tree => {
    const cat = tree.category || 'other';
    categoryMinutes[cat] = (categoryMinutes[cat] || 0) + tree.durationMinutes;
  });

  return (
    <div
      id="forest-gallery-section"
      className="w-full bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/90 dark:border-stone-800 transition-colors"
    >
      {/* Header & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">
              {t('forestTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('forestSubtitle')}
            </p>
          </div>
        </div>

        {/* Time Period Filter Chips */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTimeFilter('today')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              timeFilter === 'today'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('periodToday')}
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('week')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              timeFilter === 'week'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('periodWeek')}
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              timeFilter === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {t('periodAll')}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-0.5">
            {t('statHealthyTrees')}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200 font-mono">
              {healthyTrees.length}
            </span>
            <span className="text-lg">🌲</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 text-center">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-0.5">
            {t('statTotalMinutes')}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-black text-amber-900 dark:text-amber-200 font-mono">
              {totalFocusMinutes}
            </span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{t('minutes')}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-center">
          <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold mb-0.5">
            {t('statWitheredTrees')}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-black text-rose-900 dark:text-rose-200 font-mono">
              {witheredTrees.length}
            </span>
            <span className="text-lg">🥀</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 text-center">
          <p className="text-xs text-sky-700 dark:text-sky-400 font-semibold mb-0.5">
            {t('statSuccessRate')}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-black text-sky-900 dark:text-sky-200 font-mono">
              {successRate}%
            </span>
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
        </div>
      </div>

      {/* Category Progress Bar */}
      {totalFocusMinutes > 0 && (
        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 mb-5">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('selectCategory')}</span>
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              {totalFocusMinutes} {t('minutes')}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden flex">
            {CATEGORIES.map(cat => {
              const mins = categoryMinutes[cat.id] || 0;
              if (mins === 0) return null;
              const pct = (mins / totalFocusMinutes) * 100;
              return (
                <div
                  key={cat.id}
                  style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  title={`${cat.nameAr}: ${mins}m (${Math.round(pct)}%)`}
                  className="h-full transition-all duration-500"
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {CATEGORIES.map(cat => {
              const mins = categoryMinutes[cat.id] || 0;
              if (mins === 0) return null;
              return (
                <div key={cat.id} className="flex items-center gap-1 text-[10px] font-semibold text-stone-600 dark:text-stone-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.icon} {language === 'ar' ? cat.nameAr : cat.nameEn}:</span>
                  <span className="font-mono text-stone-900 dark:text-stone-200">{mins}m</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Forest Plot / Grove */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-50/40 via-stone-50 to-emerald-100/30 dark:from-stone-800/40 dark:via-stone-900 dark:to-emerald-950/20 border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <span>🌿</span>
            <span>{t('plantedGridTitle')}</span>
          </h4>
          <span className="text-[11px] text-stone-400 font-mono">
            {filteredTrees.length} {t('treePlantedBadge')}
          </span>
        </div>

        {filteredTrees.length === 0 ? (
          <div className="py-8 text-center text-stone-400 dark:text-stone-500">
            <TreePine className="w-9 h-9 mx-auto text-stone-300 dark:text-stone-600 mb-2 opacity-50" />
            <p className="text-xs font-medium">
              {t('emptyForestMsg')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredTrees.map(tree => {
              const matchedType = TREE_TYPES.find(tItem => tItem.id === tree.treeTypeId);
              const isWithered = tree.status === 'withered';
              const icon = isWithered ? '🥀' : (matchedType?.icon || '🌳');
              const matchedCat = CATEGORIES.find(c => c.id === tree.category);
              const formattedTime = new Date(tree.completedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={tree.id}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all group relative ${
                    isWithered
                      ? 'bg-stone-100/80 dark:bg-stone-800/80 border-stone-300 dark:border-stone-700 opacity-70'
                      : 'bg-white/90 dark:bg-stone-800/90 border-emerald-100 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-500 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <span className="text-2xl transform group-hover:scale-110 transition-transform">
                    {icon}
                  </span>
                  <span
                    className={`text-[11px] font-bold mt-1 truncate max-w-full font-mono ${
                      isWithered ? 'text-stone-500 dark:text-stone-400 line-through' : 'text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {tree.durationMinutes}m
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono">
                    {formattedTime}
                  </span>

                  {matchedCat && !isWithered && (
                    <span className="text-[9px] text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 px-1 py-0.2 rounded truncate max-w-full mt-0.5">
                      {matchedCat.icon}
                    </span>
                  )}

                  {tree.taskTitle && (
                    <span
                      className="text-[8px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded truncate max-w-full mt-0.5"
                      title={tree.taskTitle}
                    >
                      {tree.taskTitle}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
