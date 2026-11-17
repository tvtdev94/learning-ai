# Ghi chú nguồn: llm-fundamentals (Cách LLM hoạt động)

Ngày truy cập tất cả: 2026-11-14. Mỗi dòng: khẳng định → URL → trích ngắn làm bằng chứng. Số [N] khớp `#src-N` trong trang.

## [1] Anthropic Glossary — https://platform.claude.com/docs/en/about-claude/glossary
- Token có thể là từ, phần của từ, ký tự hoặc byte → [1] → "Tokens ... can correspond to words, subwords, characters, or even bytes"
- Model cũ: 1 token ≈ 3,5 ký tự tiếng Anh; tokenizer mới (Claude 4.7+) tạo ~30% nhiều token hơn → [1] → "approximately 30 percent more tokens for the same text than earlier models, on which a token represents approximately 3.5 English characters"
- Token lớn tăng hiệu quả; token nhỏ giúp xử lý từ lạ → [1] → "smaller tokens allow a model to handle uncommon or never-before-seen words"
- Pretraining = dự đoán từ tiếp theo trên kho văn bản lớn không nhãn; model pretrained không giỏi làm theo hướng dẫn → [1] → "pretrained to predict the next word" / "not inherently good at answering questions or following instructions"
- RLHF = người xếp hạng các câu trả lời, RL khuyến khích giống câu xếp hạng cao → [1] → "Human feedback consists of ranking a set of two or more example texts"
- Temperature cao → đa dạng; thấp → bảo thủ → [1] → "Higher temperatures lead to more creative and diverse outputs"
- Temperature 0 vẫn không tất định hoàn toàn → [1] → "Even with temperature set to 0, the results will not be fully deterministic"
- Context window là "working memory", khác dữ liệu huấn luyện → [1] → "represents a “working memory” for the model"
- TTFT và latency, yếu tố ảnh hưởng gồm độ dài prompt/response → [1] → "complexity of the prompt and the generated response"
- RAG đưa tài liệu vào context window lúc chạy → [1] → "a set of documents that is passed into the context window"

## [2] Sennrich, Haddow, Birch 2016 — https://arxiv.org/abs/1508.07909
- Subword/BPE xử lý từ hiếm và từ chưa gặp → [2] → "encoding rare and unknown words as sequences of subword units"; "byte pair encoding compression algorithm"

## [3] OpenAI tiktoken README — https://github.com/openai/tiktoken
- BPE đảo ngược được, chạy trên văn bản bất kỳ, nén ~4 byte/token, cho model thấy subword phổ biến → [3] → "reversible and lossless"; "works on arbitrary text"; "each token corresponds to about 4 bytes"; "let the model see common subwords"

## [4] Petrov et al. 2023 — https://arxiv.org/abs/2305.15425
- Cùng nội dung, số token chênh tới 15 lần giữa ngôn ngữ; ảnh hưởng chi phí, độ trễ, lượng context → [4] → "differences up to 15 times in some cases"; "processing time and latency, as well as the amount of content that can be provided as context"

## [5] Vaswani et al. 2017 — https://arxiv.org/abs/1706.03762
- Transformer chỉ dựa vào attention, song song hóa tốt → [5] → "based solely on attention mechanisms, dispensing with recurrence and convolutions entirely"; "more parallelizable"

## [6] Anthropic, Effective context engineering for AI agents (2025-09-29) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Mọi token attend mọi token → n² quan hệ → [6] → "This results in n² pairwise relationships for n tokens"
- Attention budget; context rot → [6] → "Every new token introduced depletes this budget"; "ability to accurately recall information from that context decreases"
- Tập token nhỏ nhất giàu tín hiệu → [6] → "smallest possible set of high-signal tokens"

