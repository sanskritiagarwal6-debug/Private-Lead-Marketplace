"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Shield, Calendar, Gauge, Award, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function LeadDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const FALLBACK_IMAGE = "/fallback-car.png";

    useEffect(() => {
        const fetchLead = async () => {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) setLead(data);
            setLoading(false);
        };
        fetchLead();
    }, [params.id]);

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (!lead) return <div className="p-8 text-center">Lead not found.</div>;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Image */}
            <div className="relative h-[50vh] w-full">
                <img
                    src={lead.image_url || FALLBACK_IMAGE}
                    className="w-full h-full object-cover"
                    alt={lead.title}
                    onError={(e) => e.currentTarget.src = FALLBACK_IMAGE}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute top-6 left-6">
                    <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
                    </Button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
                <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-white/5 pb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Premium Selection</span>
                                <span className="bg-white/10 text-white px-3 py-1 rounded text-xs font-medium">{lead.brand}</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2">{lead.title}</h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Verified Dealer • Instant Transfer Available
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[250px]">
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Standard Price</div>
                                <div className="text-2xl font-bold">{formatCurrency(lead.price_standard)}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => router.push(`/checkout/${lead.id}?type=standard`)} className="flex-1" variant="outline">Buy Standard</Button>
                                <Button variant="ghost" size="icon"><Share2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <Gauge className="w-6 h-6 text-primary mb-2" />
                            <div className="text-sm text-muted-foreground">Mileage</div>
                            <div className="font-semibold">{lead.mileage.toLocaleString()} km</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <Calendar className="w-6 h-6 text-primary mb-2" />
                            <div className="text-sm text-muted-foreground">Year</div>
                            <div className="font-semibold">{new Date(lead.registration_date).getFullYear()}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <Award className="w-6 h-6 text-primary mb-2" />
                            <div className="text-sm text-muted-foreground">Condition</div>
                            <div className="font-semibold">Excellent</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <Shield className="w-6 h-6 text-primary mb-2" />
                            <div className="text-sm text-muted-foreground">Warranty</div>
                            <div className="font-semibold">12 Months</div>
                        </div>
                    </div>

                    {/* Exclusive Call to Action */}
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-8 rounded-xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Buy Exclusive Rights</h3>
                                <p className="text-sm text-white/70">Purchase this lead exclusively. It will be removed from the marketplace instantly.</p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(lead.price_exclusive)}</div>
                            <Button variant="gold" size="lg" onClick={() => router.push(`/checkout/${lead.id}?type=exclusive`)}>
                                Secure Exclusively
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
