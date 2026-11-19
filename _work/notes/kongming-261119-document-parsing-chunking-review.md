# Kongming review: document-parsing-chunking/index.html

Ngày review: 2026-11-19. Model: Fable 5.2. Chỉ tư vấn, không sửa file trang.

**Trạng thái file:** trang bị sửa một lần trong lúc review (mtime 10:07:30 → 10:08:37, 138.246 → 138.299 byte, vẫn 1226 dòng). Mọi số dòng và chuỗi trích dưới đây đã được grep lại trên bản 10:08:37; các phép đo trình duyệt chạy trên bản sao của đúng bản đó.

**Cách kiểm:**
- Đọc toàn bộ trang và file ghi chú nguồn.
- Tải 30 nguồn bằng `curl` (đều HTTP 200) và grep câu gốc cho các số và khẳng định chính.
- Chép nguyên JS của sân chơi chunker sang Node, chạy đủ 4 chiến lược × 21 cỡ × 13 mức overlap × 4 câu hỏi.
- Chạy headless Chrome trong iframe 390, 360 và 768px để đo tràn ngang, và chụp hai SVG ở 1280px cùng `.vflow` ở 390px.
- Chưa kiểm: Safari/iOS thật, trình đọc màn hình, và nội dung đầy đủ của bài báo [22] [23] [26] [32] [35] (chỉ đọc abstract).

## Kết luận ngắn

Không có lỗi sai số liệu nào trong các số được yêu cầu kiểm. Có một lỗi tràn ngang trên điện thoại (phát hiện 1) nên sửa trước khi phát hành, và bốn lỗi mức trung bình đáng sửa cùng đợt (2–5). Phần còn lại là chỉnh nhỏ.

Các số đã khớp nguồn: Contextual Retrieval 35/49/67% và $1,02; OCR chậm khoảng 1000 lần; Claude 1.500–3.000 token chữ + tối đa 1.568 token ảnh; Gemini ~560 token/trang ở mức mặc định của Gemini 3 và 4; OmniDocBench 72,83 (Research Report) và 9,54 (Notes) cùng thuộc hàng DocLayout-YOLO; Azure không phân tích bảng XLSX; Azure 3.000 ký tự = 1 đơn vị trang; kết quả Chroma; license Marker; các câu của Microsoft, Unstructured, Textract, Docling, PyMuPDF, pdfplumber, LangChain, Pinecone, Azure AI Search.

Các số của sân chơi đã tính lại và khớp: "Cố định" cỡ 200 → 5 chunk (197, 198, 196, 197, 55 ký tự) = 50+50+49+50+14 = 213 token; overlap 40 → 6 chunk, 261 token; cả bốn gợi ý trong callout mục 7 đều đúng; "Cha–con" đủ ý ở cả 4 câu tại mọi cỡ. Không có vòng lặp vô hạn ở bất kỳ tổ hợp nào. Không có `innerHTML` nào nhận dữ liệu ngoài hằng số trong file (ô tìm kiếm chỉ dùng để lọc), nên không có rủi ro XSS.

## Phát hiện

### 1. Demo thứ tự đọc làm cả trang tràn ngang trên điện thoại — cao
- **Vị trí:** CSS dòng 175 (`.ro{grid-template-columns:1fr}`), 177 (`.pm-blk` padding trái 34px), 181 (`.pm-line{white-space:nowrap}`); phần tử `#roPage`, `#roOut`, `#roNote` trong `#parsing`.
- **Bằng chứng:** `1fr` cho phép cột lưới nở theo nội dung. Hai cột chữ không xuống dòng cần 376px, cộng lề trái 16px thành 392px. Đo được `scrollWidth` 392 ở cả iframe 390 và 360px; cạnh phải của `.pagemock` và `.ro-out` nằm ở 392 trong khi cột nội dung kết thúc ở 374. Trên máy 390px trang lệch ngang 2px và ba khối dính sát mép; trên máy 375px tràn 17px, 360px tràn 32px. Ở 768px không tràn.
- **Sửa:** thêm `@media (max-width:820px){.ro{grid-template-columns:minmax(0,1fr)}}` và `@media (max-width:600px){.pm-cols .pm-blk{padding:30px 6px 6px 6px}.pagemock{padding:8px}}` (huy hiệu số nằm phía trên chữ). Đã thử trên bản sao: hết tràn ở 390 và 360px, dòng chữ vẫn vừa cột (145/157 và 130/142px).

