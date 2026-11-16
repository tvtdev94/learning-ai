# Ghi chú nghiên cứu: Embedding Performance (2026-11-14)

Mọi URL dưới đây đã được mở bằng WebFetch ngày 2026-11-14. Câu trích ngắn là bằng chứng cho khẳng định trong `D:\WORKSPACES\learning-ai\embedding-performance\index.html`. Số [N] khớp số nguồn trong trang.

| # | Nguồn | URL |
|---|---|---|
| 1 | Kusupati et al., Matryoshka Representation Learning, 2022 | https://arxiv.org/abs/2205.13147 |
| 2 | Sentence Transformers docs, Matryoshka Embeddings | https://sbert.net/examples/sentence_transformer/training/matryoshka/README.html |
| 3 | Malkov & Yashunin, HNSW, 2016 (rev. 2018) | https://arxiv.org/abs/1603.09320 |
| 4 | hnswlib, ALGO_PARAMS.md | https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md |
| 5 | Faiss wiki, Faiss indexes | https://github.com/facebookresearch/faiss/wiki/Faiss-indexes |
| 6 | Shakir, Aarsen, Lee, Embedding Quantization (HF blog), 2024 | https://huggingface.co/blog/embedding-quantization |
| 7 | Muennighoff et al., MTEB, 2022 | https://arxiv.org/abs/2210.07316 |
| 8 | Thakur et al., BEIR, 2021 | https://arxiv.org/abs/2104.08663 |
| 9 | Wang et al., E5 (Text Embeddings by Weakly-Supervised Contrastive Pre-training), 2022 | https://arxiv.org/html/2212.03533v2 |
| 10 | Sentence Transformers docs, Computing Embeddings | https://sbert.net/examples/sentence_transformer/applications/computing-embeddings/README.html |
| 11 | Sentence Transformers docs, Semantic Search | https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html |
| 12 | Google AI Studio docs, Embeddings | https://aistudio.google.com/docs/embeddings |
| 13 | Karpukhin et al., Dense Passage Retrieval, 2020 | https://arxiv.org/abs/2004.04906 |
| 14 | Sentence Transformers docs, Losses | https://sbert.net/docs/package_reference/sentence_transformer/losses.html |
| 15 | Wikipedia, Mean reciprocal rank | https://en.wikipedia.org/wiki/Mean_reciprocal_rank |
| 16 | Wikipedia, Evaluation measures (information retrieval) | https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval) |
| 17 | TigerData blog, Finding the best open-source embedding model for RAG | https://www.tigerdata.com/blog/finding-the-best-open-source-embedding-model-for-rag |

## Khẳng định → bằng chứng

### Matryoshka / số chiều
- Matryoshka cho phép một embedding thích ứng với ràng buộc tính toán, học biểu diễn thô → mịn. [1] "allows a single embedding to adapt to the computational constraints of downstream tasks"; "MRL learns coarse-to-fine representations".
- Model huấn luyện Matryoshka vẫn hữu ích sau khi cắt bớt; model thường suy giảm nhanh hơn. [2] "embeddings are still useful after truncation to much smaller sizes"; "the performance of the Matryoshka model falls off much less quickly than the standard model."
- Matryoshka không làm model nhỏ/nhanh hơn, chỉ embedding rẻ hơn. [2] "training and inference of a Matryoshka model is not faster, not more memory-efficient, and not smaller."
- Sau khi cắt chiều có thể phải tự chuẩn hóa lại (ví dụ nhà cung cấp). [12] "you must manually normalize non-3072 dimensions"; "auto-normalizes truncated dimensions".

