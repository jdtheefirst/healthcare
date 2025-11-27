/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";
declare type BookingPurpose = "Business" | "Leisure" | "Group/Event";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
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

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Appointment;
  type: string;
};

declare interface CreateGuestParams {
  name: string;
  email: string;
  phone: string;
  purpose: BookingPurpose;
  guestsCount?: number;
  vipNotes?: string;
  consent?: boolean;
}

declare interface CreateBookingParams {
  guestId?: string;
  roomId: string;
  hotelId?: string;
  status: Status;
  checkIn: Date;
  checkOut: Date;
  specialRequests?: string;
  purpose?: BookingPurpose;
  channel?: "web" | "sms" | "admin";
  // For creating guest on the fly
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  guestsCount?: number;
  roomType?: string; // For display when room doesn't exist yet
}
