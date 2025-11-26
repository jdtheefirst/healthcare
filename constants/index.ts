export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const BookingPurposes: BookingPurpose[] = [
  "Business",
  "Leisure",
  "Group/Event",
];

export const HotelRoomTypes = [
  {
    id: "skyline-suite",
    name: "Skyline Suite",
    type: "Suite",
    capacity: 3,
    rate: 420,
    description: "Corner suite with wrap-around views and a dedicated workspace.",
    amenities: [
      "Dedicated work lounge",
      "In-room Peloton bike",
      "Late checkout syncs with doctor follow-ups",
    ],
  },
  {
    id: "wellness-floor",
    name: "Wellness Floor Deluxe",
    type: "King",
    capacity: 2,
    rate: 260,
    description:
      "Sound-proofed room optimized for recovery—mirrors post-op suites.",
    amenities: [
      "Circadian lighting package",
      "Nurse-call style service button",
      "Filtered air-monitoring aligned with clinic alerts",
    ],
  },
  {
    id: "team-residence",
    name: "Team Residence",
    type: "Apartment",
    capacity: 6,
    rate: 680,
    description: "Multi-room layout built for medical missions or corporate pods.",
    amenities: [
      "Multi-room access control",
      "Shared calendar locks",
      "Bulk SMS confirmations",
    ],
  },
];

export const DualFlowMap = [
  {
    clinic: {
      title: "Patients",
      subtitle: "Registered once, reused for every appointment.",
    },
    hotel: {
      title: "Guests",
      subtitle: "Same Appwrite collection with hospitality metadata.",
    },
    shared: "Uses identical onboarding form logic & validation.",
  },
  {
    clinic: {
      title: "Doctors & schedules",
      subtitle: "Availability grid drives appointment options.",
    },
    hotel: {
      title: "Rooms & availability",
      subtitle: "Calendar-backed inventory with per-room rules.",
    },
    shared: "Shared date picker & conflict detection utilities.",
  },
  {
    clinic: {
      title: "Appointments",
      subtitle: "Pending → Scheduled → Cancelled pipeline.",
    },
    hotel: {
      title: "Bookings",
      subtitle: "Inquiry → Confirmed → Cancelled pipeline.",
    },
    shared: "Same status enum, modal workflow, SMS hooks.",
  },
  {
    clinic: {
      title: "Medical notes",
      subtitle: "Rich-text notes attached to appointments.",
    },
    hotel: {
      title: "Special requests",
      subtitle: "Requests stored on booking to inform ops.",
    },
    shared: "Textarea component + audit trail stays untouched.",
  },
  {
    clinic: {
      title: "Billing readiness",
      subtitle: "Payment intent issued post consultation.",
    },
    hotel: {
      title: "Payment readiness",
      subtitle: "Same stripe/webhook path for deposits.",
    },
    shared: "One payment integration powering both pillars.",
  },
];

export const AdaptableComponents = [
  {
    title: "Date & availability engine",
    description:
      "One React DatePicker + Appwrite query handles appointment slots and hotel check-in/check-out windows.",
  },
  {
    title: "Reusable form system",
    description:
      "Hook-form + Zod stack drives both patient intake and guest registration with zero branching.",
  },
  {
    title: "Notification mesh",
    description:
      "Appwrite Messaging + Twilio connector broadcasts confirmations, reminders, and cancellations for any industry.",
  },
  {
    title: "Admin workflow controls",
    description:
      "The same modal + status badge components approve, schedule, or cancel clinic visits and hotel stays.",
  },
];

export const HotelBookingsMock = [
  {
    id: "BK-49021",
    guestName: "Nia Patel",
    phone: "+14155550123",
    roomType: "Skyline Suite",
    status: "scheduled",
    purpose: "Business",
    checkIn: new Date(Date.now() + 86400000 * 2).toISOString(),
    checkOut: new Date(Date.now() + 86400000 * 5).toISOString(),
    specialRequests: "Need ergonomic chair + 2 external monitors.",
  },
  {
    id: "BK-49022",
    guestName: "Lucas Martin",
    phone: "+14155550678",
    roomType: "Wellness Floor Deluxe",
    status: "pending",
    purpose: "Leisure",
    checkIn: new Date(Date.now() + 86400000 * 7).toISOString(),
    checkOut: new Date(Date.now() + 86400000 * 10).toISOString(),
    specialRequests: "Request in-room IV recovery kit.",
  },
  {
    id: "BK-49019",
    guestName: "Team Horizon",
    phone: "+17025551234",
    roomType: "Team Residence",
    status: "cancelled",
    purpose: "Group/Event",
    checkIn: new Date(Date.now() + 86400000).toISOString(),
    checkOut: new Date(Date.now() + 86400000 * 4).toISOString(),
    specialRequests: "Late check-in, multiple keys, airport shuttle manifest.",
  },
];

export const HotelMetricSnapshot = {
  confirmed: 24,
  pending: 6,
  cancelled: 2,
  smsSentThisWeek: 56,
};

export const FeatureComparisonMatrix = [
  {
    feature: "User onboarding",
    clinic: "PatientForm.tsx with ID verification + consent",
    hotel: "GuestForm reusing exact validation + file upload hooks",
  },
  {
    feature: "Resource selection",
    clinic: "Doctors array drives Select component & schedule gating",
    hotel: "HotelRoomTypes array plugs into the same Select + availability logic",
  },
  {
    feature: "Scheduling logic",
    clinic: "AppointmentForm + Appwrite `appointments` collection",
    hotel: "HotelBookingForm + `bookings` collection with identical status schema",
  },
  {
    feature: "Notes & requests",
    clinic: "Medical notes stored per appointment",
    hotel: "Special requests stored per booking; same textarea + audit trail",
  },
  {
    feature: "Notifications",
    clinic: "Appwrite Messaging SMS reminders",
    hotel: "Same messaging action for confirmations, reminders, cancellations",
  },
  {
    feature: "Admin workflows",
    clinic: "Admin modal updates status + triggers SMS",
    hotel: "Admin tab reuses same modal concept for rooms (roadmap)",
  },
];