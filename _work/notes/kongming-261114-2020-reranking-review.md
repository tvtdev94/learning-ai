# Review — Reranking learning page

- Reviewed file: `D:\WORKSPACES\learning-ai\reranking\index.html` (956 lines)
- Design reference: `D:\WORKSPACES\learning-ai\rag\index.html`
- Source notes: `D:\WORKSPACES\reseacher\plans\reports\research-261114-2022-reranking-sources.md`
- Date: 2026-11-14. Advisory only; the HTML was not edited.
- Runtime: Kongming ran on Fable 5.2 (`claude-fable-5-2`).

## Verdict

The page is technically sound and every hard-coded number is correct. Nothing is high severity. The work left is 9 medium items (two logic/accuracy points, three citation softenings, two pedagogy gaps, two mobile/consistency bugs) and a list of low items.

## How this was checked

| Check | Method | Status |
|---|---|---|
| Numbers (item 3) | Re-ran the page's own `metrics`/`rerank` logic in Node over all 3 scenarios x N in {3,5,10} x threshold on/off | Verified |
| Citations | WebFetch of sources 1, 8, 9, 10, 12, 13 today; others compared against the research notes only | 1, 8, 9, 10, 12, 13 verified; 2-7, 11, 14, 15 **not re-fetched** |
| Design consistency | `diff` of the two `<style>` blocks, grep of RAG anchors | Verified |
| Mobile 390px, a11y | Static CSS/HTML reading and arithmetic only | **Not rendered in a browser** — treat pixel figures as estimates |

## Number verification (item 3) — all correct

Stage-1 cosine order is descending in all three scenarios. Recomputed values (hit@3 / RR / nDCG@3):

| Scenario | Before | N=3 | N=5 | N=10 | IDCG@3 |
|---|---|---|---|---|---|
| 1 Phép khi mới vào | 0 / 0.25 / 0.00 | 0 / 0 / 0.00 | 1 / 1 / 0.5317 | 1 / 1 / 1.00 | 3.7619 |
| 2 "Điều 15" | 0 / 0 / 0.00 | 0 / 0 / 0.00 | 0 / 0 / 0.00 | 0 / 0 / 0.00 | 2.0 |
| 3 Làm từ xa | 1 / 1 / 0.9502 | 1 / 1 / 1.00 | 1 / 1 / 1.00 | 1 / 1 / 1.00 | 2.6309 |

Threshold >= 2.0 never changes a metric; it only shortens the list: scenario 1 keeps nothing at N=3, `c8` at N=5, `c8,c7,c21` at N=10; scenario 2 keeps nothing at every N; scenario 3 keeps `c20,c26` at every N.

Hard-coded values confirmed:
- Stepper step 5 (line 790): c8 4→1, c7 6→2, c22 2→6. Correct.
- Stepper step 6 (line 791): hit@3 0→1, RR 1/4→1, nDCG@3 0.00→1.00; scores 7.4 / 5.9 / 2.2 all pass 2.0. Correct.
- Section 9 (lines 613-618): IDCG ≈ 3.762, nDCG 1.00 at N=10, top-3 `c8,c23,c9` and 0.53 at N=5, 0 before. Correct.
- Section 9 table (lines 624-629): MRR 0.4167→0.6667 (shown 0.42→0.67), hit@3 1/3→2/3. Correct.
- Glossary: recall@5 = 1/2, "N = 3 bỏ sót cả c8 lẫn c7", N=20 → 190 pairs / 380 calls. Correct.

## Findings

### Medium

**M1. Diagram puts MMR after the top-k cut, which makes it a no-op.**
- Location: section 6, mobile flow lines 414-416 and desktop SVG lines 437-438 (`Sắp xếp + cắt (top-k, ngưỡng)` → `Đa dạng (MMR)` → `Prompt`).
- Evidence: MMR selects k items from a larger pool. After cutting to k, it can only reorder the same k items, which all enter the prompt anyway. Section 7 (line 548) describes it correctly ("chọn lần lượt từng đoạn từ một nhóm ứng viên").
- Fix: reorder to `Sắp xếp → ngưỡng cắt (tùy chọn) → chọn k đoạn: top-k, hoặc MMR / bỏ trùng`. Make "Đa dạng" an alternative way of choosing k, not a step after it.

