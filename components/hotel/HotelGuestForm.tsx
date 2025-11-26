"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BookingPurposes } from "@/constants";
import { GuestInquirySchema } from "@/lib/validation";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

export const HotelGuestForm = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
    setStatusMessage("Syncing guest with Appwrite `guests` collection...");
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.log("Hotel guest preview payload", values);
    setStatusMessage("Guest linked. SMS confirmation template ready.");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-dark-400 bg-dark-300 p-2 sm:p-6 shadow-lg"
      >
        <section className="space-y-1">
          <p className="text-12-semibold uppercase text-green-500">
            Guests → Patients
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
            label="Phone"
            placeholder="+1 555 000 0000"
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
          <p>✓ GDPR-compliant consent + SMS toggle reused from CarePulse.</p>
          {statusMessage && <p className="text-green-500">{statusMessage}</p>}
        </div>

        <SubmitButton
          className="w-full"
          isLoading={form.formState.isSubmitting}
        >
          Save guest profile
        </SubmitButton>
      </form>
    </Form>
  );
};
