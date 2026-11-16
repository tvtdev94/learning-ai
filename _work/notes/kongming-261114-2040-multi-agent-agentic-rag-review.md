# Kongming review: multi-agent-agentic-rag

Ngày: 2026-11-14 · Trang: `D:\WORKSPACES\learning-ai\multi-agent-agentic-rag\index.html` (986 dòng) · Chỉ tư vấn, không sửa trang.

## Cách kiểm và giới hạn

- Đọc toàn bộ trang, ghi chú nguồn, brief; đối chiếu trang mẫu `rag/index.html` và `ai-agent/index.html` bằng grep.
- Mở lại bằng WebFetch 14 URL nguồn + bản HTML của MAST và CRAG. WebFetch trả lời qua một model nhỏ, giới hạn trích 125 ký tự, nên các câu trích là đoạn ngắn.
- **Không chạy trình duyệt.** Mọi phát hiện về SVG, chồng chữ, tương phản là **tính từ toạ độ và mã màu trong file**, chưa đo trên màn hình. Mục nào ghi "cần xác nhận bằng Orca" là chưa xác minh bằng mắt.
- Số của mô phỏng: tự tính lại bằng tay từ công thức ở dòng 878–880.

## Kết luận nhanh

Trang đạt mức tốt: gần như mọi con số khớp nguồn, cấu trúc đúng brief, ví dụ nhất quán về số học. Có **1 lỗi sai nguồn rõ ràng** (kappa 0,88), **1 mâu thuẫn nội bộ** về "bốn mẫu đầu", **1 lỗi giải thích trong mô phỏng**, và **4 chỗ chữ đè lên đường vẽ trong hai SVG**. Không thấy lỗi JS làm hỏng trang.

## Bảng đối chiếu số liệu (mục 1 của yêu cầu)

| Số liệu | Trang | Nguồn mở lại | Kết quả |
|---|---|---|---|
| 90,2% (lead Opus 4, sub Sonnet 4, eval nội bộ) | dòng 711 | [2] "outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval" | Khớp (xem F6 về chữ "tới") |
| 4× / 15× so với chat | 517, 687, 796 | [2] "about 4× more tokens than chat interactions", "about 15× more tokens than chats" | Khớp |
| 80% variance (BrowseComp) | 711 | [2] "token usage by itself explains 80% of the variance"; 3 yếu tố giải thích 95% | Khớp (xem F6 về cách dịch) |
| 1.000–2.000 token | 242, 456 | [3] "often 1,000-2,000 tokens" | Khớp |
| 200.000 token, 3–10 tool call, 2–4 sub-agent, >10, cắt 90% thời gian, 50 sub-agent, ~20 câu hỏi, rubric 5 tiêu chí, 0,0–1,0 | 352, 408, 519, 721, 739, 760 | [2] | Khớp cả |
| MAST 14 tỉ lệ (15,7 / 13,2 / 12,4 / 11,8 / 9,1 / 8,2 / 7,4 / 6,2 / 2,8 / 0,85…) | 720–725 | arxiv.org/html/2503.13657 mục 4 | Khớp (xem F5 về mẫu số) |
| MAST +9,4% / +15,6% | 724, 725 | Phụ lục H, Bảng 5: ChatDev, ProgramDev-v0 (32 bài): 25,0 → 34,4 → 40,6 | Khớp số, thiếu bối cảnh (F4) |
| MAST kappa 0,88 | 750 | Abstract: "validated by high inter-annotator agreement (kappa = 0.88)" = giữa người với người | **SAI** (F1) |
| Google 80,9% / 39–70% / 17,2× / 4,4× | 569, 570, 700, 704 | [12] khớp từng câu; 80,9% là Finance-Agent, 39–70% là PlanCraft | Khớp |
| arXiv v3 +80,8% / −70,0%, 87% | 761 | [11] abstract v3 (8/4/2026) | Khớp |
| CRAG 3 hành động, T5-large 0,77B, viết lại thành từ khóa | 536–540 | arxiv.org/html/2401.15884 mục 4.3 | Khớp |
| Self-RAG, Adaptive-RAG, IRCoT | 240, 241, 529–532 | abstract của [5] [7] [8] | Khớp |
| OpenAI agents-as-tools / handoff / LLM vs code | 391, 577, 578 | [14] | Khớp |
| LangGraph grade yes/no, rewrite | 529, 532 | [9] | Khớp |
| Cognition 2 nguyên tắc, Flappy Bird | 588 | [13] | Khớp (xem F7) |

