"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Tag, LogOut, Shield, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close sidebar when navigating on mobile
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Hide sidebar on login page
    if (pathname === "/") return null;
    // Also hide on admin pages as they have their own layout
    if (pathname.startsWith("/admin")) return null;

    const navItems = [
        { href: "/dashboard", label: "Marketplace", icon: LayoutDashboard },
        { href: "/deals", label: "My Deals", icon: Tag },
        { href: "/purchases", label: "Purchases", icon: ShoppingBag },
        { href: "/support", label: "Help Center", icon: HelpCircle },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg text-white"
            >
                <div className="space-y-1.5">
                    <span className="block w-6 h-0.5 bg-white"></span>
                    <span className="block w-6 h-0.5 bg-white"></span>
                    <span className="block w-6 h-0.5 bg-white"></span>
                </div>
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "flex flex-col w-64 border-r border-white/10 h-screen fixed top-0 left-0 bg-black/95 backdrop-blur-xl z-50 transition-transform duration-300 ease-in-out",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-primary" />
                            <span className="font-bold text-xl tracking-tighter">LUXE<span className="text-primary">MARKET</span></span>
                        </div>
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden text-white/50 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-auto p-8 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Link>
                </div>
            </div>
        </>
    );
}
