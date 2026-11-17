# Kongming review: tool-calling-structured-output

Ngày: 2026-11-17 · File: `tool-calling-structured-output/index.html` (962 dòng) · Chỉ tư vấn, không sửa file nào khác.

Lưu ý: file đổi trong lúc review (mtime 11:56:48 → 11:57:46, thêm link `../model-context-protocol/` ở dòng 436). Số dòng dưới đây theo trạng thái 11:57:46.

## Cách kiểm

- Đọc toàn bộ HTML/CSS/JS. Chạy script của trang trong Node với DOM giả để lấy kết quả `evalCall` cho 4 preset và cả 16 tổ hợp lớp, cùng các biến đếm của bảng eval.
- Mở lại bằng WebFetch hôm nay: [1], [4], [9], [10], [19]. Các nguồn còn lại chỉ đối chiếu với file ghi chú: **not verified** trực tiếp.
- **Không chạy trình duyệt.** Mọi nhận xét về 390px, tương phản, chữ đè là suy ra từ CSS và toạ độ SVG, chưa đo trên màn hình.

## Kết quả đã xác nhận đúng (không cần sửa)

**Bảng eval mục 9** (tính tay và bằng Node, khớp nhau):

| KPI | Giá trị | Ca |
|---|---|---|
| Quyết định gọi / không gọi đúng | 8/10 = 80% | sai: E4, E6 |
| Chọn đúng tool | 6/6 = 100% | E1, E2, E5, E7, E8, E9 |
| Tham số đúng | 4/6 = 67% | sai: E5, E9 |
| Biết không gọi | 2/4 = 50% | đúng: E3, E10; sai: E4, E6 |
| Đạt toàn phần | 6/10 = 60% | 8 lời gọi, mong đợi 6 |

Câu tự kiểm tra 6 ("100% chọn tool nhưng chỉ 50%") khớp số JS tính. Xem thêm phát hiện 3 về cách gọi tên nhóm 50%.

**Mô phỏng mục 4** (output Node):

| Preset | G2 | G3 | G4 | G5 | G6 | G7 | G8 | Lọt | Chặn | Nhờ strict | Hỏi khách |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Không lớp nào | lọt | lọt | lọt | lọt | lọt | lọt | lọt | 7/7 | 0 | 0 | 0 |
| Chỉ strict | ngăn | ngăn | lọt | lọt | lọt | lọt | lọt | 5/7 | 0 | 2 | 0 |
| Strict + validator | ngăn | ngăn | chặn@valid | chặn@valid | lọt | chặn@valid | lọt | 2/7 | 3 | 2 | 0 |
| Đủ 4 lớp | ngăn | ngăn | chặn@valid | chặn@valid | chặn@authz | chặn@valid | chặn@human | 0/7 | 5 | 2 | 2 (G8, G9) |

G1 và G9 luôn chạy. Câu "validator chạy trước nên khách không bị hỏi về lời gọi đằng nào cũng hỏng" đúng: chỉ bật `human` thì hỏi 5 lần, thêm `valid` còn 2 lần. Strict không ngăn G4 (cắt vì max_tokens) và G5 (chữ hoa enum), đúng theo ghi chú [8].

**Khác:** stepper bước 7 (5 lượt gọi model, 4 lời gọi tool, 1 timeout, 1 lần xác nhận) khớp nội dung các bước; ngày 12/11 → 17/11 = 5 ngày đúng. Từ điển 42 khái niệm, không trùng id, không có liên kết "Liên quan" hỏng, mọi số nguồn ≤ 21. Cả 21 nguồn đều được trích trong trang. `fold()` bỏ dấu đúng. Mọi thư mục `../<slug>/` được link đều tồn tại. Màu legend khớp màu ô ở cả SVG lẫn bản dọc; hướng mũi tên ở cả hai sơ đồ đúng nghĩa. Tên model "Claude Opus 5.5, Sonnet 5.5", lỗi 400 và "bỏ qua thinking" khớp [4] hôm nay. Tác giả [10] (Ken Aizawa, 2025) và [19] ("Erik S. and Barry Zhang", 2024) khớp byline.

