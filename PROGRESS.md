# Tiến trình Sổ tay (trước đây là learning-ai)

Cập nhật lần cuối: 2026-11-16 chiều (Asia/Saigon). File này dùng để làm tiếp trên máy khác.

- Site: https://tvtdev94.github.io/ (tên hiển thị "Sổ tay": ghi chép AI, lập trình và cuộc sống).
- Repo: https://github.com/tvtdev94/tvtdev94.github.io (public). Nhánh `main`, GitHub Pages build từ thư mục gốc.
- Đổi tên 2026-11-19: repo `learning-ai` thành `tvtdev94.github.io`, site từ `/learning-ai/` lên gốc domain. Thư mục `learning-ai/` trong repo chỉ chứa trang chuyển hướng cho link cũ (mỗi bài đã publish trước ngày đổi tên một trang) và một `sw.js` tự gỡ service worker cũ. Bài mới không cần thêm gì vào đó. Thư mục trên máy vẫn tên `learning-ai`.
- Trang gốc `/` là trang giới thiệu cá nhân (ảnh `images/avatar.png` lấy từ avatar GitHub, email, WhatsApp, GitHub, Facebook). Danh sách bài nằm ở `/so-tay/` (`so-tay/index.html`), chia nhóm bằng trường `group` trong `TOPICS`: `ai` (mặc định), `code`, `life`. Nút về của mỗi bài trỏ `../so-tay/`.

## Cấu trúc repo

| Đường dẫn | Là gì | Có lên site không |
|---|---|---|
| `index.html` | Trang giới thiệu cá nhân | Có |
| `so-tay/index.html` | Danh sách bài, gồm các thẻ lấy từ mảng `TOPICS` | Có |
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
   - Bỏ slug khỏi `exclude` trong `_config.yml` và thêm thẻ vào `TOPICS` trong `so-tay/index.html`. Kiểm nút về của trang trỏ `../so-tay/`.
   - Chạy `python3 _work/add-pwa-head.py <slug>/index.html` để gắn thẻ PWA (manifest, icon, service worker).
   - Commit theo conventional commits, rồi push.
   - Chờ Pages build, kiểm link thật bằng Orca ở 390px.
   - Gửi link qua Telegram.
9. **Trả lời và viết nội dung bằng tiếng Việt có dấu đầy đủ.**

## Trạng thái các chủ đề

### Đã publish (27)

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
| `context-engineering` | 14 | Publish 2026-11-16. Review kongming: `_work/notes/kongming-261116-context-engineering-review.md`.  |
| `llm-evaluation` | 28 | Publish 2026-11-16. Review: `_work/notes/kongming-261116-llm-evaluation-review.md` |
| `query-transformation` | 24 | Publish 2026-11-16. Review: `_work/notes/kongming-261116-query-transformation-review.md` |
| `llm-fundamentals` | 22 | Publish 2026-11-17. Review: `_work/notes/kongming-261117-llm-fundamentals-review.md` |
| `prompt-engineering` | 24 | Publish 2026-11-17. Review: `_work/notes/kongming-261117-prompt-engineering-review.md` |
| `tool-calling-structured-output` | 21 | Publish 2026-11-17. Review: `_work/notes/kongming-261117-tool-calling-structured-output-review.md` |
| `model-context-protocol` | 29 | Publish 2026-11-17. Theo spec MCP 2026-07-28. Review: `_work/notes/kongming-261117-model-context-protocol-review.md` |
| `agent-memory` | 22 | Publish 2026-11-17. Review: `_work/notes/kongming-261117-agent-memory-review.md` |
| `prompt-injection-guardrails` | 34 | Publish 2026-11-17. Chỉ mô tả tấn công ở mức ý tưởng, không có payload. Review: `_work/notes/kongming-261117-prompt-injection-guardrails-review.md` |
| `llm-observability` | 34 | Publish 2026-11-17. Review: `_work/notes/kongming-261117-llm-observability-review.md` |
| `llm-cost-optimization` | 25 | Publish 2026-11-17. Giá lấy từ trang giá chính thức ngày 2026-11-17; giá đổi thì cập nhật. Review: `_work/notes/kongming-261117-llm-cost-optimization-review.md` |
| `fine-tuning-vs-rag` | 25 | Publish 2026-11-17. Tình trạng fine-tuning của nhà cung cấp lấy từ trang chính thức ngày 2026-11-17 (OpenAI đang thu hẹp). Review: `_work/notes/kongming-261117-fine-tuning-vs-rag-review.md` |
| `graphrag` | 25 | Publish 2026-11-17. README Microsoft GraphRAG ghi dự án "largely in maintenance mode"; trang đã cảnh báo. Review: `_work/notes/kongming-261117-graphrag-review.md` |
| `langchain` | 40 | Publish 2026-11-18. Bài 1/3 chuỗi LangChain. Review: `_work/notes/kongming-261118-langchain-review.md` |
| `langgraph` | 30 | Publish 2026-11-18. Bài 2/3 chuỗi LangChain. Review: `_work/notes/kongming-261118-langgraph-review.md` |
| `langsmith` | 44 | Publish 2026-11-19. Bài 3/3 chuỗi LangChain. Giá trace lấy từ trang giá chính thức ngày 2026-11-19 (0.005 LSU/trace, 1 LSU = $1); giá đổi thì cập nhật. Review: `_work/notes/kongming-261118-langsmith-review.md` |
| `llm-rubric-grading` | 31 | Publish 2026-11-19. Dùng LLM chấm điểm như tính năng sản phẩm, khác `llm-evaluation`. Review: `_work/notes/kongming-261119-llm-rubric-grading-review.md` |
| `document-parsing-chunking` | 35 | Publish 2026-11-19. Có playground chunker. Review: `_work/notes/kongming-261119-document-parsing-chunking-review.md` |

