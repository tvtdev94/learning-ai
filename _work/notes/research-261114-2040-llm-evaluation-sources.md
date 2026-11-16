# Ghi chú nguồn: llm-evaluation (Đánh giá RAG và agent)

Ngày truy cập tất cả: 2026-11-14. Dạng: khẳng định → URL → câu trích ngắn.

## Vì sao eval, eval-driven development
- [1] Eval = input + grading logic → https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents → "a test for an AI system: give an AI an input, then apply grading logic to its output to measure success."
- [1] Task/trial/grader/transcript/outcome → cùng URL → "Each attempt at a task is a trial." / "The outcome is the final state in the environment at the end of the trial."
- [1] Bắt đầu 20–50 task từ lỗi thật → cùng URL → "20-50 simple tasks drawn from real failures is a great start."
- [1] Capability vs regression eval → cùng URL → "Regression evals ... should have a nearly 100% pass rate."; capability evals "can 'graduate' to become a regression suite"
- [1] Ba loại grader (code/model/human) và đánh đổi → cùng URL → "We recommend choosing deterministic graders where possible, LLM graders where necessary"
- [1] pass@k vs pass^k → cùng URL → "pass^k measures the probability that all k trials succeed."
- [1] Bộ bài cân bằng → cùng URL → "Test both the cases where a behavior should occur and where it shouldn't."
- [1] Saturation → cùng URL → "An eval at 100% tracks regressions but provides no signal for improvement."
- [1] Đọc transcript → cùng URL → "Read the transcripts!"
- [1] LLM judge cần lối thoát "Unknown", hiệu chỉnh với chuyên gia → cùng URL → "LLM-as-judge graders should be closely calibrated with human experts"
- [1] Metric agent: latency, token, cost per task; n_turns, n_toolcalls → cùng URL → "latency, token usage, cost per task, and error rates can be tracked on a static bank of tasks"
- [1] Framework được nêu: Harbor, Braintrust, LangSmith, Langfuse, Arize Phoenix → cùng URL → frameworks are "only as good as the eval tasks you run through them"
- [2] Eval-driven development → https://developers.openai.com/api/docs/guides/evaluation-best-practices → "Adopt eval-driven development: Evaluate early and often."
- [2] Độ phủ dữ liệu → cùng URL → "Ensure your test data includes typical cases, edge cases, and adversarial cases."
- [2] Continuous evaluation → cùng URL → "Set up continuous evaluation (CE) to run evals on every change"
- [2] Hiệu chỉnh judge bằng người → cùng URL → "Use human feedback to calibrate automated scoring."
- [2] Ba kiểu judge: pairwise, single, reference-guided; pass/fail tin cậy hơn → cùng URL → "Use pairwise comparison or pass/fail for more reliability"
- [2] Thiên lệch position, verbosity → cùng URL → "Position bias (response order), verbosity bias (preferring longer responses)"
- [2] Anti-pattern vibe-based → cùng URL → "Using 'it seems like it's working' as an evaluation strategy"
- [3] Ba cấp eval, A/B cho sản phẩm trưởng thành → https://hamel.dev/blog/posts/evals/ → "This level of evaluation is usually only appropriate for more mature products."
- [3] Theo dõi tương quan judge–người → cùng URL → "track the correlation between model-based and human evaluation"
- [3] Unit test không cần 100% → cùng URL → "you don't necessarily need a 100% pass rate."
- [4] Offline vs online → https://docs.langchain.com/langsmith/evaluation → "Evaluate real user interactions in real-time to detect issues and measure quality on live traffic."
- [4] Trace lỗi thành test → cùng URL → "Add real traces to a dataset so a failure you saw once becomes a test you run every time."
- [4] Nguồn dataset → cùng URL → "from manually curated test cases, historical production traces, or synthetic data generation."
- [4] Online không có reference → cùng URL → online evaluators include "reference-free LLM-as-judge"; "Apply filters and sampling rates to control costs."

