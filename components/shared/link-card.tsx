"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music, ExternalLink, X, Play, Youtube, Instagram, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface LinkCardProps {
    data: {
        title?: string;
        author_name?: string;
        thumbnail_url?: string;
        provider_name?: string;
        html?: string;
        url?: string;
    };
    onRemove?: () => void;
}

export function LinkCard({ data, onRemove }: LinkCardProps) {
    const [showEmbed, setShowEmbed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const provider = data.provider_name?.toLowerCase() || "";
    const isSpotify = provider === "spotify" || data.url?.includes("spotify.com");
    const isYoutube = provider === "youtube" || data.url?.includes("youtube.com") || data.url?.includes("youtu.be");
    const isInstagram = provider === "instagram" || data.url?.includes("instagram.com");

    const embedUrl = data.url ? (() => {
        if (isSpotify) {
            const match = data.url.match(/spotify\.com\/(track|album|playlist|artist|episode)\/([a-zA-Z0-9]+)/);
            if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
        }
        if (isYoutube) {
            const match = data.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
        }
        return null;
    })() : null;

    const getAccentColor = () => {
        if (isSpotify) return "text-green-500 bg-green-500/10";
        if (isYoutube) return "text-red-500 bg-red-500/10";
        if (isInstagram) return "text-pink-500 bg-pink-500/10";
        return "text-primary bg-primary/10";
    };

    const getProviderIcon = () => {
        if (isSpotify) return <Music className="h-3 w-3" />;
        if (isYoutube) return <Youtube className="h-3 w-3" />;
        if (isInstagram) return <Instagram className="h-3 w-3" />;
        return <ExternalLink className="h-3 w-3" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative mt-4 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl backdrop-blur-sm transition-all hover:border-primary/40"
            suppressHydrationWarning
        >
            <AnimatePresence mode="wait">
                {showEmbed && embedUrl ? (
                    <motion.div
                        key="embed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full relative"
                    >
                        {isYoutube ? (
                            <div className="aspect-video w-full">
                                <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="block"
                                ></iframe>
                            </div>
                        ) : (
                            <iframe
                                src={embedUrl}
                                width="100%"
                                height="80"
                                frameBorder="0"
                                allow="encrypted-media"
                                className="block rounded-xl"
                            ></iframe>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 top-2 h-6 px-2 text-[10px] font-bold uppercase tracking-wider shadow-lg bg-background/80 hover:bg-background"
                            onClick={() => setShowEmbed(false)}
                        >
                            Close Player
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-4 p-4"
                    >
                        {data.thumbnail_url && (
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10">
                                <img
                                    src={data.thumbnail_url}
                                    alt={data.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isSpotify && <Music className="h-8 w-8 text-white drop-shadow-xl animate-pulse" />}
                                    {isYoutube && <Youtube className="h-8 w-8 text-white drop-shadow-xl animate-pulse" />}
                                    {isInstagram && <Instagram className="h-8 w-8 text-white drop-shadow-xl animate-pulse" />}
                                    {!isSpotify && !isYoutube && !isInstagram && <Film className="h-8 w-8 text-white drop-shadow-xl animate-pulse" />}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col justify-center min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${getAccentColor()}`}>
                                    {getProviderIcon()}
                                    <span className="text-[9px] font-black uppercase tracking-wider">
                                        {data.provider_name || provider || "Link"}
                                    </span>
                                </div>
                                {(isSpotify || isYoutube) && (
                                    <span className={`flex h-1.5 w-1.5 rounded-full animate-pulse ${isSpotify ? 'bg-green-500' : 'bg-red-500'}`} />
                                )}
                            </div>
                            <h4 className="truncate font-outfit text-sm font-bold text-foreground mt-1.5">
                                {data.title || "Untitled Link"}
                            </h4>
                            <p className="truncate text-xs text-muted-foreground/80 font-medium" suppressHydrationWarning>
                                {data.author_name || (() => {
                                    try {
                                        return data.url ? new URL(data.url).hostname : "";
                                    } catch (e) {
                                        return data.url || "";
                                    }
                                })()}
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                {embedUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setShowEmbed(true)}
                                        className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all active:scale-95"
                                    >
                                        <Play className="h-2.5 w-2.5 fill-primary" /> {isYoutube ? "Watch Video" : "Play Snippet"}
                                    </button>
                                )}
                                {data.url && (
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Visit Link <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {onRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="absolute right-2 top-2 h-7 w-7 rounded-full bg-background/50 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-background/80 transition-all shadow-sm"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            )}

            {/* Subtle animated accent border */}
            <div className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent ${isSpotify ? 'via-green-500/50' : isYoutube ? 'via-red-500/50' : isInstagram ? 'via-pink-500/50' : 'via-primary/50'} to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700`} />
        </motion.div>
    );
}
