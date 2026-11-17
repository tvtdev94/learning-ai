# Kongming review: model-context-protocol/index.html

Ngày: 2026-11-17 · Người review: kongming (advisory, không sửa trang).
Trạng thái file lúc review: 888 dòng, mtime 12:00:37 (file đã đổi một lần trong lúc review, từ 11:57:55; số dòng dưới đây đã kiểm lại theo bản 12:00:37).

## Phạm vi đã kiểm và cách kiểm

- **Nguồn spec**: tải bản markdown gốc (`curl https://modelcontextprotocol.io/<path>.md`) của 23 trang: versioning, changelog, basic, mrtr, discover, tools, resources, prompts, elicitation, authorization, transports, stdio, streamable-http, architecture, deprecated, schema, latest, intro, learn/architecture, security_best_practices, client-best-practices, registry/about, lifecycle 2025-11-25. Đối chiếu bằng `rg` trên văn bản gốc.
- **Nguồn ngoài**: mở lại [23] Invariant Labs và [24] Anthropic code execution bằng WebFetch. **Không kiểm lại**: [20], [21], [25], [26] (chỉ dựa vào ghi chú research).
- **JS**: chạy node trên mảng `T` và `LOG` trích từ trang; tính contrast theo công thức WCAG.
- **Không kiểm**: không mở trình duyệt, nên mọi nhận định về 390px là suy ra từ CSS, chưa đo trên máy thật.

Kết quả các phép tính được yêu cầu (đều khớp):

| Mục | Kỳ vọng | Kết quả |
|-|-|-|
| Máy tính mặc định (N=8, T=15, K=400, U=5, 200K) | 48.000 = 24%; 2.800 = 1,4%; tiết kiệm 94,2% | Khớp: `pct(24)`→"24%", `pct(1.4)`→"1,4%", `(1-2800/48000)*100`=94,17→"94,2" |
| Bản tích hợp M=3, N=8 | 24 → 11 | Khớp |
| Log KPI | — | Đúng tool 10/12 = 83%; isError 1/12; lỗi giao thức 1/12; trung vị (450+520)/2 = 485 ms; lớn nhất 2.300 ms; cần duyệt 3, từ chối 1 |
| Từ điển | — | 48 thẻ (13/13/12/10), không trùng id, không có link "Liên quan" hỏng, mọi số nguồn tồn tại |
| Citation | src-1..29 | 29 mục định nghĩa, không mục nào thừa, không số nào trỏ ra ngoài |
| localStorage | tiền tố `mcp-` | Đúng (dòng 875–876); theme dùng chung khóa `rag-theme` như các trang khác |
| Tìm không dấu | — | Regex trong `fold()` đúng dải U+0300–U+036F, có xử lý `đ` |

Các khẳng định rủi ro đã đối chiếu và **đúng với nguồn**: mã lỗi -32020/-32021/-32022 và -32602 (bảng mã lỗi ở /basic; thiếu `_meta` bắt buộc → -32602 + HTTP 400); dạng message MRTR (`resultType: "input_required"`, `inputRequests`, `inputResponses`, `requestState` trong params khi gửi lại, id phải khác, chỉ 3 method); mẫu `DiscoverResult` (khớp từng trường với ví dụ ở /server/discover); mặc định annotation (readOnlyHint false, destructiveHint true, idempotentHint false, openWorldHint true); 401 + `resource_metadata` + `scope`, 403 `insufficient_scope`, cấm token trong query string, cấm nhận/chuyển token khác; bảng deprecated (Roots/Sampling/Logging, "First revision released on or after 2027-07-28", đường thay thế); registry (preview, chỉ metadata, không nhận server private, ủy thác quét bảo mật); ngưỡng 1%–5%, `search_tools`, `get_tool_details`; header `MCP-Protocol-Version`/`Mcp-Method`/`Mcp-Name`; Origin sai → 403; probe `server/discover` trên stdio.

---

## Phát hiện