## Metric RAG
- [5] Ragas: 3 khía cạnh, reference-free → https://arxiv.org/abs/2309.15217 → "a framework for reference-free evaluation of Retrieval Augmented Generation (RAG) pipelines"
- [6] Faithfulness = claim được context hỗ trợ / tổng claim → https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/ → "A response is considered faithful if all its claims can be supported by the retrieved context."
- [7] Context precision = trung bình precision@k tại vị trí liên quan → https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/ → "evaluates the retriever's ability to rank relevant chunks higher than irrelevant ones"
- [8] Context recall = claim của reference được context hỗ trợ / tổng; có biến thể ID → https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/ → "always requires a reference to compare against."
- [9] Answer relevancy: sinh câu hỏi ngược, cosine; không đo đúng sai → https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/ → "without evaluating factual accuracy"
- [10] Factual correctness: claim P/R/F1 so với reference → https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/factual_correctness/ → "Factual overlap is quantified using precision, recall, and F1 score."
- [11] Sinh testset tổng hợp: knowledge graph, single-hop/multi-hop → https://docs.ragas.io/en/stable/concepts/test_data_generation/rag/ → "Ragas uses a Knowledge Graph based approach to Test set Generation."
- [12] DCG/IDCG/nDCG, Järvelin & Kekäläinen 2002 → https://en.wikipedia.org/wiki/Discounted_cumulative_gain → "sums the usefulness, or gain, of the results discounted by their position"; hai dạng gain trùng khi nhãn nhị phân
- [13] MRR, không có đáp án đúng → 0 → https://en.wikipedia.org/wiki/Mean_reciprocal_rank → "If none of the proposed results are correct, the reciprocal rank is 0."
- [14] LlamaIndex: HitRate, MRR, nDCG nhị phân, IDCG theo toàn bộ expected_ids → https://raw.githubusercontent.com/run-llama/llama_index/main/llama-index-core/llama_index/core/evaluation/retrieval/metrics.py → "for i in range(1, len(expected_ids) + 1)"; "Currently only supports binary relevance"
- [20] ARES: judge nhẹ + vài trăm nhãn người qua PPI → https://arxiv.org/abs/2311.09476 → "using only a few hundred human annotations during evaluation"

## LLM-as-judge
- [15] >80% đồng thuận, ngang người–người; position/verbosity/self-enhancement → https://arxiv.org/abs/2306.05685 → "over 80% agreement, the same level of agreement between humans"
- [16] Position bias: đổi thứ tự → Vicuna-13B thắng 66/80 → https://arxiv.org/abs/2305.17926 → "Vicuna-13B could beat ChatGPT on 66 over 80 tested queries with ChatGPT as an evaluator."; balanced position calibration
- [17] Self-preference → https://arxiv.org/abs/2404.13076 → "an LLM evaluator scores its own outputs higher than others'"
- [18] G-Eval: Spearman 0.514 trên tóm tắt → https://arxiv.org/abs/2303.16634 → "achieves a Spearman correlation of 0.514 with human on summarization task"
- [19] Criteria drift; judge cần người kiểm → https://arxiv.org/abs/2404.12272 → "users need criteria to grade outputs, but grading outputs helps users define criteria."

## Agent
- [21] τ-bench: so state DB với goal state, pass^k, gpt-4o <50%, pass^8 <25% retail → https://arxiv.org/abs/2406.12045 → "compares the database state at the end of a conversation with the annotated goal state."
- [22] Microsoft Foundry: Task Completion, Tool Selection, Tool Input Accuracy, Task Navigation Efficiency (exact/in-order/any-order), system vs process eval → https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-evaluators/agent-evaluators → "Measures whether the agent selected the correct tools without selecting unnecessary ones"
- [26] BFCL đo gọi function, có multi-turn, V4 agentic → https://gorilla.cs.berkeley.edu/leaderboard.html → "the LLM's ability to call functions (aka tools) accurately."

## Online / regression
- [23] promptfoo: CLI mã nguồn mở, eval + red team, chạy trong CI/CD → https://www.promptfoo.dev/docs/intro/ → "an open-source CLI and library for evaluating and red-teaming LLM apps."
- [24] Langfuse A/B prompt: luân phiên ngẫu nhiên, so latency/cost/quality score → https://langfuse.com/docs/prompt-management/features/a-b-testing → "your application can randomly alternate between these versions"
- [25] A/B = thí nghiệm ngẫu nhiên hai biến thể + kiểm định giả thuyết → https://en.wikipedia.org/wiki/A/B_testing → "a randomized experiment that usually involves two variants (A and B)"

## Không dùng / không xác minh được
- Kohavi et al. 2009 (PDF không đọc được qua WebFetch) → không trích.
- BEIR abstract không nói nDCG@10 → không dùng cho khẳng định "nDCG@10 là chuẩn".
- Harbor, Braintrust, Arize Phoenix: chỉ nêu là "Anthropic liệt kê", chưa mở tài liệu riêng.

