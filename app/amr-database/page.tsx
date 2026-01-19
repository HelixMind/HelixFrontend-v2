"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Search } from "lucide-react"
import { useState } from "react"

interface AMRRecord {
  id: string
  gene: string
  antibiotic: string
  mechanism: string
  organism: string
  found: number
}

const AMR_RECORDS: AMRRecord[] = [
  {
    id: "AMR001",
    gene: "blaCTX-M",
    antibiotic: "Cephalosporins",
    mechanism: "Beta-lactamase",
    organism: "E. coli",
    found: 1250,
  },
  {
    id: "AMR002",
    gene: "gyrA",
    antibiotic: "Fluoroquinolones",
    mechanism: "DNA gyrase mutation",
    organism: "Salmonella",
    found: 842,
  },
  {
    id: "AMR003",
    gene: "rpoB",
    antibiotic: "Rifamycins",
    mechanism: "RNA polymerase mutation",
    organism: "M. tuberculosis",
    found: 156,
  },
  {
    id: "AMR004",
    gene: "mecA",
    antibiotic: "Beta-lactams",
    mechanism: "Penicillin-binding protein",
    organism: "S. aureus",
    found: 923,
  },
  {
    id: "AMR005",
    gene: "erm(B)",
    antibiotic: "Macrolides",
    mechanism: "rRNA methylation",
    organism: "S. pneumoniae",
    found: 678,
  },
]

export default function AMRDatabase() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRecords = AMR_RECORDS.filter(
    (record) =>
      record.gene.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.antibiotic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.organism.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="AMR Database" />

        <main className="p-8 bg-background min-h-screen">
          <div className="glass p-6 rounded-lg mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search genes, antibiotics, organisms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div className="max-w-lg lg:max-w-7xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Gene</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Antibiotic</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Mechanism</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Organism</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Found In</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border/30 hover:bg-card/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono text-primary">{record.id}</td>
                      <td className="py-3 px-4 font-semibold">{record.gene}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-accent/20 text-primary">
                          {record.antibiotic}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{record.mechanism}</td>
                      <td className="py-3 px-4">{record.organism}</td>
                      <td className="py-3 px-4 font-semibold text-primary">{record.found.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No records found matching your search.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-6 rounded-lg text-center">
              <p className="text-muted-foreground text-sm mb-2">Total Genes</p>
              <p className="text-3xl font-bold ">2,847</p>
            </div>
            <div className="glass p-6 rounded-lg text-center">
              <p className="text-muted-foreground text-sm mb-2">Organisms</p>
              <p className="text-3xl font-bold ">456</p>
            </div>
            <div className="glass p-6 rounded-lg text-center">
              <p className="text-muted-foreground text-sm mb-2">Antibiotics Covered</p>
              <p className="text-3xl font-bold text-primary">128</p>
            </div>
            <div className="glass p-6 rounded-lg text-center">
              <p className="text-muted-foreground text-sm mb-2">Last Updated</p>
              <p className="text-sm font-mono text-primary">2024-01-12</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
