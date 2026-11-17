# Tiến trình learning-ai

Cập nhật lần cuối: 2026-11-16 chiều (Asia/Saigon). File này dùng để làm tiếp trên máy khác.

- Site: https://tvtdev94.github.io/learning-ai/
- Repo: https://github.com/tvtdev94/learning-ai (public). Nhánh `main`, GitHub Pages build từ thư mục gốc.

## Cấu trúc repo

| Đường dẫn | Là gì | Có lên site không |
|---|---|---|
| `index.html` | Trang chủ, gồm các thẻ chủ đề lấy từ mảng `TOPICS` | Có |
| `<slug>/index.html` | Mỗi chủ đề là một file tự chứa, không dùng CDN | Có, trừ các thư mục nằm trong `exclude` của `_config.yml` |
| `_config.yml` | Danh sách bản nháp chưa được publish | Không |
| `_work/topic-session-brief.md` | **Brief chuẩn** cho mỗi phiên làm một chủ đề: thiết kế, nghiên cứu, review, test, dọn dẹp | Không, vì Jekyll bỏ qua thư mục `_*` |
| `_work/notes/research-*-sources.md` | Ghi chú nguồn, mỗi dòng: khẳng định → URL → câu trích | Không |
| `_work/notes/kongming-*-review.md` | Report review của kongming cho từng trang | Không |
| `_work/notes/researcher-261114-2030-next-ai-topics.md` | Danh sách 14 chủ đề đề xuất, có nguồn và thứ tự học | Không |
| `PROGRESS.md` | File này | Không |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA: cài site như app điện thoại, đọc offline các trang đã mở. Đổi `CACHE` trong `sw.js` nếu cần xóa cache cũ | Có |
| `_work/add-pwa-head.py` | Gắn thẻ PWA vào `<head>` của trang; chạy lại an toàn | Không |

## Quy trình đã thống nhất với người dùng

1. **Mỗi chủ đề làm trong một phiên riêng**, theo đúng `_work/topic-session-brief.md`.
2. **Mỗi lần chỉ chạy 1–2 phiên.** Người dùng đã dừng đợt chạy khoảng 20 agent song song vì tốn quá nhiều token.
3. **Nội dung phải lấy từ nghiên cứu web (WebSearch + WebFetch), không viết theo trí nhớ.** Mỗi khẳng định chính có trích dẫn `[N]` trỏ tới mục "Nguồn tham khảo". Chỉ dẫn những URL đã thực sự mở.
4. **Bắt buộc có kongming review.** Phải duyệt từng phát hiện: sửa, hoặc ghi lý do bác bỏ.
5. **Bắt buộc test bằng Orca browser**, đặc biệt là chart, sơ đồ và mô phỏng. Test ở 1280px và 390px, cả chế độ sáng lẫn tối. Phải đạt: không tràn ngang, console 0 lỗi, chữ trên mobile ≥ 11px, thân bài ≥ 15px, vùng bấm ≥ 40px.
6. **Dễ đọc trên điện thoại** là ưu tiên hàng đầu. Trên mobile, sơ đồ dùng bản dọc `.m-only`, bảng dùng `table.stack`.
7. **Dọn dẹp khi xong:** dừng http.server, đóng tab Orca, xóa file tạm.
8. **Publish:**
   - Bỏ slug khỏi `exclude` trong `_config.yml` và thêm thẻ vào `TOPICS` trong `index.html`.
   - Chạy `python3 _work/add-pwa-head.py <slug>/index.html` để gắn thẻ PWA (manifest, icon, service worker).
   - Commit theo conventional commits, rồi push.
   - Chờ Pages build, kiểm link thật bằng Orca ở 390px.
   - Gửi link qua Telegram.
9. **Trả lời và viết nội dung bằng tiếng Việt có dấu đầy đủ.**

## Trạng thái các chủ đề

### Đã publish (12)

| Slug | Nguồn | Ghi chú |
|---|---|---|
| `rag` | 34 | Đã bổ sung evidence. Màu chế độ sáng đã làm đậm, đạt ≥ 4.5:1 |
| `ai-agent` | 18 | |
| `reranking` | 15 | |
| `embedding-performance` | 17 | Màu chế độ sáng đã làm đậm |
| `governance` | 19 | |
| `knowledge-base` | 21 | |
| `hybrid-search` | 21 | |
| `harness` | 24 | Publish 2026-11-16 |
| `multi-agent-agentic-rag` | 16 | Publish 2026-11-16. Đã áp dụng review kongming (kết quả ở cuối file review). Có link tới `context-engineering`, `llm-evaluation`, `query-transformation`: **404 tới khi các trang đó publish** |
| `context-engineering` | 14 | Publish 2026-11-16. Review kongming: `_work/notes/kongming-261116-context-engineering-review.md`. Link tới `llm-fundamentals`: **404 tới khi trang đó publish** |
| `llm-evaluation` | 28 | Publish 2026-11-16. Review: `_work/notes/kongming-261116-llm-evaluation-review.md` |
| `query-transformation` | 24 | Publish 2026-11-16. Review: `_work/notes/kongming-261116-query-transformation-review.md` |

