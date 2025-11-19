import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExamDTO, ExamDTO, ExamDetailsDTO } from '../../InterFace/exam-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseUrl = "http://localhost:5292/api/Exam";

  constructor(private http: HttpClient) {}

  getExamsByLesson(lessonId: number): Observable<ExamDTO[]> {
    return this.http.get<ExamDTO[]>(`${this.baseUrl}/GetExamsByLessonId?lessonId=${lessonId}`);
  }

  getExamById(id: number): Observable<ExamDetailsDTO> {
    return this.http.get<ExamDetailsDTO>(`${this.baseUrl}/GetExamById?id=${id}`);
  }

  createExam(dto: CreateExamDTO): Observable<ExamDTO> {
    return this.http.post<ExamDTO>(`${this.baseUrl}/Add Exam`, dto);
  }

  updateExam(dto: ExamDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Update Exam?id=${dto.id}`, dto);
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Delete Exam?id=${id}`);
  }
   private examIdKey = 'selectedExamId';

  setExamId(examId: number): void {
    sessionStorage.setItem(this.examIdKey, examId.toString());
  }

  getExamId(): number | null {
    const stored = sessionStorage.getItem(this.examIdKey);
    return stored ? Number(stored) : null;
  }

  clearExamId(): void {
    sessionStorage.removeItem(this.examIdKey);
  }
}
