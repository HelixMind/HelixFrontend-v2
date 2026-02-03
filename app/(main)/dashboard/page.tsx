"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatCard } from "@/components/stat-card"
import { DNAViewer } from "@/components/dna-viewer"
import { MutationTable } from "@/components/mutation-table"
import { AMRChart } from "@/components/amr-chart"
import { SimulationPanel } from "@/components/simulation-panel"
import { AlertCircle, Activity, Shield } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-x-8">
      <Sidebar />
      <div className="ml-16 pt-16">
        <Header title="Dashboard" />

        <main className="mx-auto max-w-7xl container pt-8 bg-background min-w-full min-h-screen space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <StatCard
              title="Total Sequences Analyzed"
              value="24,521"
              icon={<Activity />}
              trend="↑ 12% from last week"
            />
            <StatCard title="Active Simulations" value="7" icon={<Shield />} trend="2 running now" />
            <StatCard
              title="Detected AMR Threats"
              value="3"
              alert={true}
              icon={<AlertCircle />}
              trend="Critical alert"
            />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DNAViewer />
              <MutationTable />
              <AMRChart />
            </div>

            {/* <div>
               <SimulationPanel /> 
            </div> */}
          </div>
        </main>
      </div>
    </div>
  )
}
