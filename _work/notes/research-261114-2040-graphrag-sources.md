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
