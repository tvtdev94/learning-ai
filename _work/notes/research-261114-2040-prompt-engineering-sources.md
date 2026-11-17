# Research notes: prompt-engineering (accessed 2026-11-14)

All URLs below were opened with WebFetch on 2026-11-14. Format: claim -> URL -> short evidence quote.

## [1] Anthropic, Prompt engineering overview
- Before prompting you need success criteria, a way to test empirically, and a first draft -> https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview -> "A clear definition of the success criteria for your use case" / "Some ways to empirically test against those criteria" / "A first draft prompt you want to improve"
- Not every failing criterion is solved by prompting (latency/cost -> pick another model) -> same URL -> "Not every success criterion or failing eval is best solved by prompt engineering."

## [2] Anthropic, Prompting best practices
- Brilliant new employee analogy -> https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices -> "Think of Claude as a brilliant but new employee who lacks context on your norms and workflows."
- Colleague test -> same -> "Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too."
- Numbered steps when order matters -> same -> "Provide instructions as sequential steps using numbered lists or bullet points when the order or completeness of steps matters."
- Explain why (ellipses / text-to-speech) -> same -> "Your response will be read aloud by a text-to-speech engine, so never use ellipses..." / "Claude can generalize from the explanation."
- Examples: relevant, diverse (avoid unintended patterns), wrapped in tags, 3-5 -> same -> "vary enough that Claude doesn't pick up unintended patterns" / "Include 3–5 examples for best results."
- XML tags reduce misinterpretation -> same -> "Wrapping each type of content in its own tag ... reduces misinterpretation."
- Role in system prompt -> same -> "Setting a role in the system prompt focuses Claude's behavior and tone for your use case."
- Long docs at top, query at end, up to 30% -> same -> "Queries at the end can improve response quality by up to 30 percent in tests, especially with complex, multidocument inputs."
- Wrap documents in <document> with <source> -> same -> "wrap each document in <document> tags with <document_content> and <source> ... subtags"
- Quote first -> same -> "ask Claude to quote relevant parts of the documents first before carrying out its task."
- Say what to do instead of what not to do -> same -> "Tell Claude what to do instead of what not to do"
- Prompt style influences output style -> same -> "removing markdown from your prompt can reduce the volume of markdown in the output."
- Prefill no longer supported on newer models -> same -> "prefilled responses ... on the last assistant turn are no longer supported."
- Thinking: prefer general instructions -> same -> "A prompt such as "think thoroughly" often produces better reasoning than a hand-written step-by-step plan."
- Manual CoT as fallback when thinking off, answer in tags -> same -> "When thinking is off, you can still encourage step-by-step reasoning ... put the final answer in <answer> tags"
- Thinking adds latency -> same -> "Thinking adds latency and should only be used when it will meaningfully improve..."
- Chaining still useful to inspect intermediate outputs; self-correction pattern -> same -> "Explicit prompt chaining ... is still useful when you need to inspect intermediate outputs" / "generate a draft → have Claude review it against criteria → have Claude refine"

## [3] Anthropic, Reduce hallucinations
- Allow "I don't know" -> https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations -> "Explicitly give Claude permission to admit uncertainty."
- Direct quotes for grounding -> same -> "ask Claude to extract word-for-word quotes first"
- Verify with citations / retract -> same -> "If it can't find a quote, it must retract the claim."
- Restrict to provided docs -> same -> "only use information from provided documents and not its general knowledge."
- Not eliminated -> same -> "they don't eliminate them entirely."

## [4] Anthropic, Define success criteria and build evaluations
- Specific / measurable -> https://platform.claude.com/docs/en/test-and-evaluate/develop-tests -> "Instead of "good performance," specify "accurate sentiment classification.""
- Task-specific + edge cases -> same -> "Design evals that mirror your real-world task distribution. Don't forget to factor in edge cases!"
- Volume over quality -> same -> "More questions with slightly lower signal automated grading is better than fewer questions with high-quality human hand-graded evals."
- Grading methods: exact match, LLM-graded -> same -> "Structure questions to allow for automated grading (for example, multiple-choice, string match, code-graded, LLM-graded)."

