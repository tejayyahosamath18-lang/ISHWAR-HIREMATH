import React, { useState, useEffect } from 'react';
import { User, Announcement } from '../types';
import { ShieldCheck, MessageSquarePlus, Users, AlertCircle, FileText, Send, Calendar, CheckSquare, Award } from 'lucide-react';

interface AdminConsoleProps {
  user: User;
  token: string;
  onAnnouncementAdded: () => void;
}

export default function AdminConsole({ user, token, onAnnouncementAdded }: AdminConsoleProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annImportant, setAnnImportant] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        setTotalStudents(data.totalStudents || 0);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    setPostSuccess(false);

    if (!annTitle || !annContent) {
      setPostError('Please enter both title and content.');
      return;
    }

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          important: annImportant
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post the announcement.');
      }

      setAnnTitle('');
      setAnnContent('');
      setAnnImportant(false);
      setPostSuccess(true);
      onAnnouncementAdded();
      fetchStats();
    } catch (err: any) {
      setPostError(err.message || 'Error occurred.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100 space-y-8">
      
      {/* Header Greeting */}
      <div className="bg-gradient-to-r from-red-950/20 to-slate-900 border border-red-500/20 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-red-400 font-mono text-xs font-semibold uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full flex items-center w-fit">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            Educator Administration Console
          </span>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-white mt-3">
            Welcome back, Prof. Ishwar Hiremath
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Create real-time learning updates and monitor course progression for student cohorts enrolled across your curriculum.
          </p>
        </div>
        <div className="bg-slate-950/40 px-5 py-3 border border-slate-800 rounded-2xl flex items-center space-x-3">
          <Users className="h-5 w-5 text-emerald-400" />
          <div>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">Cohort Size</span>
            <span className="text-lg font-mono font-bold text-white">{totalStudents} Active Students</span>
          </div>
        </div>
      </div>

      {/* Grid: Create Announcement vs Student Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create Announcement Form: Column span 4 */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl self-start shadow-xl space-y-4">
          <h3 className="font-sans font-bold text-base text-white flex items-center pb-2 border-b border-slate-800">
            <MessageSquarePlus className="h-5 w-5 text-emerald-400 mr-2" />
            Broadcast Alert
          </h3>

          {postSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
              Announcement broadcasted successfully!
            </div>
          )}

          {postError && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center space-x-1.5">
              <AlertCircle className="h-4 w-4" />
              <span>{postError}</span>
            </div>
          )}

          <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-mono font-medium text-slate-400 uppercase tracking-wider">Announcement Title</label>
              <input
                type="text"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Weekly Live Q&A scheduled"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono font-medium text-slate-400 uppercase tracking-wider">Notice Content</label>
              <textarea
                rows={4}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Write your updates, reminders, or resource links here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                id="important-alert"
                checked={annImportant}
                onChange={(e) => setAnnImportant(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-800"
              />
              <label htmlFor="important-alert" className="font-mono font-medium text-slate-300 uppercase tracking-wider select-none cursor-pointer">
                Mark as Urgent Notice
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-md shadow-emerald-500/10 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>

        {/* Student cohorts progress report table: Column span 8 */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
          <h3 className="font-sans font-bold text-base text-white flex items-center pb-2 border-b border-slate-800">
            <Users className="h-5 w-5 text-emerald-400 mr-2" />
            Registered Student Progress Tracker
          </h3>

          {loadingStats ? (
            <div className="py-12 text-center text-slate-500 text-sm font-medium">
              Loading student cohort data...
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm font-medium">
              No students have registered accounts on the database yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-2">Student Profile</th>
                    <th className="py-3 px-2">Enrolled Modules</th>
                    <th className="py-3 px-2">Completed Lessons</th>
                    <th className="py-3 px-2">Average Quiz Completion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs">
                  {students.map((student: any) => {
                    const totalCompleted = student.progress.reduce((sum: number, p: any) => sum + p.completedCount, 0);
                    const totalQuizzes = student.progress.reduce((sum: number, p: any) => sum + p.quizzesTaken, 0);

                    return (
                      <tr key={student.id} className="hover:bg-slate-850/35 transition-colors">
                        <td className="py-3.5 px-2">
                          <div className="font-bold text-white">{student.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{student.email}</div>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md font-bold">
                            {student.enrolledCoursesCount} Courses
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <CheckSquare className="h-3.5 w-3.5 text-slate-500" />
                            <span className="font-mono font-bold">{totalCompleted} Lectures</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <Award className="h-3.5 w-3.5 text-amber-500" />
                            <span className="font-mono font-bold">{totalQuizzes} Quizzes Taken</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
