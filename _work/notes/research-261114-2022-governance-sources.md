# Research notes: AI Governance page sources

Page: `D:\WORKSPACES\learning-ai\governance\index.html`
Accessed: 2026-11-14 (Asia/Bangkok). Every URL below was actually opened; quotes are short excerpts returned from the page.
Open method: WebFetch unless noted. ISO pages returned HTTP 403 to WebFetch, so [4] was opened in the Orca built-in browser (`orca tab create` + `exec read`) and the text was read from the rendered page.

| # | Claim on page | URL | Evidence (short quote) |
|---|---|---|---|
| 1 | NIST AI RMF is voluntary; released 2023; has GenAI profile | https://www.nist.gov/itl/ai-risk-management-framework | "is intended for voluntary use"; "Released on January 26, 2023"; NIST-AI-600-1 "can help organizations identify unique risks posed by generative AI" |
| 2 | Core = Govern, Map, Measure, Manage; Govern cross-cutting | https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf (text via pdftotext) | "Governance is designed to be a cross-cutting function to inform and be infused throughout the other three functions." |
| 2 | Map / Measure / Manage descriptions | same | "The MAP function establishes the context to frame risks"; "The MEASURE function employs quantitative, qualitative, or mixed-method tools"; "The MANAGE function entails allocating risk resources to mapped and measured risks" |
| 2 | Actions are not a checklist / not ordered | same | "Actions do not constitute a checklist, nor are they necessarily an ordered set of steps." |
| 2 | Trustworthy AI includes fairness with harmful bias managed | same | "valid and reliable, safe, secure and resilient, accountable and transparent, explainable and interpretable, privacy enhanced, and fair with their harmful biases managed" |
| 3 | GenAI profile is a companion resource to AI RMF | https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence | "a cross-sectoral profile of and companion resource for the AI Risk Management Framework (AI RMF 1.0) for Generative AI" |
| 4 | ISO/IEC 42001 specifies requirements for an AI management system; PDCA; org-level | https://www.iso.org/standard/42001 (Orca browser) | "specifies requirements for establishing, implementing, maintaining, and continually improving an Artificial Intelligence Management System (AIMS)"; "using the Plan‐Do‐Check‐Act methodology. Rather than looking at the details of specific AI applications, it provides a practical way of managing AI-related risks and opportunities across an organization" |
| 4 | (Not claimed) certification | same | Page text has no "certif" match, so the page makes no certification claim. |
| 5 | EU AI Act risk-based; 4 levels; chatbot transparency; GPAI rules | https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai | "The AI Act defines 4 levels of risk for AI systems"; chatbots: "humans should be made aware that they are interacting with a machine"; "rules ... for providers of GPAI models" |
| 6 | Applies to actors inside and outside EU under conditions; tiers incl. GPAI | https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act | "applies to both public and private actors inside and outside the EU" when they "place an AI system or general-purpose AI model on the EU market, or put an AI system into service or use it in the EU" |
| 7 | OWASP Top 10 for LLM 2025 items | https://genai.owasp.org/llm-top-10/ | "LLM01:2025 Prompt Injection" ... "LLM06:2025 Excessive Agency", "LLM07:2025 System Prompt Leakage", "LLM08:2025 Vector and Embedding Weaknesses", "LLM09:2025 Misinformation", "LLM10:2025 Unbounded Consumption" |
| 8 | Direct vs indirect injection; no fool-proof prevention; mitigations | https://genai.owasp.org/llmrisk/llm01-prompt-injection/ | "Indirect prompt injections occur when an LLM accepts input from external sources, such as websites or files."; "it is unclear if there are fool-proof methods of prevention"; "Segregate and identify external content"; "Conduct adversarial testing" |
| 9 | PII categories; redaction via pattern matching; least privilege; retention/deletion policy; system-prompt restrictions bypassable | https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/ | "Techniques like pattern matching can detect and redact confidential content"; "Maintain clear policies about data retention, usage, and deletion"; restrictions "may not always be honored and could be bypassed via prompt injection" |
| 10 | Data poisoning covers embedding data; integrity attack; track data origins, version datasets | https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/ | "Data poisoning occurs when pre-training, fine-tuning, or embedding data is manipulated"; "is considered an integrity attack"; "Track data origins and transformations" |
| 11 | Improper output handling: unvalidated output passed downstream; XSS/SQLi/RCE; treat model as untrusted user, encode output | https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/ | "insufficient validation, sanitization, and handling of the outputs"; "XSS and CSRF in web browsers as well as SSRF, privilege escalation, or remote code execution"; "Treat the model as any other user, adopting a zero-trust approach" |
| 12 | Excessive agency; minimize permissions; execute in user's context; HITL; logging limits damage | https://genai.owasp.org/llmrisk/llm062025-excessive-agency/ | "excessive functionality; excessive permissions; excessive autonomy"; "executed on downstream systems in the context of that specific user"; "require a human to approve high-impact actions"; logging "will not prevent Excessive Agency, but can limit the level of damage caused" |
| 13 | System prompt is not a security control; enforce controls outside LLM | https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/ | "should not be considered a secret, nor should it be used as a security control"; "privilege separation, authorization bounds checks, and similar must not be delegated to the LLM"; "deterministic, auditable manner" |
| 14 | Permission-aware vector stores; leaks across users; trusted sources; classification; immutable retrieval logs | https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/ | "Implement fine-grained access controls and permission-aware vector and embedding stores"; "Accept data only from trusted and verified sources"; "Maintain detailed immutable logs of retrieval activities" |
| 15 | Hallucination = credible-looking fabricated content | https://genai.owasp.org/llmrisk/llm092025-misinformation/ | "Misinformation occurs when LLMs produce false or misleading information that appears credible."; hallucination "generates content that seems accurate but is fabricated" |
| 16 | Unbounded consumption: cost, DoS; rate limiting, quotas, monitoring | https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/ | "denial of service (DoS), economic losses"; "Apply rate limiting and user quotas" |
| 17 | Indirect injection via data likely to be retrieved; data vs instructions blurred | https://arxiv.org/abs/2302.12173 | "LLM-Integrated Applications blur the line between data and instructions"; "by strategically injecting prompts into data likely to be retrieved" |
| 18 | Model cards = short docs with evaluation + intended use | https://arxiv.org/abs/1810.03993 | "Model cards are short documents accompanying trained machine learning models that provide benchmarked evaluation"; "disclose the context in which models are intended to be used" |
| 19 | Security trimming: filter results by user/group identity | https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search | "a filter that trims search results based on a string containing a group or user identity"; "you get the documents to which the request issuer has read access" |

