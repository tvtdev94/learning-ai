# Nguồn cho bài AI tips 2: 10 mẹo dùng Claude Code hằng ngày

Truy cập 2026-11-20. Mỗi dòng: khẳng định → URL → câu trích.

- Claude không thấy thông tin chưa từng nằm trong repo → https://code.claude.com/docs/en/best-practices → "What it can't find is the information that was never in the repo"
- Đưa file bằng @, dán ảnh, pipe output → best-practices → "pipe it in from your shell with `cat error.log | claude -p \"what's going on here\"`"
- Phỏng vấn rồi viết SPEC.md, mở phiên mới → best-practices → "Interview me until you could write the spec, then write it to SPEC.md."
- Plan mode không sửa source tới khi duyệt; Shift+Tab, /plan, --permission-mode plan; Esc trước ở màn duyệt → https://code.claude.com/docs/en/permission-modes → "Plan mode tells Claude to research and propose changes without making them."
- Auto mode là chế độ khởi đầu từ v2.1.283 → permission-modes → "With Claude Code v2.1.283 or later, auto mode is the built-in starting permission mode for interactive terminal and VS Code sessions."
- CLAUDE.md: nội dung nên ghi, /init, dưới 200 dòng, /context all, CLAUDE.local.md, .claude/rules với paths: → best-practices → "Keep CLAUDE.md short"
- Phép kiểm tra, xin bằng chứng, /code-review → best-practices → "Give Claude something it can run that comes back pass or fail."
- Hook, deny rule, Stop hook exit 2 → best-practices → "deny rules hold in every permission mode, including auto and bypassPermissions"
- Esc, Esc Esc, /rewind, checkpoint không theo dõi Bash, /clear sau hai lần sửa → best-practices → "after two failed corrections run /clear and write a better prompt instead of a third"
- /clear, /compact có trọng tâm, /usage, tắt MCP trong /mcp → best-practices → "Keep cost and context down"
- /btw không thêm vào lịch sử → https://code.claude.com/docs/en/interactive-mode → "Use /btw to ask a question about your current work without adding to the conversation history."
- Effort, ultrathink, be ambitious → best-practices → "Phrases like think step by step or be thorough are ordinary prompt text rather than keywords."
- Subagent: khi nào đáng, chi phí, reviewer tools: Read, Grep, Glob, model: haiku → best-practices → "Know what subagents cost"
- Worktree claude -w, .worktreeinclude, claude -p với --allowedTools, dontAsk, --max-turns, --output-format json → best-practices → "Run sessions in parallel", "Run Claude from a script"
- Phím tắt Esc, Esc Esc, Shift+Tab, !, @, Ctrl+R, Ctrl+G, Ctrl+B, Ctrl+O, Ctrl+T → interactive-mode → bảng "General controls" và "Quick commands"
- Bảng thói quen cũ → best-practices → "What you can stop doing"
- Bài blog cũ anthropic.com/engineering/claude-code-best-practices trả 308 sang code.claude.com/docs/en/best-practices (kiểm bằng WebFetch).

## Added after the review (2026-11-20)
- [4] https://code.claude.com/docs/en/checkpointing: "Any other subagent: rewinding restores only the files Claude had already edited in your conversation. The subagent's edits to other files stay". Used for the subagent caveat in tip 6.