## [5] Anthropic, Building effective agents (Erik S., Barry Zhang, 2024-12-19)
- Prompt chaining definition -> https://www.anthropic.com/engineering/building-effective-agents -> "Prompt chaining decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one."
- Gate checks -> same -> "programmatic checks (see "gate" ...) on any intermediate steps"
- Trade latency for accuracy -> same -> "trade off latency for higher accuracy, by making each LLM call an easier task."

## [6] OpenAI, Prompt engineering guide
- developer vs user priority -> https://developers.openai.com/api/docs/guides/prompt-engineering -> "developer messages are instructions provided by the developer, prioritized ahead of user messages."
- assistant role -> same -> "Messages generated by the model have the assistant role."
- Few-shot picks up pattern, diverse examples -> same -> "try to show a diverse range of possible inputs with the desired outputs."
- Developer message sections Identity, Instructions, Examples, Context; context near end -> same -> "is usually best positioned near the end of your prompt."
- XML delimit documents -> same -> "XML tags can help delineate where one piece of content ... begins and ends."
- Pin snapshots + evals -> same -> "Pinning your production applications to specific model snapshots" / "Building tests and evaluation suites that measure prompt behavior"
- Store prompts in code; reusable prompt objects deprecated -> same -> "Store production prompts in your application code instead of creating reusable prompt objects."
- Reasoning vs GPT models -> same -> "reasoning models will provide better results on tasks with only high-level guidance."

## [7] OpenAI, Reasoning best practices
- Avoid CoT prompts for reasoning models -> https://developers.openai.com/api/docs/guides/reasoning-best-practices -> "prompting them to 'think step by step' or 'explain your reasoning' is unnecessary."
- Zero shot first -> same -> "Reasoning models often don't need few-shot examples to produce good results."
- Delimiters -> same -> "Use delimiters like markdown, XML tags, and section titles"
- Be specific about end goal -> same -> "encourage the model to keep reasoning and iterating until it matches your success criteria."

## [8] OpenAI, Model optimization
- Evals first -> https://developers.openai.com/api/docs/guides/model-optimization -> "You might even consider writing evals before you start writing prompts"
- Prompting may be enough -> same -> "The prompt engineering process may be all you need in order to get great results for your use case."
- Iterate with evals -> same -> "With evals in place, you can effectively iterate on prompts."

## [9] OpenAI, Evaluation best practices
- Generative AI is variable -> https://developers.openai.com/api/docs/guides/evaluation-best-practices -> "Generative AI is variable."
- Vibe-based anti-pattern -> same -> "Using "it seems like it's working" as an evaluation strategy"
- Continuous eval on every change -> same -> "Set up continuous evaluation (CE) to run evals on every change"
- Log to mine eval cases -> same -> "Log as you develop so you can mine your logs for good eval cases."
- Calibrate LLM judge with humans -> same -> "Use human feedback to calibrate automated scoring."

## [10] OpenAI Cookbook, GPT-4.1 Prompting Guide (2025)
- Literal instruction following -> https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide -> "is trained to follow instructions more closely and more literally than its predecessors."
- Conflicting instructions -> later wins -> same -> "tends to follow the one closer to the end of the prompt."
- Long context: instructions at beginning and end -> same -> "place your instructions at both the beginning and end of the provided context."
- XML good, JSON poor for documents -> same -> "XML performed well in our long context testing." / "JSON performed particularly poorly."
- Strict vs blended grounding -> same -> "Only use the documents in the provided External Context to answer the User Query."
- Empirical -> same -> "AI engineering is inherently an empirical discipline."

## [11] Google, Prompt design strategies (Gemini API / AI Studio docs)
- Clear and specific -> https://aistudio.google.com/docs/prompting-strategies (redirect from ai.google.dev/gemini-api/docs/prompting-strategies) -> "provide it with clear and specific instructions."
- Always include few-shot -> same -> "We recommend to always include few-shot examples in your prompts."
- Too many examples overfit -> same -> "if you include too many examples, the model may start to overfit the response to the examples."
- Consistent formatting -> same -> "Make sure that the structure and formatting of few-shot examples are the same"
- One prompt per instruction / chaining -> same -> "Instead of having many instructions in one prompt, create one prompt per instruction." / "the output of one prompt in the sequence becomes the input of the next prompt."
- System instruction holds persona, constraints, format -> same -> "Place essential behavioral constraints, role definitions (persona), and output format requirements in the System Instruction"
- Iterative, order affects response -> same -> "Prompt engineering is iterative." / "The order of the content in the prompt can sometimes affect the response."
- Thinking models: not necessary to outline reasoning in response -> same -> "it's generally not necessary to have the model outline, plan, or detail reasoning steps in the returned response itself."
- Instructions at end (Gemini 3) -> same -> "Place your specific instructions or questions at the very end of the prompt."

