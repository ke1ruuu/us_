import { LoginForm } from "./login-form";
import { Heart, Sparkles } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 font-sans relative overflow-hidden">
            {/* Animated background */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.05),transparent_70%)]" />
            </div>

            <div className="w-full max-w-md space-y-12 rounded-[2.5rem] border border-border bg-gradient-to-br from-card via-card to-card/80 p-12 shadow-2xl backdrop-blur-sm relative">
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="mb-8 relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/40">
                            <Heart className="h-9 w-9 fill-current" />
                        </div>
                        <div className="absolute -inset-2 bg-primary/20 rounded-[1.5rem] blur-xl -z-10" />
                        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary animate-pulse" />
                    </div>

                    <h1 className="font-outfit text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                        WELCOME <span className="text-primary italic bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">BACK</span>
                    </h1>

                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 text-primary" />
                            Identity Verification
                            <Sparkles className="h-3 w-3 text-primary" />
                        </p>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
                    </div>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
