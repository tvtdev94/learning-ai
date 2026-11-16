# Review: trang học RAG (D:\WORKSPACES\rag-learning\index.html)

Ngày: 2026-11-14. Phạm vi: đọc toàn bộ 677 dòng, không sửa file. Số liệu cosine, khoảng cách 2D và tương phản màu được tính lại bằng node từ đúng các giá trị trong file.

## TL;DR

Nội dung RAG về cơ bản đúng và ở đúng mức cho người mới. Không có lỗi nào làm hỏng trang. Có 3 chỗ nên sửa trước khi đưa cho người học: (1) ghi chú câu hỏi thứ 4 của demo 2D mâu thuẫn với kết quả demo hiển thị, (2) "hit@k còn gọi recall@k" sai với chính ví dụ của trang, (3) điểm cosine ở bước 6 không khớp với 4 vector ở bước 3 và bước 5.

Nhãn: CONFIRMED = đã xác minh bằng đọc file hoặc tính lại. PLAUSIBLE = suy ra từ code/hình học, chưa mở trình duyệt.

## A. Độ chính xác kỹ thuật (xếp theo mức nghiêm trọng)

### A1. Demo 2D, câu hỏi 4: ghi chú nói ngược kết quả. CONFIRMED (dòng 567)
- Vấn đề: ghi chú viết "Câu hỏi nằm giữa nhiều chủ đề: top-3 lẫn lộn". Tính lại với toạ độ (225,240): top-3 là c20 (65,0), c18 (116,7), c19 (125,0). Cả ba đều thuộc "Văn phòng", và c20 "Làm việc từ xa thứ Sáu" là đáp án đúng, đứng hạng 1. Người học thấy kết quả sạch nhưng đọc ghi chú nói lẫn lộn.
- Sửa: đổi toạ độ câu hỏi thành `x:280,y:200`. Đã tính lại: top-3 = c20 (104,4, Văn phòng), c13 (130,0, Lương thưởng), c8 (138,9, Nghỉ phép). Sửa ghi chú thành: "Đoạn đúng (c20) vẫn đứng đầu, nhưng hai đoạn còn lại là nhiễu từ chủ đề khác. Reranking giúp loại nhiễu này."

### A2. "hit@k (còn gọi recall@k)" không đúng. CONFIRMED (dòng 457, 633)
- Vấn đề: hit@k = tỷ lệ câu hỏi có ít nhất một đoạn đúng trong top-k. recall@k = tỷ lệ các đoạn đúng được tìm thấy trong top-k. Hai số chỉ trùng nhau khi mỗi câu hỏi có đúng một đoạn đúng. Ví dụ của chính trang (bước 6) cần cả c7 và c8: với k = 1 thì hit@1 = 1 nhưng recall@1 = 0,5.
- Sửa dòng 457: "hit@k: tỷ lệ câu hỏi có ít nhất một đoạn đúng nằm trong top-k. recall@k: trong các đoạn đúng, tìm được bao nhiêu phần. Hai số bằng nhau khi mỗi câu hỏi chỉ có một đoạn đúng." Thẻ từ điển dòng 633: đổi tên thành "hit@k và recall@k" và dùng ví dụ c7 + c8 ở trên.

### A3. Điểm cosine bước 6 không khớp vector bước 3 và bước 5. CONFIRMED (dòng 531, 533, 534)
- Tính lại từ các vector trong trang: c8 = 0,9996; c7 = 0,9909; c9 = 0,8857; c15 = -0,0166. Trang ghi 0.97; 0.95; 0.80; 0.01.
- Thứ hạng đúng, nhưng giá trị lệch, và c15 thật ra âm. Người học biết code rất dễ tự tính thử.
- Sửa: ghi đúng số tính được: 1.00; 0.99; 0.89; -0.02. Thanh `.bar` của c15 để width 0%. Nếu muốn giữ khoảng cách điểm dễ nhìn hơn thì đổi vector, không đổi điểm.

