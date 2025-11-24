import { Component, OnInit } from '@angular/core';
import { SubjectDTO } from '../../../InterFace/subject';
import { SubjectService } from '../../../service/subject';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subject',
  imports: [CommonModule, FormsModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css'
})
export class Subject implements OnInit {

  subjects: SubjectDTO[] = [];
  newSubjectName: string = '';

  editingSubjectId: number | null = null;   // نفس System الـ Grade
  editedSubjectName: string = '';

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error(err)
    });
  }

  addSubject() {
    if (!this.newSubjectName.trim()) return;

    this.subjectService.addSubject(this.newSubjectName).subscribe({
      next: () => {
        this.newSubjectName = '';
        this.loadSubjects();
      }
    });
  }

  selectSubject(sub: SubjectDTO) {
    this.editingSubjectId = sub.id;
    this.editedSubjectName = sub.subjectName;
  }

  updateSubject(sub: SubjectDTO) {
    sub.subjectName = this.editedSubjectName;

    this.subjectService.updateSubject(sub).subscribe({
      next: () => {
        this.editingSubjectId = null;
        this.loadSubjects();
      },
      error: err => console.error(err)
    });
  }

  cancelEdit() {
    this.editingSubjectId = null;
  }

  deleteSubject(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This subject will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
        this.loadSubjects();
      if (result.isConfirmed) {
        this.subjectService.deleteSubject(id).subscribe({
          next: () => {
            this.loadSubjects();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Subject has been deleted.',
              timer: 1500,
              showConfirmButton: false,
            });

           
          },
          error: err => console.error(err)
        });
      }
    });
  }
}
