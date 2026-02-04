"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Heart, Sparkles } from "lucide-react";
import { deleteEntry } from "@/app/actions/entries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LinkCard } from "./link-card";
import { ImageModal } from "./image-modal";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface NoteCardProps {
    entry: any;
    currentUserId?: string;
}

export function NoteCard({ entry, currentUserId }: NoteCardProps) {
    const isAuthor = entry.author_id === currentUserId;
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const allImages = entry.image_urls && entry.image_urls.length > 0
        ? entry.image_urls
        : entry.image_url ? [entry.image_url] : [];

    useEffect(() => {
        setMounted(true);
    }, []);

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteEntry(entry.id);
        if (result.success) {
            toast.success("Moment removed");
        } else {
            toast.error("Oops!");
            setIsDeleting(false);
        }
    };

    const isLongContent = entry.content?.length > 280;

    if (!mounted) {
        return (
            <div className="h-[200px] w-full rounded-[2.5rem] bg-card/50 animate-pulse border border-border" />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="group overflow-hidden border-border bg-gradient-to-br from-card via-card to-card/90 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-primary/20">
                {/* Multi-image display */}
                {entry.image_urls && entry.image_urls.length > 0 ? (
                    <div className={cn(
                        "grid gap-1 w-full overflow-hidden",
                        entry.image_urls.length === 1 ? "grid-cols-1" :
                            entry.image_urls.length === 2 ? "grid-cols-2" :
                                "grid-cols-2"
                    )}>
                        {entry.image_urls.map((url: string, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => openModal(idx)}
                                className={cn(
                                    "relative overflow-hidden bg-secondary/20 cursor-zoom-in",
                                    entry.image_urls.length === 3 && idx === 0 ? "row-span-2" : "",
                                    "aspect-square"
                                )}
                            >
                                <img
                                    src={url}
                                    alt={`Shared moment ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                ) : entry.image_url ? (
                    <div
                        onClick={() => openModal(0)}
                        className="relative w-full overflow-hidden cursor-zoom-in"
                    >
                        <img
                            src={entry.image_url}
                            alt="Shared moment"
                            className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03] block"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ) : null}

                <div className="flex items-center justify-between p-4 pb-2 bg-transparent">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-primary/20 ring-2 ring-primary/5">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 font-outfit text-[10px] font-bold text-primary">
                                {entry.author?.display_name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-outfit text-sm font-bold text-foreground leading-tight">
                                {entry.author?.display_name}
                            </p>
                            <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1" suppressHydrationWarning>
                                <Sparkles className="h-2.5 w-2.5" />
                                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {isAuthor && (
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting}
                            className="h-8 w-8 text-muted-foreground opacity-100 transition-all hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500/10"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <CardContent className="px-4 py-2">
                    {!(entry.image_url || (entry.image_urls && entry.image_urls.length > 0)) ? (
                        <div className="relative">
                            <div
                                className={cn(
                                    "prose prose-invert max-w-none font-sans text-base leading-relaxed tracking-tight text-foreground/90 transition-all duration-300",
                                    "max-h-[150px] overflow-hidden"
                                )}
                                dangerouslySetInnerHTML={{ __html: entry.content }}
                                suppressHydrationWarning
                            />
                            {isLongContent && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <div
                                className={cn(
                                    "prose prose-invert max-w-none font-sans text-sm text-foreground/80 leading-relaxed transition-all duration-300",
                                    "max-h-[100px] overflow-hidden"
                                )}
                                suppressHydrationWarning
                            >
                                <span className="font-bold mr-2 text-primary">{entry.author?.display_name}</span>
                                <div className="inline prose-sm" dangerouslySetInnerHTML={{ __html: entry.content }} />
                            </div>
                            {isLongContent && (
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
                            )}
                        </div>
                    )}

                    {entry.link_data && (
                        <LinkCard data={entry.link_data} />
                    )}

                    {isLongContent && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="mt-2 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                                    Read More
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[90%] sm:max-w-md border-border bg-card overflow-y-auto p-4 sm:p-6">
                                <SheetHeader className="mb-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-primary/20 ring-2 ring-primary/5">
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 font-outfit text-xs font-bold text-primary">
                                                {entry.author?.display_name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-left">
                                            <SheetTitle className="font-outfit text-lg font-bold text-foreground">
                                                {entry.author?.display_name}
                                            </SheetTitle>
                                            <p className="text-[10px] font-medium text-muted-foreground">
                                                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </SheetHeader>

                                {entry.image_urls && entry.image_urls.length > 0 ? (
                                    <div className="mb-6 grid gap-2">
                                        {entry.image_urls.map((url: string, idx: number) => (
                                            <div
                                                key={idx}
                                                onClick={() => openModal(idx)}
                                                className="overflow-hidden rounded-2xl border border-border/50 cursor-zoom-in"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Moment detail ${idx + 1}`}
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : entry.image_url ? (
                                    <div
                                        onClick={() => openModal(0)}
                                        className="mb-6 overflow-hidden rounded-2xl border border-border/50 cursor-zoom-in"
                                    >
                                        <img
                                            src={entry.image_url}
                                            alt="Moment detail"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                ) : null}

                                <div
                                    className="prose prose-invert max-w-none font-sans text-base leading-relaxed tracking-tight text-foreground/90"
                                    dangerouslySetInnerHTML={{ __html: entry.content }}
                                />
                            </SheetContent>
                        </Sheet>
                    )}
                </CardContent>
            </Card>

            <ImageModal
                images={allImages}
                initialIndex={selectedImageIndex}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </motion.div>
    );
}

