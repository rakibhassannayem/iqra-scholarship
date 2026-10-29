"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export type ScholarshipFormValues = {
  name: string;
  description: string;
  academicYear: string;
  endDate: string;
  eligibility: string;
  examCenter: string;
  examDate: string;
  examTime: string;
  examStartTime: string;
  examEndTime: string;
};

type ScholarshipFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: ScholarshipFormValues;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: ScholarshipFormValues) => void;
};

export const emptyScholarshipForm: ScholarshipFormValues = {
  name: "",
  description: "",
  academicYear: "",
  endDate: "",
  eligibility: "",
  examCenter: "",
  examDate: "",
  examTime: "",
  examStartTime: "",
  examEndTime: "",
};

export default function ScholarshipForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: ScholarshipFormProps) {
  const [startHour, setStartHour] = useState("11");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM");

  const [endHour, setEndHour] = useState("12");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("PM");

  useEffect(() => {
    if (!open) return;

    function parseTime(
      value: string,
      fallback: { hour: string; minute: string; period: "AM" | "PM" },
    ) {
      const match = value.match(
        /^(সকাল|বিকাল|দুপুর|রাত)?\s*(\d{1,2}):(\d{2})\s*টা?$/,
      );

      if (!match) return fallback;

      const [, label, hour, minute] = match;

      return {
        hour: hour.padStart(2, "0"),
        minute,
        period: (label === "বিকাল" || label === "রাত" ? "PM" : "AM") as
          | "AM"
          | "PM",
      };
    }

    const start = parseTime(initialValues.examStartTime, {
      hour: "11",
      minute: "00",
      period: "AM",
    });

    const end = parseTime(initialValues.examEndTime, {
      hour: "12",
      minute: "00",
      period: "PM",
    });

    setStartHour(start.hour);
    setStartMinute(start.minute);
    setStartPeriod(start.period);

    setEndHour(end.hour);
    setEndMinute(end.minute);
    setEndPeriod(end.period);
  }, [open, initialValues.examStartTime, initialValues.examEndTime]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const formatTime = (hour: string, minute: string, period: "AM" | "PM") => {
      const periodLabel = period === "AM" ? "সকাল" : "বিকাল";
      return `${periodLabel} ${hour}:${minute} টা`;
    };

    const examStartTime = formatTime(startHour, startMinute, startPeriod);
    const examEndTime = formatTime(endHour, endMinute, endPeriod);

    onSubmit({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      academicYear: String(formData.get("academicYear") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
      eligibility: String(formData.get("eligibility") ?? ""),
      examCenter: String(formData.get("examCenter") ?? ""),
      examDate: String(formData.get("examDate") ?? ""),
      examTime: `${examStartTime} হতে ${examEndTime}`,
      examStartTime,
      examEndTime,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Scholarship" : "Create Scholarship"}
          </DialogTitle>
          <DialogDescription>Scholarship-এর তথ্য পূরণ করো।</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Scholarship Name</Label>
              <Input
                id="name"
                name="name"
                required
                maxLength={255}
                defaultValue={initialValues.name}
                placeholder="Annual Scholarship 2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                name="academicYear"
                required
                maxLength={20}
                defaultValue={initialValues.academicYear}
                placeholder="2026"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="endDate">Registration Deadline / Last Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                defaultValue={initialValues.endDate}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                maxLength={2000}
                defaultValue={initialValues.description}
                placeholder="Scholarship সম্পর্কে বিবরণ"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="eligibility">Eligibility</Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                required
                maxLength={2000}
                defaultValue={initialValues.eligibility}
                placeholder="কারা আবেদন করতে পারবে (যোগ্যতা)"
              />
            </div>
          </div>

          {/* Exam info section for Admit Card */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <h4 className="font-semibold text-sm">
                Admit Card-এর জন্য পরীক্ষার তথ্য (আবশ্যক)
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              এই ফিল্ডগুলো পূরণ করলে রেজিস্ট্রেশন শেষে শিক্ষার্থীর প্রবেশপত্রে
              (Admit Card) পরীক্ষার কেন্দ্র, তারিখ ও সময় সরাসরি প্রদর্শিত হবে।
            </p>

            <div className="space-y-2">
              <Label htmlFor="examCenter">Exam Center (পরীক্ষা কেন্দ্র)</Label>
              <Input
                id="examCenter"
                name="examCenter"
                required
                maxLength={500}
                defaultValue={initialValues.examCenter}
                placeholder="যেমন: ইকরা একাডেমি অডিটোরিয়াম, ঢাকা"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date (পরীক্ষার তারিখ)</Label>
                <Input
                  id="examDate"
                  name="examDate"
                  type="date"
                  required
                  defaultValue={initialValues.examDate}
                />
              </div>

              <div className="space-y-3">
                <Label>Exam Time (পরীক্ষার সময়)</Label>

                {/* Start Time */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Start Time — শুরুর সময়
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      required
                      value={startHour}
                      onChange={(event) => setStartHour(event.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      aria-label="Start hour"
                    >
                      {Array.from({ length: 12 }, (_, index) => {
                        const hour = String(index + 1).padStart(2, "0");
                        return (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      required
                      value={startMinute}
                      onChange={(event) => setStartMinute(event.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      aria-label="Start minute"
                    >
                      {Array.from({ length: 60 }, (_, index) => {
                        const minute = String(index).padStart(2, "0");
                        return (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      required
                      value={startPeriod}
                      onChange={(event) =>
                        setStartPeriod(event.target.value as "AM" | "PM")
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      aria-label="Start AM or PM"
                    >
                      <option value="AM">AM — সকাল</option>
                      <option value="PM">PM — বিকাল</option>
                    </select>
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    End Time — শেষের সময়
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      required
                      value={endHour}
                      onChange={(event) => setEndHour(event.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      aria-label="End hour"
                    >
                      {Array.from({ length: 12 }, (_, index) => {
                        const hour = String(index + 1).padStart(2, "0");
                        return (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      required
                      value={endMinute}
                      onChange={(event) => setEndMinute(event.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      aria-label="End minute"
                    >
                      {Array.from({ length: 60 }, (_, index) => {
                        const minute = String(index).padStart(2, "0");
                        return (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      required
                      value={endPeriod}
                      onChange={(event) =>
                        setEndPeriod(event.target.value as "AM" | "PM")
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      aria-label="End AM or PM"
                    >
                      <option value="AM">AM — সকাল</option>
                      <option value="PM">PM — বিকাল</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
