# Review: Hybrid Search learning page

Target: `D:\WORKSPACES\learning-ai\hybrid-search\index.html` (template: `D:\WORKSPACES\learning-ai\rag\index.html`).
Reviewer: kongming, 2026-11-14. Advisory only; the page was not edited.

## TL;DR

The numbers, formulas and source citations are correct. No critical defects. The weak spot is the simulator as a teaching tool: the k slider never changes any ranking, hybrid scores MRR 1.000 in almost every setting, one explanatory note gives the wrong cause, and α = 0 does not behave as "BM25 only". Fix findings 1-5 before publishing; the rest is polish.

## How this was checked

- Numbers: extracted the page's own engine code (`CORPUS` .. `firstRel`) and ran it in Node for all 4 queries x fold on/off x stopwords on/off x k = 1..100 x α = 0..1.
- Sources: fetched Qdrant [16], Elasticsearch RRF [14], OpenSearch [17], Lucene [3], Weaviate [15]; downloaded and `pdftotext`-ed Cormack [1] and Robertson & Zaragoza [2]. Sources 4-13 and 18-21 were not re-fetched; they were compared only against the research notes.
- Layout: static reading of CSS/HTML only. Nothing was rendered in a browser, so every 390 px statement below is derived from the CSS, not observed.
- The file changed twice during the review (mobile tap-target CSS, lines 173-177). Findings refer to the state at 20:41:36; the numeric results were re-run on that state.

## Findings

### Major

**1. The k slider is inert — major — `#mo-phong`, `#optK` (line 495), glossary `rrf-k` (line 993)**
Problem: no value of k from 1 to 100 changes the order of any hybrid list, for any query and any fold/stopword combination. Only the displayed scores change. The glossary says "Thử kéo thanh k trong mô phỏng" and section 5 says small k favours rank 1 strongly, so the learner drags the slider and sees nothing happen.
Evidence: Node sweep printed `k values changing order: NONE` for all 16 query/option combinations. Cause is structural: with two top-5 lists and ranks from 1, a both-lists document at ranks (4,5) only loses to a single-list rank 1 when k <= 2 (solve 1/(k+4) + 1/(k+5) = 1/(k+1), k = 2.46), and the sample data has no such pair.
Fix: cheapest honest fix is one sentence under the slider: in this sample, changing k does not reorder anything; with two short lists k only matters when it is very small, which matches the original paper's remark that the choice is not critical. Better: add a query where the correct chunk is rank 1 in one list only and a wrong chunk sits at ranks (4,5), so k = 1-2 and k = 60 give different winners. That also shows why Qdrant's default (equivalent to k = 1 here) behaves differently from Elasticsearch's 60.

**2. The simulator never shows hybrid losing — major — `#mo-phong`, MRR block (lines 501-503), checklist `w1d` (line 741)**
Problem: hybrid MRR is 1.000 for every k, both stopword settings, both fold settings, and α from 0 to 0.8. It only drops at α = 0.9 (0.875) and α = 1.0 (0.667). The page says three times that hybrid does not always help, but the interactive part demonstrates the opposite. The one real failure in the data (query 2, RRF puts d2 above the relevant d7) is invisible to MRR because d6 is rank 1.
Evidence: Node sweep, `MRR by k` and `MRR by a` rows. Query 2 RRF order: d6, d2, d7.
Fix: (a) add a fifth query where BM25 noise beats a correct vector-only hit. Tested candidate: "ứng dụng có được thay pass thường xuyên không", relevant d5, illustrative cosine d5 .78, d4 .74, d2 .52, d8 .50, d1 .45. Result with the page's engine: BM25 = d2, d7, d6 (d5 absent); RRF k = 60 = d2, d5, ... so hybrid reciprocal rank is 0.5 against 1.0 for vector alone; stopword removal does not rescue it; weighted α = 0.7 does. (b) Show recall@2 or recall@3 next to MRR so the query 2 failure registers.

**3. Query 4 note gives the wrong cause — major — `QUERIES[3].note` (line 869)**
Problem: the note says d5 scores "vì 'bảo mật' bỏ dấu thành 'bao mat'". d5 scores because it literally contains "mật khẩu" ("Nên đổi mật khẩu định kỳ"). "bảo mật" only adds a second occurrence of "mật", and that is a syllable collision that exists with diacritics too, not a folding collision.
Evidence: d5 hits are `[mat, khau]`; token counts `mật -> d4x3, d5x2`, `khẩu -> d4x3, d5x1`. The corpus contains no real folding collision (no "mặt", "mắt", "khâu").
Fix: reword to say d5 also contains "mật khẩu", and "mật" in "bảo mật" adds one more match because tokens are syllables. To actually demonstrate the folding risk described in section 2, add a chunk containing "mặt" or "mắt" (for example a Face ID / "nhận diện khuôn mặt" chunk), which then appears for "quen mat khau" only when folding is on.

