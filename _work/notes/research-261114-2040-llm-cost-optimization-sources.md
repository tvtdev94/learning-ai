# Ghi chú nguồn: llm-cost-optimization (truy cập 2026-11-14)

Mỗi dòng: khẳng định → URL → câu trích ngắn làm bằng chứng. Số [N] khớp với `#src-N` trong trang.

## [1] Anthropic, Prompt caching
- Cache bao phủ cả tiền tố theo thứ tự tools → system → messages → https://platform.claude.com/docs/en/build-with-claude/prompt-caching → "Prompt caching covers the full prefix: `tools`, `system`, and `messages` (in that order)"
- Trúng cache cần khớp 100% → cùng URL → "Cache hits require 100 percent identical prompt segments"
- Đổi ở một tầng làm hỏng tầng đó và các tầng sau → cùng URL → "Changes at each level invalidate that level and all subsequent levels."
- Đổi định nghĩa tool làm hỏng toàn bộ cache → cùng URL → "Modifying tool definitions (names, descriptions, parameters) invalidates the entire cache"
- Thứ tự key JSON không ổn định làm vỡ cache → cùng URL → "some languages (for example, Swift, Go) randomize key order during JSON conversion, breaking caches"
- TTL mặc định 5 phút, làm mới miễn phí khi dùng → cùng URL → "By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used."
- Có TTL 1 giờ, tốn thêm → cùng URL → "you can use a 1-hour cache duration at additional cost"
- Hệ số giá: ghi 5 phút 1,25×, ghi 1 giờ 2×, đọc 0,1× (một số model thấp hơn) → cùng URL → "Cache write tokens with a 5-minute TTL are 1.25 times the base input tokens price." / "Cache write tokens with a 1-hour TTL are 2 times" / "Cache read tokens are 0.1 times the base input tokens price (see the table footnote for per-model exceptions)"
- Hệ số cộng dồn với Batch → cùng URL → "These multipliers stack with other pricing modifiers such as the Batch API discount"
- Có độ dài tối thiểu, ngắn hơn thì không cache và không báo lỗi → cùng URL → "Shorter prompts cannot be cached, even if marked with `cache_control`... no error is returned."
- Trường usage → cùng URL → "`cache_creation_input_tokens`", "`cache_read_input_tokens`", "total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens"
- Không ảnh hưởng output → cùng URL → "Prompt caching has no effect on output token generation."
- Cải thiện TTFT với tài liệu dài → cùng URL → "You generally see improved time-to-first-token for long documents."
- Cache cách ly giữa tổ chức (và workspace trên Claude API) → cùng URL → "caches are never shared across organizations, even for identical prompts"
- Batch + cache chỉ best-effort → cùng URL → "cache hits are provided on a best-effort basis"

## [2] Anthropic, Pricing
- Giá token ra gấp 5 lần token vào ở các model ví dụ → https://platform.claude.com/docs/en/about-claude/pricing → "Claude Sonnet 5.5 | $2 / MTok ... | $10 / MTok" ; "Claude Haiku 5.5 (for prompts up to 100,000 tokens) | $0.10 / MTok ... | $0.50 / MTok"
- Batch giảm 50% cả vào và ra → cùng URL → "a 50 percent discount on both input and output tokens"
- Dùng tool thêm token system prompt → cùng URL → "Tool use system prompt tokens" (bảng: 286 tokens cho Sonnet 5.5)
- Chiến lược tối ưu → cùng URL → "Choose Haiku for simple tasks, Sonnet for most production workloads, and Opus for the most complex reasoning." ; "Monitor usage patterns: Track token consumption"
- Hệ số giá theo vùng → cùng URL → "incurs a 1.1x multiplier on all token pricing categories"

