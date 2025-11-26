import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}

export interface Hotel extends Models.Document {
  name: string;
  location: string;
  description?: string;
}

export interface Room extends Models.Document {
  hotelId: string;
  label: string;
  type: string;
  capacity: number;
  amenities: string[];
  rate: number;
  availableFrom: Date;
  availableTo: Date;
}

export interface Guest extends Models.Document {
  name: string;
  email: string;
  phone: string;
  purpose: string;
}

export interface Booking extends Models.Document {
  guest: Guest;
  room: Room;
  status: Status;
  checkIn: Date;
  checkOut: Date;
  specialRequests?: string;
  channel: "web" | "sms" | "admin";
}