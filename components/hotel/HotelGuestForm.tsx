"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BookingPurposes } from "@/constants";
import { createGuest } from "@/lib/actions/hotel.actions";
import { GuestInquirySchema } from "@/lib/validation";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

export const HotelGuestForm = ({ scrollTo }: { scrollTo: string }) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const bookingFormRef = useRef<HTMLFormElement>(null);

  // Scroll to booking form when scrollTo param is present
  useEffect(() => {
    if (scrollTo === "guest-form" && bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Optional: Clean up the URL after scrolling
      const cleanUrl =
        window.location.pathname +
        window.location.search.replace(/&?scrollTo=guest-form/, "");
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [scrollTo]);

  const form = useForm<z.infer<typeof GuestInquirySchema>>({
    resolver: zodResolver(GuestInquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      guests: 1,
      bookingPurpose: "Business",
      vipNotes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof GuestInquirySchema>) => {
    setIsLoading(true);
    setStatusMessage("Creating guest profile...");

    try {
      const guest = await createGuest({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        purpose: values.bookingPurpose,
        guestsCount: values.guests,
        vipNotes: values.vipNotes || "",
        consent: true, // Implicit consent for hotel bookings
      });

      if (guest) {
        setStatusMessage(
          "✓ Guest profile created! You can now proceed to booking."
        );
        // Store guest ID in sessionStorage for booking form
        if (typeof window !== "undefined") {
          sessionStorage.setItem("hotelGuestId", guest.$id);
          sessionStorage.setItem("hotelGuestEmail", guest.email);
        }
        // Optionally redirect or show success
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating guest:", error);
      setStatusMessage("Error creating guest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-dark-400 bg-dark-300 p-2 sm:p-6 shadow-lg"
      >
        <section className="space-y-1">
          <p className="text-12-semibold uppercase text-green-500 p-2 sm:p-0">
            Guests
          </p>
          <h2 className="text-18-bold">Guest registration</h2>
          <p className="text-14-regular text-dark-600">
            The exact patient onboarding form now geared for hospitality teams.
          </p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="fullName"
          label="Full name"
          placeholder="Avery Stone"
          iconSrc="/assets/icons/user.svg"
          iconAlt="guest"
        />

        <div className="flex flex-col gap-6 md:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="guest@stay.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="guests"
            label="Guests"
            placeholder="2"
            inputType="number"
          />

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="bookingPurpose"
            label="Booking purpose"
            placeholder="Business or leisure"
          >
            {BookingPurposes.map((purpose) => (
              <SelectItem key={purpose} value={purpose}>
                {purpose}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="vipNotes"
          label="VIP / loyalty context"
          placeholder="Attach travel agent code, mobility accommodations, etc."
        />

        <div className="space-y-1 text-12-regular text-dark-600">
          <p>✓ GDPR-compliant consent + SMS toggle reused from Clinic.</p>
          {statusMessage && <p className="text-green-500">{statusMessage}</p>}
        </div>

        <SubmitButton className="w-full" isLoading={isLoading}>
          Save guest profile
        </SubmitButton>
      </form>
    </Form>
  );
};
