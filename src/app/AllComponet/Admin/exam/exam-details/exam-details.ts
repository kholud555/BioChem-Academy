import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  ExamDetailsDTO,
  QuestionsOfExamDTO,
  ChoicesOfQuestionDTO,
  ExamResultsDTO
} from '../../../../InterFace/exam-dto';

import { ExamService } from '../../../../services/exam/exam-service';
import { QuestionService } from '../../../../service/question-service/question-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StudentExamService } from '../../../../service/student-exam';

@Component({
  selector: 'app-exam-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.css'
})
export class ExamDetails implements OnInit {

  examId: number | null = null;
  examDetails: ExamDetailsDTO | null = null;
  questions: QuestionsOfExamDTO[] = [];

  loading: boolean = true;
  examResults: ExamResultsDTO | null = null;

  // Add Question Control
  showAddForm = false;
  addedQuestion: any = null;
  selectedTFAnswer: boolean | null = null;

  mcqChoices = [
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false }
  ];

  questionForm: any;

  constructor(
    private examService: ExamService,
    private router: Router,
    private location: Location,
    private questionService: QuestionService,
    private fb: FormBuilder,
  
  ) {}

  ngOnInit(): void {

    this.examId = Number(sessionStorage.getItem("examId"));

    this.questionForm = this.fb.group({
      questionHeader: [''],
      mark: [1],
      type: [0],
      examId: [this.examId]
    });

    if (!this.examId) {
      console.error("❌ No examId found in sessionStorage");
      this.loading = false;
      return;
    }

    this.loadExamDetails();
  }

  loadExamDetails() {

    this.examService.getExamById(this.examId!).subscribe({
      next: exam => {
        this.examDetails = exam;
        this.loading = false;
      }
    });

    this.examService.getExamQuestions(this.examId!).subscribe({
      next: questions => {
        this.questions = questions;
      }
    });
  }

  setTFAnswer(val: boolean) {
    this.selectedTFAnswer = val;
  }

  addQuestionHeader() {
    const dto = {
      ...this.questionForm.value,
      examId: this.examId,
      type: Number(this.questionForm.value.type)
    };

    this.questionService.addQuestionHeader(dto).subscribe(res => {

      this.addedQuestion = res;

      // TRUE / FALSE
      if (dto.type === 1) {

        let trueDto = {
          choiceText: 'True',
          isCorrect: this.selectedTFAnswer === true,
          questionId: Number(res.id)
        };

        let falseDto = {
          choiceText: 'False',
          isCorrect: this.selectedTFAnswer === false,
          questionId: Number(res.id)
        };

        this.questionService.addQuestionChoice(trueDto).subscribe(() => {
          this.questionService.addQuestionChoice(falseDto).subscribe(() => {
            this.loadExamDetails();
            this.showAddForm = false;
          });
        });

        return;
      }

      // MCQ → Show 4 choices input
    });
  }

  setCorrect(index: number) {
    this.mcqChoices.forEach((c, i) => c.isCorrect = i === index);
  }

  submitAllChoices() {
    const id = Number(this.addedQuestion.id);

    let requests = 0;

    for (let c of this.mcqChoices) {
      this.questionService.addQuestionChoice({
        choiceText: c.choiceText,
        isCorrect: c.isCorrect,
        questionId: id
      }).subscribe(() => {
        requests++;

        if (requests === 4) {
          this.loadExamDetails();
          this.resetAddForm();
        }
      });
    }
  }

  resetAddForm() {
    this.mcqChoices = [
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false }
    ];

    this.addedQuestion = null;
    this.showAddForm = false;
  }

  
  deleteQuestion(questionId: number) {
    
    this.questionService.deleteQuestion(questionId).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id!== questionId);
      }
    });
  }

  getCorrectAnswer(choices: ChoicesOfQuestionDTO[]) {
    const correct = choices?.find(c => c.isCorrect);
    return correct ? correct.choiceText : "No correct answer";
  }
 
  goBack() {
    this.location.back();
  }


  
  
}
