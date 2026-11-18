# Kongming review: langchain/index.html

Ngày: 2026-11-18. Model: Fable 5.2. Chỉ tư vấn, không sửa trang.

**Lưu ý trạng thái file:** trang bị sửa trong lúc review (mtime 17:53:51 → 17:56:43 → 17:57:45 → 17:59:06). Số dòng dưới đây theo bản 17:59:06 (1.072 dòng, 131.153 byte). Ba lỗi tôi thấy ở bản đầu đã được sửa trước khi viết report nên không liệt kê: chữ "+ structured_response" tràn hộp Kết quả, nhãn "không" đè viền hộp, và "Bên ngoài" nằm trong hộp FRAMEWORK ở bản mobile.

## Cách kiểm

- Nguồn: tải bản `.md` thô của 27 trang docs.langchain.com, JSON API của PyPI cho 4 gói, issue #674 qua GitHub API, blog 1.0, bài Anthropic, trang tool use của Claude, trang OpenAI Agents SDK, trang reference `langchain_core`. Ngày archived của `langchain-community` kiểm bằng WebFetch (PyPI chặn curl).
- Mã nguồn thư viện: `libs/langchain_v1/langchain/agents/middleware/model_call_limit.py` và `agents/factory.py` trên nhánh `master`.
- Layout: headless Chrome qua iframe 390px, 768px, 1280px; chụp ảnh hai SVG desktop (sáng, tối), hai vflow mobile và mô phỏng.
- Chưa kiểm: thiết bị thật, Orca, iOS Safari. Ảnh mobile chỉ chụp flow (sáng), hệ sinh thái (tối), mô phỏng (sáng).

## Kết quả khớp nguồn (không cần sửa)

- PyPI: `langchain` 1.5.0 tải lên 2026-11-11, `requires_python` `<4.0.0,>=3.11.0`; `langgraph` 1.2.22 ngày 2026-11-14; `langchain-classic` 1.0.8 ngày 2026-06-10; `langchain-community` "Archived: Jun 24, 2026", bản cuối 0.4.2 ngày 2026-05-22. Repo GitHub của community cũng `archived: true`.
- Thứ tự hook [10]: "before_* First to last / after_* Last to first / wrap_* Nested (first middleware wraps all others)". Trang và mô phỏng đúng cho luồng bình thường.
- 9.999 bước, Agent = Model + Harness, messages append-only [8]; mặc định PII (`apply_to_input` True, `apply_to_output` False, `apply_to_tool_results` False) [11]; summarization không có trigger [11]; HITL bốn quyết định, thứ tự quyết định, cảnh báo `respond` [33]; structured output (most reliable, bọc JSON Schema, từ chối) [12]; LTS và mốc 12/2026 [16]; lịch sử [4]; ba lớp framework/runtime/harness [18]; Agent Server là tên mới [24]; ba trích dẫn Anthropic [34]; tool runner [35].
- 38 nguồn, không nguồn nào thiếu trích dẫn, không `#src-N` nào trỏ sai. 47 khái niệm.
- 390px: `scrollWidth` 375 trong iframe 390 (trừ thanh cuộn), không phần tử tràn, body 15px, chữ nhỏ nhất 11px (số trích dẫn), mọi vùng bấm ≥ 40px kể cả link trong đoạn văn, không lỗi JS. 768px và 1280px không tràn.
- Số liệu tự tính lại: hook 3 middleware, 1 vòng = 3 + 3·3·2 + 3·1 + 3 = 27; 3 vòng = 51; 2 middleware 1 vòng = 18; dừng ở L=2, R=2 = 27; L=1, R=3 = 15. Bảng đánh giá: 27/30 = 90%, 16/18 = 88,9%, 12/18 = 66,7% (−22,2), 11/12 = 91,7% (−8,3), tổng 55/60 → 50/60 (−8,3). Đều khớp trang.

## Phát hiện

