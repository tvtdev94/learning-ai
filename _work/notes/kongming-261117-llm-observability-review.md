# Kongming review: llm-observability (2026-11-17)

Trang được review: `llm-observability/index.html` (1042 dòng, mtime 2026-11-17 14:00:31, không đổi trong suốt phiên review; bản server ở cổng 8792 trùng byte với file).
Model: Claude Fable 5.2. Chỉ tư vấn, không sửa trang.

## Kết luận nhanh

Trang đủ chất lượng để publish sau khi sửa nhóm TRUNG BÌNH. Không có phát hiện mức CAO.

- Nguồn: đã tự tải lại 33/34 nguồn và đối chiếu câu chữ. Không thấy khẳng định bịa. Có 3 chỗ lệch mức yêu cầu hoặc vị trí, 1 chỗ dùng chữ cũ của nguồn.
- Số liệu: mọi con số trong mô phỏng, callout "Thử ba việc", quiz và bảng v7/v8 khớp với số tôi tự tính lại bằng Node.
- 390px: không tràn ngang, không có chữ dưới 11px, không lỗi JS, tương phản đạt ở cả hai theme (trừ nút disabled, được miễn).
- Lỗi hiển thị thật: nhãn trục waterfall đè nhau ở khổ tablet 721–857px; đường đứt tím cắt qua nhãn "CẢI TIẾN" trong SVG flow desktop.

## Cách kiểm

| Việc | Cách làm | Kết quả |
|---|---|---|
| Nguồn OTel GenAI [7]–[13], [31] | `curl` raw `.md` từ `semantic-conventions-genai/main/docs/gen-ai/`, `rg` từng thuộc tính | 8/8 file HTTP 200, đều ghi `Status: Development` |
| Nguồn Langfuse [14]–[20], [32], [34] | `curl <url>.md` | 9/9 HTTP 200 |
| Nguồn HTML còn lại | `curl` + bóc thẻ, `rg` câu trích | HTTP 200 |
| Mô phỏng, bảng phiên bản | Viết lại độc lập bằng Node (cùng PRNG mulberry32, seed 20261117) | Khớp 100% |
| Layout 390 / 768 / 1000 / 1280 | Headless Chrome, bản sao trang trong iframe đúng bề rộng, script đo | Xem mục 4, 5 |
| Ảnh chụp | 2 SVG desktop (sáng, tối), waterfall, mô phỏng, bảng v7/v8, 2 vflow ở 390px | Đã xem từng ảnh |

Chưa kiểm:
- Console của trình duyệt thật (chỉ bắt `window.onerror`: 0 lỗi).
- Cuộn chạm tay, thanh mục lục dính, hành vi trên Safari iOS.
- Nguồn [21]: chỉ đọc README; chưa mở được file spec thuộc tính của OpenInference (URL đoán trả 404).
- Ảnh chụp ở 390px cho mục 5, 7, 8, 10 (chỉ đo bằng script, không xem ảnh).

---

## 1. Độ chính xác so với nguồn

### TRUNG BÌNH

**A1. Tail sampling bị đặt "trong ứng dụng", trước Export.**
- Vị trí: mục 2, node "3. Sampling" (dòng 292, 335–338) nằm trong nhóm "TRONG ỨNG DỤNG".
- Bằng chứng [4]: tail sampling xét "all or most of the spans within the trace"; thành phần làm tail sampling "must be stateful systems that can accept and store a large amount of data"; và "then later in the telemetry pipeline use tail sampling ... before exporting to a backend". Head sampling "can be done at any point in the trace collection pipeline".
- Vấn đề: người học sẽ hiểu tail sampling chạy trong SDK của ứng dụng. Chính thẻ từ điển `tail` lại liên kết sang `collector`, nên trang tự mâu thuẫn nhẹ.
- Sửa: giữ node 3 là "Sampling (head)", thêm vào node 4 dòng "tail sampling thường chạy ở đây, sau khi span rời ứng dụng". Hoặc thêm một câu dưới sơ đồ nói rõ điều này, dẫn [4].

**A2. Câu cảnh báo cỡ mẫu tự phủ định kết luận chính của bảng v7/v8.**
- Vị trí: `verNote`, dòng 1024: "chênh lệch nhỏ (vài điểm phần trăm) cần thêm dữ liệu mới kết luận được".
- Bằng chứng tự tính: chênh lệch judge là 4,69 điểm %, tức đúng "vài điểm phần trăm". Khoảng tin cậy 95% của hiệu hai tỷ lệ: 4,69 ± 2,04 điểm %, nên chênh lệch này có ý nghĩa. Ngược lại, tool lỗi −0,27 ± 0,64 và exception −0,10 ± 0,24 đều nằm trong nhiễu.
- Sửa: đổi thành "với khoảng 850 trace mỗi bản, chênh lệch dưới khoảng 2 điểm % chưa kết luận được; 4,69 điểm % thì đủ rõ". Hai dòng "Tỷ lệ exception" và "Tỷ lệ span tool lỗi" đang tô xanh "tốt hơn": nên đổi nhãn thành "gần như không đổi" bằng màu trung tính, vì chính đoạn chú thích cũng nói "gần như không đổi".

