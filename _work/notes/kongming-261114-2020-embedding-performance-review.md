# Review: embedding-performance/index.html (Kongming, 2026-11-14)

Reviewed file: `D:\WORKSPACES\learning-ai\embedding-performance\index.html` (891 lines). Advisory only, no edits made.
Runtime: Claude Fable 5.2.

## Verdict

The page is solid: every worked number is arithmetically correct, the calculator JS is correct, the stepper numbers are consistent with each other, and almost every citation matches its evidence. No high-severity technical error was found. The work left is: 2 real layout bugs, 1 SVG label struck through by its own arrow, 1 missing key arrow in the relationship map, a handful of claims slightly stronger than their source, and a few pedagogy gaps.

## How this was checked

- Read the full HTML/CSS/JS and the evidence notes (`research-261114-2022-embedding-performance-sources.md`).
- Re-fetched 7 sources today with WebFetch: [2], [4], [5], [6], [10], [12], [17]. Sources [1], [3], [7], [8], [9], [11], [13], [14], [15], [16] were compared against the notes only (not re-fetched).
- Arithmetic re-computed by hand. SVG geometry reasoned from coordinates (Bezier points computed). Contrast ratios computed from the hex values.
- Not verified: actual rendering in a browser (no browser run). Mobile and overlap findings are derived from CSS and coordinates.

## Verified correct (no action)

- 1.000.000 × 1024 × 4 = 4.096.000.000 B = 4,096 GB (≈ 4,1) = 3,8147 GiB (≈ 3,81).
- Self-check Q2: 2.000.000 × 768 × 1 = 1.536.000.000 B = 1,536 GB (page shows ≈ 1,54) = 1,4305 GiB (≈ 1,43).
- MRR (1 + 1/3 + 0)/3 = 0,444; recall@10 = 2/3 = 0,67.
- Section 7 table and step 6 table: 4.096 / 2.048 / 1.024 / 128 byte per vector; 2,05 GB; 1,02 GB; 512 MB; 128 MB all correct.
- Step 7: 1.000.000 × 2 × 16 × 4 = 128.000.000 B = 128 MB; 512 + 128 = 640 MB; 8× / 2,5× = 3,2 ("khoảng 3 lần") correct.
- JS `perVec`, `calc`, `human`, `humanBin`, `parseIntStrict`: correct. Max value 1e10 × 65.536 = 6,6e14 stays below 2^53. Output of `human` matches the page text for every preset (4,1 GB / 3,81 GiB; 2,05 GB; 1,02 GB; 128 MB).
- Stepper chain 86% → 85% → 84% → 83% → 82% is consistent across steps 4, 6, 7, 9 and the final summary.
- Glossary: all 44 terms' related ids resolve. Links `../rag/#embedding` (section 4) and `../rag/#nang-cao` (section 9) exist in `rag/index.html` lines 344 and 546.
- Rules: no model names, prices or benchmark scores stated as facts in body text; no external libs/CDN; illustrative numbers are labelled.
- Citations matching their source on re-fetch: [4] ef / M / "M * 8-10 bytes"; [5] `ntotal * code_size`, 4*d, `4*d + x * M * 2 * 4`, no removal in HNSW, IVF failure case; [6] 32x, threshold at 0, Hamming, 256 levels, calibration, 4x, "doesn't universally work", top-40 rescoring with float32 query + int8 from disk; [2] falls off less quickly; [12] incompatible spaces, must re-embed; [17] own table next to existing, switch after evaluation.

## Findings

### A. Bugs (HTML / CSS / JS)

1. **Medium. CSS line 132 and 170, input `#cM` (line 390).** The selector `.check input` also matches the text input for M, because it sits inside `label.check`. On mobile (≤600px) it gets `height:20px` (width stays 56px from the inline style). With border-box, 2px padding and 1px border, only about 14px is left for 15px text, so the number is clipped and the tap target is 20px high (rule: ≥ 40px). On desktop it gets a stray `margin-top:6px`.
   Fix: scope both rules to `.check input[type=checkbox]`, and give `#cM` `min-height:40px` on mobile. Better: move the M input out of the checkbox label into its own labelled field.

