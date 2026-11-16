# Kongming review: context-engineering/index.html (2026-11-16)

Phạm vi: đọc toàn bộ file (876 dòng), ghi chú nguồn, so CSS với `rag/index.html`, mở lại 10/13 nguồn bằng WebFetch ([1] [2] [3] [6] [7] [8] [9] [11] [12] [13]). Chưa mở lại [4] [5] [10]: các ý dùng từ ba nguồn này chỉ đối chiếu với ghi chú nguồn.

Giới hạn: **không render trên trình duyệt**. Mọi nhận xét về tràn, chồng chữ, kích thước là suy từ CSS/SVG, cần xác nhận lại khi test Orca. Số trong mô phỏng được tính lại bằng tay.

Lưu ý: file bị sửa trong lúc review (màu sáng, mốc `.d-only` 1080px, gỡ 5 link tới slug chưa có). Số dòng dưới đây theo trạng thái sau các sửa đó.

## Mức cao

**1. Link tới trang chưa publish → 404** (dòng 227, 577)
- Bằng chứng: `../llm-fundamentals/` và `../llm-evaluation/` có thư mục nhưng nằm trong `exclude` của `_config.yml`. Các link còn lại (`../rag/ ../ai-agent/ ../harness/ ../multi-agent-agentic-rag/ ../`) đều hợp lệ.
- Sửa: đổi thành chữ thường cho tới khi hai trang đó publish, hoặc publish cùng đợt. Nếu chấp nhận 404 tạm như đã làm với `multi-agent-agentic-rag` thì ghi vào PROGRESS.md.

## Mức trung bình

**2. "An toàn và nhẹ nhất" nói quá so với nguồn** (dòng 329, 626, 727)
- Nguồn [1]: "**One of** the safest lightest touch forms of compaction". Trang viết thành tuyệt đối ở cả ba chỗ.
- Sửa: "một trong những dạng compaction nhẹ và an toàn nhất".

**3. Con số 80% bị diễn giải thành quan hệ nhân quả** (dòng 533)
- Nguồn [11]: ba yếu tố giải thích 95% phương sai hiệu năng **trên bộ BrowseComp**, riêng token 80%. Đây là thống kê phương sai trên một bộ đánh giá, không phải "chi thêm token thì tốt hơn".
- Sửa: "Trên bộ đánh giá BrowseComp, riêng lượng token dùng giải thích 80% phương sai hiệu năng", và đổi câu sau thành "gợi ý rằng… có thể đáng tiền", bỏ "Nghĩa là".

**4. Mâu thuẫn chưa giải thích: giữ lỗi hay bỏ phần sai?** (dòng 559 so với 568)
- Bảng triệu chứng khuyên "giữ lại các bước sai" [13]; cây chẩn đoán khuyên "loại bỏ phần sai" khi poisoning. Người mới sẽ thấy hai lời khuyên ngược nhau.
- Sửa: thêm một câu phân biệt: giữ **dấu vết hành động thất bại** (lời gọi tool lỗi, thông báo lỗi) vì đó là bằng chứng; bỏ **thông tin bịa** đang được dùng như sự thật.

**5. Số chiến lược không nhất quán: 4, 5 rồi 7** (dòng 236, 322–329, sơ đồ mục 6)
- Mục 1 hứa "bốn chiến lược ở mục 2"; mục 2 đặt tiêu đề "Năm chiến lược chính" với hai thẻ "Nén" nằm tách nhau (thứ 2 và thứ 5); sơ đồ mục 6 có 7 ô chiến lược.
- Sửa: tiêu đề "Bốn nhóm, năm kỹ thuật"; xếp thẻ theo thứ tự ghi ra → chọn → nén (2 thẻ liền nhau) → cô lập; ở mục 6 ghi rõ hai ô đầu là "thiết kế từ đầu", năm ô sau là kỹ thuật lúc chạy.

**6. Nhật ký mô phỏng sai đơn vị** (dòng 758)
- Chuỗi `'giữ nguyên '+fmt(keep)+' lượt gần nhất'` hiển thị "giữ nguyên 2.000 lượt gần nhất", đọc thành 2.000 lượt.
- Sửa: "giữ nguyên văn các lượt gần nhất ('+fmt(keep)+' token)".

