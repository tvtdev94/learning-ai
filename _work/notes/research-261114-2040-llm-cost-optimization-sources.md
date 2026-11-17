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

---

# Kiểm lại 2026-11-17 (mở lại mọi URL bằng WebFetch; số [N] dưới đây là số dùng trong trang `llm-cost-optimization/index.html`)

Thứ tự nguồn giữ nguyên [1]–[21], trừ [9] đổi URL (trang extended thinking đã thành "legacy"). Thêm [22]–[24].

## Thay đổi so với ghi chú 2026-11-14
- [1]/[2] Hệ số đọc cache KHÔNG còn 0,1× cho mọi model → https://platform.claude.com/docs/en/about-claude/pricing → "Cache hits and refreshes on Claude Opus 5.5 and Claude Sonnet 5.5 are priced at 0.05x the base input price." ; "Cache hits and refreshes on Claude Fable 5.2, Claude Mythos 5.2, Claude Fable 5.1, and Claude Mythos 5.1 are priced at 0.025x" ; "All other models use the standard 0.1x multiplier."
- [2] Bảng giá hôm nay (USD/MTok, base input / 5m write / 1h write / cache hit / output) → cùng URL → "Claude Opus 5.5 | $4 / MTok | $5 / MTok | $8 / MTok | $0.20 / MTok | $20 / MTok" ; "Claude Sonnet 5.5 | $2 / MTok | $2.50 / MTok | $4 / MTok | $0.10 / MTok | $10 / MTok" ; "Claude Haiku 5.5 (for prompts up to 100,000 tokens) | $0.10 / MTok | $0.125 / MTok | $0.20 / MTok | $0.01 / MTok | $0.50 / MTok"
- [2] Haiku 5.5 tính giá cao hơn khi prompt > 100.000 token → cùng URL → "Claude Haiku 5.5 (for prompts over 100,000 tokens) | $0.50 / MTok ... | $2.50 / MTok" ; "a request over the threshold pays the higher prices even when part of its prompt is a cache hit"
- [2] Tokenizer mới ra nhiều token hơn ~30% → cùng URL → "This tokenizer produces approximately 30% more tokens for the same text. The exact increase depends on the content and workload shape."
- [2] Hòa vốn cache → cùng URL → "5-minute duration (1.25x write): after one cache read" ; "1-hour duration (2x write): after two cache reads"
- [2] Cộng dồn → cùng URL → "These multipliers stack with other pricing modifiers, including the Batch API discount and data residency."
- [2] Vùng dữ liệu US 1,1× → cùng URL → "specifying US-only inference through the `inference_geo` parameter incurs a 1.1x multiplier on all token pricing categories"
- [2] Chiến lược → cùng URL → "Choose Haiku for simple tasks, Sonnet for most production workloads, and Opus for the most complex reasoning." ; "Use the Batch API for non-time-sensitive tasks." ; "Track token consumption to identify optimization opportunities."
- [2] Tool use system prompt → cùng URL → "Claude Sonnet 5.5 | 286 tokens"
- [1] Tối đa 4 breakpoint, có automatic caching → https://platform.claude.com/docs/en/build-with-claude/prompt-caching → "You can define up to 4 cache breakpoints" ; "Add a single `cache_control` field at the top level of your request. The system automatically applies the cache breakpoint to the last cacheable block"
- [1] Ngưỡng tối thiểu nay khác theo model → cùng URL → "512 tokens for ... Claude Opus 5.5 ... Claude Sonnet 5.5 ... and Claude Haiku 5.5" ; "4,096 tokens for Claude Haiku 4.5" ; "no error is returned"
- [1] Batch + cache vẫn best-effort → cùng URL → "cache hits are provided on a best-effort basis"
- [1] Cách ly theo workspace trên Claude API → cùng URL → "Caches are also isolated by workspace within an organization on the Claude API"
- [3] OpenAI: ghi cache 1,25× với vòng đời mặc định 30 phút; 12 giờ thì 2,5× → https://developers.openai.com/api/docs/guides/prompt-caching → "cache writes cost 1.25× the standard, uncached input-token rate for the default 30-minute lifetime" ; "a 12-hour minimum lifetime at a write rate of 2.5× ordinary input"
- [3] OpenAI: tối thiểu 1.024 token; không bảo đảm trúng → cùng URL → "The minimum cacheable prompt length is 1,024 tokens for GPT-5.6 and later" ; "maintaining a session doesn't guarantee a cache hit."
- [3] cached_tokens chỉ đếm lần đọc → cùng URL → "`cached_tokens` counts billed reads and excludes tokens charged as writes"
- [4] Gemini: implicit mặc định từ 2.5; tối thiểu 2.048–4.096 token; explicit không có trên Gemini 4 → https://aistudio.google.com/docs/caching → "Implicit caching is enabled by default for all Gemini 2.5 and newer models." ; bảng "Gemini 2.5 Flash | 2,048" , "Gemini 4 Argon | 4,096". Trang không nói TTL, phí lưu trữ hay mức giảm cụ thể → không đưa vào trang.
- [5] OpenAI Batch: tối đa 50.000 request, 200 MB; request đã xong vẫn tính phí → https://developers.openai.com/api/docs/guides/batch → "A single batch may include up to 50,000 requests, and a batch input file can be up to 200 MB in size." ; "You will be charged for tokens consumed from any completed requests."
- [6] Anthropic Batch: kết quả giữ 29 ngày → https://platform.claude.com/docs/en/build-with-claude/batch-processing → "Batch results are available for 29 days after creation."
- [7] Token giải thích 80% phương sai hiệu năng → https://www.anthropic.com/engineering/multi-agent-research-system → "token usage by itself explains 80% of the variance"
- [8] OpenAI khuyên chừa ≥25.000 token cho reasoning+output → https://developers.openai.com/api/docs/guides/reasoning → "OpenAI recommends reserving at least 25,000 tokens for reasoning and outputs" ; "you could incur costs for input and reasoning tokens without receiving a visible response"