2. **Medium. CSS line 139-141, citations `[N]` → `#src-N`.** `ol.sources li` has no `scroll-margin-top`, so a clicked citation scrolls the source to the very top, under the sticky header (about 50px desktop, about 60px mobile). The highlighted `:target` row is hidden. The RAG template has it (`rag/index.html` line 128: `scroll-margin-top:64px` plus `overflow-wrap:anywhere`).
   Fix: add `scroll-margin-top:72px` to `ol.sources li`. Same for `.term` cards if they are ever linked by hash.

3. **Low. Stepper `show()` (line 755).** Step buttons have no `aria-current`, the body `#stepBody` has no `aria-live`, and focus does not move, so screen-reader users get no feedback. On mobile, after pressing "Tiếp →" at the bottom of a long step, the reader lands in the middle of the next step.
   Fix: set `aria-current="step"` on the active button, add `aria-live="polite"` to `#stepBody`, and when navigation came from the Prev/Next buttons scroll `#stepBody` to the top of the viewport.

4. **Low. `#cOut` has `aria-live="polite"` (line 396).** Every keystroke re-announces the whole result, including the 4-row comparison. Fix: put `aria-live` only on the `.big` result line, or debounce.

5. **Low. `.vflow` wrappers (lines 253, 417).** `aria-label` on a plain `div` is not announced reliably. Fix: add `role="group"`. Also `nav.toc` has no `aria-label`.

6. **Low. `applyPreset` / `nf` (line 766, 794).** If a browser lacks `vi-VN` locale data, `toLocaleString` falls back to the default locale without throwing; an Indian-style grouping ("10,00,000") would fail `parseIntStrict` after pressing a preset. Rare. Fix: write the preset with a hand-made dot grouping, or parse `a[0]` directly and only format for display.

7. **Low. `human()` (line 769).** Values just under a unit boundary print as "1.000 kB" / "1.000 MB" (e.g. 999.999 byte). Cosmetic.

8. **Low. Home page.** `D:\WORKSPACES\learning-ai\index.html` line 58 lists only `rag/`; this page is not reachable from the home index (the "← Chủ đề" link goes there). Add the entry when publishing.

### B. SVG diagrams

9. **Medium. `#flow` SVG, lines 344-345.** The label "không ứng viên nào đạt → chọn lại" (x≈192-408, y≈3-17) is struck through by its own dashed curve. The curve `M440 28 C 440 4, 160 4, 160 26` runs at y≈16,5 (x=411), 12,8 (x=380), 9,75 (x=300), exactly inside the text band.
   Fix: move the label off the curve, for example `x="455" y="20" text-anchor="start"` (free space above phase 2, right of the curve start), or extend the viewBox upward (`viewBox="0 -18 1000 428"`) and put the label at `y="-4"`.

10. **Medium. `#quan-he` SVG, lines 482-499.** There is no arrow from "Embedding model" (or "Cách dùng model") into "Chất lượng tìm". The only arrows into quality are "Eval set → đo" and "ANN bỏ sót". The page's main message ("model quyết định trần chất lượng") is missing on desktop, while the mobile `.vflow` version does show it. The wide "Embed lại toàn bộ kho" box (x 20-430) blocks the column.
    Fix: shrink that box to column 1 (x 20-190), then draw a line `340,204 → 340,388` labelled "quyết định trần chất lượng".

11. **Medium-low. `#quan-he` SVG, lines 495 and 497.** Two dashed paths of the same colour cross in the 60px gap between columns 3 and 4 (around x≈657, y≈338): "Tham số index → Bộ nhớ" and "ANN recall → Chất lượng tìm". The second one also crosses the solid arrow "Kiểu số → Bộ nhớ" at (565, 350). Readers cannot tell which line goes where.
    Fix: start the "+ bộ nhớ index" line from the left edge of "Tham số index" (700,177) and route it down the x=670 gap, and route the "ANN bỏ sót" line at y=360 with a different colour (`var(--bad)`), or drop one of them and keep the note in text.

12. **Low. `#quan-he` SVG, line 509.** The second "×" at (548, 378) has no operand. The formula is N × d × byte/số, and N is not a node on the map. Fix: change it to "× N (số vector) =".

13. **Low. `#quan-he` SVG, line 489.** The arrow "Vector → Số chiều" points down (a "has property" relation) while the other row-2 arrows point up (a "knob acts on" relation). Fix: relabel "có kích thước" or reverse it to match.

