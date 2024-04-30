import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DoctorComponent } from './doctor/doctor.component';
import { LoginComponent } from './login/login.component';
import { CreateReportComponent } from './doctor/create-report/create-report.component';
import { ReportsComponent } from './doctor/reports/reports.component';
import { ReportPageComponent } from './doctor/report-page/report-page.component';

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
    path: 'doctor/create-report',
    component: CreateReportComponent,
  },
  {
    path: 'doctor/reports',
    component: ReportsComponent,
  },
  {
    path: 'doctor/report/:id',
    component: ReportPageComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
];
