"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GrowthChartProps {
  data: Array<{ time: number; population: number }>
  antibioticActive: boolean
}

export function GrowthChart({ data, antibioticActive }: GrowthChartProps) {
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 ">Population Growth Over Time</h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPopulation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00ff00" stopOpacity={0.1} />
            </linearGradient>
            {antibioticActive && (
              <linearGradient id="antibioticZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4444" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#ff4444" stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="#8b949e" />
          <YAxis stroke="#8b949e" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "8px",
              color: "#e0e0e0",
            }}
            formatter={(value) => [Math.round(value as number).toLocaleString(), "Population"]}
          />
          <Line
            type="monotone"
            dataKey="population"
            stroke="#00ff00"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
            fillOpacity={1}
            fill="url(#colorPopulation)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-muted-foreground">Growth Curve (Neon Green)</span>
        </div>
        {antibioticActive && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Antibiotic Pressure</span>
          </div>
        )}
      </div>
    </div>
  )
}
