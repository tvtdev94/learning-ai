# Ghi chú nguồn: LangGraph (langgraph)

Ngày nghiên cứu: 2026-11-18 (Asia/Saigon). Mọi URL dưới đây đã mở bằng WebFetch ngày 2026-11-18 (URL docs.langchain.com cũng đã kiểm HTTP 200 bằng curl). Dạng: khẳng định → URL → trích ngắn làm bằng chứng.

Phạm vi: bài 2/3 của loạt LangChain / LangGraph / LangSmith. Tài liệu Python là tham chiếu chính.

## [1] LangGraph overview
- LangGraph là framework điều phối mức thấp + runtime cho agent chạy lâu, có state → https://docs.langchain.com/oss/python/langgraph/overview → "LangGraph is a low-level orchestration framework and runtime for long-running, stateful agents."
- Không quy định prompt hay kiến trúc agent → cùng URL → "does not prescribe prompts or agent architecture"
- Dùng khi cần kiểm soát state và luồng → cùng URL → "when you need explicit control over state and control flow"
- Lợi ích: persistence, HITL, memory, streaming → cùng URL → "Checkpoint state and resume after failures or pauses." / "Pause execution, inspect or edit state, then continue." / "Short-term thread state and longer-term memory across sessions." / "Stream tokens, state updates, and other events as the graph runs."
- Trộn node viết tay và node do model quyết định → cùng URL → "Combine hand-coded nodes with model-driven nodes in one graph."
- Không bắt buộc LangChain → cùng URL → "LangGraph does not require LangChain"
- LangChain = agent framework; LangGraph = orchestration runtime; LangChain "Integrations and agent abstractions built on LangGraph"; Deep Agents cũng trên LangGraph → cùng URL.
- LangSmith = nền tảng tracing, evaluation, prompts, deployment → cùng URL → "the platform for tracing, evaluation, prompts, and deployment across frameworks."

## [2] Graph API overview
- State / Nodes / Edges → https://docs.langchain.com/oss/python/langgraph/graph-api → "A shared snapshot of the application." / "Functions that read state, do work, and return updates." / "Fixed or conditional transitions that determine the next node."
- Pregel, super-step → cùng URL → "LangGraph runs graphs with message passing, in the style of Google's Pregel system." / "Execution advances in discrete super-steps" / "Nodes that run in parallel share one super-step."
- Kích hoạt và kết thúc → cùng URL → "A node becomes active when it receives input on an incoming edge." / "The run ends when every node is inactive and no messages remain in transit."
- Reducer mặc định ghi đè; add_messages nối và cập nhật theo ID; operator.add không sửa được message khi HITL → cùng URL → "With no reducer, updates overwrite the previous value." / "appends new messages and updates existing ones by ID" / "Plain `operator.add` only appends, so it cannot update an existing message in place during human-in-the-loop edits."
- START, END → cùng URL → "START is the virtual entry that delivers user input into the graph." / "`END` marks a terminal edge."
- Conditional edge trả về tên node, END, list (fan-out) hoặc Send → cùng URL → "The routing function can return a node name, `END`, a list of names (fan-out), or Send objects for map-reduce."
- Send cho map-reduce → cùng URL → "Use Send when you need to run the same node once per item, each with its own input"
- Command: vừa cập nhật state vừa chọn bước tiếp → cùng URL → "Use Command when a single step must both update state and choose what runs next."
- Recursion limit: từ 1.1.4 mặc định 10.007 super-step; vượt thì GraphRecursionError → cùng URL → "Starting in version 1.1.4, the default is 10,007 super-steps."
- Phải compile; compile kiểm cấu trúc và gắn checkpointer → cùng URL → "You must compile the graph before you invoke or stream it." / "It is also where you attach runtime options such as checkpointers and breakpoints."
- Schema input/output/private; không ẩn khỏi streaming → cùng URL → "They do not hide channels from streaming by default."

## [3] Define and update state
- Node trả update, không mutate → https://docs.langchain.com/oss/python/langgraph/graph-api-state → "Nodes should return updates to the state directly, instead of mutating the state."
- Không reducer thì update thay giá trị cũ → cùng URL → "If no reducer is specified, updates to that key replace the previous value."
- MessagesState, add_messages → cùng URL → "For convenience, subclass the prebuilt `MessagesState`"
- Overwrite bỏ qua reducer → cùng URL → "When a node returns a value wrapped with `Overwrite`, the reducer is bypassed"

