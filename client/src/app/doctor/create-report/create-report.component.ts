import {
  AfterViewInit,
  Component,
  WritableSignal,
  signal,
} from '@angular/core';
import { Section } from '../types.js';
import { recorder } from './recorder.util';
import { ReportComponent } from '../report/report.component.js';

@Component({
  selector: 'create-report',
  standalone: true,
  imports: [ReportComponent],
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css', './recorder.css'],
})
export class CreateReportComponent implements AfterViewInit {
  sections: WritableSignal<Section[]> = signal([]);

  ngAfterViewInit() {
    recorder(this.afterRecord.bind(this));
  }

  afterRecord(blob: Blob) {
    console.log(blob);
    this.setSections([
      { question: 'blah', answer: 'blah' } as Section,
      { question: 'blah', answer: 'blah' } as Section,
    ]);
  }

  setSections(sections: Section[]) {
    this.sections.set(sections);
  }
}