**M2. MMR's "relevance" term is not said to be on a different scale from reranker scores.**
- Location: section 7, lines 546-551.
- Evidence: source 13 (fetched today) is a vector-store method: it fetches `fetch_k` (default 20) by embedding similarity and returns `k` (default 4), `lambda_mult` default 0.5. It runs at stage 1, not after a reranker. Placed after a cross-encoder, the formula mixes a raw score (e.g. −10..10) with a cosine (0..1), so λ stops meaning what the learner thinks.
- Fix: add one sentence: "Trong công cụ được dẫn, MMR chạy trên độ giống embedding ở giai đoạn 1. Nếu áp dụng sau rerank, phải đưa điểm reranker và độ giống giữa các đoạn về cùng thang trước khi trộn." Also mention `fetch_k` as the pool size, since the source supports it.

**M3. "N quá lớn làm reranker dễ nhầm" has no source, and the simulation is said to show it but does not.**
- Location: section 8 callout line 586; self-test Q5 line 663.
- Evidence: no `[N]` on either sentence. In the simulation a larger N is always better or equal (table above), so "Thử nghiệm N = 3, 5, 10 ... để thấy" only demonstrates the too-small side.
- Fix: (a) soften to "có thể làm tăng khả năng reranker xếp nhầm"; (b) change the last sentence to "Mô phỏng ở mục 4 cho thấy vế N quá nhỏ"; (c) optionally add a source. A real candidate exists: Jacob et al., "Drowning in Documents: Consequences of Scaling Reranker Inference", arXiv:2411.11767 (title and authors confirmed by fetch today; its abstract reports that gains taper and quality can degrade as more documents are scored). The author should fetch and quote it before citing.

**M4. Self-test Q5 states "khoảng 10 lần", which the research notes had decided to soften.**
- Location: line 663. Notes line 32: "Doubling N doubles rerank cost → rerank compute grows with N".
- Evidence: compute is linear in N for a cross-encoder, but latency is not (batching, hardware).
- Fix: "Khối lượng tính toán của phần rerank tăng khoảng 10 lần (với cross-encoder, mỗi ứng viên một lượt chấm); độ trễ thực tế còn tùy cách chấm theo lô và phần cứng."

**M5. "Score is only meaningful within one query" contradicts the global threshold used two steps later.**
- Location: step 4 callout line 789 ("**chỉ** có nghĩa khi so các đoạn của cùng câu hỏi") versus step 6 line 791 and the simulation threshold (one cut of 2.0 across three questions). Section 7 line 539 uses the softer "chủ yếu".
- Evidence: a threshold that makes "Điều 15" abstain assumes scores are at least partly comparable across queries. A learner will notice the contradiction.
- Fix: change "chỉ" to "chủ yếu" in step 4, and add to the threshold bullet at line 543: "Ngưỡng chỉ dùng được ở mức điểm của model so được giữa các câu hỏi; phải kiểm tra điều đó trên eval set."

**M6. Metrics are used in sections 3 and 4 before they are explained in section 9.**
- Location: step 6 table (line 791), simulation metrics card (lines 371-377).
- Evidence: hit@3, RR and nDCG@3 appear with no gloss and no forward link. The RAG page does not introduce nDCG or MRR either, so this is the first contact.
- Fix: add under both tables: "hit@3: có đoạn đúng trong top-3 không · RR: 1 / vị trí đoạn đúng đầu tiên · nDCG@3: chất lượng thứ tự, 0–1. Giải thích ở mục 9." with a link to `#danh-gia`.

**M7. Section 9 never states the two rules its own numbers depend on.**
- Location: lines 592-609.
- Evidence: (a) hit@k and MRR treat only label 2 as "đúng" (code line 764-765); section 9 says "đoạn đúng" without defining it for graded labels. (b) IDCG is computed from all labelled chunks including those stage 1 missed (`ideal`, comment at line 750); the 0.53 example only works under that rule. Computing IDCG from retrieved chunks only is the classic mistake and would give 1.00 at N=5.
- Fix: add two sentences: "Với nhãn 0/1/2, trang này coi mức 2 là 'đoạn đúng' khi tính hit@k và MRR." and "IDCG phải tính trên mọi đoạn có nhãn liên quan trong kho, kể cả đoạn giai đoạn 1 bỏ sót; nếu chỉ tính trên các đoạn đã lấy được, nDCG sẽ che mất lỗi của giai đoạn 1."

**M8. Clicking a citation lands the source under the sticky header.**
- Location: line 145, `ol.sources li{margin:8px 0;overflow-wrap:anywhere}`.
- Evidence: the RAG page has `scroll-margin-top:64px` on the same rule (RAG line 128). The reranking page dropped it, so `#src-N` scrolls to the very top, behind `header.top`.
- Fix: restore `scroll-margin-top:64px` on `ol.sources li`.

