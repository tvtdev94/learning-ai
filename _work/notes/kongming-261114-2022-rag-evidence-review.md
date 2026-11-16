# Review: trang RAG sau khi gắn nguồn (learning-ai/rag/index.html)

Ngày: 2026-11-14. Reviewer: kongming (advisory, không sửa file trang).
Phạm vi: D:\WORKSPACES\learning-ai\rag\index.html (848 dòng) đối chiếu với research-261114-2022-rag-sources.md.

## Cách kiểm

- Đọc toàn bộ trang và ghi chú nguồn.
- WebFetch lại 18 nguồn: [1] [5] [6] [7] [9] [10] [12] [17] [19] [20] [24] [25] [26] [29] [31] [32] [33] [34]. Riêng [19] là PDF nén, đã tải về và giải nén luồng bằng node để đọc.
- Chạy node kiểm: cú pháp JS, cân bằng thẻ (HTML tĩnh và từng bước stepper), href/id, dữ liệu glossary, tính lại cosine.
- KHÔNG kiểm trên trình duyệt thật. Mọi nhận xét mobile là suy từ CSS, ghi "chưa kiểm trên thiết bị".
- Chưa mở lại: [2] [3] [4] [8] [11] [13] [14] [15] [16] [18] [21] [22] [23] [27] [28] [30] (dựa vào câu trích trong ghi chú nguồn).

## Kết quả tóm tắt

- Không có lỗi mức high. Không có trích dẫn sai nguồn hoàn toàn.
- 4 phát hiện medium (2 về nguồn, 1 về giải thích, 1 về tap target), còn lại low.
- Số minh họa bước 6 đúng. HTML/JS sạch.

## 1. Trích dẫn so với nguồn

### Đã xác nhận khớp (không cần sửa)

| Nguồn | Khẳng định trong trang | Bằng chứng fetch được |
|---|---|---|
| [1] | Mô hình sinh + retriever trên chỉ mục vector Wikipedia; hai bộ phận riêng | Abstract: seq2seq (parametric) + dense vector index of Wikipedia, truy cập bằng neural retriever |
| [5] | Context window gồm cả câu trả lời; độ chính xác giảm khi token tăng | "all the text a language model can reference when generating a response, including the response itself"; "As token count grows, accuracy and recall degrade, a phenomenon known as context rot" |
| [6] | Dễ bỏ sót thông tin ở giữa context dài | Abstract: tốt nhất khi thông tin ở đầu/cuối, giảm khi ở giữa, "even for explicitly long-context models"; TACL 2023 |
| [7] | Mốc 200.000 token, khoảng 500 trang | "smaller than 200,000 tokens (about 500 pages of material)" |
| [9] | 1536/3072 chiều; khuyên cosine; chuẩn hóa thì cosine và Euclid cùng thứ hạng | "normalized to length 1"; "will result in the identical rankings" |
| [10] | Cùng model; đổi model thì embed lại kể cả cùng số chiều; có ngoại lệ tương thích | "aren't comparable"; "Regenerate your corpus even when ... same number of dimensions"; voyage-4 "compatible with each other" |
| [12] | Không có cỡ chunk chung; tác giả, năm 2025 | Schwaber-Cohen và Patel, ngày 2025-06-28; "no one-size-fits-all" |
| [17] | Chroma là "hạ tầng tìm kiếm cho AI" | About: "Search infrastructure for AI" |
| [19] | RRF = tổng 1/(k + thứ hạng), k = 60 | PDF giải nén: "where k =60 was fixed during a pilot investigation" |
| [20] | RRF trong Elasticsearch, mặc định 60, ví dụ BM25 + kNN | "Defaults to 60"; ví dụ standard (BM25) + knn |
| [25] | RAG tĩnh khó với suy luận nhiều bước | "constrained by static workflows" |
| [26] | Hệ agent chậm hơn, tốn hơn, lỗi dồn | "often trade latency and cost for better task performance"; "compounding errors" |
| [29] | hit rate = có ít nhất một đoạn đúng | Mặc định: 1.0 nếu có ít nhất một ID khớp, ngược lại 0.0 |
| [31] | Trên 80% đồng thuận; ba loại thiên lệch | "over 80% agreement"; "position, verbosity, and self-enhancement biases" |
| [32] | RAG vượt fine-tuning không giám sát | "RAG consistently outperforms it"; "struggle to learn new factual information through unsupervised fine-tuning" |
| [34] | Chênh tới 15 lần | "differences up to 15 times in some cases" |

### Phát hiện