**A3. Bảng v7/v8 là so sánh trước–sau, đổi hai thứ cùng lúc, nhưng trang không nói giới hạn này.**
- Vị trí: mục 9, dòng 642.
- Vấn đề: v8 đổi cả prompt lẫn timeout và retry của tool, lại so hai tuần khác nhau. p95 giảm là do timeout; judge tăng là do prompt; lưu lượng hai tuần có thể khác nhau. Đoạn chú thích quy toàn bộ cho "bản sửa".
- Sửa: thêm một câu (ghi là nhận định của trang): "Đây là so sánh trước–sau, không phải A/B; hai thay đổi phát hành cùng lúc nên không tách được công của từng cái. Muốn tách, chạy song song hai phiên bản hoặc dùng experiment trên dataset."

**A4. Chính sách giữ 30 ngày ở bước 9 bỏ sót dataset.**
- Vị trí: stepper bước 8 (dòng 822: đưa 40 trace vào dataset) và bước 9 (dòng 831: giữ trace 30 ngày).
- Bằng chứng [20]: "Project data retention does not delete audit logs or dataset items. If you add a trace to a dataset, the saved dataset item remains usable after the original trace expires."
- Vấn đề: dữ liệu của chị Thu nằm trong dataset sẽ sống quá 30 ngày. Đây là lỗ hổng thật trong chính sách mà ví dụ đang dạy. File ghi chú nguồn đã có câu trích này nhưng trang chưa dùng.
- Sửa: thêm một gạch đầu dòng ở bước 9: "Ca lỗi đưa vào dataset không bị xóa theo hạn giữ trace: che hoặc ẩn danh trước khi đưa vào, và đặt hạn riêng cho dataset." Dẫn [20].

**A5. Hai quy tắc đếm token trái nhau được nêu ở hai nơi mà không nối lại.**
- Vị trí: thẻ `usage` (dòng 933) và thẻ `doublecount` (dòng 960); mục 9 thẻ "Traffic, saturation".
- Bằng chứng: [8] "`gen_ai.usage.input_tokens`: This value SHOULD include cached tokens". [17] "each token must be counted in exactly one key"; ví dụ 17.903 token prompt phải lưu thành `input: 86` + `input_cached_tokens: 17817`.
- Vấn đề: OTel bảo gộp, Langfuse bảo tách. Đây chính là nguyên nhân gây đếm đôi khi nối hai hệ, nhưng người học không được báo.
- Sửa: thêm một câu vào thẻ `doublecount` hoặc dòng "Chi phí trên dashboard cao hơn hóa đơn": "Lưu ý quy ước OTel tính token cache trong input, còn Langfuse yêu cầu tách; khi chuyển dữ liệu giữa hai bên phải trừ ra."

### THẤP

**A6. Mức yêu cầu của `gen_ai.request.model` bị nói nhẹ.** Bước 4 (dòng 802): "nên có model, số token, lý do dừng". Nguồn [8]: `gen_ai.request.model` là `Conditionally Required` "If available"; token và finish_reasons mới là `Recommended`. Sửa: "model là bắt buộc nếu có; nên có số token, lý do dừng".

**A7. "yêu cầu có tùy chọn để bật"** (quiz 5, dòng 680). Nguồn [9] dùng SHOULD: "SHOULD provide an option for users to opt in". Sửa: "khuyên nên có tùy chọn để bật".

**A8. Thẻ `evalevent` thu hẹp nguồn.** Dòng 943: "Nên gắn vào span gọi model được chấm". Nguồn [13]: "parented to GenAI operation span being evaluated", tức bất kỳ span GenAI nào (kể cả agent, retrieval). Sửa: "gắn vào span GenAI được chấm".

**A9. Chữ "plugin" của OpenInference là chữ cũ.** Dòng 581 và 944. README hiện tại [21]: "OpenInference builds on OpenTelemetry to trace AI agents: their LLM calls, tool use, retrieval and reasoning steps"; không còn cụm "conventions and plugins". Sửa: "bộ quy ước và thư viện instrumentation". Câu "Tên thuộc tính khác quy ước GenAI chính thức" đã ghi là nhận định của trang; tôi chưa kiểm được bằng nguồn trong phiên này.

**A10. `environment` trong bảng thuộc tính bước 1 không phải tên của OTel.** Dòng 791. Đoạn dẫn nói tên theo quy ước GenAI của OTel, nhưng `environment` là khái niệm của Langfuse [15]. Trang đã tự nói rõ việc ghi prompt name/version lên span gốc là "cho dễ đọc"; nên nói tương tự cho `environment`, hoặc ghi "(thuộc tính cấp trace của backend)".

**A11. Bước 6 và bước 9 không khớp nhau.** Bước 9 nói nội dung lưu ở kho riêng, span chỉ giữ tham chiếu; bước 6 lại hiện `gen_ai.output.messages`. Nếu theo bước 9 thì phải là `gen_ai.output.messages_ref` [9]. Sửa một trong hai.

**A12. Câu mở đầu nói trace "ghi lại đúng prompt đã gửi"** (dòng 254, theo [14]) rồi mục 2 nói mặc định không ghi nội dung. Thêm "nếu bạn bật ghi nội dung" hoặc "với công cụ như Langfuse" để không tự trái. Tương tự node vflow "2. Che dữ liệu: mặc định không ghi nội dung prompt" (dòng 290) nên thêm "theo quy ước OTel", vì mục 7 cho thấy có framework mặc định ghi hết.

**A13. Kết quả 80% của BrowseComp đặt trong thẻ "Chi phí".** Dòng 637. Nguồn [29]: "token usage by itself explains 80% of the variance" của hiệu năng. Đây là phát hiện về chất lượng (tốn nhiều token hơn thì làm tốt hơn), không phải về tiền. "chênh lệch hiệu năng" nên là "phương sai hiệu năng (variance)". Thêm nửa câu: "nên phải theo dõi token cùng với chất lượng, không chỉ để cắt giảm".

