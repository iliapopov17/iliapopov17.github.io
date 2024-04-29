---
permalink: /SequenceForge-Lite-Guide/
title: "SequenceForge-Lite Usage Guide"
modified: 2024-04-29
SFL_profile: true
author_profile: false
---

{% include base_path %}
{% include toc %}

## Installation

```bash
git clone https://github.com/iliapopov17/SequenceForge-Lite.git && cd SequenceForge-Lite
```

```bash
pip install biopython
```

## Import modules

**_Input_**

```python
from bio_files_processor import *
from sequence_forge import *
```

## Convert multiline fasta to online

**_Input_**

```
! head -6 demo_data/example_multiline_fasta.fasta
```

**_Output_**

```
>GTD323452 5S_rRNA NODE_272_length_223_cov_0.720238:18-129(+)
ACGGCCATAGGACTTTGAAAGCACCGCATCCCGTCCGATCTGCGAAGTTAACCAAGATGCCGCCTGGTTAGTACCATGGTGGGGGACCACATGGGAATCCCT
GGTGCTGTG
>GTD678345 16S_rRNA NODE_80_length_720_cov_1.094737:313-719(+)
TTGGCTTCTTAGAGGGACTTTTGATGTTTAATCAAAGGAAGTTTGAGGCAATAACAGGTCTGTGATGCCCTTAGATGTTCTGGGCCGCACGCGCGCTACACT
GAGCCCTTGGGAGTGGTCCATTTGAGCCGGCAACGGCACGTTTGGACTGCAAACTTGGGCAAACTTGGTCATTTAGAGGAAGTAAAAGTCGTAACAAGGT
```

**_Input_**

```python
input_fasta_file = "demo_data/example_multiline_fasta.fasta"
output_fasta_file = "demo_data/example_oneline_fasta.fasta"
convert_multiline_fasta_to_oneline(input_fasta_file, output_fasta_file)
```

**_Output_**

```
Converted multiline FASTA to one-line FASTA. Saved as demo_data/example_oneline_fasta.fasta
```

**_Input_**

```
! head -4 demo_data/example_oneline_fasta.fasta
```

**_Output_**

```
>GTD323452 5S_rRNA NODE_272_length_223_cov_0.720238:18-129(+)
ACGGCCATAGGACTTTGAAAGCACCGCATCCCGTCCGATCTGCGAAGTTAACCAAGATGCCGCCTGGTTAGTACCATGGTGGGGGACCACATGGGAATCCCTGGTGCTGTG
>GTD678345 16S_rRNA NODE_80_length_720_cov_1.094737:313-719(+)
TTGGCTTCTTAGAGGGACTTTTGATGTTTAATCAAAGGAAGTTTGAGGCAATAACAGGTCTGTGATGCCCTTAGATGTTCTGGGCCGCACGCGCGCTACACTGAGCCCTTGGGAGTGGTCCATTTGAGCCGGCAACGGCACGTTTGGACTGCAAACTTGGGCAAACTTGGTCATTTAGAGGAAGTAAAAGTCGTAACAAGGT
```

## Change fasta start position

**_Input_**

```python
input_fasta_file = "demo_data/example_oneline_fasta.fasta"
shift_amount = 10
change_fasta_start_pos(input_fasta_file, shift_amount)
```

**_Output_**

```
Shifted FASTA sequence saved to demo_data/example_oneline_fasta_shifted.fasta
```

**_Input_**

```
! head -4 demo_data/example_oneline_fasta_shifted.fasta
```

**_Output_**

```
>GTD323452 5S_rRNA NODE_272_length_223_cov_0.720238:18-129(+)
GACTTTGAAAGCACCGCATCCCGTCCGATCTGCGAAGTTAACCAAGATGCCGCCTGGTTAGTACCATGGTGGGGGACCACATGGGAATCCCTGGTGCTGTGACGGCCATAG
>GTD678345 16S_rRNA NODE_80_length_720_cov_1.094737:313-719(+)
AGAGGGACTTTTGATGTTTAATCAAAGGAAGTTTGAGGCAATAACAGGTCTGTGATGCCCTTAGATGTTCTGGGCCGCACGCGCGCTACACTGAGCCCTTGGGAGTGGTCCATTTGAGCCGGCAACGGCACGTTTGGACTGCAAACTTGGGCAAACTTGGTCATTTAGAGGAAGTAAAAGTCGTAACAAGGTTTGGCTTCTT
```

## Parse blast output

**_Input_**

```python
input_file = "demo_data/example_blast_results.txt"
parse_blast_output(input_file)
```

**_Output_**

```
Best BLAST results saved to demo_data/example_blast_results_parsed.txt
```

**_Input_**

```
! head -4 demo_data/example_blast_results_parsed.txt
```

**_Output_**

```
DNA methylase [Enterobacteriaceae]
DUF1380 domain-containing protein [Escherichia coli]
DUF1380 family protein [Enterobacteriaceae]
DUF4158 domain-containing protein [Klebsiella pneumoniae]
```

## FASTQ filter

**_Input_**

```
! head -4 demo_data/example_fastq.fastq
```

**_Output_**

