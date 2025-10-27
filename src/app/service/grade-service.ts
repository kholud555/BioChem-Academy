import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  AddGrade (gradeName :string):Observable<GradeDTO>{
    return this.http.post<GradeDTO>(`${this.BaseUrl}/${gradeName}`,{});

}
UpdareGrade (grade:GradeDTO):Observable<GradeDTO>{
  return this.http.patch<GradeDTO>(`${this.BaseUrl}/Update Grade`,grade);
}
DeleteGrade (id:number):Observable<void>{
  return this.http.delete<void>(`${this.BaseUrl}/${id}`);}
}