## Kiểm lại ngày 2026-11-16 (mở lại toàn bộ 26 nguồn bằng WebFetch, tất cả vẫn khớp)
- [1] Bài đăng ngày 2026-01-09; ví dụ pass^k → https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents → "If your agent has a 75% per-trial success rate and you run 3 trials, the probability of passing all three is (0.75)³ ≈ 42%."
- [1] Chấm kết quả, không chấm đường đi → cùng URL → "it's often better to grade what the agent produced, not the path it took."; "agents regularly find valid approaches that eval designers didn't anticipate"
- [1] Nhiều lượt → cùng URL → "Because model outputs vary between runs, we run multiple trials to produce more consistent results."
- [1] Điểm yếu grader LLM (không nói "bias") → cùng URL → "Non-deterministic", "More expensive than code", "Requires calibration with human graders for accuracy"
- [1] Người dùng giả lập → cùng URL → "they often require a second LLM to simulate the user."
- [1] Grader code kiểm tool call → cùng URL → "Tool calls verification (tools used, parameters)"
- [1] Langfuse tự host → cùng URL → "a self-hosted open-source alternative for teams with data residency requirements"
- [2] Suy luận trước khi chấm → https://developers.openai.com/api/docs/guides/evaluation-best-practices → "Add reasoning and chain-of-thought as reasoning before scoring improves eval performance"
- [2] Kiểm soát độ dài → cùng URL → "Control for response lengths as LLMs bias towards longer responses in general"
- [2] Mở rộng judge sau khi đồng thuận → cùng URL → "consistently agrees with human annotations, scale up"
- [3] Cấp 1 trên mọi thay đổi → https://hamel.dev/blog/posts/evals/ → "I often run Level 1 evals on every code change"; bài đăng 2024-03-29
- [3] Kiểm định kỳ → cùng URL → "you must continue doing periodic exercises to monitor the model and human agreement"
- [7] Biến thể ID-based → https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/ → "comparing the IDs of retrieved contexts with reference context IDs" (điểm = số ID trùng / tổng ID lấy về)
- [7] Biến thể không cần reference → cùng URL → "can be used without the availability of a reference answer"
- [9] Mặc định sinh 3 câu hỏi → https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/ → "Generate a set of artificial questions (default is 3) based on the response."
- [12] IDCG theo tài liệu liên quan tới vị trí p → https://en.wikipedia.org/wiki/Discounted_cumulative_gain → "represents the list of relevant documents (ordered by their relevance) in the corpus up to position p"
- [13] MRR bỏ qua đoạn đúng sau → https://en.wikipedia.org/wiki/Mean_reciprocal_rank → "only the rank of the first relevant answer is considered, and possible further relevant answers are ignored."
- [14] Đổi sang permalink commit 26c7dc3 (2025-05-01) → https://raw.githubusercontent.com/run-llama/llama_index/26c7dc3e9846045864cf93ab92cb13bc80a3394e/llama-index-core/llama_index/core/evaluation/retrieval/metrics.py → "for i in range(1, len(expected_ids) + 1)"; "Currently only supports binary relevance"
- [16] Bằng chứng trước khi chấm → https://arxiv.org/abs/2305.17926 → "requires the evaluator model to generate multiple evaluation evidence before assigning ratings"
- [19] Câu gốc về bộ chấm LLM → https://arxiv.org/abs/2404.12272 → "LLM-generated evaluators simply inherit all the problems of the LLMs they evaluate, requiring further human validation"
- [21] Người dùng do LLM đóng vai → https://arxiv.org/abs/2406.12045 → "a benchmark emulating dynamic conversations between a user (simulated by language models) and a language agent"
- [22] URL canonical mới, ms.date 2026-09-30 → https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators → "Measures whether the agent selected the correct tools without selecting unnecessary ones"; matching modes exact_match / in_order_match / any_order_match
- [26] BFCL V4, cập nhật 2026-04-12 → https://gorilla.cs.berkeley.edu/leaderboard.html → "evaluates the LLM's ability to call functions (aka tools) accurately"
- [27] Cohen's kappa (mới) → https://en.wikipedia.org/wiki/Cohen%27s_kappa → "κ incorporates the possibility of the agreement occurring by chance"; κ = (p_o − p_e)/(1 − p_e), p_e từ tỉ lệ từng người chấm theo từng nhãn
- [28] Khoảng tin cậy xấp xỉ chuẩn (mới) → https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval → p̂ ± z·√(p̂(1−p̂)/n), z = 1,96 cho 95%; "becomes unreliable" khi "the sample size becomes small or the success probability grows close to either 0 or 1"
- Tự tính (không phải số từ nguồn): κ ≈ 0,61 từ bảng minh họa 27/5/1/7; ±14 điểm phần trăm = 1,96·√(0,8·0,2/30) ≈ 0,143.
