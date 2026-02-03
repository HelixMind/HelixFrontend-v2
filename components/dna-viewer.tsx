"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DNA_SEQUENCE =
  "ATGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC"

export function DNAViewer() {
  const [scrollPos, setScrollPos] = useState(0)
  const chunkSize = 50

  const scroll = (direction: "left" | "right") => {
    const newPos =
      direction === "left"
        ? Math.max(0, scrollPos - chunkSize)
        : Math.min(DNA_SEQUENCE.length - chunkSize, scrollPos + chunkSize)
    setScrollPos(newPos)
  }

  const visibleSequence = DNA_SEQUENCE.slice(scrollPos, scrollPos + chunkSize)
  const highlightStart = 15
  const highlightEnd = 25

  return (
    <div className="glass p-6 rounded-lg col-span-2">
      <h3 className="text-lg font-semibold mb-4 ">DNA Sequence Viewer</h3>

      <div className="bg-black/40 border border-border rounded-lg p-6 font-mono text-sm overflow-hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => scroll("left")} className="p-1 hover:bg-card rounded transition-colors flex-shrink-0">
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 overflow-x-auto seq-scroll">
            <div className="flex gap-1 whitespace-nowrap seq-scroll">
              {visibleSequence.split("").map((base, idx) => (
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

          <button onClick={() => scroll("right")} className="p-1 hover:bg-card rounded transition-colors flex-shrink-0">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Showing position {scrollPos + 1}-{scrollPos + chunkSize} of {DNA_SEQUENCE.length}
        </p>
      </div>
    </div>
  )
}
