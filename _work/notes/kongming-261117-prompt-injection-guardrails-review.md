# Review trang `prompt-injection-guardrails/index.html` (kongming, 2026-11-17)

Trạng thái file lúc review: 1059 dòng, mtime `2026-11-17 13:02:56 +0700`, không đổi giữa lần đọc đầu và lúc viết báo cáo (`stat` hai lần). Số dòng dưới đây theo trạng thái đó. Model chạy review: Claude Fable 5.2.

Kết luận ngắn: trang đạt chất lượng xuất bản về nguồn và số liệu. Không có lỗi mức cao. Có 6 điểm mức trung bình nên sửa trước khi publish (2 chỗ diễn giải sai nguồn, 1 bảng eval tự mâu thuẫn, 2 chỗ ô thử dạy lệch ý, 1 nhóm khái niệm thiếu) và 14 điểm mức thấp.

## 1. Cách kiểm

- Đọc toàn bộ `index.html` (1059 dòng) và mục "Mở lại và bổ sung ngày 2026-11-17" của file ghi chú nguồn.
- Nguồn: tải bản gốc bằng `curl` rồi tìm đúng câu trích (`rg`), không dựa vào tóm tắt. Đã mở: 13 abstract arXiv ([9] [10] [15] [16] [17] [18] [19] [26] [27] [28] [29] [30] [31]), toàn văn HTML arXiv của [17] và [28], OWASP [1] [2] [3] [4] [5] [6] [7] [8] [34], Willison [11] [12] [13] [14], MSRC [20], Microsoft Learn [21], Anthropic [22] (bản `.md` gốc), OpenAI [23], NCSC [24], NeMo [25], LICENSE của PyRIT [32], README của garak [33]. Mọi URL trả HTTP 200.
- Số liệu: tách logic JS của trang (LAYERS, CASES, `evalCase`, bảng EV, công thức 1 − p^N, từ điển T) và chạy trong Node v26.5: 4 preset, cả 64 cấu hình lớp, từng lớp đơn lẻ, bảng eval, KPI, máy tính.
- Từ điển: kiểm id trùng, liên kết "Liên quan" hỏng, số nguồn ngoài 1..34, tìm kiếm không dấu.
- Trích dẫn: 34 nguồn định nghĩa, 34 được dùng, không số nào trỏ vào nguồn không tồn tại.
- Sơ đồ: đọc toạ độ SVG; đo bề rộng nhãn bằng PIL với FreeSans (số đo gần Arial/Helvetica) và DejaVu Sans (font rộng, hay là `system-ui` trên Linux).
- Link nội bộ: kiểm 10 thư mục `../<slug>/` có `index.html`.
- **Not verified:** không render trang trong trình duyệt thật (không chụp ở 390px, không bấm thử); các nhận xét mobile dựa trên đọc CSS và tính bề rộng. Không mở [32] [33] ngoài LICENSE/README. Không kiểm `sw.js` và trang chủ (trang chủ chưa liệt kê chủ đề này, PROGRESS.md ghi "Đang làm").

## 2. Đã xác nhận đúng

**Số liệu trích từ nguồn (khớp nguyên văn abstract):**
- Spotlighting: "from greater than 50% to below 2%", "Using GPT-family models" (dòng 589, 966).
- CaMeL: "77% of tasks with provable security (compared to 84% with an undefended system) in AgentDojo" (dòng 613, 654, 983, 993).
- AgentDojo: "97 realistic tasks", "629 security test cases", "not a static test suite", model mạnh nhất trượt nhiều việc cả khi không bị tấn công (dòng 654, 659, 997).
- Nasr 2025: "bypass 12 recent defenses ... attack success rate above 90% for most", "majority of defenses originally reported near-zero" (dòng 658, 995). Toàn văn xác nhận thêm: Spotlighting, StruQ và PromptGuard nằm trong số phòng thủ bị vượt, nên dòng 589 và 591 dùng [28] là đúng chỗ.
- OWASP Top 10 2025: thứ tự LLM01 Prompt Injection … LLM10 Unbounded Consumption khớp; slug của cả 8 URL OWASP đúng.