**A14. Dòng "Chi phí trên dashboard cao hơn hóa đơn"** (dòng 612) gộp hai triệu chứng. Câu thứ hai (không gửi usage thì không có chi phí) là triệu chứng "thiếu chi phí", ngược với tiêu đề dòng. Tách thành dòng riêng hoặc bỏ.

**A15. Quiz 6: "chỉ giữ được khoảng một phần mười số trace lỗi".** Đúng về kỳ vọng, nhưng mô phỏng cho 6/37 (16%). Thêm "trung bình" và "(trong mô phỏng: 6/37)".

**A16. Nhận định chưa đánh dấu.**
- Dòng 561, hàng "Hợp khi" của bảng head/tail: không có nguồn, không ghi là nhận định.
- Dòng 975, định nghĩa ZDR "Chính sách không lưu dữ liệu ở phía nhà cung cấp": nguồn [30] chỉ nêu tên, không định nghĩa.
- Dòng 638: "Số vòng tăng đột ngột thường báo hiệu agent đang loay hoay, trước cả khi chi phí tăng."
- Dòng 927, thẻ `spankind` nói về span tool và retrieval nhưng chỉ dẫn [2][8]; thiếu [10][11].

**A17. Mục Nguồn.**
- [24]: trang ghi "O'Reilly, 2016"; chân trang sre.google ghi "Copyright © 2017 Google, Inc. Published by O'Reilly Media". Tác giả chương là Rob Ewaschuk. Nên thêm tên tác giả; năm 2016 (năm in sách) vẫn chấp nhận được.
- [7]–[13], [31] trỏ tới `raw.githubusercontent.com`: trên điện thoại hiện ra markdown thô, bảng thuộc tính rất khó đọc. Bản `github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/client-inference.md` trả HTTP 200 và hiển thị đẹp hơn. Đề xuất đổi link hiển thị sang `blob`, giữ raw trong file ghi chú.

### Đã kiểm và đúng (không cần sửa)

- OTel GenAI: `Status: Development` [7]; trang cũ ghi "Moved ... no longer maintained in this repository" [5]; README repo mới nêu MCP [6].
- Span gọi model: tên `{gen_ai.operation.name} {gen_ai.request.model}`, kind CLIENT; `gen_ai.operation.name` và `gen_ai.provider.name` Required; `gen_ai.prompt.name` Conditionally Required "when a named prompt template is used"; `error.type` Conditionally Required khi lỗi; output_tokens "SHOULD include reasoning tokens" [8].
- Metric `gen_ai.client.inference.duration` và `gen_ai.client.inference.time_to_first_chunk` đều Histogram, đơn vị `s` [8]. Ghi nhận thêm: file `gen-ai-metrics.md` [31] hiện liệt kê `gen_ai.client.operation.duration`, tức hai tài liệu trong cùng repo đang dùng hai tên. Câu "tên có thể còn đổi" của trang là xác đáng.
- `gen_ai.invoke_agent.duration`, `.inference_calls`, `.tool_calls` (Histogram); `gen_ai.server.time_to_first_token` gồm "the queue and the prefill phase" [31].
- Ghi nội dung: `OTEL_INSTRUMENTATION_GENAI_CAPTURE_CONTENT`, mặc định `NO_CONTENT`, ba giá trị còn lại, mẫu `_ref`, "recommended in production environments" [9].
- Retrieval: tên span là operation name, INTERNAL, `top_k` Recommended, `documents` và `query.text` Opt-In [10]. Tool: `execute_tool {gen_ai.tool.name}`, INTERNAL, tên Required, arguments/result Opt-In [11].
- Agent: `invoke_agent` / `invoke_workflow`, tên agent "MUST have low cardinality" [12]. Câu "anh em dưới cùng một span invoke_agent" có trong mục plan span: "typically sibling operations under the same invoke_agent span".
- Event `gen_ai.evaluation.result` và bốn thuộc tính ở bước 7 [13].
- SRE [24]: bốn tín hiệu vàng; "HTTP 200 success response, but coupled with the wrong content"; "only end-to-end system tests can detect that you're serving the wrong content"; "average latency of 100 ms ... 1% of requests might easily take 5 seconds"; "a slow error is even worse than a fast error"; "Every page should be actionable"; "what's broken, and why?".
- Sampling [4], primer [1], traces [2], W3C [3] ("It has four fields", Recommendation 23/11/2021), What is OTel [33].
- Langfuse [14]–[20], [32], [34]: mọi câu trích khớp, gồm ví dụ 17.903 / 17.817 → 86 + 17.817; tối thiểu 3 ngày; "On a nightly basis"; "Deleted assets cannot be recovered"; "Configure masking separately for any non-Langfuse exporter"; "Collector-side masking happens after telemetry leaves the application".
- Anthropic [22], [23] (2024-12-19), [29] (2025-06-13, đủ 6 tác giả, 80%, 15×, khoảng 20 câu hỏi); OpenAI [30]; Hamel [28] (2024-03-29); Presidio [27]; GDPR [25]; Công báo [26] (ban hành 26/06/2025, hiệu lực 01/01/2026).
- Mọi nhãn "minh họa" cần có đều có (mục 3, 4, 9, footer).

---

