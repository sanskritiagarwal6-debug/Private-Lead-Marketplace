"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Activity, DollarSign, Calculator, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function InsightsPage() {
    const [stats, setStats] = useState({ totalVolume: 0, topBrand: "Loading...", fastestSelling: "Audi RS Series" });
    const [usdPrice, setUsdPrice] = useState<string>("");
    const [landedCost, setLandedCost] = useState<number | null>(null);

    // Live Ticker Data
    const tickerItems = [
        "⚠️ New Import Duty Regulations for 2026 Announced...",
        "📈 Luxury SUV demand up by 14% in Delhi NCR...",
        "💎 Rolex Market stabilizing Q1 2026",
        "🛑 E-Challan enforcement strict in Mumbai Marine Drive...",
        "⚡ Tesla Model S Plaid units arriving in Bengaluru Custom Bond..."
    ];

    useEffect(() => {
        const fetchMarketData = async () => {
            const { data } = await supabase.from('leads').select('*').eq('status', 'available');

            if (data && data.length > 0) {
                const volume = data.reduce((acc, curr) => acc + curr.price_exclusive, 0);

                // Find Top Brand
                const brandCounts: Record<string, number> = {};
                data.forEach(lead => {
                    brandCounts[lead.brand] = (brandCounts[lead.brand] || 0) + 1;
                });
                const topBrand = Object.keys(brandCounts).reduce((a, b) => brandCounts[a] > brandCounts[b] ? a : b);

                setStats(prev => ({ ...prev, totalVolume: volume, topBrand }));
            } else {
                setStats(prev => ({ ...prev, totalVolume: 0, topBrand: "N/A" }));
            }
        };

        fetchMarketData();
    }, []);

    const calculateDuty = () => {
        const usd = parseFloat(usdPrice);
        if (isNaN(usd)) return;

        // Exchange Rate approx 85 for 2026 context
        const exchangeRate = 85;
        const baseInr = usd * exchangeRate;
        const customDuty = baseInr * 1.25; // 125%
        const socialWelfare = customDuty * 0.10; // 10% SWS
        const total = baseInr + customDuty + socialWelfare;

        setLandedCost(total);
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">

            {/* Ticker Section */}
            <div className="mb-8 overflow-hidden bg-primary/10 border-y border-primary/20 py-3 relative">
                <div className="whitespace-nowrap animate-marquee flex gap-12 text-sm font-medium text-primary tracking-wide">
                    {tickerItems.map((item, i) => (
                        <span key={i} className="flex items-center gap-2"><Activity className="w-3 h-3" /> {item}</span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {tickerItems.map((item, i) => (
                        <span key={`dup-${i}`} className="flex items-center gap-2"><Activity className="w-3 h-3" /> {item}</span>
                    ))}
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-2">Market <span className="text-primary">Insights</span></h1>
            <p className="text-muted-foreground mb-10">Real-time intelligence for the modern dealer.</p>

            {/* Live Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-muted-foreground uppercase tracking-wider text-xs font-bold mb-1">Total Market Volume</h3>
                        <div className="text-4xl font-mono font-bold text-white">{formatCurrency(stats.totalVolume)}</div>
                        <div className="text-green-500 text-sm mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +12.5% this week
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-muted-foreground uppercase tracking-wider text-xs font-bold mb-1">Most Active Brand</h3>
                        <div className="text-4xl font-mono font-bold text-primary">{stats.topBrand}</div>
                        <div className="text-muted-foreground text-sm mt-2">
                            High demand in SUV segment
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ArrowRight className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-muted-foreground uppercase tracking-wider text-xs font-bold mb-1">Fastest Selling Model</h3>
                        <div className="text-4xl font-mono font-bold text-white leading-tight">{stats.fastestSelling}</div>
                        <div className="text-muted-foreground text-sm mt-2">
                            Avg. time on market: 48h
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Import Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Calculator className="w-8 h-8 text-primary" />
                        Import Duty Calculator
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Planning an import? Instantly verify the landed cost for CBU (Completely Built Unit) vehicles entering India.
                        Includes Basic Customs Duty (125%) and Social Welfare Surcharge (10%).
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground border-l-2 border-primary/30 pl-4">
                        <li>• Valid for Brand New CBU Imports</li>
                        <li>• Excludes Registration & Insurance</li>
                        <li>• Assumes Exchange Rate: 1 USD = ₹85 INR</li>
                    </ul>
                </div>

                <div className="glass p-8 rounded-2xl border border-white/10">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Vehicle Invoice Value (USD)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <input
                                    type="number"
                                    value={usdPrice}
                                    onChange={(e) => setUsdPrice(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="e.g. 50000"
                                />
                            </div>
                        </div>

                        <button
                            onClick={calculateDuty}
                            className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            Calculate Landed Cost
                        </button>

                        {landedCost !== null && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                className="pt-6 border-t border-white/10 mt-6"
                            >
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground mb-1">Estimated Landed Cost (India)</div>
                                    <div className="text-3xl font-bold text-primary">{formatCurrency(landedCost)}</div>
                                    <div className="text-xs text-muted-foreground mt-2 opacity-60">*Indicative only. Refer to ICEGATE for official duties.</div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