**Câu trích khớp nguồn:**
- NCSC [24]: "simply do not enforce a security boundary between instructions and data inside a prompt"; "may never be totally mitigated in the way that SQL injection attacks can be"; "inherently confusable deputy"; "deterministic (non-LLM) safeguards"; "the privileges it has drops to that of the party"; log "full input and output of the LLM"; "failed tool calls or API calls could identify earlier stages of an attack"; "Beware any that claim they can 'stop' prompt injection".
- Anthropic [22]: hai threat model; nội dung ngoài chỉ trong `tool_result`; Claude được huấn luyện để hoài nghi chỉ dẫn trong tool result; bọc JSON để không "break out"; chỉ dẫn của mình để ở lượt `user` sau `tool_result`; sàng lọc kết quả tool; red team; theo dõi liên tục; xử lý người vi phạm nhiều lần. System prompt ở bước 4 là bản dịch sát mẫu của Anthropic.
- OpenAI [23]: "injecting untrusted input directly into developer messages gives attackers the highest degree of control"; "always enable tool approvals ... including reads and writes"; "not foolproof ... an effective first wave of protection"; model có thể gửi cho MCP nhiều dữ liệu hơn người dùng muốn.
- MSRC [20]: "inherent risk"; "does not rely on our ability to block all prompt injections"; "prevention, detection, and impact mitigation"; ảnh markdown rò rỉ "without any user interaction"; chặn "generation of certain untrusted links"; Prompt Shields là "probabilistic classifier-based approach"; ví dụ thư lừa đảo gửi từ tài khoản người dùng.
- Microsoft Learn [21]: user prompt attack và document attack; "primarily trained and evaluated on English content"; chuyển block sang annotate; spotlighting dùng base-64 làm tăng token.
- OWASP [1] [3] [4] [5] [6] [7] [34] và Cheat Sheet [8]: mọi câu trang trích đều tìm thấy nguyên văn (định nghĩa, "do not need to be human-visible", "unclear if there are fool-proof methods", jailbreak là một dạng prompt injection, CV chữ trắng, permission-aware vector database, ba gốc rễ của excessive agency, "must not be delegated to the LLM", "not a security boundary", "A guardrail LLM is itself an LLM", "verify approval for the exact action", "does not establish model robustness").
- Willison [11] [12] [14]: định nghĩa jailbreak và prompt injection, mục "Don't buy a jailbreaking prevention system…", ví dụ số liệu bán hàng, "95% is very much a failing grade", "avoid that lethal trifecta combination entirely" (đúng ngữ cảnh người tự ghép tool), kênh ra "almost limitless", nguyên tắc chung của sáu mẫu, mô tả Action-Selector, Plan-Then-Execute, Map-Reduce, Dual LLM, Code-Then-Execute.
- [18] [19] [25] [26] [27] [30] [31] [32] [33]: khớp (GPT-3.5 và "attack types not seen during training"; hai kênh của StruQ; năm loại rail của NeMo; PromptGuard 2 và alignment check "still experimental"; Gemini chạy tấn công thích ứng liên tục; MIT; Apache-2.0).

**Số do trang tự tính (chạy lại trong Node, khớp mọi câu chữ):**

| Preset | Lọt | Chặn | Chặn nhầm | Hỏi người |
|---|---|---|---|---|
| Chưa có lớp nào | 7/7 | 0 | 0/2 | 0 |
| Chỉ lớp dựa trên model | 4/7 (T4–T7) | 3 | 1/2 (B1) | 0 |
| Chỉ luật, code và người | 1/7 (T7) | 6 | 0/2 | 1 |
| Đủ 6 lớp | 1/7 (T7) | 6 | 1/2 (B1) | 1 |

- T7 lọt ở cả 64 cấu hình. Câu ở dòng 434 và 624 đúng.
- Máy tính: 95% cho 5% / 40,1% / 99,4% / 100% với 1 / 10 / 100 / 1000 lần; 99% và 100 lần cho 63,4% (câu tự kiểm 3 ghi "≈ 63%" đúng).
- Bảng eval: C0 55,0% / 67,5% / 85,0% / 0%; C1 5,0% / 47,5% / 78,3% / 6,7%; C2 0% / 2,5% / 76,7% / 6,7%. KPI: 42,5 điểm %; 67,5% → 2,5%; −8,3 điểm %. "Gần một nửa" và "một ca đổi 2,5 điểm phần trăm" đúng.
- Bước 7 của ví dụ (4 lời gọi bị từ chối, 1 ảnh bị chặn, 1 thư hợp lệ, 0 dữ liệu ra ngoài) khớp bước 5 và 6.

**Khác:**
- Phạm vi phòng thủ: không có payload hay công thức vượt dùng được. Nội dung tấn công đều tả bằng lời. Chỗ sát ranh giới nhất là dòng 813 (mẫu ảnh markdown mang dữ liệu trong URL): đây là đầu ra của model, dùng domain `.example`, đã lược nội dung, và cơ chế này có trong OWASP LLM01 và MSRC. Chấp nhận được, không cần sửa.
- Link nội bộ: cả 10 thư mục tồn tại. Trang MCP có nhắc tool poisoning; trang Governance có ví dụ lọc theo quyền ở retriever.
- Tiền tố localStorage `pig-` không trùng trang nào khác; 6 ô đánh dấu có khóa riêng.
- Từ điển: 50 thuật ngữ, không id trùng, không liên kết "Liên quan" hỏng.
- Mọi bảng đều có class `stack`; các grid (`minmax` 220–300px) vừa bề rộng 390px sau khi trừ padding.

