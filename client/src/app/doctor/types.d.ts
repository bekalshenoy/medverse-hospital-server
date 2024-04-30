export interface User {
  userId: string;
  name: string;
  password: string;
}

export interface Patient {
  userId: string;
  name: string;
  phone: string;
  location: string;
  dob: string;
  password: string;
  family: Family[];
}

export interface Family {
  userId: string;
  memberId: string;
}

export interface Model {
  usage: number;
  modelId: number;
  name: string;
  description: string;
  researcherId: string;
  cost: number;
  server: string;
}

export interface Report {
  reportId: number;
  patientId: string;
  doctorId: string;
  createdAt: string;
  modifiedAt: string;
  section: Section[];
}

export interface Section {
  sectionId: number;
  reportId: number;
  question: string;
  answer: string;
}
