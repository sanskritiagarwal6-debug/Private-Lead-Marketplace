import Link from "next/link";
import { ArrowLeft, BadgeCheck } from "lucide-react";

export default function DealerVerification() {
    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-primary mb-6">
                <BadgeCheck className="w-8 h-8" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Dealer Verification</h1>
            <p className="text-muted-foreground mb-8 text-lg">
                Ensuring trust and authenticity in every transaction.
            </p>

            <div className="glass p-8 rounded-xl text-left space-y-4 mb-8 w-full">
                <p className="text-white/80">
                    This is a placeholder for the Dealer Verification process info. LuxeMarket requires all dealers to undergo a strict vetting process.
                </p>
                <p className="text-white/80">
                    Verification steps typically include:
                </p>
                <ul className="list-disc list-inside text-white/60 space-y-2">
                    <li>Business License Verification</li>
                    <li>Financial Standing Check</li>
                    <li>Reputation Assessment</li>
                    <li>Physical Showroom Verification</li>
                </ul>
            </div>

            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>
        </div>
    );
}
