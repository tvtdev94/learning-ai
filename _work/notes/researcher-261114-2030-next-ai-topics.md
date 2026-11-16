# Đề xuất chủ đề tiếp theo cho site learning-ai

Ngày: 2026-11-14 · Người học: biết code, mới với LLM, mục tiêu xây RAG và AI agent cho doanh nghiệp (giai đoạn hiểu khái niệm).

## Kết luận

Đề xuất 14 chủ đề. Năm chủ đề nên làm trước là: cách LLM hoạt động, prompt engineering, tool calling kèm structured output, context engineering và đánh giá RAG/agent. Lý do: tài liệu chính thức của Anthropic và OpenAI đều coi đây là nền móng ("augmented LLM", "evals first"). Các trang hiện có (RAG, AI Agent, Harness) đã nhắc tới các khái niệm này nhưng chưa có trang riêng nào giải thích kỹ.

## Cách chọn và kiểm tra trùng lặp

- Nguồn đã mở: tài liệu Anthropic/Claude, OpenAI, MCP, OWASP, Microsoft GraphRAG, NVIDIA NeMo Guardrails, Ragas, Langfuse, Docling, Pinecone, cùng các survey/paper trên arXiv (2312.10997, 2501.09136, 2404.13501, 2306.05685, 2212.10496).
- Đã đọc tiêu đề h2/h3 của 6 trang đang có trong `D:\WORKSPACES\learning-ai` (rag, ai-agent, harness, hybrid-search, reranking, knowledge-base).
  - Trang AI Agent đã có các mục con "Tool calling hoạt động thế nào?", "Memory: hai tầng trí nhớ", "Multi-agent: orchestrator và worker" và "Prompt injection qua dữ liệu tool".
  - Mọi trang đều có một mục đánh giá.
  - Vì vậy các chủ đề 3, 5, 8, 9 và 11 phải được viết như **bài đào sâu**, không lặp lại phần tổng quan.
- **Đã loại "Chunking/ingestion"**: trang Knowledge Base có 91 lần nhắc "chunk" và một pipeline 8 bước, trong đó có trích văn bản, OCR và cắt theo mục. Viết thêm sẽ trùng.

## Nhóm A. Nền tảng nên học tiếp ngay

**1. Cách LLM hoạt động** · `llm-fundamentals` · Ưu tiên: Cao
- Vì sao: token, context window, sampling và hiện tượng "context rot" (context càng dài, độ chính xác càng giảm) quyết định chi phí, giới hạn và kiểu lỗi của mọi hệ RAG/agent.
- Phụ thuộc: không có. Học đầu tiên.
- Nguồn: https://platform.claude.com/docs/en/build-with-claude/context-windows · https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

**2. Prompt engineering** · `prompt-engineering` · Ưu tiên: Cao
- Vì sao: OpenAI xếp prompt engineering là bước tối ưu thứ hai, ngay sau evals. Họ cũng cho rằng chỉ riêng prompt "có thể là đủ" cho nhiều use case. Prompt cũng là chỗ RAG ghép ngữ cảnh vào để model trả lời.
- Phụ thuộc: 1.
- Nguồn: https://developers.openai.com/api/docs/guides/model-optimization · https://www.promptingguide.ai/techniques

**3. Tool calling và structured output** · `tool-calling-structured-output` · Ưu tiên: Cao
- Vì sao: đây là cơ chế giúp agent hành động được, theo vòng 5 bước: khai báo tool, model trả về tool call, app thực thi, gửi kết quả lại, model trả lời. Chế độ `strict` dựa trên structured outputs để ép model trả về đúng JSON schema mà code doanh nghiệp đọc được.
- Phụ thuộc: 1, 2. Nên học sau trang AI Agent.
- Nguồn: https://developers.openai.com/api/docs/guides/function-calling · https://www.anthropic.com/engineering/building-effective-agents

**4. Context engineering** · `context-engineering` · Ưu tiên: Cao
- Vì sao: Anthropic coi đây là bước tiến hóa tiếp theo của prompt engineering. Nó là việc chọn "tập token nhỏ nhất nhưng giàu tín hiệu nhất", gồm just-in-time retrieval, compaction và sub-agent. Đây là cách agent chạy dài mà không bị "ngợp" context.
- Phụ thuộc: 1, 3. Nên học sau trang Harness.
- Nguồn: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents · https://platform.claude.com/docs/en/build-with-claude/context-windows

## Nhóm B. Nâng cao cho RAG/agent

**5. Đánh giá RAG và agent** · `llm-evaluation` · Ưu tiên: Cao
- Vì sao: không đo thì không biết sửa đúng chỗ.
  - Ragas chuẩn hóa các metric RAG (faithfulness, context precision/recall) và các metric agent (tool call accuracy, goal accuracy).
  - LLM-as-a-judge đạt trên 80% đồng thuận với người chấm, tức ngang mức đồng thuận giữa người với người. Tuy vậy nó có thiên lệch theo vị trí, theo độ dài và thiên vị câu trả lời do chính model đó tạo ra.
