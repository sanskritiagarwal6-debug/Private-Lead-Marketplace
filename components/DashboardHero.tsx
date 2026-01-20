"use client";

import { Shield, Zap, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DashboardHero() {
    const [selectedFeature, setSelectedFeature] = useState<{ title: string; desc: string; icon: any } | null>(null);

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
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        {features.map((feature) => (
                            <button
                                key={feature.id}
                                onClick={() => setSelectedFeature(feature)}
                                className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors text-left"
                            >
                                <div className={`w-10 h-10 rounded-full ${feature.bg} flex items-center justify-center ${feature.color}`}>
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-white">{feature.title.split(' ')[0]}</span>
                                    <span className="text-xs text-muted-foreground">{feature.title.split(' ').slice(1).join(' ')}</span>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Feature Modal */}
            <AnimatePresence>
                {selectedFeature && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedFeature(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 pointer-events-auto"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="glass p-8 rounded-2xl max-w-md w-full pointer-events-auto relative border border-white/10"
                            >
                                <button onClick={() => setSelectedFeature(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className={`w-16 h-16 rounded-full ${selectedFeature.bg} flex items-center justify-center mb-6 mx-auto`}>
                                    <selectedFeature.icon className={`w-8 h-8 ${selectedFeature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-center mb-2">{selectedFeature.title}</h3>
                                <p className="text-muted-foreground text-center leading-relaxed">
                                    {selectedFeature.desc}
                                </p>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