### K1 — Số "150.000 → 2.000 token" gán nhầm cho progressive discovery
- **Mức độ**: trung bình
- **Vị trí**: mục 7, bảng "Bốn cách", hàng "MCP + progressive discovery" (dòng 479).
- **Bằng chứng**: trang viết "Thấp; ví dụ của Anthropic: từ 150.000 xuống 2.000 token", đặt ở hàng progressive discovery (host đưa meta-tool tìm kiếm). Nguồn [24] gán con số này cho cách **code execution với tool trình bày dưới dạng file**: "This lets the agent load only the definitions it needs for the current task. This reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%." `search_tools` chỉ được nhắc sau đó như một lựa chọn thay thế ("Alternatively, a `search_tools` tool can be added…") và bài không đưa số nào cho nó.
- **Gợi ý sửa**: chuyển con số sang hàng "MCP + code mode": "Thấp cho cả definition lẫn kết quả trung gian; ví dụ của Anthropic: 150.000 → 2.000 token [24]". Hàng progressive discovery chỉ ghi "Thấp: chỉ nạp definition khi cần [28]". Nếu muốn giữ ở hàng cũ thì phải nói rõ "trong bài về code execution, nhờ chỉ nạp definition cần thiết".

### K2 — Máy tính: vạch mốc 1% và 5% gần như vô hình ở trạng thái mặc định
- **Mức độ**: trung bình
- **Vị trí**: CSS dòng 122–123 (`.bar-fill.all{background:var(--p4)}`, `.bar-mark{background:var(--bad)}`), JS dòng 757; chú thích dòng 363.
- **Bằng chứng**: ở mặc định, thanh "Nạp hết" dài 24% nên cả hai vạch (left 1% và 5%) nằm đè lên phần tô `--p4`. Contrast đo được: `#a82f2f` trên `#8f4c0a` = **1,03:1** (sáng); `#ec7373` trên `#e39a4f` = **1,24:1** (tối). Trên thanh progressive, vạch đỏ trên `--p3` = 1,10:1. Chú thích lại hứa "Mốc 1% và 5% context". Thêm nữa, ở 390px track rộng khoảng 328px: mốc 1% cách mép 3px, mốc 5% cách 16px, thanh progressive 1,4% chỉ rộng khoảng 4–5px và bị vạch 1% che gần hết.
- **Gợi ý sửa**: (a) đổi vạch sang `background:var(--text)` kèm `box-shadow:0 0 0 1px var(--surface)` để nổi trên mọi nền; (b) đặt `min-width:3px` cho `.bar-fill`; (c) vì vùng 0–5% quá hẹp trên điện thoại, thêm một dòng chữ dưới thanh thay cho việc dựa vào vạch, ví dụ "Mốc 5% = 10.000 token" (JS tính `ctx*0.05`), hoặc vẽ thêm một thanh thứ ba chỉ phóng to đoạn 0–10% context.

### K3 — Log L6: người dùng từ chối nhưng vẫn ghi "Thành công" và có độ trễ 700 ms
- **Mức độ**: trung bình
- **Vị trí**: mảng `LOG` dòng 849; KPI dòng 864–870; câu chú thích dòng 566.
- **Bằng chứng**: `['L6','Đóng ticket TK-2207','ticket__close_ticket','ticket__close_ticket','ok',700,'deny']` hiển thị cột Kết quả = "Thành công", Độ trễ = "700 ms", Duyệt = "Từ chối". Nếu bị từ chối thì host không gửi `tools/call`, nên không có kết quả và không có độ trễ của server. Dòng này mâu thuẫn với chính bài học ở mục 2 (bước 5 chặn trước bước 6) và làm sai độ trễ trung vị (700 ms đang được tính vào).
- **Gợi ý sửa**: thêm trạng thái thứ tư trong `RES`, ví dụ `skip:['skip','Không chạy (bị từ chối)']`, để `r[5]=null` và hiển thị "—"; chỉ `lat.push` khi lời gọi thật sự chạy. Khi đó còn 11 lượt có độ trễ, trung vị = **450 ms** (dãy 90,150,380,410,420,450,520,610,890,950,2300), lớn nhất vẫn 2.300. Sửa câu ở dòng 566 "Độ trễ trung vị của số lượt chẵn…" cho khớp (11 lượt là số lẻ). Nên ghi thêm một câu: độ trễ là thời gian server xử lý, không tính thời gian chờ người duyệt (L3, L10).

