// app/about/page.tsx (or pages/about.tsx for Pages Router)

import type { Metadata } from "next";

// Metadata for SEO and bot scanning
export const metadata: Metadata = {
  title:
    "About Northwind Systems | Custom Booking Software for Clinics & Hotels",
  description:
    "We build unified booking systems that turn patients into guests and appointments into bookings. One platform for healthcare and hospitality.",
  keywords:
    "custom software solutions, booking system, appointment scheduling, healthcare software, hotel management system, Northwind booking engine",
};

// Structured Data for rich results (helps bots understand your business)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Northwind Systems",
  description:
    "Custom software solutions provider specializing in unified booking and appointment systems for clinics and hotels.",
  url: "https://healthcare.yunobase.com/about",
  softwareApplication: {
    "@type": "SoftwareApplication",
    name: "Northwind Booking Operating System",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      description:
        "Custom enterprise booking solutions for healthcare and hospitality",
    },
  },
  knowsAbout: [
    "Unified Booking System",
    "Healthcare Software",
    "Hotel Management System",
    "SMS Automation",
    "Appwrite Backend",
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* Inject structured data into the page head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            One Booking Operating System
            <span className="block text-blue-600">
              for Healthcare & Hospitality
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We build custom software solutions that transform how clinics and
            hotels manage reservations — turning patients into guests, doctors
            into rooms, and appointments into bookings.
          </p>
        </section>

        {/* Core Philosophy */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Unified Logic, Two Industries
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-2xl font-bold text-blue-700 mb-3">
                🏥 For Clinics
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Patient onboarding with validation</li>
                <li>✓ Doctor schedule & availability</li>
                <li>✓ Appointment booking with conflict detection</li>
                <li>✓ SMS confirmations & reminders</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-2xl font-bold text-green-700 mb-3">
                🏨 For Hotels
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Guest registration (same logic as patients)</li>
                <li>✓ Room inventory & availability</li>
                <li>✓ Booking modal workflow (identical to appointments)</li>
                <li>✓ Automated SMS templates & notifications</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We Build - Custom Software Solutions */}
        <section className="mb-20 bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-3xl font-semibold text-center mb-6">
            We Build{" "}
            <span className="underline decoration-blue-500">
              Custom Software Solutions
            </span>
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-8">
            Your booking needs are unique. We don't sell off-the-shelf — we
            engineer tailored systems that fit your exact workflow, whether you
            run a single clinic, a boutique hotel, or a portfolio of both.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold">Shared Components</h3>
              <p className="text-sm text-gray-600">
                Same React date picker, conflict logic, and modal workflow
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold">SMS Automation</h3>
              <p className="text-sm text-gray-600">
                Appwrite-powered messaging for confirmations & cancellations
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold">Unified Dashboard</h3>
              <p className="text-sm text-gray-600">
                Manage clinics and hotels from one admin panel
              </p>
            </div>
          </div>
        </section>

        {/* Northwind Platform Stats */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Our Platform at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Bookings</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600">2-in-1</div>
              <div className="text-gray-600">Systems</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600">SMS</div>
              <div className="text-gray-600">Automated</div>
            </div>
          </div>
        </section>

        {/* Why It Works - Technical */}
        <section>
          <h2 className="text-3xl font-semibold text-center mb-8">
            Why It Works
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold">Doctors → Rooms</h3>
              <p className="text-gray-700">
                The React date picker + conflict logic now references room
                inventory without rewriting validation.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-semibold">SMS & Email</h3>
              <p className="text-gray-700">
                Appwrite messaging templates send confirmations, reminders, and
                cancellations for both clinics and hotels.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-semibold">Dual Dashboard</h3>
              <p className="text-gray-700">
                Modal-driven approvals, cancellations, and metrics extend
                seamlessly to hotel bookings.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action - Bot-friendly contact hint */}
        <section className="text-center mt-20 pt-8 border-t">
          <p className="text-gray-500 text-sm">
            Northwind Systems — Custom software for unified booking operations.
            <br />
            For enterprise inquiries, refer to our contact information in schema
            markup.
          </p>
        </section>
      </main>
    </>
  );
}
