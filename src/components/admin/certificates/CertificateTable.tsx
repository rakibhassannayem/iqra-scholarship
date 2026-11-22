"use client";

import { CheckSquare, Square, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CertificateData } from "@/types/certificate";

export type CertificateTableProps = {
  certificates: CertificateData[];
  loading: boolean;
  selectedIds: Set<number>;
  onToggleSelectAll: () => void;
  onToggleSingle: (studentDbId: number) => void;
  onViewCertificate: (cert: CertificateData) => void;
};

export default function CertificateTable({
  certificates,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSingle,
  onViewCertificate,
}: CertificateTableProps) {
  const allSelected =
    certificates.length > 0 && selectedIds.size === certificates.length;

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-12 text-center">
              <button
                type="button"
                onClick={onToggleSelectAll}
                className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Select all"
              >
                {allSelected ? (
                  <CheckSquare className="size-4 text-emerald-700" />
                ) : (
                  <Square className="size-4" />
                )}
              </button>
            </TableHead>
            <TableHead>শিক্ষার্থী</TableHead>
            <TableHead>প্রতিষ্ঠান ও কেন্দ্র</TableHead>
            <TableHead className="text-center">শ্রেণি ও রোল</TableHead>
            <TableHead className="text-center">সনদ ক্যাটাগরি</TableHead>
            <TableHead className="text-center">প্রাপ্ত নম্বর</TableHead>
            <TableHead className="text-right">একশন</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center">
                <div className="inline-flex size-7 animate-spin items-center justify-center rounded-full border-2 border-emerald-700 border-t-transparent mb-2" />
                <p className="text-xs text-muted-foreground">
                  সনদ তালিকা লোড হচ্ছে...
                </p>
              </TableCell>
            </TableRow>
          ) : certificates.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-muted-foreground text-xs"
              >
                প্রদত্ত ফিল্টারের সাথে কোনো শিক্ষার্থীর রেকর্ড পাওয়া যায়নি।
              </TableCell>
            </TableRow>
          ) : (
            certificates.map((cert) => {
              const isSelected = selectedIds.has(cert.studentDbId);

              return (
                <TableRow
                  key={cert.studentDbId}
                  className={`transition-colors hover:bg-muted/30 ${
                    isSelected ? "bg-emerald-500/5" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => onToggleSingle(cert.studentDbId)}
                      className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      {isSelected ? (
                        <CheckSquare className="size-4 text-emerald-700" />
                      ) : (
                        <Square className="size-4" />
                      )}
                    </button>
                  </TableCell>

                  {/* Student Name & Parents */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-foreground text-sm">
                        {cert.studentName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        আইডি:{" "}
                        <span className="font-mono font-medium">
                          {cert.studentId}
                        </span>
                      </p>
                      {(cert.fatherName || cert.motherName) && (
                        <p className="text-[11px] text-stone-600">
                          পিতা: {cert.fatherName || "—"} | মাতা:{" "}
                          {cert.motherName || "—"}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Institution */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground text-xs line-clamp-1">
                        {cert.institutionName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        কেন্দ্র: {cert.examCenter || "—"}
                      </p>
                    </div>
                  </TableCell>

                  {/* Class & Roll */}
                  <TableCell className="text-center">
                    <p className="font-medium text-xs text-foreground">
                      {cert.className}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      রোল: {cert.roll}
                    </p>
                  </TableCell>

                  {/* Category Badge */}
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="font-bold border-amber-600/40 bg-amber-500/10 text-amber-900 text-xs"
                    >
                      {cert.categoryName}
                    </Badge>
                  </TableCell>

                  {/* Marks */}
                  <TableCell className="text-center font-bold text-sm">
                    {cert.marks !== null && cert.marks !== undefined ? (
                      <span className="text-emerald-800">{cert.marks}</span>
                    ) : (
                      <span className="text-muted-foreground font-normal text-xs">
                        —
                      </span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewCertificate(cert)}
                      className="gap-1.5 text-xs text-emerald-800 border-emerald-600/30 hover:bg-emerald-50 hover:border-emerald-600 font-semibold"
                    >
                      <Printer className="size-3.5 text-emerald-700" />
                      সনদ দেখুন / প্রিন্ট
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