## [12] Wei et al., Chain-of-Thought Prompting (arXiv 2201.11903, 2022)
- CoT improves complex reasoning; emerges at scale -> https://arxiv.org/abs/2201.11903 -> "significantly improves the ability of large language models to perform complex reasoning" / "emerge naturally in sufficiently large language models"

## [13] Kojima et al., Large Language Models are Zero-Shot Reasoners (NeurIPS 2022)
- "Let's think step by step" -> https://arxiv.org/abs/2205.11916 -> "simply adding 'Let's think step by step' before each answer" ; MultiArith 17.7% -> 78.7% with text-davinci-002

## [14] Min et al., Rethinking the Role of Demonstrations (EMNLP 2022)
- Labels barely matter; format/label space/input distribution matter -> https://arxiv.org/abs/2202.12837 -> "randomly replacing labels in the demonstrations barely hurts performance" / "(1) the label space, (2) the distribution of the input text, and (3) the overall format"

## [15] Zhao et al., Calibrate Before Use (ICML 2021)
- Format, examples, order shift accuracy; bias to answers near end -> https://arxiv.org/abs/2102.09690 -> "the choice of prompt format, training examples, and even the order of the training examples can cause accuracy to vary" / "placed near the end of the prompt"

## [16] Sclar et al., Quantifying LMs' Sensitivity to Spurious Features in Prompt Design (ICLR 2024)
- Up to 76 points from formatting -> https://arxiv.org/abs/2310.11324 -> "performance differences of up to 76 accuracy points when evaluated using LLaMA-2-13B"
- Report range across formats -> same -> "reporting a range of performance across plausible prompt formats"

## [17] Liu et al., Lost in the Middle (TACL 2023)
- Middle of long context degrades -> https://arxiv.org/abs/2307.03172 -> "performance is often highest when relevant information occurs at the beginning or end of the input context"

---
# Re-check and new evidence (2026-11-17)

All 17 URLs above were re-opened with WebFetch on 2026-11-17; the quoted text still matches unless noted. Page numbering below = source number in `prompt-engineering/index.html`.

## Corrections found on re-check
- [4] develop-tests: the "automate" list reads "multiple-choice, string match, code-graded, LLM-graded" (not "exact match"). Exact match is described separately -> "Exact match evals measure whether the model's output matches a predefined correct answer, typically after normalizing whitespace and case."
- [4] LLM-graded examples: use a different grader model -> "Generally best practice to evaluate with a different model from the one used to generate the evaluated output"
- [12] Wei et al.: abstract says "a 540B-parameter language model" with "just eight chain of thought exemplars" reaching SOTA on GSM8K; it does not name PaLM in the abstract.
- [3] quote-first applies to long documents -> "For tasks involving long documents (>20k tokens), ask Claude to extract word-for-word quotes first"