### 2. Regex lookbehind có thể làm chết toàn bộ script trên iOS cũ — trung bình
- **Vị trí:** JS dòng 1044, `function sentences(body){return body.split(/(?<=\.)\s+/)}`.
- **Bằng chứng:** đây là trang duy nhất của site dùng lookbehind (grep `(?<=` trên mọi `index.html` chỉ ra file này). Theo hiểu biết của tôi, Safari chỉ hỗ trợ lookbehind từ 16.4; ở bản cũ hơn đây là lỗi cú pháp lúc parse, nên cả khối `<script>` không chạy: không stepper, không mô phỏng, không từ điển, không đổi giao diện. Chưa thử trên thiết bị thật.
- **Sửa:** thay bằng cách không cần lookbehind, ví dụ `return body.replace(/\.\s+/g,'.\n').split('\n')`. Văn bản mẫu không có dấu chấm nào đứng trước khoảng trắng ở giữa câu ("23:00." đứng cuối câu), nên kết quả giống hệt.

### 3. Overlap lớn hơn hoặc gần bằng cỡ chunk cho kết quả sai lệch — trung bình
- **Vị trí:** `cutFixed` dòng 1036; thanh trượt `#simOv` (0–120) và `#simSize` (100–500).
- **Bằng chứng:** cỡ 100 với overlap 110 hoặc 120 rơi vào nhánh `if(ns<=start)ns=end`, nên chạy như không có overlap (9 chunk, 213 token, giống hệt "Cố định") trong khi nhãn vẫn ghi "Overlap: 120 ký tự". Cỡ 100 với overlap 90 ra 69 chunk, 1.720 token, độ phình 8,00×; cỡ 120 với overlap 110 ra 68 chunk, 9,49×. Người học kéo hết thanh trượt sẽ thấy overlap lớn nhất "không tốn gì".
- **Sửa:** giới hạn overlap hiệu dụng ở tối đa nửa cỡ chunk (`var ov=Math.min(sim.ov,Math.floor(sim.size/2))`), hiển thị giá trị đã giới hạn kèm ghi chú "(tối đa bằng nửa cỡ chunk)", hoặc đặt `ovEl.max` theo cỡ mỗi lần render.

### 4. Sơ đồ flow cho nhánh Office đi qua "Phân tích bố cục" — trung bình
- **Vị trí:** `#flow`, SVG dòng 359–361 (ba mũi tên vào ô "Phân tích bố cục") và `.vflow` dòng 303 ("cả ba nhánh gộp lại").
- **Bằng chứng:** chính trang nói ngược lại ở bước 5 của stepper ("File .docx đã có cấu trúc: heading được đánh dấu bằng style") và ở mục 4 định nghĩa layout analysis là "dùng model để nhận ra vai trò của từng khối trên trang". Word và Excel đọc thẳng thì không qua model bố cục; chỉ khi đổi sang PDF mới cần. Ngoài ra, với bản scan, nhiều công cụ nhận diện bố cục trên ảnh cùng lúc hoặc trước khi OCR, không phải sau.
- **Sửa:** cho nhánh Office đi thẳng tới "Tài liệu có cấu trúc" (mũi tên riêng, nhãn "cấu trúc có sẵn trong file"), chỉ hai nhánh PDF đi qua "Phân tích bố cục". Nếu muốn giữ hình đơn giản thì đổi tên ô thành "Xác định cấu trúc" với dòng phụ "PDF/ảnh: model bố cục · Office: style có sẵn". Sửa cả SVG lẫn `.vflow`. Hai bản hiện nhất quán với nhau, và ảnh chụp 1280px không có nhãn nào đè lên mũi tên.

### 5. Câu "Tiếng Việt thường tốn nhiều token hơn tiếng Anh" không có trong nguồn được dẫn — trung bình
- **Vị trí:** `#chunking` dòng 521, dẫn [35].
- **Bằng chứng:** abstract của Petrov và cộng sự chỉ nói chênh lệch giữa các ngôn ngữ "up to 15 times in some cases"; không có chữ "Vietnamese". File ghi chú nguồn cũng tự ghi "no source claims it for Vietnamese". Bản HTML toàn văn trên arXiv không tải được nên chưa kiểm phần thân bài.
- **Sửa:** viết lại thành điều nguồn nói: "Cùng một nội dung, số token thay đổi mạnh theo ngôn ngữ, có cặp chênh tới 15 lần [35]. Hãy đếm token trên chính văn bản tiếng Việt của bạn bằng tokenizer của embedding model." Nếu muốn giữ câu về tiếng Việt thì cần một nguồn nêu rõ điều đó.

