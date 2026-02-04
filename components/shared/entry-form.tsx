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
import { LinkCard } from "./link-card";
import { useEffect } from "react";

export function EntryForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [richContent, setRichContent] = useState("");
    const [linkData, setLinkData] = useState<any>(null);
    const [isFetchingLink, setIsFetchingLink] = useState(false);

    // Link detection effect
    useEffect(() => {
        const detectLink = async () => {
            if (linkData) return; // Only one link preview for now

            const urlRegex = /(https?:\/\/[^\s<]+)/g;
            const matches = richContent.match(urlRegex);

            if (matches && matches.length > 0) {
                const url = matches[0];
                // Check if it's a Spotify, YouTube, or Instagram link
                if (url.includes("spotify.com") || url.includes("youtube.com") || url.includes("youtu.be") || url.includes("instagram.com")) {
                    setIsFetchingLink(true);
                    try {
                        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
                        if (res.ok) {
                            const data = await res.json();
                            setLinkData({ ...data, url });

                            // Remove the link from the editor content
                            // This handles raw text URLs and Tiptap's auto-linked <a> tags
                            const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const linkRegex = new RegExp(`(<a [^>]*href=["']${escapedUrl}["'][^>]*>.*?</a>)|(${escapedUrl})`, 'g');
                            const strippedContent = richContent.replace(linkRegex, "");
                            setRichContent(strippedContent);
                        }
                    } catch (error) {
                        console.error("Failed to fetch link preview", error);
                    } finally {
                        setIsFetchingLink(false);
                    }
                }
            }
        };

        const timer = setTimeout(detectLink, 1000);
        return () => clearTimeout(timer);
    }, [richContent, linkData]);

    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        // Add all selected files to formData
        selectedFiles.forEach(file => {
            formData.append("images", file);
        });

        // Set the rich content
        formData.set("content", richContent);

        if (linkData) {
            formData.set("link_data", JSON.stringify(linkData));
        }

        const result = await createEntry(formData);
        if (result.success) {
            toast.success("Moment shared!");
            formRef.current?.reset();
            setImageUrl("");
            setSelectedFiles([]);
            setPreviewUrls([]);
            setShowUrlInput(false);
            setRichContent("");
            setLinkData(null);
        } else if (result.error) {
            toast.error("Oops!", {
                description: result.error,
            });
        }
        return result;
    }, null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newFiles = [...selectedFiles, ...files];
            setSelectedFiles(newFiles);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrls(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const clearMedia = () => {
        setSelectedFiles([]);
        setPreviewUrls([]);
        setImageUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Card className="overflow-hidden border-border bg-gradient-to-br from-card via-card to-card/80 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-0">
                <form ref={formRef} action={formAction}>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <AnimatePresence>
                        {(previewUrls.length > 0 || imageUrl) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative group w-full bg-secondary/20 overflow-hidden"
                            >
                                <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                                    {imageUrl && !previewUrls.length && (
                                        <div className="relative aspect-video w-full flex-shrink-0">
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                className="h-full w-full object-cover rounded-lg"
                                                onError={() => {
                                                    if (imageUrl) toast.error("Invalid image URL");
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={clearMedia}
                                                className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-lg"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative aspect-square h-40 flex-shrink-0">
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                className="h-full w-full object-cover rounded-lg border border-border/50"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeFile(index)}
                                                className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-lg"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showUrlInput && previewUrls.length === 0 && (
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

                    <div className="p-4 sm:p-6 pb-2 sm:pb-4">
                        <RichTextEditor
                            content={richContent}
                            onChange={setRichContent}
                            placeholder="Write your note..."
                            className="border-0 shadow-none"
                        />

                        <AnimatePresence>
                            {linkData && (
                                <LinkCard
                                    data={linkData}
                                    onRemove={() => setLinkData(null)}
                                />
                            )}
                            {isFetchingLink && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/60 animate-pulse"
                                >
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    Fetching Link Preview...
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-between border-t border-border bg-gradient-to-r from-secondary/40 via-secondary/30 to-secondary/40 px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex gap-1.5 sm:gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-10 w-10 rounded-xl transition-all ${previewUrls.length > 0
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
                                    if (previewUrls.length > 0) clearMedia();
                                }}
                                className={`h-10 w-10 rounded-xl transition-all ${showUrlInput && previewUrls.length === 0
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
