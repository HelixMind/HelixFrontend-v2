"use client"

import { Thermometer, Droplets, Leaf, Wind, Syringe } from "lucide-react"

interface EnvironmentPanelProps {
  state: {
    temperature: number
    pH: number
    nutrientDensity: number
    oxygenLevels: number
    antibioticActive: boolean
    antibioticConcentration: number
  }
  onChange: (state: any) => void
  disabled: boolean
}

export function EnvironmentPanel({ state, onChange, disabled }: EnvironmentPanelProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...state, [key]: value })
  }

  return (
    <div className="glass p-6 rounded-lg h-fit">
      <h3 className="text-lg font-semibold mb-6 ">Environment Control</h3>

      <div className="space-y-5">
        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Temperature
            </label>
            <span className="text-sm font-semibold text-primary">{state.temperature}°C</span>
          </div>
          <input
            type="range"
            min="20"
            max="50"
            step="0.5"
            value={state.temperature}
            onChange={(e) => handleChange("temperature", Number.parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full accent-primary disabled:opacity-50"
          />
        </div>

        {/* pH */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              pH Level
            </label>
            <span className="text-sm font-semibold text-secondary">{state.pH.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="4"
            max="10"
            step="0.1"
            value={state.pH}
            onChange={(e) => handleChange("pH", Number.parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full accent-secondary disabled:opacity-50"
          />
        </div>

        {/* Nutrient Density */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Nutrient Density
            </label>
            <span className="text-sm font-semibold text-accent">{state.nutrientDensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={state.nutrientDensity}
            onChange={(e) => handleChange("nutrientDensity", Number.parseInt(e.target.value))}
            disabled={disabled}
            className="w-full accent-accent disabled:opacity-50"
          />
        </div>

        {/* Oxygen Levels */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Oxygen Level
            </label>
            <span className="text-sm font-semibold text-cyan-400">{state.oxygenLevels}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="21"
            step="1"
            value={state.oxygenLevels}
            onChange={(e) => handleChange("oxygenLevels", Number.parseInt(e.target.value))}
            disabled={disabled}
            className="w-full accent-cyan-400 disabled:opacity-50"
          />
        </div>

        {/* Antibiotic Toggle */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Syringe className="w-4 h-4" />
              Antibiotic Pressure
            </label>
            <input
              type="checkbox"
              checked={state.antibioticActive}
              onChange={(e) => handleChange("antibioticActive", e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded cursor-pointer disabled:opacity-50"
            />
          </div>

          {state.antibioticActive && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-red-400">Concentration</span>
                <span className="text-xs font-semibold text-red-400">
                  {(state.antibioticConcentration * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.antibioticConcentration}
                onChange={(e) => handleChange("antibioticConcentration", Number.parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full accent-red-500 disabled:opacity-50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
