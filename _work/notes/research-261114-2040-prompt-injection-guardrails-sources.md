# Ghi chú nguồn: prompt-injection-guardrails

Tất cả mở bằng WebFetch ngày 2026-11-14. Dạng: khẳng định → URL → trích ngắn.

## OWASP (src-1..6, 27..31)
- [1] Prompt injection: input làm đổi hành vi model ngoài ý định; trực tiếp / gián tiếp → https://genai.owasp.org/llmrisk/llm01-prompt-injection/ → "occurs when user prompts alter the LLM's behavior or output in unintended ways"; indirect "occur when an LLM accepts input from external sources, such as websites or files"
- [1] Không cần người đọc được → cùng URL → "prompt injections do not need to be human-visible/readable, as long as the content is parsed by the model"
- [1] Jailbreak là một dạng prompt injection (theo OWASP) → cùng URL → "a form of prompt injection where the attacker provides inputs that cause the model to disregard its safety protocols"
- [1] Chưa rõ có cách chặn tuyệt đối → cùng URL → "it is unclear if there are fool-proof methods of prevention for prompt injection"
- [1] 7 biện pháp: constrain behavior, định dạng output + kiểm bằng code tất định, lọc in/out, least privilege, human-in-the-loop, "Separate and clearly denote untrusted content", adversarial testing "treating the model as an untrusted user"
- [1] Kịch bản: trang web ẩn chỉ dẫn chèn URL ảnh làm lộ hội thoại; tài liệu bị sửa trong kho RAG; injection đa phương thức (ảnh); che giấu bằng đa ngôn ngữ/mã hóa; RAG và fine-tuning "do not fully mitigate prompt injection vulnerabilities"
- [2] Danh sách Top 10 bản 2025 (LLM01..LLM10) → https://genai.owasp.org/llm-top-10/ → "LLM01:2025 Prompt Injection" … "LLM10:2025 Unbounded Consumption"
- [3] LLM02 Sensitive Information Disclosure → https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/ → "risk exposing sensitive data, proprietary algorithms, or confidential details through their output"; lời dặn system prompt "could be bypassed via prompt injection"
- [4] LLM05 Improper Output Handling → https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/ → "Treat the model as any other user, adopting a zero-trust approach"; "Encode model output back to users to mitigate undesired code execution by JavaScript or Markdown"; "Employ strict Content Security Policies (CSP)"
- [5] LLM06 Excessive Agency: 3 gốc rễ + biện pháp → https://genai.owasp.org/llmrisk/llm062025-excessive-agency/ → "Implement authorization in downstream systems rather than relying on an LLM"; "require a human to approve high-impact actions"; monitoring/rate limit "will not prevent ... but can limit the level of damage"
- [6] LLM07 System Prompt Leakage → https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/ → "the system prompt should not be considered a secret, nor should it be used as a security control"; "Implement a system of guardrails outside of the LLM itself"; "Critical controls ... must not be delegated to the LLM"
- [27] LLM03 Supply Chain → https://genai.owasp.org/llmrisk/llm032025-supply-chain/ → "the risks also extend to third-party pre-trained models and data"
- [28] LLM04 Data and Model Poisoning → https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/ → "pre-training, fine-tuning, or embedding data is manipulated to introduce vulnerabilities, backdoors, or biases"
- [29] LLM08 Vector and Embedding Weaknesses → https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/ → ví dụ CV có chữ trắng trên nền trắng; "text extraction tools that ignore formatting and detect hidden content"; "permission-aware vector database"
- [30] LLM09 Misinformation → https://genai.owasp.org/llmrisk/llm092025-misinformation/ → "LLMs produce false or misleading information that appears credible"
- [31] LLM10 Unbounded Consumption → https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/ → "allows users to conduct excessive and uncontrolled inferences"; "Apply rate limiting and user quotas"