**4. α = 0 is not "BM25 only" in the simulator — major — `fuse()` (lines 874-886), section 5 line 467**
Problem: in weighted mode every document from either list is kept, including those with score 0, and ties are broken by best rank and then vector rank. At α = 0 the vector branch therefore still decides the order of everything BM25 did not score. For "quen mat khau" with folding off, BM25 is empty yet hybrid at α = 0 shows d4 at rank 1.
Evidence: at α = 0 the sweep gives BM25 MRR 0.750 but hybrid MRR 1.000. For query 1 at α = 0, d6 (found by BM25, min-max 0) is listed below d3, which BM25 never returned.
Fix: in weighted mode, drop or grey out entries whose fused score is 0 and exclude them from MRR; or keep them and add a visible note that score-0 rows are ordered by the tie-break rule. The first option makes α = 0 and α = 1 match the text.

**5. Stacked-table labels corrupt the IDF formula on phones — major (mobile only) — step 3 table (line 905), CSS line 182**
Problem: `text-transform:uppercase` on `td[data-label]::before` turns the header "IDF = ln(1 + (N − n + 0.5)/(n + 0.5))" into "IDF = LN(1 + (N − N + 0.5)/(N + 0.5))", and "n (số đoạn chứa)" into "N (SỐ ĐOẠN CHỨA)", directly above the sentence "Kho có N = 8 đoạn".
Evidence: CSS rule plus the `labelTables` function copying `th.textContent` into `data-label`. Derived, not rendered.
Fix: shorten the two headers to "Số đoạn chứa" and "IDF" and keep the formula in the paragraph above, or add a modifier class that sets `text-transform:none` for that table.

### Minor

**6. Citations land under the sticky header — minor — `ol.sources li` (line 138)**
The template has `scroll-margin-top:64px` on source items; this page dropped it, so `#src-N` targets sit behind the roughly 60 px sticky header. Restore the template rule (and `overflow-wrap:anywhere`).

**7. `color-scheme` missing from the tokens — minor — lines 9-29**
The template sets `color-scheme:light` / `dark` in all three token blocks; this page does not. Native controls (two checkboxes, two range inputs, the search clear button, scrollbars) stay light in dark mode. This page has more native controls than the template, so it matters more here. Add the property to the three blocks.

**8. Source [16] does not say what the sentence says — minor — section 5 callout (line 475)**
"có eval set thì thử cả hai và đo [16]". Qdrant's table recommends "Weighted RRF, with weights tuned on a train/val split" when an eval set exists, DBSF when you trust raw scores, and plain RRF otherwise. Fix: cite [16] only for the RRF-as-safe-default half, and mention weighted RRF as a third option (rank-based, per-branch weights, no score normalization). That is also a concept worth having on the page.

**9. "BM25 has a ceiling" versus "BM25 has no ceiling" — minor — section 2 TF card (line 271) versus self-test 3 (line 755)**
Both are true at different levels (per-token saturation; no fixed scale for the total), but the learner reads a contradiction. Reword self-test 3 to: BM25 has no fixed scale, the total depends on how many tokens match and how rare they are.

**10. Symbol k is used for four things — minor — sections 5, 8, 11**
k1 (BM25), k (RRF constant), top-k (final cut), recall@k. The eval node in the relationship map lists "recall@k ... → chọn α, k, N" two lines after "top-k". Add one sentence naming the collision, and write "k của RRF" wherever tuning knobs are listed.

**11. The illustrative vector ranking for query 1 is harder on dense retrieval than reality — minor — `QUERIES[0].dense`, step 5, self-test 1**
d1 contains the literal string "Lỗi E-4012", yet the illustrative scores put d2 (no code at all) above it. My judgement, not sourced: a current embedding model would very likely rank d1 first in an 8-chunk corpus; the confusion in [8] shows up in large corpora with many near-identical codes. Fix: keep d3 first if desired but put d1 second, and add a line that the effect is exaggerated for a small corpus. Also note that [8] and [9] are 2021 results and newer models have narrowed the gap, which reinforces "measure on your own data".

