"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";

export default function AdminOffersPage() {
    // Using dummy data as 'offers' table wasn't fully populated via UI in this demo flow yet
    // In a real app, this would fetch from 'offers' table
    const [offers, setOffers] = useState([
        { id: '1', lead_title: 'Audi RS6 Avant', amount: 4800000, user_email: 'buyer@example.com', status: 'pending', created_at: new Date().toISOString() },
        { id: '2', lead_title: 'Porsche 911 GT3', amount: 12000000, user_email: 'collector@example.com', status: 'pending', created_at: new Date().toISOString() }
    ]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Offers Inbox</h1>

            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 uppercase text-xs text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-4">Car Name</th>
                            <th className="px-6 py-4">Offered Price</th>
                            <th className="px-6 py-4">User Email</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {offers.map((offer) => (
                            <tr key={offer.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium">{offer.lead_title}</td>
                                <td className="px-6 py-4">{formatCurrency(offer.amount)}</td>
                                <td className="px-6 py-4 text-muted-foreground">{offer.user_email}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs uppercase font-bold">{offer.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary hover:underline text-xs mr-3">Accept</button>
                                    <button className="text-red-500 hover:underline text-xs">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
