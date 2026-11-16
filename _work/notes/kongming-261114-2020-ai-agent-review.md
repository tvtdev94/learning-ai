# Review: AI Agent learning page

File reviewed: `D:\WORKSPACES\learning-ai\ai-agent\index.html` (1064 lines, read in full). Advisory only; the page was not edited.
Reviewer runtime: Kongming on Fable 5.2, 2026-11-14.

## TL;DR

The page is technically sound and well written; there are no critical errors. Fix five major items before publishing: two simulator problems (a failed task labelled "Hoàn thành", and agents that claim a handoff they never performed) and three citation over-claims ([13] on the untrusted-input card, [1] on the sandbox card and on the "công thức", [4] on "phần mềm của bạn mới là bên chạy"). Everything else is minor wording, attribution placement, and accessibility polish.

## How this was checked

- Simulator: extracted `buildRun` from the page and ran all 32 combinations (4 scenarios x 8 guard states) in Node; compared `turns`/`calls` against event counts and the outcome label.
- JS: `node --check` on the inline script passes. Glossary: 54 terms, no duplicate ids, no dangling `rel` ids. Citations: 18 source ids, every `#src-N` anchor resolves, every source is cited at least once. Encoding: no mojibake, file is NFC.
- Citations opened today with WebFetch: [1], [3], [4], [6], [7], [8], [9], [11], [13], [14], [15], [16], [18]. Not re-opened (checked only against the research-notes quotes): [2], [5], [10], [12], [17].
- Mobile, dark mode and SVG layout were checked by static CSS/markup analysis only. **Not rendered in a browser** (your rules require asking which browser first, and this run cannot ask). Items marked "verify visually" need a real 390px check.

## Major findings

| ID | Location | Evidence | Fix |
|----|----------|----------|-----|
| M1 | `#mo-phong`, `render()` line 956-957; scenario `error` line 906-909 | All 8 guard combinations of "Tool trả lỗi liên tục" end with the green label "Hoàn thành trong 3 lần gọi LLM", but the trace shows the order was never looked up and the request was not resolved. Same label for `inject` with "Người duyệt" on, where the refund was refused and the complaint only forwarded. The label derives only from `harm`/`stopped`, so any graceful failure reads as success. | Return an explicit outcome from `buildRun` (for example `done`, `escalated`, `blocked`, `stopped`, `harm`) and map labels: error -> warn "Dừng đúng cách: chưa giải quyết được, agent không bịa và đã chuyển người"; inject without harm -> "Bị tấn công nhưng đã chặn được hậu quả". Keep "Hoàn thành" for `normal` only. |
| M2 | Simulator final answers lines 908, 929; stepper step 7 line 431 | The agent says "đã chuyển yêu cầu cho nhân viên" (error) and "chuyển nhân viên kiểm tra" (inject) with no tool call that does it. Step 7 ends "Mình sẽ tiếp tục theo dõi đơn giúp bạn", which a stateless agent with three tools cannot do. This models as correct the exact failure the page warns about in `#loi` ("Tuyên bố xong khi chưa xong"). | Add a `chuyen_nhan_vien(ly_do)` tool call plus observation before those final answers (error becomes 4 turns / 3 calls, inject 5 turns / 4 calls, both under the 6-turn limit), or word it as the harness doing the handoff. Delete the "tiếp tục theo dõi" sentence, or replace it with "Nếu sau N ngày chưa nhận được hàng, bạn nhắn lại giúp mình". |
| M3 | `#loi` card "Untrusted input", line 729 | "Sau khi agent đọc dữ liệu không tin cậy, siết quyền các hành động tiếp theo (ví dụ không được gửi gì ra ngoài) [13]". OWASP LLM01 has no such mitigation; I asked for it explicitly and the page contains only "Separate and clearly denote untrusted content", least privilege, and human approval. | Move [13] to the end of the first sentence ("Đánh dấu rõ đâu là dữ liệu từ bên ngoài [13]"). Keep the second sentence uncited as a design heuristic, or add a source that actually states it (candidates, not verified by me: Simon Willison's "lethal trifecta", Meta's "Agents Rule of Two"). |
| M4 | `#loi` card "Sandbox" line 727; `#tong-quan` heading line 235 | (a) [1] says only "We recommend extensive testing in sandboxed environments, along with the appropriate guardrails" — that is about testing, not about running agent-generated code in an isolated runtime with limited network and directories. (b) "Công thức dễ nhớ [1]" attributes a six-part formula to [1]; the words "harness" and "goal" do not appear in that article (it gives "LLM enhanced with augmentations such as retrieval, tools, and memory" and "LLMs using tools based on environmental feedback in a loop"). | (a) Reword so the cite covers what the source says: "…Anthropic khuyến nghị thử nghiệm kỹ agent trong môi trường sandbox kèm guardrails [1]", and leave the runtime-isolation description uncited or link `../harness/`. (b) Remove the cite from the heading; put [1] on the LLM/Tools/Vòng lặp/Memory cards only, and add "Cách chia sáu mảnh là của trang này". |
| M5 | `#ben-trong` line 456, `#flow` line 358 | "Phần mềm của bạn mới là bên chạy [3][4]". The cited [4] opens with: "returns a structured call that your application runs (client tools) or that Anthropic runs (server tools)", and lists `web_search`, `web_fetch`, `code_execution` as running on Anthropic's infrastructure. The principle (the model only proposes) is right; "your software" is not always the executor. | Add one sentence after line 456: "Ngoại lệ về *ai* chạy: một số tool dựng sẵn (web search, chạy code) do chính nhà cung cấp thực thi trên máy chủ của họ [4]. Nguyên tắc không đổi: model chỉ đề xuất, một phần mềm khác thực thi." |

