# Kongming review: multilingual-rag/index.html

Ngày: 2026-11-19 · Người review: kongming (chỉ tư vấn, không sửa file trang).

Trạng thái file khi kết luận: `multilingual-rag/index.html` mtime 11:05:28, 1122 dòng, 142.591 byte. **File đã đổi hai lần trong lúc review** (11:01:04 với 1119 dòng → 11:03:05 → 11:05:28; phần đổi tôi thấy là CSS mobile: `details summary{min-height:40px}`, cỡ checkbox, padding `.term .rel a`). Mọi câu trích dưới đây đã được grep lại trên bản 11:05:28. Số dòng là của bản đó, hãy tìm theo chuỗi nếu file đổi tiếp.

## Cách kiểm

- Đọc toàn bộ trang, file nguồn, brief.
- Mô phỏng: chép nguyên khối JS (`CH`, `QS`, `bm25`, `rrf`, `vecA`, `vecB`, `runSim`, `note`) vào Node và chạy đủ 32 trạng thái (4 câu hỏi × 4 kiến trúc × glossary bật/tắt), so từng câu trong `note()` với số máy tính ra.
- Máy tính chi phí: tính tay lại cấu hình mặc định.
- Nguồn: tải bản gốc bằng curl (arXiv HTML/PDF, DeepL `.md`, Google, Azure, Lucene, Elastic, Claude docs) rồi grep câu trích. Đã kiểm: [3] [4] [5] [6] [7] [8] [9] [10] [11] [12] [13] [14] [15] (hai câu) [16] [17] [18] [23] [25] [28] [31]. **Chưa kiểm lại**: [1] [2] [19] [20] [21] [22] [24] [26] [27] [29] [30] [32] [33].
- Mobile: probe headless Chrome trong iframe 390px, 360px, 768px (tràn ngang, vùng bấm, cỡ chữ), chụp ảnh `.vflow`, mô phỏng, máy tính ở 390px; chụp hai SVG desktop ở 1280px, sáng và tối. Tương phản tính bằng công thức WCAG trên các cặp token.
- Giới hạn: không dùng Orca; không test trên Safari iOS thật.

## Kết quả đạt (không cần sửa)

- 390px và 360px: `scrollWidth` 375/345 (= bề rộng iframe trừ 15px thanh cuộn), không tràn ngang. Chữ thân bài 15px. Chữ nhỏ nhất 12px (tag, nhãn ngôn ngữ, dòng id của chunk), citation 11px. Không có lỗi JS.
- Vùng bấm ở 390px: nút câu hỏi 41–64px, nút kiến trúc 41px, chip 40px, bước stepper 42px, summary ≥ 40px, ô nhập 44px, toggle 50–74px. Còn dưới 40px: link chữ trong đoạn văn và trong mục Nguồn (20px), giống các trang khác.
- Tương phản: 23 cặp chữ/nền đã tính đều ≥ 4,7:1 ở cả hai theme (thấp nhất: `--bad` trên `--ok-soft` theme tối 4,72; `--muted` trên `--bad-soft` theme sáng 4,95).
- Link nội bộ: 8 slug được dùng (`rag`, `hybrid-search`, `embedding-performance`, `llm-fundamentals`, `llm-evaluation`, `query-transformation`, `tool-calling-structured-output`, `document-parsing-chunking`) đều có trong `TOPICS` của `so-tay/index.html`. Không có link vào `../learning-ai/`.
- Số liệu khớp nguồn: bảng MKQA của BGE-M3 (BM25 trung bình 39,9; dense 75,1; tiếng Việt 46,6 / 76,6 / mE5-large 75,4); Chirkova (≈50% trả lời tiếng Anh, CRL > 95%, 69,2% 3-gram, BGE-m3 + QT bằng BGE-m3: 61,5 / 78,4 / 77,1); Petrov Bảng 1 cột ChatGPT/GPT-4 (Đức 1,58; Nhật 2,30; Việt 2,45); giá Google (NMT 20 USD/triệu ký tự sau 500.000 miễn phí, Translation LLM 10 + 10, tính cả khoảng trắng, tính theo ngôn ngữ đích); DeepL 429/456/5xx/400/403/413, `Retry-After`, jitter, "stop condition", `context` không tính phí, 128 KiB, glossary trừ tiếng Thái, VI thêm Q2 2025; Azure dynamic dictionary "only safe for proper nouns", `notranslate`, profanity, điểm tin cậy, 503 "Retry the request", 403 trial; NeuCLIR (hybrid nDCG@20 tốt nhất, CLIR hơn monolingual ≈ 0,015); Lucene ß→ss, ae→a; Elastic không có analyzer `vietnamese`.
- Máy tính chi phí đúng số học: mặc định A = 144.000.000 ký tự lúc nạp (2.880 USD), 36.600.000 ký tự/tháng (732 USD), năm đầu 11.664 USD; C và D = 4.800.000 ký tự/tháng (96 USD), năm đầu 1.152 USD. Câu "phần dịch câu trả lời còn tốn hơn phần dịch kho hằng tháng" đúng (27,0 triệu so với 7,2 triệu ký tự).
- `note()` đúng với số máy tính ở 29/32 trạng thái. Ba chỗ lệch nằm ở mục M-1, M-2 dưới đây.

