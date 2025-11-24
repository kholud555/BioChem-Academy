import { Component, OnInit, OnDestroy } from '@angular/core';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { StudentAccessedMediaDTO } from '../../../InterFace/media-dto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentExamDTO, StudentExamResultDTO, SubmitExamDTO } from '../../../InterFace/student-exam';
import { StudentService } from '../../../service/Student/student-service';
import { ExamService } from '../../../services/exam/exam-service';
import { StudentExamService } from '../../../service/student-exam';
import { QuestionsOfExamDTO } from '../../../InterFace/exam-dto';

@Component({
  selector: 'app-show-lesson-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-lesson-media.html',
  styleUrls: ['./show-lesson-media.css']
})
export class ShowLessonMedia implements OnInit, OnDestroy {
  // ===== Lesson info =====
  SelectLesson: LessonDTO | null = null;
  lessonName: string = '';
  lessonMedia: StudentAccessedMediaDTO[] = [];

  // studentId: number | null = null;
  // studentResults: StudentExamResultDTO[] = [];
  // studentSubmittedExams: number[] = [];

  // //exam
  // exams: any[] = [];
  // ExamStarted: boolean = false;
  // selectedExamId: number | null = null;
  // selectedExamTitle: string = '';
  // examQuestions: QuestionsOfExamDTO[] = [];
  // examAnswers: { [questionId: number]: number } = {};

  // showResult: boolean = false;
  // totalScore: number = 0;
  // maxScore: number = 0;
  // submitting: boolean = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private examService: ExamService,
    private studentExamService: StudentExamService
  ) {}

  ngOnInit(): void {
    document.addEventListener("keydown", this.disableKeys);

    const storedLesson = sessionStorage.getItem('selectedLesson');
    if (storedLesson) {
      this.SelectLesson = JSON.parse(storedLesson) as LessonDTO;
      this.lessonName = this.SelectLesson.title;
    }

    // const savedStudentId = sessionStorage.getItem('studentId');
    // if (savedStudentId) this.studentId = Number(savedStudentId);

    this.loadLessonMedia();
    //this.loadExams();

    // if (this.studentId) {
    //   this.loadStudentResults(this.studentId);
    // }
  }

  ngOnDestroy(): void {
    document.removeEventListener("keydown", this.disableKeys);
  }

  disableKeys = (e: KeyboardEvent) => {
    if (["F12", "s", "u"].includes(e.key.toLowerCase())) e.preventDefault();
    if (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) e.preventDefault();
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  loadLessonMedia() {
    if (!this.SelectLesson) return;
    this.studentService.getMediaByLessonForStudent(this.SelectLesson.id).subscribe({
      next: (res: StudentAccessedMediaDTO[]) => this.lessonMedia = res
    });
  }

//   loadExams() {
//     if (!this.SelectLesson) return;
//     this.examService.getExamsByLesson(this.SelectLesson.id).subscribe({
//       next: (res: any[]) => this.exams = res
//     });
//   }

//   loadStudentResults(studentId: number) {
//     this.studentExamService.getStudentResults(studentId).subscribe({
//       next: (res: StudentExamResultDTO[]) => {
//         this.studentResults = res;
//         this.studentSubmittedExams = res.map(r => r.examId);
//       },
//       error: (err) => console.error('Failed to load student results', err)
//     });
//   }

//   startExam(examId: number, examTitle: string) {
//     if (this.studentSubmittedExams.includes(examId)) {
//       alert('You have already submitted this exam.');
//       return;
//     }

//     this.selectedExamId = examId;
//     this.selectedExamTitle = examTitle;
//     this.examAnswers = {};
//     this.showResult = false;
//     this.totalScore = 0;

//     this.examService.getExamQuestions(examId).subscribe({
//       next: (res) => {
//         this.examQuestions = res;
//         this.ExamStarted = true;
       
//       },
//       error: (err) => console.error('Failed to load exam questions', err)
//     });
//   }

//   selectAnswer(questionId: number, choiceId: number) {
//     this.examAnswers[questionId] = choiceId;
//   }

//   submitExam() {
//     if (!this.selectedExamId || this.submitting) return;

//     this.submitting = true;
//     this.totalScore = 0;

//     const answerEntries = Object.entries(this.examAnswers);
//     const submitNext = (index: number) => {
//       if (index >= answerEntries.length) {
//         this.showResult = true;
//         this.ExamStarted = false;
//         this.submitting = false;
//         this.loadStudentResults(this.studentId!);
//         return;
//       }

//       const [qId, aId] = answerEntries[index];
//       const dto: SubmitExamDTO = {
//         ExamId: this.selectedExamId!,
//         QuestionId: Number(qId),
//         AnswerId: Number(aId)
//       };

//       this.studentExamService.submitAnswer(dto).subscribe({
//         next: (result) => {
//           this.totalScore += result.score;
//           submitNext(index + 1);
//         },
//         error: (err) => {
//           console.error('Failed to submit answer', err);
//           this.submitting = false;
//         }
//       });
//     };

//     submitNext(0);
//   }

//   closeResult() {
//     this.showResult = false;
//     this.examAnswers = {};
//   }

//   getPercentage(): number {
//     if (this.maxScore === 0) return 0;
//     return Math.round((this.totalScore / this.maxScore) * 100);
//   }
 }
