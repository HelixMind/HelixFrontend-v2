"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const AMR_DATA = [
  { antibiotic: "Fluoroquinolones", resistance: 65 },
  { antibiotic: "Carbapenems", resistance: 45 },
  { antibiotic: "Cephalosporins", resistance: 72 },
  { antibiotic: "Beta-lactams", resistance: 58 },
  { antibiotic: "Aminoglycosides", resistance: 38 },
  { antibiotic: "Tetracyclines", resistance: 52 },
]

export function AMRChart() {
  return (
    <div className="glass p-6 rounded-lg col-span-2">
      <h3 className="text-lg font-semibold mb-4 ">AMR Prediction - Resistance Levels (%)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={AMR_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="antibiotic" stroke="#8b949e" style={{ fontSize: "12px" }} />
          <YAxis stroke="#8b949e" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "8px",
              color: "#e0e0e0",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="resistance" fill="#f4f4f4" radius={[8, 8, 0, 0]}>
            {AMR_DATA.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.resistance > 65 ? "#f4f4f4" : entry.resistance > 50 ? "#f4f4f4" : "#f4f4f4"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
