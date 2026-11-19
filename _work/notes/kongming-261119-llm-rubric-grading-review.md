# Kongming review: llm-rubric-grading/index.html

Ngày: 2026-11-19 · Người review: kongming (chỉ tư vấn, không sửa file trang).

File trang đã đổi trong lúc review (mtime 10:03:35 → 10:04:53, 126.827 → 126.862 byte; dòng 485 "Dễ dãi" đã được viết lại). Mọi số dòng dưới đây lấy từ trạng thái 10:04:53, 1.049 dòng.

## Kết luận nhanh

Trang đủ tốt để xuất bản sau khi sửa nhóm cao và trung bình. Số liệu JS, số học bước 3, liên kết, trích dẫn và bố cục 390px đều đúng. Vấn đề nằm ở nội dung: một mâu thuẫn nội bộ ngay trong ví dụ JSON cốt lõi, hai chỗ bằng chứng hỗn hợp chưa gắn nhãn, vài khẳng định đọc quá nguồn, và một kịch bản bước 3 tự mâu thuẫn với bước 2.

## Đã kiểm và đúng (không cần sửa)

**Phòng hiệu chỉnh.** Tôi tính lại bằng Python từ `HUMAN` và `RUNS` (dòng 905–906), độc lập với hàm `metrics`:

| Rubric · lần | Đồng ý | Lệch ≤ 1 | p_e | κ | QWK | LLM cao/thấp hơn |
|---|---|---|---|---|---|---|
| Mơ hồ · 1 | 4/10 | 10/10 | 0,28 | 0,167 | 0,725 | 6 / 0 |
| Mơ hồ · 2 | 4/10 | 9/10 | 0,29 | 0,155 | 0,579 | 6 / 0 |
| Mơ hồ · 3 | 5/10 | 8/10 | 0,29 | 0,296 | 0,486 | 5 / 0 |
| Có mốc · 1 | 9/10 | 10/10 | 0,27 | 0,863 | 0,958 | 1 / 0 |
| Có mốc · 2 | 9/10 | 10/10 | 0,25 | 0,867 | 0,959 | 0 / 1 |
| Có mốc · 3 | 9/10 | 10/10 | 0,27 | 0,863 | 0,958 | 1 / 0 |

Ổn định 3 lần: mơ hồ 4/10, có mốc 8/10. Công thức QWK trong JS (dòng 916–917) đúng với định nghĩa ở nguồn [26]. Dòng "tính tay" dùng số đã làm tròn 2 chữ số nhưng ở cả 6 trạng thái vẫn ra đúng 3 chữ số như κ thật (0,167; 0,155; 0,296; 0,863; 0,867; 0,863). Hai ví dụ trong từ điển ("4/10 hồ sơ", "30 trang được 2 thay vì 1") khớp dữ liệu.

**Số học bước 3 (dòng 877).** Cách 1: 4 × 400 + 350 = 1.950; thêm D2 tr.2 thành 2.150, đúng. Cách 2: vòng 1 = 950, vòng 2 = 1.900, đoạn D1 tiếp theo thành 2.300, đúng.

**Cấu trúc và liên kết.** 31 nguồn, `#src-1` … `#src-31` đều tồn tại và đều được dẫn ít nhất một lần. 46 khái niệm, không có liên kết "Liên quan" nào gãy. Không có id trùng. Mọi liên kết `../<slug>/` trỏ tới thư mục có thật; `../llm-evaluation/#judge` tồn tại và đúng là mục 7. Checklist dùng prefix `lrg-` qua `safeGet`/`safeSet` có try/catch. Hai đoạn JSON đều 4 dòng.

