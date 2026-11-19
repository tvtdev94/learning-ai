# Kongming review: long-document-extraction (2026-11-19)

Trang: `long-document-extraction/index.html` (1182 dòng). Số dòng dưới đây theo trạng thái file có mtime 10:56:33 (file đổi một lần lúc đầu phiên review, từ 10:54:43; sau đó đứng yên, mọi dòng trích đã grep lại).

Cách kiểm:
- Tải 32 nguồn bằng `curl` (raw `.md` với Anthropic, LangChain, LangExtract; tag-strip với phần còn lại) rồi grep từng câu trích.
- Chép các hàm mô phỏng và hàm chấm điểm sang Node, chạy lại mọi tổ hợp ngân sách × checkpoint × sự cố.
- Chrome headless: ảnh hai SVG desktop (sáng, tối) và probe 390 / 360 / 768 / 1000 px qua iframe (tràn ngang, chữ < 11px, vùng bấm, lỗi console), kèm ảnh 390px của flow, bản đồ, mô phỏng, máy tính, stepper.
- Chưa kiểm: trình duyệt thật (Orca), iOS Safari, PWA.

## Kết quả tính lại (đều ĐÚNG)

| Mục | Trang ghi | Tôi tính |
|---|---|---|
| Tổng thời gian 12 chunk | 232 giây | 232 |
| 90 giây + checkpoint | 3 lượt, phí 4 giây, 12 lần gọi, ~264K token | 3 lượt (5/12, 9/12, 12/12), phí 2 + 2, 12 lần gọi, 263.800 token |
| 60 / 120 / 300 giây + checkpoint | (mô phỏng) | 5 lượt phí 64 giây / 2 lượt phí 6 giây / 1 lượt phí 0 |
| 90 giây, tắt checkpoint | không bao giờ xong | đúng: mỗi lượt 5 chunk rồi mất, sổ cái 0/12 mãi |
| Gộp | 16 mention → 14 kiểm soát, 3 ngoại lệ, câu trích 15/16 (lệch KS-11) | khớp |
| Nhận bản sửa C09 | 1 lần gọi, 11 từ kho; KS-10 "cần xem lại" | khớp |
| Chấm chính xác | 16 · 8 · 8 → 66,7% | khớp, 1/6 bản ghi đúng hết |
| Chấm nới lỏng | 18 · 6 · 6 → 75,0% | khớp, 3/6 |

Không có lỗi console, không tràn ngang ở 390 và 360, không có chữ nào dưới 11px, 51 thuật ngữ, mọi `#src-N` và mọi link "Liên quan" đều trỏ tới id tồn tại, cả 32 nguồn đều được dùng. 8 trang liên kết đều tồn tại.

## Phát hiện (xếp theo mức nghiêm trọng)

### Cao

1. **Mục 13, máy tính (dòng 1044–1051): Precision, Recall và F1 luôn bằng nhau ở mọi dòng, cả hai chế độ.**
   - Sai gì: PRED và GOLD đều có 6 bản ghi (thiếu 1, thừa 1), nên FP luôn bằng FN. Cả 10 ô đều cho P = R = F1 (83,3 / 50,0 / 66,7 / 66,7 / 66,7 và 83,3 / 83,3 / 66,7 / 66,7 / 75,0).
   - Vì sao quan trọng: người học vừa đọc ba thẻ định nghĩa "precision thấp là bịa, recall thấp là sót" rồi thấy ba cột giống hệt nhau, nên không thấy được khác biệt mà mục này muốn dạy.
   - Sửa: thêm vào GOLD một bản ghi bị sót nữa, `{id:'KS-07',kq:'Không có ngoại lệ',loi:0,trang:67}`, và đổi tiêu đề thành "chấm 7 kiểm soát", câu mô tả thành "bỏ sót KS-03 và KS-07". Tôi đã chạy thử: chính xác 16 · 8 · 12 → P 66,7% / R 57,1% / F1 61,5% (1/7); nới lỏng 18 · 6 · 10 → P 75,0% / R 64,3% / F1 69,2% (3/7); dòng mã kiểm soát 83,3 / 71,4 / 76,9. Thêm một câu: "Recall thấp hơn precision vì pipeline sót nhiều hơn bịa."