### Byte/số và bộ nhớ
- Flat lưu 4·d byte/vector; SQfp16 2·d; SQ8 d. [5] bảng: IndexFlatL2 "4*d"; "SQfp16: 2 * d + 8, SQ8: d + 8"; SQ8 "d".
- Flat lưu mảng `ntotal * code_size` byte. [5] "store them in an array of ntotal * code_size bytes."
- Binary = 1 bit/chiều, giảm 32 lần. [6] "conversion of the float32 values in an embedding to 1-bit values"; "32x reduction in memory and storage usage".
- int8 giảm 4 lần, 256 mức, cần khoảng giá trị (calibration). [6] "256 distinct levels (from -128 to 127)"; "We compute the range of these embeddings"; "exactly 4x"; "the calibration dataset greatly influences performance".
- Binary: ngưỡng tại 0, so bằng Hamming. [6] "threshold normalized embeddings at 0"; "We can use the Hamming Distance".
- Rescoring: lấy rộng bằng binary rồi chấm lại bằng float32. [6] "first retrieve rescore_multiplier * top_k results with the binary query embedding"; "then rescore that list ... with the float32 query embedding".
- Quantization không hiệu quả như nhau với mọi model. [6] "quantization doesn't universally work with all embedding models."
- Ước lượng bộ nhớ HNSW: hnswlib "roughly M * 8-10 bytes per stored element" [4]; Faiss IndexHNSWFlat "4*d + x * M * 2 * 4" byte/vector [5]. → Máy tính dùng N × 2·M × 4 byte (= 8·M byte/vector), ghi rõ "ước lượng thô".

### Index / ANN
- HNSW là đồ thị nhiều tầng, tìm bắt đầu từ tầng trên. [3] "multi-layer structure consisting from hierarchical set of proximity graphs (layers)"; "Starting search from the upper layer ... boosts the performance".
- M lớn: chính xác hơn, tốn bộ nhớ hơn. [5] "A larger M is more accurate but uses more memory". [4] "Higher M work better on datasets with ... high recall".
- ef lớn: chính xác hơn, chậm hơn; ef ≥ k. [4] "Higher ef leads to more accurate but slower search."; "ef cannot be set lower than the number of queried nearest neighbors k."
- ef_construction lớn: build lâu hơn, index tốt hơn, tới ngưỡng thì hết lợi. [4] "Bigger ef_construction leads to longer construction, but better index quality."; "At some point, increasing ef_construction does not improve the quality".
- HNSW (Faiss) không hỗ trợ xóa vector. [5] "HNSW does not support removing vectors from the index."
- IVF: chia cụm, nprobe chọn lúc truy vấn để đánh đổi tốc độ/độ chính xác; lỗi khi cụm chứa láng giềng gần nhất không được chọn. [5] "nprobe is specified at query time (useful for measuring trade-offs between speed and accuracy)"; "The failure case appears when the cell of the nearest neighbor of a given query is not selected."
- PQ: chia vector thành các vector con, mỗi cái lượng tử hóa vài bit. [5] "vectors are split into sub-vectors that are each quantized to a few bits (usually 8)."
- ANN: không đảm bảo chính xác; có tham số đánh đổi recall–tốc độ. [11] "the results are not necessarily exact"; "there are usually one or more parameters to tune that determine the recall-speed trade-off."
- Tìm chính xác chậm với kho rất lớn. [11] "Searching a large corpus with millions of embeddings can be time-consuming if exact nearest neighbor search is used".

### Chất lượng / cách dùng model
- MTEB: 8 nhiệm vụ, 58 dataset, 112 ngôn ngữ; không phương pháp nào thắng mọi nhiệm vụ. [7] "MTEB spans 8 embedding tasks covering a total of 58 datasets and 112 languages."; "no particular text embedding method dominates across all tasks."
- Khả năng tổng quát ra ngoài miền huấn luyện còn hạn chế. [8] "considerable room for improvement in their generalization capabilities."
- Tìm bất đối xứng (câu hỏi ngắn ↔ đoạn dài) cần chọn model đúng loại. [11] "you want to find a longer paragraph answering the query"; "It is critical that you choose the right model for your type of task."
- Tiền tố query/passage. [9] "break the symmetry by adding two prefix identifiers “query:” and “passage:”". [10] "you should prefix all queries with "query: " and all passages with "passage: ""; "The prompt will be prepended to the input text during inference."
- Kiểu nhiệm vụ riêng cho câu hỏi và tài liệu (nhà cung cấp). [12] "Use RETRIEVAL_QUERY for queries; RETRIEVAL_DOCUMENT for documents to be retrieved."
- Giới hạn độ dài và truncation. [10] "Each model has a maximum sequence length"; "Longer texts will be truncated to the first model.max_seq_length tokens"; "if a model was trained on short texts, the representations for long texts might not be that good."
- Chuẩn hóa về độ dài 1 thì dùng dot product thay cosine. [11] "normalize the corpus embeddings so that each corpus embedding is of length 1. In that case, we can use dot-product".
- Fine-tune bằng cặp câu hỏi–đoạn. [13] "embeddings are learned from a small number of questions and passages by a simple dual-encoder framework."
- Hard negative trong huấn luyện. [14] "Optional negatives in the input are treated as additional hard-negative documents for the corresponding query."; in-batch negatives: "cross-entropy loss with in-batch negatives".

