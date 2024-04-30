import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  WritableSignal,
  input,
  output,
  signal,
} from '@angular/core';
import { PatientLoginComponent } from '../patient-login/patient-login.component';
import { Section } from '../types';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'report',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PatientLoginComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  show: WritableSignal<boolean> = signal(false);
  sectionsFormArray: FormArray<FormGroup> = new FormArray<FormGroup>([]);
  sectionsForm: FormGroup = new FormGroup({
    sectionsFormArray: this.sectionsFormArray,
  });
  sections = input<Section[]>();
  task = input<string>();
  reportId = input<string>();
  onSetSections = output<Section[]>();

  ngOnInit() {
    if (this.sections()) {
      (this.sections() as Section[]).forEach((section) => {
        this.sectionsFormArray.push(
          new FormGroup({
            question: new FormControl(section.question, [Validators.required]),
            answer: new FormControl(section.answer, [Validators.required]),
          }),
        );
      });
    }
  }

  addSection() {
    this.sectionsFormArray.push(
      new FormGroup({
        question: new FormControl('demo', [Validators.required]),
        answer: new FormControl('demo', [Validators.required]),
      }),
    );
  }

  removeSection(index: number) {
    this.sectionsFormArray.removeAt(index);
  }

  submitReport() {
    if (this.sectionsFormArray.valid) {
      this.setSections();
      this.show.set(true);
    } else {
      alert('Please fill all the fields');
    }
  }

  setSections() {
    this.onSetSections.emit(this.sectionsFormArray.value as Section[]);
  }
}
