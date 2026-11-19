# Kongming review: langsmith/index.html

Ngày review: 2026-11-19. Model: Fable 5.2. Chỉ tư vấn, không sửa file trang.

**Lưu ý trạng thái file:** trang bị sửa trong lúc review (1139 → 1141 dòng; mtime cuối tôi thấy là 2026-11-19 09:03:47, 134.933 byte). Số dòng dưới đây theo trạng thái đó. Một số nhãn SVG mục 7 và nhãn `.vflow` đã đổi so với lần đọc đầu; các phát hiện đã được kiểm lại trên bản mới.

**Cách kiểm:** đọc toàn bộ trang; tải bản `.md` của 36 trang docs.langchain.com/langsmith/* và HTML của langchain.com/pricing, langchain.com/langsmith/agent-server, langfuse.com/docs/open-source, langfuse.com/self-hosting, README + LICENSE của Phoenix, trang tracing của OpenAI Agents SDK (đều HTTP 200 ngày 2026-11-19); chạy trang trong Chrome headless ở iframe 390px và 1280px, bấm các trạng thái mô phỏng, chụp ảnh hai SVG (sáng, tối) và mục 5, mục 7 ở 390px.

## Kết luận ngắn

Một lỗi nặng về giá (phát hiện 1), kéo theo số mặc định của máy tính 5.2 và thông điệp "bẫy chi phí". Phần còn lại khớp nguồn tốt; JS, mobile và chart không có lỗi chặn phát hành.

## Phát hiện

### 1. [HIGH] Trang pricing CÓ công bố đơn giá trace; trang học nói là không, và số mặc định của máy tính bị ngược

- Vị trí: dòng 537 (mục 3.6, "không công bố đơn giá cho mỗi 1.000 trace vượt mức"), đoạn giới thiệu mục 5.2 ("Trang pricing … không ghi đơn giá mỗi 1.000 trace"), dòng 592–593 (`cPb` = 1, `cPe` = 5), ghi chú nguồn [16] ("Không ghi đơn giá … đã tìm trong HTML").
- Bằng chứng: HTML của https://www.langchain.com/pricing có tooltip ở cạnh "Pay as you go thereafter ⓘ" của cả cột Developer và Plus: `data-tippy-content="0.005 LSU/base trace<br> 0.0025 LSU/extended trace upgrade"`. Script của "Usage Calculator" trên cùng trang ghi `$39 / seat / mo · includes 10K traces total · 0.005 LSU / additional trace`. FAQ cùng trang: "1 LSU = $1". Lệnh: `rg -o 'data-tippy-content="[^"]*"' pricing.html`.
- Hệ quả: giá công bố là 5 USD / 1.000 base trace và 2,50 USD / 1.000 lượt nâng extended. Số điền sẵn của trang (1 và 5) ngược tỉ lệ thật. Với cấu hình mặc định, máy tính đang ra 80,00 + 57,07 = 137,07 USD; với giá công bố là 400,00 + 28,54 = 428,54 USD (đã chạy thử trong trình duyệt).
- Hệ quả sư phạm: theo giá này, nâng extended chỉ làm một trace đắt thêm 50% (0,0075 so với 0,005 LSU). Thứ quyết định hóa đơn là SỐ trace (sampling), không phải tỉ lệ extended. Callout "Bẫy chi phí" (dòng 525), pitfall "Hóa đơn tracing tăng vọt" và callout bước 8 đang đặt trọng tâm vào extended.
- Sửa: (a) ghi đơn giá kèm "theo tooltip trang pricing, lấy ngày …, 1 LSU = 1 USD"; (b) đổi mặc định thành 5 và 2,5, đổi nhãn "minh họa" thành "giá niêm yết ngày …, có thể đổi"; (c) viết lại câu kết luận: giảm sampling là đòn bẩy chính, extended là phần cộng thêm; (d) sửa ghi chú nguồn [16]. Câu docs "should cost an order of magnitude less" không còn khớp với giá hiện tại, đừng đưa vào trang (hiện trang chưa dùng).

### 2. [MEDIUM] Thiếu: run của experiment được tạo ở mức extended theo mặc định

- Vị trí: dòng 525 (danh sách nguồn nâng extended), máy tính 5.2, câu tự kiểm 4.
- Bằng chứng: usage-and-billing.md, mục "How retention affects downstream features": "**Experiments**: Runs are created at extended retention by default." Ghi chú nguồn [15] đã có dòng này nhưng trang không dùng (`rg -i 'experiment.*extended'` không ra kết quả).
- Vì sao quan trọng: trang khuyên chạy experiment trong CI ở mỗi thay đổi; mỗi lượt chạy sinh trace tính cả base lẫn extended, và máy tính không đếm.
- Sửa: thêm một câu vào callout dòng 525 và vào dòng chú thích cuối máy tính ("chưa gồm trace của experiment, vốn ở extended theo mặc định").

### 3. [MEDIUM] "Có 4 cách host" Agent Server bỏ sót BYOC

- Vị trí: dòng 502; mục từ điển `agent-server`/`hosting`.
- Bằng chứng: deploy-overview.md có 4 thẻ (Cloud, Self-hosted with control plane, Hybrid, Standalone) nhưng mô tả trang ghi "on LangSmith Cloud, BYOC, your own infrastructure, or a standalone server"; platform-setup.md: "pick a topology (Cloud managed, BYOC, Hybrid, self-hosted with control plane, or standalone)".
- Sửa: "Trang Deploy liệt kê 4 thẻ …; nếu LangSmith của bạn là BYOC thì Agent Server cũng chạy trong data plane BYOC." Bài 2 (bảng dòng 772–779) có cùng thiếu sót, xem phát hiện 14.

### 4. [LOW] Câu "trong docs, Hybrid là một cách host Agent Server" hơi tuyệt đối

- Vị trí: dòng 517.
- Bằng chứng: observability.md dòng 65 của chính docs vẫn viết "choose between cloud, hybrid, or self-hosted" cho nền tảng. Trang pricing định nghĩa Hybrid = "SaaS control plane, Self-hosted data plane", tức gần với BYOC của docs.
- Sửa: "docs hiện dùng chủ yếu BYOC cho nền tảng và Hybrid cho Agent Server, nhưng vài trang còn dùng lẫn". Cũng nên ghi: pricing ghi vùng dữ liệu "US or EU" trong khi Regions FAQ liệt kê cả GCP APAC, AWS US, Azure US.

### 5. [LOW] Hai URL nguồn đã bị chuyển hướng

- [26] dòng 865: `docs.langchain.com/langsmith/prompt-engineering` → 308 sang `/langsmith/prompt-context-hub`.
- [30] dòng 869: `langchain.com/langsmith/deployment` → 301 sang `/langsmith/agent-server`.
- Sửa: dùng URL đích. Nội dung trích vẫn khớp (FAQ "renamed … as of November 2026" có trên trang đích).

### 6. [LOW] Callout kịch bản (2) nói "chi phí giảm" nhưng mô phỏng không hiển thị chi phí

- Vị trí: dòng 578. Mô phỏng chỉ có độ trễ (2,10 → 1,25 s khi bật model nhỏ).
- Sửa: "để thấy độ trễ giảm (model rẻ hơn) nhưng 3 example tụt", hoặc thêm một ô chi phí minh họa.

### 7. [LOW] Tiếng Việt: "Ô tô đỏ"

- Vị trí: dòng 480. Đọc thành "xe ô tô màu đỏ". Sửa: "Ô được tô đỏ … ô tô xanh" → "Ô màu đỏ … ô màu xanh".
- Phần còn lại tự nhiên, đủ dấu. Vài chỗ nên Việt hóa nhẹ: "deploy một chạm" (dòng ~504) → "deploy bằng một cú bấm"; "ít đau hơn" (bảng mục 8) → "đỡ tốn công hơn".

### 8. [LOW] Mục 7: lời dẫn "cột trái / ở giữa / cột phải" không khớp hình

- Vị trí: dòng 613. SVG có 4 cột, và cột thứ ba trộn Dashboard (cam), Dataset (xanh dương), Annotation queue (cam). Trên điện thoại không có cột nào.
- Sửa: mô tả theo màu ("Xanh lá là …, cam là …, xanh dương là …") thay vì theo cột.

### 9. [LOW] `.vflow` mục 7: mũi tên "↓ gắn vào run" ngược nghĩa

- Vị trí: dòng 625. Mũi tên đi từ Thread xuống Feedback, trong khi quan hệ là feedback gắn vào run (SVG vẽ Feedback → Trace). Nhãn giữa Dashboard và Automation rule đã được sửa thành "(từ Feedback) rule lọc theo feedback, lỗi…" nên không còn hiểu nhầm Dashboard → rule.
- Sửa: "↑ feedback gắn vào run của trace".

### 10. [LOW] Bảng mục 8: "chỉ xem được trong hệ của nhà cung cấp" mâu thuẫn với hàng trên

- Vị trí: dòng 752, so với hàng OpenAI ở bảng trên ("có thể gắn processor để gửi trace sang LangSmith, Langfuse, Phoenix…", khớp nguồn [40]).
- Sửa: "mặc định chỉ xem trong dashboard của nhà cung cấp". Cột "Tự host: Không" cũng nên là "Không áp dụng".
- Các khẳng định Langfuse, Phoenix, OpenAI còn lại khớp nguồn. Chi tiết nhỏ: Langfuse ghi "extended audit logging", trang viết "audit log".

### 11. [LOW] SVG desktop: hai nhãn sát mép

- Mục 2, dòng 389: "(rule, annotation queue)" kết thúc cách mép phải khung vài px và vượt mép phải của dải nền; chưa bị cắt (đo bằng `getBBox`, trong viewBox 1000). Sửa: `text-anchor="end"` đặt bên trái mũi tên, hoặc rút thành "(rule, queue)".
- Mục 7, dòng 714: "gắn vào" bắt đầu ngay trên nét đứt của khung "Agent · Environment". Sửa: dời nhãn xuống dưới mũi tên hoặc thu khung nét đứt 6–8 đơn vị.
- Không có chữ đè chữ, không chữ tràn hộp, hướng mũi tên đúng nghĩa, màu chú thích khớp (p3/ok-soft, p4/warn-soft, p1/accent-soft, p2/p2-soft) ở cả sáng và tối.

### 12. [LOW] Mô phỏng 5.1: evaluator `correctness` so khớp chuỗi con, dễ vỡ khi thêm example

- Vị trí: `EVALS.correctness` dùng `out.indexOf(ex.ref)`. Hiện không sai (đã chạy đủ tổ hợp), nhưng "12 ngày" chứa "2 ngày": nếu sau này một example có đáp án "2 ngày" và bản cũ "12 ngày", nó sẽ được chấm đúng oan.
- Sửa (tùy chọn): so khớp theo ranh giới từ, hoặc ghi chú trong comment.

### 13. [LOW] Máy tính 5.2: chi tiết nhỏ

- Chọn "Developer: 5.000/tháng" vẫn tính tiền phần vượt; docs ghi Developer không thẻ thanh toán bị chặn (HTTP 429) ở 5.000 trace/tháng. Nên thêm một dòng nhắc khi số trace > 5.000 ở gói Developer.
- `input` và `change` cùng gọi `renderCalc` nên mỗi thao tác vẽ hai lần; vô hại.

### 14. Nhất quán với bài 1 và bài 2 (không sửa hai trang đó)

- Không thấy câu nào bị docs hôm nay phủ nhận. Lịch sử đổi tên (LangGraph Platform → LangSmith Deployment 10/2025 → Agent Server 11/2026), "một biến môi trường", Agent Server không phụ thuộc framework, Studio đều khớp.
- Bài 2, bảng "Các cách triển khai LangSmith Agent Server" (dòng 772–779): thiếu BYOC như phát hiện 3.
- Bài 1, nguồn [24] (dòng 747): tiêu đề "LangSmith Agent Server" nhưng URL `docs.langchain.com/langsmith/deployment` nay 308 sang `/langsmith/deploy-overview` (trang "Deploy agents"). Bài 2 nguồn [24] dùng `langchain.com/langsmith/deployment`, nay 301 sang `/langsmith/agent-server`.
- Bài 1 từ điển "có bản cloud, hybrid, self-hosted": khớp pricing và observability.md; khác cách gọi BYOC của platform-setup, không sai.

## Số liệu đã tự tính lại (khớp với trang)

Mô phỏng 5.1, chạy trong trình duyệt:

| Cấu hình | correctness | ▲ · ▼ | citation | độ trễ TB | cổng |
|---|---|---|---|---|---|
| Mặc định | 5/8 → 8/8 | 3 · 0 | 0/8 → 8/8 | 2,10 → 2,50 s | cho phát hành |
| + model nhỏ | 5/8 → 5/8 | 3 · 3 | 0/8 → 8/8 | 2,10 → 1,25 s | chặn, 3 example tụt |
| Tắt lọc | 5/8 → 5/8 | 0 · 0 | 0/8 → 8/8 | 2,10 → 2,50 s | không regression, không tốt lên |
| Tắt ô dataset | 5/5 → 5/5 | 0 · 0 | 0/5 → 5/5 | 2,16 → 2,56 s | không regression, không tốt lên |

Tính tay: baseline sai ở #1, #3, #6 (văn bản cũ) nên 5/8; độ trễ baseline = (1,8+2,0+2,2+2,4)×2 ÷ 8 = 2,10; ứng viên có trích nguồn +0,4 = 2,50. KPI ở bước 6 và câu "3 example tụt" ở bước 7 của stepper khớp.

Máy tính 5.2 mặc định: trace = 3.000 × 30 × 100% = 90.000; tỉ lệ extended = 1 − 0,98 × 0,90 × 0,99 = 12,682% → 11.414; còn base 78.586; lượt evaluator 9.000; base charge (90.000 − 10.000) ÷ 1.000 × 1 = 80,00; extended 11.414 ÷ 1.000 × 5 = 57,07; tổng 137,07 USD. Trình duyệt ra đúng các số này. Câu "khoảng 9.000 trace extended mỗi tháng" ở bước 8 đúng.

## JS / HTML / mobile 390px

- Không tràn ngang (`scrollWidth` 375 trong iframe 390, chênh 15px là thanh cuộn). Không phần tử nào vượt mép phải.
- Chữ nhỏ nhất: số trích dẫn 11px, tag và badge 12px; không có chữ dưới 11px.
- Vùng bấm: nút, chip, bước, ô chọn mô phỏng đều ≥ 40px. Hộp kiểm trong checklist rộng 13px nhưng nằm trong `label`; tôi không đo chiều cao `label.check`, cần xem lại trong lượt Orca.
- Stepper 8 bước, nút Trước/Tiếp khóa đúng ở hai đầu. Từ điển 51 thẻ, tìm không dấu chạy ("du lieu" ra 6 thẻ), bấm "Liên quan" sang thẻ ngoài bộ lọc thì tự về "Tất cả". 10 thẻ lỗi thường gặp. Checklist ghi `langsmith-w1a = 1`. Mọi `href="#…"` trỏ tới id tồn tại; cả 44 nguồn đều được trích.
- Bảng mô phỏng chuyển thành thẻ đúng ở 390px (đã xem ảnh).

## Khái niệm còn thiếu (ngoài phát hiện 2)

- Docs evaluation-types còn liệt kê evaluator **composite** và **summary** (chấm trên cả experiment). Một dòng trong bảng loại evaluator là đủ.
- Không cần thêm Fleet, Sandboxes, Tuned Evaluators: ngoài phạm vi người học.

## Khẳng định đã kiểm và khớp nguồn

Retention 14/180 (Cloud) và 14/400 (BYOC, self-hosted); ba nguồn auto-upgrade và mặc định bật; UI feedback và annotation queue không nâng; evaluator chỉ tắt gia hạn được khi project mặc định là base; giới hạn 25.000 run; `thread_id`/`session_id` trên mọi run; 4 environment cố định, agent-based workspace chỉ có trên Cloud; metadata không lan cha–con; action của rule (gồm chạy evaluator); Insights ở Plus và Enterprise; RBAC, ABAC là Enterprise; self-hosted là add-on Enterprise; BYOC và self-hosted thuộc Enterprise; 5 vùng dữ liệu, không chuyển vùng; GDPR, SOC 2 Type 2, HIPAA; bulk export Parquet và mốc 03/08/2026; decision model chưa có trong SDK; comparison view đỏ/xanh và mặc định điểm cao là tốt; spend limit theo tuần, backfill chỉ lúc tạo, prompt evaluator tự lưu vào prompt hub; commit hash, commit tag, `staging`/`production`; Developer $0 1 seat 5k, Plus $39 10k, 1 Agent Server Small serverless miễn phí, Developer không có Agent Server và Engine; Redis cho tín hiệu và streaming, PostgreSQL cho dữ liệu; LLM Gateway ở beta.

## Chưa kiểm

- Nguồn [44] (changelog, mục tuần 20–24/10/2025) và ngày archive của repo `langsmith-sdk`: không tải lại.
- Ảnh 390px của phần máy tính 5.2 và `.vflow` mục 2: đã chụp nhưng chỉ xem kỹ phần 5.1 và mục 7.
- Tương phản màu ở chế độ tối trên mobile: chỉ xem SVG desktop.

## Câu hỏi còn mở

- Có muốn giữ máy tính ở dạng "giá giả định" không? Khuyến nghị: không, vì giá niêm yết đã có; dùng giá thật kèm ngày lấy và giữ ô nhập để người đọc thay bằng giá hợp đồng.

## Kết quả áp dụng

Kiểm lại ngày 2026-11-19 trước khi sửa. Bằng chứng chính: `curl -sL https://www.langchain.com/pricing | rg -o 'data-tippy-content="[^"]*LSU[^"]*"'` ra 2 lần `0.005 LSU/base trace&lt;br&gt; 0.0025 LSU/extended trace upgrade`, script calculator ghi `0.005 LSU / additional trace`, FAQ `1 LSU = $1.`; `curl -sI` cho [26] → 308 `/langsmith/prompt-context-hub`, [30] → 301 `/langsmith/agent-server`; deploy-overview.md dòng 7 và platform-setup.md dòng 40 có BYOC; evaluation-types.md có mục Composite và Summary evaluators.

| # | Quyết định | Đã làm / lý do |
|---|---|---|
| 1 | Sửa | Mục 3.6: ghi đơn giá 0,005 / 0,0025 LSU (5 và 2,5 USD mỗi 1.000), thêm vào bảng gói; máy tính 5.2 mặc định 5 và 2,5, bỏ nhãn "minh họa" ở giá; callout mục 3.5 đổi thành "Trace tự lên extended" và nói rõ số trace là đòn bẩy chính; pitfall "Hóa đơn tracing tăng vọt" đổi nguyên nhân sang ghi 100% trace, cách sửa thêm sampling/conditional tracing; bước 8 thêm 22,5 USD so với 400 USD; glossary "Extended tính thêm phí nâng"; footer; ghi chú nguồn [16] sửa. Mặc định nay ra 400,00 + 28,54 = 428,54 USD. |
| 2 | Sửa | Callout 3.5 thêm "Run của experiment được tạo sẵn ở mức extended"; chú thích máy tính thêm "Chưa gồm trace của experiment". |
| 3 | Sửa | Dòng Agent Server: "Trang Deploy có 4 lựa chọn … Nếu LangSmith của bạn chạy kiểu BYOC thì Agent Server cũng chạy được ở đó" [27][31]. Bài 2 không sửa (ngoài phạm vi), báo lại cho phiên chính. |
| 4 | Sửa một phần | Câu Hybrid đổi thành "docs hiện dùng chủ yếu BYOC cho nền tảng và Hybrid cho cách host Agent Server, nhưng vài trang còn dùng lẫn". Không thêm "US or EU" của pricing: thẻ vùng dữ liệu đã theo Regions FAQ [32], chi tiết hơn câu tóm tắt marketing. |
| 5 | Sửa | [26] và [30] đổi sang URL đích, ngày truy cập 2026-11-19; ghi chú nguồn thêm dòng redirect. |
| 6 | Sửa | Kịch bản (2): "để thấy độ trễ giảm (model nhỏ cũng rẻ hơn) nhưng 3 example tụt". |
| 7 | Sửa | "Ô màu đỏ … ô màu xanh"; "deploy bằng một cú bấm" (mục 3.4 và glossary); "đỡ tốn công hơn". |
| 8 | Sửa | Lời dẫn mục 7 mô tả theo màu (xanh lá, cam, xanh dương, tím). |
| 9 | Sửa | Mobile: "↑ feedback gắn vào run của trace". |
| 10 | Sửa một phần | Đổi thành "mặc định chỉ xem trong dashboard của nhà cung cấp". Giữ "Tự host: Không" vì cột nói về khả năng tự host dữ liệu trace, và câu đó đúng với trace mặc định của OpenAI [40]. |
| 11 | Sửa | Mục 2: "(rule, queue)". Mục 7: "gắn vào" dời xuống dưới mũi tên (y=198). Kiểm hình học ở 1280: không chồng chữ, không cắt, không nét đi qua chữ. |
| 12 | Không sửa | Dataset cố định 8 example, không đáp án nào là chuỗi con của đáp án cũ; đã chạy đủ 6 tổ hợp, kết quả đúng. |
| 13 | Sửa một phần | Thêm dòng cảnh báo HTTP 429 khi chọn gói Developer và trace > 5.000 [15]. Không sửa việc render hai lần: vô hại, không thấy được. |
| 14 | Báo lại | Không sửa bài 1, bài 2 (ngoài phạm vi). Báo phiên chính: bảng hosting bài 2 thiếu BYOC; nguồn [24] của bài 1 và bài 2 nay redirect. |
| Thiếu khái niệm | Sửa | Bảng loại evaluator thêm dòng "Composite / summary" [19]. |
| Chưa kiểm | Đã kiểm | Orca 390 và 1280, sáng và tối: tương phản 0 lỗi, console 0 lỗi; ảnh tối 390 của máy tính 5.2 và vflow mục 7 đã xem. Nguồn [44] đã đọc ở phiên trước (changelog .md, dòng 2527–2529). |