### 6. "Chậm hơn khoảng 100 lần" gán sai phép so sánh — thấp/trung bình
- **Vị trí:** `#so-sanh` dòng 710.
- **Bằng chứng:** nguồn [8] viết "the `fast` strategy is roughly 100x faster than leading image-to-text models". Trang viết "chế độ dùng model chậm hơn chế độ theo luật khoảng 100 lần", tức so `fast` với `hi_res` của chính Unstructured; nguồn không nói vậy.
- **Sửa:** "Unstructured ghi chế độ fast nhanh hơn khoảng 100 lần so với các model image-to-text hàng đầu."

### 7. Thiếu đoạn giới thiệu LLM/VLM parsing trong phần Parsing — trung bình
- **Vị trí:** `#parsing` (mục 4). VLM chỉ xuất hiện ở bảng mục 11, bản đồ mục 10 và từ điển.
- **Bằng chứng:** phạm vi chủ đề liệt kê LLM/VLM parsing là một nhóm công cụ chính. Người đọc gặp "VLM" lần đầu trong sơ đồ mục 10 ("text layer · OCR · VLM") mà chưa có lời giải thích nào trước đó.
- **Sửa:** thêm một thẻ ngắn cuối mục 4: VLM đọc ảnh trang và viết lại thành Markdown; mạnh ở trang nhiều hình và bố cục lạ; đầu ra là văn bản do model sinh nên có thể thiếu hoặc thêm chữ, cần đối chiếu; tính token theo trang (trỏ sang mục 13). Nội dung này đã có sẵn ở dòng 712, chỉ cần đưa lên sớm hơn.

### 8. Thiếu nội dung riêng cho OCR tiếng Việt — trung bình
- **Vị trí:** `#parsing`, `#loi`.
- **Bằng chứng:** người học làm RAG trên hợp đồng và chính sách tiếng Việt, nhưng trang chỉ nhắc "lỗi dấu tiếng Việt" một lần ở bảng lỗi (dòng 753) và gán cho lớp chữ hỏng. Không có chỗ nào nói OCR phải được cấu hình đúng ngôn ngữ, hay dấu thanh là chỗ OCR hay sai.
- **Sửa:** thêm 2–3 câu có nguồn: bộ OCR cần gói ngôn ngữ tiếng Việt (tài liệu PyMuPDF/Tesseract về tham số ngôn ngữ; Unstructured có tùy chọn "OCR Languages" trong chính trang [7]); đưa trang có dấu, con dấu đỏ và chữ ký đè lên chữ vào bộ 20–50 trang đo ở mục 13. Hai ý sau là kinh nghiệm thực tế, cần ghi là gợi ý kiểm tra nếu không tìm được nguồn.

### 9. Trích dẫn [17] [27] cho file hash rộng hơn điều nguồn nói — thấp
- **Vị trí:** `#metadata` dòng 565; tự kiểm tra câu 6 dòng 826.
- **Bằng chứng:** [17] nói về ID của chunk ("An ID can be a hash of some key field"); [27] băm nội dung và metadata của từng document đưa vào index. Không nguồn nào mô tả băm byte của file để bỏ qua bước parse. Thẻ "Bỏ trùng, tái dùng" (dòng 578) đã ghi đúng phạm vi.
- **Sửa:** ở hai chỗ trên ghi rõ đây là thiết kế ví dụ áp dụng cùng ý tưởng ở mức file, ví dụ "cùng ý tưởng với hash chunk của Microsoft [17] và LangChain [27]".

### 10. Số của Contextual Retrieval thiếu mốc tuyệt đối — thấp
- **Vị trí:** `#chunking` dòng 511; `#danh-gia` dòng 787.
- **Bằng chứng:** nguồn ghi 5,7% → 3,7% → 2,9% → 1,9%. "Giảm 35% số lần tìm trượt" dễ bị đọc thành 35 điểm phần trăm. "49% khi thêm BM25" thực ra là thêm Contextual BM25. Con số $1,02 dựa trên giả định chunk 800 token, tài liệu 8.000 token và giá model năm 2024.
- **Sửa:** viết "giảm tỷ lệ tìm trượt top-20 từ 5,7% xuống 3,7% (giảm 35%), xuống 2,9% khi thêm Contextual BM25, xuống 1,9% khi thêm reranking", và thêm "(theo giá và giả định năm 2024)" sau $1,02.

