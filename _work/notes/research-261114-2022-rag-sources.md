# Ghi chú nguồn cho trang RAG (learning-ai/rag/index.html)

Ngày truy cập mọi URL: 2026-11-14. Mỗi URL dưới đây đã được mở bằng WebFetch; câu trích là nguyên văn do WebFetch trả về (một số câu bị cắt ngắn ở dấu "…").
Định dạng: khẳng định → URL → câu trích làm bằng chứng. Số [N] khớp với `#src-N` trong trang.

## Định nghĩa và động cơ
- [1] RAG = mô hình sinh (parametric) + chỉ mục vector Wikipedia (non-parametric) truy cập bằng retriever; retriever và generator là hai bộ phận riêng → https://arxiv.org/abs/2005.11401 → "the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia"; "accessed with a pre-trained neural retriever".
- [1] Cập nhật kiến thức và trích nguồn là vấn đề mở của LLM thuần → https://arxiv.org/abs/2005.11401 → "providing provenance for their decisions and updating their world knowledge remain open research problems".
- [2] LLM gặp hallucination và kiến thức lỗi thời; RAG là hướng giải quyết → https://arxiv.org/abs/2312.10997 → "encounter challenges like hallucination, outdated knowledge, and non-transparent, untraceable reasoning processes".
- [3] Hallucination: mô hình sinh văn bản không mong muốn → https://arxiv.org/abs/2202.03629 → "deep learning based generation is prone to hallucinate unintended text, which degrades the system performance".
- [4] Retrieval giảm (không loại bỏ) hallucination → https://arxiv.org/abs/2104.07567 → models "substantially reduce the well-known problem of knowledge hallucination in state-of-the-art chatbots".

## Context window và context dài
- [5] Context window gồm cả câu trả lời; độ chính xác giảm khi token tăng → https://platform.claude.com/docs/en/build-with-claude/context-windows → "all the text a language model can reference when generating a response, including the response itself"; "As token count grows, accuracy and recall degrade, a phenomenon known as context rot."
- [6] Lost in the Middle → https://arxiv.org/abs/2307.03172 → "significantly degrades when models must access relevant information in the middle of long contexts"; "even for explicitly long-context models".
- [7] Kho nhỏ thì có thể dán hết vào prompt → https://www.anthropic.com/news/contextual-retrieval → "If your knowledge base is smaller than 200,000 tokens (about 500 pages of material)" … "you can just include the entire knowledge base in the prompt".

## Embedding và cosine
- [8] Sentence embedding so bằng cosine → https://arxiv.org/abs/1908.10084 → "derive semantically meaningful sentence embeddings that can be compared using cosine-similarity".
- [9] Khoảng cách vector đo độ liên quan; khuyên dùng cosine; 1536/3072 chiều; chuẩn hóa → cosine và Euclid cùng thứ hạng → https://developers.openai.com/api/docs/guides/embeddings → "Small distances suggest high relatedness"; "We recommend cosine similarity."; "the length of the embedding vector is 1536 for text-embedding-3-small or 3072 for text-embedding-3-large"; "Cosine similarity and Euclidean distance will result in the identical rankings".
- [10] Phải dùng cùng model; đổi model thì embed lại cả kho, kể cả cùng số chiều → https://www.mongodb.com/docs/voyageai/tutorials/migrate-embedding-model/ → "Embeddings that different models generate aren't comparable"; "Regenerate your corpus even when the successor model produces embeddings with the same number of dimensions". Lưu ý: trang này cũng nói các model voyage-4 tương thích với nhau → trang RAG thêm câu "trừ khi nhà cung cấp nói rõ là tương thích".

