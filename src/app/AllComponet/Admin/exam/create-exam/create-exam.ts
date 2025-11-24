import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import {
  CreateExamDTO,
  ExamLevelEnum,
  HeaderQuestionDTO,
  CreateQuestionChoicesDTO,
  ExamTypeEnum,
  ExamDTO,
  QuestionsOfExamDTO
} from '../../../../InterFace/exam-dto';
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
import { Observable } from 'rxjs';
import { StudentExamResultDTO } from '../../../../InterFace/student-exam';
import { StudentExamService } from '../../../../service/student-exam';
import { SubjectDTO } from '../../../../InterFace/subject';
import { SubjectService } from '../../../../service/subject';

@Component({
  selector: 'app-create-exam',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './create-exam.html',
  styleUrls: ['./create-exam.css']
})
export class CreateExam implements OnInit {
  examForm!: FormGroup;
  levels = ExamLevelEnum;
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];
  lessons: LessonDTO[] = [];
  exams: ExamDTO[] = [];
  exsms: any;
  questionForm!: FormGroup;
  choiceForm!: FormGroup;
  addedQuestion: HeaderQuestionDTO | null = null;
  questions: HeaderQuestionDTO[] = [];
subjects: SubjectDTO[] = [];
 selectedSubjectId: number = 0;

  selectedGradeId: number =0;
  selectedTermId: number | null = null;
  selectedUnitId: number | null = null;
  selectedLessonId: number | null = null;
  createdExamId: number | null = null;
  showCreate: boolean = false;
  showExams: boolean = false;

  // MCQ choices array
  mcqChoices: { choiceText: string; isCorrect: boolean }[] = [
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false },
    { choiceText: '', isCorrect: false }
  ];

  constructor(
      private studentService:StudentExamService,
    private router: Router,
    private fb: FormBuilder,
    private examService: ExamService,
    private toastr: ToastrService,
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private questionService: QuestionService,
    private StudentExam:StudentExamService,
      private subjectService :SubjectService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
   
   
    this.getExamsByLesson();

    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      level: [3],
      referenceId: [{ value: this.selectedLessonId, disabled: true }],
      timeLimit: [30],
      isPublished: [false],
    });

    this.questionForm = this.fb.group({
      questionHeader: ['', Validators.required],
      mark: [1, Validators.required],
      type: [0, Validators.required],  // 0=Choice, 1=True/False
      examId: [null, Validators.required],
    });

    // ===================== CHOICE FORM (kept for single addChoice usage) =====================
    this.choiceForm = this.fb.group({
      choiceText: ['', Validators.required],
      isCorrect: [false],
      questionId: [null, Validators.required],
    });


  }
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data
    });
  }

 // عند تغيير المادة
onSubjectChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  this.selectedSubjectId = Number(select.value);

  // إعادة تعيين القيم
  this.grades = [];
  this.terms = [];
  this.units = [];
  this.lessons = [];

  this.selectedGradeId = 0;
  this.selectedTermId = null;
  this.selectedUnitId = null;
  this.selectedLessonId = null;

  if (this.selectedSubjectId) {
    this.gradeService.getGradeBySubjectId(this.selectedSubjectId).subscribe({
      next: (res) => {
        this.grades = res;
        if (this.grades.length === 0) {
          this.toastr.info('No grades found for this subject');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.info('Failed to load grades');
      }
    });
  }
}

