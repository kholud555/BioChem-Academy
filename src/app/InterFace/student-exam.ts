// student-exam.ts

export interface SubmitExamDTO {
 ExamId: number;
  QuestionId: number;
 AnswerId: number;
 // studentId: Number, 
}

export interface StudentExamDTO {
  
  score: number;
  submittedAt: string;
  examId: number;
  studentId: number;
}

export interface StudentExamResultDTO {
 id: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt?: string;   
  examId: number;
  examTitle: string;
  examDescription: string;
  timeLimit?: number;
}



