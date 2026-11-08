import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, Plus, Sparkles, Shield, Flame, Award, BarChart3, 
  Moon, Sun, Trash2, Edit3, X, CheckCircle2, Clock, Globe, TrendingUp, Zap
} from 'lucide-react';

// --- Canvas Confetti Helper ---
const triggerConfetti = (originX = 0.5, originY = 0.5) => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#F43F5E'];
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: originX * canvas.width,
      y: originY * canvas.height,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let remaining = 0;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.alpha -= 0.02;
      p.rotation += p.vRot;

      if (p.alpha > 0) {
        remaining++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (remaining > 0) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  };

  render();
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

const generateMockLogs = () => {
  const logs = {};
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const completedCount = Math.floor(Math.random() * 3);
    logs[dateKey] = {};
    if (completedCount > 0) logs[dateKey]['habit-1'] = true;
    if (completedCount > 1) logs[dateKey]['habit-2'] = true;
  }
  return logs;
};

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    appTitle: 'FocusFlow',
    todayView: 'Today View',
    weeklyView: 'Weekly Overview',
    habitsTab: 'Habits',
    statsTab: 'Stats',
    newHabit: 'New Habit',
    editHabit: 'Edit Habit',
    createHabit: 'Create Habit',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    dailyProgress: 'Daily Progress',
    goalsCrushed: '🎉 All Goals Crushed Today!',
    completedOf: 'of',
    habitsCompleted: 'Habits Completed',
    bestStreak: 'Day Best Streak',
    shieldsReady: 'Rest Shields Ready',
    all: 'All',
    pending: 'Pending',
    completed: 'Completed',
    noHabitsTitle: 'No Habits Found',
    noHabitsDescFilter: 'You have no {filter} habits scheduled for today.',
    noHabitsDescAll: "No goals scheduled for today! Click 'New Habit' to get started.",
    createFirstHabit: 'Create First Habit',
    starterAction: '2-min starter',
    target: 'Target',
    dayStreak: 'day streak',
    restShieldActive: 'Rest Shield active today',
    useRestShield: 'Use Rest Shield to protect streak',
    habitGoal: 'Habit Goal',
    totalCompleted: 'Total Completed',
    longestStreak: 'Longest Streak',
    shieldsUsed: 'Shields Used',
    heatmapTitle: 'Activity Heatmap (Past 12 Weeks)',
    heatmapLegend: 'Green intensity = completion count',
    less: 'Less',
    more: 'More',
    badgesTitle: 'Milestone Badges & Achievements',
    unlocked: 'Unlocked',
    habitGoalTitle: 'Habit Goal Title',
    microHabitLabel: '2-Minute Starter Action (Micro-Habit)',
    microHabitHint: 'Lower entry friction by starting with a tiny action to overcome initial resistance.',
    categoryLabel: 'Category',
    targetTimeLabel: 'Target Time (Optional)',
    repeatDaysLabel: 'Repeat Days',
    confirmDelete: 'Are you sure you want to delete this habit?',
    shieldLimitAlert: 'You have reached the maximum limit of 2 Streak Shields for this month.',
    placeholderTitle: 'e.g. Read 30 mins, Run 5km...',
    placeholderMicro: 'e.g. Put on running shoes, Open 1 page...',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    categories: {
      Health: 'Health & Fitness',
      Mind: 'Mind & Peace',
      Productivity: 'Productivity',
      Custom: 'General / Custom'
    },
    badges: {
      first_step: { name: 'First Step', desc: 'Complete your first habit goal' },
      streak_3: { name: 'Momentum Builder', desc: 'Reach a 3-day active streak' },
      streak_7: { name: '7-Day Warrior', desc: 'Maintain a 7-day streak' },
      shield_user: { name: 'Shield Protector', desc: 'Use a Rest Shield to preserve streak' },
      century: { name: '100 Club', desc: 'Complete 100 total habit instances' },
      master: { name: 'Habit Master', desc: 'Reach a 30-day streak on any habit' }
    }
  },
  he: {
    appTitle: 'פוקוס-פלו',
    todayView: 'מבט יומי',
    weeklyView: 'סקירה שבועית',
    habitsTab: 'הרגלים',
    statsTab: 'סטטיסטיקה',
    newHabit: 'הרגל חדש',
    editHabit: 'עריכת הרגל',
    createHabit: 'צור הרגל',
    saveChanges: 'שמור שינויים',
    cancel: 'ביטול',
    dailyProgress: 'התקדמות יומית',
    goalsCrushed: '🎉 כל היעדים של היום הושלמו!',
    completedOf: 'מתוך',
    habitsCompleted: 'הרגלים הושלמו',
    bestStreak: 'שיא רצף ימים',
    shieldsReady: 'מגיני מנוחה זמינים',
    all: 'הכל',
    pending: 'בהמתנה',
    completed: 'הושלם',
    noHabitsTitle: 'לא נמצאו הרגלים',
    noHabitsDescFilter: 'אין לך הרגלים בסטטוס "{filter}" מתוכננים להיום.',
    noHabitsDescAll: 'אין יעדים מתוכננים להיום! לחץ על "הרגל חדש" כדי להתחיל.',
    createFirstHabit: 'צור הרגל ראשון',
    starterAction: 'צעד התחלתי (2 דק\')',
    target: 'יעד',
    dayStreak: 'ימי רצף',
    restShieldActive: 'מגן מנוחה פעיל היום',
    useRestShield: 'השתמש במגן מנוחה לשמירה על הרצף',
    habitGoal: 'יעד הרגל',
    totalCompleted: 'סה"כ הושלמו',
    longestStreak: 'הרצף הארוך ביותר',
    shieldsUsed: 'מגינים שניצלו',
    heatmapTitle: 'מפת חום של פעילות (12 שבועות אחרונים)',
    heatmapLegend: 'עוצמת הירוק = כמות ההשלמות',
    less: 'פחות',
    more: 'יותר',
    badgesTitle: 'תגי הישג ואותות הצטיינות',
    unlocked: 'פתוח',
    habitGoalTitle: 'כותרת יעד ההרגל',
    microHabitLabel: 'צעד התחלתי של 2 דקות (מיקרו-הרגל)',
    microHabitHint: 'הפחת חיכוך על ידי התחלה בפעולה זעירה כדי להתגבר על ההתנגדות הראשונית.',
    categoryLabel: 'קטגוריה',
    targetTimeLabel: 'זמן יעד (רשות)',
    repeatDaysLabel: 'ימי חזרה',
    confirmDelete: 'האם אתה בטוח שברצונך למחוק הרגל זה?',
    shieldLimitAlert: 'הגעת למגבלת המקסימום של 2 מגיני מנוחה לחודש זה.',
    placeholderTitle: 'לדוגמה: לקרוא 30 דקות, לרוץ 5 ק"מ...',
    placeholderMicro: 'לדוגמה: לשרוך נעלי ריצה, לפתוח עמוד 1...',
    days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    categories: {
      Health: 'בריאות וכושר',
      Mind: 'מיינדפולנס ושקט',
      Productivity: 'פרודוקטיביות',
      Custom: 'כללי / מותאם'
    },
    badges: {
      first_step: { name: 'צעד ראשון', desc: 'השלם את יעד ההרגל הראשון שלך' },
      streak_3: { name: 'בונה תנופה', desc: 'הגע לרצף פעיל של 3 ימים' },
      streak_7: { name: 'לוחם 7 ימים', desc: 'שמור על רצף של 7 ימים' },
      shield_user: { name: 'מאסטר המגן', desc: 'השתמש במגן מנוחה לשמירה על הרצף' },
      century: { name: 'מועדון ה-100', desc: 'השלם 100 השלמות הרגלים מצטברות' },
      master: { name: 'מאסטר ההרגלים', desc: 'הגע לרצף של 30 יום בהרגל כלשהו' }
    }
  }
};

