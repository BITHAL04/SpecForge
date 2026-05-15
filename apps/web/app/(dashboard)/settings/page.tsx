"use client";

import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { logout } from "@/lib/api/auth";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <>
      <DashboardHeader title="Settings" description="Manage your account" />
      <div className="max-w-2xl p-6">
        <div className="linear-surface rounded-lg p-6">
          <h2 className="mb-4 font-semibold">Account</h2>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{user?.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user?.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-medium capitalize">{user?.plan ?? "free"}</dd>
              </div>
            </dl>
          )}
          <Button variant="outline" size="sm" className="mt-6" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}
