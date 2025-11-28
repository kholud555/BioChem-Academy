import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HomeVideoService } from '../../../service/home-video';
import {  HttpEventType } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-video.html',
  styleUrls: ['./home-video.css']
})
export class HomeVideoComponent  {
   progress = 0;
  http: any;

  constructor(private  uploadService: HomeVideoService) {}

    async upload(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('اختاري فيديو فقط');
      return;
    }

    // أولاً: نجيب الـ Presigned URL
    const presignedUrl = await this.http
      .post('http://localhost:5292/api/Media/UploadVideoForHome', null, { responseType: 'text' })
      .toPromise();

    // ثانياً: نرفع الفيديو مباشرة إلى R2
    const uploadResult = await this.uploadService.uploadFileToR2(presignedUrl!, file);

    if (uploadResult.ok) {
      alert('تم رفع الفيديو بنجاح');
    } else {
      alert('خطأ أثناء رفع الفيديو');
    }
  }
}
