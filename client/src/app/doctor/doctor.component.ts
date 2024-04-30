import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Role } from '../login/api.service';
import { Model } from './types';
import { AddPatientComponent } from './add-patient/add-patient.component';

@Component({
  selector: 'doctor',
  standalone: true,
  imports: [CommonModule, AddPatientComponent],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
})
export class DoctorComponent implements OnInit {
  models: WritableSignal<Model[]> = signal([]);
  show: WritableSignal<boolean> = signal(false);

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    if (sessionStorage.getItem('role') !== Role.DOCTOR) {
      this.router.navigate(['/']);
    }
  }

  async ngOnInit(): Promise<void> {
    this.models.set(await this.apiService.getModels());
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  closeAddPatient() {
    this.show.set(false);
  }
}
