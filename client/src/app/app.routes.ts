import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DoctorComponent } from './doctor/doctor.component';
import { LoginComponent } from './login/login.component';
import { CreateReportComponent } from './doctor/create-report/create-report.component';
import { ReportsComponent } from './doctor/reports/reports.component';
import { ReportPageComponent } from './doctor/report-page/report-page.component';
import { ModelsComponent } from './doctor/models/models.component';
import { ModelPageComponent } from './doctor/model-page/model-page.component';

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
    redirectTo: 'doctor/models',
    pathMatch: 'full',
  },
  {
    path: 'doctor',
    component: DoctorComponent,
    children: [
      {
        path: 'models',
        component: ModelsComponent,
      },
      {
        path: 'model/:id',
        component: ModelPageComponent,
      },
      {
        path: 'create-report',
        component: CreateReportComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'report/:id',
        component: ReportPageComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
];
