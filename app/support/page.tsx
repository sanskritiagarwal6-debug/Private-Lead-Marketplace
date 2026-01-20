"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How does 'Exclusive Buy' work?",
            answer: "When you select 'Exclusive Buy', you pay a premium price to secure the sole rights to the lead. Upon purchase, the listing is instantly removed from the public marketplace, ensuring no other dealer can access it."
        },
        {
            question: "What is your Refund Policy?",
            answer: "We offer a 100% money-back guarantee if the lead information is found to be inaccurate or if the seller is unresponsive within 48 hours of purchase. Please contact support to initiate a claim."
        },
        {
            question: "How do I top up my wallet?",
            answer: "Currently, we operate on a direct payment gateway model per transaction. A prepaid wallet feature is coming soon to the platform for easier bulk purchasing."
        },
        {
            question: "Are the sellers verified?",
            answer: "Yes, every seller on the platform undergoes a rigorous manual verification process, including business registration checks and inventory audits."
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-4xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4">Help Center</h1>
                <p className="text-muted-foreground">Everything you need to know about using LuxeMarket.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass p-6 rounded-xl border border-white/10 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get a response within 2 hours</p>
                    <a href="mailto:support@luxemarket.in" className="text-primary text-sm hover:underline">support@luxemarket.in</a>
                </div>
                <div className="glass p-6 rounded-xl border border-white/10 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                        <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Phone Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">Available 9 AM - 6 PM IST</p>
                    <a href="tel:+919876543210" className="text-primary text-sm hover:underline">+91 98765 43210</a>
                </div>
                <div className="glass p-6 rounded-xl border border-white/10 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-4">Chat with an agent</p>
                    <button className="text-primary text-sm hover:underline">Start Chat</button>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="glass rounded-xl border border-white/10 overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="flex items-center justify-between w-full p-6 text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="font-medium text-lg">{faq.question}</span>
                            {openIndex === index ? (
                                <Minus className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <Plus className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-white/5">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
