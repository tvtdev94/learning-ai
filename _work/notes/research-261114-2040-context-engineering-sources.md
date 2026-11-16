# Ghi chú nguồn: Context engineering (2026-11-14)

Trang: `context-engineering/index.html`. Mỗi dòng: khẳng định → URL → câu trích làm bằng chứng. Tất cả URL đã mở bằng WebFetch ngày 2026-11-14.

## [1] Anthropic, Effective context engineering for AI agents (2025-09-29, Rajasekaran, Dixon, Ryan, Hadfield)
URL: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Context engineering là bước tiếp nối của prompt engineering → [1] → "we view context engineering as the natural progression of prompt engineering"
- Định nghĩa → [1] → "curating and maintaining the optimal set of tokens (information) during LLM inference"
- Prompt engineering = viết và tổ chức lời dặn; context engineering lặp lại mỗi lượt → [1] → "Prompt engineering refers to methods for writing and organizing LLM instructions for optimal outcomes" / "In contrast to the discrete task of writing a prompt, context engineering is iterative and the curation phase happens each time we decide what to pass to the model"
- Nguyên tắc chính → [1] → "finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome"
- Context là tài nguyên hữu hạn → [1] → "Context, therefore, must be treated as a finite resource with diminishing marginal returns"
- Attention budget → [1] → "LLMs have an “attention budget” that they draw on when parsing large volumes of context" / "Every new token introduced depletes this budget by some amount."
- n² quan hệ → [1] → "This results in n² pairwise relationships for n tokens."
- Context rot → [1] → "the model’s ability to accurately recall information from that context decreases"
- Cửa sổ lớn hơn không giải quyết hết → [1] → "context windows of all sizes will be subject to context pollution and information relevance concerns"
- System prompt "đúng độ cao" → [1] → "ideas at the right altitude for the agent" / "brittle if-else hardcoded prompts"
- Bộ tool tối thiểu → [1] → "bloated tool sets that cover too much functionality or lead to ambiguous decision points" / "curating a minimal viable set of tools"
- Ví dụ mẫu → [1] → "curate a set of diverse, canonical examples" / không "stuff a laundry list of edge cases into a prompt"
- Just-in-time, lightweight identifiers → [1] → "maintain lightweight identifiers (file paths, stored queries, web links, etc.)" / "dynamically load data into context at runtime using tools"
- Progressive disclosure → [1] → "allows agents to incrementally discover relevant context through exploration"
- Hybrid (Claude Code) → [1] → "CLAUDE.md files are naively dropped into context up front" / "primitives like glob and grep allow it to navigate its environment and retrieve files just-in-time"
- Đánh đổi JIT → [1] → "runtime exploration is slower than retrieving pre-computed data" / "an agent can waste context by misusing tools, chasing dead-ends, or failing to identify key information"
- Compaction → [1] → "taking a conversation nearing the context window limit, summarizing its contents" / "reinitiating a new context window with the summary"
- Compaction giữ gì → [1] → "The model preserves architectural decisions, unresolved bugs, and implementation details"
- Rủi ro compaction → [1] → "overly aggressive compaction can result in the loss of subtle but critical context" / "Start by maximizing recall" ... "then iterate to improve precision"
- Tool result clearing nhẹ nhất → [1] → "One of the safest lightest touch forms of compaction is tool result clearing"
- Structured note-taking → [1] → "the agent regularly writes notes persisted to memory outside of the context window" / "After context resets, the agent reads its own notes"
- Sub-agent → [1] → "specialized sub-agents can handle focused tasks with clean context windows" / "returns only a condensed, distilled summary of its work (often 1,000-2,000 tokens)"
- Chọn kỹ thuật theo loại việc → [1] → "Compaction maintains conversational flow for tasks requiring extensive back-and-forth" / "Note-taking excels for iterative development with clear milestones" / "Multi-agent architectures handle complex research and analysis where parallel exploration pays dividends"

## [2] Anthropic, Context windows (tài liệu Claude API)
URL: https://platform.claude.com/docs/en/build-with-claude/context-windows
- Context window = working memory → [2] → "represents a “working memory” for the model"
- Context rot → [2] → "As token count grows, accuracy and recall degrade, a phenomenon known as context rot."
- Mọi thứ đều tính → [2] → "Everything in the request counts toward the context window: the system prompt, every message in messages (including tool results, images, and documents), and your tool definitions. The output Claude generates for the turn, including its extended thinking, counts too."
- Lịch sử tích lũy → [2] → "each user message and assistant response accumulates within the context window, and previous turns are preserved completely"
- Cỡ cửa sổ → [2] → "up to 1M tokens, depending on the model" / "Other Claude models ... have a 200k-token context window."
- Chat app có thể FIFO → [2] → "can also manage the context window on a rolling “first in, first out” basis"
- Cache vẫn chiếm chỗ → [2] → "Cached prompt prefixes still occupy the context window: prompt caching changes what you pay for those tokens, not whether they count."
- Tràn → [2] → "If the input alone already exceeds the model’s context window, the API returns a 400 invalid_request_error (“prompt is too long”)" / với 4.5+ input + max_tokens vượt thì "stops with stop_reason: model_context_window_exceeded"
- usage → [2] → "Every response reports what the request consumed in its usage field."