### Đánh giá
- MRR, RR = 0 khi không có kết quả đúng. [15] "the multiplicative inverse of the rank of the first correct answer"; "If none of the proposed results are correct, the reciprocal rank is 0."
- Recall và nDCG. [16] "Recall is the fraction of the documents that are relevant to the query that are successfully retrieved."; DCG "the graded relevance value is reduced logarithmically proportional to the position of the result."

### Đổi model / vận hành
- Không gian embedding của hai model không so được; nâng cấp phải embed lại toàn bộ. [12] "you cannot directly compare embeddings generated by one model with embeddings generated by the other."; "you must re-embed all of your existing data." [17] "requires re-embedding your entire corpus".
- Chuyển đổi song song: bảng mới bên cạnh, đánh giá rồi mới chuyển. [17] "Build the new model's embeddings in their own table next to the existing ones."; "Once you've evaluated the new model and are satisfied with it, switch your application's queries to the new table".
- Batch API cho thông lượng cao khi không cần độ trễ thấp (một nhà cung cấp). [12] "If latency is not a concern, try using ... Batch API."

## Khẳng định không có nguồn trực tiếp → viết thận trọng
- Batching tăng throughput khi index: viết dạng "thường giúp, hãy đo" (có [12] gián tiếp về Batch API).
- Cache theo hash(nội dung + model + phiên bản): là thực hành kỹ thuật, trình bày như gợi ý, không như sự thật đo được.
- Mọi con số recall, độ trễ, tỷ lệ trong ví dụ từng bước: đánh dấu "minh họa".

### Bổ sung: rescoring với int8 trên đĩa
- [6] "A binary index (41M binary embeddings; 5.2GB of memory/disk space) is searched using the quantized query"; "loaded on the fly from an int8 index on disk"; "The top 40 documents are rescored using the float32 query and the int8 embeddings to get the top 10 documents." → khớp bước 6 (binary + chấm lại, bản int8 trên đĩa) và thẻ Rescoring.

### Bổ sung sau review (đã tự WebFetch lại 2026-11-14)
- Truncation lặng lẽ ở một nhà cung cấp: [12] "The system silently truncates inputs that exceed this limit." → trang ghi "thường bị cắt lặng lẽ (có nơi báo lỗi thay vì cắt)" và cite [10][12].
- Tham số loại nhiệm vụ thay cho chuỗi tiền tố: [12] "Specifying the right task type helps optimize the embeddings for the intended relationships"; "Use RETRIEVAL_QUERY for queries; RETRIEVAL_DOCUMENT for documents to be retrieved."
- Tiêu đề nguồn [17] đã sửa: "Best Open-Source Embedding Models for RAG in 2026", tác giả Hervé Ishimwe, đăng 2024-12-19, cập nhật 2026-10 (metadata trang).
- Matryoshka không làm embed nhanh hơn: [2] "training and inference of a Matryoshka model is not faster, not more memory-efficient, and not smaller."
- Bỏ khẳng định "quên chuẩn hóa → recall tụt" (nguồn không nói); thay bằng "nếu dùng dot product thì chuẩn hóa lại; một số nhà cung cấp tự làm, một số không [12]".
- Bỏ khẳng định "2·M liên kết ở tầng dưới cùng" (chưa có nguồn mở được); thay bằng công thức Faiss x·M·2·4 [5] và khoảng hnswlib M×8–10 [4].
