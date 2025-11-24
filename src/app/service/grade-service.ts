import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreatrGradedTO, GradeDTO } from '../InterFace/grade-dto';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private BaseUrl = `http://localhost:5292/api/Grade`;

  constructor(private http: HttpClient) {}

  // ✔ Get All Grades
  GetAllGrade(): Observable<GradeDTO[]> {
    return this.http.get<GradeDTO[]>(`${this.BaseUrl}/GetAllGrades`);
  }

  // ✔ Get Grade by Name (اختياري)
  getGradeByName(name: string): Observable<GradeDTO | undefined> {
    return this.http.get<GradeDTO[]>(`${this.BaseUrl}/GetAllGrades`)
      .pipe(
        map(grades => grades.find(g => g.gradeName === name))
      );
  }

  // ✔ Add Grade (gradeName + subjectId)
 AddGrade(dto: CreatrGradedTO): Observable<GradeDTO> {
  return this.http.post<GradeDTO>(
    `${this.BaseUrl}/${dto.gradeName}?subjectId=${dto.subjectId}`,
    {}
  );
}
 getGradeBySubjectId(subjectId: number): Observable<GradeDTO[]> {
    return this.http.get<GradeDTO[]>(`${this.BaseUrl}/GetGradeBySubjectId?subjectId=${subjectId}`);
  }


  // ✔ Update Grade
  UpdareGrade(grade: GradeDTO): Observable<GradeDTO> {
    return this.http.patch<GradeDTO>(
      `${this.BaseUrl}/Update%20Grade`,
      grade
    );
  }

  // ✔ Delete Grade
  DeleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BaseUrl}/${id}`);
  }

  // ✔ Session Storage Handling
  private selectedGrade: GradeDTO | null = null;

  setGrade(grade: GradeDTO): void {
    this.selectedGrade = grade;
    sessionStorage.setItem('selectedGrade', JSON.stringify(grade));
  }

  getGrade(): GradeDTO | null {
    if (this.selectedGrade) return this.selectedGrade;

    const stored = sessionStorage.getItem('selectedGrade');
    return stored ? JSON.parse(stored) : null;
  }
}
