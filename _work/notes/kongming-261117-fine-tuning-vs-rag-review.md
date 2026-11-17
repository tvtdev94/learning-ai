# Kongming review: fine-tuning-vs-rag

Ngày: 2026-11-17 (Asia/Saigon). Chỉ tư vấn, không sửa file trang.
File: `fine-tuning-vs-rag/index.html`, trạng thái mtime 15:27:35 (955 dòng). File đã đổi trong lúc review (lần đọc đầu 15:23:47, 953 dòng); số dòng dưới đây theo bản 15:27:35.

## Cách kiểm

- Nguồn: `curl` cả 23 URL rồi bóc thẻ, grep câu gốc (không qua WebFetch tóm tắt). arXiv: đọc nguyên abstract; [9] đọc thêm `arxiv.org/html/2312.10997v5` mục II-D.
- Mobile: headless Chrome, iframe 390px và 768px, hai theme; script bấm hết 8 bước stepper, 8 câu quiz, 6 trạng thái máy tính, tìm kiếm và chip từ điển.
- Chart: chụp và xem ảnh 2 SVG desktop (sáng và tối) và 2 `.vflow` ở 390px (sáng).
- Chưa làm: chụp ảnh toàn trang ở 390px, chụp `.vflow` theme tối, test trên Orca. Phiên chủ đề vẫn cần pass Orca.

## Kết quả đạt (không cần sửa)

- Mọi con số trích từ nguồn đều khớp: OpenAI 2026-05-07 / 2026-07-02 / 2027-01-06, nano và ft-o4-mini tắt 2026-10-23, tối thiểu 10 dòng, 50 ví dụ, 50–100, checkpoint 3 epoch cuối, BLEU 87 → 83, 81,5%, 20/40/1.000 USD, 99,999%; Foundry (bảng model, gpt-5 RFT cần lời mời, Developer 24 giờ, cập nhật 2026-10-29); Google (danh sách model SFT/preference/RLFT, "100 examples or more"); Bedrock (3 phương pháp, công thức phí, Claude 3 Haiku chỉ us-west-2); [10] [12] [13] [15] [16] [17] [18] [19] [20] [21] [14] [11] [22] [23].
- Máy tính, tự tính lại mặc định: perA = (3000×2 + 200×8)/1e6 = 0,0076 → A = 760 USD. perB = (500×2 + 200×8)×0,2/1e6 = 0,00052 → 52 USD token + 200 host + 3000/3 = 1.252 USD. Hòa vốn = 1.200 / 0,00708 = 169.492 request. Trang hiển thị đúng 760 / 1.252 / 169.492 / "đắt hơn 492 USD" / "cần thêm 69.492". Các trạng thái 170k, 1M, không phí cố định, B đắt hơn A, A = B đều đúng. Màu chú thích khớp màu thanh.
- Stepper: 19/60 = 32%, 231/300 = 77%, 22/60 = 37%, 246/300 = 82%, 53/60 = 88%, 279/300 = 93%; 35+3 = 60−22, 6+48 = 300−246. Đúng.
- 390px và 768px, hai theme: `scrollWidth` không tràn, không có chữ < 11px, không có cặp màu chữ/nền dưới 4,5:1, 105/105 ô bảng có `data-label`, không có `#src-N` hay `#term-` gãy, không nguồn nào thừa, không lỗi JS.
- Hai SVG desktop: không chữ đè, mũi tên đúng hướng, bốn ô đúng vị trí theo hình quadrant của Gao [9], chú thích khớp màu ở cả hai theme. Mũi tên đỏ "còn lỗi" (đã dời sang x=486) không còn cắt nhãn "làm sai cách".
- Đã được sửa trong lúc review, không tính là phát hiện: placeholder tìm kiếm ("chung cat" → "an toan"), nhánh `be===0` của máy tính, vị trí mũi tên đỏ.

## Phát hiện

### A. Độ chính xác

1. **[medium] Bảng nhà cung cấp, dòng OpenAI (dòng 555) và callout dòng 262: thiếu ngày tắt của chính base model.**
   Evidence: trang SFT [2] ghi "gpt-4.1-2025-04-14, gpt-4.1-mini-2025-04-14, and their fine-tuned versions shut down on January 14, 2027"; trang deprecations [3] có cùng ngày. Trang chỉ viết "Model đã fine-tune vẫn chạy tới khi base model khai tử" và liệt kê gpt-4.1-nano như model còn SFT được, trong khi nano đã tắt 2026-10-23 (trước hôm nay).
   Vì sao quan trọng: người đọc hiểu là model fine-tune còn chạy lâu dài; thực tế bản fine-tune trên gpt-4.1 và 4.1-mini dừng sau chưa đầy 2 tháng. Ghi chú nguồn đã có dữ kiện này (dòng 20) nhưng trang bỏ sót.
   Sửa: thêm "gpt-4.1 và gpt-4.1-mini cùng các bản fine-tune tắt 2027-01-14 [2][3]"; ghi nano là "đã tắt 2026-10-23". Có thể thêm mốc 2026-07-02 (tổ chức không chạy inference trên model fine-tune trong 60 ngày thì không tạo job được).

