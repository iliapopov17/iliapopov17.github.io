---
title: "SequenceForge-Lite"
excerpt: "Lightweight tool designed to work with biological sequence data, providing various functionalities for filtering FASTQ files and manipulating FASTA files<br/><img src='/images/500x300/SequenceForge-Lite500x300.png'>"
collection: portfolio
---

[Code & full README](https://github.com/iliapopov17/SequenceForge-Lite)

<img src='/images/SequenceForge-Lite.png' width="25%">

> SequenceForge-Lite is a lightweight tool designed to work with biological sequence data, providing various functionalities for filtering FASTQ files and manipulating FASTA files. Additionally, it offers utilities for parsing BLAST output files.

## Features
### FASTQ Filtering
- Filter FASTQ files based on GC content, sequence length, and quality score.
- Specify custom ranges for GC content and sequence length.
- Set a minimum quality score threshold for sequences.
### FASTA File Manipulation
- Convert multiline FASTA files to one-line format.
- Shift the start position of one-line FASTA sequences by a specified amount.
### BLAST Output Parsing
- Extract the top hit for each query from BLAST output files.
- Results are sorted alphabetically for easy analysis.
### DNA, RNA & amino acid classes
- Calculates GC content in DNA and RNA sequences
- Prints complement sequence for DNA
- Transcribes DNA sequence to RNA
- Prints RNA sequence in codons
- Finds motifs in nucleic acids sequences
- Translates RNA sequence to amino acid
- Calculates molecular weight of amino acid sequence