2. **Mục 3, stepper trên điện thoại (dòng 973–976, 943–945): bước 2 cao 2.891px, bấm "Tiếp →" xong người đọc bị rơi ra ngoài stepper.**
   - Sai gì: bảng 12 chunk × 4 cột thành 12 thẻ xếp chồng. Chiều cao stepper ở 390px theo từng bước: 726, **2891**, 713, 1222, 1162, 739, 648, 722. Nút "Tiếp" nằm ở đáy; `show()` thay nội dung mà không cuộn lại, nên sau khi bấm ở bước 2, màn hình nằm sâu trong mục 4 hoặc 5.
   - Vì sao quan trọng: người học đọc chủ yếu trên điện thoại; đây là tương tác chính của trang.
   - Sửa: (a) trong hai handler `prevStep` / `nextStep`, sau `show()` gọi `document.querySelector('.stepper').scrollIntoView({block:'start'})` và thêm `scroll-margin-top:64px` cho `.stepper`; không cuộn khi `show(0)` lúc tải trang. (b) Bảng chunk ở bước 2 dùng bảng gọn không xếp chồng như `.evt` (3 cột: Chunk, Trang, Chứa gì; gộp tên mục vào cột cuối), hoặc danh sách một dòng mỗi chunk.

3. **Mục 10, bản đồ quan hệ (dòng 574–575 mobile; 610 và 618 desktop): P/R/F1 được vẽ là đo trên dữ liệu "đã duyệt, đã lưu".**
   - Sai gì: chuỗi mũi tên là Kiểm chứng → Người duyệt → Lưu vào hệ thống → "đem đo" → P/R/F1. Đo như vậy là đo pipeline cộng người sửa, che mất lỗi của pipeline. Mục 13 (dòng 680) lại nói đúng: so **đầu ra của pipeline** với golden set.
   - Vì sao quan trọng: sơ đồ mâu thuẫn với thân bài, và đây là hiểu lầm hay gặp khi làm thật.
   - Sửa: mũi tên "đem đo" đi từ "Bản ghi id ổn định" (đầu ra pipeline, trước người duyệt) tới P/R/F1. Giữ Người duyệt → Lưu vào hệ thống là điểm cuối. Nếu muốn thêm một quan hệ có giá trị: Người duyệt → Golden set, nhãn "bản sửa của người duyệt bổ sung bộ nhãn". Sửa cả bản dọc.

4. **Mục 1, 2, 14 (dòng 253, 279, 739): nói quá về điều sổ cái chứng minh.**
   - Sai gì: "pipeline … tự chứng minh là không bỏ sót" và "Sổ cái chứng minh không chunk nào bị bỏ sót". Sổ cái chỉ chứng minh mọi **chunk** đã được gọi; nó không chứng minh model lấy đủ **bản ghi trong mỗi chunk**. Ví dụ chạy được vì thư ý kiến hư cấu tự nêu "14 kiểm soát và 3 ngoại lệ"; báo cáo thật thường không có con số đó.
   - Vì sao quan trọng: người học sẽ tin "sổ cái 12/12" nghĩa là đủ dữ liệu.
   - Sửa: dòng 253 đổi thành "chứng minh được phần nào đã xử lý, phần nào chưa". Thêm một câu ở mục 8 và trong đáp án câu 5: "Sổ cái bảo đảm độ phủ theo chunk. Sót bản ghi bên trong một chunk thì phải bắt bằng kiểm chéo số đếm, dãy mã liên tục (KS-01…KS-14 không hổng số), nhiều lượt trích, và recall trên golden set." Thêm "dãy mã không hổng" vào lớp kiểm 3, kèm ghi chú "không phải tài liệu nào cũng tự nêu tổng số".

5. **Mục 5 (dòng 445–449): ví dụ JSON đi ngược lời khuyên ngay bên dưới.**
   - Sai gì: callout dòng 449 dặn "đặt `quote` trước các trường diễn giải", nhưng bản ghi mẫu xếp `description` (diễn giải) trước `page`, `quote`.
   - Sửa: đổi thứ tự thành `control_id, seq, page, quote, status, description, chunk_id, prompt_version`. Nói thêm: `chunk_id` và `prompt_version` do code gắn vào, không để model sinh.

### Trung bình

