import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StudentService } from '../service/Student/student-service';
export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const studentservice = inject (StudentService);
  const token = studentservice.getToken();
  const role=studentservice.getRole();
  if (!token){
    router.navigate(['/login']);
    return false;
  }
  if (role == 'Admin'){
   // router.navigate(['/AdmenBody'])
    return true;
  }
  
  else{
  //  router.navigate(['/']);
    return false;
  }
  
};