**7. Phát hiện về distractor của Chroma có trong ghi chú nguồn nhưng trang không dùng**
- Đã xác minh [3]: "Even a single distractor reduces performance relative to the baseline". Đây là ý sát nhất với người xây RAG: một đoạn gần đúng nhưng sai cũng làm giảm chất lượng, nên top-k lớn không vô hại.
- Sửa: thêm vào thẻ Confusion (mục 8) hoặc thẻ "Tài liệu truy xuất" (dòng 317), kèm link `../reranking/` (đã publish, hiện chưa được link).

**8. Trang chỉ dựa vào một nhà cung cấp cho mọi chi tiết API**
- Mọi con số vận hành (100.000, giữ 3, 0,1×/1,25×, lỗi 400, `/memories`) là của Claude API. Người học làm cho doanh nghiệp có thể dùng model khác.
- Sửa: một câu ở mục 1 hoặc đầu mục 2: nguyên tắc áp dụng chung; tên tính năng và con số là của Claude, nhà cung cấp khác có cơ chế tương tự với số khác. Kèm ghi chú context editing và compaction **đang ở beta** (xác minh ở [6] [7]) nên giá trị mặc định có thể đổi.

## Mức thấp

**9. Thiếu `</sup>`** (dòng 541): `…[5]</a></p>`. Đếm được 117 `<sup` và 116 `</sup>`. Trình duyệt tự phục hồi nhưng HTML không hợp lệ. Thêm `</sup>` trước `</p>`.

**10. `model_context_window_exceeded` thiếu điều kiện** (dòng 556, thuật ngữ `overflow`): theo [2] chỉ áp dụng cho Claude 4.5 trở lên; model cũ trả validation error. Thêm "(model Claude 4.5 trở lên)". Nguyên nhân phổ biến hơn của câu trả lời bị cắt là chạm `max_tokens`; chưa có nguồn trong ghi chú, chỉ thêm nếu trích được.

**11. "5 MCP server"** (dòng 315, 722, thuật ngữ `tool-def`): [9] viết "A typical multiserver setup (GitHub, Slack, Sentry, Grafana, and Splunk)", không có chữ MCP trong câu đó. Sửa thành "5 server (GitHub, Slack, Sentry, Grafana, Splunk)" hoặc giữ "MCP" như suy diễn có ghi rõ.

**12. Lost in the middle trình bày như sự thật hiện tại** (dòng 228, 624, thuật ngữ `lost-middle`): [4] là nghiên cứu 2023 trên model thời đó. Thêm "theo một nghiên cứu năm 2023".

**13. Hai ý thiếu nguồn ở bảng mục 7**
- Dòng 523 "Thông tin có thể bị méo khi chuyển qua nhiều tầng": thêm [11] (đã xác minh có cụm "game of telephone").
- Dòng 521 "Lần tóm tắt cũng tốn một lần gọi model": trang tổng quan [6] không nói về cách tính phí; chưa xác minh. Đổi thành "viết bản tóm tắt cũng tốn token", hoặc trích trang "Compaction on demand → Understanding usage".

**14. Số minh họa đứng cạnh trích dẫn** (dòng 728): "tăng thêm khoảng 70.000 [11]" dễ bị đọc là số có nguồn. Chuyển [11] sang câu chung "tổng token tăng", để 70.000 không kèm trích dẫn.

**15. Số minh họa lệch giữa ví dụ và mô phỏng**
- Sub-agent: 70.000 (dòng 728) so với `subWork:60000` (dòng 746).
- Just-in-time: nhãn "20.000 → 3.400" (dòng 376) nhưng code cộng 400 + 3.000 + 200 lịch sử = 3.600.
- NOTES.md: 800 (bước 8, 9) so với `notes:1000`.
- Sửa: dùng chung một bộ số.

**16. Mô phỏng cộng dư một chút** (dòng 754–755, 760): `hist` được cộng **trước** `call()`, nên phần model viết ra ở lần gọi đó bị tính vào input của chính nó (dư 800 hoặc 300 token mỗi lần). Trang nói "Phép cộng là thật". Sửa: gọi `call(s)` trước khi cộng phần output, hoặc tách `turn` thành câu hỏi (trước) và câu trả lời (sau).

