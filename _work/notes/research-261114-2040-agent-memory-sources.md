# Ghi chú nguồn: agent-memory (truy cập 2026-11-14)

Định dạng: khẳng định → URL → câu trích ngắn làm bằng chứng. Số [N] khớp `#src-N` trong trang.

## [1] OpenAI, Conversation state
- API sinh văn bản stateless; muốn hội thoại nhiều lượt phải gửi lại tin nhắn cũ → https://developers.openai.com/api/docs/guides/conversation-state → "While each text generation request is independent and stateless, you can still implement multi-turn conversations by providing additional messages as parameters"
- Dù chain bằng previous_response_id, token cũ vẫn bị tính tiền → cùng URL → "all previous input tokens for responses in the chain are billed as input tokens"
- Context window gồm input, output, reasoning → cùng URL → "This max tokens number includes input, output, and reasoning tokens."

## [2] Anthropic, Effective context engineering for AI agents (2025-09-29)
- Structured note-taking: agent ghi chú ra ngoài context rồi nạp lại → https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents → "the agent regularly writes notes persisted to memory outside of the context window. These notes get pulled back into the context window at later times."
- Compaction = tóm tắt rồi mở context mới → cùng URL → "summarizing its contents, and reinitiating a new context window with the summary"
- Context rot → cùng URL → "the model's ability to accurately recall information from that context decreases"
- Just-in-time: giữ định danh nhẹ, nạp lúc cần → cùng URL → "maintain lightweight identifiers (file paths, stored queries, web links, etc.)"

## [3] Park và cộng sự, Generative Agents (2023)
- Memory stream = bản ghi đầy đủ trải nghiệm bằng ngôn ngữ tự nhiên, có timestamp tạo và truy cập gần nhất → https://arxiv.org/abs/2304.03442 (bản HTML https://arxiv.org/html/2304.03442) → "each object contains a natural language description, a creation timestamp, and a most recent access timestamp"
- Recency: suy giảm mũ, hệ số 0.995 theo giờ game kể từ lần truy hồi gần nhất → HTML → "an exponential decay function over the number of sandbox game hours since the memory was last retrieved" (decay factor 0.995)
- Importance: LLM chấm số nguyên 1–10, chấm lúc tạo → HTML → "On the scale of 1 to 10, where 1 is purely mundane ... and 10 is extremely poignant"; "The importance score is generated at the time the memory object is created."
- Relevance: cosine giữa embedding memory và truy vấn → HTML → "relevance as the cosine similarity between the memory's embedding vector and the query memory's embedding vector"
- Chuẩn hóa min-max về [0,1], các α = 1, cộng lại → HTML → "normalize ... to the range of [0,1] using min-max scaling"; "all αs are set to 1"
- Reflection kích hoạt khi tổng importance vượt ngưỡng 150 → HTML → "(150 in our implementation)"
- Ablation: quan sát, lập kế hoạch, reflection đều quan trọng → abs → observation, planning, and reflection each contribute "critically to the believability of agent behavior"

## [4] Packer và cộng sự, MemGPT (2023)
- Virtual context management lấy cảm hứng từ bộ nhớ phân tầng của hệ điều hành → https://arxiv.org/abs/2310.08560 → "virtual context management, a technique drawing inspiration from hierarchical memory systems in traditional operating systems"
- Main context (như RAM) vs external context (như đĩa) → https://arxiv.org/html/2310.08560 → "main context (analogous to main memory/physical memory/RAM) and external context (analogous to disk memory/disk storage)"
- Working context ghi qua function call; chứa sự thật và sở thích người dùng → HTML → "Working context is a fixed-size read/write block of unstructured text, writeable only via MemGPT function calls."
- Agent tự quyết định sửa và tìm memory → HTML → "Memory edits and retrieval are entirely self-directed."
- Cảnh báo memory pressure ~70%, đẩy ra và tóm tắt đệ quy → HTML → "e.g. 70% of the context window"; "generates a new recursive summary using the existing recursive summary and evicted messages"
- Recall storage (lịch sử tin nhắn) và archival storage → HTML → "Recall storage ... the MemGPT message database"; "archival storage ... a read/write database storing arbitrary length text objects"

