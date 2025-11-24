import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateUnitDTO, UnitDTO } from '../../../InterFace/unit-dto';
import { UnitService } from '../../../service/unit-service';

import { GradeDTO } from '../../../InterFace/grade-dto';
import { TermDTO } from '../../../InterFace/term-dto';
import { SubjectDTO } from '../../../InterFace/subject';

import { GradeService } from '../../../service/grade-service';
import { TermService } from '../../../service/term-service';
import { SubjectService } from '../../../service/subject';


@Component({
  selector: 'app-unit',
  templateUrl: './unit.html',
  styleUrls: ['./unit.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class Unit implements OnInit {

  /** ------------ Data Lists ------------ **/
  subjects: SubjectDTO[] = [];
  grades: GradeDTO[] = [];
  terms: TermDTO[] = [];
  units: UnitDTO[] = [];

  /** ------------ Add Unit Model ------------ **/
  addModel = {
    subjectId: 0,
    gradeId: 0,
    termId: 0,
    title: '',
    description: '',
    order: 1
  };

  /** ------------ Filters ------------ **/
  filter = {
    subjectId: 0,
    gradeId: 0,
    termId: 0
  };

  /** ------------ Edit Mode ------------ **/
  editId: number = 0;

  constructor(
    private unitService: UnitService,
    private gradeService: GradeService,
    private termService: TermService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  /** ------------ Load Subjects ------------ **/
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: data => this.subjects = data,
      error: err => console.error("Error loading subjects", err)
    });
  }

  /** ------------ Add Unit Chain ------------ **/

  onSubjectChange(): void {
    if (this.addModel.subjectId > 0) {
      this.gradeService.getGradeBySubjectId(this.addModel.subjectId).subscribe({
        next: data => {
          this.grades = data;
          this.addModel.gradeId = 0;
          this.terms = [];
        },
        error: err => console.error("Error loading grades", err)
      });
    }
  }

  onGradeChange(): void {
    if (this.addModel.gradeId > 0) {
      this.termService.getTermsByGrade(this.addModel.gradeId).subscribe({
        next: data => {
          this.terms = data;
          this.addModel.termId = 0;
        },
        error: err => console.error("Error loading terms", err)
      });
    }
  }

  /** ------------ Add Unit ------------ **/

  addUnit(): void {
    if (
      this.addModel.subjectId <= 0 ||
      this.addModel.gradeId <= 0 ||
      this.addModel.termId <= 0 ||
      !this.addModel.title.trim()
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    const payload: CreateUnitDTO = {
      subjectId: this.addModel.subjectId,
      termId: this.addModel.termId,
      title: this.addModel.title,
      description: this.addModel.description,
      order: this.addModel.order
    };

    this.unitService.addUnit(payload).subscribe({
      next: () => {
        Swal.fire("Success", "Unit added successfully", "success");
        this.resetAddForm();
        this.loadUnits();
      },
      error: err => this.showError(err)
    });
  }

  resetAddForm(): void {
    this.addModel = {
      subjectId: 0,
      gradeId: 0,
      termId: 0,
      title: '',
      description: '',
      order: 1
    };
  }

  /** ------------ Filters for Units Table ------------ **/

  onFilterSubjectChange(): void {
    if (this.filter.subjectId > 0) {
      this.gradeService.getGradeBySubjectId(this.filter.subjectId).subscribe({
        next: data => {
          this.grades = data;
          this.filter.gradeId = 0;
          this.terms = [];
          this.units = [];
        }
      });
    }
  }

  onFilterGradeChange(): void {
    if (this.filter.gradeId > 0) {
      this.termService.getTermsByGrade(this.filter.gradeId).subscribe({
        next: data => {
          this.terms = data;
          this.filter.termId = 0;
          this.units = [];
        }
      });
    }
  }

  /** ------------ Load Units ------------ **/

  loadUnits(): void {
    if (this.filter.termId <= 0) {
      this.units = [];
      return;
    }

    this.unitService.getUnitsByTerm(this.filter.termId).subscribe({
      next: data => this.units = data,
      error: err => console.error("Error loading units", err)
    });
  }

  /** ------------ Edit ------------ **/

  enableEdit(id: number): void {
    this.editId = id;
  }

  saveEdit(unit: UnitDTO): void {
    this.unitService.updateUnit(unit).subscribe({
      next: () => {
        Swal.fire("Updated", "Unit updated successfully", "success");
        this.editId = 0;
        this.loadUnits();
      },
      error: err => this.showError(err)
    });
  }

  cancelEdit(): void {
    this.editId = 0;
    this.loadUnits();
  }

  /** ------------ Delete ------------ **/

  deleteUnit(id: number): void {
    Swal.fire({
      title: "Are you sure?",
      text: "This unit will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.isConfirmed) {
        this.unitService.deleteUnit(id).subscribe({
          next: () => {
            Swal.fire("Deleted", "Unit deleted successfully", "success");
            this.units = this.units.filter(u => u.id !== id);

            
          },
          error: err => this.showError(err)
        });
      }
    });
  }

  /** ------------ Error Helper ------------ **/

  showError(err: any): void {
    const msg =
      err?.error?.message ||
      err?.error?.detail ||
      err?.message ||
      "Unexpected error occurred";

    Swal.fire("Error", msg, "error");
    console.error(err);
  }
}
