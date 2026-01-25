"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Loader2, Lock } from "lucide-react";

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <form action={formAction} className="space-y-10 relative z-10">
            <div className="space-y-6">
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"
                    >
                        <Lock className="h-3 w-3" />
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="block w-full rounded-2xl border border-border bg-gradient-to-br from-secondary/50 to-secondary/30 px-6 py-4 font-sans text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 hover:border-border/80"
                        placeholder="ke1ruu"
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"
                    >
                        <Lock className="h-3 w-3" />
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="block w-full rounded-2xl border border-border bg-gradient-to-br from-secondary/50 to-secondary/30 px-6 py-4 font-sans text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 hover:border-border/80"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {state?.error && (
                <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 p-4 text-center">
                    <p className="font-sans text-sm font-semibold text-red-400">{state.error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-4 py-3 font-outfit text-sm font-black uppercase tracking-[0.2em] text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Validating...
                    </span>
                ) : (
                    "Initialize Session"
                )}
            </button>
        </form>
    );
}
