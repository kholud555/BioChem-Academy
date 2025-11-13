import { Component } from '@angular/core';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { LessonForMediaDTO } from '../../../InterFace/media-dto';
import { UploadService } from '../../../service/upload-service';
import { LessonService } from '../../../service/lesson-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-lesson-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-lesson-media.html',
  styleUrls: ['./show-lesson-media.css']
})
export class ShowLessonMedia {
  lessonId: number = 0;
  lessonName: string = '';
  lessonDescription: string = '';

  Lesson: LessonDTO | null = null;
  lessonMedia: LessonForMediaDTO[] = [];

  constructor(
    private media: UploadService,
    private toast: ToastrService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.Lesson = this.lessonService.getLesson();
   
    this.lessonId = this.Lesson?.id || 0;
     sessionStorage.setItem('lessonId', String(this.Lesson?.id || 0));
    this.lessonName = this.Lesson?.title || '';
    this.lessonDescription = this.Lesson?.description || '';

    this.loadLessonMedia();
  }

  async loadLessonMedia() {
    try {
      this.lessonMedia = await this.media.getLessonMedia(this.lessonId);
    } catch (err) {
      console.error('Error fetching lesson media:', err);
      this.toast.error('Failed to load media', 'Error');
    }
  }

  async onDeleteMedia(mediaId: number) {
    try {
      await this.media.deleteMedia(mediaId);
      this.lessonMedia = this.lessonMedia.filter(m => m.id !== mediaId);
      this.toast.success('Media deleted successfully ✅', 'Deleted');
    } catch (err) {
      console.error('Error deleting media:', err);
      this.toast.error('Failed to delete media', 'Error');
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
    return false;
  }

  // 🧩 التعامل مع أنواع الملفات المختلفة
  isVideo(media: LessonForMediaDTO): boolean {
    return media.mediaType.toLowerCase() === 'video';
  }

  isImage(media: LessonForMediaDTO): boolean {
    return media.mediaType.toLowerCase() === 'image';
  }

  isPdf(media: LessonForMediaDTO): boolean {
    return media.mediaType.toLowerCase() === 'pdf';
  }

  // 📂 فتح PDF في نافذة جديدة
  openPdf(media: LessonForMediaDTO) {
    window.open(media.previewUrl, '_blank');
  }
}
