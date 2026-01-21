"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Skip check on login page
        if (pathname === "/") {
            setAuthorized(true);
            return;
        }

        const checkAuth = async () => {
            const email = localStorage.getItem('user_email');

            if (!email) {
                // No session, kick out
                router.push("/");
                return;
            }

            // Verify against whitelist
            const { data } = await supabase
                .from('authorized_users')
                .select('*')
                .eq('email', email)
                .single();

            if (!data) {
                // Not in whitelist (kicked out or never allowed), remove session
                localStorage.removeItem('user_email');
                alert("Session expired or access revoked.");
                router.push("/");
            } else {
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Show nothing while checking (or a loading spinner) to prevent flash of content
    if (!authorized && pathname !== "/") return <div className="min-h-screen bg-black" />;

    return <>{children}</>;
}