### 11. "Theo tiêu đề" tạo chunk vượt "cỡ chunk tối đa" — thấp
- **Vị trí:** `build()` nhánh heading, dòng 1053.
- **Bằng chứng:** tiền tố đường dẫn tiêu đề dài 44–53 ký tự và một câu không bao giờ bị chia. Ở cỡ 100 có 8 trên 11 chunk vượt cỡ, lớn nhất 151 ký tự; ở 120 và 140 có 3 chunk vượt. Từ 240 đến 500 kết quả không đổi (5 chunk, 247 token), nên thanh trượt trông như hỏng.
- **Sửa:** khi chiến lược là "Theo tiêu đề", hiện ghi chú cạnh thanh trượt: "một câu không bị cắt, nên chunk có thể dài hơn cỡ đặt; từ 240 trở lên mỗi mục là một chunk".

### 12. "Cha–con" hiển thị độ phình 0,86× và ít token embed hơn "Cố định" — thấp
- **Vị trí:** `renderSim()` dòng 1105–1113.
- **Bằng chứng:** chunk con chỉ lấy thân mục, bỏ tiêu đề trang và tiêu đề mục, nên tổng 185–186 token so với 213 của "Cố định". Người học sẽ kết luận cha–con rẻ hơn khi nạp, trái với cột "Yếu" ở bảng mục 6 ("phải lưu hai tầng").
- **Sửa:** với cha–con, đổi ô thống kê thành "token embed (con) ~186 · token lưu thêm cho cha ~227", hoặc thêm một dòng ghi chú rằng chunk con không gồm tiêu đề và tầng cha phải lưu riêng.

### 13. Demo thứ tự đọc chỉ tô đỏ 2 trên 7 dòng bị trộn — thấp
- **Vị trí:** `renderRO()` dòng 999, biến `badL`.
- **Bằng chứng:** ở chế độ đọc thô, cả 6 dòng từ 3 đến 8 đều ghép chữ của hai cột (ví dụ dòng 3 "5.1 Bên A thanh toán 5.3 Phí năm đầu là"), nhưng chỉ dòng 5 và 6 có màu đỏ. Thứ tự và nội dung đầu ra của cả hai chế độ đã kiểm và đúng.
- **Sửa:** tô nhạt mọi dòng ghép hai cột và giữ màu đậm cho hai dòng ví dụ, hoặc sửa lời chú thành "ví dụ rõ nhất là dòng 5 và 6".

### 14. Thuật ngữ dùng trước khi giải thích — thấp
- **Vị trí:** `#chunking` dòng 506–511.
- **Bằng chứng:** "IoU", "recall", "BM25", "reranking" xuất hiện trong bảng mục 6; IoU chỉ được giải thích ở mục 13 và từ điển. Bảng lỗi mục 12 dùng "top-k" mà không chú giải.
- **Sửa:** thêm chú giải trong ngoặc ở lần đầu, ví dụ "IoU (tỷ lệ chữ liên quan trên tổng chữ lấy ra)", và link "BM25" sang `../hybrid-search/`.

### 15. Chi tiết nhỏ trong ví dụ — thấp
- **Bảng Excel mục 5 (dòng 460–464):** tiêu đề ghi "dòng 2–8" nhưng chỉ hiện 3 hàng, trong khi bước 6 của stepper có "… 4 dòng nữa …". Thêm dòng đó vào mục 5.
- **Độ tin cậy OCR (stepper bước 3):** bảng dùng thang 0–1 (0,97; 0,61) rồi dẫn Textract, mà ví dụ của Textract dùng thang 0–100 (`"Confidence": 57.17`). Đổi sang 97 và 61, hoặc ghi "thang điểm tùy công cụ".
- **Gợi ý ô tìm từ điển (dòng 589):** gõ "bang" ra 17 thẻ vì "bằng" cũng gập thành "bang". Đổi ví dụ thành "teds" hoặc "tieu de".
- **Lặp nội bộ:** câu "hash byte chỉ bắt file giống hệt" xuất hiện ba lần (stepper bước 2, thẻ mục 8, tự kiểm tra câu 6). Giữ ở mục 8 và câu tự kiểm tra, rút gọn ở stepper.
- **Trùng với knowledge-base/:** trang đó đã nói nhiều về hash và khử trùng (22 lần nhắc). Trang này đã trỏ sang đó cho phần đồng bộ; mức lặp chấp nhận được. Chưa đối chiếu từng câu.

