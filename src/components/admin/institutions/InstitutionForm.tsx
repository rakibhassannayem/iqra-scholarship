"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, User, MapPin } from "lucide-react";

export type InstitutionFormValues = {
  name: string;
  eiin: string;
  principal: string;
  principalPhone: string;
  representative: string;
  representativePhone: string;
  division: string;
  district: string;
  upazila: string;
  village: string;
  block: string;
  address: string;
};

export const emptyInstitutionForm: InstitutionFormValues = {
  name: "",
  eiin: "",
  principal: "",
  principalPhone: "",
  representative: "",
  representativePhone: "",
  division: "",
  district: "",
  upazila: "",
  village: "",
  block: "",
  address: "",
};

type InstitutionFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: InstitutionFormValues;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: InstitutionFormValues) => void;
};

export default function InstitutionForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: InstitutionFormProps) {
  const [values, setValues] = useState<InstitutionFormValues>(emptyInstitutionForm);

  useEffect(() => {
    if (open) {
      setValues({ ...initialValues });
    }
  }, [open, initialValues]);

  function handleChange(field: keyof InstitutionFormValues, val: string) {
    setValues((prev) => ({ ...prev, [field]: val }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      name: values.name.trim(),
      eiin: values.eiin.trim(),
      principal: values.principal.trim(),
      principalPhone: values.principalPhone.trim(),
      representative: values.representative.trim(),
      representativePhone: values.representativePhone.trim(),
      division: values.division.trim(),
      district: values.district.trim(),
      upazila: values.upazila.trim(),
      village: values.village.trim(),
      block: values.block.trim(),
      address: values.address.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <School className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {editing ? "Edit Institution" : "Add New Institution"}
              </DialogTitle>
              <DialogDescription>
                {editing
                  ? "Update institution details, contacts, and address."
                  : "Register a new school or madrasa with address and contacts."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <School className="size-3.5 text-primary" />
              <span>General Information (প্রাতিষ্ঠানিক তথ্য)</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="institution-name" className="text-xs font-semibold">
                  Institution Name (প্রতিষ্ঠানের নাম) *
                </Label>
                <Input
                  id="institution-name"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="institution-eiin" className="text-xs font-semibold">
                  EIIN (এলহাক নম্বর) *
                </Label>
                <Input
                  id="institution-eiin"
                  value={values.eiin}
                  onChange={(e) => handleChange("eiin", e.target.value)}
                  placeholder="e.g. 123456"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Leadership & Contacts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <User className="size-3.5 text-primary" />
              <span>Leadership & Contacts (দায়িত্বশীল ব্যক্তিবর্গ)</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="principal" className="text-xs font-semibold">
                  Principal (মোহতামিম)
                </Label>
                <Input
                  id="principal"
                  value={values.principal}
                  onChange={(e) => handleChange("principal", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="principal-phone" className="text-xs font-semibold">
                  Principal Phone (মোহতামিমের ফোন)
                </Label>
                <Input
                  id="principal-phone"
                  value={values.principalPhone}
                  onChange={(e) => handleChange("principalPhone", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="representative" className="text-xs font-semibold">
                  Representative (প্রতিনিধি)
                </Label>
                <Input
                  id="representative"
                  value={values.representative}
                  onChange={(e) => handleChange("representative", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="representative-phone" className="text-xs font-semibold">
                  Representative Phone (প্রতিনিধির ফোন)
                </Label>
                <Input
                  id="representative-phone"
                  value={values.representativePhone}
                  onChange={(e) => handleChange("representativePhone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Address Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              <span>Address Details (ঠিকানা)</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="division" className="text-xs font-semibold">
                  Division (বিভাগ)
                </Label>
                <Input
                  id="division"
                  value={values.division}
                  onChange={(e) => handleChange("division", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="district" className="text-xs font-semibold">
                  District (জেলা)
                </Label>
                <Input
                  id="district"
                  value={values.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="upazila" className="text-xs font-semibold">
                  Upazila (উপজেলা)
                </Label>
                <Input
                  id="upazila"
                  value={values.upazila}
                  onChange={(e) => handleChange("upazila", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="village" className="text-xs font-semibold">
                  Village (গ্রাম)
                </Label>
                <Input
                  id="village"
                  value={values.village}
                  onChange={(e) => handleChange("village", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="block" className="text-xs font-semibold">
                  Block (ব্লক)
                </Label>
                <Input
                  id="block"
                  value={values.block}
                  onChange={(e) => handleChange("block", e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editing
                  ? "Update Institution"
                  : "Create Institution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
