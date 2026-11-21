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
import type { Category } from "@/types/scholarship-category";

export type { Category };

type CategoryFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  name: string;
  description: string;
  minMarks: string;
  maxMarks: string;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setMinMarks: (value: string) => void;
  setMaxMarks: (value: string) => void;
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
  minMarks,
  maxMarks,
  setName,
  setDescription,
  setMinMarks,
  setMaxMarks,
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
              ? "Update the category information and marks limit."
              : "Create a new scholarship category with marks limit."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. General or Talentpool"
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minMarks">Minimum Marks (সর্বনিম্ন নম্বর)</Label>
              <Input
                id="minMarks"
                type="number"
                min="0"
                max="1000"
                value={minMarks}
                onChange={(event) => setMinMarks(event.target.value)}
                placeholder="e.g. 80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMarks">Maximum Marks (সর্বোচ্চ নম্বর)</Label>
              <Input
                id="maxMarks"
                type="number"
                min="0"
                max="1000"
                value={maxMarks}
                onChange={(event) => setMaxMarks(event.target.value)}
                placeholder="e.g. 89"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            রেজাল্ট এন্ট্রির সময় শিক্ষার্থী এই নম্বরের মধ্যে স্কোর পেলে স্বয়ংক্রিয়ভাবে এই ক্যাটাগরি পাবে।
          </p>

          <div className="space-y-2">
            <Label htmlFor="categoryDescription">Description</Label>
            <Textarea
              id="categoryDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional category description"
              maxLength={1000}
              rows={3}
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