## [5] Sumers, Yao, Narasimhan, Griffiths, CoALA (2023)
- Working memory → https://arxiv.org/html/2309.02427 → "Working memory maintains active and readily available information as symbolic variables for the current decision cycle"
- Episodic → cùng URL → "Episodic memory stores experience from earlier decision cycles."
- Semantic → cùng URL → "Semantic memory stores an agent's knowledge about the world and itself."
- Procedural: trọng số LLM + code agent → cùng URL → "implicit knowledge stored in the LLM weights, and explicit knowledge written in the agent's code"
- Retrieval đọc từ long-term vào working → cùng URL → "reads information from long-term memories into working memory"
- Learning = ghi vào long-term memory → cùng URL → "Learning occurs by writing information to long-term memory"
- Sửa procedural memory rủi ro hơn → cùng URL → "it is significantly riskier than writing to episodic or semantic memory"

## [6] Zhang và cộng sự, Survey on the Memory Mechanism of LLM-based Agents (2024)
- Ba thao tác: writing, management, reading → https://arxiv.org/html/2404.13501 → writing aims "to project the raw observations into the actually stored memory contents"; reading aims "to obtain important information from the memory to support the next agent action"
- Management gồm merging, reflection, forgetting → cùng URL → "forgetting unimportant or irrelevant information to remove its negative influence"
- Textual vs parametric → cùng URL → "memory information is encoded into parameters and implicitly influences the agent's actions"
- Đánh giá trực tiếp vs gián tiếp, vẫn là bài toán mở → cùng URL → "Direct evaluation independently measures the capability of the memory module"; "evaluates the memory module via end-to-end agent tasks"; "an open problem"

## [7] LangChain, Memory overview (LangGraph docs)
- Short-term = theo thread; long-term trong namespace, dùng ở mọi thread → https://docs.langchain.com/oss/python/concepts/memory → "tracks the ongoing conversation by maintaining message history within a session"; "can be recalled at any time and in any thread"
- Bảng semantic=Facts / episodic=Experiences / procedural=Instructions (system prompt) → cùng URL → "Facts about a user" / "Past agent actions" / "Agent system prompt"
- Profile vs collection → cùng URL → "This can be become error-prone as the profile gets larger."; "The model must now delete or update existing items in the list, which can be tricky."
- Hot path vs background → cùng URL → "the process of reasoning about what to save to memory can impact agent latency"; "It eliminates latency in the primary application"; "infrequent updates may leave other threads without new context"

## [8] Anthropic, Memory tool (Claude API docs)
- File-based, /memories, client-side, ứng dụng của bạn lưu → https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool → "The memory tool operates client-side: Claude requests file operations, and your application runs them."
- Lệnh: view, create, str_replace, insert, delete, rename → cùng URL (mục Tool commands)
- Claude tự xem thư mục memory trước khi làm → cùng URL → "Claude automatically checks its memory directory before starting a task."
- Thông tin nhạy cảm → cùng URL → "Claude usually refuses to write sensitive information to memory files. For stronger guarantees, add validation that strips sensitive data before your handler writes the file."
- Hết hạn memory → cùng URL → "Periodically delete memory files that haven't been accessed in a long time."
- Path traversal → cùng URL → "A malicious path such as /memories/../../secrets.env can reach files outside the /memories directory."
- Kết hợp với compaction → cùng URL → "memory preserves the information that must survive summarization"

## [9] Shinn và cộng sự, Reflexion (2023)
- Bài học bằng lời lưu trong episodic memory buffer, không đổi trọng số → https://arxiv.org/abs/2303.11366 → "maintain their own reflective text in an episodic memory buffer to induce better decision-making in subsequent trials"; "not by updating weights, but instead through linguistic feedback"

## [10] Chhikara và cộng sự, Mem0 (2025)
- Trích xuất fact ứng viên từ cặp tin nhắn mới, dùng tóm tắt + m tin gần nhất → https://arxiv.org/html/2504.19413 → "resulting in candidate facts for potential inclusion in the knowledge base"
- LLM chọn ADD/UPDATE/DELETE/NOOP qua tool call, so với top-s memory tương tự → cùng URL → "DELETE for removal of memories contradicted by new information"; "The LLM itself determines which of four distinct operations to execute"
- Bản graph đánh dấu quan hệ cũ là invalid thay vì xóa → cùng URL → "marking them as invalid rather than physically removing them to enable temporal reasoning"
- Full-context vẫn điểm J cao nhất (72.90%) so với Mem0 (66.88%) nhưng p95 latency 17.117s vs 1.440s (số do tác giả Mem0 tự đo) → cùng URL, Bảng kết quả LOCOMO

