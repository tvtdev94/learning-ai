# Research notes: LangChain (bài 1/3 của chuỗi LangChain / LangGraph / LangSmith)

Ngày truy cập mọi nguồn: 2026-11-18. Mỗi dòng: khẳng định → URL → câu trích ngắn làm bằng chứng.
Số [N] khớp với số nguồn trong `langchain/index.html`.

## Định nghĩa, sản phẩm, lịch sử
- [1] LangChain cung cấp `create_agent`, harness tối giản, cấu hình được → https://docs.langchain.com/oss/python/langchain/overview → "LangChain provides `create_agent`: a minimal, highly configurable harness."
- [1] Agent = Model + Harness; harness gồm prompt, tools, middleware → same → "The harness is everything around the model loop: the prompt, the tools, and any middleware that shapes behavior."
- [1] Agent của LangChain xây trên LangGraph → same → "LangChain's agents are built on top of LangGraph."
- [1] LangSmith để trace, debug, evaluate agent của mọi framework kể trên → same → "to trace, debug, and evaluate agents built with any of these frameworks"
- [1] Một interface chuẩn cho chat model, embeddings giữa các nhà cung cấp → same → "Use one interface for chat models, embeddings, and more across providers."
- [4] Lịch sử: 2022-10-24 v0.0.1 với LLM abstraction và chains → https://docs.langchain.com/oss/python/langchain/philosophy → "A month before ChatGPT, LangChain was launched as a Python package."
- [4] 2024-02 LangGraph ra đời vì thiếu lớp orchestration cấp thấp → same → "missing a low-level orchestration layer that allowed developers to control the exact flow of their agent"
- [4] 2024-10: phần lớn chains và agents bị đánh dấu deprecated → same → "Most chains and agents were marked as deprecated in LangChain with guides on how to migrate them to LangGraph."
- [4] 2025-10-20 v1.0.0: mọi chain và agent thay bằng một abstraction agent duy nhất xây trên LangGraph → same → "All chains and agents are now replaced with only one high level abstraction"
- [4] 2024-06 hơn 700 integrations tách khỏi gói lõi → same → "LangChain passed 700 integrations, which were split out of the core package"
- [4] 2023-06 LangSmith ra mắt → same → "LangSmith launched for observability and evals"
- [17] Blog công bố LangChain 1.0 và LangGraph 1.0 ngày 2025-10-22 → https://www.langchain.com/blog/langchain-langgraph-1dot0 → "We're releasing LangChain 1.0 and LangGraph 1.0 — our first major versions"
- [17] Cam kết không breaking change tới 2.0 → same → "no breaking changes until 2.0"
- [17] create_agent dùng LangGraph để chạy vòng lặp → same → "uses LangGraph under the hood to run this loop"
- [17] Khi nào dùng LangChain vs LangGraph → same → LangChain: "Agents that fit the default loop (model → tools → response)"; LangGraph: "Long running business process automation", "Highly custom or complex workflows"
- [17] Không bị khóa, có thể hạ xuống LangGraph → same → "LangChain agents are built on LangGraph, so you're not locked in."
- [18] Framework / runtime / harness: LangChain là framework, LangGraph là runtime, Deep Agents là harness → https://docs.langchain.com/oss/python/concepts/products → "Agent frameworks are generally higher level and run on agent runtimes." / "LangChain 1.0 is built on top of LangGraph"
- [18] Khi nào dùng LangChain → same → "You're building straightforward agent applications without complex orchestration needs."
- [18] Khi nào dùng LangGraph → same → "You're building complex workflows that combine deterministic and agentic steps."
- [37] README: LangChain là framework xây agent và ứng dụng LLM, giấy phép MIT → https://github.com/langchain-ai/langchain → "LangChain is a framework for building agents and LLM-powered applications." / "MIT license"
- [38] JS: `createAgent` từ gói `langchain`, gói tích hợp `@langchain/openai`… → https://docs.langchain.com/oss/javascript/langchain/overview → "import { createAgent, tool } from \"langchain\";"

