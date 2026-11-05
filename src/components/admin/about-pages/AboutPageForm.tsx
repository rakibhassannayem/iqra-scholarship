"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import RichTextEditor from "@/components/admin/editor/RichTextEditor";

export type AboutPageFormValues = {
  title: string;
  slug: string;
  content: string;
  order: number;
  isPublished: boolean;
};

export const emptyAboutPageForm: AboutPageFormValues = {
  title: "",
  slug: "",
  content: "",
  order: 0,
  isPublished: true,
};

type AboutPageFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AboutPageFormValues;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: AboutPageFormValues) => void;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0980-\u09FF\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AboutPageForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: AboutPageFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [slug, setSlug] = useState(initialValues.slug);
  const [content, setContent] = useState(initialValues.content);
  const [order, setOrder] = useState(initialValues.order);
  const [isPublished, setIsPublished] = useState(initialValues.isPublished);

  useEffect(() => {
    setTitle(initialValues.title);
    setSlug(initialValues.slug);
    setContent(initialValues.content);
    setOrder(initialValues.order);
    setIsPublished(initialValues.isPublished);
  }, [initialValues, open]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!editing && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const finalSlug = slug.trim() ? slugify(slug) : slugify(title);

    onSubmit({
      title: title.trim(),
      slug: finalSlug,
      content,
      order: Number(order) || 0,
      isPublished,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[95vw] sm:max-w-5xl lg:max-w-6xl overflow-y-auto overflow-x-hidden p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit About Page" : "Create New About Page"}
          </DialogTitle>
          <DialogDescription>
            Configure the menu title, URL slug, and format the page content using CKEditor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="page-title">
                Menu & Page Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="page-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Our Mission & Vision"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-slug">
                URL Slug <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="page-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. mission-and-vision"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSlug(slugify(title))}
                  className="whitespace-nowrap"
                >
                  Auto
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Public address will be: <code>/about/{slug || "slug"}</code>
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="page-order">Display Order in Menu</Label>
              <Input
                id="page-order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min={0}
                placeholder="0"
              />
              <p className="text-[11px] text-muted-foreground">
                Lower numbers appear first in the dropdown (e.g. 1, 2, 3).
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="page-publish">Publish in Dropdown</Label>
                <p className="text-xs text-muted-foreground">
                  Make this page visible to website visitors
                </p>
              </div>
              <Switch
                id="page-publish"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Page Content (CKEditor)</Label>
            <div className="rounded-lg border bg-card p-1">
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write and format your page content here..."
              />
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !title.trim()}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