## Phát hiện

### Mức cao

**C-1. Thiếu hẳn reranker đa ngôn ngữ** · vị trí: toàn trang (grep `rerank` = 0 kết quả), ảnh hưởng `#flow`, `#so-sanh`, `#quan-he`.
Bằng chứng: trang nêu hai điểm yếu mà cách sửa chuẩn là rerank: (1) C "trộn nhiều danh sách theo ngôn ngữ khó, vì điểm giữa các index không so được"; (2) thiên lệch ngôn ngữ của retriever. Chính nguồn [4] dùng BGE-m3 làm cả retriever lẫn reranker (`bge-reranker-v2-m3`), và trang `../reranking/` đã publish. Người học xây RAG doanh nghiệp sẽ gặp câu hỏi "trộn xong rồi xếp lại bằng gì" ngay.
Sửa: thêm một đoạn ngắn ở `#flow` hoặc `#so-sanh`: sau bước trộn, một cross-encoder đa ngôn ngữ đọc cặp (câu hỏi gốc, chunk gốc) và xếp lại; nó là chỗ so được chunk khác ngôn ngữ trên cùng một thang điểm. Trích [4] cho việc dùng reranker đa ngôn ngữ, link `../reranking/`. Thêm một khái niệm vào từ điển và một ô vào bản đồ quan hệ (giữa "Trộn (RRF)" và "LLM"). Đừng khẳng định reranker hết thiên lệch ngôn ngữ, vì chưa có nguồn; viết "cần đo".

**C-2. Áp số 2,45 của cl100k cho embedding model là sai nguồn** · vị trí: `#tieng-viet`, thẻ "Cỡ chunk" và "Giới hạn đầu vào" (dòng ~423–424), câu mở "LLM và embedding model tính giới hạn và tiền theo token".
Bằng chứng: 2,45 là cột ChatGPT/GPT-4 (cl100k_base). Cũng trong [23], phụ lục cho XLM-RoBERTa: tiếng Việt ≈ 1,18, tiếng Nhật 1,11, và bài viết "XLM-R is much closer to parity". BGE-M3 dựng trên XLM-RoBERTa (theo [3]). Vậy câu "Cùng một giới hạn token, đoạn tiếng Việt vừa được ít chữ hơn" ngay sau ví dụ BGE-M3 8.192 token khiến người đọc hiểu tiếng Việt thiệt khoảng 2,45 lần ở BGE-M3, trong khi nguồn cho con số gần 1,2.
Sửa: tách rõ hai loại tokenizer. Viết: "Với tokenizer của LLM dòng GPT năm 2023, tiếng Việt tốn khoảng 2,45 lần. Với tokenizer đa ngôn ngữ XLM-R (nền của BGE-M3), cùng bài báo đo chênh lệch nhỏ hơn nhiều, tiếng Việt khoảng 1,2 lần.[23] Vì vậy đếm bằng đúng tokenizer của từng model." Đọc lại đúng cột XLM-R trong bảng phụ lục trước khi ghi số (tôi đọc từ bản pdftotext, dòng "Vietnamese 1.18 1.95 — 1.39 …").

### Mức trung bình

**M-1. `note()` Q4 + A quy công sai nguyên nhân** · vị trí: `note()`, nhánh `i===3&&a==='A'` (dòng ~960).
Bằng chứng: danh sách A cho câu "Mẫu RK-12": en5 0,7071 · vi3 0,7071 · **de4 0,5000 · vi1 0,5000**. de4 và vi1 bằng điểm; de4 vào top-3 chỉ vì `rank()` phá hòa theo thứ tự trong kho (`x.i-y.i`). Ghi chú lại nói "không có thiên lệch ngôn ngữ; de4 vào top-3". Bỏ hệ số 0,92 chỉ đưa de4 lên ngang vi1, không vượt.
Sửa: viết lại: "Ở A không có hệ số thiên lệch nên de4 lên ngang điểm vi1 (0,500) và vào top-3 nhờ thứ tự trong kho, vẫn đứng sau hai mẫu đơn sai. Vector vẫn không hiểu mã; A không thay được nhánh từ khóa." Giữ câu về 7 lượt dịch.

