import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle, Search, Sparkles, BookOpen, 
  ArrowLeft, Printer, RefreshCw, Star, Info, HelpCircle, Eye, 
  Share2, ShieldCheck, CheckSquare, Layers, Settings, Calendar, Award,
  ChevronLeft, ChevronRight, Sliders
} from 'lucide-react';
import PdfViewer from './PdfViewer';
import { 
  SubjectPaper, 
  PUC_SUBJECTS, 
  SUBJECT_QUESTIONS, 
  generateDefaultQuestions 
} from './SecondPucSection';

interface SecondPucOldSectionProps {
  onBackToCatalog?: () => void;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function SecondPucOldSection({ onBackToCatalog, primaryColor = '#0ea5e9', secondaryColor = '#e0f2fe' }: SecondPucOldSectionProps) {
  // Tabs: 'board' (board exam papers by year), 'model' (existing KSEAB model papers), 'notes' (revision materials)
  // Default to 'board' because this is the dedicated OLD question papers archive section
  const [activeTab, setActiveTab] = useState<'board' | 'model' | 'notes'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [boardSearchQuery, setBoardSearchQuery] = useState('');
  
  // Custom PDF watermarking options - strictly locked to "Ishwaryamat"
  const customWatermark = 'Ishwaryamat';
  
  // Real-time backend assets state
  const [boardYears, setBoardYears] = useState<number[]>([2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]);
  const [boardSubjects, setBoardSubjects] = useState<string[]>([
    'Kannada',
    'English',
    'Hindi',
    'Urdu',
    'History',
    'Economics',
    'Business Studies',
    'Political Science',
    'Sociology',
    'Accountancy',
    'Statistics',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Computer Science'
  ]);
  const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
  const [loadingBackend, setLoadingBackend] = useState<boolean>(false);

  // Active selections for Board Paper (Tab 1)
  const [selectedBoardYear, setSelectedBoardYear] = useState<number>(2025);
  const [selectedBoardSubject, setSelectedBoardSubject] = useState<string>('Mathematics');
  const [selectedBoardPaperNum, setSelectedBoardPaperNum] = useState<number>(1);

  // PDF Viewer active state
  const [viewingPaper, setViewingPaper] = useState<{
    title: string;
    fileName: string;
    boardName: string;
    examTitle: string;
    subjectCode?: string;
    subjectName: string;
    maxMarks: number;
    durationText: string;
    instructions: string[];
    sections: { title: string; desc?: string; questions: string[] }[];
    contentString?: string;
    autoDownload?: boolean;
  } | null>(null);

  const [downloadCount, setDownloadCount] = useState<number>(18422);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [downloadingResourceId, setDownloadingResourceId] = useState<string | null>(null);

  // Fetch lists from backend
  useEffect(() => {
    setLoadingBackend(true);
    fetch('/api/puc/papers')
      .then(res => res.json())
      .then(data => {
        if (data.years) setBoardYears(data.years);
        if (data.subjects) setBoardSubjects(data.subjects);
        if (data.materials) setStudyMaterials(data.materials);
      })
      .catch(err => console.error('Failed to load PUC database:', err))
      .finally(() => setLoadingBackend(false));
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenModelPaper = (subject: SubjectPaper, paperNum: number, autoDownloadPdf = false) => {
    const qData = SUBJECT_QUESTIONS[subject.code] || generateDefaultQuestions(subject.name, subject.code);
    setViewingPaper({
      title: `KSEAB II PUC Old Model Question Paper - ${subject.name}`,
      fileName: `KSEAB_2PUC_Old_Model_${subject.name.replace(/\s+/g, '_')}_Paper_${paperNum}.pdf`,
      boardName: 'KARNATAKA SCHOOL EXAMINATION AND ASSESSMENT BOARD',
      examTitle: `II PUC OLD MODEL QUESTION PAPER - 2025-2026 (PAPER ${paperNum})`,
      subjectCode: subject.code,
      subjectName: subject.name,
      maxMarks: qData.maxMarks,
      durationText: '3 Hours 15 Minutes',
      instructions: [
        ...(qData.instructions || []),
        'Verify that the paper code matches your enrollment records.',
        'Watermark protection applied. Verified under Ishwaryamat Academy guidelines.'
      ],
      sections: qData.sections,
      autoDownload: autoDownloadPdf
    });
  };

  // Live Backend compilation for Past Year Board Exam Papers
  const handleCompileBoardPaper = async (action: 'view' | 'download', subjectName?: string, year?: number) => {
    const targetSubject = subjectName || selectedBoardSubject;
    const targetYear = year || selectedBoardYear;
    const resId = `board-${targetYear}-${targetSubject}`;
    setDownloadingResourceId(resId);
    try {
      const response = await fetch('/api/puc/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question_paper',
          year: targetYear,
          subject: targetSubject
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from backend compile service');
      }

      const data = await response.json();
      setDownloadCount(c => c + 1);

      if (action === 'view') {
        setViewingPaper({
          title: data.title,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'KARNATAKA SCHOOL EXAMINATION AND ASSESSMENT BOARD',
          examTitle: `II PUC ANNUAL STATE BOARD EXAM - ${targetYear}`,
          subjectName: targetSubject,
          maxMarks: 80,
          durationText: '3 Hours 15 Minutes',
          instructions: [
            'All parts are compulsory. Write formulas and units wherever necessary.',
            'Verified Official Annual Question Paper Series with watermark.',
            'Protected by Ishwaryamat Academy digital signature.'
          ],
          contentString: data.content
        });
      } else {
        // Compile and trigger auto download strictly in PDF format with watermark
        setViewingPaper({
          title: data.title,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'KARNATAKA SCHOOL EXAMINATION AND ASSESSMENT BOARD',
          examTitle: `II PUC ANNUAL STATE BOARD EXAM - ${targetYear}`,
          subjectName: targetSubject,
          maxMarks: 80,
          durationText: '3 Hours 15 Minutes',
          instructions: [
            'All parts are compulsory. Write formulas and units wherever necessary.',
            'Verified Official Annual Question Paper Series with watermark.',
            'Protected by Ishwaryamat Academy digital signature.'
          ],
          contentString: data.content,
          autoDownload: true
        });
        triggerToast(`Compiling watermarked PDF for KSEAB board paper...`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to compile digital Board Exam paper. Please retry.');
    } finally {
      setDownloadingResourceId(null);
    }
  };

  const handleDownloadMaterial = async (id: string, materialTitle: string, action: 'view' | 'download') => {
    setDownloadingResourceId(id);
    try {
      const response = await fetch('/api/puc/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'study_material',
          id: id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to compile study note');
      }

      const data = await response.json();
      setDownloadCount(c => c + 1);

      if (action === 'view') {
        setViewingPaper({
          title: data.title,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'KARNATAKA II PUC REVISION MANUALS',
          examTitle: `STUDY RESOURCE: ${materialTitle.toUpperCase()}`,
          subjectName: 'Revision Guide',
          maxMarks: 100,
          durationText: 'Reference Only',
          instructions: [
            'For self-study, reference, and exam preparation only.',
            'Do not share without prior digital watermark verification.'
          ],
          contentString: data.content
        });
      } else {
        setViewingPaper({
          title: data.title,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'KARNATAKA II PUC REVISION MANUALS',
          examTitle: `STUDY RESOURCE: ${materialTitle.toUpperCase()}`,
          subjectName: 'Revision Guide',
          maxMarks: 100,
          durationText: 'Reference Only',
          instructions: [
            'For self-study, reference, and exam preparation only.',
            'Do not share without prior digital watermark verification.'
          ],
          contentString: data.content,
          autoDownload: true
        });
        triggerToast(`Compiling watermarked PDF for ${materialTitle}...`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error compilation of study note. Please try again.');
    } finally {
      setDownloadingResourceId(null);
    }
  };

  const filteredSubjects = PUC_SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.code.includes(searchQuery)
  );

  const scrollTable = (direction: 'left' | 'right') => {
    const container = document.getElementById('puc-old-table-scroll-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-800 font-sans" id="puc-old-core-wrapper">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white border-4 border-yellow-300 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-3 font-sans max-w-md animate-bounce">
          <Sparkles className="h-6 w-6 text-yellow-300 animate-spin" />
          <span className="text-xs font-black uppercase tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BANNER - NeoBrutalist Theme */}
      {!viewingPaper && (
        <div className="mb-8 p-6 md:p-8 rounded-3xl bg-white border-4 border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-40 -mr-10 -mt-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center space-x-2 bg-yellow-300 border-2 border-black px-3 py-1 rounded-full w-fit">
                <Award className="h-4 w-4 text-black animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Ishwaryamat PYQ Repository</span>
              </div>
              <h1 className="font-black text-3xl md:text-5xl text-black tracking-tight leading-tight uppercase">
                Second PUC <span className="underline decoration-yellow-400 decoration-8">Old Question Papers</span> (KSEAB)
              </h1>
              <p className="text-xs font-mono font-black text-slate-700 tracking-wide">
                ★ Official Previous Year Board Papers & Keys ★ Download Watermarked PDFs ★ 100% Free Access
              </p>
            </div>

            <div className="bg-yellow-300 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 text-center">
              <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-black">OLD PAPERS DOWNLOADED</span>
              <span className="block font-sans font-black text-2xl md:text-3xl text-black my-1">{downloadCount.toLocaleString()}</span>
              <span className="block text-[9px] font-mono text-slate-700">Official Board Series</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PAPER IN PORTAL */}
      {viewingPaper && (
        <div className="mb-6">
          <PdfViewer
            title={viewingPaper.title}
            fileName={viewingPaper.fileName}
            boardName={viewingPaper.boardName}
            examTitle={viewingPaper.examTitle}
            subjectCode={viewingPaper.subjectCode}
            subjectName={viewingPaper.subjectName}
            maxMarks={viewingPaper.maxMarks}
            durationText={viewingPaper.durationText}
            instructions={viewingPaper.instructions}
            sections={viewingPaper.sections}
            contentString={viewingPaper.contentString}
            watermarkText={customWatermark}
            autoDownload={viewingPaper.autoDownload}
            onClose={() => setViewingPaper(null)}
          />
        </div>
      )}

      {/* TAB NAVIGATION PANEL */}
      {!viewingPaper && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-100 p-2 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            
            <button
              onClick={() => setActiveTab('board')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-tight border-2 transition-all cursor-pointer ${
                activeTab === 'board' 
                  ? 'bg-black text-white border-black shadow-sm' 
                  : 'bg-white hover:bg-slate-50 text-black border-transparent'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>🌍 PYQ Board Papers</span>
            </button>

            <button
              onClick={() => setActiveTab('model')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-tight border-2 transition-all cursor-pointer ${
                activeTab === 'model' 
                  ? 'bg-black text-white border-black shadow-sm' 
                  : 'bg-white hover:bg-slate-50 text-black border-transparent'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>📋 Model Papers Archive</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-tight border-2 transition-all cursor-pointer ${
                activeTab === 'notes' 
                  ? 'bg-black text-white border-black shadow-sm' 
                  : 'bg-white hover:bg-slate-50 text-black border-transparent'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>📚 Revision Notes</span>
            </button>

          </div>
        </div>
      )}

      {/* TAB CONTENT SPACES */}
      {!viewingPaper && (
        <div className="space-y-6">
          
          {/* TAB 1: ANNUAL PAST YEAR BOARD PAPERS (EVERY YEAR) */}
          {activeTab === 'board' && (
            <div className="space-y-6">
              
              {/* YEAR SELECTOR ROW */}
              <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-black uppercase text-sm tracking-tight flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-yellow-500 animate-bounce" />
                      Step 1: Select Board Exam Year
                    </h3>
                    <p className="text-xs text-slate-500">Choose the previous year board exam session to access the official papers.</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 border-2 border-black px-3 py-1 rounded-full text-[10px] font-mono font-black text-slate-700 w-fit">
                    <ShieldCheck className="h-4 w-4 text-green-600 mr-1" />
                    Ishwaryamat Watermark Applied
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  {boardYears.map(yr => (
                    <button
                      key={yr}
                      onClick={() => setSelectedBoardYear(yr)}
                      className={`py-3 px-2 text-xs font-black rounded-xl border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer active:translate-y-[1px] ${
                        selectedBoardYear === yr
                          ? 'bg-black text-white border-black'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-black'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEARCH & WATERMARK DETAILS */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={boardSearchQuery}
                    onChange={(e) => setBoardSearchQuery(e.target.value)}
                    placeholder="Search board subjects (Kannada, Math, Hindi...)"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-2 border-black rounded-xl text-xs text-black placeholder-slate-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-600 bg-yellow-100 border border-yellow-300 px-3 py-1.5 rounded-xl font-bold">
                  ★ Selected Year: <span className="text-black font-black underline">{selectedBoardYear} Session</span>
                </div>
              </div>

              {/* DIRECT SUBJECT DOWNLOAD GRID / TABLE */}
              <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="bg-slate-900 text-white px-6 py-4 border-b-4 border-black flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sliders className="h-5 w-5 text-yellow-300" />
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-yellow-300">
                      Step 2: Instant Subject PDF Download ({selectedBoardYear} Session)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-black font-mono text-[10px] uppercase font-black tracking-wider border-b-2 border-black">
                        <th className="px-6 py-4 border-r-2 border-black w-2/3">Subject / Language</th>
                        <th className="px-6 py-4 text-center">Action Options (Watermarked PDF)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black">
                      {boardSubjects
                        .filter(sub => sub.toLowerCase().includes(boardSearchQuery.toLowerCase()))
                        .map((sub, idx) => {
                          const isDownloadingThis = downloadingResourceId === `board-${selectedBoardYear}-${sub}`;
                          
                          // Determine subject specific badge/color for neat styling
                          let badgeBg = 'bg-blue-100 text-blue-800 border-blue-400';
                          const norm = sub.toLowerCase();
                          if (['kannada', 'english', 'hindi', 'urdu'].includes(norm)) {
                            badgeBg = 'bg-yellow-100 text-yellow-900 border-yellow-400';
                          } else if (['mathematics', 'physics', 'chemistry', 'biology', 'computer science'].includes(norm)) {
                            badgeBg = 'bg-teal-100 text-teal-900 border-teal-400';
                          } else if (['accountancy', 'business studies', 'statistics', 'economics'].includes(norm)) {
                            badgeBg = 'bg-purple-100 text-purple-900 border-purple-400';
                          } else {
                            badgeBg = 'bg-orange-100 text-orange-900 border-orange-400';
                          }

                          return (
                            <tr key={sub} className={`hover:bg-slate-50/50 transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/10'}`}>
                              <td className="px-6 py-4 border-r-2 border-black">
                                <div className="flex items-center space-x-3">
                                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border-2 ${badgeBg}`}>
                                    {sub.substring(0, 3).toUpperCase()}
                                  </span>
                                  <div>
                                    <span className="text-xs font-black text-black uppercase tracking-wide">
                                      {sub}
                                    </span>
                                    <span className="block text-[9px] font-mono text-slate-500 uppercase mt-0.5">
                                      Karnataka II PUC Board • {selectedBoardYear} Annual Paper
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center space-x-3">
                                  
                                  {/* VIEW BUTTON */}
                                  <button
                                    onClick={() => handleCompileBoardPaper('view', sub, selectedBoardYear)}
                                    disabled={downloadingResourceId !== null}
                                    title="View PDF"
                                    className="p-2.5 bg-white hover:bg-slate-50 text-black border-2 border-black rounded-xl font-black uppercase tracking-tight shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer transition-all flex items-center justify-center"
                                  >
                                    {isDownloadingThis ? (
                                      <RefreshCw className="h-4 w-4 animate-spin text-black" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-black" />
                                    )}
                                  </button>

                                  {/* DOWNLOAD BUTTON */}
                                  <button
                                    onClick={() => handleCompileBoardPaper('download', sub, selectedBoardYear)}
                                    disabled={downloadingResourceId !== null}
                                    title="Download PDF"
                                    className="p-2.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black uppercase tracking-tight shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer transition-all flex items-center justify-center"
                                  >
                                    {isDownloadingThis ? (
                                      <RefreshCw className="h-4 w-4 animate-spin text-black" />
                                    ) : (
                                      <Download className="h-4 w-4 text-black stroke-[3px]" />
                                    )}
                                  </button>

                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t-4 border-black text-center font-mono text-[9px] font-black uppercase text-slate-700">
                  🛡️ WATERMARKED WITH "{customWatermark.toUpperCase()}" TO ENSURE OFFICIAL BRAND COMPLIANCE 🛡️
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KSEAB MODEL PAPERS (40 SUBJECTS) */}
          {activeTab === 'model' && (
            <div className="space-y-6">
              
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-black" />
                  <h3 className="text-xs font-black text-black uppercase tracking-tight">
                    KSEAB Model Papers Curriculum Table
                  </h3>
                </div>
                
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 40 subjects..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-2 border-black rounded-xl text-xs text-black placeholder-slate-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                
                {/* Scroll Controller Row */}
                <div className="bg-yellow-300 px-6 py-4 border-b-4 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-black uppercase tracking-wider">
                      II PUC KANNADA MODEL QUESTION PAPER 2026 FREE DOWNLOAD TABLE
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button 
                      onClick={() => scrollTable('left')}
                      className="p-2 bg-white hover:bg-slate-50 text-black border-2 border-black rounded-lg font-mono font-bold text-xs cursor-pointer transition-all active:translate-y-[1px]"
                    >
                      ◀ SCROLL LEFT
                    </button>
                    <button 
                      onClick={() => scrollTable('right')}
                      className="p-2 bg-white hover:bg-slate-50 text-black border-2 border-black rounded-lg font-mono font-bold text-xs cursor-pointer transition-all active:translate-y-[1px]"
                    >
                      SCROLL RIGHT ▶
                    </button>
                  </div>
                </div>

                {/* Table Body */}
                <div className="overflow-x-auto" id="puc-old-table-scroll-container">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-black font-mono text-[10px] uppercase font-black tracking-wider border-b-2 border-black">
                        <th className="px-6 py-4 border-r-2 border-black">Subject Code & Name</th>
                        <th className="px-4 py-4 text-center border-r-2 border-black">Paper 1</th>
                        <th className="px-4 py-4 text-center border-r-2 border-black">Paper 2</th>
                        <th className="px-4 py-4 text-center border-r-2 border-black">Paper 3</th>
                        <th className="px-4 py-4 text-center border-r-2 border-black">Paper 4</th>
                        <th className="px-4 py-4 text-center">Paper 5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black">
                      {filteredSubjects.map((subject, index) => (
                        <tr 
                          key={subject.code} 
                          className={`hover:bg-slate-50 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}
                        >
                          <td className="px-6 py-3.5 whitespace-nowrap border-r-2 border-black font-mono">
                            <div className="flex items-center space-x-3">
                              <span className="text-[10px] font-black text-black bg-yellow-300 border-2 border-black px-2 py-0.5 rounded">
                                {subject.code}
                              </span>
                              <span className="text-xs font-black text-black tracking-wide uppercase">
                                {subject.name}
                              </span>
                            </div>
                          </td>

                          {[1, 2, 3, 4, 5].map((paperNum) => {
                            const isAvailable = subject.papers[paperNum];
                            return (
                              <td key={paperNum} className={`px-4 py-3 text-center whitespace-nowrap border-r-2 border-black ${paperNum === 5 ? 'border-r-0' : ''}`}>
                                {isAvailable ? (
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => handleOpenModelPaper(subject, paperNum)}
                                      className="inline-flex items-center justify-center p-2 bg-white hover:bg-yellow-300 text-black rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer"
                                      title={`View & Print ${subject.name} Paper ${paperNum}`}
                                    >
                                      <Eye className="h-3.5 w-3.5 text-black" />
                                    </button>
                                    <button
                                      onClick={() => handleOpenModelPaper(subject, paperNum)}
                                      className="inline-flex items-center justify-center p-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer"
                                      title={`Download ${subject.name} Paper ${paperNum}`}
                                    >
                                      <Download className="h-3.5 w-3.5 text-black font-black" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 font-mono font-bold">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer banner inside table */}
                <div className="bg-slate-50 px-6 py-4 border-t-4 border-black text-center font-mono text-[10px] font-black uppercase text-black">
                  🛡️ WATERMARKED WITH "{customWatermark.toUpperCase()}" ON ALL GENERATED PDF FILES 🛡️
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: STUDY MATERIALS & REVISION NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              
              {loadingBackend ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-black mb-4" />
                  <span className="text-xs font-black uppercase tracking-wider font-mono">Fetching latest notes from portal...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studyMaterials.map((material) => (
                    <div 
                      key={material.id} 
                      className="bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:translate-y-[-2px] transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-yellow-300 border-2 border-black px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase">
                            {material.subject}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            Topic: {material.topic}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-black uppercase tracking-tight">
                          {material.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {material.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 mt-6 pt-4 border-t-2 border-slate-100">
                        <button
                          onClick={() => handleDownloadMaterial(material.id, material.title, 'view')}
                          disabled={downloadingResourceId !== null}
                          className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-tight active:translate-y-[1px] cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                          {downloadingResourceId === material.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin text-black" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleDownloadMaterial(material.id, material.title, 'download')}
                          disabled={downloadingResourceId !== null}
                          className="flex-1 py-2 px-3 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-tight active:translate-y-[1px] cursor-pointer flex items-center justify-center space-x-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        >
                          {downloadingResourceId === material.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin text-black" />
                          ) : (
                            <Download className="h-3.5 w-3.5 stroke-[3px]" />
                          )}
                          <span>Download PDF</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {studyMaterials.length === 0 && !loadingBackend && (
                <div className="text-center py-12 bg-white border-2 border-black rounded-3xl">
                  <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-600">No active notes files found in backend store.</p>
                </div>
              )}

            </div>
          )}

          {/* Core Info / FAQ block */}
          <div className="p-6 bg-slate-50 border-2 border-black rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-2">
              <h4 className="text-sm font-black text-black uppercase flex items-center">
                <Info className="h-4 w-4 mr-2 text-yellow-500" />
                Frequently Asked Questions (FAQ)
              </h4>
              <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
                <strong>Q: Are these official questions?</strong> Yes, these model and board papers are verified KSEAB curriculum, parsed and optimized for clean, watermarked PDF generation.
                <br />
                <strong>Q: Is the watermark mandatory?</strong> Yes, every PDF is generated strictly with a verified "Ishwaryamat" digital watermark to protect the academic material and ensure official distribution integrity.
              </p>
            </div>
            
            {onBackToCatalog && (
              <button
                onClick={onBackToCatalog}
                className="w-full md:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer shrink-0"
              >
                Go to Courses Catalog
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
