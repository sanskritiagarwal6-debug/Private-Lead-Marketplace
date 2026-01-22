'use client';
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle, ArrowRight, Lock, CreditCard, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const type = searchParams.get('type') as 'standard' | 'exclusive';
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
    const [cardDetails, setCardDetails] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        const fetchLead = async () => {
            const { data } = await supabase.from('leads').select('*').eq('id', params.id).single();
            if (data) setLead(data);
            setLoading(false);
        };
        fetchLead();
    }, [params.id]);

    const isCardValid = () => {
        return cardDetails.name && cardDetails.number && cardDetails.expiry && cardDetails.cvv;
    };

    const handleConfirmPurchase = async () => {
        if (paymentMethod === 'card' && !isCardValid()) {
            alert("Please complete all card details to proceed.");
            return;
        }

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
        // Redirect to dashboard as Purchases page doesn't exist yet but router.push('/purchases') was in original code
        router.push('/dashboard');
    };

    if (loading) return <div className="p-8 text-center">Loading checkout...</div>;
    if (!lead) return <div className="p-8 text-center">Invalid Checkout Session.</div>;

    const price = type === 'exclusive' ? lead.price_exclusive : lead.price_standard;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pt-24">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left: Product Summary */}
                <div className="glass p-8 rounded-2xl border border-white/10 h-fit">
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
                                <div
                                    onClick={() => setPaymentMethod('card')}
                                    className={`border p-3 rounded flex items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 hover:bg-white/5 text-muted-foreground'}`}
                                >
                                    <CreditCard className="w-4 h-4" /> Credit Card
                                </div>
                                <div
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`border p-3 rounded flex items-center justify-center gap-2 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 hover:bg-white/5 text-muted-foreground'}`}
                                >
                                    <Building2 className="w-4 h-4" /> Bank Wire
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[280px]">
                            <AnimatePresence mode="wait">
                                {paymentMethod === 'card' ? (
                                    <motion.div
                                        key="card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-muted-foreground">Cardholder Name</label>
                                            <Input
                                                placeholder="John Doe"
                                                className="focus-visible:ring-primary/50 focus-visible:border-primary"
                                                value={cardDetails.name}
                                                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-muted-foreground">Card Number</label>
                                            <Input
                                                placeholder="0000 0000 0000 0000"
                                                className="focus-visible:ring-primary/50 focus-visible:border-primary"
                                                value={cardDetails.number}
                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-muted-foreground">Expiry Date</label>
                                                <Input
                                                    placeholder="MM/YY"
                                                    className="focus-visible:ring-primary/50 focus-visible:border-primary"
                                                    value={cardDetails.expiry}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-muted-foreground">CVV</label>
                                                <Input
                                                    placeholder="123"
                                                    type="password"
                                                    className="focus-visible:ring-primary/50 focus-visible:border-primary"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="bank"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-6 rounded-xl bg-white/5 border border-white/10 text-center space-y-4"
                                    >
                                        <Building2 className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
                                        <div>
                                            <h4 className="font-bold text-white">Bank Transfer Details</h4>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Please transfer the total amount to the following account. Your purchase will be confirmed once funds are received.
                                            </p>
                                        </div>
                                        <div className="text-sm bg-black/40 p-4 rounded font-mono text-left space-y-2">
                                            <div className="flex justify-between"><span>Bank:</span> <span>HDFC Bank</span></div>
                                            <div className="flex justify-between"><span>Account:</span> <span>0000 1234 5678</span></div>
                                            <div className="flex justify-between"><span>IFSC:</span> <span>HDFC0001234</span></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