## [4] Build sequences, branches, and loops
- Vòng lặp cần điều kiện dừng → https://docs.langchain.com/oss/python/langgraph/graph-api-control-flow → "A loop needs a way to stop." / "a conditional edge that routes to END when a termination condition is met."
- Recursion limit tính theo super-step → cùng URL → "The limit is the number of super-steps allowed before LangGraph raises an error."
- Chạy song song cùng super-step, fan-in → cùng URL → "nodes "b" and "c" are executed concurrently in the same superstep."
- Super-step có tính giao dịch → cùng URL → "the superstep is **transactional**: if any branch raises, **none** of that superstep's updates apply to state."
- Có checkpointer thì node thành công không chạy lại → cùng URL → "results from successful nodes in a completed superstep are saved and do not repeat when the run resumes."

## [5] LangGraph runtime (Pregel)
- Pregel là runtime; compile StateGraph hoặc @entrypoint đều ra Pregel → https://docs.langchain.com/oss/python/langgraph/pregel → "Compiling a StateGraph or creating an @entrypoint produces a Pregel instance"
- 3 pha Plan / Execution / Update → cùng URL → "Determine which actors to execute in this step." / "Execute all selected actors in parallel" / "Update the channels with the values written by the actors in this step."
- Update chưa thấy được tới step sau → cùng URL → "channel updates are invisible to actors until the next step."
- Channel: LastValue mặc định, Topic, BinaryOperatorAggregate → cùng URL.

## [6] Persistence
- Checkpointer lưu state theo thread; phục vụ hội thoại, HITL, time travel, fault tolerance → https://docs.langchain.com/oss/python/langgraph/persistence → "conversation continuity, human-in-the-loop workflows, time travel, and fault tolerance."
- InMemorySaver mất khi restart; production dùng checkpointer bền → cùng URL → "When the process restarts, all checkpoints are lost." / "Use a persistent checkpointer for production"
- Store cho memory dài hạn xuyên thread → cùng URL → "Use them for long-term, cross-thread memory, including user preferences, facts, and shared knowledge."
- Agent Server tự lo persistence → cùng URL → "The server handles persistence infrastructure behind the scenes."
- Checkpoint tích lũy → cùng URL → "Over long conversations, checkpoints accumulate."

## [7] Checkpointers
- Checkpoint mỗi super-step, tổ chức theo thread → https://docs.langchain.com/oss/python/langgraph/checkpointers → "A checkpointer saves a snapshot of graph state at each super-step, organized into threads."
- Thread_id là khóa chính → cùng URL → "The checkpointer uses `thread_id` as the primary key for storing and retrieving checkpoints."
- StateSnapshot: values, next, config, metadata (source, writes, step), created_at, parent_config, tasks → cùng URL.
- get_state / get_state_history (mới nhất đứng đầu) → cùng URL.
- Pending writes: node thành công không chạy lại → cùng URL → "When you resume graph execution from that super-step you don't re-run the successful nodes."
- Thư viện: langgraph-checkpoint (kèm sẵn), -sqlite (thử nghiệm), -postgres (production), mongodb, Azure Cosmos DB → cùng URL.
- Durability mode exit / async / sync → cùng URL → "persists changes only when graph execution exits" / "persists changes asynchronously while the next step executes" / "persists changes synchronously before the next step starts"
- Mã hóa EncryptedSerializer, LANGGRAPH_AES_KEY → cùng URL.

## [8] Fault tolerance
- Retry chạy lại cả node từ đầu; checkpoint ở ranh giới super-step → https://docs.langchain.com/oss/python/langgraph/fault-tolerance → "A retry re-runs the entire node function from the start." / "Checkpoints are written at super-step boundaries, not mid-function."
- Ngữ nghĩa at-least-once; side effect phải idempotent → cùng URL → "That gives **at-least-once** semantics for node execution" / "Application code must make those effects idempotent."
- Khóa idempotency lấy từ state đã bền → cùng URL → "Derive the key from state that is already durable"
- RetryPolicy mặc định max_attempts 3 → cùng URL.
- Task bên trong node để resume bỏ qua phần đã xong → cùng URL → "To checkpoint work inside a node so resume can skip completed units, wrap each unit in a task."