### 1. Mô phỏng bỏ `after_agent` khi dừng do giới hạn — cao
- Vị trí: dòng 895 (`simulate`), dòng 455 (công thức "nếu agent đi tới cuối"), dòng 437 (callout).
- Vấn đề: khi chạm giới hạn, mô phỏng kết thúc ngay, không chạy `after_agent`. Thư viện thì nhảy tới `end`, và `end` đi qua `after_agent`.
- Bằng chứng: trang custom middleware [10]: "`'end'`: Jump to the end of the agent execution (or the first `after_agent` hook)". `model_call_limit.py` dòng 208: `return {"jump_to": "end", "messages": [limit_ai_message]}`. `factory.py` dòng 1740–1744 đặt `exit_node` là `after_agent` và truyền `end_destination=exit_node`.
- Sửa: khi `stopped`, vẫn chạy `after_agent` theo thứ tự ngược và cộng n vào số hook. Công thức thành `n + 3·n·m + n·t + n` cho mọi trường hợp. Ví dụ L=2, R=2, n=3 sẽ là 30, không phải 27.

### 2. "Chưa có câu trả lời cuối" sai với hành vi thật — cao
- Vị trí: dòng 895 (dòng thời gian), dòng 457.
- Vấn đề: với `exit_behavior="end"`, middleware tự thêm một AIMessage báo đã vượt giới hạn rồi mới kết thúc. Kết quả có message cuối, nhưng đó không phải câu trả lời của model. Đây là điểm người làm production dễ vấp: code gọi agent thấy một AIMessage bình thường.
- Bằng chứng: `model_call_limit.py` dòng 201–208 (`limit_ai_message = AIMessage(content=limit_message)`).
- Sửa: đổi nhãn thành "Dừng: đã đủ L lần gọi model · middleware thêm một AIMessage báo vượt giới hạn, không phải câu trả lời của model". Thêm một câu ở lỗi "Agent gọi tool liên tục" (mục 8): phải tự phân biệt message này.

### 3. Vị trí kiểm giới hạn: nói rõ thay vì "nằm trong thư viện" — trung bình
- Vị trí: dòng 437.
- Vấn đề: câu "vị trí kiểm thật nằm trong thư viện" né tránh trong khi nguồn trả lời được.
- Bằng chứng: `model_call_limit.py` dòng 166–208: kiểm trong hook `before_model`; dòng 236–250: đếm trong `after_model`.
- Sửa: "Thư viện kiểm trong hook `before_model` của chính middleware này, nên các `before_model` đứng trước nó trong danh sách vẫn chạy ở lượt bị chặn." Mô phỏng có thể giữ đơn giản, miễn callout nói đúng.

### 4. LCEL không được định nghĩa ở đâu — trung bình
- Vị trí: dòng 978 (thẻ "Chain và LCEL"), dòng 704 (câu 8).
- Vấn đề: phạm vi yêu cầu có LCEL, nhưng trang không nói LCEL là gì. Người học gặp `prompt | model | parser` trong bài cũ sẽ không nối được với thẻ này.
- Bằng chứng: chính nguồn [25] vẫn gọi tên: "LangChain Runnable and the LangChain Expression Language (LCEL). The LangChain Expression Language (LCEL) offers a declarative method to build production-grade programs…". Nên câu "không tìm thấy tài liệu nói LCEL bị deprecated" đúng, và còn nói mạnh hơn được.
- Sửa: thêm một câu định nghĩa: LCEL (LangChain Expression Language) là cú pháp ghép các Runnable thành chuỗi, thường viết bằng dấu `|`. Trạng thái: trang reference `langchain_core` ngày 2026-11-18 vẫn mô tả LCEL [25]; tài liệu v1 không còn dạy nó làm cách chính, vì agent là abstraction cấp cao duy nhất [4]. Giữ câu "không tìm thấy thông báo deprecated".

