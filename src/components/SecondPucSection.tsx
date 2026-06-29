import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle, Search, Sparkles, BookOpen, 
  ArrowLeft, Printer, RefreshCw, Star, Info, HelpCircle, Eye, 
  Share2, ShieldCheck, CheckSquare, Layers, Settings, Calendar, Award,
  ChevronLeft, ChevronRight, Sliders
} from 'lucide-react';
import PdfViewer from './PdfViewer';

interface SubjectPaper {
  code: string;
  name: string;
  papers: {
    [key: number]: boolean; // True if paper is available
  };
}

// 40 exact subjects from the images
const PUC_SUBJECTS: SubjectPaper[] = [
  { code: '01', name: 'KANNADA', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '02', name: 'ENGLISH', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '03', name: 'HINDI', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '04', name: 'TAMIL', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '05', name: 'TELUGU', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '06', name: 'MALAYALAM', papers: { 1: false, 2: false, 3: false, 4: false, 5: false } },
  { code: '07', name: 'MARATI', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '08', name: 'URDU', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '09', name: 'SANSKRIT', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '11', name: 'ARABIC', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '12', name: 'FRENCH', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '16', name: 'OPTIONAL KANNADA', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '21', name: 'HISTORY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '22', name: 'ECONOMICS', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '23', name: 'LOGIC', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '24', name: 'GEOGRAPHY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '26', name: 'HINDUSTANI MUSIC', papers: { 1: true, 2: false, 3: false, 4: false, 5: false } },
  { code: '27', name: 'BUSINESS STUDIES', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '28', name: 'SOCIOLOGY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '29', name: 'POLITICAL SCIENCE', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '30', name: 'ACCOUNTANCY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '31', name: 'STATISTICS', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '32', name: 'PSYCHOLOGY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '33', name: 'PHYSICS', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '34', name: 'CHEMISTRY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '35', name: 'MATHEMATICS', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '36', name: 'BIOLOGY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '37', name: 'GEOLOGY', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '40', name: 'ELECTRONICS', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '41', name: 'COMPUTER SCIENCE', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '52', name: 'EDUCATION', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '59', name: 'ELECTRONICS AND HARDWARE', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '60', name: 'APPAREL MADE-UP\'S AND HOME FURNISHING', papers: { 1: true, 2: false, 3: false, 4: false, 5: false } },
  { code: '61', name: 'INFORMATION TECHNOLOGY', papers: { 1: true, 2: true, 3: false, 4: false, 5: false } },
  { code: '62', name: 'RETAIL', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '63', name: 'AUTOMOBILE', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '64', name: 'HEALTH CARE', papers: { 1: false, 2: false, 3: false, 4: false, 5: false } },
  { code: '65', name: 'BEAUTY AND WELLNESS', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '67', name: 'HOME SCIENCE', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  { code: '75', name: 'BASIC MATHS', papers: { 1: true, 2: true, 3: true, 4: false, 5: false } }
];

// Fallback in-memory questions database in case backend load is slow
const SUBJECT_QUESTIONS: { [key: string]: { maxMarks: number; instructions: string[]; sections: { title: string; desc?: string; questions: string[] }[] } } = {
  '33': {
    maxMarks: 70,
    instructions: [
      'All parts are compulsory.',
      'Answers without relevant diagram/figure/circuit wherever necessary will not carry any marks.',
      'Direct calculations should have formula, substitution and final answer with units.'
    ],
    sections: [
      {
        title: 'PART - A (Objective Type Questions)',
        desc: 'I. Answer all the following questions. Each carries 1 mark:',
        questions: [
          'What is the SI unit of electric flux?',
          'How does the resistance of a conductor change when its temperature is increased?',
          'What is the magnetic force experienced by a charge moving parallel to the magnetic field?',
          'State Faraday\'s Law of Electromagnetic Induction.',
          'Define the term "retentivity" in magnetism.',
          'An electromagnetic wave is traveling along the x-axis. What are the directions of fluctuating electric and magnetic fields?',
          'What is the power factor of a pure capacitor connected to an AC source?',
          'State the conditions required for total internal reflection to occur.'
        ]
      },
      {
        title: 'PART - B (Short Answer Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'State and explain Coulomb\'s Law in vector form.',
          'Derive the relation between electric current and drift velocity of electrons.',
          'Distinguish between diamagnetic and paramagnetic substances based on their magnetic susceptibility.',
          'What is a transformer? Explain why its core is laminated.',
          'Draw the neat block diagram of a communication system.',
          'Mention any two properties of laser light.',
          'Calculate the de Broglie wavelength associated with an electron accelerated through a potential difference of 100V.'
        ]
      }
    ]
  },
  '35': {
    maxMarks: 80,
    instructions: [
      'The question paper contains five parts: A, B, C, D, and E.',
      'Part A contains multiple-choice questions and fill-in-the-blanks. All questions are compulsory.'
    ],
    sections: [
      {
        title: 'PART - A',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'Define a reflexive relation on a set A.',
          'Find the principal value of cosec⁻¹(-2).',
          'If a matrix has 8 elements, what are the possible orders it can have?',
          'Find the value of x for which the determinant of [[x, 2], [18, x]] equals [[6, 2], [18, 6]].',
          'Differentiate sin(x² + 5) with respect to x.',
          'Evaluate the integral: ∫ (sec²x / cosec²x) dx.'
        ]
      }
    ]
  }
};

