# Kongming review: llm-evaluation/index.html

Ngày: 2026-11-16. Chỉ tư vấn, không sửa file trang.

**Lưu ý trạng thái file:** trang đã bị sửa trong lúc review (mtime 16:14:12, `git diff --stat`: 15 dòng thêm, 16 dòng bớt so với HEAD). Số dòng dưới đây theo trạng thái đó. Các lỗi đã được sửa trong lúc review thì không liệt kê nữa: token màu light cũ, link `../prompt-engineering/` và `../llm-observability/`, đáp án chuẩn rag-017 lệch với bước 4, câu "hit@k tụt mạnh", "52/60 lượt gọi".

**Cách kiểm:** đọc toàn bộ file; WebFetch lại nguồn [1] [2] [3] [4] [7] [9] [10] [16] [22] [24] và tải mã nguồn [14]; tính lại số bằng node; render bản sao trong Chrome headless ở 390px và 1280px (đo scrollWidth, font-size, vùng bấm, bbox chữ SVG). Chưa kiểm trên thiết bị thật. Chưa mở lại [5] [6] [8] [11] [12] [13] [15] [17]–[21] [23] [25] [26] (chỉ đối chiếu với câu trích trong file ghi chú nguồn).

## Phát hiện

| ID | Mức | Vị trí | Vấn đề | Đề xuất sửa |
|---|---|---|---|---|
| F1 | high | dòng 903 | Ô "Vị trí tìm thấy" dùng `inputmode="numeric"`. Trên iPhone, chế độ này mở bàn phím chỉ có số 0–9, không có dấu phẩy hay dấu cách, nên không gõ được `2, 7`. Mọi câu R ≥ 2 không nhập tay được, đúng phần máy tính muốn dạy (hit khác recall). Chưa kiểm trên thiết bị thật; dựa trên hành vi đã biết của iOS. | Bỏ `inputmode` (bàn phím chữ thường có cả số và dấu phẩy). Tốt hơn cho điện thoại: cho bấm trực tiếp vào các ô vị trí 1–10 để bật/tắt đoạn đúng. |
| F2 | med | dòng 880 (bước 4), 356 | Ví dụ correctness tự mâu thuẫn. "Đoạn nguồn ghi" chỉ có 3 ý (4 lần cước, 14 ngày, kèm ảnh), nhưng đáp án chuẩn có ý thứ 4 "hoàn cả phí COD". Ý này không nằm trong context, vậy FN đó là lỗi thiếu context (retrieval), trong khi đoạn kết luận nói lỗi nằm ở lớp generation, và câu 2 trong máy tính có R = 1. | Thêm "hoàn cả phí COD" vào nội dung đoạn nguồn ở bước 4 (khi đó là lỗi generation bỏ sót ý). Hoặc nói rõ ý này nằm ở đoạn khác, đổi R của câu 2 thành 2 và nêu đây là lỗi hai lớp. |
| F3 | med | dòng 319 | Nhãn SVG "đạt → phát hành" đặt ở x=914, bbox đo được 914..1009, vượt viewBox 1000 nên bị cắt chữ cuối. | Đặt `x="898" text-anchor="end"`, hoặc rút thành "đạt → ship". |
| F4 | med | dòng 304–305, 290 | (a) Đường cong nét đứt bước 5 → bước 3 đi qua y≈167 ở x=584, cắt ngang nhãn "sửa xong, chạy lại" (bbox 520..620, y 162..178). (b) "nhiều lượt, lưu transcript" đo được 351..493, hộp là 352..492: chữ chạm và lấn viền; font khác sẽ lấn nhiều hơn. | (a) Hạ điểm điều khiển xuống y=176 và đưa nhãn lên phía trên đường cong, hoặc dời nhãn sang x=600, y=160 có nền `fill:var(--accent-soft)`. (b) Rút thành "nhiều lượt + transcript" hoặc tách hai dòng. |
| F5 | low | dòng 641, 318 | (a) Mũi tên tím "chấm các metric" kết thúc ở (542,140), rơi vào khe giữa hai hộp metric, không chỉ vào hộp nào và không chạm metric agent. (b) Đường "đạt → phát hành" màu `--p3` nhưng dùng marker `#arr` màu xám, đầu mũi tên lệch màu. | (a) Vẽ một khung nét đứt bao ba hộp metric và cho mũi tên chạm khung, hoặc tách ba mũi tên. (b) Thêm marker `arrG` tô `var(--p3)`. |
| F6 | med | dòng 715–722 (mục 13) | Bảng 2×2 mới dừng ở tỉ lệ đồng ý 85%. Thiếu hai khái niệm người học cần để hiệu chỉnh judge: tỉ lệ theo từng lớp và độ đồng thuận đã trừ ngẫu nhiên. Tính lại từ bảng: judge bắt đúng pass 27/28 = 96%, bắt đúng fail 7/12 = 58%; Cohen's kappa = (0,85 − 0,62)/0,38 ≈ 0,61. | Thêm hai dòng: "judge chỉ bắt được 58% ca fail" và một câu giới thiệu kappa (vì 70% câu là pass nên đồng ý ngẫu nhiên đã là 62%). Cần thêm nguồn cho kappa nếu đưa vào. |
| F7 | med | dòng 697, bước 7 dòng 883 | Thiếu khái niệm độ bất định thống kê. Trang chỉ nói "chênh 1–2 câu chưa nói được gì". Với 30 câu và tỉ lệ đạt 80%, khoảng tin cậy 95% xấp xỉ ±14 điểm phần trăm (1,96·√(0,8·0,2/30)); đây là phép tính, không phải số từ nguồn. | Thêm một thẻ ngắn ở mục 13: cỡ mẫu nhỏ thì khoảng tin cậy rộng; so hai phiên bản trên cùng bộ câu (so theo cặp) thay vì so hai trung bình. Ghi là "tự tính". |
| F8 | low | dòng 660 | "Có thiên lệch" gắn nguồn [1], nhưng Anthropic chỉ liệt kê: non-deterministic, đắt hơn code, cần hiệu chỉnh với người. Từ "bias" không có trong bài. | Đổi thành "Không tất định, đắt hơn code, cần hiệu chỉnh với người [1]; có thiên lệch [2][15][16]". |
| F9 | low | dòng 412, 463 | (a) Công thức context precision dùng "precision@i" nhưng trang chưa định nghĩa precision@k. (b) Ragas có biến thể `IDBasedContextPrecision` = số ID lấy về trùng ID chuẩn / tổng ID lấy về, không tính thứ hạng; số của nó khác CP@k trong máy tính dù cùng so ID. | (a) Thêm dòng precision@k = số đoạn đúng trong top-k / k vào bảng lớp 1. (b) Thêm nửa câu ở dòng 463: "khác biến thể ID-based của Ragas, vốn không xét thứ hạng". |
| F10 | low | dòng 438 | Số τ-bench (gpt-4o dưới 50%, pass^8 dưới 25%) là kết quả năm 2024 nhưng câu không ghi năm; người đọc cuối 2026 dễ hiểu là hiện trạng. pass^k cũng thiếu trực giác vì sao tụt nhanh. | Ghi "(bài báo 2024)". Thêm ví dụ của Anthropic: tỉ lệ đạt mỗi lượt 75% thì 3 lượt đều đạt chỉ còn 0,75³ ≈ 42% [1]. |
| F11 | low | dòng 440 | "Nhiều đường đúng có thể cùng tồn tại…" không có nguồn, trong khi [1] nói đúng ý này ("it's often better to grade what the agent produced, not the path it took"). | Gắn [1] và nêu rõ khuyến nghị: ưu tiên chấm kết quả, chỉ chấm đường đi khi đường đi là yêu cầu nghiệp vụ. |
| F12 | low | toàn trang | Khái niệm còn thiếu cho người xây RAG/agent doanh nghiệp: (a) eval khác guardrail (đo lường khác với chặn lúc chạy); (b) benchmark công khai không thay được eval trên dữ liệu của mình; (c) agent nhiều lượt cần người dùng giả lập, τ-bench dùng LLM đóng vai người dùng [21]; (d) độ trễ nên xem p50/p95 chứ không chỉ trung bình; (e) eval an toàn/red-team: mới nhắc qua promptfoo, chưa có lối sang `../governance/`. | Thêm 3–5 mục từ điển ngắn hoặc một thẻ "Chưa bàn ở đây". (c) có sẵn nguồn [21]; các mục khác cần nguồn hoặc viết thận trọng. |
| F13 | low | dòng 84 | Ô tìm kiếm từ điển kế thừa font 15px ở mobile (đo được 15px). iOS Safari tự phóng to trang khi focus vào input dưới 16px. Trang mẫu `rag/index.html:88` cũng vậy. | Thêm `font-size:16px` cho `.gloss-tools input` (các ô `.qrow` đã làm đúng). |
| F14 | low | dòng 119 | Link trích dẫn `[N]` đo được 20×35px (192 link), dưới ngưỡng 40px. Giống hệt trang mẫu `rag/index.html:135` nên là giới hạn của hệ thiết kế chung. | Chấp nhận, hoặc tăng padding dọc lên 13px và margin âm tương ứng trên toàn site. |
| F15 | low | dòng 924, 912, 152, 69 | (a) Hàng lỗi của bảng chi tiết dùng `colspan="6"`, trên mobile bị gắn nhãn "TOP-K (Ô XANH = ĐOẠN ĐÚNG)" phía trên thông báo lỗi. (b) Chip "Tự nhập" luôn `disabled` (opacity .45) kể cả khi đang là trạng thái được chọn, nên trông mờ. (c) CSS thừa: `.strip span.cut`, `.tag.bad`. (d) Bảng chi tiết xếp thẻ trên mobile thành 42 dòng cho 6 câu, khá dài. | (a) Bỏ `data-label` cho ô colspan. (b) Chỉ `disabled` khi chưa ở chế độ tự nhập, hoặc dùng `aria-disabled` không giảm opacity khi `.on`. (c) Xóa. (d) Trên mobile gộp 5 metric của mỗi câu thành một dòng. |
| F16 | low | dòng 401, 416, 404/429/880, 437/948, 767 | Tiếng Việt và thuật ngữ: (a) dòng 401 "hai góc nhìn này" không có tiền ngữ, câu trước nói "từng lớp" và trang chia ba lớp. (b) dòng 416 lặp ý: "có thư viện lấy toàn bộ đoạn đúng… Ví dụ LlamaIndex lấy toàn bộ danh sách đoạn đúng". (c) ký hiệu R vừa là số đoạn đúng (404) vừa là recall (429, 880). (d) dòng 437 "Transcript là lời agent nói" lệch với định nghĩa ở từ điển (bản ghi đầy đủ gồm cả tool call). (e) lẫn "ca" và "case", "lần" và "lượt" (dòng 767). | (a) "Microsoft tách đánh giá agent thành hai góc nhìn: …". (b) Gộp thành một câu. (c) Đổi công thức thành "Precision = … · Recall = …". (d) "Lời agent nói nằm trong transcript; outcome là trạng thái thật". (e) Dùng thống nhất "case" và "lượt". |
| F17 | low | dòng 788, 796, 776–801 | Nguồn: (a) [14] trỏ tới nhánh `main` (file thay đổi theo thời gian) và chữ hiển thị là github.com trong khi href là raw.githubusercontent.com; cảnh báo IDCG ở dòng 416 phụ thuộc đúng đoạn mã này. (b) [22] nay có canonical URL `learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators`. (c) Brief yêu cầu ghi năm; các mục [2] [4] [6]–[14] [22]–[26] chưa có năm. (d) dòng 227 "Anthropic khuyên… rồi mới kết luận" mạnh hơn nguồn một chút ("we run multiple trials to produce more consistent results"). | (a) Dùng permalink theo commit. (b) Cập nhật URL. (c) Ghi năm hoặc "không ghi năm". (d) "Vì vậy Anthropic chạy nhiều lượt cho mỗi task để kết quả ổn định hơn". |