### 5. OpenAI Agents SDK xếp vào "Không framework" — trung bình
- Vị trí: dòng 586 (bảng bốn lựa chọn), câu tự kiểm 7.
- Vấn đề: Agents SDK là một framework agent của hãng, không phải "gọi thẳng API". Gộp chung làm mờ đúng câu hỏi mà mục này muốn trả lời.
- Bằng chứng: [36] tự mô tả có primitive riêng: "Agents… Handoffs… Guardrails". Lời khuyên của [34] là "start by using LLM APIs directly".
- Sửa: tách ý trong ô: (a) API/SDK thô của hãng, có thể kèm tool runner [35]; (b) framework agent của chính hãng như OpenAI Agents SDK [36], ít abstraction nhưng vẫn là framework và gắn với một hãng.

### 6. Mục "khi nào dùng" thiếu ba ý có nguồn — trung bình
- Vị trí: dòng 591–602.
- (a) Bài Anthropic viết 2024-12-19, trước LangChain 1.0 (2025-10). Nên ghi rõ để người đọc tự cân: lời phê bình nhắm vào framework thời đó, nguyên tắc "hiểu code bên dưới" vẫn đúng.
- (b) Dùng `langchain` là đã kéo theo LangGraph: `requires_dist` của `langchain` 1.5.0 trên PyPI có `langgraph<1.3.0,>=1.2.12` và `langchain-core<2.0.0,>=1.8.0` [26]. Đây là chi phí phụ thuộc cụ thể cho hàng "Thay đổi phiên bản".
- (c) Hàng "Tính năng riêng của một hãng": nguồn [2] nói content blocks hỗ trợ dần ("Broader support for content blocks will be rolled out gradually across more providers"). Nên thêm: tính năng mới của hãng có thể tới LangChain chậm hơn SDK gốc.

### 7. "LangGraph không cần LangChain" cần một chữ chính xác hơn — thấp
- Vị trí: dòng 501, thẻ LangGraph, thẻ mục 6.
- Bằng chứng: `requires_dist` của `langgraph` 1.2.22 có `langchain-core<2,>=1.4.7` [28].
- Sửa: "không cần gói `langchain`, nhưng vẫn phụ thuộc `langchain-core`".

### 8. Gợi ý thứ tự "ghi log đặt đầu để thấy dữ liệu thô" dễ dạy sai — trung bình
- Vị trí: dòng 925 (`simNote`), thứ tự mặc định A ghi log → B che dữ liệu.
- Vấn đề: log đứng trước middleware che dữ liệu nghĩa là log ghi PII chưa che. Và log ngoài cùng không thấy prompt thật gửi cho model, trái với lời khuyên ở mục 8. Gợi ý này không có nguồn.
- Sửa: viết thành đánh đổi: "Log đặt trước 'che dữ liệu' sẽ ghi dữ liệu chưa che; đặt sau thì ghi đúng thứ model nhận. Chọn theo mục đích." Giữ ý retry ở trong cùng, vẫn ghi là gợi ý.

### 9. Ví dụ nâng phiên bản không chứng minh được điều nó nói — trung bình
- Vị trí: dòng 1044 (`EV`), `evNote`.
- Vấn đề: tổng giảm 92% → 83% (−8,3 điểm) mà viết "dễ bị bỏ qua". Mức giảm đó ai cũng thấy.
- Sửa: đổi số để tổng gần như đứng yên, ví dụ `[30,27,29]`, `[18,16,12]`, `[12,12,12]`: tổng 55 → 53 (−3,3 điểm), nhóm tạo ticket vẫn −22,2. Khi đó câu "tổng che mất nhóm" mới đúng. Thêm "/60" ở hàng Tổng cho nhất quán.