2. **[medium] Tên sản phẩm Google (dòng 557, 262, 548, 666, từ điển `pref`).**
   Evidence: `<title>` trang [6] hiện là "Introduction to tuning | Gemini Enterprise Agent Platform"; thân trang viết "Agent Platform supports supervised fine-tuning…"; chuỗi "Vertex AI" không xuất hiện trong nội dung trang, chỉ còn trong URL `/vertex-ai/`. Tên bài trong mục Nguồn ("Tune Gemini models", "Vertex AI Docs") cũng không khớp tiêu đề thật.
   Sửa: ghi "Google Cloud (Gemini Enterprise Agent Platform; URL tài liệu vẫn nằm dưới /vertex-ai/)" và sửa tên bài ở `src-6` thành "Introduction to tuning".

3. **[low] "adapter hoặc full" ở cột phương pháp của Google (dòng 557).**
   Evidence: [6] mô tả hai hướng nói chung, chỉ nói nền tảng "supports adapter tuning and serving", và RLFT dùng "parameter-efficient LoRA adapter". Trang không nói Gemini được full fine-tune.
   Sửa: đổi thành "adapter (parameter-efficient)"; giữ câu định nghĩa full fine-tuning ở bảng LoRA.

4. **[medium] Ca Iceland: sai loại việc và sai nguyên nhân (dòng 585; cũng ở bước 7 stepper).**
   Evidence: [4] là sửa lỗi câu tiếng Iceland ("correct Icelandic sentences… using as few word changes as possible"), không phải dịch. Nguyên nhân OpenAI nêu: "this is a behavior optimization problem where additional context will not necessarily help… RAG actually confounded the model by giving it extra noise when it had already learned the task". Trang viết nguyên nhân là "model chưa từng học cách dùng tài liệu đưa vào"; đó là suy luận của trang, ghép từ lời khuyên "fine-tune with RAG examples" ở mục khác của [4].
   Sửa: "Trong một ca sửa lỗi câu tiếng Iceland… Đây là bài toán hành vi, model đã học xong qua fine-tuning, nên context thêm vào chỉ thành nhiễu." Tách lời khuyên fine-tune với ví dụ có RAG thành ý riêng.

5. **[low] Qi và cộng sự [19] (dòng 579, từ điển `safety` dòng 903).**
   Evidence: abstract ghi "only 10 such examples" là ví dụ "adversarially designed"; dữ liệu lành tính "can also inadvertently degrade… though to a lesser extent". Thẻ từ điển viết như sự thật chung: "Fine-tuning làm yếu khả năng từ chối…".
   Sửa: "10 ví dụ độc hại được thiết kế có chủ đích"; từ điển: "có thể làm yếu".

6. **[low] Carlini [20] dùng cho model fine-tune (dòng 518, thẻ lỗi "nhắc lại dữ liệu khách hàng").**
   Evidence: thí nghiệm trên dữ liệu pre-training của GPT-2, không phải model fine-tune. Việc suy ra cho fine-tune là hợp lý nhưng là suy luận.
   Sửa: thêm "(thí nghiệm trên GPT-2; rủi ro tương tự áp dụng cho dữ liệu fine-tune)".

7. **[low] Khẳng định không có nguồn hoặc nguồn không đỡ.**
   - Dòng 561: "RAG ít bị khóa hơn: chỉ mục tài liệu dùng được với nhiều model." Thiếu nửa còn lại: chỉ mục vector gắn với embedding model; đổi embedding model là phải embed lại cả kho. Thêm một mệnh đề.
   - Dòng 907 (từ điển `retrieval`, gắn [11]): "RAG sai thường do bước này, không phải do model." [11] không nói vậy. Đổi thành "nhiều khi" hoặc bỏ trích dẫn.
   - Lọc theo quyền lúc truy xuất (dòng 518, quiz câu 2 gắn [11]): đúng trong thực hành nhưng [11] không đỡ; trỏ sang `../governance/` thay cho trích dẫn.
   - Dòng 352: "Nhiều nghiên cứu" trong khi dẫn hai bài. Đổi thành "Hai nghiên cứu".
   - Dòng 286, 475: "hiệu quả cộng dồn" viết như chắc chắn, trong khi chính trang nêu ca BLEU giảm. Đổi thành "có thể cộng dồn".