### K4 — Hứa "viết một lần, mọi ứng dụng đều dùng được" mà thiếu điều kiện về phiên bản và tính năng host hỗ trợ
- **Mức độ**: trung bình
- **Vị trí**: lead dòng 214 ("viết một MCP server cho hệ thống CRM một lần, mọi ứng dụng hỗ trợ MCP đều cắm vào dùng được"); thẻ "Lý do 2" dòng 220; bảng mục 7 dòng 478 ("Có, mọi host hỗ trợ MCP").
- **Bằng chứng**: chính spec nói mỗi request được chấp nhận hay từ chối theo phiên bản ("the server accepts or rejects each request independently", /versioning) và "Extensions are always opt-in and require explicit support from both client and server" (/specification/latest). Server không được gửi `inputRequests` mà client chưa khai ("Servers MUST NOT send an inputRequests that the client has not declared support for", /mrtr). Ghi chú research dòng 95 tự nhận: "Không nêu số liệu bao nhiêu host đã lên 2026-07-28: không có nguồn". Người học doanh nghiệp đọc câu ở lead sẽ kỳ vọng tương thích tuyệt đối, rồi ở tuần 1 mở một host có thể vẫn chạy bản cũ (initialize, session) và thấy khác hẳn trang.
- **Gợi ý sửa**: thêm một câu ngay sau lead hoặc trong thẻ "Lý do 2": "Điều kiện: host và server phải có một phiên bản giao thức chung, và host phải hỗ trợ đúng tính năng server cần (ví dụ elicitation, resource, prompt). Mỗi host hỗ trợ một tập khác nhau; trang này không có số liệu bao nhiêu host đã lên bản 2026-07-28, nên hãy kiểm tài liệu của host bạn dùng." Ở dòng 478 đổi thành "Có, với host hỗ trợ cùng phiên bản và tính năng". Ở checklist tuần 1 (dòng 575) thêm việc "ghi lại host đó đang nói bản spec nào".

### K5 — Thiếu phần "bên viết server phải làm gì" và quyền theo từng người dùng
- **Mức độ**: trung bình
- **Vị trí**: thiếu trên toàn trang (rg không thấy "rate limit", "làm sạch", "theo quyền"); chỗ hợp để thêm là mục 8 hoặc bước 3 của stepper.
- **Bằng chứng**: trang nói kỹ nghĩa vụ của host/client (duyệt, log, kiểm kết quả) nhưng bỏ qua nghĩa vụ của server, trong khi người học sẽ là bên viết server cho CRM, ticket. Spec /server/tools: "Servers MUST: Validate all tool inputs; Implement proper access controls; Rate limit tool invocations; Sanitize tool outputs". Cùng trang: danh sách tool "MAY vary by the authorization presented on the request" nhưng "MUST NOT vary" theo kết nối. Cả hai đã có trong ghi chú research (dòng 118, 120) mà chưa lên trang. Câu hỏi doanh nghiệp nào cũng hỏi là "nhân viên A có thấy đơn của khu vực B qua trợ lý không"; trang chưa trả lời thẳng.
- **Gợi ý sửa**: thêm một callout ngắn ở mục 8, ví dụ: "**Phía server cũng có việc bắt buộc.** Server phải kiểm mọi tham số đầu vào, kiểm quyền người gọi, giới hạn tần suất gọi và làm sạch đầu ra [6]. Danh sách tool có thể khác nhau theo quyền trong token của từng người, nên MCP server phải áp đúng phân quyền của hệ thống gốc, không dùng một tài khoản toàn quyền cho mọi người [6][16]." Thêm một dòng vào bài tập tuần 2 (dòng 579): "ai được thấy tool nào".

