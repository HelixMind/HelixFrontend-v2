"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface AMRRecord {
  id: string;
  gene: string;
  antibiotic: string;
  drugClass: string;
  mechanism: string;
  organism: string;
  impact: number;
}

const AMR_RECORDS: AMRRecord[] = [
  {
    id: "AMR001",
    gene: "blaCTX-M",
    antibiotic: "Cephalosporins",
    drugClass: "Beta-lactams",
    mechanism: "Beta-lactamase",
    organism: "E. coli",
    impact: 12.5,
  },
  {
    id: "AMR002",
    gene: "gyrA",
    antibiotic: "Fluoroquinolones",
    drugClass: "Quinolones",
    mechanism: "DNA gyrase mutation",
    organism: "Salmonella",
    impact: 8.4,
  },
  {
    id: "AMR003",
    gene: "rpoB",
    antibiotic: "Rifamycins",
    drugClass: "RNA polymerase inhibitors",
    mechanism: "RNA polymerase mutation",
    organism: "M. tuberculosis",
    impact: 1.56,
  },
  {
    id: "AMR004",
    gene: "mecA",
    antibiotic: "Oxacillin",
    drugClass: "Beta-lactams",
    mechanism: "Penicillin-binding protein",
    organism: "S. aureus",
    impact: 9.23,
  },
  {
    id: "AMR005",
    gene: "erm(B)",
    antibiotic: "Macrolides",
    drugClass: "Protein synthesis inhibitors",
    mechanism: "rRNA methylation",
    organism: "S. pneumoniae",
    impact: 6.78,
  },
];

export default function GeneDatabase() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = AMR_RECORDS.filter(
    (record) =>
      record.gene.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.antibiotic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.organism.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" ml-16">
      <main className="space-y-6 bg-background min-h-screen">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["Total Genes", "2,847"],
            ["Organisms", "456"],
            ["Drug Class", "128"],
            ["Last Updated", "2024-01-12"],
          ].map(([title, value]) => (
            <div key={title} className="glass p-4 sm:p-6 rounded-lg text-center">
              <p className="text-muted-foreground text-xs sm:text-sm mb-1">
                {title}
              </p>
              <p className="text-xl sm:text-3xl font-bold text-primary">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Content */}
        <div className="glass p-4 sm:p-6 rounded-lg w-full">

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search genes, antibiotics, organisms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* ---------- DESKTOP TABLE ---------- */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID","Gene","Antibiotic","Drug Class","Mechanism","Organism","Impact (%)"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border/30 hover:bg-card/50 transition">
                    <td className="py-3 px-4 font-mono text-primary">{record.id}</td>
                    <td className="py-3 px-4 font-semibold">{record.gene}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-accent/20 text-primary">
                        {record.antibiotic}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{record.drugClass}</td>
                    <td className="py-3 px-4 text-muted-foreground">{record.mechanism}</td>
                    <td className="py-3 px-4">{record.organism}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{record.impact}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------- MOBILE CARDS ---------- */}
          <div className="grid gap-4 lg:hidden">
            {filteredRecords.map((r) => (
              <div key={r.id} className="rounded-lg border border-border p-4 space-y-2 bg-card">
                <div className="flex justify-between items-center">
                  <p className="font-mono text-primary text-sm">{r.id}</p>
                  <p className="font-semibold text-primary">{r.impact}%</p>
                </div>

                <p className="font-semibold text-lg">{r.gene}</p>

                <span className="inline-block px-3 py-1 rounded-full text-xs bg-accent/20 text-primary">
                  {r.antibiotic}
                </span>

                <div className="text-sm text-muted-foreground space-y-1 pt-2">
                  <p><b>Organism:</b> {r.organism}</p>
                  <p><b>Drug class:</b> {r.drugClass}</p>
                  <p><b>Mechanism:</b> {r.mechanism}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No records found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
