"use client"

import { Badge } from "@/components/ui/badge"

export interface Mutation {
  generation: number
  position: number
  change: string
  impact: "High Risk" | "Neutral" | "Low Risk"
}

const SAMPLE_MUTATIONS: Mutation[] = [
  { generation: 1, position: 42, change: "A→T", impact: "High Risk" },
  { generation: 2, position: 156, change: "G→C", impact: "Neutral" },
  { generation: 3, position: 89, change: "C→G", impact: "Low Risk" },
  { generation: 4, position: 203, change: "T→A", impact: "High Risk" },
  { generation: 5, position: 127, change: "A→G", impact: "Neutral" },
]

export function MutationTable() {
  const getImpactVariant = (impact: Mutation["impact"]) => {
    switch (impact) {
      case "High Risk":
        return "fail"
      case "Neutral":
        return "neutral"
      case "Low Risk":
        return "success"
      default:
        return "default"
    }
  }

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Mutation Log</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Generation</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Position</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Change</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Impact</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_MUTATIONS.map((mutation, idx) => (
              <tr
                key={idx}
                className="border-b border-border/30 hover:bg-card/50 transition-colors"
              >
                <td className="py-3 px-4 font-mono text-primary">
                  {mutation.generation}
                </td>
                <td className="py-3 px-4 font-mono text-foreground">
                  {mutation.position}
                </td>
                <td className="py-3 px-4 font-mono text-secondary">
                  {mutation.change}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={getImpactVariant(mutation.impact)}>
                    {mutation.impact}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
