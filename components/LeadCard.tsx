"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, Zap, Clock, TrendingUp, Info } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OfferModal from "./OfferModal";

import { formatCurrency } from "@/lib/utils";

interface Lead {
    id: string;
    title: string;
    brand: string;
    mileage: number;
    registration_date: string;
    price_standard: number;
    price_exclusive: number;
    status: string;
    image_url?: string;
}

export default function LeadCard({ lead }: { lead: Lead }) {
    const [isOfferOpen, setIsOfferOpen] = useState(false);
    const router = useRouter();
    const FALLBACK_IMAGE = "/fallback-car.png";
    const [imgSrc, setImgSrc] = useState(lead.image_url || FALLBACK_IMAGE);

    useEffect(() => {
        setImgSrc(lead.image_url || FALLBACK_IMAGE);
    }, [lead.image_url]);


    const handleStandardBuy = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/checkout/${lead.id}?type=standard`);
    };

    const handleExclusiveBuy = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/checkout/${lead.id}?type=exclusive`);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card flex flex-col justify-between h-full group relative overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Image Section */}
                <Link href={`/leads/${lead.id}`} className="relative h-48 w-full overflow-hidden block">
                    <img
                        src={imgSrc}
                        alt={lead.title}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            setImgSrc(FALLBACK_IMAGE);
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Condition Tag */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Premium
                    </div>

                    {/* Brand Tag */}
                    <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-medium px-2 py-1 rounded">
                        {lead.brand}
                    </div>
                </Link>

                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <Link href={`/leads/${lead.id}`} className="hover:text-primary transition-colors">
                            <h3 className="text-lg font-bold text-white line-clamp-1">
                                {lead.title}
                            </h3>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <TrendingUp className="w-3 h-3" /> Mileage
                            </div>
                            <span className="text-sm font-medium">{lead.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" /> Registration
                            </div>
                            <span className="text-sm font-medium">{new Date(lead.registration_date).getFullYear()}</span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">

                        {/* Standard Option */}
                        <div onClick={handleStandardBuy} className="flex items-center justify-between group/std p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover/std:text-white transition-colors">
                                    1
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Standard Buy</span>
                                    <span className="font-semibold text-white">{formatCurrency(lead.price_standard)}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="opacity-0 group-hover/std:opacity-100 transition-opacity">
                                Buy
                            </Button>
                        </div>

                        {/* Exclusive Option */}
                        <div onClick={handleExclusiveBuy} className="flex items-center justify-between group/excl p-2 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover/excl:animate-shimmer" />

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-primary font-medium tracking-wide">EXCLUSIVE</span>
                                    <span className="font-bold text-white">{formatCurrency(lead.price_exclusive)}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="gold" className="relative z-10">
                                Buy Exclusive
                            </Button>
                        </div>

                    </div>
                </div>

                <div className="p-4 bg-white/3 border-t border-white/5 text-center flex justify-between px-6">
                    <button
                        onClick={() => setIsOfferOpen(true)}
                        className="text-xs text-muted-foreground hover:text-white transition-colors underline-offset-4 hover:underline"
                    >
                        Make an offer
                    </button>

                    <Link href={`/leads/${lead.id}`} className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                        Details <Info className="w-3 h-3" />
                    </Link>
                </div>

            </motion.div>

            <OfferModal
                isOpen={isOfferOpen}
                onClose={() => setIsOfferOpen(false)}
                leadTitle={lead.title}
                leadId={lead.id}
                leadImage={lead.image_url}
            />
        </>
    );
}