**12. Folding option does not implement "exact match is preferred" — minor — `bm25()` (lines 854-858), section 2 diacritics card**
The page says to keep the accented field so exact matches win. The simulator takes the per-document maximum of the two field scores, which gives an exact accented match no advantage beyond a small IDF difference. Evidence: "mật khẩu" with folding on and off returns identical scores (d4 3.975, d5 3.090). Not visible today because the corpus has no collision; it becomes visible if finding 3's extra chunk is added. Fix: sum the two fields, or add a small boost for the accented field, and say which in the text.

**13. Missing concepts worth one or two sentences each — minor**
- BM25 is a bag of words: it ignores order and adjacency. This is the reason the syllable problem bites, and the reason "cặp âm tiết liền nhau" helps; the page never states it.
- Vietnamese tone-mark placement: "hoà" / "hòa", "thuỷ" / "thủy" are different code point sequences that NFC does not unify. The NFC card implies normalization settles "same look, different code". Folding happens to fix it; say so.
- Filter timing for the vector branch: filtering after ANN can return fewer than N results or none; filtering before or during search avoids that. Needs a source if added (Qdrant or Weaviate filtering docs); not verified here.
- Min-max depends on N: the minimum is the N-th score, so changing depth changes every normalized score. One sentence in section 5.
- Qdrant equivalence: k = 2 with ranks from 0 equals k = 1 in this page's 1-based formula. Otherwise a learner sets the slider to 2 to imitate Qdrant.

**14. Section 2 is too long for a phone — minor — `#hai-kieu`**
It holds two concept cards, three BM25 cards, two formula notes, a nine-row table, three Vietnamese cards, a callout and learned sparse, all before the flow diagram. Suggested split: move "Tiền xử lý tiếng Việt" into its own numbered section after the flow, and put learned sparse in a `<details>` or in section 9. The SPLADE paragraph (line 308, about 110 words) should be two paragraphs.

**15. Accessibility gaps — minor**
- `#glossSearch` has a placeholder but no label or `aria-label` (template has the same gap).
- Toggle state of chips, stepper buttons and query buttons is colour-only; add `aria-pressed` (or `aria-current="step"` for the stepper).
- `#stepBody`, `#simCols`, `#simMrr` update without `aria-live="polite"`.
- Disabled Prev/Next buttons keep `color:var(--text)`, so they do not look disabled; add `.step-nav button:disabled{opacity:.5;cursor:default}`.
- `aria-label` on `div.vflow` has no role; add `role="group"`.

**16. Tablet widths render SVG text too small — minor — `.svgbox svg{min-width:640px}`**
Between 601 px and roughly 950 px the desktop SVG is shown scaled to 0.64-0.9, so its 11 px and 12 px labels render at about 7-10 px. Inherited from the template. Fix: switch to the `.m-only` diagrams below about 900 px, or raise the SVG `min-width` to 900 px so it scrolls instead of shrinking.

### Nits

17. `sup.cite` differs from the template: fixed `11px` instead of `max(11px,.72em)`, no `white-space:nowrap`, no `a+a{margin-left:2px}`, no hover underline. Adjacent markers like [3][4] touch, and each is about 23 px wide, under the 40 px tap target.
18. Header icon buttons are about 36 px wide on phones (`min-height:40px` only). Add `min-width:40px`. Same in the template.
19. New mobile rule `main p a,main li a,.callout a{padding:10px 0}` enlarges inline link hit boxes to about 45 px on a 25 px line, so links on adjacent lines overlap. Acceptable, but check paragraphs with two links close together.
20. `fold()` and `foldQ()` use literal combining characters in the regex class (bytes `cc80`-`cdaf`). It works (verified), but is fragile under editors and formatters. Use `/[\u0300-\u036f]/g`.
21. `labelTables(root)` shadows the outer `root` variable. Rename the parameter.
22. Lucene 8 and later dropped the `(k1 + 1)` numerator factor, so absolute scores from Elasticsearch are about 2.2 times smaller than the page's; ranking is identical. From memory, not verified (the fetched Lucene page does not mention it). One clause in the footer is enough.
23. Stopword list is accented only, so an unaccented query keeps "khong", "duoc" while the folded documents have them removed. Harmless here.
24. Template consistency: sources use `.muted` with "· truy cập" where the template uses `.acc` with "(truy cập ...)"; TOC and heading number the sources section ("13. Nguồn") where the template leaves it unnumbered; line 260 uses an inline style where `tag p2` exists; `.score-sum` and `.sim-q` duplicate the template's `.kpi` and `.qbtns`; template's phone rules `pre,.term .ex{font-size:15px}` and `.vflow .node span{font-size:14px}` are absent.
25. Wording: "ưu tiên đoạn có hạng tốt nhất cao hơn" (step 6) is hard to parse; suggest "ưu tiên đoạn có thứ hạng riêng tốt hơn; nếu vẫn bằng thì ưu tiên nhánh vector". Say once that "đoạn" and "chunk" mean the same thing. "Cộng thẳng thì ... nhánh vector chỉ còn tác dụng phá hòa" is slightly strong; "gần như chỉ còn" is safer.
26. Section 9 "Thường bền hơn trên tập câu hỏi đa dạng" has no citation; [5] supports it.

