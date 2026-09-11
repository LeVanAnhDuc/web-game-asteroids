# Run meta — 2026-09-11

- product: Duck Drift, static export, `http://127.0.0.1:4173/`
- identity verified: `<title>Duck Drift</title>`, H1 `DUCK DRIFT`, 4 buttons Chơi/Bảng điểm/Cách chơi/Tuỳ chỉnh, difficulty row Dễ·Thường·Khó, no "Ducker" login form
- how started: `yarn install` (node_modules was absent) -> `yarn build` -> `node scripts/serve.mjs 4173 out`
- browser tool: playwright MCP (rank 1), real prefix `mcp__plugin_playwright_playwright__*`
- capability probe:
  - navigate OK · click OK · keyboard OK · screenshot OK · console OK · viewport (browser_resize) OK
  - **network throttle MISSING** — playwright MCP has no throttle tool; chrome-devtools MCP is not loaded in this session at all. p04 (Dũng, slow 3G) runs at full LAN speed. Declared, not silent.
- concurrency: **1 session at a time**, not the 4 in orchestration.md. Playwright MCP here is one shared browser; concurrent personas would share one page and overwrite each other's viewport.
- console error present on every page load, unrelated to UX: `404 /favicon.ico`
- agent file fix: `.claude/agents/ux-persona.md` had template tool names (`mcp__playwright__*`); rewritten to the real plugin prefixes before dispatch.

## Session list (7 live red routes + 2 blind = 9)

| # | Session | Persona | Viewport |
| --- | --- | --- | --- |
| 1 | RR-01 vào ván đầu | p01 Trang | 1440x900 |
| 2 | RR-02 biết phím trước khi chết | p03 Ngân | 720x450 (= 1440x900 @ zoom 200%) |
| 3 | RR-03 đổi mức dễ hơn | p04 Dũng | 375x720 |
| 4 | RR-04 tuỳ chỉnh một ván | p05 Minh Anh | 1440x900 |
| 5 | RR-05 bảng điểm của ai | p02 Khoa | 1024x768 |
| 6 | RR-06 tạm dừng rồi quay lại | p06 Hưng | 1440x900 |
| 7 | RR-07 ghi tên sau hết lượt | p02 Khoa | 1024x768 |
| 8 | Phiên mù #1 | p04 Dũng | 375x720 |
| 9 | Phiên mù #2 | p05 Minh Anh | 1440x900 |

---

## ABORTED — phiên này không chạy được persona

Canary (p01/RR-01) trả về mù: trong subagent, `mcp__plugin_playwright_playwright__*` không
resolve, nó rơi sang `mcp__claude-in-chrome__*` và extension Chrome không kết nối.

Đã chẩn đoán xong bằng một probe riêng (agent `general-purpose`, cùng phiên):
plugin playwright **có** tới được subagent — `browser_navigate`, `browser_snapshot`,
`browser_resize`, `browser_click`, `browser_close`... đều resolve bình thường.

=> Nguyên nhân là phiên này **cache định nghĩa agent lúc khởi động**, với dòng `tools:` cũ
(`mcp__playwright__*` — tên server không tồn tại ở máy này). Sửa file giữa phiên không có
hiệu lực. Wildcard thì vẫn hoạt động: chính `mcp__claude-in-chrome__*` trong list cũ đã
được cấp và gọi được.

Người dùng chọn: **khởi động lại phiên**, giữ đúng phương pháp (persona chỉ có trình duyệt,
không đọc được code). Không chọn phương án chạy bằng agent `general-purpose`.

## Việc đã làm xong, phiên sau ĐỪNG làm lại

- `node_modules/` đã cài (`yarn install`, ~48s) — nó vắng mặt lúc đầu.
- `out/` đã build (`yarn build`, ~253s). Còn dùng được nếu `src/` không đổi.
- `.claude/agents/ux-persona.md` dòng `tools:` đã sửa sang tiền tố thật:
  `ToolSearch, mcp__plugin_playwright_playwright__*, mcp__plugin_chrome-devtools-mcp_chrome-devtools__*, mcp__claude-in-chrome__*`
- Dấu hiệu nhận biết app đã đối chiếu xong ở `:4173` (xem phần trên).
- Dò năng lực trình duyệt đã xong (xem phần trên): thiếu throttle mạng, và phải chạy tuần tự.

## Việc phiên sau phải làm đầu tiên

1. `node scripts/serve.mjs 4173 out` — server của phiên trước chết cùng phiên đó.
2. Đối chiếu lại dấu hiệu nhận biết (bước này không được bỏ, dù phiên trước đã làm).
3. Canary một phiên `ux-persona` trước khi phát cả dàn: nếu nó báo resolve được
   `mcp__plugin_playwright_playwright__browser_navigate` thì mới đi tiếp.