6. **Mục 2, SVG desktop (dòng 371–372): nét đứt xanh cắt ngang nhãn.**
   - Sai gì: nhãn "đối chiếu câu trích và số trang với PDF gốc, không với bản tóm tắt" căn giữa tại x=230, rộng khoảng 410 đơn vị nên bắt đầu ở x≈25; nét dọc của chính đường đó nằm ở x=72 và chạy xuyên qua chữ "đối chiếu" (thấy rõ trên ảnh, cả sáng và tối).
   - Sửa: `x="84" text-anchor="start"` (nhãn nằm bên phải nét dọc, kết thúc quanh x≈495, không chạm gì).

7. **Mục 2, bản dọc mobile (dòng 303–304): hai mũi tên quay lui được vẽ là "↓".**
   - Sai gì: "↓ thiếu hoặc lỗi → quay lại bước 4" và "↓ câu trích, số trang → đối chiếu với PDF gốc" đều chỉ xuống bước 7, trong khi ý nghĩa là quay lên bước 4 và bước 1. Desktop vẽ đúng hướng.
   - Sửa: "↩ thiếu hoặc lỗi: quay lại bước 4 cho đúng chunk đó", "↩ đối chiếu câu trích, số trang với PDF gốc (bước 1), không với bản tóm tắt", rồi một dòng "↓ đạt" trước bước 7. Thứ tự Kho → Sổ cái → Gộp ở bản dọc cũng làm sổ cái trông như đầu vào của bước gộp; desktop cho sổ cái đi vào Kiểm chứng. Đổi nhãn dòng 297 thành "↓ (sổ cái được bước 6 đọc)".

8. **Mục 6, 12, 9 (dòng 477, 672, 1114): nguồn [28] bị dùng quá phạm vi.**
   - Nguồn nói: cập nhật dần cho BooookScore thấp hơn nhưng nhiều chi tiết hơn gộp phân cấp. Cả hai đều là gộp qua văn xuôi; bài báo so hai cách tóm tắt, không đo trích xuất và không kết luận "mỗi tầng mất chi tiết".
   - Sai gì: câu "Mỗi lần gộp qua văn xuôi là một lần mất chi tiết" đứng ngay sau trích dẫn; dòng lỗi "Kết quả lệch dần qua mỗi bước gộp" và thẻ "Summary of summary" gắn thẳng [28].
   - Sửa: tách câu: "…[28] Từ đó trang này rút ra một quy tắc thiết kế (không phải kết luận của bài báo): đừng gộp qua văn xuôi." Ở dòng 672 và 1114 bỏ [28] hoặc viết "gợi ý từ [28]".

9. **Khẳng định về nhà cung cấp cần chỉnh cho khớp nguồn.**
   - Dòng 634 "Tính phí theo trang": không nguồn nào trong [17], [19] nói vậy. Bỏ, hoặc thêm nguồn trang giá.
   - Dòng 648 "Trả phí theo mức xử lý": nguồn chỉ nói có các tier và "Max effort is priced by the processing each document needs". Viết "Có nhiều tier, giá khác nhau theo tier".
   - Dòng 262, 1090, 1094 "các model Claude hiện hành: 1M / 128K": bảng [5] vẫn liệt kê Opus 4.5, Sonnet 4.5, Haiku 4.5 với 200K / 64K. Viết "các model Claude mới nhất (dòng có context 1M)". [5] cũng ghi 128K là trần của Messages API đồng bộ; Batch API cho tới 300K output với beta header trên một số model. Trang đã khuyên dùng Batch ở mục 7, nên thêm nửa câu.
   - Dòng 260 "tối đa 600 trang PDF": thêm "(100 trang với model context 200K)" theo [4], [6].
   - Dòng 471 "thường có độ tin cậy thấp hơn": nguồn [20] viết "potentially lower" và nói về row confidence, còn cell confidence vẫn cao. Đổi thành "có thể thấp hơn".
   - Dòng 256 "phần phản hồi của ban điều hành … nằm gần cuối báo cáo": [32] là câu hỏi đáp về báo cáo của Azure. Viết "ví dụ trong báo cáo của Azure, phần này nằm gần cuối".
   - Dòng 439: OpenAI nói rõ hơn ví dụ moderation: "all fields must be required … emulate an optional parameter by using a union type with null". Nên dẫn câu này. Thêm cảnh báo: với Anthropic, mỗi trường kiểu `["string","null"]` tính vào giới hạn 16 union [10], nên "mọi trường nullable" chạm trần rất nhanh. Đây là lý do thật để schema mỗi lần gọi nhỏ.