## Phát hiện

### A. Độ chính xác

**F1 · high · #danh-gia dòng 750 · kappa 0,88 gán nhầm cho LLM-as-judge**
- Trang: "Nhóm tác giả làm một LLM-as-judge gắn nhãn khớp tốt với người (kappa 0,88)."
- Nguồn: abstract arXiv 2503.13657 nói 0,88 là "inter-annotator agreement" giữa các chuyên gia người. Bản HTML ghi LLM judge (o1, few-shot) đạt κ = 0,77, accuracy 94% (đọc qua một lần WebFetch, nên mở lại mục 4 của bản HTML để xác nhận 0,77 trước khi ghi).
- Ghi chú nguồn dòng 58 ghi "kappa 0,88" không nói của ai, nên lỗi phát sinh khi viết trang.
- Sửa: "Bộ phân loại được người chấm thống nhất cao (kappa 0,88). Nhóm tác giả còn làm một LLM-as-judge gắn nhãn tự động, khớp khá với người (kappa 0,77)." Sửa cả ghi chú nguồn.

**F2 · med · #mau dòng 358, #quan-he dòng 610/634, #so-sanh dòng 685 · "Bốn mẫu đầu" mâu thuẫn với thứ tự thẻ, và đếm 4 hay 5 không nhất quán**
- Dòng 358: "Bốn mẫu đầu có đường đi do code quyết định. Mẫu orchestrator–workers là bước chuyển sang agent." Nhưng orchestrator–workers là **Mẫu 4**, nằm trong "bốn mẫu đầu"; mẫu 5 là evaluator–optimizer.
- Bản đồ quan hệ liệt kê Workflow chỉ có 4 mẫu (bỏ orchestrator–workers), còn bảng so sánh ghi "Workflow (5 mẫu)".
- Nguồn [1] xếp cả 5 vào workflow (tiêu đề "Workflow: Orchestrator-workers").
- Sửa: "Cả năm đều được Anthropic xếp là workflow. Bốn mẫu (1, 2, 3, 5) có đường đi do code quyết định; riêng mẫu 4 để LLM tự chia việc nên là bước chuyển sang agent." Thêm "orchestrator–workers" vào ô Workflow của cả hai bản đồ (vflow và SVG), hoặc đổi bảng so sánh cho khớp.

**F3 · med · #so-sanh dòng 698 · "Nhiều tool phức tạp" là dấu hiệu nên dùng: không có trích dẫn và ngược với nguồn [11]/[12]**
- Trang ghi không kèm nguồn: "Nhiều tool phức tạp, mỗi agent chỉ cần một nhóm tool."
- [12]: "As tasks require more tools (e.g., a coding agent with access to 16+ tools)… the 'tax' of coordinating multiple agents increases disproportionately." Abstract [11] cũng nói việc nặng tool chịu chi phí phối hợp. Ghi chú nguồn dòng 69 đã ghi ý này nhưng trang không dùng.
- [2] thì có nói multi-agent hợp với việc "interfacing with numerous complex tools" (tôi nhớ câu này từ bài, lần mở lại này không trích được: chưa xác minh).
- Sửa: gắn [2] cho ý này và thêm ngay một câu đối trọng có [12]: nghiên cứu của Google thấy càng nhiều tool thì chi phí phối hợp càng tăng mạnh. Hoặc bỏ gạch đầu dòng.

**F4 · med · #loi dòng 724–725 · +9,4% và +15,6% thiếu bối cảnh khiến người đọc hiểu quá mức**
- Nguồn (Phụ lục H, Bảng 5): cả hai đều là ChatDev trên ProgramDev-v0 gồm 32 bài; là **điểm phần trăm** (25,0 → 34,4 → 40,6, tức thêm khoảng 3 và 5 bài). Trên HumanEval chỉ +0,7 và +1,9. Tác giả tự nói các can thiệp này chưa phải cải thiện đáng kể.
- +15,6 là "new topology" (đồ thị có vòng, chỉ dừng khi vai CTO xác nhận), bản chính mô tả là thêm bước xác minh mục tiêu cấp cao. Cách diễn đạt của trang chấp nhận được.
- Sửa: "+9,4 điểm phần trăm" và "+15,6 điểm phần trăm", thêm "(ChatDev, 32 bài lập trình; trên benchmark khác mức tăng nhỏ hơn nhiều)".

