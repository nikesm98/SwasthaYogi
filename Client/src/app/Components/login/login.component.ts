import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  face = '😐';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.face = this.loginForm.valid ? '😊' : '😐';
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: () => {
          this.face = '🎉';
          this.errorMessage = '';

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.face = '😞';
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
    }
  }

  onHover(): void {
    if (this.loginForm.invalid) {
      this.face = '😜';
    }
  }

  onLeave(): void {
    if (this.loginForm.invalid) {
      this.face = '😐';
    }
  }
}
