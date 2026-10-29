"use client";

import { Pencil, Trash2, BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export type Notice = {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
};

type NoticeTableProps = {
  notices: Notice[];
  loading: boolean;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
  onTogglePublished: (notice: Notice, isPublished: boolean) => Promise<void>;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NoticeTable({
  notices,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
}: NoticeTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Notices</span>
          <Badge variant="secondary">{notices.length} total</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading notices...
          </p>
        ) : notices.length === 0 ? (
          <div className="py-10 text-center">
            <BellRing className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No notices yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first notice to see it here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notice</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>
                    <p className="font-medium">{notice.title}</p>
                    <p className="mt-1 max-w-80 truncate text-xs text-muted-foreground">
                      {notice.content}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(notice.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={notice.isPublished}
                        onCheckedChange={(checked) => {
                          void onTogglePublished(notice, checked);
                        }}
                        aria-label={`Publish ${notice.title}`}
                      />

                      <Badge
                        variant={notice.isPublished ? "default" : "secondary"}
                      >
                        {notice.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Edit ${notice.title}`}
                        onClick={() => onEdit(notice)}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Delete ${notice.title}`}
                        onClick={() => onDelete(notice)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
