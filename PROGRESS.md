# Tiến trình learning-ai

Cập nhật lần cuối: 2026-11-16 (Asia/Bangkok). File này dùng để làm tiếp trên máy khác.

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
   - Commit theo conventional commits, rồi push.
   - Chờ Pages build, kiểm link thật bằng Orca ở 390px.
   - Gửi link qua Telegram.
9. **Trả lời và viết nội dung bằng tiếng Việt có dấu đầy đủ.**

## Trạng thái các chủ đề

### Đã publish (7)

| Slug | Nguồn | Ghi chú |
|---|---|---|
| `rag` | 34 | Đã bổ sung evidence. Màu chế độ sáng đã làm đậm, đạt ≥ 4.5:1 |
| `ai-agent` | 18 | Có link sang `../harness/`, link này **đang 404** vì Harness chưa publish |
| `reranking` | 15 | |
| `embedding-performance` | 17 | Màu chế độ sáng đã làm đậm |
| `governance` | 19 | |
| `knowledge-base` | 21 | |
| `hybrid-search` | 21 | |

### Bản nháp trong repo, chưa publish (nằm trong `exclude`)

| Slug | Tình trạng khi dừng | Việc còn lại |
|---|---|---|
| `harness` | **Gần xong.** Đã review, đã sửa, đã test bằng Orca; đang dọn dẹp thì bị dừng | Kiểm nhanh bằng Orca ở 390px và 1280px, sau đó publish. Publish xong thì link 404 từ trang ai-agent hết lỗi |
| `multi-agent-agentic-rag` | Có bản nháp và review kongming với 32 phát hiện, **chưa áp dụng** | Áp dụng các phát hiện trong `_work/notes/kongming-261114-2040-multi-agent-agentic-rag-review.md`. Quan trọng nhất: F1 (kappa 0.88 là mức đồng thuận giữa người với người; con số của LLM judge là 0.77, cần mở lại nguồn để xác nhận), F2 (mâu thuẫn "5 mẫu"), F17/F18 (mô phỏng), F23/F24 (nhãn SVG bị đè). Sau đó test và publish |
| `context-engineering` | Có bản nháp; đang test mô phỏng thì dừng | Chưa có kongming review. Cần review, test, publish |
| `llm-evaluation` | Có bản nháp | Chưa review và chưa test |
| `llm-fundamentals` | Có bản nháp | Chưa review và chưa test |
| `query-transformation` | Có bản nháp | Chưa review và chưa test |

### Mới có ghi chú nguồn, chưa có trang

`prompt-engineering`, `tool-calling-structured-output`, `model-context-protocol`, `agent-memory`, `prompt-injection-guardrails`, `llm-observability`, `llm-cost-optimization`, `graphrag`. Ghi chú nguồn nằm trong `_work/notes/research-261114-2040-<slug>-sources.md`. Nên mở lại các URL để kiểm chứng trước khi dùng.

### Chưa bắt đầu

`fine-tuning-vs-rag`.

Bảng port (8781–8794) và phạm vi nội dung của từng chủ đề nằm trong `_work/topic-session-brief.md`, cùng mục "Bảng chủ đề đợt 2".

## Việc chung còn tồn đọng

1. **Màu chế độ sáng toàn site.** `rag` và `embedding-performance` đã làm đậm token màu để chữ nhỏ đạt ≥ 4.5:1. Các trang `ai-agent`, `reranking`, `governance`, `knowledge-base`, `hybrid-search` có thể vẫn dùng màu cũ (khoảng 3.6–4.4:1). Cần một lượt đồng bộ màu theo `rag/index.html`, rồi đo lại bằng Orca.
2. **Link nội bộ trỏ tới trang chưa publish**, ví dụ `../harness/` và `../llm-cost-optimization/`. Chúng sẽ hết 404 khi các trang đó được publish. Có thể quét bằng: `rg -o 'href="\.\./[a-z-]+/' */index.html`.
3. Key localStorage cho theme là `rag-theme`, **dùng chung toàn site**. Đừng đổi tên key này.

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
5. Thứ tự gợi ý khi làm tiếp: Harness, rồi Multi-agent, rồi lượt đồng bộ màu, rồi lần lượt từng bản nháp, rồi đến các chủ đề mới. Mỗi lần 1–2 chủ đề.
