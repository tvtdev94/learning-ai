# Mẫu prompt cho agent làm một chủ đề

Phiên chính thay `{SLUG}`, `{PORT}`, `{DATE}` (dạng 2026-11-17), `{YYMMDD}` (dạng 261117), `{OTHER_SLUG}`, `{OTHER_PORT}` rồi gửi nội dung bên dưới cho agent `general-purpose` chạy nền. Nếu chủ đề đã có bản nháp, giữ đoạn "Bản nháp có sẵn"; nếu chưa, giữ đoạn "Trang mới".

---

Working dir: /home/workspace-1/w/tvtdev94/learning-ai (repo root). Timezone Asia/Saigon, today {DATE}. Reply and write all page content in Vietnamese with full diacritics.

## Task
Produce the topic page `{SLUG}/index.html`, ready to publish. Another agent works on `{OTHER_SLUG}/` (port {OTHER_PORT}) in parallel; do not touch its files or port.

- **Bản nháp có sẵn:** the draft exists but was never reviewed or tested. Improve it, do not rewrite from scratch.
- **Trang mới:** no page exists yet. Research first, then build the page from scratch following the brief's page structure.

## Read first
- `_work/topic-session-brief.md` — the standard brief: page structure, design system, evidence rules, mobile standards, kongming review, Orca test, cleanup. Follow it exactly. Use access date {DATE} for sources.
- `_work/notes/research-261114-2040-{SLUG}-sources.md` if it exists (written 2026-11-14; re-open every URL before relying on it), else create `_work/notes/research-{YYMMDD}-{SLUG}-sources.md`.
- `_work/notes/researcher-261114-2030-next-ai-topics.md` — scope and starting sources for this topic.
- `rag/index.html` — reference design (read only). Copy its light-mode colour tokens exactly (--accent/--p1 #2559b8, --ok/--p3 #16703d, --warn/--p4 #8f4c0a, --bad #a82f2f, --p2 #7440b8) and its desktop/mobile diagram breakpoint (1080px).

## Steps
1. Research with WebSearch and WebFetch (load via ToolSearch "select:WebSearch,WebFetch"). Every key claim needs a source you actually opened. Write evidence lines to the source-notes file.
2. Build or improve the page per the brief.
3. Spawn the `kongming` agent (Agent tool, subagent_type "kongming") to review. Give it: page path, source-notes path, learner description from the brief, and the brief's check list. Kongming must not edit files; it writes `_work/notes/kongming-{YYMMDD}-{SLUG}-review.md`.
4. Re-check every finding yourself; fix valid ones; one-line reason for each rejection. Append a "Kết quả áp dụng" section to the review file.
5. Internal links: only to folders that exist and are published (not listed in `_config.yml` `exclude`), plus `../{OTHER_SLUG}/` if genuinely useful. Never link to a slug without a folder.
6. Orca test on port {PORT}: `python3 -m http.server {PORT} --bind 127.0.0.1` in background from repo root; `orca tab create --url http://127.0.0.1:{PORT}/{SLUG}/ --json`; always pass `--page <id>`. Viewports `orca viewport --width 390 --height 844 --mobile` and `orca viewport --width 1280 --height 900 --mobile` (without `--mobile` Orca ignores the size and stays at 512px); re-apply after every reload/goto. Both themes via `document.documentElement.dataset.theme`. Check: console 0 errors; scrollWidth == innerWidth at 390; every `#src-N` exists and every source is cited; every chart/SVG/simulation correct (no clipped or overlapping text, arrows correct, legend colours match, numbers match your own recalculation, all interactive states); mobile text ≥ ~11px; body ≥ 15px; tap targets ≥ 40px, including citation `[N]` links (copy the `/* cite-tap */` CSS block from the end of `rag/index.html`'s `<style>`); coloured text contrast ≥ 4.5:1 in both themes. Take mobile screenshots and look at them.

## Allowed to modify
ONLY `{SLUG}/index.html` and this topic's files in `_work/notes/`. Do NOT edit root `index.html`, `_config.yml`, `PROGRESS.md`, other topic folders. Do NOT run git. Do NOT add PWA tags (the main session does that).

## Cleanup (required)
Stop your http.server and confirm port {PORT} is free (`ss -ltnp | rg {PORT}`). Close your Orca tab. Delete only the screenshot files you created, by exact filename — never other files in /tmp/orca-browser-screenshots/. Delete your temp scripts. Remove localStorage keys you set.

## Report back
Short report: sections and concept count; source count and notes path; kongming findings fixed vs rejected (reasons); charts tested with results; verify evidence (command outputs); cleanup result; internal links to unpublished pages (if any); homepage card: description (≤160 chars), subtitle (≤35 chars), 3 short tags, 1 emoji. End with:
Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
Summary: 1–2 sentences
