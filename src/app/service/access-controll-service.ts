import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessControlDTO, StudentPermissionsDTO } from '../InterFace/access-control-dto';
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
  
  revokeAccess(dto: AccessControlDTO) {
  return this.http.request('DELETE', `${this.apiUrl}/Revoke`, { body: dto });
}


  // ✅ الحصول على صلاحيات الطالب
  getStudentPermissions(studentId: number, includeNames = false): Observable<StudentPermissionsDTO> {
    return this.http.get<StudentPermissionsDTO>(`${this.apiUrl}/student/${studentId}?IncludedNames=${includeNames}`);
  }
  
}