## [3] OpenAI, Prompt caching
- Bật mặc định → https://developers.openai.com/api/docs/guides/prompt-caching → "Prompt caching is enabled by default for supported OpenAI models."
- Khớp toàn bộ tiền tố, đặt phần tĩnh trước → cùng URL → "Cache reuse requires the entire rendered prefix to match." ; "Put stable developer instructions and shared reference material first."
- Giảm tới 95% → cùng URL → "discounted up to 95%"
- Model mới tính phí ghi → cùng URL → "For GPT-5.6 and later, cache writes cost 1.25× the standard, uncached input-token rate"
- Không đảm bảo trúng → cùng URL → "does not guarantee that every request reuses stored KV tensors or has lower latency"
- Đo bằng cached_tokens → cùng URL → "Track `usage.input_tokens_details.cached_tokens`"
- Giữ tool ổn định → cùng URL → "Keep tools consistent. Preserve tool definitions, ordering, and schemas."
- Không chia sẻ giữa tổ chức → cùng URL → "Caches are not shared across organizations"

## [4] Google, Gemini context caching
- Implicit caching mặc định, tự trả lại phần tiết kiệm → https://aistudio.google.com/docs/caching → "We automatically pass on cost savings if your request hits caches."
- Đặt nội dung lớn chung ở đầu, gửi gần nhau → cùng URL → "Try putting large and common contents at the beginning of your prompt" ; "Try to send requests with similar prefix in a short amount of time"

## [5] OpenAI, Batch API
- Giảm 50%, cửa sổ 24h → https://developers.openai.com/api/docs/guides/batch → "50% cost discount compared to synchronous APIs" ; "the completion window can only be set to `24h`"
- Rate limit riêng → cùng URL → "Batch API rate limits are separate from existing per-model rate limits."
- Use case → cùng URL → "Running evaluations", "Classifying large datasets", "Embedding content repositories"
- Hết hạn thì request chưa xong bị hủy → cùng URL → "unfinished requests within that batch are cancelled"

## [6] Anthropic, Batch processing
- Phần lớn xong dưới 1 giờ, giảm 50% → https://platform.claude.com/docs/en/build-with-claude/batch-processing → "most batches finishing in less than 1 hour while reducing costs by 50 percent"
- Giới hạn và hết hạn → cùng URL → "limited to either 100,000 Message requests or 256 MB" ; "Batches expire if processing does not complete within 24 hours."
- Gợi ý cache 1 giờ khi batch → cùng URL → "consider using the 1-hour cache duration with prompt caching for better cache hit rates"
- Request hết hạn không tính phí → cùng URL → "You aren't billed for these requests."

## [7] Anthropic, How we built our multi-agent research system (2025-06-13)
- Agent ~4×, multi-agent ~15× token so với chat → https://www.anthropic.com/engineering/multi-agent-research-system → "agents typically use about 4× more tokens than chat interactions" ; "multi-agent systems use about 15× more tokens than chats"
- Chỉ đáng khi giá trị việc đủ cao → cùng URL → "multi-agent systems require tasks where the value of the task is high enough to pay for the increased performance"

## [8] OpenAI, Reasoning models
- Token reasoning ẩn nhưng tính như output → https://developers.openai.com/api/docs/guides/reasoning → "they still occupy space in the model's context window and are billed as output tokens"
- Có thể bị tính tiền mà không có output → cùng URL → "This might occur before any visible output tokens are produced"
- Effort thấp ít token hơn → cùng URL → "Lower effort favors speed and lower token usage."

## [9] Anthropic, Extended thinking
- Trường thinking_tokens trong output → https://platform.claude.com/docs/en/build-with-claude/extended-thinking → "monitor the `usage.output_tokens_details.thinking_tokens` field ... how many of the billed output tokens were internal reasoning"
- Đổi cấu hình thinking làm hỏng cache → cùng URL → "changing `budget_tokens` between requests invalidates cache breakpoints"

## [10] Chen, Zaharia, Zou. FrugalGPT (2023)
- Ba chiến lược, cascade, tới 98% → https://arxiv.org/abs/2305.05176 → "1) prompt adaptation, 2) LLM approximation, and 3) LLM cascade" ; "match the performance of the best individual LLM (e.g. GPT-4) with up to 98% cost reduction"

## [11] Ong và cộng sự. RouteLLM (2024)
- Router chọn model mạnh/yếu, giảm hơn 2 lần → https://arxiv.org/abs/2406.18665 → "dynamically select between a stronger and a weaker LLM during inference" ; "reduces costs-by over 2 times in certain cases-without compromising the quality"

