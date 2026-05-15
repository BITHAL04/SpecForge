import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-[#09090b]">
      {/* Left side: Hero Column (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/[0.08] p-12 md:flex bg-zinc-950">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35" 
          style={{ backgroundImage: "url('/auth_bg.png')" }} 
        />
        {/* Abstract dark gradients to blend it perfectly */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-zinc-950/80" />
        
        {/* Logo and Brand */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-white tracking-tight">
            <Sparkles className="h-5 w-5 text-[#5E6AD2]" />
            <span>SpecForge</span>
          </Link>
        </div>

        {/* Taglines and Highlights */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Enterprise blueprints <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-[#5E6AD2] bg-clip-text text-transparent">
              designed instantly.
            </span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Generate detailed system architectures, Entity-Relationship database diagrams, API specifications, and testing strategies from simple project definitions.
          </p>
          
          <ul className="space-y-3 pt-4 text-sm text-zinc-300">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#5E6AD2]" />
              <span>10 Fully Generated Engineering Artifacts</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#5E6AD2]" />
              <span>Real-Time Streaming Generation State Graph</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#5E6AD2]" />
              <span>ZIP Export & Mermaid Rendering Compatibility</span>
            </li>
          </ul>
        </div>

        {/* Footer/Subtext */}
        <div className="relative z-10 text-[11px] text-zinc-500">
          © {new Date().getFullYear()} SpecForge. All rights reserved.
        </div>
      </div>

      {/* Right side: Interactive Form Container */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 md:p-12">
        {/* Background Image with Overlay for Right Side */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-luminosity pointer-events-none" 
          style={{ backgroundImage: "url('/auth_bg.png')" }} 
        />
        {/* Background Radial Light Source for Right Side */}
        <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-[#5E6AD2]/5 blur-[100px] pointer-events-none" />
        
        {/* Center Card */}
        <div className="relative w-full max-w-md">
          {/* Subtle mobile branding */}
          <div className="md:hidden flex flex-col items-center gap-2 mb-8">
            <div className="flex items-center gap-2 text-base font-semibold text-white">
              <Sparkles className="h-5 w-5 text-[#5E6AD2]" />
              <span>SpecForge</span>
            </div>
            <p className="text-xs text-zinc-500">Enterprise blueprinting platform</p>
          </div>

          {/* Form Content glass wrapping */}
          <div className="glass linear-glow rounded-xl p-8 md:p-10 border border-white/[0.08] bg-zinc-900/40">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