- Phụ thuộc: 2, RAG, AI Agent. Đây là bài đào sâu cho các mục "đánh giá" đã có.
- Nguồn: https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/ · https://arxiv.org/abs/2306.05685

**6. Biến đổi câu truy vấn** · `query-transformation` · Ưu tiên: Trung bình
- Vì sao: câu hỏi của người dùng thường mơ hồ. Các kỹ thuật như rewriting, decomposition và HyDE (sinh tài liệu giả định rồi mới embed) cải thiện truy xuất mà không cần nhãn. Survey RAG xếp nhóm này vào giai đoạn "Advanced RAG".
- Phụ thuộc: 2, RAG, Hybrid Search.
- Nguồn: https://arxiv.org/abs/2212.10496 · https://arxiv.org/abs/2312.10997

**7. Model Context Protocol (MCP)** · `model-context-protocol` · Ưu tiên: Cao
- Vì sao: MCP là chuẩn mở để nối agent với dữ liệu và tool nội bộ (được ví như "USB-C cho AI"). Claude, ChatGPT, VS Code và Cursor đều đã hỗ trợ, nên tool viết một lần dùng được ở nhiều nơi.
- Phụ thuộc: 3.
- Nguồn: https://modelcontextprotocol.io/docs/getting-started/intro · https://www.anthropic.com/engineering/building-effective-agents

**8. Memory cho agent** · `agent-memory` · Ưu tiên: Trung bình
- Vì sao: agent doanh nghiệp cần nhớ qua nhiều phiên làm việc. Bài này phân biệt các loại memory: short-term, long-term, ghi chú có cấu trúc. Hướng nghiên cứu này đang có nhiều survey mới trong giai đoạn 2025–2026.
- Phụ thuộc: 4. Đây là bài đào sâu cho mục "Memory: hai tầng trí nhớ" của trang AI Agent.
- Nguồn: https://arxiv.org/abs/2404.13501 · https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

**9. Multi-agent và agentic RAG** · `multi-agent-agentic-rag` · Ưu tiên: Trung bình
- Vì sao: Anthropic đo được hệ multi-agent tốt hơn single-agent 90,2% trên bộ eval nghiên cứu nội bộ của họ. Đổi lại, hệ này tốn khoảng 15 lần token so với chat thường. Survey agentic RAG mô tả 4 pattern: reflection, planning, tool use, multi-agent. Bài này giúp quyết định khi nào đáng trả cái giá đó.
- Phụ thuộc: 3, 4, 5.
- Nguồn: https://www.anthropic.com/engineering/multi-agent-research-system · https://arxiv.org/abs/2501.09136

**10. GraphRAG** · `graphrag` · Ưu tiên: Trung bình
- Vì sao: vector RAG yếu ở hai loại câu hỏi: câu cần "nối các chấm" giữa nhiều tài liệu, và câu cần tổng hợp toàn bộ kho. GraphRAG xử lý hai loại này bằng knowledge graph kết hợp tóm tắt theo cộng đồng (community summaries).
- Phụ thuộc: RAG, Knowledge Base (mục knowledge graph).
- Nguồn: https://microsoft.github.io/graphrag/ · https://arxiv.org/abs/2501.09136

## Nhóm C. Vận hành thực tế

**11. Prompt injection và guardrails** · `prompt-injection-guardrails` · Ưu tiên: Cao
- Vì sao: prompt injection đứng đầu OWASP LLM Top 10 2025. Theo Simon Willison, agent nguy hiểm khi có cùng lúc ba thứ ("lethal trifecta"): quyền đọc dữ liệu riêng, tiếp xúc nội dung không tin cậy, và kênh gửi dữ liệu ra ngoài. Guardrails chỉ giảm rủi ro chứ không chặn được hết.
- Phụ thuộc: 3, 7. Nên học sau AI Governance. Bài này đào sâu mục prompt injection của trang AI Agent.
- Nguồn: https://genai.owasp.org/llm-top-10/ · https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/

**12. Observability và tracing** · `llm-observability` · Ưu tiên: Cao
- Vì sao: LLM cho kết quả không tất định, nên thiếu trace thì debug gần như là đoán. Trace ghi lại prompt, phản hồi, token, độ trễ, các bước retrieval và tool. OpenTelemetry đã có bộ quy ước riêng cho GenAI và agent.
- Phụ thuộc: 5.
- Nguồn: https://langfuse.com/docs/observability/overview · https://opentelemetry.io/docs/specs/semconv/gen-ai/

