# Brief chung cho mỗi phiên làm chủ đề (learning-ai, đợt 2)

Status: active · Ngày: 2026-11-14 · Timezone: Asia/Bangkok · Mọi đường dẫn trong file này tính từ gốc repo `learning-ai`.

## Mục tiêu
Tạo MỘT trang HTML học một chủ đề AI cho site https://tvtdev94.github.io/ (repo này, tên hiển thị "Sổ tay"). Nội dung lấy từ nghiên cứu web và có evidence. Trang phải qua kongming review, test bằng Orca browser (đặc biệt chart), dễ đọc trên điện thoại. Xong thì tự dọn dẹp.

## Người học
- Biết code nhưng mới với LLM. Mục tiêu là xây RAG và AI agent cho doanh nghiệp.
- Muốn hiểu **khái niệm cốt lõi, flow hoạt động, mối quan hệ, ví dụ**. KHÔNG cần code.
- Đọc chủ yếu trên điện thoại.
- Ngôn ngữ: tiếng Việt có dấu đầy đủ, thuật ngữ kỹ thuật giữ tiếng Anh.

## Thiết kế: dùng lại hệ thống sẵn có
Đọc kỹ trang mẫu `rag/index.html` và dùng lại đúng các thành phần sau:
- CSS tokens `:root`, kèm dark mode: `prefers-color-scheme` được guard bởi `:root:not([data-theme="light"])`, và có thêm `:root[data-theme="dark"]`.
- Script đọc theme sớm trong `<head>`, key localStorage `rag-theme` (dùng chung toàn site).
- Header sticky có nút `a.home` href `../`, mục lục ngang tự cuộn, nút đổi theme.
- Các lớp `.card .grid .callout .tag .table-wrap table.stack .vflow .m-only .d-only .svgbox`.
- Quy tắc mobile `@media (max-width:600px)` và hàm `labelTables`.
- Bọc mọi truy cập localStorage trong try/catch.
- Chép nguyên khối CSS `/* cite-tap */` ở cuối `<style>` của `rag/index.html`: số trích dẫn `[N]` có vùng bấm cao ≥ 40px, rộng ≥ 24px.

Một file tự chứa, không dùng CDN hay thư viện ngoài.

Site là một PWA (`manifest.webmanifest`, `sw.js`, `icons/`). Phiên chính chạy `python3 _work/add-pwa-head.py <slug>/index.html` trước khi publish để gắn thẻ PWA; phiên chủ đề không cần tự thêm.

Liên kết sang các trang liên quan khi hợp lý: `../rag/`, `../ai-agent/`, `../harness/`, `../hybrid-search/`, `../reranking/`, `../embedding-performance/`, `../governance/`, `../knowledge-base/`, và các slug đợt 2 bên dưới.

## Cấu trúc trang
1. Tổng quan và vì sao cần.
2. Flow: SVG ngang cho desktop (`.d-only`), bản dọc `.vflow.m-only` cho điện thoại.
3. Ví dụ đi qua từng bước: stepper tương tác, dùng tình huống doanh nghiệp cụ thể.
4. Một mô phỏng hoặc máy tính tương tác, nếu nó thật sự giúp hiểu. Số liệu do JS tính thật.
5. Từ điển khái niệm: lọc theo nhóm, tìm kiếm không dấu, liên kết sang khái niệm liên quan.
6. Bản đồ mối quan hệ: SVG cho desktop, bản dọc cho mobile.
7. So sánh và đánh đổi, dùng `table.stack`.
8. Lỗi thường gặp và cách chẩn đoán.
9. Đánh giá và đo lường.
10. Lộ trình tự học kèm câu hỏi tự kiểm tra (details/summary), checklist lưu localStorage với prefix riêng của chủ đề.
11. **Nguồn tham khảo** (`<section id="nguon">`).

## Nghiên cứu và evidence: BẮT BUỘC, không viết theo trí nhớ
- Dùng WebSearch và WebFetch (nạp bằng ToolSearch "select:WebSearch,WebFetch") cho mọi khẳng định quan trọng.
- Ưu tiên nguồn gốc: bài báo (arXiv/ACL…), tài liệu chính thức của nhà cung cấp hoặc dự án, cơ quan tiêu chuẩn.
- Chỉ dẫn những URL đã thực sự mở bằng WebFetch và thấy nội dung khớp. Không bịa link.
- Khẳng định nào không có nguồn thì viết lại cho thận trọng hoặc bỏ đi.
- Không nêu số phiên bản, giá, số liệu benchmark như sự thật nếu nguồn không nói rõ. Số liệu minh họa phải ghi "minh họa".
- Trích dẫn trong trang dùng dạng `<sup class="cite"><a href="#src-N">[N]</a></sup>`.
- Mục Nguồn dùng `<ol class="sources">`. Mỗi `<li id="src-N">` ghi: tên tài liệu, tác giả hoặc tổ chức, năm, link (`target="_blank" rel="noopener"`), ngày truy cập 2026-11-14. Thêm "Nguồn" vào mục lục.
- Ghi chú nghiên cứu vào `_work/notes/research-261114-2040-<slug>-sources.md`, mỗi dòng theo dạng: khẳng định → URL → câu trích ngắn làm bằng chứng.

