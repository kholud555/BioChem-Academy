import { Injectable } from '@angular/core';
import { HttpClient,  HttpEvent,  HttpHeaders,  HttpRequest } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeVideoService {
   private api = 'http://localhost:5292/api/Media/UploadVideoForHome';

  constructor(private http: HttpClient) {}

 getPresignedUrl(): Observable<string> {
  return this.http.post(this.api, {}, { responseType: 'text' });
}


  async uploadFileToR2(presignedUrl: string, file: File) {
    return fetch(presignedUrl, {
      method: 'PUT',
      headers: { "Content-Type": file.type },
      body: file
    });
  }

 getHomeVideoUrl(): Observable<string> {
  return this.http.get(
    'http://localhost:5292/api/Media/ViewVideoForHome',
    { responseType: 'text' } // مهم جدًا
  );
}

}