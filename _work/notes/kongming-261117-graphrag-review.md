# Kongming review: graphrag/index.html

Ngày: 2026-11-17 · Model: Fable 5.2 · Chỉ tư vấn, không sửa file trang.

Trạng thái file khi review: `graphrag/index.html` 1.138 dòng, mtime 15:32:27 (+07). File đã đổi một lần trong lúc review (15:30:44 → 15:32:27; nhãn mũi tên ở dòng 391 đổi thành "mọi chế độ đọc từ kho index"). Mọi số dòng dưới đây đã grep lại trên bản 15:32:27.

Cách kiểm:
- Nguồn: tải bằng `curl` rồi bỏ thẻ HTML, grep câu gốc (arXiv 2404.16130v2, 2502.11371v4, 2506.05690v3; 10 trang microsoft.github.io/graphrag; blog LazyGraphRAG; README và RAI_TRANSPARENCY.md bản raw; 3 trang Neo4j; abstract Leiden, HippoRAG, LightRAG).
- Layout: headless Chrome qua iframe 390px, 768px, 1280px (đo font thực, tràn ngang, tap target, chữ SVG bị cắt), cộng 5 ảnh chụp (flow SVG, relationship SVG sáng và tối, mô phỏng 4a ở 390px chế độ Global sáng và Local tối).
- JS: tự tính lại tay retrieve(), renderMR(), renderIx(), bảng EV; script node kiểm 40 thuật ngữ và 25 nguồn.

Chưa kiểm: Orca; trạng thái tối của flow SVG; vflow mobile bằng ảnh; nguồn [18] [19] [21] (chỉ dựa vào ghi chú nguồn).

## Tóm tắt

Trang tốt về cấu trúc và phần lớn trích dẫn khớp nguồn. Có 2 lỗi mức cao về độ chính xác (một con số sai mốc so sánh, một chỗ chỉ đưa bằng chứng một chiều trong khi nguồn [15] của chính trang nói ngược lại), 8 lỗi mức trung bình (LazyGraphRAG, FastGraphRAG, spaCy tiếng Việt, cách đếm gleaning, mô phỏng 4a, bảng minh họa mục 9, hai sơ đồ SVG desktop), còn lại mức thấp. Không có lỗi JS làm hỏng tương tác; không tràn ngang ở 390px.

## A. Độ chính xác so với nguồn

### A1 · CAO · "9–43 lần" sai mốc so sánh (dòng 670 và 858)
- Trang viết: Global ở cấp gốc C0 "cần ít token hơn 9–43 lần so với map-reduce trên văn bản gốc".
- Nguồn [1], chú thích Bảng 2: "Root-level community summaries (C0) require dramatically fewer tokens per query (9x-43x)". Số trong bảng: Podcast C0 26.657, C1 225.756, TS 1.014.611; News C0 39.770, C1 352.641, TS 1.707.694.
- Tính lại: so với TS (map-reduce trên văn bản gốc) là 38 lần và 43 lần, khớp câu "over 97% fewer tokens" trong ghi chú nguồn. Con số 9 lần là C0 so với C1 (8,5 và 8,9). Vậy "9–43 lần" là so với mọi điều kiện còn lại (C1–C3 và TS), không phải riêng TS.
- Sửa: "ít token hơn khoảng 38–43 lần (hơn 97%) so với map-reduce trên văn bản gốc" ở cả hai chỗ. Hoặc giữ 9–43 và đổi mốc thành "so với các cấp thấp hơn và map-reduce trên văn bản gốc".