## Tiêu chuẩn mobile (390px)
- Chữ thân bài từ 15px trở lên.
- Không có chữ nào trong SVG hay demo nhỏ hơn khoảng 11px khi hiển thị thực tế. Nếu nhỏ hơn thì dùng bản dọc hoặc phóng to theo bề rộng.
- Vùng bấm cao từ 40px trở lên.
- Không tràn ngang.
- Bảng chuyển thành thẻ.
- Đoạn văn ngắn, khoảng cách dòng thoáng.
- Tương phản đủ ở cả chế độ sáng và tối.

## File được phép sửa
CHỈ `<slug>/index.html` và các file report hoặc ghi chú của chủ đề mình trong `_work/notes/`.
KHÔNG sửa `index.html` gốc, KHÔNG sửa thư mục chủ đề khác, KHÔNG chạy git (phiên chính sẽ gộp và đẩy lên).

## Kongming review: BẮT BUỘC
Spawn agent `kongming`, đưa cho nó: đường dẫn file, file ghi chú nguồn, và mô tả người học. Yêu cầu kongming kiểm:
- Độ chính xác, và khẳng định có khớp nguồn không.
- Khái niệm cốt lõi còn thiếu.
- Sư phạm và tiếng Việt.
- Lỗi JS/HTML/mobile ở 390px.
- Chart.

Kongming chỉ tư vấn, không sửa file, và ghi report vào `_work/notes/kongming-261114-2040-<slug>-review.md`.

Bạn phải tự kiểm lại từng phát hiện, sửa những cái đúng, và ghi lý do với cái bác bỏ. Chưa xử lý xong review thì không được báo DONE.

## Test bằng Orca browser: BẮT BUỘC, đặc biệt là chart
1. Chạy nền `python -m http.server <port> --bind 127.0.0.1` tại gốc repo.
2. Xem lệnh bằng `orca skills get orca-cli --reference browser`.
3. Tạo tab riêng bằng `orca tab create --url http://127.0.0.1:<port>/<slug>/ --json` và luôn dùng `--page <id>` của tab đó.
4. Test ở viewport 1280x900 và `orca viewport --width 390 --height 844 --mobile`. Đặt lại viewport sau mỗi reload hoặc goto.
5. Kiểm các điểm chung:
   - `orca console` không có lỗi.
   - `scrollWidth == innerWidth` ở 390.
   - Mọi `#src-N` trỏ tới id tồn tại.
   - Mọi tương tác chạy đúng.
6. Với TỪNG chart, sơ đồ hoặc mô phỏng, ở cả mobile và desktop, cả chế độ sáng và tối:
   - Không có chữ bị cắt hay đè.
   - Mũi tên đúng hướng và đúng ý nghĩa.
   - Chú thích khớp màu.
   - Chữ trên mobile không nhỏ hơn khoảng 11px.
   - Số liệu khớp với số tự tính lại.
   - Mọi trạng thái tương tác render đúng.
   - Sau khi đổi kích thước hoặc reload, hình vẽ lại đúng.
7. Chụp screenshot và XEM ảnh ở mọi mục khi ở khổ mobile.

## Dọn dẹp trước khi kết thúc
- Dừng http.server và xác nhận cổng đã trống bằng `netstat -ano | grep <port>`.
- Đóng tab Orca bằng `orca tab close --page <id>`.
- Xóa file tạm bạn tạo ngoài các đường dẫn được phép.

## Báo cáo cuối
Báo cáo ngắn, gồm:
- Các mục đã làm và số khái niệm.
- Số nguồn và đường dẫn file ghi chú.
- Các phát hiện kongming đã sửa hoặc bác bỏ (kèm lý do).
- Danh sách chart đã test và kết quả.
- Bằng chứng verify (output lệnh).
- Kết quả dọn dẹp.
- Thông tin cho thẻ ở trang chủ: một dòng mô tả (≤ 160 ký tự), 3 tag ngắn, 1 emoji.

Kết thúc bằng:
```
Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
Summary: 1–2 câu
```

## Bảng chủ đề đợt 2

| # | Slug | Port |
|---|---|---|
| 1 | llm-fundamentals | 8781 |
| 2 | prompt-engineering | 8782 |
| 3 | tool-calling-structured-output | 8783 |
| 4 | context-engineering | 8784 |
| 5 | llm-evaluation | 8785 |
| 6 | query-transformation | 8786 |
| 7 | model-context-protocol | 8787 |
| 8 | agent-memory | 8788 |
| 9 | multi-agent-agentic-rag | 8789 |
| 10 | graphrag | 8790 |
| 11 | prompt-injection-guardrails | 8791 |
| 12 | llm-observability | 8792 |
| 13 | llm-cost-optimization | 8793 |
| 14 | fine-tuning-vs-rag | 8794 |

Gợi ý nguồn ban đầu cho từng chủ đề (chưa đủ, phải tự nghiên cứu thêm): `_work/notes/researcher-261114-2030-next-ai-topics.md`.