## Bài báo
- [7] Greshake 2023: injection gián tiếp, mờ ranh giới dữ liệu/chỉ dẫn → https://arxiv.org/abs/2302.12173 → "LLM-Integrated Applications blur the line between data and instructions"; "injecting prompts into data likely to be retrieved"; tác động "including data theft, worming"
- [8] Perez & Ribeiro 2022: goal hijacking, prompt leaking → https://arxiv.org/abs/2211.09527 → "two types of attacks -- goal hijacking and prompt leaking"
- [12] Spotlighting: delimiting / datamarking / encoding; ASR >50% → <2% với GPT; khuyên ít nhất datamarking; delimiting dễ bị vượt → https://arxiv.org/abs/2403.14720 và https://arxiv.org/html/2403.14720 → "reduces the attack success rate from greater than 50% to below 2%"; "we recommend that at least datamarking be used"
- [13] Instruction hierarchy (OpenAI) → https://arxiv.org/abs/2404.13208 → "LLMs often consider system prompts ... to be the same priority" as untrusted input; "teaches LLMs to selectively ignore lower-privileged instructions"
- [14] Design patterns (Beurer-Kellner và cộng sự 2025) → https://arxiv.org/abs/2506.08837 → "principled design patterns for building AI agents with provable resistance to prompt injection"
- [16] CaMeL → https://arxiv.org/abs/2503.18813 → "the untrusted data retrieved by the LLM can never impact the program flow"; "77% of tasks with provable security (compared to 84% with an undefended system)"
- [21] Llama Guard → https://arxiv.org/abs/2312.06674 → "an LLM-based input-output safeguard model"; phân loại theo "safety risk taxonomy"
- [22] Nasr và cộng sự 2025 → https://arxiv.org/abs/2510.09023 → "we bypass 12 recent defenses ... with attack success rate above 90% for most"; "the majority of defenses originally reported near-zero attack success rates"
- [23] AgentDojo → https://arxiv.org/abs/2406.13352 → "97 realistic tasks" và "629 security test cases"
- [24] Red teaming bằng LM → https://arxiv.org/abs/2202.03286 → "human annotation is expensive, limiting the number and diversity of test cases"

## Blog / tài liệu nhà cung cấp
- [9] Willison: injection ≠ jailbreak → https://simonwillison.net/2024/Mar/5/prompt-injection-jailbreaking/ → injection "concatenating untrusted user input with a trusted prompt"; jailbreak "attempt to subvert safety filters built into the LLMs themselves"; "Don't buy a jailbreaking prevention system to protect against prompt injection"
- [10] Lethal trifecta → https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ → "Access to your private data", "Exposure to untrusted content", "The ability to externally communicate"; "in web application security 95% is very much a failing grade"; HTTP request "to load an image, or even providing a link for a user to click" có thể làm kênh rò rỉ
- [11] Dual LLM → https://simonwillison.net/2023/Apr/25/dual-llm-pattern/ → Quarantined LLM "does not have access to tools"; "Just the act of displaying this image would exfiltrate the user's private data!"
- [15] Tóm tắt 6 pattern → https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/ → Action-Selector, Plan-Then-Execute, LLM Map-Reduce, Dual LLM, Code-Then-Execute, Context-Minimization; "impossible for that input to trigger any consequential actions"
- [17] Microsoft MSRC 2025 phòng thủ nhiều lớp → https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks → "an inherent risk"; chiến lược "does not rely on our ability to block all prompt injections"; ảnh markdown: "the user's browser makes a request to the attacker's server and thus unintentionally exfiltrates the data"; Prompt Shields "a probabilistic classifier-based approach"; human-in-the-loop "explicit consent of the user"
- [18] Anthropic docs → https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks → hai threat model; "Put untrusted content only in tool results"; "JSON-encode untrusted content"; "Screen tool outputs before Claude acts on them"; "Red-team your own agent"; "Continuous monitoring"
- [19] OpenAI agent safety → https://developers.openai.com/api/docs/guides/agent-builder-safety → "injecting untrusted input directly into developer messages gives attackers the highest degree of control"; structured outputs "eliminate freeform channels"; "always enable tool approvals"; "greatly reduce, but don't fully remove, this risk"
- [20] NeMo Guardrails → https://docs.nvidia.com/nemo/guardrails/latest/index.html → "open-source Python package for adding programmable guardrails"; "Input, retrieval, dialog, execution, and output rails run at different stages"
- [25] PyRIT → https://github.com/microsoft/PyRIT → "Open-source AI red teaming toolkit from Microsoft"; MIT
- [26] garak → https://github.com/NVIDIA/garak → "probes for hallucination, data leakage, prompt injection, misinformation, toxicity generation, jailbreaks"; Apache-2.0

