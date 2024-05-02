import { Injectable } from '@angular/core';
import { Model, Patient, Report, Section } from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = '/api/v1/doctor';

  constructor() {}

  async addReport(
    sections: Section[],
    patientId: string,
    dob: string,
    password: string,
  ): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/report?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'POST',
        headers: {
          Authorization: this.token(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId,
          section: sections,
        }),
      },
    );

    await this.checkResponse(response);
  }

  async addReportMember(
    sections: Section[],
    patientId: string,
    dob: string,
    memberId: string,
    password: string,
  ): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/report/member/${memberId}?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'POST',
        headers: {
          Authorization: this.token(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId,
          section: sections,
        }),
      },
    );

    await this.checkResponse(response);
  }

  async addPatient(patient: Patient): Promise<void> {
    const response: Response = await fetch(`${this.baseUrl}/patient`, {
      method: 'POST',
      headers: {
        Authorization: this.token(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });

    await this.checkResponse(response);
  }

  async updateReport(
    sections: Section[],
    reportId: number,
    patientId: string,
    dob: string,
    password: string,
  ): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/report?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'PUT',
        headers: {
          Authorization: this.token(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: reportId,
          patientId: patientId,
          section: sections,
        }),
      },
    );

    await this.checkResponse(response);
  }

  async updateReportMember(
    sections: Section[],
    reportId: number,
    patientId: string,
    dob: string,
    memberId: string,
    password: string,
  ): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/report/member/${memberId}?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'PUT',
        headers: {
          Authorization: this.token(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: reportId,
          patientId: patientId,
          section: sections,
        }),
      },
    );

    await this.checkResponse(response);
  }

  async checkPatient(patientId: string): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/patient/${patientId}/check`,
      {
        method: 'GET',
        headers: {
          Authorization: this.token(),
        },
      },
    );

    await this.checkResponse(response);
  }

  async checkPassword(
    patientId: string,
    password: string,
    dob: string,
  ): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/patient/${patientId}/password?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'GET',
        headers: {
          Authorization: this.token(),
        },
      },
    );

    await this.checkResponse(response);

    const patient: Patient = await response.json();

    sessionStorage.setItem('patientId', patient.userId);
    sessionStorage.setItem('name', patient.name);
    sessionStorage.setItem('phone', patient.phone);
    sessionStorage.setItem('location', patient.location);
  }

  async checkPasswordWithFamily(
    patientId: string,
    password: string,
    memberId: string,
    dob: string,
  ): Promise<void> {
    const response: Response = await fetch(
      `${this.baseUrl}/patient/${patientId}/member/${memberId}/password?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'GET',
        headers: {
          Authorization: this.token(),
        },
      },
    );

    await this.checkResponse(response);

    const patient: Patient = await response.json();

    sessionStorage.setItem('patientId', patient.userId);
    sessionStorage.setItem('name', patient.name);
    sessionStorage.setItem('phone', patient.phone);
    sessionStorage.setItem('location', patient.location);
  }

  async getReports(): Promise<Report[]> {
    const response: Response = await fetch(`${this.baseUrl}/report`, {
      method: 'GET',
      headers: {
        Authorization: this.token(),
        'Content-Type': 'application/json',
      },
    });

    await this.checkResponse(response);

    return await response.json();
  }

  async getReportsPatient(patientId: string): Promise<Report[]> {
    const response: Response = await fetch(
      `${this.baseUrl}/report/patient/${patientId}`,
      {
        method: 'GET',
        headers: {
          Authorization: this.token(),
          'Content-Type': 'application/json',
        },
      },
    );

    await this.checkResponse(response);

    return await response.json();
  }

  async getReport(
    reportId: number,
    password: string,
    dob: string,
  ): Promise<Report> {
    const response: Response = await fetch(
      `${this.baseUrl}/report/${reportId}?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'GET',
        headers: {
          Authorization: this.token(),
          'Content-Type': 'application/json',
        },
      },
    );

    await this.checkResponse(response);

    return await response.json();
  }

  async getReportMember(
    reportId: number,
    memberId: string,
    dob: string,
    password: string,
  ): Promise<Report> {
    const response: Response = await fetch(
      `${this.baseUrl}/report/${reportId}/member/${memberId}?` +
        new URLSearchParams({
          dob: dob,
          password: password,
        }),
      {
        method: 'GET',
        headers: {
          Authorization: this.token(),
          'Content-Type': 'application/json',
        },
      },
    );

    await this.checkResponse(response);

    return await response.json();
  }

  async getModels(): Promise<Model[]> {
    const response: Response = await fetch(`${this.baseUrl}/model`, {
      method: 'GET',
      headers: {
        Authorization: this.token(),
        'Content-Type': 'application/json',
      },
    });

    await this.checkResponse(response);

    return await response.json();
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
