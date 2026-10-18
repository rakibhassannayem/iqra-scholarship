"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function ContactForm() {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const isBangla = language === "bn";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            {isBangla ? "আপনার মতামত জানান" : "SEND US A MESSAGE"}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {isBangla ? "আপনার কোনো প্রশ্ন আছে?" : "Have a Question?"}
          </h2>

          <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground">
            {isBangla
              ? "নিচের ফর্মটি পূরণ করে আপনার প্রশ্ন বা বার্তা লিখুন।"
              : "Fill out the form with your question or message."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="contact-name"
                className="text-sm font-medium text-foreground"
              >
                {isBangla ? "আপনার নাম" : "Your Name"}
              </label>

              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                placeholder={
                  isBangla ? "পূর্ণ নাম লিখুন" : "Enter your full name"
                }
                className="min-h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="text-sm font-medium text-foreground"
              >
                {isBangla ? "ইমেইল ঠিকানা" : "Email Address"}
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder={isBangla ? "name@example.com" : "name@example.com"}
                className="min-h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-subject"
              className="text-sm font-medium text-foreground"
            >
              {isBangla ? "বিষয়" : "Subject"}
            </label>

            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              maxLength={150}
              placeholder={
                isBangla ? "বার্তার বিষয় লিখুন" : "Enter the subject"
              }
              className="min-h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-message"
              className="text-sm font-medium text-foreground"
            >
              {isBangla ? "আপনার বার্তা" : "Your Message"}
            </label>

            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              placeholder={
                isBangla
                  ? "আপনার প্রশ্ন বা বার্তা বিস্তারিত লিখুন..."
                  : "Write your question or message..."
              }
              className="w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            {isBangla ? "বার্তা জমা দিন" : "Submit Message"}
          </button>

          {submitted && (
            <p
              role="status"
              className="rounded-lg border border-border bg-secondary p-4 text-sm leading-6 text-secondary-foreground"
            >
              {isBangla
                ? "ফর্মটি পরীক্ষা করা হয়েছে, কিন্তু বার্তাটি পাঠানো হয়নি। সার্ভার সংযুক্ত হলে বার্তা জমা দেওয়া যাবে।"
                : "The form was validated, but your message was not sent. Connect a server endpoint to submit messages."}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