8. **[low] Chi tiết nhỏ.** Dòng 615: [4] ghi 40 USD cho ca "escalated to a human when they shouldn't", tức chuyển người không cần thiết; và khách bỏ đi được giả định ở 5% số ca. Dòng 573/901: "huấn luyện liên tục" dễ hiểu sai; [18] là "continual instruction tuning", nên viết "fine-tune nối tiếp qua nhiều tác vụ".

### B. Khái niệm còn thiếu

9. **[medium] Structured output cho lỗi định dạng.** Trang xếp "sai định dạng, thiếu trường JSON" vào lỗi hành vi → fine-tuning (dòng 248, 751). Người mới sẽ kết luận phải fine-tune để có JSON đúng. Thêm một câu ở bước 3 hoặc ④b: lỗi schema thì thử structured output (ràng buộc theo JSON schema) trước, link `../tool-calling-structured-output/`. Chưa có nguồn trong ghi chú; cần dẫn nguồn khi thêm.

10. **[medium] Fine-tune embedding model hoặc reranker.** Trang chỉ nói fine-tune model sinh. Với người xây RAG doanh nghiệp, "fine-tuning trong RAG" còn là tinh chỉnh bộ truy xuất. Thêm một thẻ từ điển hoặc một dòng ở ô "Kết hợp" (cần nguồn).

11. **[medium] Tự host model mở trọng số.** Sau phần OpenAI thu hẹp, câu hỏi tự nhiên là "vậy fine-tune ở đâu". Trang có LoRA/QLoRA nhưng không nêu lựa chọn: dịch vụ quản lý (Foundry, Google, Bedrock) hay tự huấn luyện và tự host model mở (tự lo GPU, serving, bù lại không phụ thuộc lịch khai tử). Thêm một dòng vào bảng nhà cung cấp hoặc callout "Bài học".

12. **[low] Tool cho dữ liệu có cấu trúc, thời gian thực.** Hiện chỉ có một câu ở đáp án quiz 8. Người học hướng tới agent nên thấy nhánh này trong bảng so sánh: giá, tồn kho, trạng thái đơn → gọi tool, không RAG, không fine-tune. Link `../ai-agent/`.

13. **[low] Base model thế hệ mới.** Trước khi huấn luyện lại, chạy eval với base model mới và prompt tốt nhất; nhiều khi không cần fine-tune nữa. Hợp với bước 8 stepper. Đây là ý kiến của reviewer, chưa có nguồn.

14. **[low] Độ nhiễu của bộ eval nhỏ.** Bộ A chỉ 60 câu: lệch 2–3 câu là 3–5 điểm %. Thêm một câu ở mục 9.

### C. Sư phạm và tiếng Việt

15. **[medium] Lời kể bước 2 không khớp số (dòng 731–732, 746).**
   Evidence: bộ A 32% → 37%, bộ B 77% → 82%; cả hai đều tăng đúng 5 điểm %. Nhưng trang viết "Bộ B tăng rõ. Bộ A gần như đứng yên".
   Sửa gọn nhất: `P0=21` (35% → 37%). Hoặc tăng `T1` và chỉnh `TK+TB` cho bằng `300−T1`.

16. **[medium] Quiz: hai câu có hơn một đáp án đúng theo chính quy ước của trang.**
   - Câu 1 (dòng 798): "chính sách mới ban hành tuần trước". Phần dẫn nói "Prompt gồm cả việc đưa thẳng tài liệu nhỏ vào prompt", nên chọn Prompt cũng hợp lý. Thêm "kho chính sách vài nghìn trang".
   - Câu 6 (dòng 803): đề hỏi "thử trước tiên", đáp án là Kết hợp. Theo flow của trang, phải thử prompt và rerank trước. Thêm "đã chỉnh prompt và rerank mà chưa hết".

17. **[low] Hai cách đánh số cho cùng một quy trình.** Mục 1 dùng "Bước 0, 1, 2a, 2b, 3, Lặp lại" (dòng 252–260); mục 2 dùng ①–⑤, trong đó ③ Chẩn đoán không có ở mục 1. Dùng chung ①–⑤ và thêm thẻ "Chẩn đoán" vào mục 1.

18. **[low] Thuật ngữ dùng trước khi giải thích.** "SFT, DPO, RFT, distillation" xuất hiện trong flow (dòng 284, 327) trước mục 5 và 7; thêm "(các kiểu fine-tuning, xem mục 7)". "USD/MTok" (dòng 380): ghi "USD mỗi triệu token". "BLEU" (dòng 585): thêm "điểm đo độ giống với bản tham chiếu". "guardrail" chưa giải thích.

