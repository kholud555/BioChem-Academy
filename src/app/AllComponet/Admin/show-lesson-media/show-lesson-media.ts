import { Component, OnInit, OnDestroy } from '@angular/core';
import { LessonDTO } from '../../../InterFace/lesson-dto';
import { StudentAccessedMediaDTO } from '../../../InterFace/media-dto';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../service/upload-service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-show-lesson-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-lesson-media.html',
  styleUrls: ['./show-lesson-media.css']
})
export class ShowLessonMedia implements OnInit, OnDestroy {

  SelectLesson: LessonDTO | null = null;
  lessonName: string | null = null;
  lessonMedia: StudentAccessedMediaDTO[] = [];

  constructor(private uploadService: UploadService  ,  private location: Location,) {}

  ngOnInit(): void {
    document.addEventListener("keydown", this.disableKeys);

    const storedLesson = sessionStorage.getItem('selectedLesson');
   // console.log("STORED LESSON:", storedLesson);

    if (storedLesson) {
      this.SelectLesson = JSON.parse(storedLesson);
      this.lessonName = this.SelectLesson?.title ?? null;
    }

    this.loadLessonMedia();
  }

  ngOnDestroy(): void {
    document.removeEventListener("keydown", this.disableKeys);
  }

  goBack() {
    this.location.back();
  }


  disableKeys = (e: KeyboardEvent) => {
    if (["f12", "s", "u"].includes(e.key.toLowerCase())) e.preventDefault();
    if (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) e.preventDefault();
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

 
  async loadLessonMedia() {
    if (!this.SelectLesson) return;

    try {
      const res = await this.uploadService.getLessonMedia(this.SelectLesson.id);
      //console.log("ADMIN MEDIA (Promise):", res);
     
     
      this.lessonMedia = res as unknown as StudentAccessedMediaDTO[];
    } catch (err) {
      console.error('Failed to load lesson media', err);
    }
  }
}
