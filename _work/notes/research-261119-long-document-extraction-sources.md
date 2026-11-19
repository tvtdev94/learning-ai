# Nguồn nghiên cứu: Trích xuất có cấu trúc từ tài liệu dài bằng LLM

Ngày truy cập mọi nguồn: 2026-11-19. Mỗi dòng: khẳng định → URL → câu trích ngắn làm bằng chứng. Số [N] khớp với `#src-N` trong `long-document-extraction/index.html`.

## [1] Liu và cộng sự, Lost in the Middle (arXiv 2307.03172, TACL)
- Model dùng tốt nhất thông tin ở đầu hoặc cuối context → https://arxiv.org/abs/2307.03172 → "performance is often highest when relevant information occurs at the beginning or end of the input context"
- Giảm mạnh khi thông tin nằm giữa, kể cả model long-context → cùng URL → "significantly degrades when models must access relevant information in the middle of long contexts" / "even for explicitly long-context models"

## [2] Hsieh và cộng sự, RULER (arXiv 2404.06654, COLM 2024)
- 17 model, 13 tác vụ; chỉ nửa số model giữ được chất lượng ở 32K dù đều quảng cáo ≥ 32K → https://arxiv.org/abs/2404.06654 → "only half of them can maintain satisfactory performance at the length of 32K" / "these models all claim context sizes of 32K tokens or greater"
- Gần hoàn hảo ở needle-in-a-haystack đơn giản nhưng tụt khi dài hơn, có tác vụ tổng hợp (aggregation) → cùng URL → "almost all models exhibit large performance drops as the context length increases"

## [3] Li và cộng sự, RAG or Long-Context LLMs? (arXiv 2407.16833, EMNLP 2024 industry)
- Đủ tài nguyên thì long-context hơn RAG trung bình → https://arxiv.org/abs/2407.16833 → "when resourced sufficiently, LC consistently outperforms RAG in terms of average performance"
- RAG rẻ hơn nhiều → cùng URL → "RAG's significantly lower cost remains a distinct advantage"
- Self-Route định tuyến theo tự đánh giá của model → cùng URL → "routes queries to RAG or LC based on model self-reflection"

## [4] Anthropic, Context windows
- Context window gồm cả câu trả lời; context rot → https://platform.claude.com/docs/en/build-with-claude/context-windows → "more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as context rot."
- Các model hiện hành 1M token, tối đa 128k output mỗi request → cùng URL → "have a 1M-token context window. A single request to any of them can generate up to 128k output tokens"
- Tối đa 600 ảnh hoặc trang PDF mỗi request (100 với model 200k) → cùng URL → "A single request can include up to 600 images or PDF pages"
- Input vượt context thì lỗi 400 → cùng URL → "If the input alone already exceeds the model's context window, the API returns a 400"

## [5] Anthropic, Models overview
- Bảng: các model mới nhất 1M context, Max output 128K; giá tính theo triệu token input/output; Batch API giảm 50% → https://platform.claude.com/docs/en/models/overview → "Max output | 128K tokens" / "Batch API requests are 50% off"
- 128K là trần của Messages API đồng bộ; Batch API tới 300K output với beta header trên một số model; model cũ (Opus 4.5, Sonnet 4.5, Haiku 4.5) là 200K context / 64K output → cùng URL → "Max output: Synchronous Messages API limit. On the Message Batches API, … support up to 300k output tokens with the output-300k-2026-03-24 beta header."
- Prompt cache của nhà cung cấp giảm giá phần đầu vào lặp lại → cùng URL → "prompt cache reads cost 10% of the base input price"

## [6] Anthropic, PDF support
- Mỗi trang PDF thường 1.500–3.000 token chữ, cộng ảnh trang → https://platform.claude.com/docs/en/build-with-claude/pdf-support → "Each page typically uses 1,500–3,000 tokens depending on content density." / "Because Claude receives an image of each page"
- Tối đa 600 trang mỗi request → cùng URL → "Maximum pages per request | 600 (100 when the request's context window is under 1M tokens)"

