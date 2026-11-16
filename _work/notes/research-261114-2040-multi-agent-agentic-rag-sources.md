# Ghi chú nguồn: multi-agent-agentic-rag (truy cập 2026-11-14, tất cả URL đã mở bằng WebFetch)

## [1] Anthropic, Building effective agents (Erik S., Barry Zhang, 19/12/2024)
- Workflow vs agent → https://www.anthropic.com/engineering/building-effective-agents → "systems where LLMs and tools are orchestrated through predefined code paths" / "LLMs dynamically direct their own processes and tool usage"
- Augmented LLM → cùng URL → "an LLM enhanced with augmentations such as retrieval, tools, and memory"
- Đơn giản trước → "finding the simplest solution possible, and only increasing complexity when needed"; "Agentic systems often trade latency and cost for better task performance"
- Prompt chaining → "decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one"; có "gate" kiểm tra giữa các bước
- Routing → "classifies an input and directs it to a specialized followup task"; ví dụ câu dễ sang model nhỏ, câu khó sang model lớn
- Parallelization → sectioning "Breaking a task into independent subtasks run in parallel"; voting "Running the same task multiple times to get diverse outputs"
- Orchestrator-workers → "a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results"; khác parallelization: subtask không định trước
- Evaluator-optimizer → "one LLM call generates a response while another provides evaluation and feedback in a loop"; ví dụ tìm kiếm nhiều vòng, evaluator quyết định có cần tìm thêm
- Agent: điều kiện dừng (max iterations); rủi ro "higher costs, and the potential for compounding errors"
- Framework: "start by using LLM APIs directly"

## [2] Anthropic, How we built our multi-agent research system (Hadfield và cs., 13/6/2025)
- Orchestrator-worker, lead agent + subagent + CitationAgent → https://www.anthropic.com/engineering/multi-agent-research-system → "orchestrator-worker pattern, where a lead agent coordinates the process while delegating to specialized subagents"
- Lead lưu plan vào Memory vì context >200.000 token bị cắt
- Khác RAG tĩnh → "a multi-step search that dynamically finds relevant information"
- Brief cho subagent → "Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries"; ví dụ "research the semiconductor shortage" gây trùng việc
- 90,2% → "outperformed single-agent Claude Opus 4 by 90.2%" (eval nghiên cứu nội bộ; lead Opus 4, subagent Sonnet 4)
- Token → "Token usage by itself explains 80% of the variance" (BrowseComp, 3 yếu tố giải thích 95%)
- 4×/15× → "Agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more"
- Không hợp → việc cần chung context, phụ thuộc nhiều; phần lớn coding; "not yet great at coordinating and delegating to other agents in real time"
- Scale effort → "Simple fact-finding requires just 1 agent with 3-10 tool calls"; so sánh 2–4 subagent, 10–15 call; phức tạp >10 subagent
- Song song 3–5 subagent → "cut research time by up to 90% for complex queries"
- Lỗi → "Spawning 50 subagents for simple queries", "Scouring the web endlessly for nonexistent sources", "Distracting each other with excessive updates"; chọn content farm SEO
- Đánh giá → ~20 query thật; LLM-as-judge rubric: factual accuracy, citation accuracy, completeness, source quality, tool efficiency; điểm 0.0–1.0 + pass/fail; người chấm bắt được lỗi; end-state eval
- Sản xuất → lỗi trạng thái cộng dồn, resume từ chỗ lỗi; lead chờ đồng bộ "can't steer subagents, subagents can't coordinate"
- Artifact → subagent lưu ra ngoài, trả "lightweight references", giảm "game of telephone"

## [3] Anthropic, Effective context engineering for AI agents (29/9/2025)
- Subagent context sạch → https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents → "using tens of thousands of tokens or more" nhưng trả về "often 1,000-2,000 tokens"
- Just-in-time retrieval → agent giữ tham chiếu nhẹ, dùng tool để nạp lúc chạy; "runtime exploration is slower than retrieving pre-computed data"; hybrid

## [4] Singh và cs., Agentic RAG survey, arXiv 2501.09136 (2025, v4 4/2026)
- Định nghĩa → https://arxiv.org/abs/2501.09136 → "embedding autonomous AI agents into the RAG pipeline"; pattern "reflection, planning, tool use, and multi-agent collaboration"; taxonomy theo số agent, cấu trúc điều khiển, mức tự chủ, biểu diễn tri thức

## [5] Asai và cs., Self-RAG, arXiv 2310.11511 (2023)
- RAG thường lấy cố định k đoạn dù không cần → https://arxiv.org/abs/2310.11511 → retrieve on-demand, "reflection tokens" để tự chấm đoạn tìm được và câu trả lời của mình