## Extra evidence from re-opened sources
- [2] Explicit > infer -> https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices -> "If you want Claude to do more than the task strictly requires, explicitly request it rather than relying on the model to infer this from vague prompts."
- [2] Examples relevant/diverse/structured in <example> tags -> same -> "Wrap examples in `<example>` tags (multiple examples in `<examples>` tags) so Claude can distinguish them from instructions."
- [2] Long data at top for 20k+ tokens -> same -> "Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples."
- [2] Negative -> positive instruction example -> same -> "Instead of: "Do not use markdown in your response" ... Try: "Your response should be composed of smoothly flowing prose paragraphs.""
- [2] Aggressive language overtriggers -> same -> "Where you might have said "CRITICAL: You MUST use this tool when...," you can use more normal prompting such as "Use this tool when...""
- [2] Prefill 400 error -> same -> "Starting with Claude 4.6 models ... prefilled responses ... are no longer supported. Requests with prefilled assistant messages to these models return a 400 error."
- [2] Self-check instruction -> same -> "Append something like "Before you finish, verify your answer against [test criteria].""
- [2] Precise instruction following ("suggest" vs "make changes") -> same -> "If you say "can you suggest some changes," Claude will sometimes provide suggestions rather than implementing them"
- [6] Reasoning model = senior co-worker, GPT = junior coworker -> https://developers.openai.com/api/docs/guides/prompt-engineering -> "A reasoning model is like a senior co-worker." / "A GPT model is like a junior coworker."
- [6] Markdown headers mark sections -> same -> "Markdown headers and lists can be helpful to mark distinct sections of a prompt"
- [6] Reused content at beginning for caching -> same -> "keep content that you expect to use over and over in your API requests at the beginning of your prompt"
- [7] CoT phrasing may hinder reasoning models -> https://developers.openai.com/api/docs/guides/reasoning-best-practices -> "may not enhance performance (and can sometimes hinder it)" / "Try zero shot first, then few shot if needed."
- [7] Keep simple -> same -> "Keep prompts simple and direct."
- [8] Evals before prompts, BDD -> https://developers.openai.com/api/docs/guides/model-optimization -> "You might even consider writing evals before you start writing prompts" ; flywheel "evals, prompt engineering, and fine-tuning"
- [9] Judge biases -> https://developers.openai.com/api/docs/guides/evaluation-best-practices -> "Position bias (response order), verbosity bias (preferring longer responses)" ; "Add reasoning and chain-of-thought as reasoning before scoring improves eval performance" ; "Use pairwise comparison or pass/fail for more reliability."
- [10] Instructions above context if only once -> https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide -> "above the provided context works better than below"
- [10] No all-caps/bribes -> same -> "It's generally not necessary to use all-caps or other incentives like bribes or tips."
- [10] Suggested structure -> same -> "Role and Objective, Instructions, Reasoning Steps, Output Format, Examples, Context, Final instructions"
- [11] Context first, instruction at end -> https://aistudio.google.com/docs/prompting-strategies -> "supply all the context first." ; zero-shot/few-shot definitions "prompts that provide no examples are called zero-shot prompts"
- [14] Holds over 12 models -> https://arxiv.org/abs/2202.12837 -> "consistently over 12 different models including GPT-3"
- [15] Variance range -> https://arxiv.org/abs/2102.09690 -> "from near chance to near state-of-the-art" ; common token bias "common in the pre-training data"
- [16] Persists with scale -> https://arxiv.org/abs/2310.11324 -> "Sensitivity remains even when increasing model size, the number of few-shot examples, or performing instruction tuning."
- [17] Even long-context models -> https://arxiv.org/abs/2307.03172 -> "significantly degrades when models must access relevant information in the middle of long contexts" / "even for explicitly long-context models"

## New sources (opened 2026-11-17)
## [5] Anthropic, Building effective agents (re-check)
- Start simple -> https://www.anthropic.com/engineering/building-effective-agents -> "Start with simple prompts, optimize them with comprehensive evaluation"
- Tool definitions deserve prompt engineering -> same -> "Tool definitions and specifications should be given just as much prompt engineering attention as your overall prompts."
- Chaining examples -> same -> "Writing an outline of a document, checking that the outline meets certain criteria"

## [18] Anthropic, Effective context engineering for AI agents (2025-09-29)
- Progression of prompt engineering -> https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents -> "we view context engineering as the natural progression of prompt engineering."
- Right altitude, two failure modes -> same -> "hardcoding complex, brittle logic in their prompts" / "vague, high-level guidance that fails to give the LLM concrete signals"
- Sections with XML/Markdown; formatting less important -> same -> "the exact formatting of prompts is likely becoming less important as models become more capable."
- Minimal prompt, add on failure modes -> same -> "start by testing a minimal prompt with the best model available" / "add clear instructions and examples to improve performance based on failure modes found during initial testing."
- Don't stuff edge cases; diverse canonical examples -> same -> "We do not recommend this." / "curate a set of diverse, canonical examples"

