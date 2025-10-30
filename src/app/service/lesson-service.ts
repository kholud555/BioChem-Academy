import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateLessonDTO, LessonDTO } from '../InterFace/lesson-dto';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private baseUrl = 'http://localhost:5292/api/Lessons';

  constructor(private http: HttpClient) {}

  // 🔹 Get all lessons for a specific unit
  getLessonsByUnit(unitId: number): Observable<LessonDTO[]> {
    return this.http.get<LessonDTO[]>(`${this.baseUrl}/${unitId}`);
  }

  // 🔹 Get a single lesson by ID
  getLessonById(id: number): Observable<LessonDTO> {
    return this.http.get<LessonDTO>(`${this.baseUrl}/lessons/${id}`);
  }

  // 🔹 Add new lesson
  addLesson(dto: CreateLessonDTO): Observable<LessonDTO> {
    return this.http.post<LessonDTO>(`${this.baseUrl}/lessons`, dto);
  }

  // 🔹 Update lesson
  updateLesson(dto: LessonDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/lessons/${dto.id}`, dto);
  }

  // 🔹 Delete lesson
  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lessons/${id}`);
  }
}