### A2 · CAO · Bằng chứng một chiều cho "Global thắng câu tổng hợp" và cho LLM judge (dòng 606, 666)
- Dòng 606 chỉ dẫn [1]: Global thắng vector RAG 72–83% về đầy đủ. Con số khớp nguồn (72–83% Podcast, 72–80% News; đa dạng 75–82% và 62–71%), nhưng đây là đánh giá của chính nhóm tác giả, bằng LLM judge, không có đáp án chuẩn.
- Nguồn [15] mà trang đã dẫn nói ngược lại ở mục 5.3: "Community-based GraphRAG, particularly with global search, generally underperforms RAG on the selected datasets. This observation contrasts with the findings of Edge et al. (2024)". Cùng mục: "position bias … is clearly present in LLM-as-a-Judge evaluations for summarization, as reversing the order of presented summaries leads to substantially different, and in some cases opposite, judgments"; và "RAG is consistently preferred in terms of Comprehensiveness, while GraphRAG (Global) is favored for Diversity".
- [15] cũng tự giải thích khác biệt: bài [1] hỏi câu tóm tắt toàn kho, còn bộ dữ liệu của họ hỏi về vai trò hoặc sự kiện cụ thể, chấm bằng ROUGE/BERTScore so với bản tóm tắt do người viết.
- Hệ quả cho người học: dễ tin rằng cứ câu tổng hợp là Global thắng, và rằng so cặp bằng LLM là đáng tin.
- Sửa (2 câu, không viết lại mục):
  1. Dòng 606, thêm: "Đây là đánh giá của nhóm tác giả bằng LLM judge. Han và cộng sự chấm tóm tắt theo câu hỏi bằng bản tóm tắt do người viết thì thấy Global thường kém RAG; họ cho rằng khác biệt đến từ loại câu hỏi và cách chấm. [15]"
  2. Dòng 666, cột "Đo thế nào", thêm: "Đổi thứ tự hai câu trả lời rồi chấm lại: đảo thứ tự có thể làm kết quả đổi hẳn. [15]"

### A3 · TRUNG BÌNH · LazyGraphRAG bị mô tả là "như vector RAG" và chỉ "bỏ report" (dòng 596, 493, 531, 565, 1068)
- Blog [12], bảng so sánh, cột LazyGraphRAG, dòng Build index: "Uses NLP noun phrase extraction to extract concepts and their co-occurrences, b) uses graph statistics to optimize the concept graph and extract hierarchical community structure". Dòng Summarize index: "None – the 'lazy' approach defers all LLM use until query time".
- Chỉ **chi phí** index bằng vector RAG ("data indexing costs are identical to vector RAG"). Cơ chế thì vẫn dựng graph khái niệm và cộng đồng, bằng NLP thay cho LLM. Ô "Xây index" dòng 596 ("Như vector RAG: …") làm người học hiểu là không có graph.
- Sơ đồ mục 6 (dòng 565) chỉ nối LazyGraphRAG vào ô "Cộng đồng + report" với nhãn "bỏ, hoãn tới lúc hỏi". Thiếu ý Lazy cũng thay bước LLM trích xuất bằng NLP, giống FastGraphRAG.
- Blog có ghi chú biên tập ngày 2025-06-06: LazyGraphRAG "has been integrated into Microsoft Discovery … and into Azure Local services as part of a public preview". Trang không nói người học lấy nó ở đâu. Việc thư viện mã nguồn mở `graphrag` có LazyGraphRAG hay không: chưa kiểm.
- Sửa: ô dòng 596 thành "Trích khái niệm (cụm danh từ) và đồng xuất hiện bằng NLP, vẫn chia cộng đồng nhưng không gọi LLM; chi phí index bằng vector RAG và bằng 0,1% GraphRAG đầy đủ." Thêm vào ô "Lưu ý": "Theo ghi chú 06/2025 của blog, công nghệ này có trong Microsoft Discovery và Azure Local (public preview)." Trong SVG mục 6, thêm một mũi tên nét đứt từ LazyGraphRAG tới "LLM trích xuất" hoặc đổi nhãn thành "NLP thay LLM, không viết report".

### A4 · TRUNG BÌNH · FastGraphRAG vẫn dùng LLM để viết community report (dòng 491, 529, 595, 1067)
- Nguồn [4]: "FastGraphRAG is a method that substitutes **some** of the language model reasoning"; "community report generation: The direct text unit content containing each entity noun phrase is collected and used to prompt the LLM to generate a summary report".
- Thẻ từ điển dòng 1067 viết "Thay LLM bằng NLP", nhãn SVG dòng 529 viết "NLP thay LLM". Người học sẽ hiểu Fast không gọi LLM lúc index. Bản mobile dòng 491 ("thay LLM trích xuất bằng NLP") thì đúng.
- Sửa: dòng 1067 thành "Thay LLM ở bước trích xuất bằng NLP …; report vẫn do LLM viết." Dòng 595 ô "Xây index" thêm "LLM vẫn viết community report từ đoạn văn gốc." Dòng 529 đổi thành "NLP trích xuất, graph nhiễu hơn".
- Tùy chọn: [4] còn nói Fast thường cắt đoạn rất nhỏ, 50–100 token. Đáng thêm nửa câu vì nó ngược với mặc định 1.200.

