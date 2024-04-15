---
title: "SequenceForge-Lite"
excerpt: "Lightweight tool designed to work with biological sequence data, providing various functionalities for filtering FASTQ files and manipulating FASTA files<br/><img src='/images/500x300/SequenceForge-Lite500x300.png'>"
collection: portfolio
---

<img src='/images/SequenceForge-Lite.png' width="25%">

> SequenceForge-Lite is a lightweight tool designed to work with biological sequence data, providing various functionalities for filtering FASTQ files and manipulating FASTA files. Additionally, it offers utilities for parsing BLAST output files.

[Code & full README](https://github.com/iliapopov17/SequenceForge-Lite)

<a href="https://github.com/iliapopov17/SequenceForge-Lite"><i class="fab fa-fw fa-github zoom" aria-hidden="true"></i> Code & full README </a>

## Features
### FASTQ Filtering
- Filter FASTQ files based on GC content, sequence length, and quality score
- Specify custom ranges for GC content and sequence length
- Set a minimum quality score threshold for sequences<br>

### FASTA File Manipulation
- Convert multiline FASTA files to one-line format
- Shift the start position of one-line FASTA sequences by a specified amount<br>

### BLAST Output Parsing
- Extract the top hit for each query from BLAST output files
- Results are sorted alphabetically for easy analysis<br>

### DNA, RNA & amino acid classes
- Calculates GC content in DNA and RNA sequences
- Prints complement sequence for DNA
- Transcribes DNA sequence to RNA
- Prints RNA sequence in codons
- Finds motifs in nucleic acids sequences
- Translates RNA sequence to amino acid
- Calculates molecular weight of amino acid sequence