// عند تغيير الصف
onGradeChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  this.selectedGradeId = Number(select.value);

  // إعادة تعيين القيم
  this.terms = [];
  this.units = [];
  this.lessons = [];

  this.selectedTermId = null;
  this.selectedUnitId = null;
  this.selectedLessonId = null;

  if (this.selectedGradeId) {
    this.termService.getTermsByGrade(this.selectedGradeId).subscribe({
      next: (res) => this.terms = res,
      error: (err) => {
        console.error(err);
        //this.toastr.error('Failed to load terms for selected grade');
     
      }
    });
  }
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
   deleteExam(id: number) {
   
    this.examService.deleteExam(id).subscribe({
      next: () => {
        this.toastr.success('Exam deleted successfully');
        this.exams = this.exams.filter(e => e.id !== id);
      },
      error: (err) => this.toastr.error('Failed to delete exam' )
    });
  }

  // ========== Exam CRUD ==========
  createExam() {
    if (this.examForm.invalid) {
      this.toastr.info('Please fill all required fields correctly');
      return;
    }

    const dto: CreateExamDTO = {
      ...this.examForm.getRawValue()
    };

    this.examService.createExam(dto).subscribe({
      next: (res) => {
        this.toastr.success('Exam created successfully!');
        this.createdExamId = res.id;
        this.questionForm.patchValue({ examId: this.createdExamId });
        this.examForm.reset({ level: 0, timeLimit: 30, isPublished: false });
      },
      error: (err) => this.toastr.error(err.error?.detail || 'Failed to create exam')
    });
  }

  // ========== Question ==========
  addQuestionHeader() {
    if (this.questionForm.invalid || !this.createdExamId) {
      this.toastr.error('Please create an exam first!');
      return;
    }

    const questionData = {
      ...this.questionForm.value,
      type: Number(this.questionForm.value.type)
    };

    this.questionService.addQuestionHeader(questionData).subscribe({
      next: (res) => {
        this.addedQuestion = res;
        this.toastr.success('Question header added');

       if (questionData.type === ExamTypeEnum.TrueFalseType) {

  if (this.selectedTFAnswer === null) {
    this.toastr.error("Please select the correct answer (True or False)");
    return;
  }

  const trueChoice: CreateQuestionChoicesDTO = {
    choiceText: 'True',
    isCorrect: this.selectedTFAnswer === true,
    questionId: res.id!
  };

  const falseChoice: CreateQuestionChoicesDTO = {
    choiceText: 'False',
    isCorrect: this.selectedTFAnswer === false,
    questionId: res.id!
  };

  this.questionService.addQuestionChoice(trueChoice).subscribe();
  this.questionService.addQuestionChoice(falseChoice).subscribe();

  this.selectedTFAnswer = null; // reset
}


        // Reset mcqChoices when a new question is added
        this.mcqChoices = [
          { choiceText: '', isCorrect: false },
          { choiceText: '', isCorrect: false },
          { choiceText: '', isCorrect: false },
          { choiceText: '', isCorrect: false }
        ];

        this.choiceForm.patchValue({ questionId: res.id });
        this.questions.push(res);
        this.questionForm.reset({ mark: 1, type: 0, examId: this.createdExamId });
      },
      error: (err) => this.toastr.error(err.error?.detail || 'Failed to add question')
    });
  }
// component.ts


  // Existing single-choice add (kept for compatibility)
  addChoice() {
    if (this.choiceForm.invalid || !this.addedQuestion) return;

    this.questionService.addQuestionChoice(this.choiceForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Choice added');
        this.choiceForm.reset({ questionId: this.addedQuestion?.id });
      },
      error: (err) => this.toastr.error(err.error?.detail || 'Failed to add choice')
    });
  }
  selectedTFAnswer: boolean | null = null;

setTFAnswer(value: boolean) {
  this.selectedTFAnswer = value;
}


  // ========== MCQ helpers ==========
  setCorrect(index: number) {
    this.mcqChoices.forEach((c, i) => c.isCorrect = i === index);
  }

  submitAllChoices() {
    if (!this.addedQuestion) {
      this.toastr.error("Please add a question first!");
      return;
    }

    // Validate 4 choices
    if (this.mcqChoices.some(c => !c.choiceText || !c.choiceText.trim())) {
      this.toastr.error("All 4 choices must be filled!");
      return;
    }

    // Validate at least ONE correct
    const hasCorrect = this.mcqChoices.some(c => c.isCorrect);
    if (!hasCorrect) {
      this.toastr.error("Please select a correct answer!");
      return;
    }

    // Send choices to backend (sequentially or in parallel)
    const created: Observable<any>[] = [];
    for (const choice of this.mcqChoices) {
      const dto: CreateQuestionChoicesDTO = {
        choiceText: choice.choiceText,
        isCorrect: choice.isCorrect,
        questionId: this.addedQuestion.id!
      };
      created.push(this.questionService.addQuestionChoice(dto));
    }

    // subscribe to all and show success after all complete
    // simple approach: subscribe to each and show success once loop done
    // (for a more robust approach use forkJoin)
    let completed = 0;
    const total = created.length;
    created.forEach(obs =>
      obs.subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.toastr.success("All 4 choices saved successfully!");
            // Reset
            this.mcqChoices = [
              { choiceText: '', isCorrect: false },
              { choiceText: '', isCorrect: false },
              { choiceText: '', isCorrect: false },
              { choiceText: '', isCorrect: false }
            ];
            this.addedQuestion = null; // hide choices box
          }
        },
        error: (err) => {
          console.error('Error saving choice', err);
          this.toastr.error('Error saving choices');
        }
      })
    );
  }

 
  getExamsByLesson() {
    if (!this.selectedLessonId) {
     
      this.exams = [];
      return;
    }

    this.examService.getExamsByLesson(this.selectedLessonId).subscribe({
      next: (res) => {
        this.exams = res;
        this.showExams = true;
        this.showCreate = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("No Exams in this lesson");
      }
    });
  }

  // Toggle helpers
  toggleCreate() {
    this.showCreate = true;
    this.showExams = false;
  }

  toggleExams() {
    this.showCreate = false;
    this.showExams = true;
    this.getExamsByLesson();
  }
viewExamDetails(examId: number) {
   sessionStorage.setItem("examId", examId.toString());
   this.router.navigate(['/AdmenBody/examDetails'])
}


}
