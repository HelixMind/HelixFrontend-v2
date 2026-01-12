"use client"

import { useState } from "react"
import { Pipette } from "lucide-react"

interface Strain {
  id: string
  name: string
  scientific: string
  optimalTemp: number
  optimalPH: number
  baseGrowthRate: number
  description: string
}

const STRAINS: Strain[] = [
  {
    id: "ecoli",
    name: "E. coli",
    scientific: "Escherichia coli",
    optimalTemp: 37,
    optimalPH: 7,
    baseGrowthRate: 0.5,
    description: "Fast-growing, commonly studied in labs",
  },
  {
    id: "bsubtilis",
    name: "B. subtilis",
    scientific: "Bacillus subtilis",
    optimalTemp: 37,
    optimalPH: 7.2,
    baseGrowthRate: 0.4,
    description: "Spore-forming, stress tolerant",
  },
  {
    id: "mtuberculosis",
    name: "M. tuberculosis",
    scientific: "Mycobacterium tuberculosis",
    optimalTemp: 37,
    optimalPH: 6.8,
    baseGrowthRate: 0.15,
    description: "Slow-growing, requires optimal conditions",
  },
]

interface StrainSelectorProps {
  selectedStrain: string
  onStrainChange: (strainId: string) => void
  disabled: boolean
}

export function StrainSelector({ selectedStrain, onStrainChange, disabled }: StrainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentStrain = STRAINS.find((s) => s.id === selectedStrain)

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 glow-cyan flex items-center gap-2">
        <Pipette className="w-5 h-5" />
        Select Strain
      </h3>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-left text-sm font-semibold hover:bg-card/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary">{currentStrain?.name}</p>
              <p className="text-xs text-muted-foreground">{currentStrain?.scientific}</p>
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg overflow-hidden z-50">
            {STRAINS.map((strain) => (
              <button
                key={strain.id}
                onClick={() => {
                  onStrainChange(strain.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 transition-colors border-b border-border/30 last:border-b-0 ${
                  selectedStrain === strain.id ? "bg-primary/20 border-l-2 border-l-primary" : "hover:bg-card/80"
                }`}
              >
                <p className="font-semibold text-sm">{strain.name}</p>
                <p className="text-xs text-muted-foreground">{strain.scientific}</p>
                <p className="text-xs text-primary mt-1">
                  Optimal: {strain.optimalTemp}°C, pH {strain.optimalPH}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {currentStrain && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
          <p className="text-xs text-primary">{currentStrain.description}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div>
              <span className="text-muted-foreground">Growth Rate:</span>
              <p className="font-semibold text-primary">{(currentStrain.baseGrowthRate * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Temp Range:</span>
              <p className="font-semibold text-secondary">{currentStrain.optimalTemp}°C</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
