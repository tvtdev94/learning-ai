# Review: AI Governance learning page

Target: `D:\WORKSPACES\learning-ai\governance\index.html` (832 lines)
Reference: `D:\WORKSPACES\learning-ai\rag\index.html`
Reviewed 2026-11-14 by Kongming (model: Fable 5.2). Advisory only; the HTML was not edited.

## TL;DR

No critical defects. The page obeys the hard content rules in the body text, and every source I could open supports the claim attached to it. Fix before publishing: 4 code/CSS items (three of them regressions against the RAG page), 2 accuracy overclaims, 1 rule-compliance decision on source [7], and the numbering clash between the 6-step lifecycle and the 8-step example.

## How this was checked

| Check | Method | Result |
|---|---|---|
| Glossary related ids, control ids, anchors, citations, tables, external resources | Node script over the file | 55 terms, 0 duplicates, 0 missing related ids, 0 unknown control ids, 0 broken `#` anchors, 0 non-`stack` tables, no `<link>`/`<script src>`/`@import`; source [17] has 0 in-body citations |
| Sibling links | `ls` + grep | `../rag/`, `../knowledge-base/`, `../ai-agent/` exist; `id="danh-gia"` exists in rag |
| CSS vs reference | `diff` of the two `<style>` blocks | governance dropped `color-scheme` and `ol.sources li{scroll-margin-top:64px}` |
| Sources [1] [3] [5] [6] [7] [8] [9] [10] [11] [12] [13] [14] [15] [16] [17] [18] | WebFetch today | opened, claims compared (details below) |
| Source [2] NIST AI 100-1 | WebFetch saved the PDF, `pdftotext` + grep | all five quoted sentences found (txt lines 932, 935, 1131, 1305, 1471, 257) |
| Source [4] iso.org | WebFetch | HTTP 403. **Not verified by me.** The research notes' quote is the only evidence |
| Mobile layout, contrast | Reasoned from CSS and hand-computed ratios | **Not rendered in a browser.** Treat pixel numbers as estimates |

## Findings

### Major

**M1. Checklist reports missing items by codes the user never sees.** Line 811 prints `Mục ★ còn thiếu: A1, B2, C3…`, but line 794 renders items without those codes. The message is unreadable. Show the code in front of each item, or list short item names, or highlight the unchecked ★ rows.

**M2. Citation jumps land under the sticky header (regression).** RAG has `ol.sources li{…scroll-margin-top:64px}`; governance line 82 dropped it. Clicking any `[n]` puts the first lines of the source behind the header. Also `section{scroll-margin-top:56px}` (line 45) is smaller than the mobile header, which is about 61px (40px min-height buttons + 2×10px padding + border). Restore 64px on `li`, and raise the section value to about 68px on mobile.

**M3. `color-scheme` dropped (regression).** RAG sets `color-scheme:light|dark` in all three theme blocks; governance lines 9–29 do not. In dark theme the 24 checkboxes, the search input's native parts and scrollbars stay light. This page relies on checkboxes more than RAG does.

**M4. SVG text below 11px between about 601px and 970px viewport.** At 390px both SVGs are hidden (`.d-only`), so the stated mobile target passes. But `viewBox` is 1000 wide with `min-width:640px` (line 78) and 12px labels (lines 586–587, 649, 656). 12px renders at 11px only when the SVG is about 917px wide. At 768px it is about 8.6px; in the 601–690px range it is 7.7px. Phones in landscape and tablets get this. Raise the `.d-only/.m-only` breakpoint to about 960px, or set `min-width` to about 920px and accept the scroll. Inherited from the RAG pattern, but the risk map is denser.

**M5. "Model can only leak what the retriever gives it" is too strong.** Line 302: "Model chỉ có thể làm lộ những gì retriever đưa cho nó". Lines 304, 593 and the `data-minimization` term (line 702): "Dữ liệu không có trong kho thì không thể bị lộ (qua bot)". The page itself gives the bot a tool that reads leave balances (line 596), and lists system prompt leakage and logs as leak paths. Scope the sentence: "Với kho tài liệu, model chỉ có thể làm lộ đoạn mà retriever đưa vào prompt; ngoài ra còn tool, lịch sử hội thoại, lời dặn hệ thống và log".

