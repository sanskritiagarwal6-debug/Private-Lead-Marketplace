"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowRight, Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const type = searchParams.get('type') as 'standard' | 'exclusive';
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchLead = async () => {
            const { data } = await supabase.from('leads').select('*').eq('id', params.id).single();
            if (data) setLead(data);
            setLoading(false);
        };
        fetchLead();
    }, [params.id]);

    const handleConfirmPurchase = async () => {
        setProcessing(true);

        // Simulate payment processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (type === 'exclusive') {
            // Logic to hide from market
            const { error } = await supabase
                .from('leads')
                .update({ status: 'sold_exclusive' })
                .eq('id', params.id);

            if (error) {
                alert("Purchase failed. Please try again.");
                setProcessing(false);
                return;
            }
        }

        // Success
        alert("Purchase Successful! Redirecting to your purchases...");
        router.push('/purchases');
        // In real app, create /purchases page query. For now redirecting to dashboard or dummy.
        // router.push('/dashboard'); 
    };

    if (loading) return <div className="p-8 text-center">Loading checkout...</div>;
    if (!lead) return <div className="p-8 text-center">Invalid Checkout Session.</div>;

    const price = type === 'exclusive' ? lead.price_exclusive : lead.price_standard;

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left: Product Summary */}
                <div className="glass p-8 rounded-2xl border border-white/10">
                    <div className="aspect-video w-full bg-neutral-900 rounded-lg overflow-hidden mb-6">
                        <img
                            src={lead.image_url || "/fallback-car.png"}
                            className="w-full h-full object-cover"
                            onError={(e) => e.currentTarget.src = "/fallback-car.png"}
                            alt="Lead Thumbnail"
                        />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{lead.title}</h2>
                    <p className="text-muted-foreground mb-6">{lead.brand} • {lead.mileage} km</p>

                    <div className="space-y-4 border-t border-white/10 pt-4">
                        <div className="flex justify-between">
                            <span>Item Price ({type})</span>
                            <span className="font-mono">{formatCurrency(price)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Processing Fee</span>
                            <span className="font-mono">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/5">
                            <span>Total Due</span>
                            <span>{formatCurrency(price)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Payment & Confirm */}
                <div className="glass p-8 rounded-2xl border border-white/10 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Secure SSL Connection
                        </p>
                    </div>

                    <div className="space-y-6">
                        {type === 'exclusive' && (
                            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex gap-3">
                                <Shield className="w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-primary text-sm">Exclusive Rights</h4>
                                    <p className="text-xs text-muted-foreground">Upon confirmation, this lead will be permanently removed from the public marketplace.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-sm font-medium">Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="border border-white/20 p-3 rounded flex items-center justify-center cursor-pointer hover:bg-white/5 bg-white/5">Credit Card</div>
                                <div className="border border-white/10 p-3 rounded flex items-center justify-center cursor-pointer hover:bg-white/5 text-muted-foreground">Bank Wire</div>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-14 text-lg"
                            variant={type === 'exclusive' ? 'gold' : 'default'}
                            onClick={handleConfirmPurchase}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : `Confirm Payment of ${formatCurrency(price)}`}
                        </Button>

                        <button onClick={() => router.back()} className="w-full text-center text-sm text-muted-foreground hover:text-white transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