## Phiên bản và trạng thái (đọc ngày 2026-11-18)
- [26] langchain bản mới nhất 1.5.0 ngày 2026-11-11, Requires-Python >=3.11 → https://pypi.org/project/langchain/ → "1.5.0", "<4.0.0, >=3.11.0"
- [28] langgraph 1.2.22 ngày 2026-11-14; dùng được không cần LangChain → https://pypi.org/project/langgraph/ → "can be used without LangChain"
- [27] langchain-classic 1.0.8 ngày 2026-06-10; mô tả legacy → https://pypi.org/project/langchain-classic/ → "Legacy chains, `langchain-community` re-exports, indexing API, deprecated functionality" / "In most cases, you should be using the main `langchain` package."
- [29] langchain-community đã archived trên PyPI (2026-06-24), README ghi đang sunset → https://pypi.org/project/langchain-community/ → "This project has been archived by its maintainers" / "langchain-community is being sunset"
- [30] Lý do sunset langchain-community (issue mở 2026-05-22) → https://github.com/langchain-ai/langchain-community/issues/674 → "effectively deprecated for more than a year"; "it is often simpler to implement tools directly in application code"; "broader adoption of MCP"
- [16] SemVer; LangChain và LangGraph 1.0 là LTS → https://docs.langchain.com/oss/python/versioning → "Both LangChain and LangGraph 1.0 are designated as LTS releases"
- [16] Bản 0.x ở chế độ MAINTENANCE tới 12/2026 → same → "Legacy versions (LangChain 0.3 and LangGraph 0.4) are in MAINTENANCE mode until December 2026"
- [16] Alpha/beta không có bảo đảm ổn định đầy đủ → same → Alpha "experimental and subject to significant changes"; beta "may undergo minor changes"
- [16] Deprecated bị xóa ở bản major sau → same → "APIs marked as `deprecated` will be removed in future major releases."
- [16] Deep Agents chưa 1.0, API có thể đổi giữa các minor → same → "the API may change between minor versions"

## v1: thay đổi, legacy
- [2] create_agent thay langgraph.prebuilt.create_react_agent → https://docs.langchain.com/oss/python/releases/langchain-v1 → "replacing `langgraph.prebuilt.create_react_agent`"
- [2] Middleware là tính năng định nghĩa create_agent → same → "Middleware is the defining feature of `create_agent`."
- [2] content_blocks: truy cập thống nhất, ban đầu chỉ một số integration → same → "provides unified access to modern LLM features across providers"; Anthropic, AWS, OpenAI, Google GenAI, Ollama
- [2] Structured output sinh ngay trong vòng lặp chính → same → "Structured output is now generated in the main loop instead of requiring an additional LLM call."
- [2] Legacy chuyển sang langchain-classic → same → "Legacy functionality has moved to `langchain-classic` to keep the core packages lean and focused."
- [3] Danh sách đã chuyển: legacy chains (LLMChain, ConversationChain), retrievers cũ, indexing API, hub, community re-exports → https://docs.langchain.com/oss/python/migrate/langchain-v1 → "Legacy chains (`LLMChain`, `ConversationChain`, etc.)"
- [3] Khuyên dùng create_agent thay create_react_agent → same → "Now, we recommend you use langchain.agents.create_agent to build agents."
- [3] v1 yêu cầu Python ≥ 3.10 (tại thời điểm v1) → same → "All LangChain packages now require Python 3.10 or higher." (PyPI hiện ghi ≥3.11, xem [26])
- [3] `.text()` thành property, dạng method bị bỏ ở v2 → same → "The method form will be removed in v2."
- [25] langchain-core định nghĩa abstraction gốc, Runnable và cú pháp ghép → https://reference.langchain.com/python/langchain-core/langchain_core → "The universal invocation protocol (Runnables) along with a syntax for combining components are also defined here." / "No third-party integrations are defined here."
- Ghi chú: không tìm thấy trang chính thức nói LCEL bị deprecated. Trang chỉ nói: Runnable vẫn ở langchain-core [25]; chain cũ ở langchain-classic [3]; v1 thay mọi chain bằng một abstraction agent [4]. Trang viết thận trọng theo đúng mức này.

