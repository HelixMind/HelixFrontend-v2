"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Upload, FileText } from "lucide-react"

export default function DNAScanner() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="DNA Scanner" />

        <main className="p-8 bg-background min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="glass p-12 rounded-lg border-2 border-dashed border-primary/50 text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 glow-cyan">Upload DNA Sequence</h3>
                <p className="text-muted-foreground mb-6">Drop your FASTA or GenBank files here, or click to browse</p>
                <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors">
                  Browse Files
                </button>
              </div>

              <div className="glass p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold mb-4 glow-cyan">Recent Scans</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-card/50 rounded-lg hover:bg-card transition-colors cursor-pointer"
                    >
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">sample_dna_{i}.fasta</p>
                        <p className="text-sm text-muted-foreground">Scanned 2 hours ago</p>
                      </div>
                      <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 glow-purple">Scanner Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Analysis Type</label>
                    <select className="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary">
                      <option>Full Analysis</option>
                      <option>Quick Scan</option>
                      <option>AMR Detection</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Reference Genome</label>
                    <select className="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary">
                      <option>Human GRCh38</option>
                      <option>E. Coli K-12</option>
                      <option>Yeast S288C</option>
                    </select>
                  </div>

                  <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2 rounded-lg transition-colors mt-6">
                    Advanced Options
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
