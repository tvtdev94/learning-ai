# Ghi chú nguồn: Fine-tuning hay RAG (fine-tuning-vs-rag)

Ngày nghiên cứu: 2026-11-17 (Asia/Saigon). Mọi URL dưới đây đã mở bằng WebFetch ngày 2026-11-17. Dạng: khẳng định → URL → trích ngắn làm bằng chứng.

Phạm vi: mục "14. Fine-tuning hay RAG" trong `_work/notes/researcher-261114-2030-next-ai-topics.md`.

## Tài liệu nhà cung cấp

### [1] OpenAI — Model optimization
- OpenAI đang thu hẹp nền tảng fine-tuning; người dùng mới không truy cập được → https://developers.openai.com/api/docs/guides/model-optimization → "OpenAI is winding down the fine-tuning platform." / "The platform is no longer accessible to new users."
- Model đã fine-tune vẫn chạy inference tới khi base model bị khai tử → cùng URL → "All fine-tuned models will remain available for inference until their base models are deprecated"
- Vòng lặp evals → prompt → (tùy chọn) fine-tune → evals → chỉnh → cùng URL → "flywheel of feedback that leads to better prompts and better training data for fine-tuning"
- Chỉ prompt có thể đủ → cùng URL → "The prompt engineering process may be all you need"
- Lợi ích fine-tuning: nhiều ví dụ hơn context window; prompt ngắn hơn → rẻ và nhanh hơn; huấn luyện trên dữ liệu riêng không phải gửi mỗi request; model nhỏ rẻ hơn làm tốt việc hẹp → cùng URL.
- SFT hợp: classification, nuanced translation, output theo định dạng, sửa lỗi làm theo chỉ dẫn; DPO hợp: tóm tắt tập trung đúng chỗ, tin nhắn "with the right tone and style" → cùng URL.
- Fine-tuning "a time-consuming process" → cùng URL.

### [2] OpenAI — Supervised fine-tuning
- Khách hàng cũ đủ điều kiện tạo job tới 2027-01-06, trừ khi base model khai tử sớm hơn → https://developers.openai.com/api/docs/guides/supervised-fine-tuning → "Eligible existing customers can create training jobs until January 6, 2027, unless the base model shuts down earlier."
- Model hỗ trợ: gpt-4.1-2025-04-14, gpt-4.1-mini-2025-04-14, gpt-4.1-nano-2025-04-14; nano và các bản fine-tune của nó kết thúc 2026-10-23; bản full và mini kết thúc 2027-01-14 → cùng URL.
- Tối thiểu 10 ví dụ; thấy cải thiện từ 50–100; khuyên bắt đầu với 50 ví dụ chất lượng → cùng URL → "We recommend starting with 50 well-crafted demonstrations"
- Evals trước → cùng URL → "Only invest in fine-tuning after setting up evals."
- Nếu 50 ví dụ không tác dụng thì xem lại task hoặc prompt → cùng URL → "If 50 examples have no impact, rethink your task or prompt before adding training data."
- Tách holdout từ cùng tập dữ liệu, độ đa dạng tương đương → cùng URL → "This holdout data acts as a control group when you use it for evals."
- Distillation: tối ưu prompt trên model lớn rồi dùng output làm dữ liệu huấn luyện model nhỏ → cùng URL.

### [3] OpenAI — Deprecations
- 2026-05-07 thông báo; tổ chức chưa từng fine-tune không tạo job được từ 2026-05-07 → https://developers.openai.com/api/docs/deprecations → "Creating fine-tuning jobs or training is not available to organizations that have not previously run fine-tuning."
- Từ 2026-07-02: tổ chức không chạy inference trên model fine-tune trong 60 ngày qua không tạo job được → cùng URL.
- 2027-01-06: khách hàng hiện có không tạo job mới được nữa → cùng URL → "Active existing customers will no longer be able to create new fine-tuning jobs on this date."
- Model fine-tune theo lịch khai tử của base model; ft-o4-mini-2025-04-16 tắt 2026-10-23 → cùng URL → "Fine-tuned versions of the models listed above follow the same shutdown schedule as their underlying base models."

### [4] OpenAI — Optimizing LLM accuracy
- Hai trục: context optimization (model thiếu kiến thức, kiến thức cũ hoặc riêng) → tối đa "response accuracy"; LLM optimization (kết quả không nhất quán, sai định dạng, sai giọng) → tối đa "consistency of behavior" → https://developers.openai.com/api/docs/guides/optimizing-llm-accuracy
- Ẩn dụ "in-context" (cầm sách giáo khoa khi thi) vs "learned" memory (đi học 6 tháng) → cùng URL → "framing each failed evaluation question as an in-context or learned memory problem"
- RAG chỉ giải quyết vấn đề in-context → cùng URL → "While useful, RAG only solves our in-context learning issues."
- Hai cách cộng dồn → cùng URL → "These two optimization methods are additive, not exclusive"
- Fine-tune với ví dụ có RAG để model không phải học dùng context zero-shot → cùng URL → "fine-tune the model with RAG examples in it"
- Ca tiếng Iceland: thêm RAG vào GPT-4 đã fine-tune làm BLEU giảm 87 → 83 → cùng URL → "RAG actually confounded the model by giving it extra noise"
- Lấy mục tiêu độ chính xác làm đích; ví dụ break-even accuracy 81,5% với +20 USD/thành công, −40 USD/chuyển người, −1000 USD/khách rời bỏ → cùng URL.

