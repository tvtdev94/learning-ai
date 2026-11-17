# Ghi chú nguồn: GraphRAG (learning-ai, chủ đề #10)

Ngày truy cập tất cả: 2026-11-14. Mỗi dòng: khẳng định → URL → trích ngắn làm bằng chứng. Số [N] khớp với `#src-N` trong trang.

## [1] Edge và cộng sự, From Local to Global (arXiv 2404.16130, v1 04/2024, v2 02/2025)
- RAG thường hỏng với câu hỏi toàn kho → https://arxiv.org/abs/2404.16130 → "fails on global questions directed at an entire text corpus"; ví dụ "What are the main themes in the dataset?"
- Index 2 giai đoạn: trích entity knowledge graph, rồi tóm tắt trước cho từng nhóm thực thể liên quan → abs → "Extract an entity knowledge graph … Pregenerate summaries for every group of closely related entities"
- Mỗi community summary cho partial answer rồi gộp → abs.
- Dataset ~1M token: podcast 1669 chunk × 600 token; news 3197 chunk × 600 token (~1,7M) → https://arxiv.org/html/2404.16130v2 → "1669 × 600-token text chunks, with 100-token overlaps"
- Global map-reduce: tóm tắt cộng đồng xáo trộn, chia chunk; map sinh câu trả lời kèm điểm 0–100; điểm 0 bị lọc; reduce xếp giảm dần → html → "a score between 0-100 indicating how helpful"; "Answers with score 0 are filtered out"
- Cấp C0 (root, ít nhất) … C3 (thấp, nhiều nhất); C0 cần ít hơn 9x–43x token so với tóm tắt văn bản nguồn (TS) → html → "over 97% fewer tokens"
- Thắng vector RAG: comprehensiveness 72–83% (podcast), 72–80% (news); diversity 75–82% / 62–71% → html.
- Vector RAG cho câu trả lời trực tiếp nhất (directness) → html → "vector RAG produces the most direct responses across all comparisons"
- Index podcast mất 281 phút với gpt-4-turbo → html → "took 281 minutes for the Podcast dataset"
- Giới hạn: chỉ 2 kho ~1M token → html → "More work is needed"
- Chunk 600 token trích được gần gấp đôi tham chiếu thực thể so với 2400 → html → "extracted almost twice as many entity references"
- Gleaning: hỏi lại LLM xem có sót thực thể không, lặp tới số lần tối đa → html → "'glean' any entities that it may have missed"

## [2] Microsoft GraphRAG docs, trang chủ
- Định nghĩa → https://microsoft.github.io/graphrag/ → "a structured, hierarchical approach to Retrieval Augmented Generation"
- Baseline RAG "struggles to connect the dots" và kém khi tổng hợp khái niệm trên tập lớn → cùng URL.
- Bốn chế độ: Global, Local, DRIFT, Basic ("baseline RAG (standard top k vector search)") → cùng URL.
- Pipeline: TextUnits → trích entities, relationships, claims → "hierarchical clustering of the graph using the Leiden technique" → tóm tắt cộng đồng bottom-up → cùng URL.
- Khuyến nghị prompt tuning → cùng URL → "may not yield the best possible results"; "We strongly recommend to fine-tune your prompts"

## [3] Default dataflow
- TextUnit mặc định 1200 token → https://microsoft.github.io/graphrag/index/default_dataflow/ → "By default, it is set to 1200 tokens."
- LLM trích entity/relationship từng text unit; gộp entity cùng title và type → "any entities with the same title and type are merged"
- Tóm tắt mô tả bằng LLM; claim extraction tùy chọn, tắt mặc định → "claim extraction is optional and turned off by default."
- Hierarchical Leiden đệ quy tới ngưỡng kích thước → "recursive community-clustering … until we reach a community-size threshold"
- Community report có executive overview, tham chiếu entity/relationship/claim → cùng URL.
- Embed mặc định: entity description, text unit, community report → "By default we embed entity descriptions, text unit text, and community report text."

## [4] Indexing methods (Standard vs FastGraphRAG)
- Fast: entity = noun phrase (NLTK/spaCy), relationship = đồng xuất hiện trong text unit → https://microsoft.github.io/graphrag/index/methods/ → "relationships are defined as text unit co-occurrence between entity pairs"
- NLTK mặc định chủ yếu hợp tiếng Anh → "primarily suitable for English"
- Trích graph ≈ 75% chi phí index → "We estimate graph extraction to constitute roughly 75% of indexing cost"
- Fast nhiễu hơn → "the graph tends to be quite a bit noisier"
- Cần thực thể chính xác thì giữ Standard; Fast hợp câu hỏi tóm tắt → cùng URL.