## Phát hiện

### 1. Thông báo timeout khẳng định điều ứng dụng không biết — Trung bình/Cao
- **Vị trí:** dòng 751 (stepper bước 5), dòng 660 (tự kiểm tra 5).
- **Vấn đề:** lỗi trả về model ghi "Phiếu CHƯA được tạo". Ngay sau đó dòng 753 nói "Nếu lần trước thật ra đã tạo phiếu nhưng mất phản hồi". Hai câu mâu thuẫn. Timeout nghĩa là trạng thái **chưa rõ**; đó chính là lý do cần idempotency key.
- **Bằng chứng:** [21] "if a connection error occurs, you can safely repeat the request without risk of creating a second object".
- **Sửa:** đổi thành "Chưa xác nhận được phiếu đã tạo hay chưa. Gọi lại một lần với cùng tham số là an toàn (hệ thống chống tạo trùng)". Sửa câu ví dụ ở dòng 660 tương tự.

### 2. Ca eval E5, E9 mâu thuẫn với chính mô tả tool — Trung bình
- **Vị trí:** dòng 923, 927; so với dòng 251 và 761.
- **Vấn đề:** mô tả tool ghi "Chỉ dùng sau khi đã tra đơn bằng orders_get_order"; bước 7 ghi "mong đợi tra đơn trước, rồi tạo phiếu". Nhưng E5 và E9 lại mong đợi gọi thẳng `returns_create_ticket` từ tin nhắn đầu. E9 còn thiếu `item_sku` (khách chỉ nói "tai nghe"), và đơn SM-48213 ở bước 3 không có tai nghe.
- **Hệ quả:** người học rút ra bài sai về cách viết đáp án eval; KPI "100% chọn tool" dựa trên đáp án không nhất quán.
- **Sửa (giữ nguyên mọi KPI):** ghi rõ hai ca này là lượt thứ hai, ví dụ thêm "(đã tra đơn ở lượt trước)" vào tin nhắn, và đổi E9 sang một món có trong đơn hoặc một mã đơn khác.

### 3. KPI "relevance" gộp hai loại ca khác nhau — Trung bình
- **Vị trí:** dòng 943 (nhãn "Biết không gọi (relevance)"), dòng 662, dòng 924.
- **Vấn đề:** [20] định nghĩa relevance detection là "none of the provided functions are relevant". E6 ("Đổi giúp tôi cái máy") có tool phù hợp, chỉ thiếu tham số; đó là ca **thiếu thông tin, cần hỏi lại**. Lộ trình tuần 2 (dòng 642) lại tách riêng hai loại này.
- **Bằng chứng:** nếu chỉ tính ca không liên quan (E3, E4, E10) thì là 2/3 = 67%, không phải 50%.
- **Sửa:** đổi nhãn thành "Biết không gọi (không liên quan hoặc thiếu thông tin)" và sửa câu ở dòng 662 thành "chỉ 50% ở các ca không nên gọi"; hoặc tách thành hai KPI.

### 4. Ô Gemini "Không kiểm trong nguồn của trang này" — Trung bình
- **Vị trí:** dòng 538, 541.
- **Vấn đề:** với hàng "Ép gọi đúng một tool cụ thể", chính nguồn [9] có ví dụ: object `allowed_tools` gồm `"mode": "any"` và `"tools": ["get_current_temperature"]` (WebFetch hôm nay). Ô này điền được. Ngoài ra câu chữ hiện tại là ghi chú nội bộ, không phải nội dung cho người học.
- **Sửa:** điền hàng 538 sau khi tự mở lại [9] để lấy đúng cú pháp. Hàng 541 (tắt song song): tôi không thấy trong phần đã đọc, **not verified**; ghi "chưa đối chiếu" hoặc bỏ ô.

