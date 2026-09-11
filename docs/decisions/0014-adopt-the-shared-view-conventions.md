# ADR-0014 · Nhận bộ quy ước view dùng chung của workspace `web-game`

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** ADR-0002 · ADR-0006 · [`docs/code-conventions.md`](../code-conventions.md)

## 1. Bối cảnh

Bộ quy ước dùng chung rút từ `quapp-developer-frontend`, đã lọc qua bốn lần áp thật
trước khi tới đây.

Repo này **không có tầng `views/`** nào. Mười ba component nằm phẳng trong
`src/components/`, trộn ba thứ khác loại:

- container của cả app (`GameShell`);
- năm màn hình (`MenuScreen`, `HelpScreen`, `HighScoresScreen`, `CustomScreen`, `Hud`);
- primitive dùng chung, gom trong **một file** `ui.tsx` xuất 6 component + 1 hàm thuần;
- `Overlays.tsx` xuất 2 component + 1 helper nội bộ.

Và một file test duy nhất, `components.test.tsx`, 381 dòng phủ 7 component khác nhau.

## 2. Quyết định

Theo [`docs/code-conventions.md`](../code-conventions.md):

- `GameShell` → `views/Home/index.tsx`, đổi tên hàm thành `Home`; `app/page.tsx` gọi
  view chứ không gọi component.
- Năm màn hình → `views/Home/mains/`. `TouchControls` · `InitialsInput` · `LiveRegion`
  · `PowerUpMark` → `views/Home/components/`.
- `ui.tsx` tách thành 6 thư mục trong `src/components/` (primitive dùng chung thật sự),
  `formatScore` ra `src/lib/format.ts` vì nó không render gì.
- `Overlays.tsx` tách thành `PauseOverlay` · `GameOverOverlay` · `Backdrop` — cái thứ
  ba là helper dùng chung của hai cái trước, nên nó là component chứ không phải hàm
  nội bộ của một file.
- `components.test.tsx` tách thành 8 file, mỗi cái nằm cạnh component nó kiểm.
- Effect chốt thứ hạng → ghost `FreezeRankAtGameOver`. Hai effect còn lại **không**
  thành ghost: chúng sinh state dùng để render, và ghost là thứ `return null`.
- Thêm năm luật ESLint chung và `.githooks/pre-commit`. Luật `no-restricted-imports`
  của `game/core` được mở rộng để chặn cả `@/views`, `@/views/*` và `@/components` —
  tầng mới và dạng bare đều là lỗ hổng của luật cũ.

**KHÔNG** thêm barrel `hooks/index.ts`: repo này có đúng một hook (`useGame`), barrel
một phần tử chỉ thêm một lớp chuyển tiếp.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ `ui.tsx` làm một file "primitive" | Sáu component trong một file thì không ai tìm được `Segmented` bằng cách nhìn cây thư mục, và một sửa đổi nhỏ ở `Button` làm bẩn `git blame` của cả sáu |
| Giữ `components.test.tsx` nguyên khối, ghi nhận làm nợ | Tách được **kiểm chứng được**: 202 test là bất biến. Sau khi tách vẫn đúng 202, nên không có gì phải đánh cược |
| Ép hai effect còn lại thành ghost cho đủ bộ | Cả hai `setState` để render. Ghost `return null`; ép chúng thành ghost là đẩy state ngược lên cha bằng callback để được đúng con số không |
| Truyền arrow inline cho ghost thay vì `useCallback` | Effect sẽ chạy lại mỗi render, và mỗi lần chạy là một `JSON.parse` cả bảng điểm — đúng cái giá mà comment ở effect kế bên nói rõ là đang tránh |

## 4. Hệ quả

**Được:**
- Mở `views/Home/` là thấy toàn bộ màn chơi; `src/components/` giờ chỉ còn primitive.
- Mỗi test nằm cạnh component nó kiểm, nên xoá một component là thấy ngay test nào mồ côi.

**Mất / phải chấp nhận:**
- Commit này chạm gần như toàn bộ tầng UI. `git blame` trên một dòng UI bất kỳ sẽ
  dừng ở đây trước khi đi tiếp.
- **Thứ tự ghost trong JSX = thứ tự chạy effect**, và ghost phải render **vô điều
  kiện**. Ở repo này mới có một ghost nên chưa thấy, nhưng thêm cái thứ hai là thấy.
- `resolveRank` và `onFreeze` giờ **buộc** phải ổn định. Ai đó thay bằng arrow inline
  sẽ không thấy gì sai: UI vẫn đúng, chỉ là mỗi render thêm một `JSON.parse`.
