export interface StudentDto {
     id :number,
     userName :  string ,
     email :  string,
     grade : string ,
     phoneNumber :  string ,
     parentNumber :  string
}
export interface StudentExamResultDTO {
  examId: number;
  examTitle: string;
  score: number;
  submittedAt: string; // أو Date
  maxScore: number;
}
