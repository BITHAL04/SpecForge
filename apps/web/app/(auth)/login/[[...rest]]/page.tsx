import { SignIn } from "@clerk/nextjs";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function LoginPage() {
  if (!clerkPublishableKey) {
    return (
      <div className="flex w-full items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white">Authentication is not configured</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your deployment environment, then redeploy.
            The login page will start working once Clerk is initialized with a production key.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/signup"
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#5E6AD2",
            colorBackground: "#09090b",
          },
          elements: {
            card: "bg-transparent border-0 shadow-none p-0 w-full",
            headerTitle: "text-2xl font-bold text-white text-center",
            headerSubtitle: "text-zinc-400 text-sm text-center",
            socialButtonsBlockButton: "border border-white/[0.08] hover:bg-white/[0.04] text-white",
            socialButtonsBlockButtonText: "text-white font-medium",
            formButtonPrimary: "bg-[#5E6AD2] hover:bg-[#5E6AD2]/90 text-white font-medium shadow-sm transition-colors",
            footerActionLink: "text-[#5E6AD2] hover:text-[#5E6AD2]/90 hover:underline",
            formFieldInput: "bg-white/[0.04] border-white/[0.08] text-white focus:border-[#5E6AD2] focus:ring-1 focus:ring-[#5E6AD2]",
            dividerLine: "bg-white/[0.08]",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-300",
          }
        }}
      />
    </div>
  );
}