## [19] OWASP, LLM01:2025 Prompt Injection
- Definition -> https://genai.owasp.org/llmrisk/llm01-prompt-injection/ -> "A Prompt Injection Vulnerability occurs when user prompts alter the LLM's behavior or output in unintended ways."
- Indirect -> same -> "Indirect prompt injections occur when an LLM accepts input from external sources, such as websites or files."
- No fool-proof -> same -> "it is unclear if there are fool-proof methods of prevention for prompt injection."
- Mitigations -> same -> "Separate and clearly denote untrusted content" / "use deterministic code to validate adherence to these formats" / "Restrict the model's access privileges to the minimum necessary"

## [20] Wang et al., Self-Consistency (ICLR 2023)
- Method -> https://arxiv.org/abs/2203.11171 -> "first samples a diverse set of reasoning paths instead of only taking the greedy one" / "selects the most consistent answer by marginalizing out the sampled reasoning paths"
- Gains -> same -> "GSM8K (+17.9%), SVAMP (+11.0%), AQuA (+12.2%), StrategyQA (+6.4%) and ARC-challenge (+3.9%)"

## [21] OpenAI, Structured Outputs guide
- Schema adherence vs JSON mode -> https://developers.openai.com/api/docs/guides/structured-outputs -> "While both ensure valid JSON is produced, only Structured Outputs ensure schema adherence."
- No strongly worded prompts -> same -> "No need for strongly worded prompts to achieve consistent formatting"
- Still validate business rules -> same -> "validate any business rules that the schema does not express"

## [22] Anthropic, Prompt caching
- What it does -> https://platform.claude.com/docs/en/build-with-claude/prompt-caching -> "letting the API resume from specific prefixes in your prompts. This significantly reduces processing time and costs"
- Exact prefix -> same -> "Cache hits require 100 percent identical prompt segments"
- Static first -> same -> "Place static content (tool definitions, system instructions, context, examples) at the beginning of your prompt."

## [23] DAIR.AI, Prompt Engineering Guide: techniques
- Catalog of techniques (zero-shot, few-shot, CoT, self-consistency, prompt chaining, ReAct, ...) -> https://www.promptingguide.ai/techniques -> page lists "Zero-shot Prompting", "Few-shot Prompting", "Chain-of-Thought Prompting", "Self-Consistency", "Prompt Chaining", "ReAct"; footer "DAIR.AI"

## Evidence added after kongming review (2026-11-17)
- [8] Fine-tuning benefits -> https://developers.openai.com/api/docs/guides/model-optimization -> "For some use cases, it may be desirable to fine-tune a model for a specific task." / "You can provide more example inputs and outputs than could fit within the context window of a single request." / "You can train a smaller, cheaper, faster model"
- [8] Platform winding down -> same -> "OpenAI is winding down the fine-tuning platform." / "The platform is no longer accessible to new users"
- [5] Byline checked -> https://www.anthropic.com/engineering/building-effective-agents -> "Written by Erik S. and Barry Zhang." (page gives only "Erik S.")
- [5] Tools vs prompt time -> same -> "actually spent more time optimizing our tools than the overall prompt."
- [17] Venue year checked -> https://arxiv.org/abs/2307.03172 -> Comments: "Accepted for publication in Transactions of the Association for Computational Linguistics (TACL), 2023"
- [11] One format consistently -> https://aistudio.google.com/docs/prompting-strategies -> "XML-style tags (e.g., <context>, <task>) or Markdown headings are effective." / "Choose one format and use it consistently within a single prompt."
- [3] Template placeholders in examples -> https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations -> example prompts use "<report>{{REPORT}}</report>", "{{POLICY}}", "{{DOCUMENTS}}"
- [6] v1/prompts shutdown date -> https://developers.openai.com/api/docs/guides/prompt-engineering -> "v1/prompts is scheduled to shut down on November 30, 2026."
- [9] Log from development -> https://developers.openai.com/api/docs/guides/evaluation-best-practices -> "Log as you develop so you can mine your logs for good eval cases."

## [24] OWASP, LLM07:2025 System Prompt Leakage (opened 2026-11-17)
- Not a secret -> https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/ -> "the system prompt should not be considered a secret, nor should it be used as a security control."
- No credentials -> same -> "sensitive data such as credentials, connection strings, etc. should not be contained within the system prompt language."
- Control outside LLM -> same -> "rely on systems outside of the LLM to ensure this behavior."
