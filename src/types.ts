export interface Student {
  id?: string;
  name: string;
  registerNumber: string;
  dateOfBirth: string;
  class: string;
  createdAt: any; // Firestore Timestamp
}

export type Page = 'home' | 'success' | 'admin';
