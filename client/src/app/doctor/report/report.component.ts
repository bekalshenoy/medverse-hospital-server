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
  sectionsForm: FormGroup = new FormGroup({
    sectionsFormArray: new FormArray<FormGroup>([]),
  });
  sections = input<Section[]>();
  task = input<string>();
  reportId = input<number>();
  details = input<{ question: string; answer: string }[]>([]);
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

  get sectionsFormArray(): FormArray<FormGroup> {
    return this.sectionsForm.get('sectionsFormArray') as FormArray<FormGroup>;
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

  // moveUp(index: number) {
  //   console.log('mu', index);
  //   if (index !== 0) {
  //     const currentSection = this.sectionsFormArray.at(index);
  //     this.sectionsFormArray.removeAt(index);
  //     this.sectionsFormArray.insert(index - 1, currentSection);
  //   }
  // }

  // moveDown(index: number) {
  //   console.log('md', index);
  //   if (index !== this.sectionsFormArray.length - 1) {
  //     const currentSection = this.sectionsFormArray.at(index);
  //     this.sectionsFormArray.removeAt(index);
  //     this.sectionsFormArray.insert(index + 1, currentSection);
  //   }
  // }

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
