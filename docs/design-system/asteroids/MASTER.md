# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Asteroids
**Generated:** 2026-09-04 09:34:07
**Category:** Arcade & Retro Game

---

## 0. Chốt cuối — ghi đè catalog bên dưới

`ui-ux-pro-max` (step 1) đề xuất **Pixel Art · Press Start 2P / VT323 · đỏ #DC2626 + xanh #2563EB trên navy #0F172A**. `frontend-design` (step 2) **ghi đè phần màu và font**; các ràng buộc a11y/UX của step 1 giữ nguyên, không được ghi đè.

**Vì sao ghi đè:** "Pixel Art + Press Start 2P" là đúng cái mặc định rập khuôn mà catalog trả về cho mọi thứ có chữ "game". Ba vấn đề cụ thể: (1) yêu cầu của dự án là _hiện đại_, không phải hoài cổ 8-bit; (2) Press Start 2P không có chữ thường, giãn ký tự rất rộng và mất đọc được dưới 14px — trong khi HUD của game này là chữ nhỏ ở góc màn hình 375px; (3) Pixel Art buộc phải có sprite, còn lõi game này vẽ bằng hình học thuần trên canvas, nên phong cách đó sẽ mâu thuẫn với chính cách render.

**Phong cách chốt: vector phát sáng tiết chế trên nền tối gần-đen.** Nét mảnh, không tô đặc, glow đủ để tách vật thể khỏi nền chứ không loè. Cùng một ngôn ngữ nét đó dùng cho _cả_ canvas và giao diện DOM — đó là thứ giữ hai thế giới render nhìn như một.

### Màu — chốt

| Vai                                  | Hex                      | Biến CSS                   |
| ------------------------------------ | ------------------------ | -------------------------- |
| Background                           | `#08090F`                | `--color-background`       |
| Surface / Card                       | `#13151D`                | `--color-card`             |
| Border (hairline)                    | `rgba(255,255,255,0.10)` | `--color-border`           |
| Foreground                           | `#F2F5F9`                | `--color-foreground`       |
| Muted Foreground                     | `#98A2B3`                | `--color-muted-foreground` |
| Primary (CTA · focus ring · lửa đẩy) | `#4F7CFF`                | `--color-primary`          |
| On Primary                           | `#08090F`                | `--color-on-primary`       |
| Accent (điểm · nhấn)                 | `#FFD166`                | `--color-accent`           |
| On Accent                            | `#08090F`                | `--color-on-accent`        |
| Destructive                          | `#F04438`                | `--color-destructive`      |

### Màu vật thể trong canvas

| Vật thể            | Hex             | Ghi chú                                        |
| ------------------ | --------------- | ---------------------------------------------- |
| Tàu                | `#F2F5F9`       | nét trắng, glow xanh `--color-primary` khi đẩy |
| Đạn                | `#F2F5F9`       |                                                |
| Thiên thạch        | `#8B94A7`       | xám lạnh — không tranh chú ý với power-up      |
| UFO                | `#FF5D8F`       | hồng, chỉ UFO dùng màu này                     |
| Bất tử (nhấp nháy) | `#F2F5F9` @ 40% |                                                |

### Power-up — màu **và** hình, không bao giờ chỉ màu

| Loại      | Hex       | Ký hiệu hình học   |
| --------- | --------- | ------------------ |
| Khiên     | `#22D3EE` | lục giác viền      |
| Bắn nhanh | `#FFD166` | ba chevron xếp dọc |
| Bắn toả   | `#A78BFA` | hình quạt ba tia   |
| Đạn xuyên | `#FB7185` | mũi tên nét đôi    |
| +1 mạng   | `#34D399` | dấu cộng           |

Mã hoá kép (màu + hình) là bắt buộc, không phải trang trí: mù màu đỏ–lục sẽ không phân biệt được `#FB7185` với `#34D399`, và HUD còn ghi kèm tên bằng chữ.

### Chữ — chốt

- **Display / UI:** `Space Grotesk` (600 cho tiêu đề, 500 cho nút, 400 cho nội dung)
- **Số / HUD:** `JetBrains Mono` — dùng cho điểm, wave, đồng hồ power-up, bảng điểm