## Chunking và overlap
- [11] Overlap giảm mất thông tin ở chỗ cắt; splitter cố giữ đoạn văn/câu → https://docs.langchain.com/oss/python/integrations/splitters/recursive_text_splitter → "Overlapping chunks helps to mitigate loss of information when context is divided between chunks."; "trying to keep all paragraphs (and then sentences, and then words) together as long as possible".
- [12] Không có cỡ chunk chung; thử 128/256 so với 512/1024 token; cắt theo cấu trúc → https://www.pinecone.io/learn/chunking-strategies/ → "There's no one-size-fits-all solution to chunking"; "smaller chunks (e.g., 128 or 256 tokens)" vs "larger chunks (e.g., 512 or 1024 tokens)"; split "based on its structure and hierarchy".
- [7] Thêm ngữ cảnh vào đầu chunk → https://www.anthropic.com/news/contextual-retrieval → "prepending chunk-specific explanatory context to each chunk before embedding".

## Vector DB và ANN
- [13] HNSW là thuật toán ANN → https://arxiv.org/abs/1603.09320 → "We present a new approach for the approximate K-nearest neighbor search based on navigable small world graphs".
- [14] ANN đổi một phần recall lấy tốc độ; pgvector là extension Postgres → https://github.com/pgvector/pgvector → "Open-source vector similarity search for Postgres"; "You can add an index to use approximate nearest neighbor search, which trades some recall for speed."
- [15] Faiss là thư viện → https://github.com/facebookresearch/faiss → "Faiss is a library for efficient similarity search and clustering of dense vectors."
- [16] Qdrant → https://github.com/qdrant/qdrant → "Qdrant (read: quadrant) is a vector similarity search engine and vector database."
- [17] Chroma → https://github.com/chroma-core/chroma → "Search infrastructure for AI" (About). Trang RAG đã đổi mô tả Chroma từ "cơ sở dữ liệu vector" thành "hạ tầng tìm kiếm cho AI" để khớp nguồn.

## BM25, hybrid, RRF
- [18] BM25: bag-of-words, IDF, chuẩn hóa độ dài → https://en.wikipedia.org/wiki/Okapi_BM25 → "BM25 is a bag-of-words retrieval function that ranks a set of documents based on the query terms appearing in each document"; IDF "measures the rarity of documents containing qi"; "avgdl is the average document length".
- [7] Embedding có thể bỏ lỡ khớp chính xác; BM25 tốt với mã/định danh; trộn bằng rank fusion; rerank đổi độ trễ/chi phí → https://www.anthropic.com/news/contextual-retrieval → "they can miss crucial exact matches"; "particularly effective for queries that include unique identifiers or technical terms"; "using rank fusion techniques"; "trade-off between reranking more chunks for better performance vs. reranking fewer for lower latency and cost".
- [19] RRF gốc, công thức 1/(k + r(d)), k = 60 → https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf (chuyển hướng tới cormack.uwaterloo.ca; WebFetch không đọc được nén PDF nên đã giải nén luồng PDF cục bộ để đọc) → "RRFscore(d∈D) = Σ_{r∈R} 1/(k + r(d)), where k=60 was fixed during a pilot investigation"; "consistently yields better results than any individual system".
- [20] RRF trong Elasticsearch, mặc định k = 60, ví dụ BM25 + kNN → https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion → "a method for combining multiple result sets with different relevance indicators into a single result set"; rank_constant "Defaults to 60".

## Reranking và cross-encoder
- [21] Rerank bằng BERT → https://arxiv.org/abs/1901.04085 → "a simple re-implementation of BERT for query-based passage re-ranking"; "outperforming the previous state of the art by 27% (relative) in MRR@10".
- [22] Cross-encoder đọc cả cặp cùng lúc, chính xác hơn nhưng không mở rộng tốt; bi-encoder lấy top-100 rồi cross-encoder rerank → https://www.sbert.net/examples/cross_encoder/applications/README.html → "we pass both sentences simultaneously to the Transformer network"; "Cross-Encoder achieve higher performance than Bi-Encoders, however, they do not scale well for large datasets."; "re-rank these 100 hits".