### A5 · TRUNG BÌNH · Gợi ý spaCy cho tiếng Việt không dùng được như viết (dòng 632)
- Trang: "thử hai cách dựa trên spaCy có sẵn với mô hình hỗ trợ tiếng Việt".
- Nguồn [4]: hai cách là "semantic parsing and CFG", mặc định `en_core_web_md`, "you can reference any supported model that you have installed". Cả hai cần pipeline có POS tagger hoặc parser.
- Kiểm thêm (`website/meta/languages.json` của repo explosion/spaCy): tiếng Việt có `models: None`, chỉ có tokenizer qua Pyvi. Tức spaCy không có mô hình tiếng Việt chính thức được huấn luyện sẵn.
- Sửa: "Nếu không, dùng Standard cho tài liệu tiếng Việt. Hai cách dựa trên spaCy cần mô hình có phân tích cú pháp; spaCy chưa có mô hình tiếng Việt chính thức, nên phải tự kiểm mô hình cộng đồng trước khi tin." Câu này là suy luận từ hai nguồn, nên ghi rõ như vậy hoặc bỏ hẳn gợi ý spaCy.

### A6 · TRUNG BÌNH · Mô phỏng 4c đếm thiếu lần gọi gleaning nhưng ghi "tối đa" (dòng 448, 461, 1019, 1024)
- Code: `calls=units*(1+g)`, nhãn "Lần gọi LLM để trích graph (tối đa)".
- Nguồn [1]: "we first ask the LLM to assess whether all entities were extracted, using a logit bias of 100 to force a yes/no decision. If the LLM responds that entities were missed, then a continuation … encourages the LLM to detect these missing entities." Mỗi vòng có một lần hỏi yes/no và một lần trích tiếp, tức tối đa 2 lần gọi.
- Sửa nhẹ nhất: đổi nhãn thành "Lần gọi trích xuất (chưa tính lần hỏi yes/no ngắn của mỗi vòng)" và sửa dòng 448, 461 theo cùng ý. Hoặc đổi công thức thành `units*(1+2*g)` và giải thích trong details.

### A7 · TRUNG BÌNH · Câu "Global trả về không đủ thông tin" trái với số đo của [15] (dòng 634, 896)
- Mô phỏng 4a (dòng 896) và thẻ lỗi (dòng 634) nói: hỏi chi tiết qua Global thì mọi câu trả lời bộ phận điểm 0, kết quả là "không đủ thông tin".
- [15] mục 4.2: Global "performs poorly on Null queries in MultiHop-RAG (ideally answered as insufficient information), suggesting increased hallucination risk". Bảng 2: cột Null, RAG 96,01; Global 19,27. Tức trong thực nghiệm Global hay trả lời bừa hơn là từ chối.
- Cơ chế lọc điểm 0 khớp [1]. Chỗ lệch là kết cục mà người học mang về.
- Sửa: dòng 896 thêm "Thực tế LLM vẫn có thể chấm điểm khác 0 cho report không liên quan và trả lời sai: Han và cộng sự đo Global chỉ đúng 19,27% ở câu không có đáp án, so với 96,01% của RAG. [15]". Đổi tiêu đề thẻ dòng 633 thành "… câu trả lời chung chung, bịa, hoặc 'không đủ thông tin'".

### A8 · THẤP · Trích dẫn hơi vượt nguồn
- Dòng 668: "Lấy mẫu entity và quan hệ cho chuyên gia nghiệp vụ kiểm [24]". RAI chỉ nói "a domain expert should analyze its **answers**" và kiểm bằng "gold answer". Sửa: bỏ [24] ở câu này, hoặc viết "chuyên gia nghiệp vụ đọc lại câu trả lời và nguồn [24]; nên lấy mẫu cả entity và quan hệ".
- Dòng 705 và 840: "vì sao dùng Leiden thay vì Louvain". [1] chỉ nói dùng Leiden "in a hierarchical manner"; không nêu lý do chọn so với Louvain. Lý do liên thông là của [13]. Sửa câu hỏi thành "Leiden hơn Louvain ở điểm nào?" để không gán lý do cho Microsoft.
- Dòng 607: "HippoRAG2 và Local search đứng đầu" khớp [15] ("perform best on multi-hop QA benchmarks"), nhưng khoảng cách rất nhỏ: HotPotQA F1 là RAG 60,04, Local 61,66, HippoRAG2 63,01; MultiHop-RAG tổng là RAG 67,02, Local 69,01, HippoRAG2 70,27. Thêm "(hơn RAG khoảng 2–3 điểm)". Xem thêm B2.

