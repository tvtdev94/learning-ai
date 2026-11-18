# Kongming review: langgraph/index.html

Ngày: 2026-11-18. Chỉ tư vấn, không sửa file trang. Model: Fable 5.2.

## Cách kiểm

- Trang: `langgraph/index.html`, mtime `2026-11-18 18:01:11`, 129.407 byte, 1.141 dòng. File **không đổi** trong lúc review (đã `stat` lại trước khi viết report). Số dòng bên dưới theo trạng thái này.
- Nguồn: tải bản markdown gốc của 25 trang docs (`curl https://docs.langchain.com/<path>.md`, đều HTTP 200) rồi `rg` đúng câu trích. Trang sản phẩm, 2 blog, README GitHub: `curl` + bỏ thẻ HTML. PyPI: `https://pypi.org/pypi/langgraph/json`.
- Ngữ nghĩa mô phỏng: dựng lại đúng graph hoàn tiền của trang bằng **langgraph 1.2.22 thật** (venv tạm ở `/tmp/lgrev`, `InMemorySaver`, `durability="sync"`), in `get_state_history` sau interrupt, sau resume, sau replay.
- Mobile: headless Chrome qua iframe 390px và 768px, hai theme; chụp ảnh mục 2, 4 (bước 8), 5, 7 ở 390px và hai SVG desktop ở 1280px (theme sáng).
- **Chưa kiểm**: ảnh theme tối của hai SVG desktop (token màu giống hệt `rag/index.html`, đã `diff`); mọi trạng thái tương tác bằng mắt (vẫn cần lượt Orca của phiên chủ đề); `../langsmith/` chưa tồn tại (link có chủ ý).

## Phát hiện

### Cao