### K6 — Thiếu định hướng "có phải tự viết host không" và "mua hay tự làm server"
- **Mức độ**: thấp
- **Vị trí**: mục 1 hoặc mục 7 (thiếu).
- **Bằng chứng**: ghi chú research dòng 147 có sẵn bằng chứng từ [25]: "Connect to remote MCP servers from the Messages API without a separate MCP client" (chưa kiểm lại hôm nay), và dòng 142 nói có server dựng sẵn cho Google Drive, Slack, GitHub, Postgres. Trang không dùng hai ý này. Người muốn làm agent cho doanh nghiệp cần biết ba lựa chọn: dùng host có sẵn, gọi MCP server từ API của nhà cung cấp model, hay tự viết host; và với server: dùng server do nhà cung cấp hệ thống phát hành hay tự viết.
- **Gợi ý sửa**: thêm 2–3 câu sau bảng "Bốn cách" ở mục 7, có citation [25] và [20]; mở lại [25] để xác nhận câu trích trước khi viết.

### K7 — Số bước của stepper (mục 3) không khớp số bước của flow (mục 2)
- **Mức độ**: thấp
- **Vị trí**: flow dòng 254–270 và SVG dòng 284–311; tiêu đề stepper dòng 703, 708, 715.
- **Bằng chứng**: flow: 5 = "Host duyệt", 6 = "Gọi tool", 7 = "Kết quả". Stepper: "Bước 5 · Host kiểm chính sách rồi gửi tools/call" (gộp 5+6+7 của flow), "Bước 6 · Thao tác ghi: người duyệt, server hỏi thêm (MRTR)" (lặp lại 4–7 lần hai), "Bước 7 · Kết quả về LLM". Nhánh MRTR trong flow lại ghi "quay lại bước 5" theo số của flow. Người đọc vừa học "bước 6 = gọi tool" sẽ gặp "Bước 6" mang nghĩa khác chỉ một màn hình sau.
- **Gợi ý sửa**: giữ nội dung, chỉ đổi nhãn stepper để chỉ về flow, ví dụ "Lượt 1 · Flow bước 5–7: host duyệt rồi gửi tools/call" và "Lượt 2 · Flow bước 4–7 lần nữa: thao tác ghi + MRTR"; hoặc thêm một dòng `who` nhỏ "Tương ứng bước 5–7 của flow".

### K8 — Flow: ô 5 tên "Host duyệt" nhưng chú thích màu là "Người dùng duyệt"; hai loại hỏi người dùng bị gộp
- **Mức độ**: thấp
- **Vị trí**: SVG dòng 300–303, vflow dòng 265 và 268, legend dòng 327.
- **Bằng chứng**: ô 5 tô `--p4`, legend gọi màu đó là "Người dùng duyệt", còn tiêu đề ô là "Host duyệt". Nhánh MRTR vẽ mũi tên 6 → 5, tức gộp "xin đồng ý gọi tool" (consent, do host quyết) với "server xin thêm dữ liệu" (elicitation, người dùng trả lời câu hỏi của server). Stepper bước 6 tách hai việc này rất rõ, flow thì không. Hai bản SVG và vflow nói cùng một điều (đã so từng nút và từng nhánh), nên lỗi nằm ở cả hai.
- **Gợi ý sửa**: đổi tiêu đề ô 5 thành "5. Duyệt" với dòng phụ "host kiểm chính sách · người dùng đồng ý", và đổi legend thành "Host kiểm, người dùng duyệt". Nhãn nhánh MRTR đổi thành "server cần thêm thông tin: client hỏi người dùng rồi gửi lại (id mới)", bỏ cụm "quay lại bước 5" ở vflow.