**F5 · low · #loi dòng 720–725 · tỉ lệ MAST không nói mẫu số**
- 14 tỉ lệ cộng lại xấp xỉ 100% (44,2 + 32,35 + 23,5), tức là tỉ trọng trong tổng số lỗi ghi nhận, không phải "15,7% số lần chạy bị lặp bước".
- Sửa: thêm một lần ở câu dẫn dòng 717: "tỉ lệ là phần trong tổng số lỗi MAST ghi nhận".

**F6 · low · #so-sanh dòng 711, #kien-truc dòng 569 · chữ "tới" và "chênh lệch"**
- "tốt hơn … tới 90,2%" và "khuếch đại lỗi tới 17,2 lần": "tới" đọc thành "up to", nguồn nói "by 90.2%" và "by 17.2x". Bỏ "tới".
- "giải thích 80% chênh lệch kết quả": nguồn là variance giữa các lần chạy trên BrowseComp, không phải khoảng cách multi so với single. Sửa: "giải thích 80% độ biến thiên của kết quả".
- Cùng một phát hiện xuất hiện hai số 80,9% [12] (dòng 700) và +80,8% [11] (dòng 761). Cả hai đúng với nguồn của mình; thêm chú "(blog ghi 80,9%, bản arXiv v3 ghi 80,8%)" hoặc dùng một số.

