"use client";

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
import { useState } from "react";
import type { DirectRegisterFormData } from "@/types/registration";

export type { DirectRegisterFormData };

type DirectRegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  error: string;
  onSubmit: (data: DirectRegisterFormData) => Promise<void>;
};

export default function DirectRegisterModal({
  open,
  onOpenChange,
  saving,
  error,
  onSubmit,
}: DirectRegisterModalProps) {
  const [institutionId, setInstitutionId] = useState("");
  const [scholarshipId, setScholarshipId] = useState("");
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [roll, setRoll] = useState("");

  function handleClose() {
    setInstitutionId("");
    setScholarshipId("");
    setName("");
    setStudentClass("");
    setRoll("");
    onOpenChange(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      institutionId: Number(institutionId),
      scholarshipId: Number(scholarshipId),
      name,
      class: Number(studentClass),
      roll: Number(roll),
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Registration</DialogTitle>
          <DialogDescription>
            Directly register a student for a scholarship.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dr-institution">Institution ID</Label>
            <Input
              id="dr-institution"
              type="number"
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              placeholder="Institution ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dr-scholarship">Scholarship ID</Label>
            <Input
              id="dr-scholarship"
              type="number"
              value={scholarshipId}
              onChange={(e) => setScholarshipId(e.target.value)}
              placeholder="Scholarship ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dr-name">Student Name</Label>
            <Input
              id="dr-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dr-class">Class</Label>
              <Input
                id="dr-class"
                type="number"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="e.g. 10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dr-roll">Roll</Label>
              <Input
                id="dr-roll"
                type="number"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="e.g. 1"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