10. **Nguồn 5 và 16 (dòng 753, 764): URL đã chuyển hướng.**
    - `…/about-claude/models/overview` trả 307 về `/docs/en/models/overview`.
    - `developers.llamaindex.ai/python/cloud/llamaextract/getting_started/` trả 308 về `/llamaparse/extract/getting_started/`; trang đích giờ có tiêu đề "Overview of Extract" và gọi sản phẩm là "Extract" (chữ "LlamaExtract" chỉ còn một lần). Nguồn ghi "three primary tiers" (Agentic Plus, Agentic, Cost Effective) cộng Turbo.
    - Sửa: cập nhật hai URL, đổi tên nguồn 16 và ô bảng thành "LlamaParse Extract (trước là LlamaExtract)". Ghi chú nguồn thiếu dòng cho câu "không sửa, xóa trường sau khi tạo phiên bản" (câu này ĐÚNG theo [17]: "you can't change or delete fields you have created. You can disable them").

11. **Mục 8 và mô phỏng (dòng 520–521, 910, 989): vân tay nội dung chưa tính tới việc model viết lại.**
    - Sai gì: trang khuyên hash "các trường quan trọng và câu trích". Nếu trường diễn giải (`description`) nằm trong hash thì đổi prompt hoặc đổi model làm lời văn khác đi, và mọi quyết định cũ chuyển "cần xem lại" dù tài liệu không đổi. Trong mô phỏng, `fpOf` chỉ hash câu trích nên bấm "Đổi prompt" vẫn giữ hết quyết định; đó là giả định ngầm mà trang không nói.
    - Sửa: một câu ở dòng 520: "Chỉ hash những thứ bám vào tài liệu: câu trích nguyên văn, giá trị đã chuẩn hóa, enum. Đừng hash câu mô tả do model tự viết." Thêm một dòng vào log khi đổi prompt: "quyết định giữ nguyên vì vân tay tính trên câu trích".

12. **Mục 10 và 2: màu không nhất quán, không có chú thích.**
    - Sổ cái: cam (p4) ở flow desktop, flow mobile và bản đồ desktop; nhưng **tím** ở bản đồ mobile (dòng 565 dùng `.node.db`). Nền sổ cái: trắng ở desktop, cam nhạt ở flow mobile (dòng 296 có `.opt`).
    - Màu tiêu đề làn khác nghĩa với màu viền nút: làn "CHẠY BỀN" xanh lá nhưng chứa nút tím và cam; làn "KIỂM VÀ ĐO" cam nhưng nút Kiểm chứng xanh lá; "Bản ghi id ổn định" xanh lá trong làn xanh dương.
    - Golden set và P/R/F1 viền đỏ (`--bad`, dòng 599–600), trong khi đỏ ở phần còn lại của trang là lỗi hoặc mất công.
    - Sửa: dòng 565 thêm `style="border:2px solid var(--p4)"`; bỏ `.opt` ở dòng 296 hoặc tô nền cam nhạt cho sổ cái ở desktop; tiêu đề làn dùng `--muted`; Golden set và P/R/F1 dùng viền `--p1` hoặc `--border`; thêm một dòng `.legend` dưới mỗi sơ đồ: tím = gọi model và kho, cam = sổ cái và chạy lại, xanh lá = đã kiểm.

13. **Mục 3, stepper: ba chỗ tự mâu thuẫn.**
    - Dòng 945 "Bước 6 sẽ phải nối chúng": bước 6 của stepper là Gộp, nhưng bước 6 của flow mục 2 là Kiểm chứng (dòng 379 cũng gọi "Bước 6" theo flow). Viết "bước Gộp sẽ phải nối chúng".
    - Dòng 946 nói C02, C03 "chỉ hỏi thông tin báo cáo"; dòng 952 lại nói "C02 trả danh sách kiểm soát rỗng với `not_in_chunk`". Chọn một: "C02 trả thông tin báo cáo với `not_in_chunk`; sổ cái ghi 'không có bản ghi'".
    - Dòng 954: khóa chỉ gồm mã chunk + nội dung + prompt, trong khi mục 7 dạy thêm schema và model. Thêm "(rút gọn; thực tế thêm phiên bản schema và model)".

### Thấp