### A4. Cosine: thiếu khoảng âm và gây hiểu nhầm về ngưỡng tuyệt đối. CONFIRMED (dòng 279, 613, 534)
- Vấn đề: trang chỉ nói "gần 1" và "gần 0". Cosine chạy từ -1 đến 1, và các vector minh họa có số âm. Ngoài ra điểm 0.01 cho đoạn wifi gợi ý rằng "không liên quan = gần 0". Với embedding model thật, hai đoạn không liên quan thường vẫn có điểm dương khá cao; mức cụ thể tùy model (nhận định từ kinh nghiệm, không đo trong review này).
- Sửa: thêm một câu ở dòng 279: "Cosine nằm trong khoảng -1 đến 1. Với model thật, điểm số chỉ có ý nghĩa tương đối: dùng để xếp hạng, không có ngưỡng chung kiểu 'trên 0,8 là liên quan'."

### A5. BM25 định nghĩa thiếu phần quan trọng nhất. CONFIRMED (dòng 625)
- Vấn đề: "chấm điểm dựa trên tần suất từ khớp" bỏ mất IDF (từ hiếm được tính nặng hơn) và chuẩn hóa độ dài đoạn. IDF chính là lý do BM25 mạnh với mã số, tên riêng, điều mà trang dùng để biện minh cho hybrid search.
- Sửa: "Chấm điểm theo từ khớp: từ càng hiếm trong kho thì càng nặng điểm, có điều chỉnh theo độ dài đoạn."

### A6. "So với vector của mọi đoạn" mâu thuẫn với thẻ Index/ANN. CONFIRMED (dòng 246, 534 so với 615-616)
- Vấn đề: mục 2 và bước 6 mô tả tìm kiếm vét cạn; từ điển lại nói index giúp "thay vì so với từng vector một".
- Sửa: thêm vào bước 6 một câu: "Về ý tưởng là so với mọi vector. Kho lớn thì vector database dùng index (ANN) để chỉ so với một phần nhỏ, kết quả gần như tương đương."

### A7. Thẻ Vector database: ví dụ lẫn loại và còn sót ghi chú của người viết. CONFIRMED (dòng 614)
- Vấn đề: FAISS là thư viện index, pgvector là extension của PostgreSQL; không phải vector database đúng nghĩa. Cụm "(cần kiểm tra bản mới nhất)" đọc như ghi chú nội bộ.
- Sửa: "Ví dụ: Qdrant, Chroma (database chuyên dụng); pgvector (thêm khả năng vector cho PostgreSQL); FAISS (thư viện index)." Bỏ cụm trong ngoặc.

### A8. Grounding dùng chữ "Buộc". CONFIRMED (dòng 621)
- Vấn đề: lời dặn trong prompt chỉ làm giảm, không bảo đảm. Bước 7 (dòng 535) đã viết đúng là "giảm".
- Sửa: "Yêu cầu LLM chỉ trả lời dựa trên tài liệu… Giảm bịa, không loại bỏ hoàn toàn."

### A9. Các câu khẳng định không có căn cứ, nên làm mềm. CONFIRMED về câu chữ
- Dòng 617 "Điểm hỏng phổ biến nhất của RAG" và dòng 172 "quan trọng hơn mọi thứ khác": đổi thành "thường là điểm hỏng đầu tiên cần kiểm tra".
- Dòng 598 "Tiếng Việt có dấu thường tốn nhiều token hơn tiếng Anh": phụ thuộc tokenizer; thêm "với phần lớn tokenizer hiện nay".
- Dòng 246 và 618 "thường k = 3–5": thêm "tùy hệ thống, phải đo".
- Dòng 596 "dự đoán từ tiếp theo": đổi thành "token tiếp theo" cho khớp thẻ Token.