## Đã kiểm và đạt

- Số do JS tính, tự tính lại bằng node, khớp: trước rerank k=5: hit 0,667, recall 0,583, MRR 0,472, nDCG 0,461, CP 0,431; sau rerank k=5: 0,833 / 0,833 / 0,750 / 0,758 / 0,722; trước rerank k=1: hit 0,333 (khớp dòng 465). nDCG "2, 7" R=2 k=5 = 0,387; nDCG@3 "2, 3" = 0,693; CP "1, 4" = 0,75; faithfulness 2/3; F1 = 4/7 ≈ 0,57; 34/40 = 85%; 52/60 = 87%.
- Công thức khớp nguồn: context precision (tử Σ precision@k·v_k, mẫu là số đoạn đúng trong top-K) [7]; TP/FP/FN và P/R/F1 [10]; answer relevancy (sinh câu hỏi, cosine với câu hỏi gốc, không đo độ đúng) [9].
- LlamaIndex `metrics.py` trên `main` hiện vẫn tính IDCG bằng `range(1, len(expected_ids) + 1)` (dòng 421–424 của file nguồn), nên cảnh báo ở dòng 416 đúng.
- Các câu gắn [1] [2] [3] [4] [16] [22] [24] khớp nguồn, trừ F8 và F17d.
- 26 `id="src-N"` đều tồn tại và đều được trích; không có `#src-N` treo.
- Link nội bộ chỉ còn: `../`, `../rag/`, `../ai-agent/`, `../reranking/`, `../hybrid-search/`, `../harness/`. Anchor `#danh-gia` có ở cả hai trang đích và đúng là mục 10.
- 390px: không tràn ngang ở trạng thái đầu và cả 8 bước stepper; body 15px; chữ nhỏ nhất 11px (trích dẫn); `.d-only` ẩn; nút, chip, select, input đều từ 40px.
- Tương phản chữ màu nhỏ, cả sáng và tối: thấp nhất 5,10:1 (muted trên accent-soft, chế độ sáng). Token light đã đúng bộ mới.
- localStorage đều qua try/catch (dòng 7, 813–814), prefix checklist `eval-`.
- SVG desktop: tỉ lệ 1,05 ở 1280px, chữ 12 đơn vị hiển thị ≥ 12px từ 1081px.