14. **Mục 10, SVG desktop (dòng 611–618).** Nhãn "đủ chunk?" chạm đầu mũi tên chéo (mép phải nhãn ở x=795, đường chéo đi qua x≈794–804 trong khoảng y 251–265): dời sang `x="786"`. Bốn nhãn "so với / đem đo / đã duyệt / trường nghi ngờ" nằm ở y=392, cách mũi tên (y=338) 54 đơn vị và nằm dưới hàng hộp nên khó biết thuộc mũi tên nào: nới khe giữa các hộp hàng 3 để đặt nhãn ngay trên mũi tên, hoặc bỏ nhãn và viết vào dòng phụ của hộp đích. Mũi tên Chunk → Kho checkpoint không có nhãn nên đọc như "chunk được cất vào kho": thêm nhãn "hash làm khóa".

15. **Vùng bấm và chi tiết mobile.**
    - Dòng 105: `label.check` một dòng cao 37px ở 390 → thêm `.check{min-height:40px}` trong khối ≤ 600px.
    - Ở 360px, bảng máy tính cuộn ngang trong khung 15px (296 > 281): đổi nhãn "Mã kiểm soát (bản ghi)" thành "Mã" hoặc giảm padding.
    - Ở 601–1080px (tablet, vẫn chạm tay): chip 33px, `.act` 37px, mục lục 31px vì luật 40px chỉ áp ≤ 600px. Trang mẫu cũng vậy; nếu muốn sửa, nâng breakpoint của riêng luật `min-height` lên 1080px.
    - `.step-nav button` bị disabled trông y như bật (chỉ `.act:disabled` có style): thêm `.step-nav button:disabled{opacity:.5}`.
    - Mũi tên "↓" trong `.vflow .ar` rất nhỏ (13px, màu muted): tăng cỡ ký tự mũi tên lên 16px.
    - Dòng 1002: khi tắt checkpoint giữa chừng (sau một lượt có checkpoint), gợi ý ghi "làm lại từ đầu" nhưng thực tế làm lại từ chunk chưa lưu đầu tiên. Đổi thành "làm lại từ chunk chưa lưu đầu tiên".

16. **Tiếng Việt.**
    - "im lặng" dùng 8 lần làm bản dịch của "silently" (dòng 279, 459, 513, 521, 632, 947, 1123, 1127). "im lặng thiếu", "xóa im lặng" nghe gượng. Gợi ý: "âm thầm", "mà không ai hay"; tiêu đề dòng 513: "Báo rõ 'mới trích được một phần' thay vì âm thầm thiếu".
    - Recall có ba cách gọi: "khả năng nhớ lại" (dòng 260), "độ phủ" (1137), và "Độ phủ sổ cái" (699) lại là coverage. Chọn một: Recall = "độ phủ"; dòng 699 đổi thành "Tỷ lệ chunk đã xử lý"; dòng 260 viết "độ chính xác (accuracy) và recall".
    - "tính lặp an toàn" (dòng 1117–1118): thuật ngữ quen là "lũy đẳng". Viết "lũy đẳng (lặp lại an toàn)".
    - Dòng 256: AICPA là "Viện Kế toán viên Công chứng Hoa Kỳ" (Institute), không phải "Hiệp hội".
    - "kiểm soát" và "ngoại lệ" là từ nghề kiểm toán, người viết code chưa chắc hiểu. Thêm ở dòng 256: "Kiểm soát (control) là một biện pháp nhà cung cấp cam kết thực hiện, ví dụ 'tài khoản quản trị phải dùng xác thực đa yếu tố'. Ngoại lệ (exception) là lần kiểm toán viên thấy biện pháp đó không được làm đúng."
    - Đoạn dài trên điện thoại, nên tách đôi: lead dòng 252; thẻ dòng 439 (ba nguồn, năm câu); thẻ Idempotency dòng 486; đoạn ba nhà cung cấp dòng 526 (đổi thành danh sách ba gạch đầu dòng); callout dòng 477.

## Khái niệm cốt lõi còn thiếu (không trùng các trang đã có)

17. **Giá trị gốc và giá trị chuẩn hóa.** Ngày, tiền tệ, đơn vị ("nghìn đồng", "triệu USD"), phần trăm. Lưu cả chuỗi nguyên văn lẫn giá trị chuẩn hóa; kiểm câu trích trên chuỗi gốc, so khớp và tính toán trên giá trị chuẩn hóa. Trang đã lấy báo cáo tài chính làm ví dụ ở dòng 435 nên thiếu ý này là hổng. Một thẻ ở mục 5, một thuật ngữ.

