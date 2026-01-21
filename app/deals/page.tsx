"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Calendar, DollarSign, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DealsPage() {
    const [offers, setOffers] = useState<any[]>([]);

    useEffect(() => {
        const storedOffers = JSON.parse(localStorage.getItem('my_offers') || '[]');
        setOffers(storedOffers);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Deals & Offers</h1>

            {offers.length === 0 ? (
                <div className="glass p-12 rounded-xl border border-white/10 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No Active Negotiations</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        You haven't submitted any offers yet. Visit the marketplace to make an offer on a vehicle.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {offers.map((offer) => (
                        <div key={offer.id} className="glass p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-full md:w-48 aspect-video bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                                <img
                                    src={offer.lead_image || "/fallback-car.png"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = "/fallback-car.png"}
                                    alt="Car"
                                />
                            </div>

                            <div className="flex-1 w-full text-center md:text-left">
                                <h3 className="text-xl font-bold mb-1">{offer.lead_title}</h3>
                                <div className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-4">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(offer.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Offer: {formatCurrency(offer.offer_amount)}</span>
                                </div>
                            </div>

                            <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2">
                                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {offer.status}
                                </span>
                                <p className="text-xs text-muted-foreground">Awaiting Seller Response</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
