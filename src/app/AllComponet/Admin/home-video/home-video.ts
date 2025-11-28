import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HomeVideoService } from '../../../service/home-video';
import {  HttpEventType } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-video.html',
  styleUrls: ['./home-video.css']
})
export class HomeVideoComponent  {
//constructor(private homeVideoService: HomeVideoService , private toast :ToastrService) {}

 
  constructor(private homeVideoService: HomeVideoService) {}
 
  async upload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // 1) Get presigned URL
      const url = await this.homeVideoService.getPresignedUrl().toPromise();
      console.log("Presigned URL:", url);

      // 2) Upload to R2
      const uploadRes = await this.homeVideoService.uploadFileToR2(url!, file);

      if (uploadRes.ok) {
        alert("تم رفع الفيديو بنجاح");
      } else {
        alert("حدث خطأ أثناء الرفع");
      }

    } catch (error) {
      console.error(error);
      alert("Error: " + error);
    }
  }
}