**M6. Lifecycle has 6 "bước", the example has 8 "Bước", and incidents have another "sáu bước".** Example "Bước 3" (line 594) is lifecycle step 2; "Bước 5" (line 596) is lifecycle step 3. A newcomer will try to match the numbers. Keep 8 screens, but tag each with its lifecycle stage ("Vòng đời: bước 2 · Kiểm soát dữ liệu") and stop calling the screens "Bước". Related inconsistencies:
- Go/no-go: RACI table gives A to "Lãnh đạo / hội đồng AI" (line 323); the example gives A to "trưởng phòng HR" (lines 592, 597). Add one sentence saying who plays which role in a 300-person company.
- "Product owner" is a RACI column (line 317); the glossary defines "System owner" (line 692) for the same accountability and never defines Product owner. Pick one term.
- Example step 8 uses four labels (Truy vết, Khoanh vùng, Khắc phục, Rút kinh nghiệm); section 7 teaches six (line 421–426), and "Khắc phục" means different things in the two places.

**M7. Missing core concepts for RAG/agent governance** (see section "Missing concepts").

**M8. Rule compliance: source [7] names a specific legal article.** Line 522: title "Article 2: Scope" and URL `…/ai-act/article-2`. The body text never mentions an article, but a literal reading of "no specific legal articles" is breached. This is the caller's rule to interpret. I verified that [6] does **not** contain the "output used in the EU" clause; only [7] does. Options:
- Default I recommend: drop [7] and rewrite line 391 to what [6] supports ("đưa hệ thống AI hoặc mô hình AI đa dụng vào thị trường EU, hoặc đưa vào sử dụng / dùng tại EU"). Costs renumbering [8]–[18].
- Keep [7] as an honest bibliographic title and accept the exception. Costs nothing, but a grep for "Article" will keep flagging it.

### Minor: accuracy and citations

| Location | Issue | Fix |
|---|---|---|
| Line 532, [17] | Listed as a source but cited nowhere. The model-card sentence (line 727) is rendered through `esc()`, so the glossary cannot carry citation marks. | Remove [17], or let glossary entries take an optional source number. |
| Line 619, control `src` → [13] | "chủ sở hữu, phiên bản, ngày hiệu lực; bản cũ được gỡ" is not in LLM08 (I asked the page: versioning, owners, effective dates are not mentioned). Only "nguồn tin cậy" is. | Move the cite to the trusted-source clause or drop it. |
| Line 626, risk `abuse` → [15] | LLM10 covers excessive inference, DoS and cost. It does not cover "dùng ngoài mục đích được duyệt". | Put the cite after the second half only. |
| Line 617, control `log` → [13] | "Không ngăn được sự cố, nhưng giúp giảm thiệt hại" is the wording of [11]. [13] supports retrieval logs for detection. | Cite [11] and [13]. |
| Line 613, control `gin` → [9] | "độ dài, tần suất" comes from [15], not [9]. | Add [15]. |
| Line 215 → [11] | [11] supports human approval of high-impact actions. "ai chịu trách nhiệm" is the page's own point. | Move the cite before "Cần biết trước…", or leave as is. |
| Line 712, Jailbreak | "Một dạng của prompt injection trực tiếp". OWASP says only "a form of prompt injection". | Delete "trực tiếp". |
| Line 508, quiz 7 | "không phải checklist bắt buộc theo thứ tự" merges two separate statements. Line 389 has it right. | "không phải checklist, và không nhất thiết theo thứ tự". |
| Line 390 | "Tiêu chuẩn tự nguyện áp dụng" has no source; the notes say the ISO page was not checked for this. | Belief: true in general. Soften to "Không phải luật; tổ chức tự chọn áp dụng" or leave uncited knowingly. |
| Line 389, 516 | [1] now states "The AI RMF 1.0 is being revised". The page presents 1.0 without saying so. | Add "đang được NIST rà soát, sửa đổi" next to the existing "kiểm tra văn bản hiện hành". |
| Line 391 | Still accurate at high level. [5] now describes the "AI Omnibus" amendments and changed timelines; the page wisely carries no dates. | No change. Keep "áp dụng theo giai đoạn". |
| Line 719 | Example `[noi-quy v4 · Điều 7]` is a fictional internal rule, but it trips a grep for "Điều". | Use "mục 7". |
| Lines 517–519 | "NIST AI 100-1", "NIST AI 600-1", "ISO/IEC 42001:2023" are document identifiers of non-legal texts. I read the rule as covering legal instruments only. | Caller to confirm. |

