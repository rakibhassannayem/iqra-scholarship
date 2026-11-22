"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, School } from "lucide-react";
import type { DirectRegisterFormData } from "@/types/registration";
import type { Institution } from "@/types/institution";
import type { Scholarship } from "@/types/scholarship";

export type { DirectRegisterFormData };

type DirectRegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  error: string;
  onSubmit: (data: DirectRegisterFormData) => Promise<void>;
};

function convertBengaliDigitsToEnglish(input: string): string {
  const banglaDigits: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return input.replace(/[০-৯]/g, (digit) => banglaDigits[digit] || digit);
}

export default function DirectRegisterModal({
  open,
  onOpenChange,
  saving,
  error,
  onSubmit,
}: DirectRegisterModalProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Form states
  const [institutionName, setInstitutionName] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [classId, setClassId] = useState("");
  const [roll, setRoll] = useState("");
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>("");
  const [validationError, setValidationError] = useState("");

  // Load institutions and scholarships on open
  useEffect(() => {
    if (!open) return;

    let mounted = true;
    setLoadingData(true);
    setValidationError("");

    Promise.all([fetch("/api/institutions"), fetch("/api/scholarships")])
      .then(async ([instRes, schRes]) => {
        if (!mounted) return;
        if (instRes.ok) {
          const instData = await instRes.json();
          setInstitutions(instData);
        }
        if (schRes.ok) {
          const schData: Scholarship[] = await schRes.json();
          setScholarships(schData);

          // Auto-select active scholarship if none selected
          const active = schData.find((s) => s.isActive);
          if (active) {
            setSelectedScholarshipId(String(active.id));
            if (!classId) {
              setClassId(String(active.eligibilityClass));
            }
          }
        }
      })
      .catch((err) => console.error("Failed to load modal data:", err))
      .finally(() => {
        if (mounted) setLoadingData(false);
      });

    return () => {
      mounted = false;
    };
  }, [open]);

  const filteredInstitutions = institutions.filter((inst) => {
    const q = institutionName.trim().toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.eiin.toLowerCase().includes(q)
    );
  });

  function handleInstitutionInput(value: string) {
    setInstitutionName(value);
    setSelectedInstitution(null);
    setValidationError("");
    setShowSuggestions(true);
  }

  function handleSelectInstitution(inst: Institution) {
    setSelectedInstitution(inst);
    setInstitutionName(inst.name);
    setShowSuggestions(false);
    setValidationError("");
  }

  function handleClose() {
    setInstitutionName("");
    setSelectedInstitution(null);
    setShowSuggestions(false);
    setStudentName("");
    setFatherName("");
    setMotherName("");
    setClassId("");
    setRoll("");
    setSelectedScholarshipId("");
    setValidationError("");
    onOpenChange(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!selectedInstitution) {
      setValidationError("Please select an institution from the list.");
      return;
    }

    const numericRoll = Number(convertBengaliDigitsToEnglish(roll.trim()));
    if (!numericRoll || Number.isNaN(numericRoll) || numericRoll < 1) {
      setValidationError("Please enter a valid roll number.");
      return;
    }

    const numericClass = Number(convertBengaliDigitsToEnglish(classId.trim()));
    if (!numericClass || Number.isNaN(numericClass) || numericClass < 1 || numericClass > 12) {
      setValidationError("Please select a valid class.");
      return;
    }

    // Check eligibility if a scholarship is selected
    const chosenScholarship = scholarships.find(
      (s) => String(s.id) === selectedScholarshipId,
    );
    if (chosenScholarship && numericClass !== chosenScholarship.eligibilityClass) {
      setValidationError(
        `Selected scholarship "${chosenScholarship.name}" is only available for Class ${chosenScholarship.eligibilityClass}.`,
      );
      return;
    }

    await onSubmit({
      institutionId: selectedInstitution.id,
      scholarshipId: selectedScholarshipId ? Number(selectedScholarshipId) : undefined,
      name: studentName.trim(),
      fatherName: fatherName.trim() || undefined,
      motherName: motherName.trim() || undefined,
      class: numericClass,
      roll: numericRoll,
    });
  }

  const currentScholarship = scholarships.find(
    (s) => String(s.id) === selectedScholarshipId,
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <DialogTitle>Student Registration</DialogTitle>
              <DialogDescription>
                Register a new student directly into the scholarship system.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Institution with Search Suggestions */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-reg-institution">
              Educational Institution <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="admin-reg-institution"
                required
                autoComplete="off"
                value={institutionName}
                onChange={(e) => handleInstitutionInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={
                  loadingData
                    ? "Loading institutions..."
                    : "Type to search by name or EIIN..."
                }
                disabled={loadingData}
              />

              {showSuggestions && institutionName.trim() && (
                <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border bg-popover py-1 shadow-lg ring-1 ring-border text-popover-foreground">
                  {filteredInstitutions.length > 0 ? (
                    filteredInstitutions.slice(0, 20).map((inst) => (
                      <li key={inst.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectInstitution(inst)}
                          className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                        >
                          <span className="block font-medium text-foreground">
                            {inst.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            EIIN: {inst.eiin}
                          </span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2.5 text-xs text-muted-foreground text-center">
                      No matching institutions found
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Institution EIIN (Auto-filled) */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-reg-eiin">Institution EIIN</Label>
            <Input
              id="admin-reg-eiin"
              readOnly
              value={selectedInstitution?.eiin ?? ""}
              placeholder="Auto-filled once institution is selected"
              className="bg-muted text-muted-foreground"
            />
          </div>

          {/* Student Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-reg-name">
              Student Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="admin-reg-name"
              required
              maxLength={150}
              autoComplete="name"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setValidationError("");
              }}
              placeholder="Enter student full name"
            />
          </div>

          {/* Father & Mother Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="admin-reg-father">
                Father's Name{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="admin-reg-father"
                maxLength={150}
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="পিতার নাম"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-reg-mother">
                Mother's Name{" "}
                <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="admin-reg-mother"
                maxLength={150}
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="মাতার নাম"
              />
            </div>
          </div>

          {/* Class and Roll */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="admin-reg-class">
                Class <span className="text-destructive">*</span>
              </Label>
              <select
                id="admin-reg-class"
                required
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setValidationError("");
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select class</option>
                {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-reg-roll">
                Roll Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-reg-roll"
                required
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={roll}
                onChange={(e) => {
                  setRoll(
                    e.target.value.replace(/[^0-9০-৯]/g, "").slice(0, 10),
                  );
                  setValidationError("");
                }}
                placeholder="e.g. 12 or ১২"
              />
            </div>
          </div>

          {/* Scholarship Program */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-reg-scholarship">
              Assign to Scholarship{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <select
              id="admin-reg-scholarship"
              value={selectedScholarshipId}
              onChange={(e) => {
                setSelectedScholarshipId(e.target.value);
                setValidationError("");
                const sch = scholarships.find((s) => String(s.id) === e.target.value);
                if (sch) {
                  setClassId(String(sch.eligibilityClass));
                }
              }}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Auto-assign active scholarship</option>
              {scholarships.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name} (Class {sch.eligibilityClass}) {sch.isActive ? "— Active" : ""}
                </option>
              ))}
            </select>
            {currentScholarship && (
              <p className="text-[11px] text-muted-foreground">
                Eligible Class: <strong>Class {currentScholarship.eligibilityClass}</strong> | Fee: ৳{currentScholarship.registrationFee}
              </p>
            )}
          </div>

          {/* Error Message */}
          {(validationError || error) && (
            <p className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {validationError || error}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !studentName.trim()}>
              {saving ? "Registering..." : "Register Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
