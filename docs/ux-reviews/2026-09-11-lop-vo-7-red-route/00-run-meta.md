# Run meta — Duck Drift UX persona review · 2026-09-11

## Sản phẩm và cách bật

- `http://127.0.0.1:4173/` — bản export tĩnh, đúng thứ GitHub Pages phục vụ.
- `yarn install` (node_modules vắng mặt) → `yarn build` → `node scripts/serve.mjs 4173 out`.
- **Đã đối chiếu dấu hiệu nhận biết** trước khi phát phiên nào: `<title>Duck Drift</title>`,
  H1 `DUCK DRIFT`, bốn nút `Chơi · Bảng điểm · Cách chơi · Tuỳ chỉnh`, dãy `Dễ · Thường · Khó`
  phía trên nút Chơi. Không có form đăng nhập, không có chữ "Ducker". Đúng app.

## Công cụ trình duyệt

**playwright MCP (hạng 1)**, tên thật ở máy này là `mcp__plugin_playwright_playwright__*`.
Không rơi xuống hạng 2 hay 3 — `chrome-devtools-mcp` không nạp được ở phiên này,
`claude-in-chrome` thì extension không kết nối.

Dò năng lực: điều hướng ✔ · click ✔ · nhập liệu ✔ · chụp màn hình ✔ · đọc console ✔ ·
đặt viewport ✔ · **throttle mạng ✘**.

## Bốn điều làm giảm giá trị của lần chạy này — phải đọc trước khi diễn giải

1. **Không throttle được mạng.** playwright MCP không có tool throttle; chrome-devtools MCP
   không có ở phiên này. Hai phiên của p04 Dũng (RR-03, phiên mù #1) chạy ở tốc độ LAN thay
   vì 3G chậm. Mọi kết luận về thời gian tải, về trạng thái chờ, về việc "bác ấy tưởng trang
   đang tải" đều **không có dữ liệu** đỡ lưng.

2. **Chạy tuần tự, không phải 4 phiên song song** như `orchestration.md` mặc định. playwright
   MCP ở máy này là một browser dùng chung; persona chạy song song sẽ ghi đè viewport của
   nhau. Việc này chỉ giãn thời gian, không cắt phạm vi — vẫn phủ hết 7 Red Route.

3. **`localStorage` rò rỉ giữa các phiên.** Đây là lỗi của người điều phối, không phải của
   sản phẩm. Cả 9 phiên dùng **một profile duy nhất** và storage **không được xoá giữa các
   phiên**. Bằng chứng: phiên mù #1 (p04) thấy mức "Khó" chọn sẵn — thứ Khoa để lại từ RR-07;
   ảnh chụp `localStorage` lúc 07:53 nằm trong `00-verify-nghich-ly-bang-diem.md`.
   - Chỉ **phiên 1 (p01/RR-01)** và **phiên 9 (p05/phiên mù #2)** có trạng thái sạch thật.
   - Hệ quả: **mọi kết luận về trạng thái mặc định của lần chơi đầu và về bảng điểm trống ở
     các phiên 2-8 đều không đáng tin.** Cụ thể, các persona báo mức được chọn sẵn khác nhau
     (Thường / Dễ / Khó) — đó là dấu vết của nhau, không phải hành vi của sản phẩm.
   - Phát hiện nặng nhất của lần chạy (nghịch lý 40/20 điểm) **đã được kiểm chứng lại trên
     profile sạch** và **không** phải do rò rỉ này. Xem `00-verify-nghich-ly-bang-diem.md`.

4. **Trần của phương pháp trên một game 60Hz.** Subagent qua MCP mất hàng giây mỗi thao tác,
   nên **không phiên nào chơi được phần gameplay** — không né, không bắn trúng gì. Mọi
   `done_when` đều nằm ở lớp vỏ. **"Persona chết nhanh" không phải phát hiện UX**; nó là giới
   hạn công cụ. Phát hiện chỉ được rút ra từ chỗ persona *không hiểu phải làm gì*.

## Danh sách phiên — 7 Red Route live + 2 phiên mù = 9 phiên

| # | File | Persona | Red Route | Viewport | Kết cục |
| --- | --- | --- | --- | --- | --- |
| 1 | `p01-RR01.md` | p01 Trang | RR-01 vào ván đầu | 1440x900 | đạt đủ, 1 bước |
| 2 | `p03-RR02.md` | p03 Ngân (chỉ bàn phím) | RR-02 biết phím trước khi chết | 720x450 (zoom 200%) | đạt đủ, 4 bước |
| 3 | `p04-RR03.md` | p04 Dũng (điện thoại) | RR-03 đổi mức dễ hơn | 375x720 | **bỏ cuộc** |
| 4 | `p05-RR04.md` | p05 Minh Anh (negative) | RR-04 tuỳ chỉnh một ván | 1440x900 | đạt một phần |
| 5 | `p02-RR05.md` | p02 Khoa | RR-05 bảng điểm của ai | 1024x768 | đạt một phần |
| 6 | `p06-RR06.md` | p06 Hưng (viêm khớp) | RR-06 tạm dừng rồi quay lại | 1440x900 | **đạt đủ, đúng min_steps** |
| 7 | `p02-RR07.md` | p02 Khoa | RR-07 ghi tên sau hết lượt | 1024x768 | đạt gần đủ |
| 8 | `p04-BLIND1.md` | p04 Dũng | phiên mù, không mục tiêu | 375x720 | **bỏ cuộc** |
| 9 | `p05-BLIND2.md` | p05 Minh Anh | phiên mù, power user | 1440x900 | dừng chủ động |

6 persona, 9 phiên. Không phiên nào chạm trần 40 hành động của chính nó (phiên 5 gần chạm).

## File không phải log persona

- `00-verify-nghich-ly-bang-diem.md` — bước kiểm chứng do người điều phối chạy trên profile
  sạch, để loại trừ khả năng phát hiện nặng nhất chỉ là hậu quả của rò rỉ `localStorage`.
  Được dùng để **xác nhận**, không được dùng làm dẫn chứng thay lời persona.
- `00-run-meta-phien-truoc-bi-huy.md` — meta của lần chạy 13:42 bị huỷ vì persona chạy mà
  không có trình duyệt (phiên Claude Code cache tên tool MCP cũ). Không có log persona nào.

## Chi tiết chung cho cả 9 phiên

Console ở **mọi** phiên có đúng một lỗi, không liên quan tới UX:
`404 Not Found @ http://127.0.0.1:4173/favicon.ico`. Chỉ p05 chủ động mở console và tự kết
luận nó vô hại.
