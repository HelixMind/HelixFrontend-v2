"use client"

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
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High Risk":
        return "text-destructive bg-destructive/10"
      case "Neutral":
        return "text-primary bg-primary/10"
      case "Low Risk":
        return "text-green-400 bg-green-400/10"
      default:
        return ""
    }
  }

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 glow-cyan">Mutation Log</h3>

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
              <tr key={idx} className="border-b border-border/30 hover:bg-card/50 transition-colors">
                <td className="py-3 px-4 font-mono text-primary">{mutation.generation}</td>
                <td className="py-3 px-4 font-mono text-foreground">{mutation.position}</td>
                <td className="py-3 px-4 font-mono text-secondary">{mutation.change}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(mutation.impact)}`}>
                    {mutation.impact}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