## Query rewriting, top-k cố định, Agentic RAG
- [23] Viết lại câu hỏi vì lệch giữa câu hỏi và kiến thức cần tìm → https://arxiv.org/abs/2305.14283 → "there is inevitably a gap between the input text and the needed knowledge in retrieval"; "Rewrite-Retrieve-Read".
- [24] RAG thường lấy cố định số đoạn bất kể có liên quan → https://arxiv.org/abs/2310.11511 → "indiscriminately retrieving and incorporating a fixed number of retrieved passages, regardless of whether retrieval is necessary, or passages are relevant"; "adaptively retrieves passages on-demand".
- [25] Agentic RAG: agent quản lý chiến lược tìm; RAG truyền thống khó với suy luận nhiều bước → https://arxiv.org/abs/2501.09136 → "traditional RAG systems are constrained by static workflows and lack the adaptability required for multi-step reasoning"; "dynamically manage retrieval strategies".
- [26] Hệ agent đổi độ trễ/chi phí lấy hiệu quả; lỗi dồn → https://www.anthropic.com/engineering/building-effective-agents → "Agentic systems often trade latency and cost for better task performance"; "higher costs, and the potential for compounding errors".

## Đánh giá
- [27] Recall → https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval) → "Recall is the fraction of the documents that are relevant to the query that are successfully retrieved."
- [28] MRR → https://en.wikipedia.org/wiki/Mean_reciprocal_rank → "the multiplicative inverse of the rank of the first correct answer"; "1 for first place, 1⁄2 for second place, 1⁄3 for third place".
- [29] Hit rate → https://raw.githubusercontent.com/run-llama/llama_index/main/llama-index-core/llama_index/core/evaluation/retrieval/metrics.py → "The default method checks for a single match between any of the retrieved docs and expected docs."
- [30] Ragas: ba khía cạnh (độ liên quan của đoạn, dùng đoạn trung thực, chất lượng sinh) → https://arxiv.org/abs/2309.15217 → "the ability of the LLM to exploit such passages in a faithful way".
- [31] LLM-as-judge: thiên lệch vị trí/độ dài/tự khen; >80% đồng thuận → https://arxiv.org/abs/2306.05685 → "position, verbosity, and self-enhancement biases"; "achieving over 80% agreement, the same level of agreement between humans".

## RAG so với fine-tuning, token
- [32] RAG vượt fine-tuning không giám sát khi nạp kiến thức; LLM khó học sự kiện mới qua fine-tuning không giám sát → https://arxiv.org/abs/2312.05934 → "RAG consistently outperforms it"; "LLMs struggle to learn new factual information through unsupervised fine-tuning".
- [33] Fine-tuning hợp với định dạng, phân loại, sửa lỗi làm theo hướng dẫn → https://developers.openai.com/api/docs/guides/supervised-fine-tuning → "Generating content in a specific format"; "Correcting instruction-following failures"; "more reliably produces your desired style and content".
- [34] Số token chênh lệch giữa ngôn ngữ, tới 15 lần → https://arxiv.org/abs/2305.15425 → "differences up to 15 times in some cases".

