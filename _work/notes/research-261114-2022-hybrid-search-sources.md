# Hybrid Search page — research notes and evidence

Page: `D:\WORKSPACES\learning-ai\hybrid-search\index.html` (section 13 "Nguồn tham khảo").
All URLs were opened with WebFetch on 2026-11-14. PDFs that WebFetch could not read were downloaded by WebFetch and extracted locally with `pdftotext`; quotes below come from that extracted text.

| # | Claim on page | Source URL | Evidence (short quote) |
|---|---|---|---|
| 1 | RRF formula Σ 1/(k + rank); k = 60 fixed in pilot, near-optimal, choice not critical | https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf (redirects to cormack.uwaterloo.ca) | "where k = 60 was fixed during a pilot investigation and not altered during subsequent validation"; "indicated that k = 60 was near-optimal, but that the choice was not critical" |
| 2 | TF saturation; length normalization vs avg doc length; b 0.5–0.8 and k1 1.2–2 often good; model gives no guidance → tune on evaluated queries | https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf | "any one term's contribution to the document score cannot exceed a saturation point"; "values such as 0.5 < b < 0.8 and 1.2 < k1 < 2 are reasonably good in many [circumstances]"; "the model provides no guidance on how these should be set … opportunity for optimisation, given some evaluated set of queries" |
| 3 | Lucene IDF = log(1 + (N − n + 0.5)/(n + 0.5)); defaults k1 = 1.2, b = 0.75; k1 = saturation, b = length normalization | https://lucene.apache.org/core/9_9_0/core/org/apache/lucene/search/similarities/BM25Similarity.html | "log(1 + (docCount - docFreq + 0.5)/(docFreq + 0.5))"; "k1 = 1.2", "b = 0.75"; k1 "Controls non-linear term frequency normalization (saturation)" |
| 4 | Elasticsearch BM25 default similarity, k1 default 1.2, b default 0.75 | https://www.elastic.co/docs/reference/elasticsearch/index-settings/similarity | "The default value is 1.2" (k1); "The default value is 0.75" (b) |
| 5 | RRF still sensitive to its parameters; convex combination beat RRF in their tests; few examples needed to tune α | https://arxiv.org/abs/2210.11934 | "we find RRF to be sensitive to its parameters"; "CC outperforms RRF in in-domain and out-of-domain settings"; "only a small set of training examples to tune its only parameter" |
| 6 | SPLADE: weight per vocabulary token (expansion), sparsity regularization, keeps exact match + inverted index | https://arxiv.org/abs/2107.05720 (+ PDF text) | "for each token of the vocabulary the model predicts a new weight"; "exact matching of terms and the efficiency of inverted indexes"; "explicit sparsity regularization" |
| 7 | TF-IDF/BM25 are sparse vector space models; dense retrieval with dual-encoder | https://arxiv.org/abs/2004.04906 | "traditional sparse vector space models, such as TF-IDF or BM25"; "a simple dual-encoder framework" |
| 8 | Dense retrievers lag BM25 at matching salient phrases and rare entities | https://arxiv.org/abs/2110.06918 | "dense retrievers still lag behind sparse methods such as BM25 in their ability to reliably match salient phrases and rare entities in the query" |
| 9 | BM25 robust baseline across domains; dense models often underperform out of domain | https://arxiv.org/abs/2104.08663 | "BM25 is a robust baseline"; "considerable room for improvement in their generalization capabilities" |
| 10 | Vietnamese white space separates syllables, weak word-boundary signal; RDRsegmenter tool | https://arxiv.org/abs/1709.06307 (+ PDF text) | "white space is a weak indicator of word boundaries in Vietnamese because when written, it is also used to separate syllables that constitute words" |
| 11 | Precomposed vs combining sequences are canonically equivalent and look the same; NFC uses precomposed forms | https://www.unicode.org/reports/tr15/ | "when correctly displayed should always have the same visual appearance"; NFC = "Canonical Decomposition, followed by Canonical Composition" |
| 12 | ASCII folding turns à → a; option to keep original tokens too | https://www.elastic.co/docs/reference/text-analysis/analysis-asciifolding-tokenfilter | "the filter changes à to a"; preserve_original: "emit both original tokens and folded tokens" |
| 13 | Fuzzy matching by edit distance | https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-fuzzy-query | "contain terms similar to the search term, as measured by a Levenshtein edit distance" |
| 14 | Elasticsearch RRF: score += 1/(k + rank), rank from 1; rank_constant default 60; higher → lower-ranked docs more influence; no tuning needed | https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion | "score += 1.0 / ( k + rank( result(q), d ) )"; "Defaults to 60"; "A higher value indicates that lower ranked documents have more influence"; "RRF requires no tuning" |
| 15 | Weaviate hybrid fuses vector + BM25(F); alpha 1 = pure vector, 0 = pure keyword; ranked vs relative score fusion | https://docs.weaviate.io/weaviate/search/hybrid | "An alpha of 1 is a pure vector search"; "An alpha of 0 is a pure keyword search" |
| 16 | Qdrant RRF default k = 2, ranks from 0; DBSF normalizes score distributions; RRF safe default without eval set, weighted with eval set | https://qdrant.tech/documentation/concepts/hybrid-queries/ | "k is a constant (set to 2 by default)"; "the top result has r_d = 0"; DBSF "normalizes their distributions before combining"; choice table: eval set → Weighted RRF, neither → RRF |
| 17 | BM25 and vector use different scales; min_max, l2, z_score; min-max 0 replaced by 0.001 | https://docs.opensearch.org/latest/search-plugins/search-pipelines/normalization-processor/ | "BM25 and vector search use different scales to calculate relevance scores"; "OpenSearch replaces a normalized score of exactly 0.0 with 0.001" |
| 18 | Bi-encoder embeds sentences independently; cross-encoder reads pair, more accurate, slower; retrieve top-100 then re-rank | https://www.sbert.net/examples/cross_encoder/applications/README.html | "Cross-Encoder achieve better performances than Bi-Encoders"; "First, you use an efficient Bi-Encoder to retrieve e.g. the top-100 … Then, you use a Cross-Encoder to re-rank" |
| 19 | Multilingual sentence embeddings enable cross-lingual retrieval | https://arxiv.org/abs/2007.01852 | "multilingual sentence embeddings"; "83.7% bi-text retrieval accuracy over 112 languages" |
| 20 | Retrieval metrics recall@k, MRR, DCG/nDCG exist in standard tooling | https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-rank-eval | "Recall at K (R@k)"; "Mean Reciprocal Rank"; "Discounted cumulative gain (DCG)" with normalize option |
| 21 | VnCoreNLP supports Vietnamese word segmentation | https://arxiv.org/abs/1801.01331 | "supports key natural language processing (NLP) tasks including word segmentation" |