## 3. Phát hiện

### Độ chính xác so với nguồn

**1. Dòng 613 — diễn giải ngược ý Willison về Dual LLM. Mức: trung bình.**
- Trang viết: "không tin cậy 100%, vì người dùng có thể bị lừa dán nội dung độc hại vào".
- Nguồn [13]: "The social engineering aspects also mean that this isn't a 100% reliable solution. A personal AI assistant that can still be co-opted into trying to trick us into copying and pasting out our obfuscated private data is an alarming prospect!" Tức trợ lý bị lợi dụng để dụ người dùng chép dữ liệu riêng **ra ngoài**, không phải dán nội dung độc **vào**.
- Sửa: "…không tin cậy 100%: trợ lý vẫn có thể bị lợi dụng để dụ người dùng tự tay chép dữ liệu riêng ra ngoài (social engineering)."

**2. Dòng 610 — ví dụ Context-Minimization không cho bảo đảm mà mẫu này hứa. Mức: trung bình.**
- Trang viết: "Sau khi tóm tắt, bỏ nguyên văn email khỏi context trước khi soạn thư".
- Nguồn [14]: mẫu này nhằm vào injection từ **câu của người dùng**; ví dụ gốc đổi câu hỏi thành truy vấn CSDL rồi bỏ câu hỏi khỏi context trước khi trả kết quả. Phần còn lại trong context là kết quả truy vấn, không do kẻ tấn công viết.
- Vấn đề: bản tóm tắt do một LLM đã đọc email viết ra vẫn có thể mang theo chỉ dẫn cài sẵn. Dòng 601 lại nói các mẫu "có thể chứng minh" là chống được. Người học sẽ hiểu rằng tóm tắt là bước làm sạch.
- Sửa: đổi ví dụ thành "Câu của chuyên viên được đổi thành truy vấn có cấu trúc (mã hồ sơ, loại giấy tờ). Trước khi soạn câu trả lời, bỏ câu gốc khỏi context." Nếu muốn giữ ví dụ email: chỉ giữ các trường do code trích và kiểm (số tiền, tên gara), không giữ bản tóm tắt tự do.

**3. Dòng 590 — trích [23] cho một kỹ thuật mà nguồn không nói tới. Mức: thấp.**
- Câu gốc của OpenAI: "Structured outputs and isolation greatly reduce, but don't fully remove, this risk." Câu này nói về structured output và cách ly, không nói về `tool_result` hay bọc JSON của Anthropic.
- Sửa: ghi rõ "OpenAI nói tương tự về structured output và cách ly: giảm mạnh nhưng không loại bỏ hết" hoặc dẫn [22] ("confirm … your screening and confirmation steps catch the rest").

**4. Dòng 289, 623, 964 — lời khuyên `tool_result` được trình bày như quy tắc chung, trong khi hai nhà cung cấp khuyên khác nhau. Mức: thấp.**
- Anthropic [22]: "never in system prompts or plain user text blocks". OpenAI [23]: "Pass untrusted inputs through user messages to limit their influence."
- Người học dùng API của OpenAI sẽ làm sai nếu theo đúng câu chữ của trang.
- Sửa: thêm một câu ở dòng 964 hoặc bước 4: "Nguyên tắc chung: đặt nội dung ngoài vào kênh có đặc quyền thấp nhất mà API cho phép. Với Claude là `tool_result`; OpenAI khuyên đưa qua user message, không bao giờ qua developer message."

**5. Dòng 256 — bỏ mất chữ "hết". Mức: thấp.**
- Trang: "Dùng RAG hay fine-tuning không loại bỏ được rủi ro này." Nguồn [1]: "do not fully mitigate". Dòng 956 trong từ điển đã viết đúng ("không loại bỏ hết").
- Sửa: "không loại bỏ hết rủi ro này".

**6. Dòng 629 — gộp hai chữ "phần lớn" của Nasr thành một. Mức: thấp.**
- Trang: "Phần lớn phòng thủ từng báo gần 0% đã bị vượt với tỷ lệ trên 90%". Nguồn: 12 phòng thủ bị vượt, ASR trên 90% với phần lớn; đa số từng báo gần 0. Hai tập "phần lớn" này không chắc trùng nhau.
- Sửa: dùng lại câu ở dòng 658: "12 phòng thủ gần đây bị vượt, phần lớn với tỷ lệ trên 90%, dù đa số từng báo gần 0".