14. **Low. `#quan-he` SVG, line 502.** Label "cải thiện" (x 150-192, baseline 112) touches the curve at its right end (curve is at y≈116 for x≈192; about 1px clearance). Fix: move to `x="128" y="104"`.

15. **Low. `#quan-he` SVG, line 501.** Label "trả về" starts at x=853 in a 30px gap (850-880) and reaches the Top-k box border. Fix: remove the label or widen the gap.

16. **Low. `#flow` SVG, line 346.** "Đạt cả ba mục tiêu → triển khai" floats under phase 3 with no arrow. Logically the exit is decided at "ĐO". Fix: anchor it under phase 2 or add a short arrow.

17. **Medium-low. CSS line 79 and 156 (inherited from the RAG template).** Between 601px and about 900px viewport the desktop SVG is shown scaled to about 0,64-0,85, so 11-12px labels render at 7-10px. Fix: raise the `.d-only` / `.m-only` switch to about 900px for diagrams, or set `.svgbox svg{min-width:900px}`.

### C. Citations and claim strength

18. **Medium. Symptom table "Recall tụt mạnh sau khi cắt chiều … quên chuẩn hóa lại [12]" (line 607), step 6, self-check Q4.** Source [12] says manual normalization is needed for one specific vendor model and that the newer model auto-normalizes. It does not say recall drops. Also, missing normalization changes nothing when the metric is cosine; it only matters for dot product or L2.
    Fix: "nếu dùng dot product hoặc L2 thì phải chuẩn hóa lại sau khi cắt; một số nhà cung cấp tự làm, một số không [12]".

19. **Medium. Table row "Fine-tune: Hợp miền dữ liệu của bạn hơn [13]" (line 567).** DPR [13] shows that a retriever can be trained from question-passage pairs. It does not show domain adaptation of an existing embedding model. The citation fits the mechanism (glossary `finetune`, step 9) but not the benefit.
    Fix: move [13] to the mechanism sentence only, or add a source that is about fine-tuning embeddings (the Sentence Transformers training overview) for the benefit claim.

20. **Medium-low. Truncation claims [10] (lines 582, 606, step 3, glossary `truncation`).** [10] describes one library (keeps the first `max_seq_length` tokens). The page states it as universal. Some embedding APIs reject over-length input with an error or have a truncate option. [12] re-fetched today says "The system silently truncates inputs that exceed this limit" for one model.
    Fix: "tùy thư viện hoặc nhà cung cấp: cắt lặng lẽ [10][12] hoặc báo lỗi; đọc tài liệu của model".

21. **Medium-low. "Thiếu hoặc sai thì chất lượng giảm mà không báo lỗi" [9][10] (glossary `prefix`, step 3, line 605).** Re-fetch of [10]: it says only "to achieve optimal performance"; it does not state a drop or the silence. The statement is true in practice but is an inference.
    Fix: soften to "có thể không đạt chất lượng tối ưu [10], và thường không có lỗi nào báo".

22. **Medium-low. Table row "Binary + rescoring … cần giữ bản chính xác hơn để chấm lại" (line 562).** In [6] the basic rescoring uses the float32 query against the binary documents; keeping an int8 copy is the optional stronger setup. "Cần" is stronger than the source.
    Fix: "chấm lại bằng câu hỏi float32; muốn tốt hơn thì giữ thêm bản int8 trên đĩa".

23. **Low-medium. Source [17] title (line 708).** The page fetched today is titled "Best Open-Source Embedding Models for RAG in 2026" (one fetch; not cross-checked). The page lists "Finding the Best Open-Source Embedding Model for RAG". Fix the title. It is also a vendor blog; the claim it supports is safe.

24. **Low. MTEB numbers (lines 647, glossary `mteb`).** "8 nhiệm vụ, 58 bộ dữ liệu, 112 ngôn ngữ" describes the 2022 paper. The benchmark has grown since, so present tense will read as stale. Fix: "bản gốc năm 2022 gồm…". Worth one clause for a Vietnamese audience: most of those datasets are English.

25. **Low. float16 row (line 547).** [5] lists `2 * d + 8` for the IVF scalar quantizer (8 byte is the id). "2·d byte" is right for the code itself. Fix: "2·d byte cho phần mã".