## 2. Khái niệm cốt lõi còn thiếu

**M1 (TRUNG BÌNH). Metric phải tính trước khi sampling; trace đã sampling thì bị lệch.**
Mô phỏng dạy tail sampling rất tốt nhưng bỏ ngỏ hệ quả. Số tự tính ở cấu hình mặc định: trong 173 trace tail giữ có 37 trace lỗi, tức 21,4%, trong khi tỷ lệ lỗi thật là 3,7%. Head giữ 6/91, tức 6,6%. Người học rất dễ đếm tỷ lệ lỗi trên trace đã lưu. Đề xuất thêm một dòng vào `simNote` do JS tính ("Trong số trace tail giữ, X% là lỗi; thực tế là Y%") và một câu: tỷ lệ lỗi, percentile phải tính từ metric của mọi request, không tính từ trace đã sampling.

**M2 (TRUNG BÌNH). SLO chưa được giải thích là một mục tiêu có ngưỡng.**
Dòng 631 và thẻ `slo` dịch sát [1] ("nối SLI với giá trị kinh doanh"), rất trừu tượng. Bảng v7/v8 lại dùng SLO như ngưỡng (≤ 8 s). Thêm một câu bằng lời của trang, có đánh dấu: "Trong thực tế SLO được viết thành mục tiêu đo được, ví dụ 95% request trả lời dưới 8 giây trong 30 ngày." Có thể thêm khái niệm error budget ở mức một câu.

**M3 (TRUNG BÌNH). Chỉ số riêng cho RAG.**
Mục tiêu người học là RAG, nhưng mục 9 không có chỉ số retrieval nào. Nên thêm một thẻ: tỷ lệ retrieval trả rỗng, điểm relevance của top-k, tỷ lệ câu trả lời bám tài liệu (groundedness) do judge chấm, độ trễ riêng của span retrieval. Liên kết sang `../llm-evaluation/` và `../rag/`. Chưa có nguồn trong ghi chú: cần mở nguồn, hoặc ghi là nhận định của trang.

**M4 (TRUNG BÌNH). Phân bổ chi phí theo khách hàng, tính năng.**
Doanh nghiệp sẽ hỏi "tenant nào, tính năng nào tốn tiền". Thẻ `userattr` có user, tag nhưng không nối với chi phí. Một câu ở thẻ "Chi phí": gắn user, tag vào trace để chia chi phí theo khách hàng và tính năng [15][17].

**M5 (THẤP). Dữ liệu trace đi tới bên thứ ba.**
Tracing của OpenAI Agents SDK mặc định gửi về backend của OpenAI ("sends traces/spans in batches to a BackendSpanExporter, which exports ... to the OpenAI backend" [30]). Với doanh nghiệp đây là điểm quan trọng hơn cả `trace_include_sensitive_data`. Thêm vào cột "Lưu ý" ở dòng 583.

**M6 (THẤP). Kết hợp head và tail.** Nguồn [4] nói có thể head trước để bảo vệ đường ống rồi tail sau. Một câu ở cuối mục 4.

**M7 (THẤP). Truyền context qua biên giới của agent.** Trang có `traceparent` nhưng chưa nói các chỗ dễ đứt trong hệ LLM: hàng đợi, job nền, MCP server, sub-agent chạy từ xa. Repo OTel có `client-invoke-agent.md` và `mcp.md` [7]. Một câu ở dòng 610 là đủ.

**M8 (THẤP). Liên kết sang `../llm-cost-optimization/`.** Node "Chi phí, context" chỉ dẫn sang Context engineering. Thêm link khi trang kia publish.

---

## 3. Sư phạm và tiếng Việt

**P1 (TRUNG BÌNH). Thuật ngữ chưa nhất quán.**
- "LLM giám khảo" và "judge" dùng lẫn: dòng 349, 494 (SVG "judge"), dòng 636 ("Judge chấm điểm"), dòng 618, bảng v7/v8 ("Judge ..."), thẻ từ điển "LLM giám khảo online". Chọn một, lần đầu ghi "LLM giám khảo (judge)".
- "ngầm" gánh hai nghĩa: "lỗi ngầm" (implicit failure) và "tín hiệu ngầm" (implicit feedback). Đổi cái sau thành "phản hồi gián tiếp" hoặc "tín hiệu gián tiếp".
- "sampling" và "lấy mẫu" (dòng 424, 560 dùng "lấy mẫu"; nơi khác dùng "sampling").
- "che dữ liệu" và "masking": ổn nếu lần đầu ghi cả hai.

**P2 (THẤP). Câu khó hiểu hoặc dịch sát.**
- Dòng 617: "nếu chỉ cần phản ứng máy móc thì đừng gọi người". Đề xuất: "nếu việc cần làm lặp lại máy móc thì nên tự động hóa, đừng đánh thức người trực".
- "Cảnh báo hành động được" (dòng 447, 662, 958): đề xuất "cảnh báo phải dẫn tới hành động".
- "Lưu lượng và độ đầy" (dòng 634): "saturation" thường dịch là "mức bão hòa".
- "điểm %" trong bảng v7/v8: viết "điểm phần trăm" và giải thích một lần rằng nó khác "%" tương đối.
- Dòng 908: ở tỷ lệ giữ 100% hiện "Tail lưu thêm 0 trace so với head, tức gấp 1,0 lần". Bỏ vế "gấp" khi bằng nhau.

