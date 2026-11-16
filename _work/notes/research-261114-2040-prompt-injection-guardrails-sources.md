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
