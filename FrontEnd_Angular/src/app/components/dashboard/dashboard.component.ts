import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService, User } from '../../services/auth.service';
import { MedicineService, Medicine } from '../../services/medicine.service';
import { MedicalReportService, MedicalReport } from '../../services/medical-report.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeMedicines = 0;
  pendingMedicines = 0;
  todayDoses = 0;
  totalReports = 0;
  recentReports = 0;
  analyzedReports = 0;

  recentActivity: Array<{ icon: string; message: string; time: string; color: string }> = [];

  constructor(
    private authService: AuthService,
    private medicineService: MedicineService,
    private medicalReportService: MedicalReportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      const previousUser = this.currentUser;
      this.currentUser = user;
      this.updateRecentActivity();
      if (previousUser && user && (previousUser.name !== user.name || previousUser.email !== user.email)) {
        this.logProfileChange(previousUser, user);
      }
    });

    this.medicineService.medicines$.subscribe(medicines => {
      this.activeMedicines = medicines.filter(m => m.isActive).length;
      this.todayDoses = medicines.length * 2; // Mock calculation
      this.medicineService.checkMedicineAlerts().then(alerts => {
        this.pendingMedicines = alerts.length;
        if (alerts.length > 0) {
          alerts.forEach(alert => {
            this.logMedicineAlert(alert);
          });
        }
      });
    });

    this.medicalReportService.reports$.subscribe(reports => {
      this.totalReports = reports.length;
      this.recentReports = reports.filter(r =>
        new Date(r.uploadDate).getMonth() === new Date().getMonth()
      ).length;
      this.analyzedReports = reports.filter(r => r.summary).length;
    });
  }

  private updateRecentActivity(): void {
    this.recentActivity = [];
    if (this.currentUser) {
      this.recentActivity.push({
        icon: 'person',
        message: `Welcome, ${this.currentUser.name}! Profile loaded.`,
        time: 'Just now',
        color: '#FF9800'
      });
      // If no other activity, show a random quote
      setTimeout(() => {
        if (this.recentActivity.length === 1) {
          const quotes = [
            'Health is wealth!',
            'Take care of your body. It’s the only place you have to live.',
            'A healthy outside starts from the inside.',
            'The greatest medicine of all is teaching people how not to need it.',
            'Eat well, move daily, hydrate often, sleep lots, love your body.'
          ];
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          this.recentActivity.push({
            icon: 'favorite',
            message: randomQuote,
            time: 'Today',
            color: '#E91E63'
          });
        }
      }, 100);
    }
  }

  private logMedicineAlert(medicine: Medicine): void {
    this.recentActivity.unshift({
      icon: 'medication',
      message: `Medicine reminder: ${medicine.name} is due`,
      time: 'Just now',
      color: '#4CAF50'
    });
    // Limit to last 10 activities
    if (this.recentActivity.length > 10) {
      this.recentActivity.pop();
    }
  }

  private logProfileChange(prev: User, curr: User): void {
    this.recentActivity.unshift({
      icon: 'person',
      message: `Profile updated: Name or Email changed`,
      time: 'Just now',
      color: '#FF9800'
    });
    if (this.recentActivity.length > 10) {
      this.recentActivity.pop();
    }
  }

  navigateToMedicine(): void {
    this.router.navigate(['/medicine-timer']);
  }

  navigateToReports(): void {
    this.router.navigate(['/medical-report']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}