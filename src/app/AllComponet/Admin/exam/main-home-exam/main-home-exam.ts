import { Component } from '@angular/core';
import { CreateExam } from "../create-exam/create-exam";
import { CreateQuestion } from "../create-question/create-question";

@Component({
  selector: 'app-main-home-exam',
  imports: [CreateExam, CreateQuestion],
  templateUrl: './main-home-exam.html',
  styleUrl: './main-home-exam.css'
})
export class MainHomeExam {

}