### 5. Bước 6 của stepper gắn nhãn sai bên nói — Thấp/Trung bình
- **Vị trí:** dòng 757.
- **Vấn đề:** khối JSON tóm tắt CRM là đầu ra của **model**, nhưng gắn nhãn "ỨNG DỤNG" (màu xanh dương). Trang đang dạy "ai làm gì" bằng chính các nhãn này.
- **Sửa:** tách hai khối: ỨNG DỤNG "gửi lượt riêng kèm JSON schema" → MODEL "trả về" + JSON.

### 6. Khóa idempotency được dùng lại giữa call_C và call_D mà không nói cách nhận ra — Thấp/Trung bình
- **Vị trí:** dòng 747, 753, 761 ("1 lần khách xác nhận").
- **Vấn đề:** call_D là một lời gọi mới do model sinh. Trang không nói ứng dụng dựa vào đâu để biết nó là lần thử lại của call_C (để dùng lại khóa và không hỏi khách lần hai).
- **Sửa:** thêm một câu: khóa gắn với thao tác đã được khách duyệt (hội thoại + tool + tham số giống hệt), nên lời gọi lại cùng tham số dùng chung khóa và chung lần xác nhận.

### 7. Thiếu khái niệm cốt lõi — Trung bình (chọn 1–3 mục đầu)
1. **Khi có nhiều hơn ~20 tool:** trang chỉ nói "giữ ít tool". Doanh nghiệp thường có hàng chục tool. Cần một câu về nạp tool theo nhu cầu (tool search, `defer_loading`); [4] có nhắc cả hai. Cần mở trang tool search để trích trước khi viết.
2. **Structured output trong RAG:** mục tiêu người học là RAG, nhưng trang không có link `../rag/` và không có ví dụ câu trả lời kèm trích dẫn theo schema. Thêm một ví dụ ngắn và link.
3. **Chi phí của vòng lặp:** mỗi vòng gửi lại toàn bộ hội thoại và kết quả tool, không chỉ định nghĩa tool. Bước 1 mới nói về định nghĩa tool. Thêm một câu, link `../context-engineering/`.
4. **Giới hạn tool theo từng bước:** "Allowed tools" của OpenAI đã có trong ghi chú [1] nhưng chưa dùng; nó là cách thực hiện "tool tối thiểu" theo ngữ cảnh. Tuỳ chọn.

### 8. Khẳng định mạnh hơn nguồn — Thấp
- **Dòng 854:** "Mặc định bật ở OpenAI". Trang [1] không ghi giá trị mặc định (WebFetch hôm nay), chỉ nói model có thể gọi nhiều hàm và tắt được. Sửa: "OpenAI và Claude đều có thể gọi nhiều tool trong một lượt trừ khi bạn tắt"; với Claude giữ "mặc định bật" theo [6].
- **Dòng 617:** "chạy thật nên làm trên sandbox [19]". Câu gốc nói về agent tự chủ nói chung ("We recommend extensive testing in sandboxed environments"), không nói về chấm eval. Giữ được, nhưng viết như suy luận của trang và thêm câu trích vào file ghi chú (hiện chưa có).
- **Dòng 858:** "Một bước đi trước của tool calling ngày nay" là nhận định của trang, không có trong [17]. Bỏ hoặc viết "một nghiên cứu sớm theo hướng này".
- **Dòng 738:** "Model chưa gọi returns_create_ticket, **vì** mô tả tool ghi rõ…". Quan hệ nhân quả không kiểm được; đổi thành "đúng như mô tả tool yêu cầu".
- **Dòng 563:** [16] là preprint và kết luận có tranh luận (theo trí nhớ của tôi, **not verified** hôm nay). Trang đã viết "có thể"; nên thêm "theo một preprint 2024".

