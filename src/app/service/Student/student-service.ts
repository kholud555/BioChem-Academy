import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile, Register } from '../../InterFace/register';
import { Login } from '../../InterFace/login';

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


    
IsStudent():boolean{
    if (this.getRole() == 'Student'){
      return true;
    }
    else{
      return false;
    }
  }
  RegistrationStudent(RegistertionData:Register) :Observable <any>{
    return this.http.post(this.BaseUrl+"/RegisterStudent",RegistertionData);

  }


loginStudent(loginData:Login) :Observable <any>{
    return this.http.post("http://localhost:5292/api/Auth/login",loginData);

  }
  getAllStudent():Observable<any[]>{
    const url=`${this.BaseUrl}/GetAllStudents`;
    return this.http.get<any[]>(url);
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
} 
