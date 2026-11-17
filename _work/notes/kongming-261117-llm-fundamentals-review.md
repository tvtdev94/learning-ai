# Kongming review: llm-fundamentals (Cách LLM hoạt động)

Ngày: 2026-11-17 · File: `llm-fundamentals/index.html` (1094 dòng) · Chỉ tư vấn, không sửa file nào ngoài report này.

## Tóm tắt

Trang đúng về cơ bản, số liệu mô phỏng khớp khi tính lại, không tràn ngang ở 390px, không có chữ dưới 11px, mọi anchor và link nội bộ hợp lệ. Cần sửa trước khi publish: (1) khái niệm "thinking" được nhắc 3 lần nhưng không giải thích, trong khi dòng model Claude hiện tại bật thinking mặc định; (2) vài chỗ nói mạnh hơn nguồn; (3) máy tính mục 8 khó dùng trên điện thoại (form 965px, thanh context gần như vô hình).

**Lưu ý:** file bị sửa trong lúc review (sơ đồ mục 10 đổi đường nối, số thập phân đổi sang dấu phẩy). Số dòng dưới đây lấy theo trạng thái lúc 10:25, đã grep lại từng phát hiện.

## Cách kiểm

- Mở lại 6 nguồn nhà cung cấp hôm nay: [1] [11] [14] [15] [19] [20]. 14 nguồn còn lại (bài báo, blog) chỉ đối chiếu với câu trích trong file ghi chú, **không mở lại**.
- Tính lại softmax/top-p, tokenizer, glossary bằng Node trên đúng code của trang.
- Đo layout bằng Chrome headless trên bản sao tạm, khung 390px và 1280px; xem ảnh chụp flow, map (desktop, sáng), sampling, token, chi phí (mobile, sáng).
- **Chưa kiểm:** chế độ tối bằng mắt, stepper bước 7 trên mobile bằng ảnh (chỉ tính), thiết bị iOS thật.

## A. Độ chính xác so với nguồn