### Đã kiểm và khớp (không cần sửa)
1.200 token mặc định [3]; gộp theo title + type [3]; claim tắt mặc định [3]; ~75% chi phí [4]; 4 loại entity mặc định, 5–10 findings, `degree`, `text_unit_ids` [9]; CLI `query --method` mặc định `global`, lệnh `update` [11]; "highly encouraged", `--discover-entity-types` [10]; Local và DRIFT [6] [7]; điểm 0–100, lọc điểm 0, xếp giảm dần [1]; 600 so với 2.400 token "almost twice" [1]; 1.669 đoạn, 281 phút, gpt-4-turbo [1]; 125 câu, 5 lần lặp, directness đối chứng [1]; 0,1%, hơn 700 lần, 5.590 bài AP, 100 câu [12]; Louvain 25% và 16% [13]; 65,8%, 13,6% và 11,6%, 54,48 so với 64,78, 135 s so với 5.560 s, Selection và Integration, KDD '26 [15]; HippoRAG 20%, 10–30 lần, 6–13 lần [17]; Neo4j quan hệ một hướng một loại [20]; Text2Cypher [25]; 7.800 → 40.000 token [22]; README "maintenance mode", "not an officially supported Microsoft offering" [23]; bốn hướng đánh giá của RAI [24]. Mọi `#src-N` trỏ tới id có thật; không nguồn nào bị bỏ không dẫn.

## B. Mô phỏng và JS

### B1 · TRUNG BÌNH · 4a: Local "thắng" vì đáp án được chọn sẵn làm điểm vào; verdict không nhất quán (dòng 880–884, 848)
- `entry:['sc14','hd88']`: HĐ-88 chính là đáp án. Nếu chỉ có SC-14 làm điểm vào thì một bước chỉ ra ML-5 và Kho Bình Dương, không tới Tân Phát, và Local trượt. Logic `retrieve()` đúng với mô tả (mở đúng một bước, không phụ thuộc thứ tự cạnh; tôi tính lại ra 6 entity, 5 quan hệ, T1 và T3, 2 report). Vấn đề là người học tưởng Local "đi theo chuỗi 3 cạnh" như dòng 851 vẽ.
- Verdict lệch nhau: Basic nhận T1 + T3 bị gán "bad" (dòng 882), Global nhận hai câu bộ phận chứa đủ "HĐ-88" và "chị Lan" lại được gán "warn" (dòng 884). Hai context này thiếu cùng một mắt xích (ML-5 thuộc Tân Phát) và đều đủ để LLM đoán đúng.
- Sửa: (1) thêm một câu ở dòng 949 hoặc 420: "HĐ-88 được chọn làm điểm vào vì mô tả của nó gần chữ 'hợp đồng' trong câu hỏi. Local không lần theo chuỗi nhiều bước; nó gom vùng quanh các điểm vào, và ở đây hai vùng nối nhau qua cạnh ML-5 → Tân Phát." (2) Đổi Basic của câu nhiều bước sang "warn" với lời: "Có thể đoán đúng, nhưng không có bằng chứng nối ML-5 với Tân Phát". Hoặc sửa T3 để không còn chữ "thiết bị lạnh" nếu muốn giữ "bad".

### B2 · TRUNG BÌNH · Bảng minh họa mục 9 phóng đại lợi ích của graph (dòng 1107)
- Tính lại: 54 + 22 + 14 = 90; Basic 59/90 (66%), Local 67/90 (74%), Global 38/90 (42%), chọn theo nhóm 75/90 (83%). JS tính đúng, nhãn mobile đúng.
- Nhưng ở nhóm nhiều bước, Basic 9/22 (41%) so với Local 17/22 (77%), chênh 36 điểm. Số đo thật trong [15] chênh 2–3 điểm (xem A8). Selection trong bảng thêm 9 điểm; [15] đo được Selection hơn baseline tốt nhất 1,1% và Integration 6,4% (MultiHop-RAG, Llama 3.1-70B).
- Có ghi "minh họa", nhưng người học sẽ mang kỳ vọng này vào đề xuất cho doanh nghiệp.
- Sửa: thu hẹp số (ví dụ nhóm nhiều bước 13, 16, 9) hoặc thêm một câu dưới bảng: "Khoảng cách ở đây được phóng to để dễ thấy. Trong nghiên cứu, chênh lệch ở câu nhiều bước chỉ khoảng 2–3 điểm. [15]"