**7. Dòng 592 — "bản thân là LLM" áp cho classifier. Mức: thấp.**
- Câu của [8] nói về "guardrail LLM". Prompt Shields và PromptGuard 2 là model phân loại, không hẳn là LLM. Dòng 985 trong từ điển viết đúng hơn ("bản thân nó cũng có thể bị lừa").
- Sửa: "bản thân là model nên cũng có thể bị lừa".

### Số liệu và ô thử

**8. Dòng 1029–1031 và 669 — bảng eval tự mâu thuẫn ở cột "Chặn nhầm" và ở lời giải thích utility. Mức: trung bình.**
- C1: 47 việc xong + 4 chặn nhầm = 51, bằng C0. C2: 46 + 4 = 50, hụt 1 việc.
- Dòng 669 giải thích việc hụt đó là "một thư hợp lệ gửi tới địa chỉ mới của khách bị chặn". Đó chính là một ca chặn nhầm (do lớp đích được phép), nhưng cột "Chặn nhầm" của C2 vẫn ghi 4/60.
- KPI "Cái giá: utility C0 → C2" là −8,3 điểm % (5 việc), nhưng câu "Utility giảm ở C2 vì một thư hợp lệ…" chỉ giải thích 1 trong 5 việc. Bốn việc còn lại mất từ C1, do classifier.
- Sửa: đổi C2 thành `…,46,5` (8,3%) và viết lại: "Utility mất 5 việc so với C0: 4 do classifier chặn nhầm (từ C1), 1 do lớp đích được phép chặn một thư hợp lệ gửi tới địa chỉ mới của khách." Cách khác: đổi tên cột thành "Chặn nhầm (bộ lọc)" và nói rõ ca thứ năm.

**9. Dòng 869–887 và 434 — ô thử 4b làm lớp code trông miễn phí và lớp model trông vô ích; hai câu trong callout không có ca nào minh họa. Mức: trung bình.**
- Kết quả chạy: "Chỉ luật, code và người" cho 1 lọt, 0 chặn nhầm. "Đủ 6 lớp" cho 1 lọt, 1 chặn nhầm. Thêm lớp model chỉ làm kết quả tệ hơn. Số lần hỏi người duyệt cũng không đổi (1 và 1).
- Callout dòng 434 nói lớp model "có thể bắt những tấn công không cần hành động nào và không dùng chữ ẩn, như làm sai lệch nội dung tóm tắt" và làm "người duyệt ít bị thử thách hơn". Không ca nào trong 9 ca cho thấy hai điều này. T2 có dùng chữ ẩn nên lớp 1 đã bắt.
- Mục 9 lại nói lớp đích được phép có chặn nhầm (thư tới địa chỉ mới của khách), còn ô thử thì không có ca đó.
- Sửa: thêm hai ca. T8 "Gián tiếp · email · lộ liễu · không cần hành động": thân email nhờ trợ lý ghi sai một con số trong bản tóm tắt; chỉ `clf` và `spot` bắt; lọt ở preset "Chỉ luật, code và người". B3 "Hợp lệ · thư tới địa chỉ mới của khách": `egress` chặn nhầm. Sau đó sửa các con số trong callout dòng 434 và dòng 423 ("9 tình huống: 7 tấn công và 2 việc hợp lệ") theo kết quả mới, và bỏ câu "T7 lọt … chỉ còn T7 lọt" nếu không còn đúng.

**10. Dòng 857–862 so với mục 2 và bước 6 — "sáu lớp" ở ô thử không phải sáu lớp của sơ đồ. Mức: trung bình.**
- Sơ đồ mục 2: 1 nạp, 2 lọc, 3 ghép context, 4 kiểm hành động, 5 kiểm đầu ra, 6 giám sát.
- Ô thử: 1, 2, 3, 4a, 4b, 4c. Lớp 5 (chặn ảnh, link) bị gộp vào "4b. Chỉ gửi, tải tới đích được phép". Lớp 6 không có. Bước 6 của ví dụ gọi việc chặn ảnh là "lớp 5", còn ô thử ghi ca T5 bị chặn "ở lớp 4b".
- Sửa: tách `egress` thành "4b. Chỉ gửi thư tới đích được phép" và "5. Không tải ảnh, link tới domain lạ" (T5 do lớp 5 bắt). Thêm một câu: "Lớp 6 (giám sát) không chặn gì nên không có trong ô thử." Nếu không muốn tách: đổi nhãn thành "4b + 5".