```
@SRX079804:1:SRR292678:1:1101:24563:24563 1:N:0:1 BH:failed
ATTAGCGAGGAGGAGTGCTGAGAAGATGTCGCCTACGCCGTTGAAATTCCCTTCAATCAGGGGGTACTGGAGGATACGAGTTTGTGTG
+
BFFFFFFFB@B@A<@D>BDDACDDDEBEDEFFFBFFFEFFDFFF=CC@DDFD8FFFFFFF8/+.2,@7<<:?B/:<><-><@.A*C>D
```

**_Input_**

```python
input_file = "demo_data/example_fastq.fastq"
fastq_filter(input_file, gc_bound=(40,60), length_bound=(0, 50), quality_threshold=30)
```

**_Output_**

```
Filtered FastQ. Saved as demo_data/example_fastq_filtered.fastq
```

**_Input_**

```
! head -4 demo_data/example_fastq_filtered.fastq
```

**_Output_**

```
@SRX079804:1:SRR292678:1:1101:654270:654270 1:N:0:1 BH:failed
ATCTTTCTCTCTCTGCTGCATTCTCCGCTTCAGCTCCTCAATTTCAATCA
+
GGGGGGEDGGFEGDGCGGBCEFGGGGFBFGGEGGGGGEGFCFEEGGFEDB
```

## Example usage of `DNASequence` class

**_Input_**

```python
dna_sequence = DNASequence("ACCGGCTAATCGGCT")
motif_to_find = "CGG"
print(type(dna_sequence))
print("DNA Sequence:", dna_sequence)
print("Length:", len(dna_sequence))
print("GC Content:", dna_sequence.gc_content())
print("Complement:", dna_sequence.complement())
print("Transcribed RNA Sequence:", dna_sequence.transcribe())
print(f"Indexes of {motif_to_find} motif occurrences:", dna_sequence.find_motif(motif_to_find))
```

**_Output_**

```
<class 'sequence_forge.DNASequence'>
DNA Sequence: ACCGGCTAATCGGCT
Length: 15
GC Content: 0.6
Complement: TGGCCGATTAGCCGA
Transcribed RNA Sequence: UGGCCGAUUAGCCGA
Indexes of CGG motif occurrences: [2, 10]
```

## Example usage of `RNASequence` class

**_Input_**

```python
rna_sequence = dna_sequence.transcribe()
motif_to_find = "GCC"
print(type(rna_sequence))
print("RNA Sequence:", rna_sequence)
print("Length:", len(rna_sequence))
print("GC Content:", rna_sequence.gc_content())
print("Codons:", rna_sequence.codons())
print(f"Indexes of {motif_to_find} motif occurrences:", rna_sequence.find_motif(motif_to_find))
print("Tranlated to Amino Acid Sequence:", rna_sequence.translate())
```

**_Output_**

```
<class 'sequence_forge.RNASequence'>
RNA Sequence: UGGCCGAUUAGCCGA
Length: 15
GC Content: 0.6
Codons: ['UGG', 'CCG', 'AUU', 'AGC', 'CGA']
Indexes of GCC motif occurrences: [2, 10]
Tranlated to Amino Acid Sequence: WPISR
```

## Example usage of `AminoAcidSequence` class

**_Input_**

```python
amino_acid_sequence = rna_sequence.translate()
print(type(amino_acid_sequence))
print("Amino Acid Sequence:", amino_acid_sequence)
print("Length:", len(amino_acid_sequence))
print("Molecular Weight:", amino_acid_sequence.get_molecular_weight())
```

**_Output_**

```
<class 'sequence_forge.AminoAcidSequence'>
Amino Acid Sequence: WPISR
Length: 5
Molecular Weight: 729.8299999999999
```

## Custom RandomForestClassifier

Import needed library and module

**_Input_**

```python
from custom_random_forest import RandomForestClassifierCustom
from sklearn.datasets import make_classification
```

Create dataset

**_Input_**

```python
X, y = make_classification(n_samples=100000)
rf = RandomForestClassifierCustom(n_estimators=10, max_depth=10, max_features=5, random_state=42)
```

Fit using 2 `n_jobs`

**_Input_**

```python
%%time
rf.fit(X, y, n_jobs=2)
```

**_Output_**

```
CPU times: total: 109 ms
Wall time: 7.95 s
```

Predict using 2 `n_jobs`

**_Input_**

```python
%%time
predictions_2 = rf.predict_proba(X, n_jobs=2)
```

**_Output_**

```
CPU times: total: 78.1 ms
Wall time: 2.3 s
```

Fit using 1 `n_jobs`

**_Input_**

```python
%%time
rf.fit(X, y, n_jobs=1)
```

**_Output_**

```
CPU times: total: 9.56 s
Wall time: 9.57 s
```

Predict using 1 `n_jobs`

**_Input_**

```python
%%time
predictions_2 = rf.predict_proba(X, n_jobs=1)
```

**_Output_**

```
CPU times: total: 172 ms
Wall time: 171 ms
```

Time comparison (CPU times)

|n_jobs|fit   |predict|
|------|------|-------|
|1     |9.44 s|172 ms |
|2     |109 ms|78.1 ms|

Finally, check that the resulting predictions match

**_Input_**

```python
predictions_1 == predictions_2
```

**_Output_**

```
array([[ True,  True],
       [ True,  True],
       [ True,  True],
       ...,
       [ True,  True],
       [ True,  True],
       [ True,  True]])
```