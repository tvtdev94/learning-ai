# Kongming review: Agent Harness learning page

Target: `D:\WORKSPACES\learning-ai\harness\index.html`
Template compared: `D:\WORKSPACES\learning-ai\rag\index.html`
Research notes: `D:/WORKSPACES/reseacher/plans/reports/research-261114-2022-harness-sources.md`
Runtime: Kongming on Fable 5.2. Advisory only; the page was not edited.

## Read this first

- **The page changed while I reviewed it.** `stat` showed three states: 95731 bytes (first read), 95740 bytes at 20:36:19, 95773 bytes at 20:37:40. Findings below were re-checked against the 20:37:40 state. Three issues I found in the first read were already fixed by then and are dropped: the dashed "bị chặn" curve striking through its label in `#flow`, the inline `font-size:13px` in the stepper context panel, and context-% values that did not match the trace-table tokens.
- **Nothing was rendered in a browser.** Your global rule says to ask which browser first, and I cannot ask. All layout findings are static analysis of CSS and SVG coordinates; pixel numbers are computed, not measured.
- **Sources fetched this run: 10 of 23** — [2] [3] [4] [5] [6] [7] [12] [13] [16] [17] (first 100k chars of [17] only). Not verified this run: [1] [8] [9] [10] [11] [14] [15] [18] [19] [20] [21] [22] [23].

## Verdict

The page is technically sound and well hedged. There are no factual errors that would mislead a learner badly. One functional bug should be fixed before publishing (H1), then a group of medium items: three citation over-reaches, three content gaps, and two template regressions.

## Findings

Severity: High = fix before publishing. Medium = should fix. Low = polish.

### High

**H1. Citation target hidden under the sticky header.**
- Where: CSS line 119, `.sources li{margin:8px 0;overflow-wrap:anywhere;font-size:15px}`.
- Evidence: the template has `ol.sources li{...;scroll-margin-top:64px}` (`rag/index.html:128`); the harness page dropped it. Only `section` has `scroll-margin-top:56px` (line 46). The sticky header is about 55px on desktop and about 66px on mobile (computed from `nav.toc a{padding:11px 12px}` at 14px text).
- Effect: clicking `[1]`..`[10]` or so scrolls the `li` to the viewport top, behind the header. Later sources are less affected because the page cannot scroll that far.
- Fix: `.sources li{scroll-margin-top:76px}`. Also raise `section{scroll-margin-top}` to 72px inside the 600px media query.

### Medium — citation fidelity

**C1. Source [2] does not define "agent harness".**
- Where: `#tong-quan` lead ("Lớp phần mềm đó gọi là agent harness [2]"), glossary `CITES` `harness:[2]`, research-notes row 2 ("harness = system prompt + tools + context mgmt").
- Evidence: fetched [2]. It uses the term but never defines it or lists components. Its footnote "The system prompt, set of tools, and overall agent harness was otherwise identical" lists the harness beside prompt and tools, which cuts against the notes' reading.
- Fix: add Anthropic, "Demystifying evals for AI agents" (9 Jan 2026), `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents`, as source 24. Fetched this run: agent harness (or scaffold) is "the system that enables a model to act as an agent: it processes inputs, orchestrates tool calls, and returns results"; evaluation harness is "the infrastructure that runs evals end-to-end". Cite it for the definition; keep [2] for "the term is in use". State that the long component list is this page's synthesis. The fetch tool shortened quotes, so re-open the article and copy exact wording before quoting.

**C2. Source [4] does not contain "trace" or "trajectory".**
- Where: `CITES` `trace:[4]`, `trajectory:[4]`; `#loi` intro "mở trace … [4]".
- Evidence: fetched [4]. It says "Review the raw transcripts (including tool calls and tool responses)". "Trajectory" does not appear; "trace" appears only inside "tracebacks".
- Fix: in `#loi` write "transcript/trace". Cite the new source 24 for the two glossary entries; its glossary groups transcript, trace and trajectory together (confirm the exact sentence when you open it).

