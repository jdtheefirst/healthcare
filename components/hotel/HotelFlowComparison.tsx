import { DualFlowMap } from "@/constants";

export const HotelFlowComparison = () => {
  return (
    <section className="space-y-6 rounded-3xl border border-dark-400 bg-black/40 p-6">
      <div className="space-y-1">
        <p className="text-12-semibold uppercase text-green-500">
          Clinic flow ↔ Hotel flow
        </p>
        <h2 className="text-24-bold">One booking engine, two industries</h2>
        <p className="text-14-regular text-dark-600">
          Each clinic concept has a 1:1 match for hotels, powered by the same
          collections, forms, and notifications.
        </p>
      </div>

      <div className="divide-y divide-dark-400 border border-dark-400 rounded-2xl overflow-hidden">
        {DualFlowMap.map((pair) => (
          <div
            key={pair.clinic.title}
            className="grid gap-6 bg-dark-300 p-6 md:grid-cols-3"
          >
            <div>
              <p className="text-12-semibold text-dark-600">Clinic</p>
              <p className="text-16-semibold">{pair.clinic.title}</p>
              <p className="text-14-regular text-dark-600">
                {pair.clinic.subtitle}
              </p>
            </div>
            <div>
              <p className="text-12-semibold text-dark-600">Hotel</p>
              <p className="text-16-semibold text-green-500">
                {pair.hotel.title}
              </p>
              <p className="text-14-regular text-dark-600">
                {pair.hotel.subtitle}
              </p>
            </div>
            <div className="rounded-2xl border border-dark-500 bg-dark-400 p-4 text-14-regular text-dark-600">
              {pair.shared}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

