import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { StudentService } from '../service/Student/student-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const studentService=inject(StudentService);
  const router = Inject(Router);
  const  toastr = Inject(ToastrService);
  const token = studentService.getToken();
 
  const authRequest = token?req.clone({
    setHeaders:{
      Authorization :`Bearer ${token}`,
    },
  })
  :req;
  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastr.error('Your session has expired, please login again.', 'Unauthorized');
        studentService.clearToken();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toastr.warning('Access denied.', 'Forbidden');
        router.navigate(['/']);
      } else if (error.status === 0) {
        toastr.error('Cannot connect to server.', 'Network Error');
      }
      return throwError(() => error);
    })
  );
};