**C1 · medium · dòng 503 (bảng mục 7, hàng "Dán toàn bộ tài liệu", cột "Hợp khi")**
- Trang: "Tài liệu ngắn, ít câu hỏi.[7]"
- Nguồn [7] chỉ đỡ vế "tài liệu ngắn". Vế "ít câu hỏi" không có trong nguồn, và còn ngược hướng: [7] nói prompt caching làm cách này nhanh và rẻ hơn ("reducing latency by > 2x and costs by up to 90%"), tức hỏi nhiều lần không phải là điểm yếu.
- Sửa: "Kho nhỏ (dưới khoảng 200.000 token).[7]" và bỏ "ít câu hỏi". Nếu muốn giữ ý chi phí, thêm: "có prompt caching thì hỏi lặp lại vẫn rẻ [7]".

**C2 · medium · dòng 691 (bước 2) và dòng 551 (thẻ "Chunking theo cấu trúc")**
- Trang: "Tiêu đề chương được gắn vào đầu đoạn để đoạn tự đủ nghĩa.[7]" và "thêm ngữ cảnh (vd. tiêu đề mục) vào đầu mỗi chunk ...[7]".
- Nguồn [7] mô tả kỹ thuật khác: ngữ cảnh do LLM viết riêng cho từng chunk ("We used the following Claude 3 Haiku prompt to generate context for each chunk", "usually 50-100 tokens"), không phải gắn tiêu đề chương. Gắn tiêu đề là biến thể đơn giản, [7] không nói tới.
- Sửa: "Tiêu đề chương được gắn vào đầu đoạn để đoạn tự đủ nghĩa. Đây là dạng đơn giản của ý tưởng 'thêm ngữ cảnh vào chunk'; Anthropic dùng LLM viết một đoạn ngữ cảnh ngắn cho từng chunk.[7]"

**C3 · low · dòng 553 (thẻ Agentic RAG)**
- [24] đang gắn vào câu về multi-hop. Abstract Self-RAG nói về lấy đoạn theo nhu cầu và tự phê bình, không nói multi-hop. [25] mới đỡ ý multi-hop.
- Sửa: chuyển [24] lên cuối câu đầu ("...có cần tìm thêm lượt nữa không.[24]"), giữ [25] ở câu multi-hop.
- Ghi chú: [26] không nhắc RAG, chỉ nói hệ agent nói chung. Câu hiện tại dùng "thường" là đủ; có thể viết "như mọi hệ agent" cho rõ phạm vi.

**C4 · low · dòng 581 (LLM-as-judge)**
- "LLM mạnh chấm khớp với người ở mức trên 80%": nguồn nói cụ thể GPT-4, trên bài toán so cặp câu trả lời chatbot, không phải chấm RAG.
- "có thiên lệch như ... câu do chính nó viết": abstract liệt kê self-enhancement là thiên lệch được khảo sát; mức độ bằng chứng trong thân bài chưa kiểm (not verified).
- Sửa: "Một nghiên cứu trên câu trả lời chatbot thấy GPT-4 chấm khớp với người trên 80%, và ghi nhận các thiên lệch có thể gặp: ..."

**C5 · low · dòng 614 (tự kiểm tra câu 5)**
- "nó kém RAG khi cần nạp sự kiện mới [32]" đã rơi mất điều kiện "không giám sát" mà dòng 505 có giữ.
- Sửa: "fine-tuning không giám sát kém RAG khi cần nạp sự kiện mới".

**C6 · low · glossary dòng 774 (Overlap) và 773 (Chunk size)**
- "giúp không mất ý ở chỗ cắt" mạnh hơn nguồn [11] ("helps to mitigate loss of information"). Sửa: "giúp giảm mất ý ở chỗ cắt".
- "128–256 token so với 512–1024 token": nguồn [12] viết "128 or 256" và "512 or 1024", không phải khoảng. Sửa: "128 hoặc 256 token so với 512 hoặc 1024 token".

**C7 · low · dòng 201 ([4])**
- Shuster và cộng sự đo trên chatbot hội thoại có kiến thức. Sửa nhẹ: "Thí nghiệm trên chatbot hội thoại cho thấy...".

**C8 · low · glossary dòng 818 (vị trí số trích dẫn)**
- Số nguồn luôn gắn sau định nghĩa t[4], nhưng ở vài thẻ khẳng định cần nguồn nằm trong ví dụ t[5]: token (con số 15 lần, [34]), chunk-size (128/256, [12]), vector-db (mô tả từng sản phẩm, [14]-[17]).
- Sửa: khi t[5] khác rỗng thì nối `cs` vào cuối dòng ví dụ, hoặc thêm một phần tử thứ 9 chọn vị trí.