## Changes after kongming review
- Removed the former source [7] (AI Act Service Desk, Article 2 page) because its title names a specific legal article; the EU scope sentence was rewritten to what [6] supports ("inside and outside the EU" when placing on the EU market, putting into service or using in the EU). Sources were renumbered; the table above uses the final numbering 1-19.
- Added [10] LLM04 and [11] LLM05 for the new data-poisoning and improper-output-handling concepts.
- [1] also states "The AI RMF 1.0 is being revised as part of the White House AI Action Plan." (used for the "đang được rà soát, sửa đổi" note).
- [4] supports "International Standard" (used for "Là tiêu chuẩn quốc tế, không phải văn bản luật").
- [15] LLM09 supports overreliance: reviewers "properly trained to avoid overreliance on AI-generated content".

## Claims rewritten or dropped for lack of a source
- ISO/IEC 42001 third-party certification: the official ISO page I opened does not mention certification, so the page does not claim it.
- EU AI Act application dates, articles, fines: deliberately omitted (task rule), although source [5]/[6] contain dates.
- Vendor data-use terms (training on API data, retention): openai.com/enterprise-privacy returned 403; page only advises "read your provider's terms" with no factual vendor claim.
- Vietnam: no specific document cited (task rule); generic "tham khảo quy định bảo vệ dữ liệu cá nhân hiện hành".

## Unopened / failed URLs (not cited)
- https://www.iso.org/insights/iso-42001-explained, https://www.iso.org/artificial-intelligence/ai-management-systems, https://www.iso.org/standard/81230.html: 403 to WebFetch.
- https://eur-lex.europa.eu/... (two URL forms): empty content to WebFetch. The AI Act Service Desk page was used in the draft, then removed after review (see above).
- https://webstore.iec.ch/en/publication/90575: 404.
- https://openai.com/enterprise-privacy/: 403.
- artificialintelligenceact.eu: opened but not cited (non-official site).
