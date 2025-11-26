
export interface CreateExamDTO {
  title: string;
  description?: string;
  level: number;          
  referenceId: number;
  timeLimit: number;
  isPublished: boolean;
}

export interface ExamDTO extends CreateExamDTO {
  id: number;
  createdAt: string;      
}

export interface ExamDetailsDTO extends CreateExamDTO {
  id: number;
  createdAt: string;
  studentsAttempted: number;  
  questionsCount: number;     
}

export enum ExamLevelEnum {
  Easy = 0,
  Medium = 1,
  Hard = 2
}


export interface HeaderQuestionDTO {
  id?: number;                   
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
export interface ChoicesOfQuestionDTO {
  id: number;
  choiceText: string;
  isCorrect: boolean;
  questionId: number;
}

export enum ExamTypeEnum {
  ChoiceType = 0,
  TrueFalseType = 1
}


export interface SingleAnswerDTO {
  examId: number;       
  questionId: number;   // رقم السؤال
  answerId: number;     // رقم الإجابة المختارة (أو true/false للأسئلة الصحيحة/خاطئة)
}

export interface StudentExamDTO {
  id: number;
  score: number;
  submittedAt: string; // date كـ string من API
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
}

export interface ExamResultsDTO {
  examId: number;
  ExamTitle : string;
   TotalStudents: number;
 AverageScore: number;
  HighestScore: number;
  LowestScore: number;
  StudentResults: StudentExamDTO[]; 
}

export interface PresignRequestDTO {
  grade: string;
  term: string;
  unit: string;
  lessonId: number;
  fileName: string;
}
export interface QuestionsOfExamDTO {
  id: number;
  choicesOfQuestion: ChoicesOfQuestionDTO[];
  type: ExamTypeEnum;
  mark: number;
  questionHeader: HeaderQuestionDTO
}



export interface SubmitExamDTO {
  ExamId: number;
  QuestionId: number;
  AnswerId: number;
  score?: number;  // يجب أن يكون هذا موجودًا إذا Backend يعتمد عليه
}
