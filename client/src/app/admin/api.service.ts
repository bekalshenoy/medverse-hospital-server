import { Injectable } from '@angular/core';
import { Model, Payment, Report, Restricted, User } from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = '/api/v1/admin';

  constructor() {}

  async addDoctor(user: User): Promise<void> {
    const response: Response = await fetch(`${this.baseUrl}/doctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token(),
      },
      body: JSON.stringify(user),
    });

    await this.checkResponse(response);
  }

  async addRestrictedModel(restricted: Restricted): Promise<void> {
    const response: Response = await fetch(`${this.baseUrl}/restricted`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token(),
      },
      body: JSON.stringify(restricted),
    });

    await this.checkResponse(response);
  }

  async getDoctors(): Promise<User[]> {
    const response: Response = await fetch(`${this.baseUrl}/doctor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token(),
      },
    });

    await this.checkResponse(response);

    return await response.json();
  }

  async getModels(): Promise<Model[]> {
    const response: Response = await fetch(`${this.baseUrl}/model`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token(),
      },
    });

    await this.checkResponse(response);

    return await response.json();
  }

  async getRestrictedModels(): Promise<number[]> {
    const response: Response = await fetch(`${this.baseUrl}/restricted`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token(),
      },
    });

    await this.checkResponse(response);

    const restrictedModels: Restricted[] = await response.json();

    return Array.from(
      restrictedModels.map((restrictedModel: Restricted) => {
        return restrictedModel.modelId;
      }),
    );
  }

  async getReports(): Promise<Report[]> {
    const response: Response = await fetch(`${this.baseUrl}/report`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token(),
      },
    });

    await this.checkResponse(response);

    return await response.json();
  }

  async getPayments(): Promise<Payment[]> {
    const response: Response = await fetch(`${this.baseUrl}/payment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token(),
      },
    });

    await this.checkResponse(response);

    return await response.json();
  }

  async removeDoctor(userId: string): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/doctor/${encodeURIComponent(userId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.token(),
        },
      },
    );

    await this.checkResponse(response);
  }

  async deleteReport(reportId: number): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/report/${reportId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.token(),
        },
      },
    );

    await this.checkResponse(response);
  }

  async removeRestrictedModel(modelId: number): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/restricted/${modelId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.token(),
        },
      },
    );

    await this.checkResponse(response);
  }

  token(): string {
    return 'Bearer ' + sessionStorage.getItem('token');
  }

  private async checkResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const errorResponse = await response.json();

      alert(errorResponse.message);

      throw new Error(errorResponse);
    }
  }
}