## [7] Anthropic, Prompting best practices (mục Long context prompting)
- Đặt tài liệu dài ở đầu, câu hỏi ở cuối; tới 30% → https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices → "Queries at the end can improve response quality by up to 30 percent in tests, especially with complex, multidocument inputs."
- Trích câu liên quan trước khi làm việc → cùng URL → "ask Claude to quote relevant parts of the documents first before carrying out its task"

## [8] Google, Gemini API Long context
- Nhiều model 1M token trở lên; cách làm trực tiếp là đưa hết thông tin vào → https://aistudio.google.com/docs/long-context → "providing all relevant information upfront"
- Tìm nhiều "needle" thì không chính xác bằng → cùng URL → "the model does not perform with the same accuracy"
- Tối ưu chính là context caching; đặt câu hỏi ở cuối → cùng URL → "The primary optimization when working with long context and the Gemini models is to use context caching." / "put your query / question at the end of the prompt"

## [9] OpenAI, Structured Outputs
- Ràng buộc đầu ra hoàn chỉnh, không từ chối theo schema; app vẫn phải xử lý từ chối, đầu ra dở dang, kiểm quy tắc nghiệp vụ → https://developers.openai.com/api/docs/guides/structured-outputs → "Structured Outputs constrains completed, non-refusal model output to your supplied JSON Schema." / "validate any business rules that the schema does not express"
- Hết max tokens thì có thể không khớp schema → cùng URL → "if for example you reach a max tokens limit and the response is incomplete"
- Trường "có thể không có" biểu diễn bằng type có null (ví dụ `["string","null"]`, mô tả "Null otherwise") → cùng URL (ví dụ moderation)
- Mọi trường phải là required; trường tùy chọn giả lập bằng union với null → cùng URL → "To use Structured Outputs, all fields or function parameters must be specified as `required`." / "it is possible to emulate an optional parameter by using a union type with `null`."
- Trích dữ liệu có cấu trúc từ dữ liệu phi cấu trúc là một use case → cùng URL → "You can define structured fields to extract from unstructured input data"

## [10] Anthropic, Structured outputs
- Constrained decoding, luôn hợp lệ → https://platform.claude.com/docs/en/build-with-claude/structured-outputs → "Structured outputs guarantee schema-compliant responses through constrained decoding"
- Không hỗ trợ minimum/maximum; additionalProperties phải false → cùng URL → "Numerical constraints (such as `minimum`, `maximum`, `multipleOf`)" (Not supported)
- Thuộc tính required ra trước, optional sau → cùng URL → "required properties appear first, followed by optional properties"
- stop_reason max_tokens: đầu ra có thể dở và không khớp schema → cùng URL → "The output might be incomplete and not match your schema."
- Enum có thể sai hoa/thường → cùng URL → "Structured outputs don't guarantee the capitalization of string `enum` and `const` values"
- Giới hạn: 24 tham số optional, 16 tham số union → cùng URL → "Optional parameters | 24" / "Parameters with union types | 16"
- Kiểu nullable cũng tính là union → cùng URL → "Total parameters that use anyOf or type arrays (for example, \"type\": [\"string\", \"null\"]) across all strict schemas."
- Không dùng chung với Citations (400) → cùng URL → "The API returns a 400 error if citations are enabled with `output_config.format`."

## [11] Google, Gemini API Structured output
- Giá trị phải kiểm trong ứng dụng dù JSON đúng cú pháp → https://aistudio.google.com/docs/structured-output → "While output is syntactically correct JSON, always validate values in your application."
- Cho phép null bằng mảng type → cùng URL → "To allow a property to be null, include "null" in the type array"
- Use case trích dữ liệu → cùng URL → "Data extraction: Pull specific information like names and dates from text."

