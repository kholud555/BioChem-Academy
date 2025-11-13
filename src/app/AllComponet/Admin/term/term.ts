import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { TermService } from '../../../service/term-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { CreateTermDTO, TermDTO } from '../../../InterFace/term-dto';
import { GradeService } from '../../../service/grade-service';

@Component({
  selector: 'app-term',
  imports: [CommonModule, FormsModule],
  templateUrl: './term.html',
  styleUrl: './term.css'
})
export class Term implements OnInit {
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];

  selectedGradeId: number = 0;
  selectedGradeIdForUpdate: number = 0;

  newTerm: CreateTermDTO = {
   
    gradeId: 0,
    
     termOrder:1,
  };

  editingTermId: number | null = null;

  editedTerm: TermDTO = {
    id: 0,
     termOrder:0,
    
    gradeId: 0,
   
  };

  constructor(
    private gradeService: GradeService,
    private termService: TermService
  ) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: (data) => this.grades = data,
      error: (err) => console.error('Error loading grades', err)
    });
  }

  // ✅ تم تعديل السطر التالي لقراءة selectedGradeIdForUpdate بدل selectedGradeId
  onGradeChange(): void {
    if (this.selectedGradeIdForUpdate > 0) {
      this.termService.getTermsByGrade(this.selectedGradeIdForUpdate).subscribe({
        next: (data) => {
        
          this.terms = data;
        },
        error: (err) => console.error('Error loading terms', err)
      });
    } else {
      this.terms = [];
    }
  }

  addNewTerm(): void {
  if (this.newTerm.gradeId <= 0 || (this.newTerm.termOrder !== 0 && this.newTerm.termOrder !== 1)) {

    
    Swal.fire('Validation Error', 'Please enter valid term name and select a grade.', 'warning');
      return;
    }
    const isDuplicate = this.terms.some(
     t => t.termOrder === this.newTerm.termOrder && t.gradeId === this.newTerm.gradeId
);

  if (isDuplicate) {
    Swal.fire('Duplicate Entry', 'This term already exists for the selected grade.', 'warning');
    return;
  }


    this.termService.addTerm(this.newTerm).subscribe({
      next: (term) => {
        Swal.fire('Success', 'Term added successfully.', 'success');
       
       
        this.newTerm = { gradeId: 0,   termOrder:0};
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
    this.editedTerm = {
       termOrder:0,
      id: 0,
    
      gradeId: 0,
     
    };
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
          const errorMessage =
           
             err?.error?.detail || 
           
            'An unexpected error occurred ';
        
          Swal.fire({
            icon: 'error',
            title:err.error?.title || 'Error!',
            text: errorMessage,
          });
        
          console.error('Error deleting grade:', err);
        }
        
        });
      }
    });
  }
}
