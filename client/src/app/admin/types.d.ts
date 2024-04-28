export interface User {
  userId: string;
  name: string;
  password: string;
}

export interface Model {
  _count: {
    usage: number;
  };
  modelId: number;
  name: string;
  description: string;
  researcherId: string;
  cost: number;
  server: string;
}

export interface Restricted {
  modelId: number;
}

export interface Report {
  reportId: number;
  patientId: string;
  doctorId: string;
  createdAt: string;
  modifiedAt: string;
  sections: Section[];
}

export interface Section {
  sectionId: number;
  reportId: number;
  question: string;
  answer: string;
  position: number;
}

export interface Payment {
  paymentId: number;
  userId: string;
  modelId: number;
  amount: number;
  startDate: string;
  endDate: string;
}