**Mobile.** Đo bằng headless Chrome qua iframe 390px và 768px: không tràn ngang ở cả 8 bước stepper, 6 trạng thái phòng hiệu chỉnh và khi mở hết `details`. Chữ nhỏ nhất 11px (số trích dẫn), 12px (tag). Vùng bấm ở 390px đạt, trừ liên kết trong câu và checkbox 13px (nằm trong `label`, bấm cả dòng được). Đã xem ảnh chụp 390px của vflow mục 2, vflow mục 10, bước 3 và phòng hiệu chỉnh (chế độ sáng): không cắt, không đè.

**SVG desktop.** Đã xem ảnh 1132px ở cả sáng và tối: không có nhãn đè hay tràn hộp, mọi mũi tên đúng hướng, hộp rủi ro đỏ nét đứt khớp câu mô tả.

**Nguồn đã mở lại và khớp:** [3] (abstract), [5] (bản HTML: r = 0,979 và 0,315, "Predict only one attribute per generation", non-CoT ở temperature 0 một lần chạy), [8] (DOI `2025.findings-emnlp.1361`, đúng là Findings), [9] (abstract có câu về nhóm giới tính), [10] (nộp 21/12/2025, ghi 2025 là đúng), [11] ("Accepted to EMNLP 2026 Main Conference"), [12] (verbosity, pairwise/pass-fail), [13] (ba cách chấm, dòng 3228–3244 của bản `.md`), [15] (dòng 2867 và 2885), [16] (dòng 339, 369, 409–413), [21] (dòng 1513), [22] (dòng 18, 40, 241), [26] (Landis–Koch, QWK).

**Chưa kiểm:** các nguồn [1], [2], [4], [6], [7], [14], [17]–[20], [23]–[25], [27]–[31] chỉ được so với file ghi chú, không mở lại URL. Chưa chụp ảnh mobile ở chế độ tối, chưa đo tương phản.

## Phát hiện

### Mức cao

**1. Verdict JSON đặt `score` trước `rationale` và `quotes`, trái với luật "suy luận trước, điểm sau".**
Vị trí: dòng 418–421 (mục 5) và dòng 878 (bước 4), so với thẻ ở dòng 407.
Vấn đề: model viết JSON theo thứ tự trường. Với thứ tự hiện tại, model chốt điểm rồi mới viết lý do và câu trích, tức là hợp lý hóa sau khi chấm. Đây là ví dụ cốt lõi mà người học sẽ chép.
Sửa: đổi thứ tự thành `criterion → quotes → rationale → gaps → status → score → recommendations` ở cả hai chỗ. Thêm một câu sau JSON: "Thứ tự trường trong schema là thứ tự model viết ra, nên câu trích và lý do đứng trước điểm." Có thể thêm: nếu bật thinking như [13] khuyên thì suy luận đã diễn ra trước, thứ tự trường bớt quan trọng nhưng vẫn nên giữ.

### Mức trung bình

**2. "Suy luận trước, điểm sau" được trình bày như đồng thuận, trong khi [5] cho kết quả ngược.**
Vị trí: dòng 407; dòng 500 có nhắc nhưng ở thẻ khác.
Vấn đề: [5] ghi "Remove CoT and set temperature to 0" và cấu hình cuối của họ là non-CoT, một lần chạy. Ràng buộc của trang là bằng chứng hỗn hợp phải gắn nhãn.
Sửa: thêm vào cuối thẻ dòng 407: "Bằng chứng hỗn hợp: trên bài tóm tắt, Stureborg và cộng sự lại thấy bỏ chain-of-thought cho kết quả tốt hơn [5]. Lý do giữ bước này trong sản phẩm là để có câu trích và lý do kiểm được, còn độ chính xác thì phải tự đo."