**11. Dòng 847 và 788 — "Hết injection gián tiếp" mâu thuẫn với T5 và với mục 6. Mức: thấp.**
- Ô bộ ba coi nội dung không tin cậy chỉ là `email_read`. Tắt chân đó, trang nói "Hết injection gián tiếp".
- T5 (dòng 878) là injection gián tiếp qua wiki nội bộ bị sửa, tức qua `kb_search`. Dòng 564 cũng nói tài liệu trong kho RAG có thể bị sửa.
- Sửa dòng 847: "Bớt hẳn injection gián tiếp từ người ngoài. Tài liệu nội bộ mà `kb_search` trả về vẫn có thể bị sửa (ca T5)." Ở dòng 788, thêm `kb_search` vào chân "nội dung không tin cậy" với ghi chú "rủi ro thấp hơn, không phải bằng 0".

**12. Dòng 440, 938, 940 — ba lỗi hiển thị nhỏ của máy tính 95%. Mức: thấp.**
- Thanh trượt có 500 nấc trên khoảng 300px ở màn 390px, nên khó dừng đúng 95,0% hay 99,0% bằng ngón tay. Câu tự kiểm 3 lại yêu cầu thử 99%. Sửa: thêm hàng nút chọn nhanh 90% / 95% / 99% / 99,9%.
- Với 99,9% và 1 lần thử, trang hiện "Trung bình lọt 0 lần" (giá trị thật 0,001). Sửa: tăng lên 3 chữ số thập phân khi kết quả nhỏ hơn 0,01.
- Với 99% và 1000 lần, trang hiện "100%" (giá trị thật 99,996%). Sửa: hiện "> 99,9%" khi chưa đúng bằng 100.
- Trên điện thoại, ô đầu của mỗi dòng bảng chỉ là con số trần ("100") vì CSS ẩn nhãn cột đầu. Sửa: in "100 lần".

### Sư phạm và tiếng Việt

**13. Dòng 248–249, 298, 627, 629, 678, 983 — thuật ngữ dùng mà chưa giải thích. Mức: thấp.**
- "threat model" (tiêu đề dòng 248): thêm "(mô hình mối đe dọa: ai tấn công, từ đâu, muốn gì)".
- "CSP": thêm "(Content Security Policy: trình duyệt chỉ tải tài nguyên từ domain được khai báo)".
- "utility" xuất hiện ở dòng 629 (mục 8) trước khi được định nghĩa ở mục 9. Thêm "(tỷ lệ việc hợp lệ vẫn làm xong)" ở lần đầu.
- "webhook" (dòng 678), "capability" (dòng 983), "zero-trust" (dòng 978): thêm vài chữ giải thích hoặc bỏ.

**14. Dòng 594, 630, 976 — câu "Bước thực thi phải kiểm có duyệt đúng hành động đó" khó hiểu, lặp ba lần. Mức: thấp.**
- Sửa: "Trước khi chạy, code phải kiểm rằng người duyệt đã đồng ý đúng hành động này: đúng tool, đúng tham số."

**15. Chữ "mã hóa" mang ba nghĩa. Mức: thấp.**
- Dòng 298, 360, 627, 978: escape đầu ra. Dòng 589, 969: đổi sang base64. Dòng 958: che giấu để lọt bộ lọc. Người mới dễ hiểu là mã hóa bảo mật (encryption).
- Sửa: với đầu ra, viết "escape markdown/HTML (vô hiệu hóa ký tự đặc biệt)". Giữ "mã hóa" cho base64 và ghi rõ "không phải mã hóa bảo mật".

**16. Dòng 466 — "Bên trái… Bên phải… Bên dưới" sai với bản dọc. Mức: thấp.**
- Dưới 1081px (tức với người đọc chính), sơ đồ xếp dọc. Sửa: "Nhóm 'Vì sao xảy ra'… Nhóm 'Nơi xảy ra'… Hai nhóm cuối là đo lường và quản trị."

**17. Dòng 424 và 434 — hai đoạn dài, đặc chữ trên điện thoại. Mức: thấp.**
- Dòng 434 khoảng 130 chữ trong một callout, chứa bốn ý. Sửa: tách thành danh sách 4 gạch đầu dòng (chỉ model; chỉ code và người; T7; lớp model có ích gì). Dòng 424 tách thành 3 gạch theo ba loại lớp.

**18. Dòng 577 — "thường là chuyện xấu hổ hơn là mất dữ liệu". Mức: thấp.**
- Sửa: "thường gây mất uy tín (ảnh chụp màn hình bị lan truyền) hơn là mất dữ liệu". Khớp ý "screenshot attacks" của [11].