18. **Ngữ cảnh xuyên chunk.** Trang chỉ nhắc "mất ngữ cảnh xuyên chunk" ở bảng (dòng 631). Thiếu cách xử lý: mỗi chunk mang theo đường dẫn mục (Phần 4 › Truy cập), hàng tiêu đề bảng, và danh sách thuật ngữ được định nghĩa ở đầu tài liệu ("Công ty" là ai, đơn vị tiền). Nói rõ ranh giới với quy tắc nguồn sự thật: phần mang theo chỉ là gợi ý để hiểu, giá trị vẫn phải có câu trích trong chính chunk đó. Chunk overlap sinh bản trùng, tức thêm việc cho bước gộp (cách cắt đã có ở trang parsing, chỉ cần liên kết).

19. **Hai loại cache.** "Cache" ở trang này là cache kết quả phía ứng dụng. Người học sẽ lẫn với prompt caching / context caching của nhà cung cấp (nguồn [8] đã ghi trong ghi chú nhưng trang không dùng). Một câu ở mục 7: "Khác với prompt caching của nhà cung cấp (giảm giá phần đầu vào lặp lại, ví dụ khi hỏi nhiều lượt trên cùng tài liệu); xem `../llm-cost-optimization/`."

20. **Chunk lỗi mãi.** Chunk luôn chạm `max_tokens` hoặc luôn bị từ chối sẽ làm job chạy vô hạn. Cần giới hạn số lần thử, sau đó đánh dấu `failed` trong sổ cái, tách chunk nhỏ hơn hoặc gửi người xử lý, và lần chạy mang trạng thái `partial`. Một dòng trong bảng lỗi.

21. **Ghép bản ghi trước khi chấm.** Máy tính ghép theo mã kiểm soát. Loại bản ghi không có khóa tự nhiên (điều khoản, dòng bảng) phải ghép cặp dự đoán với nhãn trước, và luật ghép ảnh hưởng thẳng tới P/R. Một câu ở mục 13.

## Đã kiểm và thấy đúng (không cần sửa)

- [1], [2] (17 model, 13 tác vụ, "only half"), [3], [29] (540 / 3.229 / 2.788 / 61.643; 81,77% và 83,57%), [30], [31]: khớp abstract.
- [4] context rot, 1M, 128K, 600 trang, lỗi 400; [6] 1.500–3.000 token mỗi trang; [7] và [13] ngưỡng 20K token, trích trước; [10] required trước optional, 24 optional, 16 union, hoa/thường của enum, `minimum` không hỗ trợ, lỗi 400 với citations; [12] mỗi dòng một trường, API không bảo đảm; [27] 50%, 1 giờ, 24 giờ, `custom_id`.
- [9], [11], [14], [15] (kể cả "Examples drive model behavior" và `extraction_passes`), [17], [18] (FP và FN không loại trừ, luật fuzzy, không fuzzy cho số, "All labels" cộng dồn), [19], [20], [21], [22], [23], [24], [25], [26], [32]: khớp.
- Hàm `fz()` làm đúng ba luật của Document AI; cách đếm "sai giá trị = 1 FP + 1 FN" khớp [18].
- Không có regex lookbehind; localStorage đều trong try/catch; checklist dùng prefix `lde-`; theme dùng `rag-theme`.
- Nhãn trong hộp của cả hai SVG vừa hộp, không bị cắt; chế độ tối đọc rõ; nhãn vòng lặp "thiếu hoặc lỗi" không chạm đường cong.

## Câu hỏi mở

1. Mục 13: chấp nhận đổi sang 7 kiểm soát (thêm KS-07 bị sót) để P ≠ R, hay muốn giữ 6 và đổi cách khác (ví dụ bỏ KS-06 khỏi PRED)? Cách sau phải viết lại câu giải thích fuzzy về KS-06.
2. Luật vùng bấm 40px cho tablet (601–1080px): sửa riêng trang này hay để đồng bộ toàn site ở phiên chính?
3. Năm khái niệm thiếu (17–21): trang đã dài 14 mục. Tôi khuyên thêm 17 và 18 thành thẻ, còn 19–21 mỗi cái một câu. Có giới hạn độ dài nào cho trang không?
4. Bảng công cụ có nên giữ cột giá ("tính phí theo trang", "trả phí theo mức") không? Brief cấm nêu giá khi nguồn không nói rõ; tôi khuyên bỏ hẳn.

