import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null : { mismatch: true };
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginResult = await this.authService.login(email, password);
      if (loginResult) {
        this.router.navigate(['/dashboard']);
        this.snackBar.open('Welcome to Swastha Yogi!', 'Close', { duration: 3000 });
      } else {
        this.snackBar.open('Invalid credentials', 'Close', { duration: 3000 });
      }
    }
  }

  async onSignup(): Promise<void> {
    if (this.signupForm.valid) {
      const { email, password, name } = this.signupForm.value;
      const result = await this.authService.register(email, password, name);
      if (result) {
        this.router.navigate(['/dashboard']);
        this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
      } else {
        this.snackBar.open('Registration failed', 'Close', { duration: 3000 });
      }
    }
  }

  onTabChange(event: any): void {
    // Reset forms when switching tabs
    this.loginForm.reset();
    this.signupForm.reset();
  }

  goToLanding(): void {
    this.router.navigate(['/']);
  }
}