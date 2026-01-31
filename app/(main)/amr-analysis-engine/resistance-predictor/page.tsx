"use client";

import { useState } from "react";
import {
  Info,
  DownloadIcon,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  Search,
} from "lucide-react";

// shadcn toast
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// ------------------------
// Types
// ------------------------
interface AMRDatabaseEntry {
  antibiotic: string;
  drugClass: string;
  organism: string;
  impact: number;
  mechanism: string;
}

interface ResistanceProfileItem {
  antibiotic: string;
  confidence: {
    level: "High" | "Medium" | "Low";
    score: number;
  };
  genes: string[];
  mechanisms: string[];
  isSynergistic: boolean;
}

interface AnalysisResults {
  organism: string;
  analysisTime: string;
  resistanceProfile: ResistanceProfileItem[];
  selectedGenes: string[];
}

interface SynergyRule {
  genesRequired: string[];
  result: {
    drugClass: string;
    boostedImpact: number;
    note: string;
  };
}

// ------------------------
// Data
// ------------------------
const amrDatabase: Record<string, AMRDatabaseEntry> = {
  "blaCTX-M": { antibiotic: "Ceftriaxone", drugClass: "Cephalosporins", organism: "E. coli", impact: 0.95, mechanism: "Extended-spectrum beta-lactamase (ESBL)" },
  "blaOXA-48": { antibiotic: "Meropenem", drugClass: "Carbapenems", organism: "K. pneumoniae", impact: 0.98, mechanism: "Carbapenemase enzymatic hydrolysis" },
  mecA: { antibiotic: "Oxacillin", drugClass: "Beta-lactams", organism: "S. aureus", impact: 0.99, mechanism: "Alternative Penicillin-Binding Protein (PBP2a)" },
  vanA: { antibiotic: "Vancomycin", drugClass: "Glycopeptides", organism: "Enterococcus faecium", impact: 0.99, mechanism: "Cell wall precursor remodeling" },
  gyrA: { antibiotic: "Ciprofloxacin", drugClass: "Fluoroquinolones", organism: "Salmonella", impact: 0.4, mechanism: "DNA Gyrase mutation" },
  parC: { antibiotic: "Ciprofloxacin", drugClass: "Fluoroquinolones", organism: "Salmonella", impact: 0.4, mechanism: "Topoisomerase IV mutation" },
  tetM: { antibiotic: "Tetracycline", drugClass: "Tetracyclines", organism: "General", impact: 0.7, mechanism: "Ribosomal protection protein" },
};

const organisms = [...new Set(Object.values(amrDatabase).map((r) => r.organism))].sort();
const allGenes = Object.keys(amrDatabase).sort();

const synergyRules: SynergyRule[] = [
  { genesRequired: ["gyrA", "parC"], result: { drugClass: "Fluoroquinolones", boostedImpact: 0.9, note: "Dual mutations confer high-level resistance" } },
];

// ------------------------
// Helpers
// ------------------------
const getConfidenceColor = (score: number) =>
  score >= 0.9 ? "bg-red-900/40 border-red-700" : score >= 0.7 ? "bg-yellow-900/40 border-yellow-700" : "bg-orange-900/40 border-orange-700";

const getConfidenceBadgeColor = (score: number) =>
  score >= 0.9 ? "bg-red-700 text-red-100" : score >= 0.7 ? "bg-yellow-700 text-yellow-100" : "bg-orange-700 text-orange-100";

const getConfidenceLabel = (score: number): "High" | "Medium" | "Low" =>
  score >= 0.9 ? "High" : score >= 0.7 ? "Medium" : "Low";