### 16. Bản đồ quan hệ: hai khác biệt nhỏ giữa desktop và mobile — thấp
- **Vị trí:** `#quan-he`, SVG dòng 628–681 và `.vflow` dòng 599–626.
- **Bằng chứng:** hướng và nhãn của cả 15 mũi tên trên SVG đã kiểm theo tọa độ và ảnh chụp, đều đúng nghĩa; không nhãn nào đè lên đường. Bản mobile không có ô "Bỏ trùng" (chỉ là một dòng ghi chú) và không có quan hệ "vị trí → trang, mục" từ phần tử sang metadata. Cả hai bản đều thiếu cạnh cho thấy embedding model cũng là thứ tạo vector ở bước "embed + lưu".
- **Sửa:** ở `.vflow`, sửa dòng phụ của ô Chunk thành "+ metadata (trang, mục lấy từ vị trí phần tử; hash; quyền)". Không bắt buộc sửa SVG.

### 17. Accessibility — thấp
- **Vị trí:** `#roBtns`, `#simStrat`, `#simQ`, `#glossChips`, stepper.
- **Bằng chứng:** các nút chuyển trạng thái chỉ đổi class `on`, không có `aria-pressed`; `#simVerdict` và `#stepBody` không có `aria-live` nên trình đọc màn hình không biết kết quả đã đổi (`#roOut` thì có). Thanh trượt có `aria-label`. Ở 390px các nút và chip đạt 40px; link trong câu văn cao 20px như mọi trang khác.
- **Sửa:** đặt `aria-pressed` trong các vòng `classList.toggle('on', …)`; thêm `aria-live="polite"` cho `#simVerdict` và `#stepBody`.

## Ghi chú ngoài phạm vi

Trang gốc `index.html` của site chưa có link tới `document-parsing-chunking/`. Có thể đó là bước phát hành sau, tôi chỉ ghi lại.

## Kết quả áp dụng

Ngày áp dụng: 2026-11-19. Tôi kiểm lại từng phát hiện trên mã nguồn và trình duyệt (Orca, 360/375/390 có `--mobile` và 1280), rồi mới sửa. Phép đo của tôi trước khi sửa (Orca, 390px) không thấy tràn, nhưng lưới `1fr` cho phép cột nở theo dòng chữ `nowrap`, và phép đo trong iframe của review là bằng chứng cụ thể, nên vẫn sửa.