**13. Caching và tối ưu chi phí** · `llm-cost-optimization` · Ưu tiên: Trung bình
- Vì sao: agent dễ đốt token. Prompt caching tính phí cache hit chỉ bằng 0,1× giá input (thấp hơn nữa trên một số model). Bài này cũng nên nói tới routing sang model rẻ hơn và batch.
- Phụ thuộc: 1, 4.
- Nguồn: https://platform.claude.com/docs/en/build-with-claude/prompt-caching · https://www.anthropic.com/engineering/multi-agent-research-system

**14. Fine-tuning hay RAG** · `fine-tuning-vs-rag` · Ưu tiên: Trung bình
- Vì sao: giúp chọn đúng công cụ. Fine-tuning hợp để cố định định dạng hoặc giọng văn, hoặc để model nhỏ làm tốt một việc hẹp. Kiến thức hay thay đổi thì nên để RAG lo.
  - Điểm mới đáng chú ý: OpenAI đang thu hẹp ("winding down") nền tảng fine-tuning của họ. Người dùng mới không truy cập được nữa.
- Phụ thuộc: 2, 5, RAG.
- Nguồn: https://developers.openai.com/api/docs/guides/model-optimization · https://arxiv.org/abs/2312.10997

## Ma trận đánh đổi (tóm tắt)

| # | Chủ đề | Tác động tới mục tiêu RAG/agent | Rủi ro trùng trang cũ | Độ bền kiến thức |
|---|---|---|---|---|
| 1 | LLM fundamentals | Rất cao | Thấp | Cao |
| 2 | Prompt engineering | Cao | Thấp | Cao |
| 3 | Tool calling + structured output | Rất cao | Trung bình (AI Agent có mục con) | Cao |
| 4 | Context engineering | Cao | Trung bình (Harness) | Trung bình, đang phát triển |
| 5 | Evaluation | Rất cao | Trung bình (mỗi trang có mục eval) | Cao |
| 6 | Query transformation | Trung bình | Thấp (RAG chỉ nhắc 5 lần) | Cao |
| 7 | MCP | Cao | Thấp | Trung bình (spec còn đổi phiên bản) |
| 8 | Agent memory | Trung bình | Trung bình | Thấp–trung bình, đang nghiên cứu |
| 9 | Multi-agent / agentic RAG | Trung bình | Trung bình | Trung bình |
| 10 | GraphRAG | Trung bình | Thấp–trung bình (KB có mục knowledge graph) | Trung bình |
| 11 | Prompt injection + guardrails | Rất cao (cho doanh nghiệp) | Trung bình | Cao |
| 12 | Observability | Cao | Thấp | Cao |
| 13 | Cost optimization | Trung bình | Thấp | Trung bình (giá thay đổi nhanh) |
| 14 | Fine-tuning vs RAG | Trung bình | Thấp (RAG có mục so sánh) | Trung bình |

## Thứ tự học gợi ý cho 5 chủ đề đầu

1 Cách LLM hoạt động → 2 Prompt engineering → 3 Tool calling và structured output → 4 Context engineering → 5 Đánh giá RAG và agent.

Lý do: mỗi bài dựng trên bài trước, theo chuỗi token, rồi prompt, rồi hành động, rồi quản lý context. Evaluation đặt ở bài thứ năm vì OpenAI khuyên "evals first" trước khi tối ưu. Học nó sớm thì các chủ đề nâng cao phía sau đều có thước đo.

## Giới hạn

- Không có dữ liệu định lượng về mức "phổ biến", như số lượt tìm kiếm hay tỷ lệ áp dụng. Thứ tự ưu tiên dựa trên mức nhấn mạnh trong tài liệu chính thức và mức phụ thuộc giữa các khái niệm.
- Trang OpenTelemetry GenAI cho biết bộ quy ước đã chuyển sang repo `open-telemetry/semantic-conventions-genai`. Chưa xác minh mức ổn định (stable hay experimental) của bộ quy ước này.
- Chưa mở các khóa học hay lộ trình như DeepLearning.AI. Thứ tự đề xuất chưa được đối chiếu với các lộ trình đó.
- Kiểm tra trùng lặp chỉ dựa trên tiêu đề h2/h3 và số lần xuất hiện từ khóa, chưa đọc kỹ toàn bộ nội dung từng trang.
- Chưa có trang "AI Governance" và "Embedding Performance" trong repo local để đối chiếu, có thể vì đang làm. Chủ đề 11 có thể chạm tới AI Governance ở phần chính sách.

## Câu hỏi còn mở

- Trang AI Governance có định đề cập prompt injection và OWASP không? Nếu có, chủ đề 11 nên thu hẹp lại, chỉ còn phần kỹ thuật (guardrails, lethal trifecta).
- Có muốn tách structured output thành trang riêng không? Hiện nó đang gộp với tool calling vì dùng chung cơ chế `strict`.