## [11] Rasmussen và cộng sự, Zep (2025)
- Temporal knowledge graph, Graphiti → https://arxiv.org/abs/2501.13956 → "a temporally-aware knowledge graph engine"
- Bi-temporal: t_valid/t_invalid + t'created/t'expired → https://arxiv.org/html/2501.13956 → "t_valid and t_invalid track the temporal range during which facts held true"
- Cạnh mới mâu thuẫn làm vô hiệu cạnh cũ, ưu tiên thông tin mới → HTML → "it invalidates the affected edges by setting their t_invalid to the t_valid of the invalidating edge"; "Graphiti consistently prioritizes new information"
- Ba tầng: episode, semantic entity, community → HTML → "three hierarchical tiers of subgraphs: an episode subgraph, a semantic entity subgraph, and a community subgraph"

## [12] Wu và cộng sự, LongMemEval (ICLR 2025)
- 5 năng lực → https://arxiv.org/abs/2410.10813 → "information extraction, multi-session reasoning, temporal reasoning, knowledge updates, and abstention"
- 500 câu hỏi → cùng URL → "500 meticulously curated questions"
- Giảm ~30% độ chính xác → cùng URL → "commercial chat assistants and long-context LLMs showing a 30% accuracy drop"
- Ba giai đoạn indexing, retrieval, reading → cùng URL → "three stages: indexing, retrieval, and reading"; "time-aware query expansion"

## [13] Maharana và cộng sự, LoCoMo (2024)
- Hội thoại ~300 lượt, 9K token, tối đa 35 phiên → https://arxiv.org/abs/2402.17753 → "300 turns and 9K tokens on avg., over up to 35 sessions"
- LLM gặp khó với động lực thời gian và nhân quả dài hạn → cùng URL → "comprehending long-range temporal and causal dynamics within dialogues"

## [14] Chen và cộng sự, AgentPoison (2024)
- Đầu độc long-term memory hoặc RAG KB → https://arxiv.org/abs/2407.12784 → "poisoning their long-term memory or RAG knowledge base"
- ASR trung bình >80%, ảnh hưởng hiệu năng bình thường <1%, poison rate <0.1% → cùng URL → "average attack success rate higher than 80%"; "less than 1%"; "poison rate less than 0.1%"

## [15] Dong và cộng sự, MINJA (2025)
- Chỉ cần tương tác bằng truy vấn để chèn bản ghi độc vào memory → https://arxiv.org/abs/2503.03704 → "by only interacting with the agent via queries and output observations"; "enables any user to influence agent memory"

## [16] Wang và cộng sự, Unveiling Privacy Risks in LLM Agent Memory (ACL 2025)
- Memory lưu tương tác riêng tư tạo rủi ro; tấn công MEXTRA trích xuất từ memory → https://arxiv.org/abs/2502.13172 → "storing private user-agent interactions in the memory module for demonstrations"; "to extract private information from memory"

## [17] OWASP GenAI, Top 10 for Agentic Applications (2025-12-09)
- ASI06 Memory & Context Poisoning → https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/ → "Memory poisoning reshaped behaviour long after the initial interaction"

## [18] Habler, OWASP GenAI blog, Memory Is a Feature. It Is Also an Attack Surface (2026-05-13)
- ASI06 định nghĩa → https://genai.owasp.org/2026/05/13/memory-is-a-feature-it-is-also-an-attack-surface/ → "attacker-controlled content poisoning memory and context that the system continues to trust over time"
- Vấn đề là tính bền → cùng URL → "The issue is not just that the model saw something malicious once. The issue is persistence."
- Coi memory là bề mặt tấn công → cùng URL → "memory should be treated as part of the attack surface"

## [19] GDPR Điều 17 (quyền được xóa)
- → https://gdpr-info.eu/art-17-gdpr/ → "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her"

## Khẳng định không tìm được nguồn đã mở → viết thận trọng hoặc bỏ
- OpenAI ChatGPT Memory FAQ và trang "Memory and new controls" trả 403 → không trích dẫn.
- OWASP mitigations chi tiết (provenance, segmentation, expiry) chỉ thấy qua kết quả tìm kiếm, không mở được văn bản gốc ASI06 → trong trang, biện pháp giảm thiểu được trình bày như thực hành kỹ thuật chung, trích [8] (sensitive info, expiry, path traversal) và [18] ("treat memory as attack surface"), không gán cho OWASP.