### K9 — Bản đồ quan hệ: chú thích "MCP dựa trên" sai với Tool calling; hai bản SVG và vflow lệch nhau
- **Mức độ**: thấp
- **Vị trí**: SVG dòng 418–464, vflow dòng 385–409, chú thích dòng 467.
- **Bằng chứng**:
  1. Dòng 467: "Mũi tên từ 'Nền tảng' nghĩa là MCP dựa trên". Đúng với JSON-RPC và OAuth, nhưng **không đúng với Tool calling**: mục 1 của chính trang nói "MCP chỉ lo việc trao đổi ngữ cảnh… không quy định ứng dụng dùng LLM thế nào" [19]. Tool calling là thứ host dùng cạnh MCP, không phải nền của MCP (resource và prompt không cần tool calling).
  2. Nhãn mũi tên: vflow ghi "MCP chuẩn hóa phần nối tool và dữ liệu", "được dùng trong", "đo xem tool có được chọn và chạy đúng không"; SVG không có nhãn nào ngoài "mặt trái".
  3. "Đo và quan sát": vflow đặt bên trong hộp "TRUNG TÂM"; SVG đặt thành cột riêng "ĐI KÈM: ĐO LƯỜNG".
  4. vflow có tiêu đề "RỦI RO"; SVG không có.
  5. "Context engineering" nằm dưới "DÙNG Ở ĐÂU" nhưng nó không "dùng" MCP; quan hệ thật là MCP tạo ra token mà context engineering phải quản.
  6. Bản đồ không có legend; màu chỉ được giải thích gián tiếp qua tiêu đề cột.
- **Gợi ý sửa**: tách ô "Tool calling" khỏi nhóm "Nền tảng" (đặt cạnh MCP với nhãn "host dùng cùng MCP để LLM chọn tool"), hoặc sửa câu ở dòng 467 thành "MCP dựa trên JSON-RPC 2.0 và OAuth 2.1; tool calling là cơ chế host dùng song song". Thêm ba nhãn mũi tên của vflow vào SVG (font ≥12 trong viewBox). Trong vflow, đưa "Đo và quan sát" ra hộp riêng "ĐI KÈM". Đổi tiêu đề cột phải thành "LIÊN QUAN TỚI" hoặc ghi dòng phụ của Context engineering là "phải quản token do MCP đưa vào".

### K10 — Bảng mục 1 ghi `elicitation/create` là "Lệnh chính" như một lệnh gọi độc lập
- **Mức độ**: thấp
- **Vị trí**: dòng 239.
- **Bằng chứng**: ở bản 2026-07-28, server không còn tự gửi request; `elicitation/create` chỉ xuất hiện như một giá trị trong `inputRequests` của `InputRequiredResult` ("The previous pattern of server-initiated requests is no longer supported", /mrtr). Bảng mục 7 (dòng 503) nói đúng điều này, nên hai bảng trong cùng trang cho hai ấn tượng khác nhau.
- **Gợi ý sửa**: ô "Lệnh chính" ghi "`elicitation/create`, gửi kèm trong `InputRequiredResult` (xem MRTR ở mục 3)".

### K11 — "phải … chỉ bind 127.0.0.1": spec dùng SHOULD, không phải MUST
- **Mức độ**: thấp
- **Vị trí**: callout dòng 546 ("Server HTTP chạy local phải kiểm header Origin và chỉ bind 127.0.0.1").
- **Bằng chứng**: /transports/streamable-http: "Servers **MUST** validate the `Origin` header" nhưng "When running locally, servers **SHOULD** bind only to localhost (127.0.0.1)". Thẻ từ điển "origin" (dòng 795) viết tách hai vế nên ổn hơn.
- **Gợi ý sửa**: "phải kiểm header Origin, và nên chỉ bind 127.0.0.1".