## Câu hỏi còn mở

- F1 cần xác nhận trên iPhone thật hoặc trình giả lập iOS.
- F6, F7, F12 thêm nội dung mới: cần nguồn hoặc ghi rõ "tự tính", theo quy định evidence của brief.

## Kết quả áp dụng

Kiểm lại từng phát hiện với file trang và nguồn (WebFetch ngày 2026-11-16), rồi test lại bằng Orca ở 390px và 1280px, cả sáng và tối.

| ID | Kết quả | Ghi chú |
|---|---|---|
| F1 | Đã sửa | Bỏ `inputmode="numeric"`; ô nhập dùng bàn phím chữ thường, gõ được "2, 7". Không làm bản bấm ô (thêm độ phức tạp, ô nhập văn bản đã đủ). |
| F2 | Đã sửa | Đoạn nguồn ở bước 4 nay chứa cả "hoàn cả phí COD"; nêu rõ FP/FN là ý nào và cả hai lỗi đều ở lớp generation. rag-017 đã có đủ 4 ý. |
| F3 | Đã sửa | Nhãn "đạt → phát hành" đặt `x=898 text-anchor=end`; đo lại bbox không vượt viewBox. |
| F4 | Đã sửa | Khung offline cao 190, đường cong nét đứt hạ xuống, nhãn "sửa xong, chạy lại" đặt dưới đường cong; "nhiều lượt + transcript". Script kiểm bbox: không chữ nào đè nhau hay cắt viền hộp. |
| F5 | Đã sửa | (a) Mũi tên "chấm các metric" nay chạm góc hộp metric. (b) Thêm marker `arrG` màu `--p3`. |
| F6 | Đã sửa | Thêm tỉ lệ bắt fail 7/12 ≈ 58%, pass 27/28 ≈ 96%, và Cohen's kappa ≈ 0,61 có nguồn mới [27]; thêm mục từ điển "Cohen's kappa". |
| F7 | Đã sửa | Thêm thẻ "Độ bất định thống kê" ở mục 13 (±14 điểm, ghi "tự tính", công thức có nguồn mới [28]); mục 12 trỏ sang; thêm mục từ điển "Khoảng tin cậy". |
| F8 | Đã sửa | Ô LLM-as-judge: "Không tất định, cần hiệu chỉnh với người [1]; có thiên lệch về vị trí, độ dài [15][16]". |
| F9 | Đã sửa | Thêm định nghĩa precision@i và câu về biến thể IDBasedContextPrecision [7]. |
| F10 | Đã sửa | Ghi "(bài báo 2024)" cho số τ-bench; thêm ví dụ 0,75³ ≈ 42% của Anthropic [1]. |
| F11 | Đã sửa | Gắn [1] và nêu khuyến nghị chấm kết quả, không chấm đường đi. |
| F12 | Sửa một phần | (c) Thêm mục từ điển "Người dùng giả lập" [1][21]. (e) Thêm link `../governance/` cho red teaming. Bác bỏ (a) eval vs guardrail và (d) p50/p95: ngoài phạm vi trang và chưa có nguồn đã mở. Bác bỏ (b): mục 7 đã nói số trong bài báo không chuyển sang dữ liệu doanh nghiệp. |
| F13 | Đã sửa | `.gloss-tools input` font-size 16px (đo lại: 16px). |
| F14 | Bác bỏ | Link trích dẫn dùng đúng hệ thiết kế chung của site (giống `rag/index.html`); đổi riêng trang này sẽ lệch các trang khác. |
| F15 | Đã sửa | (a) `labelTables` bỏ qua ô colspan (đo lại: không có data-label). (b) `.chip.on:disabled{opacity:1}`. (c) Xóa `.strip span.cut`, `.tag.bad`. (d) Mobile: 5 metric mỗi câu xếp lưới 3 cột, nhãn không viết hoa. |
| F16 | Đã sửa | (a) Viết lại câu Microsoft + "trang này chia ba lớp". (b) Gộp câu LlamaIndex. (c) Công thức dùng "Precision/Recall" thay cho P/R. (d) "Lời agent nói chỉ nằm trong transcript; outcome là trạng thái thật". (e) Câu tự kiểm tra 7 dùng "lượt". Giữ "ca" ở các chỗ khác vì là từ tiếng Việt tự nhiên. |
| F17 | Sửa một phần | (a) [14] dùng permalink commit 26c7dc3, đã mở và thấy đúng dòng IDCG. (b) [22] đổi sang URL canonical. (d) Sửa câu "Anthropic chạy nhiều lượt… để kết quả ổn định hơn". (c) Thêm năm cho [22] [26] (trang có ghi ngày); các tài liệu sống và Wikipedia không ghi năm nên giữ ngày truy cập, không bịa năm. |

Sửa thêm ngoài review: breakpoint SVG 1040 → 1080 cho khớp `rag/index.html`; `details summary` cao ≥ 40px trên mobile; nút "←" và theme rộng ≥ 40px; câu Shankar [19] trích đúng chủ ngữ "bộ chấm do LLM tạo ra"; câu Hamel [3] thành "thường chạy"; thêm [2] cho "suy luận trước khi chấm"; ghi chú mở lại nguồn ngày 2026-11-16 trong mục Nguồn.
