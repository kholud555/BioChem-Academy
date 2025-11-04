import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUnitDTO, UnitDTO } from '../InterFace/unit-dto';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
 private baseUrl=`http://localhost:5292/api/Unit`;
   constructor(private http: HttpClient) {}
 etUnitById(id: number): Observable<UnitDTO> {
    return this.http.get<UnitDTO>(`${this.baseUrl}/${id}`);
  }

  getUnitsByTerm(termId: number): Observable<UnitDTO[]> {
    return this.http.get<UnitDTO[]>(`${this.baseUrl}/GetUnitsByTerms?termId=${termId}`);
  }

  addUnit(unit: CreateUnitDTO): Observable<UnitDTO> {
    return this.http.post<UnitDTO>(`${this.baseUrl}/AddUnit`, unit);
  }

  updateUnit(unit: UnitDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/UpdateUnit`, unit);
  }
  

  deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

