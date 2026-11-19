# Ghi chú nguồn: LangSmith (langsmith)

Ngày nghiên cứu: 2026-11-18 (Asia/Saigon). Bài 3/3 của loạt LangChain / LangGraph / LangSmith.
Cách mở nguồn: mọi URL docs.langchain.com dưới đây đã mở bằng WebFetch ngày 2026-11-18; toàn văn đọc thêm qua bản `.md` cùng URL (curl, HTTP 200). Trang pricing mở bằng WebFetch và curl. GitHub mở bằng WebFetch và `gh api`.
Dạng: khẳng định → URL → trích ngắn làm bằng chứng.

## [1] LangSmith Observability (trang chính)
- Trace là bản ghi agent đã làm; dùng để debug, theo dõi chất lượng, dựng dataset → https://docs.langchain.com/langsmith/observability → "Traces are the record of what your agents did in production. Use them to debug failures, monitor quality, and build the datasets you evaluate against."
- Làm việc với nhiều framework và nhà cung cấp → cùng URL → "LangSmith works with many frameworks and providers."
- Mọi cách host đều có observability, evaluation, prompt engineering, deployment → cùng URL → "All options include observability, evaluation, prompt engineering, and deployment."
- LLM Gateway tự trace mọi lời gọi → cùng URL → "the gateway traces every call itself, with no tracing setup in your code."

## [2] Observability concepts
- Run = một đơn vị việc; giống span của OTel → https://docs.langchain.com/langsmith/observability-concepts → "you can think of a run as a span."
- Trace = tập run của một thao tác, gắn bằng trace ID; tối đa 25.000 run → cùng URL → "A *trace* is a collection of runs for a single operation." / "Each trace is limited to a maximum of 25,000 runs."
- Thread = chuỗi trace của một phiên nhiều lượt, gom bằng metadata thread_id → cùng URL → "To group traces into a thread, pass a `thread_id` metadata key"
- Trajectory = danh sách message phẳng → cùng URL → "a trajectory flattens the entire session into an ordered list of messages"
- Organization → workspace → agent → environment (Production, Staging, Development, Local) → cùng URL → "An agent's traces divide across *environments* drawn from a fixed set of four"
- Workspace cũ và self-hosted gom trace theo tracing project; mỗi environment có một tracing project nền → cùng URL → "Older workspaces and self-hosted LangSmith group traces into tracing projects."
- Feedback = tag + score gắn vào run → cùng URL → "Each feedback entry consists of a tag and a score, and is bound to a run by a unique run ID."
- Tags, metadata để lọc và nhóm → cùng URL.
- Hai cách gửi trace: integrations (tự động) và manual instrumentation (@traceable, trace, RunTree) → cùng URL → "Manual instrumentation lets you add tracing to any code, regardless of the framework."
- Hết hạn retention thì trace bị xóa; muốn giữ thì đưa vào dataset → cùng URL → "Datasets persist indefinitely, even after the source trace is deleted."

## [3] Tracing quickstart
- LangChain/LangGraph bật trace bằng một biến môi trường → https://docs.langchain.com/langsmith/observability-quickstart → "you can enable LangSmith tracing with a single environment variable."
- Trace thuộc về agent và một environment → cùng URL → "Traces belong to an agent and one of its environments within a workspace."

## [4] Custom instrumentation
- @traceable khuyên dùng cho đa số trường hợp; LANGSMITH_TRACING bật/tắt không đổi code → https://docs.langchain.com/langsmith/annotate-code → "`@traceable` decorator: recommended for most cases" / "`LANGSMITH_TRACING=true`: enables tracing."
- Hàm lồng nhau tự thành child run → cùng URL → "LangSmith automatically nests them as child runs."

## [5] LangSmith Python SDK (GitHub)
- Giấy phép MIT; dùng được không cần LangChain qua wrap_openai, @traceable → https://github.com/langchain-ai/langsmith-python → "The LangSmith SDK is licensed under the MIT License." / "without depending on any LangChain code"
- Repo cũ langsmith-sdk đã archived 2026-10-16, chuyển sang langsmith-python và langsmith-javascript → `gh api repos/langchain-ai/langsmith-sdk` → "This repo was archived on Oct 16, 2026. Python SDK moved to langchain-ai/langsmith-python and JS SDK to langchain-ai/langsmith-javascript."

