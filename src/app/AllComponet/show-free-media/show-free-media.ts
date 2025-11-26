// show-free-media.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GradeService } from '../../service/grade-service';
import { CommonModule } from '@angular/common';
import { NavBar } from "../nav-bar/nav-bar";
import { Location } from '@angular/common';

// كل ملف من mediaOfFreeLesson
export interface MediaFile {
  fileName: string;
  mediaType: 'Image' | 'Video' | 'Pdf';
  fileFormat: string;
  duration: number | null;
  previewUrl: string;
}


// كل درس Free
export interface FreeContentViewModel {
  gradeName: string;
  term: string;
  unitName: string;
  lessonName: string;
  mediaOfFreeLesson: MediaFile[];
  show: boolean; // خاصية للعرض
}

@Component({
  selector: 'app-show-free-media',
  templateUrl: './show-free-media.html',
  styleUrls: ['./show-free-media.css'],
  imports: [CommonModule, NavBar]
})
export class ShowFreeMedia implements OnInit {

  @HostListener('document:contextmenu', ['$event'])
  disableRightClick(event: MouseEvent) { event.preventDefault(); }

  @HostListener('document:keydown', ['$event'])
  disableKeys(e: KeyboardEvent) {
    if (e.key === "F12") e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) e.preventDefault();
    if (e.ctrlKey && ["u","s"].includes(e.key.toLowerCase())) e.preventDefault();
  }

  freeContents: any;
  loading = false;
  selectedGrade: string | null = null;
  selectedLesson: FreeContentViewModel | null = null;

  constructor(
    private student: StudentService,
    private toastr: ToastrService,
    private router: Router,
    private gradeService: GradeService,
     private location: Location,
  ) {}

  ngOnInit() {
    this.selectedGrade = this.gradeService.getGrade()?.gradeName || null;
    this.loadFreeContent();
  }
goBack() {
    this.location.back();
  }
  loadFreeContent(): void {
    this.loading = true;

    this.student.getAllFreeContent().subscribe({
      next: (res) => {
        console.log("Free content API result:", res);
        console.log("selectedGrade =", this.selectedGrade);

        // فلترة كل المحتوى اللي Free أو لكل الصف المختار
        this.freeContents = res
          .filter(item => !this.selectedGrade || item.gradeName?.toLowerCase() === this.selectedGrade?.toLowerCase())
          .map(item => ({ ...item, show: false }));

        this.loading = false;

        if (this.freeContents.length === 0) {
          this.toastr.warning("No content available for this grade");
        } else {
          this.toastr.success("Content loaded successfully");
        }
      },
      error: (err) => {
        console.error('Error loading free content:', err);
        this.loading = false;
        this.toastr.error("Failed to load free content");
      }
    });
  }

  selectLesson(lesson: FreeContentViewModel) {
    this.selectedLesson = lesson;
  }

  backToLessons() {
    this.selectedLesson = null;
  }
}