### B3 · THẤP · 4b renderMR()
- Vòng lặp `break` ở câu đầu tiên không vừa, khớp cách [1] mô tả. Tính lại: C1 ngân sách 1.200 → 4/7 (300+300+320+280 = 1.200); C0 1.200 → 3/3 (1.150); C1 3.000 → 7/7 (2.000). Đúng.
- Trạng thái cạnh: C0 với ngân sách 300–400 cho "0 / 3" mà không có lời giải thích (dòng 440, `min="300"`). Sửa: đặt `min="500"`, hoặc khi `inSet.length===0` in "Không câu nào vừa ngân sách: bước reduce không có gì để viết."
- Câu hỏi ghi "Năm 2026" (dòng 436) trong khi 4a và bước 7 ghi "Năm nay". Thống nhất một cách.

### B4 · THẤP · 4c renderIx()
- Tính lại: 5 triệu ÷ 1.200 = 4.167 đoạn; × (1+1) = 8.334; 4.167 ÷ 1.669 = 2,5. Đúng.
- Khi kho nhỏ và đoạn lớn (0,5 triệu, 2.400) hiện "gấp 0,1 lần bộ podcast" (dòng 1023). Sửa: nếu tỷ số < 1 thì in "bằng X% bộ podcast".

### B5 · THẤP · Không thấy lỗi ở
Stepper (8 bước, nút Trước/Tiếp, cuộn ngang), từ điển (40 thẻ, mọi id liên quan tồn tại, tìm không dấu), checklist (prefix `grag-`, có try/catch), TOC.

## C. Sơ đồ

### C1 · TRUNG BÌNH · Flow SVG mục 2 (desktop)
- Dòng 390: đường nét đứt từ "Kho index" kết thúc ở cạnh trên ô **Local search** (575,310). Nhãn nói "mọi chế độ đọc từ kho index" nhưng mũi tên chỉ vào một chế độ. Sửa: vẽ một khung nét đứt bao bốn ô chế độ (x 352–798, y 304–550) và cho mũi tên chạm khung; hoặc kéo một đường dọc bên trái bốn ô với bốn nhánh ngắn.
- Dòng 370: dòng phụ của Local ("entity gần câu hỏi làm điểm vào → entity kề, quan hệ, đoạn gốc, report") dài hơn ô. Ảnh chụp 1280px cho thấy chữ "report" đè lên viền phải và đầu mũi tên đi ra. Sửa: rút thành "điểm vào là entity gần câu hỏi → entity kề, quan hệ, đoạn gốc" hoặc nới ô rộng 460 và dời ô "LLM trả lời".
- Dòng 353 và 390: đường nét đứt màu `--ok` nhưng dùng marker `#fa` màu `--muted`, nên đầu mũi tên xám trên đường xanh. Mục 6 đã có marker xanh riêng (`#rg`). Sửa: thêm marker xanh tương tự. Mức thấp.
- Hướng và nghĩa các mũi tên còn lại đúng; chú thích màu khớp.

### C2 · TRUNG BÌNH · Relationship SVG mục 6 (desktop)
- Dòng 569: nhãn "bỏ, hoãn tới lúc hỏi" bắt đầu ở x=883, bị cắt ở mép phải viewBox (đo: mép phải chữ 1058 trên bề rộng 1050; ảnh chụp sáng và tối đều chỉ thấy "bỏ, hoãn tới lúc hỏ"). Sửa: `x="867" text-anchor="end"` để chữ nằm bên trái mũi tên, hoặc rút thành "bỏ lúc index".
- Thiếu mũi tên "Cộng đồng + report → Local". Bản mobile dòng 509 ghi Local đọc "knowledge graph + TextUnit + report liên quan", và [6] có "Entity-Report Mapping → Community Reports". Hai bản lệch nhau. Sửa: thêm một đường, hoặc ghi "(+ report liên quan)" vào dòng phụ của ô Local.
- LazyGraphRAG: xem A3.
- Các mũi tên khác đúng hướng (TextUnit → Basic và Local; graph → Local; report → DRIFT và Global; DRIFT → Local có nhãn "gọi"). Không nhãn nào đè nhau. Chú thích khớp màu.

