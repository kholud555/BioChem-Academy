import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { UnitService } from '../../../service/unit-service';
import { LessonService } from '../../../service/lesson-service';
import { UploadService } from '../../../service/upload-service';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { UnitDTO } from '../../../InterFace/unit-dto';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { ToastrService } from 'ngx-toastr';
import { SubjectDTO } from '../../../InterFace/subject';
import { SubjectService } from '../../../service/subject';

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

  subjectName = '';
  gradeName = '';
  termName = '';
  unitName = '';

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
      next: (data) => (this.subjects = data),
      error: (err) => console.error('Error loading subjects:', err),
    });
  }

  // ------------------- تحديث الأسماء -------------------
  private updateNames(): void {
    const subject = this.subjects.find((s) => s.id === this.selectedSubjectId);
    const grade = this.grades.find((g) => g.id === this.selectedGradeId);
    const term = this.terms.find((t) => t.id === this.selectedTermId);
    const unit = this.units.find((u) => u.id === this.selectedUnitId);

    this.subjectName = subject ? subject.subjectName : '';
    this.gradeName = grade ? grade.gradeName : '';
    this.termName = term ? (term.termOrder === 0 ? 'First Term' : term.termOrder === 1 ? 'Second Term' : '') : '';
    this.unitName = unit ? unit.title : '';
  }

  // ------------------- onChange handlers -------------------
  onSubjectChange(subjectId: number | null): void {
    this.selectedSubjectId = subjectId;
    this.selectedGradeId = null;
    this.selectedTermId = null;
    this.selectedUnitId = null;
    this.selectedLessonId = null;

    this.grades = [];
    this.terms = [];
    this.units = [];
    this.lessons = [];

    if (subjectId !== null) {
      this.gradeService.getGradeBySubjectId(subjectId).subscribe(res => {
        this.grades = res;
        this.updateNames();
      });
    } else {
      this.updateNames();
    }
  }

  onGradeChange(gradeId: number | null): void {
    this.selectedGradeId = gradeId;
    this.selectedTermId = null;
    this.selectedUnitId = null;
    this.selectedLessonId = null;

    this.terms = [];
    this.units = [];
    this.lessons = [];

    if (gradeId !== null) {
      this.termService.getTermsByGrade(gradeId).subscribe(res => {
        this.terms = res;
        this.updateNames();
      });
    } else {
      this.updateNames();
    }
  }

  onTermChange(termId: number | null): void {
    this.selectedTermId = termId;
    this.selectedUnitId = null;
    this.selectedLessonId = null;

    this.units = [];
    this.lessons = [];

    if (termId !== null) {
      this.unitService.getUnitsByTerm(termId).subscribe(res => {
        this.units = res;
        this.updateNames();
      });
    } else {
      this.updateNames();
    }
  }

  onUnitChange(unitId: number | null): void {
    this.selectedUnitId = unitId;
    this.selectedLessonId = null;
    this.lessons = [];

    if (unitId !== null) {
      this.lessonService.getLessonsByUnit(unitId).subscribe(res => {
        this.lessons = res;
        this.updateNames();
      });
    } else {
      this.updateNames();
    }
  }

  onLessonChange(lessonId: number | null): void {
    this.selectedLessonId = lessonId;
  }

  // ------------------- upload logic -------------------
  async handleUpload(): Promise<void> {
    this.updateNames();

    if (!this.selectedFile || !this.selectedLessonId) {
      this.toast.error('Please choose a file and select a lesson first', 'Missing data');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      const res: any = await this.uploadService.getPresignedUrl(
        this.selectedFile,
        this.subjectName,
        this.gradeName,
        this.termName,
        this.unitName,
        this.selectedLessonId
      );

      const presignedUrl = res?.presignedUrl ?? res?.presignUrl ?? res?.url;
      const storageKey = res?.storageKey ?? res?.key;

      if (!presignedUrl || !storageKey) {
        throw new Error('Invalid presigned response from server');
      }

      await this.uploadService.uploadToR2(this.selectedFile, presignedUrl, (percent) => {
        this.uploadProgress = percent;
      });

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
}
