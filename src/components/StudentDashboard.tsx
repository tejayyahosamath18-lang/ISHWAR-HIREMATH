import React, { useState } from 'react';
import { User, Course, UserProgress, Announcement } from '../types';
import { Award, BookOpen, Clock, AlertTriangle, Calendar, ChevronRight, Trophy, BookMarked, Search, Filter } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  courses: Course[];
  progressMap: { [courseId: string]: UserProgress };
  announcements: Announcement[];
  onSelectCourse: (courseId: string) => void;
  onNavigateToCatalog: () => void;
}

export default function StudentDashboard({
  user,
  courses,
  progressMap,
  announcements,
  onSelectCourse,
  onNavigateToCatalog
}: StudentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Enrolled courses details
  const enrolledCoursesList = courses.filter((c) => user.enrolledCourses.includes(c.id));

  // Compute general stats
  let totalLessonsAcrossEnrolled = 0;
  let totalCompletedLessons = 0;
  let totalQuizzesAttempted = 0;
  let averageQuizScoreSum = 0;

  enrolledCoursesList.forEach((c) => {
    const prog = progressMap[c.id];
    const lessonsInCourse = c.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
    totalLessonsAcrossEnrolled += lessonsInCourse;

    if (prog) {
      totalCompletedLessons += prog.completedLessons.length;
      const quizIds = Object.keys(prog.quizScores);
      totalQuizzesAttempted += quizIds.length;
      quizIds.forEach((qid) => {
        averageQuizScoreSum += prog.quizScores[qid];
      });
    }
  });

  const overallProgressPercent = totalLessonsAcrossEnrolled > 0 
    ? Math.round((totalCompletedLessons / totalLessonsAcrossEnrolled) * 100) 
    : 0;

  const averageQuizScore = totalQuizzesAttempted > 0 
    ? Math.round(averageQuizScoreSum / totalQuizzesAttempted) 
    : 0;

  // Filter courses for quick-play
  const filteredEnrolled = enrolledCoursesList.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
              Student Workspace
            </span>
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-white mt-3 leading-tight">
              Keep pushing, {user.name}!
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl">
              Track your course progression, answer technical module quizzes, and prepare to earn certificates of excellence verified by Ishwar Hiremath.
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 self-start md:self-auto">
            {/* SVG circle chart */}
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-95">
                <circle cx="32" cy="32" r="26" className="stroke-slate-800 fill-none" strokeWidth="4"></circle>
                <circle 
                  cx="32" cy="32" r="26" 
                  className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - overallProgressPercent / 100)}`}
                ></circle>
              </svg>
              <span className="absolute text-sm font-bold font-mono text-white">{overallProgressPercent}%</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Overall Progress</div>
              <div className="text-lg font-bold text-emerald-400">{totalCompletedLessons} / {totalLessonsAcrossEnrolled} Lessons</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Stats & Announcements vs Courses List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left sidebar: Stats, Announcements */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 border border-slate-700/60 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider">Quiz Score</span>
              </div>
              <div className="text-2xl font-bold font-mono">{totalQuizzesAttempted > 0 ? `${averageQuizScore}%` : 'N/A'}</div>
              <div className="text-[11px] text-slate-400 mt-1">{totalQuizzesAttempted} Quizzes completed</div>
            </div>

            <div className="bg-slate-800 border border-slate-700/60 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 text-teal-400 mb-2">
                <BookMarked className="h-4 w-4" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider">Courses</span>
              </div>
              <div className="text-2xl font-bold font-mono">{enrolledCoursesList.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">Enrolled modules</div>
            </div>
          </div>

          {/* Announcements block */}
          <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
            <h3 className="font-sans font-bold text-base text-white mb-4 flex items-center justify-between">
              <span>Platform Announcements</span>
              <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {announcements.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No announcements posted yet.</p>
              ) : (
                announcements.map((ann) => (
                  <div 
                    key={ann.id} 
                    className={`p-3.5 rounded-xl text-xs border ${
                      ann.important 
                        ? 'bg-amber-950/20 border-amber-500/20' 
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-semibold tracking-wide ${ann.important ? 'text-amber-400' : 'text-slate-200'}`}>
                        {ann.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {ann.date}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{ann.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Instructor Contact Block (No mobile number, Email only) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 p-5 rounded-2xl shadow-lg text-slate-300">
            <h4 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-2">Direct Instructor Support</h4>
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="Ishwar" referrerPolicy="no-referrer" className="object-cover h-full w-full" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Ishwar Hiremath</div>
                <div className="text-[11px] text-slate-400">Head Educator & Platform Architect</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4">
              Need feedback on coding structure, technical assignments, or certification requirements? Contact me directly via the secure portal support Email ID below.
            </p>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-center font-mono text-xs">
              <span className="block text-slate-500 uppercase tracking-wider text-[9px] mb-1">Direct Helpdesk Email ID</span>
              <span className="text-emerald-400 font-bold break-all">ishwarhiremath2823@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Right Area: Enrolled Courses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-sans font-bold text-xl text-white">My Enrolled Courses</h2>
            
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Topics</option>
                <option value="Web Development">Web Dev</option>
                <option value="Artificial Intelligence">AI</option>
                <option value="Data Science">Data Science</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
          </div>

          {filteredEnrolled.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 p-8 rounded-3xl text-center">
              <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No enrolled courses match your current filter.</p>
              <button 
                onClick={onNavigateToCatalog}
                className="mt-4 inline-flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <span>Browse general catalog</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnrolled.map((course) => {
                const prog = progressMap[course.id];
                const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
                const completedCount = prog ? prog.completedLessons.length : 0;
                const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                const isCertified = percent === 100;

                return (
                  <div 
                    key={course.id}
                    onClick={() => onSelectCourse(course.id)}
                    className="group bg-slate-800 border border-slate-700/60 hover:border-emerald-500/30 p-5 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/2 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Cover Thumbnail */}
                      <div className="h-14 w-24 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700 relative">
                        <img src={course.thumbnailUrl} alt={course.title} referrerPolicy="no-referrer" className="object-cover h-full w-full" />
                        {isCertified && (
                          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex items-center justify-center">
                            <Award className="h-6 w-6 text-emerald-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Name / Category */}
                      <div>
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          {course.category}
                        </span>
                        <h4 className="font-sans font-bold text-base text-white mt-1 group-hover:text-emerald-400 transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {course.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Progress slider and Button */}
                    <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 flex-shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-700/40">
                      <div className="text-left md:text-right w-36 sm:w-48 md:w-32">
                        <div className="flex justify-between items-center text-xs font-mono font-medium mb-1">
                          <span className="text-slate-400">{completedCount}/{totalLessons} Done</span>
                          <span className="text-emerald-400 font-bold">{percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isCertified && (
                          <span 
                            title="Course certificate earned!" 
                            className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-bold"
                          >
                            Certified
                          </span>
                        )}
                        <span className="p-2 bg-slate-700/50 hover:bg-emerald-500 hover:text-slate-950 rounded-xl text-white transition group-hover:translate-x-0.5">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Catalog Upsell */}
          <div className="p-6 bg-slate-800/40 border border-slate-700/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <h4 className="font-sans font-bold text-white text-base">Want to expand your skillset?</h4>
              <p className="text-slate-400 text-xs mt-1">Enroll in multiple courses from our primary catalog to gain certifications in different fields.</p>
            </div>
            <button
              onClick={onNavigateToCatalog}
              className="py-2 px-5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs tracking-wide transition cursor-pointer flex-shrink-0"
            >
              Explore Course Catalog
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