**17. Thanh ngân sách gần như trống ở bước 1–4 và 9**: trên màn 390px thanh rộng khoảng 328px, nên 300 token ≈ 0,5px, 400 ≈ 0,7px, 3.000 ≈ 5px. Người học không thấy thay đổi giữa bước 2, 3, 4. Sửa: thêm dòng "thanh chỉ đầy khoảng X%" ở các bước này, hoặc thêm thanh phóng to phần đang dùng.

**18. Bài tập w2a quá dễ** (dòng 611): riêng Compaction đã đưa về 2.500 + 18.000 + 2.000 + 3.000 = 25.500 < 30.000, không cần "tổ hợp". Sửa: "không dùng Compaction, đưa về dưới 60.000" (xóa kết quả tool sau 7 lượt gọi: 106.900 → 59.100) hoặc hạ mốc xuống 15.000 (buộc bật tool search).

**19. Nhãn SVG desktop có nguy cơ chạm viền** (ước lượng theo số ký tự, cần xem ở ≥ 1081px)
- Dòng 285: 42 ký tự cỡ 12 trong ô rộng 250.
- Dòng 434: "Bộ tool tối thiểu · tool search", 31 ký tự đậm cỡ 13 trong ô rộng 230.
- Dòng 449: "phần đầu ổn định: tools → system", cỡ 11 trong ô rộng 190.
- Dòng 306: nhãn "nén, dọn lại" (x 316–386, y 118) sát đường cong kết thúc tại x = 380.
- Sửa: nới ô 20–30 đơn vị hoặc rút chữ.

**20. Đầu mũi tên xám trên đường màu** (dòng 269, 297–300): marker `#arr` tô `var(--muted)` nhưng đường dùng `--p6`/`--p4`. Dùng `fill="context-stroke"` hoặc thêm marker theo màu.

**21. Vùng bấm trích dẫn `[N]`** (dòng 110–111): cao khoảng 34px, rộng khoảng 20px, dưới chuẩn 40px. CSS giống hệt `rag/index.html:125` nên là vấn đề chung cả site, không riêng trang này.

**22. Câu chữ tiếng Việt**
- Dòng 723: tiêu đề bước "Chỉ nạp tool cần" → "Chỉ nạp tool cần dùng".
- Dòng 820: "Nếu người không chọn được tool nào đúng…" → "Nếu kỹ sư còn không chắc nên dùng tool nào thì agent cũng khó chọn đúng".
- Dòng 314: "đúng độ cao" nên kèm "(right altitude)" ở lần đầu.
- Không thấy lỗi thiếu dấu hay lỗi chính tả.

**23. Khái niệm nên cân nhắc thêm (không bắt buộc)**
- Kết quả tool và tài liệu truy xuất là nội dung không tin cậy (prompt injection là một đường dẫn tới poisoning), link `../governance/`. Cần tìm nguồn trước khi viết.
- Thời hạn cache 5 phút: đã có trong ghi chú [12] nhưng trang chỉ nhắc trong giá ghi cache.
- Thinking token cũng tính vào cửa sổ [2].
- Từ điển thiếu `harness`, `distractor`, `context editing`.
- Các khái niệm trong danh sách yêu cầu (context window, token budget, context rot, lost-in-the-middle, compaction, just-in-time, tool result clearing, memory/notes, sub-agent, prompt caching) **đều đã có**.

## Đã kiểm, không có vấn đề

