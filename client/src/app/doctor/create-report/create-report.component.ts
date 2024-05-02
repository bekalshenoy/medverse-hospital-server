import {
  AfterViewInit,
  Component,
  WritableSignal,
  signal,
} from '@angular/core';
import { Section } from '../types.js';
import { recorder } from './recorder.util';
import { ReportComponent } from '../report/report.component.js';
import { ApiService } from '../api.service.js';

@Component({
  selector: 'create-report',
  standalone: true,
  imports: [ReportComponent],
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css', './recorder.css'],
})
export class CreateReportComponent implements AfterViewInit {
  sections: WritableSignal<Section[]> = signal([]);

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    recorder(this.afterRecord.bind(this));
  }

  afterRecord(blob: Blob) {
    const reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      let base64: string = reader.result as string;
      base64 = base64.split(',')[1];
      this.setSections(await this.apiService.generateReport(base64));
    };
  }

  setSections(sections: Section[]) {
    this.sections.set(sections);
  }
}
