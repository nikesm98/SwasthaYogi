import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Client';
  message = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getProfile().subscribe((res: any) => {
      this.message = res;
    });
  }
}