**M-2. `note()` Q2 + B nói điều mô hình đồ chơi không làm** · vị trí: `note()`, nhánh `i===1&&a==='B'` (dòng ~956): "Nếu ghi chú này viết dài hơn, nó có thể vượt lên."
Bằng chứng: điểm vector là cosine trên tập "ý"; chunk dài hơn (thêm ý không khớp) làm cosine **giảm**. Thứ quyết định là hệ số thiên lệch: de1 = 0,7746 × 0,92 = 0,7126, vi2 = 0,6667; vi2 vượt khi hệ số < 0,6667 / 0,7746 ≈ 0,86.
Sửa: "Nếu thiên lệch mạnh hơn một chút (hệ số dưới khoảng 0,86 thay vì 0,92), vi2 sẽ vượt lên #1."

**M-3. Nhánh BM25 của D gộp ba ngôn ngữ theo điểm thô, trái với chính bài học của trang** · vị trí: `runSim()`, `BM=rank(L.en.concat(L.de,L.vi))` (dòng ~912); mô tả ở `<details>` mục 4; mâu thuẫn với `#so-sanh` hàng C và thẻ từ điển `per-lang-index` ("Điểm BM25 giữa các index không so trực tiếp được").
Bằng chứng: tôi chạy thử hai cách trộn khác (RRF bốn danh sách; RRF lồng) trong Node. Bài học chính vẫn đứng: Q1, D, tắt glossary thì de2 rơi khỏi top-5; bật thì de2 #2. Nhưng ghi chú Q2 + D ("de1 và vi2 bằng điểm RRF") sẽ đổi nếu đổi cách trộn.
Sửa (nhẹ nhất, giữ nguyên code và ghi chú): thêm một câu vào `<details>`: "D gộp ba danh sách BM25 theo điểm thô cho gọn. Làm vậy chỉ tạm chấp nhận được vì ba index đồ chơi cùng công thức và cỡ gần nhau; ở hệ thật đừng so điểm BM25 giữa các index, hãy trộn bằng RRF hoặc rerank." Cũng sửa "tách theo dấu cách" thành "tách theo dấu cách và dấu câu" (regex tách `RK-12` thành `rk`, `12`, đúng như ghi chú Q4 mô tả).

**M-4. Kết quả của Guerreiro bị gán cho "dịch vụ dịch máy"** · vị trí: `#dich` bảng 7.2 hàng "Kiểu lỗi đặc trưng" (dòng ~492); `#sinh` 6.2 (dòng ~454).
Bằng chứng: [18] đo họ model mã mở M2M-100/SMaLL100 và ChatGPT (2023), không đo DeepL, Google hay Azure. Câu gốc: "struggle with hallucinations in **low-resource** language pairs and translating out of English, with hallucination rates well above 10% for some translation directions". Trang viết "tỷ lệ ảo giác trên 10% ở một số hướng dịch" thiếu chữ "ít dữ liệu", trong khi cặp của người học (Việt, Anh, Đức, Nhật) không thuộc nhóm đó.
Sửa: 6.2 → "một nghiên cứu năm 2023 trên model dịch đa ngôn ngữ mã mở ghi nhận tỷ lệ ảo giác trên 10% ở một số hướng dịch ít dữ liệu". Bảng 7.2 → đổi nhãn ô thành "Model NMT đa ngôn ngữ (đo trên M2M-100, 2023)", thêm "chưa có số đo công khai tương ứng cho dịch vụ thương mại trong các nguồn của trang này".

**M-5. "Tìm theo từ khóa gần như mù" nói quá so với số được trích** · vị trí: `#flow` thẻ đầu (dòng ~341), `#tieng-viet` Quy tắc 3, câu tự kiểm 2 ("gần như không dùng được").
Bằng chứng: BM25 đạt Recall@100 = 46,6 với câu hỏi tiếng Việt, tức tìm ra đoạn đúng cho gần một nửa số câu. Đó là "kém hẳn" (46,6 so với 76,6), không phải "mù". Ở k sát thực tế hơn, Bảng 13 của [3] cho Recall@20 tiếng Việt: BM25 33,6, dense 69,6 (đã kiểm).
Sửa: đổi tiêu đề thành "Tìm theo từ khóa yếu hẳn khi khác ngôn ngữ", thêm cặp số Recall@20, và nói rõ phần BM25 còn bắt được là nhờ tên riêng, số, từ mượn. Sửa định nghĩa Recall@100 cho dễ đọc: "tỷ lệ câu hỏi mà đoạn đúng nằm trong 100 kết quả đầu".