## [7] von Platen, How to generate text (Hugging Face, 2020, cập nhật 2023) — https://huggingface.co/blog/how-to-generate
- Sinh tự hồi quy = tích các phân phối token kế tiếp → [7] → "decomposed into the product of conditional next word distributions"
- Greedy chọn từ xác suất cao nhất → [7] → "selects the word with the highest probability"
- Giảm temperature làm phân phối nhọn; T→0 thành greedy → [7] → "increasing the likelihood of high probability words"; "becomes equal to greedy decoding"
- Top-p: tập nhỏ nhất có tổng xác suất vượt p, chuẩn hóa lại → [7] → "smallest possible set of words whose cumulative probability exceeds the probability p"; "probability mass is then redistributed"

## [8] Holtzman et al. 2020 — https://arxiv.org/abs/1904.09751
- Giải mã theo likelihood cho văn nhạt, lặp; nucleus sampling cắt phần đuôi kém tin cậy → [8] → "bland and strangely repetitive"; "truncating the less reliable tail of the distribution"

## [9] Brown et al. 2020 (GPT-3) — https://arxiv.org/abs/2005.14165
- Model tự hồi quy 175B; few-shot qua văn bản, không cập nhật gradient → [9] → "autoregressive language model with 175 billion parameters"; "without any gradient updates or fine-tuning"

## [10] Ouyang et al. 2022 (InstructGPT) — https://arxiv.org/abs/2203.02155
- To hơn không có nghĩa làm theo ý tốt hơn → [10] → "Making language models bigger does not inherently make them better at following a user's intent"
- SFT trên ví dụ mẫu, rồi xếp hạng + RLHF → [10] → "fine-tune GPT-3 using supervised learning"; "rankings of model outputs"
- 1.3B InstructGPT được ưa hơn 175B GPT-3 → [10] → "outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3"

## [11] Anthropic, Context windows — https://platform.claude.com/docs/en/build-with-claude/context-windows
- Context window gồm cả câu trả lời → [11] → "all the text a language model can reference when generating a response, including the response itself"
- Context rot → [11] → "As token count grows, accuracy and recall degrade, a phenomenon known as context rot"
- Mọi thứ trong request đều tính (system, messages, tool results, tool definitions, output, thinking) → [11] → "Everything in the request counts toward the context window"
- Lịch sử hội thoại tích lũy mỗi lượt → [11] → "each user message and assistant response accumulates within the context window"
- usage báo số token → [11] → "Every response reports what the request consumed in its usage field"
- Input vượt window → lỗi 400 → [11] → "returns a 400 invalid_request_error (“prompt is too long”)"
- Thinking tokens tính là output → [11] → "billed as output tokens"
- Kích thước 1M hoặc 200k tùy model → [11] → "have a 1M-token context window" / "have a 200k-token context window"

## [12] Liu et al. 2023 Lost in the Middle — https://arxiv.org/abs/2307.03172
- Tốt nhất khi thông tin ở đầu/cuối, giảm khi ở giữa, kể cả model long-context → [12] → "often highest when relevant information occurs at the beginning or end"; "significantly degrades ... in the middle"; "even for explicitly long-context models"

## [13] Hong, Troynikov, Huber (Chroma) 2025, Context Rot — https://www.trychroma.com/research/context-rot
- 18 LLM; hiệu năng giảm khi input dài, kể cả tác vụ đơn giản → [13] → "model performance consistently degrades with increasing input length"; "even on simple tasks"

## [14] Anthropic, Models overview — https://platform.claude.com/docs/en/models/overview
- Giá tính theo triệu token, input và output riêng; trong bảng, output = 5 × input (vd. $4 / $20 MTok) → [14] → "$4 / input MTok, $20 / output MTok"; "MTok: Million tokens"
- Batch giảm 50%, cache read rẻ hơn nhiều → [14] → "Batch API requests are 50% off; prompt cache reads cost 10% of the base input price"
- Reliable knowledge cutoff vs training data cutoff → [14] → "The date through which the model’s knowledge is most extensive and reliable. Training data cutoff ... is the broader range"
- 1M token ≈ 555k từ ≈ 2,5M ký tự với tokenizer hiện tại → [14] → "1M tokens is roughly 555k words or 2.5M Unicode characters"

