<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
  </div>

  <h3 align="center">Dual-Industry Booking Operating System</h3>

  <p align="center">
    One platform for healthcare clinics and hotels - same booking engine, different industries.
  </p>
</div>

## 🚀 Overview

A flexible booking management system that serves both **healthcare clinics** and **hotels** with the same underlying technology. Patients become guests, doctors become rooms, appointments become bookings - all powered by a unified Appwrite backend.

### 🎯 Dual-Industry Capability

- **For Healthcare**: Patient registration, doctor appointments, medical history tracking
- **For Hotels**: Guest management, room bookings, special requests handling
- **Shared Core**: Scheduling, SMS notifications, admin dashboard, payment integration ready

## 📚 Documentation Suite

### **For Business Clients**

- **[Clinic System Guide](./docs/CLINIC_SYSTEM_GUIDE.md)** - Complete guide for healthcare clients
- **[Hotel System Guide](./docs/HOTEL_SYSTEM_GUIDE.md)** - Complete guide for hotel clients

### **For Technical Teams**

- **[System Overview](./docs/SYSTEM_OVERVIEW.md)** - Technical architecture and customization
- **[Presentation Template](./docs/PRESENTATION_TEMPLATE.md)** - Sales and demo materials

## ⚙️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Backend**: Appwrite (Database, Storage, Functions)
- **UI Components**: ShadCN/UI
- **Notifications**: Twilio SMS
- **Monitoring**: Sentry

## 🔋 Core Features

### 🏥 Healthcare Features

- Patient registration and profile management
- Doctor appointment scheduling
- Medical history and consent forms
- Insurance information tracking
- SMS appointment confirmations and reminders

### 🏨 Hotel Features

- Guest registration and check-in
- Room availability management
- Booking management with special requests
- Automated guest communications
- Payment integration ready

### 🎯 Shared Platform Features

- **Unified Admin Dashboard** - Manage both clinics and hotels
- **24/7 Online Booking** - Web and mobile responsive
- **SMS Automation** - Confirmations, reminders, updates
- **Real-time Availability** - Conflict prevention for both doctors and rooms
- **Customizable Forms** - Adapt to industry-specific needs

## 🚀 Quick Start

Follow these steps to set up the project locally:

**Prerequisites**

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)
- [Appwrite Account](https://appwrite.io/)

**Installation**

```
# Clone the repository
git clone [your-repo-url]
cd [project-name]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

**Environment Configuration**

```env
# APPWRITE
NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1
PROJECT_ID=your_project_id
API_KEY=your_api_key
DATABASE_ID=your_database_id
PATIENT_COLLECTION_ID=your_patient_collection
APPOINTMENT_COLLECTION_ID=your_appointment_collection
HOTEL_COLLECTION_ID=your_hotel_collection
BOOKING_COLLECTION_ID=your_booking_collection
NEXT_PUBLIC_BUCKET_ID=your_bucket_id

# ADMIN & NOTIFICATIONS
NEXT_PUBLIC_ADMIN_PASSKEY=your_admin_passkey
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the project.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Dual-industry admin dashboard
│   ├── hotel-demo/        # Hotel booking demonstration
│   └── features/          # Platform capabilities showcase
├── components/
│   ├── forms/            # Reusable form components
│   ├── ui/               # ShadCN components
│   └── shared/           # Cross-industry components
├── lib/                  # Utilities and configurations
└── constants/            # Industry-specific constants
```

## 💡 Key Differentiators

### 🔄 Industry Adaptation

- **Clinics**: Patients → Doctors → Appointments → Medical notes
- **Hotels**: Guests → Rooms → Bookings → Special requests
- **Same Codebase**: 80% shared components, 20% industry-specific

### 🎯 Business Benefits

- **Save 2-4 hours daily** on scheduling and management
- **Reduce no-shows by 40-50%** with automated reminders
- **24/7 booking availability** without staff intervention
- **Professional customer experience** across both industries

## 🔧 Customization

The platform is designed for easy customization:

- **Industry-specific fields** without code changes
- **Custom branding** and color schemes
- **Flexible notification templates**
- **Payment gateway integration** (M-Pesa, PayPal, Stripe ready)

## 📞 Support & Documentation

For detailed implementation guides:

- **Healthcare Implementation**: See `./docs/CLINIC_SYSTEM_GUIDE.md`
- **Hotel Implementation**: See `./docs/HOTEL_SYSTEM_GUIDE.md`
- **Technical Architecture**: See `./docs/SYSTEM_OVERVIEW.md`
- **Sales & Demos**: See `./docs/PRESENTATION_TEMPLATE.md`

## 🚀 Deployment

```bash
# Production build
npm run build

# Start production server
npm start
```

The application is optimized for deployment on Vercel, Netlify, or any Node.js hosting platform.

---

<div align="center">
  <p><em>One booking engine, multiple industries - transforming how clinics and hotels manage appointments and bookings.</em></p>
</div>
