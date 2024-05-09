import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Model } from '../types';

@Component({
  selector: 'app-model-page',
  standalone: true,
  imports: [],
  templateUrl: './model-page.component.html',
  styleUrl: './model-page.component.css',
})
export class ModelPageComponent implements OnInit {
  result: WritableSignal<[string, number][]> = signal([]);
  kidneyResult: WritableSignal<string> = signal('');
  brainResult: WritableSignal<string> = signal('');
  model: WritableSignal<Model | null> = signal(null);

  ngOnInit() {
    this.model.set(
      JSON.parse(sessionStorage.getItem('model') as string) as Model,
    );
  }

  async fetchResult(inputElement: HTMLInputElement) {
    const file = (inputElement.files as FileList)[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = (
        (reader.result as string).replace('data:', '') as string
      ).replace(/^.+,/, '');

      const result = await (
        await fetch((this.model() as Model).server, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: 'dontshare',
            input: base64String,
          }),
        })
      ).json();

      this.result.set(
        Object.entries(result).sort(([, b]: any, [, a]: any) => a - b) as [
          string,
          number,
        ][],
      );
    };
    reader.readAsDataURL(file);
  }

  async fetchBrainResult(inputElement: HTMLInputElement) {
    const file = (inputElement.files as FileList)[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = (
        (reader.result as string).replace('data:', '') as string
      ).replace(/^.+,/, '');

      const result = await (
        await fetch((this.model() as Model).server, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: 'dontshare',
            input: base64String,
          }),
        })
      ).json();

      this.brainResult.set(result.output);
    };
    reader.readAsDataURL(file);
  }

  async fetchKidneyResult(inputElement: HTMLInputElement) {
    const file = (inputElement.files as FileList)[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = (
        (reader.result as string).replace('data:', '') as string
      ).replace(/^.+,/, '');

      const result = await (
        await fetch((this.model() as Model).server, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: 'dontshare',
            input: base64String,
          }),
        })
      ).json();

      this.kidneyResult.set(result.output);
    };
    reader.readAsDataURL(file);
  }
}
