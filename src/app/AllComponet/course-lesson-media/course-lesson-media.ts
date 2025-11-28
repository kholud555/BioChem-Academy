import { Component, OnInit, OnDestroy } from '@angular/core';
import { LessonDTO } from '../../InterFace/lesson-dto';
import { LessonService } from '../../service/lesson-service';
import { Router } from '@angular/router';
import { StudentService } from '../../service/Student/student-service';
import { StudentAccessedMediaDTO } from '../../InterFace/media-dto';
import { StudentExamService } from '../../service/student-exam';
import { ExamService } from '../../services/exam/exam-service';
import { CommonModule } from '@angular/common';
import { NavBar } from "../nav-bar/nav-bar";
import { QuestionsOfExamDTO } from '../../InterFace/exam-dto';
import { StudentExamResultDTO, SubmitExamDTO } from '../../InterFace/student-exam';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-lesson-media',
  templateUrl: './course-lesson-media.html',
  styleUrls: ['./course-lesson-media.css'],
  imports: [CommonModule, NavBar]
})
export class CourseLessonMedia implements OnInit, OnDestroy {

  SelectLesson: LessonDTO | null = null;
  SelectedLessonId: number = 0;
  studentId: number | null = 0;
  mediaList: StudentAccessedMediaDTO[] = [];

  exams: any[] = [];

  ExamStarted: boolean = false;
  selectedExamId: number | null = null;
  selectedExamTitle: string = '';

  examQuestions: QuestionsOfExamDTO[] = [];
  examAnswers: { [questionId: number]: number } = {};

  showResult: boolean = false;
  totalScore: number = 0;
  maxScore: number = 0;
  submitting: boolean = false;

  examStatus: { [key: number]: { completed: boolean, score: number | null, percentage: number | null } } = {};

  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
    private router: Router,
    private examService: ExamService,
    private studentExamService: StudentExamService,
    private location: Location,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    const currentLesson = this.lessonService.getLesson();
    if (currentLesson) {
      this.SelectLesson = currentLesson;
      this.SelectedLessonId = currentLesson.id;
      sessionStorage.setItem('selectedLesson', JSON.stringify(this.SelectLesson));
      sessionStorage.setItem('selectedLessonId', this.SelectedLessonId.toString());
    }

    const savedStudentId = sessionStorage.getItem('studentId');
    this.studentId = savedStudentId ? Number(savedStudentId) : this.studentService.getuserId();

    this.getExamsByLesson();
    this.loadMediaForLesson(this.SelectedLessonId);
  }

  ngOnDestroy() {}

  loadMediaForLesson(lessonId: number) {
    this.studentService.getMediaByLessonForStudent(lessonId).subscribe({
      next: (res) => {
        this.mediaList = res || [];
        if(this.mediaList.length === 0) {
          this.toast.info("لا توجد فيديوهات متاحة لهذا الدرس.");
        }
      },
      error: (err) => {
        console.error("Error loading media", err);
        this.mediaList = [];
      }
    });
  }

  getExamsByLesson() {
    this.examService.getExamsByLesson(this.SelectedLessonId).subscribe({
      next: (res) => {
        this.exams = res;
        this.exams.forEach(exam => {
          this.examStatus[exam.id] = { completed: false, score: null, percentage: null };
        });
      },
      error: (err) => console.error("Error loading exams", err)
    });
  }

  // ✅ تحقق من الامتحان مسبقاً باستخدام localStorage ثم الباك
  checkExamBeforeStart(examId: number, examTitle: string) {
    if (!this.studentId) return;

    // تحقق من localStorage أولاً
    const completedExams = JSON.parse(localStorage.getItem('completedExams') || '{}');
    if (completedExams[examId]) {
      const result = completedExams[examId];
      this.toast.info("You already completed this exam (LocalStorage).");
      this.examStatus[examId] = {
        completed: true,
        score: result.score,
        percentage: result.percentage
      };
      this.selectedExamId = examId;
      this.selectedExamTitle = examTitle;
      this.totalScore = result.score;
      this.maxScore = result.maxScore;
      this.showResult = true;
      this.ExamStarted = false;
      return;
    }

    // إذا لم يوجد في localStorage، تحقق من الباك
    this.studentExamService.getMyResults().subscribe({
      next: (res: StudentExamResultDTO[]) => {
        const existingResult = res.find(r => r.examId === examId);

        if (existingResult) {
          this.toast.info("You already completed this exam.");
          this.examStatus[examId] = {
            completed: true,
            score: existingResult.score,
            percentage: Math.round((existingResult.score / existingResult.totalQuestions) * 100)
          };

          this.selectedExamId = examId;
          this.selectedExamTitle = examTitle;
          this.totalScore = existingResult.score;
          this.maxScore = existingResult.totalQuestions;
          this.showResult = true;
          this.ExamStarted = false;

          // حفظ في localStorage
          completedExams[examId] = {
            score: existingResult.score,
            percentage: Math.round((existingResult.score / existingResult.totalQuestions) * 100),
            maxScore: existingResult.totalQuestions
          };
          localStorage.setItem('completedExams', JSON.stringify(completedExams));

        } else {
          this.startExam(examId, examTitle);
        }
      },
      error: (err) => {
        console.error("Error fetching student results", err);
        this.startExam(examId, examTitle);
      }
    });
  }

  startExam(examId: number, examTitle: string) {
    if (this.examStatus[examId]?.completed) return;

    this.selectedExamId = examId;
    this.selectedExamTitle = examTitle;
    this.examAnswers = {};
    this.totalScore = 0;

    this.examService.getExamQuestions(examId).subscribe({
      next: (res: QuestionsOfExamDTO[]) => {
        this.examQuestions = res;
        this.maxScore = res.reduce((sum, q) => sum + q.mark, 0);
        this.ExamStarted = true;
        this.showResult = false;
      },
      error: (err) => console.error("Failed to load exam questions", err)
    });
  }

  selectAnswer(questionId: number, choiceId: number) {
    this.examAnswers[questionId] = choiceId;
  }

  async submitExam() {
    if (!this.selectedExamId || !this.studentId) return;

    // تحقق صارم لمنع إعادة الإرسال
    if (this.examStatus[this.selectedExamId]?.completed) {
      this.toast.info("You already submitted this exam.");
      return;
    }

    this.submitting = true;
    this.totalScore = 0;

    for (const qId of Object.keys(this.examAnswers)) {
      const dto: SubmitExamDTO = {
        ExamId: this.selectedExamId,
        QuestionId: Number(qId),
        AnswerId: this.examAnswers[Number(qId)]
      };

      try {
        const res = await this.studentExamService.submitAnswer(dto).toPromise();
        this.totalScore += res?.score || 0;
      } catch (err) {
        this.toast.error("Error submitting answers.");
        this.submitting = false;
        return;
      }
    }

    const examId = this.selectedExamId;
    this.examStatus[examId] = {
      completed: true,
      score: this.totalScore,
      percentage: this.getPercentage()
    };

    // حفظ النتيجة في localStorage
    const completedExams = JSON.parse(localStorage.getItem('completedExams') || '{}');
    completedExams[examId] = {
      score: this.totalScore,
      percentage: this.getPercentage(),
      maxScore: this.maxScore
    };
    localStorage.setItem('completedExams', JSON.stringify(completedExams));

    this.showResult = true;
    this.submitting = false;
    this.ExamStarted = false;
  }

  getPercentage(): number {
    if (this.maxScore === 0) return 0;
    return Math.round((this.totalScore / this.maxScore) * 100);
  }

  goBack() {
    this.location.back();
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