## [9] Interrupts
- interrupt() trong node, giá trị JSON trả về người gọi → https://docs.langchain.com/oss/python/langgraph/interrupts → "The function accepts any JSON-serializable value which is surfaced to the caller."
- Cần checkpointer và thread_id → cùng URL → "The `thread_id` you choose is effectively your persistent cursor."
- Resume bằng Command(resume=...) → cùng URL → "The value passed to `Command(resume=...)` becomes the return value of the `interrupt` call"
- Node chạy lại từ đầu khi resume → cùng URL → "the runtime restarts the entire node from the beginning." / "any code that ran before the `interrupt` will execute again."
- Không làm việc không idempotent trước interrupt; không bọc try/except trần → cùng URL → "Do not perform non-idempotent operations before `interrupt`."
- Mẫu: duyệt/từ chối, sửa state, duyệt tool call, kiểm input → cùng URL.
- Static interrupt (interrupt_before/after) chủ yếu cho debug → cùng URL → "Static interrupts are not recommended for human-in-the-loop workflows."
- invoke trả interrupt trong `__interrupt__` → cùng URL.

## [10] Time travel
- Replay và fork → https://docs.langchain.com/oss/python/langgraph/use-time-travel → "Replay: Retry from a prior checkpoint." / "Fork: Branch from a prior checkpoint with modified state"
- Node trước checkpoint không chạy lại; sau thì chạy lại kể cả LLM và API → cùng URL → "Nodes after the checkpoint re-execute, including any LLM calls, API requests, and interrupts"
- update_state không xóa lịch sử → cùng URL → "update_state does not roll back a thread." / "The original execution history remains intact."
- Interrupt luôn kích hoạt lại → cùng URL → "interrupts are always re-triggered during time travel."

## [11] Streaming
- 7 stream mode: values, updates, messages, custom, checkpoints, tasks, debug → https://docs.langchain.com/oss/python/langgraph/streaming → "Full state after each step." / "2-tuples of (LLM token, metadata) from LLM calls." ...
- Event streaming khuyên dùng cho app mới, từ v1.2 → cùng URL → "For new applications, we recommend event streaming—the typed-projection API introduced in LangGraph v1.2."

## [12] Memory overview
- Short-term = thread-scoped, nằm trong state, lưu bằng checkpointer → https://docs.langchain.com/oss/python/concepts/memory → "LangGraph manages short-term memory as a part of your agent's state."
- Long-term xuyên thread, lưu JSON trong store theo namespace + key → cùng URL → "Each memory is organized under a custom namespace (similar to a folder) and a distinct key (like a file name)."
- Semantic / episodic / procedural; ghi hot path vs background → cùng URL.

## [13] Subgraphs
- Subgraph là graph dùng như một node → https://docs.langchain.com/oss/python/langgraph/use-subgraphs → "A subgraph is a graph that is used as a node in another graph."
- Dùng cho multi-agent, tái sử dụng, chia đội → cùng URL.
- Hai cách: thêm trực tiếp (chung key) / gọi trong node (khác schema, biến đổi state) → cùng URL.
- Persistence: per-invocation (mặc định), per-thread, stateless → cùng URL.
- Interrupt lan lên graph cha → cùng URL → "Interrupts still propagate to the top-level graph regardless of nesting."

## [14] Multi-agent (LangChain docs)
- 5 mẫu: subagents, handoffs, skills, router, custom workflow (dùng LangGraph) → https://docs.langchain.com/oss/python/langchain/multi-agent → "A main agent coordinates subagents as tools." / "Behavior changes dynamically based on state." / "Build bespoke execution flows with LangGraph, mixing deterministic logic and agentic behavior."
- Một agent đủ tool thường đủ → cùng URL → "a single agent with the right (sometimes dynamic) tools and prompt can often achieve similar results."

