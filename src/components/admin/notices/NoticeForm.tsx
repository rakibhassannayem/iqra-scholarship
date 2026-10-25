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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export type NoticeFormValues = {
  title: string;
  content: string;
  isPublished: boolean;
};

export const emptyNoticeForm: NoticeFormValues = {
  title: "",
  content: "",
  isPublished: false,
};

type NoticeFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: NoticeFormValues;
  editing: boolean;
  saving: boolean;
  error: string;
  onSubmit: (values: NoticeFormValues) => void;
};

export default function NoticeForm({
  open,
  onOpenChange,
  initialValues,
  editing,
  saving,
  error,
  onSubmit,
}: NoticeFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [isPublished, setIsPublished] = useState(initialValues.isPublished);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      isPublished,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Notice" : "Create Notice"}</DialogTitle>
          <DialogDescription>
            Add the notice details and choose whether to publish it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notice-title">Title</Label>
            <Input
              id="notice-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter notice title"
              maxLength={255}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notice-content">Content</Label>
            <Textarea
              id="notice-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write the notice..."
              rows={6}
              maxLength={5000}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-1">
              <Label htmlFor="notice-published">Published</Label>
              <p className="text-sm text-muted-foreground">
                Published notices can be shown publicly.
              </p>
            </div>

            <Switch
              id="notice-published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Create Notice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
