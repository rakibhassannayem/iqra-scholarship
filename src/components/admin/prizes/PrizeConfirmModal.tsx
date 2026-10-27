"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  CheckCircle2,
  Clock,
  User,
  School,
  Award,
} from "lucide-react";
import type { PrizeItem } from "./PrizeTable";

type PrizeConfirmModalProps = {
  item: PrizeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserName: string;
  saving: boolean;
  onConfirm: (values: {
    grantId: number;
    prizeStatus: "received" | "pending";
    confirmedBy: string;
    prizeNotes: string;
    prizeReceivedAt?: string;
  }) => void;
};

export default function PrizeConfirmModal({
  item,
  open,
  onOpenChange,
  currentUserName,
  saving,
  onConfirm,
}: PrizeConfirmModalProps) {
  const [status, setStatus] = useState<"received" | "pending">("received");
  const [confirmedBy, setConfirmedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [receivedDate, setReceivedDate] = useState("");

  useEffect(() => {
    if (!open || !item) return;

    setStatus(item.prizeStatus === "received" ? "received" : "received");
    setConfirmedBy(item.confirmedBy || currentUserName || "");
    setNotes(item.prizeNotes || "");

    if (item.prizeReceivedAt) {
      const d = new Date(item.prizeReceivedAt);
      const iso = d.toISOString().slice(0, 16);
      setReceivedDate(iso);
    } else {
      const now = new Date();
      // Format to YYYY-MM-DDTHH:mm
      const tzOffset = now.getTimezoneOffset() * 60000;
      const localIso = new Date(now.getTime() - tzOffset)
        .toISOString()
        .slice(0, 16);
      setReceivedDate(localIso);
    }
  }, [open, item, currentUserName]);

  if (!item) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;

    onConfirm({
      grantId: item.grantId,
      prizeStatus: status,
      confirmedBy: confirmedBy.trim(),
      prizeNotes: notes.trim(),
      prizeReceivedAt: status === "received" ? new Date(receivedDate).toISOString() : undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Trophy className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {item.prizeStatus === "received"
                  ? "Update Prize Confirmation"
                  : "Confirm Prize Receipt"}
              </DialogTitle>
              <DialogDescription>
                Record scholarship award & prize distribution confirmation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Student Award Info Box */}
        <div className="mt-2 space-y-2 rounded-xl border bg-muted/40 p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground text-sm">
              {item.studentName}
            </span>
            <Badge variant="secondary" className="font-mono text-[11px]">
              {item.studentId}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <School className="size-3.5 shrink-0 text-primary" />
            <span>{item.institutionName}</span>
            <span>•</span>
            <span>Class {item.class}, Roll {item.roll}</span>
          </div>

          <div className="border-t border-border/60 pt-2 text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Award className="size-3.5 text-primary" />
              {item.categoryName} ({item.scholarshipName})
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Status Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Prize Receiving Status *</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("received")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                  status === "received"
                    ? "border-green-600 bg-green-500/10 text-green-700 dark:text-green-400 ring-1 ring-green-600"
                    : "border-input bg-background hover:bg-muted text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="size-4 text-green-600" />
                Prize Received
              </button>

              <button
                type="button"
                onClick={() => setStatus("pending")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                  status === "pending"
                    ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500"
                    : "border-input bg-background hover:bg-muted text-muted-foreground"
                }`}
              >
                <Clock className="size-4 text-amber-500" />
                Pending Distribution
              </button>
            </div>
          </div>

          {status === "received" && (
            <>
              {/* Confirmed By */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmedBy" className="text-xs font-semibold">
                  Responsible Staff / Confirmed By *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmedBy"
                    value={confirmedBy}
                    onChange={(e) => setConfirmedBy(e.target.value)}
                    placeholder="Enter staff name or ID"
                    required
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Received Date & Time */}
              <div className="space-y-1.5">
                <Label htmlFor="receivedDate" className="text-xs font-semibold">
                  Received Date & Time *
                </Label>
                <Input
                  id="receivedDate"
                  type="datetime-local"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">
              Remarks / Prize Details (Optional)
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received certificate & crest"
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={saving || (status === "received" && !confirmedBy.trim())}
              className={
                status === "received"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
            >
              {saving ? "Saving..." : "Save Confirmation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
