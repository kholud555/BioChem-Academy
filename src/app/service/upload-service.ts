import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LessonForMediaDTO } from '../InterFace/media-dto';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:5292/api/media'; 

  constructor(private http: HttpClient) {}

  // طلب presigned URL من API
  async getPresignedUrl(
    file: File,
    grade = 'Grade7',
    term = 'Term2',
    unit = 'Unit2',
    lessonId = 4
  ) {
    const body = {
      grade,
      term,
      unit,
      lessonId,
      fileName: file.name,
    };

    const res: any = await lastValueFrom(this.http.post(`${this.apiUrl}/presign-upload`, body));
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
async addMediaAfterUpload(dto: {
  mediaType: number;
  storageKey: string;
  duration?: number | null;
  fileFormat: number;
  lessonId: number;
}): Promise<void> {
  await lastValueFrom(this.http.post(`${this.apiUrl}/AddMediaAfterUpload`, dto));
}

  async deleteMedia(mediaId: number): Promise<void> {
  const url = `${this.apiUrl}/DeleteMedia?mediaId=${mediaId}`;
  await lastValueFrom(this.http.delete(url));
}


  async getLessonMedia(lessonId: number): Promise<LessonForMediaDTO[]> {
    const url = `${this.apiUrl}/GetLessonMedia?lessonId=${lessonId}`;
    const res = await lastValueFrom(this.http.get<LessonForMediaDTO[]>(url));
    return res;
  }
}