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

// Update the image URLs to use Unsplash
const roomImages = {
  suite:
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop",
  king: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
  queen:
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop",
  twin: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop",
  apartment:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop",
  accessible:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  petFriendly:
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  wellness:
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop",
  family:
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&h=300&fit=crop",
  honeymoon:
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop",
};

export const HotelRoomTypes = [
  {
    id: "skyline-suite",
    name: "Skyline Suite",
    type: "Suite",
    capacity: 3,
    rate: 420,
    description:
      "Corner suite with wrap-around city views and a dedicated workspace. Perfect for business travelers or romantic getaways.",
    amenities: [
      "Dedicated work lounge",
      "In-room Peloton bike",
      "Late checkout syncs",
      "Premium WiFi",
      "Nespresso machine",
      "Smart TV",
    ],
    image: roomImages.suite,
  },
  {
    id: "wellness-floor-deluxe",
    name: "Wellness Floor Deluxe",
    type: "King",
    capacity: 2,
    rate: 260,
    description:
      "Sound-proofed room optimized for recovery with circadian lighting and air quality monitoring. Ideal for post-operative stays or wellness retreats.",
    amenities: [
      "Circadian lighting package",
      "Nurse-call style service button",
      "Filtered air-monitoring",
      "Blackout curtains",
      "Yoga mat & props",
      "Essential oil diffuser",
    ],
    image: roomImages.king,
  },
  {
    id: "team-residence",
    name: "Team Residence",
    type: "Apartment",
    capacity: 6,
    rate: 680,
    description:
      "Multi-room layout built for medical missions or corporate pods. Features separate living area and multiple bedrooms.",
    amenities: [
      "Multi-room access control",
      "Shared calendar locks",
      "Bulk SMS confirmations",
      "Full kitchenette",
      "Dining area",
      "Multiple bathrooms",
    ],
    image: roomImages.apartment,
  },
  {
    id: "executive-king",
    name: "Executive King",
    type: "King",
    capacity: 2,
    rate: 320,
    description:
      "Spacious king room with executive desk, premium amenities, and enhanced connectivity for business professionals.",
    amenities: [
      "Executive desk with charging ports",
      "Premium WiFi",
      "Mini bar",
      "Bathrobe & slippers",
      "24/7 room service",
      "Daily newspaper",
    ],
    image: roomImages.king,
  },
  {
    id: "family-connector",
    name: "Family Connector Suite",
    type: "Suite",
    capacity: 5,
    rate: 550,
    description:
      "Connecting rooms perfect for families, featuring separate sleeping areas and child-friendly amenities.",
    amenities: [
      "Connecting rooms",
      "Child safety features",
      "Board games & toys",
      "Microwave & fridge",
      "Baby cot available",
      "Family movie library",
    ],
    image: roomImages.family,
  },
  {
    id: "accessible-deluxe",
    name: "Accessible Deluxe",
    type: "Queen",
    capacity: 2,
    rate: 280,
    description:
      "Fully accessible room designed for comfort and ease of movement, featuring roll-in shower and lowered amenities.",
    amenities: [
      "Roll-in shower",
      "Lowered counters & closet",
      "Visual fire alarms",
      "Wider doorways",
      "Emergency call system",
      "Accessible balcony",
    ],
    image: roomImages.accessible,
  },
  {
    id: "pet-friendly-queen",
    name: "Pet-Friendly Queen",
    type: "Queen",
    capacity: 2,
    rate: 240,
    description:
      "Comfortable queen room welcoming your furry friends with special pet amenities and easy outdoor access.",
    amenities: [
      "Pet bed & bowls",
      "Welcome pet treat",
      "Easy outdoor access",
      "Pet cleaning station",
      "Local pet services guide",
      "Extra cleaning fee waived",
    ],
    image: roomImages.petFriendly,
  },
  {
    id: "honeymoon-suite",
    name: "Honeymoon Suite",
    type: "Suite",
    capacity: 2,
    rate: 490,
    description:
      "Romantic suite with champagne welcome, rose petal turndown service, and private balcony with stunning views.",
    amenities: [
      "Champagne on arrival",
      "Rose petal turndown",
      "Private balcony",
      "Jacuzzi tub",
      "Romantic dining setup",
      "Late checkout included",
    ],
    image: roomImages.honeymoon,
  },
  {
    id: "standard-queen",
    name: "Standard Queen",
    type: "Queen",
    capacity: 2,
    rate: 180,
    description:
      "Comfortable and affordable queen room with all essential amenities for a pleasant stay.",
    amenities: [
      "Comfortable queen bed",
      "Smart TV",
      "Work desk",
      "Coffee maker",
      "Hair dryer",
      "Iron & board",
    ],
    image: roomImages.queen,
  },
  {
    id: "premium-twin",
    name: "Premium Twin",
    type: "Twin",
    capacity: 2,
    rate: 200,
    description:
      "Two comfortable twin beds perfect for friends or colleagues traveling together.",
    amenities: [
      "Two twin beds",
      "Shared work desk",
      "Individual reading lights",
      "Double vanity",
      "Smart TV",
      "Mini fridge",
    ],
    image: roomImages.twin,
  },
];

// You can also create room categories for filtering
export const RoomCategories = {
  SUITES: [
    "Skyline Suite",
    "Team Residence",
    "Family Connector Suite",
    "Honeymoon Suite",
  ],
  STANDARD: ["Executive King", "Standard Queen", "Premium Twin"],
  SPECIAL_NEEDS: [
    "Wellness Floor Deluxe",
    "Accessible Deluxe",
    "Pet-Friendly Queen",
  ],
};

// Room types for filtering
export const RoomTypeFilters = [
  "All Rooms",
  "Suite",
  "King",
  "Queen",
  "Twin",
  "Apartment",
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
    hotel:
      "HotelRoomTypes array plugs into the same Select + availability logic",
  },
  {
    feature: "Scheduling logic",
    clinic: "AppointmentForm + Appwrite `appointments` collection",
    hotel:
      "HotelBookingForm + `bookings` collection with identical status schema",
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
