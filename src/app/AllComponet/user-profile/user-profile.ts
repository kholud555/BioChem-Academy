import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../InterFace/register';
import { GradeService } from '../../service/grade-service';
import { GradeDTO } from '../../InterFace/grade-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, FormsModule ,CommonModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
  studentData: Profile = {
    userName: "",
    email: "",
    grade: "",
    phoneNumber: "",
    parentNumber: ""
  };

  grades: GradeDTO[] = [];
  selectedGradeName: string = "";

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadGrades();
    this.loadProfile();
  }

  loadGrades(): void {
    this.gradeService.GetAllGrade().subscribe({
      next: (data: GradeDTO[]) => {
        this.grades = data;
      },
      error: (err) => {
        console.error('Error fetching grades:', err);
      }
    });
  }


  loadProfile(): void {
    this.studentService.getStudentProfile().subscribe({
      next: (res) => {
        this.studentData = res;
       
      if (this.grades.length > 0) {
        const match = this.grades.find(g => g.gradeName === res.grade);
        this.studentData.grade = match ? match.gradeName : '';
      }
       
      },
      error: (err) => {
        console.error('Error loading profile', err);
      }
    });
  }

  onGradeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedGradeName = selectElement.value;
    this.studentData.grade = this.selectedGradeName;
  }

  updateProfile(): void {
    this.studentService.UpdateStudentProfile(this.studentData).subscribe({
      next: () => {
        this.toast.success('Profile updated successfully!');
      },
      error: (err) => {
        this.toast.error('Error updating profile');
        console.error(err);
      }
    });
  }
}
