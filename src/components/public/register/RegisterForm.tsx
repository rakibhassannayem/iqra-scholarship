"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Copy, GraduationCap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function RegisterForm() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [institutionName, setInstitutionName] = useState("");
  const [eiin, setEiin] = useState("");
  const [studentName, setStudentName] = useState("");
  const [classId, setClassId] = useState("");
  const [roll, setRoll] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copied, setCopied] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const year = String(new Date().getFullYear()).slice(-2);
    const studentId = `iq${year}${eiin}${classId}${roll}`;

    setGeneratedId(studentId);
    setCopied(false);
  }

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(generatedId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function handleFieldChange(setter: (value: string) => void, value: string) {
    setter(value);
    setGeneratedId("");
    setCopied(false);
  }

  return (
    <section className="bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {isBangla
                  ? "শিক্ষার্থী নিবন্ধন ফর্ম"
                  : "Student Registration Form"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।"
                  : "Fill in the form with accurate information."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reg-institution" className="text-sm font-medium">
                {isBangla ? "প্রতিষ্ঠানের নাম" : "Institution Name"}
              </label>
              <input
                id="reg-institution"
                required
                maxLength={200}
                value={institutionName}
                onChange={(event) =>
                  handleFieldChange(setInstitutionName, event.target.value)
                }
                placeholder={
                  isBangla ? "প্রতিষ্ঠানের নাম লিখুন" : "Enter institution name"
                }
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-eiin" className="text-sm font-medium">
                {isBangla
                  ? "প্রতিষ্ঠানের EIIN (৬ সংখ্যা)"
                  : "Institution EIIN (6 digits)"}
              </label>
              <input
                id="reg-eiin"
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={eiin}
                onChange={(event) =>
                  handleFieldChange(
                    setEiin,
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                placeholder="123456"
                title={
                  isBangla
                    ? "EIIN অবশ্যই ৬ সংখ্যার হতে হবে"
                    : "EIIN must contain exactly 6 digits"
                }
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-student-name" className="text-sm font-medium">
                {isBangla ? "শিক্ষার্থীর পূর্ণ নাম" : "Student Full Name"}
              </label>
              <input
                id="reg-student-name"
                required
                maxLength={150}
                autoComplete="name"
                value={studentName}
                onChange={(event) =>
                  handleFieldChange(setStudentName, event.target.value)
                }
                placeholder={
                  isBangla ? "শিক্ষার্থীর নাম লিখুন" : "Enter student name"
                }
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="reg-class" className="text-sm font-medium">
                  {isBangla ? "শ্রেণি" : "Class"}
                </label>
                <select
                  id="reg-class"
                  required
                  value={classId}
                  onChange={(event) =>
                    handleFieldChange(setClassId, event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    {isBangla ? "শ্রেণি নির্বাচন করুন" : "Select class"}
                  </option>
                  {Array.from({ length: 10 }, (_, index) =>
                    String(index + 1),
                  ).map((value) => (
                    <option key={value} value={value}>
                      {isBangla ? `শ্রেণি ${value}` : `Class ${value}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="reg-roll" className="text-sm font-medium">
                  {isBangla ? "রোল নম্বর" : "Roll Number"}
                </label>
                <input
                  id="reg-roll"
                  required
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]+"
                  maxLength={10}
                  value={roll}
                  onChange={(event) =>
                    handleFieldChange(
                      setRoll,
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder={
                    isBangla ? "রোল নম্বর লিখুন" : "Enter roll number"
                  }
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {isBangla ? "নিবন্ধন করুন" : "Register"}
            </button>
          </form>

          {generatedId && (
            <div
              role="status"
              className="mt-7 rounded-xl border border-accent/50 bg-accent/10 p-5 sm:p-6"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                <h3 className="font-bold">
                  {isBangla
                    ? "Demo registration সম্পন্ন"
                    : "Demo registration completed"}
                </h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "আপনার তৈরি করা Student ID:"
                  : "Your generated Student ID:"}
              </p>

              <p className="mt-2 break-all rounded-lg border bg-background px-4 py-3 text-center font-mono text-xl font-bold tracking-wide sm:text-2xl">
                {generatedId}
              </p>

              <button
                type="button"
                onClick={handleCopyId}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted"
              >
                <Copy className="size-4" />
                {copied
                  ? isBangla
                    ? "কপি হয়েছে"
                    : "Copied"
                  : isBangla
                    ? "Student ID কপি করুন"
                    : "Copy Student ID"}
              </button>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "এটি আপাতত frontend demo। তথ্য database-এ সংরক্ষিত হয়নি। পেজ রিফ্রেশ করলে ID হারিয়ে যেতে পারে। বাস্তব registration-এর জন্য backend সংযোগ প্রয়োজন।"
                  : "This is currently a frontend demo. The information has not been saved to a database. The ID may be lost after refreshing the page. A backend connection is required for real registration."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
