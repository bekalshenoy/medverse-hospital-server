import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Role } from '../login/api.service';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
})
export class DoctorComponent {
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    if (sessionStorage.getItem('role') !== Role.DOCTOR) {
      this.router.navigate(['/']);
    }
  }
}