**C3. "Lost in the middle" is stated as a general, current fact.**
- Where: `#tong-quan` Lý do 4, "nhất là thông tin nằm ở giữa [3][11]".
- Evidence: [3] (fetched) supports recall dropping with length and says it "emerges across all models". The position effect comes only from [11], a 2023 study (not re-fetched).
- Fix: "Context càng dài, model nhớ lại thông tin càng kém chính xác [3]; một nghiên cứu năm 2023 còn thấy thông tin nằm ở giữa context dài bị dùng kém nhất [11]."

Minor fidelity notes (low):
- `#so-sanh`, subagent row, "tốn nhiều token hơn hẳn [12]": the source baseline is chat ("agents about 4×, multi-agent about 15× more tokens than chats"), not single agent. Wording is acceptable; add "so với chat" if you ever add the number.
- Step 8 callout "agent hay đánh dấu xong … [2]": the source says this about Claude in one experiment, and the tools were browser-automation tools. Write "Anthropic ghi nhận Claude trong thử nghiệm của họ…".
- `#so-sanh` callout "dành công sức … nhiều hơn cả prompt tổng [1]": research notes quote "more effort"; my recollection of the source is "more time". Not verified this run.
- Glossary Agent example `"Agent = Model + Harness".` sits in quotation marks and reads like a quotation. Drop the quotes or write "Cách nhớ: agent = model + harness".
- Verified as matching: [5] (model never runs anything; loop while `stop_reason` is `tool_use`; schema and result only; server tools include web search), [6], [7] (stateless; message threads in beta), [12], [13] (URL loads, no redirect), [16] (allow/ask/deny; sandbox still applies after injection), [17] (PreToolUse can block), [3] compaction and subagent claims.

### Medium — technical accuracy

**A1. Compaction reads as if harness code writes the summary.**
- Where: Step 9 callout "Harness khi đó làm compaction: tóm tắt các lượt cũ…"; glossary `compaction`.
- Evidence: [3] (fetched): Claude Code does it "by passing the message history to the model to summarize".
- Fix: "harness gọi model một lần riêng để tóm tắt các lượt cũ, rồi mở context mới bằng bản tóm tắt đó [3]".

**A2. pass@k is offered as the multi-run metric with no reliability counterpart.**
- Where: `#danh-gia` card "Đo gì", last bullet; glossary `pass-k`.
- Problem: pass@k rises with k and rewards one lucky run. For an agent a user relies on, the question is whether it succeeds every time.
- Evidence: source 24 (fetched) defines pass^k as the probability that all k trials succeed, with the example of 75% per trial giving about 42% over 3 trials.
- Fix: add one bullet and one glossary term `pass^k`; say pass@k fits "one success is enough" and pass^k fits "must be consistent". The existing definition and "pass@1 khắt khe hơn pass@5" are correct.

**A3. The attribution rule ignores run-to-run noise.**
- Where: `#danh-gia` callout "Đọc kết quả: … phần tăng đó là nhờ harness."
- Fix: append "với điều kiện mức tăng lớn hơn dao động giữa các lần chạy, và cùng phiên bản model, cùng cấu hình". Uncited reasoning; label it as the page's own.

### Medium — missing concepts

**M1. "Scaffold / scaffolding" as a synonym of harness.** The learner will meet it in benchmark write-ups. One sentence in `#tong-quan` plus an alias in the glossary `harness` entry, cited to source 24.

**M2. transcript, trace and trajectory are used as three different things.** `#loi` says trace, `#danh-gia` card 3 says trajectory, the bullets say transcript, the glossary gives `history` the alias "transcript" and defines `trace` and `trajectory` separately. Add one line: "ba từ này gần như cùng nghĩa: bản ghi đầy đủ một lần chạy", then pick one per section.

**M3. Session and state have no glossary entry.** "Memory/state" is in the requested scope. Step 1 mentions "phiên" and `#loi` mentions "không lưu trạng thái để chạy tiếp", but there is no term for session, or for checkpoint and resume (continue an interrupted run, undo file edits). Add two terms in group `ctx` or `ops`. No source checked for these; write them as generic concepts.

### Medium — HTML, accessibility, mobile