## [6] Trace with OpenTelemetry
- Nhận trace từ bất kỳ agent tương thích OTel → https://docs.langchain.com/langsmith/trace-with-opentelemetry → "send traces from any OpenTelemetry-compatible agent"
- Collector fanout tới LangSmith và backend khác (Datadog, Honeycomb, Grafana) → cùng URL → "routes them to one or more destinations simultaneously (*fanout*)"
- Endpoint OTLP theo vùng: GCP US/EU/APAC, AWS US; BYOC; self-hosted → cùng URL.

## [7] Configure threads
- Key metadata session_id hoặc thread_id; phải đặt trên mọi run kể cả child → https://docs.langchain.com/langsmith/threads → "you must set the thread metadata (`session_id` or `thread_id`) on **all runs**"

## [8] Add metadata and tags
- Tag là chuỗi; metadata là key-value; dùng ghi environment, user, correlation ID → https://docs.langchain.com/langsmith/add-metadata-tags → "such as the environment in which it was executed, the user who initiated it, or an internal correlation ID"

## [9] Sampling rate
- Mặc định ghi mọi trace; LANGSMITH_TRACING_SAMPLING_RATE 0..1 → https://docs.langchain.com/langsmith/sample-traces → "By default, all traces are logged to LangSmith."
- Sampling = xác suất; conditional tracing = theo logic nghiệp vụ (vd. khách zero-retention) → cùng URL → "Sampling provides **probabilistic** control" / "conditional tracing provides **deterministic** control"

## [10] Prevent logging of sensitive data
- Bảo vệ dữ liệu trước khi gửi lên backend → https://docs.langchain.com/langsmith/mask-inputs-outputs → "protect your data before it's sent to the backend"
- LANGSMITH_HIDE_INPUTS / HIDE_OUTPUTS; anonymizer regex; Presidio, Amazon Comprehend; conditional tracing cho khách zero-retention → cùng URL.

## [11] Dashboards
- Prebuilt dashboard cho mỗi tracing project / agent environment: traces, LLM calls, cost & tokens, tools, run types, feedback scores → https://docs.langchain.com/langsmith/dashboards → "Automatically generated for every tracing project or agent environment."
- Group by tag/metadata; metadata không tự lan từ cha xuống con → cùng URL → "Metadata and tags are not propagated from parent to child runs, or vice versa."

## [12] Alerts
- Ngưỡng theo Run Count, Cost, Errors, Feedback Score, Latency → https://docs.langchain.com/langsmith/alerts → "threshold-based alerting on the following metrics"
- Mỗi alert gắn một tracing project hoặc một environment → cùng URL → "Alerts in LangSmith are scoped to one trace container"
- Gửi tới Slack, PagerDuty, Dynatrace, webhook → cùng URL.

## [13] Insights
- Tự phân tích trace để tìm pattern và failure mode; gói Plus và Enterprise → https://docs.langchain.com/langsmith/insights → "Insights is available for LangSmith Plus and Enterprise plans."

## [14] Automation rules
- Rule = item type + filter + sampling rate + action → https://docs.langchain.com/langsmith/rules → "You define an automation by an **item type**, **filter**, **sampling rate**, and **action**."
- Action: thêm vào dataset, annotation queue, webhook, extend retention → cùng URL.
- Ví dụ: feedback xấu → annotation queue; 10% để kiểm ngẫu nhiên → cùng URL.

## [15] Usage and billing
- Retention: Cloud base 14 ngày, extended 180 ngày; BYOC và self-hosted mặc định 14/400 → https://docs.langchain.com/langsmith/usage-and-billing → bảng "Retention periods".
- Auto-upgrade sang extended: feedback qua API có extend_trace_retention=true; online evaluator; automation rule; thêm thủ công vào annotation queue thì không → cùng URL.
- Retention extension bật mặc định cho evaluator và rule mới → cùng URL → "Retention extension is enabled by default for new online evaluators and automation rules."
- Hóa đơn: Base Charge cho mọi trace; Extended Upgrades cho trace extended → cùng URL.
- Trace ít ai đụng tới nên rẻ hơn một bậc độ lớn → cùng URL → "Traces that nobody interacts with should cost an order of magnitude less."
- Experiment tạo run ở extended theo mặc định → cùng URL.
- Developer không thẻ: 5.000 trace/tháng; rate limit trả 429 → cùng URL.
- Usage limit theo workspace, project, user → cùng URL.

