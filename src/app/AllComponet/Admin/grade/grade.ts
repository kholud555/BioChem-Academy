import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { GradeService } from '../../../service/grade-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-grade',
  imports: [CommonModule,FormsModule],
  templateUrl: './grade.html',
  styleUrl: './grade.css'
})
export class Grade implements OnInit {
  grades: GradeDTO[] = [];
  newGrAdeName: string = '';
  SelectedGrade: GradeDTO | null = null;
   editingGradeId: number | null = null; 
editedGradeName: string = ''; 
  constructor(private http: HttpClient , private gradeService:GradeService) { }
  ngOnInit(): void {
    this.loadGrades();
  }
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe(
      (data: GradeDTO[]) => {
        this.grades = data;
        
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }
  AddGrade(): void {
    if (!this.newGrAdeName.trim()) return;
      this.gradeService.AddGrade(this.newGrAdeName).subscribe({

       next: () => {
        this.loadGrades();
        this.newGrAdeName = '';
      },
      error: (err) => console.error('Add failed', err)
    });
  }
  

  SelectGrade(grade: GradeDTO): void {
    this.editingGradeId = grade.id;
    this.editedGradeName = grade.gradeName;
    this.SelectedGrade = { ...grade };
  }

  
updateGrade(grade: GradeDTO): void {
   grade.gradeName = this.editedGradeName;
    this.gradeService.UpdareGrade(grade).subscribe({
      next: () => {
        this.editingGradeId = null;
        this.loadGrades();
      },
      error: (err) => console.error('Error updating grade:', err)
    });
  }
CancelEdit():void{
  this.editingGradeId = null;
}
 deleteGrade(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "This grade will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gradeService.DeleteGrade(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Grade has been deleted.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadGrades();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete grade.',
            });
            console.error('Error deleting grade:', err);
          }
        });
      }
    });
  }
}
