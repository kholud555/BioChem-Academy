
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-upload-video',
  imports: [CommonModule],
  templateUrl: './upload-video.html',
  styleUrl: './upload-video.css'
})
export class UploadVideo {
  selectedFile: File | null = null;
   dragActive = false;
  uploadProgress = 0;
  isUploading = false;
  uploadInterval: any;

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

  handleUpload(): void {
    if (!this.selectedFile) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    // Simulate upload progress
    this.uploadInterval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(this.uploadInterval);
        this.isUploading = false;
        this.uploadProgress = 100;
      }
    }, 300);
  }

  handleRemove(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.isUploading = false;
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
 

}
