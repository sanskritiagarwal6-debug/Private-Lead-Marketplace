"use client";

import Link from "next/link";
import { Shield, Smartphone, Mail, Phone, Linkedin, Instagram, Facebook, TrendingUp } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl mt-auto">
            <div className="max-w-[1600px] mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Column 1: Brand Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-primary" />
                            <span className="font-bold text-xl tracking-tighter text-white">LUXE<span className="text-primary">MARKET</span></span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            India&apos;s Premier Private B2B Network for ultra-luxury vehicle trading. Connecting verified dealers and collectors across the subcontinent.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="pt-4">
                            <Link href="/insights" className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                                <TrendingUp className="w-4 h-4" />
                                Market Insights & Tools
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Top Inventory */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-white tracking-wide uppercase text-sm">Top Inventory</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/dashboard?brands=Ferrari" className="hover:text-primary transition-colors">Ferrari Italia</Link></li>
                            <li><Link href="/dashboard?brands=Lamborghini" className="hover:text-primary transition-colors">Lamborghini India</Link></li>
                            <li><Link href="/dashboard?brands=Rolls-Royce" className="hover:text-primary transition-colors">Rolls Royce Collections</Link></li>
                            <li><Link href="/dashboard?brands=Porsche" className="hover:text-primary transition-colors">Porsche 911 GT Series</Link></li>
                            <li><Link href="/dashboard?brands=Bentley" className="hover:text-primary transition-colors">Bentley Continental</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Network Hubs */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-white tracking-wide uppercase text-sm">Network Hubs</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                <Link href="/hubs/delhi" className="hover:text-primary transition-colors">Delhi NCR (HQ)</Link>
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            </li>
                            <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                <Link href="/hubs/mumbai" className="hover:text-primary transition-colors">Mumbai</Link>
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            </li>
                            <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                <Link href="/hubs/bangalore" className="hover:text-primary transition-colors">Bangalore</Link>
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            </li>
                            <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                <Link href="/hubs/hyderabad" className="hover:text-primary transition-colors">Hyderabad</Link>
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            </li>
                            <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                <Link href="/hubs/dubai" className="hover:text-primary transition-colors">Dubai (Import)</Link>
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Trust & App */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-white tracking-wide uppercase text-sm">Contact & Support</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>concierge@luxemarket.in</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 flex items-center gap-3 transition-colors text-left group">
                                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white group-hover:text-primary">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase leading-none mb-1">Download on the</div>
                                    <div className="text-sm font-bold text-white">App Store</div>
                                </div>
                            </button>
                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 flex items-center gap-3 transition-colors text-left group">
                                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white group-hover:text-primary">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase leading-none mb-1">Get it on</div>
                                    <div className="text-sm font-bold text-white">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2026 LuxeMarket India Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/verification" className="hover:text-primary transition-colors">Dealer Verification</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