**M9. On a phone, pressing Rerank shows no visible change.**
- Location: section 4, lines 367-370 and handler line 811.
- Evidence (static): at ≤600px `.g2` collapses to one column, so "Sau rerank" sits below ten "Trước" rows, far below the button. Nothing scrolls, receives focus, or is announced.
- Fix: after the click, scroll `#simAfter`'s column into view when the layout is one column, and add `aria-live="polite"` to `#simAfter` and `#simMsg`. Respect `prefers-reduced-motion` when choosing smooth scrolling.

### Low — accuracy and citations

**L1. Pairwise sliding window: one pass is not enough for top-k.** Line 516 says "một lượt cửa sổ trượt cỡ N". Source 9 (fetched): "One pass only requires O(N)" and "K such passes will ensure a high-performing top-K ranking". Fix: "mỗi lượt cửa sổ trượt cỡ N; cần khoảng k lượt để có top-k".

**L2. Problem 1 cites the wrong source for its mechanism.** Line 219 attributes "cả đoạn bị nén thành một vector nên chi tiết dễ mất" to [2]. The notes' quotes for [2] cover independent encoding and lower accuracy, not compression loss. Source 1 (fetched) says "it might return irrelevant candidates". Fix: cite [1] for the observation and keep [2] on the "tính sẵn / đọc riêng" sentence; phrase the compression point as explanation, not as a sourced fact.

**L3. Azure's 50 is a product limit, not an example.** Line 244: "tài liệu tham khảo dùng ví dụ N = 100 hoặc 50 [1][10]". Source 10 (fetched): "only the top 50 results progress to semantic ranking". Fix: "một tài liệu lấy ví dụ N = 100 [1]; một dịch vụ giới hạn ở 50 kết quả đầu [10]".

**L4. "đừng đặt ngưỡng quá sát" mistranslates "too granular".** Line 542. Source 10: "don't make the limits too granular". "Quá sát" reads as "too close to a value"; the source means too fine-grained. Fix: "đừng đặt ngưỡng quá chi li (vd. phân biệt 2.35 với 2.40)".

**L5. Truncation is stated as universal.** Lines 479, 530, 578, glossary `max-length`. Sources 3 and 10 support truncation. The Cohere page as fetched today describes both behaviours depending on model version: truncation for some, automatic chunking with the best chunk's score for others (version details came through a summarising fetch; re-read the page before quoting). Fix: "thường bị cắt bỏ; một số dịch vụ tự chia nhỏ rồi lấy điểm của phần cao nhất. Đọc tài liệu của công cụ bạn dùng."

**L6. Score scale varies more than the page says.** Line 539 lists raw (−10..10) and sigmoid (0..1). Source 10 uses a 0–4 scale with a stated meaning per level. Fix: add "thang điểm khác nhau theo công cụ (có nơi 0–1, có nơi 0–4)", citing [10]. This strengthens the "calibrate per model" message.

**L7. Card title is stronger than the body.** Line 538 tag "Điểm không phải xác suất". A sigmoid output is a probability estimate, just not one calibrated for your data; self-test Q4 already says "không phải xác suất đã hiệu chỉnh". Fix: use that wording in the tag, in the step 4 callout and in the glossary term title.

**L8. "attention chéo" may be read as cross-attention.** Line 327. A cross-encoder uses ordinary self-attention over the concatenated input; source 1 says "attention across the query and the document". Fix: "attention giữa câu hỏi và đoạn".

**L9. "chỗ lưu tăng khoảng 10 lần" has no baseline.** Lines 337, 503. Source 7 compares with single-vector models. Fix: add "so với lưu một vector cho mỗi đoạn".

**L10. Unsourced generalisations.** "Prompt thường chỉ chứa 3–5 đoạn" (line 220) and the "Linh hoạt nhất" tag (line 338). Fix: "vd. 3–5 đoạn (minh họa)" and "Linh hoạt".

**L11. "RankGPT" is real but not in the notes.** Glossary `sliding-window`, line 897. Fetch of source 8 shows the name only in the code link and prompt appendix. Either add that evidence line to the research notes or write "cách trong nghiên cứu của Sun et al.".

**L12. "quét được kho hàng triệu đoạn".** Line 502. Source 1 says the retriever "has to be efficient for large document collections with millions of entries". "Quét" suggests a brute-force scan. Fix: "tìm được trong kho hàng triệu đoạn (nhờ index)".

### Low — missing concepts (item 4)

