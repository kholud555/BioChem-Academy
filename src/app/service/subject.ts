import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectDTO } from '../InterFace/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private baseUrl = 'http://localhost:5292/api/Subject';

  constructor(private http: HttpClient) {}

  getAllSubjects(): Observable<SubjectDTO[]> {
    return this.http.get<SubjectDTO[]>(`${this.baseUrl}/GetAllSubjects`);
  }

  getSubjectById(id: number): Observable<SubjectDTO> {
    return this.http.get<SubjectDTO>(`${this.baseUrl}/${id}`);
  }

  addSubject(subjectName: string): Observable<SubjectDTO> {
    return this.http.post<SubjectDTO>(`${this.baseUrl}/AddSubject?subjectName=${subjectName}`, {});
  }

  updateSubject(dto: SubjectDTO): Observable<any> {
    return this.http.patch(`${this.baseUrl}/Update subject`, dto);
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
