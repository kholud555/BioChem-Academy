import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { TermService } from '../../../service/term-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { CreateTermDTO, TermDTO } from '../../../InterFace/term-dto';
import { GradeService } from '../../../service/grade-service';
import { SubjectDTO } from '../../../InterFace/subject';
import { SubjectService } from '../../../service/subject';

@Component({
  selector: 'app-term',
  imports: [CommonModule, FormsModule],
  templateUrl: './term.html',
  styleUrl: './term.css'
})
export class Term implements OnInit {

  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  subjects: SubjectDTO[] = [];

  selectedSubject: number = 0;
  selectedGradeId: number = 0;

  newTerm: CreateTermDTO = { subjectId: 0, gradeId: 0, termOrder: 0 };
  editingTermId: number | null = null;
  editedTerm: TermDTO = { id: 0, subjectId: 0, gradeId: 0, termOrder: 0 };

  constructor(
    private gradeService: GradeService,
    private termService: TermService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  // تحميل المواد
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error('Error loading subjects:', err)
    });
  }

 onSubjectChange(): void {
  if (this.newTerm.subjectId > 0) {
    this.gradeService.getGradeBySubjectId(this.newTerm.subjectId).subscribe({
      next: (data) => {
        this.grades = data;            // السنن حسب المادة
        this.newTerm.gradeId = 0;      // إعادة اختيار السنة
        this.selectedGradeId = 0;      // لتحديث الجدول
        this.terms = [];               // تفريغ المصطلحات القديمة
      },
      error: (err) => console.error('Error loading grades', err)
    });
  } else {
    this.grades = [];
    this.newTerm.gradeId = 0;
    this.selectedGradeId = 0;
    this.terms = [];
  }
}



  onGradeChange(): void {
  if (this.selectedGradeId > 0) {
    this.termService.getTermsByGrade(this.selectedGradeId).subscribe({
      next: (data) => this.terms = data,
      error: (err) => console.error('Error loading terms', err)
    });
  } else {
    this.terms = [];
  }
}


  addNewTerm(): void {
  const termOrder = Number(this.newTerm.termOrder); // تأكد أنها number
  const gradeId = Number(this.newTerm.gradeId);     // أمان إضافي

  if (gradeId <= 0 || (termOrder !== 0 && termOrder !== 1)) {
    Swal.fire('Validation Error', 'Please enter valid term name and select a grade.', 'warning');
    return;
  }

  const isDuplicate = this.terms.some(
    t => t.termOrder === termOrder && t.gradeId === gradeId
  );

  if (isDuplicate) {
    Swal.fire('Duplicate Entry', 'This term already exists for the selected grade.', 'warning');
    return;
  }

  // تحديث الكائن قبل الإرسال
  this.newTerm.gradeId = gradeId;
  this.newTerm.termOrder = termOrder;

  this.termService.addTerm(this.newTerm).subscribe({
    next: () => {
      Swal.fire('Success', 'Term added successfully.', 'success');
      this.newTerm = { gradeId: 0, termOrder: 0, subjectId: 0 };
      this.onGradeChange();
    },
    error: (err) => {
      Swal.fire('Error', 'Failed to add term.', 'error');
      console.error('Add term error:', err);
    }
  });
}


  startEdit(term: TermDTO): void {
    this.editingTermId = term.id;
    this.editedTerm = { ...term };
  }

  cancelEdit(): void {
    this.editingTermId = null;
    this.editedTerm = { id: 0, subjectId: 0, gradeId: 0, termOrder: 0 };
  }

  updateTerm(): void {
    this.termService.updateTerm(this.editedTerm).subscribe({
      next: () => {
        Swal.fire('Updated!', 'Term updated successfully.', 'success');
        this.onGradeChange();
        this.cancelEdit();
      },
      error: (err) => {
        Swal.fire('Error!', 'Failed to update term.', 'error');
        console.error('Update error:', err);
      }
    });
  }

  deleteTerm(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This term will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.termService.deleteTerm(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Term has been deleted.', 'success');
            this.onGradeChange();
          },
          error: (err) => {
            Swal.fire('Error!', err?.error?.detail || 'An unexpected error occurred', 'error');
            console.error('Error deleting grade:', err);
          }
        });
      }
    });
  }
}