| # | Kết quả | Việc đã làm / lý do |
|---|---|---|
| 1 | Đã sửa | `.ro` dùng `minmax(0,1fr)` ở ≤820px; ≤600px: `.pagemock` padding 8px, `.pm-cols .pm-blk` padding 30px 6px 6px (huy hiệu nằm trên chữ). Sau sửa: `scrollWidth` = `innerWidth` ở 360, 375, 390; `#roPage` và `#roOut` nằm trong 16–344px ở 360px. |
| 2 | Đã sửa | `sentences()` dùng `replace(/\.\s+/g,'.\n').split('\n')`; không còn `(?<=` trong trang. Chạy lại 32 tổ hợp (cỡ 200/300 × 4 chiến lược × 4 câu): các số đối chiếu được vẫn như cũ (Cố định 200: 5 chunk, ~213 token; overlap 40: 6 chunk, ~261; Cố định 300: 3 chunk, ~212) và bốn gợi ý trong callout mục 7 vẫn đúng. |
| 3 | Đã sửa | Overlap hiệu dụng = min(overlap, nửa cỡ chunk); nhãn hiện giá trị đã giới hạn và ghi chú "đã giới hạn ở nửa cỡ chunk; thanh đang đặt N". Cỡ 100 + overlap 120 giờ ra 16 chunk, ~392 token, 1,83× thay vì giống "Cố định". |
| 4 | Đã sửa | SVG: nhánh Office có đường riêng tới "Tài liệu có cấu trúc" với nhãn "cấu trúc có sẵn trong file", chỉ hai nhánh PDF vào "Phân tích bố cục"; dòng phụ ô Office đổi thành "đọc heading, bảng, sheet trong file". `.vflow` và đoạn mở đầu mục 2 sửa tương ứng. Ảnh chụp 1280px không có nhãn đè đường. |
| 5 | Đã sửa | Viết lại đúng điều [35] nói: số token thay đổi mạnh theo ngôn ngữ, có cặp chênh tới 15 lần; khuyên đếm token trên văn bản tiếng Việt của chính mình. |
| 6 | Đã sửa | "Unstructured ghi chế độ fast nhanh hơn khoảng 100 lần so với các model image-to-text hàng đầu." |
| 7 | Đã sửa | Thêm thẻ "LLM/VLM đọc ảnh trang" cuối mục 4 (dẫn [14] [15] [5]), giải thích VLM ở lần xuất hiện đầu, trỏ sang mục 11 và 13. |
| 8 | Đã sửa | Thêm callout "OCR tiếng Việt: đặt đúng ngôn ngữ" có nguồn: PyMuPDF/Tesseract mặc định "eng" và phải cài gói ngôn ngữ [10]; Unstructured có tham số `languages` [7] (đã tải lại hai trang và chép câu gốc vào file ghi chú nguồn). Ý về dấu thanh, con dấu, chữ ký ghi rõ là gợi ý kiểm tra, không phải số liệu nguồn. Bảng lỗi mục 12 thêm nguyên nhân "OCR chưa đặt ngôn ngữ tiếng Việt". |
| 9 | Đã sửa | Ở mục 8 và câu tự kiểm tra 6: ghi là thiết kế ví dụ ở mức file, cùng ý tưởng với ID dạng hash của Microsoft [17] và Indexing API của LangChain [27]. |
| 10 | Đã sửa | Ghi số tuyệt đối 5,7% → 3,7% → 2,9% (Contextual BM25) → 1,9% (reranking); thêm "(theo giá và giả định năm 2024: chunk 800 token, tài liệu 8.000 token)" sau $1,02 (bài đăng ngày 19/9/2024, đã kiểm lại). $1,02 chỉ xuất hiện ở mục 13, không có ở mục 6. |
| 11 | Đã sửa | Ghi chú động cạnh thanh trượt cho "Theo tiêu đề": hiện "không cắt giữa câu, nên có chunk dài hơn cỡ đặt" khi có chunk vượt cỡ, và "mỗi mục đã gọn trong một chunk; tăng cỡ không đổi gì" khi số chunk bằng số mục (đo được từ cỡ 240). |
| 12 | Đã sửa | Với cha–con: ô token ghi "chỉ chunk con, không gồm tiêu đề", thêm ô "~205 token lưu thêm ở tầng cha (không embed)", ô độ phình ghi "chỉ tính chunk con". |
| 13 | Đã sửa | Mọi dòng ghép hai cột (6 dòng, tính từ dữ liệu) có nền đỏ nhạt; hai dòng ví dụ rõ nhất giữ chữ đỏ đậm; lời chú thích sửa theo. Tương phản đạt ≥4,5 ở cả hai giao diện. |
| 14 | Đã sửa | Chú giải ở lần dùng đầu: IoU, recall, BM25 (link `../hybrid-search/`), reranking (link `../reranking/`), top-k. |
| 15 | Đã sửa 4/5 | Thêm dòng "… 4 dòng nữa …" vào bảng mục 5; cột độ tin cậy ghi "(0–1, minh họa)" và callout ghi "thang điểm tùy công cụ"; ví dụ ô tìm đổi "bang" thành "teds"; câu hash ở stepper bước 2 rút gọn và trỏ sang mục 8. Không sửa phần trùng với `knowledge-base/`: chính review đánh giá mức lặp chấp nhận được và trang đã trỏ sang đó. |
| 16 | Đã sửa phần bắt buộc | Dòng phụ ô Chunk trong `.vflow` thành "+ metadata (trang, mục lấy từ vị trí phần tử; hash; quyền)". Không sửa SVG: review ghi là không bắt buộc, và SVG đã có cạnh "vị trí → trang, mục". |
| 17 | Đã sửa | `aria-pressed` cho nút chế độ đọc, chiến lược, câu hỏi, chip từ điển; `aria-current="step"` cho bước stepper đang mở; `aria-live="polite"` cho `#simVerdict` và `#stepBody`. |
| Ngoài phạm vi | Không sửa | Link từ trang gốc `index.html` thuộc phiên chính (tôi không được sửa file đó). |

**Kiểm tra sau khi sửa (Orca):** `scrollWidth == innerWidth` ở 360/375/390/1280, cả sáng và tối; 0 chữ <11px, 0 chữ thân bài <15px trên mobile, 0 vùng chạm <40px trên mobile, 0 cặp tương phản <4,5; hai SVG: chữ nhỏ nhất 11,6px, không nhãn đè; 35 nguồn, 225 link trích dẫn, 0 gãy, 0 nguồn không được dẫn; console trống.