**M-6. Thiếu đánh đổi về cỡ index và lựa chọn embedding model (thuộc phạm vi bắt buộc)** · vị trí: `#so-sanh`.
Bằng chứng: "cỡ index" chỉ xuất hiện một lần, trong dòng chú thích của máy tính ("Văn bản lưu ở A tăng thêm khoảng 60%"). Bảng so sánh không có cột lưu trữ. "Chọn embedding model" chỉ có số benchmark và một link.
Sửa: thêm một cột hoặc một hàng "Lưu trữ / index": A giữ hai bản văn bản cho mỗi chunk phải dịch, một vector; B một bản, một vector; C một inverted index cho mỗi ngôn ngữ; D cả vector lẫn inverted index theo ngôn ngữ. Thêm một thẻ "Chọn embedding model đa ngôn ngữ" với bốn câu hỏi: model có được huấn luyện trên tiếng Việt, Đức, Nhật không; giới hạn token; có điểm theo từng ngôn ngữ trên MKQA/MIRACL không (MIRACL không có tiếng Việt); đã đo trên golden set của mình chưa. Thêm vào bảng triệu chứng một dòng: dùng nhầm model chỉ cho tiếng Anh thì không báo lỗi, chỉ recall thấp. Có thể nhắc phát hiện của [4] đã có trong ghi chú nguồn: kho gồm cả tiếng Anh lẫn ngôn ngữ người dùng thường tốt hơn từng kho riêng (MKQA tiếng Ả Rập 49,0 so với 45,9 và 36,3).

**M-7. Tiếng Nhật gần như vắng mặt** · vị trí: `#tieng-viet` Quy tắc 1; ví dụ và mô phỏng chỉ có EN/DE/VI.
Bằng chứng: người học có tài liệu tiếng Nhật; trang chỉ có một câu về bigram [27] và con số token 2,30.
Sửa: không cần thêm tiếng Nhật vào mô phỏng. Thêm 2–3 câu có nguồn: Elasticsearch không có analyzer `japanese` dựng sẵn trong danh sách [25] (chỉ có `cjk`), cách phổ biến là plugin phân tích hình thái (cần mở trang plugin kuromoji và trích; ghi chú nguồn nói trang đó chưa được dùng); cặp khác hệ chữ là nơi dense retriever hơn rõ nhất theo [10]. Thêm một dòng `vi → ja` vào bảng golden set mẫu.

**M-8. Câu hỏi gõ không dấu chỉ được xử lý ở nhánh BM25** · vị trí: `#tieng-viet` Quy tắc 2, bảng triệu chứng "Gõ 'phu cap an' không ra gì".
Bằng chứng: trang nói về ASCII folding cho index từ khóa, nhưng kiến trúc mặc định được khuyên là B (chỉ vector). Câu không dấu đi vào embedding model và vào bước dịch câu hỏi nguyên dạng; cả hai không được nhắc.
Sửa: thêm một câu thận trọng (chưa có nguồn nên ghi "cần tự đo"): câu không dấu có thể làm giảm chất lượng cả nhánh vector lẫn bản dịch câu hỏi; một cách là cho LLM khôi phục dấu ở bước viết lại câu hỏi (link `../query-transformation/`), và golden set phải có nhóm câu không dấu cho từng kiến trúc (bảng mẫu đã có một dòng, tốt).

**M-9. Màu của B và D bị đổi chỗ giữa các hình** · vị trí: CSS `.vflow .ph3{color:var(--p2)}` / `.ph2{color:var(--p3)}` (dòng 165), `ROWS` (dòng ~796, 802), `calc()` `rows` (dòng ~977, 979), tag ở `#tong-quan`.
Bằng chứng: tag tổng quan và `.vflow` mobile: B tím (`--p2`), D xanh lá (`--p3`). SVG desktop và thanh biểu đồ chi phí: B xanh lá (`--p3`), D tím (`--p2`). Trên điện thoại người đọc thấy B tím ở mục 1–2 rồi B xanh lá ở biểu đồ mục 4.
Sửa: trong `ROWS` và `rows` của `calc()` đổi B thành `var(--p2)`, D thành `var(--p3)`.

**M-10. Câu trả lời mẫu vi phạm chính quy tắc trong prompt mẫu** · vị trí: `STEPS[5]` (bước 6, dòng ~841) so với `STEPS[4]`.
Bằng chứng: prompt bước 5: "Nếu hai bản nói khác nhau, ưu tiên bản authoritative: true và nêu rõ chỗ lệch." Câu trả lời bước 6: "Sổ tay tiếng Anh ghi cùng mức 28 EUR", rồi ghi chú bên dưới lại chỉ ra hai bản lệch ("per full calendar day" so với "pro Kalendertag").
Sửa: cho câu trả lời mẫu nêu chỗ lệch: "Sổ tay tiếng Anh ghi cùng mức 28 EUR nhưng thêm điều kiện 'full calendar day' (ngày trọn); bản tiếng Đức có hiệu lực không ghi điều kiện này [en-tp-4.2]." Khi đó ghi chú bên dưới thành lời giải thích vì sao model làm vậy.