26. **Low. Section 4 note (line 399).** "Faiss ghi 4·d + x·M·2·4 byte": the wiki never defines x (confirmed today). Fix: add "(x là hệ số Faiss không giải thích)" or drop x. The "2·M liên kết ở tầng dưới cùng" statement has no citation; the HNSW paper [3] is the right one.

27. **Low. "điểm benchmark là trung bình nhiều nhiệm vụ [7][8]" (line 604) and glossary `lang-fit` [8].** BEIR is about domain generalisation in English, not language. Acceptable inference; keep [8] for "miền" and do not lean on it for "ngôn ngữ".

28. **Low. Uncited rules of thumb stated flatly.** "kho từ vài trăm nghìn vector trở lên" (line 563), "Vài chục đến vài trăm câu" (glossary `eval-set`). Add "kinh nghiệm chung, không phải ngưỡng cứng".

### D. Technical accuracy and consistency

29. **Medium. Stepper steps 4, 6, 7, 9: 1-point differences on a 100-question set.** With 100 questions one question is 1 point, and the sampling error near 85% is roughly ±7 points (95%). The story treats 86 → 85 → 84 → 83 as real, measured losses. A reader will learn to pick configurations on noise.
    Fix: one callout in step 4 or 6: "Với 100 câu, mỗi câu là 1 điểm; chênh 1-2 điểm chưa nói lên điều gì. So với ngưỡng mục tiêu, và tăng số câu khi hai phương án sát nhau."

30. **Medium-low. Step 4 vs step 6.** Quality is measured on a 100.000-passage subset, then the same 86% is shown next to "1 triệu vector". Recall on a subset is optimistic because there are fewer distractors.
    Fix: add "đo lại trên cả kho trước khi chốt" in step 6 or 9.

31. **Medium-low. Step 1 → step 9: the latency target is never closed.** Step 1 sets p95 ≤ 200 ms; step 8 shows only percentages; step 9 claims "Đạt cả ba mục tiêu".
    Fix: add one illustrative p95 figure in step 8 ("p95 đo được 140 ms, minh họa").

32. **Low. Step 7 note "recall@10 cuối không thể vượt 84%".** Strictly false: when ANN misses a true neighbour, the item at rank 11 enters the top 10 and may be the correct passage. Fix: "trên thực tế gần như không vượt".

33. **Low. Glossary `reembed`.** "Thời gian ≈ tổng số token ÷ throughput" while `throughput` is defined in passages per second. Fix one of the two units.

34. **Low. Calculator HNSW estimate.** 8·M byte per vector is the low end of hnswlib's "M × 8-10". Say "mức thấp của khoảng ước lượng".

35. **Low. Step 6.** 512 × float32 = 2,05 GB is just above the 2 GB target. Saying so in one clause explains why the team continues to int8.

### E. Missing or misleading concepts

36. **Medium. Reranking and hybrid search are missing as the cheaper levers before fine-tune.** Section 6 says the model sets the ceiling, and step 9 plus the "thứ tự an toàn" callout go straight to fine-tune. In practice a reranker or hybrid search is tried first, and both lift quality above the embedding-only ceiling. Sibling pages `../reranking/` and `../hybrid-search/` exist in the repo. The eval set in step 2 even contains an error-code query (ERR-4012) that the symptom table sends to hybrid search.
    Fix: one line in step 9 and in the callout at line 571, linking to those pages; point the "Mã lỗi, tên riêng" row at `../hybrid-search/`.

37. **Medium-low. Task type / input type parameter.** Many embedding APIs replace string prefixes with a parameter for query vs document. The notes already hold evidence from [12] ("Use RETRIEVAL_QUERY for queries; RETRIEVAL_DOCUMENT for documents"), but the page does not use it. Add one sentence to glossary `prefix` and step 3.

38. **Medium-low. Cutting dimensions or quantizing does not make embedding faster.** [2]: "training and inference of a Matryoshka model is not faster". Step 8 shows embedding as 70% of latency, so readers may expect step 6 to have helped. Add one sentence in the Matryoshka row or step 8.

39. **Low-medium. The map never shows "nén → chất lượng giảm".** Neither diagram links "Số chiều" / "Kiểu số" to "Chất lượng tìm", although this trade-off is the page's thesis. Add a dashed arrow or a note line in the `.vflow` box 2.