**F7 · med · #kien-truc dòng 588 · quan điểm Cognition đã được chính tác giả cập nhật**
- Trang thu hẹp thành "cho việc như viết code"; bài gốc [13] viết cho agent nói chung (ví dụ thì thiên về code).
- Ngày 2026-04-22 Walden Yan đăng "Multi-Agents: What's Actually Working" (https://cognition.com/blog/multi-agents-working, đã mở): "Our original observations still hold today for parallel-writer swarms"; cái chạy được là "multiple agents contribute intelligence to a task while writes stay single-threaded".
- Trang truy cập ngày 2026-11-14 mà chỉ dẫn bài 2025 thì thiếu nửa sau của câu chuyện. Nguyên tắc "một agent ghi, nhiều agent đọc/góp ý" cũng là ý rất dễ nhớ cho người học và khớp với kết luận dòng 589.
- Sửa: thêm nguồn [15] và một câu: "Năm 2026 Cognition cập nhật: multi-agent chạy tốt khi chỉ một agent ghi, các agent khác chỉ góp hiểu biết (đọc, review, tư vấn)."

**F8 · low · #agentic-rag dòng 529/536 · Self-RAG và CRAG cần model huấn luyện riêng**
- Trang có nói Self-RAG "huấn luyện model" và CRAG dùng T5-large, nhưng không nói rõ hệ quả cho người làm doanh nghiệp: hai bài báo dùng model được fine-tune; trong thực tế (như hướng dẫn LangGraph [9]) bộ chấm thường chỉ là một prompt cho LLM.
- Sửa: một câu muted sau bảng CRAG. Đây là suy luận của tôi từ [5] [6] [9], viết ở dạng thận trọng.

### B. Khái niệm còn thiếu

**F9 · med · #agentic-rag · thiếu bước kiểm tra câu trả lời có bám tài liệu không**
- "Bốn quyết định" chỉ kiểm tra **đoạn tìm được**. Việc kiểm tra **câu trả lời sau khi sinh** (bám nguồn, trả lời đúng câu hỏi) chỉ lướt qua trong nửa câu về reflection token ở dòng 532; vflow dòng 544–559 không có bước này.
- Phạm vi yêu cầu có "verify; self-reflection". Abstract Self-RAG nói model tự đánh giá cả đoạn tìm được lẫn đầu ra của mình.
- Sửa: tách quyết định 4 thành "4a · đoạn có dùng được không" và "4b · câu trả lời có bám đoạn không", thêm một node "Kiểm tra câu trả lời bám nguồn" trước node cuối của vflow.

**F10 · med · toàn trang · không nhắc an toàn và phân quyền khi agent đọc tài liệu**
- Ghi chú nguồn dòng 54 có "Treat the document as data only" của [9] nhưng trang không dùng. Với agentic RAG, tài liệu tìm được và tóm tắt của sub-agent đều là dữ liệu không tin cậy; trong doanh nghiệp mỗi sub-agent còn phải tuân quyền truy cập của người hỏi (ERP, hợp đồng).
- Sửa: một callout ngắn ở #agentic-rag hoặc #loi, có [9], liên kết `../governance/` (thư mục đã có). `../prompt-injection-guardrails/` chưa có thư mục, chỉ thêm khi trang đó tồn tại.

**F11 · low · #kien-truc · thiếu vài ý nhỏ**
- Chọn model theo vai (lead model lớn, sub-agent model nhỏ hơn) chỉ xuất hiện trong ngoặc ở dòng 711; đây là đòn bẩy chi phí chính, nên có một câu riêng.
- Trang hứa "giúp bạn đọc tài liệu framework dễ hơn" nhưng từ điển không có tên gọi hay gặp trong framework: supervisor, swarm, hierarchical. Thêm làm alias cho Centralized / Handoff / Hybrid (chỉ khi có nguồn; tôi chưa mở tài liệu nào cho các tên này).
- Từ điển gộp "Independent / Centralized" và bỏ Decentralized, Hybrid; không có mục riêng cho Self-RAG, IRCoT, compaction.

**F12 · low · trùng với ai-agent #so-sanh**
- `ai-agent/index.html` dòng 679–709 đã có sơ đồ orchestrator–worker với đúng tình huống "So sánh 3 nhà cung cấp" và số 4×/15×. Trang này đào sâu hơn (brief, tiêu chí đủ, CRAG, artifact), không lặp nguyên văn: chấp nhận được.
- Sửa nhẹ: ở đầu mục 4 thêm "Đây là tình huống 3 nhà cung cấp ở trang AI Agent, giờ đi vào chi tiết", để việc trùng trở thành chủ ý.

### C. Sư phạm và tiếng Việt

**F13 · med · thứ tự mục · agentic RAG được dùng trước khi được giải thích**
- Lead nói hai bước nâng cấp theo thứ tự: agentic RAG rồi multi-agent. Nhưng mục 2 (flow) và mục 4 (bước 4, 5) đã dùng vòng tìm–chấm–tìm lại và CRAG, trong khi giải thích nằm ở mục 6.
- Brief chỉ cố định Tổng quan → Flow → Ví dụ → Mô phỏng → Từ điển; không cấm chèn mục.
- Sửa: chuyển mục 6 (Agentic RAG) lên ngay sau mục 3 (Năm mẫu), trước Ví dụ. Nếu giữ thứ tự, thêm 2 câu định nghĩa agentic RAG ở đầu mục 2.

**F14 · low · câu khó đọc hoặc mơ hồ**
- Dòng 241 "RAG thường luôn lấy đủ k đoạn": "thường luôn" đọc thành "usually always". Sửa: "RAG cổ điển luôn lấy đủ k đoạn".
- Dòng 739 "Một lần gọi cho điểm 0,0–1,0 kèm đạt/không đạt khớp với người chấm nhất." Sửa: "Cách khớp với người chấm nhất là một lần gọi LLM duy nhất, cho điểm 0,0–1,0 kèm kết luận đạt hay không đạt."
- Dòng 764 "Đúng nhưng tầng 4 cao". Sửa: "Trả lời đúng nhưng chi phí (tầng 4) cao".
- Dòng 923 "Liệu công sức theo độ khó": "liệu" dễ bị đọc là "có lẽ". Gợi ý: "Cân công sức theo độ khó".
- Dòng 391 "kết quả tất định": người mới khó hiểu. Gợi ý: "kết quả ổn định, lặp lại được (deterministic)".
- Dòng 376 "worker ?": dấu hỏi không tự giải thích. Gợi ý: "worker (chưa biết trước)".

**F15 · low · đoạn dài trên điện thoại**
- Callout dòng 588 (6 câu, 2 trích dẫn) và dòng 711 (5 câu) dài hơn hẳn phần còn lại. Tách mỗi cái thành 2 đoạn `<p>`.
- Bảng lỗi mục 11 có 10 hàng × 4 ô, thành 10 thẻ rất dài ở 390px. Cân nhắc gói mỗi hàng vào `details` hoặc chấp nhận.

**F16 · low · #vi-du bước 3, 5, 7 · ví dụ tự mâu thuẫn về nguồn được phép**
- Brief ở dòng 427 chỉ cho ba tool: `search_contracts`, `erp_deliveries`, `tickets`. Bước 5 (dòng 445–446) lại để sub-agent C tìm thêm trong "email đính kèm hợp đồng", và bước 7 nói "đã tìm 2 nguồn được phép". Bài học của bước 3 là ranh giới, nên chỗ này phản tác dụng.
- Sửa: thêm một tool email vào brief, hoặc đổi nguồn thứ hai thành `tickets` (đã được phép).
- Số học ví dụ đã kiểm: 28.000 + 22.000 + 31.000 = 81.000; 1.400 + 1.300 + 1.200 = 3.900 ≈ 4.000; ngân sách 2 vòng dùng đúng.

### D. Mô phỏng (mục 5)

Công thức ở dòng 878–880 khớp phần "Mô hình tính" dòng 514–515. Tính lại mặc định (N=3, E=30.000, S=1.500, O=5.000, T=4): một agent 95.000; lead 9.500; sub-agent 35.000; tổng multi 114.500 (×1,21); thời gian 12 và 5 phút. Thang cột: `pMax = max(singlePeak, W)` luôn chứa được mọi cột (subPeak ≤ singlePeak; leadPeak ≤ singlePeak vì S tối đa 5.000 = E tối thiểu).

**F17 · med · dòng 517, 519, 884 · giải thích khoảng cách ×1,21 so với "15 lần" bị sai hướng**
- Màn hình hiện "×1,21", trong khi đoạn dưới nói thực tế là 4× và 15×. Lời giải thích nằm trong `details` đóng, và nói việc đọc lại context mỗi lần gọi "làm tổng token tăng nhanh hơn nhiều" rồi dẫn ngay số 15×.
- Lập luận của tôi (không phải từ nguồn): đọc lại context phạt **một agent** nặng hơn, vì context của nó dài N×E và mỗi lần gọi đọc lại hết; sub-agent chỉ đọc lại context cỡ E. Vậy cơ chế đó không giải thích được 15×. Số 4×/15× của [2] là so với **chat**, không phải so với một agent làm cùng việc; [2] cũng nói multi-agent hiệu quả chủ yếu vì tiêu được nhiều token hơn cho bài toán (ý này tôi nhớ từ bài, lần mở lại này không trích).
- Sửa: (a) đổi tiêu đề cột thành "Tổng token khác nhau phải đọc (mỗi token đếm một lần)"; (b) viết lại đoạn 517: "4× và 15× là so với chat, và hệ multi-agent thực tế làm nhiều việc hơn (tìm nhiều hơn, gọi tool nhiều hơn), nên không so trực tiếp được với ×1,21 ở trên"; (c) đưa một dòng cảnh báo này ra ngoài `details`.

**F18 · med · dòng 894 · câu kết luận sai khi thời gian bằng nhau**
- N=2, T=1, không tick phụ thuộc: singleTime = 2, multiTime = 1 + 1 = 2. Trang in "Chạy song song: thời gian chờ còn 2 phút thay vì 2 phút."
- Sửa: rẽ nhánh `multiTime < singleTime`; nếu không thì in "không nhanh hơn vì phần việc quá ngắn so với thời gian điều phối".

**F19 · low · dòng 501, 884, 886 · chú thích không khớp màu**
- Chú thích ghi tím = "Lead (multi)", nhưng cột "Multi-agent" ở Tổng token và Thời gian cũng dùng lớp `bl` (tím). Brief yêu cầu chú thích khớp màu.
- Sửa: đổi chú thích thành "Lead / cả hệ multi-agent", hoặc thêm một lớp màu riêng cho cột tổng.

**F20 · low · dòng 888–893 · logic verdict**
- Nhánh `subPeak > W` (dòng 891) không bao giờ chạy: subPeak tối đa 15.000 + 100.000 = 115.000, nhỏ hơn lựa chọn W bé nhất 128.000. Bỏ nhánh, hoặc thêm lựa chọn W nhỏ hơn (ví dụ 32.000) để người học thấy được trường hợp này.
- Khi vừa vượt context vừa tick phụ thuộc, verdict tô đỏ nhưng vẫn in "Đây là lý do chính để chia việc" cạnh "multi-agent chậm hơn": hai câu kéo ngược nhau. Thêm một câu riêng cho tổ hợp này: "việc tuần tự mà quá lớn: ưu tiên nén context hoặc ghi chú ra ngoài, trước khi nghĩ tới chia agent".
- Câu về Google 39–70% trong verdict không có `[12]`.
- Với W = 1.000.000, cột lead rộng dưới 1% và sub-agent 3,5%: gần như không thấy cột, chỉ còn chữ. Chấp nhận được, hoặc vẽ giới hạn bằng vạch dọc thay cho một cột riêng.

**F21 · med · #mo-phong ở 390px · kéo thanh trượt mà không thấy kết quả**
- Dưới 820px `.sim` thành một cột: thẻ điều khiển (5 thanh trượt, 1 select, 1 checkbox) nằm trên, thẻ kết quả nằm dưới. Ước tính từ CSS thẻ điều khiển cao khoảng 480–520px, nên khi kéo các thanh phía trên thì cột kết quả nằm ngoài màn hình 844px. Cần xác nhận bằng Orca.
- Sửa: trên mobile cho thẻ kết quả `position:sticky` dạng gọn, hoặc đặt 3 dòng số chính ngay dưới thanh trượt đang kéo, hoặc gói 2 thanh ít quan trọng (S, O) vào `details`.

**F22 · low · dòng 124 · thanh trượt cao 32px**
- `.ctl input[type=range]{height:32px}`, khối `@media (max-width:600px)` không nâng lên. Thấp hơn chuẩn 40px của brief. Sửa: `min-height:40px` trong khối mobile.

### E. Hai SVG (chỉ hiện từ 1041px)

Hướng và ý nghĩa mũi tên của cả hai sơ đồ đúng. Các điểm dưới đây tính từ toạ độ; cần xác nhận bằng Orca ở 1280px.

**F23 · med · SVG flow dòng 341–342 · hai nhãn bị đường cong cắt qua**
- "giao việc" đặt tại x=318, y=140 (chữ chiếm khoảng x 318–368, y 130–142). Đường cong lead → Sub-agent A (dòng 327) đi qua x ≈ 322–325 đúng trong dải y đó, tức cắt qua chữ đầu.
- "tóm tắt" tại x=596, y=140 (x 596–636). Đường cong Sub-agent A → Lead (dòng 330) đi qua x ≈ 610, tức cắt giữa chữ.
- Sửa: đưa hai nhãn lên vùng trống phía trên, ví dụ `text-anchor="middle"` tại (325, 20) và (610, 20); ở y=20 không có đường nào.

**F24 · med · SVG quan hệ dòng 663, 672 · nhãn xanh nằm ngay trên đường cong đứt nét**
- Nhãn "vòng chấm–sửa → self-reflection" tại x=330, y=250 (x khoảng 330–520, y 240–252). Đường cong Workflow → Agentic RAG có y ≈ 242 tại x=330, 246,5 tại x=371, 252 tại x=500: chạy xuyên dọc theo dòng chữ. Mũi tên dọc Agent → Multi-agent (x=500) cũng cắt qua đuôi nhãn, và nhãn "giao việc" (x=508, y=262) nằm sát ngay dưới.
- Sửa: chuyển nhãn xuống dưới đường cong và sang trái mũi tên dọc, ví dụ `text-anchor="end"` tại (490, 274).

**F25 · low · SVG quan hệ dòng 669 · "retrieval là tool" có thể tràn vào hộp Agentic RAG**
- Khe giữa hai hộp là x 620–700 (80px). Nhãn bắt đầu ở x=628, 17 ký tự cỡ 12, ước rộng 82–95px, nên đuôi chữ đè lên viền trái của hộp. Sửa: tách hai dòng ("retrieval" / "là tool") căn giữa tại x=660.

**F26 · low · SVG quan hệ dòng 658, 667 · "ghép bằng code" sát đường cong**
- Đuôi nhãn (x ≈ 312–325, baseline y=104) cách đường cong (y ≈ 108–110) khoảng 3px. Dời nhãn lên y=96 hoặc sang trái 20px.

**F27 · low · SVG quan hệ dòng 665 · mũi tên hai đầu không khớp bản mobile**
- Desktop vẽ Context engineering ↔ Multi-agent hai đầu với nhãn "lý do chia". Bản vflow (dòng 617) là một chiều: context engineering là lý do để chia. Sửa: bỏ `marker-start`, giữ mũi tên chỉ vào Multi-agent.
- Tương tự, bản mobile vẽ Workflow → Agent nối tiếp, bản desktop vẽ cả hai cùng đi ra từ Augmented LLM. Cả hai đều bảo vệ được, nhưng nên thống nhất.

**F28 · low · cả hai SVG · đầu mũi tên xám trên nét màu**
- Marker `arr`/`arr2` tô `var(--muted)`, nên các nét cam (dòng 339), xanh (663), tím (664), cam (665) có đầu mũi tên màu xám. Sửa: `fill="context-stroke"` (cần kiểm hỗ trợ trình duyệt) hoặc thêm marker theo màu.

### F. HTML/JS/mobile khác

**F29 · low · dòng 755 · liên kết tới trang chưa tồn tại**
- `../llm-cost-optimization/` chưa có thư mục trong `D:\WORKSPACES\learning-ai` (lệnh `ls -d */` lúc review: 13 thư mục, không có slug này). Các liên kết khác và các anchor `../ai-agent/#flow`, `../ai-agent/#danh-gia`, `../rag/#danh-gia` đều tồn tại.
- Sửa: giữ nếu trang đó chắc chắn được gộp cùng đợt; nếu không thì bỏ liên kết.

**F30 · low · stepper dòng 856–864 · bấm "Tiếp" không cuộn về đầu bước**
- Nút điều hướng nằm cuối panel. Ở 390px các bước 3, 4 dài hơn một màn hình, nên sau khi bấm "Tiếp" người đọc đứng giữa hoặc cuối bước mới. Trang mẫu cũng vậy nên đây không phải lỗi lệch mẫu.
- Sửa (tuỳ chọn): sau `show(i)` do người bấm, cuộn `.stepper` về đầu.

**F31 · low · tương phản chữ trên cột ở dark mode**
- Chữ `--text` (#e6e8eb) trên cột `--p4` 55% nền `--surface-2`: tôi tính khoảng 4,1:1; trên cột `--muted`: khoảng 4,2:1. Chữ 13px đậm, hơi dưới 4,5:1. Là số ước tính, cần đo bằng Orca. Sửa: giảm opacity cột xuống 0,4 ở dark mode.

**F32 · low · dòng 500 · `aria-live` trên cả thẻ kết quả**
- Mỗi lần kéo thanh trượt toàn bộ cột được vẽ lại, trình đọc màn hình sẽ đọc lại hết. Chỉ đặt `aria-live` trên `#verdict`.

**Đã kiểm, không thấy lỗi:** mọi `#src-1…14` có id đích; id liên quan trong từ điển (39 mục) đều tồn tại; tìm không dấu (`fold`) xử lý đ và dấu; localStorage bọc try/catch, khóa `rag-theme` và prefix `maar-`; mọi bảng dùng `table.stack` + `labelTables`; `.d-only` ẩn dưới 1041px và có `.vflow.m-only` thay thế; cỡ chữ nhỏ nhất trong HTML là 12px (`.tag`), chữ SVG 12 đơn vị hiển thị ≈ 11,9px ở 1041px; không thấy phần tử nào có bề rộng cố định vượt 358px ở 390px (chưa đo `scrollWidth` thật).

## Thứ tự sửa đề xuất

1. F1, F2, F3, F4 (sai hoặc lệch nguồn).
2. F17, F18, F19 (mô phỏng), F23, F24 (chữ đè trong SVG).
3. F7, F9, F10, F13 (nội dung và thứ tự).
4. Phần còn lại là mức low.

## Giả định

- Brief cho phép chèn và đổi thứ tự mục miễn đủ 11 thành phần (độ tin cậy: trung bình). Nếu thứ tự là cố định thì F13 chỉ còn phương án thêm 2 câu định nghĩa.
- Trang `llm-cost-optimization` sẽ được gộp cùng đợt (trung bình).
- Ước lượng bề rộng chữ SVG dùng khoảng 6px mỗi ký tự cỡ 12 (trung bình); F25, F26 có thể không xảy ra trên font thật.

## Câu hỏi còn mở

- κ = 0,77 của LLM judge trong MAST mới đọc qua một lần WebFetch; cần mở lại mục 4 bản HTML để chốt trước khi ghi vào trang.
- Câu của [2] về "numerous complex tools" và "spend enough tokens" tôi dẫn theo trí nhớ, chưa trích lại được trong lần mở này.