## [12] Anthropic, Citations
- Con trỏ hợp lệ, cited_text không tính output token → https://platform.claude.com/docs/en/build-with-claude/citations → "citations are guaranteed to contain valid pointers to the provided documents" / "`cited_text` does not count toward your output tokens"
- Lấy dữ liệu có cấu trúc kèm trích dẫn: mỗi dòng một trường, code tự parse; API không bảo đảm mỗi trường có giá trị và trích dẫn → cùng URL → "prompt Claude to answer with one line per field" / "Check that each field has a value and at least one citation. The API doesn't guarantee either."

## [13] Anthropic, Reduce hallucinations
- Cho phép nói "không biết" → https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations → "Explicitly give Claude permission to admit uncertainty."
- Tài liệu > 20k token: trích nguyên văn trước → cùng URL → "ask Claude to extract word-for-word quotes first"
- Không tìm được câu trích thì rút lại khẳng định → cùng URL → "If it can't find a quote, it must retract the claim."
- Best-of-N: chạy nhiều lần, chỗ không nhất quán có thể là bịa → cùng URL → "Inconsistencies across outputs could indicate hallucinations."

## [14] Instructor
- Thư viện Python dùng Pydantic, tự kiểm và thử lại → https://python.useinstructor.com/ → "extracts structured, validated data from Large Language Models" / "Automatically reask the model when validation fails"
- Giấy phép MIT; 15+ nhà cung cấp → cùng URL → "licensed under the terms of the MIT License"

## [15] Google, LangExtract (README)
- Gắn mỗi trích xuất với vị trí chính xác trong văn bản nguồn → https://github.com/google/langextract → "Maps every extraction to its exact location in the source text"
- Không định vị được thì char_interval = None; nên lọc bỏ → cùng URL → "extractions that cannot be located in the source text will have `char_interval = None`"
- Có thể lấy nhầm nội dung từ ví dụ few-shot → cùng URL → "LLMs may occasionally extract content from few-shot examples rather than the input text."
- Tài liệu dài: chunking, song song, nhiều lượt để tăng recall → cùng URL → "text chunking, parallel processing, and multiple passes for higher recall"
- Apache 2.0; không phải sản phẩm Google hỗ trợ chính thức → cùng URL → "This is not an officially supported Google product."

## [16] LlamaIndex, Overview of Extract (LlamaParse Extract, trước là LlamaExtract)
- API trích dữ liệu có cấu trúc từ PDF, ảnh; bảo đảm khớp schema hoặc báo lỗi → https://developers.llamaindex.ai/llamaparse/extract/getting_started/ (URL cũ /python/cloud/llamaextract/getting_started/ chuyển hướng 308 về đây) → "Extract guarantees that your data complies with the provided schema or provides helpful error messages when it doesn't."
- Có các mức (tier) Agentic Plus, Agentic, Cost Effective, Turbo → cùng URL → "Turbo is the speed tier, for latency-sensitive work on PDF and image inputs."

## [17] Google Cloud, Document AI Custom Extractor
- Mặc định là foundation model, dự đoán zero-shot dựa vào tên và mô tả trường → https://docs.cloud.google.com/document-ai/docs/ce-mechanisms → "the default custom extractor model type is a foundation model, which can perform zero-shot prediction" / "use the field name and description to form the underlying prompt"
- Model tự huấn luyện cần ≥ 10 mẫu train và 10 mẫu test mỗi trường → cùng URL → "At least 10 training instances and 10 test instances of each field"
- Không sửa, xóa trường sau khi tạo phiên bản processor, chỉ tắt được → cùng URL → "After you create a processor version, you can't change or delete fields you have created. You can disable them on the fields page if you no longer need them."

