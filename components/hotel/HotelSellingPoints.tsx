import { AdaptableComponents, HotelRoomTypes } from "@/constants";

export const HotelSellingPoints = () => {
  return (
    <section className="space-y-10 rounded-3xl border border-dark-400 bg-dark-200 p-2 sm:p-6">
      <div className="space-y-2">
        <p className="text-12-semibold uppercase text-blue-500 p-2 sm:p-0">
          Feature conversion
        </p>
        <h2 className="text-24-bold">Why Northwind clicks for hotels</h2>
        <p className="text-14-regular text-dark-600">
          Showing the exact modules inherited from the healthcare stack—zero
          rebuild.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {HotelRoomTypes.map((room) => (
          <article
            key={room.id}
            className="rounded-2xl border border-dark-400 bg-dark-300 p-3 sm:p-6"
          >
            <p className="text-12-semibold uppercase text-green-500">
              {room.type}
            </p>
            <h3 className="text-18-bold">{room.name}</h3>
            <p className="text-14-regular text-dark-600">{room.description}</p>
            <ul className="mt-4 space-y-2 text-12-regular text-dark-600">
              {room.amenities.map((amenity) => (
                <li key={amenity}>• {amenity}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {AdaptableComponents.map((component) => (
          <article
            key={component.title}
            className="rounded-2xl border border-green-500/30 bg-green-600/10 p-5"
          >
            <h4 className="text-18-bold">{component.title}</h4>
            <p className="text-14-regular text-dark-700">
              {component.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
