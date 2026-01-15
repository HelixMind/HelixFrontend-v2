"use client"

interface StressMonitorProps {
  stressLevels: {
    temperature: number
    pH: number
    nutrients: number
    oxygen: number
  }
}

interface CircularGaugeProps {
  label: string
  value: number
  icon: string
}

function CircularGauge({ label, value, icon }: CircularGaugeProps) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value < 30 ? "#00ff00" : value < 60 ? "#ffaa00" : "#ff4444"

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl">{icon}</div>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm" style={{ color }}>
          {Math.round(value)}%
        </p>
      </div>
    </div>
  )
}

export function StressMonitor({ stressLevels }: StressMonitorProps) {
  return (
    <div className="glass p-6 rounded-lg h-fit">
      <h3 className="text-lg font-semibold mb-6 ">Stress Monitor</h3>

      <div className="grid grid-cols-2 gap-4">
        <CircularGauge label="Temperature" value={stressLevels.temperature} icon="🌡️" />
        <CircularGauge label="pH Balance" value={stressLevels.pH} icon="⚖️" />
        <CircularGauge label="Nutrients" value={stressLevels.nutrients} icon="🌱" />
        <CircularGauge label="Oxygen" value={stressLevels.oxygen} icon="💨" />
      </div>

      <div className="mt-6 p-3 bg-card/50 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground text-center">
          <span className="text-green-400 font-semibold">Green</span> = Optimal |
          <span className="text-yellow-400 font-semibold"> Yellow</span> = Warning |
          <span className="text-red-400 font-semibold"> Red</span> = Critical
        </p>
      </div>
    </div>
  )
}
