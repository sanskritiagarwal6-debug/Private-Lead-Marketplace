"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";
import { RefreshCcw, Mail, Users, DollarSign, Clock, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        exclusiveSales: 0,
        pendingApprovals: 0,
        totalInventory: 0,
        totalUsers: 0,
        activeOffers: 2,
    });
    const [leads, setLeads] = useState<any[]>([]);
    const [newsletterPreview, setNewsletterPreview] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);

        // Fetch Leads
        const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

        // Fetch Users count
        const { count: usersCount } = await supabase.from('authorized_users').select('*', { count: 'exact', head: true });

        if (leadsData) {
            setLeads(leadsData);
            const soldExclusive = leadsData.filter(l => l.status === 'sold_exclusive');
            const pending = leadsData.filter(l => l.moderation_status === 'pending');
            const revenue = soldExclusive.reduce((acc, curr) => acc + curr.price_exclusive, 0);

            setStats(prev => ({
                ...prev,
                totalInventory: leadsData.length,
                exclusiveSales: soldExclusive.length,
                totalRevenue: revenue,
                pendingApprovals: pending.length,
                totalUsers: usersCount || 0,
            }));

            // Newsletter Preview (Last 24h)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const recent = leadsData.filter(l => new Date(l.created_at) > yesterday && l.status === 'available');
            setNewsletterPreview(recent);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const statCards = [
        {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            label: "Total Users",
            value: stats.totalUsers.toString(),
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Pending Approvals",
            value: stats.pendingApprovals.toString(),
            icon: Clock,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            link: "/admin/listings",
        },
        {
            label: "Total Inventory",
            value: stats.totalInventory.toString(),
            icon: Package,
            color: "text-primary",
            bg: "bg-primary/10",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">Monitor your marketplace performance</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    disabled={loading}
                >
                    <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                    <div className={`text-2xl font-bold mt-1 ${stat.color}`}>
                                        {loading ? (
                                            <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                                        ) : (
                                            stat.value
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads Table */}
                <div className="lg:col-span-2 glass rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Recent Inventory</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 uppercase text-xs text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Moderation</th>
                                    <th className="px-6 py-4">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><div className="h-4 w-32 bg-white/5 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    leads.slice(0, 5).map((lead) => (
                                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium">{lead.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                                                    }`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.moderation_status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                        lead.moderation_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {lead.moderation_status || 'approved'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{formatCurrency(lead.price_exclusive)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Newsletter Preview */}
                <div className="glass rounded-xl border border-white/10 p-6 flex flex-col h-fit">
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

                    <button className="w-full py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        Trigger Manually
                    </button>
                </div>
            </div>
        </div>
    );
}
