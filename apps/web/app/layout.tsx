import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpecForge — Enterprise Engineering Blueprints",
  description: "Transform product ideas into complete software engineering specifications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans h-full antialiased bg-background text-foreground`}>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
