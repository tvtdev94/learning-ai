# Kongming review: agent-memory/index.html

Ngày: 2026-11-17 · Người review: kongming (chạy trên Fable 5.2) · Chỉ tư vấn, không sửa file trang.

Trạng thái file lúc review: `agent-memory/index.html`, 961 dòng, mtime 2026-11-17 12:59:57, không đổi trong suốt lúc review. Số dòng dưới đây theo trạng thái đó.

## Kết luận nhanh

Trang đạt chất lượng tốt: 22 nguồn đều được trích, mọi con số chính khớp nguồn, không tràn ngang ở 390px và 320px, không có chữ dưới 11px, không có cặp màu nào dưới 4,5:1 ở cả hai theme. Có **một lỗi số liệu cần sửa trước khi publish** (9.000 token so với 26.000 token ở mục 7) và **ba chỗ lệch nhau giữa stepper, mô phỏng và bảng eval**. Phần còn lại là cải thiện sư phạm.

## Cách kiểm

- Nguồn: tải lại bằng `curl` 21/22 URL vào thư mục tạm rồi tìm đúng câu trích (arXiv HTML/abs, docs Letta, LangChain `.md`, memory tool `.md`, OpenAI, Anthropic, OWASP, bocongan.gov.vn, gdpr-info.eu). Chưa mở lại riêng Reflexion bản HTML đầy đủ (chỉ abstract).
- Mô phỏng mục 4: viết lại công thức bằng Node, độc lập với JS của trang, rồi so với kết quả trang render.
- Eval mục 9: tính tay rồi so với chuỗi trang render.
- Layout: render bản sao tạm bằng Chrome headless trong iframe rộng 390, 320, 700px và cửa sổ 1280px, cả theme sáng và tối; đo `scrollWidth`, cỡ chữ thực tế (kể cả chữ SVG sau khi co giãn), chiều cao vùng bấm, tương phản. **Chưa xem ảnh chụp**: việc chữ đè nhau trong SVG chỉ được kiểm bằng cách đọc tọa độ, chưa kiểm bằng mắt.

## 1. Độ chính xác so với nguồn

### 1.1 [CAO] Mục 7, callout "Con số từ bài Mem0" (dòng 519): 9.000 token mâu thuẫn với 26.000 token

Trang viết số đo được thực hiện "trên hội thoại trung bình khoảng 9.000 token [13]". Bài Mem0 mô tả bộ dữ liệu họ dùng như sau: "It comprises 10 extended conversations, each containing approximately 600 dialogues and 26000 tokens on average" (arxiv.org/html/2504.19413, mục Dataset). Con số 9K là của abstract LoCoMo (300 lượt, 9K token). Ngay trong cùng callout, trang cũng nói full context đưa vào khoảng 26.000 token mỗi câu hỏi, nên người đọc sẽ thấy vô lý: hội thoại 9.000 token mà gửi cả hội thoại lại thành 26.000.

Sửa: thay câu cuối bằng "Đây là số do chính tác giả hệ thống đo, trên 10 hội thoại, mỗi hội thoại khoảng 26.000 token [10]. Hội thoại cỡ đó vẫn nằm gọn trong context window, nên full context còn dùng được; lịch sử dài hơn nhiều thì không. Hãy đo lại trên dữ liệu của bạn." Ở thẻ LoCoMo mục 9 (dòng 587) và thẻ từ điển `locomo` (dòng 877), thêm nửa câu: "bản 10 hội thoại mà bài Mem0 dùng dài hơn, khoảng 26.000 token mỗi hội thoại [10]".

### 1.2 [TRUNG BÌNH] "Điểm J" không được định nghĩa (dòng 519, 628, 878)

Người mới không biết J là gì. Trong bài Mem0, J là điểm do LLM chấm (LLM-as-a-Judge). Sửa: lần đầu xuất hiện ghi "điểm J (tỷ lệ câu trả lời được một LLM giám khảo chấm là đúng)" và link sang `../llm-evaluation/`.

### 1.3 [THẤP–TRUNG BÌNH] Trích [7] cho lời khuyên bảo mật mà nguồn không nói (dòng 553, 565)