**19. Dòng 961 và 955 — hai thẻ từ điển. Mức: thấp.**
- "Worming" không có định nghĩa, chỉ nói ai xếp loại nó. Thêm: "Nội dung bị cài khiến model chèn tiếp chỉ dẫn đó vào nội dung nó tạo ra (email, tài liệu), nên injection tự lan sang người khác." Phần này là kiến thức chung, **not verified** theo nguyên văn [9] ngoài abstract.
- Gợi ý tìm kiếm "chu an" chỉ ra thẻ "Phát hiện chữ ẩn", không ra thẻ gốc "Chỉ dẫn ẩn". Sửa: đổi alias thẻ `hidden` thành "chữ ẩn, hidden text".

### JS, HTML, mobile

**20. Dòng 1016–1021 — `aria-pressed` của chip từ điển không nhất quán. Mức: thấp.**
- Chip không có `aria-pressed` cho tới lần bấm đầu. Nhánh tự đặt lại bộ lọc (dòng 1021) chỉ đổi class, không cập nhật `aria-pressed`.
- Sửa: gom việc đặt class và `aria-pressed` vào một hàm, gọi lúc khởi tạo, lúc bấm chip và ở nhánh đặt lại.

**21. Dòng 1002 — regex bỏ dấu chứa ký tự tổ hợp viết trực tiếp. Mức: thấp.**
- `/[̀-ͯ]/g` đang chạy đúng (đã thử tìm "chu an", "bo ba", "nguoi duyet"). Nhưng hai ký tự U+0300 và U+036F nằm trần trong mã nguồn, dễ hỏng khi một công cụ chuẩn hóa Unicode hoặc khi dán qua trình soạn thảo.
- Sửa: viết bằng mã thoát `/[\u0300-\u036f]/g`.

**22. Dòng 880–881 — ca T6 dùng tool không có trong kịch bản. Mức: thấp.**
- Mục 3 khai bốn tool. T6 cần đọc trang web và một tool duyệt thanh toán. Sửa: thêm vào dòng 424 câu "Ô thử giả định trợ lý có thêm tool đọc web và tool đề nghị thanh toán", hoặc đổi T6 sang kênh có sẵn.

### Sơ đồ

**23. Dòng 360, 515, 517, 543, 547, 371 — nhãn SVG tràn khung với font rộng. Mức: thấp.**
- Đo được (bề rộng chữ / chỗ trống, px theo viewBox):

| Nhãn | FreeSans (gần Arial) | DejaVu Sans |
|---|---|---|
| "mã hóa markdown" (dòng 360) | 95/104 | 112/104 tràn |
| "mọi thứ là token, không có kênh lệnh" (515) | 188/222 | 223/222 tràn |
| "system prompt không phải lớp bảo mật" (517) | 200/222 | 237/222 tràn |
| "đầu ra agent khác cũng không tin cậy" (543) | 193/222 | 228/222 tràn |
| "OWASP Top 10 · chính sách · quyền dữ liệu" (547) | 226/232 sát | 256/232 tràn |
| Thanh lớp 6 (371) | 600/734 | 725/734 sát |

- Trên Windows và macOS nhiều khả năng vừa. Trên Linux desktop (`system-ui` thường là DejaVu hoặc font rộng tương đương) sẽ tràn. Bề rộng thật của Segoe UI và SF: **not verified**.
- Sửa: rút nhãn ("escape markdown", "mọi thứ là token", "không phải lớp bảo mật", "đầu ra agent khác: không tin cậy", "OWASP · chính sách · quyền dữ liệu") hoặc nới ba cột của sơ đồ 2 lên 250px.

**24. Dòng 284–285, 279–303, 490, 558–560 — bản dọc và bản SVG lệch nhau vài chỗ. Mức: thấp.**
- Bản dọc mục 2 thiếu mũi tên "↓" giữa khung lớp 1 (dòng 284) và khung lớp 2–3 (dòng 285); các chỗ nối khác đều có.
- Chú giải dùng ô có nền màu nhạt, nhưng ở bản dọc ba nút "Đầu vào", "Model chính", "Giám sát" chỉ có viền màu, nền trắng. Sửa: thêm nền `--bad-soft`, `--accent-soft`, `--warn-soft` cho `.node.x`, `.node.r`, `.node.o`.
- Sơ đồ 2: SVG vẽ mũi tên một chiều "nằm trong" tới AI Governance và mũi tên hai chiều tới LLM evaluation. Bản dọc gộp cả hai thành "↕ đi kèm". SVG cũng thiếu tiêu đề nhóm "QUẢN TRỊ" (bản dọc có). Sửa: bản dọc ghi "↕ đo bằng" trước khung Đo lường và "↓ nằm trong" trước khung Quản trị; thêm nhãn "QUẢN TRỊ" vào SVG.
- Chiều và ý nghĩa các mũi tên còn lại đúng: nguyên nhân → trung tâm → nơi xảy ra; đường đỏ nét đứt từ "Đầu vào" thẳng tới "Model" đúng với ý "một phần injection vẫn lọt".

