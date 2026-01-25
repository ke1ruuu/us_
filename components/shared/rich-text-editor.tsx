"use client";

import { useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Type,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = "Start writing...",
    className
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline underline-offset-2 hover:text-primary/80 transition-colors",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-2xl max-w-full h-auto",
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] px-6 py-4",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Support external content updates (like removing links)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const MenuButton = ({
        onClick,
        isActive,
        children,
        disabled
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        disabled?: boolean;
    }) => (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            disabled={disabled}
            className={cn(
                "h-8 w-8 rounded-lg transition-all flex-shrink-0",
                isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
        >
            {children}
        </Button>
    );

    return (
        <div className={cn("rounded-2xl border border-border bg-card overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b border-border bg-secondary/30 px-3 py-2 overflow-x-auto scrollbar-hide">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                >
                    <Bold className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                >
                    <Italic className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "flex items-center gap-1.5 h-8 px-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider",
                                (editor.isActive("heading", { level: 2 }) || editor.isActive("heading", { level: 3 }))
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <Type className="h-4 w-4" />
                            {editor.isActive("heading", { level: 2 }) ? "H2" : editor.isActive("heading", { level: 3 }) ? "H3" : "Text"}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-32 rounded-xl border-border bg-card">
                        <DropdownMenuItem
                            className={cn("flex items-center justify-between p-2 rounded-lg cursor-pointer", editor.isActive("heading", { level: 2 }) && "bg-primary/10 text-primary")}
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                            <span className="font-bold">Heading 2</span>
                            <span className="text-[10px] opacity-50">H2</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn("flex items-center justify-between p-2 rounded-lg cursor-pointer", editor.isActive("heading", { level: 3 }) && "bg-primary/10 text-primary")}
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        >
                            <span className="font-bold">Heading 3</span>
                            <span className="text-[10px] opacity-50">H3</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn("flex items-center justify-between p-2 rounded-lg cursor-pointer", !editor.isActive("heading") && "bg-primary/10 text-primary")}
                            onClick={() => editor.chain().focus().setParagraph().run()}
                        >
                            <span className="font-bold">Paragraph</span>
                            <span className="text-[10px] opacity-50">P</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                >
                    <List className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                >
                    <ListOrdered className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                >
                    <Quote className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}
