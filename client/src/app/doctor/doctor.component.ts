import { Component, WritableSignal, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Role } from '../login/api.service';
import { AddPatientComponent } from './add-patient/add-patient.component';

@Component({
  selector: 'doctor',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    AddPatientComponent,
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
})
export class DoctorComponent {
  show: WritableSignal<boolean> = signal(false);

  constructor(private router: Router) {
    if (sessionStorage.getItem('role') !== Role.DOCTOR) {
      this.router.navigate(['/']);
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  closeAddPatient() {
    this.show.set(false);
  }
}