**C1. Which query the reranker reads.** The page says "câu hỏi gốc". In multi-turn chat or after query rewriting, the reranker should read the standalone rewritten question, not the raw last turn. One sentence in section 6.

**C2. What the reranker does not judge.** Relevance only: not freshness, authority, validity, or access rights. Those belong to metadata filters before rerank. Fits the "Điểm" card or section 6.

**C3. RRF is not a reranker.** Both reorder a list; RRF never reads the text. One clause in the `rrf` glossary entry: "không đọc nội dung đoạn".

**C4. hit@k says nothing about completeness.** The page's own example proves it: at N=5, hit@3 = 1 although c7 is absent and the answer would be wrong. Add this to self-test Q8 or the section 9 example; it is the strongest argument for nDCG the page has.

**C5. Reranking can lower total cost.** A better top-k allows a smaller k, so fewer tokens go to the LLM. One bullet under "Đánh đổi xuyên suốt".

**C6. Cascades.** A small reranker over a large N, then a stronger one over the survivors. One sentence in section 7 as an idea; no source needed if phrased as a design option, otherwise find one.

**C7. Tuning and measuring on the same eval set.** If the threshold is chosen on the eval set, report results on held-out questions. One sentence in section 9.

**C8. Order of chunks inside the prompt after rerank.** Often discussed; uncited here. Only add it with a source.

**C9. Hub page.** `rg -i reranking D:\WORKSPACES\learning-ai\index.html` returns no match, so the topic index does not link to this page. Outside the reviewed file, but the page's "← Chủ đề" link leads to a hub that does not list it.

### Low — pedagogy and Vietnamese (item 5)

**P1. "precision" appears before it is defined.** Lines 260, 275, 340; defined only in the glossary (section 5). The RAG page does not use the term. Fix: gloss at first use, "precision (những gì đứng đầu phải đúng)".

**P2. Wording.** Suggested replacements: "chỗ lưu" → "dung lượng lưu trữ" (lines 337, 503, 665, glossary); "Giảm gánh cho LLM" → "Giảm tải cho LLM" (line 516); "ép về 0–1" → "đưa về khoảng 0–1" (line 539); "cỡ model" → "kích thước model" (consistently); "chậm-mà-kỹ" → "chậm mà kỹ" (line 223).

