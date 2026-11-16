# Research notes: Knowledge Base page sources

Page: `D:\WORKSPACES\learning-ai\knowledge-base\index.html`
All URLs below were opened with WebFetch on 2026-11-14 (Asia/Bangkok). Quotes are short excerpts returned by the fetch.

| # | Source | URL |
|---|--------|-----|
| 1 | Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, 2020 (NeurIPS) | https://arxiv.org/abs/2005.11401 |
| 2 | Microsoft, Design and Develop a RAG Solution on Azure (Azure Architecture Center), ms.date 2025-12-17 | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide |
| 3 | Microsoft, Develop a RAG Solution - Chunking Phase, ms.date 2026-05-27 | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-chunking-phase |
| 4 | Microsoft, Develop a RAG Solution - Chunk Enrichment Phase, ms.date 2026-05-27 | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase |
| 5 | Microsoft, Develop a RAG Solution - Generate Embeddings Phase, ms.date 2026-05-27 | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-generate-embeddings |
| 6 | Unicode Consortium, UAX #15 Unicode Normalization Forms | https://www.unicode.org/reports/tr15/ |
| 7 | LangChain Team, Syncing data sources to vector stores, 2023-09-06 | https://www.langchain.com/blog/syncing-data-sources-to-vector-stores |
| 8 | LangChain, API reference `index()` (langchain-core indexing) | https://reference.langchain.com/python/langchain-core/indexing/api/index |
| 9 | Microsoft, Security Filter Pattern - Azure AI Search, ms.date 2026-08-21 | https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search |
| 10 | Microsoft, Document-Level Access Control - Azure AI Search, ms.date 2026-08-08 | https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview |
| 11 | Anthropic, Introducing Contextual Retrieval, 2024-09-19 | https://www.anthropic.com/news/contextual-retrieval |
| 12 | Shane Connelly (Elastic), Practical BM25 Part 2, 2018-04-19 | https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables |
| 13 | Yu et al., Spider text-to-SQL dataset, 2018 (EMNLP) | https://arxiv.org/abs/1809.08887 |
| 14 | LangChain, Build a SQL agent (docs) | https://docs.langchain.com/oss/python/langchain/sql-agent |
| 15 | W3C, RDF 1.1 Concepts and Abstract Syntax, 2014-02-25 | https://www.w3.org/TR/rdf11-concepts/ |
| 16 | Edge et al., From Local to Global: A Graph RAG Approach to Query-Focused Summarization, 2024 | https://arxiv.org/abs/2404.16130 |
| 17 | Microsoft GraphRAG docs, Local Search | https://microsoft.github.io/graphrag/query/local_search/ |
| 18 | Consortium for Service Innovation, KCS v6 Practice 5: Content Health | https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010 |
| 19 | Consortium for Service Innovation, KCS v6 Technique 5.9: Knowledge Domain Analysis | https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/060 |
| 20 | Consortium for Service Innovation, KCS v6 Technique 5.5: Archiving Old Articles | https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/044 |
| 21 | GDPR Art. 17 Right to erasure (gdpr-info.eu) | https://gdpr-info.eu/art-17-gdpr/ |

## Claim -> evidence