**3. Kịch bản bước 3 mâu thuẫn với bước 2.**
Vị trí: dòng 877 ("điểm tìm kiếm thấp hơn vì dùng từ khác") so với dòng 876 (hybrid search "bắt được … 72 giờ").
Vấn đề: đoạn D2 tr.5 chứa gần như nguyên văn yêu cầu ("khách hàng", "thông báo", "72 giờ", "sự cố") mà lại xếp thứ 8/9, sau bốn đoạn của một chính sách chung. Người học vừa đọc ở bước 2 rằng tìm từ khóa bắt được "72 giờ". Ngoài ra Cách 1 "bỏ đoạn vượt rồi đi tiếp", Cách 2 lại "dừng" khi vượt; hai quy tắc khác nhau mà không nói.
Sửa (đã tính lại): để đoạn dùng từ khác thật sự là D2 tr.2 (phân vai: "Đội ứng phó gồm…", không có chữ "phân vai"). Thứ tự điểm: D2 tr.5, D1, D1, D1, D1, D3, D2 tr.2, D1, D3. Ngân sách 1.900.
- Cách 1: 200 + 4 × 400 = 1.800; D3 thành 2.150, bỏ; D2 tr.2 thành 2.000, bỏ. Kết quả 1.800 token, thiếu đoạn phân vai, giám khảo sẽ chấm thấp oan.
- Cách 2 (file xếp D2, D1, D3): vòng 1 = 950, vòng 2 = D2 tr.2 + D1 + D3 = 1.900, vòng 3 thành 2.300, dừng. Kết quả 1.900 token, đủ cả hai đoạn D2.
Nhớ đổi "2.000" ở tiêu đề bước 3 và ví dụ của khái niệm `budget` (dòng 972). Ghi một quy tắc chung cho cả hai cách: "đoạn nào làm vượt thì bỏ qua, xét đoạn kế".
Nếu muốn giữ số cũ, tối thiểu phải đổi lý do thành "D1 dài, lặp lại cụm từ của yêu cầu ở nhiều mục" và thống nhất quy tắc bỏ/dừng; cách này vẫn kém thuyết phục.

**4. Chia vòng theo file làm cache theo bằng chứng dễ trượt khi nộp thêm file.**
Vị trí: dòng 520 ("thêm một file không liên quan thì tiêu chí khác vẫn trúng cache"), dòng 543, bước 8 dòng 882.
Vấn đề: với chia vòng theo file, mỗi file mới được một suất ở vòng 1. Nếu D4 có bất kỳ đoạn ứng viên nào cho R2, tập bằng chứng đổi, khóa cache đổi, R2 bị chấm lại và có thể đổi điểm dù D2 không đổi. Hai gợi ý thiết kế của trang va nhau mà trang không nói.
Sửa: thêm điều kiện ở dòng 520 và bước 8: "với điều kiện retrieval có ngưỡng điểm liên quan tối thiểu, để file mới không lọt vào bằng chứng của tiêu chí khác". Thêm một ý vào mục khiếu nại: chỉ chấm lại tiêu chí bị khiếu nại hoặc tiêu chí có bằng chứng mới vượt ngưỡng; nếu điểm của tiêu chí khác đổi thì chuyển người duyệt.

**5. QWK 0,72 ở rubric mơ hồ lần 1 không được giải thích, trong khi trang giới thiệu QWK là chỉ số "hợp".**
Vị trí: ghi chú dòng 939, callout dòng 472.
Vấn đề: người học thấy κ = 0,17 nhưng QWK = 0,72 và sẽ kết luận giám khảo ổn. Đây chính là ca QWK che lỗi dễ dãi có hệ thống (mọi sai lệch chỉ một mức). Lần 3 còn ngược: đồng ý tăng lên 5/10 nhưng QWK giảm còn 0,49.
Sửa: thêm vào ghi chú rubric mơ hồ: "QWK vẫn ra '+f2(m.qwk)+' vì mọi sai lệch chỉ một mức; QWK cao không loại trừ dễ dãi có hệ thống, nên luôn xem thêm tỷ lệ cho qua sai." Thêm một câu tương tự vào callout dòng 472. Cụm "trông ổn" nên chỉ hiện khi `m.w1 === m.n`; ở lần 3 (80%, hai hồ sơ lệch 2 mức) câu này sai giọng.

