"use client";

import { useActionState, useRef, useState } from "react";
import { createEntry } from "@/app/actions/entries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2, X, Link as LinkIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./rich-text-editor";
import { motion, AnimatePresence } from "framer-motion";

export function EntryForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [richContent, setRichContent] = useState("");

    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        // If we have a selected file, ensure it's in the formData
        if (selectedFile) {
            formData.set("image", selectedFile);
        }

        // Set the rich content
        formData.set("content", richContent);

        const result = await createEntry(formData);
        if (result.success) {
            toast.success("✨ Moment shared!", {
                description: "Your memory has been captured beautifully.",
            });
            formRef.current?.reset();
            setImageUrl("");
            setSelectedFile(null);
            setPreviewUrl(null);
            setShowUrlInput(false);
            setRichContent("");
        } else if (result.error) {
            toast.error("Oops!", {
                description: result.error,
            });
        }
        return result;
    }, null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearMedia = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Card className="overflow-hidden border-border bg-gradient-to-br from-card via-card to-card/80 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-0">
                <form ref={formRef} action={formAction}>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        name="image"
                    />

                    {/* Media Preview Section */}
                    <AnimatePresence>
                        {(previewUrl || imageUrl) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative group w-full bg-secondary/20 overflow-hidden"
                            >
                                <div className="relative aspect-video w-full">
                                    <img
                                        src={previewUrl || imageUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                        onError={() => {
                                            if (imageUrl) toast.error("Invalid image URL");
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={clearMedia}
                                    className="absolute right-4 top-4 h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* URL Input */}
                    <AnimatePresence>
                        {showUrlInput && !previewUrl && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-b border-border bg-secondary/10 overflow-hidden"
                            >
                                <div className="flex items-center gap-3 p-4">
                                    <LinkIcon className="h-4 w-4 text-primary" />
                                    <Input
                                        name="image_url"
                                        placeholder="Paste image URL here..."
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="h-9 border-none bg-transparent focus-visible:ring-0 text-sm"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Rich Text Editor */}
                    <div className="p-6 pb-4">
                        <RichTextEditor
                            content={richContent}
                            onChange={setRichContent}
                            placeholder="Write your note..."
                            className="border-0 shadow-none"
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between border-t border-border bg-gradient-to-r from-secondary/40 via-secondary/30 to-secondary/40 px-6 py-4">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-10 w-10 rounded-xl transition-all ${previewUrl
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                    }`}
                            >
                                <Upload className="h-5 w-5" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setShowUrlInput(!showUrlInput);
                                    if (previewUrl) clearMedia();
                                }}
                                className={`h-10 w-10 rounded-xl transition-all ${showUrlInput && !previewUrl
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                    }`}
                            >
                                <LinkIcon className="h-5 w-5" />
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-11 rounded-xl bg-primary px-8 font-outfit text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] hover:bg-primary transition-all active:scale-[0.98]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sharing...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Share Moment
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