## [15] Migrate from langgraph-supervisor
- Gói langgraph-supervisor không còn được duy trì tích cực → https://docs.langchain.com/oss/python/migrate/langgraph-supervisor → "The `langgraph-supervisor` package is no longer actively maintained."
- Thay bằng mẫu subagents → cùng URL → "Instead use the subagents pattern: a main agent coordinates specialized workers by calling them as tools."
- Chỉ compile graph ngoài cùng với checkpointer → cùng URL → "Compile only the outermost graph with a checkpointer."
- StateGraph tùy biến khi trộn bước cố định với bước agent → cùng URL.

## [16] Functional API
- @entrypoint và @task; luồng bằng if/else, vòng lặp thường → https://docs.langchain.com/oss/python/langgraph/functional-api → "uses ordinary language control flow (`if` / `else`, loops, and calls)"
- Lưu kết quả task vào checkpoint của entrypoint, không theo super-step; không có hình graph tĩnh → cùng URL.
- Khuyên Graph API cho agent mới → cùng URL → "Prefer the Graph API for building new agents."
- Hợp với code có sẵn / framework khác → cùng URL.

## [17] Workflows and agents
- Workflow: đường đi định sẵn; agent: tự quyết → https://docs.langchain.com/oss/python/langgraph/workflows-agents → "Workflows have predetermined code paths" / "Agents are dynamic and define their own processes and tool usage."
- 5 mẫu workflow: prompt chaining, parallelization, routing, orchestrator-worker, evaluator-optimizer → cùng URL.

## [18] Thinking in the Graph API
- Ví dụ agent email hỗ trợ khách hàng, có chuyển người thật → https://docs.langchain.com/oss/python/langgraph/thinking-in-graph-api → "Escalate complex issues to human agents"
- Lưu dữ liệu thô trong state, format prompt trong node → cùng URL → "Store raw data in state, not formatted prompt text."
- 4 chiến lược lỗi: retry, lưu lỗi vào state và quay lại, interrupt, fail → cùng URL.
- Node nhỏ → checkpoint dày hơn → cùng URL → "Smaller nodes mean more frequent checkpoints and less work to repeat."

## [19] LangChain overview
- Agent LangChain xây trên LangGraph → https://docs.langchain.com/oss/python/langchain/overview → "LangChain's agents are built on top of LangGraph."
- Dùng LangGraph cho nhu cầu nâng cao trộn workflow cố định và agent → cùng URL → "Use LangGraph, our low-level orchestration framework, for advanced needs combining deterministic and agentic workflows."

## [20] LangChain agents
- create_agent: harness; agent = model gọi tool trong vòng lặp → https://docs.langchain.com/oss/python/langchain/agents → "An agent is a model calling tools in a loop until a given task is complete."
- create_agent đặt recursion limit 9.999 → cùng URL.
- HumanInTheLoopMiddleware: duyệt / sửa / từ chối → cùng URL → "The agent pauses and waits; a human approves, edits, or rejects; execution continues."

## [21] Blog: LangChain & LangGraph 1.0 (2025-10-22)
- create_agent dùng LangGraph bên dưới → https://www.langchain.com/blog/langchain-langgraph-1dot0 → "The new `create_agent` function uses LangGraph under the hood to run this loop."
- create_react_agent trong langgraph.prebuilt bị deprecate → cùng URL.
- Cam kết không breaking change tới 2.0 → cùng URL → "no breaking changes until 2.0"

## [22] Deploy agents
- LangSmith Deployment nay là LangSmith Agent Server → https://docs.langchain.com/langsmith/deploy-overview → "LangSmith Deployment is now LangSmith Agent Server."
- Agent Server: runtime cho agent, durable execution, streaming, scale ngang → cùng URL.
- Cloud / Hybrid / Self-hosted with control plane / Standalone; cùng runtime → cùng URL → "All infrastructure types use the same Agent Server runtime."
- Framework-agnostic → cùng URL → "Agent Server is framework-agnostic."
- Assistants / threads / runs → cùng URL → "assistants for configuration, threads for state, and runs for workloads"

## [23] Agent Server
- Workflow orchestration runtime; task queue; persistence trên PostgreSQL; store; cron; webhooks; double texting → https://docs.langchain.com/langsmith/agent-server → "When a client creates a run, the API server enqueues it and a queue worker picks it up for execution."
- Graph không bắt buộc viết bằng LangGraph → cùng URL → "Graphs do not have to be written with LangGraph."

