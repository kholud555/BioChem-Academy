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

  studentId: number | null = null;
studentResults:any;
  // ===== Exams =====
  exams: any[] = [];
  ExamStarted: boolean = false;
  selectedExamId: number | null = null;
  examQuestions: QuestionsOfExamDTO[] = [];
  examAnswers: { [questionId: number]: number } = {};
  selectedExamTitle: string = '';

  showResult: boolean = false;
  totalScore: number = 0;
  maxScore: number = 0;
  submitting: boolean = false;

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

    const savedStudentId = sessionStorage.getItem('studentId');
    if (savedStudentId) this.studentId = Number(savedStudentId);

    this.loadLessonMedia();
    this.loadExams();
   if (this.studentId) {
      this.loadStudentResults(this.studentId);
    }
    
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

  loadExams() {
    if (!this.SelectLesson) return;
    this.examService.getExamsByLesson(this.SelectLesson.id).subscribe({
      next: (res: any[]) => this.exams = res
    });
  }

  onDeleteMedia(mediaId: number) {
    console.log('Delete media', mediaId);
    // هنا ممكن تضيف كود الحذف من السيرفر
  }

  // ===== Exams logic =====
  startExam(examId: number, examTitle: string) {
    this.selectedExamId = examId;
    this.selectedExamTitle = examTitle;
    
    this.examAnswers = {};
    this.showResult = false;
    this.totalScore = 0;

    this.examService.getExamQuestions(examId).subscribe({
      next: (res: QuestionsOfExamDTO[]) => {
        this.examQuestions = res;
      console.log("🔥 Loaded Questions:", this.examQuestions);

        this.ExamStarted = true;
        this.maxScore = res.reduce((sum, q) => sum + q.mark, 0);
      },
      error: (err) => console.error("Failed to load exam questions", err)
    });
  }

  selectAnswer(questionId: number, choiceId: number) {
    this.examAnswers[questionId] = choiceId;
  }

  submitExam() {
    if (!this.selectedExamId || this.submitting) return;

    const answeredQuestions = Object.keys(this.examAnswers);
    if (answeredQuestions.length === 0) {
      alert('Please answer at least one question!');
      return;
    }

    this.submitting = true;
    this.totalScore = 0;

    let completedCount = 0;
    let hasError = false;

    answeredQuestions.forEach(qId => {
      const dto: SubmitExamDTO = {
        ExamId: this.selectedExamId!,
        QuestionId: Number(qId),
        // studentId: this.studentId!, 
        AnswerId: this.examAnswers[Number(qId)]
      };

      this.studentExamService.submitAnswer(dto).subscribe({
        next: (result: StudentExamDTO) => {
          this.totalScore += result.score || 0;
        },
        error: (err) => {
          console.error("Failed to submit answer for question", qId, err);
          hasError = true;
        },
        complete: () => {
          completedCount++;
          if (completedCount === answeredQuestions.length) {
            this.ExamStarted = false;
            this.showResult = true;
            this.submitting = false;
           
          }
        }
      });
    });
  }
 loadStudentResults(studentId: number) {
    this.studentExamService.getStudentResults(studentId).subscribe({
      next: (res: StudentExamResultDTO[]) => this.studentResults = res,
      error: (err) => console.error('Failed to load student results', err)
    });
  }
  closeResult() {
    this.showResult = false;

    this.examAnswers = {};
  }

  getPercentage(): number {
    if (this.maxScore === 0) return 0;
    return Math.round((this.totalScore / this.maxScore) * 100);
  }
}