### A10. Các điểm đã kiểm tra và đúng
MRR (dòng 458, 634), RRF (dòng 626), cross-encoder và reranking (dòng 442, 627-628), ANN (dòng 616), RAG so với fine-tuning (dòng 397, 401, 504), context window gồm cả câu trả lời (dòng 599), cùng embedding model cho hai pha (dòng 293). Ví dụ cắt 50 ký tự ở bước 2 khớp chính xác (8 ký tự "Điều 7. " + 42 ký tự = 50). Từ điển đủ 41 thẻ; mọi liên kết "Liên quan" đều trỏ tới id tồn tại. Nhãn "minh họa" có ở dòng 256, 285, 511, 573.
- Gợi ý nhỏ cho RRF: thêm "chỉ dùng thứ hạng, không dùng điểm số, vì điểm BM25 và điểm cosine không so được với nhau".
- Gợi ý nhỏ cho MRR dòng 458: thêm "lấy trung bình trên mọi câu hỏi; không tìm thấy thì tính 0".

## B. Khái niệm cốt lõi còn thiếu

### B1. Top-k luôn trả về k đoạn, kể cả khi không có đoạn nào liên quan. CONFIRMED thiếu
- Đây là hiểu nhầm phổ biến của người mới: retriever không biết nói "không tìm thấy". Trang chỉ chạm gián tiếp ở dòng 536.
- Sửa: thêm một callout ở cuối bước 6 hoặc cuối mục 4: "Retrieval luôn trả về k đoạn gần nhất, dù gần nhất vẫn có thể là không liên quan. Vì vậy mới cần lời dặn 'không có thì nói không biết' và câu hỏi ngoài phạm vi trong eval set."

### B2. RAG giảm chứ không loại bỏ hallucination. CONFIRMED thiếu ở mục 1
- "Vấn đề 3" (dòng 152) ngầm hứa RAG giải quyết việc bịa. Ý đúng chỉ xuất hiện ở mục 8.
- Sửa: thêm một câu ngay sau lưới 3 vấn đề: "RAG giảm mạnh ba vấn đề này nhưng không xóa hẳn: có đoạn đúng trong prompt, LLM vẫn có thể đọc sai."

### B3. Cập nhật kho và đổi embedding model. CONFIRMED thiếu
- Dòng 180 có nói làm lại khi tài liệu đổi, nhưng chưa nói hệ quả của việc đổi model.
- Sửa: thêm vào callout dòng 293: "Đổi embedding model nghĩa là phải embed lại toàn bộ kho."

### B4. Bước đọc/trích văn bản (parsing) không có trong flow và cây chẩn đoán. CONFIRMED (dòng 191-196, 412)
- Từ điển có thẻ Loader nhưng sơ đồ pha 1 đi thẳng từ Tài liệu sang Cắt đoạn; cây chẩn đoán cũng không có nhánh "văn bản trích ra có đúng không".
- Sửa: đổi dòng chữ nhỏ của ô "Cắt đoạn" thành "đọc văn bản + chunking + metadata", và thêm vào bước 1 của cây chẩn đoán: "Tài liệu có nhưng trích ra sai (PDF scan, bảng biểu) cũng tính là không có."

Không cần thêm gì khác. Bi-encoder, context precision, GraphRAG, prompt caching đều nằm ngoài phần cốt lõi cho đối tượng này.

## C. Sư phạm và câu chữ

