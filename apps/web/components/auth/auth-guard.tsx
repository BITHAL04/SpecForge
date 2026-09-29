"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getMe, clerkAuth } from "@/lib/api/auth";
import { clearTokens, isAuthenticated } from "@/lib/auth/session";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = window.setTimeout(() => {
      if (!ready) {
        setError("Authentication is taking too long. Check the Vercel backend and Clerk env vars.");
      }
    }, 15000);

    async function syncClerkSession() {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        throw new Error("No email associated with Clerk user");
      }

      const clerkId = user.id;
      const name = user.fullName || user.username || "Clerk User";

      await clerkAuth(email, clerkId, name);
      setReady(true);
    }

    async function verify() {
      if (!isSignedIn) {
        clearTokens();
        router.replace("/login");
        return;
      }

      try {
        if (isAuthenticated()) {
          await getMe();
          setReady(true);
        } else {
          await syncClerkSession();
        }
      } catch (err) {
        console.error("Local auth bridge failed", err);

        if (isSignedIn) {
          try {
            clearTokens();
            await syncClerkSession();
            return;
          } catch (bridgeErr) {
            console.error("Clerk session re-sync failed", bridgeErr);
          }
        }

        setError("Unable to complete auth. Please try again in a moment.");
        clearTokens();
        window.setTimeout(() => router.replace("/login"), 1200);
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    verify();

    return () => window.clearTimeout(timeoutId);
  }, [isLoaded, isSignedIn, user, router, ready]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b] px-6 text-center">
        <div className="max-w-md rounded-2xl border border-[#5E6AD2]/30 bg-zinc-950/80 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8EA0FF]">Auth issue</p>
          <p className="mt-3 text-sm text-zinc-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b]">
        <Loader2 className="h-6 w-6 animate-spin text-[#5E6AD2]" />
      </div>
    );
  }

  return <>{children}</>;
}
