import React from 'react';
import { Course, UserProgress } from '../types';
import { BookOpen, Award, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  key?: React.Key | any;
  course: Course;
  progress: UserProgress | null;
  onSelect: () => void;
  isEnrolled: boolean;
  onEnroll: () => void | Promise<void>;
  isLoading: boolean;
  theme?: 'light-blue' | 'dark' | 'ocean';
}

export default function CourseCard({ course, progress, onSelect, isEnrolled, onEnroll, isLoading, theme = 'light-blue' }: CourseCardProps) {
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const completedCount = progress ? progress.completedLessons.length : 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 105) / 1.05 : 0; // scale nicely

  const isLight = theme === 'light-blue';

  const cardClass = isLight
    ? 'group bg-white border border-slate-200 hover:border-blue-400 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col h-full text-slate-950'
    : 'group bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 flex flex-col h-full text-white';

  const categoryTagClass = isLight
    ? 'absolute top-3 left-3 bg-white/90 backdrop-blur-md text-blue-600 border border-blue-100 text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg shadow-sm'
    : 'absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg';

  const difficultyTagClass = isLight
    ? 'absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-600 border border-slate-200 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm'
    : 'absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg';

  const titleClass = isLight
    ? 'font-sans font-extrabold text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors duration-200 mb-2'
    : 'font-sans font-bold text-lg text-white leading-snug group-hover:text-emerald-400 transition-colors duration-200 mb-2';

  const subtitleClass = isLight
    ? 'text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2'
    : 'text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2';

  const statsClass = isLight
    ? 'flex items-center space-x-3 text-xs text-slate-500 font-mono mb-3'
    : 'flex items-center space-x-3 text-xs text-slate-400 font-mono mb-3';

  return (
    <div className={cardClass}>
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        {/* Category tag */}
        <span className={categoryTagClass}>
          {course.category}
        </span>
 
        {/* Difficulty Badge */}
        <span className={difficultyTagClass}>
          {course.difficulty}
        </span>
      </div>
 
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Header Stats */}
          <div className={statsClass}>
            <span className="flex items-center">
              <Star className="h-3.5 w-3.5 text-amber-500 mr-1 fill-amber-500" />
              {course.rating.toFixed(1)}
            </span>
            <span className={`h-1 w-1 rounded-full ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`}></span>
            <span className="flex items-center">
              <Users className="h-3.5 w-3.5 mr-1" />
              {course.totalStudents.toLocaleString()} Students
            </span>
          </div>
 
          {/* Title */}
          <h3 className={titleClass}>
            {course.title}
          </h3>
 
          {/* Short Subtitle */}
          <p className={subtitleClass}>
            {course.subtitle}
          </p>
        </div>
 
        {/* Bottom Area */}
        <div className={`mt-4 pt-4 border-t ${isLight ? 'border-slate-100' : 'border-slate-700/50'}`}>
          {isEnrolled ? (
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="flex justify-between items-center text-xs font-mono">
                <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'} flex items-center`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 mr-1.5 ${isLight ? 'text-blue-600' : 'text-emerald-400'}`} />
                  {completedCount} / {totalLessons} Completed
                </span>
                <span className={`font-bold ${isLight ? 'text-blue-600' : 'text-emerald-400'}`}>{Math.round(progressPercent)}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-700'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${isLight ? 'bg-blue-600' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
 
              {/* Action */}
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer ${
                  isLight 
                    ? 'bg-yellow-300 hover:bg-yellow-400 text-black' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <span>Continue Learning</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className={`flex items-center justify-between text-[11px] font-mono ${isLight ? 'text-blue-650 font-bold' : 'text-emerald-400'}`}>
                <span className="flex items-center">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Free Course
                </span>
                <span>Pre-enrollment active</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(); }}
                  className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-xl text-xs font-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50 text-slate-800' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>Watch Lectures</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled={isLoading}
                  onClick={(e) => { e.stopPropagation(); onEnroll(); }}
                  className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-xl text-xs font-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                    isLight 
                      ? 'bg-yellow-300 hover:bg-yellow-400 text-black' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  <span>Enroll Now</span>
                  <BookOpen className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
