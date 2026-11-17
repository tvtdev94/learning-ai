# Kongming review: llm-cost-optimization/index.html

Ngày: 2026-11-17 (Asia/Saigon). Chỉ tư vấn, không sửa trang.

## Kết luận

Trang đạt chất lượng xuất bản sau khi sửa 5 mục Medium bên dưới. Không có lỗi High. Mọi giá Anthropic, hệ số cache, số liệu máy tính và bảng mục 9 đều khớp với nguồn và với số tôi tự tính lại.

Lưu ý: file thay đổi trong lúc review (mtime 13:58:03 → 13:58:51, +107 byte; dòng 901 đã thêm tên nhóm vào chuỗi tìm kiếm). Số dòng dưới đây lấy theo trạng thái 13:58:51.

## Cách kiểm

- Nguồn: tải bản `.md` thô của 6 trang platform.claude.com ([1] [2] [6] [9] [20] [22]); tải HTML rồi bóc thẻ cho 7 trang OpenAI ([3] [5] [8] [18] [19] [23] [24]), Gemini [4], 3 bài Anthropic Engineering ([7] [16] [17]), 6 abstract arXiv ([10] [11] [13] [14] [15] [21]). Chưa mở lại: [12] GPTCache README.
- Số liệu: tính lại bằng Node độc lập với code của trang.
- JS và mobile: chạy bản sao trong iframe 390px và 1280px bằng Chrome headless (không có lỗi console; `scrollWidth` không tràn; mọi `#src-N` và `#term-*` trỏ tới id tồn tại).
- Chart: chụp 2 SVG desktop ở 1280px, sáng và tối, rồi xem ảnh. Bản `.vflow` mobile chỉ đo layout và cỡ chữ, chưa chụp ảnh; cần lượt Orca của bạn để xem tận mắt.

## Số tự tính lại (khớp trang)

Máy tính, mặc định (5.000 req/ngày, tiền tố 6.000, thay đổi 5.000, ra 500, cắt 30%, trúng 80%, model nhỏ 40%, batch 20%, Sonnet 5.5):

| Bước | USD/tháng | So với bước trước | Còn lại |
|---|---|---|---|
| Ban đầu | 4.050,00 | – | 100,0% |
| + Cắt 30% | 3.600,00 | −11,1% | 88,9% |
| + Cache trúng 80% | 2.322,00 | −35,5% | 57,3% |
| + 40% sang Haiku 5.5 | 1.441,08 | −37,9% | 35,6% |
| + 20% Batch | 1.296,97 | −10,0% | 32,0% |

Giảm 68,0%; 0,0270 → 0,0086 USD mỗi request; token ra chiếm 19%. Điểm hòa vốn của cache trong mô hình này là tỷ lệ trúng khoảng 20,8% (Sonnet, Opus) và 21,7% (Haiku); cảnh báo "tỷ lệ trúng quá thấp" bật đúng (thử ở 10%: +6,5%).

Stepper: 0,0261 / 0,0147 / 0,0291 / 0,0089 / 0,0005 / 0,0069 USD; phần vào 83%; giảm 74%. Mục 9: A 0,0470, B 0,1060, C 0,0430 USD; B so với A −87% API, +126% tổng; rẻ nhất là C. Tất cả khớp.

Giá [2] hôm nay: Opus 5.5 4 / 5 / 0,20 / 20; Sonnet 5.5 2 / 2,50 / 0,10 / 10; Haiku 5.5 (≤ 100.000 token) 0,10 / 0,125 / 0,01 / 0,50. Khớp `PRICES` (dòng 705–707). Hệ số 0,05× và 0,1×, hòa vốn 1 và 2 lần đọc, 286 token, tokenizer +30%, `inference_geo` 1,1×, ngưỡng 512 token: đều khớp.

## Phát hiện

### Medium

