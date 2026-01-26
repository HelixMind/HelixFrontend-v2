"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Play, Pause, RotateCcw, Upload } from "lucide-react";
import { useState } from "react";
import { simulate_mutation } from "@/api/simulation";

export default function MutationSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [queryFastaFile, setQueryFastaFile] = useState<File | null>(null);
  const [params, setParams] = useState<{
    tempUnit: "C" | "F",
    temperature: number,
    substitutionRate: number,
    numGenerations: number
  }>({
    tempUnit: "C",
    temperature: 0,
    substitutionRate: 0,
    numGenerations: 1
  });

  // Handle FASTA upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setQueryFastaFile(file);
  };

  // Prevent starting without file
  const handleStart = async () => {
    if (!queryFastaFile) {
      alert("Please upload a FASTA file before starting the simulation.");
      return;
    }

    setIsRunning(!isRunning);

    console.log(params);
    await simulate_mutation(queryFastaFile, params);
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="Mutation Simulator" />

        <main className="w-full! p-8 bg-background min-h-screen">
          {/* Upload */}
          <div className="glass p-12 rounded-lg border-2 border-dashed border-primary/50 text-center mb-10">
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">
              Upload Query Sequence
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Drop your FASTA file here, or click to browse
            </p>

            <label
              htmlFor="query_fasta"
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors cursor-pointer inline-block"
            >
              Browse Files
              <input
                type="file"
                accept=".fasta,.fa,.fna,.ffn,.faa,.frn"
                id="query_fasta"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Display selected file name */}
            {queryFastaFile && (
              <p className="mt-4 text-sm text-primary font-medium">
                {queryFastaFile.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2">
              <div className="glass p-8 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-6">
                  Simulation Visualization
                </h3>

                <div className="bg-black/40 rounded-lg p-8 min-h-96 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div
                      className={`w-32 h-32 mx-auto mb-4 border-2 border-primary/50 rounded-full ${isRunning ? "animate-spin" : ""
                        }`}
                    />
                    <p className="text-primary font-semibold">
                      {isRunning
                        ? "Simulation Running..."
                        : "Ready to simulate"}
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Upload a sequence and click start
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Statistics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Mutations:
                    </span>
                    <span className="text-primary font-semibold">487</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Substitutions:
                    </span>
                    <span className="text-primary font-semibold">392</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insertions:</span>
                    <span className="text-primary font-semibold">95</span>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Generation Progress
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((gen) => (
                    <div key={gen} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-12">
                        Gen {gen}:
                      </span>
                      <div className="flex-1 bg-card rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-500"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="glass p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Simulation Parameters
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Temperature */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Temperature
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={params.temperature}
                        onChange={(e) => { setParams(prev => ({ ...prev, temperature: parseFloat(e.target.value) })) }}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                      <select value={params.tempUnit} onChange={(e) => { setParams((prev) => ({ ...prev, tempUnit: e.target.value as "C" | "F" })) }} className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
                        <option value={"C"}>°C</option>
                        <option value={"F"}>°F</option>
                      </select>
                    </div>
                  </div>

                  {/* pH */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      pH Balance
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="14"
                      step="0.1"
                      defaultValue="7"
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 (Acidic)</span>
                      <span>7 (Neutral)</span>
                      <span>14 (Alkaline)</span>
                    </div>
                  </div>

                  {/* Nutrients */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Nutrient Availability
                    </label>
                    <select className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Excess</option>
                    </select>
                  </div>

                  {/* Oxygen */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Oxygen Level
                    </label>
                    <select className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm">
                      <option>Anaerobic (None)</option>
                      <option>Low</option>
                      <option>Normal (21%)</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Generations */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Number of Generations
                    </label>
                    <input
                      type="number"
                      value={params.numGenerations}
                      onChange={(e) => {
                        const nG = parseInt(e.target.value);
                        if (nG > 10) {
                          setParams(prev => ({ ...prev, numGenerations: 10 }))
                        } else if (nG < 1) {
                          setParams(prev => ({ ...prev, numGenerations: 1 }))
                        } else {
                          setParams(prev => ({ ...prev, numGenerations: nG }))
                        }
                      }}
                      max={10}
                      min={1}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Base mutation rate */}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">
                      Base Mutation Rate
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={params.substitutionRate}
                      className="w-full accent-primary"
                      onChange={(e) => {
                        setParams((prev) => ({ ...prev, substitutionRate: parseFloat(e.target.value) }))
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleStart}
                    className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isRunning ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isRunning ? "Pause" : "Start"}
                  </button>

                  <button
                    onClick={() => setIsRunning(false)}
                    className="flex-1 bg-card hover:bg-card/80 text-foreground font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
