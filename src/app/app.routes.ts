import { Routes } from '@angular/router';
import { MainHome } from './AllComponet/home/main-home/main-home';
import { Login } from './AllComponet/login/login';
import { Signup } from './AllComponet/signup/signup';

import { UserProfile } from './AllComponet/user-profile/user-profile';
import { Student } from './AllComponet/Admin/student/student';


import { Body } from './AllComponet/Admin/body/body';
import { Grade } from './AllComponet/Admin/grade/grade';
import { Term } from './AllComponet/Admin/term/term';
import { Unit } from './AllComponet/Admin/unit/unit';
import { Lesson } from './AllComponet/Admin/lesson/lesson';
import { authGuard } from './Guard/auth-guard';
import { GetllStudents } from './AllComponet/Admin/getll-students/getll-students';
import { AccessControl } from './AllComponet/Admin/access-control/access-control';




import { CourseContent } from './AllComponet/Admin/course-content/course-content';
import { GetAllTermsForGrade } from './AllComponet/Admin/get-all-terms-for-grade/get-all-terms-for-grade';
import { ShowLessonMedia } from './AllComponet/Admin/show-lesson-media/show-lesson-media';
import { UploadVideo } from './AllComponet/Admin/upload-video/upload-video';
import { Courses } from './AllComponet/courses/courses';


export const routes: Routes = [
    {path:"" ,component:MainHome},
    {path:"home" ,component:MainHome},
    {path:"login" , component:Login},
    {path:"signup" , component:Signup},
    {path:"courses" , component:Courses},
    {path:"upload-video",component:UploadVideo },
    
     {path:"profile" , component:UserProfile},
 
{path:"AdmenBody",component:Body,
    canActivate:[authGuard],
    children:[
        { path: '', redirectTo: 'GetAllStudent', pathMatch: 'full' },
{path:"UploadVideo" , component:UploadVideo},
 {path:"student",component:Student},
 {path:"grade",component:Grade},
  {path:"term",component:Term},
   {path:"unit",component:Unit},
    {path:"lesson",component:Lesson},
    {path:"GetAllStudent" , component:GetllStudents},
     {path:"AccessControl" , component:AccessControl},
      {path:"Courses" , component:CourseContent},
     {path:"get-all-terms-for-grade" , component:GetAllTermsForGrade},
     {path:"ShowLessonMedia" ,component:ShowLessonMedia}

]
}
    
];