## [5] Global search
- Map-reduce trên community reports ở một cấp → https://microsoft.github.io/graphrag/query/global_search/ → "community reports are segmented into text chunks of pre-defined size"
- Chọn cấp ảnh hưởng chất lượng; cấp thấp chi tiết hơn nhưng tốn hơn → "Lower hierarchy levels … tend to yield more thorough responses"
- Baseline RAG không định hướng được → "There is nothing in the query to direct it to the correct information."

## [6] Local search
- Dùng entity làm điểm vào, lấy entity lân cận, quan hệ, covariate, community report, text chunk; xếp hạng và lọc vừa một context window → https://microsoft.github.io/graphrag/query/local_search/ → "access points into the knowledge graph"; "prioritized and filtered to fit within a single context window"

## [7] DRIFT search
- Kết hợp global và local: so câu hỏi với top K community report, sinh câu hỏi phụ, rồi local search → https://microsoft.github.io/graphrag/query/drift_search/ → "combining characteristics of both global and local search"

## [8] Get started
- Cảnh báo chi phí → https://microsoft.github.io/graphrag/get_started/ → "GraphRAG can consume a lot of LLM resources!"; "consider experimenting with fast/inexpensive models first"

## [9] Outputs
- Entity: title, type (mặc định organization, person, geo, event), description, degree; relationship: source, target, description, weight; community: level, parent, children; community_reports: summary, rank, findings → https://microsoft.github.io/graphrag/index/outputs/

## [10] Auto prompt tuning
- Sinh prompt theo lĩnh vực; ngôn ngữ tự phát hiện → https://microsoft.github.io/graphrag/prompt_tuning/auto_prompt_tuning/ → "it will be automatically detected from the inputs"; "is highly encouraged to run it"

## [11] CLI
- Lệnh update cho index có sẵn; query method local/global/drift/basic, mặc định global → https://microsoft.github.io/graphrag/cli/ → "Update an existing knowledge graph index."

## [12] LazyGraphRAG (Microsoft Research blog, 11/2024)
- Index rẻ → https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/ → "LazyGraphRAG data indexing costs are identical to vector RAG and 0.1% of the costs of full GraphRAG."
- Hoãn mọi lời gọi LLM tới lúc hỏi → "defers all LLM use until query time"
- Global: chất lượng tương đương Global Search, chi phí truy vấn thấp hơn hơn 700 lần → "more than 700 times lower query cost"
- Không phải mọi GraphRAG nên lazy; index đầy đủ có giá trị đọc như báo cáo → "We believe the answer is no"
- Đánh giá trên 1 bộ 5.590 bài AP news, 100 câu hỏi tổng hợp. Ghi chú 06/2025: tích hợp vào Microsoft Discovery và Azure Local (preview).

## [13] Traag, Waltman, van Eck. From Louvain to Leiden (arXiv 1810.08473; Sci. Rep. 2019)
- Leiden bảo đảm cộng đồng liên thông, nhanh hơn Louvain → https://arxiv.org/abs/1810.08473 → "guaranteed to be connected"; Louvain: "up to 25% of the communities are badly connected"

## [14] Yang và cộng sự. HotpotQA (arXiv 1809.09600, EMNLP 2018)
- Định nghĩa multi-hop → https://arxiv.org/abs/1809.09600 → "the questions require finding and reasoning over multiple supporting documents to answer"

## [15] Han và cộng sự. RAG vs. GraphRAG: A Systematic Evaluation (arXiv 2502.11371)
- RAG tốt hơn ở câu một bước, chi tiết → https://arxiv.org/html/2502.11371 → "RAG performs better on single-hop and detail-oriented factual queries"
- GraphRAG tốt ở multi-hop → "GraphRAG methods (e.g., HippoRAG2 and Community-GraphRAG (Local)) excel on multi-hop queries."
- Chỉ ~65,8% thực thể đáp án có trong KG (HotPotQA) → "only about 65.8% of answer entities appear in the constructed KG"
- Bổ trợ: 13,6% câu chỉ GraphRAG đúng, 11,6% chỉ RAG đúng (MultiHop-RAG); Selection (phân loại câu hỏi rồi định tuyến) rẻ hơn; Integration (chạy cả hai, ghép context) điểm cao hơn → "Integration generally achieves higher performance than Selection"
- Thời gian xây index MultiHop-RAG: RAG 135 s, KG-GraphRAG 7702 s, Community-GraphRAG 5560 s (Bảng 4).

## [16] Guo và cộng sự. LightRAG (arXiv 2410.05779)
- Dual-level retrieval, kết hợp graph với vector, cập nhật tăng dần → https://arxiv.org/abs/2410.05779 → "integration of graph structures with vector representations"; "incremental update algorithm"

