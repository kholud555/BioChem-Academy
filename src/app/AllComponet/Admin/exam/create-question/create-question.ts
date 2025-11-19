import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateQuestionChoicesDTO, ExamTypeEnum, HeaderQuestionDTO } from '../../../../InterFace/exam-dto';
import { QuestionService } from '../../../../service/question-service/question-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-question',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-question.html',
  styleUrl: './create-question.css'
})
export class CreateQuestion implements   OnInit {
  questionForm!: FormGroup;
  choiceForm!: FormGroup;
  addedQuestion: HeaderQuestionDTO | null = null;
  questions: HeaderQuestionDTO[] = [];
  examId!: number; // يتم تعيينه من create exam أو route parameter

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      questionHeader: ['', Validators.required],
      mark: [1, Validators.required],
      type: [0, Validators.required],
      examId: [this.examId]
    });

    this.choiceForm = this.fb.group({
      choiceText: ['', Validators.required],
      isCorrect: [false],
      questionId: [null]
    });
  }

  addQuestionHeader() {
    if (this.questionForm.invalid) return;
    this.questionService.addQuestionHeader(this.questionForm.value).subscribe({
      next: (res) => {
        this.addedQuestion = res;
        this.toastr.success('Question header added');
        this.choiceForm.patchValue({ questionId: res.id });
        this.questions.push(res);
        this.questionForm.reset({ mark: 1, type: 0, examId: this.examId });
      },
      error: (err) => this.toastr.error(err.error?.detail || 'Failed to add question')
    });
  }

  addChoice() {
    if (this.choiceForm.invalid) return;
    this.questionService.addQuestionChoice(this.choiceForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Choice added');
        this.choiceForm.reset({ questionId: this.addedQuestion?.id });
      },
      error: (err) => this.toastr.error(err.error?.detail || 'Failed to add choice')
    });
  }
}