### [5] Microsoft — Fine-tuning in Microsoft Foundry (cập nhật 2026-10-29)
- Fine-tuning đổi trọng số thay vì thêm ví dụ vào prompt → https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview → "It adjusts the model's weights rather than adding examples to each prompt."
- Lợi ích: độ chính xác, giảm prompt, giọng văn và cấu trúc, tool use, "Use retrieved context effectively", chuyên môn hóa model nhỏ → cùng URL.
- Không thay retrieval cho thông tin hiện tại → cùng URL → "doesn't replace retrieval for current information or application-level safety controls"
- Ba phương pháp: SFT (prompt + câu trả lời mong muốn), DPO (cặp ưa/không ưa), RFT (prompt + grader) → cùng URL.
- Bảng model hỗ trợ (gpt-4.1 family SFT/DPO, o4-mini RFT, gpt-5 RFT cần lời mời, Llama-3.3-70B, Qwen3-32B, gpt-oss…) → cùng URL.
- Thách thức: chất lượng dữ liệu, overfitting và rò rỉ eval, reward hacking ("Rising reward doesn't establish better task performance if the model exploits the grader"), chi phí, adapter không dùng chéo base model, bảo trì khi base model sắp khai tử, an toàn → cùng URL.
- Phí host model fine-tune ở deployment Standard; Developer không có phí host theo giờ, chỉ để eval, sống 24 giờ → cùng URL.

### [6] Google Cloud — Introduction to tuning (Gemini Enterprise Agent Platform; URL vẫn dưới /vertex-ai/)
- Trang hiện dùng tên "Gemini Enterprise Agent Platform"; chuỗi "Vertex AI" chỉ còn trong URL (kiểm lại 2026-11-17). Trang chỉ gắn adapter tuning với nền tảng, không nêu full fine-tuning cho Gemini.
- Hỗ trợ SFT, preference tuning, RL fine-tuning; adapter (parameter-efficient) và full fine-tuning → https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/tune-models
- SFT: Gemini 3.5 Flash-Lite, 3.5 Flash, 3.1 Flash-Lite, 2.5 Pro, 2.5 Flash-Lite, 2.5 Flash; preference: 2.5 Flash-Lite, 2.5 Flash; RLFT: 3.5 Flash, 3.1 Flash-Lite → cùng URL.
- Bắt đầu bằng prompt, rồi mới fine-tune nếu cần → cùng URL → "Start with prompting to find the optimal prompt. Then, move on to fine-tuning (if required)"
- Fine-tune hợp khi có "think 100 examples or more" → cùng URL.
- Chất lượng hơn số lượng → cùng URL → "High-quality, well-labeled data is crucial for good performance and better than quantity."
- SFT hợp phân loại, sentiment, trích xuất thực thể; preference hợp giọng văn; RLFT hợp tác vụ kiểm chứng được (code, SQL) → cùng URL.

### [7] AWS — Amazon Bedrock: Customize your model
- Phương pháp: supervised fine-tuning, reinforcement fine-tuning (reward function qua Lambda), distillation (teacher → student) → https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html
- Phí huấn luyện = số token trong tập huấn luyện × số epoch, cộng phí lưu model mỗi tháng → cùng URL → "number of tokens in training data corpus × number of epochs"

### [8] AWS — Amazon Bedrock: supported models for fine-tuning
- Claude 3 Haiku là model Anthropic duy nhất trong bảng fine-tune, chỉ us-west-2; còn có Nova, Llama 3.x → https://docs.aws.amazon.com/bedrock/latest/userguide/custom-model-supported.html

### [22] Anthropic — Contextual Retrieval (2024-09-19)
- Kho kiến thức dưới 200.000 token (~500 trang) có thể đưa cả vào prompt, bỏ qua RAG; prompt caching giảm độ trễ >2 lần và chi phí tới 90% → https://www.anthropic.com/engineering/contextual-retrieval → "smaller than 200,000 tokens (about 500 pages of material)"

### [23] Hugging Face — PEFT docs
- PEFT chỉ fine-tune một số ít tham số thêm, giảm chi phí tính toán và lưu trữ, hiệu năng tương đương full fine-tune → https://huggingface.co/docs/peft/index → "only fine-tune a small number of (extra) model parameters"

