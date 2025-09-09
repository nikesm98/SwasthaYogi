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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MedicineService, Medicine } from '../../services/medicine.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medicine-timer',
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
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './medicine-timer.component.html',
  styleUrls: ['./medicine-timer.component.css']
})
export class MedicineTimerComponent implements OnInit {
  medicines: Medicine[] = [];
  medicineForm: FormGroup;
  showAddForm = false;

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      time: ['', Validators.required],
      frequency: ['daily', Validators.required]
    });
  }

  ngOnInit(): void {
    this.medicineService.medicines$.subscribe(medicines => {
      this.medicines = medicines;
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.medicineForm.reset();
    }
  }

  addMedicine(): void {
    if (this.medicineForm.valid) {
      this.medicineService.addMedicine(this.medicineForm.value);
      this.medicineForm.reset();
      this.showAddForm = false;
      this.snackBar.open('Medicine added successfully!', 'Close', { duration: 3000 });
    }
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.medicineForm.reset();
  }

  toggleMedicine(medicine: Medicine): void {
    this.medicineService.updateMedicine(medicine.id, { isActive: !medicine.isActive });
    const status = medicine.isActive ? 'deactivated' : 'activated';
    this.snackBar.open(`Medicine ${status}`, 'Close', { duration: 2000 });
  }

  deleteMedicine(id: string): void {
    this.medicineService.deleteMedicine(id);
    this.snackBar.open('Medicine deleted', 'Close', { duration: 2000 });
  }

  formatNextDose(date: Date): string {
    const now = new Date();
    const diffMs = new Date(date).getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs <= 0) {
      return 'Due now!';
    } else if (diffHours < 1) {
      return `in ${diffMins} minutes`;
    } else {
      return `in ${diffHours}h ${diffMins}m`;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}