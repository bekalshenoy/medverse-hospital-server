import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReportComponent } from '../report/report.component';
import { CommonModule } from '@angular/common';
import { Section } from '../types';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'report-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ReportComponent],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.css',
})
export class ReportPageComponent implements OnInit {
  sections: WritableSignal<Section[]> = signal([]);
  reportId: WritableSignal<number> = signal(0);
  currentSection: WritableSignal<number> = signal(1);
  details: WritableSignal<{ question: string; answer: string }[]> = signal([]);
  getReportForm: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  getReportMemberForm: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    memberId: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {
    this.details.set([
      {
        question: 'Patient ID',
        answer: sessionStorage.getItem('patientId') as string,
      },
      {
        question: 'Patient Name',
        answer: sessionStorage.getItem('name') as string,
      },
      {
        question: 'Patient Phone',
        answer: sessionStorage.getItem('phone') as string,
      },
    ]);
  }

  ngOnInit(): void {
    this.reportId.set(Number(this.route.snapshot.paramMap.get('id')) as number);
  }

  async showReport() {
    const { userId, dob, password } = this.getReportForm.value;

    await this.apiService.checkPassword(userId, password, dob);

    this.sections.set(
      (await this.apiService.getReport(this.reportId(), password, dob)).section,
    );
  }

  async showReportMember() {
    const { userId, dob, memberId, password } = this.getReportForm.value;

    await this.apiService.checkPasswordWithFamily(
      userId,
      password,
      memberId,
      dob,
    );

    this.sections.set(
      (
        await this.apiService.getReportMember(
          this.reportId(),
          memberId,
          password,
          dob,
        )
      ).section,
    );
  }

  setSections(sections: Section[]) {
    this.sections.set(sections);
  }
}
