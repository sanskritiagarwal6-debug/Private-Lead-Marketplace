"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Temporary bypass for testing
    console.log("Login bypass with:", email);
    router.push("/dashboard");
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
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Login to access the private marketplace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
              {isLoading ? "Signing in..." : "Login"}
            </Button>

            <div className="text-center mt-6">
              <a
                href="mailto:sanskritiagarwal6@gmail.com?subject=Dealer Access Request"
                className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Not a member? Request Invitation
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