### Bản nháp trong repo, chưa publish (nằm trong `exclude`)

| Slug | Tình trạng khi dừng | Việc còn lại |
|---|---|---|
| `llm-fundamentals` | Có bản nháp | Chưa review và chưa test |

### Mới có ghi chú nguồn, chưa có trang

`prompt-engineering`, `tool-calling-structured-output`, `model-context-protocol`, `agent-memory`, `prompt-injection-guardrails`, `llm-observability`, `llm-cost-optimization`, `graphrag`. Ghi chú nguồn nằm trong `_work/notes/research-261114-2040-<slug>-sources.md`. Nên mở lại các URL để kiểm chứng trước khi dùng.

### Chưa bắt đầu

`fine-tuning-vs-rag`.

### Chia đợt cho các chủ đề còn lại (cập nhật 2026-11-17)

Mỗi đợt 2 chủ đề chạy song song, mỗi chủ đề một phiên theo brief. Nhịp: **tối đa 2 bài mỗi giờ**, đợt sau chỉ bắt đầu khi đợt trước đã publish xong. Người dùng đã nói bắt đầu ngày 2026-11-17; nếu dừng giữa chừng thì chờ người dùng nói "bắt đầu" lại.

| Đợt | Chủ đề | Port | Trạng thái |
|---|---|---|---|
| 1 | `llm-fundamentals` (đã có bản nháp), `prompt-engineering` | 8781, 8782 | Đang làm |
| 2 | `tool-calling-structured-output`, `model-context-protocol` | 8783, 8787 | Chờ |
| 3 | `agent-memory`, `prompt-injection-guardrails` | 8788, 8791 | Chờ |
| 4 | `llm-observability`, `llm-cost-optimization` | 8792, 8793 | Chờ |
| 5 | `graphrag`, `fine-tuning-vs-rag` (chưa có ghi chú nguồn) | 8790, 8794 | Chờ |

Bảng port (8781–8794) và phạm vi nội dung của từng chủ đề nằm trong `_work/topic-session-brief.md`, cùng mục "Bảng chủ đề đợt 2".

## Việc chung còn tồn đọng

1. **Màu chế độ sáng toàn site: đã xong (2026-11-16).** `reranking`, `governance`, `knowledge-base`, `hybrid-search` và trang chủ `index.html` đã dùng token màu của `rag/index.html`; `ai-agent` và `embedding-performance` đã đậm sẵn. Đo bằng Orca ở 390px, cả sáng và tối: 0 chữ dưới 4.5:1 trên cả 7 trang. Trang mới phải chép token màu từ `rag/index.html`.
2. **Link nội bộ trỏ tới trang chưa publish**, ví dụ `../harness/` và `../llm-cost-optimization/`. Chúng sẽ hết 404 khi các trang đó được publish. Có thể quét bằng: `rg -o 'href="\.\./[a-z-]+/' */index.html`.
3. **Vùng bấm số trích dẫn `[N]` dưới 40px trên mọi trang.** Các agent đã để nguyên cho đồng nhất; chờ người dùng quyết có sửa toàn site không.
4. Key localStorage cho theme là `rag-theme`, **dùng chung toàn site**. Đừng đổi tên key này.

## Thiết lập trên máy mới

1. `git clone https://github.com/tvtdev94/learning-ai.git`
2. Mở Claude Code tại thư mục repo. Đọc `PROGRESS.md` và `_work/topic-session-brief.md`.
3. Kiểm tra các công cụ sau trên máy mới (**chưa kiểm**, vì chúng là cài đặt riêng của máy cũ):
   - Agent `kongming` dùng để review.
   - Orca CLI (`orca`) dùng để test trình duyệt.
   - MCP `mcgram` dùng để gửi Telegram.
   - `gh` đã đăng nhập tài khoản `tvtdev94` để push.
   Nếu thiếu công cụ nào thì báo người dùng, không tự thay bằng công cụ khác.
4. Ghi chú, report và file ở `_work/notes/` từ giờ ghi thẳng vào repo, không còn ghi vào `D:\WORKSPACES\reseacher\plans\reports\` như trên máy cũ.
5. Thứ tự gợi ý khi làm tiếp: lần lượt từng bản nháp (theo bảng chia đợt bên trên), rồi đến các chủ đề mới. Mỗi lần 1–2 chủ đề.
6. Máy hiện tại (2026-11-16) đã có đủ `kongming`, `orca`, `mcgram`, `gh` (tài khoản `tvtdev94`). Mẹo Orca: `orca viewport --width 1280 --height 900` không kèm `--mobile` thì bị bỏ qua (cửa sổ vẫn 512px); thêm `--mobile` mới ra đúng 1280px.