### K12 — Ô tìm kiếm từ điển: chữ 15px trên điện thoại (iOS sẽ tự phóng to khi chạm) và cao dưới 40px
- **Mức độ**: trung bình (suy ra từ CSS, chưa đo trên máy)
- **Vị trí**: dòng 84 (`.gloss-tools input{…padding:8px 12px…font:inherit}`), dòng 165 (`body{font-size:15px}` ở ≤600px), dòng 178 (danh sách `min-height:40px` không có input).
- **Bằng chứng**: `font:inherit` kéo cỡ chữ input xuống 15px ở ≤600px; Safari iOS tự zoom trang khi focus vào input có cỡ chữ dưới 16px, làm lệch bố cục cho tới khi người dùng tự thu nhỏ lại. Chiều cao ước tính: 8 + 8 + khoảng 18 (line-height normal) + 2 viền = khoảng 36px, dưới ngưỡng 40px.
- **Gợi ý sửa**: thêm vào khối `@media (max-width:600px)`: `.gloss-tools input{font-size:16px;min-height:40px}`. Trang mẫu prompt-engineering có cùng CSS, nên sửa ở template.

### K13 — Stepper trên điện thoại: bấm "Tiếp" xong người đọc đứng ở cuối nội dung mới
- **Mức độ**: thấp (kế thừa từ template, trang prompt-engineering cũng vậy)
- **Vị trí**: `show()` dòng 724–727; nút điều hướng dòng 343 nằm dưới `#stepBody`.
- **Bằng chứng**: `show()` chỉ thay `innerHTML`, không cuộn. Bước 5 và 6 mỗi bước có hai khối JSON dài; ở 390px mỗi bước dài nhiều màn hình. Nút "Tiếp →" nằm cuối, nên sau khi bấm, vị trí cuộn giữ nguyên và người đọc rơi vào giữa hoặc cuối bước mới, phải tự kéo ngược lên.
- **Gợi ý sửa**: khi bước đổi do bấm nút (không phải lúc tải trang), gọi `document.querySelector('.stepper').scrollIntoView({block:'start'})`; `section` đã có `scroll-margin-top`, nên thêm `scroll-margin-top:64px` cho `.stepper`. Bỏ qua lần `show(0)` đầu tiên để trang không tự nhảy khi mở.

### K14 — Vùng chạm của số trích dẫn và link "Liên quan" nhỏ hơn 40px
- **Mức độ**: thấp (kế thừa từ template)
- **Vị trí**: dòng 141–144 (`sup.cite a{padding:10px 3px}`), dòng 182 (`.term .rel a{font-size:14px;padding:10px 2px}`).
- **Bằng chứng**: `[1]` ở 11px rộng khoảng 16px + 6px padding = khoảng 22px ngang, cao khoảng 33px. Hai số liền nhau như `[3][2]` (dòng 215) hay `[16][13]` (dòng 520) chỉ cách 2px nên dễ chạm nhầm. Link "Liên quan" cao khoảng 37px và khi xuống dòng thì vùng chạm của hai dòng chồng lên nhau (line-height khoảng 21px).
- **Gợi ý sửa**: `sup.cite a{padding:10px 6px}` và `sup.cite a+a{margin-left:4px}`; với `.rel`, đặt `line-height:2.4` ở ≤600px hoặc đổi link thành `display:inline-block;min-height:40px;line-height:40px`.

### K15 — Nguy cơ chữ SVG tràn hộp ở bản đồ quan hệ
- **Mức độ**: thấp (ước lượng, chưa render)
- **Vị trí**: dòng 446: `tài liệu qua tool tìm kiếm, resource` (36 ký tự, 12px) trong hộp rộng 230.
- **Bằng chứng**: với system-ui 12px, 36 ký tự tiếng Việt ước khoảng 215–225 đơn vị, chỉ còn lề 2–7 đơn vị mỗi bên; trên máy có font hệ thống rộng hơn (Segoe UI, Roboto) chữ có thể chạm viền. Các nhãn khác đều còn lề trên 15 đơn vị. Cỡ chữ nhỏ nhất trong hai SVG là 12 trên viewBox 1000; ở viewport 1081px SVG rộng khoảng 1031px nên chữ render khoảng 12,4px, đạt yêu cầu ≥11px.
- **Gợi ý sửa**: rút thành "tài liệu qua tool tìm kiếm" hoặc tách hai dòng như các hộp bên trái.

