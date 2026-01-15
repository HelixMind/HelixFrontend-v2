import { request } from "./main";

export async function parse_fasta(ref_fasta_file: File, query_fasta_file: File) {
    const formData = new FormData();

    formData.append("ref_fasta_files", ref_fasta_file);
    formData.append("query_fasta_files", query_fasta_file);
    formData.append("seq_id", "NZ_CP_CASE_01")

    const response = await request<{
        response: any
    }>("/simulation/check-mutation", {
        headers: {
            // "Content-Type": "multipart/form-data"
        },
        body: formData,
        method: "POST"
    });

    console.log(response);
}