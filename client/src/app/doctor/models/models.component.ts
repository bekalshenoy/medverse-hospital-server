import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Model } from '../types';

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [],
  templateUrl: './models.component.html',
  styleUrl: './models.component.css',
})
export class ModelsComponent implements OnInit {
  models: WritableSignal<Model[]> = signal([]);

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.models.set(await this.apiService.getModels());
  }

  goToModel(index: number, modelId: number) {
    sessionStorage.setItem('model', JSON.stringify(this.models()[index]));
    this.router.navigate(['/doctor/model/' + modelId]);
  }
}
