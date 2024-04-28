import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Model, Payment, Report, User } from './types';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Role } from '../login/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  doctors: WritableSignal<User[]> = signal([]);
  reports: WritableSignal<Report[]> = signal([]);
  payments: WritableSignal<Payment[]> = signal([]);
  models: WritableSignal<Model[]> = signal([]);
  restrictedModels: WritableSignal<number[]> = signal([]);
  currentSection: WritableSignal<number> = signal(1);
  doctorForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    userId: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    if (sessionStorage.getItem('role') !== Role.ADMIN) {
      this.router.navigate(['/']);
    }
  }

  async ngOnInit(): Promise<void> {
    this.doctors.set(await this.apiService.getDoctors());
    this.reports.set(await this.apiService.getReports());
    this.payments.set(await this.apiService.getPayments());
    this.models.set(await this.apiService.getModels());
    this.restrictedModels.set(await this.apiService.getRestrictedModels());
  }

  async addDoctor(): Promise<void> {
    await this.apiService.addDoctor(this.doctorForm.value as User);
    this.doctors.set(await this.apiService.getDoctors());
  }

  async removeDoctor(userId: string): Promise<void> {
    await this.apiService.removeDoctor(userId);
    this.doctors.set(await this.apiService.getDoctors());
  }

  async deleteReport(reportId: number): Promise<void> {
    await this.apiService.deleteReport(reportId);
    this.reports.set(await this.apiService.getReports());
  }

  async toggleRestrictedModel(modelId: number): Promise<void> {
    if (this.restrictedModels().includes(modelId)) {
      await this.apiService.removeRestrictedModel(modelId);
    } else {
      await this.apiService.addRestrictedModel({ modelId });
    }

    this.restrictedModels.set(await this.apiService.getRestrictedModels());
  }
}