## [17] Gutiérrez và cộng sự. HippoRAG (arXiv 2405.14831, NeurIPS 2024)
- KG + Personalized PageRank; multi-hop tốt hơn tới 20%; rẻ hơn 10–30 lần, nhanh hơn 6–13 lần so với IRCoT → https://arxiv.org/abs/2405.14831 → "10-30 times cheaper and 6-13 times faster"

## [18] Peng và cộng sự. Graph Retrieval-Augmented Generation: A Survey (arXiv 2408.08921)
- Ba giai đoạn: Graph-Based Indexing, Graph-Guided Retrieval, Graph-Enhanced Generation → https://arxiv.org/abs/2408.08921

## [19] W3C. RDF 1.1 Primer
- Bộ ba chủ thể, vị từ, đối tượng; tạo thành graph nút và cạnh → https://www.w3.org/TR/rdf11-primer/ → "<subject> <predicate> <object>"; "the predicates form the arcs"

## [20] Neo4j. Graph database concepts
- Nút là thực thể, quan hệ có hướng và đúng một kiểu, thuộc tính là cặp key-value → https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/ → "Properties are key-value pairs that are used for storing data on nodes and relationships."

## [21] Neo4j. Vector indexes (Cypher manual)
- Embedding lưu thành thuộc tính của nút/quan hệ; có thể kết hợp MATCH với tìm vector trong một truy vấn; vector search có thể ghép hybrid → https://neo4j.com/docs/cypher-manual/current/indexes/semantic-indexes/vector-indexes/ → "Vector embeddings are stored as … properties on a node or relationship"

---

## Kiểm lại ngày 2026-11-17 (mở lại mọi URL bằng WebFetch)

Số [N] dưới đây là số dùng trong trang `graphrag/index.html` (đánh lại so với phần trên). Mọi dòng mở ngày 2026-11-17.

- [1] Edge và cộng sự → https://arxiv.org/html/2404.16130v2 → khớp các trích dẫn cũ. Bổ sung:
  - Bốn tiêu chí: "Comprehensiveness … Diversity … Empowerment … Directness"; directness là "control criterion".
  - Đánh giá head-to-head bằng LLM judge: "head-to-head comparison approach using an LLM evaluator"; lặp 5 lần.
  - Adaptive benchmarking: persona → task → câu hỏi, K=N=M=5 → 125 câu/dataset.
  - Sáu điều kiện: C0–C3, TS (map-reduce trên văn bản gốc), SS (vector RAG).
  - C3 cần ít hơn 26–33% token; C0 "over 97% fewer tokens" so với TS.
  - Model index: "gpt-4-turbo (2M TPM, 10k RPM)"; podcast 281 phút.
  - Tóm tắt cộng đồng lá: xếp cạnh theo "combined source and target node degree"; cấp cao thay bằng tóm tắt cộng đồng con khi không vừa.
  - Leiden qua thư viện graspologic, đệ quy tới cộng đồng lá.
  - Gleaning dùng "logit bias of 100" để ép yes/no; cho phép chunk lớn hơn mà không giảm chất lượng.
  - Claims: "important factual statements about entities, such as dates, events, and interactions".