## Đã mở nhưng không dùng
- NIST AI 100-2 E2025 (https://csrc.nist.gov/pubs/ai/100/2/e2025/final): trang tóm tắt không nói về prompt injection, nên không trích.

## Mở lại và bổ sung ngày 2026-11-17 (phiên dựng trang)

Mọi URL ở trên đã mở lại bằng WebFetch ngày 2026-11-17, trừ [3]→LLM03, [28]→LLM04, [30]→LLM09 (không dùng trong trang nên không mở lại). Số trong ngoặc dưới đây là **số nguồn trong trang** `prompt-injection-guardrails/index.html` (đánh lại từ đầu, khác số ở các mục trên).

### Khớp lại (đánh số theo trang)
- [1] OWASP LLM01 → còn đúng: "do not need to be human-visible/readable"; "unclear if there are fool-proof methods"; 7 biện pháp, gồm "Segregate and identify external content"; 9 kịch bản: Direct, Indirect, Unintentional, Intentional Model Influence, Code Injection, Payload Splitting, Multimodal, Adversarial Suffix, Multilingual/Obfuscated; RAG/fine-tuning "do not fully mitigate"
- [2] OWASP Top 10 2025 → danh sách LLM01..LLM10 khớp
- [3] OWASP LLM02 → "could be bypassed via prompt injection or other methods"; "Limit access to sensitive data based on the principle of least privilege"
- [4] OWASP LLM05 → "Treat the model as any other user, adopting a zero-trust approach"; "Encode model output back to users to mitigate undesired code execution by JavaScript or Markdown"; "Employ strict Content Security Policies (CSP)"; "Use parameterized queries"
- [5] OWASP LLM06 → 3 gốc rễ (functionality, permissions, autonomy); "Implement authorization in downstream systems rather than relying on an LLM"; "require a human to approve high-impact actions"; "executed on downstream systems in the context of that specific user"; logging/rate limit "will not prevent ... but can limit the level of damage"
- [6] OWASP LLM07 → "should not be considered a secret, nor should it be used as a security control"; "guardrails outside of the LLM itself"; "Critical controls ... must not be delegated to the LLM"; "credentials, connection strings, etc. should not be contained within the system prompt"
- [7] OWASP LLM08 → CV "white text on a white background"; "permission-aware vector database"; "text extraction tools that ignore formatting and detect hidden content"; rò rỉ giữa các nhóm dùng chung vector store
- [9] Greshake 2023 → "blur the line between data and instructions"; "injecting prompts into data likely to be retrieved"; "data theft, worming, information ecosystem contamination"
- [10] Perez & Ribeiro 2022 (NeurIPS ML Safety Workshop) → "goal hijacking and prompt leaking"
- [11] Willison 2024 → jailbreak "subvert safety filters built into the LLMs themselves"; mục "Don't buy a jailbreaking prevention system to protect against prompt injection"; hai loại có chồng lấn
- [12] Willison 2025 lethal trifecta → ba yếu tố; "95% is very much a failing grade"; kênh rò rỉ: API, "load an image", "providing a link for a user to click"; "avoid that lethal trifecta combination entirely"
- [13] Willison 2023 Dual LLM → Quarantined LLM "does not have access to tools"; Controller "is regular software"; biến $VAR1; "this isn't a 100% reliable solution"; cập nhật 2025: CaMeL chỉ ra một lỗ hổng tiềm ẩn của Dual LLM
- [14] Willison 2025 tóm tắt 6 pattern → mô tả từng pattern; "impossible for that input to trigger any consequential actions"; "constrain the actions of agents to explicitly prevent them from solving arbitrary tasks"
- [15] Beurer-Kellner 2025 (14 tác giả) → "provable resistance to prompt injection"; "trade-offs in terms of utility and security"
- [16] Debenedetti 2025 CaMeL → "untrusted data retrieved by the LLM can never impact the program flow"; capability "to prevent the exfiltration of private data"; "77% of tasks with provable security (compared to 84%...)"
- [17] Hines 2024 Spotlighting → "reduces the attack success rate from greater than 50% to below 2%" với GPT-family; delimiting "could be easily subverted"; "we recommend that at least datamarking be used"; encoding chỉ dùng với model mạnh nhất
- [18] Wallace 2024 instruction hierarchy → "same priority as text from untrusted users and third parties"; "selectively ignore lower-privileged instructions"; tăng robustness "even for attack types not seen during training"; "minimal degradations"
- [20] MSRC (Andrew Paverd, 29/7/2025) → "inherent risk"; "does not rely on our ability to block all prompt injections"; "defense-in-depth approach spanning prevention, detection, and impact mitigation"; ảnh markdown: "the user's browser makes a request to the attacker's server and thus unintentionally exfiltrates the data"; chặn "generation of certain untrusted links"; "explicit consent of the user"; sensitivity labels/Purview; TaskTracker, FIDES
- [22] Anthropic docs "Mitigate jailbreaks and prompt injections" → hai threat model; "Put untrusted content only in tool results"; "Tell Claude what the content is and where it came from"; "JSON-encode untrusted content"; "Don't put your own instructions in tool results"; least privilege; "Screen tool outputs before Claude acts on them"; "Red-team your own agent"; "Continuous monitoring"; throttle/ban repeat offenders
- [23] OpenAI "Safety in building agents" → "injecting untrusted input directly into developer messages gives attackers the highest degree of control"; "eliminate freeform channels"; "always enable tool approvals ... including reads and writes"; guardrails "an effective first wave of protection"; "greatly reduce, but don't fully remove, this risk"; model có thể gửi nhiều dữ liệu cho MCP hơn người dùng muốn
- [25] NeMo Guardrails → "open-source Python package for adding programmable guardrails"; "Input, retrieval, dialog, execution, and output rails run at different stages"; execution rails "validate tool inputs and outputs before and after invocation"
- [26] Llama Guard (Inan 2023) → "LLM-based input-output safeguard model"; phân loại cả prompt và response
- [28] Nasr 2025 (14 tác giả) → đánh giá bằng "static set of harmful attack strings" là sai cách; "bypass 12 recent defenses ... above 90% for most"; "majority of defenses originally reported near-zero attack success rates"
- [29] AgentDojo 2024 → "97 realistic tasks"; "629 security test cases"; "not a static test suite"; "state-of-the-art LLMs fail at many tasks (even in the absence of attacks)"
- [31] Perez 2022 red teaming → "human annotation is expensive, limiting the number and diversity of test cases"; sinh ca test bằng LM khác
- [32] PyRIT → "Open-source AI red teaming toolkit from Microsoft"; MIT
- [33] garak → "checks if an LLM-backed application can be made to fail in a way we don't want"; probe "prompt injection ... jailbreaks"; Apache-2.0
- [34] OWASP LLM10 → "rate limiting and user quotas"

### Nguồn mới
- [8] OWASP LLM Prompt Injection Prevention Cheat Sheet → https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html → "do not treat text labels or prompt wording as an enforcement boundary"; "Treat model output as untrusted at every downstream use"; "The execution component must verify approval for the exact action"; "text a reader cannot see still reaches the model"; "Render each page and flag extracted text that does not appear on it"; input screening "is not a security boundary"; "A guardrail LLM is itself an LLM and is itself susceptible to prompt injection"; rate limiting "does not establish model robustness"
- [19] StruQ (Chen, Piet, Sitawarin, Wagner; USENIX Security 2025) → https://arxiv.org/abs/2402.06363 → "Structured queries separate prompts and data into two channels"; model fine-tune "will only follow instructions in the prompt portion"; "little or no impact on utility"
- [21] Microsoft Learn: Prompt Shields → https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection → hai loại: User prompt attacks, Document attacks; "doesn't independently verify the submitted content's provenance"; không kiểm nội dung có hại/đúng sự thật; "primarily trained and evaluated on English content. Performance can vary for non-English content"; false positives: chuyển block → annotate; Spotlighting dùng base-64, tăng token
- [24] NCSC (Dave Chismon, 8/12/2025) "Prompt injection is not SQL injection (it may be worse)" → https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection → "simply do not enforce a security boundary between instructions and data inside a prompt"; "may never be totally mitigated in the way that SQL injection attacks can be"; "inherently confusable deputy"; "deterministic (non-LLM) safeguards that constrain the actions of the system"; "the privileges it has drops to that of the party"; log "full input and output of the LLM"; "Beware any that claim they can 'stop' prompt injection"
- [27] LlamaFirewall (Chennabasappa 2025) → https://arxiv.org/abs/2505.03574 → "a final layer of defense"; PromptGuard 2 "universal jailbreak detector"; Agent Alignment Checks "chain-of-thought auditor ... for prompt injection and goal misalignment" (thử nghiệm); CodeShield static analysis
- [30] Shi 2025 "Lessons from Defending Gemini Against Indirect Prompt Injections" → https://arxiv.org/abs/2505.14534 → "a suite of adaptive attack techniques to run continuously against past, current, and future versions of Gemini"

### Không dùng
- LLM03 Supply Chain, LLM04 Poisoning, LLM09 Misinformation: ngoài phạm vi trang, không trích.
- Tìm thấy qua WebSearch nhưng không mở: securityboulevard, infosecurity-magazine (bài thuật lại NCSC); dùng bản gốc NCSC.

### Bổ sung sau review kongming (2026-11-17, đọc bản gốc bằng curl)
- [9] Greshake 2023, toàn văn PDF → persistence: "achieving attacks' persistence across sessions by copying the injection into memory"; Figure 8 "A compromised LLM stores the injection in a long-term memory ... In a new session ... the injection is retrieved"; worming: "designed as computer worms to spread the injection to other users ... LLMs-augmented email clients that can read emails (delivering malicious prompts) and send emails (spreading prompts)"; taxonomy có "Wrong summary"
- [13] Willison Dual LLM → "The social engineering aspects also mean that this isn't a 100% reliable solution. A personal AI assistant that can still be co-opted into trying to trick us into copying and pasting out our obfuscated private data"
- [14] Willison design patterns → Context-Minimization: "the agent first translates the user's request into a database query ... before returning the results to the customer, the user's prompt is removed from the context"
- [23] OpenAI agent safety → "Pass untrusted inputs through user messages to limit their influence."; "Structured outputs and isolation greatly reduce, but don't fully remove, this risk."
