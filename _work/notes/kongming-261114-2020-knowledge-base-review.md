# Review: Knowledge Base learning page

- Page reviewed: `D:\WORKSPACES\learning-ai\knowledge-base\index.html` (964 lines, read in full)
- Research notes: `D:\WORKSPACES\reseacher\plans\reports\research-261114-2022-knowledge-base-sources.md`
- Date: 2026-11-14. Advisory only; the page was not edited.
- Model: Fable 5.2 (`claude-fable-5-2`).

## Verdict

The page is solid and publishable after a small number of fixes. No fabricated source was found: all 21 sources are cited in the body and every source I re-fetched says roughly what the page attributes to it. The real problems are (a) one substantive technical gap about detecting deletions, (b) six to eight places where a citation is attached to a sentence that goes further than the source, (c) one misleading dedup example, (d) a handful of mobile and accessibility defects, and (e) one Vietnamese label that reads as "sterilize".

## How this was checked

| Check | Method | Result |
|---|---|---|
| Page content | Read all 964 lines | done |
| Script syntax | extracted the `<script>` block, `node --check` | `SYNTAX_OK` |
| Glossary integrity | node script over array `T` | 55 terms, 55 unique ids, 0 dangling related ids, group counts base 6 / src 5 / ing 11 / idx 9 / ops 10 / struct 9 / qual 5 |
| Stepper | counted `{t:'` entries in `STEPS` | 8 |
| Citations used | regex over `#src-N` and `cite(...)` | 1 to 21 all cited at least once |
| In-page anchors | every `href="#x"` matched against `id="x"` | none missing |
| Sibling anchors | grep in `rag/index.html` | `#flow`, `#loi`, `#danh-gia`, `#embedding`, `#vi-du` each exist once; `hit@k` appears 5 times |
| Sibling pages | `ls` | `governance/index.html` and `hybrid-search/index.html` both exist now |
| Theme key | grep | both pages use `rag-theme`; RAG checklist uses prefix `rag-`, this page `kb-`, no collision |
| File normalization | `html === html.normalize('NFC')` | true |
| Sources re-fetched (WebFetch) | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20 | see section B |
| Sources NOT re-fetched | 1 (Lewis 2020), 13 (Spider), 21 (GDPR Art. 17) | relied on the quotes in the research notes; not verified this session |
| Rendering at 390px | NOT verified in a browser | all layout findings come from reading the CSS and arithmetic; treat pixel numbers as estimates |
| Colour contrast | hand-computed estimates | not measured with a tool |

Severity: high = teaches something wrong or breaks use; medium = misleading, or a real usability defect; low = polish.

---

## A. Technical accuracy

### A1. Deleted documents cannot be detected the way the page says (high)
- Location: section 4 card "Đồng bộ tăng dần" (line 385); mobile flow node "Phát hiện thay đổi" (line 268); glossary `incremental`, `change-detect`; quiz 3 (line 748).
- Evidence: the page lists three detectors (modified date, content hash, source events) and says incremental sync handles "mới, đổi hoặc bị xóa". A deleted document has no modified date and no content to hash, so two of the three detectors never see it. The cited source [8] says the same thing in its own terms: `incremental` cleanup "Cleans up all documents that haven't been updated AND that are associated with source IDs that were seen during indexing", meaning a source that vanished is not cleaned. Only `full` does it: "Delete all documents that have not been returned by the loader during this run of indexing."
- Why it matters: this is the most common cause of "AI still answers from a deleted document", which the page itself lists as a symptom in section 10.
- Fix: add one sentence. Deletion is found only by (1) a delete event or tombstone from the source, or (2) periodically listing every ID at the source and comparing with the IDs in the store (a reconciliation pass). Add "đối chiếu định kỳ danh sách ID" to the ops loop and to the glossary entry `change-detect`.

### A2. The exact-duplicate example cannot happen as described (medium)
- Location: stepper step 3, first `.chunk` (line 830).
- Evidence: the page says the FAQ entry "Đổi trả bao lâu?" has "cùng hash" as the wiki content because both contain the sentence "Khách được đổi trả trong 30 ngày…". A hash is computed over a whole chunk. Chunk c1 contains the heading path plus the sentence plus the table; a FAQ item contains a question plus an answer. Their hashes will differ. A shared sentence inside different chunks is a near-duplicate, not an exact one.
- Fix: make the exact-duplicate case a true copy (the same page exported as PDF into a shared drive, or mirrored in another wiki space). Move the FAQ case to "gần trùng" and say in one clause how near-duplicates are found: a similarity score above a threshold, as opposed to an equal hash.