- C1. Mục 3 dùng "vector", "embed", "cosine similarity" trước khi mục 4 giải thích. CONFIRMED (dòng 531, 533, 534). Sửa nhẹ: giữ thứ tự, thêm chú thích một dòng ở bước 3 ("vector = dãy số biểu diễn nghĩa, giải thích kỹ ở mục 4") và ở bước 6 ("cosine similarity = thước đo độ gần, xem mục 4").
- C2. Cây chẩn đoán (dòng 412-415) đi từ tài liệu xuống, còn câu tự kiểm tra số 3 (dòng 500) bảo xem top-k trước. CONFIRMED. Sửa: thêm một câu trên cây: "Thực tế nên nhìn top-k trước vì dễ xem nhất; nếu thiếu đoạn đúng thì lùi ngược về bước 2 rồi bước 1."
- C3. Demo 2D dùng khoảng cách đường thẳng trong khi phần trên vừa dạy cosine. CONFIRMED (dòng 582). Sửa: thêm vào dòng 285: "Trong hình, 'gần' là khoảng cách đường thẳng; ý tưởng giống cosine."
- C4. Demo 2D câu hỏi 1 cho top-3 = c8, c7, c10 (nghỉ ốm), còn bước 6 cho c8, c7, c9. CONFIRMED bằng tính lại. Không sai vì kho của demo có thêm c10, nhưng nên đổi c10 sang (200,60) hoặc ghi "kho ở đây nhiều đoạn hơn ví dụ mục 3".
- C5. Cùng một câu về nghỉ phép có hai vector khác nhau: dòng 274 `[0.021, -0.113, …]` và dòng 531 `[0.81, 0.12, …]`. CONFIRMED. Mức thấp; đổi câu ví dụ ở dòng 273 sang câu khác.
- C6. Dấu thập phân không nhất quán: "0,5; 0,33" (dòng 458, 634) và "0.97", "0.81" ở nơi khác. CONFIRMED. Dùng dấu chấm ở mọi chỗ vì vector đã dùng dấu phẩy để ngăn phần tử.
- C7. Từ ngữ: "embed" dùng như động từ từ dòng 293 mà chưa giải nghĩa, thêm "(embed = tạo embedding)" ở lần đầu. "Thi đóng sách" (dòng 169): "thi đề đóng / đề mở" tự nhiên hơn. "tick ô" (dòng 478): "đánh dấu ô". "Tìm láng giềng gần đúng" (dòng 616): "tìm láng giềng gần nhất theo cách xấp xỉ".
- C8. Dấu tiếng Việt: không thấy lỗi dấu nào trong toàn file. CONFIRMED bằng đọc.

## D. Lỗi JS/HTML/CSS

- D1. Thiếu `scroll-margin-top`: bấm mục lục thì tiêu đề mục bị header sticky che. CONFIRMED theo CSS (dòng 33, 42; không có khai báo nào). Sửa: `section{scroll-margin-top:64px}`.
- D2. Chữ trắng trên nền accent ở dark mode: tương phản 2,73:1 (`#fff` trên `#6b9cf5`), dưới mức 4,5:1. CONFIRMED bằng tính (dòng 77, 92). Light mode đạt 4,72:1. Sửa: thêm token `--on-accent` (`#fff` ở light, `#15171a` ở dark, đạt 6,58:1) cho `.chip.on` và `.steps button.on .n`.
- D3. Dấu câu hỏi trong demo 2D đè lên chấm gần nhất. PLAUSIBLE theo hình học (dòng 564-566, 584-585): hình thoi bán kính khoảng 12,7 + chấm được chọn bán kính 11 = 23,7, trong khi khoảng cách tới chấm gần nhất là 18,0 (câu 1), 22,4 (câu 2), 20,6 (câu 3). Nhãn "câu hỏi" cũng chạm nhãn id. Sửa: thu hình thoi còn 12x12 và dời toạ độ câu hỏi ra cách chấm gần nhất ít nhất 30.
- D4. Nhãn trong SVG flow đè lên đường kẻ. PLAUSIBLE (dòng 237, 240). Nhãn "tìm trong kho đã chuẩn bị" tại (600,186) nằm trên đường cong đứt nét (đường cong đi qua khoảng (587,191) và (668,174)). Nhãn "cùng một embedding model…" tại y=160 nằm đúng trên cạnh dưới của khung pha 1. Sửa: dời nhãn thứ nhất sang `x=745 y=182`, nhãn thứ hai xuống `y=178` và `x=250`.
- D5. Mũi tên "tìm trong" ở bản đồ mục 6 chỉ từ Vector DB về Retriever, ngược nghĩa với nhãn. CONFIRMED (dòng 345, 359). Sửa nhãn thành "trả về đoạn gần nhất" hoặc đảo chiều mũi tên.
- D6. Mobile 390px: SVG có `min-width:640px` (dòng 72) nên chữ 11-13px trong viewBox 1000 chỉ còn khoảng 7-8px. PLAUSIBLE. Sửa: `@media (max-width:600px){.svgbox svg{min-width:900px}}`, chấp nhận cuộn ngang.
- D7. Mobile: bảng 4 cột ở mục 7 và bước 4 không có `min-width` nên bị ép vào khoảng 358px, cột rất hẹp; `overflow-x:auto` không bao giờ kích hoạt. PLAUSIBLE (dòng 62, 65). Sửa: `.table-wrap table{min-width:560px}` cho bảng 4 cột.
- D8. Mobile: bấm "Tiếp" không cuộn thanh bước theo, từ bước 4 trở đi nút đang chọn nằm ngoài màn hình. PLAUSIBLE (dòng 88, 540). Sửa: trong `show()` gọi `scrollIntoView({inline:'nearest',block:'nearest'})` trên nút đang chọn.
- D9. Ô tìm từ điển phân biệt dấu: gõ "doan", "nghia" không ra kết quả. CONFIRMED (dòng 645). Sửa: chuẩn hóa cả hai vế bằng `normalize('NFD')`, bỏ dấu kết hợp, đổi "đ" thành "d".
- D10. Theme đã lưu được áp sau lần vẽ đầu vì script ở cuối body, gây nháy màu khi theme lưu khác theme hệ thống. PLAUSIBLE (dòng 520). Sửa: đưa 3 dòng đọc theme lên `<head>`.
- D11. Phòng thủ: thêm `min-width:0` cho cột nội dung của `.stepper` (dòng 85) để tránh tràn ngang nếu sau này có nội dung không ngắt dòng. PLAUSIBLE, hiện chưa thấy tràn.
- D12. Đã kiểm tra và ổn: logic stepper (disabled ở hai đầu), try/catch localStorage (dòng 518-519), lưu checkbox, liên kết "Liên quan" kể cả khi thẻ đích đang bị lọc (dòng 658), token dark mode đủ cho cả hai đường (media query và `data-theme`), `nav.toc` cuộn ngang được.