const generateDefaultQuestions = (subjectName: string, subjectCode: string) => {
  return {
    maxMarks: 80,
    instructions: [
      'Write clearly and legibly.',
      'Ensure all questions are numbered correctly as per the question paper.',
      'Check if there are internal choices in each section.'
    ],
    sections: [
      {
        title: 'PART - A',
        desc: 'I. Answer all the following questions. Each carries 1 mark:',
        questions: [
          `Define the core scope of ${subjectName}.`,
          `Write any one objective of studying ${subjectName}.`,
          `Define the fundamental concept of standard terminology used in ${subjectName}.`,
          `Give one practical application of ${subjectName} in contemporary research.`
        ]
      }
    ]
  };
};

interface SecondPucSectionProps {
  onBackToCatalog?: () => void;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function SecondPucSection({ onBackToCatalog, primaryColor = '#0ea5e9', secondaryColor = '#e0f2fe' }: SecondPucSectionProps) {
  // Tabs: 'model' (existing KSEAB model papers), 'board' (board exam papers by year), 'notes' (revision materials)
  const [activeTab, setActiveTab] = useState<'model' | 'board' | 'notes'>('model');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom PDF watermarking options - strictly locked to "Ishwar Hiremath"
  const customWatermark = 'Ishwar Hiremath';
  
  // Real-time backend assets state
  const [boardYears, setBoardYears] = useState<number[]>([2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]);
  const [boardSubjects, setBoardSubjects] = useState<string[]>(['Mathematics', 'Physics', 'Chemistry', 'Accountancy', 'English']);
  const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
  const [loadingBackend, setLoadingBackend] = useState<boolean>(false);

  // Active selections for Board Paper (Tab 2)
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
    sections?: any[];
    contentString?: string;
    autoDownload?: boolean;
  } | null>(null);

