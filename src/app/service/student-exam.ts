import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubmitExamDTO, StudentExamDTO, StudentExamResultDTO } from '../InterFace/student-exam';
import { StudentService } from './Student/student-service';
import { AdminStudentExamResult, ExamResultsDTO } from '../InterFace/exam-dto';


@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private baseUrl = 'http://localhost:5292/api/StudentExams';

  constructor(private http: HttpClient, private authService: StudentService) {}

  // 🔐 تجهيز الهيدر بالـ Token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

   getAllStudentResults(): Observable<AdminStudentExamResult[]> {
    return this.http.get<AdminStudentExamResult[]>(`${this.baseUrl}/GetAllStudentResults`);
  }
getStudentResultForAdmin(studentId: number): Observable<StudentExamResultDTO[]> {
  return this.http.get<StudentExamResultDTO[]>(
    `http://localhost:5292/api/StudentExams/GetStudentResultForAdmin?studentId=${studentId}`
  );
}



  // ✅ Submit Exam (Backend يستقبل سؤال واحد فقط في كل مرة)
  submitAnswer(dto: SubmitExamDTO): Observable<StudentExamDTO> {
    return this.http.post<StudentExamDTO>(this.baseUrl, dto, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get logged-in student results
  getMyResults(): Observable<StudentExamResultDTO[]> {
    return this.http.get<StudentExamResultDTO[]>(`${this.baseUrl}/myresults`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Admin: Get results of specific student
  getStudentResults(studentId: number): Observable<StudentExamResultDTO[]> {
    return this.http.get<StudentExamResultDTO[]>(`${this.baseUrl}/${studentId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Admin: Get results for a specific exam
  getExamResults(examId: number): Observable<ExamResultsDTO> {
    return this.http.get<ExamResultsDTO>(`${this.baseUrl}/exam/${examId}`, {
      headers: this.getAuthHeaders()
    });
  }



}
