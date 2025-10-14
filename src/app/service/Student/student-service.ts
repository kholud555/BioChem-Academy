import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../../InterFace/register';
import { Login } from '../../InterFace/login';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  //http://localhost:5292/api/Student/RegisterStudent
  private BaseUrl="http://localhost:5292/api/Student";
  private UserName:string="";
  

  constructor(private http:HttpClient) {}
setLoginData(token: string, userName: string ,role:string , userId:any)  {
      localStorage.setItem("token",token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
   
  }

 getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
    
  }
 iSlogin():boolean{
      return localStorage.getItem("token")!=null;
    }
getUserName(): string {
    if (!this.UserName) {
      this.UserName = localStorage.getItem('userName') || '';
    }
    return this.UserName;
  }

  
   
  RegistrationStudent(RegistertionData:Register) :Observable <any>{
    return this.http.post(this.BaseUrl+"/RegisterStudent",RegistertionData);

  }

loginStudent(loginData:Login) :Observable <any>{
    return this.http.post("http://localhost:5292/api/Auth/login",loginData);

  }
  
} 
