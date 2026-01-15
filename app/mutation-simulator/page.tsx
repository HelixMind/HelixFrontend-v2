"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Play, Pause, RotateCcw } from "lucide-react"
import { useState } from "react"

export default function MutationSimulator() {
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="Mutation Simulator" />

        <main className="p-8 bg-background min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass p-8 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-6 ">Simulation Visualization</h3>

                <div className="bg-black/40 rounded-lg p-8 min-h-96 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 border-2 border-primary/50 rounded-full animate-spin" />
                    <p className="text-primary font-semibold ">
                      {isRunning ? "Simulation Running..." : "Ready to simulate"}
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">Configure parameters and click start to begin</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 ">Generation Progress</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((gen) => (
                    <div key={gen} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-12">Gen {gen}:</span>
                      <div className="flex-1 bg-card rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="glass p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Simulation Parameters</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Starting Sequence Length</label>
                    <input
                      type="number"
                      defaultValue="500"
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Number of Generations</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Mutation Rate</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      defaultValue="0.1"
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? "Pause" : "Start"}
                  </button>
                  <button className="flex-1 bg-card hover:bg-card/80 text-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-primary">Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Mutations:</span>
                    <span className="text-primary font-semibold">487</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Substitutions:</span>
                    <span className="text-gray-400 font-semibold">392</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insertions:</span>
                    <span className="text-gray-400 font-semibold">95</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