### C3 · THẤP · Graph SVG 4a (viewBox 360×344)
- Ở 390px SVG rộng khoảng 300px, chữ 13 đơn vị hiển thị 10,8px (dưới ngưỡng ~11px một chút). Sửa: tăng `font-size` lên 14 ở dòng 926, 935, 936; nhãn dài nhất "Chị Lan (mua hàng)" vẫn vừa ô 152.
- Ở chế độ Global, nhãn "2 · Nhà cung cấp · report" chạm sát viền phải của khung (xem ảnh). Nếu tăng font thì rút hậu tố thành "· rep." hoặc bỏ dấu "·".
- Chú thích dòng 905: ô mẫu "Vào context" nền `--surface-2`, ô "Điểm vào" nền `--warn-soft`, nhưng nút thật tô màu nhạt của cộng đồng (`CS[n.c]`). Không có mục chú thích cho "cộng đồng được tô = report vào context". Sửa: bỏ nền ở hai ô mẫu (chỉ giữ viền) và thêm một mục "Khung tô màu: report vào context".
- Cộng đồng 1 dùng `--p1`, cùng giá trị với `--accent` của "quan hệ vào context". Ở chế độ Local, viền cộng đồng 1 và cạnh được chọn cùng màu. Chấp nhận được vì độ dày khác nhau; đổi cạnh sang `--text` nếu muốn rõ hơn.
- Cạnh không có mũi tên và không có nhãn, hướng chỉ có trong danh sách bên cạnh. Chấp nhận được ở khổ này.

## D. Mobile 390px

- Không tràn ngang (scrollWidth 375 trên iframe 390, trừ thanh cuộn). Bảng thành thẻ đúng.
- Chữ nhỏ nhất: trích dẫn 11px; chữ trong graph 4a 10,8px (C3).
- Tap target dưới 40px: liên kết trích dẫn `sup.cite a` cao 35px (đã có lịch sửa toàn site theo commit e148ea9); liên kết "Liên quan" trong từ điển 39px (lệch 1px, bỏ qua được); ô checkbox 20px nhưng cả nhãn bấm được.
- Ở 601–1080px (tablet) các nút `.qt-row`, `.chip`, TOC cao 31–37px vì `min-height:40px` chỉ áp dụng dưới 600px. Ngoài phạm vi 390px; nêu để biết.

## E. Khái niệm còn thiếu cho người xây RAG doanh nghiệp

1. **TRUNG BÌNH · Cách chọn cấp cộng đồng trong thực tế.** Trang nói "chọn cấp" nhưng không nói mặc định. CLI [11]: `--community-level … Higher values represent smaller communities. [default: 2]`, và có cờ `--dynamic-community-selection`. Thêm một câu vào bước 7 hoặc thẻ "Cấp cộng đồng". Đồng thời ghi rõ "số càng lớn là cấp càng thấp (cộng đồng càng nhỏ)", vì trang gọi C1 là "cấp thấp hơn" trong khi số lớn hơn C0.
2. **THẤP · Thẻ quyền xem (dòng 645–647) chưa có nguồn.** RAI [24] có câu dùng được: "the system is designed for trusted users". Dẫn câu này để thẻ không chỉ là suy luận.
3. **THẤP · Model dùng để dựng graph ảnh hưởng chất lượng.** [15] mục 4.7 có phân tích riêng (GPT-4o-mini so với GPT-4o). Trang khuyên "thử model rẻ" (dòng 638) mà không nói mặt trái. Một câu là đủ; con số cụ thể tôi chưa đọc.
4. **THẤP · Một khung quyết định ngắn cuối mục 7.** Các ý đã có nhưng rải rác. Ba câu hỏi: (a) bao nhiêu phần trăm câu hỏi thật là nhiều bước hoặc toàn kho; (b) kho có giàu thực thể định danh không ([24]: "rich in identifiable entities"); (c) có chịu được chi phí index và việc tự bảo trì không.

## F. Sư phạm và tiếng Việt