- Anchor: 13 `id="src-N"`, cả 13 đều được trích (ít nhất 4 lần mỗi nguồn); không có `#src-14`. Từ điển 39 thuật ngữ, không có liên kết "Liên quan" hỏng; 2 thuật ngữ không nguồn (`token`, `retrieved`) là định nghĩa chung.
- `localStorage` bọc try/catch ở dòng 7 và 667–668.
- Token màu sáng và tối trùng `rag/index.html` (diff chỉ khác phần thêm `--p5`, `--p6`). Tính tay: `--p5` #0a7480 đạt 5,5:1 trên trắng và 4,8:1 trên `--surface-2`; `--p6` #a8306a đạt 6,4:1 và 5,5:1.
- Cỡ chữ mobile theo CSS: thân 15px, nhỏ nhất 12px (`.tag`, nhãn bảng), trích dẫn `max(11px,.72em)`. Nút và nhãn tick có `min-height:40px`.
- Số trong ví dụ từng bước cộng đúng: 20.800; 2.200 = 400 + 1.800; 114.500 > 100.000; 7.500 = 6.600 + 900; 145.500 → 13.300; 12 − 4 = 8 máy; 145.500/200.000 ≈ 3/4.
- Logic mô phỏng: compaction không bao giờ làm tăng input (sau nén ≤ 5.000 phần động); xóa kết quả tool giữ đúng 3 mục cuối; chặn vượt 200.000 ở lượt gọi tool thứ 15 (205.300); cảnh báo đỏ khi phần dành cho trả lời < 16.000 (sau lượt 14: còn 7.000).
- Số có nguồn đã xác minh lại: 18 LLM, ~300 so với ~113k token "across all models" [3]; 55k, 85%, 3–5 tool, 30–50 tool [9]; 0,1× (ngoại lệ rẻ hơn: 0,05× và 0,025×), 1,25×, thứ tự tools → system → messages [12]; 100.000 và giữ 3 [7]; `/memories`, path traversal, giới hạn dung lượng file [8]; 90,2%, 4×, 15× [11]; 100:1, KV-cache, timestamp, append-only, restorable, todo.md [13]; lỗi 400, `usage` tách đọc/ghi cache, cache vẫn chiếm chỗ, 200k/1M [2]; NOTES.md, 1.000–2.000 token, "foreseeable future" [1].

Status: DONE_WITH_CONCERNS
Summary: Nội dung bám nguồn tốt và mô phỏng tính đúng; cần sửa 2 link 404, vài chỗ nói quá nguồn (mục 2, 3), một mâu thuẫn sư phạm (mục 4) và chuỗi sai đơn vị trong mô phỏng (mục 6). Chưa render trên trình duyệt nên các nhận xét về bố cục SVG và 390px cần xác nhận khi test Orca.

## Kết quả áp dụng (2026-11-16)

Mỗi phát hiện đều được kiểm lại bằng file nguồn, WebFetch hoặc test Orca (390px và 1280px, sáng và tối).

