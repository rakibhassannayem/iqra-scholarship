"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

import type { Institution } from "@/types/institution";
import type { Scholarship } from "@/types/scholarship";
import type { Registration } from "@/types/registration";

export default function PaymentForm() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  const [institutionName, setInstitutionName] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);

  const [selectedScholarshipId, setSelectedScholarshipId] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [loadingScholarships, setLoadingScholarships] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRegistrationIds, setSelectedRegistrationIds] = useState<
    number[]
  >([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch("/api/institutions?hasRegistrations=true");

        if (!response.ok) {
          throw new Error("Failed to fetch institutions.");
        }

        const data: Institution[] = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
        setErrorMessage(
          isBangla
            ? "প্রতিষ্ঠানের তালিকা লোড করা যায়নি।"
            : "Failed to load institutions.",
        );
      } finally {
        setLoadingInstitutions(false);
      }
    }

    fetchInstitutions();
  }, [isBangla]);

  useEffect(() => {
    async function fetchScholarships() {
      if (!selectedInstitution) {
        setScholarships([]);
        return;
      }

      try {
        setLoadingScholarships(true);
        setSelectedScholarshipId("");

        const response = await fetch("/api/scholarships");

        if (!response.ok) {
          throw new Error("Failed to fetch scholarships.");
        }

        const data: Scholarship[] = await response.json();
        setScholarships(data);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
        setErrorMessage(
          isBangla
            ? "বৃত্তির তালিকা লোড করা যায়নি।"
            : "Failed to load scholarships.",
        );
      } finally {
        setLoadingScholarships(false);
      }
    }

    fetchScholarships();
  }, [selectedInstitution, isBangla]);

  useEffect(() => {
    async function fetchRegistrations() {
      if (!selectedInstitution || !selectedScholarshipId) {
        setRegistrations([]);
        setSelectedRegistrationIds([]);
        return;
      }

      try {
        setLoadingRegistrations(true);
        setErrorMessage("");

        const response = await fetch(
          `/api/registrations?institutionId=${selectedInstitution.id}&scholarshipId=${selectedScholarshipId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch registrations.");
        }

        const data: Registration[] = await response.json();
        setRegistrations(data);
        setSelectedRegistrationIds([]);
      } catch (error) {
        console.error("Failed to fetch registrations:", error);

        setErrorMessage(
          isBangla
            ? "শিক্ষার্থীদের তালিকা লোড করা যায়নি।"
            : "Failed to load student list.",
        );
      } finally {
        setLoadingRegistrations(false);
      }
    }

    fetchRegistrations();
  }, [selectedInstitution, selectedScholarshipId, isBangla]);

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name
      .toLowerCase()
      .includes(institutionName.trim().toLowerCase()),
  );

  function handleSelectInstitution(institution: Institution) {
    setSelectedInstitution(institution);
    setInstitutionName(institution.name);
    setShowSuggestions(false);
    setSelectedScholarshipId("");
    setErrorMessage("");
  }

  const eligibleRegistrations = registrations.filter(
    (registration) => registration.paymentStatus === "Unpaid",
  );

  const totalAmount = eligibleRegistrations
    .filter((registration) => selectedRegistrationIds.includes(registration.id))
    .reduce((total, registration) => total + registration.registrationFee, 0);

  function handleRegistrationSelection(id: number, checked: boolean) {
    setSelectedRegistrationIds((previous) =>
      checked
        ? [...previous, id]
        : previous.filter((selectedId) => selectedId !== id),
    );
  }

  function handleSelectAll(checked: boolean) {
    setSelectedRegistrationIds(
      checked
        ? eligibleRegistrations.map((registration) => registration.id)
        : [],
    );
  }

  function validatePaymentForm() {
    if (selectedRegistrationIds.length === 0) {
      setErrorMessage(
        isBangla
          ? "অন্তত একজন শিক্ষার্থী নির্বাচন করুন।"
          : "Please select at least one student.",
      );
      return false;
    }

    if (!paymentMethod || !transactionId.trim() || !paymentScreenshot) {
      setErrorMessage(
        isBangla
          ? "পেমেন্টের সব তথ্য পূরণ করুন।"
          : "Please complete all payment information.",
      );
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(paymentScreenshot.type)) {
      setErrorMessage(
        isBangla
          ? "শুধুমাত্র JPG, PNG অথবা WEBP ছবি আপলোড করুন।"
          : "Only JPG, PNG or WEBP images are allowed.",
      );
      return false;
    }

    if (paymentScreenshot.size > 5 * 1024 * 1024) {
      setErrorMessage(
        isBangla
          ? "ছবির সাইজ সর্বোচ্চ ৫ MB হতে পারবে।"
          : "Image size must not exceed 5 MB.",
      );
      return false;
    }

    setErrorMessage("");
    return true;
  }

  async function handleSubmit() {
    if (!validatePaymentForm()) return;

    if (!selectedInstitution || !selectedScholarshipId || !paymentScreenshot) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      formData.append("institutionId", String(selectedInstitution.id));
      formData.append("scholarshipId", selectedScholarshipId);
      formData.append(
        "registrationIds",
        JSON.stringify(selectedRegistrationIds),
      );
      formData.append("paymentMethod", paymentMethod);
      formData.append("transactionId", transactionId.trim());
      formData.append("screenshot", paymentScreenshot);

      const response = await fetch("/api/payment-submissions", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment submission failed.");
      }

      setSuccessMessage(
        isBangla
          ? "পেমেন্টের তথ্য সফলভাবে জমা হয়েছে।"
          : "Payment information submitted successfully.",
      );

      setRegistrations((previous) =>
        previous.filter(
          (registration) => !selectedRegistrationIds.includes(registration.id),
        ),
      );

      setSelectedRegistrationIds([]);
      setPaymentMethod("");
      setTransactionId("");
      setPaymentScreenshot(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="size-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {isBangla ? "পেমেন্ট ফর্ম" : "Payment Form"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isBangla
                  ? "প্রতিষ্ঠান ও বৃত্তি নির্বাচন করে শিক্ষার্থীদের পেমেন্ট সম্পন্ন করুন।"
                  : "Select an institution and scholarship to make student payments."}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Institution Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isBangla ? "প্রতিষ্ঠানের নাম" : "Institution Name"}
              </label>

              <div className="relative">
                <input
                  autoComplete="off"
                  value={institutionName}
                  disabled={loadingInstitutions}
                  onChange={(event) => {
                    setInstitutionName(event.target.value);
                    setSelectedInstitution(null);
                    setSelectedScholarshipId("");
                    setErrorMessage("");
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  placeholder={
                    loadingInstitutions
                      ? isBangla
                        ? "প্রতিষ্ঠানের তালিকা লোড হচ্ছে..."
                        : "Loading institutions..."
                      : isBangla
                        ? "প্রতিষ্ঠানের নাম লিখে খুঁজুন"
                        : "Type to search institutions"
                  }
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                />

                {showSuggestions && institutionName.trim() && (
                  <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-card py-1 shadow-lg">
                    {filteredInstitutions.length > 0 ? (
                      filteredInstitutions.map((institution) => (
                        <li key={institution.id}>
                          <button
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleSelectInstitution(institution)}
                            className="w-full px-3 py-3 text-left text-sm transition-colors hover:bg-muted"
                          >
                            <span className="block font-medium">
                              {institution.name}
                            </span>

                            <span className="mt-1 block text-xs text-muted-foreground">
                              EIIN: {institution.eiin}
                            </span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-3 text-sm text-muted-foreground">
                        {isBangla
                          ? "কোনো প্রতিষ্ঠান পাওয়া যায়নি।"
                          : "No institutions found."}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Scholarship Selection */}
            {selectedInstitution && (
              <div className="space-y-2">
                <label
                  htmlFor="payment-scholarship"
                  className="text-sm font-medium"
                >
                  {isBangla ? "বৃত্তির নাম" : "Scholarship"}
                </label>

                <select
                  id="payment-scholarship"
                  value={selectedScholarshipId}
                  disabled={loadingScholarships}
                  onChange={(event) =>
                    setSelectedScholarshipId(event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                >
                  <option value="">
                    {loadingScholarships
                      ? isBangla
                        ? "লোড হচ্ছে..."
                        : "Loading..."
                      : isBangla
                        ? "বৃত্তি নির্বাচন করুন"
                        : "Select scholarship"}
                  </option>

                  {scholarships.map((scholarship) => (
                    <option key={scholarship.id} value={scholarship.id}>
                      {scholarship.name} ({scholarship.academicYear})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Student List */}
            {selectedInstitution && selectedScholarshipId && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold">
                    {isBangla ? "শিক্ষার্থীদের তালিকা" : "Student List"}
                  </h3>

                  {!loadingRegistrations &&
                    eligibleRegistrations.length > 0 && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={
                            selectedRegistrationIds.length ===
                              eligibleRegistrations.length &&
                            eligibleRegistrations.length > 0
                          }
                          onChange={(event) =>
                            handleSelectAll(event.target.checked)
                          }
                        />

                        {isBangla ? "সব নির্বাচন করুন" : "Select All"}
                      </label>
                    )}
                </div>

                {loadingRegistrations ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {isBangla
                      ? "শিক্ষার্থীদের তালিকা লোড হচ্ছে..."
                      : "Loading students..."}
                  </p>
                ) : eligibleRegistrations.length === 0 ? (
                  <p className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                    {isBangla
                      ? "এই বৃত্তির জন্য কোনো সবার ফি পরিশোধ করা হয়েছে।"
                      : "No unpaid registrations found for this scholarship."}
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-162.5 text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            {isBangla ? "নির্বাচন" : "Select"}
                          </th>
                          <th className="px-4 py-3 text-left">
                            {isBangla ? "শিক্ষার্থীর নাম" : "Student Name"}
                          </th>
                          <th className="px-4 py-3 text-left">
                            {isBangla ? "আইডি" : "Student ID"}
                          </th>
                          <th className="px-4 py-3 text-left">
                            {isBangla ? "শ্রেণি" : "Class"}
                          </th>
                          <th className="px-4 py-3 text-left">
                            {isBangla ? "রোল" : "Roll"}
                          </th>
                          <th className="px-4 py-3 text-left">
                            {isBangla ? "ফি" : "Fee"}
                          </th>
                          <th className="px-4 py-3 text-left">
                            {isBangla ? "অবস্থা" : "Status"}
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {eligibleRegistrations.map((registration) => {
                          const isSelected = selectedRegistrationIds.includes(
                            registration.id,
                          );

                          return (
                            <tr
                              key={registration.id}
                              className={isSelected ? "bg-primary/5" : ""}
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(event) =>
                                    handleRegistrationSelection(
                                      registration.id,
                                      event.target.checked,
                                    )
                                  }
                                  className="size-4 accent-primary disabled:cursor-not-allowed disabled:opacity-40"
                                />
                              </td>

                              <td className="px-4 py-3 font-medium">
                                {registration.studentName}
                              </td>

                              <td className="px-4 py-3">
                                {registration.studentId}
                              </td>

                              <td className="px-4 py-3">
                                {registration.studentClass}
                              </td>

                              <td className="px-4 py-3">
                                {registration.studentRoll}
                              </td>

                              <td className="px-4 py-3">
                                ৳{registration.registrationFee}
                              </td>

                              <td className="px-4 py-3">
                                <span className="text-red-600">
                                  {isBangla ? "ফি-বাকি" : "Unpaid"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Total Amount */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/40 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isBangla ? "নির্বাচিত শিক্ষার্থী" : "Selected Students"}
                    </p>

                    <p className="text-lg font-semibold">
                      {selectedRegistrationIds.length}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {isBangla ? "সর্বমোট পরিমাণ" : "Total Amount"}
                    </p>

                    <p className="text-xl font-bold text-primary">
                      ৳{totalAmount.toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {selectedRegistrationIds.length > 0 && (
              <div className="space-y-5 border-t pt-6">
                <h3 className="text-base font-semibold">
                  {isBangla ? "পেমেন্টের তথ্য" : "Payment Information"}
                </h3>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isBangla ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">
                      {isBangla
                        ? "পেমেন্ট মাধ্যম নির্বাচন করুন"
                        : "Select Payment Method"}
                    </option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isBangla ? "ট্রানজেকশন আইডি" : "Transaction ID"}
                  </label>

                  <input
                    type="text"
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                    placeholder={
                      isBangla
                        ? "ট্রানজেকশন আইডি লিখুন"
                        : "Enter Transaction ID"
                    }
                    className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Payment Screenshot */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isBangla ? "পেমেন্টের স্ক্রিনশট" : "Payment Screenshot"}
                  </label>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setPaymentScreenshot(event.target.files?.[0] ?? null)
                    }
                    className="block w-full rounded-lg border bg-background p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground"
                  />

                  <p className="text-xs text-muted-foreground">
                    {isBangla
                      ? "শুধুমাত্র JPG, PNG অথবা WEBP ছবি নির্বাচন করুন।"
                      : "Only JPG, PNG or WEBP images are allowed."}
                  </p>

                  {paymentScreenshot && (
                    <p className="text-sm text-muted-foreground">
                      {paymentScreenshot.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? isBangla
                      ? "জমা হচ্ছে..."
                      : "Submitting..."
                    : isBangla
                      ? "পেমেন্ট জমা দিন"
                      : "Submit Payment"}
                </button>
              </div>
            )}

            {successMessage && (
              <p className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700">
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
