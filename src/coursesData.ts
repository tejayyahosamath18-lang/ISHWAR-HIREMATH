import { Course } from './types';

export const coursesData: Course[] = [
  {
    id: 'web-dev-101',
    title: 'Modern Full-Stack React & Node.js',
    subtitle: 'Build production-ready web applications from scratch with clean architecture.',
    description: 'Learn modern React, Vite, Express, state management, and deployment with hand-crafted code examples and quizzes.',
    longDescription: 'This comprehensive program is designed to take you from a basic understanding of HTML/CSS/JS to a professional level of full-stack development. Guided by Ishwar Hiremath, you will build dynamic, accessible, and high-performance applications. We focus on modern standards, clean design patterns, and efficient server-client communication.',
    category: 'Web Development',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Intermediate',
    rating: 4.9,
    totalStudents: 1420,
    instructor: {
      name: 'Ishwar Hiremath',
      title: 'Principal Software Architect & Lead Educator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    },
    chapters: [
      {
        id: 'react-fundamentals',
        title: 'Module 1: React Fundamentals & Component Design',
        lessons: [
          {
            id: 'react-intro',
            title: '1.1 Introduction to React 19 & Vite',
            duration: '15 mins',
            videoUrl: 'Ke90Tje7VS0', // YouTube ID: React 19 Starter Guide / Free tutorial
            description: 'Learn why React remains the standard for modern interface engineering. This lesson covers Vite setup, folder structure, JSX syntax, and rendering pipelines.',
            markdownContent: `### Introduction to Modern React

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. Combined with Vite, it provides an ultra-fast developer feedback loop.

#### Key Learning Objectives:
1. Understand the Virtual DOM and declarative rendering model.
2. Initialize projects using Vite with TypeScript.
3. Master JSX syntax rules and conditional rendering patterns.
4. Set up reusable components with clean props interfaces.`,
            links: [
              { label: 'Official React Documentation', url: 'https://react.dev', type: 'docs' },
              { label: 'Vite Getting Started Guide', url: 'https://vite.dev/guide/', type: 'docs' },
              { label: 'Module GitHub Starter Code', url: 'https://github.com/facebook/react', type: 'github' }
            ],
            quiz: [
              {
                id: 'q-react-intro-1',
                question: 'What is the purpose of Vite in a modern React application?',
                options: [
                  'It manages the global state of the application.',
                  'It is a high-performance build tool and dev server that replaces Webpack.',
                  'It is a backend database connector.',
                  'It compiles React code into WebAssembly.'
                ],
                correctAnswerIndex: 1,
                explanation: 'Vite is a fast build tool and development server that uses ES modules to deliver extremely rapid hot module replacement (HMR).'
              },
              {
                id: 'q-react-intro-2',
                question: 'Which is a valid way to specify a fallback in React 19 Suspense?',
                options: [
                  'Using fallbackProp={...}',
                  'Using fallback={<Loader />}',
                  'Using loading={<Loader />}',
                  'Using onError={...}'
                ],
                correctAnswerIndex: 1,
                explanation: 'The Suspense component expects the loading placeholder in the fallback prop, e.g., <Suspense fallback={<Loader />}><Component /></Suspense>.'
              }
            ]
          },
          {
            id: 'react-state',
            title: '1.2 Advanced State Management & Custom Hooks',
            duration: '22 mins',
            videoUrl: '4fL_gP3N5g8', // State hooks
            description: 'Dive deep into the useState, useReducer, and useEffect hooks. Learn how to extract reactive logic into custom, testable hooks.',
            markdownContent: `### State Management and Side Effects

Managing UI state correctly is essential for application performance. In this lesson, we explore how to synchronize state with local storage and fetch API resources securely.

#### React State Commandments:
- **Never mutate state directly**: Always use setter functions or dispatchers.
- **Keep state local by default**: Lift state up only when siblings genuinely require coordination.
- **Cleanup effects**: Always return a cleanup function from \`useEffect\` to prevent memory leaks and redundant websocket connections.`,
            links: [
              { label: 'React Hooks API Reference', url: 'https://react.dev/reference/react/hooks', type: 'docs' },
              { label: 'Custom Hooks Guide', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks', type: 'docs' }
            ],
            quiz: [
              {
                id: 'q-react-state-1',
                question: 'Why must you return a cleanup function from a useEffect hook that creates a subscription?',
                options: [
                  'To speed up compile times.',
                  'To force the component to re-render immediately.',
                  'To prevent memory leaks and duplicate active listeners when the component unmounts.',
                  'To delete the component state permanently.'
                ],
                correctAnswerIndex: 2,
                explanation: 'Returning a cleanup function cleans up side effects (like subscriptions, intervals, or event listeners) when the component unmounts or before re-running the effect.'
              }
            ]
          }
        ]
      },
      {
        id: 'node-backend',
        title: 'Module 2: Server-Side Engineering with Express',
        lessons: [
          {
            id: 'express-routing',
            title: '2.1 Building RESTful APIs with Express',
            duration: '18 mins',
            videoUrl: 'SccSCuHh9Qs', // Express API build
            description: 'Understand the Node.js request-response cycle. Design clean route handlers, middleware pipelines, and validation systems.',
            markdownContent: `### Backend Engineering with Express.js

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

#### Best Practices for Route Structuring:
1. **Middleware Isolation**: Handle CORS, JSON parsing, logging, and error handling in specialized middlewares.
2. **Controller Pattern**: Separate HTTP-specific code (headers, status codes) from core business database queries.
3. **Strict Validation**: Always validate request parameters and bodies using standard schemas before acting on the database.`,
            links: [
              { label: 'Express.js Official Guide', url: 'https://expressjs.com', type: 'docs' },
              { label: 'Node.js Security Best Practices', url: 'https://nodejs.org/en/learn/getting-started/security-best-practices', type: 'docs' }
            ],
            quiz: [
              {
                id: 'q-express-1',
                question: 'What is Express middleware?',
                options: [
                  'A software that connects two physical servers.',
                  'Functions that have access to the request, response, and the next middleware function in the application cycle.',
                  'A visual layout engine for dashboard pages.',
                  'A database compression utility.'
                ],
                correctAnswerIndex: 1,
                explanation: 'Express middleware functions are functions that execute during the lifecycle of a request to the server, capable of modifying request/response objects, terminating requests, or calling the next middleware.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai-prompt-eng',
    title: 'Generative AI with Gemini SDK',
    subtitle: 'Harness Google’s next-generation models server-side in your Node/React applications.',
    description: 'Learn the official @google/genai TypeScript SDK. Master prompt engineering, streaming responses, structured JSON output, and AI chatbots.',
    longDescription: 'Artificial Intelligence is rewriting the rules of application logic. This course prepares you to integrate Google Gemini models directly into your systems. You will learn the mechanics of tokenization, how to enforce strict JSON schemas for structured intelligence, and how to build responsive chat completion engines, with direct architectural instruction from Ishwar Hiremath.',
    category: 'Artificial Intelligence',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Advanced',
    rating: 5.0,
    totalStudents: 980,
    instructor: {
      name: 'Ishwar Hiremath',
      title: 'Principal Software Architect & Lead Educator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    },
    chapters: [
      {
        id: 'gemini-basics',
        title: 'Module 1: Gemini SDK Basics & Content Generation',
        lessons: [
          {
            id: 'gemini-sdk-setup',
            title: '1.1 Initializing the @google/genai Client',
            duration: '14 mins',
            videoUrl: 'E6L6wZ7iM0g', // Gemini API intro
            description: 'Learn to initialize the modern Google GenAI SDK securely on the server. Implement your first text generation prompt using gemini-2.5-flash.',
            markdownContent: `### The Google GenAI SDK

This lesson introduces the state-of-the-art \`@google/genai\` package, teaching you how to authenticate requests and generate creative responses.

#### Secure Key Handling:
- **Never expose your GEMINI_API_KEY to the browser**.
- Always call the Gemini API inside backend server routes (e.g., in Express) and return the resulting text to the client.
- Securely configure environment variables using \`.env.example\` guidelines.`,
            links: [
              { label: 'Google AI Studio Docs', url: 'https://ai.google.dev', type: 'docs' },
              { label: 'Gemini API Reference', url: 'https://ai.google.dev/api', type: 'docs' }
            ],
            quiz: [
              {
                id: 'q-gemini-setup-1',
                question: 'Which of the following is the recommended server-side library for calling Gemini models?',
                options: [
                  'legacy-gemini-api',
                  '@google/genai',
                  '@google-cloud/vertexai',
                  'openai-gemini-adapter'
                ],
                correctAnswerIndex: 1,
                explanation: 'The modern client library for the Gemini Developer API is @google/genai, providing native support for modern features, types, and model aliases.'
              }
            ]
          },
          {
            id: 'structured-json',
            title: '1.2 Structured Outputs & JSON Schemas',
            duration: '20 mins',
            videoUrl: 'W9S_F_IenYg', // Structured JSON
            description: 'Enforce predictable model responses. Learn to specify precise JSON response schemas to extract clean parameters from text block inputs.',
            markdownContent: `### Structured JSON Outputs

When building real software integrations, raw text is difficult to parse. We can instruct Gemini to format its replies strictly in JSON matching a pre-defined TypeScript schema.

#### Implementing Schema Guidelines:
1. Define a JSON Schema structure representing the expected keys (e.g. name, list of steps, rating).
2. Configure the model parameters with \`responseMimeType: 'application/json'\` and supply the \`responseSchema\`.
3. Safely parse the text output with \`JSON.parse()\` in your endpoint controller.`,
            links: [
              { label: 'Structured Output Guide', url: 'https://ai.google.dev/gemini-api/docs/structured-output', type: 'docs' }
            ],
            quiz: [
              {
                id: 'q-structured-1',
                question: 'How do you force Gemini to return structured JSON data?',
                options: [
                  'By typing "GIVE ME JSON" in all-caps at the end of the prompt.',
                  'By setting responseMimeType: "application/json" and optionally supplying a responseSchema in the configuration.',
                  'By applying a regex parsing filter in your CSS file.',
                  'Gemini only returns markdown; you cannot force JSON output.'
                ],
                correctAnswerIndex: 1,
                explanation: 'By configuring responseMimeType to "application/json" and setting the responseSchema, the model generates outputs that are mathematically guaranteed to conform to the specified schema.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'data-science-pandas',
    title: 'Data Science with Python & D3.js',
    subtitle: 'Process big datasets with Python, then create breathtaking interactive web visualizations.',
    description: 'Master data analysis with Pandas, and construct fully interactive, animated SVG charts on the frontend using D3.js and Tailwind.',
    longDescription: 'Information is the new gold, but only if you can extract and communicate its meaning. This masterclass bridges Python data pipelines and interactive web-based charts. Ishwar Hiremath provides dual-environment training: cleaning raw statistics in Python Jupyter notebooks, exporting structured metrics, and bringing charts to life on the web with React and D3.',
    category: 'Data Science',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Beginner',
    rating: 4.8,
    totalStudents: 850,
    instructor: {
      name: 'Ishwar Hiremath',
      title: 'Principal Software Architect & Lead Educator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    },
    chapters: [
      {
        id: 'python-pandas-module',
        title: 'Module 1: Cleaning & Aggregating Data with Pandas',
        lessons: [
          {
            id: 'pandas-intro',
            title: '1.1 DataFrames, Series, and Data Cleansing',
            duration: '18 mins',
            videoUrl: 'vmEHCJofslg', // Pandas tutorial
            description: 'Load datasets from CSV and SQL databases. Master column queries, indexing, handling null values, and removing outliers.',
            markdownContent: `### Introduction to Pandas

Pandas is a fast, powerful, flexible, and easy-to-use open-source data analysis and manipulation tool built on top of the Python programming language.

#### Key Structures:
- **Series**: A one-dimensional labeled array capable of holding any data type.
- **DataFrame**: A two-dimensional labeled data structure with columns of potentially different types, like a spreadsheet or SQL table.`,
            links: [
              { label: 'Pandas Official Documentation', url: 'https://pandas.pydata.org/docs/', type: 'docs' },
              { label: 'Jupyter Notebook Installation', url: 'https://jupyter.org/install', type: 'docs' }
            ],
            quiz: [
              {
                id: 'q-pandas-1',
                question: 'Which Pandas function is primarily used to read data from a CSV file?',
                options: [
                  'pd.load_csv()',
                  'pd.read_csv()',
                  'pd.fetch_csv()',
                  'pd.open_csv()'
                ],
                correctAnswerIndex: 1,
                explanation: 'pd.read_csv() is the standard and highly optimized Pandas function used to parse delimited files and return a structured DataFrame.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'computer-science-dsa',
    title: 'Mastering Data Structures & Algorithms',
    subtitle: 'Cracking technical system design and technical coding interviews with elite habits.',
    description: 'Learn the underlying computer science behind linked lists, stacks, hash tables, graph traversals, and dynamic programming.',
    longDescription: 'Technical interviews demand deep analytical skills and optimal problem-solving habits. In this structured course, Ishwar Hiremath decodes elite data structure usage and algorithm analysis. We skip basic theory and jump straight into visual trace sheets, complexity calculations, and optimized algorithmic solutions in TypeScript.',
    category: 'Computer Science',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80',
    difficulty: 'Advanced',
    rating: 4.95,
    totalStudents: 1710,
    instructor: {
      name: 'Ishwar Hiremath',
      title: 'Principal Software Architect & Lead Educator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    },
    chapters: [
      {
        id: 'trees-graphs',
        title: 'Module 1: Complex Trees & Tree Traversal',
        lessons: [
          {
            id: 'binary-trees-bfs',
            title: '1.1 Binary Search Trees & BFS vs DFS',
            duration: '25 mins',
            videoUrl: 'fAAZixBzIAI', // Tree traversals BFS/DFS
            description: 'Understand tree nodes, recursive pathways, and memory allocation. Code and compare Breadth-First Search and Depth-First Search with full tracer arrays.',
            markdownContent: `### Binary Search Trees (BST)

A tree is a non-linear data structure compared to arrays and linked lists. A Binary Search Tree is a node-based binary tree data structure which has the following properties:
- The left subtree of a node contains only nodes with keys lesser than the node’s key.
- The right subtree of a node contains only nodes with keys greater than the node’s key.
- Both the left and right subtrees must also be binary search trees.

#### Traversal Complexities:
- **Time Complexity**: $O(H)$ for lookup, insertion, and deletion, where $H$ is the tree height. If unbalanced, this degrades to $O(N)$.
- **Space Complexity**: $O(H)$ due to recursion call stack size.`,
            links: [
              { label: 'Visualizing Algorithms (VisuAlgo)', url: 'https://visualgo.net/en/bst', type: 'external' },
              { label: 'GeeksforGeeks Tree Traversals', url: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-postorder/', type: 'docs' }
            ],
            quiz: [
              {
                id: 'q-bst-1',
                question: 'Which tree traversal returns the nodes of a Binary Search Tree in sorted ascending order?',
                options: [
                  'Pre-order traversal',
                  'Post-order traversal',
                  'In-order traversal',
                  'Level-order traversal (BFS)'
                ],
                correctAnswerIndex: 2,
                explanation: 'In-order traversal (Left, Root, Right) visits the tree in strictly ascending order for any valid Binary Search Tree.'
              }
            ]
          }
        ]
      }
    ]
  }
];