## Minor findings

### 1. Technical accuracy

- **A1, line 484.** "mỗi tool call cần một lần gọi LLM [6]" contradicts line 474 (parallel tool calls). Add "ở dạng ReAct gốc".
- **A2, line 474.** "nếu harness hỗ trợ" is off: [3] says "By default the model will determine when and how many tools to use". Reword: "nếu model/API hỗ trợ (thường bật sẵn); harness phải xử lý được nhiều call trong một lượt".
- **A3, line 425.** For a failed `hoan_tien`, "LLM có thể thử lại" is risky advice for a money-moving tool: after a timeout the state is unknown and a retry can refund twice. Add: "Với tool có tác động thật, phải kiểm tra trạng thái trước khi thử lại".
- **A4, lines 548-556.** In the mobile relationship map, "Memory dài hạn" sits inside the box titled "Context (memory ngắn hạn)". The desktop SVG instead draws Memory dài hạn -> LLM directly (line 604), bypassing context. Move the node outside `box1` and point the SVG arrow at the history box so both say "nạp vào context".
- **A5, line 233 vs 238.** The lead says the surrounding software is "tay chân"; the cards then call Tools "tay chân" and Harness the surrounding software. Pick one mapping.
- Verified correct, no change needed: agent loop, model-proposes/app-executes, ReAct, plan-then-execute, short/long-term memory, compaction, workflow vs agent, orchestrator-worker, the four stop conditions, pass@k vs pass^k (matches τ-bench definitions verbatim), LLM-as-judge biases, HITL, least privilege, date arithmetic in the example (06/11 -> 14/11 = 8 days), 4 LLM calls / 3 tool calls / 1 approval, token table (1.200 -> 2.100, consistent with the simulator's 6.600 total).

### 2. Citation fidelity

| Cite | Location | Verdict |
|------|----------|---------|
| [11] 4x/15x | line 693 | Numbers correct. Scope slightly wrong: source says "In our data, agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats" — general Anthropic data, not "hệ thống nghiên cứu của họ". Fix: "Anthropic cho biết trong dữ liệu của họ, agent thường dùng khoảng 4× token so với chat, còn multi-agent khoảng 15×". |
| [15] | line 742 | pass@k/pass^k and database-state comparison are supported. "Đáng tin hơn đọc câu trả lời" is not: the paper contrasts database comparison with "subjective and noisy human judgments", and its reward also checks the agent's output. Reword: "τ-bench chấm bằng cách so trạng thái database cuối với trạng thái mong muốn [15]". |
| [6] | lines 484, 488 | Supported ("It requires an LLM call for each tool invocation", "only plans for 1 sub-problem at a time", larger model "only called for (re-)planning steps"). |
| [7] | line 487 | Plan-and-Solve is a zero-shot prompting method with no tools and no replanning. Place [7] after "thực hiện lần lượt" and keep only [6] after the replan clause. |
| [8] | line 491 | Reflexion reflects **between trials** ("in subsequent trials"), not mid-run, and does not support "nhiều agent trộn hai cách". Reword: "Ý tưởng cho agent tự nhận xét bằng lời rồi dùng nhận xét đó ở lần thử sau được nghiên cứu trong Reflexion [8]". |
| [13] | line 721 | "chưa rõ có cách phòng chống nào chắc chắn" is supported verbatim. "Nguy hiểm nhất" is a ranking neither [12] nor [13] makes; soften to "nguy cơ đặc thù của agent". |
| [14]+[1] | line 726 | Human approval for high-impact actions is supported. "Mệt duyệt" (approval fatigue) is in neither source. Drop the clause or mark it as the page's own remark. "Ưu tiên tool chỉ đọc" (line 725) is supported only by examples in [14]; acceptable. |
| [9] | line 504 | "quan trọng ngang với viết prompt tốt" is not stated; the source calls context engineering "the natural progression of prompt engineering". Reword accordingly. |
| [4] | line 388 | The overview page says nothing about vague descriptions causing wrong tool choice. Keep [1], drop [4] there. |
| [4] | line 362 | Source says `tool_use`/`tool_result` blocks count as tokens; growth per turn is the page's (correct) inference. Acceptable. |
| [1] | line 728 | Max iterations supported; "báo lại, không âm thầm chạy tiếp" is the page's addition. Acceptable. |
| [18] | line 705 | Supported, but it is a 2023 benchmark finding; add "theo một benchmark năm 2023". |
| [1], [3], [5], [16] elsewhere | — | Match their sources. |

Source list: [4] now resolves to `platform.claude.com/docs/en/agents-and-tools/tool-use/overview` (the listed path still loads). [10] was published in TACL in 2024 (from memory, not re-verified today).

### 3. Real gaps for a beginner (three, no padding)

- **G1. Conversation turn vs agent loop.** The page presents two outputs: tool call or final answer. A customer-service agent's most common third move is asking the customer a question; the loop ends, and the next customer message starts a new loop on the same context. Two sentences in `#flow`.
- **G2. Retrying actions with side effects** (see A3). One sentence plus one row in the `#loi` table.
- **G3. Provider-executed tools** (see M5).

### 4. Pedagogy and Vietnamese

- Vietnamese is natural, diacritics are complete, no encoding damage.
- **P1. Unit names drift:** "vòng", "lượt", "bước", "lần gọi LLM" are used for the same thing (checkbox "Giới hạn số bước (tối đa 6 lần gọi LLM)", trace "LLM · lượt 1", stepper "Vòng 1" inside "Bước 2"). State once "1 vòng = 1 lần gọi LLM" and use "vòng" in the simulator.
- **P2. Ordering:** the simulator (section 5) uses prompt injection, quyền tối thiểu and người duyệt before section 9 explains them, and the roadmap puts section 5 in week 2 and section 9 in week 3. Add a two-line primer with a link to `#loi` at the top of `#mo-phong`; no reorder needed.
- **P3. Wording:** "chèn lấp" (line 712) -> "che lấp"; "mệt duyệt" -> "duyệt cho qua vì quá nhiều yêu cầu (approval fatigue)"; heading "bản đồ giấy" (line 262) vs body "chỉ đường in sẵn" — a paper map lets you re-route, so use "tờ chỉ đường in sẵn" in the heading too.
- **P4.** Glossary entry "Harness" prints the raw path "../harness/." as text (line 972) and "RAG" says "Xem trang RAG" with no link; the harness page solves this with an extra link field.

### 5. Simulator (all 32 combinations run)

Step counts, tool-call counts and the token counter are consistent in every combination (`turns` equals the number of think events; tokens = sum of 1200+300i). Beyond M1 and M2:

- **S1, lines 924-926.** With "Quyền tối thiểu" on, the LLM still "calls" `gui_email`, a tool it was never given. Add to the block text: "tool không có trong danh sách nên LLM thường không đề xuất được; nếu nó bịa tên, harness từ chối".
- **S2, line 925.** `danh_sach_khach` is exfiltrated without any tool call that read it. Add a read step or exfiltrate data already in context.
- **S3, line 929.** The final event says "Harness gắn cờ trace có dấu hiệu injection" even when all guards are off and harm occurred. Make that sentence conditional on `!harm`.
- **S4, inject + human off + least on.** Outcome is correctly "Kết cục xấu" (5.000.000đ refunded), but the trace never states the lesson: least privilege does not help when the abused tool is a legitimate one. Add one "Bài học" line.
- **S5, loop + max off.** Label says "có hậu quả thật xảy ra"; for this scenario say "tốn ~49.500 token mà không giải quyết được gì".
- **S6.** `doc_lien_ket` and `gui_email` are not in the section 3 tool list; add a one-line context event as the loop scenario does.
- **S7.** `error` and `loop` ignore two or three of the toggles. Say which guards matter per scenario, since the week-2 task asks the learner to toggle each one.

### 6. JS / HTML / mobile / a11y

- **J1, line 1027.** `fold()` uses literal combining characters U+0300–U+036F inside the regex. It works, but the approved RAG page uses `/[\u0300-\u036f]/g` (rag line 807); copy that form so an editor cannot corrupt it.
- **J2, line 169.** `sup.cite` diverges from the approved RAG rule (`font-size:max(11px,.72em)`, `font-weight:600`, hover underline). The 55 citation links are roughly 14x12px tap targets, far below 40px. Copy the RAG rule and add padding.
- **J3.** Other targets under 40px at 390px (static estimate): glossary "Liên quan" links about 33px tall; the "←" and "◐" header buttons about 34-36px wide (add `min-width:40px`).
- **J4.** `.term p` has no `overflow-wrap`; the example `{"trang_thai":"dang_van_chuyen"}` can overflow a 230px glossary card. Add `overflow-wrap:anywhere`. Verify visually.
- **J5.** SVG sub-labels at 12px drop below 11px for viewports between 901px and about 965px (scale = (vw-50)/1000). Same breakpoint as RAG, so it is system-wide; raise the breakpoint to 980px or use 13px.
- **J6. Verify visually:** tight SVG labels "LLM chỉ đề xuất: tên + tham số" (200px box) and "guardrails, giới hạn bước" (160px box); two opposite arrows share the corridor at x≈600 in the relationship map.
- **J7.** Lines 311 and 324 are zero-size `<rect>` leftovers.
- **J8. a11y:** `#glossSearch` has no `aria-label` (harness page has one); stepper, scenario and chip buttons expose no selected state (`aria-pressed`/`aria-current`); `div.vflow[aria-label]` has no `role`; `aria-live` is on the trace (47 events announced on "Chạy hết") while the outcome box is not live — move it to `#simOutcome`; headings skip levels (h1 -> h3, h2 -> h4); no `prefers-reduced-motion` guard on smooth scroll.
- **J9. Contrast:** dark mode pairs computed at 5:1 or better. Light-mode tag and trace-label colours on their soft backgrounds are about 3.8-4.0:1 at 11-12px (below AA 4.5); inherited from the RAG tokens.
- Confirmed fine: `localStorage` is wrapped in try/catch everywhere (lines 7, 843-844); SVGs are hidden and `.vflow.m-only` shown at 900px and below; no CSS font size under 11px; long strings wrap (`pre-wrap`, `overflow-wrap:anywhere`, `min-width:0` on grid children); stacked tables get `data-label`, including the one inside the stepper template.

### 7. Unsupported numbers or facts

None beyond the citation items above. Illustrative numbers (token table, 6-step limit, 30.000đ) are labelled "minh họa". "4–5 giờ mỗi tuần" is an author estimate, which is fine.

## Outside the reviewed file

`D:\WORKSPACES\learning-ai\index.html` lists only RAG in `TOPICS`, so the "← Chủ đề" link leads to an index with no AI Agent or Harness card. `../harness/index.html` now exists and links back to `../ai-agent/`.

## Fix order

1. M1, M2 (simulator labels and the missing handoff tool call), then S1-S7.
2. M3, M4, M5 and the citation table rows for [11], [15], [7], [8], [9].
3. G1, A3, P1, P2.
4. J1, J2, J8, then a real 390px pass for J3-J6.

## Assumptions

- Severity "major" means "would teach something wrong or cite something the source does not say", not "page is broken". Confidence: high.
- Design-system issues shared with the approved RAG page (J5, J9, header button width) are reported as minor rather than as defects of this page. Confidence: medium; if RAG approval covered only content, raise them.
- WebFetch returns quotes through a summarising model with a 125-character quote cap, so "not present in source" verdicts (M3, [15], [14]) rest on that model's reading of the page. Confidence: medium-high; a manual read of the OWASP LLM01 mitigation list would confirm M3 in one minute.

## Unresolved questions

- Should the root index be updated by this session or the one building the harness page?
- Is the 6-part "công thức" meant to stay aligned with the harness page's "agent = model + harness" framing?

Status: DONE_WITH_CONCERNS
Summary: No critical errors; five major items (two simulator outcome/handoff problems, three citation over-claims) and a set of minor wording, attribution and accessibility fixes. Mobile and dark-mode findings come from static analysis and still need a rendered 390px check.