**6. Gán sai nguồn: holistic "dễ bị anchoring hơn" [5].**
Vị trí: dòng 374, từ điển dòng 964.
Vấn đề: [5] đo anchoring khi chấm nhiều thuộc tính trong một lần sinh, tức là điều xảy ra với analytic gộp một lần gọi. [5] không so holistic với analytic.
Sửa: bỏ [5] và viết "Khó giải thích, khó khiếu nại: mọi khía cạnh trộn vào một con số nên không biết thiếu chỗ nào." Ở từ điển bỏ "dễ neo điểm" và bỏ `[5]`, bỏ `anchoring` khỏi danh sách liên quan.

**7. Đọc quá nguồn Prometheus.**
Vị trí: dòng 369 ("chấm khớp người tốt hơn hẳn khi được đưa kèm rubric chi tiết và đáp án tham chiếu").
Vấn đề: abstract chỉ nói Prometheus "on par with GPT-4's evaluation capabilities when the appropriate reference materials … are accompanied". Không có phép so có/không rubric trong phần đã trích.
Sửa: "Prometheus, một giám khảo mã nguồn mở, chấm ngang GPT-4 khi được đưa kèm rubric và đáp án tham chiếu (Pearson 0,897 so với 0,882 trên 45 rubric tùy biến)."

**8. Tiêu đề "Criteria drift và nhóm con" không khớp nội dung.**
Vị trí: dòng 768.
Vấn đề: thân callout chỉ nói về nhóm giới tính. "Criteria drift" là khái niệm khác, đã được trang LLM Evaluation định nghĩa theo Shankar và cộng sự. File ghi chú nguồn cũng chưa có dòng về giới tính (tôi đã kiểm abstract [9]: "systematic subgroup differences in alignment across gender groups").
Sửa: đổi tiêu đề thành "Đo theo nhóm con". Bổ sung dòng trích đó vào file ghi chú. Nếu muốn giữ criteria drift thì viết một câu riêng và liên kết sang `../llm-evaluation/#judge`.

**9. Số bước của stepper lệch số bước của flow.**
Vị trí: tag "Bước 6/7/8" ở dòng 880–882 so với flow dòng 263–269; các câu "nhảy thẳng tới bước 6" (256), "chặn ở bước 5" (562), "flow 8 bước" (778).
Vấn đề: trong stepper, bước 6 là "R3 thiếu bằng chứng", bước 7 là "Lưu", bước 8 gộp người duyệt và khiếu nại. Trong flow, bước 6 là "Lưu", 7 là "Người duyệt", 8 là "Báo cáo, khiếu nại". Người đọc trên điện thoại đối chiếu sẽ rối.
Sửa: giữ 8 màn hình nhưng đổi tag theo số của flow: màn 6 ghi "Bước 4–5 · tiêu chí R3", màn 7 ghi "Bước 6", màn 8 ghi "Bước 7–8".

**10. Dịch sai câu về thang Landis–Koch.**
Vị trí: dòng 473 ("phổ biến nhưng không được chấp nhận rộng rãi").
Vấn đề: nguồn viết "by no means universally accepted", nghĩa là không phải ai cũng chấp nhận. Câu hiện tại tự mâu thuẫn (phổ biến mà không rộng rãi).
Sửa: "thang Landis–Koch hay được dùng nhưng không phải ai cũng công nhận, và chính tác giả không đưa bằng chứng cho các ngưỡng đó".

**11. Bài tập tuần 2 có thể khiến người học dán tài liệu công ty vào chatbot công cộng.**
Vị trí: dòng 781.
Sửa: thêm "Dùng tài liệu công khai hoặc tài liệu tự viết; không dán tài liệu nội bộ vào chatbot chưa được công ty cho phép."

