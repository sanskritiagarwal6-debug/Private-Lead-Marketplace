"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Users, ListChecks, MessageSquare, UserPlus, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "admin@luxemarket.com";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check if user is admin
        const userEmail = localStorage.getItem('user_email');

        if (userEmail !== ADMIN_EMAIL) {
            router.push('/dashboard');
            return;
        }

        setAuthorized(true);
        setChecking(false);
    }, [router]);

    const navItems = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/listings", label: "Listings", icon: ListChecks },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/access-requests", label: "Access Requests", icon: UserPlus },
        { href: "/admin/offers", label: "Offers", icon: MessageSquare },
    ];

    if (checking) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            {/* Command Center Sidebar */}
            <div className="w-72 border-r border-white/5 flex flex-col bg-gradient-to-b from-black to-[#0a0a0a]">
                {/* Logo Area */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <div className="font-bold text-lg tracking-tight">Command Center</div>
                            <div className="text-xs text-muted-foreground">Admin Portal</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin Info Footer */}
                <div className="p-4 border-t border-white/5">
                    <div className="glass rounded-xl p-4">
                        <div className="text-xs text-muted-foreground mb-1">Logged in as</div>
                        <div className="text-sm font-medium truncate">{ADMIN_EMAIL}</div>
                        <Link
                            href="/dashboard"
                            className="text-xs text-primary hover:underline mt-2 inline-block"
                        >
                            ← Back to User Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
