import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { StudentService } from '../../service/Student/student-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GradeService } from '../../service/grade-service';
import { GradeDTO } from '../../InterFace/grade-dto';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  selectedGradeName: string = '';
  isLoading: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  grades: GradeDTO[] = [];

  RegisterForm: FormGroup = new FormGroup(
    {
      userName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^((\+20|0)?(10|11|12|15)\d{8}|(\+968)?[79]\d{7})$/)
        //"^((\+20|0)?(10|11|12|15)\d{8}|(\+968)?[79]\d{7})$"
      ]),
      parentPhone: new FormControl('', [
       // Validators.required,
        Validators.pattern(/^((\+20|0)?(10|11|12|15)\d{8}|(\+968)?[79]\d{7})$/)
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

  constructor(
    private register: StudentService,
    private router: Router,
    private toaster: ToastrService,
     private location: Location,
    private gradeService: GradeService,
   
  ) {}

  ngOnInit(): void {
    this.loadGrades();
   
  }

  goBack() {
    this.location.back();
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

    const formValue = this.RegisterForm.value;

    const payload = {
      userName: formValue.userName,
      email: formValue.email,
      grade: this.selectedGradeName, // الآن نصي
      phoneNumber: formValue.phoneNumber,
      parentPhone: formValue.parentPhone,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword
    };

    

    this.register.RegistrationStudent(payload).subscribe({
      next: (res) => {
        this.toaster.success('Registration Successful');
        this.router.navigate(['/login']);
        this.RegisterForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error(err.error.message || 'Registration failed');
      }
    });
  }

  

onGradeChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  this.selectedGradeName = selectElement.value;
  this.RegisterForm.get('grade')?.setValue(this.selectedGradeName);
}

}