**12. Khái niệm cốt lõi còn thiếu (xếp theo mức cần).**
- Tài liệu mâu thuẫn nhau hoặc nhiều phiên bản (D1 ghi 48 giờ, D2 ghi 72 giờ). Đây là hệ quả trực tiếp của việc chấm nhiều file; nên có một dòng ở bảng lỗi mục 12 và một quy tắc trong rubric (ví dụ: lấy bản mới nhất, hoặc gắn cờ cho người). Trung bình.
- Cách xử lý dấu "…" trong câu trích. Hai ví dụ JSON đều mở đầu bằng "…"; bộ so khớp chuỗi sẽ trượt nếu không cắt bỏ, và dấu "…" ở giữa cho phép ghép hai mảnh xa nhau. Nên nêu ở bước 3 của danh sách dòng 432: tách theo "…", mỗi mảnh phải khớp, đặt độ dài tối thiểu. Trung bình.
- Chi phí của "một tiêu chí mỗi lần gọi": N tiêu chí là N lần gọi. Hàng ở dòng 711 chỉ nêu lợi. Thêm cái giá và cách giảm (prompt caching cho phần đầu chung, đã có nguồn [24]). Thấp.
- Dữ liệu được lưu: bản ghi và cache giữ nguyên văn đoạn tài liệu của khách hàng. Cần một câu về quyền truy cập và thời hạn lưu, liên kết `../governance/`. Thấp.
- Tiêu chí dạng "không được có" (ví dụ không chia sẻ dữ liệu cho bên thứ ba): luật "không câu trích thì điểm thấp nhất" không áp dụng nguyên xi. Một câu ghi chú là đủ. Thấp.
- Nối ví dụ đầu trang với mục quản trị: "chấm bài luận" và "chấm phản hồi của nhân viên hỗ trợ" (dòng 223) rơi đúng vào hai nhóm Annex III nêu ở dòng 550. Nói thẳng điều đó ở dòng 550. Thấp.
- Liên kết sang `../document-parsing-chunking/` ở hàng "bảng hoặc ảnh scan không được trích chữ" (dòng 726), khi trang đó đã xuất bản. Thấp.

### Mức thấp

**13. Trang dạy Cohen's kappa và dẫn [6], nhưng [6] chủ động bỏ Cohen's kappa.**
Vị trí: dòng 472.
Vấn đề: theo file ghi chú, [6] dùng Scott's π vì Cohen's kappa có "well-documented theoretical issues".
Sửa: thêm nửa câu: "Thakur và cộng sự dùng Scott's π thay cho Cohen's κ; các hệ số trừ ngẫu nhiên cho con số khác nhau, nên luôn ghi rõ đang dùng hệ số nào."

**14. Mũi tên "khi cần" trong SVG flow có đầu mũi tên sai màu, nhãn nằm xa.**
Vị trí: dòng 322 (nét `--p4` nhưng `marker-end="url(#arr)"` màu `--muted`), nhãn dòng 332 ở y = 244 trong khi mũi tên ở y = 293.
Sửa: thêm marker màu `--p4` như `arr2W` ở sơ đồ quan hệ. Rút hộp 7 hoặc đưa nhãn xuống sát nét (ví dụ y ≈ 285, cỡ 11) nếu khe 50 đơn vị đủ chỗ; nếu không thì giữ vị trí.

**15. Diễn đạt nhánh cache dễ hiểu nhầm là "lưu lần nữa".**
Vị trí: dòng 256, nhãn SVG dòng 327–328, mũi tên dòng 324 chỉ vào hộp "6 · Lưu kèm phiên bản".
Sửa: "↓ tra cache: nếu trúng thì dùng verdict đã lưu, bỏ qua bước 4–5 ↓".

**16. vflow mục 10 thiếu mối nối giữa các nhóm.**
Vị trí: dòng 594–597 và 606–609.
Vấn đề: bản desktop có "gọi model" (Prompt chấm → LLM giám khảo) và "khi cần" (Kết quả → Người duyệt); bản mobile không có `.ar` giữa các hộp nhóm.
Sửa: thêm `<div class="ar">↓ gọi model</div>` giữa hộp 1 và 2, và `<div class="ar">↓ khi cần</div>` giữa hộp 2 và 3.