## [15] Anthropic, Claude Opus 5.5 migration guide — https://platform.claude.com/docs/en/models/opus-5-5/migration-guide
- Bỏ temperature/top_p/top_k, dùng prompting; temperature 0 chưa bao giờ đảm bảo giống hệt → [15] → "Omit temperature, top_p, and top_k. Use prompting"; "it never guaranteed identical outputs on prior models"

## [16] He, H. / Thinking Machines Lab (2025-09-10), Defeating Nondeterminism in LLM Inference — https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
- Temperature 0 (greedy) trên API vẫn không tất định → [16] → "LLM APIs are still not deterministic in practice"
- Nguyên nhân: thiếu batch invariance, kết quả phụ thuộc batch size theo tải server → [16] → "lacks 'batch invariance', causing our request's output to depend on the batch size"

## [17] Kalai et al. 2025, Why Language Models Hallucinate — https://arxiv.org/abs/2509.04664
- Huấn luyện và đánh giá thưởng việc đoán → [17] → "reward guessing over acknowledging uncertainty"
- Áp lực thống kê trong pretraining → [17] → "will arise through natural statistical pressures"
- Đoán khi không chắc giúp tăng điểm benchmark → [17] → "guessing when uncertain improves test performance"

## [18] Ji et al. 2022, Survey of Hallucination in NLG — https://arxiv.org/abs/2202.03629
- Mô hình sinh dễ tạo văn bản ngoài ý muốn, làm giảm chất lượng → [18] → "prone to hallucinate unintended text"

## [19] OpenAI, Latency optimization — https://developers.openai.com/api/docs/guides/latency-optimization
- TTFT là thời gian bắt đầu trả nội dung → [19] → "measures how long an API request takes to start returning content"
- Prompt dài làm chậm token đầu → [19] → "A long prompt can delay the first token"
- Sinh ít token hơn khi trả lời lâu xong → [19] → "If an answer starts quickly but takes too long to finish, inspect what the model generates"

## [20] Anthropic, Messages API reference — https://platform.claude.com/docs/en/api/messages/create
- max_tokens là trần tuyệt đối số token sinh → [20] → "The maximum number of tokens to generate before stopping"
- stop_reason "max_tokens" khi chạm trần → [20] → "\"max_tokens\": we exceeded the requested max_tokens or the model's maximum"
- Tính phí theo token → [20] → "Anthropic's API bills and rate-limits by token counts"

## Không dùng / đã loại
- help.openai.com "What are tokens" → 403, không trích.
- OpenAI latency guide: KHÔNG có câu "giảm 50% output ≈ giảm 50% latency" (đã kiểm), không dùng.
- Hinton 2015 abstract không nói về temperature → không trích.
- Blog bên thứ ba về API version 2026-10-21 bỏ temperature: chưa xác minh trên trang chính thức → không dùng; chỉ dùng migration guide Opus 5.5 [15].

## Bổ sung [5] — bản HTML đầy đủ https://arxiv.org/html/1706.03762v7 (trang dẫn vẫn dùng link abs)
- Chồng nhiều lớp giống nhau → [5] → "composed of a stack of N=6 identical layers"
- Multi-head attention → [5] → "jointly attend to information from different representation subspaces"
- Mask: vị trí i chỉ phụ thuộc vị trí trước → [5] → "predictions for position i can depend only on the known outputs at positions less than i"
- Attention = tổng có trọng số; trọng số qua softmax → [5] → "computed as a weighted sum of the values"; "apply a softmax function to obtain the weights"
- Embedding biến token thành vector → [5] → "learned embeddings to convert the input tokens and output tokens to vectors"