**P3. Roadmap task has an answer the UI cannot reach.** Line 644 asks for the smallest N giving nDCG@3 = 1. The true minimum is 7 (c21 is candidate #7); the chips offer 3, 5, 10. Fix: "trong ba giá trị N của mô phỏng", or add a follow-up: "vì sao N = 7 cũng đủ?".

**P4. Term consistency.** "ngưỡng cắt" and "ngưỡng" alternate; "đoạn", "chunk" and "ứng viên" alternate without a stated rule. Add one line in section 1: "đoạn = chunk; ứng viên = đoạn được giai đoạn 1 chọn". "pha" (indexing) versus "giai đoạn" (stages) is used consistently and is a good choice.

**P5. No typos found.** Diacritics are complete throughout.

**P6. Section numbering differs from RAG.** RAG leaves "Nguồn" unnumbered in both TOC and heading; this page numbers it 11. The brief refers to "section 11", so keep it if intended.

### Low — JS, HTML, accessibility, mobile (item 6)

**J1. `color-scheme` was dropped.** RAG sets `color-scheme:light` / `dark` in all three token blocks; this page omits it (lines 14, 21, 28). Native controls (the six checkboxes, the search input, scrollbars) stay light in dark mode. Fix: restore the three declarations.

**J2. Citation style drifted from RAG.** RAG: `sup.cite{font-size:max(11px,.72em)}` and `sup.cite a{font-weight:600}` plus hover underline. Here: fixed `11px` and `padding:12px 2px` (lines 142-143). Estimated tap box is about 18 x 37px, and adjacent links such as `[1][10]` touch with no gap. Fix: take RAG's rules, keep the vertical padding, add `padding-inline:4px` and `margin-left:2px` between adjacent links.

**J3. Two cut lines stack at N = 3.** Lines 826-828: at `i===3` both the "top-3 nếu không rerank" line and the "top-3 = N = 3" line render. Fix: guard the first with `N!==K`.

**J4. No N marker at N = 10.** The `i===N` branch never fires for 10 rows. Fix: append the N line after the loop when `N>=all.length`.

**J5. "Đặt lại" does not reset.** Line 812 clears only `done`; N and the threshold checkbox stay. Changing the question clears the result but changing N does not. Fix: reset `N=10` and uncheck the threshold, or rename the button "Xóa kết quả".

**J6. Fragile regex.** Line 919 holds literal combining characters U+0300–U+036F (confirmed by byte dump). RAG uses `/[\u0300-\u036f]/g` (RAG line 811). Fix: use the escape form.

**J7. Undefined class.** `class="note muted"` with inline styles at lines 254, 260. RAG defines `.vflow .note{font-size:13px;color:var(--muted);margin-top:6px}`. Fix: copy the rule, drop the inline styles.

**J8. Missing RAG mobile rules.** RAG has `pre,.term .ex{font-size:15px}` and `.vflow .node span{font-size:14px}` at ≤600px. Here `pre` stays 14px and node captions 13px. Fix: copy both.

**J9. Step 6 metric table is hard-coded.** Correct today, but it will drift if `SC` changes. Fix: build it from `metrics(S1all, S1.ideal)` and `metrics(S1after, S1.ideal)`.

**A1. State is conveyed by colour only.** Stepper, question and N buttons toggle `.on` with no `aria-pressed` / `aria-current`. Same in RAG. Fix in both pages together.

**A2. Search input has no accessible name.** Line 386, placeholder only. Same in RAG. Fix: `aria-label="Tìm khái niệm"`.

**A3. `aria-label` on a role-less `div`.** Lines 246, 396. Same in RAG. Fix: add `role="group"`.

**A4. Contrast on soft backgrounds.** Computed: `--ok` on `--ok-soft` ≈ 3.8:1, `--warn` on `--warn-soft` ≈ 4.0:1, used for 11px `.gl` badges and 12px `.tag`. Below 4.5:1. Shared tokens; the labels also carry digits, so meaning is not lost. `.rk.out{opacity:.45}` lowers row text further.

**A5. Motion.** `html{scroll-behavior:smooth}` and the glossary `scrollIntoView({behavior:'smooth'})` ignore `prefers-reduced-motion`; the `.rk.new` animation respects it. Same in RAG.

**A6. Heading order.** Section 1 goes h1 → h3; section 6 cards go h2 → h4.

**Mb1. Text size at 390px.** Nothing is below 11px. At the limit: `.gl` and `sup.cite` at 11px. At 12px: `.tag`, `.dl`, `.cutline`, `.chunk .id`, `.rk .txt b`.

**Mb2. Tap targets under 40px (estimates).** `sup.cite a` (J2); single-line `details summary` ≈ 37px; glossary related links ≈ 39.5px. Buttons, chips and checklist rows meet 40px.

**Mb3. Overflow.** No horizontal overflow found by reading the CSS: `.rk .txt{min-width:0}`, grids collapse at 280px/230px minimums (fits 358px content width), `pre` wraps, tables stack, `.formula` wraps. The step row scrolls horizontally with no visual hint.

**Mb4. Anchor offset.** `scroll-margin-top:56px` versus a mobile header of about 61px (40px min-height + 20px padding + border). Headings sit about 5px under the header. Same in RAG.

**Mb5. Tablet widths.** Between 601px and about 900px the desktop SVGs are shown and scaled down; their 11px labels render at roughly 7–10px. Outside the 390px scope. Fix if wanted: raise the `.d-only` / `.m-only` switch to about 820px.

## Recommended order of work

1. M8, J1, J2, J6, J7, J8 — restore the lines that drifted from RAG (minutes, zero risk).
2. M1, M2 — fix the MMR position and add the scale note.
3. M3, M4, M5, L1, L2, L3, L4, L5 — soften or re-cite.
4. M6, M7, C4 — metric glosses and the two evaluation rules.
5. M9, J3, J4, J5 — simulation behaviour.
6. Remaining low items as time allows; fix A1–A5 and Mb4 in both pages at once to keep them consistent.

## Assumptions

- "Label 2 = correct" for hit@3 and RR, as in the brief and the code. Confidence high.
- Sources 2-7, 11, 14, 15 match the research notes' quotes; not re-fetched today. Confidence medium-high (stable arXiv, Wikipedia and sbert pages).
- Mobile findings come from CSS arithmetic, not a rendered page. Confidence medium; M9 and J2 should be confirmed on a device.
- Cohere per-version truncation/chunking details came through a summarising fetch. Confidence medium; re-read before quoting.

## Unresolved questions

- Should section 11 stay numbered, unlike RAG's unnumbered "Nguồn"?
- Should the accessibility items shared with RAG (A1–A5, Mb4) be fixed in both pages now or left consistent as they are?
- Is adding a 16th source (arXiv:2411.11767) acceptable, or should M3 be handled by softening alone?