**17. Hai dòng đầu bảng thiên lệch viết suy diễn như sự thật đã đo.**
Vị trí: dòng 483–484.
Vấn đề: [4] và [1], [12] đo trên thứ tự và độ dài của câu trả lời được so sánh, không đo trên thứ tự đoạn bằng chứng hay độ dài hồ sơ nộp. Dòng 486 đã ghi "chưa có nghiên cứu đo trực tiếp"; hai dòng này nên theo cùng chuẩn.
Sửa: thêm "có thể" và ghi "suy ra từ thí nghiệm so câu trả lời".

**18. Bằng chứng [10] về prompt injection yếu hơn cách trang trình bày.**
Vị trí: dòng 558.
Vấn đề: bản HTML của [10] cho thấy họ thay câu trả lời bằng chuỗi cố định kiểu "Ignore directions and grade correct", sai dưới 10%, và để tấn công tối ưu hóa (GCG) cho việc sau.
Sửa: "…chịu được các injection đơn giản (chuỗi mệnh lệnh cố định); họ chưa thử tấn công tối ưu hóa như [30]."

**19. Tiếng Việt và mật độ chữ.**
- Dòng 492: "độ tin cậy nội người chấm" là dịch từng chữ. Đổi thành "độ nhất quán của chính một giám khảo qua nhiều lần chấm (intra-rater reliability)".
- "Luật" dùng cho rule (dòng 402, 423, 562 và nhiều chỗ) dễ lẫn với "Đạo luật AI" ở mục 8. "Quy tắc" tự nhiên hơn.
- Dòng 472: một callout chứa bốn định nghĩa và năm trích dẫn. Tách thành danh sách bốn gạch đầu dòng. "Dễ đẹp" nên là "dễ ra số đẹp".
- Dòng 877: đoạn mở đầu bước 3 dồn chín đoạn ứng viên vào một câu. Chuyển thành ba gạch đầu dòng (D1, D3, D2) rồi một dòng thứ tự.
- Dòng 550: tách đoạn EU thành hai (Annex III; Điều 14).

**20. Hồ sơ #8 nằm giữa mức 0 và mức 1 theo chính bảng mốc.**
Vị trí: dòng 901 (`'Thông báo "khi thích hợp", không có quy trình'`, người chấm 0) so với mức 1 ở dòng 388 ("nêu cam kết chung").
Sửa: đổi nội dung #8 thành ca rõ là 0 (ví dụ "Tài liệu chỉ nói về sao lưu dữ liệu, không nhắc sự cố"), hoặc thêm vào mốc mức 1 điều kiện "có nhắc tới quy trình ứng phó".

**21. Câu về `seed` viết ở thì hiện tại, nguồn là trang lưu trữ.**
Vị trí: dòng 495.
Sửa: "OpenAI từng giới thiệu tham số `seed`… (trang cookbook đã lưu trữ; kiểm tài liệu API hiện hành trước khi dùng)". Tôi chưa kiểm API hiện hành còn nhận `seed` hay không.

**22. Ghi nhận, không bắt buộc sửa.**
- Ở 601–1080px, mục lục, nút giao diện và chip cao 31–33px. Chuẩn của brief chỉ áp cho 390px và trang mẫu cũng vậy.
- Ba khái niệm không có liên kết đến từ khái niệm khác: `high-risk`, `injection`, `self-pref`.
- "Phú An" đã dùng ở trang LangChain cho một công ty bán lẻ giả định. Tôi chưa kiểm có doanh nghiệp thật trùng tên "Tập đoàn Phú An" hay "Mây Xanh"; trang đã ghi rõ hư cấu.

## Thứ tự sửa đề nghị