## Kết quả áp dụng

Mỗi phát hiện được kiểm lại trên code và nguồn trước khi sửa. Kiểm sau khi sửa: `node --check` đạt; Orca 390 và 1280 (`--mobile`), hai giao diện: console 0 lỗi, scrollWidth = innerWidth, 32/32 nguồn có trích dẫn, 0 khái niệm mồ côi (53 thẻ), 0 chữ < 11px, 0 chỗ tương phản < 4,5:1.

1. **Áp dụng.** GOLD thêm KS-07 (trang 67), câu dẫn đổi sang "7 kiểm soát… bỏ sót KS-03 và KS-07" và thêm "Recall thấp hơn precision vì pipeline sót nhiều hơn bịa". Đo lại trong trình duyệt: chính xác 16·8·12 → 66,7 / 57,1 / 61,5 (1/7); nới lỏng 18·6·10 → 75,0 / 64,3 / 69,2 (3/7). Câu giải thích KS-06 vẫn đúng.
2. **Áp dụng.** Bảng chunk ở bước 2 thành bảng gọn 3 cột, không xếp chồng: chiều cao stepper ở 390px giảm từ 2.891 xuống 1.277px. Nút Trước/Tiếp cuộn đầu stepper vào khung khi nó đã trôi khỏi màn hình (đo được: top = 64 sau khi bấm). `scroll-margin-top:64px` và `.step-nav button:disabled{opacity:.5}` đã thêm.
3. **Áp dụng.** SVG: bỏ mũi tên Lưu → P/R/F1, thêm đường xanh từ "Bản ghi id ổn định" tới P/R/F1, nhãn "đầu ra của pipeline (trước khi người duyệt sửa) đem so với golden set". Lưu là điểm cuối. Bản dọc có thêm khối "Đo chất lượng". Không thêm mũi tên Người duyệt → Golden set, vì cần một đường dài nữa.
4. **Áp dụng.** Câu ở mục 1, mục 2, Q5, thẻ thuật ngữ ledger và nút sổ cái trong bản đồ dọc giờ nói: sổ cái chỉ chứng minh độ phủ theo chunk. Lớp kiểm 3 thêm "dãy mã không hổng". Thêm callout ở mục 8, nói rõ không phải tài liệu nào cũng nêu tổng số.
5. **Áp dụng.** Thứ tự mới là control_id, seq, page, quote, status, description, chunk_id, prompt_version, kèm ghi chú rằng code gắn hai trường cuối.
6. **Áp dụng.** Nhãn đặt ở `x="84" text-anchor="start"`; đã xem ảnh chụp, không còn chạm đường.
7. **Áp dụng.** Bản dọc dùng hai mũi tên ↩, thêm "↓ đạt", và mũi tên của sổ cái ghi "(sổ cái được bước 6 đọc)".
8. **Áp dụng.** Callout tách câu: bài báo so hai cách tóm tắt chứ không đo trích xuất, còn "đừng gộp qua văn xuôi" là quy tắc thiết kế riêng của trang. Dòng lỗi bỏ [28]. Thẻ "sos" giữ [28] nhưng chỉ nêu đúng kết quả của bài báo.
9. **Áp dụng, kiểm lại từng nguồn.**
   - Bỏ câu về giá ở ô LlamaExtract; thay bằng tên các tier và câu "Turbo dành cho PDF và ảnh", có trích dẫn.
   - "Mới nhất (dòng context 1M)", 128K khi gọi đồng bộ và Batch tới 300K với beta header ([5]: chú thích "Max output: Synchronous Messages API limit…").
   - Ghi chú 100 trang theo [6]: "600 (100 when the request's context window is under 1M tokens)". Diễn đạt theo cửa sổ của request, không theo "model 200K".
   - [20] đổi thành "có thể có độ tin cậy của hàng thấp hơn" (nguồn: "potentially lower").
   - [32] chỉ còn là ví dụ về báo cáo của Azure.
   - [9] dẫn câu OpenAI "all fields … must be specified as required" và câu về union với null.
   - [10] thêm cảnh báo: `["string","null"]` cũng tính vào giới hạn 16 union (nguồn: "anyOf or type arrays (for example, "type": ["string", "null"])").
   - Đổi "Hiệp hội" thành "Viện" cho AICPA.