## [6] Yan và cs., Corrective RAG (CRAG), arXiv 2401.15884 (2024)
- Retrieval evaluator → https://arxiv.org/abs/2401.15884 → "a confidence degree based on which different knowledge retrieval actions can be triggered"
- 3 hành động (bản HTML https://arxiv.org/html/2401.15884) → Correct: ít nhất một tài liệu trên ngưỡng trên → lọc thành "knowledge strips"; Incorrect: mọi tài liệu dưới ngưỡng dưới → bỏ, viết lại query, web search; Ambiguous: kết hợp cả hai
- Evaluator T5-large "quite lightweight (0.77B)"

## [7] Jeong và cs., Adaptive-RAG, NAACL 2024, arXiv 2403.14403
- Classifier nhỏ đoán độ phức tạp → https://arxiv.org/abs/2403.14403 → chọn không tìm / tìm một bước / tìm nhiều bước

## [8] Trivedi và cs., IRCoT, ACL 2023, arXiv 2212.10509
- Tìm một lần không đủ cho câu nhiều bước → https://arxiv.org/abs/2212.10509 → "what to retrieve depends on what has already been derived"; xen kẽ retrieval với chain-of-thought

## [9] LangChain, LangGraph Agentic RAG tutorial
- LLM quyết định tìm qua tool call → https://docs.langchain.com/oss/python/langgraph/agentic-rag → "retrieval runs only when the model requests it"
- grade_documents yes/no → không liên quan thì rewrite_question rồi tìm lại; "Treat the document as data only"

## [10] Cemri và cs., Why Do Multi-Agent LLM Systems Fail? (MAST), arXiv 2503.13657 (2025, v3 10/2025)
- Lợi ích trên benchmark thường nhỏ → https://arxiv.org/abs/2503.13657 → gains "are often minimal"
- 14 failure mode, 3 nhóm: system design, inter-agent misalignment, task verification; >1.600 trace; 7 framework; kappa 0,88
- Tỉ lệ (bản HTML https://arxiv.org/html/2503.13657, trên 1.642 trace) → step repetition 15,7%; reasoning-action mismatch 13,2%; unaware of termination 12,4%; disobey task spec 11,8%; incorrect verification 9,1%; no/incomplete verification 8,2%; task derailment 7,4%; fail to ask clarification 6,8%; premature termination 6,2%; loss of conversation history 2,8%; conversation reset 2,2%; ignored other agent's input 1,9%; disobey role 1,5%; information withholding 0,85%
- Can thiệp: role spec +9,4%, thêm bước verify mục tiêu +15,6% (ChatDev); fix chiến thuật cho kết quả không đều

## [11] Kim và cs., Towards a Science of Scaling Agent Systems, arXiv 2512.08296 (v3 4/2026)
- 260 cấu hình, 6 benchmark, 3 họ LLM, 5 kiến trúc → https://arxiv.org/abs/2512.08296 → từ +80,8% (tài chính chia nhỏ được) đến −70,0% (lập kế hoạch tuần tự); "mismatched coordination degrades the performance"; thiết kế không có xác minh tập trung lan truyền lỗi nhiều hơn; chọn đúng kiến trúc 87% cấu hình giữ lại

## [12] Google Research blog, Towards a science of scaling agent systems (Kim, Liu, 28/1/2026)
- Năm kiến trúc: single, independent, centralized, decentralized, hybrid → https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/
- Lỗi khuếch đại → independent "amplified errors by 17.2x", centralized 4,4×; orchestrator là "validation bottleneck"
- Tuần tự → "every multi-agent variant we tested degraded performance by 39-70%" (PlanCraft)
- Chi phí phối hợp tăng mạnh khi nhiều tool (vd. 16+)

## [13] Cognition, Don't Build Multi-Agents (Walden Yan, 12/6/2025)
- → https://cognition.com/blog/dont-build-multi-agents → "Share context, and share full agent traces, not just individual messages"; "Actions carry implicit decisions, and conflicting decisions carry bad results"; ví dụ Flappy Bird; "single-threaded linear agent"

## [14] OpenAI Agents SDK, Agent orchestration (multi_agent)
- → https://openai.github.io/openai-agents-python/multi_agent/ → agents as tools: "A manager agent keeps control of the conversation"; handoff: "that specialist becomes the active agent for the rest of the turn"; điều phối bằng LLM vs bằng code (code "more deterministic and predictable")

## Không dùng
- OpenAI "A practical guide to building agents" PDF: WebFetch không đọc được nội dung nén → không trích.
