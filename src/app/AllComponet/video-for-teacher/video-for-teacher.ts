import { Component, OnInit } from '@angular/core';
import { HomeVideoService } from '../../service/home-video';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-for-teacher',
  templateUrl: './video-for-teacher.html',
  imports:[CommonModule],
  styleUrls: ['./video-for-teacher.css']
})
export class VideoForTeacher implements OnInit {
  

  constructor(
    private homeVideoService: HomeVideoService,
    private sanitizer: DomSanitizer
  ) {}
videoUrl: SafeResourceUrl | null = null;

ngOnInit() {
  this.homeVideoService.getHomeVideoUrl().subscribe({
    next: (url) => {
      // تجاوز سياسة أمان Angular
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log("Video URL:", url); // جرب الرابط هنا
    },
    error: (err) => console.error("Failed to load video:", err)
  });
}
}