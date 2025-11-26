import Link from "next/link";

import { AdaptableComponents, FeatureComparisonMatrix } from "@/constants";
import { Button } from "@/components/ui/button";

const FeaturesPage = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-2 sm:px-[5%] py-12">
      <section className="space-y-4 rounded-3xl border border-dark-400 bg-dark-200/70 p-2 sm:p-6">
        <p className="text-12-semibold uppercase text-green-500 p-2 sm:p-0">
          Dual vertical story
        </p>
        <h1 className="text-36-bold">One booking core. Clinics + Hotels.</h1>
        <p className="text-16-regular text-dark-700">
          Northwind already ships everything a hotelier needs: guest onboarding,
          room assignment logic, booking confirmations, cancellations, SMS
          reminders, payment-ready workflows, and a shared admin console.
        </p>
        <div className="flex flex-wrap gap-3 text-12-semibold text-dark-600">
          <span>`patients` ➝ `guests` collection</span>
          <span>`doctors` ➝ `rooms` collection</span>
          <span>`appointments` ➝ `bookings` collection</span>
          <span>`medicalNotes` ➝ `specialRequests`</span>
        </div>
      </section>

      <section className="space-y-4 p-2 sm:p-6">
        <header>
          <h2 className="text-24-bold">Feature comparison</h2>
          <p className="text-14-regular text-dark-600">
            Every care workflow has a direct hospitality counterpart using the
            same code paths.
          </p>
        </header>
        <div className="overflow-auto rounded-3xl border border-dark-400">
          <table className="w-full table-auto">
            <thead className="bg-dark-300 text-left text-12-semibold uppercase text-dark-600">
              <tr>
                <th className="px-6 py-4">Feature</th>
                <th className="px-6 py-4">Clinics</th>
                <th className="px-6 py-4">Hotels</th>
              </tr>
            </thead>
            <tbody className="bg-dark-200 text-14-regular">
              {FeatureComparisonMatrix.map((row) => (
                <tr key={row.feature} className="border-t border-dark-400">
                  <td className="px-6 py-4 text-16-semibold">{row.feature}</td>
                  <td className="px-6 py-4 text-dark-600">{row.clinic}</td>
                  <td className="px-6 py-4 text-green-500">{row.hotel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-dark-400 bg-dark-200/70 p-3 sm:p-6">
        <div>
          <h2 className="text-24-bold">Shared building blocks</h2>
          <p className="text-14-regular text-dark-600">
            Tailwind UI, Zod validation, notifications, and Appwrite collections
            are intentionally vertical-agnostic.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 overflow-x-auto">
          {AdaptableComponents.map((component) => (
            <article
              key={component.title}
              className="rounded-2xl border border-dark-400 bg-dark-300 p-5"
            >
              <h3 className="text-18-bold">{component.title}</h3>
              <p className="text-14-regular text-dark-600">
                {component.description}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-green-500/30 bg-green-600/10 p-3 sm:p-5 text-14-regular text-dark-700">
          <p className="text-16-semibold text-white">
            New Appwrite collections
          </p>
          <ul className="mt-2 space-y-2 text-14-regular">
            <li>• `hotels` — metadata per property</li>
            <li>• `rooms` — replaces doctor availability</li>
            <li>• `guests` — mirrors patient records</li>
            <li>• `bookings` — same status enum as appointments</li>
          </ul>
          <p className="mt-4 text-12-semibold text-green-500">
            All reuse the same CRUD patterns as patients/appointments.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-dark-400 bg-dark-200/60 p-3 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-24-bold">Ready to demo?</h2>
            <p className="text-14-regular text-dark-600">
              Jump into the live hotel journey or the dual admin console.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
            <Button asChild className="rounded-full w-full">
              <Link href="/hotel-demo" className="shad-primary-btn">
                Hotel demo
              </Link>
            </Button>

            <Button asChild variant="secondary" className="rounded-full w-full">
              <Link href="/admin/dashboard" className="shad-gray-btn">
                Dual admin
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
