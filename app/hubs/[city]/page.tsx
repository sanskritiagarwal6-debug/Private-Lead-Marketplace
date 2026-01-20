"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LeadCard from "@/components/LeadCard";
import { MapPin, Building2, Car, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CITY_DATA: Record<string, { name: string; dealers: number; description: string }> = {
    "delhi": { name: "Delhi NCR", dealers: 42, description: "The heart of India's luxury car market, featuring exclusive imports and diplomatic sales." },
    "mumbai": { name: "Mumbai", dealers: 35, description: "Premium coastline collections and Bollywood's favorite supercar inventory." },
    "bangalore": { name: "Bangalore", dealers: 28, description: "Tech-city exclusives, featuring high-performance EVs and rare collectibles." },
    "hyderabad": { name: "Hyderabad", dealers: 20, description: "Nizam-era luxury meets modern supercars. High-value transactions hub." },
    "dubai": { name: "Dubai (Import)", dealers: 15, description: "Direct imports from the UAE. Tax-paid and custom cleared selections." },
};

export default function HubPage() {
    const params = useParams();
    const cityKey = (params.city as string).toLowerCase();
    const cityInfo = CITY_DATA[cityKey] || { name: params.city, dealers: 10, description: "Regional Hub" };

    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            // In a real app, we would filter by location column. 
            // For now, we'll fetch all and pretend, or slice them to simulate variety.
            const { data } = await supabase.from('leads').select('*').eq('status', 'available');

            if (data) {
                // Simulate filtering by shuffling or taking a subset based on city hash length
                // This is just to make the pages look slightly different for the demo
                const pseudoRandomStart = cityKey.length % 3;
                setLeads(data.slice(pseudoRandomStart, pseudoRandomStart + 4));
            }
            setLoading(false);
        };
        fetchLeads();
    }, [cityKey]);

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
            {/* Hub Header */}
            <div className="glass p-8 rounded-2xl border border-white/10 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Regional Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{cityInfo.name}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">{cityInfo.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-white/5 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{cityInfo.dealers}</div>
                            <div className="text-sm text-muted-foreground">Active Dealers</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{leads.length}</div>
                            <div className="text-sm text-muted-foreground">Available Cars</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">Verified</div>
                            <div className="text-sm text-muted-foreground">Network Status</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Local Inventory */}
            <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full" />
                    Local Inventory
                </h2>

                {loading ? (
                    <div className="py-20 text-center text-muted-foreground">Loading hub inventory...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {leads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} />
                        ))}
                        {leads.length === 0 && (
                            <div className="col-span-full py-20 text-center text-muted-foreground glass rounded-xl">
                                No specific inventory found for this region currently.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
