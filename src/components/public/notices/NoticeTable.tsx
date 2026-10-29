"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type Notice = {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
};

export default function NoticeTable() {
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch("/api/notices?published=true");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (isBangla ? "নোটিশ লোড করা যায়নি।" : "Failed to load notices."),
          );
        }

        setNotices(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : isBangla
              ? "নোটিশ লোড করা যায়নি।"
              : "Failed to load notices.",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchNotices();
  }, [isBangla]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(isBangla ? "bn-BD" : "en-GB");
  }
  function handleDownload() {
    window.print();
  }

  return (
    <>
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-muted-foreground"
                >
                  {isBangla ? "নোটিশ লোড হচ্ছে..." : "Loading notices..."}
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-muted-foreground"
                >
                  {isBangla
                    ? "বর্তমানে কোনো নোটিশ প্রকাশিত হয়নি।"
                    : "No notices have been published yet."}
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="min-w-48 font-medium">
                    {notice.title}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(notice.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNotice(notice)}
                      >
                        <Eye className="mr-1 size-3.5" />
                        {isBangla ? "দেখুন" : "View"}
                      </Button>

                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedNotice(notice);
                          setTimeout(() => {
                            handleDownload();
                            setSelectedNotice(null);
                          }, 100);
                        }}
                      >
                        <Download className="mr-1 size-3.5" />
                        {isBangla ? "ডাউনলোড" : "Download"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={selectedNotice !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedNotice(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selectedNotice && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedNotice.title}
                </DialogTitle>

                <DialogDescription>
                  {isBangla ? "প্রকাশের তারিখ: " : "Published date: "}
                  {formatDate(selectedNotice.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="whitespace-pre-wrap break-words py-4 text-sm leading-7 text-foreground">
                {selectedNotice.content}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