- [2] Docs trang chủ → https://microsoft.github.io/graphrag/ → khớp: định nghĩa, "struggles to connect the dots", 4 chế độ, pipeline 4 bước, "We strongly recommend to fine-tune your prompts".
- [3] Default dataflow → khớp: 1200 token; gộp entity cùng title + type, gộp relationship cùng source + target; claim tắt mặc định vì "generally requires prompt tuning"; 6 pha: Compose TextUnits, Document Processing, Graph Extraction, Graph Augmentation, Community Summarization, Text Embedding.
- [4] Indexing methods → khớp: Fast dùng noun phrase NLTK/spaCy, quan hệ = đồng xuất hiện, "primarily suitable for English", ~75% chi phí, "quite a bit noisier"; gợi ý chunk nhỏ 50–100 token cho Fast.
- [5] Global search → khớp: map chia report thành chunk, mỗi điểm có "numerical rating"; reduce gom "most important points"; cấp thấp chi tiết hơn nhưng tốn hơn.
- [6] Local search → khớp: entity "access points", lấy entity kề, relationship, covariate, community report, text chunk; "prioritized and filtered to fit within a single context window".
- [7] DRIFT → khớp: "Dynamic Reasoning and Inference with Flexible Traversal"; Primer (top K community report → trả lời rộng + câu hỏi phụ), Follow-Up (local search), Output Hierarchy. Không có số liệu.
- [8] Get started → khớp: "GraphRAG can consume a lot of LLM resources!"; "consider experimenting with fast/inexpensive models first".
- [9] Outputs → khớp: type mặc định organization/person/geo/event; relationship weight, combined_degree; community level/parent/children; report summary/rank/findings (5–10 ý); covariates status TRUE/FALSE/SUSPECTED.
- [10] Auto prompt tuning → khớp: domain suy ra từ dữ liệu; ngôn ngữ tự phát hiện; "highly encouraged"; cờ --discover-entity-types.
- [11] CLI → khớp: update "Update an existing knowledge graph index."; --method local|global|drift|basic, mặc định global.
- [12] LazyGraphRAG blog (25/11/2024, Edge, Trinh, Larson) → khớp. SỬA: bộ đánh giá là "100 synthetic queries (50 local and 50 global)" (không phải "100 câu hỏi tổng hợp"). Index: "NLP noun phrase extraction … concepts and their co-occurrences".
- [13] Leiden → khớp: Louvain "up to 25% … badly connected and up to 16% … disconnected"; Leiden "guaranteed to be connected"; nhanh hơn.
- [14] HotpotQA → khớp: "finding and reasoning over multiple supporting documents"; 113k cặp hỏi đáp.
- [15] Han và cộng sự → https://arxiv.org/html/2502.11371 → khớp; venue nay là KDD '26. 65,8% (HotPotQA), 65,5% (NQ). 13,6%/11,6% trên MultiHop-RAG với Llama 3.1-8B. Selection phân loại fact-based/reasoning-based. Community-GraphRAG (Global) "often struggles on QA": F1 NQ 54,48 vs RAG 64,78. Bảng 4: xây index RAG 135 s, KG-GraphRAG 7702 s, Community-GraphRAG 5560 s.
- [16] LightRAG → khớp (arXiv, chưa ghi venue).
- [17] HippoRAG → khớp: KG + Personalized PageRank; "up to 20%"; "10-30 times cheaper and 6-13 times faster" so với IRCoT; NeurIPS 2024.
- [18] Peng survey → https://arxiv.org/html/2408.08921 → khớp 3 giai đoạn. Bổ sung: độ chi tiết truy xuất "nodes, triplets, paths, and subgraphs"; nguồn graph "Open Knowledge Graphs and Self-Constructed Graph Data"; số subgraph ứng viên "grows exponentially" theo kích thước graph.
- [19] RDF 1.1 Primer (W3C Note 2014) → khớp.
- [20] Neo4j concepts → khớp: nút là entity, quan hệ có hướng và đúng một type, property key-value, label nhóm nút.
- [21] Neo4j vector indexes → khớp: embedding lưu thành property; ví dụ MATCH + SEARCH trong một câu; ghép hybrid với full-text.
- [22] MỚI. Xiang và cộng sự. When to use Graphs in RAG (GraphRAG-Bench), arXiv 2506.05690 → https://arxiv.org/abs/2506.05690 → "GraphRAG frequently underperforms vanilla RAG on many real-world tasks"; 4 loại nhiệm vụ "fact retrieval, complex reasoning, contextual summarization, and creative generation". Bản HTML https://arxiv.org/html/2506.05690v3 → "basic RAG is comparable to or outperforms GraphRAG in simple fact retrieval tasks"; "GraphRAG models show a clear advantage in complex reasoning, Contextual Summarize, and creative generation"; "GraphRAG significantly increases prompt length"; "MS-GraphRAG(global)'s prompt size expands from 7,800 to 40,000 tokens".
- [23] MỚI. microsoft/graphrag README → https://github.com/microsoft/graphrag → "MIT license"; "GraphRAG indexing can be an expensive operation … start small"; "not an officially supported Microsoft offering"; "This project is largely in maintenance mode, and won't be accepting new PRs or implementing new features."
- [24] MỚI. RAI_TRANSPARENCY.md → https://github.com/microsoft/graphrag/blob/main/RAI_TRANSPARENCY.md → "depends on well-constructed indexing prompts"; "Indexing is a relatively expensive operation"; tạo bộ test nhỏ; hợp nhất với văn bản "rich in identifiable entities"; đánh giá gồm "resilience to prompt and data corpus injection attacks", "low hallucination rates"; "a domain expert should analyze its answers".
- [25] MỚI. Neo4j GraphRAG Python user guide → https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_rag.html → VectorCypherRetriever: "retrieval query … executed after the index search", "fetch more context around the matched node"; Text2Cypher: "The LLM-generated query is not guaranteed to be syntactically correct."
- Bỏ: arXiv 2501.09136 (Agentic RAG survey) — phần tóm tắt không nói về GraphRAG.
- Ghi chú (không dùng làm nguồn trong trang): issue #2540 của microsoft/graphrag nói update gộp entity theo title; chỉ là issue, không trích.
