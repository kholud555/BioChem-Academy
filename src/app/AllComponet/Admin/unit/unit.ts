import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateUnitDTO, UnitDTO } from '../../../InterFace/unit-dto';
import { UnitService } from '../../../service/unit-service';
import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';


@Component({
  selector: 'app-unit',
  imports: [CommonModule , FormsModule],
  templateUrl: './unit.html',
  styleUrl: './unit.css'
})
export class Unit  implements OnInit  {

  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
 units: UnitDTO[] = [];

  selectedGradeId: number = 0;
  selectedTermId: number = 0;
  selectedTUnitId: number = 0;
  

  newUnit: CreateUnitDTO = {
    title: '',
    description: '',
    order: 1,
   
    termId: 0
  };
  constructor(
    private gradeService: GradeService,
    private termService: TermService,
    private UnitService : UnitService
  ) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  // تحميل المراحل الدراسية
  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: (data) => {
        this.grades = data;
      },
      error: (err) => console.error('Error loading grades:', err)
    });
  }

  // عند تغيير المرحلة الدراسية
  onGradeChange(): void {
    if (this.selectedGradeId > 0) {
      this.loadTermsByGrade(this.selectedGradeId);
    } else {
      this.terms = [];
      this.selectedTermId = 0;
    }
  }

  // تحميل التيرمات حسب المرحلة
  loadTermsByGrade(gradeId: number): void {
    this.termService.getTermsByGrade(gradeId).subscribe({
      next: (data) => {
        this.terms = data;
        this.selectedTermId = 0; // إعادة ضبط القيمة المختارة
      },
      error: (err) => console.error('Error loading terms:', err)
    });
  }

  // عند اختيار الترم
  onTermChange(): void {
    if (this.selectedTermId > 0){
      this.loadUnits();
    }
    else{
      this.units=[];
     
    
    }
   
  }
  // تحميل الوحدات الخاصة بالترم
  
  loadUnits(): void {
    this.UnitService.getUnitsByTerm(this.selectedTermId).subscribe({
      next: (data) => (this.units = data),
      error: (err) => console.error('Error loading units:', err)
    });
  }


  addUnit(): void {
    if (this.selectedTermId <= 0 || !this.newUnit.title.trim()) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
    
      return;
    }

    this.newUnit.termId = this.selectedTermId;
    this.UnitService.addUnit(this.newUnit).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Unit added successfully', 'success');
        this.newUnit = { title: '', description: '', order: 1, termId: 0 };
      this.loadUnits(); 
      },
         error: (err) => {
        const errorMessage =
          err?.error?.message ||
           err?.error?.detail || 
          err?.message ||
          'An unexpected error occurred while deleting the grade.';
      
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
        });
      
        console.error('Error deleting grade:', err);
      }
      
    });
  }
  
 enableEdit(unitId: number): void {
    this.  selectedTUnitId = unitId;
  }

  saveEdit(unit: UnitDTO): void {
    this.UnitService.updateUnit(unit).subscribe({
      next: () => {
        Swal.fire('Updated', 'Unit updated successfully', 'success');
        this.selectedTUnitId =0;
      },
         error: (err) => {
        const errorMessage =
          err?.error?.message ||
           err?.error?.detail || 
          err?.message ||
          'An unexpected error occurred while deleting the grade.';
      
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
        });
      
        console.error('Error deleting grade:', err);
      }
      
   
    });
  }

  cancelEdit(): void {
    this.selectedTUnitId = 0;
    this.loadUnits(); // نرجع القيم القديمة
  }

  // حذف الوحدة
  deleteUnit(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the unit permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.UnitService.deleteUnit(id).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Unit deleted successfully', 'success');
            this.loadUnits();
          },
            error: (err) => {
           const errorMessage =
             err?.error?.message ||
              err?.error?.detail || 
             err?.message ||
             'An unexpected error occurred while deleting the grade.';
         
           Swal.fire({
             icon: 'error',
             title: 'Error!',
             text: errorMessage,
           });
         
           console.error('Error deleting grade:', err);
         }
         
      
        });
      }
    });
  }
}