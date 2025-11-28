import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../service/Student/student-service';
import { ToastrService } from 'ngx-toastr';
import { StudentDto, StudentExamResultDTO } from '../../InterFace/student-dto';
import { StudentExamService } from '../../service/student-exam';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-result',
  imports: [CommonModule],
  templateUrl: './student-result.html',
  styleUrls: ['./student-result.css']  // fixed
})
export class StudentResult implements OnInit {
  
  SelectedStudent: StudentDto | null = null;
  studentId: number | null = null;
  studentResults: any;
  loading: boolean = false;

  constructor(
    private Service: StudentExamService,
    private toast: ToastrService,
    private student:StudentService,
  ) {}

  ngOnInit(): void {
  //  this.SelectedStudent = this.getFromSession<StudentDto>('selectedStudent');
if (!this.SelectedStudent) {
      this.SelectedStudent = this.student.getStudent();
     // if (this.SelectedStudent) this.saveToSession('selectedStudent', this.SelectedStudent);
     console.log(this.SelectedStudent);
    }
    if (this.SelectedStudent) {
      this.studentId = this.SelectedStudent.id;
      this.fetchResults();
    } else {
      this.toast.error('No student selected');
    }
  }

  

  // getFromSession<T>(key: string): T | null {
  //   const value = sessionStorage.getItem(key);
  //   return value ? (JSON.parse(value) as T) : null;
  // }

  fetchResults() {
    if (!this.studentId) return;

    this.loading = true;
    this.Service.getStudentResultForAdmin(this.studentId).subscribe({
      next: res => {
        console.log(res);
        this.studentResults = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.toast.error('Failed to load student results');
      }
    });
  }
}