1. Link tới `../llm-fundamentals/` và `../llm-evaluation/` → **bác bỏ**: phiên chính cho phép link tới hai bản nháp này nếu thật sự có ích (giải thích token; đo lường). Hai link sẽ 404 cho tới khi các trang đó publish, nên đã ghi vào báo cáo cho phiên chính.
2. "An toàn và nhẹ nhất" → **đã sửa** cả 3 chỗ thành "một trong những… nhẹ và an toàn nhất" (khớp với "One of the safest" trong [1]).
3. Con số 80% → **đã sửa**: ghi rõ là trên BrowseComp, ba yếu tố giải thích 95%, riêng token 80%; câu sau đổi thành "gợi ý rằng". Đã kiểm lại [11] bằng WebFetch.
4. Giữ lỗi hay bỏ phần sai → **đã sửa**: bảng triệu chứng nói giữ "dấu vết hành động thất bại"; cây chẩn đoán thêm câu phân biệt (thông báo lỗi là bằng chứng nên giữ, thông tin bịa thì bỏ).
5. Số chiến lược 4/5/7 → **đã sửa**: mục 1 nói "bốn nhóm chiến lược"; mục 2 có tiêu đề "Bốn nhóm, năm kỹ thuật chính" và xếp thẻ theo ghi ra → chọn → nén, nén → cô lập; phần mở đầu mục 6 nói rõ hai ô đầu là thiết kế từ đầu, năm ô sau là kỹ thuật lúc chạy.
6. Nhật ký sai đơn vị → **đã sửa**: "giữ nguyên văn các lượt gần nhất N token".
7. Distractor của Chroma → **đã sửa**: thêm vào thẻ "Tài liệu truy xuất" kèm link `../reranking/`, và thêm thuật ngữ `Distractor` vào từ điển. Đã kiểm lại [3].
8. Chỉ dựa vào một nhà cung cấp → **đã sửa**: thêm callout ở mục 2 nói nguyên tắc dùng chung, còn con số là của Claude, và compaction/context editing đang ở beta. Đã kiểm lại [6] và [7] bằng WebFetch.
9. Thiếu `</sup>` → **đã sửa**. Đã kiểm lại: 121 `<sup` và 121 `</sup>`.
10. `model_context_window_exceeded` → **đã sửa**: thêm "với model Claude 4.5 trở lên" theo [2]. Không thêm ý về `max_tokens` vì chưa trích nguồn.
11. "5 MCP server" → **đã sửa** ở thẻ, bước 1 và từ điển thành cấu hình nhiều server (GitHub, Slack, Sentry, Grafana, Splunk) theo [9].
12. Lost in the middle → **đã sửa**: thêm "một nghiên cứu năm 2023" ở mục 1 và trong từ điển.
13. Hai ý thiếu nguồn ở bảng mục 7 → **đã sửa**: "méo qua nhiều tầng" trích [11] (đã kiểm cụm "game of telephone"); câu về chi phí tóm tắt đổi thành "là một request được tính phí như mọi request khác" và thêm nguồn mới [14] Compaction on demand ("The summarization call is billed and rate-limited like any other request").
14. Số minh họa đứng cạnh trích dẫn → **đã sửa**: bước 7 ghi "60.000 (minh họa)", còn [11] gắn với câu chung "hệ đa agent tốn nhiều token hơn hẳn".
15. Số lệch giữa ví dụ và mô phỏng → **đã sửa**: dùng chung sub-agent 60.000 và NOTES.md 800; nhãn just-in-time ghi 3.600 = 400 + 3.000 + 200 và "tốn thêm 2 lần gọi", khớp với code.
16. Mô phỏng cộng dư → **đã sửa**: phần model viết ra (câu trả lời, lời gọi tool, lời giao việc, ghi chú) được cộng **sau** lần gọi sinh ra nó. Lượt hỏi đáp tách thành câu hỏi 200 (trước) và câu trả lời 600 (sau). Just-in-time là 3 lần gọi. Đã tính tay và đối chiếu trên Orca: 3 lượt gọi tool → cộng dồn 235.500; 7 lượt → 893.900, input 106.900; xóa kết quả tool cũ → 59.100; JIT → input 24.400, cộng dồn 66.500; compaction → 33.100 → 24.100.
17. Thanh gần trống ở các bước đầu → **bác bỏ**: bảng chú giải ngay dưới thanh ghi số và % cho từng phần. Thanh gần trống ở đầu phiên cũng chính là điều người học cần thấy, rồi thanh đầy lên ở bước 5.
18. Bài tập w2a quá dễ → **đã sửa**: "vượt 100.000 rồi đưa về dưới 60.000 mà không dùng Compaction". Đã kiểm trên Orca: 7 lượt gọi tool → 106.900, xóa kết quả tool cũ → 59.100.
19. Nhãn SVG chạm viền → **bác bỏ**: xem ảnh chụp ở 1280px (cả sáng và tối) thì không có nhãn nào bị cắt hay chạm. Ở 1081px, chữ nhỏ nhất là 11,3px.
20. Đầu mũi tên xám trên đường màu → **đã sửa**: thêm marker `arrP6` và `arrP4` theo màu đường. Đã kiểm bằng ảnh chụp.
21. Vùng bấm trích dẫn → **đã sửa phần chiều cao**: padding dọc 14px, đo trên Orca thì mọi `sup.cite a` cao từ 40px trở lên. Chiều ngang giữ như `rag`, vì thêm padding ngang sẽ làm vỡ dòng chữ.
22. Câu chữ → **đã sửa** cả ba: "Chỉ nạp tool cần dùng", câu về kỹ sư không chắc nên dùng tool nào, thêm "(right altitude)" ở thẻ và từ điển.
23. Khái niệm nên cân nhắc thêm → **sửa một phần**:
    - Đã thêm: thời hạn cache 5 phút và cơ chế làm mới [12]; thinking tính vào cửa sổ [2]; thuật ngữ `Context editing` [7] và `Distractor` [3].
    - Bác bỏ prompt injection: cần nguồn riêng, và nội dung này thuộc trang governance.
    - Bác bỏ thuật ngữ `harness`: đã có link sang trang `../harness/` ở mục 2 và mục 6.

Thêm ngoài review:
- Sơ đồ quan hệ bản mobile: ô chiến lược có nền cam như bản desktop, để không lẫn với ô thành phần.
- Thêm link `../hybrid-search/` và `../reranking/` ở thẻ "Liên hệ với các chủ đề khác".
