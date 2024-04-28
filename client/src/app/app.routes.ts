import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DoctorComponent } from './doctor/doctor.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'doctor',
    component: DoctorComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
];
