
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  isActive: boolean;
  nextDose?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private medicinesSubject = new BehaviorSubject<Medicine[]>([]);
  public medicines$ = this.medicinesSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchMedicines(): void {
    this.http.get<Medicine[]>(`${environment.apiUrl}/api/medicine`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: medicines => this.medicinesSubject.next(medicines),
      error: err => this.handleAuthError(err)
    });
  }

  addMedicine(medicine: Omit<Medicine, 'id' | 'isActive' | 'nextDose'>): Promise<Medicine> {
    return this.http.post<Medicine>(`${environment.apiUrl}/api/medicine`, medicine, {
      headers: this.getAuthHeaders()
    }).toPromise().then(result => {
      if (!result) {
        throw new Error('Medicine creation failed: No response received');
      }
      return result;
    }).catch(err => {
      this.handleAuthError(err);
      throw err;
    });
  }

  updateMedicine(id: string, updates: Partial<Medicine>): Promise<Medicine> {
    return this.http.put<Medicine>(`${environment.apiUrl}/api/medicine/${id}`, updates, {
      headers: this.getAuthHeaders()
    }).toPromise().then(result => {
      if (!result) {
        throw new Error('Medicine update failed: No response received');
      }
      return result;
    }).catch(err => {
      this.handleAuthError(err);
      throw err;
    });
  }

  deleteMedicine(id: string): Promise<any> {
    return this.http.delete(`${environment.apiUrl}/api/medicine/${id}`, {
      headers: this.getAuthHeaders()
    }).toPromise().catch(err => {
      this.handleAuthError(err);
      throw err;
    });
  }

  checkMedicineAlerts(): Promise<Medicine[]> {
    return this.http.get<Medicine[]>(`${environment.apiUrl}/api/medicine/alerts/due`, {
      headers: this.getAuthHeaders()
    }).toPromise().then(result => result ?? []).catch(err => {
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