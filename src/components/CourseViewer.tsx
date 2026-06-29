import React, { useState } from 'react';
import { Course, Lesson, UserProgress } from '../types';
import { PlayCircle, CheckCircle, ChevronLeft, ChevronRight, HelpCircle, FileText, ExternalLink, RefreshCw, Trophy, ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  progress: UserProgress;
  onToggleLesson: (lessonId: string) => Promise<void> | void;
  onSubmitQuiz: (quizId: string, score: number) => Promise<void> | void;
  onBackToDashboard: () => void;
  token: string;
  user: any;
  isEnrolled: boolean;
  onEnrollClick: () => void;
}

export default function CourseViewer({
  course,
  progress,
  onToggleLesson,
  onSubmitQuiz,
  onBackToDashboard,
  token,
  user,
  isEnrolled,
  onEnrollClick
}: CourseViewerProps) {
  // Find initial lesson
  const allLessons: Lesson[] = [];
  course.chapters.forEach((ch) => {
    ch.lessons.forEach((l) => allLessons.push(l));
  });

  const lastAccessed = progress.lastAccessedLessonId;
  const initialLesson = allLessons.find((l) => l.id === lastAccessed) || allLessons[0];

  const [activeLesson, setActiveLesson] = useState<Lesson>(initialLesson);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const isCompleted = progress.completedLessons.includes(activeLesson.id);

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = async () => {
    if (!activeLesson.quiz) return;
    
    let correctCount = 0;
    activeLesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / activeLesson.quiz.length) * 100);
    setQuizScore(percent);
    setQuizSubmitted(true);

    await onSubmitQuiz(activeLesson.id, percent);
  };

  const handleQuizReset = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Prev / Next logic
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-750 text-slate-100 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
          COURSE: {course.title}
        </span>
      </div>

      {/* Enrollment Status Notice Banner */}
      {!isEnrolled && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-sans font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 animate-pulse text-emerald-400" />
              {!user ? 'Preview Mode: Guest Access' : 'Course Not Enrolled'}
            </h4>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {!user 
                ? "You can watch any video lecture and attempt quizzes, but your progress won't be saved permanently. Create a student profile with your Email ID in seconds (password-free) to unlock your dashboard and track progress!"
                : "You are logged in, but not yet enrolled in this specific course. Click 'Enroll Now' to link this course to your student dashboard."}
            </p>
          </div>
          <button
            onClick={onEnrollClick}
            className="flex-shrink-0 inline-flex items-center space-x-1.5 font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-4 rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer"
          >
            <span>{!user ? 'Sign In / Enroll' : 'Enroll in Course'}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Grid Layout: Left Sidebar Navigation & Right Video/Lesson Space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (LMS Sidebar): Span 4 */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-4 self-start space-y-4">
          <div className="pb-3 border-b border-slate-850">
            <h3 className="font-sans font-bold text-lg text-white">Course Curriculum</h3>
            <p className="text-xs text-slate-400 mt-1">Instructor: Ishwar Hiremath</p>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {course.chapters.map((chapter) => (
              <div key={chapter.id} className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 tracking-wider uppercase font-mono px-2">
                  {chapter.title}
                </h4>
                <div className="space-y-1">
                  {chapter.lessons.map((lesson) => {
                    const lessonCompleted = progress.completedLessons.includes(lesson.id);
                    const lessonActive = activeLesson.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between text-xs font-medium cursor-pointer ${
                          lessonActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 mr-2">
                          {lessonCompleted ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <PlayCircle className={`h-4 w-4 flex-shrink-0 ${lessonActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Span 8 */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Responsive YouTube Embed Container */}
          <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${activeLesson.videoUrl}?rel=0&modestbranding=1`}
              title={activeLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

          {/* Video Controls & Lesson Completion Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-850 rounded-2xl">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 py-1 px-2.5 rounded-md font-bold">
                Active Lecture
              </span>
              <h2 className="font-sans font-bold text-lg md:text-xl text-white mt-1.5 leading-snug">
                {activeLesson.title}
              </h2>
            </div>
            <button
              onClick={() => onToggleLesson(activeLesson.id)}
              className={`flex items-center space-x-2 py-2.5 px-5 rounded-xl font-bold text-xs transition cursor-pointer self-start sm:self-auto ${
                isCompleted 
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/15' 
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>{isCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
            </button>
          </div>

          {/* Lesson Content Tabs (About notes) */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-3xl p-6 space-y-6 shadow-md">
            
            {/* Notes Section */}
            <div>
              <h3 className="font-sans font-bold text-base text-white border-b border-slate-700 pb-2 mb-3 flex items-center">
                <FileText className="h-4.5 w-4.5 text-emerald-400 mr-2" />
                Lecture Summary & Structured Notes
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {activeLesson.description}
              </p>
              {activeLesson.markdownContent && (
                <div className="bg-slate-900/60 p-4 border border-slate-750 rounded-2xl text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-sans font-medium space-y-3">
                  {activeLesson.markdownContent}
                </div>
              )}
            </div>

            {/* Resources Links */}
            {activeLesson.links && activeLesson.links.length > 0 && (
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-200 mb-2">Required Materials & Reference Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLesson.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-900/50 border border-slate-750 hover:border-emerald-500/30 hover:bg-slate-900 rounded-xl flex items-center justify-between text-xs text-slate-300 transition group"
                    >
                      <span className="font-medium group-hover:text-emerald-400">{link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Lesson Quiz Section */}
            {activeLesson.quiz && activeLesson.quiz.length > 0 && (
              <div className="pt-6 border-t border-slate-700">
                <h3 className="font-sans font-bold text-base text-white pb-2 mb-4 flex items-center">
                  <HelpCircle className="h-4.5 w-4.5 text-emerald-400 mr-2" />
                  Lesson Comprehension Quiz
                </h3>

                <div className="space-y-6">
                  {activeLesson.quiz.map((q, qIdx) => {
                    const answered = selectedAnswers[q.id] !== undefined;
                    const isCorrect = selectedAnswers[q.id] === q.correctAnswerIndex;

                    return (
                      <div key={q.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3">
                        <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Question {qIdx + 1}</span>
                        <p className="font-sans font-semibold text-sm text-white">{q.question}</p>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[q.id] === optIdx;
                            const isCorrectOpt = optIdx === q.correctAnswerIndex;

                            let optionBg = 'bg-slate-800/60 border-slate-750 hover:bg-slate-800';
                            if (quizSubmitted) {
                              if (isCorrectOpt) {
                                optionBg = 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300';
                              } else if (isSelected) {
                                optionBg = 'bg-rose-950/30 border-rose-500/40 text-rose-300';
                              } else {
                                optionBg = 'bg-slate-850/30 border-slate-800 opacity-60';
                              }
                            } else if (isSelected) {
                              optionBg = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleAnswerSelect(q.id, optIdx)}
                                className={`w-full text-left p-3 border rounded-xl text-xs transition cursor-pointer font-medium ${optionBg}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Banner */}
                        {quizSubmitted && (
                          <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${isCorrect ? 'bg-emerald-950/20 border-emerald-500/10 text-slate-300' : 'bg-rose-950/10 border-rose-500/10 text-slate-300'}`}>
                            <span className="font-bold block mb-1 font-mono uppercase tracking-wider text-[10px] text-slate-400">
                              {isCorrect ? '✓ Correct Answer' : '✗ Incorrect'}
                            </span>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    {quizSubmitted ? (
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-mono text-xs font-bold flex items-center">
                          <Trophy className="h-4 w-4 mr-1.5" />
                          Score: {quizScore}%
                        </div>
                        <button
                          onClick={handleQuizReset}
                          className="flex items-center space-x-1.5 py-2 px-3.5 text-xs font-black bg-slate-800 hover:bg-slate-700 text-white rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Retry Quiz</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.length}
                        className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer disabled:opacity-40"
                      >
                        Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Left/Right Lesson Nav Bottom bar */}
          <div className="flex items-center justify-between pt-4">
            <button
              disabled={!prevLesson}
              onClick={() => prevLesson && handleLessonSelect(prevLesson)}
              className="flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-750 border-2 border-black text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] disabled:opacity-40 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5px]" />
              <span>Previous Lecture</span>
            </button>
            <button
              disabled={!nextLesson}
              onClick={() => nextLesson && handleLessonSelect(nextLesson)}
              className="flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-750 border-2 border-black text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] disabled:opacity-40 transition-all duration-200 cursor-pointer"
            >
              <span>Next Lecture</span>
              <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
