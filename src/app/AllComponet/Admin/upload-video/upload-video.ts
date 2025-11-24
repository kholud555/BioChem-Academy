import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { UploadService } from '../../../service/upload-service';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../../../service/subject';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { SubjectDTO } from '../../../InterFace/subject';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-video.html',
  styleUrls: ['./upload-video.css'],
})
export class UploadVideo implements OnInit {
  subjects: SubjectDTO[] = [];
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];
  lessons: LessonDTO[] = [];

  selectedSubjectId: number | null = null;
  selectedGradeId: number | null = null;
  selectedTermId: number | null = null;
  selectedUnitId: number | null = null;
  selectedLessonId: number | null = null;

  selectedFile: File | null = null;
  dragActive = false;
  uploadProgress = 0;
  isUploading = false;

  constructor(
    private subjectService: SubjectService,
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private uploadService: UploadService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error('Error loading subjects:', err)
    });
  }

  onSubjectChange(subjectId: number): void {
    this.selectedSubjectId = subjectId;
    this.selectedGradeId = null;
    this.selectedTermId = null;
    this.selectedUnitId = null;
    this.selectedLessonId = null;

    this.grades = [];
    this.terms = [];
    this.units = [];
    this.lessons = [];

    if (!subjectId) return;

    this.gradeService.getGradeBySubjectId(subjectId).subscribe({
      next: res => this.grades = res,
      error: err => console.error(err)
    });
  }

  onGradeChange(gradeId: number): void {
    this.selectedGradeId = gradeId;
    this.selectedTermId = null;
    this.selectedUnitId = null;
    this.selectedLessonId = null;

    this.terms = [];
    this.units = [];
    this.lessons = [];

    if (!gradeId) return;

    this.termService.getTermsByGrade(gradeId).subscribe({
      next: res => this.terms = res,
      error: err => console.error(err)
    });
  }

  onTermChange(termId: number): void {
    this.selectedTermId = termId;
    this.selectedUnitId = null;
    this.selectedLessonId = null;

    this.units = [];
    this.lessons = [];

    if (!termId) return;

    this.unitService.getUnitsByTerm(termId).subscribe({
      next: res => this.units = res,
      error: err => console.error(err)
    });
  }

  onUnitChange(unitId: number): void {
    this.selectedUnitId = unitId;
    this.selectedLessonId = null;

    this.lessons = [];

    if (!unitId) return;

    this.lessonService.getLessonsByUnit(unitId).subscribe({
      next: res => this.lessons = res,
      error: err => console.error(err)
    });
  }

  onLessonChange(lessonId: number): void {
    this.selectedLessonId = lessonId;
  }

  // باقي الكود الخاص بالرفع مثل handleUpload و handleDrag و handleDrop ...
// ---------- upload logic ----------
  async handleUpload(): Promise<void> {
    if (!this.selectedFile || !this.selectedLessonId) {
      this.toast.error('Please choose a file and select a lesson first', 'Missing data');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      // نحصل على presigned URL من الـ backend
      const res: any = await this.uploadService.getPresignedUrl(
        this.selectedFile,
       this.getsubjectName(),
        this.getGradeName(),
        this.getTermName(),
        this.getUnitName(),
        this.selectedLessonId
      );

      // تأكد من البنية المتوقعة
      const presignedUrl = res?.presignedUrl ?? res?.presignUrl ?? res?.url;
      const storageKey = res?.storageKey ?? res?.key;

      if (!presignedUrl || !storageKey) {
        throw new Error('Invalid presigned response from server');
      }

      // نرفع الملف إلى R2 مع تحديث progress
      await this.uploadService.uploadToR2(this.selectedFile, presignedUrl, (percent) => {
        this.uploadProgress = percent;
      });

      // بعد الرفع نضيف السجل للـ DB عبر الـ service (مراعاة التوقيع الحالي في UploadService)
      // نمرر الملف (لازِم عشان detectMediaType) + storageKey + lessonId + duration (نمرر null لو مش عندنا)
      await this.uploadService.addMediaAfterUpload(this.selectedFile, storageKey, this.selectedLessonId, null);

      this.toast.success('Upload success', 'Done');
      this.handleRemove();
    } catch (error) {
      console.error('Upload failed:', error);
      this.toast.error('Upload failed', 'Error');
    } finally {
      this.isUploading = false;
    }
  }

  handleDrag(event: DragEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = type === 'enter' || type === 'over';
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    // دلوقتي نقبل الفيديو/صورة/PDF/Audio — تحقق من النوع أو اسم الامتداد إن أحببت
    this.selectedFile = file;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.selectedFile = input.files[0];
  }

  handleRemove(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  formatFileSize(bytes: number): string {
    const k = 1024,
      sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  getGradeName(): string {
    return this.grades.find((g) => g.id === this.selectedGradeId)?.gradeName || 'Grade';
  }

getsubjectName(): string {
    return this.subjects.find((s) => s.id === this.selectedSubjectId)?.subjectName || 'subject';
  }
  // رجعت string بدل any
  getTermName(): string {
  const termMap: { [key: number]: string } = {
    0: 'first term',
    1:'second term'
  };
  const term = this.terms.find(t => t.id === this.selectedTermId)?.termOrder;
  return termMap[term ?? 2] || 'term';
}

  getUnitName(): string {
    return this.units.find((u) => u.id === this.selectedUnitId)?.title || 'Unit';
  }
}