Tài liệu LangGraph chỉ mô tả namespace ("Memories are scoped to any custom namespace"). Nó không nói sai namespace thì "lộ sang khách khác", cũng không khuyên "luôn lọc theo khách ở tầng tìm kiếm, không trông vào model". Hai ý đó đúng, nhưng là nhận định của trang. Sửa: đặt [7] ngay sau phần mô tả namespace, và thêm "(đề xuất của trang này)" cho phần lời khuyên, giống cách trang đã làm ở callout "Cách phòng".

### 1.4 [THẤP] Các chỗ nói hơi quá so với nguồn

- Dòng 343, 841, 842: "10 tin gần nhất", "10 memory giống nhất" là cấu hình thí nghiệm, không phải thiết kế cố định ("In our experimental evaluation, we configured the system with m = 10 previous messages and s = 10 similar memories"). Sửa: "trong thí nghiệm, họ dùng 10…".
- Dòng 511: "thêm một lần gọi LLM khi ghi". Mem0 gọi LLM ít nhất ở hai pha (trích xuất, rồi chọn thao tác cho từng fact). Sửa: "thêm vài lần gọi LLM khi ghi".
- Dòng 860: "Gặp mức 70% context thì có cảnh báo". Nguồn ghi "e.g. 70%". Sửa: "ví dụ 70%".
- Dòng 626: "Nếu khách yêu cầu xóa dữ liệu cá nhân thì phải xóa thật [22]". Nguồn nói chủ thể có quyền yêu cầu xóa và bên kiểm soát "phải kịp thời thực hiện trong thời hạn theo quy định của pháp luật"; không nói mọi yêu cầu đều phải xóa. Sửa: "Nếu có yêu cầu xóa dữ liệu cá nhân hợp lệ thì đánh dấu hết hiệu lực là chưa đủ, phải xóa thật."
- Dòng 235, 509: "mọi token cũ bị tính tiền lại ở mỗi lượt". Đúng với [1]. Có thể thêm một câu rằng prompt caching làm phần lặp lại rẻ hơn nhưng không miễn phí, kèm link `../llm-cost-optimization/` khi trang đó có. Ý này tôi **chưa kiểm nguồn**, chỉ là gợi ý.

### 1.5 Đã kiểm và khớp (không cần sửa)

| Nội dung | Kết quả |
|---|---|
| Bảng Mem0: J 72,90% so với 66,88%; p95 17,117 s so với 1,440 s; 26031 so với 1764 token | Khớp Bảng 2 |
| Zep hơn 600 nghìn token mỗi hội thoại, ghi rõ do nhóm Mem0 đo | Khớp ("in excess of 600k tokens") |
| LongMemEval: 500 câu, 5 năng lực, giảm 30%, ba giai đoạn | Khớp abstract |
| LoCoMo: 300 lượt, 9K token, tối đa 35 phiên | Khớp abstract |
| AgentPoison: trên 80%, dưới 1%, dưới 0,1% | Khớp abstract |
| MINJA, MEXTRA | Khớp abstract |
| Generative Agents: 0,995; thang 1–10 (đánh răng, chia tay, đỗ đại học); cosine; min-max; ngưỡng 150; hai, ba lần mỗi ngày | Khớp |
| MemGPT: 70% (ví dụ), tóm tắt đệ quy, tự quản | Khớp |
| CoALA: bốn loại, rủi ro khi sửa procedural | Khớp |
| Zep: `t_invalid` = `t_valid` của cạnh mới, ưu tiên thông tin mới, ba tầng | Khớp |
| Letta: dưới 50k ký tự, dưới 20 block, 300 token, không giới hạn số lượng | Khớp bảng trong docs |
| Memory tool: client-side, lọc nhạy cảm, hết hạn, path traversal, per-user directory | Khớp |
| OWASP [17]: ASI06 và câu "reshaped behaviour long after" | Khớp; trang không gán biện pháp giảm thiểu cho OWASP |
| OWASP blog [18]: tính bền, bề mặt tấn công, Claude Code v2.1.50 | Khớp |
| Luật 91/2025/QH15: hiệu lực 01/01/2026, quyền yêu cầu xóa (khoản 1 Điều 4) | Khớp |
| GDPR Điều 17, OpenAI [1], Anthropic [2], survey [6], survey [20], Reflexion [9] | Khớp |

