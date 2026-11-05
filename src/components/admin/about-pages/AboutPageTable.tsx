"use client";

import { Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
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

export type AboutPageItem = {
  id: number;
  title: string;
  slug: string;
  content: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type AboutPageTableProps = {
  pages: AboutPageItem[];
  loading: boolean;
  onEdit: (page: AboutPageItem) => void;
  onDelete: (page: AboutPageItem) => void;
  onTogglePublished: (page: AboutPageItem, isPublished: boolean) => Promise<void>;
};

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

export default function AboutPageTable({
  pages,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
}: AboutPageTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All About Sub-Pages</span>
          <Badge variant="secondary">{pages.length} total</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading pages...
          </p>
        ) : pages.length === 0 ? (
          <div className="py-10 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No pages created yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first about page to display under the About Us dropdown.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">Order</TableHead>
                  <TableHead>Menu / Page Title</TableHead>
                  <TableHead>Public URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="text-center font-medium">
                      <span className="inline-flex size-7 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                        {page.order}
                      </span>
                    </TableCell>

                    <TableCell>
                      <p className="font-semibold text-foreground">{page.title}</p>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/about/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <code>/about/{page.slug}</code>
                        <ExternalLink className="size-3" />
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={page.isPublished}
                          onCheckedChange={(checked) =>
                            void onTogglePublished(page, checked)
                          }
                          aria-label={`Toggle publication for ${page.title}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {page.isPublished ? (
                            <Badge variant="default" className="text-[11px]">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[11px]">
                              Draft
                            </Badge>
                          )}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(page.updatedAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(page)}
                          aria-label={`Edit ${page.title}`}
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete(page)}
                          aria-label={`Delete ${page.title}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

