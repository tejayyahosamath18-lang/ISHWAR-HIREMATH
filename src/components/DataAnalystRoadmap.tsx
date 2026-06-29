import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Table, BarChart3, Code2, Cloud, BrainCircuit, Wrench, 
  FolderGit2, MessageSquare, Award, Search, ExternalLink, 
  CheckCircle2, Circle, BookOpen, ChevronRight, FileText, Check, 
  Sparkles, Users, Lightbulb, HelpCircle, PenTool, Bookmark, Play, 
  Compass, Briefcase, RefreshCw, Star, Info, UploadCloud, FileSpreadsheet,
  Image as ImageIcon, Trash2, ZoomIn, Download, Split, Maximize2, Minimize2,
  CheckSquare
} from 'lucide-react';

interface RoadmapSection {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  category: 'Technical' | 'Projects' | 'Core Skills' | 'Career';
  icon: React.ComponentType<any>;
  whyImportant?: string;
  whatToLearn: string[];
  topicsToCover?: string[];
  realLifeExamples?: string[];
  resources: {
    title: string;
    url: string;
    type: 'youtube' | 'udemy' | 'w3schools' | 'hackerrank' | 'leetcode' | 'external';
    videoId?: string;
    channel?: string;
    duration?: string;
  }[];
  keyPoints?: {
    title: string;
    points: string[];
  }[];
  notesPlaceholder?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  text?: string;
  parsedCsv?: string[][];
  uploadedAt: string;
}

