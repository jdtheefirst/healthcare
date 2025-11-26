import Image from "next/image";
import Link from "next/link";

import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import { DualFlowMap } from "@/constants";

const Home = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  const flowPreview = DualFlowMap.slice(0, 3);

  return (
    <div className="min-h-screen bg-black">
      {isAdmin && <PasskeyModal />}

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-3 sm:px-6 py-10 lg:px-12">
        <section className="grid gap-10 rounded-[32px] border border-dark-400 bg-gradient-to-br from-dark-300 to-black p-8 md:p-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="CarePulse"
              className="h-10 w-fit"
            />
            <div className="space-y-4">
              <p className="text-12-semibold uppercase text-green-500">
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
            <div className="flex flex-wrap gap-3">
              <Link
                href="#clinic-intake"
                className="shad-primary-btn rounded-full px-6 py-3"
              >
                Start clinic onboarding
              </Link>
              <Link
                href="/hotel-demo"
                className="shad-gray-btn rounded-full px-6 py-3"
              >
                Explore hotel demo
              </Link>
              <Link
                href="/features"
                className="rounded-full border border-dark-500 px-6 py-3 text-green-500"
              >
                Compare features
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {flowPreview.map((item) => (
                <div
                  key={item.clinic.title}
                  className="rounded-2xl border border-dark-400 bg-dark-200/60 p-4"
                >
                  <p className="text-12-semibold text-dark-600">
                    {item.clinic.title}
                  </p>
                  <p className="text-16-semibold text-green-500">
                    {item.hotel.title}
                  </p>
                  <p className="mt-2 text-12-regular text-dark-600">
                    {item.shared}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-12-regular text-dark-600">
              <p>
                Need admin access? Use the passkey modal or head to
                `/admin/dashboard` for dual metrics.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div
              id="clinic-intake"
              className="rounded-3xl border border-dark-400 bg-dark-200/80 p-6 backdrop-blur"
            >
              <div className="mb-6 space-y-1">
                <p className="text-12-semibold uppercase text-dark-600">
                  Clinics
                </p>
                <h2 className="text-24-bold">Book your next appointment</h2>
                <p className="text-14-regular text-dark-600">
                  Same intake form as before—now positioned as the clinic
                  pathway.
                </p>
              </div>
              <PatientForm />
            </div>

            <div className="rounded-3xl border border-dark-400 bg-dark-300 p-6">
              <div className="space-y-2">
                <p className="text-12-semibold uppercase text-green-500">
                  Hotels
                </p>
                <h2 className="text-18-bold">Need room scheduling instead?</h2>
                <p className="text-14-regular text-dark-600">
                  Reuse the same booking engine to capture guests, assign rooms,
                  and follow-up via SMS/email.
                </p>
              </div>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/hotel-demo"
                  className="shad-primary-btn rounded-full px-4 py-2 text-center"
                >
                  View hotel booking flow
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="shad-gray-btn rounded-full px-4 py-2 text-center"
                >
                  Dual admin dashboard
                </Link>
                <Link
                  href="/features"
                  className="rounded-full border border-dark-500 px-4 py-2 text-center text-green-500"
                >
                  See shared components
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-dark-400 bg-dark-200/60 p-8">
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
            <article className="rounded-2xl border border-dark-400 bg-dark-300 p-5">
              <p className="text-12-semibold uppercase text-green-500">
                Scheduling & availability
              </p>
              <h3 className="text-18-bold mt-2">Doctors → Rooms</h3>
              <p className="text-14-regular text-dark-600">
                The React date picker + conflict logic now references room
                inventory without rewriting validation.
              </p>
            </article>
            <article className="rounded-2xl border border-dark-400 bg-dark-300 p-5">
              <p className="text-12-semibold uppercase text-blue-500">
                Notifications
              </p>
              <h3 className="text-18-bold mt-2">SMS & email</h3>
              <p className="text-14-regular text-dark-600">
                Appwrite messaging templates send confirmations, reminders, and
                cancellations for both clinics and hotels.
              </p>
            </article>
            <article className="rounded-2xl border border-dark-400 bg-dark-300 p-5">
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

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-dark-400 pt-6 text-14-regular text-dark-600">
          <p>© 2024 CarePulse — industry-agnostic booking OS.</p>
          <div className="flex gap-4">
            <Link href="/?admin=true" className="text-green-500">
              Admin access
            </Link>
            <Link href="/features" className="text-green-500">
              Features
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
