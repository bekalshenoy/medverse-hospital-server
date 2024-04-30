import { CommonModule } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  currentSection: WritableSignal<number> = signal(1);
  loginForm: FormGroup = new FormGroup({
    userId: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  async login(): Promise<void> {
    const { userId, password } = this.loginForm.value;

    if (this.currentSection() == 1) {
      await this.apiService.loginDoctor(userId, password);
      this.router.navigate(['/doctor']);
    } else if (this.currentSection() == 2) {
      await this.apiService.loginAdmin(userId, password);
      this.router.navigate(['/admin']);
    }
  }
}
