# Review: 10 everyday Claude Code tips (AI tips post 2)

Date: 2026-11-20 (Asia/Saigon). Advisory only; the article was not edited.
File reviewed: `so-tay/ai-tips/claude-code-daily-tips/index.html` (mtime 10:37:29, unchanged during the review; the live page is byte-identical to it).
Method: raw markdown of the official docs fetched from `https://code.claude.com/docs/en/<page>.md` and grepped for each claim; layout measured in headless Chrome at 390px and 360px, both languages.

## TL;DR

No invented command, flag or shortcut was found: every one checks out against the live docs. The article is a faithful condensation of the best-practices page. What needs fixing is (a) four caveats the condensation dropped, which make a few sentences stronger than the docs, (b) two mobile/i18n defects, and (c) a handful of Vietnamese phrases. The biggest editorial gap is session resume and skills, which a daily user would expect.

## Findings, by priority

### P1: claims stronger than the docs

**1. Line 168-169 (tip 2): "does not edit until you approve" has an exception.**
Evidence, permission-modes: "Except in interactive terminal sessions with bypass permissions available, edits stay blocked until you approve the plan." cli-reference, `--allow-dangerously-skip-permissions`: "While `bypassPermissions` is in the cycle of an interactive terminal session, most edits and commands Claude attempts in plan mode run with no prompt, before you approve a plan."
Fix: add one sentence, for example vi "Ngoại lệ: nếu bạn mở phiên với `--dangerously-skip-permissions` thì plan mode không còn chặn sửa file." Many daily users launch that way, so this matters.

**2. Line 220-221 (tip 5): "Block reading `.env`" overstates the deny rule.**
Evidence, best-practices: "The `Read` rule *does* catch `cat .env` ... It won't catch a script that opens the file." and "for anything security-related you want both" (deny rules plus `/sandbox`).
Fix: add vi "Rule này chặn tool Read và các lệnh đọc file quen thuộc như `cat .env`, nhưng không chặn một script tự mở file; cần chắc hơn thì bật thêm `/sandbox`." and the en equivalent.

**3. Line 227-228 (tip 5): the Stop hook is not unbounded.**
Evidence, best-practices: "the turn doesn't end until the typecheck passes or the block limit is reached" and "If the hook blocks eight stops in a row with no tool call between them, Claude Code overrides the next block and ends the turn. To raise the cap, set `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`."
Fix: add vi "Nếu hook chặn tám lần liên tiếp mà giữa chừng không có tool call nào, Claude Code sẽ bỏ qua lần chặn kế tiếp và kết thúc lượt." Also say the file is `.claude/settings.json`, as the deny example does.

**4. Line 258 and 265 (tip 7): the `/usage` breakdown depends on the plan.**
Evidence, best-practices: "On Pro, Max, Ultra, Team, and Enterprise it breaks your usage down by skill, subagent, plugin, and MCP server." costs: "The Session block in `/usage` shows API token usage and is intended for API users."
Fix: prefix "Trên gói Pro, Max, Ultra, Team và Enterprise, ..." / "On Pro, Max, Ultra, Team and Enterprise plans, ...". The item also has no citation; add `[1]`. The `/clear` and `/compact` items (lines 255-256, 262-263) have none either.

### P2: accuracy nuances worth one clause each

**5. Line 244-245 (tip 6): two checkpoint limits a daily user hits.**
Evidence, checkpointing: "Any other subagent: rewinding restores only the files Claude had already edited in your conversation. The subagent's edits to other files stay" and "Claude Code keeps file snapshots for the 100 most recent checkpoints in a session."
Fix: extend the caveat to "file chỉ bị đổi qua Bash, và file do subagent sửa, thì không được khôi phục". The 100-checkpoint limit is optional.

**6. Line 315-322 (tip 10): the loop differs from the docs example without saying so.**
Evidence, best-practices: the docs loop is `claude --bare -p ...`; "`--bare` ... doesn't use your claude.ai login: auth comes from `ANTHROPIC_API_KEY`"; "a run that hits the turn limit exits with an error instead".
Dropping `--bare` is reasonable for subscription users, but then the repo's hooks (including the Stop hook from tip 5) and `CLAUDE.md` load on every iteration. Fix: add one sentence on `--bare` and its API-key requirement, and mention that a run hitting `--max-turns` exits with an error. `--max-budget-usd` (cli-reference: "Stop the run once estimated spend on API calls reaches this amount (print mode only)") belongs in the same list.

**7. Line 313-314 (tip 10): dependencies are missing too.**
Evidence, best-practices: "gitignored files like `.env` aren't there and dependencies aren't installed."
Fix: add "và dependency chưa được cài" / "and dependencies aren't installed".

