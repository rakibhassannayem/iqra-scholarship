"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export default function ContactInfo() {
  const { language } = useLanguage();

  const items = [
    {
      icon: "✉",
      title: language === "bn" ? "ইমেইল যোগাযোগ" : "Email Support",
      description:
        language === "bn"
          ? "বৃত্তি-সংক্রান্ত প্রশ্ন বা সহায়তার জন্য আমাদের নির্ধারিত ইমেইলে যোগাযোগ করুন।"
          : "Contact our designated email address for scholarship-related questions or assistance.",
    },
    {
      icon: "☎",
      title: language === "bn" ? "ফোনে যোগাযোগ" : "Phone Support",
      description:
        language === "bn"
          ? "ফোনে যোগাযোগের সুবিধা চালু হলে এখানে যোগাযোগের নম্বর দেওয়া হবে।"
          : "Our contact number will be published here when phone support becomes available.",
    },
    {
      icon: "⌖",
      title: language === "bn" ? "প্রতিষ্ঠানের ঠিকানা" : "Office Address",
      description:
        language === "bn"
          ? "প্রতিষ্ঠানের যাচাইকৃত ঠিকানা এখানে যুক্ত করা হবে।"
          : "The verified institutional address will be added here.",
    },
  ];

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            {language === "bn" ? "যোগাযোগের মাধ্যম" : "CONTACT OPTIONS"}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {language === "bn"
              ? "কীভাবে আমাদের সঙ্গে যোগাযোগ করবেন?"
              : "How Can You Reach Us?"}
          </h2>

          <p className="mt-4 text-base leading-8 text-muted-foreground">
            {language === "bn"
              ? "যোগাযোগের নির্দিষ্ট তথ্য প্রকাশিত হলে এই অংশ থেকে সহজেই তা খুঁজে পাওয়া যাবে।"
              : "Once official contact details are available, you will be able to find them here."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/40 sm:p-8"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-xl border border-accent bg-secondary text-2xl text-primary">
                <span aria-hidden="true">{item.icon}</span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-card-foreground">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
