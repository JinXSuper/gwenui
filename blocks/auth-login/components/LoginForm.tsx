/**
 * Block: Auth Login
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit?: (values: { email: string; password: string }) => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-semibold text-white/70">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="jinxsuper@yourdomain.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[--primary]/50 focus:ring-1 focus:ring-[--primary]/50 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-semibold text-white/70">
            Password
          </label>
          <a
            href="#"
            className="text-[11px] text-[--primary] hover:underline underline-offset-4 transition-all"
          >
            Forgot your password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[--primary]/50 focus:ring-1 focus:ring-[--primary]/50 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 mt-2 bg-[--primary] hover:bg-[--primary-hover] text-[--bg] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-[--bg]" />
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};