**8. Line 355 (old habits): "tự làm hết việc" drops the hedge.**
Evidence: "Current models usually carry on through an agreed task without being told". The en text has the same gap ("carry an agreed task through").
Fix: "thường tự làm hết" / "usually carry".

**9. Line 182-183 (tip 2): auto mode is the start mode for interactive sessions only.**
Evidence, permission-modes: "auto mode is the built-in starting permission mode for interactive terminal and VS Code sessions"; the same page says it needs a supported model and that an organization can turn it off.
Fix: optional; "phiên tương tác mới" is enough.

**10. Line 277 and 283 (tip 8): `max` is session-only.**
Evidence, commands: "`max` is session-only." model-config: "`xhigh` runs as `high` on Opus 4.6."
Fix: optional half-sentence.

### P2: HTML, JS and mobile

**11. Line 6 and 382-388: the tab title stays Vietnamese in English.**
Measured: with `?lang=en`, `document.title` is "10 mẹo dùng Claude Code hằng ngày · AI tips". The sibling avoids this only because its title is language-neutral. `og:title` and the meta description (lines 17-19) are Vietnamese only, which is acceptable for static tags.
Fix: set `document.title` inside `setLang()`.

**12. Line 116: stacked tables lose their column labels on phones.**
`table.stack thead{display:none}` hides "Thay vì / Hãy viết" (line 153) and "Thói quen cũ / Nay làm gì" (line 351) at or below 600px. At 390px the reader sees two unlabeled blocks per row and cannot tell the bad prompt from the good one. The shortcuts table is fine because the key is visually distinct.
Fix: per-language label spans inside each `td`, shown only in the stacked layout, or keep those two tables as two-column tables on mobile.

**13. Line 161: the pipe example is half hidden at 390px.**
Measured: the `code` box has scrollWidth 421 against clientWidth 223 at 390px (193 at 360px, where `claude -w feature-auth` also scrolls). It scrolls, so nothing is lost, but the Copy button takes a third of the row.
Fix: at or below 600px, stack the button above the command or let this one wrap.

**14. Lines 222, 229, 296, 317: the four `pre` blocks have no Copy button.**
The two one-line commands have one, while the multi-line JSON, agent file and loop, which are the things a reader would copy, do not. The sibling gives its file a Copy button (`global-claude-md/index.html:140`).
Fix: reuse the `.file` + `.file-bar` pattern already in this page's CSS (lines 82-85), with the path as the bar label. That also removes the dead CSS noted next.

**15. Low: leftovers.**
- Lines 77-85 and 95-98: `.why`, `.groups`, `.file*`, `.links` are unused here. Lines 109 and 111 redefine `.tip` and `.toc` margins set at lines 65 and 69.
- Line 398: no fallback when `navigator.clipboard` is missing (plain http). It is fine on the https site.
- Lines 132-144: the contents list has no entry for `#old`.
- Tap height under 40px at 390px: the "bài 1" inline link (23px), the three source links (19px) and the footer back link (20px). Inline links are normally exempt; the footer link could take `min-height:40px` like `.back`.
- No horizontal overflow, no text under 12px and no JS exceptions at 390px or 360px in either language.

### P3: Vietnamese quality and parity

Diacritics are complete and parity is tight; no paragraph exists in one language only. Phrases that read as translation:

| Line | Now | Suggested |
| :- | :- | :- |
| 129 | The lead repeats the H1, and "tài liệu chính thức" appears twice in two sentences | "Mười mẹo dưới đây lấy từ tài liệu chính thức của Claude Code. Lệnh, cờ và phím tắt đều đã đối chiếu lại ngày 20/11/2026." The en line 130 has the same repetition. |
| 150 | "Nêu tên file, tả triệu chứng, nói rõ thế nào là xong, bạn đỡ được..." | "...nói rõ thế nào là xong thì bạn đỡ được một vòng sửa qua lại." |
| 162 | "một định nghĩa "xong" bằng văn bản" | "tiêu chí "xong" đã ghi thành văn bản" |
| 188 | "lấy đi một chút chú ý của Claude ở mọi việc" | "chiếm một phần chú ý của Claude trong mọi việc" |
| 194 | "điều bạn đã phải sửa Claude hai lần" | "điều bạn đã phải nhắc Claude hai lần" |
| 212 | "Muốn người khác soát" (reads as a human; en says "a second pair of eyes") | "Muốn có một lượt soát độc lập" |
| 227 | "Claude bị gửi lại làm tiếp" | "Claude phải quay lại làm tiếp" |
| 244 | "về một prompt trước" | "về thời điểm của một prompt trước đó" |
| 246 | "gộp những gì bạn vừa biết" | "gộp những gì bạn vừa rút ra" |
| 258, 294 | "usage đi vào đâu", "tính chung vào usage của bạn" | "mức dùng của bạn tiêu vào đâu", "tính chung vào hạn mức của bạn" |

