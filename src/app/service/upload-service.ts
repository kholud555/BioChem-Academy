import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LessonForMediaDTO, MediaTypeEnum, FileFormatEnum } from '../InterFace/media-dto';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:5292/api/media';

  constructor(private http: HttpClient) {}

  // تحديد نوع الميديا بناءً على امتداد الملف
  private detectMediaType(file: File): { mediaType: MediaTypeEnum; fileFormat: FileFormatEnum } {
    const ext = file.name.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'mp4':
        return { mediaType: MediaTypeEnum.Video, fileFormat: FileFormatEnum.Mp4 };
      case 'pdf':
        return { mediaType: MediaTypeEnum.Pdf, fileFormat: FileFormatEnum.Pdf };
      case 'jpg':
      case 'jpeg':
        return { mediaType: MediaTypeEnum.Image, fileFormat: FileFormatEnum.Jpg };
      case 'png':
        return { mediaType: MediaTypeEnum.Image, fileFormat: FileFormatEnum.Png };
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  // الحصول على presigned URL للرفع
  async getPresignedUrl(
    file: File,
    subjectName: string,
    gradeName: string,
    termName: string,
    unitName: string,
    lessonId: number
  ) {
    const body = {
      subject: subjectName,
      grade: gradeName,
      term: termName,
      unit: unitName,
      lessonId,
      fileName: file.name,
      contentType: file.type
    };

    const res: any = await lastValueFrom(
      this.http.post(`${this.apiUrl}/presign-upload`, body)
    );

    return res; // يجب أن يحتوي على presignedUrl و storageKey
  }

  // رفع الملف إلى Cloudflare R2 باستخدام presigned URL
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

 async addMediaAfterUpload(
  file: File,
  storageKey: string,
  lessonId: number,
  duration?: number | null
): Promise<string> {
  const { mediaType, fileFormat } = this.detectMediaType(file);

  const dto = {
    mediaType,
    storageKey,
    duration: mediaType === MediaTypeEnum.Video ? duration ?? 0 : null,
    fileFormat,
    lessonId,
  };

  const res: any = await lastValueFrom(
    this.http.post(`${this.apiUrl}/AddMediaAfterUpload`, dto)
  );

  // تحويل storageKey إلى رابط URL مباشر للعرض
  const bucketBaseUrl = 'https://<your-bucket-name>.r2.cloudflarestorage.com/';
  return `${bucketBaseUrl}${storageKey}`;
}


  // حذف ملف
  async deleteMedia(mediaId: number): Promise<void> {
    const url = `${this.apiUrl}/DeleteMedia?mediaId=${mediaId}`;
    await lastValueFrom(this.http.delete(url));
  }

  // الحصول على ملفات درس محدد (صور / فيديو / PDF)
  async getLessonMedia(lessonId: number): Promise<LessonForMediaDTO[]> {
    const url = `${this.apiUrl}/GetLessonMedia?lessonId=${lessonId}`;
    const res = await lastValueFrom(this.http.get<LessonForMediaDTO[]>(url));
    return res;
  }
}