Không có khẳng định then chốt nào thiếu trích dẫn. Cả 22 nguồn đều được dùng ít nhất một lần; mọi `#src-N` trỏ tới id tồn tại; không có id trùng.

## 2. Mô phỏng, eval và tính nhất quán với stepper

### 2.1 Mô phỏng mục 4: số trang tính ra khớp số tôi tính lại

Tính lại với recency = decay^giờ, min-max trên tập ứng viên, tổng = Σ α·điểm, mốc 2026-12-01 09:00. Mặc định (α = 1, decay 0,995, k = 3):

| Câu | Top-3 (tổng điểm) | Hạng 4 |
|---|---|---|
| 1 | M4 anh Minh 1,972 · M3 chị Lan 1,848 · M2 gói Pro 1,472 | M5 email 1,383 |
| 2 | M2 gói Pro 2,209 · M6 E-217 1,484 · M1 gói Basic 1,463 | M8 1,074 |
| 3 | M6 E-217 2,043 · M2 gói Pro 1,561 · M8 1,141 | M4 1,071 |

Callout "Thử ba việc" (dòng 390):

- (1) Đúng. Câu 1: chị Lan lọt cùng anh Minh, email bị đẩy ra (recall 1/2). Bật ô bỏ qua thì top-3 là M4, M2, M5 (recall 2/2).
- (2) Đúng. α importance = 0 thì top-3 là M8, M4, M5; gói Pro xuống hạng 5. Thật ra gói Pro đã rơi ngay ở 0,5. Nên nói thêm một điều người học sẽ thấy: memory "30/11: hỏi giờ tổng đài" (không liên quan) nhảy lên hạng 1 nhờ recency.
- (3) Đúng. Với 0,99: recency thô 14 ngày là 0,034, sau chuẩn hóa 0,043; hôm qua là 1. Với 0,999: 14 ngày còn 0,680 sau chuẩn hóa.
- Câu cuối về câu hỏi 2 đúng (gói Basic đứng hạng 3, sát nút: 1,463 so với 1,484).

Câu tự kiểm tra 5 (dòng 630): kết luận đúng. Gói Pro thắng email nhờ cả importance lẫn recency: bỏ recency thì email (1,333) vượt gói Pro (1,263). Giảm α importance xuống 0,5 hoặc tăng α relevance lên 1,5 đều đẩy gói Pro ra. Chỉ nên sửa chữ: "mới được truy hồi gần đây" thực tế là 14 ngày trước, recency chuẩn hóa chỉ 0,209. Viết lại: "và được truy hồi gần hơn memory 'email' (14 ngày so với 26 ngày)".

Bài tập w1b (dòng 608): giải được. Có 154 tổ hợp đạt recall 100% cho cả ba câu với k = 2; trong đó 18 tổ hợp không cần bật ô lọc, và cả 18 đều cần α importance = 0.

### 2.2 [TRUNG BÌNH] Ngày truy hồi của memory "chị Lan" lệch với stepper (dòng 764 so với dòng 726)

Bước 4 của stepper nạp "Kế toán trưởng: chị Lan" vào context ngày 17/11. Theo đúng công thức trang trích (recency tính từ lần truy hồi gần nhất), M3 phải có `last` = 17/11. Dữ liệu mô phỏng lại ghi `at(11,5)`. Tôi đã tính thử trạng thái kho ngày 17/11 và top-3 đúng là E-217, gói Pro, chị Lan, nên stepper đúng, dữ liệu M3 sai.

Sửa: đổi M3 thành `last:at(11,17)`. Hệ quả tôi đã tính lại:

