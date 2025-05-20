import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { environment }   from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  // login
  login(payload: { username: string; password: string }) {
  return this.http.post<{ token: string }>(
    `${this.base}/user/login`,
    payload
  );
}

  getProfile() {
    return this.http.get(`${this.base}/user/profile`);
  }

  // …and any admin calls:
  listAllUsers() {
    return this.http.get(`${this.base}/admin/users`);
  }
}
