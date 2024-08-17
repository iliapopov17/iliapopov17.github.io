---
title: "SequenceForge-Lite"
excerpt: "Lightweight tool designed to work with biological sequence data, providing various functionalities for filtering FASTQ files and manipulating FASTA files<br/><img src='/images/SequenceForge-Lite.png' width='500px'>"
collection: portfolio
---

<img src='/images/SequenceForge-Lite.png' width="25%">

> SequenceForge-Lite is a lightweight tool designed to work with biological sequence data, providing various functionalities for filtering FASTQ files and manipulating FASTA files. Additionally, it offers utilities for parsing BLAST output files.

<a href="https://github.com/iliapopov17/SequenceForge-Lite"><i class="fab fa-fw fa-github zoom" aria-hidden="true"></i> Code & full README </a><br>
<a href="https://github.com/iliapopov17/SequenceForge-Lite/wiki"><i class="fas fa-fw fa-link zoom" aria-hidden="true"></i> Usage Guide </a>

## Features
### FASTQ Filtering
- Filter FASTQ files based on GC content, sequence length, and quality score.
- Specify custom ranges for GC content and sequence length.
- Set a minimum quality score threshold for sequences.

### FASTA File Manipulation
- Get quick info on each sequence in FASTA file.
- Convert multiline FASTA files to one-line format.
- Shift the start position of one-line FASTA sequences by a specified amount.

### BLAST Output Parsing
- Extract the top hit for each query from BLAST output files.
- Results are sorted alphabetically for easy analysis.

### DNA, RNA & amino acid classes
- Calculates GC content in DNA and RNA sequences.
- Prints complement sequence for DNA.
- Transcribes DNA sequence to RNA.
- Prints RNA sequence in codons.
- Finds motifs in nucleic acids sequences.
- Translates RNA sequence to amino acid (without biological meaning, it does it "dumbly").
- Calculates molecular weight of amino acid sequence.

### Custom RandomForestClassifier
- Self written implementation of RandomForestClassifier.
- Has parallelisation functionality (speeds up 2 times when specifying 2 threads).