## [18] Google Cloud, Document AI Evaluate performance
- Precision, recall, F1 và TP/FP/FN → https://docs.cloud.google.com/document-ai/docs/evaluate → "the proportion of predictions that match the annotations in the test set" / "the proportion of annotations in the test set that are correctly predicted"
- FP và FN không loại trừ nhau → cùng URL → "False positives and false negatives are not mutually exclusive."
- Ngưỡng tin cậy cao hơn: precision cao hơn, recall thấp hơn → cùng URL → "higher precision, because the predictions are more likely to be correct"
- Fuzzy matching: chuẩn hóa khoảng trắng, dấu câu, chữ thường; không áp cho số → cùng URL → "You cannot use fuzzy matching on numeric values."
- Chỉ số "All labels" là tổng TP/FP/FN của mọi nhãn (micro) → cùng URL → "weighted by the number of times each label appears in the dataset"

## [19] Microsoft, Azure Content Understanding – Document overview
- Grounding và confidence cho field, chuyển phần thấp sang người duyệt → https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview → "Use confidence scores and source grounding to route low-confidence or insufficiently grounded extractions for human review."
- Ba phương thức extract / classify / generate → cùng URL
- Use case hợp đồng, báo cáo tài chính, hợp đồng bảo hiểm → cùng URL → "Insurance policy analysis"

## [20] Microsoft, Document Intelligence – accuracy and confidence
- Confidence là xác suất ước lượng 0–1; dùng để tự nhận hay gửi người duyệt → https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/concept/accuracy-confidence → "confidence can be used to determine whether to automatically accept the prediction or flag it for human review"
- Hàng bảng bị chia qua trang có thể có confidence của hàng thấp hơn (cell vẫn cao) → cùng URL → "Expect the cell confidence to be high and row confidence to be potentially lower than rows that aren't split."

## [21] AWS, Amazon Augmented AI (A2I)
- Người duyệt dự đoán confidence thấp hoặc mẫu ngẫu nhiên; không nhận khách mới → https://docs.aws.amazon.com/sagemaker/latest/dg/a2i-use-augmented-ai-a2i-human-review-loops.html → "human review of low-confidence predictions or random prediction samples" / "Amazon SageMaker A2I is no longer open to new customers."

## [22] LangChain, LangGraph Graph API
- Send cho map-reduce, số mục chỉ biết lúc chạy; reducer gộp kết quả → https://docs.langchain.com/oss/python/langgraph/graph-api → "often called map-reduce or orchestrator-worker" / "When workers write to shared state keys, reducers merge their updates"
- Cache kết quả node theo input → cùng URL → "LangGraph can cache node (and task) results by input."

## [23] LangChain, LangGraph Fault tolerance
- Retry chạy lại cả node; checkpoint ở ranh giới super-step → https://docs.langchain.com/oss/python/langgraph/fault-tolerance → "A retry re-runs the entire node function from the start." / "Checkpoints are written at super-step boundaries, not mid-function."
- At-least-once, side effect phải idempotent → cùng URL → "at-least-once semantics for node execution" / "Application code must make those effects idempotent."
- Khóa idempotency lấy từ state đã bền → cùng URL → "Derive the key from state that is already durable"
- Bọc từng đơn vị trong task để resume bỏ qua phần đã xong → cùng URL → "wrap each unit in a task"

## [24] Temporal, Activities
- Khuyên Activity idempotent để retry không gây trùng → https://docs.temporal.io/activities → "We recommend that it be idempotent, so retries can be processed without duplicate side effects."
- Mỗi lần thử bắt đầu lại từ đầu, trừ khi dùng Heartbeat để checkpoint → cùng URL → "Each attempt starts from the initial state, unless your code uses a Heartbeat detail payload for checkpointing."

## [25] Stripe, Idempotent requests
- Lưu kết quả lần đầu theo khóa, retry trả lại kết quả đã lưu; so tham số → https://docs.stripe.com/api/idempotent_requests → "Retries with the same key return the saved response" / "compares incoming parameters to those of the original request and errors if they're not the same"

