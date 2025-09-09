import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/api/login`, { email, password })
      .toPromise()
      .then(res => {
        if (res && res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
          return true;
        }
        return false;
      })
      .catch(err => {
        this.handleAuthError(err);
        throw err;
      });
  }

  register(email: string, password: string, name: string): Promise<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/api/register`, { email, password, name })
      .toPromise()
      .then(res => {
        // Optionally, auto-login after registration
        return this.login(email, password);
      })
      .catch(err => {
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

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}