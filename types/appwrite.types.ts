// types/appwrite.types.ts
import { Models } from "node-appwrite";

// Base document with Appwrite's default fields + your custom fields
export interface BaseDocument extends Models.Document {
  // Add your custom fields here that exist in ALL your collections
  [key: string]: any; // This allows any additional properties
}

// Specific collection types
export interface Booking extends BaseDocument {
  guestId: string;
  roomId: string;
  hotelId?: string;
  roomType: string;
  status: Status;
  checkIn: Date;
  checkOut: Date;
  specialRequests?: string;
  channel: "web" | "sms" | "admin";
  purpose?: string;
  cancellationReason?: string | null;
}

export interface Room extends BaseDocument {
  hotelId: string;
  label: string;
  type: string;
  capacity: number;
  amenities: string[];
  rate: number;
  pricePerNight?: number;
  bedCount?: number;
  floorNumber?: number;
  availabilityStatus?: string;
  availableFrom: Date;
  availableTo: Date;
  description?: string;
  slug: string;
  image?: string;
}

export interface Hotel extends BaseDocument {
  name: string;
  location: string;
  description?: string;
  amenities?: string[];
  logo?: string;
  slug: string;
}

export interface Guest extends BaseDocument {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  guestsCount?: number;
}

// Keep your existing Patient and Appointment interfaces but extend BaseDocument
export interface Patient extends BaseDocument {
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

export interface Appointment extends BaseDocument {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}

// types/appwrite.types.ts
export type UpdateBookingParams = {
  bookingId: string;
  booking: {
    cancellationReason?: string;
    status?: Status;
    checkIn?: Date;
    checkOut?: Date;
    specialRequests?: string;
    roomId?: string;
    roomType?: string;
    hotelId?: string;
  };
  type: "cancel" | "schedule" | "update";
  timeZone: string;
};

export type CreateBookingParams = {
  guestId?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  roomId: string;
  roomType: string;
  hotelId?: string;
  status: Status;
  checkIn: Date;
  checkOut: Date;
  specialRequests?: string;
  channel?: "web" | "sms" | "admin";
  purpose?: string;
  guestsCount?: number;
};

export type Status = "pending" | "scheduled" | "cancelled";