- THẤP · "Cách kiểm:" được dùng cho cả cách sửa (dòng 629, 635, 644, 647, 650). Đổi nhãn thành "Cách kiểm và sửa:".
- THẤP · "câu trả lời bộ phận" (6 chỗ: 436, 440, 634, 706, 855, 896) nghe như dịch máy. "câu trả lời từng phần" tự nhiên hơn.
- THẤP · "Nối các chấm" (dòng 240) là dịch sát "connect the dots". Vì đã có câu trích tiếng Anh bên cạnh nên giữ được; "Xâu chuỗi thông tin" dễ hiểu hơn.
- THẤP · "map-reduce" xuất hiện ở mục 2 (dòng 292, 373) trước khi được giải thích ở bước 7 và 4b. Thêm "(chia nhỏ, trả lời từng phần, rồi gộp)" ở lần đầu.
- THẤP · "IRCoT" (dòng 598, 1070) và "TS, SS" (dòng 697) không được giải thích. Thêm "IRCoT (tìm rồi suy luận lặp nhiều vòng)"; "TS = tóm tắt thẳng văn bản gốc, SS = vector RAG".
- THẤP · Bước 1 nói "30 câu hỏi mẫu" (dòng 823), mục 9 nói "bộ test 90 câu" (dòng 675). Thêm nửa câu nối hai con số, hoặc dùng một con số.
- THẤP · Đoạn lead (dòng 235) là một khối khoảng 70 từ; trên điện thoại nên tách thành hai đoạn sau câu thứ hai.
- Thứ tự mục, ví dụ Sao Việt xuyên suốt, và các callout "minh họa" đều tốt; không cần đổi.

## Thứ tự nên sửa

1. A1, A2 (sai số và thiếu phản chứng).
2. A3, A4, A5, A7 (mô tả Lazy/Fast, spaCy, Null queries).
3. C1, C2 (hai SVG desktop: chữ bị cắt, mũi tên sai nghĩa).
4. B1, B2, A6 (mô phỏng 4a, bảng minh họa, đếm gleaning).
5. Phần còn lại theo sức.

## Giả định

- Chọn bản arXiv v2 của [1], v4 của [15], v3 của [22] vì đó là bản trang đang dẫn hoặc bản HTML mới nhất mở được (độ tin cậy cao).
- Mức "cao" được gán cho lỗi làm người học quyết định sai về việc có dùng GraphRAG hay không, kể cả khi sửa chỉ mất hai câu (độ tin cậy trung bình; nếu caller xếp theo công sửa thì A1 và A2 vẫn nên làm trước).
- Kết luận về spaCy dựa trên `languages.json` nhánh master ngày 2026-11-17; mô hình cộng đồng ngoài spaCy chưa được kiểm (độ tin cậy trung bình).

## Câu hỏi còn mở

- Thư viện mã nguồn mở `graphrag` có chế độ LazyGraphRAG hay chưa: chưa kiểm.
- Lệnh `update` viết lại những community report nào khi thêm tài liệu: tài liệu CLI không nói; trang cũng không khẳng định, nên để nguyên.

## Kết quả áp dụng (phiên chủ đề, 2026-11-17)

Mỗi phát hiện đã được kiểm lại bằng nguồn (WebFetch lại Bảng 2 của [1], mục 5.3 và Bảng 1–2 của [15], trang CLI [11], trang methods [4]) hoặc bằng chạy trang trong Orca.

