import Link from "next/link";

import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import { DualFlowMap } from "@/constants";
import { Button } from "@/components/ui/button";

const Home = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  const flowPreview = DualFlowMap.slice(0, 3);

  return (
    <div className="min-h-screen bg-black">
      {isAdmin && <PasskeyModal />}

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-3 sm:px-6 py-10">
        {/* Hero Section */}
        <section className="grid gap-10 rounded-[32px] border border-dark-400 bg-gradient-to-br from-dark-300 to-black p-2 sm:p-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-12-semibold uppercase text-green-500 p-2 sm:p-0">
                Clinics + Hotels
              </p>
              <h1 className="text-36-bold">
                One booking operating system for healthcare and hospitality.
              </h1>
              <p className="text-16-regular text-dark-700">
                Patients become guests, doctors become rooms, appointments
                become bookings. The same Appwrite backend powers confirmations,
                cancellations, and SMS across both industries.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-dark-400 bg-dark-200/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-12-semibold text-green-500">
                    Unified Dashboard
                  </p>
                </div>
                <p className="text-14-regular text-dark-600">
                  Manage both clinics and hotels from one admin panel
                </p>
              </div>

              <div className="rounded-2xl border border-dark-400 bg-dark-200/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-12-semibold text-green-500">
                    SMS Automation
                  </p>
                </div>
                <p className="text-14-regular text-dark-600">
                  Automatic confirmations and reminders for both industries
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button asChild className="rounded-full w-full">
                <Link href="#clinic-intake" className="shad-primary-btn">
                  Start clinic onboarding
                </Link>
              </Button>

              <Button asChild className="rounded-full w-full">
                <Link href="/hotel-demo" className="shad-gray-btn">
                  Explore hotel demo
                </Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full w-full">
                <Link
                  href="/features"
                  className="border border-dark-500 text-green-500"
                >
                  Compare features
                </Link>
              </Button>
            </div>

            {/* Flow Preview */}
            <div className="grid gap-4 md:grid-cols-3">
              {flowPreview.map((item) => (
                <div
                  key={item.clinic.title}
                  className="rounded-2xl border border-dark-400 bg-dark-200/60 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <p className="text-12-semibold text-dark-600">
                      {item.clinic.title}
                    </p>
                  </div>
                  <p className="text-16-semibold text-green-500">
                    {item.hotel.title}
                  </p>
                  <p className="mt-2 text-12-regular text-dark-600">
                    {item.shared}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-dark-400 bg-dark-200/40 p-6">
              <p className="text-12-semibold uppercase text-dark-600 mb-4">
                Platform Stats
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-20-bold text-green-500">100%</p>
                  <p className="text-12-regular text-dark-600">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-20-bold text-green-500">24/7</p>
                  <p className="text-12-regular text-dark-600">Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-20-bold text-green-500">2-in-1</p>
                  <p className="text-12-regular text-dark-600">Systems</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Booking Form */}
          <div className="space-y-6">
            <div
              id="clinic-intake"
              className="rounded-3xl border border-dark-400 bg-dark-200/80 p-2 sm:p-6 backdrop-blur"
            >
              <div className="mb-6 space-y-1">
                <p className="text-12-semibold uppercase text-dark-600">
                  Clinics
                </p>
                <h2 className="text-24-bold">Book your next appointment</h2>
                <p className="text-14-regular text-dark-600">
                  The clinic pathway.
                </p>
              </div>
              <PatientForm />
            </div>
          </div>
        </section>

        {/* Hotel Pathway Section */}
        <section className="rounded-[32px] border border-dark-400 bg-gradient-to-br from-dark-300 to-black p-2 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <p className="text-12-semibold uppercase text-green-500 p-2 sm:p-0">
                Hospitality Ready
              </p>
              <h2 className="text-32-bold">
                Same booking engine, different industry
              </h2>
              <p className="text-16-regular text-dark-700">
                Transform your clinic booking system into a powerful hotel
                management platform without rewriting core logic.
              </p>

              <div className="grid gap-3 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-14-regular text-dark-600">
                    Patients → Guests | Doctors → Rooms
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-14-regular text-dark-600">
                    Appointments → Bookings | Medical notes → Special requests
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-14-regular text-dark-600">
                    Same SMS notifications, different templates
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dark-400 bg-dark-300 p-2 sm:p-6">
              <div className="space-y-4">
                <p className="text-12-semibold uppercase text-green-500">
                  Hotels
                </p>
                <h3 className="text-20-bold">Ready for room scheduling?</h3>
                <p className="text-14-regular text-dark-600">
                  Reuse the same booking engine to capture guests, assign rooms,
                  and follow-up via SMS/email.
                </p>

                <div className="flex flex-col gap-3 pt-2">
                  <Button asChild className="rounded-full w-full">
                    <Link href="/hotel-demo" className="shad-primary-btn">
                      View hotel booking flow
                    </Link>
                  </Button>

                  <Button asChild className="rounded-full w-full">
                    <Link href="/admin/dashboard" className="shad-gray-btn">
                      Dual admin dashboard
                    </Link>
                  </Button>

                  <Button asChild className="rounded-full w-full">
                    <Link
                      href="/features"
                      className="border border-dark-500 text-green-500 hover:bg-dark-400 transition-colors"
                    >
                      See shared components
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shared Components Section */}
        <section className="rounded-[32px] border border-dark-400 bg-dark-200/60 p-2 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-12-semibold uppercase text-dark-600">
                Why it works
              </p>
              <h2 className="text-24-bold">
                Shared components across both verticals
              </h2>
            </div>
            <Link
              href="/features"
              className="shad-primary-btn rounded-full px-6 py-3"
            >
              Deep dive features
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-dark-400 bg-dark-300 p-2 sm:p-5">
              <p className="text-12-semibold uppercase text-green-500">
                Scheduling & availability
              </p>
              <h3 className="text-18-bold mt-2">Doctors → Rooms</h3>
              <p className="text-14-regular text-dark-600">
                The React date picker + conflict logic now references room
                inventory without rewriting validation.
              </p>
            </article>
            <article className="rounded-2xl border border-dark-400 bg-dark-300 p-2 sm:p-5">
              <p className="text-12-semibold uppercase text-blue-500">
                Notifications
              </p>
              <h3 className="text-18-bold mt-2">SMS & email</h3>
              <p className="text-14-regular text-dark-600">
                Appwrite messaging templates send confirmations, reminders, and
                cancellations for both clinics and hotels.
              </p>
            </article>
            <article className="rounded-2xl border border-dark-400 bg-dark-300 p-2 sm:p-5">
              <p className="text-12-semibold uppercase text-red-500">
                Admin workflow
              </p>
              <h3 className="text-18-bold mt-2">Dual dashboard</h3>
              <p className="text-14-regular text-dark-600">
                Modal-driven approvals, cancellations, and metrics extend
                seamlessly to hotel bookings.
              </p>
            </article>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-dark-400 pt-6 text-14-regular text-dark-600">
          <Link
            href={"https://northwind.yunobase.com/products/healthcare-system"}
            target="_blank"
          >
            © {new Date().getFullYear()} Northwind — industry-agnostic booking
            OS.
          </Link>
          <div className="flex gap-4">
            <Link
              href="/?admin=true"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              Admin access
            </Link>
            <Link
              href="/features"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/hotel-demo"
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              Hotel Demo
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
