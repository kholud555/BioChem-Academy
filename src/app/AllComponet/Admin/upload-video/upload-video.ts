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

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-video.html',
  styleUrls: ['./upload-video.css'],
})
export class UploadVideo implements OnInit {
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];
  lessons: LessonDTO[] = [];

  selectedGradeId: number | null = null;
  selectedTermId: number | null = null;
  selectedUnitId: number | null = null;
  selectedLessonId: number | null = null;

  selectedFile: File | null = null;
  dragActive = false;
  uploadProgress = 0;
  isUploading = false;

  constructor(
    private gradeService: GradeService,
    private termService: TermService,
    private unitService: UnitService,
    private lessonService: LessonService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.loadGrades();
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
  }

  async handleUpload(): Promise<void> {
    if (!this.selectedFile || !this.selectedLessonId) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      const { presignedUrl, storageKey } = await this.uploadService.getPresignedUrl(
        this.selectedFile,
        this.getGradeName(),
        this.getTermName(),
        this.getUnitName(),
        this.selectedLessonId
      );

      await this.uploadService.uploadToR2(this.selectedFile, presignedUrl, (percent) => {
        this.uploadProgress = percent;
      });

      const mediaDto = {
        mediaType: 0,
        storageKey,
        duration: null,
        fileFormat: 0,
        lessonId: this.selectedLessonId
      };

      await this.uploadService.addMediaAfterUpload(mediaDto);

      alert('✅ تم رفع الفيديو وتسجيله بنجاح');
      this.handleRemove();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('❌ فشل في رفع أو تسجيل الفيديو');
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
    if (file?.type.startsWith('video/')) this.selectedFile = file;
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
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  getGradeName(): string {
    return this.grades.find(g => g.id === this.selectedGradeId)?.gradeName || 'Grade';
  }

  getTermName(): any {
    return this.terms.find(t => t.id === this.selectedTermId)?.termOrder|| 'Term';
  }

  getUnitName(): string {
    return this.units.find(u => u.id === this.selectedUnitId)?.title || 'Unit';
  }
}