10. **Áp dụng.** URL [5] đổi thành `/docs/en/models/overview`. [16] đổi thành `/llamaparse/extract/getting_started/` với tên mới. Ghi chú nguồn có thêm câu [17] "you can't change or delete fields… You can disable them", tôi đã tự kiểm câu này.
11. **Áp dụng.** Mục 8 dặn chỉ hash câu trích, giá trị chuẩn hóa và enum, không hash lời model tự viết. Thẻ "fp" cũng sửa theo. Log khi đổi prompt nói đổi prompt không đẩy quyết định nào sang "cần xem lại", vì vân tay tính trên câu trích (đã kiểm: cả 3 quyết định vẫn "giữ").
12. **Áp dụng phần lớn.**
    - Sổ cái màu cam ở bản đồ dọc; bỏ nền `.opt` của sổ cái ở flow dọc.
    - Tiêu đề làn trong SVG dùng `--muted`.
    - Golden set và P/R/F1 viền `--p1`.
    - Thêm `.legend` dưới cả hai sơ đồ.
    - Không đổi: tiêu đề khối trong bản dọc vẫn theo màu nền của khối, giống trang mẫu `rag/`.
13. **Áp dụng.** Viết "bước Gộp"; C02 trả thông tin báo cáo với `not_in_chunk`; thêm "(rút gọn; thực tế khóa còn có phiên bản schema và model)".
14. **Áp dụng một phần.**
    - Nhãn "đủ chunk?" dời sang x=786.
    - Bốn nhãn hàng 3 bỏ đi, nội dung chuyển vào dòng phụ của hộp đích.
    - **Bác** nhãn "hash làm khóa": khe giữa hai hộp chỉ rộng 40 đơn vị, không đặt nhãn được, và dòng phụ của hộp Kho đã ghi "khóa = hash + phiên bản".
15. **Áp dụng phần lớn.**
    - `.check{min-height:40px}` ở ≤ 600px.
    - Nhãn đổi thành "Mã kiểm soát"; ở 360px bảng đo 296 = 296, không cuộn.
    - Mũi tên của `.vflow .ar` lên 17px bằng `::first-letter`.
    - Gợi ý viết "làm lại từ chunk chưa lưu đầu tiên".
    - **Bác** vùng bấm tablet 601–1080px: trang mẫu `rag/` cũng vậy, nên để phiên chính quyết cho cả site.
16. **Áp dụng.**
    - Bỏ hết 8 chỗ "im lặng", thay bằng "âm thầm" hoặc "mà không ai hay".
    - Đổi tên dòng "Độ phủ sổ cái" thành "Tỷ lệ chunk đã xử lý"; mục 1 viết "độ chính xác (accuracy) và recall".
    - Đổi thành "lũy đẳng (lặp lại an toàn)".
    - Định nghĩa "kiểm soát" và "ngoại lệ" ở mục 1.
    - Tách đoạn: lead; thẻ bắt buộc/tùy chọn; thẻ Idempotency; đoạn ba dịch vụ chuyển thành danh sách; callout nguồn sự thật.
17. **Áp dụng.** Thêm thẻ "Giá trị gốc và chuẩn hóa" ở mục 5, nên tiêu đề "Năm quyết định" giờ đúng 5 thẻ, và thuật ngữ `raw-norm`.
18. **Áp dụng.** Thêm mục con "Ngữ cảnh xuyên chunk" ở mục 6 (giá trị vẫn phải trích từ chính chunk; overlap sinh bản trùng) và thuật ngữ `chunk-ctx`.
19. **Áp dụng.** Thêm một câu ở thẻ cache mục 7, dẫn [5][8] và liên kết `../llm-cost-optimization/` (trang đã xuất bản).
20. **Áp dụng.** Thêm một câu ở thẻ "Lượt có giới hạn thời gian" và một dòng mới trong bảng lỗi.
21. **Áp dụng.** Thêm một câu ở ghi chú dưới máy tính mục 13.

Câu hỏi mở:
1. Chọn 7 kiểm soát.
2. Vùng bấm tablet để phiên chính quyết.
3. Khái niệm 17 và 18 thành thẻ hoặc mục con; 19 đến 21 mỗi cái một câu.
4. Bỏ hẳn cột giá.
