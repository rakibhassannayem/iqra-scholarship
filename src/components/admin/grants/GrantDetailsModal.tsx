"use client";

import { Award, Building2, Calendar, CheckCircle2, Clock, GraduationCap, Trophy, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Grant } from "./GrantTable";

type GrantDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grant: Grant | null;
  onEdit?: (grant: Grant) => void;
};

export default function GrantDetailsModal({
  open,
  onOpenChange,
  grant,
  onEdit,
}: GrantDetailsModalProps) {
  if (!grant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Award className="size-5" />
            </div>
            <div>
              <DialogTitle>Scholarship Grant Details</DialogTitle>
              <DialogDescription>
                Granted student and scholarship information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Header Card: Student Info */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{grant.studentName}</h3>
                <p className="text-xs font-mono text-muted-foreground">
                  ID: {grant.studentId}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
              <Badge variant="outline" className="font-normal">
                Class: {grant.studentClass ?? "N/A"}
              </Badge>
              <Badge variant="outline" className="font-normal">
                Roll: {grant.studentRoll ?? "N/A"}
              </Badge>
              <Badge className="bg-primary/90">
                {grant.categoryName}
              </Badge>
              <Badge
                variant={grant.prizeStatus === "received" ? "default" : "secondary"}
                className={grant.prizeStatus === "received" ? "bg-emerald-600" : ""}
              >
                Prize: {grant.prizeStatus === "received" ? "Received" : "Pending"}
              </Badge>
            </div>
          </div>

          {/* Institution Info */}
          <div className="rounded-lg border p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Building2 className="size-3.5" />
              <span>Institution Information</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Name</span>
                <span className="font-medium">{grant.institutionName}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">EIIN</span>
                <span className="font-mono">{grant.institutionEiin || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Scholarship Program Info */}
          <div className="rounded-lg border p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <GraduationCap className="size-3.5" />
              <span>Scholarship Program</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Program</span>
                <span className="font-medium">{grant.scholarshipName}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Academic Year</span>
                <span className="font-medium">{grant.academicYear || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Prize Status Info */}
          <div className="rounded-lg border p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Trophy className="size-3.5" />
              <span>Prize Distribution Status</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Status</span>
                <span className="font-medium flex items-center gap-1.5 mt-0.5">
                  {grant.prizeStatus === "received" ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Received
                    </>
                  ) : (
                    <>
                      <Clock className="size-4 text-amber-500" />
                      Pending Confirmation
                    </>
                  )}
                </span>
              </div>
              {grant.prizeReceivedAt && (
                <div>
                  <span className="text-xs text-muted-foreground block">Received Date</span>
                  <span className="font-medium">
                    {new Date(grant.prizeReceivedAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              )}
              {grant.confirmedBy && (
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Confirmed By</span>
                  <span className="font-medium">{grant.confirmedBy}</span>
                </div>
              )}
              {grant.prizeNotes && (
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Notes</span>
                  <p className="text-xs text-muted-foreground italic mt-0.5">
                    {grant.prizeNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Granted Date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              <span>
                Granted on: {new Date(grant.grantedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onEdit(grant);
              }}
            >
              Edit Grant
            </Button>
          )}
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