### 9. Mô phỏng: nhãn và trích dẫn — Thấp
- **Dòng 832–837:** khi strict ngăn G2/G3, thẻ vẫn hiện JSON lỗi (`"quantity": "1"`) dưới nhãn xanh "✓ Đúng". Dễ hiểu nhầm là lời gọi đó đúng. Sửa: nhãn "✓ Không xảy ra" cho trường hợp này; legend tách hai nghĩa.
- **Dòng 837:** chuỗi hiển thị thành "Chặn ở · Validator trong ứng dụng:". Bỏ dấu "·", viết "Chặn ở lớp: Validator trong ứng dụng".
- **Dòng 834:** khi bị chặn, trích dẫn lấy theo lớp. G5 bị chặn ở validator hiện [2][9], nhưng ý "so không phân biệt hoa thường" là của [8]. Sửa: gộp `c.src` với nguồn của lớp.
- **Dòng 397:** "(G6, G8) chỉ bị chặn bởi phân quyền hoặc bởi người xác nhận". G6 là lời gọi đọc nên người xác nhận không bao giờ thấy nó: mọi tổ hợp thiếu `authz` đều lọt G6 (output Node). Sửa: "G6 chỉ bị chặn bởi phân quyền; G8 bởi phân quyền hoặc người xác nhận".

### 10. Số bước của flow và stepper đụng nhau — Thấp
- **Vị trí:** flow có 6 bước (dòng 291–310), stepper có 7 "Bước" (dòng 731–761); dòng 748 "Bước 5 cho thấy…".
- **Vấn đề:** "bước 5" ở flow là "gửi kết quả", ở stepper là "tool lỗi". Bản dọc còn có câu "nhảy tới bước 5".
- **Sửa:** đổi nhãn stepper thành "Cảnh 1…7", hoặc ghi kèm "(flow bước 3–5)".

### 11. Mobile 390px và sơ đồ (suy từ mã, chưa đo) — Thấp
- **Link trong chữ ở `.vflow .node span` và đoạn văn** (dòng 418–442, 225): cao khoảng 25px, dưới 40px. Trang mẫu có thể cũng vậy; nếu muốn đạt chuẩn thì thêm `padding:10px 2px` như `.term .rel a`.
- **Stepper:** bấm "Tiếp →" ở cuối một bước dài thì nội dung đổi nhưng không cuộn về đầu bước. Cần thử trên máy; nếu đúng, gọi `scrollIntoView` cho `#stepBody` khi chuyển bước bằng nút.
- **SVG quan hệ, dòng 494:** "excessive agency · đầu ra không kiểm" dài 37 ký tự, cỡ 12 trong ô rộng 240. Sát mép; cần xem ảnh chụp ở 1081–1280px.
- **Bản dọc quan hệ, dòng 440:** "↓ mặt trái" nằm sau ô "DÙNG Ở ĐÂU", nên đọc thành "nơi dùng → rủi ro"; bản desktop là "trung tâm → rủi ro". Chấp nhận được; có thể đổi chữ thành "mặt trái của tool calling".
- Không thấy lỗi tràn ngang, chữ dưới 11px, hay vùng bấm của nút dưới 40px trong CSS. Tương phản tính nhẩm các cặp màu chính đều trên 4.5:1, chưa đo bằng công cụ.

### 12. Tiếng Việt và thuật ngữ — Thấp
- **Dòng 863:** "kiểu hợp với null" khó hiểu. Sửa: "kiểu cho phép null (union với `null`)".
- Ba cách gọi cho một thứ: "idempotency key" (dòng 604, 885), "khóa idempotency" (dòng 748), "khóa chống lặp" (dòng 885). Chọn "idempotency key", giải thích một lần.
- **Dòng 544:** chỉ nêu hai model trong sáu model mà [4] liệt kê. Danh sách này đổi nhanh; nên viết "tại 2026-11-17" ngay trong câu.

## Câu hỏi còn mở
- Gemini có tham số tắt gọi song song không? Chưa thấy trong phần đã đọc của [9].
- Hành vi cuộn của stepper và độ vừa của chữ trong SVG quan hệ cần ảnh chụp Orca để chốt.