**P3 (THẤP). Bước 1 của stepper quá nặng.** Người học chưa biết span là gì đã gặp 8 dòng thuộc tính cùng ba ý về `invoke_agent`, low cardinality, prompt version. Chuyển ý low cardinality và prompt version sang bước 8 hoặc mục 8.

**P4 (THẤP). Hai chỗ nêu điều kiện đọc trước khác nhau.** Dòng 255: đọc trước "Cách LLM hoạt động" và "AI Agent". Dòng 654: đọc trước "AI Agent" và "LLM evaluation".

**P5 (THẤP). Bản đồ dọc ở mục 6.** Mũi tên đầu ghi "↓ observability dùng các nền tảng này" nhưng chỉ xuống nhóm "THÀNH PHẦN PHÁT RA SPAN"; observability chưa xuất hiện. Đưa hộp "TRUNG TÂM" lên ngay sau "NỀN TẢNG", hoặc đổi nhãn mũi tên.

Điểm tốt nên giữ: ví dụ Minh Phát xuyên suốt mục 3 → 9 (412 trace tool lỗi ở bước 7 khớp `v7.tool` trong bảng; timeout 6 giây khớp ở ba nơi); đoạn văn ngắn; diacritics đầy đủ; nhãn "nhận định của trang này" đã có ở ba chỗ.

---

## 4. JS / HTML / mobile

### Kết quả đo ở 390px (cả hai theme)

| Tiêu chí | Kết quả |
|---|---|
| Tràn ngang | Không. `scrollWidth` 375 = `clientWidth` 375 ở trạng thái đầu, cả 9 bước stepper, 6 trạng thái mô phỏng |
| Chữ dưới 11px | Không có. Nhỏ nhất là citation 11px |
| Chữ thân bài | 15px |
| Lỗi JS (`window.onerror`) | 0 |
| Bảng `table.stack` | 8/8 chuyển thành thẻ, mọi ô có `data-label` |
| `#src-N` | 34/34 tồn tại, không id trùng, không hash hỏng, cả 34 nguồn đều được dẫn |
| Link nội bộ `../<slug>/` | 12/12 thư mục có `index.html` |
| Link ngoài | Tất cả có `rel="noopener"` |
| Tìm không dấu | "lay mau" 3, "che du lieu" 1, "diem" 3, chuỗi lạ 0 |
| Tương phản dưới 4,5:1 | Chỉ nút disabled "← Trước" / "Tiếp →": 2,75 (sáng), 3,79 (tối). Control disabled được WCAG miễn |

### TRUNG BÌNH

**H1. Nhãn trục waterfall đè nhau ở 721–857px.**
- Đo ở 768px: nhãn "8 s" ở x 678–695, "9,4 s" ở x 681–709, đè 14px; đã xem ảnh, đọc thành "89,4 s". Track chỉ còn 153px vì cột tên cố định 250px (dòng 112) trong khi stepper đã về hai cột từ 721px.
- Điều kiện: bề rộng track dưới khoảng 245px, tức viewport 721–857px (iPad dọc 768, 820).
- Sửa: đổi breakpoint một-cột của `.wf-row,.wf-axis` (dòng 217) từ 600px lên khoảng 860px; hoặc bỏ nhãn "8 s" khi track hẹp; hoặc cho mốc cuối là "9,4 s" và bỏ mốc 8.

### THẤP

**H2. `role="img"` che nội dung có nghĩa.** `#wf` (dòng 387) và `#hist` (dòng 411) có `role="img"` với `aria-label` chung chung, nên trình đọc màn hình bỏ qua tên span, thời lượng, số đếm bên trong; `aria-label` trên từng `.ht` cũng mất tác dụng. Đổi sang `role="group"`.

**H3. Thanh trượt "Tỷ lệ giữ ngẫu nhiên"** (dòng 402) có giá trị 0–5 ánh xạ sang 1–100%. Trình đọc màn hình đọc "2" thay vì "10%". Thêm `aria-valuetext` trong `sim()`.

**H4. Vùng bấm dưới 40px.** Link trong đoạn văn và link URL trong mục Nguồn cao 20px (19 mẫu). Link trong văn thường được chấp nhận. Với mục Nguồn có thể thêm `display:inline-block;padding:10px 0` cho `ol.sources a` trên mobile.

**H5. Chữ phụ 12–14px mang nội dung.** Giá trị trong `.kv` 14px monospace, `.vflow .ar` 13px (có câu mang nghĩa như "↺ score được gắn ngược…"), `.mkr` 13px, `.tag` 12px, "Liên quan:" 13px. Đều trên ngưỡng 11px; nếu muốn chặt theo "thân bài ≥ 15px" thì nâng `.kv` lên 15px và `.vflow .ar` lên 14px ở mobile.

**H6. Nhánh kết luận "Cả hai đều giữ đủ trace lỗi (tỷ lệ giữ 100%)"** (dòng 907) ghi cứng "100%". Đã quét mọi tổ hợp tỷ lệ lỗi 1–10% và tỷ lệ giữ 1–50%: không tổ hợp nào rơi vào nhánh này, nên hiện không sai. Chỉ là rủi ro nếu đổi seed.

**H7. `aria-live="polite"` trên `#stepBody`** (dòng 386) khiến trình đọc màn hình đọc lại cả khối dài mỗi lần đổi bước. Cân nhắc chỉ thông báo tiêu đề bước.

