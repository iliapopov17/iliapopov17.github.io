---
title: "NGS Data Analysis"
collection: teaching
type: "Handbook"
permalink: /teaching/ngs-handbook
venue: "Own materials"
date: 2024-09-01
location: "Rostov-on-Don, Russia"
---

Detailed guidelines on NGS data analysis. Covers topics on: `Quality Control of raw data`, `Genomic Variation Analysis`, `Whole Genome and Pangenome Analyses`, `Phylogenetics` and `16S Amplicon Analysis`.

<img src='/images/NGS workflow.png'>

_Typical workflow of NGS data analysis_
 
_Handbook's structure_

## 05 16S Amplicon Analysis 🧫

In the [16S amplicon analysis folder](https://github.com/iliapopov17/NGS-Handbook/tree/main/05_16S_amplicon_analysis) there is an introductory guide on conducting analysis using `DADA2` followed by two interesting examples of "real-life" analysis pipeline with the data from studies on Crohn's and Parkinson's diseases.

## 04 Phylogenetics 🌳

In the [Phylogenetics folder](https://github.com/iliapopov17/NGS-Handbook/tree/main/04_Phylogenetics) there is a complete pipeline of simple research in phylogenetics, from working with NCBI (and other databases) to building trees, evaluating them, and getting some worthwhile results.

## 03 Whole Genome and Pangenome Analyses 🧬

In the [Whole (pan)genome analyses](https://github.com/iliapopov17/NGS-Handbook/tree/main/03_Whole_(pan)genome_analyses) there is a pipeline of whole genome and pangenome analyses with `PanACoTA` pipeline which includes genomes filtering with `mash`, annotating with `prokka` & `prodigal`, pangenome building with `mmseqs`, core genomes alignment with `mafft` and finally building phylogenetic tree with `iq-tree`.

## 02 Genomic Variation Analysis 🔬

In the [Genomic Variation Analysis folder](https://github.com/iliapopov17/NGS-Handbook/tree/main/02_Genomic_Variation_Analysis) there is a detailed guide how to conduct studies on Variant Calling using `fastqc`, `trimmomatic`, `bwa`, `samtools`, `abra2`, `bcftools`, `snpEff` & `SnpSift`.

## 01 Quality Control of raw data 💎

In the [Quality Control folder](https://github.com/iliapopov17/NGS-Handbook/tree/main/01_Quality_Control) there is a detailed guide how to conduct quality control of raw data using `fastqc` and `trimmomatic`.