## [12] Zilliz, GPTCache
- Semantic cache: embedding + vector store + similarity evaluator → https://github.com/zilliztech/GPTCache → "employs embedding algorithms to convert queries into embeddings and uses a vector store for similarity search"

## [13] Schroeder và cộng sự. vCache (2025, ICLR 2026)
- Semantic cache trả kết quả đã lưu cho prompt giống nghĩa; ngưỡng tĩnh gây lỗi → https://arxiv.org/abs/2502.03771 → "Semantic caches return cached responses for semantically similar prompts" ; "static thresholds do not give formal correctness guarantees, result in unexpected error rates"

## [14] Gill và cộng sự. MeanCache (2024, IPDPS 2025)
- Câu hỏi phụ thuộc ngữ cảnh gây false hit; ~31% truy vấn lặp lại → https://arxiv.org/abs/2403.02694 → "nor do they operate on contextual queries, leading to unacceptable false hit-and-miss rates" ; "repeated queries, which constitute about 31% of the total queries"

## [15] Jiang và cộng sự. LLMLingua (EMNLP 2023)
- Nén prompt tới 20× ít mất chất lượng (trên bộ dữ liệu thử) → https://arxiv.org/abs/2310.05736 → "allows for up to 20x compression with little performance loss"

## [16] Anthropic, Writing effective tools for agents (2025-09-11)
- Phân trang, lọc, cắt kết quả tool; Claude Code giới hạn 25.000 token → https://www.anthropic.com/engineering/writing-tools-for-agents → "pagination, range selection, filtering, and/or truncation" ; "For Claude Code, we restrict tool responses to 25,000 tokens by default."
- concise dùng ~1/3 token → cùng URL → "we use ~⅓ of the tokens with "concise" tool responses"

## [17] Anthropic, Effective context engineering for AI agents (2025-09-29)
- Compaction, tool result clearing → https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents → "taking a conversation nearing the context window limit, summarizing its contents" ; "One of the safest lightest touch forms of compaction is tool result clearing."
- Tập token nhỏ nhất có tín hiệu cao → cùng URL → "finding the smallest possible set of high-signal tokens"

## [18] OpenAI, Latency optimization
- Các nguyên tắc → https://developers.openai.com/api/docs/guides/latency-optimization → "Generate fewer tokens." ; "Use fewer input tokens." ; "Make fewer requests." ; "Don't default to an LLM."
- Prompt dài làm chậm token đầu → cùng URL → "A long prompt can delay the first token, especially when much of the input is new."

## [19] OpenAI, Vector embeddings
- Embedding tính theo token đầu vào → https://developers.openai.com/api/docs/guides/embeddings → "Usage is priced per input token."
- Giảm số chiều đổi chút độ chính xác lấy vector nhỏ → cùng URL → "trading off some accuracy in exchange for the smaller vector size"

## [20] Anthropic, Workspaces
- Spend limit theo workspace và cảnh báo → https://platform.claude.com/docs/en/manage-claude/workspaces → "click **Spend limits** to cap monthly spending and configure alerts when spending reaches certain thresholds"
- Workspace tách dự án/môi trường → cùng URL → "Use workspaces to separate different projects, environments, or teams"

## [21] Petrov và cộng sự. Tokenizers unfairness (NeurIPS 2023)
- Cùng nội dung, số token chênh tới 15 lần giữa ngôn ngữ, ảnh hưởng chi phí → https://arxiv.org/abs/2305.15425 → "with differences up to 15 times in some cases" ; "the cost of accessing commercial language services"

## Không dùng / chưa xác minh
- OpenTelemetry GenAI: trang cũ chuyển sang repo mới; chưa mở file định nghĩa thuộc tính token, nên không nêu tên thuộc tính trong trang (dẫn sang ../llm-observability/).
- GPTCache "10x/100x": README không kèm benchmark, không đưa vào trang như sự thật.
- Gemini explicit caching / phí lưu trữ: trang đã mở không nói, không đưa vào.