Không phải lỗi (đã kiểm): `var T` trong `sim()` là biến cục bộ, không đụng mảng từ điển `T`; tham số `root` của `labelTables` che biến ngoài nhưng vô hại; localStorage đều bọc try/catch; prefix checklist `llm-observability-` đúng.

---

## 5. Chart và phần tương tác

### Waterfall (mục 3): đúng

| Span | left% / width% trong DOM | Tự tính | Hiển thị |
|---|---|---|---|
| invoke_agent | 0 / 100 | 0 / 100 | 9,40 s |
| retrieval | 1,595 / 3,936 | 150/9400, 370/9400 | 0,37 s |
| chat lượt 1 | 5,957 / 15,85 | 560/9400, 1490/9400 | 1,49 s |
| execute_tool | 22,34 / 63,82 | 2100/9400, 6000/9400 | 6,00 s, đỏ, nhãn Error |
| chat lượt 2 | 86,70 / 12,76 | 8150/9400, 1200/9400 | 1,20 s |

- "tức 64%": 6000/9400 = 63,83% → 64. Đúng.
- Chú thích khớp màu: tím agent, xanh lá retrieval, xanh dương gọi model, đỏ span lỗi.
- 390px: 6 mốc trục không đè (khe hẹp nhất 7px giữa "8 s" và "9,4 s"). 1000 và 1280px: không đè. 768px: đè, xem H1.

### Histogram và mô phỏng (mục 4): khớp 100%

Số Node tự tính so với số trang hiển thị:

| Trạng thái | Chỉ số | Node | Trang |
|---|---|---|---|
| Mặc định (lỗi 3%, giữ 10%, ngưỡng 10 s) | Trung bình / p50 / p95 / p99 | 3,518 / 2,484 / 11,787 / 31,220 | 3,52 / 2,48 / 11,79 / 31,22 |
| | Histogram | 34, 258, 379, 173, 74, 17, 54, 0, 11 | giống |
| | Lỗi: tổng / nhanh / chậm | 37 / 26 / 11 | giống |
| | Head: lưu / lỗi / chậm | 91 / 6 / 4 trên 65 | 91, 6/37 (16%), 4/65 (6%) |
| | Tail: lưu / lỗi / chậm | 173 / 37 / 65 | 173, 37/37, 65/65 |
| | Trung bình request thành công | 3,284 | 3,28 |
| | Dung lượng | 3,64 và 6,92 MB | ≈ 3,6 và ≈ 6,9 MB |
| Lỗi 0% | p99 | 15,991 | 15,99 |
| Giữ 1% | Head / Tail | 10 (1 lỗi) / 100 | giống |
| Giữ 1%, ngưỡng 5 s | Tail, số trace chậm | 134, 99 | giống |
| Lỗi 10%, giữ 100% | Lỗi / chậm | 107 / 94 | giống |
| Tắt "luôn giữ trace lỗi" | Tail lỗi | 16/37 | 16/37 (43%), kết luận đỏ đúng nhánh |

- Request đi vòng dài: 69/1.000, khớp "khoảng 7%". Lỗi nhanh 0,2–0,6 s; lỗi chậm 31–32 s.
- Nhãn trung bình / p50 / p95 / p99 nằm đúng khoảng (3–4, 2–3, 10–20, ≥ 30). Ở lỗi 0%, p95 và p99 cùng khoảng 10–20, hiển thị cạnh nhau, không đè.
- Màu: thanh xanh dương là thành công, đỏ là lỗi, khớp chú thích; nhãn "trung bình" cam khớp ô KPI.

Câu chữ so với số:

| Câu trong trang | Số tính | Kết luận |
|---|---|---|
| "trung bình cao hơn p50 khoảng 1 giây" | 3,52 − 2,48 = 1,04 | Đúng |
| "p99 vượt 30 giây" | 31,22 | Đúng |
| "p99 tụt xuống còn khoảng 16 giây" | 15,99 | Đúng |
| "vài trace lỗi trong số khoảng 37" | 6/37 | Đúng |
| "head còn khoảng 10 trace ... tail ... khoảng 100 trace" | 10 và 100 | Đúng |
| "Đổi ngưỡng sang 5 giây ... nhiều trace hơn hẳn" | 100 → 134 | Đúng |
| Quiz 4: "trung bình là 3,5 giây", "1% chậm nhất chờ hơn 30 giây" | 3,52; p99 31,22; 11 request ≥ 30 s | Đúng |
| Bài tập tuần 1: giữ hết lỗi mà lưu dưới 15% | Giải được: giữ 1% (100 trace), giữ 5% (137), giữ 1% + ngưỡng 5 s (134), chỉ luật lỗi + giữ 10% (122) | Đúng |

### Bảng v7 / v8 (mục 9): khớp 100%

| Chỉ số | v7 | v8 | Thay đổi | Trang |
|---|---|---|---|---|
| Exception | 59/8420 = 0,701% | 52/8610 = 0,604% | −0,10 điểm | giống |
| p95 | 9,8 | 7,6 | −22,449% | −22,4% |
| Judge đạt | 781/842 = 92,755% | 839/861 = 97,445% | +4,69 điểm | giống |
| Tool lỗi | 412/8420 = 4,893% | 398/8610 = 4,623% | −0,27 điểm | giống |
| 👎 | 233/1310 = 17,786% | 141/1280 = 11,016% | −6,77 điểm | giống |
| Token | 7150 | 7420 | +3,776% | +3,8% |

- "Đạt SLO: v7 1/3, v8 3/3": đúng. "chấm ngẫu nhiên 10% trace": 842/8420 và 861/8610 đều đúng 10,00%.
- Diễn giải cần sửa: xem A2, A3.

