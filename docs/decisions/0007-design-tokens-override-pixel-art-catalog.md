# ADR-0007 · Bỏ đề xuất Pixel Art của catalog, chốt vector phát sáng với Space Grotesk + JetBrains Mono

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** NFR-A11Y-01 · NFR-A11Y-04 · NFR-SEC-03

## 1. Bối cảnh

`design-bootstrap` chạy hai bước: `ui-ux-pro-max` đưa ràng buộc và một bộ đề xuất từ catalog, rồi `frontend-design` chốt màu, cặp chữ và signature element. Step 1 với truy vấn "arcade space shooter game asteroids canvas modern web game" trả về: phong cách **Pixel Art**, chữ **Press Start 2P / VT323**, màu đỏ `#DC2626` + xanh `#2563EB` + lục `#22C55E` trên nền navy `#0F172A`. Yêu cầu của người dùng là "kiểu hiện đại".

## 2. Quyết định

Ghi đè phần **màu và chữ** của step 1; giữ nguyên toàn bộ ràng buộc a11y/UX của nó (tương phản, 44px, focus thấy được, reduced-motion) vì phần đó không được phép ghi đè.

Chốt: nền gần-đen `#08090F`, surface `#13151D`, chữ `#F2F5F9`, primary `#4F7CFF`, accent `#FFD166`; năm màu power-up phân biệt kèm **ký hiệu hình học riêng**; chữ **Space Grotesk** cho giao diện và **JetBrains Mono** cho mọi con số; signature element là **khung hairline có bốn vạch góc**; shadow thay bằng ba mức glow. Chi tiết đầy đủ ở `docs/design-system/asteroids/MASTER.md` §0.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Nhận nguyên Pixel Art + Press Start 2P từ catalog | Ba lý do cụ thể: yêu cầu là hiện đại chứ không hoài cổ 8-bit; Press Start 2P không có chữ thường, giãn ký tự rất rộng và mất đọc được dưới 14px trong khi HUD là chữ nhỏ trên màn 375px; và Pixel Art buộc phải có sprite, trong khi `ADR-0002` chốt vẽ bằng hình học thuần — phong cách sẽ mâu thuẫn với chính cách render |
| Neon synthwave rực rỡ | Hợp thể loại và làm power-up nổi bật, nhưng glow mạnh trên nền tối kéo tương phản chữ xuống dưới 4.5:1 ở đúng chỗ chữ nhỏ nhất, và nó là lựa chọn sáo mòn thứ hai sau pixel art |
| Một họ chữ duy nhất cho cả giao diện và số | `frontend-design` đòi tối thiểu hai họ khác biệt, và ở đây có lý do kỹ thuật thật: chữ số không đều bề rộng làm khối HUD giật ngang mỗi lần cộng điểm |
| Dùng Google Fonts qua CDN lúc chạy | Vi phạm `NFR-SEC-03` — không gọi ra ngoài lúc chạy. Font tải kèm build qua `next/font` |

## 4. Hệ quả

**Được:**

- Phong cách khớp yêu cầu và khớp cách render: hình học vector trong canvas dùng đúng ngôn ngữ nét với giao diện DOM.
- Chữ đọc được ở 12–14px, là cỡ thật của HUD trên mobile.
- Năm power-up phân biệt được cả khi không thấy màu (`NFR-A11Y-04`).

**Mất / phải chấp nhận:**

- Đi chệch catalog nghĩa là không còn bộ tham chiếu sẵn cho các quyết định nhỏ sau này; những chỗ đó phải tự suy từ `MASTER.md` §0.
- Nền gần-đen `#08090F` khác `#0F172A` của catalog nên các giá trị tương phản trong phần catalog còn lại của `MASTER.md` không dùng lại được, phải đo lại.

**Điều kiện xem lại quyết định này:** `MASTER.md` là nguồn duy nhất; đổi token thì viết ADR mới thay thế, không sửa file này và không chạy lại `design-bootstrap` (chạy lại sẽ trôi token, đó là lý do nó chỉ chạy một lần).
