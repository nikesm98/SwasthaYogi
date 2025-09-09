
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface MedicalReport {
  id: string;
  fileName: string;
  uploadDate: Date;
  type: 'prescription' | 'report' | 'scan';
  summary?: string;
  diagnosis?: string;
  medications?: string[];
  recommendations?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MedicalReportService {
  private reportsSubject = new BehaviorSubject<MedicalReport[]>([]);
  public reports$ = this.reportsSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchReports(): void {
    this.http.get<MedicalReport[]>(`${environment.apiUrl}/api/medical-report`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: reports => this.reportsSubject.next(reports),
      error: err => this.handleAuthError(err)
    });
  }

  uploadReport(file: File, type: 'prescription' | 'report' | 'scan'): Promise<MedicalReport> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<MedicalReport>(`${environment.apiUrl}/api/medical-report`, formData, {
      headers: this.getAuthHeaders()
    }).toPromise().then(report => {
      if (!report) {
        throw new Error('MedicalReport upload failed: response is undefined');
      }
      return report;
    }).catch(err => {
      this.handleAuthError(err);
      throw err;
    });
  }

  deleteReport(id: string): Promise<any> {
    return this.http.delete(`${environment.apiUrl}/api/medical-report/${id}`, {
      headers: this.getAuthHeaders()
    }).toPromise().catch(err => {
      this.handleAuthError(err);
      throw err;
    });
  }

  private handleAuthError(err: any): void {
    if (err?.error?.message === 'Invalid or expired token') {
      localStorage.removeItem('token');
      alert('Session expired. Please log in again.');
      window.location.href = '/auth';
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}