### A3. "Người dùng mất quyền xem" is merged with "tài liệu bị xóa" (medium)
- Location: section 4 card "Xóa & thu hồi" (line 391); glossary `deletion`.
- Evidence: the sentence says that when a document is deleted or a user loses access, the document "phải biến khỏi mọi nơi: vector index, keyword index, cache". A revoked permission does not remove the document from any index. It changes the ACL metadata, and what must be purged is any cached answer or result produced for that user.
- Fix: split in two. Deleted at source: remove from every index and every derived artifact. Permission revoked: update ACL metadata everywhere, and invalidate caches, which must be keyed by user or permission set so one person's cached answer is never served to another.
- Also missing from "mọi nơi": derived artifacts (summaries, knowledge graph, GraphRAG community summaries), the stored parsed copy, backups, and question/answer logs. One sentence is enough.

### A4. Full re-index "bắt buộc" on any metadata schema change is too strong (medium)
- Location: section 4 card "Index lại toàn bộ" (line 407); section 9 table (line 658); glossary `full-reindex`; quiz 4 (line 750).
- Evidence: adding or correcting a metadata field normally needs a backfill of that field. It does not require re-parsing, re-chunking or re-embedding. Whether the index must be rebuilt depends on the engine. Unverified belief, not checked against a specific engine: some engines need a rebuild to make a new field filterable, many do not.
- Fix: three levels. Change embedding model: re-embed everything. Change parser, cleaning rules, chunking, or the heading prefix on chunks: re-run from that stage. Change metadata schema: backfill, and rebuild only if the engine requires it.
- Missing triggers worth one line: a change of parser/OCR or cleaning rules, a change to the context header format (it changes every chunk's text and so every hash and vector), a change of keyword analyzer, and a provider silently updating an embedding model under the same name (the reason the `embedding model` field in step 5 exists).

### A5. Text-to-SQL bypasses the per-user permission model the page just taught (medium)
- Location: section 5, text-to-SQL flow and risk callout (lines 422 to 437).
- Evidence: sections 1 and 4 insist that every retrieval is filtered by the asker's permissions. The SQL flow uses a single read-only account with allowed tables and a row limit. Nothing stops user A from asking about user B's orders. The page lists "sai nghĩa" as the main risk and omits this one.
- Fix: add to the risk callout: permissions per asker also apply here (row-level security or mandatory filters added by the application, not by the LLM); a time and cost limit on queries; the question itself can carry injected instructions.
- Minor: the node "Kiểm tra trước khi chạy" lists a read-only account and allowed tables. Those are standing permissions, not a check. Rename to "Giới hạn và kiểm tra" or list an actual check (only SELECT, only allowed tables).

### A6. The GraphRAG global-question example is a counting question (medium)
- Location: section 5, third bullet (line 485).
- Evidence: "khách hay phàn nàn về chủ đề gì nhất?" asks for a ranking by frequency. Earlier in the same section the page teaches that counting needs SQL. The paper [16] is about thematic summarization; its own example is "What are the main themes in the dataset?".
- Fix: "Khách thường phàn nàn về những chủ đề chính nào?" and optionally one clause that the answer is a summary of themes, not an exact count.

### A7. Step 8 updates metadata on an unchanged chunk without saying how (low)
- Location: stepper step 8 (line 835).
- Evidence: c3 is "giữ nguyên, không embed lại" yet "Metadata của cả ba chunk được cập nhật". That is fine if the hash covers content only and the store allows metadata-only updates. In the cited mechanism [7] the hash covers "both page content and metadata", so a metadata change would count as a change.
- Fix: add "(hash ở đây chỉ tính trên nội dung; metadata được cập nhật riêng)".

### A8. Per-chunk hash savings depend on stable chunk boundaries (low)
- Location: section 4 muted paragraph (line 386); step 8.
- Evidence: with fixed-size chunking, inserting one sentence shifts every later boundary, so every later chunk changes. The saving shown in step 8 holds because chunks follow headings.
- Fix: one clause: "điều này đúng khi cắt theo mục; cắt theo số ký tự thì chèn một câu có thể làm lệch mọi chunk phía sau".

### A9. The quality gate is drawn after indexing (low)
- Location: pipeline order 6 then 7 (section 2, stepper steps 6 and 7).
- Evidence: step 6 writes to both indexes, step 7 then decides whether to block. If the index is live, bad data has already been served. Most checks in step 7 (empty text, required metadata, injection, duplicates) need no index and are cheaper before embedding. Only the sample-question check needs an index.
- Fix: say that cheap checks run before embedding, and that the retrieval smoke test runs on a staging copy before publishing.

### A10. Unicode note is correct but incomplete for Vietnamese (low)
- Location: stepper step 3 (line 830); glossary `cleaning`.
- Evidence: the NFC/NFD statement is correct and matches [6]. Two additions matter for Vietnamese: (1) the same normalization must be applied to the question at query time, not only to the store; (2) NFC does not unify the two tone-placement conventions ("hòa" vs "hoà"), which are different code point sequences in any normalization form, nor legacy encodings (TCVN3, VNI).
- Fix: add both as one sentence each.

### A11. Keyword index illustration (low)
- Location: stepper step 6 (line 833).
- Evidence: "7 ngày → c1" shows a phrase as a key; an inverted index maps tokens. "CS-112 → c1, c2, c3" works only if the page ID is indexed as searchable text, since it does not occur in the chunk text shown in step 4. For Vietnamese, "đổi trả" is one word made of two syllables; many analyzers index syllables. The `ngôn ngữ: vi` field in step 5 hints at this without saying it.
- Fix: say "minh họa đơn giản hóa" and add one line on Vietnamese word segmentation.

### A12. Knowledge graph and RDF (low)
- Location: section 5 (line 440).
- Evidence: the triple definition matches [15]. RDF is one of two common graph models; the other, the property graph, is what the cited GraphRAG tooling uses and allows properties on edges. In the example, the path "Tai nghe X → Điện tử → chính sách v4" follows the second edge against its direction, which is fine but unexplained. The simulated policy has only "Thông thường / Hàng giảm giá", not "Điện tử", so the graph example does not connect to the running example.
- Fix: optional one-line note on property graphs; say "đi ngược cạnh"; and say that the graph leads to the right policy chunk, from which the number of days is still read as text.

### A13. Section 11 illustrative numbers do not add up (medium)
- Location: `.kpi` cards (lines 707 to 710).
- Evidence: coverage 82% means 18% of questions have no content. "Không trả lời được" is 11%. So at least 7% of questions were answered although the store had nothing, which is the definition of a made-up answer. A careful learner will notice. Separately, that card merges two different things: the system said "không biết" (correct behaviour when content is missing) and the answer was rated wrong.
- Fix: make the numbers coherent, for example coverage 82%, "không biết" 15%, rated wrong 6%. Split abstention from wrong answers. Add the missing warning: the worst failure, a confident wrong answer nobody rated, appears in neither number, which is why a sample must be audited.
- Related: the "Độ mới" card shows 18% where higher is worse. Rename the tag to "Quá hạn xem lại".
- Metrics worth adding as "kèm": ingestion or parse failure rate, permission sync lag, count of chunks in the index whose source no longer exists (ties to A1), coverage weighted by how often a question is asked.

### A14. Items checked and found correct
Permission filter at query time and security field populated by the application [9]; permission changes visible only after sync [10] (verbatim support); same embedding model for query and chunks [5]; OCR for scans, header/footer removal, table reformatting, image descriptions [3]; prompt-injection handling including "flagging or excluding" [4]; triples and graph [15]; GraphRAG index and community summaries [16]; local search [17]; KCS collective ownership [18]; content gap vs findability, duplicate consolidation, domain experts [19]; age is not a reason to archive [20]; IDF weighting [12]; text-to-SQL narrow permissions and validation [14].

---

## B. Citations

All 21 are used. None is fabricated. The issues below are over-attribution: the superscript sits on a sentence that says more than the source.

| # | Sev | Location | Sentence on the page | What the source supports | Fix |
|---|---|---|---|---|---|
| B1 | medium | step 4 `cite(3,11)` (line 831); section 6 is fine | "Đường dẫn tiêu đề được gắn vào đầu đoạn" | [11] prepends LLM-written, chunk-specific context ("usually 50-100 tokens"); it never mentions headings or titles. [3] discusses structure by headings, not prefixing chunks. | Keep [3] on "cắt theo tiêu đề". Reword: "một cách đơn giản để chunk tự mang ngữ cảnh; [11] đi xa hơn, dùng LLM viết một câu ngữ cảnh riêng cho từng chunk". This also introduces contextual retrieval, which is missing. |
| B2 | medium | section 4 line 385 `[7][8]` | detection by modified date and source events | [7] has neither: no modified date, no events; sync is a daily scheduled job. Both sources support hashing, skipping unchanged content and cleanup only. | Move the superscripts to the last sentence of the paragraph (skip unchanged, delete old). |
| B3 | medium | section 4 line 391 `[7]` | deletion from "vector index, keyword index, cache, bản sao kết quả" | [7] covers the vector store only. | Reword "tối thiểu là khỏi vector store [7]; cùng lý do áp cho keyword index, cache…". |
| B4 | low | step 6 `cite(12)` (line 833) | "Dùng khi hỏi mã số, tên riêng, cụm chính xác" | [12] explains IDF, term-frequency saturation and length normalization. It does not claim exact-match strength. The use in the section 9 table ("từ càng hiếm càng được tính nặng") is supported. | Drop the cite here or move it to a sentence about term weighting. |
| B5 | low | step 3 `cite(7,19)` (line 830) | "ưu tiên bản ở nguồn chính thức" | [19] says "consolidating duplicate articles, identifying the best or preferred resolution"; nothing about an official source. | Put the cite after "chỉ giữ một bản"; leave the preference rule uncited as common practice. |
| B6 | low | section 9 table `[16]` (line 647) | "trả lời được câu hỏi nhiều bước và câu hỏi tổng quan" | [16] supports global questions over a corpus. Multi-hop is not its claim. | Attach [16] to "câu hỏi tổng quan" only. |
| B7 | low | line 353 `[4]` and step 5 `cite(4)` | each unit knows "của ai, còn hiệu lực không"; the 12-field schema | [4] lists ID, title, summary, rephrasing, keywords, tags, entities, cleaned text, questions, source, language. Owner, version, validity, review date and permissions are not in it. | Say "[4] nêu các trường mô tả nội dung; các trường vận hành (chủ sở hữu, hiệu lực, quyền) là thiết kế ví dụ". See C1. |
| B8 | low | line 224 `[9]`, line 394 `[9]` | "AI có thể trích tài liệu mật…"; "không bao giờ vào prompt" | [9] supports "document-level authorization is enforced by applying the security filter to every query". It says nothing about LLMs or prompts. It also states "There's no authentication or authorization through the security principal. The principal is just a string". | Keep the cite on the filter sentence. Add the caveat: the filter is only as trustworthy as the application that determines who is asking. |
| B9 | low | line 389 `[20]` | "khuyên không xóa bài chỉ vì tuổi" | [20] is about archiving; the fetched page does not use the word delete. Heading: "Age and Size Shouldn't Really Matter". | "không lưu trữ/gỡ bài chỉ vì tuổi". |
| B10 | low | line 232 `[21]` | "nghĩa vụ xóa khi được yêu cầu" | Art. 17 applies under listed grounds and has exceptions (not re-fetched this session). | "trong những trường hợp luật định". gdpr-info.eu is an unofficial rendering, which the page already discloses; EUR-Lex is the primary source. |
| B11 | low | step 3 `cite(6)` | Vietnamese diacritics | [6] does not mention Vietnamese. The research notes already flag this as an inference. | Acceptable; optional "(áp dụng quy tắc chung của [6])". |

Not issues: [1] and [2] on the RAG definition; [2] on ingestion stages; [3] on OCR, tables, image descriptions, re-chunking impact; [5]; [10]; [13]; [14]; [15]; [17]; [18]; [19] for gap vs findability. Publication years shown for [2] (2025), [3] to [5] (2026), [9] and [10] (2026) match the `ms.date` values returned by the fetch.

---

## C. Missing core concepts

Ordered by value to this learner.

1. **Two kinds of metadata (medium).** The page teaches only operational metadata taken from the source (owner, ACL, version, dates). The cited source [4] is mostly about the other kind: metadata generated from content (title, summary, keywords, entities, questions the chunk can answer) used to improve search. One short card fixes it and makes citation [4] honest.
2. **Metadata schema has no static home (medium).** The scope item "metadata schema" exists only inside stepper step 5, hidden until clicked. The roadmap puts "Viết schema metadata" in week 2 with reading "mục 4, 5, 6, 7"; the schema is in section 3. Either add a short static subsection or point week 2 at "mục 3, bước 5". Also state that document-level fields are inherited by every chunk.
3. **Deletion detection and reconciliation (high).** See A1.
4. **Routing (medium).** Section 5 says to choose storage by question type but never says who decides at answer time whether a question goes to vector search, SQL, the graph or a live API. One paragraph naming the router (rules, an LLM classifier, or an agent choosing tools) closes the loop and links to the agent page.
5. **Keeping the raw and parsed copy (medium).** Re-chunking or re-embedding without re-fetching every source requires storing the fetched original and the parsed text, plus lineage (chunk to document to source version). This is what makes A4's partial re-runs possible.
6. **Entity resolution and taxonomy (medium).** A graph is only useful if "Tai nghe X", "X Headphone" and SKU "TN-X" become one node. `taxonomy` exists in the glossary and nowhere in the body; it is one of three glossary terms with no inbound related link (`semi`, `live`, `taxonomy`). Also say plainly that the cheapest reliable graph comes from data that is already structured (product to category tables), not from LLM extraction.
7. **Permission mechanics (low to medium).** Filter before search versus after: filtering after top-k returns too few results. Group membership versus document ACL are two separate things that go stale separately. The alternative to synced ACLs is checking the source at query time, slower but with no lag. May belong to the governance page; a pointer is enough.
8. **Content lifecycle state (low).** Draft, approved, published, archived; ingest only approved content. Fits the KCS framing already used.
9. **Sensitive data at ingestion (low).** Detection and masking of personal data is mentioned only for tickets and for logs. One line in the cleaning stage plus the existing governance link.
10. **Failure handling in sync (low).** A partially failed run, retries, and the window where old and new chunks coexist. [8] notes that in `full` mode "users may see duplicated content during indexing".
11. **Apparent conflicts (low).** Two documents can both be right for different scopes (region, channel, customer type). Scope metadata resolves these before any precedence rule. Fits the "Mâu thuẫn" card.
12. **Glossary gaps (low).** Body terms with no entry: prompt injection, findability, cache, dữ liệu cá nhân (PII), reconciliation.

---

## D. Pedagogy and Vietnamese wording

1. **"Làm sạch & khử trùng" (medium)**, stepper label, `STEPS[2].t` (line 830), shown on the step button and the progress chip. "Khử trùng" means to sterilize. Use "Làm sạch & bỏ trùng" or the full "khử trùng lặp".
2. **"vấn đề tìm thấy (findability)" (low)**, line 712. Unnatural. Use "khó tìm thấy (findability)" or "khả năng tìm thấy".
3. **"trích" carries four meanings (low to medium):** trích văn bản (parse), trích nguồn (cite), "AI có thể trích tài liệu mật" (quote), trích thực thể (extract). Use "dẫn nguồn" for citing; keep "trích" for extraction.
4. **Mixed verbs (low):** "ingest lại" (lines 403, 907) next to "nạp"; use "nạp lại". "Băm (hash)" appears once (line 386) while "hash" is used everywhere else. "chỉ mục" and "index" both appear; define the pair once in section 1.
5. **"dàn phẳng" (low):** understandable; "làm phẳng" is more common. Keep one form.
6. **Unexplained jump in the simulation (low):** the line "Phiên bản 3 · áp dụng từ 01/09/2026" is in the parsed text of step 2, absent from the chunks in step 4, and reappears as metadata in step 5. Add half a sentence in step 5: the version line was lifted into metadata.
7. **Step 4 (low):** "cắt theo tiêu đề mục" should add that an overly long section is still split by size and very short sections are merged.
8. **Section 11 naming (low):** see A13.
9. Diacritics are complete throughout; the search placeholder "dong bo" is intentionally unaccented. The file is NFC-normalized. Tone is consistent with the RAG page. The running example (30 / 14 / 7 / 3 days, v2 / v3 / v4, dates 03/11 and 10/11/2026) is internally consistent across sections 3, 4, 5, 6, 10 and the quiz.
10. Strengths to keep: the library analogy, the "kho vs cách dùng kho" split, the content-side diagnostic tree placed before the RAG one, and the bug deliberately planted in chunk c2 and resolved in step 8.

---

## E. HTML, JS, accessibility, mobile

Rendering was not checked in a browser. Numbers are derived from the CSS.

1. **Citation jumps land under the sticky header (medium).** `.sources li` (line 126) has no `scroll-margin-top`; `section` has 56px. Clicking `[n]` scrolls `#src-n` to the top of the viewport, behind the header (about 52px on desktop, about 61px on mobile where header controls get `min-height:40px`). Fix: `.sources li{scroll-margin-top:72px}` plus `.sources li:target{background:var(--accent-soft)}`. The glossary jump is unaffected because it uses `scrollIntoView({block:'center'})`.
2. **Stepper "Tiếp →" leaves the reader at the bottom (medium, mobile).** `.step-nav` sits below `#stepBody`. `show()` (line 842) replaces the content and does not scroll, so on a phone the reader lands at an arbitrary point of the next step. Fix: after a click on prev/next, `document.querySelector('.stepper').scrollIntoView({block:'start'})`, with the same scroll margin as sections.
3. **Disabled step buttons look enabled (medium).** `.step-nav button{color:var(--text)}` (line 100) overrides the browser's grey disabled colour, and there is no `:disabled` rule. Fix: `.step-nav button:disabled{opacity:.45;cursor:default}`.
4. **iOS zoom on the glossary search (medium).** `.gloss-tools input{font:inherit}` gives 15px on mobile. Safari on iOS zooms the page when a focused input is under 16px. Fix: `font-size:16px` on the input. Its height is also about 36px (15px text, 8px padding, 1px border), under the 40px target.
5. **SVG text under 11px between 601px and about 1050px wide (medium).** `.d-only` is hidden only at 600px and below (line 155). The two large SVGs have viewBox width 1000 and `min-width:640px`. At a 640px rendered width the scale is 0.64, so the 12px labels render near 7.7px and the 11px labels near 7px. Text reaches 11px only when the SVG is about 1000px wide. Fix: raise the `.d-only`/`.m-only` switch to about 1000px, or set `min-width:1000px` so the box scrolls instead of shrinking. The KG SVG (viewBox 460) is fine.
6. **Tap targets under 40px on mobile (medium, several):**
   - `details summary` (lines 131 to 133): padding is on `details`, so the summary is one text line, about 25px. Eight quiz items. Fix: move the padding onto `summary`.
   - `.term .rel a` (line 175): 13px text plus 8px vertical padding, about 37px, separated by ", ".
   - `.cite a` (line 124): about 38px tall, about 20px wide, adjacent cites touch. Inline links are commonly exempt; lowest priority.
7. **Content text under 15px on mobile (low to medium):** `pre` 14px (line 178; the HTML and parsed text in step 2 are real reading content), `.mono`/`code` 14px (keyword index line in step 6), `.term .rel` 13px, `.vflow .ar` 13px (arrow labels carry meaning, e.g. "kèm mô tả bảng và cột (schema)"), `.vec` 13px, `.vflow .ph` 14px. Tags, chunk ids and stacked-table labels at 12px are labels and acceptable.
8. **Horizontal overflow below about 342px (low).** In step 6 a nested `.grid.g2` with `minmax(280px,1fr)` sits inside the stepper card. At 390px the available width is about 328px, so it fits. At 320px it is about 258px and overflows. Outside the stated 390px target. Fix: `minmax(min(280px,100%),1fr)`.
9. **`fold()` regex uses literal combining characters (low).** Line 925: `/[̀-ͯ]/g`; the bytes are `cc 80 2d cd af`, i.e. U+0300 to U+036F, so it works. It is fragile under editors and formatters. Fix: `/[\u0300-\u036f]/g`.
10. **Accessibility (low to medium):**
    - `#glossSearch` has only a placeholder. Add `aria-label="Tìm khái niệm"`.
    - `#stepBody`, `#writeBody` and the glossary grid are swapped without `aria-live`; a glossary jump does not move focus. Add `aria-live="polite"` on the first two; give the target card `tabindex="-1"` and focus it.
    - Filter chips have no `aria-pressed` (the write toggle does).
    - `aria-label` on plain `div`s (lines 243, 424, 441, 541) has no effect without a role. Add `role="group"`.
    - On desktop the text alternative of each large diagram is `display:none`, so a screen-reader user gets only the SVG's one-line label. Hide the list visually instead of with `display:none`, or add a `<desc>`.
    - Heading order: cards under an `h2` use `h4` directly in sections 2, 4, 8, 10.
    - Estimated contrast below 4.5:1 in the light theme: `.tag.p4` and `.vflow .ph3` (#b4610e on #fbeedd, about 4.0), `.tag.p3` (#1f8a4c on #e1f3e8, about 3.8), links inside `.callout` and the active TOC pill (#2f6fde on #e3ecfc, about 3.9). The palette is shared with the RAG page, so fix it there too or not at all.
    - External links open a new tab with no indication.
11. **Relationship SVG (low).** The governance arrow (line 606) points only at the knowledge-base box while its label says "áp lên kho và bước tìm"; it also crosses the LLM to "Câu trả lời" arrow near x=595, y=378. Add a second arrowhead toward the retriever or shorten the label.
12. **No-JS fallback (low).** Sections 3 and 7 and the write-for-AI example are empty without JavaScript. A `<noscript>` line is enough.

## F. Interactive parts

| Part | Result | Notes |
|---|---|---|
| Stepper | Works by code reading; 8 steps; syntax check passed | `show()` sets the active button, `aria-current`, the progress chips, the disabled state and re-labels stacked tables. Defects: E2, E3, D1. On mobile the scrolling button row and the progress chips repeat the same eight labels; hiding `.pipe` at 720px and below saves space. |
| Write-for-AI toggle | Works | `aria-pressed` handled correctly. Content consistent with v3 (7 ngày, 01/09/2026). Add `aria-live`. |
| Glossary filter | Works | 55 terms, chip label "Tất cả (55)" computed from `T.length`. |
| Glossary search | Works | Accent-insensitive on both sides; "dong bo" matches 3 terms. Searches name, alias, definition, example. See E4, E9. |
| Related links | Works | 0 dangling ids. When the target is filtered out, filter and query are reset before scrolling. Three terms have no inbound link: `semi`, `live`, `taxonomy`. |
| Checklist | Works | Keys `kb-w1a` to `kb-w3b`, values `'1'`/`'0'`, guarded with try/catch. No collision with the RAG page's `rag-` keys. |
| Theme toggle | Works | Same logic and key `rag-theme` as the RAG page, applied in `<head>` before paint. Two states only; no return to "follow system" once clicked. Same as the sibling page. |
| Active TOC | Works by code reading | Observer band is 5% of the viewport height; the active pill is centred in the scrolling nav. |

---

## Recommended order of work

1. A1: deletion detection and reconciliation (section 4, flow node, glossary, quiz 3).
2. D1: rename the "khử trùng" step label.
3. A2: replace the exact-duplicate example.
4. B1 to B3: move or reword three citations.
5. A13: coherent numbers and the abstained/wrong split in section 11.
6. E1 to E6: source scroll margin, stepper scroll, disabled style, input font size, SVG breakpoint, summary tap target.
7. A3, A4, A5, A6: deletion vs revocation, re-index levels, SQL per-user permissions, GraphRAG example.
8. C1, C2, C4: content-derived metadata card, static home for the schema, routing paragraph.
9. Everything marked low.

## Assumptions

- "Body text at least 15px" was read as applying to running content including code blocks and arrow labels, not to tags and field labels. Confidence: medium. If labels are in scope, the 12px `.tag`, `.chunk .id` and stacked-table labels also fail.
- The 390px target was taken literally; the 320px overflow in E8 is reported as low. Confidence: high.
- Layout conclusions come from CSS arithmetic, not a rendered page. Confidence: medium. A check at 390px and at about 800px would confirm E5, E6 and E8.
- Sources 1, 13 and 21 were not re-fetched; their use on the page is uncontroversial and matches the quotes in the research notes. Confidence: high.
- The palette and theme behaviour are intentionally shared with the RAG page, so contrast and two-state theme findings are low and should be fixed across pages or not at all. Confidence: medium.

## Unresolved questions

1. Should permission mechanics (C7) and sensitive-data handling (C9) live on this page or only on the governance page? I did not read `governance/index.html` for overlap.
2. Is a full re-index after a metadata schema change (A4) meant as a simplification for beginners? If so, keep it but soften "bắt buộc" to "thường phải".
3. Is the tablet range (601 to 1050px) a supported target? E5 matters only if it is.