## [9] (URL mới) Anthropic, Steering thinking
- Trang extended thinking đánh dấu legacy → https://platform.claude.com/docs/en/build-with-claude/extended-thinking → "Extended thinking is a legacy feature."
- Thinking tính như output, tính toàn bộ chứ không phải bản tóm tắt → https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost → "Tokens Claude uses while thinking (billed as output tokens)" ; "You are billed for the full thinking process, not the thinking content visible in the response."
- Trường đo → cùng URL → "read `usage.output_tokens_details.thinking_tokens` in the response"
- Đổi effort có thể làm hỏng cache → cùng URL → "The resolved effort value is rendered into the prompt, so changing it between requests can invalidate cache breakpoints."
- Hai cần gạt chi phí → cùng URL → "`max_tokens` is a hard cap on total output for the request, thinking and response text combined." ; "In a tool-use loop, each request in the turn has its own `max_tokens`, so it doesn’t bound the whole turn’s spend." ; "`effort` is soft guidance"
- Giảm effort trước khi dùng lời nhắc → cùng URL → "If you want Claude to think less often, lower the effort level before reaching for prompt-based steering."

## Nguồn mới
## [22] Anthropic, Usage and Cost Analytics API (beta)
- Phân bổ chi phí theo chiều → https://platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api → "reports historical token usage and cost for your organization, broken down by the dimensions you choose, such as model, workspace, API key" ; "Attribute spend: Break down cost and token usage by workspace, API key, model, service tier"
## [23] OpenAI, Flex processing
- Giá như Batch, đổi lấy chậm hơn, có thể 429 không tính phí → https://developers.openai.com/api/docs/guides/flex-processing → "Tokens are priced at Batch API rates, with additional discounts from prompt caching." ; "in exchange for slower response times and occasional resource unavailability" ; "`429 Resource Unavailable`" ; "You will not be charged when this occurs." ; "model evaluations, data enrichment, and asynchronous workloads" ; "Flex processing is in beta with limited model availability."
## [24] OpenAI, Model selection
- Đặt tiêu chí trước, giữ mức nhẹ nhất đạt chuẩn → https://developers.openai.com/api/docs/guides/model-selection → "Choose acceptance criteria before comparing models" ; "keep the lightest setting that meets your quality bar." ; "Repeat the comparison across representative tasks."