## [16] Pricing (langchain.com/pricing), mở ngày 2026-11-18, trang không ghi ngày cập nhật
- Developer $0/seat, 1 seat, 5k base traces/tháng; Plus $39/seat/tháng, 10k base traces/tháng; Enterprise custom; sau đó pay-as-you-go → https://www.langchain.com/pricing → "Up to 5k base traces / mo, then pay-as-you-go" / "$39 / seat per month"
- (Sửa ngày 2026-11-19, ghi chú cũ sai.) Đơn giá có trong tooltip cạnh "Pay as you go thereafter" ở cột Developer và Plus → cùng URL → `data-tippy-content="0.005 LSU/base trace<br> 0.0025 LSU/extended trace upgrade"`; script Usage Calculator: "$39 / seat / mo · includes 10K traces total · 0.005 LSU / additional trace"; FAQ "1 LSU = $1." → 5 USD/1.000 base trace, 2,5 USD/1.000 lượt nâng extended. Lệnh kiểm: `curl -sL https://www.langchain.com/pricing | rg -o 'data-tippy-content="[^"]*LSU[^"]*"'`.
- Base 14 ngày, extended 180 ngày, nâng cấp có phí → cùng URL → "You can "upgrade" base traces to extended traces for an additional fee."
- Plus: 1 Small Agent Server serverless miễn phí; còn lại tính theo tài nguyên (LSU, 1 LSU = $1) → cùng URL.
- Enterprise: self-hosted và hybrid; Custom SSO, ABAC, RBAC; Support SLA → cùng URL.
- Dữ liệu ở cloud của LangChain (US hoặc EU) → cùng URL → "LangChain's Cloud (US or EU)"

## [17] Evaluation (tổng quan)
- Offline (test trước khi ship) và online (theo dõi production) → https://docs.langchain.com/langsmith/evaluation → "Test before you ship" / "Monitor in production"
- Đưa trace thật vào dataset để lỗi gặp một lần thành test chạy mãi → cùng URL → "Add real traces to a dataset so a failure you saw once becomes a test you run every time."
- Vòng lặp: trace lỗi → dataset → evaluator → kiểm fix offline → redeploy → cùng URL → "Add failing production traces to your dataset, create targeted evaluators, validate fixes with offline experiments, and redeploy."

## [18] Evaluation concepts
- Example: inputs, reference outputs (tùy chọn, chỉ evaluator thấy), metadata → https://docs.langchain.com/langsmith/evaluation-concepts
- Experiment = kết quả một phiên bản app trên một dataset → cùng URL → "An *experiment* represents the results of evaluating a specific application version on a dataset."
- Offline: dataset có reference; online: run/thread không reference → cùng URL.
- Evaluator: human, code, LLM-as-judge, decision model, pairwise → cùng URL.
- Reference-free dùng được cả offline và online; reference-based chỉ offline → cùng URL.
- Evaluator là tài nguyên cấp workspace; trả về feedback (key, score/value, comment) → cùng URL.
- Bắt đầu 5–10 ví dụ mỗi thành phần; dataset 10–20 ví dụ chọn tay → cùng URL.
- Splits, versions tự tạo khi example đổi; pin version trong CI → cùng URL.
- Evaluation đo theo metric; testing khẳng định đúng/sai → cùng URL → "Evaluation measures performance according to metrics." / "Testing asserts correctness."
- Annotation queue: single-run và pairwise → cùng URL.
- LLM-as-judge cần xem lại điểm và chỉnh prompt; few-shot giúp → cùng URL.

## [19] Evaluation types
- Benchmarking, unit test, regression test, backtesting, pairwise; online: monitoring, anomaly detection, feedback loop → https://docs.langchain.com/langsmith/evaluation-types
- CI: bật caching để giảm lời gọi LLM → cùng URL → "When running in CI, configure caching to minimize LLM API calls and associated costs."

## [20] LLM-as-a-judge (UI)
- Prompt tự viết hoặc template; chọn model; feedback Boolean / Categorical / Continuous; sửa điểm của người được chèn làm few-shot → https://docs.langchain.com/langsmith/llm-as-judge

## [21] Compare experiment results
- Đỏ = regressed, xanh = improved so với source experiment; mặc định điểm cao là tốt → https://docs.langchain.com/langsmith/compare-experiment-results → "red highlights runs that *regressed* ... green highlights runs that *improved*"

## [22] Online LLM-as-judge evaluators
- Chạy trên trace production; filter; sampling 0.1 = 10%; backfill khi tạo; spend limit theo tuần; trace bị auto-upgrade extended → https://docs.langchain.com/langsmith/online-evaluations-llm-as-judge

