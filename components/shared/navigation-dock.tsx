"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { Heart, LogOut, PenLine, Sparkles } from "lucide-react";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function NavigationDock() {
    const pathname = usePathname();

    const iconClass = "size-full p-2.5 transition-all";

    return (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-110 opacity-30" />

                <Dock iconMagnification={60} iconDistance={100}>
                    <DockIcon className="bg-black/10 dark:bg-white/10 relative overflow-hidden group">
                        <Link href="/feed" className="flex size-full items-center justify-center relative z-10">
                            {pathname === "/feed" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/20 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Heart
                                className={`${iconClass} ${pathname === "/feed"
                                    ? "fill-primary text-primary"
                                    : "fill-current text-muted-foreground group-hover:text-primary"
                                    }`}
                            />
                        </Link>
                    </DockIcon>

                    <DockIcon className="bg-black/10 dark:bg-white/10 relative overflow-hidden group">
                        <Link href="/notes" className="flex size-full items-center justify-center relative z-10">
                            {pathname === "/notes" && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/20 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <PenLine
                                className={`${iconClass} ${pathname === "/notes"
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-primary"
                                    }`}
                            />
                        </Link>
                    </DockIcon>

                    <DockIcon
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer border-none shadow-none group"
                        onClick={async () => {
                            await logout();
                        }}
                    >
                        <LogOut className="size-6 group-hover:scale-110 transition-transform" />
                    </DockIcon>
                </Dock>
            </div>
        </div>
    );
}