**M1. Nhãn "tăng 4× đến 15×" gắn sai đại lượng.** Dòng 491 (SVG #quan-he), mũi tên đỏ đi vào ô "Số lần gọi model". Nguồn [7] nói về token: "agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens". Người đọc sẽ hiểu là số lần gọi tăng 4–15 lần. Bản mobile (dòng 425) ghi đúng "token so với chat".
Sửa: đổi nhãn SVG thành "token gấp ~4× (agent), ~15× (multi-agent) so với chat", hoặc bỏ con số và chỉ ghi "nhiều vòng gọi hơn".

**M2. "Điểm chung của cả ba ... trúng cache không được bảo đảm" vượt quá nguồn.** Dòng 530, dẫn [1][3]. OpenAI [3] có nói ("doesn't guarantee a cache hit"). Anthropic [1] chỉ nói best-effort cho batch và lưu ý request song song ("a cache entry only becomes available after the first response starts"); không có câu chung nào nói trúng cache không được bảo đảm. Gemini [4] có ý này ("To increase the chance of an implicit cache hit") nhưng không được dẫn.
Sửa: "Cả ba đều cần tiền tố giống hệt. OpenAI nói rõ không bảo đảm trúng [3]; Gemini chỉ nói về việc tăng khả năng trúng [4]; với Anthropic, request gửi song song và request trong batch có thể trượt [1]."

**M3. Ô "Thời gian sống" của OpenAI lẫn hai thế hệ model.** Dòng 526: "thường vài phút tới tối đa 24 giờ", trong khi ô bên cạnh ghi vòng đời mặc định 30 phút. Trang [3] hôm nay: GPT-5.6 trở đi là "30m (default), or 12h in the Responses API", "Minimum lifetime of 30 minutes"; model cũ hơn: `in_memory` "around 5 to 10 minutes of inactivity, up to one hour", `24h` "up to 24 hours".
Sửa: "GPT-5.6 trở đi: tối thiểu 30 phút (mặc định) hoặc 12 giờ. Model cũ hơn: khoảng 5–10 phút không dùng, tối đa 1 giờ; hoặc tới 24 giờ ở chế độ 24h."

**M4. Thiếu ví dụ chi phí của vòng lặp agent.** Người học muốn xây agent, nhưng stepper và máy tính chỉ mô hình một request đơn. Trang nói "mỗi vòng gửi lại toàn bộ context" (dòng 238, 555) mà không cho thấy hệ quả: tổng token vào cộng dồn tăng nhanh hơn số vòng, và prompt caching trên phần hội thoại đang dài ra là cần gạt chính của agent.
Sửa (chọn một): thêm thanh "số vòng agent mỗi việc" vào máy tính; hoặc thêm một bước stepper minh họa, ví dụ 10 vòng, mỗi vòng thêm 1.500 token, so tổng token vào khi không cache và khi cache phần đã có. Ghi nhãn "minh họa".

**M5. Phân loại cần gạt không nhất quán giữa các mục.** Mục 1 có sáu cần gạt (dùng lại, gửi ít, chọn model, chậm hơn, viết ít, đo). Flow dùng bốn màu. SVG #quan-he có sáu ô khác (semantic cache, cắt context, effort, prompt caching, router, batch) và aria-label vẫn gọi là "sáu cần gạt". Bảng mục 7 có tám dòng. Người mới sẽ không ghép được.
Sửa: gắn số ①–⑥ của mục 1 vào ô SVG, node mobile và dòng bảng mục 7 (ví dụ "① Prompt caching", "① Semantic cache", "② Cắt context", "② Nén prompt"); sửa aria-label cho khớp.

### Low

**L1. Thứ tự key JSON: sai đối tượng và dẫn thừa nguồn.** Dòng 549 và 754. Nguồn [1] nói về khối `tool_use` trong messages: "Verify that the keys in your `tool_use` content blocks have stable ordering as some languages (for example, Swift, Go) randomize key order". Trang viết thành "thứ tự key JSON của tool" (dễ hiểu là định nghĩa tool). Dòng 549 dẫn thêm [3], nhưng trang OpenAI không có ý này.
Sửa: "thứ tự key trong các khối `tool_use` gửi lại phải ổn định"; bỏ [3] ở câu Swift, Go.

**L2. Dẫn hướng dẫn độ trễ cho ý về chi phí.** Dòng 244 ("Các nhà cung cấp và các nghiên cứu đều xoay quanh...") và dòng 770 chỉ dẫn [18], là trang Latency optimization. OpenAI có trang Cost optimization nói thẳng ý này (đã mở 2026-11-17, HTTP 200): "Reduce requests", "Minimize tokens", "Select a smaller model", cùng Batch và Flex. URL: https://developers.openai.com/api/docs/guides/cost-optimization
Sửa: thêm nguồn này làm [25] và dẫn ở dòng 244; ở dòng 770 ghi rõ "nguyên tắc tối ưu độ trễ".

**L3. "Batch và Flex luôn làm độ trễ tăng".** Dòng 591. Nguồn chỉ nói batch xong trong 24 giờ (phần lớn dưới 1 giờ ở Anthropic) và Flex chậm hơn. Bỏ chữ "luôn": "Batch và Flex đổi giá rẻ lấy độ trễ cao hơn".

**L4. RouteLLM: "dữ liệu sở thích của người dùng".** Dòng 764, 878. Abstract ghi "human preference data". Cách dịch hiện tại dễ hiểu là sở thích của người dùng hệ thống của bạn. Sửa: "dữ liệu con người chấm câu trả lời nào tốt hơn".

**L5. Thiếu mức 0,025×.** Dòng 509 và thẻ "Prompt caching" (dòng 867) chỉ nêu 0,1× và 0,05×. Trang giá hôm nay còn mức 0,025× cho Fable 5.1–5.2 và Mythos 5.1–5.2. Thêm nửa câu để đúng yêu cầu "ghi như trang giá hiện ra".

**L6. Thẻ từ điển có giá nhưng thiếu ngày.** `cachewrite` (dòng 870: 1,25×, 2×) và `batch` (dòng 881: giảm 50%) được đọc riêng lẻ. Thêm "(2026-11-17)" như các thẻ `inout`, `prefixcache`.

**L7. Dòng Haiku trong stepper thiếu chữ số.** Bước 5 hiện "0,0005 USD · vào 0,0003 · ra 0,0002" (giá trị thật 0,000475 / 0,00025 / 0,000225). Làm tròn che mất tỷ lệ. Sửa: hiện thêm "khoảng 0,48 USD cho 1.000 lượt", hoặc dùng 5 chữ số thập phân cho dòng này.

**L8. "−0,0%" ở bảng máy tính.** Khi tiền tố < 512 token, dòng "+ Prompt caching" hiện "−0,0%" (dòng 849). Sửa: nếu `Math.abs(d) < 0.05` thì hiện "0%" hoặc "–".

**L9. SVG #quan-he: bốn chỗ chữ sát hoặc chạm nét** (ảnh chụp 1280px, font hệ thống Linux; font khác có thể rộng hơn):
- "Effort, max_tokens" (dòng 462) rộng gần bằng ô 150px. Nới ô hoặc tách hai dòng.
- "bớt token" (dòng 494) chạm mũi tên Cắt context → Token vào. Dời x từ 294 về khoảng 280.
- "giá thấp hơn" (dòng 496) sát mũi tên Router. Dời x từ 722 về khoảng 705.
- "chặn mức cắt" (dòng 493) chạm cả hai ô hai bên. Dời ô "Đánh giá chất lượng" sang phải 20px hoặc đặt nhãn dưới mũi tên.

**L10. Flow: nhãn "trượt" nằm trên đường "trúng".** Dòng 288: câu màu xanh trên đường tắt gồm cả "trượt: đi tiếp sang router". Bản mobile tách đúng (dòng 266–267). Sửa: để nhãn đường tắt chỉ còn "trúng cache ứng dụng: trả lời ngay, không gọi model"; ghi "trượt" cạnh mũi tên ① → ②.

**L11. Flow không có vòng lặp agent.** Sơ đồ là một lượt thẳng. Thêm một câu dưới sơ đồ: "Với agent, bước ③ → ⑤ lặp lại sau mỗi lần gọi tool; mỗi vòng trả tiền lại cho toàn bộ context." Việc này cũng hỗ trợ M4.

**L12. A11y của stepper.** Dòng 354: container có `role="tablist"` nhưng nút không có `role="tab"` và dùng `aria-current`. Bỏ `role="tablist"` (dùng `role="group"`), hoặc chuyển hẳn sang tab/`aria-selected`.

**L13. Tiếng Việt và thuật ngữ.**
- "tạo ra khoảng 30% token nhiều hơn" (dòng 241, 561, 862) → "ra nhiều hơn khoảng 30% token".
- Thuật ngữ chưa giải thích ở lần đầu: "eval" (dòng 366), "p95" (591), "tenant" (565), "workload" (762, 877), "best-effort" (396), "false positive" (535), "service tier" (590). Thêm chú thích ngắn trong ngoặc.
- Mục 1 khá dày trước khi tới sơ đồ (3 thẻ + 6 thẻ + 2 callout). Có thể chuyển đoạn tokenizer và ngôn ngữ (dòng 241) xuống mục 8, nơi đã có thẻ cùng ý.

**L14. Giả định máy tính nên nêu thêm.** Danh sách ở dòng 391–399 chưa nói: router không tốn chi phí, cascade không tính lần gọi thứ hai, và cột "Giảm so với bước trước" phụ thuộc thứ tự bật cần gạt. Thêm một gạch đầu dòng.

## Khái niệm còn thiếu (ngoài M4)

Mỗi mục chỉ cần một đến hai câu hoặc một thẻ từ điển:

1. **Số tool và độ dài định nghĩa tool** là token vào ở mọi request. Liên kết `../tool-calling-structured-output/` và `../model-context-protocol/` (hai thư mục có tồn tại; trang chưa liên kết).
2. **Subagent dùng model rẻ hơn và context riêng.** Liên kết `../multi-agent-agentic-rag/`.
3. **"Đừng mặc định dùng LLM"**: ý này được dẫn ở dòng 244 nhưng không được triển khai. Thêm ví dụ: tra trạng thái hồ sơ bằng truy vấn thường, không cần model.
4. **Trả thêm để nhanh hơn**: trang giá [2] có Fast mode giá cao hơn. Đây là chiều ngược của cần gạt 4; một câu là đủ.
5. **Chi phí phía RAG ngoài model sinh**: reranker và embedding lúc truy vấn. Hiện chỉ nằm trong mục "không tính" của máy tính.

Chưa kiểm nguồn cho các mục 1, 2, 5; cần mở tài liệu trước khi viết con số.

## Đã kiểm và không có lỗi

- Theme: key `rag-theme`, đọc sớm trong `<head>`, có try/catch; bấm nút lưu đúng giá trị.
- Checklist: 9 ô, key `lco-w1a`… lưu "1"/"0", có try/catch.
- Từ điển: 34 thuật ngữ; nhóm 8 / 10 / 6 / 5 / 5; tìm không dấu chạy đúng ("dinh tuyen" → 6, "tien to" → 3, "ĐỊNH" → 11); mọi id liên quan tồn tại.
- Stepper: 8 bước, nút Trước/Tiếp khóa đúng ở hai đầu.
- Máy tính: nhánh tiền tố < 512, tiền tố = 0, tỷ lệ trúng thấp, đổi sang Opus 5.5 đều đúng; `data-label` gắn lại sau mỗi lần vẽ.
- 390px: không tràn ngang; cỡ chữ nhỏ nhất 11px (số trích dẫn); vùng bấm ≥ 39px (ô checkbox 20px nằm trong nhãn cao hơn 40px); `.d-only` ẩn, `.m-only` hiện.
- Màu chú thích khớp ở cả SVG và `.vflow` (g = p3, a = p2, r = p1, o = p4, x = bad, box3 = p2).
- Flow SVG: mũi tên đúng hướng, không chữ nào bị cắt, sáng và tối đều đọc được.

## Câu hỏi còn mở

- Tương phản chế độ tối ở mobile và ảnh chụp `.vflow` chưa được kiểm bằng mắt.
- [12] GPTCache README chưa được mở lại trong lượt này.

## Kết quả áp dụng (phiên chủ đề, 2026-11-17)

Mỗi phát hiện đã được kiểm lại với nguồn trước khi sửa.

- **M1** Đúng ([7] nói về token). Sửa SVG: ô đổi thành "Agent, multi-agent / token ~4× đến ~15× chat", nhãn mũi tên thành "nhiều vòng gọi hơn". Bản mobile bỏ mũi tên "↑ tăng" (dễ hiểu là semantic cache làm tăng), ghi rõ "làm tăng số lần gọi".
- **M2** Đúng (mở lại [1]: chỉ có câu về request song song và batch best-effort; [4]: "To increase the chance of an implicit cache hit"). Viết lại callout theo từng nhà cung cấp, thêm [4].
- **M3** Đúng (mở lại [3]). Tách GPT-5.6+ (30 phút mặc định hoặc 12 giờ) và model cũ (5–10 phút, tối đa 1 giờ; hoặc tới 24 giờ).
- **M4** Đúng. Thêm ô tính "Vòng lặp agent" ở cuối mục 4 (thanh số vòng 1–30; context đầu 8.000, +1.500/vòng, 300 token ra/vòng, Sonnet 5.5; ghi minh họa). Tự tính lại 10 vòng: 147.500 token vào; 0,3250 USD không cache; 0,0963 USD có cache (ghi 21.500, đọc 126.000). Một vòng: có cache đắt hơn, trang hiện cảnh báo. Thêm callout dưới flow (L11).
- **M5** Đúng. Đánh số "Cần gạt 1–6" ở mục 1, gắn số vào ô SVG, node mobile và từng dòng bảng mục 7; sửa aria-label.
- **L1** Đúng. Tách thành hai gạch: định nghĩa tool ([1][3]) và thứ tự key trong khối `tool_use` (chỉ [1]); sửa câu trong stepper.
- **L2** Đúng (mở https://developers.openai.com/api/docs/guides/cost-optimization). Thêm nguồn [25], dẫn ở mục 1 và bước 6; câu [18] ghi rõ là hướng dẫn độ trễ.
- **L3** Đúng. Bỏ "luôn".
- **L4** Đúng. Đổi thành "dữ liệu con người chấm câu trả lời nào tốt hơn (human preference data)".
- **L5** Đúng. Thêm 0,025× (Fable, Mythos 5.1–5.2) ở bảng mục 7 và thẻ từ điển.
- **L6** Đúng. Thêm ngày 2026-11-17 vào thẻ `cachewrite` và `batch`.
- **L7** Đúng. Dòng Haiku thêm "≈ 0,48 USD cho 1.000 lượt, so với 8,90 USD trên Sonnet 5.5".
- **L8** Đúng. |d| < 0,05 hiện "0%". Đã kiểm với tiền tố 250 token.
- **L9** Đúng. Dời "bớt token", "giá thấp hơn", dời ô "Đánh giá chất lượng" sang phải 16px; hàng cần gạt dùng font 14; ô "Effort, max_tokens" đổi thành "5 · Bớt token ra / effort, max_tokens". Đã xem lại ảnh 1280px.
- **L10** Đúng. Nhãn đường tắt chỉ còn "trúng…"; "trượt" đặt cạnh cặp ô ① → ②.
- **L11** Đúng. Thêm callout "Với agent, bước ③ đến ⑤ lặp lại…".
- **L12** Đúng. `role="tablist"` → `role="group"`.
- **L13** Phần lớn đúng. Sửa "ra nhiều hơn khoảng 30% token"; giải thích eval, p95, tenant, workload, best-effort, false positive, service tier ở lần đầu. **Bác bỏ** việc chuyển đoạn tokenizer xuống mục 8: đoạn này giải thích vì sao hóa đơn khó ước lượng, thuộc về phần "hóa đơn tính thế nào"; mục 8 đã có thẻ chẩn đoán riêng.
- **L14** Đúng. Thêm gạch giả định: router không tốn phí, không tính lần gọi thứ hai của cascade, phần đóng góp phụ thuộc thứ tự nhưng kết quả cuối không đổi.

Khái niệm còn thiếu:
1. Số tool và độ dài định nghĩa tool: thêm vào thẻ "Token vào" (286 token và computer toolset khoảng 4.500 token, cả hai theo [2]), liên kết `../tool-calling-structured-output/` và `../model-context-protocol/`.
2. Subagent dùng model rẻ hơn: **chưa thêm**, vì chưa mở được nguồn nói thẳng ý này. Chỉ thêm liên kết `../multi-agent-agentic-rag/` cạnh số liệu 4×/15×.
3. Không mặc định dùng LLM: thêm ví dụ tra trạng thái hồ sơ ở mục 1 và thẻ từ điển `nollm` ([18]).
4. Fast mode: thêm callout ở mục 7 và thẻ từ điển (2,5×; Opus 5.5 là 8/40 USD/MTok; không dùng với Batch; theo [2] ngày 2026-11-17).
5. Chi phí phía RAG: thêm câu về embedding câu hỏi và reranker ở thẻ "Đừng quên chi phí ngoài model chính", không nêu số.

Câu hỏi còn mở của review:
- `.vflow` mobile và tương phản tối ở mobile: đã chụp và xem trong Orca ở 390px, cả sáng và tối. Kiểm tự động không có chữ nhỏ hơn 11px và không có chữ màu dưới 4,5:1.
- [12] GPTCache: phiên chủ đề đã mở lại ngày 2026-11-17 (ghi chú nguồn, mục "Kiểm lại các nguồn còn lại").