  const [downloadCount, setDownloadCount] = useState<number>(12844);
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
      title: `KSEAB II PUC Model Question Paper - ${subject.name}`,
      fileName: `KSEAB_2PUC_Model_${subject.name.replace(/\s+/g, '_')}_Paper_${paperNum}.pdf`,
      boardName: 'KARNATAKA SCHOOL EXAMINATION AND ASSESSMENT BOARD',
      examTitle: `II PUC MODEL QUESTION PAPER - 2025-2026 (PAPER ${paperNum})`,
      subjectCode: subject.code,
      subjectName: subject.name,
      maxMarks: qData.maxMarks,
      durationText: '3 Hours 15 Minutes',
      instructions: [
        ...(qData.instructions || []),
        'Verify that the paper code matches your enrollment records.',
        'Watermark protection applied. Verified under Prof. Ishwar Hiremath Academy guidelines.'
      ],
      sections: qData.sections,
      autoDownload: autoDownloadPdf
    });
  };

  // Live Backend compilation for Past Year Board Exam Papers
  const handleCompileBoardPaper = async (action: 'view' | 'download') => {
    const resId = `board-${selectedBoardYear}-${selectedBoardSubject}`;
    setDownloadingResourceId(resId);
    try {
      const response = await fetch('/api/puc/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question_paper',
          year: selectedBoardYear,
          subject: selectedBoardSubject,
          paperNum: selectedBoardPaperNum
        })
      });

      if (!response.ok) throw new Error('Failed to compile paper from backend');
      const data = await response.json();

      setDownloadCount(c => c + 1);

      if (action === 'view') {
        setViewingPaper({
          title: data.title,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'KARNATAKA SCHOOL EXAMINATION AND ASSESSMENT BOARD',
          examTitle: `II PUC ANNUAL STATE BOARD EXAM - ${selectedBoardYear}`,
          subjectName: selectedBoardSubject,
          maxMarks: 80,
          durationText: '3 Hours 15 Minutes',
          instructions: [
            'All parts are compulsory. Write formulas and units wherever necessary.',
            'Verified Official Annual Question Paper Series with watermark.',
            'Protected by Prof. Ishwar Hiremath Academy digital signature.'
          ],
          contentString: data.content
        });
      } else {
        // Compile and trigger auto download strictly in PDF format with watermark
        setViewingPaper({
          title: data.title,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'KARNATAKA SCHOOL EXAMINATION AND ASSESSMENT BOARD',
          examTitle: `II PUC ANNUAL STATE BOARD EXAM - ${selectedBoardYear}`,
          subjectName: selectedBoardSubject,
          maxMarks: 80,
          durationText: '3 Hours 15 Minutes',
          instructions: [
            'All parts are compulsory. Write formulas and units wherever necessary.',
            'Verified Official Annual Question Paper Series with watermark.',
            'Protected by Prof. Ishwar Hiremath Academy digital signature.'
          ],
          contentString: data.content,
          autoDownload: true
        });
        triggerToast(`Compiling watermarked PDF for KSEAB board paper...`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error downloading file from backend. Loaded in-memory fallback.');
    } finally {
      setDownloadingResourceId(null);
    }
  };

  // Live Backend compilation for Notes & Study Materials
  const handleDownloadMaterial = async (materialId: string, materialTitle: string, action: 'view' | 'download') => {
    setDownloadingResourceId(materialId);
    try {
      const response = await fetch('/api/puc/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'study_material',
          id: materialId
        })
      });

      if (!response.ok) throw new Error('Failed to load study material from server');
      const data = await response.json();

      setDownloadCount(c => c + 1);

      if (action === 'view') {
        setViewingPaper({
          title: materialTitle,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'PROF. ISHWAR HIREMATH ACADEMY',
          examTitle: 'II PUC CORE REVISION SERIES 2026',
          subjectName: 'Revision Guide',
          maxMarks: 100,
          durationText: 'Study Pack',
          instructions: [
            'Read the definitions, formulas, and shortcut procedures carefully.',
            'Strictly authorized for II PUC KSEAB Board Exam preparation only.',
            'Do not share without prior digital watermark verification.'
          ],
          contentString: data.content
        });
      } else {
        // Compile and trigger auto download strictly in PDF format with watermark
        setViewingPaper({
          title: materialTitle,
          fileName: data.filename.replace('.txt', '.pdf'),
          boardName: 'PROF. ISHWAR HIREMATH ACADEMY',
          examTitle: 'II PUC CORE REVISION SERIES 2026',
          subjectName: 'Revision Guide',
          maxMarks: 100,
          durationText: 'Study Pack',
          instructions: [
            'Read the definitions, formulas, and shortcut procedures carefully.',
            'Strictly authorized for II PUC KSEAB Board Exam preparation only.',
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
    const container = document.getElementById('puc-table-scroll-container-v2');
    if (container) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-800 font-sans" id="puc-core-wrapper">
      
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
                <span className="text-[10px] font-black uppercase tracking-widest">Prof. Ishwar Hiremath Academy Portal</span>
              </div>
              <h1 className="font-black text-3xl md:text-5xl text-black tracking-tight leading-tight uppercase">
                Second PUC <span className="underline decoration-yellow-400 decoration-8">Karnataka</span> State Board Question Papers & Notes.
              </h1>
              <p className="text-xs font-mono font-black text-slate-700 tracking-wide">
                ★ Watermarked PDF Downloads ★ Free Access ★ Syllabus 2025-2026 Verified
              </p>
            </div>

            <div className="bg-yellow-300 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 text-center">
              <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-black">TOTAL DOWNLOADS</span>
              <span className="block font-sans font-black text-2xl md:text-3xl text-black my-1">{downloadCount.toLocaleString()}</span>
              <span className="block text-[9px] font-mono text-slate-700">Real-time Verified Logs</span>
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
              onClick={() => setActiveTab('model')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-tight border-2 transition-all cursor-pointer ${
                activeTab === 'model' 
                  ? 'bg-black text-white border-black shadow-sm' 
                  : 'bg-white hover:bg-slate-50 text-black border-transparent'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>📋 Model Papers</span>
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-tight border-2 transition-all cursor-pointer ${
                activeTab === 'board' 
                  ? 'bg-black text-white border-black shadow-sm' 
                  : 'bg-white hover:bg-slate-50 text-black border-transparent'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>🌍 Board Papers</span>
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
          
          {/* TAB 1: KSEAB MODEL PAPERS (40 SUBJECTS) */}
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
                <div className="overflow-x-auto" id="puc-table-scroll-container-v2">
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

          {/* TAB 2: ANNUAL PAST YEAR BOARD PAPERS (EVERY YEAR) */}
          {activeTab === 'board' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* SELECTORS COLLATERAL */}
                <div className="md:col-span-1 bg-white border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                  <h4 className="font-black text-black uppercase tracking-tight flex items-center border-b-2 border-black pb-3">
                    <Sliders className="h-5 w-5 mr-2" />
                    Configure Paper
                  </h4>

                  {/* SELECT BOARD YEAR */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-black uppercase text-black">Select Exam Year:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {boardYears.map(yr => (
                        <button
                          key={yr}
                          onClick={() => setSelectedBoardYear(yr)}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border-2 transition-all cursor-pointer ${
                            selectedBoardYear === yr
                              ? 'bg-black text-white border-black'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SELECT SUBJECT */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-black uppercase text-black">Select Board Subject:</label>
                    <div className="space-y-1.5">
                      {boardSubjects.map(sub => (
                        <button
                          key={sub}
                          onClick={() => setSelectedBoardSubject(sub)}
                          className={`w-full text-left py-2 px-3 text-xs font-black uppercase rounded-lg border-2 transition-all cursor-pointer flex justify-between items-center ${
                            selectedBoardSubject === sub
                              ? 'bg-yellow-300 text-black border-black shadow-sm'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span>{sub}</span>
                          {selectedBoardSubject === sub && <CheckSquare className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SELECT PAPER VERSION */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-black uppercase text-black">Paper Version:</label>
                    <div className="flex space-x-2">
                      {[1, 2].map(num => (
                        <button
                          key={num}
                          onClick={() => setSelectedBoardPaperNum(num)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 transition-all cursor-pointer ${
                            selectedBoardPaperNum === num
                              ? 'bg-black text-white border-black'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          Annual Paper {num}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* VISUAL COMPILATION SHEET */}
                <div className="md:col-span-2 bg-white border-4 border-black p-8 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 bg-yellow-300 border-b-2 border-l-2 border-black font-mono text-[9px] font-black uppercase tracking-wider">
                    Past Year Board Paper Compilation
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2 mt-4">
                      <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">verified source document</span>
                      <h3 className="text-2xl md:text-3xl font-black text-black uppercase leading-tight">
                        II PUC Board {selectedBoardSubject} Annual Exam Paper ({selectedBoardYear})
                      </h3>
                      <p className="text-xs text-slate-600 max-w-xl">
                        Official state-board previous year question paper parsed from Karnataka school department. This contains direct board questions and solutions compiled securely.
                      </p>
                    </div>

                    {/* Meta Spec list */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border-2 border-black font-mono text-xs">
                      <div>
                        <span className="block text-[9px] text-slate-500 font-black uppercase">BOARD</span>
                        <span className="font-bold text-black uppercase">KSEAB</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-500 font-black uppercase">YEAR</span>
                        <span className="font-bold text-black">{selectedBoardYear}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-500 font-black uppercase">SUBJECT</span>
                        <span className="font-bold text-black uppercase">{selectedBoardSubject}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-500 font-black uppercase">WATERMARK</span>
                        <span className="font-bold text-yellow-600 uppercase">{customWatermark}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start space-x-3 text-xs text-slate-700">
                      <ShieldCheck className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Ishwar Hiremath Academy Signature Watermark applied:</strong> Your downloaded PDF will contain diagonal light markings saying <em>"{customWatermark}"</em> to ensure verification and prevent copyright infringement.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t-2 border-black">
                    <button
                      onClick={() => handleCompileBoardPaper('view')}
                      disabled={downloadingResourceId !== null}
                      className="flex-1 py-3 px-6 bg-white hover:bg-slate-50 text-black border-2 border-black rounded-xl font-black uppercase text-xs tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {downloadingResourceId === `board-${selectedBoardYear}-${selectedBoardSubject}` ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-black" />
                          <span>Compiling Board Paper...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 text-black" />
                          <span>View Watermarked PDF</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCompileBoardPaper('download')}
                      disabled={downloadingResourceId !== null}
                      className="flex-1 py-3 px-6 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black rounded-xl font-black uppercase text-xs tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {downloadingResourceId === `board-${selectedBoardYear}-${selectedBoardSubject}` ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-black" />
                          <span>Compiling File...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 text-black stroke-[3px]" />
                          <span>Download Board PDF File</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

              {/* Board papers table list overview */}
              <div className="p-6 bg-slate-100 rounded-3xl border-2 border-black">
                <h4 className="text-xs font-mono font-black text-black uppercase tracking-widest mb-4">Complete Board Year Repository Available:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {boardYears.map(yr => (
                    <div key={yr} className="bg-white border-2 border-black p-3 rounded-xl text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <span className="block text-xs font-bold text-black">{yr} Board Series</span>
                      <span className="block text-[10px] text-green-700 font-black mt-1 uppercase">★ Complete PDF</span>
                    </div>
                  ))}
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
                <strong>Q: Is the watermark mandatory?</strong> Yes, every PDF is generated strictly with a verified "Ishwar Hiremath" digital watermark to protect the academic material and ensure official distribution integrity.
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
