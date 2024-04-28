import { Injectable } from '@angular/core';

export enum Role {
  ADMIN = 'ROLE_ADMIN',
  DOCTOR = 'ROLE_DOCTOR',
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = '/api/v1';

  constructor() {}

  async loginDoctor(userId: string, password: string): Promise<void> {
    const response: Response = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        password: password,
      }),
    });

    await this.checkResponse(response);

    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('role', Role.DOCTOR);
    sessionStorage.setItem('token', (await response.json()).access_token);
  }

  async loginAdmin(userId: string, password: string): Promise<void> {
    const response: Response = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        password: password,
      }),
    });

    await this.checkResponse(response);

    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('role', Role.ADMIN);
    sessionStorage.setItem('token', (await response.json()).access_token);
  }

  private async checkResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const errorResponse = await response.json();

      alert(errorResponse.message);

      throw new Error(errorResponse);
    }
  }
}