"Phép kiểm tra / phép kiểm" is a coined term but is used consistently; keep it.

### P3: missing tips a daily user would expect

All of these are in the same best-practices page and verified there. In order of value:

1. **Resume a session.** "`/rename oauth-migration` in the session names it, so that `claude --resume oauth-migration` from your shell picks it back up later, checkpoints included. `claude --continue` resumes the most recent one." Line 255 says "để sau này quay lại" without saying how; commands: "Pass a name to label the previous conversation in the `/resume` picker."
2. **Skills for team procedures.** "That kind of knowledge goes in a skill ... `.claude/skills/<name>/SKILL.md`", with `disable-model-invocation: true` for side effects. Tip 5 mentions "skill" at line 218 without ever introducing it.
3. **`/doctor` and `/doctor prompt-audit`** to trim `CLAUDE.md` ("suggests cuts for anything Claude can already work out from the code"). Fits tip 3.
4. **`/goal`** as the middle option between a prompt and a Stop hook, and **`/verify`** after Claude says it is done. Both fit tip 4.
5. **The formatter `PostToolUse` hook** and "`write a hook that blocks edits to the migrations folder` works as a prompt, and `/hooks` shows the result". Tip 5 shows only the Stop hook.
6. **Model choice**: "`/model fable`", "Sonnet costs less on routine work"; shortcut `Option+P` / `Alt+P` "Switch model".
7. **Shortcut rows**: `Ctrl+V` "Paste image from clipboard" (tip 1 says paste a screenshot but not how), `Shift+Enter` for multi-line input, and `Ctrl+G` at the plan approval prompt ("open the proposed plan in your default text editor and edit it directly before Claude proceeds").
8. **Prompt cache**: "lasts about an hour on a subscription and five minutes on an API key". This explains tip 7's cost claim.

Recommendation: fold 1, 3, 4 and 7 into existing tips as one sentence each, and leave 2, 5, 6 and 8 for a later post. That keeps the count at ten.

### Public-repo check

No work-project, company or client names. Every identifier (`src/auth/`, `oauth-migration`, `feature-auth`, `reviewer`, `files.txt`, the logger API) comes from the docs examples. Note that `_work/notes/` is tracked by git, so this report and the sources note are public if committed; neither contains private data.

## Verification table for the flagged claims