## Kết quả áp dụng (phiên chủ đề, 2026-11-17)

Mỗi phát hiện được kiểm lại bằng nguồn hoặc bằng Orca trước khi sửa.

| # | Kết quả | Ghi chú |
|---|---|---|
| 1 | Sửa | Lỗi timeout nay ghi "Chưa rõ phiếu đã được tạo hay chưa… gọi lại với cùng tham số là an toàn"; sửa cả câu tự kiểm tra 5. |
| 2 | Sửa | E5, E9 ghi "(Lượt 2, đã tra đơn)"; E9 đổi sang bộ sạc SAC-65W có trong đơn; thêm câu giải thích dưới bảng. KPI không đổi. |
| 3 | Sửa | Nhãn KPI "Biết không gọi (không có tool phù hợp, hoặc thiếu thông tin)"; câu 6 viết lại; ghi chú tách E3/E4/E10 (2/3) và E6. |
| 4 | Sửa | Mở lại [9]: ô Gemini điền `allowed_tools` với `mode: "any"` + danh sách `tools`; ô tắt song song ghi "Tài liệu Gemini không nêu tham số này". Ghi bằng chứng vào file ghi chú. |
| 5 | Sửa | Bước 6 tách hai khối: ỨNG DỤNG gửi lượt kèm schema, MODEL trả JSON. |
| 6 | Sửa | Thêm câu: call_D cùng tool và tham số với thao tác đã duyệt nên được coi là lần thử lại, dùng chung khóa và không hỏi khách lần hai. |
| 7 | Sửa 3/4 | Thêm tool search [3][4] vào thẻ "Ít tool"; thêm gạch đầu dòng RAG + link `../rag/` + giới hạn Citations/JSON outputs [8]; thêm câu chi phí mỗi vòng [3] + link `../context-engineering/` ở bước 7. Không thêm "Allowed tools" (tùy chọn, trang đã đủ dài). |
| 8 | Sửa | Từ điển "Gọi song song" viết lại theo [1]/[6]; câu sandbox viết như suy luận của trang, có câu trích [19] trong ghi chú; Toolformer "một nghiên cứu sớm theo hướng này"; bước 2 bỏ "vì"; [16] ghi "preprint năm 2024". |
| 9 | Sửa | Nhãn "✓ Không xảy ra" cho ca strict ngăn, legend tách nghĩa; "Chặn ở lớp: …"; trích dẫn gộp nguồn của ca và của lớp (G5 nay có [8]); callout tách G6 (chỉ phân quyền) và G8. Đã chạy lại 4 preset trong Orca: 7/7, 5/7, 2/7, 0/7 lọt; 2 lần hỏi khách ở preset đủ 4 lớp. |
| 10 | Sửa một phần | Đổi tham chiếu chéo "Bước 5 cho thấy" thành "Bước ví dụ tiếp theo". Giữ nhãn "Bước N" trong stepper: stepper là ví dụ riêng, có tiêu đề riêng, đổi tên toàn bộ không đáng. |
| 11 | Sửa một phần | Stepper: nút Trước/Tiếp cuộn về đầu bước khi đầu bước đã trôi khỏi màn hình (Orca: top −700 → 80). Bản dọc: "↓ mặt trái của tool calling". Link trong đoạn văn: bác bỏ, liên kết inline trong văn bản dùng chung quy ước với các trang đã publish. SVG quan hệ: ảnh chụp 1280px cho thấy chữ "excessive agency · đầu ra không kiểm" nằm gọn trong ô. Đo bằng Orca: chữ nhỏ nhất ≥ 11px, thân bài ≥ 15px, scrollWidth = innerWidth ở 390, tương phản ≥ 4,5:1 cả hai theme. |
| 12 | Sửa | "kiểu cho phép null (union với null)"; thống nhất "idempotency key"; câu model Claude ghi "Tại thời điểm 2026-11-17". |
