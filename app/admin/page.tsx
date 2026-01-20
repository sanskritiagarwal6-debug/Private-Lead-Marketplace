"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";
import { RefreshCcw, Mail } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, exclusive: 0, revenue: 0, activeOffers: 2 });
    const [leads, setLeads] = useState<any[]>([]);
    const [newsletterPreview, setNewsletterPreview] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Leads
            const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

            if (data) {
                setLeads(data);
                const soldExclusive = data.filter(l => l.status === 'sold_exclusive');

                // Calculate mocked revenue (assuming standard buy doesn't track logically yet here)
                const revenue = soldExclusive.reduce((acc, curr) => acc + curr.price_exclusive, 0);

                setStats(prev => ({
                    ...prev,
                    total: data.length,
                    exclusive: soldExclusive.length,
                    revenue: revenue
                }));

                // Newsletter Preview (Last 24h)
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const recent = data.filter(l => new Date(l.created_at) > yesterday && l.status === 'available');
                setNewsletterPreview(recent);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Command Center</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-xl border border-white/10">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Revenue</div>
                    <div className="text-3xl font-bold mt-2 text-green-500">{formatCurrency(stats.revenue)}</div>
                </div>
                <div className="glass p-6 rounded-xl border border-white/10">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Exclusive Sales</div>
                    <div className="text-3xl font-bold mt-2 text-primary">{stats.exclusive}</div>
                </div>
                <div className="glass p-6 rounded-xl border border-white/10">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Active Offers</div>
                    <div className="text-3xl font-bold mt-2">{stats.activeOffers}</div>
                </div>
                <div className="glass p-6 rounded-xl border border-white/10">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Inv.</div>
                    <div className="text-3xl font-bold mt-2">{stats.total}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads Table */}
                <div className="lg:col-span-2 glass rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Detailed Inventory</h3>
                        <button className="p-2 hover:bg-white/5 rounded-full"><RefreshCcw className="w-4 h-4" /></button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 uppercase text-xs text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Price (Excl)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leads.slice(0, 5).map((lead) => (
                                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium">{lead.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{formatCurrency(lead.price_exclusive)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Newsletter Preview */}
                <div className="glass rounded-xl border border-white/10 p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Daily Newsletter</h3>
                            <p className="text-xs text-muted-foreground">Preview of today's digest</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 mb-6">
                        {newsletterPreview.length > 0 ? (
                            <>
                                <p className="text-sm">Today's New Arrivals:</p>
                                <ul className="space-y-2">
                                    {newsletterPreview.map(car => (
                                        <li key={car.id} className="text-sm font-medium border-l-2 border-primary pl-3 py-1 bg-white/5 rounded-r">
                                            {car.title} <span className="text-muted-foreground">- {formatCurrency(car.price_exclusive)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-muted-foreground bg-white/5 rounded border border-dashed border-white/10">
                                No new leads in last 24h
                            </div>
                        )}
                    </div>

                    <button className="w-full py-2 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors">
                        Trigger Manually
                    </button>
                </div>
            </div>
        </div>
    );
}