| Claim (article line) | Result | Source and quote |
| :- | :- | :- |
| `/btw` (257) | OK | interactive-mode: "Use `/btw` to ask a question about your current work without adding to the conversation history." It "has no tools". |
| `/usage` breakdown (258) | OK, plan-limited (finding 4) | best-practices, quoted above |
| `/effort low/high/xhigh`, `max` (275-277) | OK | best-practices: "Raise it with `/effort high` or `/effort xhigh`"; "Save `max` for a hard problem you want Claude to work through without you" |
| `ultrathink` (278, 354) | OK | model-config: "Include `ultrathink` anywhere in your prompt to request deeper reasoning on that turn without changing your session effort setting." |
| `be ambitious` (286) | OK | best-practices: "One phrase that does still help is `be ambitious`." |
| `/rewind`, Esc Esc (244, 331) | OK | checkpointing: "Run `/rewind`, or press `Esc` twice when the prompt input is empty, to open the rewind menu." interactive-mode: "double `Esc` clears it and saves the draft to history so `Up` recalls it" |
| Checkpoints skip Bash-only files (244) | OK, incomplete (finding 5) | checkpointing: "A file that only Bash commands changed isn't tracked and stays as it is." |
| `/context all` (202) | OK | memory: "To confirm the file loaded, run `/context all` in a session and check the list under **Memory files**." |
| `CLAUDE.local.md` + `.gitignore` (202) | OK | memory: "create a `CLAUDE.local.md` at the project root ... Add `CLAUDE.local.md` to your `.gitignore`" |
| `.claude/rules/` with `paths:` (202) | OK | best-practices: "put it in `.claude/rules/` with a `paths:` filter so it only loads when Claude is actually working there" |
| Under 200 lines (202) | OK | memory: "target under 200 lines per CLAUDE.md file" |
| `/init` (202) | OK | best-practices: "`/init` generates a starting version from your codebase. From there the work is mostly removing lines." |
| `claude -w` (312) | OK | cli-reference: "`--worktree`, `-w`: Start Claude in an isolated git worktree at `<repo>/.claude/worktrees/<name>`" |
| `.worktreeinclude` (313) | OK | best-practices: "list the gitignored files you need in a `.worktreeinclude` at the repo root (same syntax as `.gitignore`) and Claude Code copies them into every worktree it creates" |
| `dontAsk` (315) | OK | permission-modes: "Claude Code auto-denies every tool call that would otherwise prompt you"; "never appears in the cycle; set it with `--permission-mode dontAsk`" |
| `--max-turns`, `--output-format json`, `--allowedTools` (315) | OK | cli-reference: "Limit the number of agentic turns (print mode only)"; "options: `text`, `json`, `stream-json`"; "Tools that execute without prompting for permission" |
| Shift+Tab order (171) | OK | permission-modes: "From `auto`, the first press switches to `default`, and the cycle then runs `default` → `acceptEdits` → `plan`." |
| `/plan` prefix, `--permission-mode plan` (172-173) | OK | permission-modes: "Enter plan mode by pressing `Shift+Tab` or prefixing a single prompt with `/plan`." |
| Esc at plan approval (174) | OK | permission-modes: "With no approval prompt open, press `Shift+Tab` again to leave plan mode. At the approval prompt, press `Esc` first, since pressing `Shift+Tab` there approves the plan." |
| v2.1.283 auto mode (182) | OK | permission-modes: "With Claude Code v2.1.283 or later, auto mode is the built-in starting permission mode for interactive terminal and VS Code sessions." |
| `/code-review` (212) | OK | best-practices: "`/code-review` reviews the diff in a fresh subagent that never saw your conversation." skills: "The subagent doesn't see your conversation history". |
| Stop hook, exit 2 (227-235) | OK, cap omitted (finding 3) | best-practices: "Exit code 2 is what blocks the stop. Whatever the command prints to stderr goes back to Claude as the reason it can't finish yet". JSON identical to the docs. |
| Deny rules in every mode (220) | OK | best-practices: "`deny` rules hold in every permission mode, including auto and `bypassPermissions`" |
| `/clear <name>`, `/compact <focus>` (255-256) | OK | commands: "`/clear [name]` ... Pass a name to label the previous conversation in the `/resume` picker"; "`/compact [instructions]`" |
| `/mcp` to turn servers off (259) | OK | best-practices: "Connected servers add their tool names and instructions to the context even when you're not using them" |
| Subagent file, `tools:`, `model: haiku` (294-305) | OK | best-practices; the agent file is identical to the docs. |
| Shortcut table (330-339) | OK, all ten rows | interactive-mode General controls and Quick commands; "Backgrounds Bash commands and agents. Tmux users press twice"; "Keyboard shortcuts may vary by platform and terminal." |
| Old-habits table (353-356) | OK except finding 8 | best-practices "What you can stop doing" |

NOT FOUND: none.

## Assumptions

- The report is in English because the request was; the fix strings are in Vietnamese where the article text is. Confidence: medium.
- Mobile checks were run on the local file over `file://`. The live page returned HTTP 200 and is byte-identical, so the results carry over. Confidence: high.
- Screenshots were not taken. Finding 12 is derived from the CSS at line 116, not from a rendered image. Confidence: high.
- Keeping the count at ten is treated as a fixed editorial choice. If the author prefers completeness, promote "resume a session" and "skills" to full tips.

Status: DONE_WITH_CONCERNS
Summary: Every command, flag and shortcut is verified against the live docs, with none invented. Four sentences are stronger than the docs (plan mode with bypass, the `.env` deny rule, the Stop hook cap, the `/usage` plan limit), and there are two mobile/i18n defects (English tab title, unlabeled stacked tables).
Concerns/Blockers: none blocking. Findings 1-4 should be fixed because the lead promises that everything was checked against the docs.

## Resolution (2026-11-20)

Fixed in the article:
- P1 findings 1-4.
- P2 findings 5-9 and 11-15.
- The whole P3 Vietnamese table and the English lead.
- Missing tips 1, 3, 4 and 7, each folded into its tip, verified against the docs .md:
  - 1: `/rename` with `claude --resume` and `claude --continue`;
  - 3: `/doctor` and `/doctor prompt-audit`;
  - 4: `/verify` and `/goal`;
  - 7: `Ctrl+V`, `Shift+Enter`, and `Ctrl+G` at plan approval.

Not applied:
- Finding 10: optional; the `max` and `xhigh` details add little for this post.
- Finding 6: `--max-budget-usd` was left out to keep the script flags short; `--bare` and the turn-limit error exit were added.
- Finding 15: no clipboard fallback. The site is served over https, where `navigator.clipboard` exists.
- Missing tips 2, 5, 6 and 8: left for a later post, as the review recommends, to keep ten tips.
