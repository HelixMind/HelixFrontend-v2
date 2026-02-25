"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
// lib
import { cn } from "@/lib/utils"

const DNA_SEQUENCE =
  "ATGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC"

export function DNAViewer() {
  const [copied, setCopied] = useState(false)
  const highlightStart = 15
  const highlightEnd = 25

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(DNA_SEQUENCE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className={cn("glass w-full p-6 rounded-lg col-span-2")}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">DNA Sequence Viewer</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-black/40 border border-border rounded-lg p-6 font-mono text-sm">
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <div className="flex flex-wrap gap-1">
            {DNA_SEQUENCE.split("").map((base, idx) => (
              <span
                key={idx}
                className={`${
                  idx >= highlightStart && idx < highlightEnd
                    ? "text-primary font-bold drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]"
                    : "text-foreground"
                }`}
              >
                {base}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Total length: {DNA_SEQUENCE.length} base pairs
        </p>
      </div>
    </div>
  )
}