### K16 — Tiếng Việt và thuật ngữ
- **Mức độ**: thấp
- **Vị trí và gợi ý**:
  1. Dòng 785 "Chuỗi mờ server gửi kèm…": "chuỗi mờ" không phải cách nói quen. Gợi ý: "Chuỗi do server tạo, client không được đọc hay sửa (opaque)".
  2. Dòng 226, 546, 768 "cưỡng chế chính sách bảo mật": nghe như văn bản pháp lý. Gợi ý: "thực thi chính sách bảo mật" / "MCP không tự bắt buộc được…".
  3. Thuật ngữ dùng mà chưa giải thích ở lần đầu và không có thẻ từ điển: **SSRF** (dòng 492, chỉ xuất hiện một lần), **SSE** (dòng 490, 794), **audience** (dòng 602, 799), **capability** (dùng ở dòng 227, thẻ từ điển ở mục 5), **SEP** (dòng 221). Gợi ý: thêm chú giải trong ngoặc ở lần đầu, ví dụ "SSRF (lừa client gọi vào địa chỉ nội bộ)", "SSE (server đẩy sự kiện qua một kết nối HTTP mở)", "audience (token ghi rõ nó được cấp cho server nào)". Ghi chú research dòng 138 đã có bằng chứng cho SSRF từ [17].
  4. Dòng 711 và 713: `requestState` mẫu `eyJ0aWNrZXQiOiJEUi0xMDQyIn0` giải base64 ra `{"ticket":"DR-1042"}`, trong khi mã đơn của ví dụ là DH-1042. Vô hại nhưng người biết code sẽ thử giải mã; đổi thành `eyJvcmRlciI6IkRILTEwNDIifQ` (`{"order":"DH-1042"}`) cho nhất quán.
  5. Dòng 813 thẻ "Chính sách deprecation": "giữ ít nhất 12 tháng" bỏ sót ngoại lệ 90 ngày ("or at least ninety days under the policy's expedited-removal exception", /versioning). Thêm "(có ngoại lệ gỡ nhanh sau 90 ngày)".
  6. Dòng 536 "thường do proxy sửa request" là suy luận của trang, không có trong [13]. Đổi thành "ví dụ khi proxy sửa header hoặc body" để không đọc như khẳng định của nguồn.

---

## Không phải lỗi (đã kiểm, giữ nguyên)

- Ví dụ 401 ở bước 1 dùng `/.well-known/oauth-protected-resource` ở gốc host: khớp dạng ví dụ của spec ở /basic/authorization.
- `capabilities: {"tools": {"listChanged": true}}` ở bước 2: bản 2026-07-28 vẫn dùng đúng dạng này (/server/tools, mục Capabilities).
- "Tên tool chỉ duy nhất trong một server", "không dựa vào tên serverInfo": khớp /server/tools ("Tool name uniqueness is scoped to a single server").
- Ví dụ tool `add` + `~/.ssh/id_rsa` + tham số `sidenote`, định nghĩa rug pull và shadowing, khuyến nghị ghim phiên bản và hash: khớp [23].
- Contrast chữ: mọi cặp chữ/nền đã đo đều ≥ 4,9:1 ở cả hai giao diện (thấp nhất là `--muted` trên `--bad-soft` = 4,95:1). Chỉ vạch mốc ở K2 là không đạt.
- Sáu link sang trang chị em đều trỏ tới thư mục có thật.

## Câu hỏi còn mở

- [25] có còn câu "Connect to remote MCP servers from the Messages API without a separate MCP client" không: chưa mở lại hôm nay; cần kiểm trước khi làm K6.
- K12, K13, K14, K15 là suy ra từ CSS; nên xác nhận bằng một lần xem thật ở 390px (iOS Safari cho K12).

---

## Kết quả áp dụng (phiên làm trang, 2026-11-17)