**M-11. Kiểm số "khớp nguồn" bỏ qua đúng vấn đề quy ước số mà trang vừa dạy** · vị trí: `#sinh` 6.3 thẻ "Kiểm bằng máy"; `STEPS[6]` hàng "Con số khớp nguồn".
Bằng chứng: bước 7 ghi tìm "28 EUR, 30 ngày" trong chunk, nhưng chunk ghi "30 days". So chuỗi thô sẽ gắn cờ oan; với "1.500" và "1,500" thì hoặc gắn cờ oan hoặc bỏ lọt.
Sửa: thêm một câu: chuẩn hóa số theo quy ước của ngôn ngữ chunk trước khi so (nhãn ngôn ngữ của chunk cho biết "1.500" là 1500 hay 1,5), so giá trị số chính xác, còn đơn vị thì so qua bảng tương đương (ngày/days/Tage) lấy từ glossary.

**M-12. Thuật ngữ dùng trước khi giải thích** · vị trí: `#flow` (dòng ~341–344) và `.vflow`.
Bằng chứng: trang chỉ giả định người đọc biết "chunk, embedding, top-k và BM25", nhưng mục 2 dùng "nhánh dense", "dense và sparse", "nDCG@20", "RRF", còn `#tieng-viet` dùng "analyzer" mà không có lời giải thích tại chỗ.
Sửa: thêm một dòng `.muted` đầu phần bằng chứng: "dense = tìm bằng vector; sparse = tìm theo từ khóa có trọng số (BM25 là một kiểu); nDCG@20 = điểm chất lượng thứ hạng của 20 kết quả đầu, càng cao càng tốt; RRF = cách trộn danh sách theo thứ hạng (xem Hybrid Search); analyzer = bộ tách và chuẩn hóa chữ trước khi đưa vào index từ khóa."

### Mức thấp

**T-1. MKQA "được dựng cho" bài toán khác ngôn ngữ** · `#tong-quan` (dòng 252). MKQA là bộ 10 nghìn câu hỏi song song ở 26 ngôn ngữ với đáp án không phụ thuộc ngôn ngữ; chính bài BGE-M3 [3] mới dùng nó để đo câu hỏi 25 ngôn ngữ tìm trong Wikipedia tiếng Anh. Sửa: "MKQA … thường được dùng để đo bài toán này; bài BGE-M3 dùng nó theo cách đó." Tương tự ở `#danh-gia` (dòng 656) và thẻ `xl-recall`: "MKQA và BGE-M3 báo cáo" → "bài BGE-M3 báo cáo trên MKQA".

**T-2. Định nghĩa "multilingual retrieval" tự mâu thuẫn** · `#tong-quan` và thẻ `mlir`. Định nghĩa là "kho trộn nhiều ngôn ngữ", ngay sau đó lấy MIRACL (tìm cùng ngôn ngữ) làm ví dụ. Sửa: nêu ba trường hợp: cùng ngôn ngữ ở nhiều ngôn ngữ (MIRACL), khác ngôn ngữ (cách BGE-M3 dùng MKQA), kho trộn nhiều ngôn ngữ (tình huống của doanh nghiệp, ít benchmark hơn).

**T-3. Azure "Có cặp ngôn ngữ phải dịch qua một ngôn ngữ trung gian"** · `#dich` bảng 7.1 (dòng 481), thẻ `pivot`. Câu gốc là câu điều kiện trong phần `allowFallback`: "If a translation from language X to language Y requires chaining through a pivot language E, then all the systems in the chain … need to be custom". Sửa: "Tài liệu nhắc tới trường hợp một cặp phải dịch nối qua ngôn ngữ trung gian (khi dùng model tùy biến, cả hai chặng phải cùng category)."

**T-4. "Glossary … áp dụng cứng"** · `#dich` bảng 7.2 (dòng 491). Hai nguồn [13] [15] không dùng chữ nào tương đương "bảo đảm"; Google còn ghi khớp phân biệt hoa thường. Sửa: "Glossary là tính năng có sẵn, khớp theo cụm từ đã khai báo" và thêm lưu ý: khớp chuỗi dễ trượt với dạng biến cách tiếng Đức hoặc khác hoa thường, nên phải kiểm trên golden set.

**T-5. DeepL: thiếu 529** · bảng 7.4 hàng 429. Tài liệu ghi "`429`, `529` | Too many requests in a short period". Thêm 529 vào ô mã lỗi. Cũng nên thêm một dòng cho lỗi không có mã (timeout, đứt mạng): coi là tạm thời, thử lại có giới hạn.

**T-6. Điểm số hiển thị lẫn hai kiểu dấu thập phân** · `chunkHtml()` và danh sách nhánh dùng `toFixed` ("điểm 0.667"), còn KPI và ghi chú dùng dấu phẩy ("1,00", "0,600"). Trên một trang dạy về quy ước số thì nên nhất quán. Sửa: thay `r.s.toFixed(dec)` và `x.s.toFixed(...)` bằng `fmt(…, dec)`.

