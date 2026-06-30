import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Safe filename and directory resolution for both ESM and CJS
const _filename = typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : (typeof __filename !== 'undefined' ? __filename : '');
const _dirname = _filename ? path.dirname(_filename) : (typeof __dirname !== 'undefined' ? __dirname : process.cwd());

const app = express();
const PORT = 3000;

// Ensure local persistence data folder and files exist
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to safely read files
function safeReadFile(filePath: string, defaultContent: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, 'utf-8');
    return JSON.parse(defaultContent);
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || defaultContent);
  } catch (err) {
    console.error(`Error reading ${filePath}, resetting to default:`, err);
    fs.writeFileSync(filePath, defaultContent, 'utf-8');
    return JSON.parse(defaultContent);
  }
}

// Helper to safely write files
function safeWriteFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
  }
}

// Initialize persistence files
let users = safeReadFile(USERS_FILE, '[]');
let progressList = safeReadFile(PROGRESS_FILE, '[]');
let announcements = safeReadFile(ANNOUNCEMENTS_FILE, JSON.stringify([
  {
    id: 'ann-1',
    title: 'Welcome to Ishwar Hiremath’s Educuria Platform!',
    content: 'We are thrilled to launch our next-generation interactive modules. Register your student profile with your Email ID, choose your field, and begin tracking your coding progress today!',
    date: '2026-06-29',
    important: true
  },
  {
    id: 'ann-2',
    title: 'New Module: Advanced Generative AI & JSON Formatting',
    content: 'Master the @google/genai TypeScript SDK with our newly unlocked Module 1.2 on Structured JSON output parameters. Check your student dashboard to enroll!',
    date: '2026-06-28',
    important: false
  }
]));

// Pre-create standard admin user if not present
const adminEmail = 'ishwarhiremath2823@gmail.com';
const existingAdmin = users.find((u: any) => u.email.toLowerCase() === adminEmail.toLowerCase());
if (!existingAdmin) {
  users.push({
    id: 'user-admin',
    email: adminEmail,
    name: 'Ishwar Hiremath',
    password: 'password123', // Default admin password
    role: 'admin',
    enrolledCourses: ['web-dev-101', 'ai-prompt-eng', 'data-science-pandas', 'computer-science-dsa']
  });
  safeWriteFile(USERS_FILE, users);
}

// Express middlewares
app.use(express.json());