Mỗi phát hiện đã được kiểm lại với nguồn hoặc đo trên trình duyệt (Orca, 390px và 1280px, hai giao diện) trước khi sửa.

| # | Quyết định | Ghi chú |
|-|-|-|
| K1 | Sửa | Đúng: [24] gán 150.000 → 2.000 cho code execution. Hàng progressive giờ dùng hình minh họa của [28] ("~150,000 … ~2,000 tokens", đã mở lại); hàng code mode mang số 98,7% của [24]. |
| K2 | Sửa | Vạch mốc đổi sang `var(--text)` có viền `--surface`, `.bar-fill` có `min-width:3px`, thêm dòng chữ "mốc 1% = …, mốc 5% = … token" do JS tính. |
| K3 | Sửa | L6 thành trạng thái "Không chạy (bị từ chối)", độ trễ "—", không vào trung vị. Đo lại trên trang: trung vị 450 ms, lớn nhất 2.300 ms, "11 lượt có chạy". Sửa câu chú thích. |
| K4 | Sửa | Thêm điều kiện chung phiên bản và tính năng ở lead [3][1], thẻ "Lý do 2", bảng mục 7, checklist tuần 1. |
| K5 | Sửa | Thêm callout "Phía server cũng có việc bắt buộc" [6][16][17] ở mục 8; bài tập tuần 2 thêm "ai được thấy tool nào". |
| K6 | Sửa | Đã mở lại [25] (MCP connector, câu trích còn nguyên). Thêm đoạn "không nhất thiết tự viết host" và server dựng sẵn [18][25][20] ở mục 7. |
| K7 | Sửa | Thêm dòng "Tương ứng bước … của flow" cho bước 5–7 của stepper. |
| K8 | Sửa | Ô 5 thành "5. Duyệt" (host: chính sách · người dùng: đồng ý); legend "Host kiểm, người dùng duyệt"; nhãn nhánh MRTR "client hỏi người dùng rồi gửi lại (id mới)" ở cả SVG và vflow. |
| K9 | Sửa một phần | Sửa câu chú thích (tool calling dùng song song, không phải nền của MCP [19]); dòng phụ ô Tool calling và Context engineering; vflow tách "Đo và quan sát" ra hộp "ĐI KÈM: ĐO LƯỜNG" cho khớp SVG. Không thêm nhãn mũi tên vào SVG: tiêu đề cột của SVG đã nói cùng ý với nhãn vflow, thêm chữ làm rối hình ở 1080px. |
| K10 | Sửa | Ô "Lệnh chính" ghi rõ `elicitation/create` đi trong `InputRequiredResult`. |
| K11 | Sửa | "phải kiểm Origin, và khi chạy local thì nên chỉ bind 127.0.0.1" (MUST/SHOULD đúng như [13]). |
| K12 | Sửa | Ở ≤600px: ô tìm kiếm `font-size:16px; min-height:40px`. |
| K13 | Sửa | Bấm bước/Tiếp/Trước khi đầu stepper đã khuất thì cuộn về đầu stepper. Đo: từ giữa bước, sau khi bấm "Tiếp" đầu stepper ở 72px; khi stepper đang thấy thì không nhảy. Lần tải trang không cuộn. |
| K14 | Sửa | `sup.cite a` padding 6px, khoảng cách 4px; `.term .rel` line-height 2,4 ở ≤600px. |
| K15 | Sửa | Rút nhãn thành "tài liệu qua tool tìm kiếm". Kiểm trên trang ở 1280px: không chữ SVG nào cách viền hộp dưới 4 đơn vị. |
| K16 | Sửa | Đổi "chuỗi mờ", "cưỡng chế"; giải nghĩa SSE, SSRF, audience, SEP ở lần đầu; `requestState` mẫu giải ra `{"order":"DH-1042"}`; thêm ngoại lệ 90 ngày [3]; câu -32020 không còn khẳng định "thường do proxy". |

Không bác bỏ phát hiện nào. Riêng K9 chỉ sửa một phần, lý do ghi ở bảng.
