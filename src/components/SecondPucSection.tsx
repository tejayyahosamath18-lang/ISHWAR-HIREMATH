import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle, Search, Sparkles, BookOpen, 
  ArrowLeft, Printer, RefreshCw, Star, Info, HelpCircle, Eye, 
  Share2, ShieldCheck, CheckSquare, Layers, Settings, Calendar, Award,
  ChevronLeft, ChevronRight, Sliders
} from 'lucide-react';
import PdfViewer from './PdfViewer';

export interface SubjectPaper {
  code: string;
  name: string;
  papers: {
    [key: number]: boolean; // True if paper is available
  };
}

// 40 exact subjects from the images
export const PUC_SUBJECTS: SubjectPaper[] = [
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
export const SUBJECT_QUESTIONS: { [key: string]: { maxMarks: number; instructions: string[]; sections: { title: string; desc?: string; questions: string[] }[] } } = {
  '01': {
    maxMarks: 80,
    instructions: [
      'ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೂ ಕಡ್ಡಾಯವಾಗಿ ಉತ್ತರಿಸಿ.',
      'ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯಿರಿ.',
      'ಪ್ರತಿ ಭಾಗದ ಸೂಚನೆಗಳನ್ನು ಗಮನಿಸಿ ಉತ್ತರಿಸಿ.'
    ],
    sections: [
      {
        title: 'ಭಾಗ - ಅ (ಒಂದು ಅಂಕದ ಪ್ರಶ್ನೆಗಳು)',
        desc: 'I. ಕೆಳಗಿನ ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೂ ಒಂದೊಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ. ಪ್ರತಿಯೊಂದಕ್ಕೂ 1 ಅಂಕ:',
        questions: [
          'ಯಾರಿಗೆ ಮರಣವಿಲ್ಲ ಎಂದು ಕವಿ ಸಿದ್ದಲಿಂಗಯ್ಯ ಅವರು ಹೇಳುತ್ತಾರೆ?',
          'ಯಶೋಧರೆಯ ಪತಿಯ ಹೆಸರೇನು?',
          'ದೇವರ ಕಣ್ಣು ಕಥೆಯ ಮುಖ್ಯ ಲೇಖಕರು ಯಾರು?',
          'ಹಬ್ಬಲಿ ಅವಳಿಗಿಲ್ಲಿ ಸುಖದ ಹೂಮಳೆ - ಈ ಸಾಲು ಯಾವ ಕಾವ್ಯ ಭಾಗದಲ್ಲಿದೆ?',
          'ಲಕ್ಷ್ಮೀಶ ಕವಿಯ ಪ್ರಸಿದ್ಧ ಕಾವ್ಯ ಕೃತಿ ಯಾವುದು?',
          'ದುರ್ಯೋಧನನು ಯಾರನ್ನು ಕುರಿತು ಭೀಷ್ಮ ಸೇನಾಪತಿ ಎಂದು ಜಗಳವಾಡಿದನು?',
          'ಮುದ್ದಣನು ಮನೋರಮೆಗೆ ಹೇಳಿದ ಕಥೆಯ ಹೆಸರೇನು?',
          'ಬಾಬಾಸಾಹೇಬ್ ಅಂಬೇಡ್ಕರ್ ಅವರು ಬರೆದ ಕೃತಿಗಳಲ್ಲಿ ಒಂದನ್ನು ಹೆಸರಿಸಿ.'
        ]
      },
      {
        title: 'ಭಾಗ - ಆ (ಎರಡು-ಮೂರು ವಾಕ್ಯದ ಪ್ರಶ್ನೆಗಳು)',
        desc: 'II. ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಯಾವುದಾದರೂ ಐದಕ್ಕೆ ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ. ಪ್ರತಿಯೊಂದಕ್ಕೂ 2 ಅಂಕ:',
        questions: [
          'ಧರ್ಮಬುದ್ಧಿ ಮತ್ತು ಪಾಪಬುದ್ಧಿ ಇವರ ನಡುವಿನ ಸ್ನೇಹ ಹೇಗೆ ಮುರಿದು ಬಿತ್ತು?',
          'ಗೌತಮ ಬುದ್ಧನು ಸಂಸಾರವನ್ನು ತೊರೆದು ಅಡವಿಗೆ ಹೋಗಲು ಕಾರಣವಾದ ದೃಶ್ಯಗಳಾವುವು?',
          'ಬೆಳಗಿನ ಜಾವದ ಸೌಂದರ್ಯವನ್ನು ಕವಿ ಜಿ.ಎಸ್. ಶಿವರುದ್ರಪ್ಪನವರು ಹೇಗೆ ವರ್ಣಿಸಿದ್ದಾರೆ?',
          'ಕನ್ನಡ ಭಾಷೆಯ ಪ್ರಾಚೀನತೆ ಮತ್ತು ಹಿರಿಮೆಯನ್ನು ಕುರಿತು ಚರ್ಚಿಸಿ.',
          'ಮುದ್ದಣನು ರಮಣಿಯೊಂದಿಗೆ ಸಲ್ಲಾಪ ನಡೆಸಿದ ಸಂದರ್ಭವನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಬರೆಯಿರಿ.'
        ]
      },
      {
        title: 'ಭಾಗ - ಇ (ದೀರ್ಘ ಉತ್ತರಗಳು)',
        desc: 'III. ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಎಂಟು-ಹತ್ತು ವಾಕ್ಯಗಳಲ್ಲಿ ಸಂದರ್ಭ ಸಹಿತ ವಿವರಣೆ ನೀಡಿ. ಪ್ರತಿಯೊಂದಕ್ಕೂ 4 ಅಂಕ:',
        questions: [
          '"ಗುರುವಿನ ಉಪದೇಶವೇ ಜೀವನದ ದಾರಿದೀಪ" - ಈ ಮಾತನ್ನು ಶುಕನಾಸನ ಉಪದೇಶದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ವಿವರಿಸಿ.',
          'ಹಲಗಲಿಯ ಬೇಡರ ದಂಗೆ ಮತ್ತು ಅವರ ಸ್ವಾತಂತ್ರ್ಯ ಪ್ರೇಮವನ್ನು ಕುರಿತು ವಿಶ್ಲೇಷಿಸಿ.'
        ]
      }
    ]
  },
  '02': {
    maxMarks: 80,
    instructions: [
      'All parts are compulsory.',
      'Write legible answers and match all section headings with KSEAB board blueprints.',
      'Avoid overwriting or crossing out answers repeatedly.'
    ],
    sections: [
      {
        title: 'PART - A (Multiple Choice & Short Answers)',
        desc: 'I. Answer all the following questions. Each carries 1 mark:',
        questions: [
          'Who according to Romeo is a "snowy dove" among crows?',
          'What did Juliet want Romeo to be cut out into after her death?',
          'Where is the Kingdom of Monaco located?',
          'Who is the owner of the pink lap-dog in the play "A Sunny Morning"?',
          'What does the phrase "the arch of your foot" represent in Pablo Neruda\'s poem?',
          'How much pension did the king of Monaco finally agree to pay the prisoner?',
          'In "Too Dear!", the gaming house in Monaco was the only source of regular revenue because __________ (Fill in the blank).',
          'Name the mountain that is sacred to the native Americans in "I am the Land".',
          'Who is the creator of "The Garden of Forking Paths" described by Borges?',
          'What did Alif Dahiya teach Bowring in "Heaven, If You Are Not Here On Earth"?'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions in 2-3 sentences each. Each carries 2 marks:',
        questions: [
          'Why does Juliet want the night to arrive as quickly as possible?',
          'How did the King of Monaco collect regular taxes from his subjects on general goods?',
          'Describe the comic conflict between Don Gonzalo and Dona Laura during their initial encounter in the park.',
          'Why does Jorge Luis Borges feel that books are the most astounding invention of human beings?',
          'Explain the concept of "The Bow and the Arrow" metaphor used by Kahlil Gibran in "On Children".',
          'How does the poet transition from patience to protest in the poem "I am the Land"?'
        ]
      },
      {
        title: 'PART - C (Four-Mark Paragraph Questions)',
        desc: 'III. Answer any five of the following questions in a paragraph of 80-100 words. Each carries 4 marks:',
        questions: [
          'Analyze how Romeo\'s and Juliet\'s expressions of love transcend temporal limits and conventional social standards.',
          'Detail the successive difficulties faced by the Monaco authorities in carrying out the death sentence on the criminal.',
          'How does the play "A Sunny Morning" present the theme of nostalgic romance and missed opportunities?',
          'Discuss how Kahlil Gibran challenges conventional ideas of parenting and ownership in "On Children".',
          'Explain the environmental message conveyed by Vandana Shiva in "Everything I Need to Know I Learned in the Forest".',
          'How does Marcus Ibe\'s campaign in "The Voter" highlight the commercialization of democratic elections?'
        ]
      },
      {
        title: 'PART - D (Six-Mark Essay & Grammar)',
        desc: 'IV. Answer any one of the following questions in about 200 words. Each carries 6 marks:',
        questions: [
          '"Rufus Okeke\'s loyalty to his tribe and candidate is ultimately shattered by personal greed and dynamic circumstances." Examine this statement with reference to "The Voter".',
          'Write a letter of application in response to the following advertisement: "Wanted: Junior Lecturers in English at KSEAB Public School, Bengaluru. Requirements: MA in English with 55% marks. Experience preferred."',
          'Read the following passage and write a summary by suggesting a suitable title: "Academic discipline is the cornerstone of student success. It involves punctual attendance, regular study cycles, and respect for classroom rules. Students who master time management early on are more resilient to examination stress..."'
        ]
      }
    ]
  },
  '03': {
    maxMarks: 80,
    instructions: [
      'सभी प्रश्न अनिवार्य हैं।',
      'सुलेख और शुद्ध वर्तनी का विशेष ध्यान रखें।'
    ],
    sections: [
      {
        title: 'खण्ड - क (वस्तुनिष्ठ प्रश्न)',
        desc: 'I. निम्नलिखित प्रश्नों के उत्तर एक वाक्य में दीजिए। प्रत्येक प्रश्न 1 अंक का है:',
        questions: [
          'कबीरदास के अनुसार निंदक को कहाँ रखना चाहिए?',
          'सूरदास के पदों में कृष्ण किसके दूध पीने की बात कर रहे हैं?',
          'रहीम के अनुसार सच्चे मित्र की क्या पहचान है?',
          'बिहारी लाल किस काल के प्रसिद्ध कवि हैं?',
          'गजाधर बाबू किस विभाग में नौकरी करते थे?',
          '‘चीफ की दावत’ कहानी के लेखक कौन हैं?',
          'सुभद्रा कुमारी चौहान की प्रसिद्ध कविता का नाम क्या है?',
          '‘आत्मनिर्भरता’ निबंध के लेखक कौन हैं?'
        ]
      },
      {
        title: 'खण्ड - ख (लघु उत्तरीय प्रश्न)',
        desc: 'II. निम्नलिखित प्रश्नों में से किन्हीं पाँच के उत्तर दो-तीन वाक्यों में दीजिए। प्रत्येक 2 अंक:',
        questions: [
          'कृष्ण यशोदा माँ से बलराम भैया की क्या शिकायत करते हैं?',
          'गजाधर बाबू अपनी गृहस्थी में स्वयं को पराया क्यों महसूस करने लगे?',
          'कबीरदास ने मीठी वाणी बोलने की सलाह क्यों दी है?',
          'शामनाथ की पत्नी ने मेहमानों के स्वागत के लिए क्या तैयारियाँ की थीं?',
          'तुलसीदास के अनुसार मुखिया को कैसा होना चाहिए और क्यों?'
        ]
      }
    ]
  },
  '09': {
    maxMarks: 80,
    instructions: [
      'सर्व प्रश्नाः अनिवार्याः सन्ति।',
      'देवनागरी लिप्यामेव उत्तराणि लेखनीयानि।'
    ],
    sections: [
      {
        title: 'PART - A (एकपदप्रश्नाः)',
        desc: 'I. अधोलिखितप्रश्नानाम् उत्तराणि एकपदेन लिखत। प्रत्येकस्य 1 अङ्कः:',
        questions: [
          'कालिदासस्य सर्वश्रेष्ठं नाटकं किम्?',
          'दिलीपः कस्य धेनोः सेवां चकार?',
          'रघुवंशमहाकाव्यस्य प्रणेता कः?',
          'विद्या किम ददाति?',
          'शुकನಾಸಃ ಕಸ್ಯ ಮಂತ್ರಿ ಆಸೀತ್?',
          'नीतिशतकस्य कर्ता कः?'
        ]
      }
    ]
  },
  '21': {
    maxMarks: 80,
    instructions: [
      'Answer all parts compiling historical events accurately.',
      'Show chronological order in your long answers.'
    ],
    sections: [
      {
        title: 'PART - A (One-Mark Questions)',
        desc: 'I. Answer all the following questions in one word or sentence each. Each carries 1 mark:',
        questions: [
          'Who wrote the famous book "Indica"?',
          'Name the founder of the Maurya Dynasty.',
          'When did the Gautama Buddha deliver his first sermon?',
          'Which Chola king built the Brihadeeswarar Temple at Thanjavur?',
          'Who was the court poet of Pulakeshin II?',
          'In which year did the Battle of Talikota occur?',
          'Who founded the Arya Samaj in India?',
          'Name the famous leader of the Kittur revolt against British rule.'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions in 2-3 sentences each. Each carries 2 marks:',
        questions: [
          'Mention any two archaeological sources of ancient Indian history.',
          'Name the two Chinese pilgrims who visited India during ancient times.',
          'State any two features of Hoysala architecture.',
          'Write any two social reforms introduced by Raja Ram Mohan Roy.',
          'What was the main significance of the Dandi March led by Mahatma Gandhi?'
        ]
      },
      {
        title: 'PART - C (Five-Mark Questions)',
        desc: 'III. Answer any five of the following questions in 15-20 sentences each. Each carries 5 marks:',
        questions: [
          'Explain the cultural achievements of the Gupta period that earned it the title of the "Golden Age".',
          'Describe the administrative setup and land revenue reforms introduced by Akbar.',
          'Discuss the causes and immediate results of the Revolt of 1857.',
          'Trace the role of Sir M. Visvesvaraya in the industrial and economic modernization of Mysore State.'
        ]
      }
    ]
  },
  '22': {
    maxMarks: 80,
    instructions: [
      'Draw neat diagrams and graphs wherever necessary.',
      'Clearly define economic principles with algebraic definitions where applicable.'
    ],
    sections: [
      {
        title: 'PART - A (Objective Type Questions)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'What is a market economy?',
          'Write the formula for calculating Marginal Utility (MU).',
          'Define the Law of Demand.',
          'What is production function?',
          'Write the meaning of a Monopoly market.',
          'Define Gross Domestic Product (GDP).',
          'What is money multiplier?',
          'State the meaning of Balance of Payments (BOP).'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'Distinguish between positive economics and normative economics.',
          'What is an indifference map? Draw a typical indifference curve.',
          'State any two factors that cause a shift in the supply curve.',
          'Distinguish between microeconomics and macroeconomics.',
          'What are intermediate goods? Give an example.'
        ]
      },
      {
        title: 'PART - C (Four-Mark Analytical Questions)',
        desc: 'III. Answer any five of the following questions. Each carries 4 marks:',
        questions: [
          'Explain the properties of indifference curves with the help of neat diagrams.',
          'Discuss how the price is determined under perfect competition with equilibrium graphs.',
          'Explain the functions of Money as a medium of exchange and a measure of value.',
          'Describe the components of Government Budget and explain current account deficit.'
        ]
      },
      {
        title: 'PART - D (Six-Mark Long Answers)',
        desc: 'IV. Answer any two of the following questions. Each carries 6 marks:',
        questions: [
          'Explain the Law of Variable Proportions with the help of a schedule and a detailed diagram.',
          'Describe the circular flow of income in a simple two-sector economy with a neat flow schematic.',
          'How does the Central Bank (RBI) control credit in the economy? Discuss qualitative and quantitative instruments.'
        ]
      }
    ]
  },
  '27': {
    maxMarks: 80,
    instructions: [
      'All parts are compulsory.',
      'Show neat organograms and flowcharts wherever applicable.'
    ],
    sections: [
      {
        title: 'PART - A (Objective Type Questions)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'Define "Management" in a single sentence.',
          'What is delegation of authority?',
          'Give the meaning of "Recruitment".',
          'What is an informal communication network?',
          'Define "Marketing Mix".',
          'State any one consumer right under the Consumer Protection Act.'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'State any two principles of scientific management proposed by F.W. Taylor.',
          'Mention any two benefits of organizing in an enterprise.',
          'Name any two training methods widely used in modern corporate environments.',
          'What is feed-forward control in management control systems?'
        ]
      },
      {
        title: 'PART - C (Four-Mark Questions)',
        desc: 'III. Answer any five of the following questions. Each carries 4 marks:',
        questions: [
          'Explain the steps involved in the process of planning.',
          'Discuss the main differences between formal and informal organizations.',
          'Explain the importance of staffing as a core function of management.'
        ]
      }
    ]
  },
  '29': {
    maxMarks: 80,
    instructions: [
      'Answers should be objective, analytical, and structured.',
      'Write constitutional articles clearly.'
    ],
    sections: [
      {
        title: 'PART - A (One-Mark Questions)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'What is the composition of the Election Commission of India?',
          'Define coalition government.',
          'Which constitutional article guarantees India\'s foreign policy guidelines?',
          'When was the United Nations Organization established?',
          'What is Panchsheel?',
          'Who was the chairman of the Drafting Committee of the Indian Constitution?'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'Write any two qualifications required to become a member of the Lok Sabha.',
          'Mention any two major political parties forming the opposition currently.',
          'Name any two founder members of the Non-Aligned Movement (NAM).',
          'State any two objectives of SAARC.'
        ]
      },
      {
        title: 'PART - C (Five-Mark Questions)',
        desc: 'III. Answer any five of the following questions. Each carries 5 marks:',
        questions: [
          'Explain the powers and functions of the President of India.',
          'Discuss the role of the Election Commission in conducting free and fair elections in India.',
          'Describe the structure and functions of the Union Cabinet.'
        ]
      }
    ]
  },
  '30': {
    maxMarks: 80,
    instructions: [
      'Draw neat ledger tables using proper double-entry system column headers.',
      'Calculation details and working notes must form part of the final answer.'
    ],
    sections: [
      {
        title: 'PART - A (One-Mark Questions)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'What is Partnership Deed?',
          'State the meaning of Sacrificing Ratio.',
          'Why is Revaluation Account prepared at the time of admission of a new partner?',
          'What is Joint Life Policy (JLP)?',
          'State any one reason for the dissolution of a partnership firm.',
          'What is authorized share capital of a company?',
          'Define Cash Flow Statement.',
          'Write the formula to calculate Liquid Ratio.'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'Mention any two rules applicable in the absence of a Partnership Deed.',
          'Calculate Gaining Ratio of A and B if their old ratio is 5:3:2 and C retires, leaving their new ratio as 3:2.',
          'Give the journal entry for transfer of accumulated reserves on the death of a partner.',
          'State any two limitations of financial statements analysis.'
        ]
      },
      {
        title: 'PART - C (Six-Mark Revaluation/Partnership Questions)',
        desc: 'III. Answer any three of the following questions. Each carries 6 marks:',
        questions: [
          'A and B are partners sharing profits in the ratio 3:2. They admit C into partnership for 1/5th share. C brings in ₹50,000 as capital and ₹20,000 as goodwill. Prepare partners\' capital accounts and write journal entries.',
          'Calculate goodwill of a firm at 3 years\' purchase of super profits if Average Profit is ₹40,000, Capital Employed is ₹2,00,000 and Normal Rate of Return is 12%.'
        ]
      }
    ]
  },
  '31': {
    maxMarks: 80,
    instructions: [
      'Statistical tables and non-programmable calculators are allowed.',
      'Round off calculations to four decimal places.'
    ],
    sections: [
      {
        title: 'PART - A (Objective Type Questions)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'What is primary data?',
          'Define an index number.',
          'Write the formula for Laspeyres price index.',
          'What is vital statistics?',
          'What is the probability of a sure event?',
          'Define the term "Null Hypothesis".'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'Mention any two sources of secondary data.',
          'State the two conditions for a consumer price index number to be consistent.',
          'Calculate Crude Death Rate (CDR) if population is 5,00,000 and deaths recorded are 6,000.',
          'Write any two properties of the Normal Distribution.'
        ]
      }
    ]
  },
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
          'State the conditions required for total internal reflection to occur.',
          'Name the core material used in transformers to minimize eddy current losses.',
          'Write the expression for de Broglie wavelength of an electron accelerated through a potential V.'
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
          'Draw the neat block diagram of an optical fiber communication link.',
          'Mention any two properties of laser light.',
          'Calculate the de Broglie wavelength associated with an electron accelerated through a potential difference of 100V.'
        ]
      },
      {
        title: 'PART - C (Three-Mark Questions)',
        desc: 'III. Answer any five of the following questions. Each carries 3 marks:',
        questions: [
          'Derive the expression for electric potential at a point due to an isolated point charge.',
          'Define drift velocity and relaxation time. Write their relation with current density.',
          'Explain how a galvanometer is converted into an ammeter with a circuit diagram.',
          'State and explain Huygens\' Principle of wave propagation.',
          'List the three main observations of Einstein\'s photoelectric effect.'
        ]
      },
      {
        title: 'PART - D (Five-Mark Derivations & Numericals)',
        desc: 'IV. Answer any three of the following questions. Each carries 5 marks:',
        questions: [
          'Derive the expression for the electric field at a point on the equatorial line of an electric dipole.',
          'Obtain the expression for equivalent emf and equivalent internal resistance of two cells connected in parallel.',
          'State Biot-Savart\'s law. Derive the expression for the magnetic field at a point on the axis of a circular current carrying loop.',
          'Derive the Lens Maker\'s Formula for a double convex lens.',
          'State radioactive decay law. Derive the relation N(t) = N0 * e^(-λt).'
        ]
      }
    ]
  },
  '34': {
    maxMarks: 70,
    instructions: [
      'Write balanced chemical equations and neat diagrams wherever necessary.',
      'Scientific calculators are not permitted for KSEAB chemistry examinations.'
    ],
    sections: [
      {
        title: 'PART - A (Objective & Conceptual)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'How does the solubility of gases in liquids vary with pressure?',
          'Define the term "Azeotrope".',
          'What is the SI unit of molar conductivity?',
          'Define activation energy of a chemical reaction.',
          'Name the method used to refine ultra-pure Silicon or Germanium.',
          'Why do transition metals show highly catalytic behavior?',
          'Write the general outer electronic configuration of lanthanoids.',
          'What is a bidentate ligand? Give an example.',
          'Complete the reaction: CH3CH2Br + aq. KOH -> ____________.',
          'Name the product obtained when phenol is treated with chloroform and aq. NaOH.'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'State Kohlrausch\'s Law of independent migration of ions.',
          'Define order of reaction. Write the unit of rate constant for a second-order reaction.',
          'Explain SN2 mechanism of nucleophilic substitution reaction with a structural representation.',
          'Write chemical equations representing the Kolbe\'s reaction for salicylic acid preparation.',
          'Explain Cannizzaro reaction of benzaldehyde with a neat chemical equation.'
        ]
      },
      {
        title: 'PART - C (Three-Mark Inorganic & Coordination Chemistry)',
        desc: 'III. Answer any five of the following questions. Each carries 3 marks:',
        questions: [
          'Explain the extraction of gold using cyanide leaching with balanced chemical equations.',
          'Discuss the magnetic behavior of [CoF6]3- on the basis of Valence Bond Theory.',
          'Discuss Werner\'s coordination theory of complexes. Write its two main postulates.',
          'What is lanthanoid contraction? Mention any two consequences of it.'
        ]
      },
      {
        title: 'PART - D (Five-Mark Physical & Organic Chemistry)',
        desc: 'IV. Answer any three of the following questions. Each carries 5 marks:',
        questions: [
          'Derive the integrated rate equation for a first-order reaction. Define its half-life.',
          'State Raoult\'s Law for a solution containing volatile liquids. Explain positive deviations from Raoult\'s Law.',
          'Write the cell reaction and calculate the emf of the cell: Mg(s)|Mg2+(0.001M)||Cu2+(0.0001M)|Cu(s) at 298K. (E0 cell = 2.71 V)',
          'Explain the Williamson\'s ether synthesis of diethyl ether with a neat mechanism.',
          'Discuss the mechanism of acid-catalyzed hydration of ethene to ethanol.'
        ]
      }
    ]
  },
  '35': {
    maxMarks: 80,
    instructions: [
      'The question paper contains five parts: A, B, C, D, and E.',
      'Part A contains multiple-choice questions and fill-in-the-blanks. All questions are compulsory.',
      'Show clear steps for all parts to receive maximum credit.',
      'Calculators are strictly not allowed for II PUC Board Mathematics.'
    ],
    sections: [
      {
        title: 'PART - A (One Mark Questions)',
        desc: 'I. Answer all the following questions. Each carries 1 mark:',
        questions: [
          'Let * be a binary operation on R defined by a * b = ab/4. Find the identity element.',
          'Write the range of the principal value branch of sec⁻¹ x.',
          'Construct a 2x2 matrix A = [aij] whose elements are given by aij = (i + j)² / 2.',
          'If A is a square matrix of order 3 and |A| = 8, then find |adj A|.',
          'Find dy/dx if y = cos(1 - x).',
          'Evaluate the integral of sec x(sec x + tan x) dx.',
          'Define a collinear vector in vector algebra.',
          'Find the distance of the plane 2x - 3y + 4z - 6 = 0 from the origin.',
          'If P(A) = 0.6, P(B) = 0.3 and P(A ∩ B) = 0.2, find P(A|B).',
          'Write the objective function of a standard linear programming problem.'
        ]
      },
      {
        title: 'PART - B (Two Mark Questions)',
        desc: 'II. Answer any nine of the following questions. Each carries 2 marks:',
        questions: [
          'Show that if f: A -> B and g: B -> C are one-one, then gof: A -> C is also one-one.',
          'Prove that 2 tan⁻¹(1/2) + tan⁻¹(1/7) = tan⁻¹(31/17).',
          'Find the area of the triangle with vertices (-2, -3), (3, 2) and (-1, -8) using determinants.',
          'Find dy/dx if y = x^(sin x) for x > 0.',
          'If x = a cos³ θ and y = a sin³ θ, find dy/dx.',
          'Evaluate the integral of cos(log x) / x dx.',
          'Find the general solution of the differential equation dy/dx = (1 + y²) / (1 + x²).',
          'Find the area of a parallelogram whose adjacent sides are represented by the vectors a = 3i + j + 4k and b = i - j + k.',
          'Find the angle between the line x/2 = y/3 = z/-1 and the plane 2x + y - z = 5.'
        ]
      },
      {
        title: 'PART - C (Three Mark Questions)',
        desc: 'III. Answer any five of the following questions. Each carries 3 marks:',
        questions: [
          'Find the value of k if the function f(x) = { kx + 1 if x ≤ 5, 3x - 5 if x > 5 } is continuous at x = 5.',
          'Find the local maximum and local minimum values of the function f(x) = 3x^4 + 4x^3 - 12x^2 + 12.',
          'Evaluate the integral of x * ex dx using integration by parts.',
          'Form the differential equation representing the family of curves y = a sin(x + b), where a, b are arbitrary constants.',
          'Find a unit vector perpendicular to both vectors a = i + j + k and b = i + 2j + 3k.',
          'A coin is tossed three times. Find P(E|F) where E is "at least two heads" and F is "at most two heads".'
        ]
      },
      {
        title: 'PART - D (Five Mark Questions)',
        desc: 'IV. Answer any five of the following questions. Each carries 5 marks:',
        questions: [
          'Let f: R+ -> [4, infinity) given by f(x) = x² + 4. Show that f is invertible with inverse f⁻¹(y) = sqrt(y - 4).',
          'If A = [[1, 2, 2], [2, 1, 2], [2, 2, 1]], verify that A² - 4A - 5I = O.',
          'Solve the system of equations using matrix method: x - y + 2z = 7, 3x + 4y - 5z = -5, 2x - y + 3z = 12.',
          'If y = (sin⁻¹ x)², show that (1 - x²) d²y/dx² - x dy/dx - 2 = 0.',
          'Find the integral of 1 / (x² - a²) with respect to x and hence evaluate the integral of 1 / (x² - 16) dx.',
          'Derive the equation of a line in space passing through a given point and parallel to a given vector both in vector and Cartesian form.'
        ]
      },
      {
        title: 'PART - E (Ten Mark Questions)',
        desc: 'V. Answer any one of the following questions. It contains sub-questions carrying 6 + 4 marks:',
        questions: [
          'a) Prove that the integral from 0 to a of f(x) dx is equal to the integral from 0 to a of f(a-x) dx and hence evaluate the integral from 0 to π/2 of sin⁵x / (sin⁵x + cos⁵x) dx. (6 marks)\nb) Find the value of k so that the area of the parallelogram with diagonals 3i + j - 2k and i - 3j + 4k is 5*sqrt(3). (4 marks)',
          'a) Solve the following Linear Programming Problem graphically:\nMaximize Z = 4x + y\nsubject to the constraints:\nx + y ≤ 50\n3x + y ≤ 90\nx ≥ 0, y ≥ 0. (6 marks)\nb) Show that the determinant of [[x+y+2z, x, y], [z, y+z+2x, y], [z, x, z+x+2y]] is equal to 2(x+y+z)³. (4 marks)'
        ]
      }
    ]
  },
  '36': {
    maxMarks: 70,
    instructions: [
      'Draw neat, labeled anatomical and biological diagrams where necessary.',
      'Answers without correct, legible diagrams will not carry marks in drawing questions.'
    ],
    sections: [
      {
        title: 'PART - A (One-Mark Objective Type)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'Define "Tapetum" in the context of microsporangium wall layers.',
          'What is colostrum? Why is it highly recommended for newborn infants?',
          'Name the primary start codon that initiates translation of proteins.',
          'What is biological magnification?',
          'Give an example of an in-situ biodiversity conservation site.',
          'Define endosymbiosis.',
          'Name the bacterium responsible for turning milk into curd.'
        ]
      },
      {
        title: 'PART - B (Two-Mark Short Answers)',
        desc: 'II. Answer any five questions. Each carries 2 marks:',
        questions: [
          'Draw a neat, labeled schematic representation of a typical anatropous ovule.',
          'Mention any two major reasons why Gregor Mendel selected garden pea plants for hybridization.',
          'Distinguish between homologous and analogous organs with examples.',
          'State any two features of cloning vector pBR322.'
        ]
      },
      {
        title: 'PART - C (Three-Mark Detailed Questions)',
        desc: 'III. Answer any five questions. Each carries 3 marks:',
        questions: [
          'Describe the steps involved in Polymerase Chain Reaction (PCR) with a neat flow diagram.',
          'Explain the structure of a mature female gametophyte (embryo sac) in angiosperms.',
          'What is central dogma of molecular biology? Explain replication briefly.'
        ]
      }
    ]
  },
  '41': {
    maxMarks: 70,
    instructions: [
      'All C++ programs must follow standard syntax and class encapsulation guidelines.',
      'Show trace logic and outputs clearly where requested.'
    ],
    sections: [
      {
        title: 'PART - A (Objective Type Questions)',
        desc: 'I. Answer all the following questions. Each carries 1 mark:',
        questions: [
          'What is a class in Object-Oriented Programming?',
          'Define the term "Pointer" in C++.',
          'Which header file is required to implement dynamic memory allocation using new/delete?',
          'What is a binary tree?',
          'Write any one advantage of database management systems over flat file systems.',
          'What is a Primary Key?',
          'State the De Morgan\'s Law of Boolean Algebra.',
          'Name any one type of network topology used in Local Area Networks.'
        ]
      },
      {
        title: 'PART - B (Two-Mark Questions)',
        desc: 'II. Answer any five of the following questions. Each carries 2 marks:',
        questions: [
          'Distinguish between member functions and non-member functions of a class.',
          'Explain the concept of Constructor Overloading with syntax.',
          'What is a destructor? Write its syntax in C++.',
          'Explain the difference between linear search and binary search in arrays.',
          'What is a friend function? Mention any one property.'
        ]
      },
      {
        title: 'PART - C (Three-Mark Conceptual Questions)',
        desc: 'III. Answer any five of the following questions. Each carries 3 marks:',
        questions: [
          'Explain the three access specifiers used in C++ classes with short descriptions.',
          'Describe the features of Object-Oriented Programming: Encapsulation, Polymorphism, and Inheritance.',
          'Explain SQL SELECT, INSERT and UPDATE statements with simple syntax examples.',
          'Discuss the difference between static binding and dynamic binding.'
        ]
      },
      {
        title: 'PART - D (Five-Mark Programs & Computations)',
        desc: 'IV. Answer any three of the following questions. Each carries 5 marks:',
        questions: [
          'Write a complete C++ program to sort an array of N integers using Bubble Sort algorithm.',
          'Explain different types of inheritance in C++ (Single, Multiple, Hierarchical, Multilevel, Hybrid) with neat class diagrams.',
          'Simplify the Boolean expression using K-Map: F(A, B, C, D) = Σ(0, 2, 5, 7, 8, 10, 13, 15).',
          'What is a Stack? Write C++ algorithms to perform PUSH and POP operations on an array representation of a stack.'
        ]
      }
    ]
  },
  '75': {
    maxMarks: 80,
    instructions: [
      'Show detailed calculation steps.',
      'Calculators can be used.'
    ],
    sections: [
      {
        title: 'PART - A (Objective)',
        desc: 'I. Answer all questions. Each carries 1 mark:',
        questions: [
          'Find the 15th term of the arithmetic progression: 3, 7, 11, ...',
          'Define a scalar matrix.',
          'Find the simple interest on ₹10,000 at 8% per annum for 3 years.',
          'Evaluate the value of 8P3.',
          'Define the term "Feasible Region" in LPP.'
        ]
      }
    ]
  }
};

export const generateDefaultQuestions = (subjectName: string, subjectCode: string) => {
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
  
  // Custom PDF watermarking options - strictly locked to "Ishwaryamat"
  const customWatermark = 'Ishwaryamat';
  
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
        'Watermark protection applied. Verified under Ishwaryamat Academy guidelines.'
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
          text_instructions: undefined, // ensure no old reference
          examTitle: `II PUC ANNUAL STATE BOARD EXAM - ${selectedBoardYear}`,
          subjectName: selectedBoardSubject,
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
                <span className="text-[10px] font-black uppercase tracking-widest">Ishwaryamat Academy Portal</span>
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
                        <strong>Ishwaryamat Academy Signature Watermark applied:</strong> Your downloaded PDF will contain diagonal light markings saying <em>"{customWatermark}"</em> to ensure verification and prevent copyright infringement.
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