Claims confirmed against the live source: NIST voluntary [1]; Govern cross-cutting, Map/Measure/Manage wording, "not a checklist", fairness characteristic [2]; GenAI profile as companion resource [3]; four risk levels, chatbot transparency, GPAI rules [5]; inside/outside EU [6]; third-country providers where output is used in the Union [7]; ten 2025 item names [8]; direct/indirect definitions, "unclear if there are fool-proof methods", source citations in output validation [9]; pattern matching, retention/usage/deletion policy, prompt restrictions bypassable [10]; three root causes, user-context execution, human approval, logging limits damage [11]; not a security control, not delegated to the LLM, deterministic and auditable [12]; permission-aware stores, trusted sources, partitioning, immutable retrieval logs [13]; misinformation and hallucination definitions [14]; DoS, economic loss, rate limits, quotas [15]; both Greshake quotes and author list [16]; model card definition and FAT* 2019 [17]; security filter by group or user identity, `ms.date` 2026-08-21 [18].

### Minor: JS and HTML

- **Risk map loses keyboard focus.** `drawRc()` empties the SVG (line 635) and `renderRc()` empties the list (line 663) on every selection. After Enter on a risk, focus falls back to `<body>`. Re-focus `[data-r=id]` after redraw, or update classes in place.
- **`role="img"` on `#rcSvg` (line 361)** hides the `role="button"` children from assistive tech. Use `role="group"`. The chips are a working alternative, so impact is low.
- **Faded risks stay clickable but unreadable.** `#rcSvg .fade{opacity:.2}` (line 122) applies to the other five risk boxes, which the user must still read to switch. Use about .5 for risks; keep .2 for unlinked controls.
- **Disabled Prev/Next look enabled.** `.step-nav button{color:var(--text)}` (line 105) overrides the UA disabled colour and there is no `:disabled` rule. Same in RAG.
- **Stepper does not scroll to the new step.** After "Tiếp →" at the bottom of a long step on a phone, the viewport stays deep inside the new content. Same in RAG. Scroll the stepper top into view on button navigation (not on first render).
- **`fold()` regex uses literal combining characters** (line 743; verified code points U+0300–U+036F, so it works today). An editor or formatter can silently break it. Write `/[\u0300-\u036f]/g`.
- **`labelTables(root)`** (line 558) shadows the outer `root`. Harmless; rename the parameter.
- **No `prefers-reduced-motion` handling** for `scroll-behavior:smooth` (line 31) and `scrollIntoView({behavior:'smooth'})` (line 762).
- **Checklist has no "not applicable".** ★ item `c2` (line 781) cannot be honestly ticked for a chatbot with no tools, which blocks "ready" forever. Reword to "Nếu có tool/agent: …; nếu không có, đánh dấu đạt".
- **Glossary chips lack `aria-pressed`** (set on the risk chips at line 662, not at line 758).
- **Six terms have no inbound related link**: `third-party`, `bias`, `misuse`, `feedback`, `owasp-llm`, `vn-pdp`.

Logic that I read and found correct: stepper bounds and `aria-pressed`; risk chip / SVG / list selection and toggle; link geometry (`CY`, `RY` both end at y=520, viewBox height 580); glossary filter, diacritic-insensitive search, related-link reset when the target is filtered out; checklist score, three states, 8 ★ of 18; `localStorage` wrapped in try/catch with keys `gov-ck-*` and `gov-*` that do not collide; theme toggle (shared `rag-theme` key is the site convention, RAG line 674); TOC observer and its `offsetLeft` arithmetic.

### Minor: mobile at 390px

