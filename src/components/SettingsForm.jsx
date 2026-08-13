import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const phoneRegex = /^\d{10,11}$/; // 10-11 digits

const SettingsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Phone number must be 10-11 digits"),
  bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
});

export default function SettingsForm() {
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(SettingsSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  const fakeSave = (data) =>
    new Promise((resolve) => setTimeout(() => resolve(data), 1000));

  const onSubmit = async (data) => {
    setSuccessMessage("");
    try {
      await fakeSave(data);
      setSuccessMessage("Profile saved successfully.");
      // Optionally reset or keep values; keeping values here
    } catch (err) {
      // In a real app, handle error
      setSuccessMessage("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              aria-invalid={errors.fullName ? "true" : "false"}
              {...register("fullName")}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 " ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email")}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 " ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              aria-invalid={errors.phone ? "true" : "false"}
              {...register("phone")}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 " ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio (optional)
            </label>
            <textarea
              id="bio"
              rows={4}
              aria-invalid={errors.bio ? "true" : "false"}
              {...register("bio")}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 " ${
                errors.bio ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.bio && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>

            {successMessage && (
              <p role="status" className="text-sm text-green-600">
                {successMessage}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