**H2. Diagram text falls under 11px between 601px and about 1060px viewport width.**
- Where: `.svgbox svg{min-width:640px}` (line 78), 19 SVG `font-size="11"` labels, `.d-only` hidden only below 600px.
- Computed: viewBox width is 1000. At 768px viewport the SVG is about 718px wide, so 11px renders at about 7.9px and 12px at about 8.6px. At 601–690px it is 640px wide with horizontal scroll and 11px renders at about 7px. At 390px the SVGs are hidden, so phones are fine.
- Inherited: the template has the same rule and 14 labels at 11.
- Fix (simplest): move the `.d-only`/`.m-only` switch to its own `@media (max-width:900px)` block and set `.svgbox svg{min-width:900px}`. Raise the 11 labels to 12.

**H3. Citation links regressed from the template.**
- Where: line 116, `sup.cite{font-size:11px;…}`; template has `font-size:max(11px,.72em)` and `font-weight:600` plus hover underline.
- Effect: fixed 11px, about 15×13px tap area, adjacent links such as `[5][6]` touch each other.
- Fix: restore the template rule; in the 600px block add `sup.cite a{padding:8px 4px;margin:-8px 0}`.

**H4. Search input triggers zoom-on-focus in iOS Safari.**
- Where: line 81, `.gloss-tools input{…font:inherit}` with `body{font-size:15px}` under 600px.
- Fix: `.gloss-tools input{font-size:16px}`. Known iOS behaviour for inputs under 16px; not tested on a device.

### Low — technical accuracy

- **A4.** One response can carry several tool calls ([5]: "one or more `tool_use` blocks", "Run each tool"). `#flow` text and glossary `turn` imply one. Add "một hoặc nhiều tool call".
- **A5.** "Không còn tool call" is not always a final answer. [5]: the loop also exits on `max_tokens` or `refusal`, "which your application should handle". Add to the stop list in Step 8 and self-check 4: "model bị cắt output giữa chừng hoặc từ chối".
- **A6.** `#tong-quan` table, "Harness nhìn thấy: Mọi thứ" → "mọi thứ nó được cấp quyền truy cập".
- **A7.** `#quan-he` SVG draws "Quyền & sandbox" as one gate before "Thực thi tool". Permission is a decision before the run; sandbox is an OS-level limit during the run. [16] also says sandboxing covers shell commands and their child processes, not every tool. Rename the box "Quyền (cho phép · hỏi · chặn)" and put "trong sandbox" in the "Thực thi tool" subtitle, as `#flow` already does.
- **A8.** `#so-sanh` retry row: separate retrying a model API call (safe) from re-running a tool with side effects (may send or write twice).
- **A9.** Glossary `tool-call`: "chỉ là văn bản" → "chỉ là dữ liệu có cấu trúc do model sinh ra".
- **A10.** `#so-sanh` "Tự động với việc đọc": reading is where untrusted content enters and where secrets get read. Add "đọc trong thư mục dự án".

### Low — missing concepts

- **M4.** Why injection works: instructions and data are tokens in the same context, and the model has no reliable way to tell them apart. One sentence in the `#loi` red callout.
- **M5.** From [3] (fetched): just-in-time loading (keep paths, load via tools), tool-result clearing, structured note-taking. One line each in `#so-sanh` or the glossary.
- **M6.** Running with no human present (CI, scheduled): an "ask" rule has nobody to ask, so it must default to deny. Not sourced.
- **M7.** Prompt caching depends on a stable prefix; changing the system prompt or tool list mid-session discards it. [8] not re-fetched.
- **M8.** "Trial" (one attempt at a task) is defined in source 24 and would tidy the multi-run wording in `#danh-gia`.

### Low — pedagogy and Vietnamese