## Mở lại toàn bộ 20 URL ngày 2026-11-17 (trang đổi ngày truy cập sang 2026-11-17)
- [1] glossary: vẫn khớp mọi câu trên. Thêm: "Claude 4.7 and later models ... use a newer tokenizer that produces approximately 30 percent more tokens"; "The Claude API does not currently offer fine-tuning"; RAG "to better ground the model’s response in evidence"; "the effectiveness of RAG depends on the quality and relevance of the external knowledge base".
- [11] context windows: khớp. Thêm: "On Claude 4.5 models and newer, if input tokens plus `max_tokens` exceeds the context window size, the API accepts the request. If generation then reaches the context window limit, it stops with `stop_reason: \"model_context_window_exceeded\"`. On earlier models, the API returns a validation error instead."
- [14] models overview: khớp ($4/$20 Opus 5.5; $8/$40; $2/$10; Haiku "From $0.10 / From $0.50"; mọi dòng output = 5 × input); "1M tokens is roughly 555k words or 2.5M Unicode characters on the current tokenizer (introduced with Claude Opus 4.7)"; "Batch API requests are 50% off; prompt cache reads cost 10% of the base input price (2.5% on ... 5% on ...)".
- [15] migration guide Opus 5.5: khớp, "Omit `temperature`, `top_p`, and `top_k`. Use prompting"; "it never guaranteed identical outputs on prior models".
- [20] Messages API: khớp max_tokens, stop_reason ("end_turn", "max_tokens", "model_context_window_exceeded"), "bills and rate-limits by token counts". Trang KHÔNG còn mô tả temperature/top_p → bỏ câu "thường chỉ chỉnh một trong hai: temperature hoặc top-p" (không có nguồn), thay bằng lời khuyên đổi từng tham số rồi đo.
- [19] OpenAI latency: khớp. Thêm: "For repeated inputs, put stable instructions, examples, and tool definitions first." (đỡ dòng "đặt phần cố định lên đầu để tận dụng prompt caching").
- [13] Chroma: tác giả Hong, Troynikov, Huber, 2025-07-14; "we evaluate 18 LLMs"; "even under these minimal conditions, model performance degrades as input length increases". Đổi "giảm đều" thành "giảm" cho sát nguồn.
- [2] [3] [4] [5] [6] [7] [8] [9] [10] [12] [16] [17] [18]: mở lại, câu trích ở trên vẫn khớp (Kalai et al.: "modifying the scoring of existing benchmarks"; Liu et al. TACL 2023; Ji et al. ACM Computing Surveys 2022; He 2025-09-10).

## Nguồn thêm sau review kongming (2026-11-17)
### [21] Anthropic, Thinking — https://platform.claude.com/docs/en/build-with-claude/thinking
- Thinking bật mặc định trên Messages API → [21] → "Messages API: On by default."
- Model viết nháp trước khi trả lời, khối thinking đứng trước text → [21] → "Claude works through the problem in its own words before answering"; "arrives in `thinking` content blocks ahead of the response"
- Lợi ích cho task phức tạp → [21] → "thinking improves performance on complex tasks such as math, coding, analysis, and long-running agentic wo[rk]"
- Chi phí → [21] → "billed as output tokens, even when the thinking text isn’t returned to you, and they count toward `max_tokens`"
- [14] bổ sung: "Adaptive thinking lets the model decide how much to think, steered by effort"; "Actual latency depends on prompt length, output length, and thinking effort"; Opus 5.5 Thinking "Adaptive (always on)".
### [22] OWASP, LLM01:2025 Prompt Injection — https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- Định nghĩa → [22] → "occurs when user prompts alter the LLM's behavior or output in unintended ways"
- Gián tiếp qua nội dung ngoài → [22] → "Indirect prompt injections occur when an LLM accepts input from external sources, such as websites or files."
- [20] bổ sung: "Under the hood, the API transforms requests into a format suitable for the model."; stop_reason "tool_use: the model invoked one or more tools".
- [11] bổ sung: tool_result là input ở lượt sau ("Input components: Every block in the first turn and the `tool_result`").
### [7] bổ sung
- Top-k → [7] → "the K most likely next words are filtered and the probability mass is redistributed among only those K next words"