### [24] OpenAI — Structured model outputs
- Structured output ràng buộc output (đã xong, không phải từ chối) theo JSON schema → https://developers.openai.com/api/docs/guides/structured-outputs → "Structured Outputs constrains completed, non-refusal model output to your supplied JSON Schema."

### [25] Sentence Transformers — Training Overview
- Fine-tune embedding model thường cải thiện mạnh vì mỗi việc cần một khái niệm tương đồng khác → https://sbert.net/docs/sentence_transformer/training_overview.html → "each task requires a different notion of similarity"

### Bổ sung cho [4] (kiểm lại sau review)
- Ca Iceland là sửa lỗi câu (không phải dịch); nguyên nhân: "RAG actually confounded the model by giving it extra noise" khi model "had already learned the task effectively through fine-tuning".

## Bài báo

- [9] Gao et al., RAG survey, 2023/2024 → https://arxiv.org/abs/2312.10997 và mục II-D ở https://arxiv.org/html/2312.10997v5 → hai trục "external knowledge requirements and model adaption requirements"; "RAG excels in dynamic environments by offering real-time knowledge updates"; "FT is more static, requiring retraining for updates"; "RAG and FT are not mutually exclusive and can complement each other".
- [10] Ovadia et al., Fine-Tuning or Retrieval?, 2023 → https://arxiv.org/abs/2312.05934 → "RAG consistently outperforms it" (cả kiến thức đã gặp và mới); "LLMs struggle to learn new factual information through unsupervised fine-tuning"; nhiều biến thể của cùng một fact có thể giúp.
- [11] Lewis et al., RAG, NeurIPS 2020 → https://arxiv.org/abs/2005.11401 → parametric memory (seq2seq) + non-parametric memory (dense vector index of Wikipedia); provenance và cập nhật kiến thức là bài toán mở.
- [12] Gekhman et al., EMNLP 2024 → https://arxiv.org/abs/2405.05904 → ví dụ chứa kiến thức mới học chậm hơn đáng kể; khi học được thì "linearly increase the model's tendency to hallucinate"; LLM chủ yếu học kiến thức khi pre-training.
- [13] Balaguer et al., RAG vs Fine-tuning: agriculture, 2024 → https://arxiv.org/abs/2401.08406 → fine-tune +6 điểm %, RAG thêm +5 điểm %, cộng dồn; Llama2-13B, GPT-3.5, GPT-4.
- [14] Zhang et al., RAFT, 2024 → https://arxiv.org/abs/2403.10131 → huấn luyện bỏ qua distractor documents, trích nguyên văn đoạn đúng, chain-of-thought; cải thiện trên PubMed, HotpotQA, Gorilla.
- [15] Hu et al., LoRA, 2021 → https://arxiv.org/abs/2106.09685 → đóng băng trọng số gốc, chèn ma trận hạng thấp; giảm tham số huấn luyện 10.000 lần, bộ nhớ GPU 3 lần (so với GPT-3 175B Adam); không thêm độ trễ inference.
- [16] Dettmers et al., QLoRA, 2023 → https://arxiv.org/abs/2305.14314 → fine-tune model 65B trên một GPU 48GB; model 4-bit đóng băng + LoRA; giữ hiệu năng như fine-tune 16-bit.
- [17] Biderman et al., LoRA Learns Less and Forgets Less, TMLR 2024 → https://arxiv.org/abs/2405.09673 → LoRA kém full fine-tune ở code và toán, nhưng giữ năng lực ngoài miền tốt hơn.
- [18] Luo et al., catastrophic forgetting, 2023 → https://arxiv.org/abs/2308.08747 → quên thảm khốc thấy ở model 1B–7B khi instruction tuning liên tục; nặng hơn khi model lớn hơn trong khoảng đó.
- [19] Qi et al., 2023 → https://arxiv.org/abs/2310.03693 → 10 ví dụ, dưới 0,20 USD qua API OpenAI phá guardrail GPT-3.5 Turbo; dữ liệu lành tính cũng làm giảm an toàn ở mức nhẹ hơn.
- [20] Carlini et al., 2020 → https://arxiv.org/abs/2012.07805 → trích xuất được hàng trăm chuỗi nguyên văn từ dữ liệu huấn luyện GPT-2, gồm PII; model lớn dễ bị hơn.
- [21] Rafailov et al., DPO, 2023 → https://arxiv.org/abs/2305.18290 → giải bài toán RLHF bằng "a simple classification loss", không cần lấy mẫu từ LM khi fine-tune.

## Chưa xác minh / không dùng
- Anthropic API trực tiếp có fine-tuning không: không tìm thấy trang chính thức nói rõ; trang chỉ nêu điều đã thấy ở Bedrock [8].
- Giá huấn luyện và giá inference của model fine-tune: không nêu số cụ thể; máy tính trong trang dùng số minh họa.
- Ngày cụ thể ở các trang blog bên thứ ba (vicblog, modelbrew…) không dùng; chỉ dùng trang deprecations chính thức [3].
