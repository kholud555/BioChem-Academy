import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { GradeService } from '../../../service/grade-service';
import { SubjectService } from '../../../service/subject';
import { CreatrGradedTO, GradeDTO } from '../../../InterFace/grade-dto';
import { SubjectDTO } from '../../../InterFace/subject';

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grade.html',
  styleUrl: './grade.css'
})
export class Grade implements OnInit {

   grades: GradeDTO[] = [];
  subjects: SubjectDTO[] = [];

  selectedSubject: number = 0;

  newGrade: CreatrGradedTO = { gradeName: '', subjectId: 0 };

  editingGradeId: number | null = null;
  editedGradeName: string = '';
  editedSubjectId: number = 0;

  constructor(
    private gradeService: GradeService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  // Load Subjects
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error('Error loading subjects:', err)
    });
  }

  // When selecting subject → load grades of that subject only
  onSubjectChange(): void {
    if (this.selectedSubject > 0) {
      this.gradeService.getGradeBySubjectId(this.selectedSubject).subscribe({
        next: data => this.grades = data,
        error: err => console.error('Error loading grades:', err)
      });

      this.newGrade.subjectId = this.selectedSubject;
    } else {
      this.grades = [];
    }
  }

  // Add Grade
  addGrade(): void {
    if (!this.newGrade.gradeName || this.newGrade.subjectId === 0) {
      Swal.fire('Error', 'Please enter grade name and select subject.', 'warning');
      return;
    }

    this.gradeService.AddGrade(this.newGrade).subscribe({
      next: () => {
        Swal.fire('Success', 'Grade added successfully!', 'success');
        this.newGrade = { gradeName: '', subjectId: this.selectedSubject };
        this.onSubjectChange();
      },
      error: err => console.error(err)
    });
  }

  // Start Edit
  startEdit(g: GradeDTO): void {
    this.editingGradeId = g.id;
    this.editedGradeName = g.gradeName;
    this.editedSubjectId = g.subjectId;
  }

  cancelEdit(): void {
    this.editingGradeId = null;
    this.editedGradeName = '';
    this.editedSubjectId = 0;
  }

  // Update Grade
  updateGrade(): void {
    if (!this.editedGradeName || this.editedSubjectId === 0) return;

    const updated: GradeDTO = {
      id: this.editingGradeId!,
      gradeName: this.editedGradeName,
      subjectId: this.editedSubjectId
    };

    this.gradeService.UpdareGrade(updated).subscribe({
      next: () => {
        Swal.fire('Updated!', 'Grade updated successfully!', 'success');
        this.cancelEdit();
        this.onSubjectChange();
      },
      error: err => console.error(err)
    });
  }

  // Delete
  deleteGrade(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This grade will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true
    }).then(res => {
      if (res.isConfirmed) {
        this.gradeService.DeleteGrade(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Grade deleted.', 'success');
            this.onSubjectChange();
          },
          error: err => console.error(err)
        });
      }
    });
  }

}