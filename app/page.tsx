"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestMode, setIsRequestMode] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if user is authorized
    // Note: Ideally this happens AFTER Supabase Auth/Magic Link, but for prototype we check email directly
    const { data: authorizedUser } = await supabase
      .from('authorized_users')
      .select('*')
      .eq('email', email)
      .single();

    // If we have authorized users, enforce the check. 
    // If the table is empty (initial setup), maybe let them in? Or use a hardcoded fallback.
    // For now, if no authorized user found, we BLOCK login (simulated).

    // TODO: Enforce this strictly once the first admin is added.
    // if (!authorizedUser) {
    //     alert("Access Denied. Your email is not whitelisted.");
    //     setIsLoading(false);
    //     return;
    // }

    // Temporary bypass for testing until admin adds emails
    console.log("Login with:", email);
    router.push("/dashboard");
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase
      .from('access_requests')
      .insert([{ email, status: 'pending' }]);

    setIsLoading(false);

    if (error) {
      alert("Error submitting request. Please try again.");
    } else {
      alert("Request submitted! An admin will review your access request.");
      setEmail("");
      setIsRequestMode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              {isRequestMode ? "Request Access" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isRequestMode
                ? "Enter your email to join the private marketplace"
                : "Login to access the private marketplace"
              }
            </p>
          </div>

          <form onSubmit={isRequestMode ? handleRequestAccess : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 focus:border-primary/50 text-white h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
              variant="gold"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (isRequestMode ? "Submit Request" : "Login")}
            </Button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsRequestMode(!isRequestMode);
                  setEmail("");
                }}
                className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
              >
                {isRequestMode
                  ? "Already have an account? Login"
                  : "Not a member? Request Invitation"
                }
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