No diacritic errors found on a full read (manual, not tool-checked). Phrasing:
- `#so-sanh`: "mệt duyệt" → "duyệt theo quán tính (approval fatigue)".
- `#so-sanh` callout: "Khi agent làm dở" can mean half-finished → "làm kém".
- `#so-sanh` callout: "prompt tổng" → "prompt tổng thể".
- Glossary `turn`: note that some tools call this a "step" or "iteration" and use "turn" for the whole user request.
- Stepper panel title "Context model thấy ở lượt tiếp theo" is wrong at steps 8–9 (no next turn) and step 4 shows the "khối viền xanh" hint with nothing highlighted. Use "Context tính đến bước này" and show the hint only when `s.f < s.n`.
- Step 9 trace table on phones: the first cell shows a bare "1" because `td:first-child::before` is hidden. Write "Lượt 1" in the cell.
- Self-check has no question on enforcement. Add: "Vì sao lời dặn trong file hướng dẫn không đủ để chặn một hành động? Dùng gì thay thế?"

### Low — HTML, JS, accessibility

- `#quan-he` SVG, `M700 398 L580 332`: the arrow points Hooks → loop, but the loop fires the hook and the hook answers. Add `marker-start="url(#arr2)"` for a two-way arrow. There is also no "bị chặn / từ chối" edge from the permission box back to the loop, which `#flow` has.
- `#quan-he` mobile version: the Model node sits below the harness box with an empty `<div class="ar"></div>` (line 400) and no connector. Put text in it: "⇅ context đã ghép / text hoặc tool call".
- `#flow` SVG label "phiên, ghi chú, file hướng dẫn" (11px in a 175-wide box) has roughly 3px spare each side by estimate. Shorten to "phiên, ghi chú, file dặn dò" or widen.
- `fold()` (line 782) holds literal combining characters in the regex. Bytes are correct today (`cc 80`–`cd af`), but an editor that normalises Unicode will break search silently. Use `/[\u0300-\u036f]/g`.
- `renderCtx`: `i>=s.f&&s.f<s.n&&s.f!==s.n` has a redundant last term.
- ARIA: `aria-label` on `div.vflow` without a role is not announced reliably (add `role="group"`); `#stepBody` has no `aria-live="polite"`; filter chips lack `aria-pressed`.
- Contrast, computed: `.tag.p4` text `#b4610e` on `#fbeedd` is about 3.9:1 and `.tag.p3` `#1f8a4c` on `#e1f3e8` about 3.8:1 at 12px. Inherited from the template.
- No `prefers-reduced-motion` guard for smooth scrolling and no `color-scheme` declaration, so native checkboxes and the search field stay light in dark mode. Inherited from the template.

## Checks that passed

- Glossary: 49 terms, no duplicate ids, every related id and every `CITES` key resolves (node script over the `T` and `CITES` arrays).
- All 23 sources are referenced; [13] only from the glossary MCP card.
- No external scripts, stylesheets or images. Local links `../`, `../rag/`, `../ai-agent/` exist.
- `localStorage` is wrapped in try/catch in the head script and in `safeGet`/`safeSet`. The shared `rag-theme` key matches the template.
- Stepper highlight logic gives the right blocks at all 9 steps; context values 6/6/6/8/11/12/13 now match the trace table.
- At 390px: no horizontal overflow found statically; grids collapse, tables stack, `pre` wraps, steps and TOC scroll inside their own box; buttons, chips and TOC links are 44px high.
- Dark mode: every SVG fill and stroke uses a token.
- Illustrative numbers carry "minh họa" (intro of `#vi-du`, Step 4, Step 9, context bar, glossary budget, footer).

## Suggested order of work

1. H1, H3, H4 (three CSS lines).
2. Add source 24, then C1, C2, A2, M1, M2 together since they all draw on it.
3. A1, A3, C3 wording.
4. H2 breakpoint change; apply to the template too if you want them consistent.
5. M3 and the low items as time allows.

## Assumptions

- Static analysis is an acceptable substitute for rendering (medium confidence). A real 390px and 768px screenshot pass would confirm or drop H1–H4 and the label-fit note.
- Source 24 is acceptable as an added citation (high confidence it fits; it was fetched this run, but quotes were shortened by the fetch tool).
- Template-inherited issues (H2, contrast, reduced motion, color-scheme) are in scope to report but optional to fix on this page alone (medium confidence).

## Unresolved questions

- Who is editing the page concurrently, and has that pass already covered any item above after 20:37:40?
- Should template-inherited issues be fixed in `rag/index.html` as well?