Đã sửa:
- A1: đổi thành "khoảng 38–43 lần (hơn 97%)" ở mục 9 và bước 7. Kiểm: Bảng 2 cho TS/C0 = 38,1 (Podcast) và 42,9 (News); 9x là so với C1.
- A2: thêm phản chứng của [15] (Global thường kém RAG khi chấm bằng tóm tắt người viết; trái với Edge và cộng sự) ở mục 7, và thêm việc đổi thứ tự khi dùng LLM judge (position bias) ở bảng mục 9.
- A3: mô tả LazyGraphRAG đúng cơ chế (NLP trích khái niệm, thống kê graph tạo cộng đồng, không tóm tắt bằng LLM) ở bảng mục 7, từ điển, vflow và SVG mục 6; thêm ghi chú 06/2025 (Microsoft Discovery, Azure Local).
- A4: FastGraphRAG: ghi rõ LLM vẫn viết community report, đoạn thường 50–100 token (bảng, từ điển, vflow, SVG).
- A5: bỏ khẳng định "spaCy có mô hình hỗ trợ tiếng Việt"; giờ chỉ nói hai cách spaCy cần một mô hình đã cài và phải tự kiểm với tiếng Việt. Không viết "spaCy không có mô hình tiếng Việt" vì tôi chưa tự kiểm nguồn đó.
- A6: công thức 4c đổi thành TextUnit × (1 + 2 × vòng gleaning); sửa câu dẫn và mục giả định.
- A7: thêm số Null query 19,27 so với 96,01 [15] vào thẻ lỗi và verdict Global của câu tra cứu; đổi tiêu đề thẻ.
- A8: bỏ gán [24] cho "lấy mẫu entity" (viết lại theo đúng ý RAI: chuyên gia đọc câu trả lời và lần theo nguồn); đổi câu hỏi Leiden thành "Leiden hơn Louvain ở điểm nào?" (cả bước 4); thêm F1 63,01 / 61,66 / 60,04 cho câu "đứng đầu".
- B1: verdict Basic câu nhiều bước đổi sang "warn" (đoán được nhưng thiếu căn cứ); thêm giải thích Local gom vùng quanh từng điểm vào, nếu chỉ SC-14 làm điểm vào thì chuỗi đứt (mô phỏng và bước 6).
- B2: thu hẹp số nhóm nhiều bước (13/16/9 thay 9/17/8); thêm câu dẫn số thật của [15] (2–3 điểm F1; Selection +1,1%, Integration +6,4%).
- B3: thanh ngân sách min 500 (không còn trạng thái 0 câu); thống nhất "Năm nay".
- B4: khi kho nhỏ hơn bộ podcast thì in "bằng X%".
- C1: khung nét đứt bao bốn chế độ, mũi tên "mọi chế độ đọc từ kho index" chạm khung; marker xanh riêng cho đường nét đứt xanh; rút dòng phụ của Local.
- C2: nhãn LazyGraphRAG dời sang trái mũi tên (text-anchor end), không còn bị cắt; ô Local ghi "+ report".
- C3: chữ graph 4a lên 14; bỏ hậu tố "· report" ở tiêu đề cộng đồng; ô mẫu chú thích chỉ giữ viền; thêm mục "Khung cộng đồng tô màu: report vào context (Global)".
- E1: thêm mặc định cấp 2, "số cấp càng lớn cộng đồng càng nhỏ", dynamic community selection [11] (bước 7, từ điển).
- E3: thêm câu model dựng graph mạnh hơn thường tăng độ đúng [15] vào thẻ chi phí index.
- E4: thêm callout "Ba câu hỏi trước khi quyết định" cuối mục 7 (dẫn [24] "rich in identifiable entities", [4], [23]).
- F: "Cách kiểm và sửa"; "câu trả lời từng phần" thay "câu trả lời bộ phận"; giải thích map-reduce ở mục 2, IRCoT, TS/SS; bước 1 dùng 90 câu cho khớp mục 9; tách đoạn lead thành hai.
- D (tablet 601–1080px): thêm min-height 40px cho chip, nút stepper, nút mô phỏng.

Bác bỏ:
- E2 (dẫn "designed for trusted users" của RAI cho thẻ quyền xem): thẻ đã ghi rõ là gợi ý thiết kế; câu trích đó tôi chưa tự mở để kiểm nên không thêm.
- F "Nối các chấm" → "Xâu chuỗi": giữ, vì đứng cạnh câu trích tiếng Anh "connect the dots" và là cách nói quen.
- C3 màu cạnh trùng màu cộng đồng 1: giữ, độ dày khác nhau (4 so với 1,5) đủ phân biệt, kongming cũng xếp là chấp nhận được.
- Câu hỏi mở về LazyGraphRAG trong thư viện mã nguồn mở: trang không khẳng định điều này, để nguyên.

Kiểm sau khi sửa (Orca, 390 và 1280, sáng và tối): console 0 lỗi; scrollWidth = innerWidth; 25/25 #src-N tồn tại và đều được dẫn; không chữ dưới 11px; không vùng bấm dưới 40px ở 390; 0 chữ màu tương phản dưới 4,5:1; số mô phỏng 4b/4c và bảng mục 9 khớp tính tay.
