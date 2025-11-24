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
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import { SubjectDTO } from '../../InterFace/subject';
import { SubjectService } from '../../service/subject';
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
subjects: SubjectDTO[] = [];
selectedTSubjecttId: number = 0;
  // Exams
  FinalResult:any;
  exams: any[] = [];
  ExamStarted: boolean = false;
  selectedExamId: number | null = null;
  examQuestions: QuestionsOfExamDTO[] = [];
  examAnswers: { [questionId: number]: number } = {};
  selectedExamTitle: string = '';
  
  // Result
  showResult: boolean = false;
  totalScore: number = 0;
  maxScore: number = 0;
  submitting: boolean = false;

  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
    private router: Router,
    private examService: ExamService,
    private studentExamService: StudentExamService,
    private location: Location,
     private subjectService :SubjectService
  ) {}

  ngOnInit(): void {
  
    document.addEventListener("keydown", this.disableKeys);

    const currentLesson = this.lessonService.getLesson();
    if (currentLesson) {
      this.SelectLesson = currentLesson;
      this.SelectedLessonId = currentLesson.id;
      sessionStorage.setItem('selectedLesson', JSON.stringify(this.SelectLesson));
      sessionStorage.setItem('selectedLessonId', this.SelectedLessonId.toString());
    } else {
      const storedLesson = sessionStorage.getItem('selectedLesson');
      const storedLessonId = sessionStorage.getItem('selectedLessonId');
      if (storedLesson) {
        this.SelectLesson = JSON.parse(storedLesson) as LessonDTO;
        this.SelectedLessonId = this.SelectLesson.id;
      } else if (storedLessonId) {
        this.SelectedLessonId = Number(storedLessonId);
      } else {
        this.router.navigate(['/courses']);
        return;
      }
    }

    const savedStudentId = sessionStorage.getItem('studentId');
    if (savedStudentId) this.studentId = Number(savedStudentId);
    else {
      this.studentId = this.studentService.getuserId();
      if (this.studentId) sessionStorage.setItem('studentId', this.studentId.toString());
    }

    this.loadMediaForLesson(this.SelectedLessonId);
    this.getExamsByLesson();
  }

  loadMediaForLesson(lessonId: number) {
    this.studentService.getMediaByLessonForStudent(lessonId).subscribe({
      next: (res) => this.mediaList = res,
      error: (err) => console.error("Error loading media", err)
    });
  }

  getExamsByLesson() {
    this.examService.getExamsByLesson(this.SelectedLessonId).subscribe({
      next: (res) => this.exams = res,
      error: (err) => console.error("Error loading exams", err)
    });
  }

  disableRightClick(event: MouseEvent) { event.preventDefault(); }

  disableKeys = (e: KeyboardEvent) => {
    if (["F12", "s", "u"].includes(e.key.toLowerCase())) e.preventDefault();
    if (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) e.preventDefault();
  }

  ngOnDestroy() { document.removeEventListener("keydown", this.disableKeys); }

  // ======================= Exam Methods =========================
  startExam(examId: number, examTitle: string) {
    this.selectedExamId = examId;
    this.selectedExamTitle = examTitle;
    this.examAnswers = {};
    this.showResult = false;
    this.totalScore = 0;

    this.examService.getExamQuestions(examId).subscribe({
      next: (res: QuestionsOfExamDTO[]) => {
        this.examQuestions = res;
        this.ExamStarted = true;
        // Calculate max score
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

    // Create array of submit requests
    const requests = answeredQuestions.map(qId => {
      const dto: SubmitExamDTO = {
        ExamId: this.selectedExamId!,
        QuestionId: Number(qId),
        AnswerId: this.examAnswers[Number(qId)]
      };
      return this.studentExamService.submitAnswer(dto);
    });

    // Send all requests and collect scores
    forkJoin(requests).subscribe({
      next: (results) => {
        // Sum all scores from responses
        this.totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
        this.ExamStarted = false;
        this.showResult = true;
        this.submitting = false;
      },
      error: (err) => {
        console.error("Failed to submit exam", err);
        this.submitting = false;
        alert('Error submitting exam. Please try again.');
      }
    });
  }

  closeResult() {

   this.location.back(); // خطوة واحدة للخلف
    this.location.back(); //
    
  }

  getPercentage(): number {
    if (this.maxScore === 0) return 0;
    return Math.round((this.totalScore / this.maxScore) * 100);
  }
}