**H1. Bước 2 của stepper mô tả sai checkpoint đầu tiên; số "7 checkpoint" lệch với LangGraph thật (8).**
- Vị trí: dòng 917 (callout "Checkpoint đầu tiên: `values` chỉ có yêu cầu, `next = (classify)`"), dòng 923 ("7 checkpoint (1 input + 6)"), mô phỏng `start()` dòng 968–972.
- Bằng chứng tài liệu [7]: "For a sequential graph like `START -> A -> B -> END`, there are separate super-steps for the input, node A, and node B", "After you run the graph, there will be exactly 4 checkpoints", và snapshot đầu có `next=('__start__',)`, `metadata={'source': 'input', ..., 'step': -1}`; snapshot thứ hai `step: 0`, `next=('node_a',)`. Mục durability cũng ghi: `"sync"` "commits the input checkpoint (step `-1`) and the step `0` checkpoint before the first user node executes".
- Bằng chứng chạy thật (langgraph 1.2.22, graph của trang, 12.500.000 đ, duyệt): 8 checkpoint, step −1 (`next=('__start__',)`), 0 (`next=('classify',)`), 1…6. Số lượt chạy node = 8 (approval 2), hoàn thật = 1, khớp trang. Chỉ số checkpoint lệch.
- Vì sao đáng sửa: bài tập tuần 3 (dòng 807) bảo người học xem `get_state_history`; họ sẽ thấy N+2 chứ không phải N+1, và checkpoint đầu có `next = ('__start__',)`.
- Sửa (chọn một):
  - Tối thiểu: sửa callout bước 2 thành "LangGraph lưu hai checkpoint lúc khởi động: checkpoint input (`step = -1`, `next = (__start__)`) và checkpoint sau START (`step = 0`, `values` có yêu cầu, `next = (classify)`)". Ở bước 8 và callout mục 5 thêm một câu: "Mô phỏng gộp hai checkpoint khởi động làm một; chạy thật sẽ thấy 8".
  - Đầy đủ hơn: cho `start()` lưu hai checkpoint (#0 input, #1 sau START), KPI và bước 8 thành 8 "(2 lúc khởi động + 6)".

### Trung bình

**M1. Sai tên pha ở chú thích flow.**
- Dòng 340: "Trong pha Update, các node chưa nhìn thấy update của nhau".
- Nguồn [5]: câu đó nằm ở pha **Execution**: "Execution: Execute all selected actors in parallel... During this phase, channel updates are invisible to actors until the next step."
- Sửa: "Trong pha Execution, các node chưa nhìn thấy update của nhau; update chỉ được áp vào state ở pha Update và node chỉ thấy từ super-step sau."

**M2. Thứ tự "Checkpoint → Edge chọn node tiếp" trong cả hai sơ đồ flow mâu thuẫn với chính trang.**
- Vị trí: vflow dòng 281–284; SVG dòng 317–323 (ô Edge nằm ngoài khung super-step, sau Checkpoint).
- Lý do: trang nói checkpoint chứa `next` (dòng 391, 918). Chạy thật: checkpoint sau `assess` đã có `next=('approval',)`, tức routing xong trước khi checkpoint được ghi. Theo [5], việc chọn node là pha Plan của super-step sau, dựa trên channel vừa được cập nhật.
- Sửa: bỏ ô "Edge" riêng. Đổi nhãn "3 · Update" thành "reducer gộp update; edge gửi message cho node kế", giữ Checkpoint là ô cuối của super-step ("lưu state + next"), mũi tên vòng về Plan đi ra từ Checkpoint. Mũi tên sang END cũng đi ra từ Checkpoint ("không còn node được kích hoạt").

**M3. Replay trong mô phỏng thiếu checkpoint "fork", và "replay từ checkpoint cuối không làm gì" chỉ đúng với node.**
- Vị trí: `travel()` dòng 995–1001; dòng 448; mục "Nên thử" số 3.
- Chạy thật: replay từ checkpoint trước `issue_refund` làm lịch sử từ 8 lên **11** (1 checkpoint `source='fork'` sao lại điểm xuất phát + 2 checkpoint loop). Mô phỏng: 7 lên 9. Replay từ checkpoint cuối: 0 node chạy (khớp "no-op" của [10]) nhưng vẫn thêm 1 checkpoint `source='fork'`. Khi replay tới `approval`, interrupt gắn vào checkpoint fork mới, không gắn lại vào checkpoint cũ như mô phỏng (dòng 979 dùng `head()` là checkpoint cũ).
- Lưu ý: bảng StateSnapshot của [7] chỉ liệt kê `source` là `input`, `loop`, `update`; giá trị `fork` là quan sát khi chạy 1.2.22, chưa thấy trong docs. Vì vậy không nên viết thành khẳng định có trích dẫn.
- Sửa: trong `travel()` gọi `saveCk('fork')` (bản sao values/next của checkpoint được chọn, nhãn "bản sao để rẽ nhánh") rồi mới chạy tiếp; hoặc giữ nguyên và thêm vào callout mục 5: "LangGraph thật tạo thêm một checkpoint sao tại điểm replay; mô phỏng bỏ qua bước này".

**M4. Sau crash, mô phỏng nói process mới "chạy tiếp"; thực tế phải có người gọi lại.**
- Vị trí: `crash()` dòng 991 ("Process mới đọc checkpoint mới nhất… và chạy tiếp từ next = …").
- Nguồn [7], bảng "Choose how to continue a thread": "Continue after an error | `graph.invoke(None, config)` | Loads the latest checkpoint and retries unfinished work" và "Reusing a thread ID alone does not mean that execution resumes."
- Sửa nhật ký: "Process chết. Checkpoint #N vẫn nằm trong PostgreSQL. Ứng dụng gọi lại `graph.invoke(None, config)` với cùng thread_id để chạy tiếp từ next = …". Thêm một câu ở 3.4: thư viện không tự chạy lại; Agent Server mới có hàng đợi và worker lo việc này [23].

**M5. Thiếu khái niệm "graph migration" ngay trong tình huống của trang.**
- Vị trí: bước 6 (dòng 921: "Đêm đó server được deploy lại. Không sao").
- Nguồn [2], mục Graph migrations: "Interrupted threads: you can change edges and add nodes. Do not rename or remove a node the thread is about to enter. On resume, LangGraph looks up that node by name, and a missing name fails the run." và "Renaming a key drops the saved value for that key in existing threads."
- Sửa: thêm một câu vào callout bước 6 và một dòng ở bảng lỗi mục 9: "Deploy bản mới làm thread đang chờ duyệt không resume được → đã đổi tên hoặc xóa node `approval`, hoặc đổi tên key → không đổi tên/xóa node mà thread đang chờ; thêm node và sửa edge thì an toàn".

**M6. `"exit"` bị mô tả hẹp hơn tài liệu, và thiếu mặc định.**
- Dòng 401 và glossary dòng 1073: `"exit"` "chỉ ghi khi graph kết thúc (crash giữa chừng là mất)".
- Nguồn [7]: "persists changes only when graph execution exits — successfully, with an error, or due to a human-in-the-loop interrupt." Người học dễ hiểu nhầm là dùng `"exit"` thì interrupt không được lưu.
- Mặc định: ghi chú nguồn nói không tìm thấy. Có hai chỗ nêu: [23] "Durability mode controls checkpoint frequency—`async` (default)" (cho Agent Server), và docstring `Pregel.stream` của langgraph 1.2.22: "defaults to `"async"`" (đọc bằng `inspect.getsource`).
- Sửa: "`"exit"` chỉ ghi khi lần chạy thoát ra (xong, lỗi, hoặc dừng ở interrupt); process chết giữa chừng thì mất." Thêm "Mặc định là `"async"`" kèm [23] (ghi rõ là theo trang Agent Server).

**M7. Điều khiển mô phỏng nằm xa kết quả trên điện thoại.**
- Ảnh 390px: nút "Chạy super-step" ở khoảng y=785, sơ đồ bắt đầu ở y=1145, status/state/checkpoint/nhật ký ở dưới y=1700. Mỗi lần bấm phải cuộn xuống hơn một màn hình rồi cuộn lên lại.
- Sửa: ở `max-width:860px` đặt hàng nút thành `position:sticky; bottom:0` (nền `var(--bg)`, viền trên), hoặc chuyển `#simStatus` và dòng nhật ký mới nhất lên ngay dưới hàng nút, KPI xuống dưới sơ đồ.

**M8. Mục 3 dài 11 tiểu mục đứng trước ví dụ.**
- Brief đặt ví dụ ở vị trí 3; trang chèn "Cơ chế cốt lõi" (3.1–3.11, dòng 344–511) trước ví dụ và mô phỏng. Trên điện thoại đây là đoạn rất dài toàn định nghĩa trước khi thấy một lần chạy cụ thể.
- Sửa: giữ 3.1–3.6 (state, super-step, persistence, chịu lỗi, interrupt, time travel) trước ví dụ; chuyển 3.7–3.11 (streaming, memory, subgraph, hai API, triển khai) ra sau mô phỏng thành mục "Mở rộng". Nếu không muốn đổi thứ tự, thêm một dòng đầu mục 3: "Muốn thấy chạy trước thì nhảy tới mục 4–5 rồi quay lại".

**M9. Lộ trình trỏ sai mục.**
- Dòng 806: tuần 3 "Persistence và người duyệt" bảo "Đọc mục 8–9" (So sánh, Lỗi); nội dung persistence/interrupt nằm ở 3.3–3.6. Dòng 801: tuần 2 "Graph đầu tiên" bảo đọc mục 6–7 (từ điển, bản đồ). Dòng 796: tuần 1 "Đọc mục 1–4" gồm cả mục 3 rất dài.
- Sửa: tuần 1 đọc 1, 2, 3.1–3.2, 4, 5; tuần 2 đọc lại 3.1–3.2 + mục 6; tuần 3 đọc 3.3–3.6 + mục 9; tuần 4 đọc 3.8–3.11, 7, 8, 10. "Quickstart chính thức" (dòng 801) cần có link.

### Thấp

**L1. "mặc định tối đa 3 lần" dễ hiểu thành 3 lần retry.** Dòng 412, glossary 1076. Nguồn [8]: `max_attempts` = 3, "Maximum number of attempts, including the first". Sửa: "mặc định tối đa 3 lần chạy, tính cả lần đầu".

**L2. Ô bảng không có nguồn.** Dòng 720, cột Functional API: "`interrupt()` trong entrypoint hoặc task". [16] chỉ nói `@entrypoint` "manages execution, interrupts, and checkpointing"; không tìm thấy câu nói interrupt đặt trong task. Sửa: "`interrupt()` trong entrypoint [16]".

**L3. Thiếu mẫu Skills.** Dòng 487–492 liệt kê 4 mẫu; [14] có 5 (Subagents, Handoffs, Skills, Router, Custom workflow). Thêm một dòng hoặc ghi "bốn trong năm mẫu".

**L4. Bảng mục 8, hàng State: "Phạm vi: Một lần chạy đang diễn ra".** Có checkpointer thì state sống qua nhiều lần chạy của cùng thread (chính là short-term memory ở 3.8). Sửa: "Giá trị hiện tại của một thread (hoặc của một lần chạy nếu không có checkpointer)".

**L5. `travel()` trên checkpoint hiện tại tạo "nhánh 2" giả.** Kiểm bằng probe: chạy 1 super-step, bấm checkpoint đang là "hiện tại" → nhật ký "Replay từ checkpoint #1 (nhánh 2)" và checkpoint sau mang nhãn "nhánh 2" dù không rẽ nhánh. Sửa: `if(id===sim.headId&&!sim.intr) return` (hoặc ghi log "đang ở checkpoint này").

**L6. Sập process với InMemorySaver đặt lại cả bộ đếm.** KPI về "0 | 1 | 0" (probe), nên không thấy cái giá của việc chạy lại. Sửa: giữ `steps`, `runs`, `nodeRuns` qua `start()` khi gọi từ `crash()`.

**L7. Sơ đồ mô phỏng phình to ở 601–860px.** Ở 768px `#simSvg` là 687×972px (một cột, `width:100%`). Sửa: `#simSvg{max-width:420px;margin:0 auto}`.

**L8. Đoạn dẫn mục 7 mô tả bố cục desktop.** Dòng 610: "Hàng trên…", "Bên phải…" không đúng với bản dọc trên điện thoại. Sửa thành mô tả không phụ thuộc vị trí ("Nhóm đầu là các cách viết… Hai ô cuối là phần của LangSmith"). Trong bản dọc, ô Streaming (dòng 630) nằm ngay trên "↓ chạy trên server" nên đọc như Streaming chạy trên server; thêm một `.ar` trống hoặc đưa Streaming lên cạnh Pregel runtime.

**L9. "(ô xanh: vừa đổi)"** dòng 577: "xanh" lẫn giữa xanh lá (node đã chạy) và xanh dương (ô vừa đổi). Sửa: "ô xanh dương".

**L10. Số không ghi nguồn hoặc nhãn.** Dòng 794 "Khoảng 4–5 giờ mỗi tuần" là ước lượng của người viết; thêm "ước lượng". Các chỉ số mục 10 đã ghi "gợi ý": đạt.

**L11. Tiếng Việt còn dịch sát.**
- "ảnh chụp chung của ứng dụng" (dòng 352, 1048) → "bản ghi trạng thái mà mọi node dùng chung".
- "node mồ côi" (374) → "node không nối với node nào".
- "Lần chạy tiến lên theo từng super-step rời nhau" (266) → "Graph chạy theo từng nhịp, mỗi nhịp gọi là một super-step".
- "node không còn message chờ sẽ chuyển sang không hoạt động" (381) → "node nào không còn message chờ thì nghỉ".
- "Super-step có tính giao dịch" (340, 1065) → thêm vế giải thích "hoặc ghi hết, hoặc không ghi gì".
- Đoạn mở mục 2 (dòng 266) dồn 5 thuật ngữ mới vào một đoạn 6 câu; tách thành 3 đoạn ngắn hoặc gạch đầu dòng.
- Mục 1, thẻ "Vấn đề 1" dùng "checkpoint", "super-step" trước khi có ví dụ bộ hồ sơ; đưa thẻ "Bộ hồ sơ đi qua nhiều bàn" lên trước bốn thẻ vấn đề, hoặc chú "(một nhịp chạy)" ngay tại chỗ.

**L12. Tap target.** Probe 390px: nút, chip, mục lục, checkpoint, summary, `.rel a`, số trích dẫn đều ≥ 40px. Còn lại: 10 link trong câu văn và 5 link ở mục Nguồn cao 19–20px (cùng quy ước với các trang khác; không cần sửa nếu site chấp nhận link trong câu).

## Khái niệm còn thiếu (theo mức cần cho người học)

1. **Graph migration khi còn thread đang dừng** (xem M5).
2. **Bốn cách gọi lại một thread** [7]: input mới (không xóa thread, áp qua reducer), `invoke(None, config)` sau lỗi, `Command(resume=…)`, replay bằng `snapshot.config`. Trang mới nói rải rác hai cách sau. Một bảng 4 dòng ở 3.3 là đủ.
3. **Vòng lặp agent vẽ thành graph**: node `model` ↔ node `tools`, conditional edge "còn tool call?" → END. Đây là cầu nối với bài 1 (`create_agent`) mà trang chỉ nhắc nửa câu ở dòng 370. Một vflow nhỏ 3 ô là đủ.
4. **Timeout và error handler** [8]: tài liệu nêu ba cơ chế (retries, timeouts, error handling); trang chỉ có RetryPolicy. Ghi chú nguồn [18] có "4 chiến lược lỗi" nhưng trang chưa dùng.
5. **Runtime context / config**: truyền user_id, tenant, model lúc chạy ([2] mục Runtime context). Cần cho bài toán doanh nghiệp nhiều tenant và cho namespace của store.
6. **Nhiều interrupt cùng lúc** ở các nhánh song song: resume bằng map interrupt ID → giá trị [9].
7. **Double texting** trên Agent Server (hai input tới cùng một thread khi run trước chưa xong) [23]; ghi chú nguồn có nhưng trang không nhắc.
8. **Dọn checkpoint**: [6] gợi ý xóa checkpoint cũ định kỳ; [7] có `DeltaChannel` để giảm dung lượng. Mục 10 mới nói "đặt chính sách dọn dẹp" chung chung.

## Đã kiểm và khớp nguồn

- Tên sản phẩm: GA 2025-05-14 và ghi chú "As of October 2025… re-named to LangSmith Deployment" [25]; "renamed to LangSmith Agent Server as of November 2026" [24]; "LangSmith Deployment is now LangSmith Agent Server" [22][23].
- PyPI: 1.2.22, upload 2026-11-14, `>=3.10`, MIT (JSON API). 1.0 ngày 2025-10-22, "no breaking changes until 2.0" [21].
- `create_agent` "uses LangGraph under the hood" [21]; "built on top of LangGraph… durable execution, human-in-the-loop support, persistence" [19]; recursion limit 9.999 [20].
- Recursion limit 10.007 từ 1.1.4 [2]; `GraphRecursionError`, `RemainingSteps` [4].
- Checkpoint mỗi super-step, `thread_id` là khóa chính, StateSnapshot, pending writes, ba durability mode, `EncryptedSerializer`, sqlite/postgres [7].
- Interrupt: node chạy lại từ đầu, không bọc try/except trần, khớp theo thứ tự, static interrupt, `__interrupt__`, "persistent cursor", 4 mẫu [9].
- Time travel: replay/fork, node sau checkpoint chạy lại, `update_state` không rollback, interrupt luôn kích hoạt lại [10].
- 7 stream mode và event streaming v1.2 [11]; at-least-once, idempotency key, `max_attempts` 3 [8]; transactional super-step [4]; 3 pha Pregel [5]; `langgraph-supervisor` "no longer actively maintained" [15]; subgraph per-invocation [13]; Functional API [16]; 4 cách deploy và điều kiện gói [22]; hàng đợi và PostgreSQL [23]; Studio [26]; README [27]; test [29]; lỗi concurrent update [30].
- **Interrupt không tạo checkpoint mới**: chạy thật cho thấy sau interrupt vẫn là 5 checkpoint, interrupt nằm trong `tasks` của checkpoint `step=3` (`next=('approval',)`). Mô phỏng và callout dòng 531 đúng.
- **Số ở bước 8**: probe đọc KPI mô phỏng sau kịch bản 1 là "6 | 7 | 8 | 1 / 1", khớp bước 8 của stepper. Đường 3.200.000 đ: "5 | 6 | 6 | 1 / 1". Replay trước `issue_refund`: gọi API 2, hoàn thật 1. Replay tới `approval` rồi từ chối: interrupt kích hoạt lại, `refund_id` rỗng, trạng thái "từ chối, đã báo khách".
- HTML/JS: không tràn ngang ở 390/768/1280; 30 nguồn, không `#src-N` hỏng, không nguồn nào không được trích; chữ nhỏ nhất 11px (số trích dẫn) và 11,3px (nhãn edge trong `#simSvg` ở 390px); tương phản chữ thường ≥ 4,5 ở cả hai theme (chỉ nút disabled có opacity .5); `localStorage` cả 3 chỗ đều trong try/catch; token `:root` và khối `cite-tap` giống hệt trang mẫu; 52 khái niệm, tìm không dấu "luu" ra 5 thẻ.

## Câu hỏi còn mở

- `interrupt()` có được gọi trong `@task` không: chưa tìm thấy câu khẳng định trong [16] (xem L2).
- `source='fork'` của checkpoint replay chưa có trong bảng StateSnapshot của [7]; chỉ là quan sát trên 1.2.22.

## Kết quả áp dụng

Phiên chủ đề tự kiểm lại từng phát hiện (WebFetch docs ngày 2026-11-18, chạy lại mô phỏng trong Orca) rồi sửa `langgraph/index.html`.

| Mã | Quyết định | Ghi chú |
|---|---|---|
| H1 | Sửa | Checkpointers [7] xác nhận "exactly 4 checkpoints" cho START→A→B→END, checkpoint input `step -1`, `next=('__start__',)`. Bước 2 stepper mô tả hai checkpoint khởi động; mô phỏng lưu #0 (input, step -1) và #1 (step 0); bước 8 và KPI thành 8 checkpoint. Orca: kịch bản đầy đủ ra 6 / 8 / 8 / 1·1. |
| M1 | Sửa | Pregel [5]: câu "invisible until the next step" thuộc pha Execution. |
| M2 | Sửa | Bỏ ô "Edge" riêng ở cả SVG và bản dọc; Update ghi "reducer gộp, edge → node kế"; Checkpoint "state + next"; vòng lặp và END đi ra từ Checkpoint. |
| M3 | Sửa một phần | Checkpoint `source='fork'` chưa có trong docs nên không mô phỏng như sự thật; thêm câu trong callout mục 5 rằng bản thật có thể ghi thêm checkpoint khi replay. Log replay checkpoint cuối đổi thành "không chạy lại node nào". |
| M4 | Sửa | Xác nhận bảng "Choose how to continue a thread" và câu "Reusing a thread ID alone does not mean that execution resumes" [7]. Log crash nói ứng dụng gọi `graph.invoke(None, config)`; thêm bảng "Bốn cách gọi lại một thread" ở 3.3 và câu về tự host ở 3.4. |
| M5 | Sửa | Xác nhận mục Graph migrations [2]. Thêm vào callout bước 6, bảng lỗi mục 9 và từ điển (Graph migration). |
| M6 | Sửa | Xác nhận câu đầy đủ về `"exit"` [7] và "async (default)" trên trang Agent Server [23]. Sửa 3.3 và từ điển. |
| M7 | Sửa | Hàng nút mô phỏng `position:sticky; top:60px` khi ≤860px; trạng thái và KPI đưa lên ngay dưới hàng nút. Đã chụp ảnh 390px xác nhận nút luôn hiện khi cuộn trong mô phỏng. |
| M8 | Sửa một phần | Giữ thứ tự (khái niệm trước ví dụ) để stepper dùng được thuật ngữ; thêm dòng đầu mục 3 chỉ đường tới mục 4–5 và nói 3.7–3.11 đọc sau được. |
| M9 | Sửa | Lộ trình trỏ đúng mục; thêm link quickstart (HTTP 200). |
| L1 | Sửa | "3 lần chạy, tính cả lần đầu"; thêm retry/timeout/error handler [8]. |
| L2 | Sửa | Ô bảng thành "Entrypoint quản lý interrupt [16]". |
| L3 | Sửa | Thêm mẫu Skills [14]. |
| L4 | Sửa | Hàng State: "giá trị hiện tại của một thread (hoặc một lần chạy nếu không có checkpointer)". |
| L5 | Sửa | Bấm checkpoint hiện tại chỉ ghi log, không tạo nhánh. |
| L6 | Sửa | Crash với InMemorySaver giữ bộ đếm super-step và lượt chạy node. |
| L7 | Sửa | `#simSvg` max-width 420px. |
| L8 | Sửa | Đoạn dẫn mục 7 không phụ thuộc bố cục; tách Streaming khỏi mũi tên "host". |
| L9 | Sửa | "ô xanh dương". |
| L10 | Sửa | "Ước lượng khoảng 4–5 giờ mỗi tuần". |
| L11 | Sửa | Viết lại "ảnh chụp chung", "node mồ côi", "chuyển sang không hoạt động", tách đoạn mở mục 2 thành 3 đoạn, giải thích "giao dịch", chú "(mỗi nhịp chạy)" ở thẻ Vấn đề 1. |
| L12 | Không sửa | Link trong câu văn theo cùng quy ước các trang khác; số trích dẫn, nút, chip, summary đều ≥ 40px. |
| Thiếu 1 | Sửa | Graph migration (xem M5). |
| Thiếu 2 | Sửa | Bảng bốn cách gọi lại thread (xem M4). |
| Thiếu 3 | Sửa | Thẻ "Vòng lặp agent vẽ thành graph" ở 3.1 [4][21]. |
| Thiếu 4 | Sửa | Retry, timeout, error handler ở 3.4 [8]. |
| Thiếu 5 | Sửa | Thẻ "Runtime context" ở 3.1 và từ điển [2]. |
| Thiếu 6 | Không sửa | Nhiều interrupt song song là chi tiết nâng cao, không cần cho người mới. |
| Thiếu 7 | Sửa | Một mệnh đề về double texting ở 3.11 [23]. |
| Thiếu 8 | Không sửa | Mục 10 đã có "dung lượng checkpoint" và chính sách dọn dẹp; chi tiết DeltaChannel vượt mức người mới. |

Kiểm lại sau sửa (Orca, 390px và 1280px, hai theme): console 0 lỗi; scrollWidth = innerWidth = 390; 30 nguồn, không `#src-N` hỏng, không nguồn thừa; không chữ < 11px (nhỏ nhất 11,8px trong SVG mô phỏng ở 390px); không chữ SVG đè nhau hoặc tràn hộp; tương phản chữ màu ≥ 4,5 ở cả hai theme; 54 khái niệm.