## [3] Chroma, Context Rot (2025-07-14, Hong, Troynikov, Huber)
URL: https://www.trychroma.com/research/context-rot
- 18 LLM, kể cả việc đơn giản → [3] → "model performance varies significantly as input length changes, even on simple tasks"
- Distractor → [3] → một distractor đã làm giảm độ chính xác so với baseline; bốn distractor giảm thêm
- LongMemEval → [3] → prompt tập trung (~300 token) tốt hơn prompt đầy đủ (~113k token) với mọi model
- Cách trình bày → [3] → "what matters more is how that information is presented"

## [4] Liu và cộng sự, Lost in the Middle (TACL 2023)
URL: https://arxiv.org/abs/2307.03172
- Vị trí → [4] → "performance is often highest when relevant information occurs at the beginning or end of the input context" / "significantly degrades when models must access relevant information in the middle of long contexts"

## [5] LangChain, Context Engineering for Agents (2025-07-02)
URL: https://www.langchain.com/blog/context-engineering-for-agents
- CPU/RAM (Karpathy) → [5] → "The LLM is like the CPU and its context window is like the RAM, serving as the model's working memory."
- Bốn chiến lược write/select/compress/isolate → [5] → "Writing context means saving it outside the context window" / "Selecting context means pulling it into the context window" / "Compressing context involves retaining only the tokens required" / "Isolating context involves splitting it up"
- Bốn lỗi (Drew Breunig) → [5] → "Context Poisoning: When a hallucination makes it into the context" / "Context Distraction: When the context overwhelms the training" / "Context Confusion: When superfluous context influences the response" / "Context Clash: When parts of the context disagree"
- Agent tốn token → [5] → "Agent interactions can span hundreds of turns and use token-heavy tool calls."

## [6] Anthropic, Compaction overview (tài liệu Claude API)
URL: https://platform.claude.com/docs/en/build-with-claude/compaction
- Compaction thay lượt cũ bằng tóm tắt → [6] → "Compaction replaces the older turns of a conversation with a summary" / "it keeps the active context small, because response quality degrades as a conversation grows"
- Giữ nguyên lượt gần → [6] → "Compaction that keeps recent turns: when the last few turns must reach Claude word for word"
- Prompt tóm tắt riêng → [6] → "Write your own summarization prompt: when the default summary drops something a later turn needs"

## [7] Anthropic, Context editing (tài liệu Claude API)
URL: https://platform.claude.com/docs/en/build-with-claude/context-editing
- Clearing → [7] → "Older tool results (such as file contents or search results) are no longer needed once Claude has processed them." / "replaces each cleared result with placeholder text"
- Mặc định → [7] → trigger "100,000 input tokens"; keep "3 tool uses"
- Phá cache → [7] → "Invalidates cached prompt prefixes when content is cleared" / clear_at_least "helps determine whether context clearing is worth breaking your prompt cache"
- Kết hợp memory → [7] → "Claude receives an automatic warning to preserve important information"

## [8] Anthropic, Memory tool (tài liệu Claude API)
URL: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
- Bộ nhớ file ngoài context → [8] → "store and retrieve information across conversations in a directory of memory files" / "without keeping everything in the context window"
- JIT → [8] → "Memory supports just-in-time context retrieval."
- Client-side → [8] → "The memory tool operates client-side"
- Kết hợp compaction → [8] → "compaction keeps the active context small ..., and memory preserves the information that must survive summarization"
- Multisession → [8] → progress log, feature checklist; "Each new session opens by reading those memory files."

## [9] Anthropic, Tool search tool (tài liệu Claude API)
URL: https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool
- Context bloat → [9] → "can consume ~55k tokens in definitions before Claude does any work. Tool search typically reduces this by over 85 percent"
- Độ chính xác chọn tool → [9] → "Claude’s ability to pick the right tool degrades once you exceed 30–50 available tools."
- Là một dạng JIT → [9] → "an instance of the broader just-in-time retrieval principle"

## [10] Anthropic, Writing effective tools for agents (2025-09-11, Ken Aizawa)
URL: https://www.anthropic.com/engineering/writing-tools-for-agents
- Phân trang/lọc/cắt → [10] → "some combination of pagination, range selection, filtering, and/or truncation with sensible default parameter values"
- 25.000 token → [10] → "For Claude Code, we restrict tool responses to 25,000 tokens by default."
- Hướng dẫn khi cắt → [10] → "If you choose to truncate responses, be sure to steer agents with helpful instructions."
- concise vs detailed → [10] → "detailed tool response (206 tokens)" / "concise tool response (72 tokens)" / "~⅓ of the tokens"
- Chỉ trả tín hiệu cao → [10] → "return only high signal information back to agents" / tránh "uuid, 256px_image_url, mime_type"

