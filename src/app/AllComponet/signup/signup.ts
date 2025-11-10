import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { StudentService } from '../../service/Student/student-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GradeService } from '../../service/grade-service';
import { GradeDTO } from '../../InterFace/grade-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule,FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  selectedGradeId: number = 0;
  
  isLoading: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  grades: GradeDTO[] = [];

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
  RegisterForm: FormGroup = new FormGroup(
    {
      userName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20) // 👈 تم تعديل الحد الأقصى من 5 إلى 20
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^01[0-9]{9}$/)
      ]),
      parentPhone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^01[0-9]{9}$/)
      ]),
      grade: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [
        Signup.passwordMatchValidator,
        Signup.differentPhoneValidator
      ]
    }
  );

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  static differentPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const phone = control.get('phoneNumber')?.value;
    const parentPhone = control.get('parentPhone')?.value;
    if (phone && parentPhone && phone === parentPhone) {
      return { samePhone: true };
    }
    return null;
  }

  get f() {
    return this.RegisterForm.controls;
  }

  constructor(
    private register: StudentService,
    private router: Router,
    private toaster: ToastrService,
    private gradeService: GradeService
  ) {}

  GoLogin() {
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.RegisterForm.invalid) {
      this.toaster.error('Please fill all fields correctly');
      this.RegisterForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    console.log(this.RegisterForm.value);

    this.register.RegistrationStudent(this.RegisterForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
        this.toaster.success('Registration Successfully');
        this.RegisterForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error(err.error.message);
      }
    });
  }
}
