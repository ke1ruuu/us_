import { EntryForm } from "@/components/shared/entry-form";
import { Sparkles } from "lucide-react";

export default function NotesPage() {
    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center space-y-12 -mt-8">
            <header className="text-center relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative">
                    <h1 className="font-outfit text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
                        WRITE A <span className="text-primary italic bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">NOTE</span>
                    </h1>
                </div>
            </header>

            <div className="w-full max-w-2xl">
                <EntryForm />
            </div>
        </div>
    );
}