### 10. Bảng tự chấm: LangGraph bị tính như đối thủ của LangChain — thấp
- Vị trí: dòng 1025–1036.
- Vấn đề: chọn "flow" cùng hai lý do LangChain cho ra "Nghiêng về LangChain", bỏ mất nhu cầu luồng cố định. Hòa ba bên in "Hòa giữa LangChain và SDK trực tiếp và LangGraph. Thử cả hai…" (đã chạy thử).
- Sửa: coi "flow" là ghi chú cộng thêm ("…và cần LangGraph cho phần luồng cố định"), chỉ so LangChain với SDK. Nối danh sách bằng dấu phẩy, bỏ "cả hai" khi có ba.

### 11. Sơ đồ flow: "Structured output" vẽ như một bước sau vòng lặp — thấp
- Vị trí: dòng 312 (vflow), hộp tương ứng trong SVG.
- Bằng chứng: [2] "Structured output is now generated in the main loop instead of requiring an additional LLM call." Bước 7 của stepper nói đúng, sơ đồ thì gợi ý ngược lại.
- Sửa: đổi nhãn phụ thành "sinh ngay trong vòng lặp, không thêm lần gọi model", hoặc gộp vào hộp Kết quả.

### 12. Sơ đồ hệ sinh thái: mũi tên LangSmith chỉ vào riêng Deep Agents — thấp
- Vị trí: dòng 522 (SVG desktop).
- Vấn đề: chữ nói LangSmith phục vụ mọi lớp, mũi tên chỉ chạm hộp Deep Agents.
- Sửa: thêm "cho mọi lớp bên dưới" vào nhãn, hoặc vẽ ngoặc dọc bao ba hộp bên trái.

### 13. Chú thích "Legacy, đã ngừng" quá tay với langchain-classic — thấp
- Vị trí: dòng 477.
- Bằng chứng: `langchain-classic` vẫn phát hành (1.0.8, 2026-06-10) [27]; chỉ `langchain-community` bị archived [29].
- Sửa: "Legacy".

### 14. Vflow mobile: hook wrap mang màu "gọi ra ngoài" — thấp
- Vị trí: dòng 301 và node `wrap_tool_call`.
- Vấn đề: chú thích nói hook màu tím, nhưng hai node wrap viền cam. Bản desktop lồng khung tím đứt quanh hộp cam, rõ hơn.
- Sửa: viền tím đứt cho node, bên trong một dòng nền cam cho "Chat model" / "Tool".

### 15. Nhãn "không" sát viền đứt của khung vòng lặp — thấp
- Vị trí: dòng 382 (x=846, chữ rộng khoảng 38px nên bắt đầu ở x≈827; viền khung ở x=822).
- Bằng chứng: ảnh 1280px, một nét đứt chạm chữ "k".
- Sửa: x=852, hoặc `text-anchor="start"` tại x=832.

### 16. Chữ tiếng Việt trong font monospace ở dòng thời gian — thấp
- Vị trí: dòng 211 (`.tl .hk`).
- Vấn đề: "Gọi model lần 1", "Chạy tool lần", "Dừng: đã đủ", "Kết quả trả về", "vào", "ra" dùng monospace. Chính CSS của trang (dòng 77) ghi dấu tiếng Việt dễ rời trong font này.
- Sửa: monospace chỉ cho tên hook (`.hk.mw`); các lớp `ex`, `ms`, `ok`, `bad` dùng font thân bài.

### 17. Công thức đếm: điều kiện dừng viết lệch — thấp
- Vị trí: dòng 457.
- Vấn đề: "L nhỏ hơn số vòng cần" sai khi L bằng số vòng tool (R=2, L=2 vẫn dừng).
- Sửa: "L nhỏ hơn số lần gọi model cần (số vòng tool + 1)".

### 18. Câu tự kiểm 6 trộn "bước" với "lần gọi model" — thấp
- Vị trí: dòng 702.
- Vấn đề: hỏi số lần gọi model, đáp 9.999 bước. Bước là bước của graph; `factory.py` thêm mỗi hook thành một node riêng, nên số lần gọi model nhỏ hơn 9.999.
- Sửa: "Không có giới hạn riêng cho số lần gọi model; chỉ có giới hạn 9.999 bước của graph, mỗi lần gọi model, chạy tool hay hook đều tính là bước."

