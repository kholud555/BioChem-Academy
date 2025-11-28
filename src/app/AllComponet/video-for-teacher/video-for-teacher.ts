import { Component, OnInit } from '@angular/core';
import { HomeVideoService } from '../../service/home-video';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-for-teacher',
  templateUrl: './video-for-teacher.html',
  styleUrls: ['./video-for-teacher.css']
})
export class VideoForTeacher implements OnInit {
  videoUrl: SafeResourceUrl | null = null;

  constructor(
    private homeVideoService: HomeVideoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
   // this.loadVideo();
  }

  // loadVideo(): void {
  //   this.homeVideoService.getVideoUrl().subscribe({
  //     next: (url: string) => {
  //       console.log('Raw Video URL:', url);
  //       // تحويل الرابط إلى SafeResourceUrl
  //       this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  //     },
  //     error: err => console.error('Failed to load video', err)
  //   });
  // }

  disableRightClick(event: MouseEvent): void {
    event.preventDefault();
  }
}
