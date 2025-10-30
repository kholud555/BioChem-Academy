import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `http://localhost:5292/api/Media`;

  constructor(private http: HttpClient) {}

  // طلب presigned URL من السيرفر
  async getPresignedUrl(
    file: File,
    grade = 'Grade1',
    term = 'Term1',
    unit = 'Unit1',
    lessonId = 1
  ) {
    const body = {
      grade,
      term,
      unit,
      lessonId,
      fileName: file.name
    };

    // ✅ هنا التصحيح — شيل التكرار
    const res: any = await lastValueFrom(
      this.http.post(`${this.apiUrl}/presign-upload`, body)
    );

    return res;
  }

  // رفع الفيديو إلى R2 باستخدام presigned URL
  async uploadToR2(
    file: File,
    presignedUrl: string,
    onProgress: (percent: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('x-amz-content-sha256', 'UNSIGNED-PAYLOAD');
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(file);
    });
  }
}
