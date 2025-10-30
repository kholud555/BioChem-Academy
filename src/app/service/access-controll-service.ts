import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessControlDTO } from '../InterFace/access-control-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private apiUrl = 'http://localhost:5292/api/Access';

  constructor(private http: HttpClient) {}

  // ✅ منح صلاحية
  grantAccess(dto: AccessControlDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/GrantAccess`, dto);
  }

  // ✅ سحب صلاحية
  revokeAccess(dto: AccessControlDTO): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Revoke`, { body: dto });
  }

  // ✅ الحصول على صلاحيات الطالب
  getStudentPermissions(studentId: number, includeNames = false): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/${studentId}?IncludedNames=${includeNames}`);
  }
}