## Verified correct

- avgdl = 18.875; chunk lengths 22, 19, 16, 20, 18, 21, 18, 17.
- Query "lỗi E-4012": IDF lỗi 1.281 (n = 2), e-4012 1.792 (n = 1); d1 = 1.200 + 1.678 = 2.878; d6 = 1.225.
- RRF k = 60: d1 0.0323, d3 0.0164, d2 = d6 0.0161 (d2 first by the stated tie-break), d4 0.0156, d5 0.0154.
- Weighted α = 0.5: d1 .946, d3 .500, d2 .464, d4 .125, d6 0, d5 0.
- Default MRR: BM25 0.750, vector 0.667, hybrid 1.000. With folding on, BM25 becomes 1.000.
- Hand calculations: 1/61 ≈ 0.0164; 2/63 ≈ 0.0317; 1/61 + 1/63 ≈ 0.0323.
- Stepper text matches the engine: d1 has 22 tokens, d6 is one token shorter, list A has two entries, the inverted-index sample ("mật" → d4, d5; "e-4012" → d1), glossary facts ("mật" three times in d4, DF of "lỗi" = 2, cosine range 0.28-0.84).
- Query 2 note: RRF puts d2 above d7; stopword removal or weighted mode fixes it.
- Tokenizer keeps "e-4012" whole; NFC and lowercase applied; `đ → d` handled; tie-break code matches its description.
- BM25 description (TF saturation, IDF form, length normalization, k1, b, default 1.2 / 0.75, ranges 0.5-0.8 and 1.2-2) matches [2] and [3] (quotes found in the PDFs and the Lucene page).
- RRF formula and k = 60 provenance match [1] (both quotes found in the PDF). Elasticsearch default 60, ranks from 1, "requires no tuning" match [14]. Qdrant default 2, ranks from 0, DBSF match [16]. Weaviate α convention matches [15]. OpenSearch scale sentence, `min_max` / `l2` / `z_score`, and the 0.001 replacement match [17].
- SPLADE, dense versus sparse, hybrid versus reranker, recall@k / MRR / nDCG descriptions are accurate at this level.
- All `localStorage` access is inside try/catch; theme key is `rag-theme`; checklist prefix is `hs-`; the root index links to `hybrid-search/`; internal anchors (`../rag/#embedding`, `#flow`, `#vi-du`, `#loi`, `../reranking/`) exist.
- CSS tokens, dark-mode guards, header, TOC, `.m-only` / `.d-only` switch and `table.stack` rules match the template apart from the items above. All tables carry `class="stack"`. No source of horizontal overflow at 390 px was found by reading the CSS.

## Assumptions

- The page should teach by its interactive parts, not only by its prose (high confidence). If the simulator is meant only as a calculator, findings 1 and 2 drop to minor.
- Finding 11 and nit 22 rest on my own knowledge, not on a fetched source (medium confidence).
- Mobile findings are derived from CSS, not rendered (medium confidence for exact pixel sizes, high for finding 5).

## Unresolved questions

- Is adding a fifth query and a ninth chunk acceptable, given the page states "8 đoạn" and "4 câu hỏi" in several places that would need updating?
- Should the tablet breakpoint fix (finding 16) be applied to the RAG template too, since it has the same behaviour?

Status: DONE_WITH_CONCERNS
Summary: All numbers and checked citations are correct and there are no critical defects, but the simulator undercuts the lesson in four ways (inert k slider, hybrid never loses, one wrong explanatory note, α = 0 not BM25-only) and one mobile label corrupts the IDF formula. Layout findings come from reading the CSS, not from a rendered page.
