---
title: "BI: Phylogenetics"
excerpt: "The complete pipeline of simple research in phylogenetics: from working with NCBI (and other databases) to building trees, evaluating them, and getting some worthwhile results<br/><img src='/images/500x300/phylo500x300.png'>"
collection: portfolio
---

## Rooting and comparing trees & Dating

In the [Root Date folder](https://github.com/iliapopov17/BI-Phylogenetics/tree/main/5%20-%20Root%20Date) there is guide how to root trees using different approaches (by a known external clade / `midpoint rooting` / `non-reversible` model), how to compare these approaches and how to perform root-supporte tree visualisation (`rootstrap`). Also there is a mini-project on dating the common ancestor of smoky leopards with "full-circle" study: downloading the data from NCBI using `efetch`, aligning the sequences with `mafft`, trimming with `trimal` and tree construnction with `iqtree2` followed by visualization and analysis in GUI apps: `Beauti`, `Tracer`, `TreeAnnotator` and `FigTree`.

## Preparing the alignment and building trees

In the [Trees folder](https://github.com/iliapopov17/BI-Phylogenetics/tree/main/4%20-%20Trees) there is guide how to prepare the alignment by cutting bad areas out of with `trimAl`, how to select the model with `ModelTest-NG` and `ModelFinder`, how to perform a tree search with `RaxML-NG` and `IQ-TREE` and how to do topology assesment with `bootstrap`.

## Multiple sequence alignment

In the [MSA folder](https://github.com/iliapopov17/BI-Phylogenetics/tree/main/3%20-%20MSA) there is guide how to perform multiple sequence alignment using all possible tools (`clustalw`, `clustalo` `muscle`, `mafft`, `kalign`, `tcoffee`, `prank`).

## Working with NCBI

In the [Mining data folder](https://github.com/iliapopov17/BI-Phylogenetics/tree/main/2%20-%20Mining%20Data) there is guide how to work with NCBI using all possible ways - `R` (`reutils`), `Python` (`Bio::Entrez`) and `bash` (`esearch`).

## Drawing Trees

In the [Intro Trees folder](https://github.com/iliapopov17/BI-Phylogenetics/tree/main/1%20-%20Intro%20Trees) there is guide how to draw phylogenetic trees using both `R` (`ape`, `ggtree`) and `Python` (`Bio::Phylo`, `ete3`).