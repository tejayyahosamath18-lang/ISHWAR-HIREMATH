import React, { useState, useEffect } from 'react';
import { User, Course, UserProgress, Announcement } from './types';
import { coursesData } from './coursesData';
import Header from './components/Header';
import CourseCard from './components/CourseCard';
import StudentDashboard from './components/StudentDashboard';
import CourseViewer from './components/CourseViewer';
import AdminConsole from './components/AdminConsole';
import LoginModal from './components/LoginModal';
import DataAnalystRoadmap from './components/DataAnalystRoadmap';
import SecondPucSection from './components/SecondPucSection';
import SecondPucOldSection from './components/SecondPucOldSection';
import JeeSection from './components/JeeSection';
import { BookOpen, Award, Users, Search, GraduationCap, CheckCircle, Sparkles, Mail, ShieldCheck, ArrowRight, Palette } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light-blue' | 'dark' | 'ocean'>(() => {
    return (localStorage.getItem('educuria_theme') as any) || 'light-blue';
  });

  // Authentication & session state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  
  // Navigation & View state - Defaulting to 'jee-section' so the user lands straight into the brand-new JEE feature!
  const [activeView, setActiveView] = useState<'catalog' | 'dashboard' | 'admin' | 'course-view' | 'roadmap' | 'puc-section' | 'puc-old-section' | 'jee-section'>('jee-section');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Data states
  const [courses] = useState<Course[]>(coursesData);
  const [progressMap, setProgressMap] = useState<{ [courseId: string]: UserProgress }>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // UI state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Web Development' | 'Artificial Intelligence' | 'Data Science' | 'Computer Science'>('All');
  const [loading, setLoading] = useState(false);

  // Initialize and load session
  useEffect(() => {
    const savedToken = localStorage.getItem('educuria_token');
    const savedUser = localStorage.getItem('educuria_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    fetchAnnouncements();
  }, []);

  // Fetch progress for enrolled courses once user is set
  useEffect(() => {
    if (user && token) {
      user.enrolledCourses.forEach((courseId) => {
        fetchCourseProgress(courseId, token);
      });
      // Auto-set initial view
      if (activeView === 'catalog' && user.enrolledCourses.length > 0) {
        setActiveView('dashboard');
      }
    }
  }, [user, token]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  };

  const fetchCourseProgress = async (courseId: string, authToken: string) => {
    try {
      const res = await fetch(`/api/progress/${courseId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const progressData = await res.json();
        setProgressMap((prev) => ({ ...prev, [courseId]: progressData }));
      }
    } catch (err) {
      console.error(`Failed to load progress for course ${courseId}:`, err);
    }
  };

  const handleLoginSuccess = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('educuria_token', newToken);
    localStorage.setItem('educuria_user', JSON.stringify(newUser));
    setShowLoginModal(false);
    
    if (newUser.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setProgressMap({});
    localStorage.removeItem('educuria_token');
    localStorage.removeItem('educuria_user');
    setActiveView('catalog');
    setSelectedCourseId(null);
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('educuria_user', JSON.stringify(data.user));
        
        // Fetch new progress block
        await fetchCourseProgress(courseId, token);
        
        // Launch course viewer
        setSelectedCourseId(courseId);
        setActiveView('course-view');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLesson = async (lessonId: string) => {
    if (!selectedCourseId) return;

    if (!token) {
      // Local state progress update for Guest Mode
      setProgressMap((prev) => {
        const existing = prev[selectedCourseId] || {
          userId: 'guest',
          courseId: selectedCourseId,
          completedLessons: [],
          quizScores: {},
          updatedAt: new Date().toISOString()
        };
        const completed = [...existing.completedLessons];
        const idx = completed.indexOf(lessonId);
        if (idx > -1) {
          completed.splice(idx, 1);
        } else {
          completed.push(lessonId);
        }
        return {
          ...prev,
          [selectedCourseId]: {
            ...existing,
            completedLessons: completed,
            lastAccessedLessonId: lessonId,
            updatedAt: new Date().toISOString()
          }
        };
      });
      return;
    }

    try {
      const res = await fetch('/api/progress/toggle-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: selectedCourseId, lessonId })
      });

      if (res.ok) {
        const progressData = await res.json();
        setProgressMap((prev) => ({ ...prev, [selectedCourseId]: progressData }));
      }
    } catch (err) {
      console.error('Error toggling lesson completion:', err);
    }
  };

  const handleSubmitQuiz = async (lessonId: string, score: number) => {
    if (!selectedCourseId) return;

    if (!token) {
      // Local state quiz score update for Guest Mode
      setProgressMap((prev) => {
        const existing = prev[selectedCourseId] || {
          userId: 'guest',
          courseId: selectedCourseId,
          completedLessons: [],
          quizScores: {},
          updatedAt: new Date().toISOString()
        };
        return {
          ...prev,
          [selectedCourseId]: {
            ...existing,
            quizScores: {
              ...existing.quizScores,
              [lessonId]: score
            },
            updatedAt: new Date().toISOString()
          }
        };
      });
      return;
    }

    try {
      const res = await fetch('/api/progress/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: selectedCourseId, quizId: lessonId, score })
      });

      if (res.ok) {
        const progressData = await res.json();
        setProgressMap((prev) => ({ ...prev, [selectedCourseId]: progressData }));
      }
    } catch (err) {
      console.error('Error submitting quiz score:', err);
    }
  };

  const handleNavigate = (view: 'catalog' | 'dashboard' | 'admin' | 'roadmap' | 'puc-section' | 'puc-old-section' | 'jee-section') => {
    if (view === 'dashboard' && !user) {
      setShowLoginModal(true);
      return;
    }
    if (view === 'admin' && (!user || user.role !== 'admin')) {
      setActiveView('catalog');
      return;
    }
    setActiveView(view);
    setSelectedCourseId(null);
  };

  const handleSelectCourseFromCard = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveView('course-view');
  };

  // Filter logic for general catalog explorer
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const appBgClass = theme === 'light-blue'
    ? 'min-h-screen bg-[#05112e] text-slate-950 font-sans flex flex-col justify-between'
    : theme === 'ocean'
    ? 'min-h-screen bg-[#030712] text-slate-100 font-sans flex flex-col justify-between'
    : 'min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between';

  const handleThemeChange = (newTheme: 'light-blue' | 'dark' | 'ocean') => {
    setTheme(newTheme);
    localStorage.setItem('educuria_theme', newTheme);
  };

  return (
    <div className={appBgClass}>
      
      {/* UPSIDE RUNNING TEXT EFFECT */}
      <div className="w-full overflow-hidden bg-black py-2.5 border-b border-blue-950 z-50">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex space-x-12 shrink-0 pr-12 text-[11px] font-mono font-extrabold text-white uppercase tracking-widest">
            <span>★ ISHWAR HIREMATH ACADEMY ★ CHOOSE THE BEST TO BE THE BEST ★ ADMISSIONS OPEN FOR ACADEMIC YEAR 2025-2026 ★ ONLINE LECTURES • STUDY MATERIAL • VERIFIED MODEL PAPERS ★ KSEAB 2nd PUC HIGHEST RESULTS HUB ★ EXCELLENCE IN EDUCATION ★ CHOOSE THE BEST TO BE THE BEST ★</span>
          </div>
          <div className="flex space-x-12 shrink-0 pr-12 text-[11px] font-mono font-extrabold text-white uppercase tracking-widest">
            <span>★ ISHWAR HIREMATH ACADEMY ★ CHOOSE THE BEST TO BE THE BEST ★ ADMISSIONS OPEN FOR ACADEMIC YEAR 2025-2026 ★ ONLINE LECTURES • STUDY MATERIAL • VERIFIED MODEL PAPERS ★ KSEAB 2nd PUC HIGHEST RESULTS HUB ★ EXCELLENCE IN EDUCATION ★ CHOOSE THE BEST TO BE THE BEST ★</span>
          </div>
        </div>
      </div>

      {/* Header component */}
      <Header
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        activeView={activeView}
        onNavigate={handleNavigate}
        onSelectCourse={(courseId) => {
          setSelectedCourseId(courseId);
          setActiveView('course-view');
        }}
        onSelectRoadmapSection={(sectionId) => {
          setActiveView('roadmap');
          localStorage.setItem('educuria_roadmap_target_section', sectionId);
          window.dispatchEvent(new CustomEvent('educuria_roadmap_navigate', { detail: sectionId }));
        }}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Main View Area */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME CATALOG VIEW */}
        {activeView === 'catalog' && (
          <div className="pb-16">
            
            {/* Elegant Hero Section */}
            <div className="relative text-center py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-hidden">
              {/* Blurred background glows */}
              <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${
                theme === 'light-blue' ? 'bg-blue-300/10' : 'bg-emerald-500/10'
              }`}></div>
              
              <span className={`inline-flex items-center space-x-2 border font-mono text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6 ${
                theme === 'light-blue' 
                  ? 'bg-blue-50 border-blue-100 text-blue-650' 
                  : 'bg-slate-900 border-slate-800 text-emerald-400'
              }`}>
                <Sparkles className={`h-4 w-4 animate-pulse ${theme === 'light-blue' ? 'text-blue-550' : 'text-emerald-400'}`} />
                <span>Next-Generation Interactive LMS Hub</span>
              </span>
              
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-none ${
                theme === 'light-blue' ? 'text-slate-900' : 'text-white'
              }`}>
                Educuria Platform
              </h1>
              
              <div className="mt-6 mb-8 flex flex-col items-center">
                <div className="flex justify-center mb-3">
                  <span className="bg-black text-yellow-300 text-xs font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-2 border-black animate-pulse shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    ★ OFFICIAL ACADEMY PORTAL ★
                  </span>
                </div>
                <div className="relative">
                  <h2 className={`inline-block font-sans font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight border-4 border-black px-8 py-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl ${
                    theme === 'light-blue'
                      ? 'bg-yellow-300 text-black'
                      : 'bg-emerald-400 text-slate-950'
                  }`}>
                    Ishwar Hiremath Academy
                  </h2>
                </div>
              </div>
              
              <p className={`text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed ${
                theme === 'light-blue' ? 'text-slate-600' : 'text-slate-300'
              }`}>
                Unlock high-quality video tutorials, persistent student completion tracking, and interactive quizzes. Sign up in seconds with just your Email ID.
              </p>

              {/* Stat Counters Row */}
              <div className={`grid grid-cols-3 gap-4 max-w-xl mx-auto mt-10 p-5 rounded-2xl backdrop-blur-sm text-center border ${
                theme === 'light-blue' 
                  ? 'bg-white border-blue-100 shadow-xl shadow-blue-500/5' 
                  : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div>
                  <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${theme === 'light-blue' ? 'text-blue-600' : 'text-emerald-400'}`}>4</div>
                  <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${theme === 'light-blue' ? 'text-slate-400' : 'text-slate-400'}`}>Syllabus Programs</div>
                </div>
                <div className={theme === 'light-blue' ? 'border-x border-slate-100' : 'border-x border-slate-800'}>
                  <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${theme === 'light-blue' ? 'text-slate-800' : 'text-white'}`}>4,900+</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">Alumni Enrolled</div>
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${theme === 'light-blue' ? 'text-blue-600' : 'text-teal-400'}`}>100%</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">Open & Free</div>
                </div>
              </div>
            </div>

            {/* Course Browser Workspace */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 ${
              theme === 'light-blue'
                ? 'bg-white border border-slate-200 text-slate-950 p-6 md:p-10 rounded-3xl shadow-xl shadow-black/5'
                : ''
            }`}>
              
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-5 ${
                theme === 'light-blue' ? 'border-blue-100' : 'border-slate-800'
              }`}>
                <div>
                  <h2 className={`text-2xl font-sans font-extrabold ${theme === 'light-blue' ? 'text-slate-950' : 'text-white'}`}>Course Catalog</h2>
                  <p className={`text-sm mt-1 ${theme === 'light-blue' ? 'text-slate-600' : 'text-slate-400'}`}>Select a program to begin watching lectures and compiling progress.</p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-60 border ${
                        theme === 'light-blue'
                          ? 'bg-slate-50 border-slate-200 text-slate-950 placeholder-slate-400'
                          : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500'
                      }`}
                    />
                  </div>
                  
                  {/* Category Buttons */}
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {['All', 'Web Development', 'Artificial Intelligence', 'Data Science', 'Computer Science'].map((cat) => {
                      const isSelected = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap cursor-pointer border-2 border-black transition-all duration-200 ${
                            isSelected
                              ? theme === 'light-blue' 
                                ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                                : 'bg-emerald-500 text-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                              : theme === 'light-blue'
                                ? 'bg-white text-slate-700 hover:bg-slate-50 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                                : 'bg-slate-800 text-slate-200 hover:bg-slate-750 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                          }`}
                        >
                          {cat === 'Web Development' ? 'Web Dev' : cat === 'Artificial Intelligence' ? 'AI' : cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Catalog Grid */}
              {filteredCourses.length === 0 ? (
                <div className={`text-center py-20 border border-dashed rounded-3xl ${
                  theme === 'light-blue' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900/40 border-slate-850'
                }`}>
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-base font-semibold">No structured courses match your query.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                    className={`mt-3 text-xs font-bold hover:underline cursor-pointer ${
                      theme === 'light-blue' ? 'text-blue-650' : 'text-emerald-400'
                    }`}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCourses.map((course) => {
                    const isEnrolled = !!(user && user.enrolledCourses.includes(course.id));
                    const progress = progressMap[course.id] || null;

                    return (
                      <CourseCard
                        key={course.id}
                        course={course}
                        progress={progress}
                        isEnrolled={isEnrolled}
                        onSelect={() => handleSelectCourseFromCard(course.id)}
                        onEnroll={() => handleEnroll(course.id)}
                        isLoading={loading}
                      />
                    );
                  })}
                </div>
              )}

              {/* Meet the Lead Educator Section */}
              <div className="mt-20 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
                <div className="h-28 w-28 md:h-36 md:w-36 rounded-2xl bg-slate-800 overflow-hidden flex-shrink-0 border-2 border-emerald-500/20 shadow-lg relative">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Ishwar Hiremath" 
                    referrerPolicy="no-referrer"
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute bottom-2 right-2 p-1 bg-emerald-500 rounded-lg text-slate-950">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                </div>

                <div className="space-y-3 text-center md:text-left">
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Founder & Principal Educator
                  </span>
                  <h3 className="font-sans font-bold text-2xl text-white">Prof. Ishwar Hiremath</h3>
                  <p className="text-slate-400 font-mono text-xs">Director of Curriculum & Software Architect</p>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                    With over a decade of production architecture experience, Ishwar established Educuria to engineer an educational ecosystem built around interactive videos and functional student logging. The platform completely ditches mobile phone logins, replacing them with a streamlined, secure Email ID signup model. Everything is 100% open with no dynamic subscription paywalls.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono">
                    <span className="text-slate-400 flex items-center">
                      <Mail className="h-4 w-4 text-emerald-400 mr-1.5" />
                      ishwarhiremath2823@gmail.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Platform Core Benefits Grid */}
              <div className="mt-20 space-y-8">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-sans font-bold text-white">Why Learn with Educuria?</h3>
                  <p className="text-slate-400 text-xs mt-1">A lightweight learning portal engineered around robust student utilities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      01
                    </div>
                    <h4 className="font-sans font-bold text-white text-base">Fully Backed Curriculum</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Every video, chapter reference, and documentation download link is fully hosted and maintained. Skip empty placeholders and start learning immediately.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      02
                    </div>
                    <h4 className="font-sans font-bold text-white text-base">Email-Only Secure Access</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      We value your data privacy. The student tracker does not ask for or store phone numbers—simply log in securely with your verified Email ID.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      03
                    </div>
                    <h4 className="font-sans font-bold text-white text-base">Interactive Quizzes</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Validate your understanding of web protocols, AI parameters, and algorithms. Complete with direct trace explanations on incorrect options.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: STUDENT DASHBOARD */}
        {activeView === 'dashboard' && user && (
          <StudentDashboard
            user={user}
            courses={courses}
            progressMap={progressMap}
            announcements={announcements}
            onSelectCourse={handleSelectCourseFromCard}
            onNavigateToCatalog={() => setActiveView('catalog')}
          />
        )}

        {/* VIEW 3: COURSE VIEWER WORKSPACE */}
        {activeView === 'course-view' && selectedCourseId && (
          <CourseViewer
            course={courses.find((c) => c.id === selectedCourseId)!}
            progress={progressMap[selectedCourseId] || {
              userId: user ? user.id : 'guest',
              courseId: selectedCourseId,
              completedLessons: [],
              quizScores: {},
              updatedAt: new Date().toISOString()
            }}
            onToggleLesson={handleToggleLesson}
            onSubmitQuiz={handleSubmitQuiz}
            onBackToDashboard={() => setActiveView(user ? (user.role === 'admin' ? 'admin' : 'dashboard') : 'catalog')}
            token={token}
            user={user}
            isEnrolled={!!(user && user.enrolledCourses.includes(selectedCourseId))}
            onEnrollClick={() => handleEnroll(selectedCourseId)}
          />
        )}

        {/* VIEW 4: ADMIN CONSOLE */}
        {activeView === 'admin' && user && user.role === 'admin' && (
          <AdminConsole
            user={user}
            token={token}
            onAnnouncementAdded={fetchAnnouncements}
          />
        )}

        {/* VIEW 5: DATA ANALYST ROADMAP SECTOR */}
        {activeView === 'roadmap' && (
          <DataAnalystRoadmap />
        )}

        {/* VIEW 6: SECOND PUC OLD QUESTION PAPERS SECTION */}
        {activeView === 'puc-old-section' && (
          <SecondPucOldSection onBackToCatalog={() => setActiveView('catalog')} />
        )}

        {/* VIEW 6.5: SECOND PUC KSEAB SECTION */}
        {activeView === 'puc-section' && (
          <SecondPucSection onBackToCatalog={() => setActiveView('catalog')} />
        )}

        {/* VIEW 7: JEE ADVANCED SECTION */}
        {activeView === 'jee-section' && (
          <JeeSection onBackToCatalog={() => setActiveView('catalog')} />
        )}

      </main>

      {/* Footer (No mobile number shown) */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-10 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-slate-300 font-sans tracking-tight">Educuria</span>
          </div>
          <p className="max-w-md mx-auto text-slate-400 leading-normal">
            Designed to bring robust learning management, progress tracking, and academic resources directly to your browser. Founded by Ishwar Hiremath.
          </p>
          <div className="flex justify-center space-x-6 text-slate-400 font-mono text-[11px] pt-2">
            <span>Email ID: ishwarhiremath2823@gmail.com</span>
            <span>•</span>
            <span>No Mobile Number Fields Required</span>
          </div>
          <p className="text-[10px] text-slate-600 font-mono">
            &copy; {new Date().getFullYear()} Educuria by Ishwar Hiremath. All rights reserved.
          </p>
        </div>
      </footer>

      {/* DOWNSIDE RUNNING TEXT EFFECT */}
      <div className="w-full overflow-hidden bg-black py-2.5 border-t border-blue-950 z-50">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex space-x-12 shrink-0 pr-12 text-[11px] font-mono font-extrabold text-white uppercase tracking-widest">
            <span>★ ISHWAR HIREMATH ACADEMY ★ QUALITY EDUCATION REVOLUTION ★ FREE EDUCATIONAL RESOURCES • COMPREHENSIVE STUDY MATERIAL • QUESTION BANK ★ EMPOWERING STUDENTS WORLDWIDE ★ ACCESS HIGH-QUALITY TUTORIALS ANYTIME ★</span>
          </div>
          <div className="flex space-x-12 shrink-0 pr-12 text-[11px] font-mono font-extrabold text-white uppercase tracking-widest">
            <span>★ ISHWAR HIREMATH ACADEMY ★ QUALITY EDUCATION REVOLUTION ★ FREE EDUCATIONAL RESOURCES • COMPREHENSIVE STUDY MATERIAL • QUESTION BANK ★ EMPOWERING STUDENTS WORLDWIDE ★ ACCESS HIGH-QUALITY TUTORIALS ANYTIME ★</span>
          </div>
        </div>
      </div>

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}