### Khái niệm còn thiếu

**25. Ba khái niệm lõi nên bổ sung cho người xây RAG và agent doanh nghiệp. Mức: trung bình.** Các gợi ý này là nhận định của người review, chưa đối chiếu nguồn cụ thể (**not verified**), trừ chỗ ghi nguồn.
- **Injection lưu lại (memory, lịch sử hội thoại).** Trang chỉ xét một lượt. Chỉ dẫn cài sẵn có thể được agent ghi vào bộ nhớ dài hạn hoặc nằm lại trong lịch sử, rồi có tác dụng ở phiên sau, với người dùng khác. Thêm một thẻ từ điển và một dòng ở mục 6. Chưa link sang `../agent-memory/` cho tới khi trang đó được publish (hiện là thư mục chưa commit).
- **Guardrail rộng hơn chống injection.** Tên trang có chữ "guardrails" nhưng nội dung chỉ nói phần chống tấn công. Người làm doanh nghiệp cần biết guardrail còn gồm: lọc PII và dữ liệu nhạy cảm ở đầu ra (DLP, nhãn độ nhạy; ghi chú nguồn [20] có nhắc sensitivity labels), giới hạn chủ đề, kiểm câu trả lời có bám tài liệu không. Microsoft Learn [21] nói rõ Prompt Shields không kiểm nội dung có hại, đúng sự thật hay bám nguồn, và cần guardrail khác cho các rủi ro đó. Thêm một thẻ ngắn ở mục 2 hoặc mục 5.
- **Vận hành guardrail: hỏng thì đóng hay mở, độ trễ, streaming.** Khi classifier lỗi hoặc quá thời gian, hệ thống chặn (fail-closed) hay cho qua (fail-open)? Mỗi lớp model thêm độ trễ và chi phí. Nếu câu trả lời được stream thì lớp kiểm đầu ra phải chạy trước khi chữ tới màn hình. Thêm một dòng vào bảng lỗi ở mục 8.
- Nếu còn chỗ: sandbox cho tool chạy code hoặc điều khiển trình duyệt. Anthropic [22] có nêu "run tools in sandboxed environments".

## 4. Tổng kết số phát hiện

| Mức | Số lượng | Số thứ tự |
|---|---|---|
| Cao | 0 | – |
| Trung bình | 6 | 1, 2, 8, 9, 10, 25 |
| Thấp | 19 | 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 |

Thứ tự nên sửa: 1 và 2 (sai so với nguồn), 8 (bảng tự mâu thuẫn), 9 và 10 (làm cùng lúc vì đều sửa mảng CASES và LAYERS, rồi cập nhật lại các con số trong dòng 423 và 434), sau đó các mục thấp.

## 5. Câu hỏi còn mở

- Có thêm ca T8 và B3 vào ô thử không? Nếu có, câu "T7 lọt ở mọi cấu hình, chỉ còn T7 lọt" phải viết lại và đây là thay đổi nội dung, không chỉ sửa lỗi.
- Trang chủ và `sw.js` chưa liệt kê chủ đề này; ngoài phạm vi review, cần làm khi publish.

## Kết quả áp dụng (phiên dựng trang, 2026-11-17)

Mỗi phát hiện đã được tự kiểm lại. Các mục về nguồn (1, 2, 4) được đối chiếu bằng `curl` trên bản gốc; mục số liệu chạy lại trong Orca.

