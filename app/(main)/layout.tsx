"use client"
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
      <div className="min-h-screen container mx-auto max-w-7xl min-w-full flex items-center justify-start bg-background">
        {children}
        
        <Toaster />
      </div>
    );
  } else if(isLoading || !user) {
    return (
      <div>Loading...</div>
    )
  }
}
