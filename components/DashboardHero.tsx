"use client";

import { Shield, Zap, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DashboardHero() {
    const [selectedFeature, setSelectedFeature] = useState<{ id: string; title: string; desc: string; icon: any; color: string; bg: string } | null>(null);

    const features = [
        {
            id: 'verified',
            title: '100% Verified Sellers',
            desc: 'All dealers on our platform undergo a strict background check, ensuring you only deal with legitimate businesses.',
            icon: Shield,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/20'
        },
        {
            id: 'instant',
            title: 'Instant Lead Transfer',
            desc: 'Upon purchase confirmation, full lead details and contact information are transferred to your account instantly.',
            icon: Zap,
            color: 'text-amber-400',
            bg: 'bg-amber-500/20'
        },
        {
            id: 'escrow',
            title: 'Escrow Protection',
            desc: 'Your funds are held securely in our escrow account until the lead is verified and the transaction is approved.',
            icon: Lock,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/20'
        }
    ];

    return (
        <>
            <div className="relative overflow-hidden rounded-2xl mb-8 border border-white/10">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-neutral-900 to-primary/10" />

                {/* Abstract Shapes/Texture */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-2xl space-y-4 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-2"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Live Market Active
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                        >
                            India&apos;s #1 <span className="text-primary-foreground text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Private Dealer Network</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-foreground"
                        >
                            Access verified leads. Secure exclusive rights. Instant transfer.
                        </motion.p>
                    </div>

                    {/* Features / Icons */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6 relative"
                    >
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className="relative group"
                                onMouseEnter={() => setSelectedFeature(feature)}
                                onMouseLeave={() => setSelectedFeature(null)}
                            >
                                <div
                                    className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors text-left cursor-default"
                                >
                                    <div className={`w-10 h-10 rounded-full ${feature.bg} flex items-center justify-center ${feature.color}`}>
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-white">{feature.title.split(' ')[0]}</span>
                                        <span className="text-xs text-muted-foreground">{feature.title.split(' ').slice(1).join(' ')}</span>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {selectedFeature?.id === feature.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 glass p-4 rounded-xl border border-white/10 z-50 shadow-xl"
                                        >
                                            {/* Arrow */}
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-l border-t border-white/10 bg-black/80 backdrop-blur-xl" />

                                            <h4 className="font-bold text-sm text-white mb-1 relative z-10">{feature.title}</h4>
                                            <p className="text-xs text-muted-foreground relative z-10 leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </>
    );
}
