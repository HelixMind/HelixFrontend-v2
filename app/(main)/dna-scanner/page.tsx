"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Upload, FileText, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { parse_fasta, previouslyReadFastas } from "../../../api/fasta-actions"

// shadcn
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"

export default function DNAScanner() {
  const [fasta_file, set_fasta_file] = useState<File | undefined>(undefined);
  const { user } = useAuth();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // files is a FileList, we want the first one
    const type = event.target.id;

    if (!file) {
      return;
    }

    if (type == "fasta_file") {
      // To Do: Run a ui action to indicate that a ref_fasta has been uploaded
      set_fasta_file(file);
    } else {
      // Info: A debug block
      throw new Error("No actual file selected")
    }
  };

  const handleFastaFileSubmit = async (event: any) => {
    event.preventDefault();

    if (!fasta_file) {
      // TO Do: Remember to handle errors, this should throw an error to pop up a toast or notification or something
      return;
    }

    await parse_fasta(fasta_file);
  }

  useEffect(() => {
    previouslyReadFastas();
  }, [user])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 pt-16">
        <Header title="DNA Scanner" />

        <main className="p-8 bg-background min-h-screen">
          <div className="flex flex-row items-center gap-2 justify-start glass my-4 p-4 text-gray-400 max-w-[700px]">
            <Info className="size-4 shrink-0" />
            <p className="text-sm">
              The scanner prepares raw genomic data for simulation by converting unstructured files into a standardized Sequence Object. <br />

              Input: Multi-FASTA/GenBank ➔ Output: Validated JSON Map.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <form className="flex flex-col gap-3" onSubmit={handleFastaFileSubmit}>
                <div className="glass p-12 rounded-lg border-2 border-dashed border-primary/50 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2 ">Upload Fasta File</h3>
                  <p className="text-sm text-muted-foreground mb-6">Drop your FASTA or GenBank files here, or click to browse</p>
                  <label htmlFor="fasta_file" className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors">
                    Browse Files
                    <input type="file" name="fasta_file" id="fasta_file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                <div className="flex justify-center">
                  <Button className="w-full py-4 font-bold" size={"lg"}>Read Fasta File</Button>
                </div>
              </form>

              <div className="glass p-6 rounded-lg mt-8">
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
                        <p className="text-sm text-muted-foreground">Scanned 2 hours ago</p>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 ">Scanner Settings</h3>
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