## Thứ tự sửa đề xuất

1. A1, A2, A3 (sai nội dung nhìn thấy ngay).
2. B1, B2, A4 (ba hiểu nhầm cốt lõi của người mới).
3. D1, D2, D9 (lỗi dùng hằng ngày).
4. A5-A9, B3, B4, C1-C7.
5. D3-D8, D10, D11 (cần mở trình duyệt ở 390px để xác nhận trước khi sửa).

## Giả định

- Người học đọc trên trình duyệt hiện đại (Chrome/Edge/Firefox/Safari mới). Độ tin cậy cao. Nếu cần hỗ trợ trình duyệt cũ, `var()` trong thuộc tính SVG phải kiểm tra lại.
- Các mục PLAUSIBLE chưa được kiểm bằng trình duyệt thật; tôi chỉ đọc code và tính hình học. Độ tin cậy trung bình.
- Nhận định "model thật cho điểm cosine dương khá cao với đoạn không liên quan" là kiến thức chung, không đo trong review này. Độ tin cậy trung bình-cao.
- Runtime: Fable 5.2 (claude-fable-5-2).

## Câu hỏi chưa giải quyết

- Không có câu hỏi chặn. Một lựa chọn thuộc về người viết: giữ thứ tự "ví dụ (mục 3) trước, embedding (mục 4) sau" kèm chú thích như C1, hay đảo hai mục. Khuyến nghị giữ thứ tự hiện tại.

Status: DONE_WITH_CONCERNS
Summary: Nội dung RAG cơ bản đúng; có 3 lỗi nội dung đã xác minh cần sửa trước (ghi chú demo 2D câu 4, hit@k/recall@k, điểm cosine bước 6) và 4 khái niệm cốt lõi nên bổ sung. Các lỗi hiển thị mobile và SVG mới ở mức PLAUSIBLE vì chưa mở trình duyệt.