const MICRO_HABIT_SUGGESTIONS = {
  en: {
    'Run 5km': 'Put on running shoes & step outside',
    'Read 30 mins': 'Read 1 page of a book',
    'Meditate 15 mins': 'Take 3 deep conscious breaths',
    'Drink 2L Water': 'Drink 1 glass of water now',
    'Write Daily Journal': 'Write 1 sentence about today'
  },
  he: {
    'לרוץ 5 ק"מ': 'ללבוש נעלי ריצה ולצאת החוצה',
    'לקרוא 30 דקות': 'לקרוא עמוד אחד בספר',
    'מדיטציה 15 דקות': 'לקחת 3 נשימות עמוקות ומודעות',
    'לשתות 2 ליטר מים': 'לשתות כוס מים אחת עכשיו',
    'כתיבת יומן יומי': 'לכתוב משפט אחד על היום'
  }
};

const CATEGORIES = [
  { id: 'Health', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { id: 'Mind', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  { id: 'Productivity', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { id: 'Custom', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
];

const INITIAL_HABITS = [
  {
    id: 'habit-1',
    title: 'Morning Jog & Cardio',
    titleHe: 'ריצת בוקר ואימון אירובי',
    microHabit: 'Put on running shoes & step outside',
    microHabitHe: 'ללבוש נעלי ריצה ולצאת החוצה',
    category: 'Health',
    targetTime: '07:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    streak: 6,
    shieldsUsedThisMonth: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'habit-2',
    title: 'Read Non-Fiction Book',
    titleHe: 'קריאת ספר עיון',
    microHabit: 'Read 1 page of a chapter',
    microHabitHe: 'לקרוא עמוד אחד בפרק',
    category: 'Mind',
    targetTime: '21:30',
    days: [1, 2, 3, 4, 5],
    streak: 12,
    shieldsUsedThisMonth: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'habit-3',
    title: 'Deep Work Session',
    titleHe: 'סשן עבודה ממוקדת',
    microHabit: 'Clear desk & open primary task app',
    microHabitHe: 'לנקות את השולחן ולפתוח את לוח המשימות',
    category: 'Productivity',
    targetTime: '10:00',
    days: [1, 2, 3, 4, 5],
    streak: 3,
    shieldsUsedThisMonth: 0,
    createdAt: new Date().toISOString()
  }
];

const BADGES_CONFIG = [
  { id: 'first_step', icon: '🌱', req: (stats) => stats.totalCompleted >= 1 },
  { id: 'streak_3', icon: '⚡', req: (stats) => stats.maxStreak >= 3 },
  { id: 'streak_7', icon: '🔥', req: (stats) => stats.maxStreak >= 7 },
  { id: 'shield_user', icon: '🛡️', req: (stats) => stats.shieldsUsed >= 1 },
  { id: 'century', icon: '👑', req: (stats) => stats.totalCompleted >= 100 },
  { id: 'master', icon: '🏆', req: (stats) => stats.maxStreak >= 30 }
];

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('tracker_lang') || 'en');
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'he';

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('tracker_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('tracker_logs');
    return saved ? JSON.parse(saved) : generateMockLogs();
  });

  const [activeTab, setActiveTab] = useState('tracker');
  const [viewMode, setViewMode] = useState('today');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    microHabit: '',
    category: 'Health',
    targetTime: '',
    days: [0, 1, 2, 3, 4, 5, 6]
  });

  const todayKey = getTodayKey();
  const currentDayOfWeek = new Date().getDay();

  useEffect(() => {
    localStorage.setItem('tracker_lang', lang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, isRTL]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('tracker_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('tracker_logs', JSON.stringify(logs));
  }, [logs]);

  const handleToggleHabit = (habitId, e) => {
    const isCurrentlyDone = logs[todayKey]?.[habitId] === true;

    if (!isCurrentlyDone && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      triggerConfetti((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight);
    }

    setLogs(prev => {
      const todayLogs = { ...(prev[todayKey] || {}) };
      if (isCurrentlyDone) {
        delete todayLogs[habitId];
      } else {
        todayLogs[habitId] = true;
      }
      return { ...prev, [todayKey]: todayLogs };
    });

    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          streak: isCurrentlyDone ? Math.max(0, h.streak - 1) : h.streak + 1
        };
      }
      return h;
    }));
  };

  const handleUseShield = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (habit.shieldsUsedThisMonth >= 2) {
      alert(t.shieldLimitAlert);
      return;
    }

    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          shieldsUsedThisMonth: (h.shieldsUsedThisMonth || 0) + 1
        };
      }
      return h;
    }));

    setLogs(prev => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [habitId]: 'shielded'
      }
    }));
  };

  const handleOpenAddModal = (habitToEdit = null) => {
    if (habitToEdit) {
      setEditingHabit(habitToEdit);
      setFormData({
        title: isRTL ? (habitToEdit.titleHe || habitToEdit.title) : habitToEdit.title,
        microHabit: isRTL ? (habitToEdit.microHabitHe || habitToEdit.microHabit || '') : (habitToEdit.microHabit || ''),
        category: habitToEdit.category || 'Health',
        targetTime: habitToEdit.targetTime || '',
        days: habitToEdit.days || [0, 1, 2, 3, 4, 5, 6]
      });
    } else {
      setEditingHabit(null);
      setFormData({
        title: '',
        microHabit: '',
        category: 'Health',
        targetTime: '',
        days: [0, 1, 2, 3, 4, 5, 6]
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveHabit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingHabit) {
      setHabits(prev => prev.map(h => h.id === editingHabit.id ? { 
        ...h, 
        title: isRTL ? (h.title || formData.title) : formData.title,
        titleHe: isRTL ? formData.title : (h.titleHe || formData.title),
        microHabit: isRTL ? (h.microHabit || formData.microHabit) : formData.microHabit,
        microHabitHe: isRTL ? formData.microHabit : (h.microHabitHe || formData.microHabit),
        category: formData.category,
        targetTime: formData.targetTime,
        days: formData.days
      } : h));
    } else {
      const newHabit = {
        id: `habit-${Date.now()}`,
        title: formData.title,
        titleHe: formData.title,
        microHabit: formData.microHabit,
        microHabitHe: formData.microHabit,
        category: formData.category,
        targetTime: formData.targetTime,
        days: formData.days,
        streak: 0,
        shieldsUsedThisMonth: 0,
        createdAt: new Date().toISOString()
      };
      setHabits(prev => [...prev, newHabit]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm(t.confirmDelete)) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  const handleTitleChange = (val) => {
    const updated = { ...formData, title: val };
    const suggestions = MICRO_HABIT_SUGGESTIONS[lang] || {};
    const matchedSuggestion = suggestions[val];
    if (matchedSuggestion && !formData.microHabit) {
      updated.microHabit = matchedSuggestion;
    }
    setFormData(updated);
  };

  const todayScheduledHabits = useMemo(() => {
    return habits.filter(h => h.days.includes(currentDayOfWeek));
  }, [habits, currentDayOfWeek]);

  const todayCompletedCount = useMemo(() => {
    const todayLog = logs[todayKey] || {};
    return todayScheduledHabits.filter(h => todayLog[h.id] === true).length;
  }, [todayScheduledHabits, logs, todayKey]);

  const progressPercent = todayScheduledHabits.length > 0 
    ? Math.round((todayCompletedCount / todayScheduledHabits.length) * 100) 
    : 0;

  const filteredHabits = useMemo(() => {
    return todayScheduledHabits.filter(h => {
      const isDone = logs[todayKey]?.[h.id] === true;
      if (filter === 'pending') return !isDone;
      if (filter === 'completed') return isDone;
      return true;
    });
  }, [todayScheduledHabits, logs, todayKey, filter]);

  const overallStats = useMemo(() => {
    let totalCompleted = 0;
    let shieldsUsed = 0;
    let maxStreak = 0;

    Object.values(logs).forEach(dayLog => {
      Object.values(dayLog).forEach(val => {
        if (val === true) totalCompleted++;
      });
    });

    habits.forEach(h => {
      shieldsUsed += (h.shieldsUsedThisMonth || 0);
      if (h.streak > maxStreak) maxStreak = h.streak;
    });

    return { totalCompleted, shieldsUsed, maxStreak };
  }, [logs, habits]);

  const currentWeekDays = useMemo(() => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.setDate(first + i));
      const key = next.toISOString().split('T')[0];
      week.push({
        dayName: t.days[i],
        dateNum: next.getDate(),
        key,
        isToday: key === todayKey
      });
    }
    return week;
  }, [todayKey, t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">

        {/* --- HEADER --- */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Zap className="w-6 h-6" />
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t.appTitle}</h1>
              </div>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {new Date().toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                title="Switch Language"
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'en' ? 'עברית 🇮🇱' : 'English 🇺🇸'}</span>
              </button>

              <div className="bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => setActiveTab('tracker')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                    activeTab === 'tracker'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.habitsTab}</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{t.statsTab}</span>
                </button>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-emerald-100 text-xs uppercase tracking-wider font-bold">{t.dailyProgress}</span>
                <h2 className="text-2xl font-bold mt-0.5">
                  {progressPercent === 100 
                    ? t.goalsCrushed 
                    : `${todayCompletedCount} ${t.completedOf} ${todayScheduledHabits.length} ${t.habitsCompleted}`}
                </h2>
              </div>
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{overallStats.maxStreak} {t.bestStreak}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Shield className="w-4 h-4 text-cyan-200" />
                  <span>{t.shieldsReady}</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </header>

        {/* --- MAIN TAB CONTENT --- */}
        {activeTab === 'tracker' ? (
          <main>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl flex text-xs font-medium border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setViewMode('today')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === 'today'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {t.todayView}
                  </button>
                  <button
                    onClick={() => setViewMode('weekly')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === 'weekly'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {t.weeklyView}
                  </button>
                </div>

                {viewMode === 'today' && (
                  <div className="hidden md:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800">
                    {['all', 'pending', 'completed'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-2.5 py-1.5 rounded-lg capitalize transition-all ${
                          filter === f
                            ? 'bg-emerald-500 text-white font-bold shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {t[f]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenAddModal()}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newHabit}</span>
              </button>
            </div>

            {viewMode === 'today' && (
              <div>
                <div className="flex md:hidden items-center justify-around bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl text-xs font-medium mb-4 border border-slate-200 dark:border-slate-800">
                  {['all', 'pending', 'completed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-1.5 rounded-lg capitalize text-center transition-all ${
                        filter === f
                          ? 'bg-emerald-500 text-white font-bold shadow-sm'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {t[f]}
                    </button>
                  ))}
                </div>

                {filteredHabits.length === 0 ? (
                  <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">{t.noHabitsTitle}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                      {filter !== 'all' 
                        ? t.noHabitsDescFilter.replace('{filter}', String(t[filter] || filter))
                        : t.noHabitsDescAll}
                    </p>
                    <button
                      onClick={() => handleOpenAddModal()}
                      className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      <Plus className="w-4 h-4" /> {t.createFirstHabit}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHabits.map(habit => {
                      const isDone = logs[todayKey]?.[habit.id] === true;
                      const isShielded = logs[todayKey]?.[habit.id] === 'shielded';
                      const categoryObj = CATEGORIES.find(c => c.id === habit.category) || CATEGORIES[3];
                      const titleText = isRTL ? (habit.titleHe || habit.title) : habit.title;
                      const microText = isRTL ? (habit.microHabitHe || habit.microHabit) : habit.microHabit;

                      return (
                        <div
                          key={habit.id}
                          className={`group relative p-4 md:p-5 rounded-2xl border transition-all duration-200 ${
                            isDone 
                              ? 'bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/30' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                              <button
                                onClick={(e) => handleToggleHabit(habit.id, e)}
                                className={`mt-0.5 md:mt-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-75 ${
                                  isDone
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/40 scale-105'
                                    : 'border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-transparent'
                                }`}
                                aria-label="Toggle Completion"
                              >
                                {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h3 className={`font-bold text-base md:text-lg leading-tight truncate ${
                                    isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                  }`}>
                                    {titleText}
                                  </h3>
                                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${categoryObj.color}`}>
                                    {t.categories[categoryObj.id]}
                                  </span>
                                </div>

                                {microText && (
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span className="italic">{t.starterAction}: "{microText}"</span>
                                  </div>
                                )}

                                {habit.targetTime && (
                                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{t.target}: {habit.targetTime}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold border border-amber-500/20">
                                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>{habit.streak} {isRTL ? 'ימים' : 'd'}</span>
                              </div>

                              <button
                                onClick={() => handleUseShield(habit.id)}
                                title={isShielded ? t.restShieldActive : t.useRestShield}
                                className={`p-2 rounded-xl text-xs transition-colors border ${
                                  isShielded
                                    ? 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/10 border-transparent'
                                }`}
                              >
                                <Shield className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenAddModal(habit)}
                                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteHabit(habit.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'weekly' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 overflow-x-auto">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className={`py-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t.habitGoal}</th>
                        {currentWeekDays.map(d => (
                          <th key={d.key} className="py-3 px-2 text-center">
                            <div className={`text-xs font-semibold ${d.isToday ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                              {d.dayName}
                            </div>
                            <div className={`text-sm ${d.isToday ? 'w-6 h-6 mx-auto rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center' : ''}`}>
                              {d.dateNum}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {habits.map(habit => {
                        const titleText = isRTL ? (habit.titleHe || habit.title) : habit.title;
                        return (
                          <tr key={habit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-3 px-3">
                              <div className="font-semibold text-sm">{titleText}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-500" /> {habit.streak} {t.dayStreak}
                              </div>
                            </td>
                            {currentWeekDays.map(d => {
                              const isDone = logs[d.key]?.[habit.id] === true;
                              const isShield = logs[d.key]?.[habit.id] === 'shielded';

                              return (
                                <td key={d.key} className="py-3 px-2 text-center">
                                  {isDone ? (
                                    <div className="w-7 h-7 mx-auto rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                  ) : isShield ? (
                                    <div className="w-7 h-7 mx-auto rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
                                      <Shield className="w-3.5 h-3.5" />
                                    </div>
                                  ) : (
                                    <div className="w-7 h-7 mx-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50" />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        ) : (
          <main className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.totalCompleted}</span>
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-500 mt-1">
                  {overallStats.totalCompleted}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.longestStreak}</span>
                <div className="text-2xl md:text-3xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
                  <Flame className="w-6 h-6 fill-amber-500" />
                  {overallStats.maxStreak}{isRTL ? ' ימים' : 'd'}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.shieldsUsed}</span>
                <div className="text-2xl md:text-3xl font-extrabold text-cyan-500 mt-1 flex items-center gap-1">
                  <Shield className="w-6 h-6" />
                  {overallStats.shieldsUsed}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  {t.heatmapTitle}
                </h3>
                <span className="text-xs text-slate-400">{t.heatmapLegend}</span>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px]">
                  {Array.from({ length: 84 }).map((_, idx) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (83 - idx));
                    const dateKey = d.toISOString().split('T')[0];
                    const dayLogs = logs[dateKey] || {};
                    const count = Object.values(dayLogs).filter(v => v === true).length;

                    let colorClass = 'bg-slate-100 dark:bg-slate-800';
                    if (count === 1) colorClass = 'bg-emerald-300 dark:bg-emerald-800';
                    else if (count === 2) colorClass = 'bg-emerald-400 dark:bg-emerald-600';
                    else if (count >= 3) colorClass = 'bg-emerald-500 dark:bg-emerald-500';

                    return (
                      <div
                        key={dateKey}
                        title={`${dateKey}: ${count} ${t.habitsCompleted}`}
                        className={`w-3.5 h-3.5 rounded-sm ${colorClass} transition-all hover:ring-2 hover:ring-emerald-400 cursor-pointer`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 text-xs text-slate-400 mt-3">
                <span>{t.less}</span>
                <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
                <span>{t.more}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                {t.badgesTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {BADGES_CONFIG.map(badge => {
                  const unlocked = badge.req(overallStats);
                  const badgeText = t.badges[badge.id] || { name: '', desc: '' };
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        unlocked
                          ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                          : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60 grayscale'
                      }`}
                    >
                      <div className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        {badge.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm">{badgeText.name}</h4>
                          {unlocked && (
                            <span className="text-[10px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-md uppercase">
                              {t.unlocked}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {badgeText.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* --- ADD / EDIT HABIT MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full`}
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                {editingHabit ? t.editHabit : t.newHabit}
              </h2>

              <form onSubmit={handleSaveHabit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t.habitGoalTitle}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.placeholderTitle}
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t.microHabitLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.placeholderMicro}
                    value={formData.microHabit}
                    onChange={(e) => setFormData({ ...formData, microHabit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {t.microHabitHint}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t.categoryLabel}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{t.categories[c.id]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {t.targetTimeLabel}
                    </label>
                    <input
                      type="time"
                      value={formData.targetTime}
                      onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t.repeatDaysLabel}
                  </label>
                  <div className="flex justify-between gap-1">
                    {t.days.map((day, idx) => {
                      const selected = formData.days.includes(idx);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const newDays = selected
                              ? formData.days.filter(d => d !== idx)
                              : [...formData.days, idx];
                            setFormData({ ...formData, days: newDays });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                            selected
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {day[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                  >
                    {editingHabit ? t.saveChanges : t.createHabit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}