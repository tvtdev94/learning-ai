# Kongming review: query-transformation (2026-11-16)

Trang: `query-transformation/index.html`. Trạng thái review: bản đang có trong working tree lúc viết report (file bị sửa giữa chừng: token màu sáng dòng 11–13 và breakpoint `.d-only` dòng 161 đã được đổi sang giá trị chuẩn, số dòng không lệch). Chỉ tư vấn, không sửa trang.

Cách kiểm: đọc toàn bộ 901 dòng; tính lại RRF, hit@3, MRR bằng node; tính tương phản WCAG bằng script; WebFetch 4 nguồn ([1] bản HTML, [10], [11], [18]). **Không mở trình duyệt**: mọi nhận xét về bố cục/kích thước là suy ra từ CSS, cần Orca xác nhận.

## Đã kiểm và đạt (không cần sửa)

- Token sáng dòng 11–13 đúng chuẩn (#2559b8, #16703d, #8f4c0a, #a82f2f, #7440b8), khớp `rag/index.html:11-13`. Tương phản chữ màu trên nền soft: sáng 5,3–5,7; tối 5,1–6,6.
- RRF bước 7 (dòng 651–660): d07 = 1/62+1/61+1/61 = 0,0489; d12 = 1/61+1/62+1/63 = 0,0484; d19 = 0,0161; d31 = d44 = 0,0159. Khớp tính tay.
- Eval mục 9 (dòng 870–883): hit@3 = 4/8 = 0,50 và 6/8 = 0,75; MRR = 0,385 và 0,594. Khớp.
- 23 `#src-N` đều có id đích, cả 23 nguồn đều được trích. TOC 11 anchor đều có section. localStorage đều qua try/catch (dòng 7, 630–631), prefix `qt-`.
- Regex bỏ dấu dòng 846 đúng dải U+0300–U+036F.
- [1] đã mở bản HTML: mục II-B đúng là xếp query rewriting/transformation/expansion vào pre-retrieval của Advanced RAG. [18]: tác giả Josh Asres, 2025, ví dụ phim đúng. [11] khớp.

## Phát hiện

### Độ chính xác và nguồn

1. **High · dòng 496, 585, 835 (glossary `metafilter`)** · Câu "vector store phải hỗ trợ lọc trên trường đó" gắn [18], nhưng bài Elastic không nói điều này (đã mở lại: chỉ có "documents are indexed … with the established metadata fields" và cảnh báo kết quả kém "if the metadata is poorly defined"). · Sửa: gắn [18] chỉ cho ý "metadata phải được định nghĩa tốt"; ý "store phải hỗ trợ lọc" viết thành suy luận không gắn cite, hoặc tìm nguồn riêng.

2. **High · dòng 322** · `include_original=True` được dùng làm bằng chứng cho ý "câu biến đổi không thay câu hỏi ở bước trả lời". Trang [10] chỉ có dòng code đó, không giải thích tham số, và không nói gì về prompt cuối. Theo tên thì tham số liên quan bước tìm, không phải bước trả lời. · Sửa: bỏ câu này. Nếu giữ, chuyển sang phần HyDE và viết "ví dụ của LlamaIndex bật `include_original=True` (tài liệu không giải thích thêm)".

3. **Med · dòng 242, 322, 690** · "Câu truy vấn sau biến đổi chỉ dùng để tìm" đúng với rewrite, multi-query, step-back, HyDE nhưng sai với decomposition: [11] trả lời từng câu con rồi "gather all the intermediate responses and synthesizes a final response"; self-ask [9] cũng vậy. Bước 8 lại mô tả một prompt duy nhất chứa đoạn của A và B, khác flow của nguồn. · Sửa: thêm ngoại lệ "riêng decomposition, mỗi câu con thường được trả lời riêng rồi tổng hợp [11]", và ở bước 8 nói rõ đây là cách làm đơn giản hóa.

4. **Med · dòng 693** · "khoảng 4 lượt gọi LLM trước khi trả lời": đếm theo chính stepper là 5 (bước 2, 3, 4, 5, 6), 6 nếu multi-query chạy cho cả câu con B. · Sửa: ghi "5 lượt", kèm ý "thực tế hay gộp viết lại + routing + bộ lọc vào một lượt gọi structured output".

5. **Med · dòng 784** · Máy tính cho decomposition với câu một ý: 0 lượt LLM, độ trễ = R. Sai mô hình: phải gọi LLM mới biết là không cần tách. Người học sẽ hiểu decomposition miễn phí với câu đơn giản. · Sửa: trả `{ms:L+R,llm:1,ret:1,f:'L + R (gọi LLM rồi quyết định không tách)'}`. (Trường hợp condense không có lịch sử = 0 lượt thì đúng theo [4].)

6. **Low · dòng 789 và 761** · Câu "nhiều bước phụ thuộc": routing hiển thị "chọn nhiều kho" nhưng bộ đếm ghi "Lượt tìm: 1". · Sửa: thêm trường số kho vào QS và dùng cho `ret`.

7. **Low · dòng 216** · "các kỹ thuật này" gồm cả routing, nhưng survey đặt routing ở Modular RAG (II-C1) và mục III-C3, không ở pre-retrieval của Advanced RAG. · Sửa: "xếp việc viết lại, biến đổi, mở rộng truy vấn vào…; routing được nêu như một module của Modular RAG".

8. **Low · dòng 693** · "nhiều hệ thống bỏ qua phần lớn các bước [16]": một bài báo không chứng minh được "nhiều hệ thống". · Sửa: "có thể bỏ qua, theo ý tưởng của Adaptive-RAG".

9. **Low · dòng 232, 830** · "viết một đoạn trả lời giả định": theo trí nhớ của tôi bài HyDE sinh nhiều đoạn rồi lấy trung bình vector (chưa kiểm lại nguồn). · Sửa tùy chọn: "một (hoặc vài) đoạn".

### Khái niệm còn thiếu

10. **High · mục 4 bước self-query, mục 7, mục 8** · Thiếu phân biệt bộ lọc do LLM trích (tiện ích tìm kiếm) với bộ lọc phân quyền (ACL). Người học làm RAG doanh nghiệp rất dễ để LLM sinh luôn bộ lọc phòng ban/quyền truy cập. · Sửa: thêm một callout bad: "bộ lọc quyền phải do hệ thống gắn từ danh tính người dùng, không lấy từ đầu ra LLM", link `../governance/`.

11. **Med · mục 7 hoặc 4** · Thiếu ý gộp nhiều biến đổi vào một lượt gọi (một structured output trả về câu viết lại + kho + bộ lọc) và dùng model nhỏ. Đây là cách chính để giảm cái giá mà trang nhấn mạnh.

12. **Med · dòng 235** · Ẩn dụ lễ tân nói "hỏi lại cho rõ", nhưng trang không có kỹ thuật hỏi lại người dùng (clarification). · Sửa: thêm một câu "khi câu quá mơ hồ, hỏi lại người dùng có thể tốt hơn đoán", hoặc bỏ cụm "hỏi lại cho rõ".

13. **Low · mục 6 hoặc 10** · Chưa nối sang agentic RAG (agent tự viết lại và tìm lặp nhiều vòng) và query construction cho dữ liệu có cấu trúc (text-to-SQL). Một câu kèm link `../multi-agent-agentic-rag/` là đủ.

14. **Low · dòng 232** · Query2doc chỉ có trong glossary. Thêm nửa câu vào thẻ "Đổi dạng": HyDE thay câu hỏi bằng đoạn giả định, Query2doc ghép đoạn giả định vào câu hỏi nên dùng được cho BM25 [14].

15. **Low · liên kết** · Trang chỉ link `../rag/`, `../hybrid-search/`, `../reranking/`. Các thư mục đã có: `../llm-evaluation/` (mục 9), `../knowledge-base/` (metadata), `../governance/`, `../multi-agent-agentic-rag/`.

### Sư phạm và tiếng Việt

16. **Med · dòng 872** · Bảng eval không có câu nào xấu đi khi bật biến đổi, trong khi callout dòng 545 và câu tự kiểm 6 đều nói "có loại bị hại". · Sửa: đổi E8 thành `[…,2,null]` (câu có mã lỗi tụt hạng). Khi đó số không biến đổi thành hit@3 = 5/8 = 0,63 (0,625) và MRR = 0,448; cột có biến đổi giữ 0,75 và 0,594.

17. **Low · dòng 690 và 265** · Tiêu đề bước 8 "LLM trả lời câu hỏi gốc" và nút vflow "câu hỏi gốc" mâu thuẫn với thân bài (dùng câu đã viết lại). · Sửa: "LLM trả lời câu hỏi của người dùng".

18. **Low · dòng 809** · Trạng thái mặc định (Không biến đổi) hiện "Không biến đổi chậm gấp 1,0 lần so với tìm thẳng (80 ms so với 80 ms)". · Sửa: khi `c2.ms===base` hiển thị "bằng tìm thẳng".

19. **Low · cách dùng từ** · Dòng 487, 752 "rỗng kết quả" → "kết quả rỗng". Dòng 842 "lỗi trung thành" → "lỗi mất thực thể". Dòng 222/818/724 dùng ba dạng "hỏng hóc thiết bị / thiết bị hỏng hóc / thiết bị hỏng", nên thống nhất. Dấu tiếng Việt đầy đủ, không thấy lỗi.

20. **Low · dòng 731, 741, 751** · Ghi chú routing rỗng nên đầu ra chỉ còn "Phù hợp." · Sửa: thêm một câu lý do.

### JS/HTML/mobile (suy từ CSS, cần Orca xác nhận)

21. **Med · dòng 127–128** · `summary` không có padding; vùng bấm của câu tự kiểm một dòng chỉ cao khoảng 25px (padding nằm ở `details`, không bấm được). Trang mẫu `rag/index.html:112` có cùng lỗi. · Sửa: chuyển padding vào summary, ví dụ `details{padding:0 14px}` `details summary{padding:10px 0;min-height:40px}`.

22. **Low · dòng 141** · Vùng bấm `sup.cite a` cao khoảng 31px, rộng khoảng 20px, các cite liền nhau như [3][4] dễ bấm nhầm. Thừa hưởng từ trang mẫu (`rag/index.html:125`). · Sửa tùy chọn: padding ngang 6px, `a+a{margin-left:6px}`.

23. **Low · dòng 118–119** · Trên 600px cột nhãn cố định 150px + ellipsis; "Viết lại theo hội thoại" ở 14px ước chừng 150–160px, có thể bị cắt. · Sửa: `170px` hoặc `max-content`.

### Chart/SVG

24. **Med · dòng 461–462** · Mũi tên Multi-query → "Nhiều câu truy vấn" (600,161 → 718,272) cắt mũi tên HyDE → "Vector" (y = 207) tại khoảng x = 649. · Sửa: đổi chỗ hai hàng (HyDE lên y = 142, Multi-query xuống y = 188), đưa ô "Vector của đoạn giả định" lên khoảng y = 126; sửa lại tọa độ dòng 431–432, 444, 453–454, 461–462.

25. **Low · dòng 316, 318** · Hai đường nét đứt màu p1/p3 dùng marker `#arr` màu xám nên đầu mũi tên lệch màu thân. · Sửa: thêm marker riêng hoặc `fill="context-stroke"`.

26. **Low · dòng 657–659** · d31 và d44 cùng điểm 0,0159 nhưng hiển thị hạng 4 và 5. · Sửa: thêm chú thích "đồng hạng, thứ tự tùy cài đặt".

## Câu hỏi còn mở

- Mức sửa ẩn dụ lễ tân (mục 12) và có thêm clarification vào phạm vi trang hay không là quyết định nội dung của tác giả.
- Mục 21, 22 là lỗi chung của hệ thiết kế; sửa riêng trang này hay sửa đồng loạt là việc của phiên chính.

## Kết quả áp dụng (2026-11-16, phiên chính chủ đề)

Mỗi phát hiện đã được kiểm lại trên nguồn (WebFetch) hoặc trong Orca trước khi quyết định.

1. Fixed. Gỡ [18] khỏi ý "vector store phải hỗ trợ lọc" (WebFetch Elastic xác nhận không có câu đó). Viết lại theo [19] (VectorStoreInfo mô tả "metadata filters it supports") và giữ [18] cho ý "metadata định nghĩa kém thì kết quả sai/thiếu". Áp ở mục 7, câu tự kiểm 5, glossary `metafilter`.
2. Fixed. Bỏ câu `include_original=True` (WebFetch [10]: chỉ có trong code, không giải thích).
3. Fixed. Thêm ngoại lệ decomposition ở đoạn mục 2, callout "Điều cần nhớ", và bước 8 (trả lời từng câu con rồi tổng hợp, theo [11]).
4. Fixed. Bước 8 ghi "5 lượt gọi LLM nếu mỗi bước 2–6 là một lượt", thêm cách gộp: auto-retrieval suy ra cùng lúc query + filter [19].
5. Fixed. Decomposition với câu một ý giờ là `L + R`, 1 lượt LLM. Orca: "Gọi LLM thêm: 1 · 680 ms = L + R (gọi LLM rồi mới biết không cần tách)".
6. Fixed. Thêm `stores:2` cho câu nhiều bước; routing hiện "Lượt tìm: 2 · L + R (2 kho tìm song song)".
7. Fixed. Câu survey chỉ xếp rewrite/transformation/expansion vào pre-retrieval; routing nêu riêng (WebFetch bản HTML [1]).
8. Fixed. "theo ý tưởng của Adaptive-RAG, có thể bỏ qua…".
9. Fixed. Đã kiểm bản HTML HyDE: lấy mẫu N đoạn, trung bình vector, có thể tính cả câu hỏi. Sửa thẻ "Đổi dạng" và glossary HyDE.
10. Fixed. Thêm callout bad ở mục 7 + ghi chú ở bước 4 + thẻ glossary "Bộ lọc phân quyền", nguồn mới [24] OWASP LLM08:2025 (đã WebFetch), link `../governance/`.
11. Fixed. Gộp nhiều bước vào một lượt (dẫn [19]) ở bước 8; model nhỏ đã có ở mục 7 [2].
12. Fixed. Bỏ cụm "hỏi lại cho rõ" khỏi ẩn dụ lễ tân, không thêm kỹ thuật chưa có nguồn.
13. Fixed một phần. Thêm một câu nối sang `../multi-agent-agentic-rag/` ở mục 6. Rejected phần text-to-SQL: ngoài phạm vi trang và chưa mở nguồn.
14. Fixed. Thêm Query2doc vào thẻ "Đổi dạng" với [14].
15. Fixed. Thêm `../governance/`, `../knowledge-base/`, `../multi-agent-agentic-rag/`; link RAG trỏ thẳng `../rag/#danh-gia`. Rejected `../llm-evaluation/`: còn là bản nháp chưa xuất bản, và mục đánh giá của trang RAG đã đủ cho chỗ này.
16. Fixed. E8 đổi thành `2 → –`. Orca: hit@3 0,63 (5/8) → 0,75 (6/8); MRR 0,448 → 0,594, khớp tính tay. Thêm câu chỉ ra E8 bị hại.
17. Fixed. Tiêu đề bước 8 và nút vflow đổi thành "câu hỏi của người dùng".
18. Fixed. Khi độ trễ bằng tìm thẳng, ghi "tốn đúng một lượt tìm (80 ms), bằng tìm thẳng".
19. Fixed. "kết quả rỗng", "lỗi mất thực thể", thống nhất "thiết bị hỏng".
20. Fixed. Thêm lý do cho 3 ghi chú routing đang rỗng.
21. Fixed. Padding chuyển vào `summary` + `min-height:40px`. Orca 390px: summary cao 45–70px.
22. Rejected. Vùng bấm cite là thành phần chung của hệ thiết kế (giống `rag/index.html`); sửa riêng một trang gây lệch. Chuyển cho phiên chính nếu muốn sửa toàn site.
23. Rejected. Orca 1280px: không nhãn `.bars .bl` nào bị cắt (scrollWidth ≤ clientWidth với cả 9 nhãn).
24. Fixed. Đổi chỗ hàng HyDE/Multi-query, ô "Vector của đoạn giả định" lên y=126. Ảnh Orca 1280 xác nhận không còn mũi tên cắt nhau.
25. Fixed. Thêm marker `arrP1`, `arrP3` cùng màu nét đứt.
26. Fixed. JS gán đồng hạng: "4. d31 (đồng hạng)", "4. d44 (đồng hạng)".

Sửa thêm ngoài review: token màu sáng và breakpoint 1080px theo `rag/index.html`; khối `pre` tiếng Việt trong demo/stepper dùng font thân bài vì font monospace tách rời dấu (thấy trong ảnh Orca); chú thích RRF nói rõ d07 và d12 cùng có mặt ở cả ba danh sách.
