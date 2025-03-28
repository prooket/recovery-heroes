export type Language = 'en' | 'ar';

export const translations = {
  en: {
    appTitle: 'Recovery Heroes 🎯',
    home: 'Home',
    history: 'History',
    journal: 'Journal',
    tasks: 'Tasks',
    cleanDays: 'Victory Streak 🔥',
    startDate: 'Started Recovery',
    bestStreak: 'Best Streak',
    clean: 'Clean',
    slips: 'Slips',
    relapses: 'Relapses',
    dailyCheckin: 'How was your day today?',
    stayedClean: 'I stayed clean',
    hadSlip: 'It was a slip',
    hadRelapse: 'I had a relapse',
    resetCheckin: "Reset Today's Check-in",
    resetProgress: 'Reset Progress',
    resetConfirm: 'Are you sure you want to reset all progress? This cannot be undone.',
    progressFor: 'Your Progress for',
    newTask: 'New task name...',
    writeThoughts: 'Write your thoughts for today...',
    saveEntry: 'Save Entry',
    deleteTask: 'Delete task',
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    notifications: {
      clean: 'Great job staying clean today! Keep going strong! 💪',
      slip: 'Remember, a slip is not a fall. Get back up and keep going! 🌟',
      relapse: 'Every new day is a fresh start. You\'re stronger than you think! ❤️'
    },
    defaultTasks: [
      'Praying',
      'Reading',
      'Hobbies',
      'Talking to friends',
      'Other custom tasks'
    ],
    login: 'Login',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    welcome: 'Welcome',
    logout: 'Logout',
    invalidCredentials: 'Invalid username or password'
  },
  ar: {
    appTitle: 'أبطال التعافي 🎯',
    home: 'الرئيسية',
    history: 'السجل',
    journal: 'المذكرات',
    tasks: 'المهام',
    cleanDays: 'سلسلة الانتصارات 🔥',
    startDate: 'بدء التعافي',
    bestStreak: 'أفضل سلسلة',
    clean: 'نظيف',
    slips: 'زلات',
    relapses: 'انتكاسات',
    dailyCheckin: 'كيف كان يومك اليوم؟',
    stayedClean: 'بقيت نظيفاً',
    hadSlip: 'كانت زلة',
    hadRelapse: 'حدثت انتكاسة',
    resetCheckin: 'إعادة تسجيل اليوم',
    resetProgress: 'إعادة تعيين التقدم',
    resetConfirm: 'هل أنت متأكد من إعادة تعيين كل التقدم؟ لا يمكن التراجع عن هذا.',
    progressFor: 'تقدمك لشهر',
    newTask: 'اسم المهمة الجديدة...',
    writeThoughts: 'اكتب أفكارك لليوم...',
    saveEntry: 'حفظ المدخل',
    deleteTask: 'حذف المهمة',
    weekDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    notifications: {
      clean: 'عمل رائع في البقاء نظيفاً اليوم! استمر قوياً! 💪',
      slip: 'تذكر، الزلة ليست سقوطاً. انهض واستمر! 🌟',
      relapse: 'كل يوم جديد هو بداية جديدة. أنت أقوى مما تعتقد! ❤️'
    },
    defaultTasks: [
      'الصلاة',
      'القراءة',
      'الهوايات',
      'التحدث مع الأصدقاء',
      'مهام مخصصة أخرى'
    ],
    login: 'تسجيل الدخول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    welcome: 'مرحباً',
    logout: 'تسجيل الخروج',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة'
  }
} as const;

export type TranslationKey = keyof typeof translations.en;