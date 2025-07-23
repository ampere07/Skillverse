export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => Promise<void>;
}

export interface Class {
  _id: string;
  name: string;
  code: string;
  teacherId: string | User;
  students: string[] | User[];
  description: string;
  createdAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface Assignment {
  _id: string;
  classId: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  dueDate: string;
  points: number;
  createdAt: string;
  submission?: Submission;
}

export interface Submission {
  _id: string;
  assignmentId: string;
  studentId: string | User;
  code: string;
  submittedAt: string;
  grade: number | null;
  feedback: string | null;
  status: 'pending' | 'graded';
  compilationStatus: 'success' | 'error' | null;
  output: string | null;
}

export interface CompileResult {
  success: boolean;
  output: string;
  error: string;
  compilationTime: number;
  executionTime: number;
  memoryUsed: number;
  status: 'success' | 'compilation_error' | 'runtime_error' | 'timeout';
}

export interface JavaTemplate {
  title: string;
  description: string;
  code: string;
}

export interface TemplateCollection {
  [key: string]: JavaTemplate;
}