**T-7. Bản đồ quan hệ desktop: nhãn bị đường cong cắt, thiếu một cạnh** · `E` trong IIFE bản đồ (dòng ~1018). Ảnh chụp 1280px: nhãn "gắn nhãn chunk" (96,124) bị đường `doc → lid` chạy xuyên qua; nhãn "câu trả lời" (738,314) chạm đầu đường `llm → chk`; mũi tên `qry → lid` kết thúc tại (300,197) nằm dọc theo mép dưới ô thay vì đâm vào ô. Hướng mũi tên đều đúng nghĩa. Thiếu cạnh "Ngôn ngữ câu hỏi → Embedding đa ngôn ngữ" (câu hỏi gốc được embed thẳng), là quan hệ lõi của B. Sửa: dời "gắn nhãn chunk" sang x≈150, y≈150; dời "câu trả lời" sang x≈745, y≈300; cho đường `qry → lid` kết thúc tại `…, 330 200, 330 198` (đi lên vào mép dưới); thêm một đường nét mảnh từ `qry` tới `emb` với nhãn "câu hỏi gốc (B, D)".

**T-8. Sơ đồ flow desktop** · `ROWS`. "Tìm từng index" và "Dịch → EN, DE" rộng gần bằng ô 102 đơn vị, chữ chạm viền (ảnh 1280px). Hàng D vẽ nối tiếp "Câu hỏi → Dịch câu hỏi → Hai nhánh tìm", làm mất ý "nhánh vector không chờ bản dịch" mà bản mobile thể hiện đúng. Sửa: rút nhãn thành "Tìm theo index", "Dịch → EN+DE"; đổi phụ đề ô cuối hàng D thành "vector không chờ dịch" hoặc ghi vào dòng `calls`.

**T-9. Bật glossary không có tác dụng ở nhiều trạng thái mà giao diện không nói** · `renderSim()`. Ở B (mọi câu hỏi) và ở câu 3, câu 4 (mọi kiến trúc) kết quả giống hệt khi bật/tắt. Sửa: khi `S.a==='B'` thêm một dòng `.muted`: "B không gọi dịch nên glossary không đổi kết quả."

**T-10. Câu trả lời đồ chơi ở A hiển thị bản dịch câu hỏi sai thuật ngữ nhưng điểm không đổi** · `runSim()` nhánh A dùng `q.c` bất kể glossary, trong khi `trbox` hiện "food allowance". Không sai (vector coi hai cụm cùng nghĩa) nhưng dễ thắc mắc. Sửa: thêm vào `<details>`: "Ở A, vector đồ chơi coi 'food allowance' và 'meal allowance' là cùng một ý; lỗi dịch chỉ được mô phỏng ở phía tài liệu."

