"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import type {
  StudentFormValues,
  StudentFormInitialValues,
} from "@/types/student";
import type { Institution } from "@/types/institution";
import type { Scholarship } from "@/types/scholarship";

export type { StudentFormValues, StudentFormInitialValues };

type StudentFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: StudentFormInitialValues | null;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: StudentFormValues) => void;
};

const emptyForm: StudentFormValues = {
  name: "",
  institutionId: 0,
  scholarshipId: undefined,
  class: 1,
  roll: 1,
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

export default function StudentForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: StudentFormProps) {
  const [form, setForm] = useState<StudentFormValues>(emptyForm);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Institution searchable autocomplete
  const [institutionName, setInstitutionName] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [rollInput, setRollInput] = useState("1");
  const [localError, setLocalError] = useState("");

  // Load choices
  useEffect(() => {
    if (!open) return;

    let mounted = true;
    setLoadingData(true);
    setLocalError("");

    Promise.all([fetch("/api/institutions"), fetch("/api/scholarships")])
      .then(async ([instRes, schRes]) => {
        if (!mounted) return;
        let loadedInstitutions: Institution[] = [];
        if (instRes.ok) {
          loadedInstitutions = await instRes.json();
          setInstitutions(loadedInstitutions);
        }
        if (schRes.ok) {
          const schData: Scholarship[] = await schRes.json();
          setScholarships(schData);
        }

        // Setup initial values if editing or if new
        if (initialValues) {
          const matchedInst = loadedInstitutions.find(
            (inst) => inst.id === initialValues.institutionId,
          );
          if (matchedInst) {
            setSelectedInstitution(matchedInst);
            setInstitutionName(matchedInst.name);
          }
          setForm({
            name: initialValues.name,
            institutionId: initialValues.institutionId,
            scholarshipId: initialValues.scholarshipId ?? undefined,
            class: initialValues.class,
            roll: initialValues.roll,
          });
          setRollInput(String(initialValues.roll));
        } else {
          setForm(emptyForm);
          setInstitutionName("");
          setSelectedInstitution(null);
          setRollInput("1");
        }
      })
      .catch((err) => console.error("Failed to load student form data:", err))
      .finally(() => {
        if (mounted) setLoadingData(false);
      });

    return () => {
      mounted = false;
    };
  }, [open, initialValues]);

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
    setForm((prev) => ({ ...prev, institutionId: 0 }));
    setLocalError("");
    setShowSuggestions(true);
  }

  function handleSelectInstitution(inst: Institution) {
    setSelectedInstitution(inst);
    setInstitutionName(inst.name);
    setForm((prev) => ({ ...prev, institutionId: inst.id }));
    setShowSuggestions(false);
    setLocalError("");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!selectedInstitution || !form.institutionId) {
      setLocalError("Please select an institution from the list.");
      return;
    }

    const numericRoll = Number(convertBengaliDigitsToEnglish(rollInput.trim()));
    if (!numericRoll || Number.isNaN(numericRoll) || numericRoll < 1) {
      setLocalError("Please enter a valid roll number.");
      return;
    }

    onSubmit({
      ...form,
      roll: numericRoll,
    });
  };

  const selectedScholarship = scholarships.find(
    (s) => s.id === form.scholarshipId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <DialogTitle>
                {editing ? "Edit Student Registration" : "Student Registration"}
              </DialogTitle>
              <DialogDescription>
                {editing
                  ? "Update the student's information and institutional allocation."
                  : "Enter student details to register them in the scholarship program."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Institution with Autocomplete */}
          <div className="space-y-1.5">
            <Label htmlFor="inst-name">
              Educational Institution <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="inst-name"
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
            <Label htmlFor="inst-eiin">Institution EIIN</Label>
            <Input
              id="inst-eiin"
              readOnly
              value={selectedInstitution?.eiin ?? ""}
              placeholder="Auto-filled once institution is selected"
              className="bg-muted text-muted-foreground"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Student Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              required
              maxLength={150}
              placeholder="e.g. Abdullah Al Mamun"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                setLocalError("");
              }}
            />
          </div>

          {/* Class & Roll */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="class">
                Class <span className="text-destructive">*</span>
              </Label>
              <select
                id="class"
                required
                value={form.class}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    class: Number(e.target.value),
                  }));
                  setLocalError("");
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="roll">
                Roll Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="roll"
                required
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={rollInput}
                onChange={(e) => {
                  setRollInput(
                    e.target.value.replace(/[^0-9০-৯]/g, "").slice(0, 10),
                  );
                  setLocalError("");
                }}
                placeholder="e.g. 12 or ১২"
              />
            </div>
          </div>

          {/* Scholarship Program */}
          <div className="space-y-1.5">
            <Label htmlFor="scholarship">
              Assign to Scholarship{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <select
              id="scholarship"
              disabled={loadingData}
              value={form.scholarshipId || ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setForm((prev) => ({ ...prev, scholarshipId: val }));
                setLocalError("");
                const sch = scholarships.find((s) => s.id === val);
                if (sch) {
                  setForm((prev) => ({ ...prev, class: sch.eligibilityClass }));
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
            {selectedScholarship && (
              <p className="text-[11px] text-muted-foreground">
                Eligible Class: <strong>Class {selectedScholarship.eligibilityClass}</strong> | Fee: ৳{selectedScholarship.registrationFee}
              </p>
            )}
          </div>

          {/* Error Message */}
          {(localError || error) && (
            <p className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {localError || error}
            </p>
          )}

          {/* Actions */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.name.trim()}>
              {saving
                ? "Saving..."
                : editing
                  ? "Update Registration"
                  : "Register Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
