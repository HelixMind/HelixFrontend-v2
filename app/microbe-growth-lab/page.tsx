"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Play, Pause, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { StrainSelector } from "@/components/strain-selector"
import { EnvironmentPanel } from "@/components/environment-panel"
import { GrowthChart } from "@/components/growth-chart"
import { StressMonitor } from "@/components/stress-monitor"
import { AdaptationLog } from "@/components/adaptation-log"

interface SimulationState {
  temperature: number
  pH: number
  nutrientDensity: number
  oxygenLevels: number
  antibioticActive: boolean
  antibioticConcentration: number
}

export default function MicrobeGrowthLab() {
  const [selectedStrain, setSelectedStrain] = useState("ecoli")
  const [isRunning, setIsRunning] = useState(false)
  const [simulationState, setSimulationState] = useState<SimulationState>({
    temperature: 37,
    pH: 7,
    nutrientDensity: 100,
    oxygenLevels: 21,
    antibioticActive: false,
    antibioticConcentration: 0,
  })
  const [timeSteps, setTimeSteps] = useState(0)
  const [populationData, setPopulationData] = useState<Array<{ time: number; population: number }>>([
    { time: 0, population: 1000 },
  ])
  const [mutations, setMutations] = useState<Array<{ time: number; fitnessBoot: number }>>([])
  const [stressLevels, setStressLevels] = useState({
    temperature: 0,
    pH: 0,
    nutrients: 0,
    oxygen: 0,
  })

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeSteps((prev) => {
        const newTime = prev + 1
        if (newTime > 100) {
          setIsRunning(false)
          return prev
        }
        return newTime
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (timeSteps === 0) return

    const strainData = {
      ecoli: { optimalTemp: 37, optimalPH: 7, baseGrowthRate: 0.5, stressSensitivity: 0.02 },
      bsubtilis: { optimalTemp: 37, optimalPH: 7.2, baseGrowthRate: 0.4, stressSensitivity: 0.015 },
      mtuberculosis: { optimalTemp: 37, optimalPH: 6.8, baseGrowthRate: 0.15, stressSensitivity: 0.08 },
    }

    const currentStrain = strainData[selectedStrain as keyof typeof strainData]
    let growthRate = currentStrain.baseGrowthRate

    // Calculate stress factors
    const tempStress = Math.abs(simulationState.temperature - currentStrain.optimalTemp) * 0.1
    const phStress = Math.abs(simulationState.pH - currentStrain.optimalPH) * 0.15
    const nutrientStress = (100 - simulationState.nutrientDensity) * 0.005
    const oxygenStress = Math.abs(simulationState.oxygenLevels - 21) * 0.01

    const totalStress = tempStress + phStress + nutrientStress + oxygenStress
    growthRate *= 1 - totalStress * currentStrain.stressSensitivity

    // Apply antibiotic effect
    let populationMultiplier = 1
    if (simulationState.antibioticActive) {
      populationMultiplier = Math.max(0.3, 1 - simulationState.antibioticConcentration * 0.008)
    }

    // Calculate new population
    const lastPopulation = populationData[populationData.length - 1].population
    const newPopulation = lastPopulation * (1 + growthRate * populationMultiplier)

    // Update population data
    setPopulationData((prev) => [...prev, { time: timeSteps, population: Math.max(0, newPopulation) }])

    // Simulate mutation detection at specific intervals
    if (timeSteps % 25 === 0 && timeSteps > 0 && Math.random() > 0.3) {
      const fitnessBoot = 1 + mutations.length * 0.15
      setMutations((prev) => [...prev, { time: timeSteps, fitnessBoot }])
    }

    // Update stress levels (0-100)
    setStressLevels({
      temperature: Math.min(100, tempStress * 15),
      pH: Math.min(100, phStress * 12),
      nutrients: Math.min(100, nutrientStress * 200),
      oxygen: Math.min(100, oxygenStress * 25),
    })
  }, [timeSteps, simulationState, selectedStrain, mutations, populationData])

  const handleReset = () => {
    setIsRunning(false)
    setTimeSteps(0)
    setPopulationData([{ time: 0, population: 1000 }])
    setMutations([])
    setStressLevels({ temperature: 0, pH: 0, nutrients: 0, oxygen: 0 })
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="Microbe Growth Lab" />

        <main className="p-8 bg-background min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Strain Selector */}
            <StrainSelector selectedStrain={selectedStrain} onStrainChange={setSelectedStrain} disabled={isRunning} />

            {/* Quick Controls */}
            <div className="lg:col-span-3 glass p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 glow-cyan">Simulation Controls</h3>
              <div className="flex gap-3 items-end">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 glow-cyan"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "Pause" : "Start"} Simulation
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-card hover:bg-card/80 text-foreground font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Time Steps</p>
                  <p className="text-2xl font-bold glow-cyan">{timeSteps}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Main Growth Chart */}
            <div className="lg:col-span-2.5">
              <GrowthChart data={populationData} antibioticActive={simulationState.antibioticActive} />
            </div>

            {/* Stress Monitor */}
            <div className="lg:col-span-1.5">
              <StressMonitor stressLevels={stressLevels} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Environment Controls */}
            <EnvironmentPanel state={simulationState} onChange={setSimulationState} disabled={isRunning} />

            {/* Adaptation Log */}
            <div className="lg:col-span-3">
              <AdaptationLog mutations={mutations} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
