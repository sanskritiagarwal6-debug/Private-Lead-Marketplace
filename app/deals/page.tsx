"use client";

import { MessageSquare } from "lucide-react";

export default function DealsPage() {
    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Deals & Offers</h1>

            <div className="glass p-12 rounded-xl border border-white/10 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Active Negotiations</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    You haven't submitted any offers yet. Visit the marketplace to make an offer on a vehicle.
                </p>
            </div>
        </div>
    );
}
