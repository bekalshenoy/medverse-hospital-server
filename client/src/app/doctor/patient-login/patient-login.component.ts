import { CommonModule } from '@angular/common';
import { Component, WritableSignal, input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Section } from '../types';
import { AddPatientComponent } from '../add-patient/add-patient.component';
import { ModelWrapperComponent } from '../model-wrapper/model-wrapper.component';

@Component({
  selector: 'patient-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AddPatientComponent,
    ModelWrapperComponent,
  ],
  templateUrl: './patient-login.component.html',
  styleUrl: './patient-login.component.css',
})
export class PatientLoginComponent {
  show: WritableSignal<boolean> = signal(false);
  currentSection: WritableSignal<number> = signal(1);
  patientLoginForm: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  familyLoginForm: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    memberId: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  sections = input<Section[]>();
  task = input<string>();
  reportId = input<number>();

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  async patientLogin() {
    try {
      if (this.patientLoginForm.invalid) {
        alert('Please fill all the fields');
      } else {
        const { userId, dob, password } = this.patientLoginForm.value;

        await this.apiService.checkPatient(userId);
        await this.apiService.checkPassword(userId, password, dob);

        if (this.task() === 'Save') {
          await this.apiService.addReport(
            this.sections() as Section[],
            userId,
            dob,
            password,
          );
        } else {
          await this.apiService.updateReport(
            this.sections() as Section[],
            this.reportId() as number,
            userId,
            dob,
            password,
          );
        }
        this.router.navigate(['/doctor']);
      }
    } catch (e) {
      alert('Patient id not found');
      if (this.task() === 'Save') {
        this.show.set(true);
      }
    }
  }

  async familyLogin() {
    try {
      if (this.familyLoginForm.invalid) {
        alert('Please fill all the fields');
      } else {
        const { userId, dob, memberId, password } = this.familyLoginForm.value;

        await this.apiService.checkPatient(userId);
        await this.apiService.checkPasswordWithFamily(
          userId,
          password,
          memberId,
          dob,
        );
        if (this.task() === 'Save') {
          await this.apiService.addReportMember(
            this.sections() as Section[],
            userId,
            dob,
            memberId,
            password,
          );
        } else {
          await this.apiService.updateReportMember(
            this.sections() as Section[],
            this.reportId() as number,
            userId,
            dob,
            memberId,
            password,
          );
        }
        this.router.navigate(['/doctor']);
      }
    } catch (e) {
      alert('Family member id or patient id not found');
      if (this.task() === 'Save') {
        this.show.set(true);
      }
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  closeAddPatient() {
    this.show.set(false);
  }
}
