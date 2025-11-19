import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateExamDTO, ExamLevelEnum, HeaderQuestionDTO } from '../../../../InterFace/exam-dto';
import { ExamService } from '../../../../services/exam/exam-service';
import { ToastrService } from 'ngx-toastr';
import { GradeDTO } from '../../../../InterFace/grade-dto';
import { TermDTO } from '../../../../InterFace/term-dto';
import { UnitDTO } from '../../../../InterFace/unit-dto';
import { LessonDTO } from '../../../../InterFace/lesson-dto';
import { TermService } from '../../../../service/term-service';
import { GradeService } from '../../../../service/grade-service';
import { LessonService } from '../../../../service/lesson-service';
import { UnitService } from '../../../../service/unit-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionService } from '../../../../service/question-service/question-service';

@Component({
  selector: 'app-create-exam',
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './create-exam.html',
  styleUrl: './create-exam.css'
})
export class CreateExam implements OnInit {
  examForm!: FormGroup;
  levels = ExamLevelEnum;
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];
  lessons: LessonDTO[] = [];


  questionForm!: FormGroup;
  choiceForm!: FormGroup;
  addedQuestion: HeaderQuestionDTO | null = null;
  questions: HeaderQuestionDTO[] = [];
 
  selectedGradeId: number | null = null;
  selectedTermId: number | null = null;
  selectedUnitId: number | null = null;
  selectedLessonId: number | null = null;
  createdExamId :number | null =null;

  constructor(
    private router: Router,  
    private fb: FormBuilder,
    private examService: ExamService,
    private toastr: ToastrService,
     private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
      private questionService: QuestionService,
  ) {}

  ngOnInit(): void {
    this.loadGrades(),
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      level: [0, Validators.required],
      referenceId: [this.selectedLessonId],
     
      timeLimit: [30],
      isPublished: [false],
      
    });

    this.questionForm = this.fb.group({
      questionHeader: ['', Validators.required],
      mark: [1, Validators.required],
      type: [0, Validators.required],
      examId: [this.createdExamId]
    });

    this.choiceForm = this.fb.group({
      choiceText: ['', Validators.required],
      isCorrect: [false],
      questionId: [null]
    });
  }
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: (res) => (this.grades = res),
      error: (err) => console.error('Error loading grades:', err),
    });
  }

  onGradeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedGradeId = Number(select.value);
    this.terms = [];
    this.termService.getTermsByGrade(this.selectedGradeId!).subscribe({
      next: (res) => (this.terms = res),
    });
  }

  onTermChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedTermId = Number(select.value);
    this.units = [];
    this.unitService.getUnitsByTerm(this.selectedTermId!).subscribe({
      next: (res) => (this.units = res),
    });
  }

  onUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedUnitId = Number(select.value);
    this.lessons = [];
    this.lessonService.getLessonsByUnit(this.selectedUnitId!).subscribe({
      next: (res) => (this.lessons = res),
    });
  }

  onLessonChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedLessonId = Number(select.value);
     this.examForm.patchValue({ referenceId: this.selectedLessonId });
  }

//EXAM
  createExam() {
    if (this.examForm.invalid) {
      this.toastr.error('Please fill all required fields correctly');
      return;
    }

    const dto: CreateExamDTO = this.examForm.value;
    this.examService.createExam(dto).subscribe({
      next: (res) => {
        this.toastr.success('Exam created successfully!');
        this.examForm.reset({ level: 0, timeLimit: 30, isPublished: false });
        this.examService.setExamId(this.createdExamId!);
      },
      error: (err) => {
        this.toastr.error(err.error?.detail || 'Failed to create exam');
      }
    });
  }
  goToQuestion() {
  // مجرد تحويل للراوتر لصفحة CreateQuestion
  this.router.navigate(['AdmenBody/create-question']);
}


  addQuestionHeader() {
    if (this.questionForm.invalid) return;
    this.questionService.addQuestionHeader(this.questionForm.value).subscribe({
      next: (res) => {
        this.addedQuestion = res;
        this.toastr.success('Question header added');
        this.choiceForm.patchValue({ questionId: res.id });
        this.questions.push(res);
        this.questionForm.reset({ mark: 1, type: 0, examId: this.createdExamId});
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