## [26] LangChain, Indexing API (langchain-core)
- Dùng record manager và hash để biết tài liệu nào bỏ qua; đổi encoder thì phải đổi index → https://reference.langchain.com/python/langchain-core/indexing/api/index → "documents are indexed using their hashes" / "which documents should be skipped"

## [27] Anthropic, Batch processing
- Giảm 50%, đa số batch xong dưới 1 giờ, hết hạn nếu chưa xong trong 24 giờ → https://platform.claude.com/docs/en/build-with-claude/batch-processing → "most batches completing within 1 hour" / "Batches expire if processing does not complete within 24 hours."
- custom_id để ghép kết quả → cùng URL → "A unique `custom_id` for identifying the Messages request."
- Tối đa 100.000 request hoặc 256 MB → cùng URL

## [28] Chang và cộng sự, BooookScore (arXiv 2310.00785, ICLR 2024)
- Tóm tắt sách vượt context: chia chunk rồi gộp tóm tắt; hai cách: gộp phân cấp và cập nhật dần → https://arxiv.org/abs/2310.00785 → "hierarchically merging chunk-level summaries, and (2) incrementally updating a running summary"
- Tám loại lỗi mạch lạc; gộp phân cấp ít chi tiết hơn → cùng URL → "identify eight common types of coherence errors made by LLMs" / "Incremental updating yields lower BooookScore but higher level of detail than hierarchical merging"

## [29] Stanisławek và cộng sự, Kleister (arXiv 2105.05796, ICDAR 2021)
- Bộ dữ liệu trích thông tin từ tài liệu dài: NDA (540 tài liệu, 3.229 trang) và báo cáo tài chính từ thiện (2.788 tài liệu, 61.643 trang); đo F1 → https://arxiv.org/abs/2105.05796 → "we introduce two new datasets (Kleister NDA and Kleister Charity)" / "The best model achieved an 81.77% and an 83.57% F1-score"
- Kết hợp bản scan và PDF số, cần cả chữ và bố cục → cùng URL → "a mix of scanned and born-digital long formal English-language documents"

## [30] Xiong và cộng sự, Can LLMs Express Their Uncertainty? (arXiv 2306.13063, ICLR 2024)
- LLM nói ra độ tự tin thì thường tự tin quá mức → https://arxiv.org/abs/2306.13063 → "LLMs, when verbalizing their confidence, tend to be overconfident"
- Nhiều câu trả lời và độ nhất quán giúp giảm → cùng URL → "help mitigate this overconfidence"

## [31] Christophides và cộng sự, End-to-End Entity Resolution for Big Data: A Survey (arXiv 1905.06397)
- Entity resolution: nhận ra các mô tả khác nhau cùng chỉ một thực thể → https://arxiv.org/abs/1905.06397 → "ER aims to identify different descriptions that refer to the same real-world entity"

## [32] Microsoft Learn, SOC 2 Type 2 (Azure compliance)
- SOC là báo cáo kiểm soát nội bộ do AICPA đặt ra, giúp bên dùng dịch vụ đánh giá rủi ro thuê ngoài → https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-soc-2 → "internal control reports created by the American Institute of Certified Public Accountants (AICPA)"
- Type 2: kiểm soát vận hành hiệu quả trong một khoảng thời gian → cùng URL → "were operating effectively over a specified time period"
- Phản hồi của ban điều hành về ngoại lệ ở cuối báo cáo → cùng URL → "Management responses are located towards the end of the SOC attestation report."

## Ghi chú
- Không tìm được nguồn công khai đã mở về "summary of summary" theo đúng chữ; trang dùng [28] cho ý gộp phân cấp mất chi tiết và tự viết quy tắc "nguồn PDF là sự thật" như một khuyến nghị thiết kế, không gán cho nguồn.
- Mọi con số trong stepper và mô phỏng (giây, token, số kiểm soát) là minh họa, tính bằng JS trong trang.
- Trang LangChain "extraction long text" cũ đã chuyển hướng về trang tổng quan, không dùng.
