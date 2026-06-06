"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import {
  Upload,
  FileText,
  Info,
  DownloadIcon,
  CheckCircle,
  Dna,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type SequenceType = "DNA" | "RNA";

interface FastaSequence {
  id: string;
  header: string;
  sequence: string;
  type: SequenceType;
}

interface Mutation {
  position: number;
  refBase: string;
  varBase: string;
  type: "SNP" | "Indel";
}

interface CodonUsage {
  codon: string;
  aminoAcid: string;
  count: number;
  frequency: number;
}

interface ORF {
  start: number;
  end: number;
  length: number;
  frame: number;
  strand: "+" | "-";
  aaLength: number;
  proteinSequence: string;
}

interface ResistanceHit {
  gene: string;
  kmer: string;
  position: number;
  drug_class: string;
}

interface OrganismHit {
  accession: string;
  title: string;
  score: number;
  identity: string;
}

interface SequenceStats {
  length: number;
  gcContent: number;
  atContent: number;
  nCount: number;
  orfs: ORF[];
  codonUsage: CodonUsage[];
  type: SequenceType;
  iupacCount: number;
  cpgCount: number;
  entropy: number;
}

interface BatchResult {
  header: string;
  type: SequenceType;
  length: number;
  gcContent: number;
  orfCount: number;
  resistanceGenes: string[];
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const IUPAC_DNA_REGEX = /[^ATGCBDHKMRSVWYN]/g;
const IUPAC_RNA_REGEX = /[^AUGCBDHKMRSVWYN]/g;

const CODON_TABLE: Record<string, string> = {
  TTT: "Phe", TTC: "Phe", TTA: "Leu", TTG: "Leu",
  CTT: "Leu", CTC: "Leu", CTA: "Leu", CTG: "Leu",
  ATT: "Ile", ATC: "Ile", ATA: "Ile", ATG: "Met",
  GTT: "Val", GTC: "Val", GTA: "Val", GTG: "Val",
  TCT: "Ser", TCC: "Ser", TCA: "Ser", TCG: "Ser",
  CCT: "Pro", CCC: "Pro", CCA: "Pro", CCG: "Pro",
  ACT: "Thr", ACC: "Thr", ACA: "Thr", ACG: "Thr",
  GCT: "Ala", GCC: "Ala", GCA: "Ala", GCG: "Ala",
  TAT: "Tyr", TAC: "Tyr", TAA: "Stop", TAG: "Stop",
  CAT: "His", CAC: "His", CAA: "Gln", CAG: "Gln",
  AAT: "Asn", AAC: "Asn", AAA: "Lys", AAG: "Lys",
  GAT: "Asp", GAC: "Asp", GAA: "Glu", GAG: "Glu",
  TGT: "Cys", TGC: "Cys", TGA: "Stop", TGG: "Trp",
  CGT: "Arg", CGC: "Arg", CGA: "Arg", CGG: "Arg",
  AGT: "Ser", AGC: "Ser", AGA: "Arg", AGG: "Arg",
  GGT: "Gly", GGC: "Gly", GGA: "Gly", GGG: "Gly",
};

const THREE_TO_ONE: Record<string, string> = {
  Phe: "F", Leu: "L", Ile: "I", Met: "M", Val: "V",
  Ser: "S", Pro: "P", Thr: "T", Ala: "A", Tyr: "Y",
  His: "H", Gln: "Q", Asn: "N", Lys: "K", Asp: "D",
  Glu: "E", Cys: "C", Trp: "W", Arg: "R", Gly: "G",
};

// Bacterial Translation Table 11
const START_CODONS = new Set(["ATG", "GTG", "TTG"]);
const STOP_CODONS = new Set(["TAA", "TAG", "TGA"]);

const KMER_LEN = 21;
const CARD_KMERS: Record<string, { gene: string; drug_class: string }> = {
  "ATGAGCATTCTGAAAACAACA": { gene: "mecA",       drug_class: "Beta-lactam" },
  "GCTTCACCGCCTGTCGCAAAA": { gene: "vanA",       drug_class: "Glycopeptide" },
  "ATGGCAATGAGCAAACTACTA": { gene: "blaTEM-1",   drug_class: "Beta-lactam" },
  "TTACCAATGCTTAATCAGTGA": { gene: "aac(6')-Ib", drug_class: "Aminoglycoside" },
  "ATGAGTATTCAACATTTTCGT": { gene: "sul1",       drug_class: "Sulfonamide" },
  "GCAATGTCGCTATGGAATTAC": { gene: "tetM",       drug_class: "Tetracycline" },
  "ATGGCAACTCTTGAAAATCGT": { gene: "qnrB",       drug_class: "Fluoroquinolone" },
  "GCTTCACCGCCTGTTGCAAAG": { gene: "vanB",       drug_class: "Glycopeptide" },
  "ATGCGCTTCGCCATTGAAAGC": { gene: "blaOXA-1",   drug_class: "Beta-lactam" },
  "ATGAAAGCAATTTTCGTACTG": { gene: "ermB",       drug_class: "Macrolide" },
};

// ─────────────────────────────────────────────
// SEQUENCE UTILITIES
// ─────────────────────────────────────────────

function detectSequenceType(seq: string): SequenceType {
  const uCount = (seq.match(/U/g) || []).length;
  const tCount = (seq.match(/T/g) || []).length;
  return uCount > tCount ? "RNA" : "DNA";
}

function parseFasta(content: string): FastaSequence[] {
  const parts = content.split(">");
  const sequences: FastaSequence[] = [];
  parts.forEach((part, index) => {
    if (!part.trim()) return;
    const lines = part.split("\n");
    const header = lines[0].split(/\s+/)[0];
    const rawSeq = lines.slice(1).join("").toUpperCase().replace(/\s/g, "");
    const type = detectSequenceType(rawSeq);
    const seq = rawSeq.replace(type === "RNA" ? IUPAC_RNA_REGEX : IUPAC_DNA_REGEX, "");
    if (seq.length > 0) {
      sequences.push({ id: `seq_${index}_${Date.now()}`, header: header || `Sequence_${index + 1}`, sequence: seq, type });
    }
  });
  return sequences;
}

function reverseComplement(seq: string): string {
  const complement: Record<string, string> = {
    A: "T", T: "A", G: "C", C: "G", U: "A",
    R: "Y", Y: "R", S: "S", W: "W", K: "M", M: "K",
    B: "V", V: "B", D: "H", H: "D", N: "N",
  };
  return seq.split("").reverse().map((b) => complement[b] ?? "N").join("");
}

// ─────────────────────────────────────────────
// BIOLOGICALLY ACCURATE TRANSLATION
// ─────────────────────────────────────────────
function translateCDS(seq: string): string {
  const dna = seq.replace(/U/g, "T");
  let protein = "";
  for (let i = 0; i + 2 < dna.length; i += 3) {
    const codon = dna.slice(i, i + 3);
    const aa = CODON_TABLE[codon];
    
    if (aa === "Stop") break;
    
    if (i === 0) {
      // Regardless of start codon (ATG, GTG, TTG), the first amino acid is Methionine
      protein += "M"; 
    } else {
      // Append 'X' for ambiguity bases (N) instead of breaking the translation
      protein += aa ? (THREE_TO_ONE[aa] ?? "X") : "X"; 
    }
  }
  return protein;
}

function detectORFs(seq: string): ORF[] {
  const orfs: ORF[] = [];
  const fwdSeq = seq.replace(/U/g, "T");
  const revSeq = reverseComplement(fwdSeq);
  const seqLen = fwdSeq.length;

  const scanStrand = (strandSeq: string, strand: "+" | "-") => {
    for (let frame = 0; frame < 3; frame++) {
      let i = frame;
      while (i < strandSeq.length - 2) {
        if (!START_CODONS.has(strandSeq.slice(i, i + 3))) {
          i += 3;
          continue;
        }

        const orfStart = i;
        let foundStop = false;
        let j = orfStart + 3;

        while (j + 2 < strandSeq.length) {
          const codon = strandSeq.slice(j, j + 3);
          if (STOP_CODONS.has(codon)) {
            const orfNtLen = j + 3 - orfStart;

            if (orfNtLen >= 300) {
              const orfSeq = strandSeq.slice(orfStart, j + 3);

              let genomicStart: number;
              let genomicEnd: number;
              if (strand === "+") {
                genomicStart = orfStart + 1;
                genomicEnd = j + 3;
              } else {
                genomicEnd   = seqLen - orfStart;
                genomicStart = seqLen - (j + 3) + 1;
              }

              orfs.push({
                start: genomicStart,
                end: genomicEnd,
                length: orfNtLen,
                frame: strand === "+" ? frame + 1 : -(frame + 1),
                strand,
                aaLength: Math.floor((orfNtLen - 3) / 3),
                proteinSequence: translateCDS(orfSeq),
              });
            }

            i = j + 3;
            foundStop = true;
            break;
          }
          j += 3;
        }
        if (!foundStop) i += 3;
      }
    }
  };

  scanStrand(fwdSeq, "+");
  scanStrand(revSeq, "-");
  return orfs.sort((a, b) => b.length - a.length);
}

function computeCodonUsage(seq: string, type: SequenceType): CodonUsage[] {
  const counts: Record<string, number> = {};
  let total = 0;
  const dna = seq.replace(/U/g, "T");

  for (let i = 0; i + 2 < dna.length; i += 3) {
    const codon = dna.slice(i, i + 3);
    if (CODON_TABLE[codon]) {
      const displayCodon = type === "RNA" ? codon.replace(/T/g, "U") : codon;
      counts[displayCodon] = (counts[displayCodon] || 0) + 1;
      total++;
    }
  }

  return Object.entries(counts)
    .map(([codon, count]) => ({
      codon,
      aminoAcid: CODON_TABLE[codon.replace(/U/g, "T")] ?? "?",
      count,
      frequency: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function shannonEntropy(seq: string): number {
  const counts: Record<string, number> = {};
  for (const b of seq) counts[b] = (counts[b] || 0) + 1;
  const len = seq.length;
  if (len === 0) return 0;
  return -Object.values(counts).reduce((sum, c) => {
    const p = c / len;
    return sum + p * Math.log2(p);
  }, 0);
}

function countCpG(seq: string): number {
  return (seq.match(/CG/g) || []).length;
}

function computeStats(seq: FastaSequence): SequenceStats {
  const s = seq.sequence;
  const len = s.length;
  const gc = (s.match(/[GC]/g) || []).length;
  const at = (s.match(/[ATU]/g) || []).length; // FIXED: Added U for accurate RNA stats
  const n = (s.match(/N/g) || []).length;
  const iupacCount = (s.match(/[BDHKMRSVWY]/g) || []).length;
  const orfs = detectORFs(s);
  const codonUsage = computeCodonUsage(s, seq.type);
  const cpgCount = countCpG(s);
  const entropy = shannonEntropy(s.replace(/N/g, ""));

  return {
    length: len,
    gcContent: len > 0 ? (gc / len) * 100 : 0,
    atContent: len > 0 ? (at / len) * 100 : 0,
    nCount: n,
    orfs,
    codonUsage,
    type: seq.type,
    iupacCount,
    cpgCount,
    entropy,
  };
}

// ─────────────────────────────────────────────
// ANCHORED SMITH-WATERMAN LOCAL ALIGNMENT
// ─────────────────────────────────────────────
function smithWaterman(ref: string, target: string): [string, string, number] {
  const CAP = 10000;
  const s1 = ref.replace(/U/g, "T").slice(0, CAP);
  const s2 = target.replace(/U/g, "T").slice(0, CAP);
  const MATCH = 2, MISMATCH = -1, GAP = -2;
  const m = s1.length, n = s2.length;

  const dp: Float32Array[] = Array.from(
    { length: m + 1 },
    () => new Float32Array(n + 1)
  );

  let maxScore = 0, maxI = 0, maxJ = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const diag = dp[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? MATCH : MISMATCH);
      const up   = dp[i - 1][j] + GAP;
      const left = dp[i][j - 1] + GAP;
      dp[i][j]   = Math.max(0, diag, up, left);
      if (dp[i][j] > maxScore) { maxScore = dp[i][j]; maxI = i; maxJ = j; }
    }
  }

  let a1 = "", a2 = "", i = maxI, j = maxJ;
  while (i > 0 && j > 0 && dp[i][j] > 0) {
    const sc = dp[i][j];
    if (sc === dp[i-1][j-1] + (s1[i-1] === s2[j-1] ? MATCH : MISMATCH)) {
      a1 = s1[i-1] + a1; a2 = s2[j-1] + a2; i--; j--;
    } else if (sc === dp[i-1][j] + GAP) {
      a1 = s1[i-1] + a1; a2 = "-" + a2; i--;
    } else {
      a1 = "-" + a1; a2 = s2[j-1] + a2; j--;
    }
  }

  return [a1, a2, i];
}

function computeMutations(aligned1: string, aligned2: string, refStart: number): Mutation[] {
  const mutations: Mutation[] = [];
  let refPos = refStart;
  
  for (let i = 0; i < aligned1.length; i++) {
    const r = aligned1[i], v = aligned2[i];
    if (r !== "-") refPos++;
    if (r === v) continue;
    if (r === "N" || v === "N") continue; 
    mutations.push({
      position: refPos,
      refBase: r,
      varBase: v,
      type: r === "-" || v === "-" ? "Indel" : "SNP",
    });
  }
  return mutations;
}

function kmerResistanceScan(seq: string): ResistanceHit[] {
  const hits: ResistanceHit[] = [];
  const seen = new Set<string>();
  const dna = seq.replace(/U/g, "T");

  for (let i = 0; i <= dna.length - KMER_LEN; i++) {
    const kmer = dna.slice(i, i + KMER_LEN);
    const hit = CARD_KMERS[kmer];
    if (hit && !seen.has(hit.gene)) {
      seen.add(hit.gene);
      hits.push({ gene: hit.gene, kmer, position: i + 1, drug_class: hit.drug_class });
    }
  }
  return hits;
}

async function identifyOrganism(seq: string): Promise<OrganismHit[]> {
  const query = seq.slice(0, 500);
  try {
    const submitRes = await fetch("https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        CMD: "Put", PROGRAM: "blastn", DATABASE: "nt",
        QUERY: query, FORMAT_TYPE: "JSON2", HITLIST_SIZE: "5", WORD_SIZE: "28",
      }),
    });
    const submitText = await submitRes.text();
    const ridMatch = submitText.match(/RID = ([A-Z0-9]+)/);
    if (!ridMatch) return [];
    const rid = ridMatch[1];

    for (let attempt = 0; attempt < 6; attempt++) {
      await new Promise((r) => setTimeout(r, 5000));
      const pollRes = await fetch(`https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_TYPE=JSON2&RID=${rid}`);
      const pollText = await pollRes.text();
      if (pollText.includes("Status=WAITING")) continue;
      if (pollText.includes("Status=FAILED")) return [];
      try {
        const json = JSON.parse(pollText);
        const hits = json?.BlastOutput2?.[0]?.report?.results?.search?.hits || [];
        return hits.slice(0, 5).map((hit: any) => ({
          accession: hit.description?.[0]?.accession || "",
          title: hit.description?.[0]?.title || "Unknown",
          score: hit.hsps?.[0]?.score || 0,
          identity: hit.hsps?.[0]?.identity
            ? `${((hit.hsps[0].identity / hit.hsps[0].align_len) * 100).toFixed(1)}%`
            : "N/A",
        }));
      } catch { return []; }
    }
    return [];
  } catch { return []; }
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function DNAScanner() {
  const [activeTab, setActiveTab] = useState<
    "stats" | "mutations" | "sequence" | "resistance" | "organism" | "codon" | "batch"
  >("stats");

  const [fasta_file, set_fasta_file] = useState<File | undefined>(undefined);
  const [reference_file, set_reference_file] = useState<File | undefined>(undefined);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);

