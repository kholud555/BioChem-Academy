import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GradeDTO } from '../InterFace/grade-dto';


@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private BaseUrl=`http://localhost:5292/api/Grade`;
  constructor(private http:HttpClient){}
  GetAllGrade():Observable<GradeDTO[]>{
    return this.http.get<GradeDTO[]>(`${this.BaseUrl}/GetAllGrades`);


  }
  getGradeByName(name: string): Observable<GradeDTO | undefined> {
  return this.http.get<GradeDTO[]>(`${this.BaseUrl}/GetAllGrades`)
    .pipe(
      map(grades => grades.find(g => g.gradeName === name))
    );
}

  AddGrade (gradeName :string):Observable<GradeDTO>{
    return this.http.post<GradeDTO>(`${this.BaseUrl}/${gradeName}`,{});

}
UpdareGrade (grade:GradeDTO):Observable<GradeDTO>{
  return this.http.patch<GradeDTO>(`${this.BaseUrl}/Update Grade`,grade);
}
DeleteGrade (id:number):Observable<void>{
  return this.http.delete<void>(`${this.BaseUrl}/${id}`);}
private selectedGrade: GradeDTO | null = null;

setGrade(grade : GradeDTO): void {
   this.selectedGrade = grade;
   sessionStorage.setItem('selectedGrade', JSON.stringify(grade));
  }

  getGrade(): GradeDTO | null {
     if (this.selectedGrade) return this.selectedGrade;
    const stored =sessionStorage.getItem('selectedGrade');
  return stored ? JSON.parse(stored) : null;
 

  }
}