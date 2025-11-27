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
import { SubmitExamDTO } from '../../InterFace/student-exam';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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

  // حالة الامتحانات لكل امتحان
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
      console.log(res)
      this.mediaList = res || []; // لو رجع null أو undefined خليها مصفوفة فارغة
      if(this.mediaList.length === 0) {
        this.toast.info("لا توجد فيديوهات متاحة لهذا الدرس.");
      }
    },
    error: (err) => {
      console.error("Error loading media", err);
      this.mediaList = []; // أفرغ المصفوفة
      this.toast.error("حدث خطأ أثناء تحميل الفيديوهات، حاول لاحقًا.");
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

  startExam(examId: number, examTitle: string) {
    if (this.examStatus[examId]?.completed) {
      this.toast.info("You already completed this exam.");
      return;
    }

    this.selectedExamId = examId;
    this.selectedExamTitle = examTitle;
    this.examAnswers = {};
    this.totalScore = 0;

    this.examService.getExamQuestions(examId).subscribe({
      next: (res: QuestionsOfExamDTO[]) => {
        this.examQuestions = res;
        this.maxScore = res.reduce((sum, q) => sum + q.mark, 0);
        this.ExamStarted = true;
      },
      error: (err) => console.error("Failed to load exam questions", err)
    });
  }

  selectAnswer(questionId: number, choiceId: number) {
    this.examAnswers[questionId] = choiceId;
  }

  async submitExam() {
    if (!this.selectedExamId || !this.studentId) return;

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

    this.showResult = true;
    this.submitting = false;
    this.ExamStarted = false;

    const examId = this.selectedExamId;
    this.examStatus[examId] = {
      completed: true,
      score: this.totalScore,
      percentage: this.getPercentage()
    };
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
