"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Edit3, Check, Award, X } from "lucide-react";
import type { CertificateData } from "@/types/certificate";
import CertificateView, { printIsolatedCertificates } from "./CertificateView";

type CertificateModalProps = {
  certificate: CertificateData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CertificateModal({
  certificate,
  open,
  onOpenChange,
}: CertificateModalProps) {
  const [formData, setFormData] = useState<CertificateData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (certificate) {
      setFormData({ ...certificate });
      setIsEditing(false);
    }
  }, [certificate]);

  if (!formData) return null;

  function handleFieldChange(field: keyof CertificateData, val: string) {
    setFormData((prev) => (prev ? { ...prev, [field]: val } : null));
  }

  function handleModalPrint() {
    if (!formData) return;
    const filename = formData.studentId || String(formData.studentDbId);
    printIsolatedCertificates(filename);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 print:max-w-none print:max-h-none print:overflow-visible print:p-0 print:border-none print:shadow-none print:bg-white">
        <DialogHeader className="print:hidden pb-2 border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-800">
                <Award className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold">
                  বৃত্তি সনদপত্র প্রিভিউ ও প্রিন্ট
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  শিক্ষার্থী: {formData.studentName} ({formData.studentId})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleModalPrint}
                className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
              >
                <Printer className="size-3.5" /> প্রিন্ট / PDF
              </Button>

              <Button
                type="button"
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing((prev) => !prev)}
                className="gap-1.5 text-xs"
              >
                {isEditing ? (
                  <>
                    <Check className="size-3.5" /> প্রিভিউ দেখুন
                  </>
                ) : (
                  <>
                    <Edit3 className="size-3.5" /> তথ্য সংশোধন করুন
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Edit Panel (if editing is active) */}
        {isEditing && (
          <div className="print:hidden my-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <p className="text-xs font-bold text-amber-900">
              প্রয়োজনে প্রিন্ট করার পূর্বে সনদের তথ্য সাময়িকভাবে পরিবর্তন করুন:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cert-name" className="text-xs">শিক্ষার্থীর নাম</Label>
                <Input
                  id="cert-name"
                  value={formData.studentName}
                  onChange={(e) => handleFieldChange("studentName", e.target.value)}
                  className="h-8 text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cert-father" className="text-xs">পিতার নাম</Label>
                <Input
                  id="cert-father"
                  value={formData.fatherName || ""}
                  onChange={(e) => handleFieldChange("fatherName", e.target.value)}
                  placeholder="পিতার নাম"
                  className="h-8 text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cert-mother" className="text-xs">মাতার নাম</Label>
                <Input
                  id="cert-mother"
                  value={formData.motherName || ""}
                  onChange={(e) => handleFieldChange("motherName", e.target.value)}
                  placeholder="মাতার নাম"
                  className="h-8 text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cert-category" className="text-xs">সনদ প্রাপ্ত ক্যাটাগরি</Label>
                <Input
                  id="cert-category"
                  value={formData.categoryName}
                  onChange={(e) => handleFieldChange("categoryName", e.target.value)}
                  placeholder="যেমন: ট্যালেন্টপুল / সাধারণ"
                  className="h-8 text-xs bg-background font-bold text-red-700"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cert-class" className="text-xs">শ্রেণি</Label>
                <Input
                  id="cert-class"
                  value={formData.className}
                  onChange={(e) => handleFieldChange("className", e.target.value)}
                  placeholder="শ্রেণি"
                  className="h-8 text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cert-center" className="text-xs">পরীক্ষা কেন্দ্র</Label>
                <Input
                  id="cert-center"
                  value={formData.examCenter}
                  onChange={(e) => handleFieldChange("examCenter", e.target.value)}
                  placeholder="কেন্দ্র"
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
          </div>
        )}

        {/* Certificate View */}
        <div className="py-2">
          <CertificateView data={formData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