  const [targetSequences, setTargetSequences] = useState<FastaSequence[]>([]);
  const [referenceSequence, setReferenceSequence] = useState<FastaSequence | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");

  const [mutations, setMutations] = useState<Mutation[]>([]);
  const [resistanceHits, setResistanceHits] = useState<ResistanceHit[]>([]);
  const [organismHits, setOrganismHits] = useState<OrganismHit[]>([]);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);

  const [isScanning, setIsScanning] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [alignmentCapped, setAlignmentCapped] = useState(false);

  const fastaInputRef  = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef  = useRef<HTMLInputElement>(null);

  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (event.target.id === "fasta_file") set_fasta_file(file);
    if (event.target.id === "reference_file") set_reference_file(file);
  };

  const handleBatchFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBatchFiles(Array.from(event.target.files || []));
  };

  const handleRunScan = async () => {
    if (!fasta_file) return;
    setIsScanning(true);
    setOrganismHits([]);

    const fastaText = await fasta_file.text();
    const parsedTargets = parseFasta(fastaText);
    setTargetSequences(parsedTargets);
    setSelectedTargetId(parsedTargets[0]?.id || "");

    let refSeq: FastaSequence | null = null;
    if (reference_file) {
      const refText = await reference_file.text();
      refSeq = parseFasta(refText)[0] || null;
      setReferenceSequence(refSeq);
    }

    if (refSeq && parsedTargets[0]) {
      const capped = parsedTargets[0].sequence.length > 10000 || refSeq.sequence.length > 10000;
      setAlignmentCapped(capped);
      
      const [a1, a2, refStart] = smithWaterman(refSeq.sequence, parsedTargets[0].sequence);
      setMutations(computeMutations(a1, a2, refStart));
    } else {
      setMutations([]);
      setAlignmentCapped(false);
    }

    if (parsedTargets[0]) setResistanceHits(kmerResistanceScan(parsedTargets[0].sequence));

    setIsScanning(false);
  };

  const handleIdentifyOrganism = async () => {
    if (!activeSequence) return;
    setIsIdentifying(true);
    const hits = await identifyOrganism(activeSequence.sequence);
    setOrganismHits(hits);
    setIsIdentifying(false);
  };

  const handleRunBatch = async () => {
    if (batchFiles.length === 0) return;
    setIsScanning(true);
    const results: BatchResult[] = [];

    for (const file of batchFiles) {
      const text = await file.text();
      const sequences = parseFasta(text);
      for (const seq of sequences) {
        const st = computeStats(seq);
        const res = kmerResistanceScan(seq.sequence);
        results.push({
          header: seq.header,
          type: seq.type,
          length: st.length,
          gcContent: st.gcContent,
          orfCount: st.orfs.length,
          resistanceGenes: res.map((h) => h.gene),
        });
      }
    }

    setBatchResults(results);
    setIsScanning(false);
    setActiveTab("batch");
  };

  const activeSequence = useMemo(
    () => targetSequences.find((s) => s.id === selectedTargetId),
    [targetSequences, selectedTargetId]
  );

  const stats: SequenceStats | null = useMemo(() => {
    if (!activeSequence) return null;
    return computeStats(activeSequence);
  }, [activeSequence]);

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (!stats) return list;
    if (stats.length < 200)
      list.push("Sequence is short (<200 bp) — statistics may be unreliable.");
    if (stats.nCount > stats.length * 0.1)
      list.push("High ambiguity: >10% N bases. Assembly quality may be low.");
    if (stats.iupacCount > 0)
      list.push(`${stats.iupacCount} IUPAC ambiguity bases (non-ATGCN) detected.`);
    if (alignmentCapped)
      list.push("Sequences >10 kbp — Smith-Waterman capped at 10 kbp. For full-genome variant calling, use BWA-MEM or minimap2.");
    if (stats.gcContent < 20 || stats.gcContent > 80)
      list.push(`Unusual GC content (${stats.gcContent.toFixed(1)}%) — possible contamination or atypical genome.`);
    if (stats.entropy < 1.5 && stats.length > 200)
      list.push(`Low sequence complexity (entropy ${stats.entropy.toFixed(2)} bits) — possible repeat region or low-complexity sequence.`);
    if (referenceSequence && activeSequence &&
      Math.abs(referenceSequence.sequence.length - activeSequence.sequence.length) > 500)
      list.push("Length discrepancy >500 bp between target and reference — only the locally aligned region will be compared.");
    return list;
  }, [stats, alignmentCapped, referenceSequence, activeSequence]);

  const handleCopySequence = async () => {
    if (!activeSequence) return;
    await navigator.clipboard.writeText(activeSequence.sequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  function triggerDownload(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  const exportStats = () => {
    if (!stats || !activeSequence) return;
    triggerDownload(
      JSON.stringify({
        header: activeSequence.header,
        type: activeSequence.type,
        length_bp: stats.length,
        gc_content_pct: parseFloat(stats.gcContent.toFixed(4)),
        at_content_pct: parseFloat(stats.atContent.toFixed(4)),
        ambiguous_n_count: stats.nCount,
        iupac_ambiguity_count: stats.iupacCount,
        cpg_dinucleotides: stats.cpgCount,
        shannon_entropy_bits: parseFloat(stats.entropy.toFixed(4)),
        orf_count_6frame: stats.orfs.length,
        total_codons: Math.floor(stats.length / 3),
        resistance_hits: resistanceHits.length,
        warnings,
        orfs: stats.orfs.map((o) => ({
          frame: o.frame > 0 ? `+${o.frame}` : `${o.frame}`,
          strand: o.strand,
          start_1based: o.start,
          end_1based: o.end,
          length_nt: o.length,
          length_aa: o.aaLength,
        })),
      }, null, 2),
      `${activeSequence.header.slice(0, 12)}_stats.json`,
      "application/json"
    );
  };

  const exportMutations = () => {
    if (mutations.length === 0) return;
    const header = "position_1based,ref_allele,alt_allele,variant_type\n";
    const rows = mutations.map((m) => `${m.position},${m.refBase},${m.varBase},${m.type}`).join("\n");
    triggerDownload(header + rows, "variants.csv", "text/csv");
  };

  const exportCodonUsage = () => {
    if (!stats || stats.codonUsage.length === 0) return;
    const header = "codon,amino_acid,count,frequency_pct\n";
    const rows = stats.codonUsage.map((c) => `${c.codon},${c.aminoAcid},${c.count},${c.frequency.toFixed(4)}`).join("\n");
    triggerDownload(header + rows, `${activeSequence?.header.slice(0, 12) ?? "seq"}_codon_usage.csv`, "text/csv");
  };

  const exportORFProteins = () => {
    if (!stats || stats.orfs.length === 0) return;
    const fasta = stats.orfs
      .map((o, i) =>
        `>ORF_${i + 1} [frame=${o.frame > 0 ? "+" + o.frame : o.frame}] [strand=${o.strand}] [location=${o.start}..${o.end}] [aa_length=${o.aaLength}]\n${o.proteinSequence}`
      )
      .join("\n");
    triggerDownload(fasta, `${activeSequence?.header.slice(0, 12) ?? "seq"}_proteins.faa`, "text/plain");
  };

  const exportBatch = () => {
    if (batchResults.length === 0) return;
    const header = "header,type,length_bp,gc_content_pct,orf_count_6frame,resistance_genes\n";
    const rows = batchResults.map((r) =>
      `"${r.header}",${r.type},${r.length},${r.gcContent.toFixed(2)},${r.orfCount},"${r.resistanceGenes.join(";")}"`
    ).join("\n");
    triggerDownload(header + rows, "batch_results.csv", "text/csv");
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="space-x-8">
      <Sidebar />
      <div className="ml-16 pt-16">
        <Header title="DNA Scanner" />
        <main className="mx-auto max-w-7xl container pt-8 bg-background min-w-full min-h-screen space-y-8">

          <div className="flex flex-row items-center gap-2 justify-start glass p-4 text-gray-400 max-w-175">
            <Info className="size-4 shrink-0" />
            <p className="text-sm">
              Input: Multi-FASTA / GenBank → Validated Sequence Object. RNA auto-detected and normalized for
              translation. ORFs detected across all 6 reading frames (3 forward + 3 reverse complement).
              Variants called via Smith-Waterman local alignment.
            </p>
          </div>

          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                  <AlertTriangle className="size-4 shrink-0" />{w}
                </div>
              ))}
            </div>
          )}

          {/* Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UploadCard
              id="fasta_file" label="Target FASTA" badge="Required" badgeVariant="failure"
              description="FASTA or GenBank (DNA or RNA)"
              file={fasta_file} inputRef={fastaInputRef} onChange={handleFileChange}
              sequenceType={targetSequences[0]?.type}
            />
            <UploadCard
              id="reference_file" label="Reference FASTA" badge="Optional" badgeVariant="neutral"
              description="Reference genome for variant calling"
              file={reference_file} inputRef={referenceInputRef} onChange={handleFileChange}
            />
            <div className="w-full">
              <div className="glass p-8 rounded-lg border-2 border-dashed border-primary/50 text-center">
                <Badge variant="neutral" className="mb-4">Batch</Badge>
                <Upload className="w-10 h-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Batch Processing</h3>
                <p className="text-sm text-muted-foreground mb-4">Analyse multiple FASTA files</p>
                <label htmlFor="batch_files" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm px-4 py-2 hover:bg-primary/90">
                  Browse Files
                  <input type="file" id="batch_files" multiple className="hidden" onChange={handleBatchFileChange} ref={batchInputRef} />
                </label>
                {batchFiles.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{batchFiles.length} file(s) selected</p>}
              </div>
            </div>
          </div>

          {targetSequences.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Active sequence:</span>
              <select className="bg-card border rounded px-3 py-1.5 text-sm" value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}>
                {targetSequences.map((s) => <option key={s.id} value={s.id}>{s.header}</option>)}
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleRunScan} disabled={isScanning || !fasta_file} className="flex-1 py-4 font-bold">
              {isScanning ? "Scanning..." : "Run DNA Scan"}
            </Button>
            {batchFiles.length > 0 && (
              <Button onClick={handleRunBatch} disabled={isScanning} variant="outline" className="py-4">Run Batch</Button>
            )}
          </div>

          {/* Analysis Panel */}
          <div className="glass rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { key: "stats",      label: "Statistics" },
                    { key: "mutations",  label: `Mutations (${mutations.length})` },
                    { key: "resistance", label: `Resistance (${resistanceHits.length})` },
                    { key: "codon",      label: "Codon Usage" },
                    { key: "organism",   label: "Organism ID" },
                    { key: "sequence",   label: "Sequence" },
                    { key: "batch",      label: `Batch (${batchResults.length})` },
                  ] as const
                ).map((tab) => (
                  <Button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`bg-primary/50 text-sm ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "hover:bg-primary/80"}`}>
                    {tab.label}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={exportStats} size="sm" disabled={!stats}><DownloadIcon className="size-4" /> Stats JSON</Button>
                <Button onClick={exportMutations} size="sm" disabled={mutations.length === 0}><DownloadIcon className="size-4" /> Variants CSV</Button>
                <Button onClick={exportCodonUsage} size="sm" disabled={!stats || stats.codonUsage.length === 0}><DownloadIcon className="size-4" /> Codons CSV</Button>
                <Button onClick={exportORFProteins} size="sm" disabled={!stats || stats.orfs.length === 0}><DownloadIcon className="size-4" /> Proteins .faa</Button>
                <Button onClick={exportBatch} size="sm" disabled={batchResults.length === 0}><DownloadIcon className="size-4" /> Batch CSV</Button>
              </div>
            </div>

            {/* STATISTICS */}
            {activeTab === "stats" && stats && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard label="Length (bp)"        value={stats.length.toLocaleString()} />
                  <StatCard label="GC Content"         value={`${stats.gcContent.toFixed(2)}%`} />
                  <StatCard label="AT Content"         value={`${stats.atContent.toFixed(2)}%`} />
                  <StatCard label="Ambiguous (N)"      value={stats.nCount} />
                  <StatCard label="ORFs — 6 frames"    value={stats.orfs.length} />
                  <StatCard label="Sequence Type"      value={stats.type} />
                  <StatCard label="CpG Dinucleotides"  value={stats.cpgCount.toLocaleString()} />
                  <StatCard label="Shannon Entropy"    value={`${stats.entropy.toFixed(3)} bits`} />
                  <StatCard label="IUPAC Ambiguity"    value={stats.iupacCount} />
                  <StatCard label="Total Codons"       value={Math.floor(stats.length / 3).toLocaleString()} />
                  <StatCard label="Resistance Hits"    value={resistanceHits.length} />
                </div>
                {stats.orfs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                      6-Frame ORFs (≥300 nt / ≥100 aa)
                    </h3>
                    <div className="overflow-x-auto max-h-64 custom-scroll">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase">
                          <tr>
                            <th className="px-4 py-3 border">Frame</th>
                            <th className="px-4 py-3 border">Strand</th>
                            <th className="px-4 py-3 border">Start</th>
                            <th className="px-4 py-3 border">End</th>
                            <th className="px-4 py-3 border">Length (nt)</th>
                            <th className="px-4 py-3 border">Length (aa)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {stats.orfs.map((orf, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                              <td className="px-4 py-2 font-mono">{orf.frame > 0 ? `+${orf.frame}` : `${orf.frame}`}</td>
                              <td className="px-4 py-2 font-mono">{orf.strand}</td>
                              <td className="px-4 py-2 font-mono">{orf.start.toLocaleString()}</td>
                              <td className="px-4 py-2 font-mono">{orf.end.toLocaleString()}</td>
                              <td className="px-4 py-2 font-mono">{orf.length.toLocaleString()}</td>
                              <td className="px-4 py-2 font-mono">{orf.aaLength.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MUTATIONS */}
            {activeTab === "mutations" && (
              !referenceSequence ? (
                <EmptyState title="No reference loaded" subtitle="Upload a reference FASTA to call variants via Smith-Waterman local alignment." />
              ) : mutations.length === 0 ? (
                <div className="text-center py-12 text-green-600 font-medium rounded-lg">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                  No variants detected in the locally aligned region
                </div>
              ) : (
                <div className="overflow-x-auto custom-scroll max-h-80">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 border">Position (ref, absolute)</th>
                        <th className="px-4 py-3 border">Ref allele</th>
                        <th className="px-4 py-3 border">Alt allele</th>
                        <th className="px-4 py-3 border">Variant type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mutations.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="px-4 py-2 font-mono">{m.position.toLocaleString()}</td>
                          <td className="px-4 py-2 font-mono text-slate-500">{m.refBase}</td>
                          <td className="px-4 py-2 font-mono text-red-500 font-bold">{m.varBase}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${m.type === "SNP" ? "bg-orange-500/20 text-orange-400" : "bg-red-500/20 text-red-400"}`}>
                              {m.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* RESISTANCE */}
            {activeTab === "resistance" && (
              resistanceHits.length === 0 ? (
                <div className="text-center py-12 text-green-600 font-medium">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                  No resistance genes detected ({KMER_LEN}-mer screen against CARD index)
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {KMER_LEN}-mer screen against CARD AMR database. Confirm hits with CARD RGI for clinical reporting.
                  </p>
                  <div className="overflow-x-auto custom-scroll max-h-80">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase">
                        <tr>
                          <th className="px-4 py-3 border">Gene</th>
                          <th className="px-4 py-3 border">Drug class</th>
                          <th className="px-4 py-3 border">Position (1-based)</th>
                          <th className="px-4 py-3 border">K-mer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {resistanceHits.map((h, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                            <td className="px-4 py-2 font-mono font-bold text-red-400">{h.gene}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">{h.drug_class}</span>
                            </td>
                            <td className="px-4 py-2 font-mono">{h.position.toLocaleString()}</td>
                            <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{h.kmer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}

            {/* CODON USAGE */}
            {activeTab === "codon" && (
              !stats || stats.codonUsage.length === 0 ? (
                <EmptyState title="No data" subtitle="Run a scan to compute codon usage." />
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    {stats.codonUsage.length} unique codons · {Math.floor(stats.length / 3).toLocaleString()} positions ·
                    {stats.type === "RNA" ? " Displayed in RNA notation (U)." : " NCBI standard genetic code (table 1)."}
                  </p>
                  <div className="overflow-x-auto custom-scroll max-h-96">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase sticky top-0">
                        <tr>
                          <th className="px-4 py-3 border">Codon</th>
                          <th className="px-4 py-3 border">Amino acid</th>
                          <th className="px-4 py-3 border">Count</th>
                          <th className="px-4 py-3 border">Frequency</th>
                          <th className="px-4 py-3 border">Relative usage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {stats.codonUsage.slice(0, 64).map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                            <td className="px-4 py-2 font-mono font-bold">{c.codon}</td>
                            <td className="px-4 py-2">{c.aminoAcid}</td>
                            <td className="px-4 py-2 font-mono">{c.count.toLocaleString()}</td>
                            <td className="px-4 py-2 font-mono">{c.frequency.toFixed(2)}%</td>
                            <td className="px-4 py-2 w-32">
                              <div className="bg-primary/20 rounded-full h-2">
                                <div className="bg-primary rounded-full h-2 transition-all"
                                  style={{ width: `${Math.min((c.frequency / (stats.codonUsage[0]?.frequency || 1)) * 100, 100)}%` }} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}

            {/* ORGANISM ID */}
            {activeTab === "organism" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Button onClick={handleIdentifyOrganism} disabled={isIdentifying || !activeSequence} className="gap-2">
                    <Dna className="size-4" />
                    {isIdentifying ? "Querying NCBI BLASTn..." : "Identify Organism (BLASTn)"}
                  </Button>
                  <span className="text-xs text-muted-foreground">Submits 500 bp to NCBI nt — ~30 s</span>
                </div>

                {organismHits.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">BLASTn Top Hits</h3>
                    <div className="space-y-2">
                      {organismHits.map((hit, i) => (
                        <div key={i} className="p-4 bg-card border rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{hit.title}</p>
                            <p className="text-xs text-muted-foreground font-mono">{hit.accession}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{hit.identity}</p>
                            <p className="text-xs text-muted-foreground">Identity</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stats && stats.orfs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                      Translated ORFs — BLASTp
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Top 5 longest ORFs translated using NCBI standard genetic code (table 11).
                      Click to search BLASTp against the NCBI nr protein database.
                    </p>
                    <div className="space-y-3">
                      {stats.orfs.slice(0, 5).map((orf, i) => (
                        <div key={i} className="p-4 bg-card border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">
                                ORF #{i + 1} — Frame {orf.frame > 0 ? `+${orf.frame}` : orf.frame} ({orf.strand} strand)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Pos {orf.start.toLocaleString()}–{orf.end.toLocaleString()} · {orf.aaLength} aa · {orf.length} nt
                              </p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2"
                              onClick={() => window.open(
                                `https://blast.ncbi.nlm.nih.gov/Blast.cgi?PROGRAM=blastp&PAGE_TYPE=BlastSearch&QUERY=${encodeURIComponent(orf.proteinSequence)}`,
                                "_blank"
                              )}>
                              BLASTp <ExternalLink className="size-3" />
                            </Button>
                          </div>
                          <div className="bg-[#0b1020] text-blue-300 rounded p-2 text-xs font-mono max-h-20 overflow-auto">
                            {orf.proteinSequence}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {organismHits.length === 0 && (!stats || stats.orfs.length === 0) && (
                  <EmptyState title="No results yet"
                    subtitle="Click 'Identify Organism' to query NCBI BLASTn, or run a scan first to see translated ORFs." />
                )}
              </div>
            )}

            {/* SEQUENCE PREVIEW */}
            {activeTab === "sequence" && (
              <div className="relative w-full">
                <button onClick={handleCopySequence}
                  className="absolute top-3 right-3 z-10 text-xs bg-black/70 hover:bg-black text-white px-3 py-1 rounded-md border border-white/10 transition">
                  {copied ? "Copied" : "Copy"}
                </button>
                <div className="bg-[#0b1020] text-green-200 rounded-sm p-4 text-sm font-mono overflow-auto seq-scroll max-h-[320px]">
                  {activeSequence ? (
                    <>
                      <span className={`text-xs font-bold mr-2 px-1.5 py-0.5 rounded ${activeSequence.type === "RNA" ? "bg-purple-600 text-white" : "bg-green-800 text-green-200"}`}>
                        {activeSequence.type}
                      </span>
                      {activeSequence.sequence.slice(0, 1200)}
                      {activeSequence.sequence.length > 1200 && (
                        <span className="text-slate-500"> … (truncated — full sequence in Stats JSON export)</span>
                      )}
                    </>
                  ) : (
                    <p className="opacity-60">No FASTA file loaded.</p>
                  )}
                </div>
              </div>
            )}

            {/* BATCH */}
            {activeTab === "batch" && (
              batchResults.length === 0 ? (
                <EmptyState title="No batch results" subtitle="Select multiple FASTA files and click 'Run Batch'." />
              ) : (
                <div className="overflow-x-auto custom-scroll max-h-96">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase sticky top-0">
                      <tr>
                        <th className="px-4 py-3 border">Header</th>
                        <th className="px-4 py-3 border">Type</th>
                        <th className="px-4 py-3 border">Length (bp)</th>
                        <th className="px-4 py-3 border">GC%</th>
                        <th className="px-4 py-3 border">ORFs (6-frame)</th>
                        <th className="px-4 py-3 border">Resistance genes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {batchResults.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="px-4 py-2 font-mono text-xs max-w-xs truncate">{r.header}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.type === "RNA" ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"}`}>
                              {r.type}
                            </span>
                          </td>
                          <td className="px-4 py-2 font-mono">{r.length.toLocaleString()}</td>
                          <td className="px-4 py-2 font-mono">{r.gcContent.toFixed(2)}%</td>
                          <td className="px-4 py-2 font-mono">{r.orfCount}</td>
                          <td className="px-4 py-2">
                            {r.resistanceGenes.length > 0 ? (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                                {r.resistanceGenes.join(", ")}
                              </span>
                            ) : (
                              <span className="text-green-400 text-xs">None</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-card p-5 rounded-xl border flex flex-col justify-between min-h-[120px]">
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const EmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground space-y-2">
    <p className="text-lg font-semibold">{title}</p>
    <p className="text-sm">{subtitle}</p>
  </div>
);

const UploadCard = ({
  id, label, badge, badgeVariant, description, file, inputRef, onChange, sequenceType,
}: {
  id: string; label: string; badge: string; badgeVariant: "failure" | "neutral";
  description: string; file: File | undefined;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sequenceType?: SequenceType;
}) => (
  <div className="w-full">
    <div className="glass p-10 rounded-lg border-2 border-dashed border-primary/50 text-center">
      <Badge variant={badgeVariant} className="mb-4">{badge}</Badge>
      <Upload className="w-10 h-10 mx-auto mb-4 text-primary" />
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <label htmlFor={id} className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm px-4 py-2 hover:bg-primary/90">
        Browse Files
        <input type="file" id={id} name={id} className="hidden" onChange={onChange} ref={inputRef} />
      </label>
      {file && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span className="text-xs font-medium max-w-sm truncate">{file.name}</span>
          {sequenceType && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${sequenceType === "RNA" ? "bg-purple-600 text-white" : "bg-green-800 text-green-200"}`}>
              {sequenceType}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);