## Claims kept without an external source (reasoning or computed on the page)
- BM25 scores in the worked example and simulator: computed by the page's own JavaScript (and cross-checked in Node) on the 8 sample chunks, k1 = 1.2, b = 0.75, syllable tokenization.
- Cosine scores, the recall@5 table in section 11: labelled "minh họa" (illustrative).
- "không" as stopword can flip meaning: linguistic reasoning, shown by example.
- Filters must apply to both branches; chunk ids must match across indexes: follows from how fusion merges by id.

## Changes made because of the research
- RRF no longer described as "ổn định / ít phải chỉnh": Bruch et al. [5] found it parameter-sensitive and beaten by convex combination; added a callout.
- Product defaults differ (Elasticsearch k = 60, Qdrant k = 2 with 0-based ranks): stated with access date.
- k1/b guidance now quotes Robertson & Zaragoza ranges plus Lucene/Elasticsearch defaults.
- SPLADE expansion described as "per-vocabulary-token weight", with the "hoàn tiền → trả lại" example marked illustrative.

## Changes after the kongming review (see kongming-261114-2020-hybrid-search-review.md)
- [16] is now cited only for "RRF is the safe default without an eval set" and for weighted RRF; "try both" now cites [5].
- New sourced statements: min-max floor 0.001 (OpenSearch [17]); Qdrant k = 2 with 0-based ranks equals k = 1 here [16].
- Statements kept without a source because they follow from arithmetic or the page's own engine: with N = 5 and k ≥ 4, a chunk in both lists always beats a single-list chunk (2/(k+5) > 1/(k+1) ⇔ k > 3); NFC does not unify tone-mark placement (hoà/hòa are different letter sequences).
- The idea "filtering after ANN can return fewer than N results" was not added, because no source was fetched for it.

## Unreachable
- Manning et al., Introduction to IR (nlp.stanford.edu) — connection refused twice; replaced by Robertson & Zaragoza [2] and Lucene [3].
