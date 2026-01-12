"use client"

import { AlertCircle } from "lucide-react"

interface Mutation {
  time: number
  fitnessBoot: number
}

interface AdaptationLogProps {
  mutations: Mutation[]
}

export function AdaptationLog({ mutations }: AdaptationLogProps) {
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 glow-green">Adaptation Log</h3>

      <div className="bg-black/40 rounded-lg max-h-96 overflow-y-auto">
        {mutations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground text-sm">
              No mutations detected yet. Start simulation to observe adaptation.
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {[...mutations].reverse().map((mutation, idx) => (
              <div
                key={idx}
                className="animate-pulse-alert bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-400 text-sm">Mutation Detected!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Time Step: <span className="text-primary font-mono">{mutation.time}</span>
                  </p>
                  <div className="mt-2 bg-card/50 rounded px-3 py-2">
                    <p className="text-xs text-muted-foreground">Fitness Boost Multiplier</p>
                    <p className="font-semibold text-green-400">{mutation.fitnessBoot.toFixed(2)}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
