import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, User } from '../../services/auth.service';

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  phone: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
  medicalHistory: string;
  currentMedications: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {
  personalForm: FormGroup;
  medicalForm: FormGroup;
  currentUser: User | null = null;
  activeMedicinesCount = 0;
  reportsCount = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.personalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]],
      phone: [''],
      bloodType: [''],
      emergencyContact: ['']
    });

    this.medicalForm = this.fb.group({
      allergies: [''],
      medicalHistory: [''],
      currentMedications: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadProfile();
      }
    });
  }

  loadProfile(): void {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      this.personalForm.patchValue(profile);
      this.medicalForm.patchValue(profile);
    } else if (this.currentUser) {
      this.personalForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email
      });
    }
  }

  saveProfile(): void {
    if (this.personalForm.valid) {
      const profile = {
        ...this.personalForm.value,
        ...this.medicalForm.value
      };
      localStorage.setItem('userProfile', JSON.stringify(profile));
      this.snackBar.open('Profile saved successfully!', 'Close', { duration: 3000 });
    }
  }

  resetProfile(): void {
    this.loadProfile();
    this.snackBar.open('Changes reset', 'Close', { duration: 2000 });
  }

  generateReport(): void {
    if (this.isProfileComplete()) {
      // Mock PDF generation
      this.snackBar.open('Health report generated successfully!', 'Close', { duration: 3000 });
      
      // In a real app, this would use jsPDF
      const reportData = {
        ...this.personalForm.value,
        ...this.medicalForm.value,
        generatedDate: new Date()
      };
      
      console.log('Health Report Data:', reportData);
    } else {
      this.snackBar.open('Please complete your profile to generate report', 'Close', { duration: 3000 });
    }
  }

  getProfileCompleteness(): number {
    const totalFields = 11;
    let completedFields = 0;
    
    const personalData = this.personalForm.value;
    const medicalData = this.medicalForm.value;
    
    Object.values({...personalData, ...medicalData}).forEach(value => {
      if (value && value.toString().trim() !== '') {
        completedFields++;
      }
    });
    
    return Math.round((completedFields / totalFields) * 100);
  }

  isProfileComplete(): boolean {
    return this.getProfileCompleteness() >= 70;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}