// ------------------------
// Component
// ------------------------
export default function ResistancePredictor() {
  const [selectedOrganism, setSelectedOrganism] = useState("");
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [expandedAntibiotics, setExpandedAntibiotics] = useState<Set<string>>(new Set());
  const [copiedAntibiotic, setCopiedAntibiotic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleExpanded = (antibiotic: string) => {
    setExpandedAntibiotics((prev) => {
      const copy = new Set(prev);
      copy.has(antibiotic) ? copy.delete(antibiotic) : copy.add(antibiotic);
      return copy;
    });
  };

  const copyGenesToClipboard = (antibiotic: string, genes: string[]) => {
    navigator.clipboard.writeText(genes.join(", "));
    setCopiedAntibiotic(antibiotic);
    toast({ title: "Copied to clipboard!", description: `Genes for ${antibiotic} copied.` });
    setTimeout(() => setCopiedAntibiotic(null), 2000);
  };

  const analyzeResistance = () => {
    if (!selectedOrganism || selectedGenes.length === 0) {
      setError("Please select an organism and at least one gene");
      return;
    }

    setLoading(true);
    setError("");

    const report: Record<string, { class: string; maxImpact: number; detectedMarkers: string[]; mechanisms: string[]; isSynergistic?: boolean }> = {};

    selectedGenes.forEach((gene) => {
      const entry = amrDatabase[gene];
      if (!entry || (selectedOrganism && entry.organism !== selectedOrganism)) return;

      if (!report[entry.drugClass]) {
        report[entry.drugClass] = { class: entry.drugClass, maxImpact: 0, detectedMarkers: [], mechanisms: [] };
      }

      report[entry.drugClass].detectedMarkers.push(gene);
      report[entry.drugClass].mechanisms.push(entry.mechanism);
      report[entry.drugClass].maxImpact = Math.max(report[entry.drugClass].maxImpact, entry.impact);
    });

    synergyRules.forEach((rule) => {
      if (rule.genesRequired.every((g) => selectedGenes.includes(g)) && report[rule.result.drugClass]) {
        report[rule.result.drugClass].maxImpact = rule.result.boostedImpact;
        report[rule.result.drugClass].isSynergistic = true;
      }
    });

    setResults({
      organism: selectedOrganism,
      analysisTime: new Date().toISOString(),
      selectedGenes,
      resistanceProfile: Object.values(report).map((item) => ({
        antibiotic: item.class,
        confidence: { score: item.maxImpact, level: getConfidenceLabel(item.maxImpact) },
        genes: item.detectedMarkers,
        mechanisms: item.mechanisms,
        isSynergistic: item.isSynergistic ?? false,
      })),
    });

    setExpandedAntibiotics(new Set());
    setLoading(false);
  };

  const exportReport = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amr_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 ml-16 min-h-screen bg-background p-8">
      <main className="space-y-8">
        {/* Info */}
        <div className="flex flex-row items-center gap-2 justify-start glass p-4 text-gray-400 max-w-[700px]">
          <Info className="size-4 shrink-0" />
          <p className="text-sm">
            This tool identifies genetic markers associated with antimicrobial resistance based on impact scoring. Clinical resistance is determined by susceptibility testing. This is not a diagnostic tool. Synergy rules apply when multiple markers are detected.
          </p>
        </div>

        {/* Organism & Genes Selection */}
        <div className="space-y-6 glass p-6 rounded-lg mb-8">
          <div>
            <label className="block text-white font-semibold mb-2">Select Organism</label>
            <select
              value={selectedOrganism}
              onChange={(e) => setSelectedOrganism(e.target.value)}
              className="w-full bg-background border border-accent rounded-md px-4 py-2 text-white focus:outline-none focus:border-accent"
            >
              <option value="">-- Choose organism --</option>
              {organisms.map(org => <option key={org} value={org}>{org}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Select Detected Genes</label>
            <div className="grid grid-cols-3 gap-3">
              {allGenes.map(gene => (
                <label key={gene} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGenes.includes(gene)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedGenes([...selectedGenes, gene]);
                      else setSelectedGenes(selectedGenes.filter(g => g !== gene));
                    }}
                    className="w-4 h-4 rounded bg-background border-slate-600 accent-blue-500"
                  />
                  <span className="text-slate-200 font-mono text-sm">{gene}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={analyzeResistance}
            disabled={!selectedOrganism || selectedGenes.length === 0 || loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? "Analyzing..." : "Analyze Resistance Profile"}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="bg-slate-background border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Analysis Results</h2>
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div><p className="text-slate-400">Organism</p><p className="text-white font-semibold">{results.organism}</p></div>
                <div><p className="text-slate-400">Genes Analyzed</p><p className="text-white font-semibold">{results.selectedGenes.length}</p></div>
                <div><p className="text-slate-400">Timestamp</p><p className="text-white font-semibold text-xs">{new Date(results.analysisTime).toLocaleString()}</p></div>
              </div>
              <Button onClick={exportReport} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-700">
                <DownloadIcon className="w-4 h-4" /> Export JSON Report
              </Button>
            </div>

            <Accordion type="multiple" className="space-y-4 mt-6">
              {results.resistanceProfile.map((item, idx) => {
                const isExpanded = expandedAntibiotics.has(item.antibiotic);
                const confidenceColor = getConfidenceColor(item.confidence.score);
                const confidenceBadgeColor = getConfidenceBadgeColor(item.confidence.score);
                const confidenceLabel = getConfidenceLabel(item.confidence.score);

                return (
                  <AccordionItem key={idx} value={`item-${idx}`} className={`glass px-4 ${confidenceColor}`}>
                    <AccordionTrigger>
                      <div className="w-full flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{item.antibiotic}</p>
                          <span className="text-primary/80 text-sm font-mono">{item.genes.length} marker{item.genes.length !== 1 ? 's' : ''} detected</span>
                        </div>
                        <Badge className={`py-1 ${confidenceBadgeColor}`}>{confidenceLabel} ({Math.round(item.confidence.score * 100)}%)</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {item.genes.map((g, i) => <span key={i} className="bg-background text-slate-200 px-2 py-1 rounded text-xs font-mono">{g}</span>)}
                          </div>
                          <Button size="sm" onClick={() => copyGenesToClipboard(item.antibiotic, item.genes)}>
                            {copiedAntibiotic === item.antibiotic ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Mechanisms</p>
                          <ul className="list-disc pl-4 text-sm">{item.mechanisms.map((m,i)=><li key={i}>{m}</li>)}</ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </main>
    </div>
  );
}