| # | Quyết định | Ghi chú |
|---|---|---|
| 1 | Sửa | Đã đọc [13]: "copying and pasting out our obfuscated private data". Viết lại theo đúng chiều: dụ người dùng chép dữ liệu ra ngoài. |
| 2 | Sửa | Đã đọc [14]: ví dụ gốc đổi câu người dùng thành truy vấn CSDL rồi bỏ câu gốc. Đổi cả cột ý tưởng và ví dụ An Phúc theo đúng ví dụ đó. |
| 3 | Sửa | Ô "Giới hạn" của hàng tool_result giờ dẫn [22] (red team bắt phần còn lại) và ghi rõ câu [23] nói về structured output và cách ly. |
| 4 | Sửa | Đã đọc [23]: "Pass untrusted inputs through user messages". Thêm nguyên tắc "kênh có đặc quyền thấp nhất mà API cho phép" ở bước 4, bảng lỗi mục 8, bảng so sánh và thẻ từ điển. |
| 5 | Sửa | "không loại bỏ hết". |
| 6 | Sửa | Viết lại câu Nasr ở mục 8 với hai vế tách riêng. |
| 7 | Sửa | "bản thân là model". |
| 8 | Sửa | C2 chặn nhầm 5/60; lời giải thích nêu đủ 5 việc (4 do classifier, 1 do lớp đích). |
| 9 | Sửa | Thêm T8 (làm sai bản tóm tắt, không cần hành động; chỉ lớp model bắt; nguồn [9] có "Wrong summary") và B3 (thư tới địa chỉ mới, lớp đích chặn nhầm). Callout viết lại thành 4 gạch đầu dòng; bỏ câu "người duyệt ít bị thử thách" vì không ca nào minh họa. Kết quả Orca: không lớp 8/8 lọt; chỉ model 4/8, chặn nhầm 1/3; chỉ code+người 2/8 (T7, T8), chặn nhầm 1/3 (B3); đủ các lớp 1/8 (T7), chặn nhầm 2/3. |
| 10 | Sửa | Tách lớp "4b. Chỉ gửi thư tới đích được phép" và "5. Không tải ảnh, link tới domain lạ" (T5 do lớp 5 bắt); ghi rõ lớp 6 không có trong ô thử; tiêu đề đổi từ "sáu lớp" sang "các lớp". |
| 11 | Sửa | Thông điệp bộ ba: "Bớt hẳn injection gián tiếp từ người ngoài, nhưng chưa hết", nhắc kb_search và T5. |
| 12 | Sửa | Thêm nút 90/95/99/99,9%; số nhỏ hiện 3 chữ số; "> 99,9%" thay cho "100%" (p luôn < 1); ô đầu bảng ghi "N lần". |
| 13 | Sửa | Giải thích threat model, CSP, utility (lần đầu ở mục 8), webhook, capability, zero-trust. |
| 14 | Sửa | Viết lại câu về duyệt đúng hành động ở cả ba chỗ. |
| 15 | Sửa | Đầu ra dùng "escape markdown/HTML"; encoding ghi "không phải mã hóa bảo mật". Giữ "mã hóa" trong thẻ che giấu vì đúng nghĩa encoding. |
| 16 | Sửa | Đổi sang tên nhóm thay cho trái/phải. |
| 17 | Sửa | Cả hai đoạn tách thành danh sách. |
| 18 | Sửa | "gây mất uy tín (ảnh chụp màn hình bị lan truyền)". |
| 19 | Sửa | Đã đọc toàn văn [9]: có "Prompts as worms" và kịch bản trợ lý email đọc rồi gửi thư. Thêm định nghĩa worming theo đó; alias thẻ chỉ dẫn ẩn thêm "chữ ẩn". |
| 20 | Sửa | Hàm `setChip` đặt class và `aria-pressed` lúc khởi tạo, lúc bấm và khi tự đặt lại. |
| 21 | Sửa | Regex dùng mã thoát `\u0300-\u036f`; tìm "chu an", "bo ba" vẫn ra kết quả. |
| 22 | Sửa | Ghi chú trong phần quy ước của ô thử. |
| 23 | Sửa | Rút ngắn 5 nhãn SVG. Kiểm trong Orca: getBBox của mọi nhãn nằm trong khung (0 nhãn tràn) ở 1280px. |
| 24 | Sửa | Thêm mũi tên giữa lớp 1 và lớp 2–3; nền nhạt cho ba nút; bản dọc ghi "↕ đo bằng" và "↓ cả chủ đề nằm trong"; SVG thêm nhãn "QUẢN TRỊ". |
| 25 | Sửa một phần | (a) Injection lưu lại: thêm thẻ từ điển và gạch đầu dòng ở mục 6, nguồn [9] (Figure 8 của Greshake), link `../agent-memory/` (thư mục chủ đề song song, được phép theo brief). (b) Guardrail rộng hơn: thêm callout ở cuối mục 2, dẫn [21] [23] [25] [26]. (c) Fail-open/closed và streaming: thêm một dòng ở bảng lỗi mục 8 dưới dạng lời khuyên thiết kế, không gắn nguồn vì chưa có nguồn đã mở. Sandbox: thêm vào thẻ "Quyền tối thiểu" theo [22]. |

Không bác bỏ phát hiện nào.
