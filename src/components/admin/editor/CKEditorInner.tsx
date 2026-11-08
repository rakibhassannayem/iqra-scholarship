"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  // Essentials & History
  Essentials,
  Paragraph,
  Heading,
  // Formatting
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  CodeBlock,
  RemoveFormat,
  // Font & Colors
  FontColor,
  FontBackgroundColor,
  FontSize,
  FontFamily,
  Highlight,
  // Alignment & Layout
  Alignment,
  Indent,
  IndentBlock,
  HorizontalLine,
  BlockQuote,
  // Lists
  List,
  TodoList,
  // Links
  Link,
  // Images & Upload
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageInsert,
  AutoImage,
  LinkImage,
  ImageUpload,
  Base64UploadAdapter,
  // Tables
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  // Media & Utilities
  MediaEmbed,
  SpecialCharacters,
  SpecialCharactersEssentials,
  FindAndReplace,
  SourceEditing,
  ShowBlocks,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "./editor.css";

export type CKEditorProps = {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function CKEditorInner({
  value,
  onChange,
  placeholder,
  disabled = false,
}: CKEditorProps) {
  return (
    <div className="prose max-w-none text-foreground ck-custom-container w-full overflow-visible [&_.ck-editor__editable]:min-h-[340px] [&_.ck-editor__editable]:max-h-[600px] [&_.ck-editor__editable]:overflow-y-auto [&_.ck-editor__editable]:bg-background [&_.ck-editor__editable]:text-foreground [&_.ck-toolbar]:bg-muted/40 [&_.ck-toolbar]:border-border [&_.ck.ck-editor__main>.ck-editor__editable]:border-border [&_.ck.ck-toolbar]:!flex-wrap [&_.ck-toolbar__items]:!flex-wrap [&_.ck-toolbar]:!w-full [&_.ck-editor]:!w-full [&_.ck-editor]:!max-w-full">
      <CKEditor
        editor={ClassicEditor}
        disabled={disabled}
        data={value || ""}
        config={{
          licenseKey: "GPL",
          placeholder: placeholder || "Write your content here...",
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,
            CodeBlock,
            RemoveFormat,
            FontColor,
            FontBackgroundColor,
            FontSize,
            FontFamily,
            Highlight,
            Alignment,
            Indent,
            IndentBlock,
            HorizontalLine,
            BlockQuote,
            List,
            TodoList,
            Link,
            Image,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            ImageResize,
            ImageInsert,
            AutoImage,
            LinkImage,
            ImageUpload,
            Base64UploadAdapter,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            MediaEmbed,
            SpecialCharacters,
            SpecialCharactersEssentials,
            FindAndReplace,
            SourceEditing,
            ShowBlocks,
          ],
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "sourceEditing",
              "showBlocks",
              "findAndReplace",
              "|",
              "heading",
              "|",
              "fontSize",
              "fontFamily",
              "fontColor",
              "fontBackgroundColor",
              "highlight",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "subscript",
              "superscript",
              "code",
              "removeFormat",
              "|",
              "alignment",
              "|",
              "bulletedList",
              "numberedList",
              "todoList",
              "outdent",
              "indent",
              "|",
              "link",
              "insertImage",
              "insertTable",
              "mediaEmbed",
              "blockQuote",
              "horizontalLine",
              "codeBlock",
              "specialCharacters",
            ],
            shouldNotGroupWhenFull: true,
          },
          image: {
            toolbar: [
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
              "|",
              "toggleImageCaption",
              "imageTextAlternative",
              "|",
              "linkImage",
            ],
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
            ],
          },
        }}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