**C9 · low · dòng 505 và glossary 768 ([33], chữ "phong cách")**
- Lần fetch này chỉ thấy bảng "Best for": Classification, Nuanced translation, Generating content in a specific format, Correcting instruction-following failures. Câu "desired style and content" trong ghi chú nguồn chưa xác nhận lại được (not verified). Định dạng, phân loại, sửa lỗi làm theo hướng dẫn thì khớp.
- Sửa: mở trang [33] tìm lại câu về style; không thấy thì bỏ "phong cách".

**C10 · low · dòng 642 (URL [19])**
- URL chuyển hướng hai lần và rơi về http: plg.uwaterloo.ca → cormack.uwaterloo.ca/cormack/... → http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf. Nội dung đúng.
- Sửa: trỏ thẳng URL cuối, hoặc dùng trang ACM của bài (chưa kiểm DOI).

### Khẳng định chưa có nguồn nên làm mềm

| Mức | Vị trí | Câu | Gợi ý |
|---|---|---|---|
| low | dòng 228, 606 | embed "rất tốn thời gian, không thể làm lại mỗi lần" | "tốn thời gian và tiền hơn nhiều so với embed một câu hỏi, nên không làm lại mỗi lần" |
| low | glossary 791 | "Tìm 'Điều 15' chính xác hơn vector search" | "thường khớp chính xác hơn" hoặc gắn [7] |
| low | glossary 782 | "HNSW là một thuật toán ANN phổ biến" | bỏ "phổ biến", hoặc kiểm README pgvector [14] có liệt kê HNSW rồi dẫn |
| low | dòng 197, glossary 767 | định nghĩa knowledge cutoff dẫn [2] | [2] chỉ nói "outdated knowledge"; chấp nhận được, hoặc dẫn thêm [1] ("updating their world knowledge") |

## 2. Độ chính xác kỹ thuật

**Số minh họa bước 6: đúng.** Tính lại bằng node từ vector bước 3 và 5:

```
c8: 0.99958  -> trang ghi 0.9996
c7: 0.99089  -> 0.991
c9: 0.88570  -> 0.886
c15: -0.01663 -> -0.017
```

Thứ hạng c8 > c7 > c9 khớp. Demo 2 chiều cũng khớp: câu hỏi 1 ra c8, c7, c9; câu hỏi 4 ra c20, c13, c8, đúng như ghi chú "c20 đứng đầu, hai đoạn còn lại khác chủ đề".

**T1 · medium · dòng 549 và glossary 792 (RRF)**
- Chữ "k" trong 1/(k + thứ hạng) trùng với "k" của top-k dùng khắp trang. Người mới sẽ hiểu k = 60 là lấy 60 đoạn.
- Sửa: thêm "(k ở đây là một hằng số làm mượt, không phải k của top-k)", hoặc đổi ký hiệu thành "c" kèm ghi chú bài gốc gọi là k.

**T2 · low · dòng 567 (MRR)**: thiếu trường hợp không tìm thấy đoạn đúng. Thêm: "không có đoạn đúng trong kết quả thì tính 0".

**T3 · low · dòng 322**: nhãn "A · Augmented" trong khi các chỗ khác ghi "Augmentation". Thống nhất một cách.

**T4 · low · dòng 355**: "Cùng hướng → gần 1", "Vuông góc → gần 0". Về toán là đúng bằng 1 và đúng bằng 0. Viết "bằng 1" / "bằng 0", còn "gần" dành cho trường hợp gần cùng hướng.

Các phần còn lại đúng ở mức khái niệm: hai pha, embedding, chuẩn hóa và thứ hạng cosine/Euclid, chunking/overlap, ANN/HNSW, BM25 (IDF + chuẩn hóa độ dài), cross-encoder, Lost in the Middle, hit@k so với recall@k (ví dụ hit@1 = 1, recall@1 = 0.5 đúng), faithfulness, RAG so với fine-tuning, Agentic RAG. Câu "trong RAG cơ bản LLM không tự đi tìm" đã nhất quán với mục 9.

## 3. HTML / JS

Kết quả chạy kiểm (node):

```
JS syntax OK
src ids: 34 (1..34), uncited sources: [], dup ids: []
terms 42, dups 0, không có rel hỏng, không có số nguồn hỏng
stepper: 8/8 bước cân bằng thẻ mở/đóng
HTML tĩnh: cân bằng thẻ, không có & trần, mọi target=_blank đều có rel=noopener
```