### SVG flow desktop (mục 2)

- 1280px: tỷ lệ 1,05, chữ 12px hiển thị 12,6px. 1000px: ẩn, hiện bản dọc. Đúng thiết kế.
- Mũi tên: 6 mũi tên trái sang phải; vòng xanh lá từ 6 chỉ xuống 5; vòng tím từ 7 chỉ lên 1. Đúng hướng, đúng nghĩa. Chú thích 4 màu khớp.
- **V1 (THẤP). Đường đứt tím cắt qua nhãn "CẢI TIẾN".** Path dòng 366 đi dọc x=924 từ y=200 xuống 252; nhãn dòng 325 nằm giữa tại x=924, y=226. Thấy trên ảnh chụp ở cả hai theme: đường đi sát ngay trên và dưới chữ, nhãn nằm chắn giữa đường. Sửa: đưa nhãn lên trên hộp 7, hoặc cho path rời hộp ở x=970.

### SVG bản đồ quan hệ desktop (mục 6)

- Không chữ nào đè nhau hay tràn hộp ở cả hai theme. Nhãn "phát span", "trace thật ↔ score", "mặt trái" không bị đường cắt.
- Mũi tên: xám từ nền tảng vào trung tâm; xanh lá từ thành phần vào trung tâm; tím hai đầu với Evaluation; tím một chiều tới "Chi phí, context"; đỏ đứt xuống "Rủi ro dữ liệu". Đúng với đoạn "Đọc hình".

### Bản dọc `.vflow` (390px)

- Flow: 7 node, thứ tự và màu nhóm khớp bản desktop; hai dòng "↺" có đủ.
- Bản đồ: đủ 5 nhóm, màu khớp desktop; link trong node xuống dòng gọn. Thứ tự đọc: xem P5.

---

## Thứ tự sửa đề xuất

1. A1 (vị trí tail sampling trong flow), A2 và A3 (diễn giải bảng v7/v8), A4 (dataset và hạn giữ), A5 (hai quy tắc đếm token).
2. H1 (nhãn trục đè ở tablet), V1 (đường cắt nhãn "CẢI TIẾN").
3. M1 (metric tính trước sampling), M2 (SLO là mục tiêu), M3 (chỉ số RAG), M4 (chi phí theo tenant).
4. P1 (thống nhất thuật ngữ).
5. Nhóm THẤP còn lại nếu còn thời gian.

## Giả định

- Link trong đoạn văn cao 20px được coi là chấp nhận được; brief chỉ miễn rõ cho citation. Độ tin cậy: trung bình.
- Khoảng 721–1080px (tablet) không nằm trong tiêu chuẩn 390px của brief, nhưng vẫn báo H1 vì là lỗi nhìn thấy được. Độ tin cậy: cao.
- Khoảng tin cậy ở A2 dùng xấp xỉ chuẩn cho hiệu hai tỷ lệ độc lập. Độ tin cậy: cao.

---

## Kết quả áp dụng (phiên dựng trang, 2026-11-17)

Mỗi phát hiện được kiểm lại bằng nguồn hoặc bằng Orca trước khi sửa. Nguồn mở lại thêm trong lượt này: [4] (tail sampling "later in the telemetry pipeline", Collector có Tail Sampling Processor, head + tail "protecting the telemetry pipeline from being overloaded"), [30] (BackendSpanExporter gửi về "the OpenAI backend"; `set_trace_processors()` thay mặc định), [24] ("Written by Rob Ewaschuk", "Edited by Betsy Beyer", "Copyright © 2017"). Link blob GitHub của 8 file OTel trả HTTP 200 (curl).