- Câu 1 mặc định: M3 chị Lan 2,007 đứng **trên** M4 anh Minh 1,972; gói Pro hạng 3; email hạng 4. Callout (1) vẫn đúng và bài học còn rõ hơn.
- α importance = 0: top-3 thành M8, M3, M4; email rơi ra, recall còn 1/2. Callout (2) vẫn đúng về gói Pro nhưng nên thêm câu "recall vẫn chưa đủ vì chị Lan còn chiếm chỗ".
- Bài tập w1b: không còn lời giải nào nếu không bật ô lọc (còn 136 lời giải khi bật). Sửa đề thành "tìm cấu hình (trọng số và ô lọc)…"; đây lại là bài học tốt: chỉnh trọng số không cứu được memory đã cũ.

Nếu không muốn đổi số, cách khác là bỏ dòng "Kế toán trưởng: chị Lan" khỏi context ở bước 4, nhưng khi đó top-3 ngày 17/11 không còn khớp công thức.

### 2.3 [TRUNG BÌNH] Chẩn đoán câu C8 mâu thuẫn với stepper và mô phỏng (dòng 926, 943, 731)

Bảng eval gắn nhãn C8 là "Memory cũ chưa bị vô hiệu" và khuyên "C8 cần bước vô hiệu hóa memory cũ". Nhưng bước 5 của stepper đã đặt `t_invalid` cho "chị Lan", và mô phỏng cũng hiện M3 là "đã hết hiệu lực". Lỗi thật trong câu chuyện này là **bước truy hồi không lọc memory hết hiệu lực**, đúng điều ô tick ở mục 4 minh họa.

Sửa:
- Dòng 926: nhãn thành "Memory hết hiệu lực vẫn được nạp".
- Dòng 943: "C8 cần lọc memory hết hiệu lực khi truy hồi (ô tick ở mục 4)".
- Dòng 941: "memory cũ" giữ nguyên được.
- Dòng 731: "Nếu bước này bị bỏ sót, hoặc bước truy hồi không lọc memory đã hết hiệu lực, cả 'chị Lan' lẫn 'anh Minh' sẽ cùng lọt vào context".
- Cây chẩn đoán bước 4 (dòng 555): thêm "và bước đọc phải lọc theo hiệu lực".

### 2.4 [TRUNG BÌNH] Câu C4 và C5 cần một memory không có trong kho 9 memory (dòng 913–914 so với 762–770)

C4 ("báo lỗi hóa đơn mấy lần" → 2) và C5 ("lỗi 17/11 có giống lỗi 05/11" → cùng mã E-217) cần memory về lần lỗi ngày 17/11. Kho ngày 01/12 ở mục 4 chỉ có M6 (lỗi 05/11); M7 ngày 17/11 là chuyện chờ tổng đài. Bảng lại ghi "Memory đúng có trong context: Có".

Sửa, chọn một:
- A (ít ảnh hưởng nhất): viết lại hai câu để dùng memory có sẵn. Ví dụ C4: "Trong tháng 11 khách liên hệ vào những ngày nào?" → "05/11, 17/11, 30/11" (M6, M7, M8). C5: "Từ khi lên gói Pro, khách đã gặp những vấn đề gì?" → "Lỗi E-217 (05/11), chờ tổng đài 20 phút (17/11)"; agent trả lời "Chỉ lỗi E-217".
- B: thêm M10 "17/11: lỗi E-217 lặp lại" vào `MEM`. Cách này đổi tập chuẩn hóa min-max, phải kiểm lại toàn bộ callout và sửa "9 memory" thành 10.

### 2.5 Eval mục 9: KPI và phân loại lỗi khớp

Tính lại: đúng 6/11 = 54,5% (trang hiện 55%); recall truy hồi 8/9; lỗi truy hồi 1 (C3), lỗi đọc 2 (C5, C7), memory cũ 1 (C8), không biết từ chối 1/2 (C11); theo năng lực 2/3, 1/2, 1/2, 1/2, 1/2. Tất cả khớp chuỗi trang render. C7 đúng ngày (17/11 đến 01/12 là 14 ngày). C3 gắn nhãn lỗi truy hồi là hợp lý vì M9 có trong kho.

