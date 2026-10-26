"use client";

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
import { Textarea } from "@/components/ui/textarea";

export type Category = {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CategoryFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  name: string;
  description: string;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  saving: boolean;
  error: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function CategoryForm({
  open,
  onOpenChange,
  category,
  name,
  description,
  setName,
  setDescription,
  saving,
  error,
  onSubmit,
}: CategoryFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category information."
              : "Create a new scholarship category."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. General"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryDescription">Description</Label>
            <Textarea
              id="categoryDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional category description"
              maxLength={1000}
              rows={4}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : category
                  ? "Save Changes"
                  : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
