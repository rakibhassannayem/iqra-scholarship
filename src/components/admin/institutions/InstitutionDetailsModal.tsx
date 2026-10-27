"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  School,
  MapPin,
  User,
  Phone,
  Calendar,
  Building,
} from "lucide-react";
import type { Institution } from "./InstitutionTable";

type InstitutionDetailsModalProps = {
  institution: Institution | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (institution: Institution) => void;
};

export default function InstitutionDetailsModal({
  institution,
  open,
  onOpenChange,
  onEdit,
}: InstitutionDetailsModalProps) {
  if (!institution) return null;

  const formattedDate = institution.createdAt
    ? new Date(institution.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  // Build structured address string
  const addressParts = [
    institution.village ? `Village: ${institution.village}` : null,
    institution.block ? `Block: ${institution.block}` : null,
    institution.upazila ? `Upazila: ${institution.upazila}` : null,
    institution.district ? `District: ${institution.district}` : null,
    institution.division ? `Division: ${institution.division}` : null,
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <School className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {institution.name}
              </DialogTitle>
              <DialogDescription className="mt-0.5 flex items-center gap-2">
                <span>EIIN:</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {institution.eiin}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4 text-sm">
          {/* Contacts Section */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Principal */}
            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <User className="size-3.5 text-primary" />
                Principal (মোহতামিম)
              </div>
              <p className="mt-2 font-medium text-foreground">
                {institution.principal || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </p>
              {institution.principalPhone ? (
                <a
                  href={`tel:${institution.principalPhone}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Phone className="size-3" />
                  {institution.principalPhone}
                </a>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">Phone: N/A</p>
              )}
            </div>

            {/* Representative */}
            <div className="rounded-xl border bg-card p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Building className="size-3.5 text-primary" />
                Representative (প্রতিনিধি)
              </div>
              <p className="mt-2 font-medium text-foreground">
                {institution.representative || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </p>
              {institution.representativePhone ? (
                <a
                  href={`tel:${institution.representativePhone}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Phone className="size-3" />
                  {institution.representativePhone}
                </a>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">Phone: N/A</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <MapPin className="size-3.5 text-primary" />
              Address Details (ঠিকানা)
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              <div className="rounded-lg border bg-background p-2">
                <span className="text-muted-foreground">Division (বিভাগ):</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {institution.division || "—"}
                </p>
              </div>

              <div className="rounded-lg border bg-background p-2">
                <span className="text-muted-foreground">District (জেলা):</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {institution.district || "—"}
                </p>
              </div>

              <div className="rounded-lg border bg-background p-2">
                <span className="text-muted-foreground">Upazila (উপজেলা):</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {institution.upazila || "—"}
                </p>
              </div>

              <div className="rounded-lg border bg-background p-2">
                <span className="text-muted-foreground">Village (গ্রাম):</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {institution.village || "—"}
                </p>
              </div>

              <div className="rounded-lg border bg-background p-2">
                <span className="text-muted-foreground">Block (ব্লক):</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {institution.block || "—"}
                </p>
              </div>

              <div className="rounded-lg border bg-background p-2">
                <span className="text-muted-foreground">Registered:</span>
                <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground" />
                  {formattedDate}
                </p>
              </div>
            </div>

            {institution.address && (
              <div className="mt-2.5 rounded-lg border bg-background p-2 text-xs">
                <span className="text-muted-foreground">Full Address Note:</span>
                <p className="mt-0.5 font-medium text-foreground">
                  {institution.address}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t pt-4">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(institution);
              }}
            >
              Edit Institution
            </Button>
          )}
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
