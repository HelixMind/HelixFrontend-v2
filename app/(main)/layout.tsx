"use client"
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// icons
import { SettingsIcon } from "lucide-react"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate.push("/signin");
    }
  }, [isLoading]);

  if (!isLoading && user) {
    return (
      <div className="mx-auto container min-h-svh max-w-8xl w-full mb-4">
        {children}
        
        <Toaster />
      </div>
    );
  } else if(isLoading || !user) {
    return (
      <div className="min-h-svh flex items-center justify-center gap-2">
        <SettingsIcon className="animate-spin duration-200 transition-all ease-linear size-6" />
        Building Digital Laboratory...
        </div>
    )
  }
}