- **Body text**: 15px, passes. Smaller text that carries content: `sup.cite` 11px (RAG uses `max(11px,.72em)` plus weight 600), `.chunk .id` 12px (line 109; it holds the ACL label, which is the point of step 3), `.tag` 12px, stacked-table labels 12px, `.term .en` 14px (line 90; the mobile block raises `.term p` but not `.en`).
- **Tap targets under 40px**: `sup.cite a` is about 25px tall and 20px wide, and pairs such as `[13][18]` sit side by side (line 305). `.term .rel a` is about 37px tall (line 165). Everything else is 40–42px.
- **Horizontal overflow**: none expected at 390px. At 340px and below, `.g2{minmax(280px,1fr)}` (line 57) overflows inside the stepper card in step 3. Use `minmax(min(280px,100%),1fr)`.
- **`table.stack`**: used on all 8 tables, including those injected by the stepper (labels re-applied at line 603). Two rough spots: the RACI table becomes 7 rows × 6 label/letter pairs, and the 2-column table in step 1 repeats the label "NỘI DUNG" on every row.
- **Contrast, light theme** (hand-computed, approximate): `.tag.p3` on `--ok-soft` ≈ 3.8:1, `.tag.p1` and the active TOC pill ≈ 4.0:1, `.tag.p4` ≈ 4.0:1, `.tag.bad` ≈ 4.3:1, and the `--p5` heading in `#rcDetail` on white ≈ 4.3:1. All are just under 4.5:1 for small text. The palette is inherited from RAG except `--p5` (#0b8793); darkening it to about #0a7480 would pass. Dark theme estimates all pass.
- **Glossary length**: 55 cards in one column is roughly 10,000px of scroll on a phone. Consider starting on the first group instead of "Tất cả" at ≤600px.

### Minor: pedagogy and Vietnamese wording

- Line 383 says "Ba khung tham chiếu"; the table has four rows and Việt Nam is not a framework. Retitle to "Khung và quy định hay được nhắc tới".
- Mixed terms for one thing: "lời dặn hệ thống" vs "system prompt" (line 396); "bộ câu hỏi kiểm tra" vs "eval set" (lines 263, 574); "đoạn" vs "chunk"; "kho" vs "index"; "red team" vs "red teaming". Choose one each and give the English once in brackets.
- Terms used repeatedly but absent from the glossary: system prompt / lời dặn hệ thống, guardrail (generic), pilot, cache, faithfulness.
- Section 1 has an unnumbered `<h1>` while the TOC says "1. Tổng quan" and sections 2–10 are numbered.
- Paragraph length, tone and diacritics are good throughout. I found no spelling errors.

## Missing concepts (M7)

Ordered by value for someone building enterprise RAG/agents. Each fits in one glossary card plus one line in an existing section.

1. **Improper output handling** (OWASP LLM05, absent from the page and from the list at line 396). Model output is untrusted input to whatever consumes it: HTML, SQL, shell, a tool call. Developers need this more than any other missing item.
2. **Risk register and residual-risk acceptance.** Who signs off on the risk that remains after controls, and where that is recorded. Without it, "go/no-go" has nothing to sign.
3. **Tenant isolation.** The trade-off row at line 408 covers groups inside one company. Teams building for several enterprise customers need the cross-customer case stated.
4. **Agent identity, credentials and memory.** Service account versus acting on behalf of the user; where secrets live; what the agent remembers between sessions and who can delete it. Step and budget limits for agent loops belong here too.
5. **Supply chain and knowledge-base poisoning** (LLM03, LLM04). Third-party models, tools and connectors; someone with write access to a source planting content. The page covers "trusted sources" but not who may write to them.
6. **Impact assessment before build**, generic wording only, to stay inside the content rules.
7. **Overreliance / automation bias**, named. Line 404 describes it ("bấm đồng ý theo thói quen") and [14] already supports it.
8. **Decommissioning.** The lifecycle has no end state: retire the system, revoke keys, delete indexes and logs.

## What to avoid

- Do not add dates, the Omnibus, or version numbers to make the EU and NIST rows "more current". The date-free wording is why they are still correct today.
- Do not fix M4 by shrinking the viewBox content; that makes desktop worse. Change the breakpoint.
- Do not add citations to the glossary by removing `esc()`. Add a separate optional field for a source number.

## Work checklist

1. M1: show checklist codes or names in the "còn thiếu" line.
2. M2, M3: restore `scroll-margin-top` on source items and `color-scheme` in the three theme blocks (copy from RAG).
3. M4: move the SVG/vertical-flow breakpoint to about 960px.
4. M5: scope the two "cannot leak" sentences (lines 302, 304, 593, 702).
5. M6: tag the 8 example screens with lifecycle stages; align the A role and the owner term; align the incident labels in step 8 with section 7.
6. M8: decide on source [7]; then resolve [17].
7. Apply the citation fixes in the accuracy table.
8. Add the missing concepts, at least items 1–4.
9. Apply the JS/CSS minors, then render at 390, 768 and 1280px in light and dark to confirm the estimates in this report.

## Assumptions

- The rule "no document numbers" targets legal instruments, not standard identifiers such as ISO/IEC 42001. Confidence: medium. If wrong, the source list needs retitling.
- The site is served over HTTP, so `../` and `../rag/` resolve to `index.html`. Confidence: high (RAG uses the same links).
- 390px is the primary phone target and landscape/tablet matter less. Confidence: medium. If tablets do not matter, M4 drops to minor.
- ISO/IEC 42001 description is correct. Confidence: medium-high; it matches the research notes' quote, but I could not open the page.

## Unresolved questions

- Should source [7] stay, given its title and URL contain "Article 2"?
- Are standard identifiers (NIST AI 100-1, ISO/IEC 42001:2023) allowed under the "no document numbers" rule?
