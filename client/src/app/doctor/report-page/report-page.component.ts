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
  reportId: WritableSignal<string> = signal('');
  getReportForm: FormGroup = new FormGroup({
    dob: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.reportId.set(this.route.snapshot.paramMap.get('id') as string);
  }

  async showReport() {
    const { dob, password } = this.getReportForm.value;
    this.sections.set(
      (await this.apiService.getReport(this.reportId(), password, dob)).section,
    );
  }

  setSections(sections: Section[]) {
    this.sections.set(sections);
  }
}
