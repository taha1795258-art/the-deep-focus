import { TreeType, SoundOption, AmbientSoundType, TaskCategory } from '../types';

export const TREE_TYPES: TreeType[] = [
  {
    id: 'oak',
    nameAr: 'شجرة السنديان العريقة',
    nameEn: 'Mighty Oak Tree',
    minMinutes: 10,
    color: '#16a34a',
    icon: '🌳',
  },
  {
    id: 'pine',
    nameAr: 'صنوبر الألب الأخضر',
    nameEn: 'Alpine Pine',
    minMinutes: 15,
    color: '#059669',
    icon: '🌲',
  },
  {
    id: 'sakura',
    nameAr: 'شجرة الساكورا الوردية',
    nameEn: 'Pink Cherry Blossom',
    minMinutes: 25,
    color: '#ec4899',
    icon: '🌸',
  },
  {
    id: 'palm',
    nameAr: 'نخلة الواحة الذهبية',
    nameEn: 'Golden Oasis Palm',
    minMinutes: 20,
    color: '#eab308',
    icon: '🌴',
  },
  {
    id: 'bonsai',
    nameAr: 'شجرة البونساي المتأملة',
    nameEn: 'Zen Bonsai',
    minMinutes: 5,
    color: '#10b981',
    icon: '🪴',
  },
  {
    id: 'maple',
    nameAr: 'قيقب الخريف الأحمر',
    nameEn: 'Autumn Maple',
    minMinutes: 30,
    color: '#dc2626',
    icon: '🍁',
  },
  {
    id: 'sunflower',
    nameAr: 'زهرة عباد الشمس المشرقة',
    nameEn: 'Sunny Sunflower',
    minMinutes: 15,
    color: '#f59e0b',
    icon: '🌻',
  },
];

export const CATEGORIES: { id: TaskCategory; nameAr: string; nameEn: string; icon: string; color: string }[] = [
  { id: 'study', nameAr: 'دراسة ومذاكرة', nameEn: 'Study', icon: '📚', color: '#3b82f6' },
  { id: 'work', nameAr: 'عمل ومشاريع', nameEn: 'Work', icon: '💼', color: '#10b981' },
  { id: 'code', nameAr: 'برمجة وتطوير', nameEn: 'Coding', icon: '💻', color: '#8b5cf6' },
  { id: 'reading', nameAr: 'قراءة واطلاع', nameEn: 'Reading', icon: '📖', color: '#f59e0b' },
  { id: 'health', nameAr: 'صحة وتأمل', nameEn: 'Health & Zen', icon: '🧘', color: '#06b6d4' },
  { id: 'other', nameAr: 'عام ومتنوع', nameEn: 'General', icon: '✨', color: '#64748b' },
];

export const AMBIENT_SOUNDS: { id: AmbientSoundType; nameAr: string; nameEn: string; icon: string }[] = [
  { id: 'none', nameAr: 'صامت (بدون خلفية)', nameEn: 'Silent', icon: '🔇' },
  { id: 'rain', nameAr: 'صوت المطر الهادئ', nameEn: 'Gentle Rain', icon: '🌧️' },
  { id: 'birds', nameAr: 'عصافير الغابة', nameEn: 'Forest Birds', icon: '🐦' },
  { id: 'wind', nameAr: 'حفيف الرياح', nameEn: 'Leaves & Wind', icon: '🍃' },
  { id: 'campfire', nameAr: 'دفء موقد الحطب', nameEn: 'Campfire', icon: '🔥' },
  { id: 'whitenoise', nameAr: 'ضجيج أبيض مهدئ', nameEn: 'White Noise', icon: '🌊' },
];

export const SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'classic-bell',
    nameAr: 'جرس نحاسي كلاسيكي',
    nameEn: 'Classic Brass Bell',
    descriptionAr: 'رنين نحاسي نقي ومميز لجلسات بومودورو التقليدية',
    descriptionEn: 'Pure and distinct metallic chime for classic pomodoro',
  },
  {
    id: 'school-bell',
    nameAr: 'جرس المدرسة الرنان',
    nameEn: 'School Electric Bell',
    descriptionAr: 'دقات تنبيهية متكررة قوية ومستمرة تنبهك فورًا',
    descriptionEn: 'Vibrant school bell hammer rings that instantly alert you',
  },
  {
    id: 'zen-bowl',
    nameAr: 'وعاء التبت التوافقي (زن)',
    nameEn: 'Tibetan Singing Bowl',
    descriptionAr: 'نغمة عميقة وهادئة مع ترددات استرخائية',
    descriptionEn: 'Deep harmonic resonant bowl with soothing decay',
  },
  {
    id: 'crystal-chime',
    nameAr: 'رنين الأجراس الكريستالية',
    nameEn: 'Crystal Chimes',
    descriptionAr: 'نغمات متتالية رقيقة ومنعشة لإنهاء الجلسة بلطف',
    descriptionEn: 'Gentle cascading tones for peaceful session transitions',
  },
  {
    id: 'digital-alarm',
    nameAr: 'منبه رقمي إيقاعي',
    nameEn: 'Digital Rhythmic Alert',
    descriptionAr: 'نغمات تنبيهية واضحة تضمن انتباهك الفوري',
    descriptionEn: 'Clear rhythmic beeps ensuring immediate attention',
  },
];
