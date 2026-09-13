import React from 'react';
import { TreeType, SupportedLanguage } from '../types';

interface ForestVisualProps {
  progress: number; // 0 to 1
  treeType: TreeType;
  isPaused: boolean;
  isCompleted: boolean;
  isWithered?: boolean;
  language: SupportedLanguage;
}

export const ForestVisual: React.FC<ForestVisualProps> = ({
  progress,
  treeType,
  isPaused,
  isCompleted,
  isWithered = false,
  language,
}) => {
  const p = Math.min(Math.max(progress, 0), 1);

  // Growth calculations
  const trunkGrowth = 30 + p * 80;
  const canopyGrowth = Math.max(0.1, p);
  const foliageOpacity = p > 0.15 ? Math.min(1, (p - 0.15) / 0.3) : 0;

  // Colors
  const primaryColor = isWithered ? '#78716c' : treeType.color;
  const trunkColor = isWithered ? '#57534e' : (treeType.id === 'sakura' ? '#78350f' : treeType.id === 'palm' ? '#854d0e' : '#573317');

  return (
    <div id="forest-visual-container" className="relative flex flex-col items-center justify-center w-full aspect-square max-w-[260px] sm:max-w-[290px] mx-auto select-none">
      {/* Background Soft Aura */}
      <div
        className={`absolute inset-6 rounded-full transition-all duration-1000 blur-2xl opacity-40 ${
          isWithered
            ? 'bg-stone-300 opacity-20'
            : isCompleted
            ? 'bg-amber-300 opacity-60 scale-110'
            : isPaused
            ? 'bg-amber-100/50'
            : 'bg-emerald-200/60'
        }`}
      />

      {/* SVG Graphic */}
      <svg
        id="tree-growth-canvas"
        viewBox="0 0 300 300"
        className="w-full h-full relative z-10 filter drop-shadow-sm select-none"
      >
        <defs>
          <linearGradient id="soil-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isWithered ? '#78716c' : '#854d0e'} />
            <stop offset="100%" stopColor={isWithered ? '#44403c' : '#451a03'} />
          </linearGradient>

          <linearGradient id="leaf-grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="leaf-grad-sakura" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>

          <linearGradient id="leaf-grad-maple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          <linearGradient id="sunflower-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Ambient pollen/particles when active */}
        {!isPaused && !isWithered && p > 0.25 && (
          <g className="animate-pulse opacity-70">
            <circle cx="110" cy="110" r="2" fill={primaryColor} />
            <circle cx="190" cy="120" r="2.5" fill="#facc15" />
            <circle cx="150" cy="90" r="1.5" fill={primaryColor} />
            <circle cx="100" cy="160" r="2" fill="#facc15" />
            <circle cx="205" cy="165" r="2" fill={primaryColor} />
          </g>
        )}

        {/* Soil Mound / Base Grass Bed */}
        <ellipse cx="150" cy="255" rx="76" ry="16" fill="url(#soil-gradient)" opacity="0.9" />
        <ellipse cx="150" cy="253" rx="68" ry="12" fill={isWithered ? '#57534e' : '#713f12'} />

        {/* Grass or fallen withered leaves */}
        {!isWithered ? (
          <>
            <path d="M118 252 Q122 242 127 248" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M175 252 Q171 240 166 247" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M102 254 Q106 246 111 251" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M192 254 Q188 245 184 250" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <g opacity="0.8">
            <ellipse cx="120" cy="252" rx="4" ry="2" fill="#a8a29e" />
            <ellipse cx="170" cy="253" rx="5" ry="2.5" fill="#78716c" />
            <ellipse cx="140" cy="256" rx="3.5" ry="1.8" fill="#57534e" />
          </g>
        )}

        {/* WITHERED TREE STATE */}
        {isWithered ? (
          <g id="withered-tree-render">
            <path
              d="M148 252 L149 190 L144 140 L140 110"
              stroke="#57534e"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* Broken drooping branches */}
            <path d="M146 180 Q120 170 105 190" stroke="#57534e" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M145 155 Q175 145 195 168" stroke="#57534e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M142 125 Q125 110 115 125" stroke="#57534e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M140 110 Q150 95 160 105" stroke="#57534e" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Drooping fallen leaves */}
            <circle cx="103" cy="192" r="3" fill="#78716c" />
            <circle cx="196" cy="170" r="2.5" fill="#78716c" />
          </g>
        ) : (
          /* LIVING GROWING TREE */
          <g id="living-tree-render">
            {/* Stage 1: Sprout (0 to 0.25) */}
            {p < 0.25 && (
              <g className="transition-all duration-500">
                <path
                  d={`M150 252 Q149 ${252 - p * 120} 150 ${252 - p * 140}`}
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                {p > 0.08 && (
                  <>
                    <ellipse
                      cx="144"
                      cy={252 - p * 140}
                      rx={3 + p * 20}
                      ry={2 + p * 12}
                      transform={`rotate(-35 144 ${252 - p * 140})`}
                      fill="#34d399"
                    />
                    <ellipse
                      cx="156"
                      cy={252 - p * 140}
                      rx={3 + p * 20}
                      ry={2 + p * 12}
                      transform={`rotate(35 156 ${252 - p * 140})`}
                      fill="#10b981"
                    />
                  </>
                )}
              </g>
            )}

            {/* Stage 2 & 3: Trunk & Branch Architecture (p >= 0.25) */}
            {p >= 0.25 && (
              <g className="transition-all duration-700">
                {/* Tree Trunk */}
                <path
                  d={`M144 252 C146 ${252 - trunkGrowth * 0.4} 147 ${252 - trunkGrowth * 0.7} 150 ${252 - trunkGrowth}
                      C153 ${252 - trunkGrowth * 0.7} 154 ${252 - trunkGrowth * 0.4} 156 252 Z`}
                  fill={trunkColor}
                />

                {/* Main Branches */}
                {p > 0.4 && (
                  <>
                    <path
                      d={`M148 ${252 - trunkGrowth * 0.55} Q125 ${240 - trunkGrowth * 0.7} 115 ${230 - trunkGrowth * 0.75}`}
                      stroke={trunkColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d={`M152 ${252 - trunkGrowth * 0.65} Q175 ${240 - trunkGrowth * 0.8} 185 ${230 - trunkGrowth * 0.85}`}
                      stroke={trunkColor}
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                )}

                {/* Sub-branches */}
                {p > 0.6 && (
                  <>
                    <path
                      d={`M149 ${252 - trunkGrowth * 0.85} Q135 ${225 - trunkGrowth * 0.95} 125 ${215 - trunkGrowth}`}
                      stroke={trunkColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d={`M151 ${252 - trunkGrowth * 0.85} Q165 ${225 - trunkGrowth * 0.95} 175 ${215 - trunkGrowth}`}
                      stroke={trunkColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                )}

                {/* FOLIAGE / CANOPY BY SPECIES */}
                {p > 0.35 && (
                  <g opacity={foliageOpacity} className="transition-opacity duration-700">
                    {/* SPECIES: SAKURA */}
                    {treeType.id === 'sakura' && (
                      <g>
                        <circle cx="150" cy="115" r={36 * canopyGrowth} fill="url(#leaf-grad-sakura)" opacity="0.95" />
                        <circle cx="120" cy="130" r={30 * canopyGrowth} fill="#f472b6" opacity="0.92" />
                        <circle cx="180" cy="130" r={32 * canopyGrowth} fill="#ec4899" opacity="0.92" />
                        <circle cx="135" cy="95" r={26 * canopyGrowth} fill="#fbcfe8" opacity="0.95" />
                        <circle cx="165" cy="95" r={28 * canopyGrowth} fill="#f472b6" opacity="0.95" />
                        {p > 0.8 && (
                          <g className="animate-pulse">
                            <circle cx="110" cy="155" r="3.5" fill="#fdf2f8" />
                            <circle cx="190" cy="155" r="3.5" fill="#fdf2f8" />
                            <circle cx="150" cy="80" r="4" fill="#ffffff" />
                          </g>
                        )}
                      </g>
                    )}

                    {/* SPECIES: PINE */}
                    {treeType.id === 'pine' && (
                      <g>
                        <polygon
                          points={`150,${70 + (1 - p) * 30} ${150 - 55 * canopyGrowth},${150} ${150 + 55 * canopyGrowth},${150}`}
                          fill="#065f46"
                        />
                        <polygon
                          points={`150,${105 + (1 - p) * 20} ${150 - 65 * canopyGrowth},${185} ${150 + 65 * canopyGrowth},${185}`}
                          fill="#047857"
                        />
                        <polygon
                          points={`150,${140 + (1 - p) * 15} ${150 - 75 * canopyGrowth},${220} ${150 + 75 * canopyGrowth},${220}`}
                          fill="#059669"
                        />
                      </g>
                    )}

                    {/* SPECIES: MAPLE */}
                    {treeType.id === 'maple' && (
                      <g>
                        <circle cx="150" cy="115" r={36 * canopyGrowth} fill="url(#leaf-grad-maple)" opacity="0.95" />
                        <circle cx="118" cy="130" r={30 * canopyGrowth} fill="#dc2626" opacity="0.92" />
                        <circle cx="182" cy="130" r={32 * canopyGrowth} fill="#b91c1c" opacity="0.92" />
                        <circle cx="135" cy="95" r={26 * canopyGrowth} fill="#ef4444" opacity="0.95" />
                        <circle cx="165" cy="95" r={28 * canopyGrowth} fill="#f97316" opacity="0.95" />
                      </g>
                    )}

                    {/* SPECIES: PALM */}
                    {treeType.id === 'palm' && (
                      <g>
                        <path d="M150 120 Q105 105 80 135" stroke="#15803d" strokeWidth="8" strokeLinecap="round" fill="none" />
                        <path d="M150 120 Q195 105 220 135" stroke="#16a34a" strokeWidth="8" strokeLinecap="round" fill="none" />
                        <path d="M150 120 Q120 75 95 90" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" fill="none" />
                        <path d="M150 120 Q180 75 205 90" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" fill="none" />
                        <path d="M150 120 Q150 65 150 60" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" fill="none" />
                        {p > 0.75 && (
                          <g>
                            <circle cx="146" cy="126" r="5" fill="#713f12" />
                            <circle cx="154" cy="126" r="5" fill="#854d0e" />
                          </g>
                        )}
                      </g>
                    )}

                    {/* SPECIES: SUNFLOWER */}
                    {treeType.id === 'sunflower' && (
                      <g transform="translate(150 130)">
                        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                          <ellipse
                            key={deg}
                            cx="0"
                            cy={-32 * canopyGrowth}
                            rx={7 * canopyGrowth}
                            ry={18 * canopyGrowth}
                            transform={`rotate(${deg})`}
                            fill="url(#sunflower-grad)"
                          />
                        ))}
                        <circle cx="0" cy="0" r={18 * canopyGrowth} fill="#78350f" />
                        <circle cx="0" cy="0" r={14 * canopyGrowth} fill="#451a03" />
                      </g>
                    )}

                    {/* SPECIES: OAK & DEFAULT */}
                    {treeType.id !== 'sakura' && treeType.id !== 'pine' && treeType.id !== 'maple' && treeType.id !== 'palm' && treeType.id !== 'sunflower' && (
                      <g>
                        <circle cx="150" cy="115" r={38 * canopyGrowth} fill="url(#leaf-grad-green)" opacity="0.95" />
                        <circle cx="116" cy="132" r={32 * canopyGrowth} fill="#059669" opacity="0.9" />
                        <circle cx="184" cy="132" r={34 * canopyGrowth} fill="#047857" opacity="0.9" />
                        <circle cx="134" cy="92" r={28 * canopyGrowth} fill="#10b981" opacity="0.95" />
                        <circle cx="166" cy="92" r={29 * canopyGrowth} fill="#34d399" opacity="0.95" />
                        {/* Red apple fruits when near 100% */}
                        {p > 0.85 && (
                          <g>
                            <circle cx="130" cy="120" r="4.5" fill="#ef4444" />
                            <circle cx="170" cy="125" r="4.5" fill="#ef4444" />
                            <circle cx="150" cy="95" r="4" fill="#ef4444" />
                            <circle cx="185" cy="110" r="3.5" fill="#ef4444" />
                          </g>
                        )}
                      </g>
                    )}
                  </g>
                )}
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