19. **[low] Từ không thống nhất.** "index" (SVG, vflow mục 6) và "chỉ mục" (thân bài); chọn một, hoặc ghi "chỉ mục (index)" lần đầu. Tiếng Việt còn lại tự nhiên, đoạn ngắn, đủ dấu.

### D. JS, HTML, mobile

20. **[low] `.tag.warn` không có CSS (dòng 587, 590).**
   Evidence: computed `color: rgb(91,99,112)` trên `rgb(240,238,232)`, tức thẻ xám mặc định; CSS chỉ có `.tag.p1–p4` và `.tag.bad` (dòng 64–68). Trang mẫu `rag/index.html` cũng không có `.tag.warn`.
   Sửa: thêm `.tag.warn{background:var(--warn-soft);color:var(--warn)}` hoặc dùng `tag p4`.

21. **[medium-low] Vùng bấm < 40px ở bề rộng 601–1080px.**
   Evidence ở 768px: mục lục 31px, `.home` và nút theme 33px, chip 33px, nút quiz 37px. Quy tắc `min-height:40px` chỉ nằm trong `@media (max-width:600px)` (dòng 187, 211). Điện thoại xoay ngang (khoảng 740–930px) rơi vào khoảng này.
   Sửa: chuyển các quy tắc `min-height` sang `@media (max-width:1080px)` hoặc `@media (pointer:coarse)`.

22. **[low] Link "Liên quan" trong từ điển cao 39px ở 390px** (font 14px + padding 10px). Tăng padding lên 11px. Link nội dòng trong đoạn văn cao 20px, coi là ngoại lệ như citation.

23. **[low] Câu ghi chú khi vừa qua điểm hòa vốn (dòng 865).** Ở 170.000 request trang ghi "cao hơn điểm hòa vốn 1,0 lần". Khi tỷ số < 1,1 nên ghi "vừa qua điểm hòa vốn", hoặc in phần trăm.

24. **[low] CSS chết:** `.cost-line`, `.seg-pre`, `.seg-dyn`, `.seg-out`, `.big`, `.formula`, `.vflow .ar.skip`, `.seg-know`/`.seg-beh` trùng vai với lớp khác. Không ảnh hưởng hiển thị; dọn nếu tiện.

### E. Chart

25. **[medium-low] `.vflow` bản đồ quan hệ, mobile (dòng 439).**
   Evidence (ảnh 390px): thứ tự là Prompt ↓ RAG ↓ "hoặc: hành vi chưa ổn (từ prompt)" ↓ Fine-tuning. Mũi tên ↓ nằm giữa RAG và Fine-tuning nên đọc thành "RAG dẫn tới Fine-tuning"; bản desktop thì mũi tên đi từ Prompt.
   Sửa: bỏ dấu ↓ ở dòng đó và viết "Cũng từ Prompt, khi hành vi chưa ổn:"; hoặc đặt hai nhánh RAG và Fine-tuning dưới một dòng "từ Prompt, tùy loại lỗi" như vflow mục 2 đã làm ("tách làm hai nhóm").

26. **[low] Flow desktop thiếu nhãn ở mũi tên ② → ③.** Bản mobile có "chạy eval, còn câu sai", bản desktop không có. Thêm nhãn 13px phía trên mũi tên, hoặc ghi vào dòng phụ của ô ③.

## Câu hỏi còn mở

- Mục 9–13 cần nguồn mới nếu đưa vào trang; theo brief, không thêm khẳng định chưa mở nguồn.
- Trang [6] có tên sản phẩm mới; chưa kiểm trang nào của Google xác nhận việc đổi tên từ Vertex AI, chỉ thấy tiêu đề và nội dung hiện tại.

## Kết quả áp dụng (phiên chủ đề, 2026-11-17)

Mỗi phát hiện đã được kiểm lại với nguồn hoặc trên trang (Orca, 390/768/1280px, hai theme).

