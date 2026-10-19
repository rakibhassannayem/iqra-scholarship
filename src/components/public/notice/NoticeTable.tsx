"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

const notices = [
  {
    id: 1,
    titleBn: "বৃত্তি নিবন্ধন সংক্রান্ত নোটিশ",
    titleEn: "Scholarship Registration Notice",
    date: "2026-10-19",
    fileUrl: "/notices/registration-notice.pdf",
  },
  {
    id: 2,
    titleBn: "বৃত্তি পরীক্ষার সময়সূচি",
    titleEn: "Scholarship Examination Schedule",
    date: "2026-10-15",
    fileUrl: "/notices/examination-schedule.pdf",
  },
];

export default function NoticeTable() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isBangla ? "নোটিশ" : "Notice"}</TableHead>

            <TableHead className="whitespace-nowrap">
              {isBangla ? "প্রকাশের তারিখ" : "Published Date"}
            </TableHead>

            <TableHead className="text-right">
              {isBangla ? "কার্যক্রম" : "Actions"}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {notices.map((notice) => (
            <TableRow key={notice.id}>
              <TableCell className="min-w-48 font-medium">
                {isBangla ? notice.titleBn : notice.titleEn}
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {notice.date}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <a
                    href={notice.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    <Eye className="size-3.5" />
                    {isBangla ? "দেখুন" : "View"}
                  </a>

                  <a
                    href={notice.fileUrl}
                    download
                    className="inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    <Download className="size-3.5" />
                    {isBangla ? "ডাউনলোড" : "Download"}
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