## Model, message, tool
- [5] Chat model là động cơ suy luận; tiền tố Chat → https://docs.langchain.com/oss/python/langchain/models → "Models are the reasoning engine of agents." / "prefixed with "Chat", e.g., ChatOpenAI"
- [5] init_chat_model với chuỗi "provider:model" → same → "'{model_provider}:{model}' format"
- [5] invoke / stream / batch → same → "Send multiple requests to a model in a batch"; batch song song phía client
- [5] bind_tools; model chỉ trả về yêu cầu gọi tool → same → "you must bind them using bind_tools" / "a request to execute a tool"
- [5] with_structured_output (Pydantic, TypedDict, JSON Schema) → same
- [5] Tên model mới dùng ngay không cần cập nhật LangChain → same → "New model names work immediately — no LangChain update required"
- [5] Model profile là beta, dữ liệu từ models.dev → same → "Model profiles are a beta feature."
- [5] rate_limiter, InMemoryRateLimiter không giới hạn theo kích thước request → same
- [6] Message là đơn vị context cơ bản; role, content, metadata → https://docs.langchain.com/oss/python/langchain/messages → "Messages are the fundamental unit of context for models in LangChain."
- [6] 4 loại: SystemMessage, HumanMessage, AIMessage, ToolMessage; tool_call_id phải khớp → same → "Must match the ID of the tool call in the AIMessage."
- [6] content_blocks chuẩn hóa: thinking của Anthropic và reasoning của OpenAI thành block `reasoning`; `non_standard` là lối thoát → same → "Provider-specific escape hatch"
- [6] usage_metadata: input_tokens, output_tokens, total_tokens → same
- [6] tool_calls nằm trong AIMessage (name, args, id) → same → "When models make tool calls, they're included in the AIMessage."
- [7] Tool là hàm có input/output rõ ràng; model quyết định khi nào gọi → https://docs.langchain.com/oss/python/langchain/tools → "The model decides when to invoke a tool based on the conversation context"
- [7] @tool: tên lấy từ tên hàm, docstring thành description, type hints bắt buộc → same → "Type hints are **required** as they define the tool's input schema."
- [7] ToolRuntime: state (ngắn hạn), context (bất biến, user id), store (dài hạn) → same → "Immutable configuration passed at invocation time (user IDs, session info)."
- [7] Server-side tools của nhà cung cấp → same → "web search and code interpreters"
- [7] Tên snake_case vì một số provider từ chối khoảng trắng → same