## [23] Annotation queues
- Single-run (run hoặc thread, rubric, assertions) và pairwise (A/B/Equal); nhiều reviewer; reservation; thêm vào dataset → https://docs.langchain.com/langsmith/annotation-queues

## [24] pytest plugin
- Viết dataset và evaluation thành test pytest; assertion lỗi trong CI; có bản Vitest/Jest → https://docs.langchain.com/langsmith/pytest → "raise assertion errors locally (e.g. in CI pipelines)"

## [25] Prompt engineering concepts
- Prompt vs prompt template; commit có hash; commit tag di chuyển được; staging/production dành cho Environments; Playground đổi model, prompt, schema, tool; chạy trên dataset tạo experiment → https://docs.langchain.com/langsmith/prompt-engineering-concepts

## [26] Prompt & Context Hub
- Tên hiện tại "Prompt & Context Hub": lưu, version, cập nhật prompt và context; đổi hành vi không cần deploy; public prompt hub; Playground → https://docs.langchain.com/langsmith/prompt-engineering (nay 308 sang /langsmith/prompt-context-hub, kiểm 2026-11-19) → "Store, version, and update the prompts and contexts your agents use in production."

## [27] Deploy agents
- "LangSmith Deployment is now LangSmith Agent Server" → https://docs.langchain.com/langsmith/deploy-overview
- Agent Server framework-agnostic (LangGraph/LangChain, Google ADK, Claude Agent SDK, Strands, CrewAI, AutoGen…) → cùng URL.
- 4 cách host: Cloud (Plus trở lên), Self-hosted with control plane (Enterprise), Hybrid, Standalone (tự mang PostgreSQL, Redis, license) → cùng URL.

## [28] Agent Server
- Runtime điều phối cho agent; assistant, thread, run, cron; PostgreSQL; Redis cho hàng đợi; graph không bắt buộc viết bằng LangGraph → https://docs.langchain.com/langsmith/agent-server → "Graphs do not have to be written with LangGraph."

## [29] Studio
- IDE cho agent theo giao thức Agent Server; graph mode, chat mode; chạy experiment trên dataset; time travel; deploy 1 click; dùng với server local hoặc đã deploy → https://docs.langchain.com/langsmith/studio → "Studio is a specialized agent IDE"

## [30] Trang sản phẩm Agent Server (FAQ)
- Đổi tên tháng 11/2026 → https://www.langchain.com/langsmith/deployment (nay 301 sang /langsmith/agent-server, kiểm 2026-11-19) → "LangSmith Deployment has been renamed to LangSmith Agent Server as of November 2026."
- Không cần LangGraph → cùng URL → "No — you can deploy agents built with any framework."
- Đợt đổi tên trước (10/2025: LangGraph Platform → LangSmith Deployment) đã được kiểm ở bài 2 (research-261118-langgraph-sources.md); WebSearch hôm nay cũng trả về changelog đó.

## [31] Platform setup
- LangSmith (nền tảng) có Cloud, BYOC, Self-hosted; BYOC và self-hosted thuộc Enterprise → https://docs.langchain.com/langsmith/platform-setup → "Self-hosted and BYOC are available on the Enterprise plan."
- BYOC: LangChain chạy control plane, bạn chạy data plane; dữ liệu nhạy cảm ở VPC của bạn → cùng URL.
- Observability only: chạy agent ở đâu cũng được, chỉ gửi trace → cùng URL.
- Ghi chú: trang pricing [16] gọi phương án Enterprise là "Cloud, Hybrid, or Self-Hosted"; docs dùng "BYOC" cho nền tảng và "Hybrid" cho cách host Agent Server [37]. Trang học nêu theo docs và ghi chú khác biệt tên gọi.

## [32] Regions FAQ
- GDPR, SOC 2 Type 2, HIPAA → https://docs.langchain.com/langsmith/regions-faq → "We are also SOC 2 Type 2 certified and are HIPAA compliant."
- Vùng: GCP US, GCP EU, GCP APAC, AWS US, Azure US; không chuyển vùng được → cùng URL → "We do not support migration between regions at this time."

## [33] Self-hosted LangSmith
- Add-on của Enterprise; chạy trong Kubernetes; dữ liệu ở lại môi trường của bạn → https://docs.langchain.com/langsmith/self-hosted → "so that trace and operational data stay in your environment"

## [34] RBAC
- RBAC là tính năng Enterprise; gói khác mặc định mọi người là Admin → https://docs.langchain.com/langsmith/rbac → "Other plans default to using the Admin role for all users."

