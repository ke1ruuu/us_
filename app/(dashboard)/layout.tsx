import { getCurrentUser } from "@/utils/auth";
import { NavigationDock } from "@/components/shared/navigation-dock";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background font-sans pb-32 relative overflow-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.03),transparent_70%)]" />
            </div>

            <main className="mx-auto max-w-[1200px] px-4 sm:px-8 py-8 md:py-16">
                {children}
            </main>

            <NavigationDock />
        </div>
    );
}