[THẤP] Bảng chỉ hỏi "memory đúng có trong context không", nên không tách được "chưa từng được ghi" với "ghi rồi nhưng không tìm ra", trong khi mục 8 dạy tách ba giai đoạn. Thêm một câu vào `evalNote`: "Khi memory không vào context, mở kho xem nó đã được ghi chưa trước khi kết luận là lỗi truy hồi."

### 2.6 Các điểm nhất quán khác đã kiểm, không lỗi

Importance ở bước 2 khớp `MEM` (8, 7, 4, 7). Ngày 05/11, 17/11, 01/11, 01/12 khớp giữa stepper, mô phỏng và eval. "Hai phiên cách nhau 12 ngày" đúng. Chỉ lệch chữ nhỏ: bước 2 và bước 4 viết "đã sửa bằng bản cập nhật 3.2", M6 viết "sửa bằng bản cập nhật 3.2".

## 3. Khái niệm cốt lõi còn thiếu

1. **[TRUNG BÌNH] Memory không thay hệ thống nguồn (system of record).** Ví dụ của trang lưu "gói Pro" và "kế toán trưởng" thành memory rút từ chat. Trong doanh nghiệp, gói dịch vụ nằm ở CRM hoặc hệ thống billing; agent nên gọi tool để lấy, còn memory chỉ nên giữ thứ không hệ thống nào có (sở thích, bối cảnh, chuyện đã xảy ra trong hội thoại). Đây là sai lầm thiết kế phổ biến nhất khi mới làm memory. Thêm một callout ngắn ở mục 1 hoặc mục 7, ghi rõ là nhận định của trang, link `../tool-calling-structured-output/`.
2. **[TRUNG BÌNH] Đường tấn công thứ ba: nội dung bên ngoài (indirect prompt injection).** Mục 8 nói "hai đường vào" (cài thẳng vào kho; chỉ chat). Nhưng bước 6 của stepper và câu tự kiểm tra 6 lại minh họa đường thứ ba: chữ ẩn trong PDF hoặc email. Sửa dòng 576 thành "ba đường vào" hoặc thêm một câu nối, và link `../prompt-injection-guardrails/` (thư mục đã có trong repo).
3. **[THẤP–TRUNG BÌNH] Lọc lúc đọc.** Đánh dấu hết hiệu lực chỉ có tác dụng khi bước truy hồi lọc theo nó. Ý này đang ẩn trong ô tick; nên nói thẳng một câu ở mục 4 hoặc mục 8 (xem 2.3).
4. **[THẤP] Phạm vi memory.** Khách là một công ty có nhiều người dùng: memory theo người (chị Lan), theo tổ chức (Hòa Bình), theo agent. Một câu ở thẻ "Bước 4" mục 2 về namespace nhiều cấp là đủ.
5. **[THẤP] Thứ tự trong một lượt.** Sơ đồ flow vẽ ghi trước, đọc sau. Trong một lượt thật, agent đọc memory để trả lời rồi mới ghi. Thêm một câu dưới hình: "Trong một lượt, bước 5–7 chạy trước; bước 1–3 chạy sau khi trả lời hoặc ở nền."

## 4. Sư phạm và tiếng Việt

