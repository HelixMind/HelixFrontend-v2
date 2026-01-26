"use client";

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Upload, FileText, Info, DownloadIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { parse_fasta, previouslyReadFastas } from "../../../api/fasta-actions"

// shadcn
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"

export default function DNAScanner() {
  const [activeTab, setActiveTab] = useState<"stats" | "mutations" | "sequence">("stats");

  const [fasta_file, set_fasta_file] = useState<File | undefined>(undefined);
  const [reference_file, set_reference_file] = useState<File | undefined>(undefined);

  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const type = event.target.id;

    if (!file) return;

    if (type === "fasta_file") {
      set_fasta_file(file);
    }

    if (type === "reference_file") {
      set_reference_file(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fasta_file) return;

    await parse_fasta(fasta_file, reference_file);
  }

  useEffect(() => {
    previouslyReadFastas();
  }, [user])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="DNA Scanner" />

        <main className="space-y-8 p-8 bg-background min-h-screen">
          {/* info */}
          <div className="flex flex-row items-center gap-2 justify-start glass p-4 text-gray-400 max-w-175">
            <Info className="size-4 shrink-0" />
            <p className="text-sm">
              The scanner prepares raw genomic data for simulation by converting
              unstructured files into a standardized Sequence Object. <br />
              Input: Multi-FASTA/GenBank ➔ Output: Validated JSON Map.
            </p>
          </div>

          {/* uploads */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* upload fasta file */}
            <div className="w-full">
              <div className="glass p-12 rounded-lg border-2 border-dashed border-primary/50 text-center">
                <Badge variant={"failure"} className="mb-4">
                  Required
                </Badge>

                <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 ">
                  Upload Fasta File
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Drop your FASTA or GenBank files here, or click to browse
                </p>

                <label
                  htmlFor="fasta_file"
                  className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors cursor-pointer"
                >
                  Browse Files
                  <input
                    type="file"
                    name="fasta_file"
                    id="fasta_file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {fasta_file && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="text-xs font-medium max-w-sm truncate">
                      {fasta_file.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* reference file */}
            <div className="w-full">
              <div className="glass p-12 rounded-lg border-2 border-dashed border-primary/50 text-center">
                <Badge variant={"neutral"} className="mb-4">
                  Optional
                </Badge>

                <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 ">
                  Upload Reference File
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Required for mutation calling. Upload a WT or Reference genome
                </p>

                <label
                  htmlFor="reference_file"
                  className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors cursor-pointer"
                >
                  Browse Files
                  <input
                    type="file"
                    name="reference_file"
                    id="reference_file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {reference_file && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="text-xs font-medium max-w-sm truncate">
                      {reference_file.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* one main button */}
            <div className="lg:col-span-2 flex justify-center">
              <Button className="w-full py-4 font-bold" size={"lg"}>
                Run DNA Scan
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-1 items-start justify-start gap-4">
            {/* recent uploads */}
            <div className="glass p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 ">Recent Scans</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-card/50 rounded-lg hover:bg-card transition-colors cursor-pointer"
                  >
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">sample_dna_{i}.fasta</p>
                      <p className="text-sm text-muted-foreground">
                        Scanned 2 hours ago
                      </p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= Bottom Analysis Panel ================= */}
          <div className="glass rounded-xl p-6 space-y-6">
            {/* Tabs + Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "stats"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Statistics
                </button>

                <button
                  onClick={() => setActiveTab("mutations")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "mutations"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Mutations (0)
                </button>

                <button
                  onClick={() => setActiveTab("sequence")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === "sequence"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Sequence Preview
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button>
                  <DownloadIcon />
                  JSON Stats
                </Button>
              </div>
            </div>

            {/* Statistics */}
            {activeTab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { title: "Length (bp)", value: "—" },
                  { title: "GC Content", value: "—" },
                  { title: "Ambiguous Bases (N)", value: "—" },
                  { title: "Putative ORFs", value: "—" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-card p-5 rounded-xl border space-y-1"
                  >
                    <p className="text-xs text-muted-foreground uppercase">
                      {item.title}
                    </p>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Mutations */}
            {activeTab === "mutations" && (
              <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground space-y-2">
                <p className="text-lg font-semibold">Reference Missing</p>
                <p className="text-sm">
                  Please upload a Reference FASTA (Step 2) to identify
                  mutations.
                </p>
              </div>
            )}

            {/* Sequence Preview */}
            {activeTab === "sequence" && (
              <div className="bg-[#0b1020] text-green-200 rounded-xl p-4 text-sm font-mono overflow-x-auto max-h-[320px]">
                {fasta_file ? (
                  <p>
                    Preview will be shown here after parsing…
                    <br />
                    <span className="opacity-60">
                      (sequence truncated for preview)
                    </span>
                  </p>
                ) : (
                  <p className="opacity-60">No FASTA file uploaded.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