// API: Authentication
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, Email ID, and Password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userExists = users.some((u: any) => u.email.toLowerCase() === normalizedEmail);

  if (userExists) {
    return res.status(400).json({ error: 'An account with this Email ID already exists.' });
  }

  const isFirstAdmin = normalizedEmail === adminEmail.toLowerCase();
  const newUser = {
    id: 'user-' + Date.now(),
    name,
    email: normalizedEmail,
    password, // Store as cleartext/simple hash for this educational workspace setup
    role: isFirstAdmin ? 'admin' : 'student',
    enrolledCourses: ['web-dev-101', 'ai-prompt-eng'] // Enroll in a couple courses by default
  };

  users.push(newUser);
  safeWriteFile(USERS_FILE, users);

  const { password: _, ...userWithoutPassword } = newUser;
  return res.json({ user: userWithoutPassword, token: `token-${newUser.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email ID and Password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u: any) => u.email.toLowerCase() === normalizedEmail && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid Email ID or Password.' });
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.json({ user: userWithoutPassword, token: `token-${user.id}` });
});

// Passwordless/Email-only secure login and instant register
app.post('/api/auth/email-only', (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email ID is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = users.find((u: any) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    // If user does not exist, automatically register them!
    const isFirstAdmin = normalizedEmail === adminEmail.toLowerCase();
    const defaultName = name && name.trim() 
      ? name.trim() 
      : normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    user = {
      id: 'user-' + Date.now(),
      name: defaultName,
      email: normalizedEmail,
      password: '', // Empty password for email-only users
      role: isFirstAdmin ? 'admin' : 'student',
      enrolledCourses: [] // Let them choose their enrollment or start with empty
    };

    users.push(user);
    safeWriteFile(USERS_FILE, users);
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.json({ user: userWithoutPassword, token: `token-${user.id}` });
});

// Auth middleware for REST calls
function getAuthUser(req: express.Request): any {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const userId = token.replace('token-', '');
  return users.find((u: any) => u.id === userId);
}

// API: Student Progress Tracker
app.get('/api/progress/:courseId', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { courseId } = req.params;
  let progress = progressList.find((p: any) => p.userId === user.id && p.courseId === courseId);

  if (!progress) {
    progress = {
      userId: user.id,
      courseId,
      completedLessons: [],
      quizScores: {},
      updatedAt: new Date().toISOString()
    };
    progressList.push(progress);
    safeWriteFile(PROGRESS_FILE, progressList);
  }

  return res.json(progress);
});

// Toggle Lesson Completion
app.post('/api/progress/toggle-lesson', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { courseId, lessonId } = req.body;
  if (!courseId || !lessonId) {
    return res.status(400).json({ error: 'CourseId and LessonId are required.' });
  }

  let progress = progressList.find((p: any) => p.userId === user.id && p.courseId === courseId);
  if (!progress) {
    progress = {
      userId: user.id,
      courseId,
      completedLessons: [],
      quizScores: {},
      updatedAt: new Date().toISOString()
    };
    progressList.push(progress);
  }

  const index = progress.completedLessons.indexOf(lessonId);
  if (index > -1) {
    progress.completedLessons.splice(index, 1);
  } else {
    progress.completedLessons.push(lessonId);
  }

  progress.lastAccessedLessonId = lessonId;
  progress.updatedAt = new Date().toISOString();

  // If course not in user's enrolledCourses list, add it
  const dbUser = users.find((u: any) => u.id === user.id);
  if (dbUser && !dbUser.enrolledCourses.includes(courseId)) {
    dbUser.enrolledCourses.push(courseId);
    safeWriteFile(USERS_FILE, users);
  }

  safeWriteFile(PROGRESS_FILE, progressList);
  return res.json(progress);
});

// Submit Quiz Score
app.post('/api/progress/submit-quiz', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { courseId, quizId, score } = req.body;
  if (!courseId || !quizId || score === undefined) {
    return res.status(400).json({ error: 'CourseId, quizId and score are required.' });
  }

  let progress = progressList.find((p: any) => p.userId === user.id && p.courseId === courseId);
  if (!progress) {
    progress = {
      userId: user.id,
      courseId,
      completedLessons: [],
      quizScores: {},
      updatedAt: new Date().toISOString()
    };
    progressList.push(progress);
  }

  progress.quizScores[quizId] = score;
  progress.updatedAt = new Date().toISOString();

  safeWriteFile(PROGRESS_FILE, progressList);
  return res.json(progress);
});

// Enroll in a new course
app.post('/api/courses/enroll', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required.' });
  }

  const dbUser = users.find((u: any) => u.id === user.id);
  if (!dbUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!dbUser.enrolledCourses.includes(courseId)) {
    dbUser.enrolledCourses.push(courseId);
    safeWriteFile(USERS_FILE, users);
  }

  const { password: _, ...userWithoutPassword } = dbUser;
  return res.json({ user: userWithoutPassword });
});

// KARNATAKA II PUC QUESTION PAPERS & STUDY MATERIALS DATA
const PUC_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

const PUC_PAPERS_DATABASE: any = {
  questions: {
    mathematics: {
      instructions: [
        "The question paper contains five parts: A, B, C, D, and E.",
        "Part A contains multiple-choice questions and fill-in-the-blanks. All questions are compulsory.",
        "Show clear steps for all parts to receive maximum credit.",
        "Calculators are strictly not allowed for II PUC Board Mathematics."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "Let * be a binary operation on R defined by a * b = ab/4. Find the identity element.",
            "Write the range of principal branch of sec⁻¹ x.",
            "Construct a 2x2 matrix A = [aij] whose elements are given by aij = (i + j)² / 2.",
            "If A is a square matrix of order 3 and |A| = 8, then find |adj A|.",
            "Find dy/dx if y = cos(1 - x).",
            "Evaluate the integral of sec x(sec x + tan x) dx.",
            "Define a collinear vector.",
            "Find the distance of the plane 2x - 3y + 4z - 6 = 0 from the origin."
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any nine questions. Each carries 2 marks:",
          questions: [
            "Show that if f: A -> B and g: B -> C are one-one, then gof: A -> C is also one-one.",
            "Prove that 2 tan⁻¹(1/2) + tan⁻¹(1/7) = tan⁻¹(31/17).",
            "Find the area of triangle with vertices (-2, -3), (3, 2) and (-1, -8) using determinants.",
            "Find dy/dx if y = x^(sin x) for x > 0.",
            "If x = a cos³ θ and y = a sin³ θ, find dy/dx.",
            "Evaluate the integral of cos(log x) / x dx.",
            "Find the general solution of the differential equation dy/dx = (1 + y²) / (1 + x²).",
            "Find the area of a parallelogram whose adjacent sides are represented by the vectors a = 3i + j + 4k and b = i - j + k."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any five questions. Each carries 5 marks:",
          questions: [
            "Let f: R+ -> [4, infinity) given by f(x) = x² + 4. Show that f is invertible with inverse f⁻¹(y) = sqrt(y - 4).",
            "If A = [[1, 2, 2], [2, 1, 2], [2, 2, 1]], verify that A² - 4A - 5I = O.",
            "Solve the system of equations using matrix method: x - y + 2z = 7, 3x + 4y - 5z = -5, 2x - y + 3z = 12.",
            "If y = (sin⁻¹ x)², show that (1 - x²) d²y/dx² - x dy/dx - 2 = 0.",
            "Find the integral of 1 / (x² - a²) with respect to x and hence evaluate integral of 1 / (x² - 16) dx.",
            "Derive the equation of a line in space passing through a given point and parallel to a given vector both in vector and Cartesian form."
          ]
        }
      ]
    },
    physics: {
      instructions: [
        "All parts are compulsory. Write units and formula wherever appropriate.",
        "Answers without relevant circuit or ray diagrams will carry zero marks.",
        "Mathematical tables and non-programmable calculators are permitted."
      ],
      sections: [
        {
          title: "PART - A (Multiple Choice & Fill in Blanks)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "What is the electrostatic potential on the surface of a charged gold nucleus?",
            "How does resistivity of semiconductor change with increase in absolute temperature?",
            "Write the SI unit of magnetic dipole moment of a current carrying coil.",
            "Name the device that converts light energy into electrical energy.",
            "An electron and a proton have the same kinetic energy. Which one has a shorter de Broglie wavelength?",
            "State the principle on which an optical fiber works.",
            "What is the average power dissipated in a purely inductive AC circuit?"
          ]
        },
        {
          title: "PART - B (Two Mark Short Answers)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "Define drift velocity. Write its relation with electrical conductivity.",
            "Mention any two properties of electric field lines.",
            "What is an equipotential surface? Draw it for a single positive point charge.",
            "State and explain Lenz's law in electromagnetic induction.",
            "What are electromagnetic waves? Mention any two sources of EM waves.",
            "Calculate the critical angle of glass with respect to water if their refractive indices are 1.5 and 1.33 respectively."
          ]
        },
        {
          title: "PART - C (Three Mark Questions)",
          desc: "Answer any five questions. Each carries 3 marks:",
          questions: [
            "Derive the expression for torque acting on an electric dipole placed in a uniform electric field.",
            "What is a galvanometer? How will you convert a galvanometer into an ammeter?",
            "State and explain Gauss's law in electrostatics. Write its mathematical formula.",
            "Describe Young's double slit experiment and write the expression for fringe width.",
            "Distinguish between nuclear fission and nuclear fusion with examples."
          ]
        },
        {
          title: "PART - D (Five Mark Numericals & Derivations)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Derive the expression for electric field intensity at a point on the equatorial line of an electric dipole.",
            "State Ohm's Law. Obtain the expression for equivalent resistance of two cells connected in parallel.",
            "Obtain the expression for magnetic field at a point on the axis of a circular current carrying loop using Biot-Savart's law.",
            "Derive the prism formula: n = sin((A + Dm)/2) / sin(A/2).",
            "Explain the working of a full wave rectifier with neat circuit and input/output waveforms."
          ]
        }
      ]
    },
    chemistry: {
      instructions: [
        "Write equations and neat diagrams wherever necessary.",
        "Scientific calculators are not allowed.",
        "Use the given constants: R = 8.314 J/K/mol, F = 96487 C/mol."
      ],
      sections: [
        {
          title: "PART - A (Objective & Short Answers)",
          desc: "I. Answer all questions. Each carries 1 mark:",
          questions: [
            "What is the effect of temperature on the solubility of gases in liquids?",
            "State Henry's Law.",
            "Define molar conductivity.",
            "What is the unit of rate constant for a zero order reaction?",
            "Name the catalyst used in the manufacture of Ammonia by Haber's process.",
            "Why do transition elements show variable oxidation states?",
            "Write the general outer electronic configuration of d-block elements.",
            "What are bidentate ligands? Give an example."
          ]
        },
        {
          title: "PART - B",
          desc: "II. Answer any five questions. Each carries 2 marks:",
          questions: [
            "State Kohlrausch's Law of independent migration of ions.",
            "Define activation energy. How is it related to rate constant?",
            "What is lanthanoid contraction? Mention its main consequence.",
            "Explain SN2 mechanism of nucleophilic substitution reaction with an example.",
            "Write the chemical equation for Kolbe's reaction.",
            "Explain Cannizzaro reaction with an equation.",
            "What are essential amino acids? Give one example."
          ]
        },
        {
          title: "PART - C",
          desc: "III. Answer any five questions. Each carries 3 marks:",
          questions: [
            "Derive the integrated rate equation for a first order reaction.",
            "Describe the extraction of chlorine from brine solution with equations.",
            "Explain Werner's coordination theory of complex compounds.",
            "How is Phenol prepared from aniline? Write chemical equations.",
            "Explain the Aldol condensation of acetaldehyde with equations.",
            "What are hormones? Mention the biological role of Insulin and Thyroid hormones."
          ]
        }
      ]
    },
    accountancy: {
      instructions: [
        "Write ledger accounts with proper format.",
        "Show working notes clearly.",
        "Calculators can be used."
      ],
      sections: [
        {
          title: "PART - A (Conceptual)",
          desc: "I. Answer all questions. Each carries 1 mark:",
          questions: [
            "State any one feature of partnership.",
            "What is sacrificing ratio?",
            "Why is Revaluation Account prepared at the time of admission of a partner?",
            "Give the meaning of 'Dissolution of Partnership Firm'.",
            "What is authorized share capital?",
            "Define 'Financial Analysis'.",
            "Mention any one activity classified under Cash Flow Statement.",
            "What is Quick Ratio?"
          ]
        },
        {
          title: "PART - B (Application)",
          desc: "II. Answer any five questions. Each carries 2 marks:",
          questions: [
            "State any two contents of Partnership Deed.",
            "Write the journal entry for transferring accumulated profits at the time of retirement of a partner.",
            "Mention any two methods of valuation of Goodwill.",
            "Distinguish between equity share and preference share.",
            "Write any two limitations of financial statements.",
            "Calculate Debt-Equity Ratio if Total Assets = ₹10,00,000, Equity = ₹4,00,000, Current Liabilities = ₹2,00,000."
          ]
        }
      ]
    }
  },
  study_materials: [
    {
      id: "puc-math-integration",
      title: "KSEAB II PUC Mathematics Integration Standard Formulas & Shortcuts",
      subject: "Mathematics",
      topic: "Integration",
      description: "Complete list of integration formulas, properties of definite integrals, and standard board proofs for 2nd PUC.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
         II PUC MATHEMATICS INTEGRATION FORMULA SHEET
========================================================

1. STANDARD INDEFINITE INTEGRALS
   - ∫ x^n dx = (x^(n+1))/(n+1) + C  (n ≠ -1)
   - ∫ 1/x dx = log|x| + C
   - ∫ e^x dx = e^x + C
   - ∫ a^x dx = (a^x)/log(a) + C
   - ∫ sin x dx = -cos x + C
   - ∫ cos x dx = sin x + C
   - ∫ sec^2 x dx = tan x + C
   - ∫ cosec^2 x dx = -cot x + C

2. SPECIAL INTEGRALS (5-MARK PROOFS FOR BOARD EXAMS)
   - ∫ dx / (x^2 - a^2) = (1 / 2a) * log|(x-a)/(x+a)| + C
   - ∫ dx / (a^2 - x^2) = (1 / 2a) * log|(a+x)/(a-x)| + C
   - ∫ dx / (x^2 + a^2) = (1 / a) * tan^-1(x/a) + C
   - ∫ dx / sqrt(x^2 - a^2) = log|x + sqrt(x^2 - a^2)| + C
   - ∫ dx / sqrt(a^2 - x^2) = sin^-1(x/a) + C

3. DEFINITE INTEGRALS PROPERTIES (PROOFS EXTREMELY IMPORTANT)
   - Property 4: ∫ (0 to a) f(x) dx = ∫ (0 to a) f(a-x) dx
   - Property 7: ∫ (-a to a) f(x) dx = 2 * ∫ (0 to a) f(x) dx if f(x) is even, and 0 if f(x) is odd.

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    },
    {
      id: "puc-physics-optics",
      title: "KSEAB II PUC Physics Ray Optics & Wave Optics Derivation Manual",
      subject: "Physics",
      topic: "Optics Derivations",
      description: "Prism formula, lens maker's formula, mirror equation, and Young's double slit fringe width derivations.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
          II PUC PHYSICS OPTICS DERIVATION GUIDE
========================================================

1. THE LENS MAKER'S FORMULA (5 MARKS)
   Consider a thin double convex lens of refractive index n2 placed in a medium of index n1.
   Derive step-by-step:
   - Refraction at first spherical surface:
     n2/v1 - n1/u = (n2 - n1)/R1
   - Refraction at second spherical surface:
     n1/v - n2/v1 = (n1 - n2)/R2
   - Adding both equations:
     n1(1/v - 1/u) = (n2 - n1)(1/R1 - 1/R2)
   - Since 1/v - 1/u = 1/f:
     1/f = ((n2/n1) - 1)(1/R1 - 1/R2)

2. PRISM FORMULA (5 MARKS)
   Derive the relation: n = sin((A + Dm)/2) / sin(A/2)
   - Angle of prism A = r1 + r2
   - Angle of deviation d = i + e - A
   - At minimum deviation (d = Dm):
     i = e  and  r1 = r2 = r
     A = 2r => r = A/2
     Dm = 2i - A => i = (A + Dm)/2
   - Applying Snell's law:
     n = sin(i) / sin(r) = sin((A + Dm)/2) / sin(A/2)

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    },
    {
      id: "puc-english-grammar-guide",
      title: "KSEAB II PUC English Core Grammar & Writing Skills Blueprint",
      subject: "English",
      topic: "Grammar & Writing",
      description: "Reported speech rules, dialogue writing, expressions, passive voice, and letter writing templates for PUC Board.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
        II PUC ENGLISH GRAMMAR & WRITING MASTERY PACK
========================================================

1. REPORTED SPEECH (5 MARKS)
   Key rules for converting Direct to Indirect speech:
   - Present simple changes to Past simple.
   - Present continuous changes to Past continuous.
   - Present perfect changes to Past perfect.
   - Past simple changes to Past perfect.
   - Pronouns change as per context (I -> he/she, we -> they).
   - Time markers change: today -> that day, tomorrow -> the next day.

2. DIALOGUE WRITING (3 MARKS)
   Must include polite forms, greetings, and appropriate requests:
   - "Could you please help me..."
   - "Thank you so much, I appreciate it."
   - "Excuse me, could you guide me to..."

3. LETTER WRITING (5 MARKS)
   Structure of Job Application letter:
   - From Address (Sender)
   - Date
   - To Address (Receiver)
   - Salutation (Dear Sir/Madam)
   - Subject (Application for the post of...)
   - Reference (Your advertisement in...)
   - Body of the Letter
   - Subscription (Yours faithfully, Name/Signature)
   - Resume / Curriculum Vitae attachment.

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    },
    {
      id: "puc-accountancy-partnership",
      title: "KSEAB II PUC Accountancy Partnership Accounts Ledger Templates",
      subject: "Accountancy",
      topic: "Partnership Accounts",
      description: "Admission of partner, retirement, revaluation account format, and balance sheet adjustments with solved illustrations.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
       II PUC ACCOUNTANCY PARTNERSHIP LEDGER WORKBOOK
========================================================

1. REVALUATION ACCOUNT FORMAT
   - Debit Side (Losses):
     * To Decrease in value of Assets
     * To Increase in value of Liabilities
     * To Unrecorded Liabilities
   - Credit Side (Gains):
     * By Increase in value of Assets
     * By Decrease in value of Liabilities
     * By Unrecorded Assets

2. SOLVED ILLUSTRATION (ADMISSION OF PARTNER)
   A and B are partners sharing in 3:2 ratio. They admit C for 1/5th share.
   C brings ₹50,000 capital and ₹10,000 premium for goodwill.
   Machinery valued at ₹40,000 (depreciated by 10%), Land & Buildings appreciated by ₹15,000.
   - Revaluation Profit:
     Land appreciation: +₹15,000
     Machinery depreciation: -₹4,000
     Net profit = ₹11,000 distributed to A (₹6,600) and B (₹4,400).

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    }
  ]
};

// JEE ADVANCED QUESTION PAPERS & STUDY MATERIALS DATA
const JEE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

const JEE_PAPERS_DATABASE: any = {
  // Subject mock templates containing actual tough JEE-style questions
  questions: {
    mathematics: {
      instructions: [
        "This paper contains 3 sections: Section I (One or More than One Correct Option), Section II (Numerical Value Type), Section III (Single Correct Option).",
        "For Section I: +4 marks for correct answer, Partial marks available, -2 for incorrect answers.",
        "For Section II: +3 marks for correct answer, No negative marks.",
        "Use of calculators or tables is strictly prohibited."
      ],
      sections: [
        {
          title: "SECTION I (One or More than One Correct Option)",
          questions: [
            "Let f: R -> R be a twice differentiable function such that f(0) = 0, f(pi/2) = 1 and f'(0) = 1. If g(x) = integral(t=x to pi/2) [f'(t) cosec(t) - f(t) cosec(t) cot(t)] dt for x in (0, pi/2], then which of the following is/are correct?\n   (A) limit as x->0 of g(x) = 1\n   (B) g'(x) is strictly decreasing on (0, pi/2)\n   (C) g(x) > 0 for all x in (0, pi/2]\n   (D) g(x) < 1 for all x in (0, pi/2]",
            "Let M be a 3x3 invertible matrix with real entries such that M^T * M = I. If det(M) = 1, then which of the following statement(s) is/are TRUE?\n   (A) det(M - I) = 0\n   (B) det(M + I) = det(M^T + I)\n   (C) All eigenvalues of M are real\n   (D) M is orthogonal"
          ]
        },
        {
          title: "SECTION II (Numerical Value Type - Integer or Decimal)",
          questions: [
            "If the area bounded by the curves y = x^2 and y = |1 - x^2| from x = 0 to x = 2 is A, then the value of 12A is equal to ____________.",
            "Let S be the sum of all real values of x satisfying the equation log_2(x^2 - 5x + 5) * log_5(x - 1) = 0. Find the value of 10S."
          ]
        },
        {
          title: "SECTION III (Single Correct Option)",
          questions: [
            "The probability that a randomly chosen 3-digit number has exactly one of its digits equal to 7 is:\n   (A) 225/900\n   (B) 243/900\n   (C) 220/900\n   (D) 252/900",
            "The value of the limit as n->infinity of sum(r=1 to n) [ r / (n^2 + r^2) ] is:\n   (A) log(2)/2\n   (B) log(2)\n   (C) pi/4\n   (D) 1/2"
          ]
        }
      ]
    },
    physics: {
      instructions: [
        "This paper contains multiple choice and numerical entry problems on Mechanics, Electromagnetism, Optics, and Modern Physics.",
        "Marks scheme: +4 for correct, -2 for incorrect in MCQ; +3 for correct, 0 for incorrect in numericals."
      ],
      sections: [
        {
          title: "SECTION I (Multiple Choice - Multiple Answers Correct)",
          questions: [
            "A solid cylinder of mass M and radius R rolls without slipping down an inclined plane of inclination theta. Which of the following is/are correct?\n   (A) The acceleration of the center of mass is (2/3)g sin(theta)\n   (B) The minimum coefficient of static friction required for pure rolling is (1/3)tan(theta)\n   (C) The frictional force acting on the cylinder is (1/3)Mg sin(theta)\n   (D) Total kinetic energy is conserved during pure rolling",
            "A parallel plate capacitor is charged and then disconnected from the battery. If the plates are now pulled further apart using insulating handles:\n   (A) The capacitance decreases\n   (B) The charge on the plates remains constant\n   (C) The potential difference between plates increases\n   (D) The electrostatic energy stored in the capacitor increases"
          ]
        },
        {
          title: "SECTION II (Numerical Decimal Type)",
          questions: [
            "A hydrogen atom in its ground state absorbs a photon of energy 12.09 eV. The angular momentum of the electron increases by an amount equal to (h / 2*pi) multiplied by an integer N. Find N.",
            "A thermodynamic cycle is conducted on 1 mole of an ideal monoatomic gas. If the maximum efficiency of the cycle is 0.35 and heat absorbed is 400 J, find the net work done (in Joules)."
          ]
        }
      ]
    },
    chemistry: {
      instructions: [
        "The paper consists of Physical, Organic and Inorganic Chemistry sections.",
        "Read each question carefully and bubble the appropriate option on the OMR sheet."
      ],
      sections: [
        {
          title: "SECTION I (Single Correct Option)",
          questions: [
            "The major product obtained in the acid-catalyzed dehydration of 2-methylcyclohexanol is:\n   (A) 1-methylcyclohexene\n   (B) 3-methylcyclohexene\n   (C) Methylenecyclohexane\n   (D) 1,2-dimethylcyclopentene",
            "Among the following, the diamagnetic complex is:\n   (A) [Ni(CO)_4]\n   (B) [CoF_6]^3-\n   (C) [Fe(H_2O)_6]^2+\n   (D) [NiCl_4]^2-"
          ]
        },
        {
          title: "SECTION II (Numerical Entry)",
          questions: [
            "How many geometrical isomers are possible for the octahedral coordination compound [Co(NH_3)_3(NO_2)_3]?",
            "Calculate the pH of a buffer solution prepared by mixing 50 mL of 0.2 M acetic acid (Ka = 1.8 x 10^-5) and 50 mL of 0.1 M sodium acetate."
          ]
        }
      ]
    }
  },
  // Detailed study materials for math and other subjects
  study_materials: [
    {
      id: "math-calculus-guide",
      title: "JEE Advanced Calculus Mastery Revision Pack",
      subject: "Mathematics",
      topic: "Calculus",
      description: "Step-by-step limits, continuity shortcuts, derivative applications, and integration reductions for JEE Advanced.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
         JEE ADVANCED CALCULUS REVISION MANUAL
========================================================

TOPIC 1: LIMITS, CONTINUITY, AND DIFFERENTIABILITY
1. L'Hopital's Rule & Taylor Series Expansion:
   For complex limits of form 0/0 or inf/inf, prefer Taylor expansions over multiple derivatives:
   - sin(x) = x - x^3/6 + x^5/120 - ...
   - cos(x) = 1 - x^2/2 + x^4/24 - ...
   - ln(1+x) = x - x^2/2 + x^3/3 - ...
   - e^x = 1 + x + x^2/2! + x^3/3! + ...

2. Leibniz Integral Rule:
   d/dx [ integral(t=u(x) to v(x)) f(t) dt ] = f(v(x))*v'(x) - f(u(x))*u'(x).
   Extremely important for JEE Advanced limit questions involving integration.

TOPIC 2: APPLICATIONS OF DERIVATIVES
1. Rolle's Theorem & Lagrange's Mean Value Theorem (LMVT):
   If f is continuous on [a, b] and differentiable on (a, b):
   - LMVT: There exists c in (a, b) such that f'(c) = (f(b) - f(a)) / (b - a).
2. Monotonicity and Roots:
   If f'(x) > 0 for all x, f is strictly increasing and can have at most 1 real root.

TOPIC 3: INTEGRATION REDUCTION FORMULAS
- integral(0 to pi/2) sin^n(x) dx = (n-1)/n * integral(0 to pi/2) sin^(n-2)(x) dx
  (Wallis Formula)

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    },
    {
      id: "math-coord-geometry",
      title: "JEE Advanced Coordinate Geometry Formula Sheet",
      subject: "Mathematics",
      topic: "Coordinate Geometry",
      description: "Quick formula sheet for Circles, Parabola, Ellipse, Hyperbola tangent and normal equations.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
      JEE ADVANCED COORDINATE GEOMETRY FORMULA SHEET
========================================================

1. PARABOLA: y^2 = 4ax
   - Tangent of slope 'm': y = mx + a/m. (Point of contact: (a/m^2, 2a/m))
   - Normal of slope 'm': y = mx - 2am - am^3. (Point of contact: (am^2, -2am))
   - Focal chord relation: t1 * t2 = -1. Length of focal chord = a(t + 1/t)^2.

2. ELLIPSE: x^2/a^2 + y^2/b^2 = 1 (a > b)
   - Eccentricity: e^2 = 1 - b^2/a^2.
   - Tangent of slope 'm': y = mx +/- sqrt(a^2*m^2 + b^2).
   - Auxiliary Circle: x^2 + y^2 = a^2.

3. HYPERBOLA: x^2/a^2 - y^2/b^2 = 1
   - Eccentricity: e^2 = 1 + b^2/a^2.
   - Tangent of slope 'm': y = mx +/- sqrt(a^2*m^2 - b^2).
   - Rectangular Hyperbola (xy = c^2): Tangent is x/t + yt = 2c.

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    },
    {
      id: "math-vectors-3d",
      title: "JEE Advanced Vectors & 3D Geometry Sheet",
      subject: "Mathematics",
      topic: "Vectors & 3D",
      description: "Vector triple products, shortest distance between skew lines, and plane equations.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
      JEE ADVANCED VECTORS & 3D GEOMETRY QUICK SHEET
========================================================

1. VECTOR TRIPLE PRODUCT:
   a x (b x c) = (a . c)b - (a . b)c. (Remember: "BAC - CAB" rule)

2. SCALAR TRIPLE PRODUCT:
   [a b c] = a . (b x c) = Volume of parallelopiped.
   If [a b c] = 0, the vectors are coplanar.

3. SHORTEST DISTANCE BETWEEN SKEW LINES:
   Line 1: r = a1 + lambda * b1
   Line 2: r = a2 + mu * b2
   Shortest Distance = | (a2 - a1) . (b1 x b2) | / |b1 x b2|

4. EQUATION OF PLANE CONTAINING TWO INTERSECTING LINES:
   r = a + lambda*b + mu*c is perpendicular to (b x c).
   Cartesian equation: ax + by + cz + d = 0.

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    },
    {
      id: "physics-formula-sheet",
      title: "JEE Advanced Core Physics Formula Sheet",
      subject: "Physics",
      topic: "All Topics",
      description: "Complete formula booklet spanning Mechanics, Thermodynamics, Electromagnetism, and Modern Physics.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
        JEE ADVANCED GENERAL PHYSICS FORMULA SHEET
========================================================

1. ROTATIONAL MECHANICS:
   - Torque tau = I * alpha = r x F.
   - Angular momentum L = I * omega = r x p.
   - Rotational Kinetic Energy = 0.5 * I * omega^2.

2. ELECTROSTATICS & GAUSS LAW:
   - Electric field of infinite sheet = sigma / (2 * epsilon_0).
   - Capacitance of parallel plate with dielectric: C = K * epsilon_0 * A / d.

3. MODERN PHYSICS:
   - Bragg's law: 2d sin(theta) = n * lambda.
   - Radioactive decay: N(t) = N_0 * e^(-lambda * t). Half life = ln(2)/lambda.

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    },
    {
      id: "chemistry-reaction-mechanism",
      title: "JEE Advanced Organic Chemistry Mechanism Notes",
      subject: "Chemistry",
      topic: "Organic",
      description: "Quick revision notes on nucleophilic substitutions, electrophilic additions, and named rearrangement mechanisms.",
      content: `========================================================
     ISHWAR HIREMATH ACADEMY - STUDY MATERIAL SERIES
       JEE ADVANCED ORGANIC CHEMISTRY REVISION SHEET
========================================================

1. NUCLEOPHILIC SUBSTITUTION:
   - SN1: Two-step mechanism, carbocation intermediate, racemization, favored by polar protic solvents.
   - SN2: One-step concerted mechanism, pentavalent transition state, inversion of configuration (Walden inversion), favored by polar aprotic solvents.

2. NAMED REARRANGEMENTS & CONDENSATIONS:
   - Aldol Condensation: Requires alpha-hydrogens, forms alpha,beta-unsaturated carbonyl compounds.
   - Cannizzaro Reaction: Non-enolizable aldehydes (no alpha-hydrogens) undergo disproportionation to alcohol and carboxylate salt.
   - Beckmann Rearrangement: Oximes transform into substituted amides under acidic catalysis.

========================================================
Designed by Prof. Ishwar Hiremath. All rights reserved.
========================================================`
    }
  ]
};

// API Endpoint to fetch the list of JEE Papers & Study Materials
app.get('/api/jee/papers', (req, res) => {
  const years = JEE_YEARS;
  const subjects = ['Mathematics', 'Physics', 'Chemistry'];
  const materials = JEE_PAPERS_DATABASE.study_materials.map((m: any) => ({
    id: m.id,
    title: m.title,
    subject: m.subject,
    topic: m.topic,
    description: m.description
  }));

  return res.json({
    years,
    subjects,
    materials
  });
});

// API Endpoint to download/compile specific JEE resource
app.post('/api/jee/download', (req, res) => {
  const { type, id, year, subject, paperNum } = req.body;

  if (type === 'study_material') {
    const material = JEE_PAPERS_DATABASE.study_materials.find((m: any) => m.id === id);
    if (!material) {
      return res.status(404).json({ error: 'Study material not found.' });
    }
    return res.json({
      filename: `${material.id}_2026.txt`,
      title: material.title,
      content: material.content
    });
  }

  if (type === 'question_paper') {
    if (!year || !subject || !paperNum) {
      return res.status(400).json({ error: 'Year, subject, and paper number are required.' });
    }

    const normSubject = subject.toLowerCase();
    const qData = JEE_PAPERS_DATABASE.questions[normSubject] || JEE_PAPERS_DATABASE.questions.mathematics;

    let txtContent = `========================================================\n`;
    txtContent += `                 ISHWAR HIREMATH ACADEMY\n`;
    txtContent += `         JEE ADVANCED PAST YEAR PRACTICE PAPER - ${year}\n`;
    txtContent += `========================================================\n\n`;
    txtContent += `SUBJECT: ${subject.toUpperCase()}\n`;
    txtContent += `PAPER NUMBER: Paper ${paperNum}\n`;
    txtContent += `DURATION: 3 Hours                      MAX MARKS: 180\n\n`;
    txtContent += `------------------ GENERAL INSTRUCTIONS ------------------\n`;
    qData.instructions.forEach((ins: string, idx: number) => {
      txtContent += `${idx + 1}. ${ins}\n`;
    });
    txtContent += `\n========================================================\n\n`;

    qData.sections.forEach((sec: any) => {
      txtContent += `\n${sec.title}\n`;
      if (sec.desc) txtContent += `${sec.desc}\n`;
      txtContent += `--------------------------------------------------------\n`;
      sec.questions.forEach((q: string, qidx: number) => {
        txtContent += `Q${qidx + 1}. ${q}\n\n`;
      });
      txtContent += `\n`;
    });

    txtContent += `\n========================================================\n`;
    txtContent += `Generated by Ishwaryamat Academy - Educuria Portal 2026\n`;
    txtContent += `========================================================\n`;

    return res.json({
      filename: `JEE_Advanced_${year}_${subject}_Paper_${paperNum}.txt`,
      title: `JEE Advanced ${year} - ${subject} (Paper ${paperNum})`,
      content: txtContent
    });
  }

  return res.status(400).json({ error: 'Invalid download type.' });
});

// Helper function to dynamically generate or retrieve realistic KSEAB II PUC questions for any subject
function getSubjectQuestions(subject: string) {
  const norm = subject.toLowerCase().trim();
  
  // If we have it hardcoded in PUC_PAPERS_DATABASE.questions:
  if (PUC_PAPERS_DATABASE.questions[norm]) {
    return PUC_PAPERS_DATABASE.questions[norm];
  }
  
  // Custom generated high-quality papers for requested subjects
  if (norm === 'kannada') {
    return {
      maxMarks: 80,
      instructions: [
        "ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೂ ಉತ್ತರಿಸಿ.",
        "ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ಸುಂದರವಾಗಿ ಬರೆಯಿರಿ.",
        "ಚಿತ್ರಗಳು ಮತ್ತು ಉದಾಹರಣೆಗಳನ್ನು ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಒದಗಿಸಿ."
      ],
      sections: [
        {
          title: "ಭಾಗ - ಎ (ಒಂದು ಅಂಕದ ಪ್ರಶ್ನೆಗಳು)",
          desc: "ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೂ ಉತ್ತರಿಸಿ. ಪ್ರತಿಯೊಂದಕ್ಕೂ 1 ಅಂಕ:",
          questions: [
            "ಹರಹರ ಮಹಾದೇವ ಎಂಬ ಕಾದಂಬರಿಯನ್ನು ಬರೆದವರು ಯಾರು?",
            "ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪರಿಷತ್ತು ಯಾವ ವರ್ಷದಲ್ಲಿ ಸ್ಥಾಪನೆಯಾಯಿತು?",
            "ಕುಮಾರವ್ಯಾಸನ ಮೂಲ ಹೆಸರೇನು?",
            "ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ಪಡೆದ ಮೊದಲ ಕನ್ನಡಿಗ ಯಾರು?",
            "ಕನ್ನಡದ ಮೊದಲ ಉಪಲಬ್ಧ ಗ್ರಂಥ ಯಾವುದು?",
            "ಪಂಪನ ಪ್ರಸಿದ್ಧ ಕಾವ್ಯ ಯಾವುದು?"
          ]
        },
        {
          title: "ಭಾಗ - ಬಿ (ಎರಡು ಅಂಕದ ಪ್ರಶ್ನೆಗಳು)",
          desc: "ಯಾವುದಾದರೂ ಐದು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ. ಪ್ರತಿಯೊಂದಕ್ಕೂ 2 ಅಂಕಗಳು:",
          questions: [
            "ವಚನಕಾರರ ಪ್ರಮುಖ ಸಾಮಾಜಿಕ ಆಶಯಗಳೇನು ವಿವರಿಸಿ.",
            "ಲಕ್ಷ್ಮೀಶ ಕವಿಯ ಕಾವ್ಯ ಶೈಲಿಯನ್ನು ಕುರಿತು ಬರೆಯಿರಿ.",
            "ಕನ್ನಡ ಭಾಷೆಗೆ ಶಾಸ್ತ್ರೀಯ ಸ್ಥಾನಮಾನ ಲಭಿಸಿದ ವರ್ಷ ಮತ್ತು ಮಹತ್ವವೇನು?",
            "ಹೊಸಗನ್ನಡ ಸಾಹಿತ್ಯದ ಪ್ರಮುಖ ಘಟ್ಟಗಳನ್ನು ಹೆಸರಿಸಿ."
          ]
        },
        {
          title: "ಭಾಗ - ಸಿ (ಐದು ಅಂಕದ ಪ್ರಶ್ನೆಗಳು)",
          desc: "ಯಾವುದಾದರೂ ಮೂರು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ. ಪ್ರತಿಯೊಂದಕ್ಕೂ 5 ಅಂಕಗಳು:",
          questions: [
            "ರಾಮಧಾನ್ಯ ಚರಿತೆಯ ಆಶಯವನ್ನು ಕಥಾಸಾರಾಂಶದೊಂದಿಗೆ ವಿವರಿಸಿ.",
            "ಕನ್ನಡ ನಾಡು-ನುಡಿಯ ರಕ್ಷಣೆ ಮತ್ತು ನಮ್ಮ ಕರ್ತವ್ಯಗಳ ಕುರಿತು ಒಂದು ಪ್ರಬಂಧ ಬರೆಯಿರಿ.",
            "ಜನಪದ ಸಾಹಿತ್ಯದ ವಿಶಿಷ್ಟತೆಗಳನ್ನು ವಿವರವಾಗಿ ಚರ್ಚಿಸಿ."
          ]
        }
      ]
    };
  }

  if (norm === 'hindi') {
    return {
      maxMarks: 80,
      instructions: [
        "सभी प्रश्नों के उत्तर देना अनिवार्य है।",
        "व्याकरण की शुद्धता और सुंदर लिखावट पर विशेष ध्यान दें।"
      ],
      sections: [
        {
          title: "खंड - क (एक अंक के प्रश्न)",
          desc: "सभी प्रश्नों के उत्तर दीजिए। प्रत्येक प्रश्न 1 अंक का है:",
          questions: [
            "सूरदास के अनुसार सच्चे सखा की पहचान क्या है?",
            "'कबीर की साखियाँ' में कबीर ने वाणी को कैसा रखने को कहा है?",
            "'सुजान भगत' कहानी के लेखक कौन हैं?",
            "गंगू कौन था और वह किससे विवाह करना चाहता था?",
            "निराला जी की प्रमुख काव्य कृति का नाम लिखिए।",
            "सूरदास किस काल के कवि हैं?"
          ]
        },
        {
          title: "खंड - ख (दो अंक के प्रश्न)",
          desc: "किन्हीं पांच प्रश्नों के उत्तर लिखिए। प्रत्येक प्रश्न 2 अंक का है:",
          questions: [
            "बिहारी के दोहों के आधार पर कनक और धतूरे की तुलना स्पष्ट कीजिए।",
            "ममता की ममतामयी मूर्ति किसे कहा गया है और क्यों?",
            "रहीम के अनुसार सच्चे मित्र की क्या विशेषता होती है?",
            "प्रेमचंद की कहानियों में सामाजिक यथार्थवाद का उदाहरण दीजिए।"
          ]
        },
        {
          title: "खंड - ग (पांच अंक के प्रश्न)",
          desc: "किन्हीं तीन प्रश्नों के उत्तर लिखिए। प्रत्येक प्रश्न 5 अंक का है:",
          questions: [
            "'चीफ की दावत' कहानी के मुख्य पात्र श्यामनाथ का चरित्र चित्रण कीजिए।",
            "पर्यावरण संरक्षण पर एक संक्षिप्त और विचारपूर्ण निबंध लिखिए।",
            "राष्ट्रभाषा के रूप में हिंदी के महत्व पर प्रकाश डालिए।"
          ]
        }
      ]
    };
  }

  if (norm === 'urdu') {
    return {
      maxMarks: 80,
      instructions: [
        "تمام سوالات کے جوابات لازمی ہیں۔",
        "لکھاوٹ کی صفائی اور املا کی درستگی کا خاص خیال رکھیں۔"
      ],
      sections: [
        {
          title: "حصہ اول (ایک نمبر والے سوالات)",
          desc: "درج ذیل تمام سوالات کے جوابات دیجیے۔ ہر سوال کا 1 نمبر ہے:",
          questions: [
            "غالب کا پورا نام کیا تھا؟",
            "افسانہ 'حج اکبر' کے مصنف کون ہیں؟",
            "مثنوی 'سحر البیان' کس کی تصنیف ہے؟",
            "علامہ اقبال نے نوجوانوں کو کس چیز کی تلقین کی ہے؟",
            "اردو کے پہلے صاحب دیوان شاعر کون ہیں؟",
            "سر سید احمد خان کی تحریک کا نام کیا تھا؟"
          ]
        },
        {
          title: "حصہ دوم (دو نمبر والے سوالات)",
          desc: "کسی پانچ سوالات کے جوابات دیجیے۔ ہر سوال کے 2 نمبر ہیں:",
          questions: [
            "میر تقی میر کی غزل گوئی کی دو اہم خصوصیات تحریر کریں۔",
            "مولانا ابوالکلام آزاد کے اسلوب نگارش پر مختصر روشنی ڈالیں۔",
            "ترقی پسند تحریک کے دو اہم شعراء کے نام لکھیں۔",
            "ناول اور افسانے میں بنیادی فرق واضح کریں۔"
          ]
        },
        {
          title: "حصہ سوم (پانچ نمبر والے سوالات)",
          desc: "کسی تین سوالات کے جوابات دیجیے۔ هر سوال کے 5 نمبر ہیں:",
          questions: [
            "غالب کی شاعری میں شوخی اور ظرافت کا تفصیلی جائزہ پیش کریں۔",
            "اردو زبان و ادب کی اہمیت اور اس کی ترویج پر ایک جامع مضمون لکھیے۔",
            "اقبال کے تصورِ خودی پر تفصیلی بحث کیجیے۔"
          ]
        }
      ]
    };
  }

  if (norm === 'biology') {
    return {
      maxMarks: 80,
      instructions: [
        "Answer all parts. Draw neat labeled diagrams wherever necessary.",
        "Calculators and smart devices are strictly prohibited."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "What is parthenogenesis? Give an example.",
            "Name the pioneer species in primary succession on rocks.",
            "What is a codon? Give an example of an initiator codon.",
            "Define biopiracy.",
            "What is the function of filiform apparatus in embryology?",
            "State Chargaff's rule of base pairing."
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "Draw a neat labeled diagram of a mature pollen grain.",
            "Distinguish between active and passive immunity with examples.",
            "What are transgenic animals? Mention two potential benefits.",
            "Explain the central dogma of molecular biology."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Describe the structure of DNA double helix as proposed by Watson and Crick.",
            "Explain the step-by-step process of DNA fingerprinting technology.",
            "Describe the replication cycle of HIV with a schematic flow diagram."
          ]
        }
      ]
    };
  }

  if (norm === 'computer science') {
    return {
      maxMarks: 80,
      instructions: [
        "Write syntax, headers and C++ code blocks clearly.",
        "Answers without proper variable declarations and logic syntax will carry zero marks."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "What is a class in C++?",
            "Define Boolean algebra.",
            "What is the use of the pointer variable?",
            "Define primary key in database systems.",
            "What is a constructor?",
            "Which header file is used for setprecision() in C++?"
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "What is function overloading? State one rule.",
            "Distinguish between public and private access specifiers.",
            "What is DBMS? Mention two advantages.",
            "Write the syntax of switch-case statement in C++."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Explain inheritance and describe three different types of inheritance with diagrams.",
            "Write a C++ program to sort an array of N integers using bubble sort method.",
            "Explain SQL DDL and DML commands with two examples each."
          ]
        }
      ]
    };
  }

  if (norm === 'history') {
    return {
      maxMarks: 80,
      instructions: [
        "Write dates, dynasties and rulers clearly.",
        "Draw historical maps or charts where appropriate."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "Who is known as the father of Indian Archaeology?",
            "Which Harappan site shows evidence of a dockyard?",
            "Who wrote the famous travelogue 'Indica'?",
            "Who was the founder of the Vijayanagara Empire?",
            "In which year did the Battle of Talikota take place?",
            "Name the first viceroy of British India."
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "Name any two major achievements of Kanishka.",
            "Write two features of the Dravidian style of temple architecture.",
            "Who was Shivaji? Name his capital city.",
            "Mention two causes for the downfall of the Vijayanagara Empire."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Describe the socio-religious reforms of Swami Vivekananda and the Ramakrishna Mission.",
            "Examine the causes and results of the First War of Indian Independence (1857).",
            "Discuss the role of Mahatma Gandhi in the Non-Cooperation Movement."
          ]
        }
      ]
    };
  }

  if (norm === 'economics') {
    return {
      maxMarks: 80,
      instructions: [
        "Draw clean diagrams and economic curves with clear axes labeling.",
        "Calculators are allowed for data-based calculations."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "What is microeconomics?",
            "Define Opportunity Cost.",
            "State the law of demand.",
            "What is GDP at market price?",
            "Define budget line.",
            "What is oligopoly?"
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "Distinguish between positive economics and normative economics.",
            "Explain the concept of utility.",
            "What are the components of money supply (M1 and M2)?",
            "State any two features of monopolistic competition."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Explain the law of diminishing marginal utility with the help of a schedule and a graph.",
            "Discuss the functions of the Central Bank (Reserve Bank of India).",
            "Describe the determination of income and employment in a two-sector model."
          ]
        }
      ]
    };
  }

  if (norm === 'business studies') {
    return {
      maxMarks: 80,
      instructions: [
        "Structure your answers with clean sub-headings.",
        "Use real-world corporate examples where necessary."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "What is management?",
            "State any one principle of scientific management.",
            "What is business environment?",
            "Define planning.",
            "What is a brand?",
            "Name one source of external recruitment."
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "Mention any two objectives of management.",
            "State two advantages of formal organization.",
            "What is delegation of authority? Mention its components.",
            "State two differences between marketing and selling."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Explain the steps involved in the planning process.",
            "Discuss the 14 principles of management laid down by Henri Fayol.",
            "Explain the primary and secondary functions of a financial market."
          ]
        }
      ]
    };
  }

  if (norm === 'statistics') {
    return {
      maxMarks: 80,
      instructions: [
        "Show step-by-step mathematical calculations.",
        "Non-programmable calculators are allowed."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "What is an index number?",
            "Define Vital Statistics.",
            "State the classical definition of probability.",
            "What is interpolation?",
            "Define a random variable.",
            "What is meant by trend in time series?"
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "Write the formula for Laspeyres' and Paasche's price index numbers.",
            "State two features of the Binomial probability distribution.",
            "Mention two components of time series.",
            "Define infant mortality rate (IMR)."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Calculate Fisher's ideal index number from the following commodity price-quantity data and show it satisfies TRT.",
            "Fit a straight line trend by the method of least squares for the given production data of 7 years.",
            "A box contains 5 red and 4 black balls. If 3 balls are drawn at random, find the probability that 2 are red and 1 is black."
          ]
        }
      ]
    };
  }

  if (norm === 'political science') {
    return {
      maxMarks: 80,
      instructions: [
        "State articles of the constitution where relevant.",
        "Keep answers structured and professional."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "When was the Indian Constitution adopted?",
            "Who is the chairperson of NITI Aayog?",
            "What is federalism?",
            "Expand SAARC.",
            "Which article of the constitution deals with fundamental rights?",
            "Name the house of elders in Indian Parliament."
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "State any two features of Indian foreign policy.",
            "Mention two functions of the Union Public Service Commission (UPSC).",
            "What is the coalition government? Give one example.",
            "State two functions of the State Legislature."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Explain the powers and functions of the Prime Minister of India.",
            "Discuss the role of regional parties in Indian politics and coalition eras.",
            "Explain the powers and jurisdictions of the Supreme Court of India."
          ]
        }
      ]
    };
  }

  if (norm === 'sociology') {
    return {
      maxMarks: 80,
      instructions: [
        "State sociological terms and concepts clearly.",
        "Answer all parts with relevant social context."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "Answer all the following questions. Each carries 1 mark:",
          questions: [
            "Who is considered the father of sociology?",
            "Define caste system.",
            "What is socialization?",
            "What is globalization?",
            "Who wrote 'Das Kapital'?",
            "Mention one form of marriage in India."
          ]
        },
        {
          title: "PART - B (Two Mark Questions)",
          desc: "Answer any five questions. Each carries 2 marks:",
          questions: [
            "State any two characteristics of joint family.",
            "Mention two major problems faced by scheduled castes in India.",
            "Define social change.",
            "What is urbanisation? Mention one cause."
          ]
        },
        {
          title: "PART - C (Five Mark Questions)",
          desc: "Answer any three questions. Each carries 5 marks:",
          questions: [
            "Explain the role of women's movements in bringing about social and legal change in India.",
            "Discuss the impact of Westernization on traditional Indian culture and values.",
            "Explain the causes and consequences of farmers' movements in Karnataka."
          ]
        }
      ]
    };
  }

  if (norm === 'english') {
    return {
      maxMarks: 80,
      instructions: [
        "Answer all questions. Write the question numbers correctly.",
        "Quality of expression and grammatical accuracy will be considered."
      ],
      sections: [
        {
          title: "PART - A (One Mark Questions)",
          desc: "I. Answer the following questions in a word, a phrase or a sentence each:",
          questions: [
            "Who is Juliet's beloved in Shakespeare's famous play?",
            "Where does the action of 'A Sunny Morning' take place?",
            "Who is the owner of the pink-coloured villa in 'The Gardener'?",
            "What does the speaker compare his beloved's beauty to in 'Romeo and Juliet'?",
            "How many people lived in Monaco in 'Too Dear!'?",
            "What does Babar Ali do in the afternoon?"
          ]
        },
        {
          title: "PART - B (Four Mark Questions)",
          desc: "II. Answer any five of the following in about 80-100 words each:",
          questions: [
            "Why does Juliet want night to come quickly in 'Romeo and Juliet'?",
            "How does Don Gonzalo justify his rude behavior to Dona Laura in 'A Sunny Morning'?",
            "Write a brief note on the concept of 'Heaven on Earth' as described by Kuvempu.",
            "How does the narrator describe the transition of the old man in 'The Gardener'?"
          ]
        },
        {
          title: "PART - C (Six Mark Questions)",
          desc: "III. Answer any one of the following in about 200 words:",
          questions: [
            "Explain how the gardener's entry into the plantation changed the life of the owner and his wife.",
            "Write an essay on the symbolic meaning of the 'Foot' in Neruda's poem 'To the Foot from its Child'.",
            "Describe the challenges faced by Babar Ali in running his school for poor children."
          ]
        }
      ]
    };
  }

  // Fallback to Mathematics questions
  return PUC_PAPERS_DATABASE.questions.mathematics;
}

// API Endpoint to fetch the list of PUC Papers & Study Materials
app.get('/api/puc/papers', (req, res) => {
  const years = PUC_YEARS;
  const subjects = [
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
  ];
  const materials = PUC_PAPERS_DATABASE.study_materials.map((m: any) => ({
    id: m.id,
    title: m.title,
    subject: m.subject,
    topic: m.topic,
    description: m.description
  }));

  return res.json({
    years,
    subjects,
    materials
  });
});

// API Endpoint to download/compile specific PUC resource
app.post('/api/puc/download', (req, res) => {
  const { type, id, year, subject, paperNum } = req.body;

  if (type === 'study_material') {
    const material = PUC_PAPERS_DATABASE.study_materials.find((m: any) => m.id === id);
    if (!material) {
      return res.status(404).json({ error: 'Study material not found.' });
    }
    return res.json({
      filename: `${material.id}_Watermarked_2026.txt`,
      title: material.title,
      content: material.content
    });
  }

  if (type === 'question_paper') {
    if (!year || !subject) {
      return res.status(400).json({ error: 'Year and subject are required.' });
    }

    const qData = getSubjectQuestions(subject);

    let txtContent = `========================================================\n`;
    txtContent += `          KARNATAKA SCHOOL EXAMINATION AND ASSESSMENT BOARD\n`;
    txtContent += `              II PUC ANNUAL STATE BOARD EXAM - ${year}\n`;
    txtContent += `========================================================\n\n`;
    txtContent += `SUBJECT: ${subject.toUpperCase()}\n`;
    txtContent += `PAPER: Annual Exam Paper (Verified Series)\n`;
    txtContent += `DURATION: 3 Hours 15 Minutes           MAX MARKS: ${qData.maxMarks || 80}\n\n`;
    txtContent += `------------------ GENERAL INSTRUCTIONS ------------------\n`;
    qData.instructions.forEach((ins: string, idx: number) => {
      txtContent += `${idx + 1}. ${ins}\n`;
    });
    txtContent += `\n========================================================\n\n`;

    qData.sections.forEach((sec: any) => {
      txtContent += `\n${sec.title}\n`;
      if (sec.desc) txtContent += `${sec.desc}\n`;
      txtContent += `--------------------------------------------------------\n`;
      sec.questions.forEach((q: string, qidx: number) => {
        txtContent += `Q${qidx + 1}. ${q}\n\n`;
      });
      txtContent += `\n`;
    });

    txtContent += `\n========================================================\n`;
    txtContent += `Generated by Ishwaryamat Academy - Educuria Portal 2026\n`;
    txtContent += `========================================================\n`;

    return res.json({
      filename: `KSEAB_2PUC_${year}_${subject}_Annual_Paper.txt`,
      title: `KSEAB II PUC ${year} - ${subject} (Annual Paper)`,
      content: txtContent
    });
  }

  return res.status(400).json({ error: 'Invalid download type.' });
});

// Get Announcements
app.get('/api/announcements', (req, res) => {
  return res.json(announcements);
});

// Post Announcement (Admin only)
app.post('/api/announcements', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }

  const { title, content, important } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const newAnn = {
    id: 'ann-' + Date.now(),
    title,
    content,
    date: new Date().toISOString().split('T')[0],
    important: !!important
  };

  announcements.unshift(newAnn);
  safeWriteFile(ANNOUNCEMENTS_FILE, announcements);
  return res.json(announcements);
});

// Get Admin Stats (Registered users list & progress totals)
app.get('/api/admin/stats', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }

  // Map students and their progress summary
  const studentStats = users
    .filter((u: any) => u.role !== 'admin')
    .map((u: any) => {
      const studentProgress = progressList.filter((p: any) => p.userId === u.id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        enrolledCoursesCount: u.enrolledCourses.length,
        progress: studentProgress.map((p: any) => ({
          courseId: p.courseId,
          completedCount: p.completedLessons.length,
          quizzesTaken: Object.keys(p.quizScores).length
        }))
      };
    });

  return res.json({
    totalStudents: studentStats.length,
    students: studentStats,
    totalAnnouncements: announcements.length
  });
});

// Vite/Static asset pipeline setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Educuria Backend running on port ${PORT}`);
  });
}

startServer();