- [TRUNG BÌNH] Ba callout cuối mục 8 (dòng 576–578) là ba đoạn văn rất dài, mỗi đoạn 100–130 chữ, khó đọc trên điện thoại. Tách "Cách phòng" thành danh sách 6 gạch đầu dòng; tách callout poisoning thành hai đoạn (OWASP nói gì; nghiên cứu cho thấy gì).
- [THẤP] Callout "Thử ba việc" (dòng 390) nên là `<ol>` ba mục thay vì một đoạn.
- [THẤP–TRUNG BÌNH] Mỗi dòng memory trong mô phỏng chỉ có thanh màu và tổng điểm; ba điểm thành phần chỉ nằm trong `aria-label`. Người học không tự kiểm được phép cộng. Thêm vào dòng `<small>`: "recency 0,21 · importance 0,83 · relevance 0,93".
- [THẤP] "động lực thời gian" (dòng 568, 587) là dịch sát chữ "temporal dynamics". Viết "diễn biến theo thời gian và quan hệ nhân quả kéo dài".
- [THẤP] Chữ "recall" mang ba nghĩa: chỉ số recall (mục 4, 9), "Recall storage" của MemGPT, và "nhớ lại". Thêm nửa câu ở thẻ từ điển `recall`: "khác với chỉ số recall dùng ở mục 4 và 9".
- [THẤP] Thẻ `reflexion` nằm trong nhóm "Đánh giá" (dòng 873); nên chuyển sang "Thao tác" hoặc "Loại memory".
- [THẤP] `simNote` in hệ số là "0,990" trong khi nút ghi "0,99" (dòng 822 dùng `vn(decay,3)`).
- [THẤP] "few-shot" (dòng 835) và "p95" chưa được giải thích; thêm link `../prompt-engineering/` hoặc một chú thích ngắn.
- Nhãn "minh họa" có đủ ở mục 3, 4, 9 và footer. Thuật ngữ "truy hồi", "hết hiệu lực", "chạy nền", "kho" dùng nhất quán. Câu văn nhìn chung ngắn và rõ.

## 5. JS, HTML và mobile

Kết quả đo (Chrome headless, bản sao tạm):

| Bề rộng | Tràn ngang | Chữ dưới 11px | Tương phản dưới 4,5:1 | Vùng bấm dưới 40px (trừ link trích dẫn và link trong câu) |
|---|---|---|---|---|
| 390, sáng và tối | Không | Không | Không | Không |
| 320, sáng và tối | Không | Không | Không | Không |
| 700, sáng và tối | Không (bảng eval cuộn trong `.table-wrap`, đúng thiết kế) | Không | Không | Có: mục lục 31px, nút theme và home 33px, chip 33px, link "Liên quan" 18px |
| 1280, sáng và tối | Không | Không (chữ SVG 12px co giãn ra trên 11px) | Không | Không áp dụng |

- [THẤP] Quy tắc `min-height:40px` chỉ nằm trong `@media (max-width:600px)` (dòng 190, 194). Điện thoại xoay ngang và máy tính bảng (601–1080px) vẫn là màn hình chạm, nhưng vùng bấm chỉ 18–33px. Chuyển các quy tắc vùng bấm sang `@media (max-width:1080px)` hoặc `@media (pointer:coarse)`.
- Stepper: bấm qua cả 7 bước ở 390px không gây tràn. Mô phỏng: đổi ba câu hỏi cho KPI đúng (1/2, 1/1, 1/1).
- Mọi truy cập localStorage nằm trong try/catch (dòng 7, 676–677). Checklist dùng prefix `agent-memory-`. Theme dùng key `rag-theme`.
- Tìm không dấu: hàm `fold` đúng (NFD, bỏ dấu kết hợp, đổi "đ"). 50 thẻ, mọi id "liên quan" đều tồn tại.
- [THẤP] Khi cả ba α = 0, mọi điểm bằng 0 và danh sách xếp theo id nhưng vẫn báo recall. Có thể hiện "Hãy đặt ít nhất một α lớn hơn 0".
- Không thấy lỗi cú pháp JS hay HTML. Tôi không chạy được `orca console`; việc "không có lỗi console" được suy ra từ chỗ mọi khối JS đều render ra kết quả đúng.

## 6. Sơ đồ

