import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile, Register } from '../../InterFace/register';
import { Login } from '../../InterFace/login';
import { StudentDto } from '../../InterFace/student-dto';
import { FreeContentDTO, StudentAccessedMediaDTO } from '../../InterFace/media-dto';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  //http://localhost:5292/api/Student/RegisterStudent
  private BaseUrl="http://localhost:5292/api/Student";
  private UserName:string="";
 private  token=this.getToken();
  
  constructor(private http:HttpClient) {}
setLoginData(token: string, userName: string ,role:string , userId:any)  {
     sessionStorage.setItem("token",token);
   sessionStorage.setItem('userName', userName);
   sessionStorage.setItem('role', role);
   sessionStorage.setItem('userId', userId);
   
  }

 getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  clearToken() {
   sessionStorage.removeItem('token');
    
  }
 iSlogin():boolean{
      return sessionStorage.getItem("token")!=null;
    }
getUserName(): string {
    if (!this.UserName) {
      this.UserName =sessionStorage.getItem('userName') || '';
    }
    return this.UserName;
  }
getuserId(): number | null {
  if (this.getRole() === 'Student') {
    const userId = sessionStorage.getItem('userId');
    return userId ? Number(userId) : null ;
  }

  return null;
}


  
   getRole(): string | null{
  return sessionStorage.getItem("role");
   }
   

   IsAdmin():boolean{
    if (this.getRole() == 'Admin'){
      return true;
    }
    else{
      return false;
    }


   }


    private selectedStudent: StudentDto | null = null;

  setStudent(student: StudentDto) {
    this.selectedStudent = student;
  }

  getStudent(): StudentDto | null {
    return this.selectedStudent;
  }
IsStudent():boolean{
    if (this.getRole() == 'Student'){

      return true;
    }
    else{
      return false;
    }
  }
    GetStudentdIdByUserId(): Observable<number> {
      //http://localhost:5292/api/Student/GetStudentdIdByUserId
    return this.http.get<number>(`${this.BaseUrl}/GetStudentdIdByUserId`);
  }
  RegistrationStudent(RegistertionData:Register) :Observable <any>{
    return this.http.post(this.BaseUrl+"/RegisterStudent",RegistertionData);

  }


loginStudent(loginData:Login) :Observable <any>{
    return this.http.post("http://localhost:5292/api/Auth/login",loginData);

  }
  getAllStudent():Observable<StudentDto[]>{
    const url=`${this.BaseUrl}/GetAllStudents`;
    return this.http.get<StudentDto[]>(url);
  }
  getStudentProfile():Observable<any>{
     const headers={ Authorization: `Bearer ${this.token}` };

    return this.http.get(`${this.BaseUrl}/GetStudentProfile`, {headers});

  }
  UpdateStudentProfile(data:any):Observable<any>{
 const headers = {
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  };
return this.http.put(`${this.BaseUrl}/UpdateStudentProfile` , data , {headers})
  }
getMediaByLessonForStudent(lessonId: number): Observable<StudentAccessedMediaDTO[]> {
  const headers = {
    Authorization: `Bearer ${this.token}`
  };

  return this.http.get<StudentAccessedMediaDTO[]>(
    `${this.BaseUrl}/MediaAccessForStudent?lessonId=${lessonId}`,
    { headers }
  );
}

getAllFreeContent(): Observable<FreeContentDTO[]> {
    return this.http.get<FreeContentDTO[]>(`${this.BaseUrl}/GetAllFreeContent`);
  }


} 