- RAG = retrieval from an external, updatable store + generation; provenance/updating knowledge are motivations. [1] "combine pre-trained parametric and non-parametric memory"; "the non-parametric memory is a dense vector index of Wikipedia"; "providing provenance for their decisions and updating their world knowledge remain open research problems."
- Ingestion pipeline = chunk -> enrich (metadata) -> embed -> persist. [2] "Chunking: Breaks down the media file into semantically relevant parts"; "Enrich chunks: Adds metadata fields"; "Embed chunks: Uses an embedding model to vectorize the chunk"; "Persist chunks: Stores the chunks in the search index."
- Remove headers/footers, reformat tables, define structure by headings, image descriptions. [3] "you might want to remove watermarks, headers, and footers"; "Reformat tables so that they're more easily processed"; "Define document structure based on headings, subheadings"; "Replace image references with image descriptions."
- Scanned documents need OCR / layout analysis. [3] "Fixed-format documents might be scanned images of original documents"; "Document layout analysis libraries and services combine optical character recognition (OCR) capabilities with deep learning models to extract both the structure and the text."
- Changing chunking strategy affects downstream (re-index). [3] "When you change chunking strategies, it can significantly affect downstream processes and require changes throughout the workflow."
- Cleaning removes non-material differences; metadata fields (ID as hash, source, language, keywords, entities) used as filters. [4] "eliminating potential differences that aren't material to the semantics"; "An ID can be a hash of some key field"; "Returning the source allows the querier to cite the original source"; "The language of the chunk can be useful as a filter"; "can be used in the search solution either as filters or as part of a search."
- Prompt injection hidden in indexed content. [4] "Never use the data from your content as a source of instructions during any processing tasks."
- Same embedding model for query and chunks. [5] "you embed the user query by using the same embedding model as your chunks."
- Unicode canonical equivalence; NFC gives one binary form. [6] "equivalent strings have a unique binary representation"; precomposed Ç equivalent to C + combining cedilla. (Applying it to Vietnamese diacritics is an inference from the general rule.)
- Incremental sync via per-document hash; skip unchanged; delete old versions and removed sources. [7] "hashes are computed for each document"; "Avoid re-computing embeddings over unchanged content"; "we added the new documents, removed the old ones and skipped all the duplicate ones"; "If some source documents have been deleted, you'll want to delete all existing documents in the vector store".
- Cleanup modes; force update when embeddings change. [8] incremental: "Cleans up all documents that haven't been updated AND that are associated with source IDs that were seen during indexing"; full: "Delete all documents that have not been returned by the loader"; force_update: "Useful if you are re-indexing with updated embeddings."
- Permission trimming at query time; app must populate security field at indexing. [9] "trims search results based on a string containing a group or user identity"; "document-level authorization is enforced by applying the security filter to every query"; "Azure AI Search doesn't provide APIs or features for populating the security field".
- Permission changes only reflected after sync. [10] "Permission changes in the source system ... are only reflected in search results after that metadata is synchronized to the index".
- Chunks lose context; prepend context before embedding and BM25. [11] "they often destroy context"; "prepending chunk-specific explanatory context to each chunk before embedding"; failure-rate reductions 35% / 49% / 67% (top-20, Anthropic's own benchmark).
- BM25: rarer terms weigh more, term frequency saturates, length normalization. [12] IDF "penalizes" terms that are common; "the more terms in the document ... the lower the score".
- Text-to-SQL task definition. [13] "a new complex and cross-domain semantic parsing and text-to-SQL task"; questions mapped to SQL over databases.
- Text-to-SQL risk; narrow permissions; validate before executing. [14] "requires executing model-generated SQL queries. There are inherent risks"; "scoped as narrowly as possible"; "add application-specific validation before executing model-generated SQL."
- Triples (subject, predicate, object); graph = set of triples. [15] "a set of triples, each consisting of a subject, a predicate and an object"; "A set of such triples is called an RDF graph."
- GraphRAG: LLM builds entity graph, community summaries, global questions. [16] "uses an LLM to build a graph index in two stages"; "derive an entity knowledge graph from the source documents"; "pregenerate community summaries for all groups of closely related entities"; standard RAG "fails on global questions directed at an entire text corpus."
- GraphRAG local search: entities as access points, pull related entities, relationships, text chunks. [17] "identifies a set of entities from the knowledge graph that are semantically-related to the user input"; "These entities serve as access points into the knowledge graph"; "extracts relevant text chunks from the raw input documents".
- Collective responsibility for article quality; "flag it or fix it". [18] "Article quality is the responsibility of everyone who interacts with the knowledge base"; "'reuse is review' and 'flag it or fix it'".
- Content gaps vs findability; consolidating duplicates; domain health owner. [19] "Content gaps: knowledge people are looking for that does not exist"; "Findability issues: knowledge exists but is not being found"; "Content overlaps: consolidating duplicate articles"; "KDEs look after the health of a collection or domain of knowledge".
- Old != irrelevant; findability over shrinking. [20] "If it is not relevant, old stuff should not show up in our search results"; "Archiving old articles treats the symptoms of findability, not the cause."
- Right to erasure of personal data. [21] "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her".

## Claims written cautiously / without a specific source
- "Hạn xem lại" (review date) and the precedence rule for conflicts (official > valid > newer) are presented as common practices, not cited as a standard.
- Quality-gate checks (empty text, chunk length, required metadata) are presented as an example design.
- All IDs, hashes, vectors, names, and dashboard numbers on the page are labeled "minh họa".

## Sources tried but not used
- Hogan et al., Knowledge Graphs (arXiv 2003.02320): abstract does not state the nodes/edges definition and the PDF text was not readable through WebFetch, so the page cites W3C RDF for triples instead.
- Cormack et al., RRF (SIGIR 2009) PDF: unreadable through WebFetch; RRF is not discussed on this page.