### Bản nháp trong repo, chưa publish (nằm trong `exclude`)

Không còn bản nháp nào.

### Mới có ghi chú nguồn, chưa có trang

Không còn. Cả 22 chủ đề trong kế hoạch đã publish (2026-11-17).

### Chia đợt cho các chủ đề còn lại (cập nhật 2026-11-17)

Mỗi đợt 2 chủ đề chạy song song, mỗi chủ đề một phiên theo brief. Nhịp: **tối đa 2 bài mỗi giờ**, đợt sau chỉ bắt đầu khi đợt trước đã publish xong. Người dùng đã nói bắt đầu ngày 2026-11-17; nếu dừng giữa chừng thì chờ người dùng nói "bắt đầu" lại.

| Đợt | Chủ đề | Port | Trạng thái |
|---|---|---|---|
| 1 | `llm-fundamentals` (đã có bản nháp), `prompt-engineering` | 8781, 8782 | Xong (2026-11-17) |
| 2 | `tool-calling-structured-output`, `model-context-protocol` | 8783, 8787 | Xong (2026-11-17) |
| 3 | `agent-memory`, `prompt-injection-guardrails` | 8788, 8791 | Xong (2026-11-17) |
| 4 | `llm-observability`, `llm-cost-optimization` | 8792, 8793 | Xong (2026-11-17) |
| 5 | `graphrag`, `fine-tuning-vs-rag` (chưa có ghi chú nguồn) | 8790, 8794 | Xong (2026-11-17) |
| 6 | `langchain`, `langgraph` (chuỗi hệ sinh thái LangChain, trang mới) | 8795, 8796 | Xong (2026-11-18) |
| 7 | `langsmith` (bài cuối chuỗi, trang mới) | 8797 | Xong (2026-11-19) |
| 8 | `document-parsing-chunking`, `llm-rubric-grading` (trang mới) | 8798, 8799 | Xong (2026-11-19) |
| 9 | `long-document-extraction`, `multilingual-rag` (trang mới) | 8800, 8801 | Đang làm (2026-11-19) |

Bảng port (8781–8794) và phạm vi nội dung của từng chủ đề nằm trong `_work/topic-session-brief.md`, cùng mục "Bảng chủ đề đợt 2".

## Việc chung còn tồn đọng

1. **Màu chế độ sáng toàn site: đã xong (2026-11-16).** `reranking`, `governance`, `knowledge-base`, `hybrid-search` và trang chủ `index.html` đã dùng token màu của `rag/index.html`; `ai-agent` và `embedding-performance` đã đậm sẵn. Đo bằng Orca ở 390px, cả sáng và tối: 0 chữ dưới 4.5:1 trên cả 7 trang. Trang mới phải chép token màu từ `rag/index.html`.
2. **Link nội bộ trỏ tới trang chưa publish**, ví dụ `../harness/` và `../llm-cost-optimization/`. Chúng sẽ hết 404 khi các trang đó được publish. Có thể quét bằng: `rg -o 'href="\.\./[a-z-]+/' */index.html`.
3. **Vùng bấm số trích dẫn `[N]`: đã xong (2026-11-17).** Mọi trang có khối CSS `/* cite-tap */` giống nhau ở cuối `<style>`: cao ≥ 40px, rộng ≥ 24px, margin âm nên không đổi khoảng cách dòng. Đo bằng Orca ở 390px, sáng và tối: 22/22 trang đạt. Trang mới phải chép khối này từ `rag/index.html`.
4. Key localStorage cho theme là `rag-theme`, **dùng chung toàn site**. Đừng đổi tên key này.

## Thiết lập trên máy mới

1. `git clone https://github.com/tvtdev94/tvtdev94.github.io.git learning-ai`
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
