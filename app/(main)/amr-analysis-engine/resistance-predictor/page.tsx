"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Info, DownloadIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface DetectedGenes {
  label: string;
  checkboxId: string;
  checkboxName: string;
  htmlFor: string;
}

const DETECTED_GENES: DetectedGenes[] = [
  {
    label: "blaCTX-M",
    checkboxId: "blaCTX-M",
    checkboxName: "blacCTX-M",
    htmlFor: "blaCTX-M",
  },
  {
    label: "blaOXA-48",
    checkboxId: "blaOXA-48",
    checkboxName: "blaOXA-48",
    htmlFor: "blaOXA-48",
  },
  {
    label: "gyrA",
    checkboxId: "gyrA",
    checkboxName: "gyrA",
    htmlFor: "gyrA",
  },
  {
    label: "mecA",
    checkboxId: "mecA",
    checkboxName: "mecA",
    htmlFor: "mecA",
  },
  {
    label: "parC",
    checkboxId: "parC",
    checkboxName: "parC",
    htmlFor: "parC",
  },
  {
    label: "tetM",
    checkboxId: "tetM",
    checkboxName: "tetM",
    htmlFor: "tetM",
  },
  {
    label: "vanA",
    checkboxId: "vanA",
    checkboxName: "vanA",
    htmlFor: "vanA",
  },
];

export default function ResistancePredictor() {
  return (
      <div className="flex-1 ml-16">
        <main className="space-y-8 p-8 bg-background min-h-screen">
          {/* info */}
          <div className="flex flex-row items-center gap-2 justify-start glass p-4 text-gray-400 max-w-[700px]">
            <Info className="size-4 shrink-0" />
            <p className="text-sm">
              This tool identifies genetic markers associated with antimicrobial
              resistance based on impact scoring. Clinical resistance is
              determined by susceptibility testing. This is not a diagnostic
              tool. Synergy rules apply when multiple markers are detected.
            </p>
          </div>

          {/* select detected genes */}
          <div className="space-y-6 glass p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4  flex items-center gap-2">
              Select Detected Genes
            </h3>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DETECTED_GENES.map(
                ({ label, checkboxId, checkboxName, htmlFor }) => (
                  <Field key={checkboxId} orientation="horizontal">
                    <Checkbox id={checkboxId} name={checkboxName} />
                    <Label
                      htmlFor={htmlFor}
                      className="text-sm font-mono text-primary"
                    >
                      {label}
                    </Label>
                  </Field>
                )
              )}
            </div>

            <Button>Analyze Resistance Profile</Button>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6 glass p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4  flex items-center gap-2">
              Analysis Results
            </h3>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4>Genes Analyzed</h4>
                <p className="font-mono text-primary/80 text-sm">2</p>
              </div>
              <div>
                <h4>Timestamp</h4>
                <p className="font-mono text-primary/80 text-sm">
                  1/20/2026, 10:41:42 PM
                </p>
              </div>
            </div>

            <Button>
              <DownloadIcon />
              Export JSON Report
            </Button>
          </div>

          {/* Detected Resistance Markers */}
          <div className="space-y-6 glass p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4  flex items-center gap-2">
              Detected Resistance Markers
            </h3>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Accordion
                type="multiple"
                defaultValue={["item-1"]}
                className="space-y-4 lg:min-w-2xl max-w-3xl"
              >
                <AccordionItem value="item-1" className="glass px-4">
                  <AccordionTrigger className="hover:no-underline cursor-pointer">
                    <div className="w-full flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-base font-medium">Tetracyclines</p>
                        <span className="text-primary/80 text-sm font-mono">
                          1 marker detected
                        </span>
                      </div>
                        <Badge variant="neutral" className="py-1">
                            Medium (70%)
                        </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-t-accent pt-4">
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="glass px-4">
                  <AccordionTrigger className="hover:no-underline cursor-pointer">
                    <div className="w-full flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-base font-medium">Fluoroquinolones</p>
                        <span className="text-primary/80 text-sm font-mono">
                          1 marker detected
                        </span>
                      </div>
                        <Badge variant="failure" className="py-1">
                            Low (40%)
                        </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-t-accent pt-4">
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Detected Resistance Markers */}
          <div className="space-y-6 glass p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-2  flex items-center gap-2">
              Tools Limitations
            </h3>
              <ul className="pl-4 text-primary/80 text-sm list-disc">
                <li>Impact scoring based on literatire, individual variation may occur</li>
                <li>Synergy rules apply when multiple specific markers are detected</li>
              </ul>
          </div>
        </main>
      </div>
  );
}
