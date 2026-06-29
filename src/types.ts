export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  avatarUrl?: string;
  enrolledCourses: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface UsefulLink {
  label: string;
  url: string;
  type: 'github' | 'docs' | 'download' | 'external';
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string; // YouTube video ID or full embed URL
  description: string;
  markdownContent?: string;
  links: UsefulLink[];
  quiz?: QuizQuestion[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: 'Web Development' | 'Artificial Intelligence' | 'Data Science' | 'Computer Science';
  thumbnailUrl: string;
  instructor: {
    name: string;
    title: string;
    avatarUrl: string;
  };
  chapters: Chapter[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  totalStudents: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // List of lesson IDs completed
  quizScores: { [quizId: string]: number }; // quizId -> score %
  lastAccessedLessonId?: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}
