"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Shield, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<any[]>([]);

    // Note: Since we haven't implemented robust User profiles with purchase history tables linked to auth,
    // we will fetch 'sold_exclusive' leads as a proxy for "My Purchases" in this demo context.
    // In a real app, query table 'purchases' where user_id = auth.user.id

    useEffect(() => {
        const fetchPurchases = async () => {
            const { data } = await supabase.from('leads').select('*').eq('status', 'sold_exclusive');
            if (data) setPurchases(data);
        };
        fetchPurchases();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Purchases</h1>

            <div className="grid grid-cols-1 gap-6">
                {purchases.map((item) => (
                    <div key={item.id} className="glass p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 border border-green-500/20">
                        <div className="w-full md:w-48 h-32 rounded-lg bg-black/50 overflow-hidden relative">
                            <img
                                src={item.image_url || "/fallback-car.png"}
                                className="w-full h-full object-cover"
                                onError={(e) => e.currentTarget.src = "/fallback-car.png"}
                                alt={item.title}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-xs font-bold uppercase">Secured</span>
                            </div>
                            <p className="text-muted-foreground">{item.brand} • Sold for {formatCurrency(item.price_exclusive)}</p>
                        </div>

                        <div>
                            <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Download Invoice
                            </button>
                        </div>
                    </div>
                ))}

                {purchases.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        You haven't made any exclusive purchases yet.
                    </div>
                )}
            </div>
        </div>
    );
}