## [11] Anthropic, How we built our multi-agent research system (2025-06-13)
URL: https://www.anthropic.com/engineering/multi-agent-research-system
- Token giải thích 80% → [11] → "token usage by itself explains 80% of the variance"
- Chi phí → [11] → "agents typically use about 4× more tokens than chat interactions" / "multi-agent systems use about 15× more tokens than chats"
- Hiệu quả → [11] → "outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval"
- Nén nhờ sub-agent → [11] → "Subagents facilitate compression by operating in parallel with their own context windows"
- Lưu kế hoạch → [11] → "if the context window exceeds 200,000 tokens it will be truncated and it is important to retain the plan"
- Tham chiếu nhẹ → [11] → "store their work in external systems, then pass lightweight references back to the coordinator"

## [12] Anthropic, Prompt caching (tài liệu Claude API)
URL: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Đọc cache → [12] → "Cache read tokens are 0.1 times the base input tokens price (see the table footnote for per-model exceptions)."
- Ghi cache → [12] → "Cache write tokens with a 5-minute TTL are 1.25 times the base input tokens price."
- TTL → [12] → "By default, the cache has a 5-minute lifetime."
- Thứ tự → [12] → "Cache prefixes are created in the following order: tools, system, then messages."
- Vô hiệu → [12] → "Changes at each level invalidate that level and all subsequent levels." / "Modifying tool definitions ... invalidates the entire cache"

## [13] Manus (Yichao 'Peak' Ji), Context Engineering for AI Agents: Lessons from Building Manus (2025-07-18)
URL: https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
- KV-cache → [13] → "the KV-cache hit rate is the single most important metric for a production-stage AI agent"
- 100:1 → [13] → "the average input-to-output token ratio is around 100:1"
- Prefix ổn định → [13] → "even a single-token difference can invalidate the cache from that token onward" / "Make your context append-only."
- Nén khôi phục được → [13] → "Our compression strategies are always designed to be restorable." / "the content of a web page can be dropped from the context as long as the URL is preserved"
- todo.md → [13] → "By constantly rewriting the todo list, Manus is reciting its objectives into the end of the context."
- Giữ lỗi → [13] → "Erasing failure removes evidence. And without evidence, the model can't adapt."

## Bổ sung khi áp dụng kongming review (2026-11-16, mở lại bằng WebFetch)
- [2] Thinking cũng tính vào cửa sổ → https://platform.claude.com/docs/en/build-with-claude/context-windows → "The output Claude generates for the turn, including its extended thinking, counts too."
- [2] Điều kiện stop_reason → https://platform.claude.com/docs/en/build-with-claude/context-windows → "On Claude 4.5 models and newer, if input tokens plus `max_tokens` exceeds the context window size, the API accepts the request. If generation then reaches the context window limit, it stops with `stop_reason: "model_context_window_exceeded"`."
- [2] Compaction đang beta → https://platform.claude.com/docs/en/build-with-claude/context-windows → "It is available in beta for Claude 4.6 and later models"
- [3] Distractor → https://www.trychroma.com/research/context-rot → "Even a single distractor reduces performance relative to the baseline"
- [3] LongMemEval không gồm cả 18 model → https://www.trychroma.com/research/context-rot → "Not all 18 models are included in each experiement due to context window or thinking_budget constraints."
- [6] Compaction beta → https://platform.claude.com/docs/en/build-with-claude/compaction → "both it and Compaction at a token threshold are in beta"
- [7] Context editing cần beta header → https://platform.claude.com/docs/en/build-with-claude/context-editing → "This requires the beta header `context-management-2025-06-27`."
- [9] 55k là cấu hình nhiều server (không ghi chữ MCP) → https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool → "A typical multiserver setup (GitHub, Slack, Sentry, Grafana, and Splunk) can consume ~55k tokens in definitions"
- [11] 80% là trên BrowseComp → https://www.anthropic.com/engineering/multi-agent-research-system → "three factors explained 95% of the performance variance" / "token usage by itself explains 80% of the variance"
- [11] Méo thông tin qua nhiều tầng → https://www.anthropic.com/engineering/multi-agent-research-system → "Subagent output to a filesystem to minimize the 'game of telephone.'" / "This prevents information loss during multi-stage processing"
- [12] TTL và làm mới → https://platform.claude.com/docs/en/build-with-claude/prompt-caching → "By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used."
- [12] Ngoại lệ giá đọc cache → https://platform.claude.com/docs/en/build-with-claude/prompt-caching → "Cache hits and refreshes on Claude Opus 5.5 and Claude Sonnet 5.5 are priced at 0.05x the base input price."

## [14] Anthropic, Compaction on demand (tài liệu Claude API, truy cập 2026-11-16)
URL: https://platform.claude.com/docs/en/build-with-claude/compaction-on-demand
- Lần tóm tắt tính phí như request thường → [14] → "The summarization call is billed and rate-limited like any other request"
- Beta → [14] → frontmatter "status: beta", "betaHeader: compact-2026-09-04"

## Số liệu minh họa trong trang
Mọi số token trong ví dụ từng bước và mô phỏng (2.500 system prompt, 18.000 tool definitions, kết quả tool 12.000…) là minh họa, ghi rõ "minh họa" trong trang. Chỉ các số có nguồn ở trên được nêu như sự thật.