| # | Mức | Vị trí | Bằng chứng | Cách sửa |
|---|---|---|---|---|
| 1 | trung bình | dòng 471, 788, 1036 | Trang viết Opus 5.5 "không nhận" temperature/top_p/top_k, "không cho chỉnh". Nguồn [15] chỉ ghi "Omit `temperature`, `top_p`, and `top_k`" và tiêu đề "Sampling parameters removed". Guide nói rõ "Where an item says a setting is rejected, the API returns a 400 error", và mục sampling **không** dùng chữ "rejected". | Viết "tài liệu yêu cầu bỏ ba tham số này và điều khiển bằng prompt"; ở glossary: "một số model mới đã bỏ tham số này". |
| 2 | trung bình | dòng 353 (Hệ quả 2) | "Model không nghĩ xong rồi mới viết" dẫn [5][7], hai nguồn này không nói vậy. Bảng [14] ghi Thinking = "Adaptive (always on)" cho Fable 5.2 và Opus 5.5, tức model có sinh phần suy nghĩ trước câu trả lời. | Đổi thành "Model không soạn sẵn cả câu rồi mới viết: chữ được chốt từng token, không sửa lại được". Thêm một câu dẫn sang thinking (xem #13). |
| 3 | thấp | dòng 1049 (prompt caching) | "giúp token đầu nhanh hơn" dẫn [19]. Nguồn chỉ nói "Prompt caching can reuse an eligible exact prefix match" và bảo "compare TTFT for requests with and without cache hits", không khẳng định. | "có thể giúp token đầu nhanh hơn, hãy đo TTFT khi có và không có cache hit". |
| 4 | thấp | dòng 1051 (Latency) | Trang: "độ dài prompt và độ dài câu trả lời". [1] ghi "model size, hardware capabilities, network conditions, and the complexity of the prompt and the generated response". Câu về độ dài nằm ở [14]: "Actual latency depends on prompt length, output length, and thinking effort". | Thêm "mạng" và dẫn thêm [14], hoặc dùng chữ "độ phức tạp". |
| 5 | thấp | dòng 492 | "555 nghìn từ **tiếng Anh**". [14] chỉ ghi "roughly 555k words or 2.5M Unicode characters". | Bỏ "tiếng Anh". |
| 6 | thấp | dòng 1042 | "18 model **đều** giảm" trong khi file ghi chú đã quyết định bỏ chữ "đều" ở thân bài. | "Chroma thử 18 model, hiệu năng giảm khi input dài ra". |
| 7 | thấp | dòng 1037 | "top-p = 0,9 bỏ phần đuôi chiếm 10% còn lại". Tính lại ở T=1, p=0,9: giữ 5 token (cộng dồn 94,7%), loại 3 token chỉ chiếm 5,3%. | "bỏ phần đuôi chiếm **không quá** 10%". |
| 8 | thấp | dòng 447, 1034 | "Greedy dễ cho văn bản nhạt, lặp lại" nói như quy luật chung, rồi bảng mục 11 lại khuyên để temperature thấp cho trích xuất. Kết quả của [8] là về sinh văn bản mở (chưa mở lại bài). | Thêm "khi viết văn bản dài, tự do"; với task có đáp án ngắn thì greedy vẫn hợp. |
| 9 | thấp | dòng 281 | "LLM không có trí nhớ giữa các lần gọi" chỉ dẫn [11]. [20] có câu trực tiếp hơn: "stateless multi-turn conversations". | Thêm [20] và câu trích vào file ghi chú. |
| 10 | thấp | dòng 263 | "tốc độ đều đo bằng token" mơ hồ. [20]: "bills and rate-limits by token counts". | "giới hạn tần suất (rate limit)". |
| 11 | thấp | dòng 378 | "Thuật toán nổi tiếng nhất là BPE": so sánh nhất không có nguồn. | "Một thuật toán phổ biến". |
| 12 | thấp | dòng 815, 821 | Năm xuất bản: theo trí nhớ của tôi TACL in bài Liu ở tập 12 (2024), ACM CSUR in bài Ji năm 2023. **Chưa kiểm hôm nay.** | Mở lại trang tạp chí; hoặc ghi "arXiv 2023" / "arXiv 2022". |

Đã mở lại và khớp: giá $4/$20 và mọi dòng output = 5 × input [14]; batch 50%, cache read 10% [14]; tokenizer từ Claude 4.7 nhiều hơn khoảng 30% token, 3,5 ký tự [1]; token counting [1]; fine-tuning chưa mở trên Claude API [1]; "working memory", context rot, 1M/200k, lỗi 400, `model_context_window_exceeded`, thinking "billed as output tokens", `usage` [11]; `max_tokens`, `stop_reason`, "bills and rate-limits by token counts" [20]; "especially when much of the input is new" [19].

## B. Khái niệm cốt lõi còn thiếu

| # | Mức | Nội dung | Gợi ý |
|---|---|---|---|
| 13 | cao | **Thinking / reasoning token.** Trang nhắc ở dòng 486, 523, 786 nhưng không định nghĩa. Đây là thứ người học gặp ngay ở request đầu tiên: [14] ghi thinking luôn bật trên Opus 5.5 và Fable 5.2. | Thêm 1 thẻ ở mục 6 hoặc 7 và 1 mục glossary: model sinh token suy nghĩ trước câu trả lời; chúng "are a subset of your `max_tokens` parameter, are billed as output tokens" [11]; làm tăng thời gian tới chữ đầu tiên ([14], [19]: "including any reasoning or tool work before the answer"). Ghi chú ở máy tính mục 8 rằng ô Output phải gồm cả thinking. |
| 14 | trung bình | **Role và chat message chỉ là token.** System, user, tool result được ghép thành một dãy token; model không có ranh giới cứng giữa "lệnh" và "dữ liệu". Đây là gốc của prompt injection, rất quan trọng cho RAG và agent doanh nghiệp. Bước 1 của stepper đã gợi ý nhưng không nói ra. | Thêm 2 câu ở bước 1 hoặc mục 7. Cần tìm nguồn, hiện ghi chú chưa có. |
| 15 | trung bình | **Tool calling ở mức cơ chế.** Lead hứa "gọi tool đều xây trên vòng lặp đó" nhưng không giải thích. | Một thẻ ngắn: model sinh ra một yêu cầu gọi tool dưới dạng token, dừng với `stop_reason: tool_use` [20], ứng dụng chạy tool và gửi kết quả lại thành input. Link `../ai-agent/`. |
| 16 | thấp | `top_k` xuất hiện ở dòng 471 mà không định nghĩa. Model không biết ngày hôm nay (hệ quả của cutoff, ứng dụng phải đưa ngày vào prompt). Token embedding khác embedding model: glossary có nói nhưng chưa link `../embedding-performance/` (thư mục có tồn tại). | Mỗi ý một câu. |

## C. Sư phạm và tiếng Việt

| # | Mức | Vị trí | Vấn đề | Cách sửa |
|---|---|---|---|---|
| 17 | trung bình | Tokenizer đồ chơi, dòng 879–915 | Mẫu tiếng Anh (43 ký tự) và tiếng Việt (41 ký tự) đều ra **10 token**. Người học sẽ kết luận tiếng Việt gọn ngang tiếng Anh, ngược với thông điệp ở dòng 388 và bảng lỗi. Ngoài ra câu ở stepper "Đơn ORD-118 của tôi bao giờ giao?" gõ vào demo ra 20 token, 7 byte lẻ ("Đơn" vỡ thành 5 mảnh), trong khi bước 2 vẽ "Đơn" là 1 token. | Bớt vài mục tiếng Việt khỏi `VOCAB` để mẫu tiếng Việt ra nhiều token hơn rõ rệt, hoặc thêm câu "từ điển ở đây chọn tay, đừng so hai ngôn ngữ bằng demo này". Thêm `'đơn'` vào từ điển cho khớp bước 2. |
| 18 | thấp | Bản đồ mục 10, dòng 600–604, 660–671, 675 | Ba ô cam (Context window, Chi phí, Hallucination) không có đường nối nào, bản dọc dùng `.ar` rỗng, nhưng chú thích bảo "Đọc theo chiều mũi tên". | Thêm nhãn ngắn trong ô ("áp lên: Prompt → Output"…) hoặc đổi chú thích thành "Ba ô cam là hệ quả chung của cả dòng dưới". |
| 19 | thấp | Mô phỏng mục 6 | Ứng viên là mảnh âm tiết ("xử", "vận", "kiểm", "chuẩn") mà không giải thích. | Thêm "mỗi ứng viên là token đầu của một từ: xử (lý), vận (chuyển)…". |
| 20 | thấp | dòng 425 so với 416 | Câu "mỗi token chú ý tới mọi token khác" đứng ngay sau câu "chỉ nhìn các vị trí trước nó". | "mỗi token có thể chú ý tới các token trước nó, nên số cặp tăng theo n²". |
| 21 | thấp | Câu chữ | Dòng 681 "Ba nơi kiến thức của LLM có thể đến từ" (dịch sát tiếng Anh). Dòng 525 "Hai con số cần tách". Dòng 353 "kéo theo phần sau". Nút "T = 0.3", "T = 1.8" dùng dấu chấm trong khi phần còn lại dùng dấu phẩy. | "Ba nguồn kiến thức của LLM"; "Hai con số cần đo riêng"; "kéo phần sau sai theo"; "T = 0,3". |

Dấu tiếng Việt: file ở dạng NFC, không thấy chữ thiếu dấu.

## D. JS / HTML / mobile 390px

Đo được: `scrollWidth` 375 = bề rộng khung trừ thanh cuộn, không phần tử nào tràn; không có chữ dưới 11px (kể cả chữ SVG ở 1280px); chữ trong SVG cách mép ô ít nhất 6px; localStorage đều nằm trong try/catch (dòng 17, 836–837).

| # | Mức | Vị trí | Bằng chứng | Cách sửa |
|---|---|---|---|---|
| 22 | trung bình | dòng 210, 218, 128 | Ở 390px, `.calc` xếp 1 cột: 12 ô nhập cao **965px**; `.out-grid` và `.kpi` cũng 1 cột (cần 330px cho 2 cột, chỉ có khoảng 328px). | `.calc` và `.out-grid`: `minmax(140px,1fr)`; `.kpi .card{min-width:130px}`. |
| 23 | trung bình | dòng 990–991 | Thanh context với số mặc định: các đoạn rộng 2,3 / 1,5 / 6,2 / 9,3 / 0,1 / 0,8 px (tổng khoảng 20px trên 326px). Không nhìn ra "phần nào chiếm nhiều nhất". | Thêm thanh thứ hai chuẩn hóa theo tổng token đã dùng (tỷ lệ thành phần), giữ thanh hiện tại cho "đã dùng bao nhiêu % window". |
| 24 | trung bình | dòng 88, 186 | `#tokInput` và `#glossSearch` dùng `font:inherit` nên là 15px trên mobile. Safari iOS tự phóng to trang khi focus ô nhập dưới 16px (hành vi đã biết, chưa thử trên máy thật). Ô của máy tính đã đặt 16px. | Thêm `font-size:16px` cho hai ô này. |
| 25 | thấp | dòng 953 | Ngưỡng `cum>=P-1e-9` loại token ngay cả khi top-p = 1,00: T=0,05 còn 3/8, T=0,10 còn 5/8, T=0,15 còn 6/8, T=0,20–0,25 còn 7/8. Ở T=0, 7 dòng hiện "bị loại" như thể do top-p. | Nếu `P>=1` thì giữ tất cả. Ở T=0 ghi "greedy: chỉ chọn token cao nhất" thay vì gạch ngang. |
| 26 | thấp | dòng 191, 122 | Vùng bấm dưới 40px: hai thanh trượt cao 36px; `summary` một dòng cao 25px (câu 4, 5, 7). | `height:40px` cho range; `details summary{padding:8px 0}`. |
| 27 | thấp | dòng 868 (bước 7) | Dòng dài nhất trong `<pre>` có 41 ký tự, khoảng 369px ở chữ mono 15px, khung chỉ khoảng 300px nên bị gãy dòng, lệch cột. Tính tay, chưa chụp ảnh. | Rút gọn: `input : 180 × $3/MTok = $0,00054`. |
| 28 | thấp | dòng 315, 344, 608 | Đầu mũi tên dùng `fill="var(--muted)"` nên đường nét đứt màu tím có đầu mũi tên xám (thấy trên ảnh flow và map). | Thêm marker thứ hai `fill="var(--p2)"` cho hai đường tím. |
| 29 | thấp | dòng 459, 222 | `aria-live` trên `#distOut` đọc lại 8 dòng mỗi lần kéo thanh trượt. Selector `.samples button` không khớp phần tử nào. | Chuyển `aria-live` sang `#distSummary`; bỏ selector thừa. |

## E. Chart và mô phỏng: số tính lại

| Thành phần | Kết quả |
|---|---|
| Flow SVG + vflow | Mũi tên đúng hướng; vòng lặp đi từ "Token mới" về "Token IDs" ở cả hai bản; màu viền khớp (Transformer tím, Xác suất/Sampling xanh dương, Token mới xanh lá). Chỉ có #28. |
| Map SVG + vflow | Đường "trọng số" đi từ "Model trợ lý" xuống "Transformer", nhãn không đè đường. Xem #18, #28. |
| Tokenizer | Anh 43 ký tự/10 token; Việt 41/10; mã đơn 37/17 (3 byte lẻ); từ hiếm 46/12 ("Un", "believ", "ably" đúng như mô tả); từ ít gặp 42/45 (21 byte lẻ). Xem #17. |
| Attention | Tổng 0,41+0,03+0,12+0,17+0,04+0,09+0,02+0,12 = 1,00. Chỉ hiện token đứng trước và chính "Nó", khớp với mask. |
| Softmax T=1 | 41,36 / 22,70 / 15,22 / 9,23 / 6,19 / 3,75 / 1,38 / 0,17 %. Trang hiện 41,4% và " nấu" 0,2%: khớp. |
| T=0,3 | 84,76 / 11,47 / 3,02 / 0,57 / 0,15 / 0,03 / ~0 / ~0 %. |
| T=1,8 | 28,29 / 20,27 / 16,23 / 12,29 / 9,84 / 7,46 / 4,28 / 1,33 %. |
| T=1, top-p 0,9 | Giữ 5 token: 43,7 / 24,0 / 16,1 / 9,7 / 6,5 %. |
| Checklist w1c | " nấu" vượt 1% từ T = 1,65 (1,063%); T = 1,60 là 0,976%. Làm được. |
| Máy tính mặc định | 12.600 + 500 token; 6,55% của 200.000; $0,03780 + $0,00750 = $0,04530; $90,60/ngày; $2.718,00/30 ngày; 10,8 giây; output 17% chi phí, 3,8% token. Trang hiện đúng các số này. |
| Stepper bước 7 | 180 × 3/1e6 = 0,000540; 35 × 15/1e6 = 0,000525; tổng 0,001065; × 10.000 = $10,65. Output/input = 19,4% token, 49,3% tiền: câu "1/5 … gần nửa tiền" đúng. Bước 4: 0,62+0,21+0,09+0,05+0,03 = 1,00. |
| Glossary | 39 thẻ (5/12/9/5/3/5), mọi liên kết "Liên quan" trỏ tới id có thật; tìm không dấu dùng dải U+0300–U+036F đúng. |

## F. Link nội bộ

`../`, `../rag/` (3), `../context-engineering/` (2), `../llm-evaluation/`, `../ai-agent/`, `../prompt-engineering/` (2), cùng `../manifest.webmanifest`, `../sw.js`, `../icons/*`. Tất cả tồn tại, trừ `../prompt-engineering/` chưa có thư mục (được phép vì đang làm song song; phải có trước khi publish). Mọi `#src-1` đến `#src-20` đều có id và đều được dẫn.

## Thứ tự nên sửa

1. #13 (thinking), kèm #2.
2. #1, #22, #23, #24.
3. #14, #15, #17.
4. Các mục "thấp" còn lại, gộp một lượt.

## Giả định

- Người học dùng API Claude là chính, nên ưu tiên khớp tài liệu Anthropic (tin cậy trung bình; nếu trang muốn trung lập nhà cung cấp thì #13 nên dẫn thêm nguồn OpenAI [19]).
- Ảnh chụp bằng Chrome headless desktop phản ánh đúng layout điện thoại, trừ thanh cuộn và hành vi riêng của iOS (tin cậy cao cho layout, thấp cho #24).

Status: DONE_WITH_CONCERNS
Summary: Trang chính xác về số liệu và không vỡ layout, nhưng cần bổ sung khái niệm thinking, hạ giọng vài câu nói quá nguồn và sửa máy tính mục 8 trên mobile. Chưa kiểm bằng mắt chế độ tối, chưa mở lại 14 nguồn bài báo, và file đã bị sửa trong lúc review.

## Kết quả áp dụng (phiên chủ đề, 2026-11-17)

Đã kiểm lại từng phát hiện trên nguồn và trên trang chạy thật (Orca, port 8781).

| # | Kết quả | Ghi chú |
|---|---|---|
| 1 | Sửa | "yêu cầu bỏ temperature, top_p, top_k khỏi request" ở mục 6, câu hỏi 3 và glossary. Đã xác nhận [15] chỉ ghi "Omit", không ghi "rejected". |
| 2 | Sửa | Hệ quả 2 đổi thành "Chữ được chốt từng token", [5][7] chỉ đỡ phần "dựa trên token trước"; thêm câu dẫn sang thinking với nguồn [21]. |
| 3 | Sửa | Glossary prompt caching: "có thể giúp token đầu nhanh hơn, hãy đo TTFT khi có và không có cache". |
| 4 | Sửa | Glossary latency thêm mạng, mức thinking; dẫn [1][14]. |
| 5 | Sửa | Bỏ "tiếng Anh" sau 555 nghìn từ. |
| 6 | Sửa | Glossary context rot bỏ chữ "đều". |
| 7 | Sửa | "không quá 10% xác suất". |
| 8 | Sửa | Greedy: hợp câu ngắn; nhạt và lặp khi viết văn bản dài, tự do (thẻ mục 6 và glossary). |
| 9 | Bác bỏ | [11] đã đủ ("Input phase: Contains all previous conversation history plus the current user message"); chưa tự mở câu "stateless" trên [20] nên không thêm. |
| 10 | Sửa | "giới hạn tần suất gọi (rate limit)"; [20] "bills and rate-limits by token counts". |
| 11 | Sửa | "Một thuật toán phổ biến là BPE". |
| 12 | Sửa | Nguồn [12], [18] ghi "arXiv 2023/2022, đăng ở TACL / ACM Computing Surveys", không nêu năm in chưa kiểm. |
| 13 | Sửa | Thêm khối "Thinking: model viết nháp trước khi trả lời" ở mục 6 (2 thẻ) và thẻ glossary; nguồn mới [21] (Anthropic Thinking docs) + [11][14]. Ô Output của máy tính đổi nhãn "Output, gồm cả thinking". |
| 14 | Sửa | Bước 1 stepper thêm 1 đoạn: nhãn role cũng là một phần của dãy đầu vào ([20] "transforms requests into a format suitable for the model"), dẫn tới prompt injection gián tiếp; nguồn mới [22] OWASP LLM01:2025. |
| 15 | Sửa | Thêm thẻ "Gọi tool cũng chạy trên vòng lặp này" (stop_reason tool_use [20], tool_result thành input [11]), link ../ai-agent/. |
| 16 | Sửa một phần | Thêm top-k (thẻ mục 6 + glossary, nguồn [7]); thêm link ../embedding-performance/ ở thẻ "Từ token thành vector". Bỏ ý "model không biết hôm nay": chưa có nguồn mở được. |
| 17 | Sửa | Bớt " nghỉ", " phép", " mỗi" khỏi từ điển đồ chơi: mẫu Việt 22 token (8 byte lẻ) so với Anh 10; thêm "đơn" để khớp bước 2 (câu stepper ra "Đơn" 1 token). Thêm câu "từ điển chọn tay, đừng lấy tỷ lệ này làm số thật". |
| 18 | Sửa | Chú thích map nói rõ ba ô cam là hệ quả chung; bản dọc thêm nhãn "HỆ QUẢ CHUNG CỦA CẢ DÒNG TRÊN". |
| 19 | Sửa | Thêm câu "mỗi ứng viên là mảnh đầu của một từ: xử (lý), vận (chuyển)…". |
| 20 | Sửa | "chú ý tới các token khác trong context, nên số cặp tăng theo n²". |
| 21 | Sửa | "Ba nguồn kiến thức của LLM", "Hai con số cần đo riêng", "kéo phần sau sai theo", nút "T = 0,3 / 1,8"; số thập phân trong mô phỏng và attention đổi sang dấu phẩy. |
| 22 | Sửa | `.calc`, `.out-grid` minmax(140px), `.kpi .card` min-width 130px: ở 390px thành 2 cột. |
| 23 | Sửa | Thêm thanh thứ hai "Thành phần của phần đã dùng (100% = input + output)"; giữ thanh % window. Đã đo: 11,5 / 7,6 / 30,5 / 45,8 / 0,8 / 3,8 %. |
| 24 | Sửa | `#tokInput`, `#glossSearch` font-size 16px. |
| 25 | Sửa | top-p = 1 giữ mọi token; ở T = 0 tóm tắt ghi "Greedy: luôn chọn token này". Đã test T = 0 / 0,05 / 0,2 / 1 với top-p 1: 0 dòng bị gạch. |
| 26 | Sửa | Range cao 40px; `details summary` padding 8px 0. |
| 27 | Sửa | Bước 7 xuống dòng theo cặp "input = … / = $…", dòng dài nhất 30 ký tự; đã chụp ảnh 390px, không gãy dòng. |
| 28 | Sửa | Thêm marker tím `arrP`, `arr2P` cho hai đường nét đứt. |
| 29 | Sửa | `aria-live` chuyển sang `#distSummary`; bỏ selector `.samples button`. |

Phát hiện thêm trong lúc test Orca (trước khi có review): đầu mũi tên "trọng số dùng lúc chạy" ở map bị ô xanh che và nhãn đè lên đường cong. Đã vẽ lại đường thẳng góc (V–H–V) sau ô xanh, mũi tên chạm đỉnh ô Transformer, nhãn nằm trên đoạn ngang.