## Kiểm lại các nguồn còn lại (khớp ghi chú cũ)
- [10] FrugalGPT: "up to 98% cost reduction" (Chen, Zaharia, Zou, 2023) ✓
- [11] RouteLLM: "reduces costs-by over 2 times in certain cases-without compromising the quality of responses" ✓ ; không ghi venue hội nghị.
- [12] GPTCache: "you may encounter false positives during cache hits and false negatives during cache misses" ; "we no longer add support for new API or models." (MIT) ✓
- [13] vCache: "up to 12.5× higher cache hit and 26× lower error rates" ; ICLR 2026 ✓
- [14] MeanCache: "about 31% of the total queries" (abstract không nêu nguồn số liệu) ; IPDPS 2025 ✓
- [15] LLMLingua: "up to 20x compression with little performance loss" ; GSM8K, BBH, ShareGPT, Arxiv-March23 ; EMNLP 2023 ✓
- [16] Writing tools: "restrict tool responses to 25,000 tokens by default" ; "~⅓ of the tokens" ✓
- [17] Context engineering: "tool result clearing" ; "smallest possible set of high-signal tokens" ✓
- [18] Latency: "Generate fewer tokens." "Use fewer input tokens." "Make fewer requests." "Don't default to an LLM." ✓
- [19] Embeddings: "Usage is priced per input token." ; "trading off some accuracy in exchange for the smaller vector size." ✓
- [20] Workspaces: "Cap monthly spending for a workspace." ; "set up email alerts for when spending reaches an amount you choose" (khi Anthropic bill trực tiếp) ; "You cannot set spend limits on the Default Workspace." ✓
- [21] Petrov: "differences up to 15 times in some cases" ; NeurIPS 2023 ✓

## Bổ sung sau review kongming (2026-11-17)
## [25] OpenAI, Cost optimization
- Các chiến lược giảm chi phí → https://developers.openai.com/api/docs/guides/cost-optimization → "Reduce requests" ; "Minimize tokens": "Lower the number of input tokens and optimize for shorter model outputs." ; "Select a smaller model" ; "Batch API" ; "Flex processing"
## Kiểm thêm
- [3] Vòng đời cache OpenAI theo thế hệ model → https://developers.openai.com/api/docs/guides/prompt-caching → GPT-5.6+: "`"30m"` (default) | 30 minutes" , "`"12h"` | 12 hours" ; model cũ: "`in_memory`: Entries typically remain active for around 5 to 10 minutes of inactivity, up to one hour." , "up to 24 hours for `24h`"
- [1] Request song song → https://platform.claude.com/docs/en/build-with-claude/prompt-caching → "For concurrent requests, note that a cache entry only becomes available after the first response starts."
- [1] JSON key order áp cho khối tool_use → cùng URL → "Verify that the keys in your `tool_use` content blocks have stable ordering"
- [4] Gemini chỉ nói "tăng khả năng" trúng → https://aistudio.google.com/docs/caching → "To increase the chance of an implicit cache hit:"
- [2] Fast mode → https://platform.claude.com/docs/en/about-claude/pricing → "Fast mode provides up to 2.5x higher output tokens per second at premium pricing." ; "Claude Opus 5.5 | $8 USD / MTok | $40 USD / MTok" ; "Fast mode is not available with the Batch API."
- [2] Computer toolset → cùng URL → "Declaring `computer_toolset_20260801` with its default members adds about 4,500 input tokens to a request"
- [2] Mức 0,025× → cùng URL → "Cache hits and refreshes on Claude Fable 5.2, Claude Mythos 5.2, Claude Fable 5.1, and Claude Mythos 5.1 are priced at 0.025x the base input price."
- [11] RouteLLM dùng "human preference data" (dữ liệu người chấm), không phải sở thích của người dùng hệ thống.
