"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    leadTitle: string;
    leadId: string;
    leadImage?: string;
}

export default function OfferModal({ isOpen, onClose, leadTitle, leadId, leadImage }: OfferModalProps) {
    const [amount, setAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const newOffer = {
            id: crypto.randomUUID(),
            lead_id: leadId,
            lead_title: leadTitle,
            lead_image: leadImage || "/fallback-car.png",
            offer_amount: parseFloat(amount),
            date: new Date().toISOString(),
            status: 'pending'
        };

        const existingOffers = JSON.parse(localStorage.getItem('my_offers') || '[]');
        localStorage.setItem('my_offers', JSON.stringify([newOffer, ...existingOffers]));

        alert("Offer Submitted Successfully!");
        setIsSubmitting(false);
        onClose();
        setAmount("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="glass p-6 rounded-xl w-full max-w-sm pointer-events-auto relative border border-white/10 shadow-2xl">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <h2 className="text-xl font-bold mb-1">Make an Offer</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Propose a price for <span className="text-white font-medium">{leadTitle}</span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted-foreground font-medium tracking-wider">Your Offer (₹)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 4500000"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        className="h-11"
                                        min={0}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button type="button" variant="ghost" onClick={onClose} className="w-full">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="gold"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Submit Offer"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
