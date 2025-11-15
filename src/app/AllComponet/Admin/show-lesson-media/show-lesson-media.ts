import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
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

  @ViewChildren('videoPlayer') videos!: QueryList<ElementRef<HTMLVideoElement>>;

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

    // منع كليك يمين
    document.addEventListener('contextmenu', (event) => event.preventDefault());

    this.Lesson = this.lessonService.getLesson();
    this.lessonId = this.Lesson?.id || 0;
    sessionStorage.setItem('lessonId', String(this.lessonId));

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

  // تحميل الفيديو كـ Blob للحماية
  async loadVideoAsBlob(media: LessonForMediaDTO) {
    try {
      const response = await fetch(media.previewUrl);
      const blob = await response.blob();
    
      const blobUrl = URL.createObjectURL(blob);
  console.log("Blob type:", blob.type);
      const videoEl = this.videos.find(
        v => v.nativeElement.dataset['id'] === String(media.id)
      );

      if (videoEl) {
        videoEl.nativeElement.src = blobUrl;
      }

    } catch (error) {
      console.error('Error loading video blob:', error);
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
    return false;
  }

  async onDeleteMedia(mediaId: number) {
    try {
      await this.media.deleteMedia(mediaId);
      this.lessonMedia = this.lessonMedia.filter(m => m.id !== mediaId);
      this.toast.success('Media deleted successfully', 'Deleted');
    } catch (err) {
      console.error('Error deleting media:', err);
      this.toast.error('Failed to delete media', 'Error');
    }
  }

}