## [35] ABAC
- Xây trên RBAC; khớp resource tag và metadata của root run; Enterprise → https://docs.langchain.com/langsmith/abac

## [36] Engine
- Tìm lỗi lặp lại từ trace, chẩn đoán, đề xuất fix, tạo dataset example; khác Insights (phân tích) → https://docs.langchain.com/langsmith/engine → "Use Insights to understand how people use your agent. Use Engine to find out what is going wrong and what to change."
- Pricing: Engine tính theo LSU, không có ở Developer → [16].

## [37] Hybrid (Agent Server hosting)
- Tự host Agent Server, gửi trace lên LangSmith Cloud hoặc self-hosted → https://docs.langchain.com/langsmith/hybrid

## [38] Langfuse open source
- Ngoài thư mục /ee là MIT; tracing, eval, prompt management, experiments, annotation, playground là MIT; SCIM, audit log, data retention policy cần license → https://langfuse.com/docs/open-source → "Everything outside the `/ee` folders is MIT-licensed"
- Tự host bằng Docker → https://langfuse.com/self-hosting (đã mở) → "Langfuse is open source and can be self-hosted using Docker"
- README GitHub: nhận trace OTLP từ ứng dụng hoặc OTel Collector; MIT trừ thư mục ee → https://github.com/langfuse/langfuse (đã mở) → "any OpenTelemetry-instrumented application, framework, or collector can send traces to Langfuse" / "This repository is MIT licensed, except for the `ee` folders."

## [39] Arize Phoenix README
- ELv2 cấm cung cấp phần mềm cho bên thứ ba dưới dạng dịch vụ hosted/managed → file LICENSE trong repo (gh api) → "You may not provide the software to third parties as a hosted or managed service"
- Mã nguồn mở, tự host; giấy phép Elastic License 2.0; xây trên OpenTelemetry/OpenInference; tracing, eval, datasets, experiments, playground → https://github.com/Arize-ai/phoenix → "This software is licensed under the terms of the Elastic License 2.0 (ELv2)."

## [40] OpenAI Agents SDK tracing
- Tracing bật mặc định, xem trên Traces dashboard của OpenAI; không có cho tổ chức ZDR; có processor gửi sang LangSmith, Langfuse, Phoenix… → https://openai.github.io/openai-agents-python/tracing/ → "Tracing is enabled by default." / "Tracing is unavailable for organizations that use OpenAI's APIs under a Zero Data Retention (ZDR) policy."

## [41] Agent Registry
- Đăng ký agent; 4 environment cố định; dataset, evaluator, deployment, trace, alert gắn vào agent; chỉ có trên Cloud, không có trên self-hosted → https://docs.langchain.com/langsmith/agent-registry → "They are not available on self-hosted LangSmith."

## [42] LLM Gateway
- Beta; mọi lời gọi qua gateway thành trace; key nhà cung cấp nằm trong LangSmith; fallback, spend limit, rate limit, data policy → https://docs.langchain.com/langsmith/llm-gateway → "The LLM Gateway is in beta."
- Pricing liệt kê "PII and secrets redaction" trong tính năng Gateway → [16].

## [43] Bulk export trace data
- Xuất trace của một project sang bucket S3-compatible dạng Parquet; khách đăng ký sau 2026-08-03 chỉ có ở Enterprise → https://docs.langchain.com/langsmith/data-export → "to an S3-compatible bucket in Parquet format" / "bulk export is only available on the LangSmith Enterprise plan"

## Kiểm tra chéo với bài 1 và bài 2
- Bài 2 ghi "Tháng 11/2026 đổi tiếp thành LangSmith Agent Server" → khớp [30].
- Bài 1 ghi LangChain/LangGraph bật trace bằng một biến môi trường → khớp [3].
- Bài 1 (từ điển) ghi LangSmith "có bản cloud, hybrid, self-hosted": khớp trang pricing [16]; docs platform-setup [31] hiện dùng "Cloud, BYOC, Self-hosted" cho nền tảng, còn "Hybrid" là cách host Agent Server. Khác biệt tên gọi, không phải sai.

## [44] LangSmith changelog
- Tuần October 20–24, 2025, mục Deployment: "LangGraph Platform is now LangSmith Deployment and LangGraph Studio is now LangSmith Studio." → https://docs.langchain.com/langsmith/changelog (trang 377 nghìn ký tự; WebFetch chỉ đọc 100k ký tự đầu, mục này đọc qua bản .md cùng URL bằng curl, dòng 2527–2529)
