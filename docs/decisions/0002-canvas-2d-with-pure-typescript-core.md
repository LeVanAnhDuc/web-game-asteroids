# ADR-0002 · Vẽ bằng Canvas 2D, lõi game là TypeScript thuần và React chỉ là vỏ

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-01 · NFR-PERF-01 · NFR-PERF-03 · NFR-ROB-04

## 1. Bối cảnh

Asteroids có lúc khoảng 40–60 vật thể cộng với particle khi thiên thạch vỡ, cập nhật 60 lần mỗi giây, và phải giữ được frame rate trên điện thoại tầm trung (`NFR-PERF-01`) vì mobile được coi là người chơi thật. Song song đó, phần menu, bảng điểm và overlay là UI thường, và luật chơi cần test được nhanh và tái lập được.

## 2. Quyết định

`src/game/core/` là module TypeScript thuần: không import React, không đụng DOM, điểm vào duy nhất là `step(state, input, dt) → state`. `src/game/render/draw.ts` chỉ đọc state rồi vẽ lên `CanvasRenderingContext2D`. React giữ `<canvas>` và render mọi thứ **ngoài** canvas, nhận từ vòng lặp một `HudSnapshot` nhỏ và chỉ re-render khi giá trị trong đó đổi.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Mỗi vật thể là một element React/DOM hoặc SVG | Style bằng Tailwind trực tiếp và soi được từng vật thể trong devtools, nhưng 40–60 element cập nhật 60 lần/giây làm React reconciliation thành nút cổ chai đúng trên nhóm thiết bị yếu nhất |
| WebGL qua PixiJS hoặc Three.js | Thừa sức về hiệu năng và particle đẹp hơn, nhưng thêm một dependency lớn vào một game không cần tới nó (phá `NFR-PERF-04`), và lõi game dính vào scene graph nên khó test bằng hàm thuần |
| Canvas 2D nhưng để luật chơi ngay trong component React | Ít file hơn, nhưng luật chơi khi đó chỉ test được qua DOM, và mọi test đều phải dựng render — đắt và giòn |

## 4. Hệ quả

**Được:**

- Luật chơi test được bằng cách gọi thẳng `step()` với input dựng sẵn, không cần trình duyệt, không cần chụp màn hình. Đây là điều kiện để `NFR-ROB-04` (tái lập) kiểm được.
- Tầng UI vẫn là React + Tailwind bình thường, nên token trong `MASTER.md` dùng được nguyên vẹn.
- Lõi không biết gì về nơi lưu điểm, mở đường cho ADR-0006.

**Mất / phải chấp nhận:**

- Hai thế giới render: hình học trong canvas và CSS ngoài canvas. Chúng phải được giữ cho nhìn như một bằng tay — đó là lý do `MASTER.md` định nghĩa một signature element dùng chung cho cả hai.
- Không có devtools nào soi được vật thể trong canvas; phải tự viết overlay debug.
- Ranh giới "core không đụng DOM" là thứ dễ vi phạm khi thêm tính năng nhanh, nên phải có ESLint chặn thay vì trông vào kỷ luật.

**Điều kiện xem lại quyết định này:** nếu số vật thể vượt vài trăm (thêm chế độ chơi mới), lúc đó WebGL mới đáng giá.