## Khẳng định đã sửa hoặc bỏ
- "Với phần lớn tokenizer, tiếng Việt có dấu thường tốn nhiều token hơn tiếng Anh": không tìm được số liệu riêng cho tiếng Việt (bài Petrov chỉ có tên "Vietnamese" trong nhãn hình; trang tương tác không render số). Đã viết lại thành nhận định chung về chênh lệch giữa ngôn ngữ [34] và khuyên tự đếm.
- "thường k = 3–5" và "Thường bắt đầu với k = 3–5": không có nguồn. Đổi thành "k do bạn chọn rồi đo; trang dùng k = 3".
- "Thường thử vài trăm token": thay bằng con số có nguồn (128/256 so với 512/1024 token) [12].
- "Phổ biến nhất là cosine": hạ xuống "phổ biến" [8][9].
- "so khoảng cách giữa hai bản đồ là vô nghĩa": nguồn [10] có ngoại lệ (dòng model tương thích); viết lại thận trọng.
- "không có ngưỡng chung … cho mọi model": khẳng định phủ định không có nguồn; đổi thành "mỗi model cho mức điểm khác nhau, cần tự đo".
- "LLM không tự đi tìm tài liệu": đúng với RAG cơ bản [1] nhưng mâu thuẫn với Agentic RAG ở mục 9; thêm "trong RAG cơ bản" và trỏ sang mục 9.
- "Chroma … (cơ sở dữ liệu vector)": nguồn [17] tự mô tả là "Search infrastructure for AI"; đã đổi.
- "Retrieval thường là điểm hỏng phổ biến": không có nguồn; viết lại thành hệ quả logic.
- "Vector search kém với từ khóa chính xác": hạ thành "có thể bỏ lỡ" [7].
- Fine-tuning "không phải cách đáng tin để nạp sự kiện mới": thu hẹp về kết quả của nghiên cứu [32] (fine-tuning không giám sát).
- "Linh hoạt hơn nhưng khó kiểm soát chi phí và khó đánh giá": đổi thành "chậm hơn, tốn hơn, lỗi có thể dồn" theo [26].
- Bước 6 ví dụ: điểm #c8 tính lại = 0.99958 (làm tròn 3 chữ số là 1.000, trang cũ ghi 0.999). Đổi thành 0.9996. Các điểm 0.991, 0.886, −0.017 khớp.
- "top-k luôn trả về đủ k đoạn": thêm điều kiện "nếu không đặt thêm ngưỡng điểm"; dẫn [24].

## Sửa thêm sau review của kongming (report: kongming-261114-2022-rag-evidence-review.md)
- C1: bảng mục 7 bỏ "ít câu hỏi" (không có trong [7]); thay bằng "kho tài liệu nhỏ (dưới khoảng 200.000 token)".
- C2: bước 2 và thẻ "Chunking theo cấu trúc" nói rõ gắn tiêu đề chỉ là dạng đơn giản; [7] thật ra dùng LLM viết ngữ cảnh cho từng chunk.
- C3: [24] chuyển lên câu "tự quyết định có cần tìm" (Self-RAG nói về lấy đoạn theo nhu cầu); [25] giữ ở câu multi-hop.
- C4: LLM-as-judge ghi rõ "GPT-4, trên câu trả lời chatbot".
- C5, C6, C7: giữ điều kiện "không giám sát"; "giảm mất ý"; "128 hoặc 256 / 512 hoặc 1024 token"; "thí nghiệm trên chatbot hội thoại".
- T1: thêm "k trong RRF là hằng số làm mượt, không phải k của top-k".
- T2: MRR = 0 khi không có đoạn đúng → https://raw.githubusercontent.com/run-llama/llama_index/main/llama-index-core/llama_index/core/evaluation/retrieval/metrics.py → "mrr_score = 0.0" (khi không khớp).
- T4: cosine cùng hướng = 1, vuông góc = 0.
- Làm mềm 4 câu không nguồn: embed "tốn hơn nhiều so với embed một câu hỏi"; BM25 "thường khớp chính xác hơn"; "HNSW là một ví dụ thuật toán ANN"; knowledge cutoff dẫn thêm [1].
- C9 bác bỏ: đã mở lại [33], có câu "The result is a customized model that more reliably produces your desired style and content." nên giữ "phong cách".

## Không gắn nguồn (giữ nguyên, lý do)
- Ví dụ thủ thư, thi mở tài liệu, lộ trình tự học, cây chẩn đoán: là hướng dẫn sư phạm, không phải khẳng định kỹ thuật cần kiểm chứng.
- Định nghĩa LLM "dự đoán token tiếp theo", prompt, metadata, citation: khái niệm nền, không thay đổi nội dung.
- Mọi số vector, điểm và hình 2 chiều: giữ nhãn "minh họa".
