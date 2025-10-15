import { Routes } from '@angular/router';
import { MainHome } from './AllComponet/home/main-home/main-home';
import { Login } from './AllComponet/login/login';
import { Signup } from './AllComponet/signup/signup';
import { Courses } from './AllComponet/courses/courses/courses';
import { UserProfile } from './AllComponet/user-profile/user-profile';
import { Adem } from './AllComponet/adem/adem';

export const routes: Routes = [
    {path:"" ,component:MainHome},
    {path:"home" ,component:MainHome},
    {path:"login" , component:Login},
    {path:"signup" , component:Signup},
    {path:"courses" , component:Courses},
     {path:"profile" , component:UserProfile},
 {path:"Adem" , component:Adem},

   
    
];
