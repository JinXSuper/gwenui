/**
 * Block: Auth Login
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client";

import React from "react";
import { LoginForm } from "./components/LoginForm";
import { OAuthButtons } from "./components/OAuthButtons";

export interface AuthLoginProps {
  onSubmit?: (values: { email: string; password: string }) => void;
  onOAuthClick?: (provider: "google" | "github") => void;
  isLoading?: boolean;
  className?: string;
}

const MeshBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[--bg] opacity-70 pointer-events-none select-none">
      <div 
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 80%)" }}
      />
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] opacity-15"
        style={{ background: "radial-gradient(circle, var(--primary-hover) 0%, transparent 80%)" }}
      />
      <div 
        className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10"
        style={{ background: "radial-gradient(circle, oklch(55% 0.15 280) 0%, transparent 80%)" }}
      />
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

const CardBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black/40 pointer-events-none select-none">
      <div 
        className="absolute top-[-20%] right-[-20%] w-[90%] h-[90%] rounded-full blur-[100px] opacity-40"
        style={{ background: "radial-gradient(circle, var(--primary-hover) 0%, transparent 85%)" }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full blur-[90px] opacity-30"
        style={{ background: "radial-gradient(circle, oklch(45% 0.12 300) 0%, transparent 85%)" }}
      />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default function AuthLogin({
  onSubmit,
  onOAuthClick,
  isLoading = false,
  className = "",
}: AuthLoginProps) {
  return (
    <div className={`relative flex min-h-svh w-screen items-center justify-center bg-[--bg] p-6 md:p-10 overflow-hidden ${className}`}>
      {/* Background Mesh */}
      <MeshBackground />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl bg-white/[2%] backdrop-blur-xl border border-white/5 rounded-[24px] overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2">
          
          {/* Left Side: Form */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center gap-2 text-center mb-6">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-sm text-white/50">
                Login to your <span className="text-[--primary] font-semibold">Gwen UI</span> account
              </p>
            </div>

            <LoginForm onSubmit={onSubmit} isLoading={isLoading} />

            <div className="relative my-5 flex items-center justify-center text-xs uppercase">
              <span className="absolute inset-x-0 h-[1px] bg-white/10" />
              <span className="relative bg-[--bg] px-2 text-white/40 z-10 font-medium">
                Or continue with
              </span>
            </div>

            <OAuthButtons onOAuthClick={onOAuthClick} isLoading={isLoading} />
            
            <div className="text-center text-xs text-white/40 mt-6">
              Don't have an account?{" "}
              <a href="#" className="text-[--primary] font-semibold hover:underline">
                Sign up
              </a>
            </div>
          </div>

          {/* Right Side: Visual banner */}
          <div className="relative hidden md:block bg-black overflow-hidden">
            <CardBackground />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center p-12 text-white">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                  Design with Gwen
                </h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                  Experience the next generation of dashboard design with GwenUI and JinXSuper.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}