| # | Kết quả | Ghi chú |
|---|---|---|
| 1 | Sửa | Callout mục 1 thêm mốc 2027-01-14 cho gpt-4.1/4.1-mini và bản fine-tune [1][2][3]; bảng nhà cung cấp ghi nano "đã dừng 2026-10-23", full/mini "dừng 2027-01-14". |
| 2 | Sửa | Kiểm lại [6]: trang dùng tên "Gemini Enterprise Agent Platform", "Vertex AI" chỉ còn trong URL. Đổi tên ở bảng, callout, ghi chú LoRA, thẻ `pref`, và `src-6` ("Introduction to tuning"). Không khẳng định "đổi tên" vì chưa có trang xác nhận. |
| 3 | Sửa | Google: "dạng adapter (parameter-efficient). Trang không nêu full fine-tuning cho Gemini." |
| 4 | Sửa | Kiểm lại [4]: ca sửa lỗi câu tiếng Iceland; nguyên nhân theo OpenAI là model đã học xong việc nên context thành nhiễu. Sửa thẻ lỗi và bước 7 stepper; giải thích BLEU. |
| 5 | Sửa | "10 ví dụ độc hại được thiết kế có chủ đích"; thẻ từ điển dùng "có thể làm yếu… (ở mức nhẹ hơn)". |
| 6 | Sửa | Thêm câu: thí nghiệm trên dữ liệu pre-training GPT-2, rủi ro tương tự cần tính với dữ liệu fine-tune. |
| 7 | Sửa | "RAG ít bị khóa" thêm vế embedding model; thẻ `retrieval` đổi "nhiều khi"; quiz 2 tách phần lọc quyền sang link `../governance/` (không gắn [11]); "Hai nghiên cứu"; "có thể cộng dồn" ở vflow, SVG và mục 1. |
| 8 | Sửa | 40 USD là "chuyển cho người khi không cần thiết", thêm "kèm giả định về tỷ lệ"; "fine-tune nối tiếp qua nhiều tác vụ" (2 chỗ). |
| 9 | Sửa | Thêm nguồn [24] OpenAI Structured model outputs. Bước 2 stepper bật structured output; bước 3 ghi lỗi JSON đã được xử lý; callout mục 7. |
| 10 | Sửa | Thêm nguồn [25] Sentence Transformers; đoạn ở mục 6 và thẻ từ điển "Fine-tune embedding model" (38 khái niệm). |
| 11 | Sửa | Callout "Bài học" thêm lựa chọn tự huấn luyện model mở trọng số bằng LoRA/QLoRA [15][16][23], kèm đánh đổi. |
| 12 | Sửa | Callout "Còn một lựa chọn thứ tư: tool" ở mục 7, link Tool calling và AI agent. |
| 13 | Sửa | Bước 8 stepper: chạy lại eval trên base model mới trước khi huấn luyện lại; dẫn [5] "reassess quality… base model approaches retirement". |
| 14 | Sửa | Callout mục 9: 60 câu → mỗi câu ~1,7 điểm %, chênh 2–3 câu có thể là ngẫu nhiên. |
| 15 | Sửa | `P0=21` (35% → 37%), khớp lời kể "gần như đứng yên". |
| 16 | Sửa | Quiz 1 thêm "kho chính sách khoảng 3.000 trang"; quiz 6 thêm "đã chỉnh prompt và rerank mà chưa hết". |
| 17 | Sửa | Mục 1 dùng ①, ②, ③ (thêm thẻ Chẩn đoán), ④a, ④b, ⑤ khớp sơ đồ mục 2. |
| 18 | Sửa | Flow mobile ghi "(các kiểu fine-tuning, xem mục 7)"; "USD mỗi triệu token"; giải thích BLEU và guardrail. |
| 19 | Sửa | "index" → "chỉ mục" trong SVG và vflow mục 6. |
| 20 | Sửa | Thêm `.tag.warn`. |
| 21 | Sửa | `min-height:40px` cho TOC, nút home/theme, chip, stepper, quiz chuyển sang `@media (max-width:1080px)`. Đo lại ở 768px: không còn vùng bấm < 40px. |
| 22 | Sửa | Padding link "Liên quan" 11px. |
| 23 | Sửa | Khi lưu lượng < 1,1× điểm hòa vốn: "vừa qua điểm hòa vốn, chỉ cao hơn N%". |
| 24 | Sửa | Xóa `.cost-line`, `.seg-pre/dyn/out`, `.big`, `.formula`, `.vflow .ar.skip`. |
| 25 | Sửa | vflow mục 6: thêm dòng "từ Prompt, tách theo loại lỗi"; mũi tên tới Fine-tuning ghi rõ "cũng đi thẳng từ Prompt, không qua RAG". |
| 26 | Sửa | Thêm nhãn "còn sai" trên mũi tên ② → ③ ở SVG desktop; kiểm ảnh không đè chữ. |

Không bác bỏ phát hiện nào. Sau khi sửa: 25 nguồn, mọi `#src-N` tồn tại và đều được trích; console 0 lỗi; scrollWidth = innerWidth ở 390/768/1280; không chữ < 11px; không cặp màu < 4,5:1 ở hai theme.
