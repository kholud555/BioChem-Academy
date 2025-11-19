import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { CreateTermDTO , TermDTO } from '../InterFace/term-dto';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private baseUrl=`http://localhost:5292/api/Terms`;
  private token = localStorage.getItem('token') || '';
  
  constructor(private http: HttpClient) {}


  addTerm(termData: CreateTermDTO): Observable<TermDTO> {
    return this.http.post<TermDTO>(`${this.baseUrl}/AddTerm`, termData);
  }

  // 🔹 Get terms by grade
 getTermsByGrade(gradeId: number): Observable<TermDTO[]> {
  return this.http.get<TermDTO[]>(`${this.baseUrl}/GetTermsByGrade?gradeId=${gradeId}`);
}

  getTermById(id: number): Observable<TermDTO> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.get<TermDTO>(`${this.baseUrl}/${id}`, { headers });
  }

  
  // 🔹 Update term
  updateTerm(termData:TermDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateTerm`, termData);
  }

  // 🔹 Delete term
  deleteTerm(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

 

}