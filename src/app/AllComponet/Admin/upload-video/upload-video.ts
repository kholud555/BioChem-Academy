import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../service/upload-service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './upload-video.html',
  styleUrls: ['./upload-video.css'],
})
export class UploadVideo {
  selectedFile: File | null = null;
  dragActive = false;
  uploadProgress = 0;
  isUploading = false;

  constructor(private uploadService: UploadService) {}

  handleDrag(event: DragEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();

    if (type === 'enter' || type === 'over') {
      this.dragActive = true;
    } else if (type === 'leave') {
      this.dragActive = false;
    }
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        this.selectedFile = file;
      }
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  async handleUpload(): Promise<void> {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      // 1️⃣ نجيب presigned URL من الـAPI
      const { presignedUrl, storageKey } = await this.uploadService.getPresignedUrl(
        this.selectedFile
      );

      // 2️⃣ نرفع الفيديو إلى R2
      await this.uploadService.uploadToR2(this.selectedFile, presignedUrl, (percent) => {
        this.uploadProgress = percent;
      });

      console.log('✅ Uploaded successfully! Storage Key:', storageKey);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('❌ Upload failed');
    } finally {
      this.isUploading = false;
    }
  }

  handleRemove(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