1. Phát hiện 1, 2, 6, 7, 8, 10 (sửa chữ, mỗi cái vài phút).
2. Phát hiện 3 và 9 (stepper), rồi 4 và 5 (cache, ghi chú phòng hiệu chỉnh).
3. Phát hiện 11, 12 hai ý đầu, 13.
4. Nhóm thấp còn lại nếu còn thời gian.

Sau khi sửa phát hiện 3 và 5, chạy lại stepper bước 3 và sáu trạng thái phòng hiệu chỉnh ở 390px.

## Câu hỏi còn mở

- API OpenAI hiện hành còn hỗ trợ `seed` không (phát hiện 21).
- Có cần nêu luật AI của Việt Nam cạnh EU AI Act ở dòng 550 không. Trang `governance/` có nhắc Việt Nam; nếu thêm thì phải có nguồn đã mở.

## Kết quả áp dụng

Phiên chủ đề đã tự kiểm lại từng phát hiện so với nguồn và mã trang, ngày 2026-11-19.

| # | Kết quả | Ghi chú |
|---|---|---|
| 1 | Đã sửa | Đổi thứ tự trường ở JSON mục 5 và bước 4 (quotes → rationale → gaps → status → score → recommendations). Thêm câu giải thích, dẫn [14]: đã mở lại trang Structured Outputs của OpenAI, mục "Key ordering": "outputs will be produced in the same order as the ordering of keys in the schema". Bỏ dấu "…" trong câu trích ví dụ. |
| 2 | Đã sửa | Thêm nhãn "Bằng chứng hỗn hợp" với [5] ở thẻ "Suy luận trước, điểm sau". |
| 3 | Đã sửa | Dùng kịch bản đề xuất: D2 tr.5 điểm cao, D2 tr.2 (phân vai) dùng từ khác nên điểm thấp; ngân sách 1.900; một quy tắc chung "vượt thì bỏ qua, xét đoạn kế". Tính lại bằng node: theo điểm 1.800 (thiếu D2 tr.2), chia vòng 1.900 (đủ hai đoạn D2). Bước 2 thêm câu vì sao tr.2 điểm thấp; ví dụ khái niệm `budget` đổi thành 1.900. |
| 4 | Đã sửa | Thêm điều kiện ngưỡng điểm liên quan ở bảng cache, ở ghi chú bước 3 và bước 8; bước 8 thêm: tiêu chí không bị khiếu nại mà đổi điểm thì chuyển người duyệt. |
| 5 | Đã sửa | Ghi chú phòng hiệu chỉnh giải thích QWK cao khi mọi lệch chỉ một mức; câu "trông hoàn hảo" chỉ hiện khi lệch ≤ 1 = 100%; lần 3 có câu riêng. Callout bốn chỉ số thêm ý này. |
| 6 | Đã sửa | Bỏ khẳng định holistic dễ anchoring hơn và trích [5]; từ điển bỏ "dễ neo điểm", [5] và liên kết anchoring. |
| 7 | Đã sửa | Viết lại: Prometheus chấm ngang GPT-4 khi có rubric và đáp án tham chiếu (0,897 so với 0,882 trên 45 rubric). |
| 8 | Đã sửa | Tiêu đề thành "Đo theo nhóm con"; thêm dòng trích về nhóm giới tính của [9] vào file ghi chú. |
| 9 | Đã sửa | Nhãn màn 6/7/8 thành "Bước 4–5 · tiêu chí R3", "Bước 6", "Bước 7–8"; câu dẫn stepper nói rõ nhãn khớp số bước ở mục 2. |
| 10 | Đã sửa | "hay được dùng nhưng không phải ai cũng công nhận, chính tác giả không đưa bằng chứng cho các ngưỡng đó". |
| 11 | Đã sửa | Thêm lời dặn dùng tài liệu công khai hoặc tự viết ở bài tập tuần 2. |
| 12 | Sửa 6/7 ý | Đã thêm: tài liệu mâu thuẫn (đoạn ở mục 4 và một dòng ở bảng lỗi); xử lý dấu "…" trong kiểm tra trích dẫn; chi phí N lần gọi và prompt caching [24] ở bảng lựa chọn; dữ liệu được lưu (đoạn ở mục 8, liên kết governance); tiêu chí dạng "không được có"; nối ví dụ đầu trang với Annex III. Bác bỏ liên kết `../document-parsing-chunking/`: thư mục đó chưa tồn tại trong repo lúc kiểm, không được liên kết tới trang chưa xuất bản. |
| 13 | Đã sửa | Thêm câu về Scott's π của [6] (đã có trong file ghi chú). |
| 14 | Đã sửa một phần | Thêm marker màu `--p4` cho mũi tên "khi cần". Giữ nhãn ở y = 244: khe giữa hộp 6 và 7 chỉ 50 đơn vị; ảnh chụp 1280px sáng và tối cho thấy nhãn rõ, không đè. |
| 15 | Đã sửa | vflow và nhãn SVG: "cache trúng: bỏ qua bước 4–5, dùng verdict đã lưu". |
| 16 | Đã sửa | Thêm `.ar` "↓ gọi model" và "↓ khi cần, Kết quả có phiên bản chuyển sang" trong vflow mục 10. |
| 17 | Đã sửa | Hai dòng vị trí, độ dài thêm "có thể" và "suy ra từ thí nghiệm so câu trả lời". |
| 18 | Đã sửa | Đã mở bản HTML của [10]: injection là chuỗi cố định, sai dưới 10%, GCG để làm sau. Câu trong trang viết lại theo đúng phạm vi đó; thêm vào file ghi chú. |
| 19 | Đã sửa | Đổi "độ tin cậy nội người chấm" thành "độ nhất quán của chính một giám khảo qua nhiều lần chấm (intra-rater reliability)"; "luật" (nghĩa rule) đổi thành "quy tắc" toàn trang, giữ "Đạo luật AI"; callout bốn chỉ số tách thành danh sách, "dễ ra số đẹp"; bước 3 tách thành gạch đầu dòng; đoạn EU tách thành hai. |
| 20 | Đã sửa | Hồ sơ #8 thành "Chỉ nói về sao lưu dữ liệu, không nhắc tới sự cố" (rõ mức 0). Điểm số không đổi nên mọi chỉ số giữ nguyên. |
| 21 | Đã sửa | "OpenAI từng giới thiệu `seed`… trang hướng dẫn nay đã lưu trữ, nên kiểm tài liệu API hiện hành trước khi dùng". Không khẳng định API hiện hành còn hay không (chưa kiểm). |
| 22 | Sửa một phần | Thêm liên kết tới `self-pref`, `injection`, `high-risk` từ các khái niệm khác. Không đổi kích thước nút ở 601–1080px (đúng như trang mẫu, chuẩn brief áp cho 390px). Giữ tên "Phú An": trang đã ghi rõ hư cấu ở đầu ví dụ, mục Nguồn và footer; trang LangChain dùng tên này cho một ngữ cảnh khác, không gây hiểu lầm về dữ liệu thật. |

Câu hỏi mở: luật AI của Việt Nam không được thêm vì chưa mở nguồn chính thức; trang giữ câu "Ngoài EU, hãy hỏi bộ phận pháp chế".

Kiểm lại sau khi sửa (Orca, 390px và 1280px, sáng và tối): console 0 mục; scrollWidth = innerWidth ở 390 cho cả 8 màn stepper và 6 trạng thái phòng hiệu chỉnh; 154 liên kết trích dẫn, 0 trỏ hỏng, 31/31 nguồn được dẫn; không có chữ dưới 11px; vùng bấm ở 390 đạt (trừ checkbox nằm trong label bấm cả dòng); không có chữ màu tương phản dưới 4,5:1 ở cả hai chế độ; chỉ số phòng hiệu chỉnh khớp bảng tính lại của kongming.