Hai họ chữ khác biệt rõ rệt, đúng yêu cầu của `frontend-design`. Lý do chọn mono cho số: điểm nhảy liên tục trong lúc chơi, mà chữ số không đều bề rộng sẽ làm cả khối HUD giật sang trái phải mỗi lần cộng điểm. Mono có bề rộng cố định nên số đứng yên. Bảng điểm cũng thẳng cột mà không cần canh tay.

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
```

### Signature element — khung vạch góc

Mỗi panel và overlay có một khung hairline 1px `--color-border` với **bốn vạch góc** dài 12px sáng hơn (`--color-foreground` @ 30%), hở ở giữa mỗi cạnh. Nó gợi khung máy arcade nhưng vẽ bằng ngôn ngữ hiện đại, và nó là thứ duy nhất được phép lặp lại ở mọi màn hình. Một dấu hiệu, dùng khắp nơi.

### Glow thay cho shadow

Bảng `Shadow Depths` bên dưới **không áp dụng** — shadow đen trên nền gần-đen là vô hình. Thay bằng:

| Token       | Giá trị                | Dùng ở                                    |
| ----------- | ---------------------- | ----------------------------------------- |
| `--glow-sm` | `0 0 8px <màu> / 35%`  | nét vật thể trong canvas                  |
| `--glow-md` | `0 0 16px <màu> / 30%` | nút ở trạng thái hover/focus              |
| `--glow-lg` | `0 0 32px <màu> / 25%` | overlay đang hoạt động, power-up vừa nhặt |

### Chuyển động

Bậc **tối giản**: chỉ CSS transition 150–200ms cho hover/focus/overlay. **Không dùng GSAP** — chuyển động thật của sản phẩm này nằm trong canvas, không nằm ở DOM. `prefers-reduced-motion` tắt particle, rung màn hình, vệt đẩy và mọi transition của DOM; gameplay không đổi.

---

## Global Rules — catalog step 1 (giu de doi chieu; mau/chu da bi muc 0 ghi de)

### Spacing Variables

| Token         | Value             | Usage                     |
| ------------- | ----------------- | ------------------------- |
| `--space-xs`  | `4px` / `0.25rem` | Tight gaps                |
| `--space-sm`  | `8px` / `0.5rem`  | Icon gaps, inline spacing |
| `--space-md`  | `16px` / `1rem`   | Standard padding          |
| `--space-lg`  | `24px` / `1.5rem` | Section padding           |
| `--space-xl`  | `32px` / `2rem`   | Large gaps                |
| `--space-2xl` | `48px` / `3rem`   | Section margins           |
| `--space-3xl` | `64px` / `4rem`   | Hero padding              |

### Shadow Depths

| Level         | Value                          | Usage                       |
| ------------- | ------------------------------ | --------------------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle lift                 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons              |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | Modals, dropdowns           |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #22c55e;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #dc2626;
  border: 2px solid #dc2626;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #0f172a;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #dc2626;
  outline: none;
  box-shadow: 0 0 0 3px #dc262620;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Pixel Art

**Keywords:** Retro, 8-bit, 16-bit, gaming, blocky, nostalgic, pixelated, arcade

**Best For:** Indie games, retro tools, creative portfolios, nostalgia marketing, Web3/NFT

**Key Effects:** Frame-by-frame sprite animation, blinking cursor, instant transitions, marquee text

### Page Pattern

**Pattern Name:** Hero-Centric Design

- **Conversion Strategy:** One primary CTA. Let the hero dominate the initial viewport without hiding the next content cue. Use a static hero and non-pulsing CTA when reduced motion is requested; provide video controls. Pause hero media offscreen/hidden and keep the final hero message and CTA static under reduced motion.
- **CTA Placement:** Hero dominant (center/bottom) + Sticky nav CTA
- **Section Order:** Full-bleed Hero (headline + visual) > Single value prop strip > Key benefit or proof > Primary CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Inconsistent styling
- ❌ Poor contrast ratios

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
