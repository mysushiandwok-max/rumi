"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { forwardRef, useImperativeHandle, useState } from "react";

function ToolbarButton({
  onClick,
  active,
  label,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  label: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rte-btn${active ? " rte-btn-active" : ""}`}
    >
      {label}
    </button>
  );
}

export type RichTextEditorHandle = { insertText: (text: string) => void };

export const RichTextEditor = forwardRef<
  RichTextEditorHandle,
  { name: string; defaultValue?: string; placeholder?: string; onChangeHtml?: (html: string) => void }
>(function RichTextEditor({ name, defaultValue, placeholder, onChangeHtml }, ref) {
  // Controlado por React: el input oculto nunca se desincroniza del editor cuando un hermano fuerza un re-render.
  const [html, setHtml] = useState(defaultValue || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, codeBlock: false, code: false, link: { openOnClick: false } }),
      Placeholder.configure({ placeholder: placeholder || "Escribe el contenido…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultValue || "",
    onUpdate: ({ editor }) => {
      const next = editor.getHTML();
      setHtml(next);
      onChangeHtml?.(next);
    },
    editorProps: { attributes: { class: "rte-content" } },
  });

  useImperativeHandle(
    ref,
    () => ({
      insertText(text: string) {
        editor?.chain().focus().insertContent(text).run();
      },
    }),
    [editor]
  );

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL del enlace:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        <ToolbarButton title="Negrita" label={<b>B</b>} active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} />
        <ToolbarButton title="Cursiva" label={<i>I</i>} active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} />
        <ToolbarButton title="Tachado" label={<s>S</s>} active={editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()} />
        <span className="rte-sep" />
        <ToolbarButton title="Encabezado 2" label="H2" active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton title="Encabezado 3" label="H3" active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} />
        <span className="rte-sep" />
        <ToolbarButton title="Lista con viñetas" label="•—" active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
        <ToolbarButton title="Lista numerada" label="1." active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
        <ToolbarButton title="Cita" label="❝" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
        <span className="rte-sep" />
        <ToolbarButton title="Alinear izquierda" label="⇤" active={editor?.isActive({ textAlign: "left" })} onClick={() => editor?.chain().focus().setTextAlign("left").run()} />
        <ToolbarButton title="Centrar" label="↔" active={editor?.isActive({ textAlign: "center" })} onClick={() => editor?.chain().focus().setTextAlign("center").run()} />
        <span className="rte-sep" />
        <ToolbarButton title="Insertar enlace" label="🔗" onClick={setLink} active={editor?.isActive("link")} />
        <span className="rte-sep" />
        <ToolbarButton title="Deshacer" label="↶" onClick={() => editor?.chain().focus().undo().run()} />
        <ToolbarButton title="Rehacer" label="↷" onClick={() => editor?.chain().focus().redo().run()} />
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
});
