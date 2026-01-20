"use client";

import Link from "next/link";
import { LayoutDashboard, PlusCircle, ShoppingBag, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/leads/new", label: "Add Lead", icon: PlusCircle },
        { href: "/admin/offers", label: "Offers", icon: MessageSquare },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 p-6 flex flex-col gap-8 bg-black">
                <div className="font-bold text-xl tracking-tighter text-primary">ADMIN PANEL</div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