const ROADMAP_DATA: RoadmapSection[] = [
  {
    id: 'excel',
    number: 1,
    title: 'Excel (Beginner to Advanced)',
    subtitle: 'The Spreadsheet Foundation',
    category: 'Technical',
    icon: Table,
    whyImportant: 'Used in every business sector for rapid data auditing, cleaning, and tactical summary reports.',
    whatToLearn: [
      'Basics of Excel – Conditional Formatting, Sorting, Multi-level Filtering',
      'Basic Aggregation Functions (SUM, COUNT, COUNTA, AVERAGE)',
      'Logical Functions (IF, IFS, AND, OR)',
      'Advanced Lookup Functions – VLOOKUP, HLOOKUP, XLOOKUP',
      'Pivot Tables, Calculated Fields & Data Slicers',
      'Interactive Charts & Dynamic Executive Dashboards'
    ],
    resources: [
      { title: 'Excel Full Course (YouTube) - Part 1', url: 'https://www.youtube.com/watch?v=OX-iyb-21tk', type: 'youtube', videoId: 'OX-iyb-21tk', channel: 'DATAWIZ', duration: '3h 15m' },
      { title: 'Excel Advanced Formulas (YouTube) - Part 2', url: 'https://www.youtube.com/watch?v=7lU-pz_wBXY', type: 'youtube', videoId: '7lU-pz_wBXY', channel: 'DATAWIZ', duration: '2h 10m' },
      { title: 'Pivot Tables & Dashboards Guide (YouTube) - Part 3', url: 'https://www.youtube.com/watch?v=7QNgqq154gE', type: 'youtube', videoId: '7QNgqq154gE', channel: 'DATAWIZ', duration: '1h 45m' }
    ],
    notesPlaceholder: 'E.g., Practice XLOOKUP formula vs VLOOKUP handles columns to the left.'
  },
  {
    id: 'sql',
    number: 2,
    title: 'SQL (MOST IMPORTANT)',
    subtitle: 'Relational Database Language',
    category: 'Technical',
    icon: Database,
    whyImportant: 'The absolute cornerstone of structured data extraction. Core requirement for 90%+ of analyst positions.',
    whatToLearn: [
      'Basics of DBMS (Relational schemas, primary keys, foreign keys)',
      'Basic Queries - SELECT, WHERE, DISTINCT, LIKE, BETWEEN, IN',
      'Aggregation & Filtering - GROUP BY, HAVING',
      'Table Relationships - JOINs (Inner, Left, Right, Full Outer)',
      'Subqueries & Common Table Expressions (CTEs)',
      'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG)',
      'Basic DB Optimization & Stored Procedures'
    ],
    topicsToCover: [
      'ER Diagram modeling',
      'String parsing & Date parsing functions in SQL',
      'Optimizing JOIN performance over large indexes'
    ],
    realLifeExamples: [
      'Extract top customers by aggregate monthly sales',
      'Generate sequential month-over-month growth metrics'
    ],
    resources: [
      { title: 'SQL Basics Crash Course (YouTube)', url: 'https://youtu.be/D_wNQR3LeeM', type: 'youtube', videoId: 'D_wNQR3LeeM', channel: 'Alex The Analyst', duration: '45m' },
      { title: 'Advanced SQL Query Guide (YouTube)', url: 'https://www.youtube.com/watch?v=SSKVgrwhzus', type: 'youtube', videoId: 'SSKVgrwhzus', channel: 'Programming with Mosh', duration: '1h 20m' },
      { title: 'W3Schools SQL Tutorial (Interactive Practice)', url: 'https://www.w3schools.com/sql/', type: 'w3schools', channel: 'W3Schools' },
      { title: 'HackerRank SQL Practice (All Tracks)', url: 'https://www.hackerrank.com/domains/sql', type: 'hackerrank', channel: 'HackerRank' },
      { title: 'LeetCode Top SQL 50 (Interview Ready)', url: 'https://leetcode.com/studyplan/top-sql-50/', type: 'leetcode', channel: 'LeetCode' }
    ],
    notesPlaceholder: 'E.g., CTEs are defined using WITH. Window functions operate over an OVER (PARTITION BY...) clause.'
  },
  {
    id: 'statistics',
    number: 3,
    title: 'Statistics',
    subtitle: 'Data-driven Decision Science',
    category: 'Technical',
    icon: BarChart3,
    whyImportant: 'Differentiates random variation from true business patterns, validating experimental results.',
    whatToLearn: [
      'Descriptive Statistics - Mean, Median, Mode, Standard Deviation, Variance, Skewness',
      'Probability Distributions (Normal, Binomial, Poisson)',
      'Correlation, Covariance, and Simple Linear Regression',
      'Hypothesis Testing (p-values, t-tests, ANOVA, Null Hypothesis)'
    ],
    resources: [
      { title: 'Statistics for Data Science (YouTube Playlist)', url: 'https://youtu.be/LZzq1zSL1bs', type: 'youtube', videoId: 'LZzq1zSL1bs', channel: 'DATAWIZ Stats', duration: '2h 15m' },
      { title: 'Advanced Statistical Methods (YouTube)', url: 'https://www.youtube.com/watch?v=L_OLifCqxCQ', type: 'youtube', videoId: 'L_OLifCqxCQ', channel: 'StatQuest', duration: '1h 30m' }
    ],
    notesPlaceholder: 'E.g., P-value < 0.05 generally rejects the Null Hypothesis in business experiments.'
  },
  {
    id: 'bi',
    number: 4,
    title: 'Power BI / Tableau (Visualization)',
    subtitle: 'Interactive Executive Reporting',
    category: 'Technical',
    icon: BarChart3,
    whyImportant: 'Translates query outputs into gorgeous interactive dashboards for C-suite decision makers.',
    whatToLearn: [
      'Data Connections, ETL, and transformations (Power Query)',
      'Data Modeling, Star Schemas, relationships',
      'DAX modeling (Measures, Calculated Columns, Time Intelligence)',
      'Dashboard Design, Filter Panes, Bookmarks, and Row-Level Security'
    ],
    realLifeExamples: [
      'Executive Sales dashboard monitoring regional profit margins',
      'Logistics tracking KPI cockpit showing delivery delays'
    ],
    resources: [
      { title: 'Power BI Beginner Course (YouTube)', url: 'https://youtu.be/KdC5R7oPCAI', type: 'youtube', videoId: 'KdC5R7oPCAI', channel: 'Chandoo', duration: '1h 05m' },
      { title: 'Dashboard Visualization Guide (YouTube)', url: 'https://youtu.be/GbszEsOY3wo', type: 'youtube', videoId: 'GbszEsOY3wo', channel: 'Avi Singh', duration: '2h 10m' }
    ],
    notesPlaceholder: 'E.g., Star Schema (Fact tables & Dimension tables) is standard for report performance.'
  },
  {
    id: 'python',
    number: 5,
    title: 'Python',
    subtitle: 'General Purpose Analytical Engine',
    category: 'Technical',
    icon: Code2,
    whyImportant: 'Indispensable for custom data pipelines, scraping, scaling, and advanced ETL automation.',
    whatToLearn: [
      'Python Syntax Basics – Lists, Dictionaries, Loops, Functions',
      'Pandas library for dataframe parsing, cleaning, and merging',
      'NumPy library for vector math and multi-dimensional calculations',
      'Matplotlib & Seaborn libraries for beautiful static visualizations',
      'Exploratory Data Analysis (EDA) and data cleansing workflows'
    ],
    resources: [
      { title: 'Python for Beginners (YouTube Masterclass)', url: 'https://youtu.be/GPVsHOlRBBI', type: 'youtube', videoId: 'GPVsHOlRBBI', channel: 'Programming with Mosh', duration: '6h' },
      { title: 'Pandas & EDA Guided Practice (YouTube)', url: 'https://youtu.be/UrsmFxEIp5k', type: 'youtube', videoId: 'UrsmFxEIp5k', channel: 'Corey Schafer', duration: '1h 45m' },
      { title: 'W3Schools Python Guide', url: 'https://www.w3schools.com/python/', type: 'w3schools', channel: 'W3Schools' }
    ],
    notesPlaceholder: 'E.g., Use df.dropna() to drop nulls and df.groupby() to aggregate records in Pandas.'
  },
  {
    id: 'cloud',
    number: 6,
    title: 'CLOUD (Basics)',
    subtitle: 'Scaling Analytical Pipelines',
    category: 'Technical',
    icon: Cloud,
    whyImportant: 'Modern analytical systems are fully cloud-hosted. Knowledge is key to scaling calculations.',
    whatToLearn: [
      'AWS Analytics Overview (S3 storage, Redshift warehousing, Athena)',
      'Azure Cloud components (Synapse, Blob Storage, ADLS)',
      'Databricks workspace and Spark cluster configurations',
      'GCP (Google Cloud Platform) BigQuery databases and cloud buckets'
    ],
    resources: [
      { title: 'Cloud Computing Core Concepts (YouTube)', url: 'https://youtu.be/Nzv-tzU-UAw', type: 'youtube', videoId: 'Nzv-tzU-UAw', channel: 'Edureka', duration: '1h 10m' },
      { title: 'Cloud Data Warehouse Architecture (YouTube)', url: 'https://youtu.be/ULiPYBLcCiw', type: 'youtube', videoId: 'ULiPYBLcCiw', channel: 'DATAWIZ Cloud', duration: '55m' }
    ],
    notesPlaceholder: 'E.g., AWS S3 stores raw raw logs; BigQuery acts as serverless multi-terabyte analytical DB.'
  },
  {
    id: 'aitools',
    number: 7,
    title: 'AI Tools',
    subtitle: 'Increasing Analytical Leverage',
    category: 'Technical',
    icon: BrainCircuit,
    whyImportant: 'Using generative AI models accelerates query generation, formula debugging, and logic reviews.',
    whatToLearn: [
      'Prompt engineering for writing/debugging SQL queries & Python code',
      'Using code models to draft Excel formulas and complex DAX measures',
      'Ethical verification of AI outputs for security and logical accuracy'
    ],
    resources: [
      { title: 'AI-Powered Data Analysis Tutorial (YouTube)', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', type: 'youtube', videoId: 'vmEHCJofslg', channel: 'DATAWIZ', duration: '40m' }
    ],
    notesPlaceholder: 'E.g., Prompt: "Explain this SQL window function query step-by-step to a beginner."'
  },
  {
    id: 'optional',
    number: 8,
    title: 'Optional Tech Skills',
    subtitle: 'Expanding Your Toolkit',
    category: 'Technical',
    icon: Wrench,
    whyImportant: 'Adds versatility for specialized data architectures or enterprise application integration.',
    whatToLearn: [
      'Airflow or Prefect basics for task scheduling & orchestration',
      'dbt (data build tool) for SQL transformations',
      'Git & GitHub version control (commits, branching, pull requests)',
      'Google Sheets Apps Script automation'
    ],
    resources: [
      { title: 'Git & GitHub Crash Course (YouTube)', url: 'https://www.youtube.com/watch?v=fAAZixBzIAI', type: 'youtube', videoId: 'fAAZixBzIAI', channel: 'DATAWIZ', duration: '1h 15m' }
    ],
    notesPlaceholder: 'E.g., git commit saves changes locally; git push publishes changes to remote repository.'
  },
  {
    id: 'projects',
    number: 9,
    title: 'Projects (MOST UNDERRATED)',
    subtitle: 'Portfolio Architecture',
    category: 'Projects',
    icon: FolderGit2,
    whyImportant: 'The ultimate separator on an application. Standard resumes show credentials, elite resumes show active projects.',
    whatToLearn: [
      'Clean data pipelines (extract messy raw values, clean, join)',
      'Designing clean schema tables & publishing dynamic dashboards',
      'Hosting portfolio code on GitHub with comprehensive README files',
      'Documenting key business findings in formal executive summaries'
    ],
    topicsToCover: [
      'Sourcing open datasets (Kaggle, Google Dataset Search)',
      'Handling missing values, duplicate lines, outlier records',
      'Documenting the "Why", "How", and "Results" of projects'
    ],
    realLifeExamples: [
      'Fulfillment optimization project calculating shipping cost savings',
      'E-commerce user retention and churn analysis'
    ],
    resources: [
      { title: 'Step-by-Step Data Analyst Project Portfolio (YouTube)', url: 'https://www.youtube.com/watch?v=D_wNQR3LeeM', type: 'youtube', videoId: 'D_wNQR3LeeM', channel: 'Alex The Analyst', duration: '1h 35m' }
    ],
    notesPlaceholder: 'Build 1 SQL project, 1 Visualization dashboard, and 1 full-stack Python dataset cleaner.'
  },
  {
    id: 'coreskills',
    number: 10,
    title: 'Core Skills',
    subtitle: 'Business Communications',
    category: 'Core Skills',
    icon: MessageSquare,
    whyImportant: 'Analytical results are only as good as the decisions they generate. Communication is the bridge.',
    whatToLearn: [
      'Presenting complex statistics to non-technical business leaders',
      'Written document summaries (insights over raw tables)',
      'Business acumen: understanding metrics (CAC, LTV, ROI, Margins)',
      'Data storytelling: creating a logical presentation flow'
    ],
    keyPoints: [
      {
        title: 'Analytical Communications Breakdown',
        points: [
          'Lead with the conclusion (what is the bottom-line action required)',
          'Provide the visual chart (how the trend proves the finding)',
          'Provide details if asked (keep raw calculations on slides backup)'
        ]
      }
    ],
    resources: [],
    notesPlaceholder: 'Always frame insights around Revenue expansion, Cost reduction, or Risk mitigation.'
  },
  {
    id: 'interview',
    number: 11,
    title: 'Interview & Job Ready',
    subtitle: 'Navigating Recruitment Pipelines',
    category: 'Career',
    icon: Briefcase,
    whyImportant: 'Preparing templates, questions, and coding profiles is mandatory for landing actual job offers.',
    whatToLearn: [
      'Structuring resumes (focused on quantifiable business achievements)',
      'Answering behavior questions using the STAR framework',
      'Passing SQL live whiteboard query challenges',
      'Answering simple system design and metrics definition questions'
    ],
    resources: [],
    notesPlaceholder: 'List of target companies, LinkedIn posts plan, and mock interview schedule.'
  },
  {
    id: 'certifications',
    number: 12,
    title: 'Certifications',
    subtitle: 'Validation of Skills',
    category: 'Career',
    icon: Award,
    whyImportant: 'Establishes high baseline credibility and structured learning habits for technical validation.',
    whatToLearn: [
      'Google Data Analytics Professional Certificate',
      'Microsoft Certified: Data Analyst Associate (Power BI PL-300)',
      'Databricks Certified Lakehouse Associate'
    ],
    resources: [
      { title: 'Google Data Analytics Certificate (Coursera Link)', url: 'https://hosturl.link/DuBv0g', type: 'external' },
      { title: 'Microsoft PL-300 Data Analyst Associate (Cert Details)', url: 'https://hosturl.link/WiUoMj', type: 'external' }
    ],
    notesPlaceholder: 'Track cert study progress: target exam dates, study schedules.'
  }
];

export default function DataAnalystRoadmap() {
  const [activeTab, setActiveTab] = useState<'All' | 'Technical' | 'Projects' | 'Core Skills' | 'Career'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState<{ [key: string]: boolean }>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('excel');
  const [userNotes, setUserNotes] = useState<{ [key: string]: string }>({});
  const [activeNoteSection, setActiveNoteSection] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // File upload and analytical sandbox state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [workspaceSplit, setWorkspaceSplit] = useState(false);
  const [sandboxSearchQuery, setSandboxSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from local storage on component mount
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('educuria_roadmap_completed');
      if (savedCompleted) {
        setCompletedTopics(JSON.parse(savedCompleted));
      }

      const savedNotes = localStorage.getItem('educuria_roadmap_notes');
      if (savedNotes) {
        setUserNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.error('Failed to load roadmap progress from localStorage', e);
    }
  }, []);

  // Sync navigation from external events (like header search)
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const sectionId = (e as CustomEvent).detail;
      if (sectionId) {
        setExpandedSection(sectionId);
        setTimeout(() => {
          const element = document.getElementById(`section-card-${sectionId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    };
    window.addEventListener('educuria_roadmap_navigate', handleNavigate);
    
    // Check pending targets on mount
    const pending = localStorage.getItem('educuria_roadmap_target_section');
    if (pending) {
      setExpandedSection(pending);
      localStorage.removeItem('educuria_roadmap_target_section');
      setTimeout(() => {
        const element = document.getElementById(`section-card-${pending}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
    }
    
    return () => {
      window.removeEventListener('educuria_roadmap_navigate', handleNavigate);
    };
  }, []);

  // Split comma string into rows for CSV
  const parseCsvString = (csvText: string): string[][] => {
    return csvText.split('\n').filter(line => line.trim() !== '').map(line => {
      // Basic CSV splitter split on comma
      return line.split(',');
    });
  };

  // Drag and Drop files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileAdd(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileAdd(e.target.files[0]);
    }
  };

  const handleFileAdd = (file: File) => {
    const reader = new FileReader();
    
    if (file.name.endsWith('.csv')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = parseCsvString(text);
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type || 'text/csv',
          text: text,
          parsedCsv: parsed,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setUploadedFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        setWorkspaceSplit(true);
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: url,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setUploadedFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        setWorkspaceSplit(true);
      };
      reader.readAsDataURL(file);
    } else {
      // Treat as raw text/markdown/json or binary
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          text: text,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setUploadedFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        setWorkspaceSplit(true);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSampleData = () => {
    const sampleText = `Row ID,Order Date,Product,Category,Revenue,Quantity,Region,Growth
1,2026-01-15,Excel Mastery Handbook,E-Book,99.98,2,North America,+15%
2,2026-02-10,SQL Bootcamp DB,Software,149.00,1,Europe,+22%
3,2026-02-14,Python Pandas Playbook,E-Book,149.95,5,Asia,+8%
4,2026-03-01,PowerBI Executive Bundle,Dashboard,199.99,1,Europe,+35%
5,2026-03-12,Statistics Core Video,Video,239.97,3,North America,+12%
6,2026-04-18,Cloud Athena Connector,Software,240.00,2,Asia,-5%
7,2026-05-22,DATAWIZ Capstone Project,Case Study,99.90,10,South America,+50%
8,2026-06-01,AI Interview Prep Guide,PDF,79.96,4,North America,+18%`;
    
    const newFile: UploadedFile = {
      id: 'sample-sales-csv',
      name: 'sample_sales_metrics.csv',
      size: sampleText.length,
      type: 'text/csv',
      text: sampleText,
      parsedCsv: parseCsvString(sampleText),
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setUploadedFiles(prev => {
      if (prev.some(f => f.id === 'sample-sales-csv')) return prev;
      return [...prev, newFile];
    });
    setActiveFileId('sample-sales-csv');
    setWorkspaceSplit(true);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      if (filtered.length === 0) {
        setWorkspaceSplit(false);
        setActiveFileId(null);
      } else if (activeFileId === id) {
        setActiveFileId(filtered[0].id);
      }
      return filtered;
    });
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    setActiveFileId(null);
    setWorkspaceSplit(false);
  };

  // Toggle completion state
  const toggleTopic = (sectionId: string, topic: string) => {
    const key = `${sectionId}::${topic}`;
    const updated = { ...completedTopics, [key]: !completedTopics[key] };
    setCompletedTopics(updated);
    localStorage.setItem('educuria_roadmap_completed', JSON.stringify(updated));
  };

  // Toggle all topics in a section
  const toggleAllInSection = (section: RoadmapSection) => {
    const allTopics = [...section.whatToLearn, ...(section.topicsToCover || [])];
    const sectionKeys = allTopics.map(t => `${section.id}::${t}`);
    const isSomeUncompleted = sectionKeys.some(key => !completedTopics[key]);

    const updated = { ...completedTopics };
    sectionKeys.forEach(key => {
      updated[key] = isSomeUncompleted;
    });

    setCompletedTopics(updated);
    localStorage.setItem('educuria_roadmap_completed', JSON.stringify(updated));
  };

  // Save notes
  const openNotes = (sectionId: string) => {
    setActiveNoteSection(sectionId);
    setTempNote(userNotes[sectionId] || '');
  };

  const saveNotes = (sectionId: string) => {
    const updated = { ...userNotes, [sectionId]: tempNote };
    setUserNotes(updated);
    localStorage.setItem('educuria_roadmap_notes', JSON.stringify(updated));
    setActiveNoteSection(null);
  };

  // Filter roadmap data
  const filteredSections = ROADMAP_DATA.filter(section => {
    const matchesTab = activeTab === 'All' || section.category === activeTab;
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.whatToLearn.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (section.topicsToCover && section.topicsToCover.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTab && matchesSearch;
  });

  // Calculate stats
  const totalTopics = ROADMAP_DATA.reduce((acc, curr) => {
    return acc + curr.whatToLearn.length + (curr.topicsToCover ? curr.topicsToCover.length : 0);
  }, 0);

  const completedCount = Object.keys(completedTopics).filter(key => completedTopics[key]).length;
  const overallPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const getSectionProgress = (section: RoadmapSection) => {
    const list = [...section.whatToLearn, ...(section.topicsToCover || [])];
    if (list.length === 0) return 0;
    const done = list.filter(item => completedTopics[`${section.id}::${item}`]).length;
    return Math.round((done / list.length) * 100);
  };

  // Helper to get play icons
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Play className="h-4 w-4 text-rose-500 fill-rose-500/10" />;
      case 'udemy': return <BookOpen className="h-4 w-4 text-purple-400" />;
      case 'hackerrank': return <Code2 className="h-4 w-4 text-emerald-400" />;
      case 'leetcode': return <Code2 className="h-4 w-4 text-amber-400" />;
      case 'w3schools': return <BookOpen className="h-4 w-4 text-emerald-500" />;
      default: return <ExternalLink className="h-4 w-4 text-slate-400" />;
    }
  };

  // Get active file object
  const activeFile = uploadedFiles.find(f => f.id === activeFileId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-100" id="roadmap-root">
      
      {/* HEADER HERO */}
      <div className="relative mb-10 p-6 md:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Interactive Curriculum Hub</span>
            </div>
            <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-white tracking-tight">
              Data Analyst Roadmap
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              An interactive, end-to-end framework curated from the expert curriculum at <strong className="text-emerald-400 font-bold">DATAWIZ</strong>. 
              Track your conceptual learning across 12 high-impact technical & core stages, execute projects, access hand-picked video courses, and build professional-grade data analyst credentials.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleLoadSampleData}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-emerald-500/30 rounded-xl text-xs font-semibold cursor-pointer transition shadow-lg"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span>Load Sample Sales Data</span>
              </button>
              
              {uploadedFiles.length > 0 && (
                <button
                  onClick={() => setWorkspaceSplit(!workspaceSplit)}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition shadow-lg ${
                    workspaceSplit 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold hover:bg-emerald-400' 
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                  }`}
                >
                  <Split className="h-4 w-4" />
                  <span>{workspaceSplit ? 'Hide Split Screen' : 'Show Split Screen'}</span>
                </button>
              )}
            </div>
          </div>

          {/* PROGRESS RADIAL / CARD */}
          <div className="flex-shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-5 w-full md:w-80 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Roadmap Progress</span>
              <span className="text-xs font-mono font-semibold text-emerald-400">{completedCount} / {totalTopics} completed</span>
            </div>
            
            <div className="relative flex items-center justify-center py-2">
              <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                <span className="text-2xl font-extrabold text-white font-mono">{overallPercentage}%</span>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500/50 transition-all duration-500"
                  style={{ transform: `rotate(${overallPercentage * 3.6}deg)` }}
                />
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
            
            <p className="text-[11px] text-slate-400 text-center font-sans">
              Mark topics inside each section below as complete to track your overall standing.
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC FILE UPLOAD AREA (Only shown if no files uploaded to act as main intro uploader) */}
      {uploadedFiles.length === 0 && (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-10 p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            dragActive 
              ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' 
              : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInputChange} 
            className="hidden" 
            accept=".csv, .txt, .md, .json, image/*"
          />
          <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition duration-300">
            <UploadCloud className="h-6 w-6 text-emerald-400 animate-bounce" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Interactive Student Analytical Workbench</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
            Drag & Drop CSV datasets, text files, or lecture notes here. 
            Once uploaded, they will be shown in a <strong className="text-emerald-400">Side-by-Side Split Workspace</strong> alongside your step-by-step roadmap!
          </p>
          <span className="mt-3 text-[10px] font-mono text-slate-500 uppercase">Supports: .csv, .txt, .md, and Images</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto">
          {(['All', 'Technical', 'Projects', 'Core Skills', 'Career'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-initial py-2 px-4 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-800 text-white shadow border border-slate-700/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools, topics, skills..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>
      </div>

      {/* WORKSPACE & ROADMAP CONTAINER (SPLIT LAYOUT PREFERENCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT WORKSPACE: FILE VIEWER & ANALYSIS BENCH (Active if split-screen is true and files exist) */}
        {workspaceSplit && uploadedFiles.length > 0 && (
          <div className="lg:col-span-5 xl:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4 shadow-2xl h-[calc(100vh-120px)] sticky top-24 overflow-hidden">
            {/* Workbench Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">Active Analyst Sandbox</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Interactive side-by-side view</p>
                </div>
              </div>
              <button 
                onClick={clearAllFiles}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition"
                title="Clear all attachments"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Upload Drag/Drop bar inside workbench */}
            <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-thin">
              <input 
                type="file" 
                onChange={(e) => e.target.files && handleFileAdd(e.target.files[0])} 
                className="hidden" 
                id="sandbox-file-input"
                accept=".csv, .txt, .md, .json, image/*"
              />
              <button 
                onClick={() => document.getElementById('sandbox-file-input')?.click()}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-800 hover:border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 whitespace-nowrap"
              >
                <UploadCloud className="h-3 w-3" />
                <span>+ Upload</span>
              </button>

              {/* Uploaded File Tabs */}
              {uploadedFiles.map((file) => {
                const isActive = file.id === activeFileId;
                return (
                  <div 
                    key={file.id}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition select-none ${
                      isActive 
                        ? 'bg-slate-800 border-emerald-500/30 text-white' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span 
                      onClick={() => setActiveFileId(file.id)} 
                      className="max-w-[120px] truncate block text-[11px]"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="p-0.5 rounded hover:bg-slate-700 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Render selected active file viewer */}
            {activeFile ? (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                {/* Search query specifically within table */}
                {activeFile.parsedCsv && (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Filter data cells..."
                      value={sandboxSearchQuery}
                      onChange={(e) => setSandboxSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl py-1.5 pl-8 pr-4 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {/* CSV SPREADSHEET TABLE */}
                {activeFile.parsedCsv && (
                  <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider z-10">
                        <tr>
                          {activeFile.parsedCsv[0].map((header, hIdx) => (
                            <th key={hIdx} className="px-3 py-2 border-r border-slate-800 last:border-0 whitespace-nowrap bg-slate-900">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 font-sans">
                        {activeFile.parsedCsv.slice(1).filter(row => {
                          if (!sandboxSearchQuery) return true;
                          return row.some(cell => cell.toLowerCase().includes(sandboxSearchQuery.toLowerCase()));
                        }).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-1.5 border-r border-slate-900/50 last:border-0 text-slate-300 whitespace-nowrap">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TEXT / MARKDOWN / CODE FILE VIEW */}
                {!activeFile.parsedCsv && activeFile.text && (
                  <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                    {activeFile.text}
                  </div>
                )}

                {/* IMAGE FILES FILE VIEW */}
                {activeFile.dataUrl && (
                  <div className="flex-1 flex items-center justify-center overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <img 
                      src={activeFile.dataUrl} 
                      alt={activeFile.name} 
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full rounded-lg object-contain shadow-xl"
                    />
                  </div>
                )}

                {/* File size information footer */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-850 pt-2 shrink-0">
                  <span>File size: {Math.round(activeFile.size / 1024)} KB</span>
                  <span>Uploaded: {activeFile.uploadedAt}</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 bg-slate-950 rounded-xl border border-slate-850">
                <FileSpreadsheet className="h-10 w-10 text-slate-700 mb-2" />
                <p className="text-xs">Select an uploaded file tab to open the workspace preview.</p>
              </div>
            )}
          </div>
        )}

        {/* RIGHT WORKSPACE: DETAILED STEP CARDS (adjusts layout based on split-screen mode) */}
        <div className={`${workspaceSplit && uploadedFiles.length > 0 ? 'lg:col-span-7 xl:col-span-7' : 'lg:col-span-8'} space-y-6`}>
          
          {filteredSections.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
              <Search className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-sans font-semibold">No roadmap stages match your query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveTab('All'); }}
                className="mt-3 text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredSections.map((section) => {
              const isOpen = expandedSection === section.id;
              const progress = getSectionProgress(section);
              const isCompleted = progress === 100;
              const SectionIcon = section.icon;

              return (
                <div 
                  key={section.id} 
                  id={`section-card-${section.id}`}
                  className={`bg-slate-900 border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-emerald-500/25 shadow-xl shadow-emerald-500/5 bg-slate-900/90' 
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  
                  {/* CARD HEADER (Toggle Expand) */}
                  <div 
                    onClick={() => setExpandedSection(isOpen ? null : section.id)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      {/* Step Number Badge */}
                      <div className={`h-10 w-10 rounded-xl font-mono text-sm font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {isCompleted ? <Check className="h-5 w-5" /> : section.number}
                      </div>

                      {/* Title Information */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            {section.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Stage {section.number}
                          </span>
                        </div>
                        <h3 className="font-sans font-bold text-base md:text-lg text-white mt-1 leading-snug truncate">
                          {section.title}
                        </h3>
                      </div>
                    </div>

                    {/* Progress Percentage & Arrow */}
                    <div className="flex items-center space-x-4 shrink-0 pl-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-mono font-bold text-slate-300">{progress}%</div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Complete</div>
                      </div>
                      <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-90 text-emerald-400' : ''}`}>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* CARD EXPANDED CONTENT */}
                  {isOpen && (
                    <div className="px-5 pb-6 border-t border-slate-800/60 pt-5 space-y-6 bg-slate-900/30">
                      
                      {/* Why Important Section */}
                      {section.whyImportant && (
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-850/60 flex items-start space-x-3">
                          <Info className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            <strong className="text-white font-semibold">Why this matters:</strong> {section.whyImportant}
                          </p>
                        </div>
                      )}

                      {/* SIDE-BY-SIDE RESOURCE GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT COLUMN: WHAT TO LEARN CHECKLIST (Topic check-boxes) */}
                        <div className="md:col-span-7 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center">
                              <CheckSquare className="h-4 w-4 mr-2 text-emerald-400" />
                              What to Master Checklist
                            </h4>
                            <button
                              onClick={() => toggleAllInSection(section)}
                              className="text-[10px] font-mono font-bold text-slate-500 hover:text-emerald-400 transition"
                            >
                              Toggle All
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {section.whatToLearn.map((item, idx) => {
                              const itemKey = `${section.id}::${item}`;
                              const isDone = !!completedTopics[itemKey];

                              return (
                                <div 
                                  key={`main-${idx}`}
                                  onClick={() => toggleTopic(section.id, item)}
                                  className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-start space-x-3 ${
                                    isDone 
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-800'
                                  }`}
                                >
                                  <div className="mt-0.5">
                                    {isDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-slate-600 flex-shrink-0" />
                                    )}
                                  </div>
                                  <span className="text-xs font-sans leading-relaxed">{item}</span>
                                </div>
                              );
                            })}

                            {section.topicsToCover && section.topicsToCover.map((item, idx) => {
                              const itemKey = `${section.id}::${item}`;
                              const isDone = !!completedTopics[itemKey];

                              return (
                                <div 
                                  key={`topic-${idx}`}
                                  onClick={() => toggleTopic(section.id, item)}
                                  className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-start space-x-3 ${
                                    isDone 
                                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-800'
                                  }`}
                                >
                                  <div className="mt-0.5">
                                    {isDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-slate-600 flex-shrink-0" />
                                    )}
                                  </div>
                                  <span className="text-xs font-sans leading-relaxed">{item}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: RECOMMENDED YOUTUBE TUTORIALS (With Thumbnails) */}
                        <div className="md:col-span-5 space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center border-b border-slate-800 pb-2">
                            <Play className="h-4 w-4 mr-2 text-rose-500 animate-pulse fill-rose-500/10" />
                            YouTube Tutorials & Links
                          </h4>
                          
                          {section.resources.length > 0 ? (
                            <div className="space-y-3">
                              {section.resources.map((res, idx) => {
                                const isYoutube = res.type === 'youtube';
                                
                                if (isYoutube) {
                                  const videoId = res.videoId || 'D_wNQR3LeeM';
                                  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                  return (
                                    <a
                                      key={idx}
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block bg-slate-950 border border-slate-850 hover:border-emerald-500/40 rounded-xl overflow-hidden transition duration-300 shadow hover:shadow-emerald-500/5 hover:-translate-y-0.5"
                                    >
                                      {/* Visual Video Thumbnail */}
                                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                                        <img 
                                          src={thumbUrl} 
                                          alt={res.title} 
                                          referrerPolicy="no-referrer"
                                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-all duration-300"></div>
                                        
                                        {/* Play Icon overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="bg-rose-600 group-hover:bg-emerald-500 text-white p-2.5 rounded-full shadow-lg transform group-hover:scale-110 transition duration-300">
                                            <Play className="h-4 w-4 fill-white text-white" />
                                          </div>
                                        </div>

                                        {/* Length tag */}
                                        {res.duration && (
                                          <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-sm text-[9px] font-mono text-slate-200 px-1.5 py-0.5 rounded font-bold">
                                            {res.duration}
                                          </span>
                                        )}
                                      </div>

                                      <div className="p-3 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/5 px-2 py-0.5 rounded">
                                            {res.channel || 'DATAWIZ Verified'}
                                          </span>
                                        </div>
                                        <h5 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                                          {res.title}
                                        </h5>
                                      </div>
                                    </a>
                                  );
                                } else {
                                  // Non-YouTube External Links
                                  return (
                                    <a 
                                      key={idx}
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group flex items-center justify-between p-3 bg-slate-950 border border-slate-850 hover:border-emerald-500/40 rounded-xl transition duration-200 hover:shadow-md"
                                    >
                                      <div className="flex items-center space-x-3 min-w-0">
                                        <div className="p-2 bg-slate-900 rounded-lg shrink-0 text-slate-400 group-hover:text-emerald-400 transition-colors">
                                          {getResourceIcon(res.type)}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">{res.title}</p>
                                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{res.type} reference</span>
                                        </div>
                                      </div>
                                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                                    </a>
                                  );
                                }
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-slate-500 bg-slate-950 border border-slate-850/60 rounded-xl">
                              <Play className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                              <p className="text-xs">No specific external video resources attached.</p>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* REAL LIFE EXAMPLES (callout boxes) */}
                      {section.realLifeExamples && section.realLifeExamples.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            <Lightbulb className="h-4 w-4 mr-2 text-amber-400" />
                            Real-Life Analytical Examples
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {section.realLifeExamples.map((ex, i) => (
                              <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                                <span className="text-[10px] font-mono text-amber-400 font-bold">Use Case {i+1}</span>
                                <p className="text-xs text-slate-300 font-sans leading-relaxed">{ex}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CORE SECTION POINTS */}
                      {section.keyPoints && (
                        <div className="space-y-4 pt-1">
                          {section.keyPoints.map((kp, idx) => (
                            <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                              <h5 className="text-xs font-sans font-bold text-emerald-400 flex items-center">
                                <Star className="h-3.5 w-3.5 mr-1.5 text-emerald-400 fill-emerald-400/20 animate-pulse" />
                                {kp.title}
                              </h5>
                              <ul className="space-y-1.5 pl-2">
                                {kp.points.map((pt, pIdx) => (
                                  <li key={pIdx} className="text-xs text-slate-300 flex items-start space-x-2 leading-relaxed">
                                    <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* SECTION NOTES PAD */}
                      <div className="border-t border-slate-800/80 pt-4">
                        {activeNoteSection === section.id ? (
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Write personal notes for {section.title}:</label>
                            <textarea
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder={section.notesPlaceholder || "Write tips, ideas, commands or formulas to remember..."}
                              className="w-full h-24 p-3 bg-slate-950 border border-slate-850 focus:border-emerald-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveNotes(section.id)}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition"
                              >
                                Save Notes
                              </button>
                              <button
                                onClick={() => setActiveNoteSection(null)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white text-xs font-bold rounded-lg cursor-pointer transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <PenTool className="h-4 w-4 text-slate-500 shrink-0" />
                              <span className="text-xs text-slate-400 font-sans truncate pr-2">
                                {userNotes[section.id] ? 'Notes: ' + userNotes[section.id] : 'No personal study notes added yet.'}
                              </span>
                            </div>
                            <button
                              onClick={() => openNotes(section.id)}
                              className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 shrink-0 cursor-pointer"
                            >
                              {userNotes[section.id] ? 'Edit Notes' : 'Add Notes'}
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: STICKY PROGRESS DIRECTORY (Hidden in split screen to optimize viewport layout) */}
        {(!workspaceSplit || uploadedFiles.length === 0) && (
          <div className="lg:col-span-4 space-y-6">
            
            {/* QUICK ROADMAP TIMELINE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 lg:sticky lg:top-24">
              <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                Roadmap Outline Index
              </h3>
              
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {ROADMAP_DATA.map((section) => {
                  const isSelected = expandedSection === section.id;
                  const progress = getSectionProgress(section);
                  const isCompleted = progress === 100;

                  return (
                    <div
                      key={section.id}
                      onClick={() => {
                        setExpandedSection(section.id);
                        const element = document.getElementById(`section-card-${section.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer border ${
                        isSelected 
                          ? 'bg-slate-800/80 border-slate-700 text-white' 
                          : 'bg-slate-950/50 border-transparent text-slate-400 hover:text-white hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`h-6 w-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isCompleted 
                            ? 'bg-emerald-500 text-slate-950' 
                            : 'bg-slate-850 text-slate-400 border border-slate-750'
                        }`}>
                          {isCompleted ? <Check className="h-3.5 w-3.5" /> : section.number}
                        </div>
                        <span className="text-xs font-semibold truncate">{section.title}</span>
                      </div>
                      
                      <span className={`text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                        isCompleted 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-slate-900 text-slate-500'
                      }`}>
                        {progress}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* EXPERT TIP BOX */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-emerald-400" />
                  Expert Advice
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  "Certificates do not get you analyst jobs. <strong className="text-white">messy raw projects</strong> where you clean datasets and write clean queries do!" Complete stages 1-5 to begin your project phase.
                </p>
              </div>
            </div>

            {/* QUICK DATA RESOURCES ACCORDION */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center">
                <Bookmark className="h-4 w-4 mr-2 text-emerald-400" />
                General Portals
              </h3>
              <ul className="space-y-2.5 pt-1">
                <li>
                  <a 
                    href="https://www.w3schools.com/sql/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-slate-300 hover:text-emerald-400 flex items-center justify-between group"
                  >
                    <span className="group-hover:text-emerald-400 transition-colors">W3Schools SQL Playground</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.hackerrank.com/domains/sql" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-slate-300 hover:text-emerald-400 flex items-center justify-between group"
                  >
                    <span className="group-hover:text-emerald-400 transition-colors">HackerRank SQL Practice Hub</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://leetcode.com/studyplan/top-sql-50/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-slate-300 hover:text-emerald-400 flex items-center justify-between group"
                  >
                    <span className="group-hover:text-emerald-400 transition-colors">Leetcode Top SQL 50 List</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                  </a>
                </li>
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