- Mọi `href="#src-N"` có id tương ứng; 34 nguồn đều được trích ít nhất một lần.
- Glossary: bộ lọc `n===(n|0)&&getElementById` an toàn; link trích dẫn không bị handler `a[data-goto]` chặn. `esc()` đủ cho ngữ cảnh text.
- TOC "Nguồn": `#nguon` tồn tại, nằm trong `main` nên IntersectionObserver có theo dõi.
- Chuỗi JS: không có nháy đơn lọt trong chuỗi; `\n` trong `<pre>` đúng.

**B1 · low · dòng 45**: `section{scroll-margin-top:56px}` trong khi header mobile cao khoảng 61px (min-height 40 + padding 20 + viền). Không che chữ vì section có padding trên 22px. Đổi thành 64px cho đồng bộ với `ol.sources li`. Chưa kiểm trên thiết bị.

**B2 · low · mục Nguồn**: không có link quay lại chỗ trích; người đọc phải bấm Back. Tùy chọn, không phải lỗi.

## 4. Mobile 390px (suy từ CSS, chưa kiểm trên thiết bị)

**M1 · medium · dòng 124-126 (tap target số trích dẫn)**
- `sup.cite a` chỉ là chữ 11px, vùng chạm khoảng 18×13px. Các cặp liền nhau như [8][9], [5][6], [32][33] cách nhau 1px nên dễ bấm nhầm.
- Sửa: `sup.cite a{padding:12px 4px}` (padding dọc của phần tử inline không làm đổi chiều cao dòng) và `sup.cite+sup.cite{margin-left:6px}`.

**M2 · low · dòng 85-86**: link "Liên quan" trong thẻ glossary cỡ 13px, cách nhau bằng dấu phẩy. Thêm `padding:8px 2px` hoặc đổi thành chip.

**M3 · low · dòng 737**: tiêu đề SVG "Không gian embedding (thu gọn 2 chiều, minh họa)" ở K = 1.8 dài khoảng 520-560 đơn vị trên 588 khả dụng; font rộng có thể bị cắt. Rút thành "Không gian embedding 2 chiều (minh họa)".

**M4 · low · dòng 734 (ngoài 390px)**: ngưỡng `K` là 500px. Khi SVG rộng 500-655px, chữ 11 đơn vị hiển thị 9-10.9px. Đổi ngưỡng thành `<660`.

**M5 · medium · dòng 75, 143 (ngoài 390px, máy tính bảng)**: SVG desktop hiện từ 601px với `min-width:640px` trên viewBox 1000; chữ 11-12 đơn vị hiển thị khoảng 7-8px ở viewport 601-900px. Nâng breakpoint `d-only`/`m-only` lên khoảng 900px (dùng sơ đồ dọc cho tới đó).

Không thấy vấn đề:
- Tràn ngang: `pre` có wrap; bảng `.stack` xếp dọc (kể cả bảng render trong stepper); TOC và dãy nút bước cuộn bên trong; hai SVG lớn bị ẩn; `ol.sources li` có `overflow-wrap:anywhere` nên URL dài tự xuống dòng; lưới `minmax(280px,1fr)` vừa 358px.
- `sup.cite{line-height:0}` không làm lệch dòng; cỡ chữ có sàn 11px.
- Chữ dưới 11px ở 390px: không có. Nhãn SVG demo ở K = 1.8 ra khoảng 11.8px.
- Nút: home, theme, TOC, chip, nút bước, nút câu hỏi đều có `min-height:40px`.

## Thứ tự sửa đề xuất

1. C1, C2 (hai chỗ nguồn không đỡ đúng câu).
2. T1 (trùng ký hiệu k) và M1 (tap target trích dẫn).
3. C3-C6, C8 (chỉnh chữ và vị trí số nguồn).
4. Phần còn lại tùy thời gian; M5 nếu có người đọc bằng máy tính bảng.

## Câu hỏi còn mở

- [33]: câu về "style" còn trên trang nguồn không? (C9)
- Trang có cần đọc tốt ở 601-900px không? Quyết định M5 phụ thuộc vào đó.
- Chưa có lần kiểm nào trên trình duyệt thật ở 390px; nên chạy một lượt trước khi coi phần mobile là xong.

**Verdict:** Đạt về bằng chứng và kỹ thuật, không có lỗi high; sửa C1, C2, T1, M1 rồi phát hành được.