- Flow SVG (dòng 288–339): 7 hộp, 6 mũi tên trái sang phải, vòng "chạy nền" tự quay về hộp 4, vòng "lượt sau" đi từ hộp 7 về hộp 1; hướng mũi tên đúng nghĩa. Nhãn pha căn giữa đúng nhóm hộp. Chú thích màu khớp. [THẤP] Hộp 4 ghi "semantic · episodic", bản dọc ghi thêm "procedural"; nên thống nhất.
- Bản đồ quan hệ SVG (dòng 441–497): hướng mũi tên đúng (nền tảng vào trung tâm, trung tâm ra nơi dùng, hai chiều với eval và knowledge base, đứt nét sang rủi ro). Theo tọa độ thì nhãn không đè hộp.
- [TRUNG BÌNH] Bản dọc của bản đồ quan hệ (dòng 416–434): các mũi tên nằm giữa hai hộp kề nhau nên bị đọc sai chủ ngữ. "↓ được dùng trong" đứng ngay sau hộp Knowledge base, đọc thành "knowledge base được dùng trong AI Agent"; "↕ đo xem nhớ đúng không" đứng sau "Dùng ở đâu"; "↓ mặt trái" đứng sau "Eval memory". Sửa: ghi rõ chủ ngữ, ví dụ "↓ Agent memory được dùng trong", "↕ Agent memory được đo bằng", "↓ mặt trái của agent memory".
- Bản dọc của flow (dòng 260–285) khớp bản SVG về nội dung và thứ tự.

## 7. Danh sách ưu tiên

1. Sửa "9.000 token" thành mô tả đúng bộ dữ liệu của bài Mem0 (10 hội thoại, khoảng 26.000 token) ở dòng 519; bổ sung ở dòng 587 và 877. (1.1)
2. Đổi `last` của M3 thành 17/11 cho khớp bước 4, rồi cập nhật callout (2) và đề bài w1b. (2.2)
3. Sửa nhãn và lời khuyên của C8 thành "memory hết hiệu lực vẫn được nạp, cần lọc khi truy hồi"; sửa câu ở bước 5. (2.3)
4. Viết lại C4 và C5 để chỉ dùng memory có trong kho 9 memory. (2.4)
5. Định nghĩa "điểm J". (1.2)
6. Thêm hai ý còn thiếu: memory không thay hệ thống nguồn; nội dung bên ngoài là đường đầu độc thứ ba, link sang `../prompt-injection-guardrails/`. (mục 3)
7. Ghi rõ chủ ngữ cho mũi tên ở bản dọc của bản đồ quan hệ. (mục 6)
8. Tách các callout dài ở mục 8 thành danh sách; hiện ba điểm thành phần trong mô phỏng. (mục 4)
9. Gỡ trích [7] khỏi lời khuyên bảo mật; sửa các chỗ nói hơi quá (m = 10, "một lần gọi LLM", "70%", "phải xóa thật"). (1.3, 1.4)
10. Việc nhỏ: vùng bấm ở 601–1080px, "0,990", nhóm của thẻ Reflexion, "động lực thời gian", hộp 4 của flow. (mục 4, 5, 6)

## Giả định và điều chưa kiểm

- Chưa xem ảnh chụp màn hình; lỗi chữ đè hoặc cắt chữ trong SVG chỉ được loại trừ bằng tọa độ. Phiên chủ đề vẫn cần bước Orca như brief yêu cầu.
- Chưa kiểm console thật của trình duyệt.
- Ý về prompt caching (1.4) và ý "memory không thay hệ thống nguồn" (mục 3) là nhận định của tôi, không có nguồn đã mở; nếu đưa vào trang thì ghi là đề xuất của trang.
- Tôi nhớ là Zep từng công khai phản bác cách nhóm Mem0 cấu hình Zep trong benchmark này, nhưng **chưa kiểm**. Trang đã ghi "theo đo của nhóm Mem0" nên hiện đủ thận trọng.

## Kết quả áp dụng (phiên chủ đề, 2026-11-17)

Mỗi phát hiện được kiểm lại bằng nguồn hoặc bằng cách chạy lại mô phỏng trong Orca trước khi sửa.

