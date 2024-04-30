import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ModelWrapperComponent } from '../model-wrapper/model-wrapper.component';

@Component({
  selector: 'add-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModelWrapperComponent],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css',
})
export class AddPatientComponent {
  addPatientForm: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    family: new FormControl('', [Validators.required]),
  });
  OnCloseAddPatient = output();

  constructor(private apiService: ApiService) {}

  async onSubmit() {
    if (this.addPatientForm.valid) {
      await this.apiService.addPatient({
        ...this.addPatientForm.value,
        family: [
          {
            memberId: this.addPatientForm.value.family,
          },
        ],
      });
      this.addPatientForm.reset();
      this.OnCloseAddPatient.emit();
    } else {
      alert('Please fill all the fields');
    }
  }

  close() {
    this.OnCloseAddPatient.emit();
  }
}
