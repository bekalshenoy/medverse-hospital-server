import { Component, WritableSignal, signal } from '@angular/core';
import { ApiService } from '../api.service';
import { Report } from '../types';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'reports',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  reports: WritableSignal<Report[]> = signal([]);
  patientFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    Validators.maxLength(12),
  ]);

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  async fetchReports() {
    try {
      if (this.patientFormControl.invalid) {
        alert('Please enter a valid patient ID');
      } else {
        await this.apiService.checkPatient(this.patientFormControl.value);
        this.reports.set(
          await this.apiService.getReportsPatient(
            this.patientFormControl.value,
          ),
        );
      }
    } catch (e) {
      alert('Patient Not Found');
      console.log(e);
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