**T-11. Câu chữ**
- "mỗi ngày lịch" (bước 6, cho "pro Kalendertag") nghe như dịch từng chữ → "mỗi ngày theo lịch".
- "Xử lý từ tục" (bảng 7.1) → "xử lý từ ngữ thô tục".
- "nhiệt độ sampling cao" (6.1) → "temperature cao" (trang LLM Fundamentals dùng thuật ngữ này), hoặc ghi cả hai.
- Tiêu đề hàng D trong `#so-sanh`: câu về RRF "thưởng chunk có mặt ở cả hai nhánh" là hiện tượng thật nhưng mức độ (#7) là của kho 12 chunk; thêm "trong mô phỏng".
- Phần còn lại tự nhiên, đoạn ngắn, không thấy câu dịch máy.

**T-12. Các điểm nên có nhưng không bắt buộc**
- Gửi tài liệu nội bộ cho dịch vụ dịch bên ngoài là một quyết định về dữ liệu; một câu kèm link `../governance/`.
- Dịch từng chunk rời làm mất ngữ cảnh và sự nhất quán thuật ngữ trong một tài liệu; tham số `context` của DeepL (đã trích ở bảng 7.1) là một cách, nên nối hai ý lại.
- Changelog DeepL [14] hiện có mục "JSON Placeholder Protection" (30/9) và "custom instructions"; liên quan trực tiếp tới 6.5. Tôi chỉ thấy tiêu đề, chưa đọc nội dung: chỉ thêm nếu mở trang và trích được.

## Khẳng định chưa có nguồn hoặc là minh họa

- Đã ghi "minh họa" đúng chỗ: hệ số 0,92, độ trễ 300 ms, bảng Recall@5 mục 12, thứ hạng ở bước 4, toàn bộ ví dụ Hansa Lotus Logistics. Tốt.
- Chưa có nguồn, nên giữ giọng "gợi ý": "câu hỏi dịch máy thường 'sạch' hơn câu người thật gõ" (`#danh-gia`); "ở kho thật hàng nghìn chunk thì mức tụt này đủ để rơi khỏi top-k" (`note()` Q1 + A, nên đổi "đủ để" thành "có thể đủ để"); "model thường làm theo [bảng thuật ngữ trong prompt]" (bảng 7.2); "OCR thường là bước đắt nhất" (7.4, có link sang trang parsing nên chấp nhận được).
- `ANS_CHARS=400` trong mô phỏng và 900 ký tự mặc định trong máy tính là hai giả định khác nhau cho cùng một đại lượng; cả hai đều được gắn nhãn minh họa, chỉ cần biết là có chủ ý.

## Kết luận

Trang đủ chuẩn để publish sau một vòng sửa ngắn. Nền tảng chắc: số liệu benchmark, giá và ngữ nghĩa mã lỗi đều khớp nguồn gốc; mô phỏng và máy tính tính đúng; mobile 390px sạch (không tràn, vùng bấm và cỡ chữ đạt, tương phản đạt ở hai theme); link nội bộ hợp lệ.

Nên sửa trước khi publish: C-1 (reranker đa ngôn ngữ), C-2 (số token 2,45 bị áp sang embedding model), M-1 và M-2 (hai ghi chú mô phỏng giải thích sai lý do), M-4 (phạm vi của nghiên cứu ảo giác dịch), M-9 (màu B/D), M-10 (câu trả lời mẫu trái prompt mẫu). Các mục M còn lại và nhóm T là cải thiện, có thể làm cùng lượt.

Chưa xác minh: 13 nguồn liệt kê ở đầu report; hiển thị trên Safari iOS thật; ảnh mobile của stepper ở từng bước (chỉ đo layout, không chụp đủ 9 bước).

## Kết quả áp dụng

Người áp dụng tự kiểm lại từng mục trên nguồn gốc (curl/pdftotext) và bằng Node/Orca trước khi sửa. Trích dẫn mới được ghi vào `research-261119-multilingual-rag-sources.md` (mục [34] và "Added after review").

### Đã sửa
- **C-1 (sửa):** đã kiểm [4] dùng `bge-reranker-v2-m3` và câu "multilingual retrievers and rerankers perform reasonably well". Thêm thẻ "Thêm bước rerank đa ngôn ngữ" ở `#so-sanh` (link `../reranking/`, ghi rõ chưa có nguồn về việc rerank bớt thiên lệch, "hãy đo"); khái niệm mới `rerank-ml` trong từ điển (39 → 40); bản đồ quan hệ đổi ô thành "Trộn (RRF) + rerank"; hàng C trong bảng nhắc RRF/reranker.
- **C-2 (sửa):** đã kiểm Petrov: cột đầu của bảng phụ lục là XLM-R (khớp Bảng 4: Bulgarian 1,16, Japanese 1,11), tiếng Việt 1,18; BGE-M3 ghi "the tokenizer of XLM-Roberta". Mục Token tách hai loại tokenizer; thẻ "Cỡ chunk", "Giới hạn đầu vào" và thẻ từ điển `token-premium` không còn áp 2,45 cho BGE-M3.
- **M-1 (sửa):** Node xác nhận A, câu RK-12: en5 0,7071 · vi3 0,7071 · de4 0,5000 · vi1 0,5000. Viết lại ghi chú theo đúng đề xuất.
- **M-2 (sửa):** xác nhận de1 0,7126, vi2 0,6667, ngưỡng ≈ 0,86. Viết lại câu.
- **M-3 (sửa):** thêm câu "điểm thô, chỉ để mô phỏng gọn; ở hệ thật đừng so điểm BM25 giữa các index"; "tách theo dấu cách và dấu câu" (đã kiểm regex `[^\p{L}\p{N}]+`).
- **M-4 (sửa):** 6.2 và bảng 7.2 ghi rõ M2M-100 (2023), cặp ít dữ liệu; cột LLM ghi "đo trên ChatGPT (2023)"; ghi chưa có số đo cho DeepL/Google/Azure.
- **M-5 (sửa):** đổi tiêu đề thành "yếu hẳn"; thêm Recall@20 (vi: BM25 33,6, dense 69,6; ja: 14,5 / 67,0, đã kiểm Bảng 13 của [3]); viết lại định nghĩa Recall@100; câu tự kiểm 2 bỏ "gần như không dùng được".
- **M-6 (sửa):** thêm cột "Lưu trữ" vào bảng so sánh; thẻ "Chọn embedding model đa ngôn ngữ" (4 câu hỏi, link `../embedding-performance/`); thêm dòng triệu chứng "recall thấp ở mọi cặp vượt ngôn ngữ, không báo lỗi". Không đưa số tiếng Ả Rập 49,0/45,9/36,3 vì chưa tự kiểm lại.
- **M-7 (sửa một phần):** thêm câu có nguồn: danh sách analyzer của Elastic chỉ có `cjk` [25], plugin kuromoji phải cài trên mọi node (nguồn mới [34], đã mở trang); thêm số Recall@20 tiếng Nhật. Không thêm dòng vi → ja vào golden set vì công ty hư cấu không có tài liệu tiếng Nhật.
- **M-8 (sửa):** thêm đoạn: ASCII folding chỉ giúp nhánh từ khóa, câu không dấu ảnh hưởng vector và bản dịch "chưa có nguồn, tự đo", gợi ý khôi phục dấu (link `../query-transformation/`).
- **M-9 (sửa):** `ROWS` và `calc()` đổi B → `--p2`, D → `--p3`; đã kiểm thanh chi phí và SVG.
- **M-10 (sửa):** câu trả lời mẫu nêu chỗ lệch "per full calendar day"; ghi chú giải thích vì prompt bước 5 yêu cầu; bước 7 "Trích dẫn có thật" đổi thành 3/3 (chuỗi có y nguyên trong chunk en-tp-4.2).
- **M-11 (sửa):** thẻ "Kiểm bằng máy" và bước 7 thêm chuẩn hóa số theo ngôn ngữ chunk và đổi đơn vị qua glossary.
- **M-12 (sửa):** thêm dòng giải thích dense, sparse, nDCG@20, RRF, analyzer ở đầu phần bằng chứng.
- **T-1, T-2 (sửa):** đoạn tổng quan nêu ba tình huống (MIRACL cùng ngôn ngữ, MKQA khác ngôn ngữ theo cách bài BGE-M3 dùng, kho trộn có trong [4]); thẻ `mlir`, `clir`, `xl-recall` và thẻ metric ở mục 12 sửa câu chữ.
- **T-3 (sửa):** câu pivot của Azure viết lại thành câu điều kiện (đã kiểm nguyên văn `allowFallback`); thẻ `pivot` sửa theo.
- **T-4 (sửa):** "áp dụng cứng" → "khớp theo cụm từ đã khai báo", thêm lưu ý phân biệt hoa thường [15] và kiểm trên golden set. Không ghi ý biến cách tiếng Đức vì chưa có nguồn.
- **T-5 (sửa):** thêm 529 (đã kiểm bảng DeepL); thêm dòng "không có mã (timeout, đứt mạng)" ghi là gợi ý.
- **T-6 (sửa):** điểm trong mô phỏng dùng `fmt()` (dấu phẩy thập phân).
- **T-7 (sửa một phần):** dời nhãn "gắn nhãn chunk" và "câu trả lời", mũi tên `qry → lid` đi lên vào mép dưới ô. Không vẽ thêm cạnh `qry → emb` vì đường đi phải cắt qua ô "Nhận diện ngôn ngữ"; thay bằng phụ đề ô Embedding "chunk gốc + câu hỏi gốc". Đã chụp lại ảnh 1280px.
- **T-8 (sửa một phần):** ô cuối hàng D đổi phụ đề thành "vector chạy ngay". Không đổi "Tìm từng index", "Dịch → EN, DE": ảnh chụp 1280px cho thấy chữ vẫn nằm trong ô.
- **T-9 (sửa):** mô phỏng tự so kết quả khi đảo glossary; nếu giống nhau thì hiện một dòng (B: "B không gọi dịch nên…"). Đã chạy đủ 32 trạng thái trong trình duyệt.
- **T-10 (sửa):** thêm câu vào `<details>` về "food allowance" và "meal allowance".
- **T-11 (sửa):** "mỗi ngày theo lịch", "từ ngữ thô tục", "temperature (nhiệt độ sampling)", hàng D thêm "trong mô phỏng".
- **T-12 (sửa một phần):** thêm đoạn về quyết định dữ liệu (link `../governance/`) và tham số `context` của DeepL cho ngữ cảnh tài liệu.
- Mục "chưa có nguồn": đổi "đủ để" thành "có thể đủ để" trong ghi chú Q1 + A.

### Không sửa
- **T-12, mục changelog DeepL:** không thêm vì chưa đọc và trích được nội dung.
- **"câu hỏi dịch máy thường 'sạch' hơn":** giữ, vì đã nằm trong đoạn "Mẹo" và là gợi ý, không phải số liệu.
- **`ANS_CHARS=400` khác 900 ký tự của máy tính:** giữ, vì cả hai đều ghi là minh họa (người review cũng nói là có chủ ý).

### Kiểm sau khi sửa (Orca, 2026-11-19)
- 390px: `scrollWidth` 390 = `innerWidth`; không có phần tử tràn; không còn chữ dưới 11px ngoài số trích dẫn; mọi nút, summary, link ngoài đoạn văn ≥ 40px (citation ≥ 24×40); tương phản 0 cặp dưới 4,5:1 ở cả theme sáng và tối; console 0 lỗi.
- 34 nguồn, không có `#src-N` thiếu hay không được trích; 40 khái niệm, mọi link liên quan trỏ đúng thẻ.
- 1280px: không tràn ngang; máy tính mặc định A 11.664 USD, C/D 1.152 USD, B 0; màu thanh A cam, B tím, C xanh dương, D xanh lá, khớp các hình khác.
