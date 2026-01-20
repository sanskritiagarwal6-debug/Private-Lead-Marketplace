"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Filters from "@/components/Filters";
import LeadCard from "@/components/LeadCard";
import { supabase } from "@/lib/supabaseClient";
import { Zap, Tag, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

import DashboardHero from "@/components/DashboardHero";

export default function Dashboard() {
    const searchParams = useSearchParams();
    const [leads, setLeads] = useState<any[]>([]);
    const [stats, setStats] = useState({ count: 0, totalValue: 0 });
    const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14400));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchLeads = async () => {
            let query = supabase.from('leads').select('*').eq('status', 'available');

            // Apply Filters
            const brandParam = searchParams.get('brands');
            if (brandParam) {
                const brands = brandParam.split(',');
                query = query.in('brand', brands);
            }

            const qParam = searchParams.get('q');
            if (qParam) {
                query = query.ilike('title', `%${qParam}%`);
            }

            const { data } = await query;

            if (data) {
                setLeads(data);
                const total = data.reduce((acc, curr) => acc + curr.price_exclusive, 0);
                setStats({ count: data.length, totalValue: total });
            }
            setLoading(false);
        };

        fetchLeads();

        // Realtime Subscription
        const channel = supabase
            .channel('leads-changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
                if (payload.new.status === 'sold_exclusive') {
                    setLeads(current => current.filter(lead => lead.id !== payload.new.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [searchParams]);

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">

            <DashboardHero />

            {/* Live Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass p-4 rounded-xl flex items-center gap-4"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Live Listings</div>
                        {loading ? (
                            <div className="h-8 w-16 bg-white/10 rounded animate-pulse mt-1" />
                        ) : (
                            <div className="text-2xl font-bold font-mono">{stats.count}</div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass p-4 rounded-xl flex items-center gap-4"
                >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <Tag className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Inventory Value</div>
                        {loading ? (
                            <div className="h-8 w-32 bg-white/10 rounded animate-pulse mt-1" />
                        ) : (
                            <div className="text-2xl font-bold font-mono">{formatCurrency(stats.totalValue)}</div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass p-4 rounded-xl flex items-center gap-4"
                >
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                        <Timer className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Live Auction Ends</div>
                        <div className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</div>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <Filters />

                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight">Marketplace Inventory</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading ? (
                            // Skeleton Cards
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="glass rounded-xl overflow-hidden h-[400px] animate-pulse">
                                    <div className="h-56 bg-white/5" />
                                    <div className="p-4 space-y-4">
                                        <div className="h-4 w-3/4 bg-white/5 rounded" />
                                        <div className="h-4 w-1/2 bg-white/5 rounded" />
                                        <div className="flex justify-between pt-4">
                                            <div className="h-8 w-24 bg-white/5 rounded" />
                                            <div className="h-8 w-24 bg-white/5 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                {leads.map((lead) => (
                                    <LeadCard key={lead.id} lead={lead} />
                                ))}
                                {leads.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-muted-foreground glass rounded-xl">
                                        No vehicles found matching your criteria.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