## [24] Trang sản phẩm LangSmith Agent Server
- Đổi tên từ tháng 11/2026 → https://www.langchain.com/langsmith/deployment → "LangSmith Deployment has been renamed to LangSmith Agent Server as of November 2026."
- Cron, HIL, Studio → cùng URL.

## [25] Blog: LangGraph Platform GA (2025-05-14)
- Ghi chú đổi tên tháng 10/2025 → https://www.langchain.com/blog/langgraph-platform-ga → "As of October 2025, LangGraph Platform has been re-named to "LangSmith Deployment"."

## [26] LangSmith Studio
- Giao diện trực quan miễn phí để phát triển, test agent ở máy → https://docs.langchain.com/oss/python/langgraph/studio → "a free visual interface for developing and testing your LangChain agents from your local machine"
- Chạy lại thread từ bất kỳ bước nào → cùng URL → "Re-run conversation threads from any step"
- `langgraph dev` chạy local server → cùng URL.

## [27] GitHub langchain-ai/langgraph
- Lấy cảm hứng từ Pregel và Apache Beam; giao diện từ NetworkX → https://github.com/langchain-ai/langgraph → "LangGraph is inspired by Pregel and Apache Beam."
- Dùng được không cần LangChain; MIT; Klarna, Replit, Elastic → cùng URL.

## [28] PyPI langgraph
- Bản mới nhất 1.2.22 ngày 2026-11-14; MIT; Python ≥ 3.10 → https://pypi.org/project/langgraph/

## [29] Test
- Tạo graph mới + checkpointer mới mỗi test; test từng node qua graph.nodes; chạy một đoạn bằng update_state(as_node) + interrupt_after → https://docs.langchain.com/oss/python/langgraph/test

## [30] INVALID_CONCURRENT_GRAPH_UPDATE
- Nhiều node cùng ghi một key không có reducer trong một step → lỗi; sửa bằng reducer → https://docs.langchain.com/oss/python/langgraph/errors/INVALID_CONCURRENT_GRAPH_UPDATE → "define a reducer that combines multiple values"

## Không dùng / thận trọng
- Ngày đổi tên chính xác LangGraph Cloud → LangGraph Platform: không mở được nguồn chính thức nói rõ, nên trang không nêu.
- Mặc định durability mode: trang Checkpointers không nói, nên trang không nêu.

## Bổ sung sau kongming review (mở lại 2026-11-18)
- [7] Hai checkpoint khởi động; START→A→B→END có đúng 4 checkpoint; checkpoint input step -1, next=('__start__',) → https://docs.langchain.com/oss/python/langgraph/checkpointers → "After you run the graph, there will be exactly 4 checkpoints"
- [7] Bốn cách gọi lại thread; chỉ dùng lại thread_id không làm graph chạy tiếp → cùng URL → "Reusing a thread ID alone does not mean that execution resumes."
- [7] "exit" ghi khi lần chạy thoát ra (xong, lỗi, interrupt) → cùng URL → "persists changes only when graph execution exits — successfully, with an error, or due to a human-in-the-loop interrupt"
- [23] Mặc định durability "async" (trang Agent Server) → https://docs.langchain.com/langsmith/agent-server → "Durability mode controls checkpoint frequency—`async` (default) writes after each step"
- [5] Câu "invisible until the next step" nằm ở pha Execution → https://docs.langchain.com/oss/python/langgraph/pregel → "During this phase, channel updates are invisible to actors until the next step."
- [2] Graph migrations → https://docs.langchain.com/oss/python/langgraph/graph-api → "Do not rename or remove a node the thread is about to enter." / "Renaming a key drops the saved value for that key in existing threads."
- [2] Runtime context → cùng URL → "passes dependencies into nodes without putting them in graph state"
- [8] Ba cơ chế retry, timeout, error handling; max_attempts tính cả lần đầu → https://docs.langchain.com/oss/python/langgraph/fault-tolerance
- [14] Mẫu Skills → https://docs.langchain.com/oss/python/langchain/multi-agent → "Specialized prompts and knowledge loaded on-demand."
