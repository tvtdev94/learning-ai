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
