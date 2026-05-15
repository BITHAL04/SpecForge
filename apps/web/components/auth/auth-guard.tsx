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

  useEffect(() => {
    if (!isLoaded) return;

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
          const email = user?.primaryEmailAddress?.emailAddress;
          if (!email) {
            throw new Error("No email associated with Clerk user");
          }
          const clerkId = user.id;
          const name = user.fullName || user.username || "Clerk User";

          await clerkAuth(email, clerkId, name);
          setReady(true);
        }
      } catch (err) {
        console.error("Local auth bridge failed", err);
        clearTokens();
        router.replace("/login");
      }
    }
    verify();
  }, [isLoaded, isSignedIn, user, router]);


  if (!isLoaded || !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b]">
        <Loader2 className="h-6 w-6 animate-spin text-[#5E6AD2]" />
      </div>
    );
  }

  return <>{children}</>;
}
