// ==========================================
// Exam DTOs
// ==========================================

export interface CreateExamDTO {
  title: string;
  description?: string;
  level: number;          // استخدمي نفس enum
  referenceId: number;
  timeLimit: number;
  isPublished: boolean;
}

export interface ExamDTO extends CreateExamDTO {
  id: number;
  createdAt: string;      // ISO string
}

export interface ExamDetailsDTO extends CreateExamDTO {
  id: number;
  createdAt: string;
  studentsAttempted: number;  // camelCase مطابق للـ API
  questionsCount: number;     // camelCase مطابق للـ API
}

// ==========================================
// Exam Level Enum
// ==========================================
export enum ExamLevelEnum {
  Easy = 0,
  Medium = 1,
  Hard = 2
}

// ==========================================
// Question DTOs
// ==========================================

// لإنشاء سؤال جديد (header)
export interface HeaderQuestionDTO {
  id?: number;                   // اختياري عند الإنشاء
  questionHeader: string;
  mark: number;
  type: ExamTypeEnum;
  examId: number;
}

// لإنشاء أو تعديل خيار للسؤال
export interface CreateQuestionChoicesDTO {
  choiceText: string;
  isCorrect: boolean;
  questionId: number;
}

// DTO لتعديل خيار موجود
export interface QuestionChoicesDTO extends CreateQuestionChoicesDTO {
  id: number;
}

// DTO لتعديل أو عرض سؤال موجود
export interface QuestionDTO extends HeaderQuestionDTO {
  id?: number;
}

// ==========================================
// ExamTypeEnum
// ==========================================
export enum ExamTypeEnum {
  ChoiceType = 0,
  TrueFalseType = 1
}


export interface PresignRequestDTO {
  grade: string;
  term: string;
  unit: string;
  lessonId: number;
  fileName: string;
}
