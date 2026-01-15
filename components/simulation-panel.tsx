"use client"

import { useState } from "react"

export function SimulationPanel() {
  const [substitutionRate, setSubstitutionRate] = useState(0.3)
  const [insertionRate, setInsertionRate] = useState(0.15)
  const [generations, setGenerations] = useState(5)

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-6 ">Simulation Controls</h3>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-muted-foreground block mb-3">
            Substitution Rate:{" "}
            <span className="text-primary font-semibold">{(substitutionRate * 100).toFixed(1)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={substitutionRate}
            onChange={(e) => setSubstitutionRate(Number.parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-3">
            Insertion Rate: <span className="text-secondary font-semibold">{(insertionRate * 100).toFixed(1)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={insertionRate}
            onChange={(e) => setInsertionRate(Number.parseFloat(e.target.value))}
            className="w-full accent-secondary"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-3">
            Generations: <span className="text-accent font-semibold">{generations}</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={generations}
            onChange={(e) => setGenerations(Number.parseInt(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        <button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 rounded-lg transition-colors mt-6 ">
          Run Simulation
        </button>
      </div>
    </div>
  )
}
