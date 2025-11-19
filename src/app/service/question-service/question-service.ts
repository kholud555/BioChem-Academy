import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateQuestionChoicesDTO, HeaderQuestionDTO, QuestionChoicesDTO, QuestionDTO } from '../../InterFace/exam-dto';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private baseUrl = 'http://localhost:5292/api/Question';

  constructor(private http: HttpClient) { }

  // ✅ Get question by ID
  getQuestionById(id: number): Observable<QuestionDTO> {
    return this.http.get<QuestionDTO>(`${this.baseUrl}/GetQuestionById?id=${id}`);
  }

  // ✅ Add question header
  addQuestionHeader(dto: HeaderQuestionDTO): Observable<HeaderQuestionDTO> {
    return this.http.post<HeaderQuestionDTO>(`${this.baseUrl}/AddQuestionHeader`, dto);
  }

  // ✅ Add question choice
  addQuestionChoice(dto: CreateQuestionChoicesDTO): Observable<QuestionChoicesDTO> {
    return this.http.post<QuestionChoicesDTO>(`${this.baseUrl}/AddQuestionChoice`, dto);
  }

  // ✅ Update question header
  updateQuestionHeader(dto: QuestionDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/UpdateQuestionHeader`, dto);
  }

  // ✅ Update question choice
  updateQuestionChoice(dto: QuestionChoicesDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/UpdateQuestionChoice`, dto);
  }

  // ✅ Delete question
  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
