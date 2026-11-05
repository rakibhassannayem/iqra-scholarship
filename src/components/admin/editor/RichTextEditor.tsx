"use client";

import dynamic from "next/dynamic";
import type { CKEditorProps } from "./CKEditorInner";

const CKEditorComponent = dynamic(() => import("./CKEditorInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] w-full items-center justify-center rounded-lg border border-border bg-muted/20 text-sm text-muted-foreground">
      Loading rich text editor...
    </div>
  ),
});

export default function RichTextEditor(props: CKEditorProps) {
  return <CKEditorComponent {...props} />;
}