### Đã sửa
- 1.1 [CAO] Đúng. Mở lại arxiv.org/html/2504.19413 mục 3.1: "10 extended conversations, each containing approximately 600 dialogues and 26000 tokens on average". Callout mục 7 giờ ghi 10 hội thoại khoảng 26.000 token [10] và bỏ trích [13]; thẻ LoCoMo mục 9 và thẻ từ điển `locomo` có thêm ý này.
- 1.2 Định nghĩa điểm J (LLM-as-a-Judge, theo mục 3.2 bài Mem0) ở callout mục 7, thẻ `fullctx` và câu tự kiểm tra 4; có link sang LLM evaluation.
- 1.3 Gỡ [7] khỏi các lời khuyên bảo mật; ghi rõ "nhận định/đề xuất của trang này"; [7] chỉ còn đứng sau ý mô tả namespace.
- 1.4 "10 tin, 10 memory" thành "trong thí nghiệm"; "một lần gọi LLM" thành "vài lần gọi LLM (trích xuất, rồi chọn thao tác)"; "70%" thành "bài báo lấy ví dụ 70%"; câu xóa dữ liệu thành "yêu cầu xóa hợp lệ… phải xóa thật". Bỏ qua ý prompt caching vì chưa có nguồn đã mở.
- 2.2 M3 có `last` = 17/11 (khớp bước 4). Chạy lại: câu 1 mặc định thì "chị Lan" 2,01 đứng trên "anh Minh" 1,97. Callout "Thử ba việc" đổi thành `<ol>` và viết lại ý (2). Bài tập w1b sửa đề có cả ô lọc. Kiểm bằng JS trên lưới α ∈ {0; 0,5; 1; 1,5; 2}, k = 2: không lọc 0 lời giải, có lọc 40 lời giải. Câu tự kiểm tra 5 sửa thành "14 ngày so với 26 ngày".
- 2.3 C8 có nhãn "Memory hết hiệu lực vẫn được nạp" và lời khuyên "lọc khi truy hồi". Bước 5 và cây chẩn đoán có thêm ý bước đọc phải lọc theo hiệu lực. KPI đổi nhãn "memory hết hiệu lực".
- 2.4 Chọn cách A: C4 ("khách liên hệ vào những ngày nào") và C5 ("từ khi lên gói Pro đã gặp vấn đề gì") giờ chỉ dùng M6, M7, M8. KPI giữ nguyên: 6/11, 8/9, 1 · 2 · 1, 1/2. Câu nhận xét C5/C7 viết lại.
- 2.5 Thêm câu "mở kho xem memory đã được ghi chưa trước khi kết luận lỗi truy hồi".
- Mục 3: thêm callout "Memory không thay hệ thống nguồn" (ghi là nhận định của trang, link Tool calling). Mục 8 đổi thành "ít nhất ba đường vào", có đường prompt injection gián tiếp và link sang `../prompt-injection-guardrails/`; thư mục này đã có và không nằm trong `exclude`. Thêm câu namespace nhiều cấp, và câu "trong một lượt, đọc trước rồi mới ghi" dưới hình flow.
- Mục 4: hai callout dài ở mục 8 được tách đoạn và thành danh sách; mỗi dòng mô phỏng hiện ba điểm thành phần. "Động lực thời gian" thành "diễn biến theo thời gian". Thẻ `recall` ghi rõ khác chỉ số recall. Thẻ Reflexion chuyển sang nhóm "Thao tác". "0,990" thành "0,99". Có giải thích few-shot và p95. Khi mọi α = 0 thì hiện thông báo.
- Mục 6: mũi tên ở bản dọc của bản đồ quan hệ ghi rõ chủ ngữ "agent memory …". Hộp 4 thống nhất "semantic, episodic…" ở cả SVG lẫn bản dọc.

### Bác bỏ
- Vùng bấm ở 601–1080px: giữ quy tắc `@media (max-width:600px)` như hệ thống thiết kế chung (rag/index.html, model-context-protocol/index.html). Brief đặt chuẩn mobile ở 390px, và ở 390px đã đạt 40px.

### Kiểm sau khi sửa (Orca, 390×844 và 1280×900, cả hai theme)
- console: 0 entry; scrollWidth bằng innerWidth; 0 chữ dưới 11px; 0 cặp tương phản dưới 4,5:1; 0 vùng bấm dưới 40px ở 390px (trừ link trích dẫn); 22/22 nguồn được trích, 0 `#src-N` hỏng.
- Đã xem ảnh chụp mobile của mọi mục, và ảnh desktop hai SVG ở cả hai theme: không chữ đè, mũi tên đúng, chú thích khớp màu.