## Agent, middleware, structured output
- [8] Agent là model gọi tools trong vòng lặp → https://docs.langchain.com/oss/python/langchain/agents → "An agent is a model calling tools in a loop until a given task is complete."
- [8] AgentState: messages chỉ thêm vào → same → "Append-only: new messages are added, never replaced."
- [8] Lưu lịch sử theo thread_id cần checkpointer → same → "Persisting conversation history with `thread_id` requires the agent to be configured with a checkpointer."
- [8] Giới hạn recursion mặc định 9.999 bước → same → "`create_agent` sets that limit to 9,999 steps."
- [8] Nên đặt recursion_limit nhỏ hơn hoặc dùng ModelCallLimitMiddleware → same
- [8] Prebuilt middleware chia 6 nhóm → same → execution environment, context management, planning/delegation, fault tolerance, guardrails, steering
- [9] Middleware không phải runtime riêng; hook chạy trong graph LangGraph đã compile → https://docs.langchain.com/oss/python/langchain/middleware/overview → "Middleware is not a separate runtime: hooks run inside the compiled LangGraph"
- [9] Mục đích: log, đổi prompt/chọn tool, retry/fallback, rate limit/guardrail/PII → same
- [10] 6 hook: before_agent, before_model, after_model, after_agent, wrap_model_call, wrap_tool_call → https://docs.langchain.com/oss/python/langchain/middleware/custom → "Before agent starts (once per invocation)"
- [10] Thứ tự: before_* đầu→cuối, after_* ngược lại, wrap_* lồng nhau → same → "`wrap_*` hooks: Nested (first middleware wraps all others)"
- [11] Danh sách built-in: tool retry, model retry, model fallback, summarization, HITL, model call limit, tool call limit, PII, to-do list, LLM tool selector, context editing… → https://docs.langchain.com/oss/python/langchain/middleware/built-in
- [11] ModelCallLimitMiddleware: thread_limit, run_limit, exit_behavior 'end' (mặc định) hoặc 'error' → same → "'end' (graceful termination) or 'error' (raise exception)"
- [11] PIIMiddleware: block/redact/mask/hash; apply_to_output mặc định False → same → "Check AI messages after model call."
- [11] SummarizationMiddleware: không đặt trigger thì không tự chạy → same → "If `trigger` is not provided, summarization will not trigger automatically."
- [11] Middleware riêng theo nhà cung cấp (Anthropic prompt caching, Bedrock caching, OpenAI moderation) → same
- [12] response_format: ToolStrategy, ProviderStrategy, hoặc schema để tự chọn → https://docs.langchain.com/oss/python/langchain/structured-output → "automatically selects best strategy based on model capabilities"
- [12] Kết quả trong structured_response → same → "returned in the `'structured_response'` key of the agent's state"
- [12] ProviderStrategy "the most reliable method when available" → same
- [12] ToolStrategy handle_errors mặc định True, gửi lỗi về model để thử lại → same
- [12] Dict JSON Schema phải bọc trong strategy → same → "JSON Schema dictionaries must be wrapped in an explicit strategy"
- [12] Model từ chối: ToolStrategy kết thúc không có structured_response → same → "With `ToolStrategy`, the agent ends without a `structured_response`."
- [33] HITL: interrupt_on, quyết định approve/edit/reject/respond; cần checkpointer và thread_id; resume bằng Command → https://docs.langchain.com/oss/python/langchain/human-in-the-loop → "You must configure a checkpointer to persist the graph state across interrupts."
- [33] Không dùng respond để từ chối tool có tác dụng phụ → same → "Do not use `respond` to deny side-effecting tools"
- [32] Agent hỏng thường do thiếu context đúng, không phải do model → https://docs.langchain.com/oss/python/langchain/context-engineering → "More often than not - it's actually the second reason that causes agents to not be reliable."
- [32] Middleware là cơ chế để làm context engineering → same → "the mechanism under the hood that makes context engineering practical"
- [31] MCPAdapter biến tool của MCP server thành tool LangChain; namespace langchain.mcp là beta, cần langchain[mcp]>=1.4.0 → https://docs.langchain.com/oss/python/langchain/mcp → "The langchain.mcp namespace requires langchain[mcp]>=1.4.0 and is in beta."

## Retrieval / RAG
- [13] Building blocks: document loaders, text splitters, embedding models, vector stores, retrievers → https://docs.langchain.com/oss/python/langchain/retrieval → "Ingest data from external sources (Google Drive, Slack, Notion, etc.), returning standardized Document objects."
- [13] Thay đổi được từng phần mà không viết lại logic → same → "you can swap loaders, splitters, embeddings, or vector stores without rewriting the app's logic"
- [13] 3 kiến trúc: 2-step, agentic, hybrid; bảng control/flexibility/latency → same → 2-Step "High" control, "Fast"; Agentic "Low" control, "Variable"
- [14] Vector store interface: add_documents, delete, similarity_search; Document có page_content, metadata; filter tùy implementation → https://docs.langchain.com/oss/python/integrations/vectorstores → "Support for metadata-based filtering varies between implementations."
- [15] Gói tích hợp langchain-<provider>, 1000+ integrations, đổi provider không đổi code → https://docs.langchain.com/oss/python/integrations/providers/overview → "an extensive ecosystem with 1000+ integrations"

