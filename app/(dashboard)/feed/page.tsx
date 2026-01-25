import { getEntries } from "@/app/actions/entries";
import { NoteCard } from "@/components/shared/note-card";
import { getCurrentUser } from "@/utils/auth";
import { Heart, Sparkles, Image as ImageIcon } from "lucide-react";

export default async function FeedPage() {
    const user = await getCurrentUser();
    const entries = await getEntries();

    return (
        <div className="space-y-8 md:space-y-12">
            <header className="text-center relative">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -top-4 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />

                <div className="relative">
                    <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
                        <span className="text-primary italic bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">GALLERY</span>
                    </h1>
                    {entries.length > 0 && (
                        <div className="mt-4 md:mt-6 inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary/50 border border-border">
                            <ImageIcon className="h-3.5 w-3.5 md:h-4 w-4 text-primary" />
                            <span className="font-outfit text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {entries.length} {entries.length === 1 ? 'Memory' : 'Memories'} Captured
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <section>
                {entries.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
                        {entries.map((entry: any, index: number) => (
                            <div
                                key={entry.id}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                }}
                                className="animate-fade-in break-inside-avoid mb-6"
                            >
                                <NoteCard entry={entry} currentUserId={user?.id} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border bg-gradient-to-br from-card/30 via-card/20 to-transparent py-32 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.03),transparent_70%)]" />
                        <div className="relative">
                            <Heart className="mb-6 h-20 w-20 text-muted/20 animate-pulse mx-auto" />
                            <p className="font-outfit text-2xl font-bold text-muted-foreground uppercase tracking-widest">
                                Gallery is empty
                            </p>
                            <p className="mt-3 text-sm text-muted-foreground/60 max-w-md mx-auto">
                                Share your first moment to fill this space with beautiful memories.
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