### 19. Tiếng Việt và sư phạm — thấp
- Dòng 280, 978: "chuỗi bước tính sẵn" → "chuỗi bước định sẵn".
- Dòng 280: "nhóm phát triển ra LangGraph" đọc vấp → "LangChain phát hành LangGraph".
- "hiện thực interface" và "cài đủ sáu hook" cùng nghĩa implement: chọn một từ ("cài đặt").
- Dòng 658: "so cặp" → "so sánh từng cặp".
- Dòng 689: "Đọc phần chính." dưới thẻ Mở rộng không rõ nghĩa → bỏ hoặc ghi "Đọc hai trang gốc dưới đây."
- Dòng 281: `AgentExecutor` không có trong nguồn nào của trang. Giữ được vì chỉ là ví dụ tên hay gặp, nhưng không nên để người đọc hiểu là nó nằm trong danh sách [3].
- Dòng 825: AIMessage cuối (⑥) dùng cùng màu với HumanMessage (①), khác màu hai AIMessage trước. Đổi sang lớp `e` hoặc một màu "kết quả".
- KPI "Lần chạy hook 27" đứng cạnh dòng thời gian đánh số tới 32. Thêm một dòng: số thứ tự đếm cả lần gọi model, tool và message.

## Khái niệm còn thiếu (ngoài mục 4)

- Prompt template và output parser (`ChatPromptTemplate`, `StrOutputParser`): người học sẽ gặp trong mọi bài LCEL cũ. Một câu trong thẻ LCEL là đủ. Chưa kiểm trạng thái hiện tại của hai lớp này, cần mở nguồn trước khi viết.
- Phần còn lại của phạm vi yêu cầu đã có đủ.

## Câu hỏi còn mở

- Mô phỏng nên giữ giới hạn là một nút riêng hay biến nó thành middleware thứ tư trong danh sách? Cách hai đúng với thư viện hơn nhưng phức tạp hơn; tôi nghiêng về giữ nút riêng và sửa theo mục 1–3.

## Kết quả áp dụng

Người áp dụng tự kiểm lại từng phát hiện bằng nguồn trước khi sửa (2026-11-18). Kiểm thêm: `model_call_limit.py` trên nhánh master (before_model kiểm, after_model đếm, `jump_to: "end"` kèm AIMessage "Model call limits exceeded…"), trang Custom middleware ("'end': Jump to the end of the agent execution (or the first `after_agent` hook)"), PyPI JSON `requires_dist` của langchain 1.5.0 và langgraph 1.2.22, docstring `langchain_core/runnables/__init__.py` và `base.py` (LCEL, toán tử `|`).

