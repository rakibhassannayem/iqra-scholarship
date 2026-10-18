"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export default function AboutContent() {
  const { language } = useLanguage();

  const sections = [
    {
      number: "01",
      title: language === "bn" ? "আমাদের উদ্দেশ্য" : "Our Purpose",
      description:
        language === "bn"
          ? "মেধাবী শিক্ষার্থীদের বৃত্তি কার্যক্রম সম্পর্কে নির্ভরযোগ্য তথ্য দেওয়া এবং নিবন্ধন ও ফলাফল যাচাইয়ের প্রক্রিয়া সহজ করা।"
          : "To provide reliable scholarship information and make registration and result checking easier for students.",
    },
    {
      number: "02",
      title: language === "bn" ? "আমাদের লক্ষ্য" : "Our Mission",
      description:
        language === "bn"
          ? "শিক্ষার্থীদের জন্য বৃত্তি-সংক্রান্ত প্রয়োজনীয় তথ্য সহজে পাওয়ার সুযোগ তৈরি করা, যাতে তারা সঠিক সময়ে প্রয়োজনীয় পদক্ষেপ নিতে পারে।"
          : "To make essential scholarship information accessible so students can take the right steps at the right time.",
    },
    {
      number: "03",
      title: language === "bn" ? "আমাদের অঙ্গীকার" : "Our Commitment",
      description:
        language === "bn"
          ? "নিবন্ধন, বিজ্ঞপ্তি ও ফলাফলের তথ্য সুসংগঠিতভাবে উপস্থাপন করা এবং ব্যবহারকারীদের জন্য সহজবোধ্য অভিজ্ঞতা নিশ্চিত করা।"
          : "To present registration details, notices, and results in an organized way and provide a clear user experience.",
    },
  ];

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            {language === "bn" ? "আমাদের সম্পর্কে" : "ABOUT OUR PROGRAM"}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {language === "bn"
              ? "শিক্ষার্থীদের এগিয়ে যাওয়ার সুযোগ"
              : "Creating Opportunities for Students"}
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            {language === "bn"
              ? "এই প্ল্যাটফর্মের মাধ্যমে বৃত্তি কার্যক্রমের গুরুত্বপূর্ণ তথ্য, নিবন্ধন এবং ফলাফল যাচাইয়ের সুবিধা একই জায়গায় আনার লক্ষ্য রাখা হয়েছে।"
              : "This platform aims to bring important scholarship information, registration, and result checking together in one place."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.number}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl border border-accent bg-secondary text-sm font-bold text-primary">
                {section.number}
              </span>

              <h3 className="mt-6 text-xl font-bold text-card-foreground">
                {section.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