40. **Low. API vs self-hosted model.** It decides query latency (network), re-embed time (rate limits) and cost (per token). One glossary card would cover it.

41. **Low. Metadata filtering with ANN** (filtered search lowers recall or speed) is a common surprise; optional one-line mention in section 8.

### F. Vietnamese and pedagogy

42. **Medium-low. "model thường" (lines 560, glossary `matryoshka`, self-check Q4).** "thường" reads as the adverb "usually": "model thường mất nhiều hơn" is ambiguous. Fix: "model không huấn luyện kiểu Matryoshka" or "model thông thường".

43. **Low. "Hai nghĩa kéo nhau" (line 231, self-check Q1).** Unnatural. Use "giằng co nhau" or "đánh đổi với nhau".

44. **Low. Title "vừa túi" (line 216).** The idiom is "vừa túi tiền".

45. **Low. Line 233 "một ví dụ đời thường"** is followed by three examples. Write "ba hình ảnh đời thường".

46. **Low. Step 4 "Embed tạm 100.000 đoạn có chứa mọi đoạn đúng".** Clearer: "Tạm embed một tập con 100.000 đoạn, trong đó có đủ các đoạn đúng."

47. **Low. "miền" / "miền dữ liệu".** Gloss once at first use: "miền (domain, tức lĩnh vực)". "nút vặn" is understandable; "núm chỉnh" is more common. Mobile `.vflow` box 3 uses "×" and "·" as connectors; "·" means nothing, replace with a short phrase.

### G. Mobile 390px and contrast

48. **Low-medium. Text under 15px on mobile.** Body paragraphs are 15px, but content-bearing text is smaller: `pre` 14px (the MRR and memory formulas), `.vflow .node span` and `.vflow .note` 14px (the whole mobile diagram), `.calc-out .formula` 14px, `.steps button` 14px, `.calc-form .hint` 13px, `.tag` 12px, `table.stack td::before` 12px, `.stack-bar span` 12px. Raise `pre`, `.formula`, `.vflow` text to 15px in the mobile block; labels at 12-13px are acceptable.

49. **Low-medium. Light-mode contrast below 4.5:1 for small text (design-system colours, also in the RAG template).** `--accent` on `--accent-soft` 3,97 (`.tag.p1`, active TOC pill, `.linkbtn`, links inside blue callouts); `--ok` on `--ok-soft` 3,79 (`.tag.p3`, SVG "2 · ĐO"); `--warn` on `--warn-soft` 3,94 (`.tag.p4`, SVG "3 · TỐI ƯU", `.vflow .ph3`); `--accent` links on `--bg` 4,36. Dark mode passes everywhere checked (5,1 to 6,6). Fix at design-system level: darken the three light-mode colours slightly (for example accent `#245fc9`, ok `#17753f`, warn `#9a520a`).

50. **Low. Citation tap targets.** `sup.cite a` is about 37-40px high but about 20px wide, and adjacent citations touch. Acceptable as inline links; add `margin:0 2px` if desired.

No horizontal overflow was found at 390px from the CSS: grids collapse to one column, tables use `table.stack`, `pre` wraps, URLs break, SVGs are hidden.

## Suggested order of work

1. Fix findings 1, 2, 9, 10 (visible bugs).
2. Fix claim strength: 18, 19, 20, 21, 22, 23.
3. Add pedagogy: 29, 36, 31, 30, 37, 38.
4. Language: 42, 43, 44.
5. Remaining low items as time allows; 17 and 49 belong to the shared template.

## Assumptions

- The contrast and tap-size targets are WCAG AA (4.5:1) and the caller's 40px rule. Confidence high.
- "Body text ≥ 15px" applies to content-bearing text, not to tags and column labels. Confidence medium; if it applies to everything, finding 48 becomes medium.
- The shared `rag-theme` localStorage key is intentional (same site). Confidence high.
- The home index omission (finding 8) is because the page is not published yet. Confidence medium.

## Unresolved questions

- Source [17] title: confirm in a browser which title is current.
- Sources not re-fetched today ([1], [3], [7], [8], [9], [11], [13]-[16]) were checked against the notes only.
