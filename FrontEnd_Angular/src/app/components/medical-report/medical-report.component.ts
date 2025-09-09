import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MedicalReportService, MedicalReport } from '../../services/medical-report.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medical-report',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './medical-report.component.html',
  styleUrls: ['./medical-report.component.css']
})
export class MedicalReportComponent implements OnInit {
  reports: MedicalReport[] = [];
  isUploading = false;

  constructor(
    private medicalReportService: MedicalReportService,
    private authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.medicalReportService.reports$.subscribe(reports => {
      this.reports = reports;
    });
  }

  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadReport(file);
    }
  }

  async uploadReport(file: File): Promise<void> {
    this.isUploading = true;
    const type = this.determineReportType(file.name);

    try {
      await this.medicalReportService.uploadReport(file, type);
      this.snackBar.open('Report uploaded and analyzed successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Error uploading report', 'Close', { duration: 3000 });
    }

    this.isUploading = false;
    // ...existing code...
  }

  public determineReportType(fileName: string): 'prescription' | 'report' | 'scan' {
    const name = fileName.toLowerCase();
    if (name.includes('prescription') || name.includes('rx')) {
      return 'prescription';
    } else if (name.includes('scan') || name.includes('xray') || name.includes('mri')) {
      return 'scan';
    }
    return 'report';
  }

  deleteReport(id: string): void {
    this.medicalReportService.deleteReport(id);
    this.snackBar.open('Report deleted', 'Close', { duration: 2000 });
  }

  getReportTypeDisplay(type: string): string {
    const types = {
      'prescription': 'Prescription',
      'report': 'Medical Report',
      'scan': 'Medical Scan'
    };
    return types[type as keyof typeof types] || 'Document';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}