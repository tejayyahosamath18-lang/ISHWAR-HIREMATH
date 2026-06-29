import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { GraduationCap, LogIn, LogOut, ShieldAlert, Bell, Menu, X, BookOpen, LayoutDashboard, Compass, Search, HelpCircle, FileText, CheckCircle, Award } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  activeView: 'catalog' | 'dashboard' | 'admin' | 'course-view' | 'roadmap' | 'puc-section' | 'jee-section';
  onNavigate: (view: 'catalog' | 'dashboard' | 'admin' | 'roadmap' | 'puc-section' | 'jee-section') => void;
  onSelectCourse?: (courseId: string) => void;
  onSelectRoadmapSection?: (sectionId: string) => void;
  theme: 'light-blue' | 'dark' | 'ocean';
  onThemeChange: (theme: 'light-blue' | 'dark' | 'ocean') => void;
}

export default function Header({ 
  user, 
  onLoginClick, 
  onLogout, 
  activeView, 
  onNavigate, 
  onSelectCourse, 
  onSelectRoadmapSection,
  theme,
  onThemeChange
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchableCourses = [
    { id: 'web-dev-101', title: 'Modern Full-Stack React & Node.js', category: 'Web Development' },
    { id: 'ai-prompt-eng', title: 'Generative AI with Gemini SDK', category: 'Artificial Intelligence' },
    { id: 'data-science-pandas', title: 'Data Science with Python & D3.js', category: 'Data Science' },
    { id: 'computer-science-dsa', title: 'Mastering Data Structures & Algorithms', category: 'Computer Science' }
  ];

  const searchableRoadmap = [
    { id: 'excel', title: 'Excel (Beginner to Advanced)', num: 1 },
    { id: 'sql', title: 'SQL (MOST IMPORTANT)', num: 2 },
    { id: 'statistics', title: 'Statistics (Data-driven)', num: 3 },
    { id: 'bi', title: 'Power BI / Tableau (Visualization)', num: 4 },
    { id: 'python', title: 'Python Programming', num: 5 },
    { id: 'cloud', title: 'CLOUD (AWS/Azure/GCP)', num: 6 }
  ];

  const filteredCourses = searchQuery.trim() === '' ? [] : searchableCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoadmap = searchQuery.trim() === '' ? [] : searchableRoadmap.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notifications = [
    { id: 1, text: 'New AI prompt engineering module unlocked!', time: '2h ago' },
    { id: 2, text: 'Welcome to Ishwar Hiremath’s new educational hub.', time: '1d ago' }
  ];

  const headerBg = theme === 'light-blue' 
    ? 'sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 text-slate-800 shadow-sm' 
    : theme === 'ocean' 
    ? 'sticky top-0 z-40 bg-[#091024]/95 backdrop-blur-md border-b border-blue-950 text-white shadow-lg' 
    : 'sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg';

  const logoTitle = theme === 'light-blue'
    ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-blue-600 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent';

  const logoIconBg = theme === 'light-blue'
    ? 'bg-blue-600 text-white p-2 rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-md shadow-blue-500/20'
    : 'bg-emerald-500 text-slate-950 p-2 rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-md shadow-emerald-500/20';

  const navButtonClass = (isActive: boolean, type: 'default' | 'admin' = 'default') => {
    if (theme === 'light-blue') {
      if (isActive) {
        return type === 'admin' 
          ? 'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold bg-rose-50 text-rose-600 border border-rose-200/80 transition-all duration-200'
          : 'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-600 border border-blue-200/80 transition-all duration-200';
      }
      return 'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200';
    } else {
      if (isActive) {
        return type === 'admin'
          ? 'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20 transition-all duration-200'
          : 'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition-all duration-200';
      }
      return 'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-850 transition-all duration-200';
    }
  };

  return (
    <header className={headerBg}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { onNavigate('catalog'); setMobileMenuOpen(false); }}
          >
            <div className={logoIconBg}>
              <GraduationCap className="h-6 w-6" id="logo-icon" />
            </div>
            <div>
              <span className={`font-sans font-extrabold text-xl tracking-tight ${logoTitle}`}>
                Educuria
              </span>
              <span className={`block text-[10px] tracking-wider font-mono uppercase ${theme === 'light-blue' ? 'text-slate-455' : 'text-slate-400'}`}>
                by Ishwar Hiremath
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('catalog')}
              className={navButtonClass(activeView === 'catalog')}
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses Catalog</span>
            </button>

            {/* NEW 2nd PUC KSEAB SECTION LINK */}
            <button
              onClick={() => onNavigate('puc-section')}
              className={navButtonClass(activeView === 'puc-section')}
            >
              <FileText className={`h-4 w-4 ${theme === 'light-blue' ? 'text-blue-500 animate-pulse' : 'text-blue-400 animate-pulse'}`} />
              <span className="flex items-center space-x-1">
                <span>2nd PUC (KSEAB)</span>
                <span className={`text-[8px] px-1 py-0.2 rounded font-mono uppercase tracking-wider font-bold ${
                  theme === 'light-blue' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  New
                </span>
              </span>
            </button>

            {/* NEW JEE ADVANCED SECTION LINK */}
            <button
              onClick={() => onNavigate('jee-section')}
              className={navButtonClass(activeView === 'jee-section')}
            >
              <Award className={`h-4 w-4 ${theme === 'light-blue' ? 'text-orange-500 animate-pulse' : 'text-orange-400 animate-pulse'}`} />
              <span className="flex items-center space-x-1">
                <span>JEE Advanced</span>
                <span className={`text-[8px] px-1 py-0.2 rounded font-mono uppercase tracking-wider font-bold ${
                  theme === 'light-blue' ? 'bg-orange-100 text-orange-700' : 'bg-orange-500/20 text-orange-300'
                }`}>
                  Exam
                </span>
              </span>
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className={navButtonClass(activeView === 'roadmap')}
            >
              <Compass className={`h-4 w-4 ${theme === 'light-blue' ? 'text-blue-500' : 'text-emerald-400'} animate-pulse`} />
              <span className="flex items-center space-x-1">
                <span>Data Analyst Roadmap</span>
              </span>
            </button>

            {user && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={navButtonClass(activeView === 'dashboard')}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>My Progress</span>
              </button>
            )}

            {user && user.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={navButtonClass(activeView === 'admin', 'admin')}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* User Controls / Notifications */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button & Dropdown */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setNotificationsOpen(false);
                }}
                className={`p-2 rounded-lg transition hover:bg-slate-800 ${
                  searchOpen ? 'text-emerald-400 bg-slate-800' : 'text-slate-400 hover:text-white'
                }`}
                title="Search Platform"
              >
                <Search className="h-5 w-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-slate-100">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search courses, roadmap stages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2 text-[10px] text-slate-400 hover:text-white font-mono bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {searchQuery.trim() === '' ? (
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Popular Searches</p>
                      <div className="flex flex-wrap gap-2">
                        {['SQL', 'Excel', 'Python', 'Power BI', 'Statistics', 'Cloud'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700/50 rounded-lg text-xs text-slate-300 hover:text-white transition font-sans font-medium"
                          >
                            #{term}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                      {/* Course Results */}
                      {filteredCourses.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono mb-2 flex items-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Courses ({filteredCourses.length})
                          </p>
                          <div className="space-y-1">
                            {filteredCourses.map((c) => (
                              <div
                                key={c.id}
                                onClick={() => {
                                  if (onSelectCourse) {
                                    onSelectCourse(c.id);
                                  } else {
                                    onNavigate('catalog');
                                  }
                                  setSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="p-2 hover:bg-slate-800 rounded-xl cursor-pointer transition border border-transparent hover:border-slate-700 flex items-center justify-between group"
                              >
                                <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition">{c.title}</span>
                                <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">{c.category}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Roadmap Results */}
                      {filteredRoadmap.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-teal-400 font-mono mb-2 flex items-center">
                            <Compass className="h-3 w-3 mr-1 animate-pulse" />
                            Roadmap Stages ({filteredRoadmap.length})
                          </p>
                          <div className="space-y-1">
                            {filteredRoadmap.map((r) => (
                              <div
                                key={r.id}
                                onClick={() => {
                                  if (onSelectRoadmapSection) {
                                    onSelectRoadmapSection(r.id);
                                  } else {
                                    onNavigate('roadmap');
                                  }
                                  setSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="p-2 hover:bg-slate-800 rounded-xl cursor-pointer transition border border-transparent hover:border-slate-700 flex items-center justify-between group"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-mono bg-teal-500/10 text-teal-400 h-5 w-5 rounded flex items-center justify-center font-bold">
                                    {r.num}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition">{r.title}</span>
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono font-medium">Stage {r.num}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredCourses.length === 0 && filteredRoadmap.length === 0 && (
                        <div className="text-center py-6 text-slate-500">
                          <p className="text-xs">No courses or roadmap steps found for "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Selector Widget */}
            <div className={`flex items-center p-1 rounded-xl border text-[10px] space-x-1 ${
              theme === 'light-blue' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-slate-800'
            }`}>
              <button
                onClick={() => onThemeChange('light-blue')}
                className={`px-2.5 py-1 rounded-lg font-extrabold transition cursor-pointer ${
                  theme === 'light-blue'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Professional White & Light Blue Theme"
              >
                White & Blue 🔵
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`px-2.5 py-1 rounded-lg font-extrabold transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-emerald-400'
                    : theme === 'light-blue' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
                }`}
                title="Midnight Dark Theme"
              >
                Midnight 🌌
              </button>
              <button
                onClick={() => onThemeChange('ocean')}
                className={`px-2.5 py-1 rounded-lg font-extrabold transition cursor-pointer ${
                  theme === 'ocean'
                    ? 'bg-blue-950/80 text-blue-300'
                    : theme === 'light-blue' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
                }`}
                title="Deep Ocean Corporate Theme"
              >
                Ocean 🌊
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setSearchOpen(false);
                }}
                className={`relative p-2 rounded-lg transition ${
                  theme === 'light-blue'
                    ? 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white animate-pulse"></span>
              </button>

              {notificationsOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl py-2 z-50 animate-fade-in border ${
                  theme === 'light-blue'
                    ? 'bg-white border-blue-100 text-slate-800'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}>
                  <div className={`px-4 py-2 border-b flex justify-between items-center ${
                    theme === 'light-blue' ? 'border-blue-50' : 'border-slate-700'
                  }`}>
                    <span className="font-semibold text-xs uppercase tracking-wider">Announcements</span>
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b last:border-0 cursor-pointer ${
                        theme === 'light-blue' 
                          ? 'hover:bg-blue-50/50 border-blue-50/40 text-slate-750' 
                          : 'hover:bg-slate-750 border-slate-700/50 text-slate-200'
                      }`}>
                        <p className="text-sm font-medium leading-snug">{n.text}</p>
                        <span className="text-[10px] mt-1 block font-mono text-slate-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Auth Button */}
            {user ? (
              <div className={`flex items-center space-x-3 pl-3 border-l ${theme === 'light-blue' ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${theme === 'light-blue' ? 'text-slate-900' : 'text-white'}`}>{user.name}</div>
                  <div className="text-xs text-slate-400 font-mono max-w-[150px] truncate">{user.email}</div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-650 to-blue-400 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  className={`p-2 rounded-lg transition ${
                    theme === 'light-blue' ? 'text-slate-400 hover:text-rose-500 hover:bg-slate-100' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                  }`}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-black border-2 border-black transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                  theme === 'light-blue' ? 'bg-yellow-300 hover:bg-yellow-400 text-black' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <LogIn className="h-4 w-4 stroke-[2.5px]" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 pt-2 pb-4 space-y-2 z-40 ${
          theme === 'light-blue' ? 'bg-white border-blue-100' : 'bg-slate-900 border-slate-800'
        }`}>
          <button
            onClick={() => { onNavigate('catalog'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-base font-semibold ${
              activeView === 'catalog'
                ? theme === 'light-blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-500/10 text-emerald-400'
                : theme === 'light-blue' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Courses Catalog</span>
          </button>

          {/* NEW 2nd PUC MOBILE SECTION LINK */}
          <button
            onClick={() => { onNavigate('puc-section'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-base font-semibold ${
              activeView === 'puc-section'
                ? theme === 'light-blue' ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/15 text-blue-400'
                : theme === 'light-blue' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="h-5 w-5 text-blue-500 animate-pulse" />
            <span className="flex items-center justify-between w-full">
              <span>2nd PUC (KSEAB)</span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                theme === 'light-blue' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300'
              }`}>
                New
              </span>
            </span>
          </button>

          {/* NEW JEE MOBILE SECTION LINK */}
          <button
            onClick={() => { onNavigate('jee-section'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-base font-semibold ${
              activeView === 'jee-section'
                ? theme === 'light-blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-500/15 text-orange-400'
                : theme === 'light-blue' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Award className="h-5 w-5 text-orange-500 animate-pulse" />
            <span className="flex items-center justify-between w-full">
              <span>JEE Advanced</span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                theme === 'light-blue' ? 'bg-orange-100 text-orange-700' : 'bg-orange-500/20 text-orange-300'
              }`}>
                Exam
              </span>
            </span>
          </button>

          <button
            onClick={() => { onNavigate('roadmap'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-base font-semibold ${
              activeView === 'roadmap'
                ? theme === 'light-blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-500/10 text-emerald-400'
                : theme === 'light-blue' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="h-5 w-5" />
            <span>Data Analyst Roadmap</span>
          </button>

          {user && (
            <button
              onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-base font-semibold ${
                activeView === 'dashboard'
                  ? theme === 'light-blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-500/10 text-emerald-400'
                  : theme === 'light-blue' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>My Progress</span>
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-base font-semibold ${
                activeView === 'admin'
                  ? theme === 'light-blue' ? 'bg-rose-50 text-rose-600 font-bold' : 'bg-red-500/10 text-red-400'
                  : theme === 'light-blue' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="h-5 w-5" />
              <span>Admin Panel</span>
            </button>
          )}

          <div className={`pt-4 border-t ${theme === 'light-blue' ? 'border-slate-200' : 'border-slate-800'}`}>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`text-base font-semibold ${theme === 'light-blue' ? 'text-slate-900' : 'text-white'}`}>{user.name}</div>
                    <div className="text-sm text-slate-400 truncate max-w-[200px]">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-bold ${
                    theme === 'light-blue' ? 'text-rose-600 hover:bg-rose-50' : 'text-rose-400 hover:bg-slate-800'
                  }`}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-black border-2 border-black transition shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer ${
                  theme === 'light-blue' ? 'bg-yellow-300 hover:bg-yellow-400 text-black' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <LogIn className="h-5 w-5 stroke-[2.5px]" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
