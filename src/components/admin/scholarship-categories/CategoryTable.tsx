"use client";

import {
  Pencil,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category } from "./CategoryForm";

type CategoryTableProps = {
  categories: Category[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (category: Category) => void;
  onToggleActive: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export default function CategoryTable({
  categories,
  loading,
  updatingId,
  onEdit,
  onToggleActive,
  onDelete,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No categories found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((category) => {
            const updating = updatingId === category.id;

            return (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>

                <TableCell>{category.description || "—"}</TableCell>

                <TableCell>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updating}
                      onClick={() => onEdit(category)}
                    >
                      <Pencil />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updating}
                      onClick={() => onToggleActive(category)}
                    >
                      {updating ? (
                        <RefreshCw className="animate-spin" />
                      ) : category.isActive ? (
                        <ToggleLeft />
                      ) : (
                        <ToggleRight />
                      )}
                      {category.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={updating}
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