1. Sửa. Khi dừng do giới hạn, mô phỏng vẫn chạy after_agent (ngược), công thức thành n + 3nm + nt + n cho mọi trường hợp. Kiểm Orca: R=2, L=2, n=3 → 30; R=3, L=1 → 18.
2. Sửa. Dòng thời gian thêm bước "Chặn lần gọi model thứ L+1 · middleware thêm AIMessage 'Model call limits exceeded: run limit (L/L)'"; kết quả ghi rõ message cuối không phải câu trả lời của model. Thêm câu này vào thẻ lỗi "Agent gọi tool liên tục". Thêm nguồn [40].
3. Sửa. Callout nói rõ kiểm ở before_model, đếm ở after_model, lệnh nhảy đi qua after_agent; mô phỏng coi middleware giới hạn đứng đầu danh sách.
4. Sửa. Định nghĩa LCEL (cú pháp ghép Runnable bằng `|`, tự có sync/async/batch/stream) ở câu tự kiểm 8 và thẻ "Chain và LCEL"; trạng thái: vẫn trong langchain-core, không có thông báo deprecated, không còn là cách chính tài liệu v1 dạy. Nguồn mới [39] (docstring mã nguồn; khi tôi mở trang reference [25] bằng WebFetch hôm nay không thấy chữ LCEL, nên dẫn thẳng mã nguồn). Không thêm prompt template/output parser vì chưa kiểm trạng thái hiện tại; chỉ nêu "prompt | model | parser" như ví dụ ở bài cũ.
5. Sửa. Hàng SDK trong bảng bốn lựa chọn và câu tự kiểm 7 nói OpenAI Agents SDK là framework agent của hãng, nằm giữa hai lựa chọn.
6. Sửa cả ba: (a) ghi bài Anthropic viết 19/12/2024, trước LangChain 1.0; (b) cài langchain kéo theo langgraph và langchain-core [26]; (c) content block chuẩn lúc ra 1.0 chỉ hỗ trợ một số nhà cung cấp [2], tính năng mới có thể tới chậm hơn SDK gốc.
7. Sửa. "không cần gói langchain, nhưng vẫn phụ thuộc langchain-core" ở thẻ LangGraph, vflow và glossary, dẫn [19][28].
8. Sửa. simNote viết thành đánh đổi: log trước "che dữ liệu" ghi dữ liệu chưa che, sau thì ghi đúng thứ model nhận; retry trong cùng vẫn ghi là gợi ý.
9. Sửa. Số minh họa thành [30,27,29], [18,16,12], [12,12,12]: tổng 55/60 → 53/60 (−3,3), tạo ticket −22,2, tra cứu +6,7; thêm "/60" ở hàng tổng; câu chú thích tính theo dữ liệu.
10. Sửa. Bảng tự chấm chỉ so LangChain với SDK; "cần LangGraph" thành ghi chú cộng thêm, không tính điểm, nên không còn hòa ba bên.
11. Sửa. Hộp Structured output: desktop "lấy từ vòng lặp", mobile "được sinh ngay trong vòng lặp chính, không thêm lần gọi model" [2][12].
12. Sửa. Nhãn mũi tên LangSmith: "trace · đánh giá · triển khai cho mọi lớp bên dưới" (desktop và mobile).
13. Sửa. Chú thích thành "Legacy".
14. Sửa. Node wrap_* ở vflow viền tím đứt, chữ "Chat model"/"Tool" màu cam.
15. Sửa. Nhãn "không" text-anchor start tại x=829; getBBox 829–867, nằm giữa viền khung (822) và hộp (868).
16. Sửa. Monospace chỉ cho tên hook; các dòng tiếng Việt dùng font thân bài.
17. Sửa. Điều kiện: "L nhỏ hơn số lần gọi model cần (số vòng tool + 1)".
18. Sửa. Câu 6: không có giới hạn riêng cho lần gọi model, chỉ có 9.999 bước của graph; model, tool, hook đều là bước.
19. Sửa: "định sẵn", "LangChain phát hành LangGraph", "cài đặt interface", "so sánh từng cặp", "Đọc các trang gốc dưới đây."; AIMessage ⑥ đổi sang màu AIMessage; thêm dòng giải thích cách đánh số dòng thời gian. Câu có `AgentExecutor`: giữ trong danh sách tên hay gặp ở bài hướng dẫn, nhưng câu về langchain-classic nay chỉ nêu `LLMChain` (có trong [3]).

Câu hỏi mở: giữ giới hạn là nút riêng (đồng ý với kongming), callout nói rõ giả định vị trí.

Kiểm lại sau khi sửa (Orca, 390 và 1280, sáng và tối): console 0 lỗi; scrollWidth 390 = innerWidth; 40 nguồn, không trích dẫn hỏng, không nguồn thiếu trích dẫn; không chữ < 11px; không vùng bấm < 40px; tương phản chữ màu ≥ 4,5:1 cả hai theme; không chữ SVG tràn hộp hay đè nhau.