## LangGraph, Deep Agents, LangSmith
- [19] LangGraph là framework orchestration cấp thấp và runtime cho agent chạy lâu, có state → https://docs.langchain.com/oss/python/langgraph/overview → "a low-level orchestration framework and runtime for long-running, stateful agents"
- [19] LangGraph không cần LangChain → same → "LangGraph does not require LangChain"
- [19] Lợi ích: checkpoint và resume, streaming, HITL, memory → same → "Checkpoint state and resume after failures or pauses."
- [20] Deep Agents: harness cho việc nhiều bước; planning, virtual filesystem, subagent, memory; xây trên LangChain và LangGraph → https://docs.langchain.com/oss/python/deepagents/overview → "adds planning, a virtual filesystem for context, subagent spawning, and long-term memory on top of LangChain and LangGraph"
- [21] LangSmith Observability: trace, dashboard, alert; làm việc với nhiều framework; cloud/hybrid/self-hosted → https://docs.langchain.com/langsmith/home → "LangSmith works with many frameworks and providers."
- [22] Trace không cần LangChain: wrap_openai, @traceable; LangChain/LangGraph bật bằng một biến môi trường → https://docs.langchain.com/langsmith/observability-quickstart → "can enable LangSmith tracing with a single environment variable"
- [23] Evaluation: offline trên dataset, online trên traffic thật; evaluator human/code/LLM-as-judge/pairwise → https://docs.langchain.com/langsmith/evaluation → "so a failure you saw once becomes a test you run every time"
- [24] Agent Server (tên mới của LangSmith Deployment): runtime durable, streaming, scale; framework-agnostic; cloud/hybrid/self-hosted/standalone → https://docs.langchain.com/langsmith/deployment → "LangSmith Deployment is now LangSmith Agent Server." / "Agent Server is framework-agnostic."

## Gọi thẳng SDK của nhà cung cấp: đánh đổi
- [34] Framework thêm lớp trừu tượng che prompt/response, khó debug; nên bắt đầu bằng API trực tiếp; nếu dùng framework phải hiểu code bên dưới → https://www.anthropic.com/engineering/building-effective-agents (2024-12-19) → "extra layers of abstraction that can obscure the underlying prompts and responses, making them harder to debug" / "Incorrect assumptions about what's under the hood are a common source of customer error."
- [35] SDK của Anthropic có tool runner tự chạy vòng lặp tool → https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview → "To skip writing this round trip yourself, use the tool runner: the SDK runs your tools and sends the results back automatically."
- [36] OpenAI Agents SDK: rất ít abstraction, ít primitive → https://openai.github.io/openai-agents-python/ → "very few abstractions" / "few enough primitives to make it quick to learn"

## Bổ sung sau review của kongming (2026-11-18)
- [39] LCEL vẫn được mô tả trong mã nguồn langchain-core; ghép bằng toán tử `|` → https://github.com/langchain-ai/langchain/tree/master/libs/core/langchain_core/runnables → `__init__.py`: "LangChain **Runnable** and the **LangChain Expression Language (LCEL)**." / "Programs created using LCEL and LangChain `Runnable` objects inherently support synchronous asynchronous, batch, and streaming operations."; `base.py`: "A RunnableSequence constructed using the `|` operator"
- [40] ModelCallLimitMiddleware kiểm ở before_model, đếm ở after_model; khi 'end' thêm AIMessage rồi jump_to end → https://github.com/langchain-ai/langchain/blob/master/libs/langchain_v1/langchain/agents/middleware/model_call_limit.py → "Check model call limits before making a model call." / `return {"jump_to": "end", "messages": [limit_ai_message]}` / "Model call limits exceeded: ..." / "Increment model call counts after a model call."
- [10] Lệnh nhảy 'end' đi qua after_agent → https://docs.langchain.com/oss/python/langchain/middleware/custom → "'end': Jump to the end of the agent execution (or the first `after_agent` hook)"
- [26] langchain 1.5.0 phụ thuộc cứng langgraph và langchain-core → https://pypi.org/pypi/langchain/1.5.0/json → requires_dist "langchain-core<2.0.0,>=1.8.0", "langgraph<1.3.0,>=1.2.12"
- [28] langgraph 1.2.22 phụ thuộc langchain-core → https://pypi.org/pypi/langgraph/1.2.22/json → requires_dist "langchain-core<2,>=1.4.7"
