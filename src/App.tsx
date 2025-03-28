import React, { useState, useEffect } from 'react';
import { CheckCircle2, Book as JournalBook, ListTodo, Moon, Plus, ChevronDown, Calendar, ChevronLeft, ChevronRight, Trash2, Trophy, Zap, AlertTriangle, LogOut } from 'lucide-react';
import { User, DayStatus, CalendarDay, JournalEntry, Task, UserData } from './types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfDay, isSameMonth, addMonths, subMonths, differenceInDays, parseISO } from 'date-fns';
import { translations, Language } from './translations';

// Helper function to safely parse dates from localStorage
const parseDates = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      date: new Date(item.date)
    }));
  }
  return [];
};

const defaultUsers: User[] = [
  {
    id: '1',
    username: 'yassin',
    password: '123',
    name: 'Yassin',
    cleanDays: 0,
    slips: 0,
    relapses: 0,
    startDate: null,
    currentStreak: 0,
    bestStreak: 0
  },
  {
    id: '2',
    username: 'ahmed',
    password: '123',
    name: 'Ahmed',
    cleanDays: 0,
    slips: 0,
    relapses: 0,
    startDate: null,
    currentStreak: 0,
    bestStreak: 0
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });
  const t = translations[language];
  const isRTL = language === 'ar';

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  // Initialize state with data from localStorage
  const initializeUserData = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const username = parsedUser.username;
      const savedData = localStorage.getItem(`userData_${username}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          user: {
            ...parsed.user,
            startDate: parsed.user.startDate ? new Date(parsed.user.startDate) : null
          },
          historyCalendarDays: parseDates(parsed.historyCalendarDays),
          journalEntries: parseDates(parsed.journalEntries),
          tasks: parsed.tasks,
          lastCheckinDate: parsed.lastCheckinDate ? new Date(parsed.lastCheckinDate) : null
        };
      }
    }
    return null;
  };

  const initialData = initializeUserData();

  const [currentUser, setCurrentUser] = useState<User | null>(() => initialData?.user || null);
  const [historyCalendarDays, setHistoryCalendarDays] = useState<CalendarDay[]>(() => initialData?.historyCalendarDays || []);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => initialData?.journalEntries || []);
  const [tasks, setTasks] = useState<Task[]>(() => initialData?.tasks || []);
  const [lastCheckinDate, setLastCheckinDate] = useState<Date | null>(() => initialData?.lastCheckinDate || null);

  const [loginError, setLoginError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [newJournalEntry, setNewJournalEntry] = useState('');
  const [newJournalStatus, setNewJournalStatus] = useState<DayStatus>('clean');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showDailyCheckin, setShowDailyCheckin] = useState(true);
  const [newTaskName, setNewTaskName] = useState('');

  // Save user data to localStorage
  const saveUserData = () => {
    if (currentUser) {
      const userData: UserData = {
        user: currentUser,
        historyCalendarDays,
        journalEntries,
        tasks,
        lastCheckinDate
      };
      localStorage.setItem(`userData_${currentUser.username}`, JSON.stringify(userData));
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  };

  // Save data whenever it changes
  useEffect(() => {
    saveUserData();
  }, [currentUser, historyCalendarDays, journalEntries, tasks, lastCheckinDate]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (!isAuthenticated) {
      localStorage.removeItem('currentUser');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (lastCheckinDate) {
      const lastCheckinDay = startOfDay(lastCheckinDate);
      const today = startOfDay(new Date());
      setShowDailyCheckin(!isSameDay(lastCheckinDay, today));
    }
  }, [lastCheckinDate]);

  useEffect(() => {
    setTasks(prevTasks => {
      const defaultTaskMap = new Map(t.defaultTasks.map((name, index) => [(index + 1).toString(), name]));
      return prevTasks.map(task => ({
        ...task,
        name: defaultTaskMap.get(task.id) || task.name
      }));
    });
  }, [language]);

  const handleLogin = () => {
    const user = defaultUsers.find(u => u.username === username && u.password === password);
    if (user) {
      const userData = loadUserData(user.username) || {
        user,
        historyCalendarDays: [],
        journalEntries: [],
        tasks: t.defaultTasks.map((name, index) => ({
          id: (index + 1).toString(),
          name,
          completed: false,
          importance: 2
        })),
        lastCheckinDate: null
      };

      setCurrentUser(userData.user);
      setHistoryCalendarDays(userData.historyCalendarDays);
      setJournalEntries(userData.journalEntries);
      setTasks(userData.tasks);
      setLastCheckinDate(userData.lastCheckinDate);
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setHistoryCalendarDays([]);
    setJournalEntries([]);
    setTasks([]);
    setLastCheckinDate(null);
    setActiveTab('home');
  };

  // Load user data from localStorage
  const loadUserData = (username: string) => {
    const savedData = localStorage.getItem(`userData_${username}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const userData: UserData = {
        user: {
          ...parsed.user,
          startDate: parsed.user.startDate ? new Date(parsed.user.startDate) : null
        },
        historyCalendarDays: parseDates(parsed.historyCalendarDays),
        journalEntries: parseDates(parsed.journalEntries),
        tasks: parsed.tasks,
        lastCheckinDate: parsed.lastCheckinDate ? new Date(parsed.lastCheckinDate) : null
      };
      return userData;
    }
    return null;
  };

  const calculateStreak = (startDate: Date | null) => {
    if (!startDate) return 0;
    const today = new Date();
    const start = startOfDay(startDate);
    const daysSinceStart = differenceInDays(today, start);
    return Math.max(0, daysSinceStart);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value ? parseISO(event.target.value) : null;
    setCurrentUser(prev => {
      if (!prev) return null;
      const newStreak = calculateStreak(newDate);
      return {
        ...prev,
        startDate: newDate,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak)
      };
    });
  };

  const updateStreak = (status: DayStatus, date: Date) => {
    setCurrentUser(user => {
      if (!user) return null;
      const newUser = { ...user };

      if (status === 'clean') {
        if (!user.startDate) {
          newUser.startDate = new Date();
          newUser.currentStreak = 1;
        }
        
        if (newUser.currentStreak > user.bestStreak) {
          newUser.bestStreak = newUser.currentStreak;
        }
      } else if (status === 'relapse') {
        newUser.currentStreak = 0;
        newUser.startDate = null;
        newUser.relapses += 1;
      } else if (status === 'slip') {
        newUser.slips += 1;
      }

      return newUser;
    });
  };

  const updateStatus = (status: DayStatus | null, date: Date) => {
    if (status !== null) {
      updateStreak(status, date);
      
      setNotificationMessage(t.notifications[status]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
      setLastCheckinDate(new Date());
      setShowDailyCheckin(false);
    }
  };

  const updateHistoryStatus = (status: DayStatus | null, date: Date) => {
    const updatedDays = [...historyCalendarDays];
    const existingDayIndex = updatedDays.findIndex(day => 
      isSameDay(day.date, date)
    );

    if (status === null) {
      if (existingDayIndex >= 0) {
        updatedDays.splice(existingDayIndex, 1);
      }
    } else {
      if (existingDayIndex >= 0) {
        updatedDays[existingDayIndex].status = status;
      } else {
        updatedDays.push({ date, status });
      }
    }

    setHistoryCalendarDays(updatedDays);
  };

  const getNextStatus = (currentDay: CalendarDay | undefined): DayStatus | null => {
    if (!currentDay) return 'clean';
    if (currentDay.status === 'clean') return 'slip';
    if (currentDay.status === 'slip') return 'relapse';
    if (currentDay.status === 'relapse') return null;
    return 'clean';
  };

  const resetProgress = () => {
    if (confirm(t.resetConfirm)) {
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          cleanDays: 0,
          slips: 0,
          relapses: 0,
          startDate: null,
          currentStreak: 0,
          bestStreak: 0
        };
      });
      setLastCheckinDate(null);
      setShowDailyCheckin(true);
    }
  };

  const resetDailyCheckin = () => {
    setShowDailyCheckin(true);
    setLastCheckinDate(null);
  };

  const addJournalEntry = () => {
    if (newJournalEntry.trim()) {
      const title = newJournalStatus === 'clean' ? '🟢 ' + t.clean :
                   newJournalStatus === 'slip' ? '🟠 ' + t.slips :
                   '🔴 ' + t.relapses;
      
      setJournalEntries([
        {
          date: new Date(),
          content: newJournalEntry.trim(),
          status: newJournalStatus,
          title
        },
        ...journalEntries
      ]);
      setNewJournalEntry('');
      setNewJournalStatus('clean');
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addNewTask = () => {
    if (newTaskName.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          name: newTaskName.trim(),
          completed: false,
          importance: 2
        }
      ]);
      setNewTaskName('');
    }
  };

  const getMonthStats = (date: Date) => {
    return historyCalendarDays
      .filter(day => isSameMonth(day.date, date))
      .reduce((acc, day) => {
        if (day.status === 'clean') acc.cleanDays++;
        if (day.status === 'slip') acc.slips++;
        if (day.status === 'relapse') acc.relapses++;
        return acc;
      }, { cleanDays: 0, slips: 0, relapses: 0 });
  };

  const renderMonthStats = (date: Date) => {
    const stats = getMonthStats(date);
    return (
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-success/10 rounded-lg p-4 text-center">
          <h4 className="text-success font-semibold mb-1">{t.clean}</h4>
          <p className="text-2xl font-bold text-success">{stats.cleanDays}</p>
        </div>
        <div className="bg-warning/10 rounded-lg p-4 text-center">
          <h4 className="text-warning font-semibold mb-1">{t.slips}</h4>
          <p className="text-2xl font-bold text-warning">{stats.slips}</p>
        </div>
        <div className="bg-error/10 rounded-lg p-4 text-center">
          <h4 className="text-error font-semibold mb-1">{t.relapses}</h4>
          <p className="text-2xl font-bold text-error">{stats.relapses}</p>
        </div>
      </div>
    );
  };

  const renderCalendar = (date: Date, showTitle = true) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="space-y-4">
        {showTitle && (
          <h3 className="text-xl font-semibold text-primary">
            {t.progressFor} {format(date, 'MMMM yyyy')}
          </h3>
        )}
        <div className="bg-surface rounded-lg p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {t.weekDays.map(day => (
              <div key={day} className="text-xs font-medium text-primary/70">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const calendarDay = historyCalendarDays.find(cDay => 
                isSameDay(cDay.date, day)
              );
              let bgColor = 'bg-surface';
              if (calendarDay) {
                bgColor = calendarDay.status === 'clean' ? 'bg-success/20' :
                          calendarDay.status === 'slip' ? 'bg-warning/60' :
                          'bg-error/40';
              }
              return (
                <button
                  key={index}
                  className={`aspect-square rounded-full ${bgColor} flex items-center justify-center`}
                  onClick={() => {
                    const nextStatus = getNextStatus(calendarDay);
                    updateHistoryStatus(nextStatus, day);
                  }}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">{t.cleanDays}</h2>
                <p className="text-6xl font-bold text-on-surface">{currentUser?.currentStreak || 0}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy size={20} className="text-primary" />
                    <h3 className="text-primary font-semibold">{t.bestStreak}</h3>
                  </div>
                  <p className="text-2xl font-bold text-center text-on-surface">{currentUser?.bestStreak || 0}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar size={20} className="text-primary" />
                    <h3 className="text-primary font-semibold">{t.startDate}</h3>
                  </div>
                  <input
                    type="date"
                    value={currentUser?.startDate ? format(currentUser.startDate, 'yyyy-MM-dd') : ''}
                    onChange={handleStartDateChange}
                    className="w-full bg-surface text-on-surface p-2 rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-warning/10 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle size={20} className="text-warning" />
                    <h3 className="text-warning font-semibold">{t.slips}</h3>
                  </div>
                  <p className="text-2xl font-bold text-center text-warning">{currentUser?.slips || 0}</p>
                </div>
                <div className="bg-error/10 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap size={20} className="text-error" />
                    <h3 className="text-error font-semibold">{t.relapses}</h3>
                  </div>
                  <p className="text-2xl font-bold text-center text-error">{currentUser?.relapses || 0}</p>
                </div>
              </div>
            </div>

            {showDailyCheckin ? (
              <div className="bg-surface rounded-lg p-4">
                <h3 className="text-xl font-semibold text-on-surface mb-4">{t.dailyCheckin}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    className="bg-success/90 text-on-surface py-3 px-4 rounded-lg hover:bg-success transition-colors flex items-center justify-center font-medium"
                    onClick={() => updateStatus('clean', new Date())}
                  >
                    {t.stayedClean}
                  </button>
                  <button 
                    className="bg-warning/90 text-on-surface py-3 px-4 rounded-lg hover:bg-warning transition-colors flex items-center justify-center font-medium"
                    onClick={() => updateStatus('slip', new Date())}
                  >
                    {t.hadSlip}
                  </button>
                  <button 
                    className="bg-error/90 text-on-surface py-3 px-4 rounded-lg hover:bg-error transition-colors flex items-center justify-center font-medium"
                    onClick={() => updateStatus('relapse', new Date())}
                  >
                    {t.hadRelapse}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="w-full bg-surface border border-primary/30 text-primary py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors font-medium"
                onClick={resetDailyCheckin}
              >
                {t.resetCheckin}
              </button>
            )}

            <button 
              className="w-full bg-surface border border-primary/30 text-primary py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors font-medium"
              onClick={resetProgress}
            >
              {t.resetProgress}
            </button>

            {showNotification && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-surface px-6 py-3 rounded-lg shadow-lg border border-primary/30 text-on-surface animate-fade-in">
                {notificationMessage}
              </div>
            )}
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">{t.history}</h2>
            <div className="bg-surface rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedMonth(date => subMonths(date, 1))}
                  className="p-2 hover:bg-primary/20 rounded-full"
                >
                  <ChevronLeft size={24} />
                </button>
                <h3 className="text-xl font-semibold">
                  {format(selectedMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={() => setSelectedMonth(date => addMonths(date, 1))}
                  className="p-2 hover:bg-primary/20 rounded-full"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              {renderCalendar(selectedMonth, false)}
              {renderMonthStats(selectedMonth)}
            </div>
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">{t.journal}</h2>
            <div className="bg-surface rounded-lg p-4">
              <div className="relative mb-4">
                <select
                  value={newJournalStatus}
                  onChange={(e) => setNewJournalStatus(e.target.value as DayStatus)}
                  className={`w-full appearance-none py-2 px-4 pr-10 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    newJournalStatus === 'clean' ? 'bg-success/20 text-success' :
                    newJournalStatus === 'slip' ? 'bg-warning/60 text-warning' :
                    'bg-error/40 text-error'
                  }`}
                >
                  <option value="clean" className="bg-surface text-success">🟢 {t.clean}</option>
                  <option value="slip" className="bg-surface text-warning">🟠 {t.slips}</option>
                  <option value="relapse" className="bg-surface text-error">🔴 {t.relapses}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={20} />
              </div>
              <textarea
                className="w-full bg-background text-on-background p-3 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t.writeThoughts}
                value={newJournalEntry}
                onChange={(e) => setNewJournalEntry(e.target.value)}
              />
              <button
                className="mt-3 bg-primary text-on-primary px-4 py-2 rounded-lg w-full font-medium"
                onClick={addJournalEntry}
              >
                {t.saveEntry}
              </button>
            </div>
            <div className="space-y-4">
              {journalEntries.map((entry, index) => (
                <div key={index} className="bg-surface rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <span className="text-primary/70 text-sm">
                      {format(entry.date, 'PPP p')}
                    </span>
                  </div>
                  <p className="text-on-surface whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">{t.tasks}</h2>
            <div className="bg-surface rounded-lg p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 bg-background text-on-background p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={t.newTask}
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
                />
                <button
                  className="bg-primary text-on-primary p-2 rounded-lg"
                  onClick={addNewTask}
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 bg-background/50 p-3 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="w-5 h-5 rounded-md border-2 border-primary/30 checked:bg-primary checked:border-primary focus:ring-primary"
                    />
                    <span className={`flex-1 ${task.completed ? 'line-through text-on-surface/50' : 'text-on-surface'}`}>
                      {task.name}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-error/70 hover:text-error transition-colors p-1"
                      title={t.deleteTask}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-background text-on-background ${isRTL ? 'rtl' : 'ltr'}`}>
        <header className="bg-surface p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">{t.appTitle}</h1>
          <button
            onClick={() => setLanguage(lang => lang === 'en' ? 'ar' : 'en')}
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="bg-surface rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-primary text-center mb-6">{t.login}</h2>
              {loginError && (
                <div className="bg-error/10 text-error p-3 rounded-lg text-center">
                  {t.invalidCredentials}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">{t.username}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-background text-on-background p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">{t.password}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background text-on-background p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-primary text-on-primary py-2 px-4 rounded-lg font-medium"
                >
                  {t.loginButton}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-on-background pb-20 ${isRTL ? 'rtl' : 'ltr'}`}>
      <header className="bg-surface p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">{t.appTitle}</h1>
          <span className="text-primary/70">
            {t.welcome}, {currentUser?.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(lang => lang === 'en' ? 'ar' : 'en')}
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
          <button
            onClick={handleLogout}
            className="text-primary hover:text-primary/80 transition-colors"
            title={t.logout}
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center ${
                activeTab === 'home' ? 'text-primary' : 'text-on-surface/60'
              }`}
            >
              <CheckCircle2 size={24} />
              <span className="text-xs mt-1">{t.home}</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center ${
                activeTab === 'history' ? 'text-primary' : 'text-on-surface/60'
              }`}
            >
              <Calendar size={24} />
              <span className="text-xs mt-1">{t.history}</span>
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex flex-col items-center ${
                activeTab === 'journal' ? 'text-primary' : 'text-on-surface/60'
              }`}
            >
              <JournalBook size={24} />
              <span className="text-xs mt-1">{t.journal}</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex flex-col items-center ${
                activeTab === 'tasks' ? 'text-primary' : 'text-on-surface/60'
              }`}
            >
              <ListTodo size={24} />
              <span className="text-xs mt-1">{t.tasks}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;