| Mã | Quyết định | Việc đã làm |
|---|---|---|
| A1 | Sửa | Node 3 thành "Head sampling"; node 4 thành "Export, tail sampling" (SVG desktop và bản dọc); thẻ "Bước 3" nói tail sampling chạy ở sau trong đường ống, ví dụ Collector [4]. |
| A2 | Sửa | Bảng v7/v8 tính nửa khoảng tin cậy 95% (xấp xỉ chuẩn) cho các dòng tỷ lệ; dưới ngưỡng thì hiện "gần như không đổi", màu trung tính. Kết quả Orca: exception ±0,24, tool ±0,64 (nhiễu); judge ±2,04, 👎 ±2,69 (có ý nghĩa). verNote viết lại. |
| A3 | Sửa | Thêm câu: so sánh trước–sau, không phải A/B; hai thay đổi cùng lúc; muốn tách thì chạy song song hoặc experiment (ghi là nhận định). |
| A4 | Sửa | Bước 9 thêm gạch đầu dòng: dataset item không bị xóa theo hạn giữ [20]; ẩn danh trước khi đưa vào, đặt hạn riêng. |
| A5 | Sửa | Dòng triệu chứng chi phí và thẻ `doublecount` nối hai quy tắc: OTel tính cache trong input [8], Langfuse tách nhóm [17]. |
| A6 | Sửa | Bước 4: "tên model bắt buộc nếu có; nên có số token và lý do dừng". |
| A7 | Sửa | Quiz 5: "khuyên nên có tùy chọn để bật". |
| A8 | Sửa | Thẻ `evalevent`: "gắn vào span GenAI đang được chấm". |
| A9 | Sửa | "plugin" → "thư viện instrumentation" ở bảng và thẻ từ điển. |
| A10 | Sửa | Bước 1: khóa ghi "environment (thuộc tính cấp trace của Langfuse)" và câu giải thích [15]. |
| A11 | Sửa | Bước 6 dùng `gen_ai.output.messages_ref`, khớp bước 9. |
| A12 | Sửa | Lead: "một trace có thể ghi lại…"; node dọc "2. Che dữ liệu" thêm "theo quy ước OpenTelemetry". |
| A13 | Sửa | Thẻ Chi phí: "80% phương sai hiệu năng", thêm "theo dõi token cùng với chất lượng". |
| A14 | Sửa | Tách thành dòng riêng "Một số lần gọi model không có chi phí". |
| A15 | Sửa | Quiz 6: "trung bình … (trong mô phỏng: 6/37)". |
| A16 | Sửa | Ghi "nhận định của trang này" cho dòng "Hợp khi" và câu "số vòng tăng đột ngột"; thẻ ZDR chỉ nói đúng điều nguồn nói; thẻ `spankind` thêm [10][11]. |
| A17 | Sửa | [24] thêm tác giả Rob Ewaschuk, biên tập Betsy Beyer, ghi © 2017 trên bản trực tuyến; [7]–[13], [31] đổi sang link `github.com/…/blob/…` (raw vẫn giữ trong file ghi chú). |
| M1 | Sửa | simNote do JS tính tỷ lệ lỗi trong kho trace (tail 21,4%, head 6,6%, thật 3,7%); thêm callout "Đừng tính tỷ lệ lỗi từ trace đã sampling" (nhận định). |
| M2 | Sửa | Mục 9 và thẻ `slo` thêm ví dụ SLO đo được (ghi là ví dụ của trang). |
| M3 | Sửa | Thêm thẻ "Chỉ số riêng cho retrieval" ở mục 9, ghi là gợi ý của trang, dữ liệu từ span retrieval [10], link RAG và LLM evaluation. |
| M4 | Sửa | Thẻ Chi phí: gắn user, tag, tính năng để chia chi phí [15][17]. |
| M5 | Sửa | Bảng "Chọn cách instrument": OpenAI Agents SDK mặc định gửi trace về backend OpenAI, muốn gửi nơi khác phải thay bộ xử lý [30]; thẻ ZDR cũng nhắc. |
| M6 | Sửa | Cuối mục 4: head trước để bảo vệ đường ống, tail sau [4]. |
| M7 | Sửa | Dòng triệu chứng `traceparent`: chỗ dễ đứt (hàng đợi, job nền, MCP server, sub-agent từ xa; nhận định) + quy ước cho lần gọi agent từ xa và MCP [7]. |
| M8 | Bác bỏ (tạm) | `llm-cost-optimization/` đang được làm song song, chưa publish (không có trong thẻ trang chủ); quy tắc không link tới trang chưa publish. Phiên chính có thể thêm link khi publish. |
| P1 | Sửa | Thống nhất "LLM giám khảo" (lần đầu kèm "(judge)"), SVG "giám khảo"; "tín hiệu ngầm" → "tín hiệu gián tiếp"; giữ "lỗi ngầm" cho implicit failure. "lấy mẫu" chỉ còn là alias trong từ điển. |
| P2 | Sửa | Câu cảnh báo viết lại; "độ đầy" → "mức bão hòa"; "điểm %" → "điểm phần trăm" (tiêu đề cột ghi rõ); khi head = tail thì ghi "Hai cách lưu cùng số trace". Thẻ đổi tên "Cảnh báo dẫn tới hành động". |
| P3 | Sửa | Bước 1 bỏ tên agent và prompt version; prompt name/version chuyển sang bước 8; low cardinality vẫn ở bảng mục 8. |
| P4 | Sửa | Mục 10 thống nhất: đọc trước Cách LLM hoạt động và AI Agent, đọc song song LLM evaluation. |
| P5 | Sửa | Nhãn mũi tên đầu bản dọc mục 6: "các thành phần dưới đây phát span theo chuẩn này". |
| H1 | Sửa | Breakpoint một cột của waterfall lên 860px. Orca 768px: một cột, trục "8 s" và "9,4 s" tách rời (đã xem ảnh). |
| H2 | Sửa | `#wf`, `#hist` đổi sang `role="group"`. |
| H3 | Sửa | `aria-valuetext` cho hai thanh trượt. |
| H4 | Sửa | `ol.sources a` có padding dọc trên mobile. Link trong đoạn văn giữ nguyên, như các trang đã publish. |
| H5 | Sửa | Mobile: `.kv` 15px, `.vflow .ar` 14px. |
| H6 | Sửa | Bỏ "100%" ghi cứng trong nhánh kết luận. |
| H7 | Bác bỏ | `aria-live` trên `#stepBody` giống hệt stepper các trang đã publish (vd. agent-memory); đổi riêng ở đây sẽ làm hệ thống không nhất quán. |
| V1 | Sửa | Đường đứt tím rời hộp 7 ở x=966, không còn cắt nhãn "CẢI TIẾN" (đã xem ảnh 1280px). |

Kiểm lại sau khi sửa (Orca, cổng 8792): 390px `scrollWidth` 390 = `innerWidth` 390; 0 chữ dưới 11px; 34/34 `#src-N` tồn tại và đều được dẫn; console 0 lỗi; tương phản dưới 4,5:1 chỉ có nút disabled (cả hai theme); số mô phỏng và bảng v7/v8 khớp số của review.
