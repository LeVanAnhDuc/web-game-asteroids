# ADR-0018 · Tàu là nét nặng nhất trên canvas, và gợi ý điều khiển là DOM suy từ HUD

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-11 · FR-14 · US-01 · US-06 · NFR-A11Y-05 · NFR-I18N-01 · NFR-PERF-03 · NFR-PERF-05 · ADR-0007

## 1. Bối cảnh

Hai phát hiện của UX review 2026-09-11, cùng một câu hỏi của người chơi: _tôi đang điều khiển cái gì, và bằng gì?_

**F-02.** Vào ván rồi thì trên màn không còn chữ nào nói cách điều khiển. `aria-label` của canvas có nói, nhưng nó chỉ tới tai trình đọc màn hình. p01 (1440, chuột) bấm chuột vào giữa khung chơi rồi tự kết luận _"chắc phải dùng phím"_; p04 bỏ cuộc với _"vậy chơi kiểu gì đây, đâu có nút nào để bấm"_.

Nửa còn lại của F-02 — "ở 375px không có nút cảm ứng nào" — **không phải lỗi sản phẩm**. `isCoarsePointer()` quyết định theo `(pointer: coarse)` chứ không theo chiều rộng, và persona chạy Desktop Chrome ở viewport 375, tức con trỏ `fine`. Trên Pixel 5 thì cả năm nút có đủ và đều ≥ 44px, e2e xác nhận.

**F-03.** Ba persona gọi vật mình điều khiển là "con vịt", hai người nói thẳng là không thấy nó. Đo trong `draw.ts`: tàu `lw(2.8)`, thiên thạch `lw(2.6)`, UFO `lw(2.6)`. Chênh 0.2 không nhìn ra được, mà thiên thạch lớn hơn tàu nhiều lần về diện tích. Cộng thêm `blinkAlpha` đáy `0.4` lúc bất tử — trạng thái xảy ra **ngay khi vào ván và ngay sau mỗi lần hồi sinh**, đúng hai lúc người mới cần thấy tàu nhất.

## 2. Quyết định

**Tàu:** nét `lw(2.8)` → `lw(3.6)`, và đáy nhấp nháy khi bất tử `0.4` → `0.55`. `MASTER.md` sửa theo, vì nó là nguồn đúng của token. Không đổi màu, không đổi hình, và **không** đổi `SHIP.drawRadius`.

**Gợi ý điều khiển:** một dòng DOM dưới HUD, hiện khi `phase === 'playing' && !coarse && score === 0 && wave === 1`. Điều kiện suy thuần từ `HudSnapshot` đang có — không state mới, không timer, không trường mới trong `GameState`. Tên phím lấy từ `vi.help.keyboard`. Dòng này `aria-hidden`.

## 3. Phương án đã loại

| Phương án                             | Vì sao loại                                                                                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Vẽ chữ gợi ý vào canvas               | `draw.ts` chạy mỗi frame và `NFR-PERF-05` cấm cấp phát mỗi vật thể mỗi frame; chữ động là đi ngược. DOM cũng cho `NFR-A11Y-05` và i18n miễn phí.                         |
| Đổi hình tàu thành siêu hình con vịt  | Non-Goal cấm sprite, và nó đụng bất biến #6 (góc 0 là hướng lên) và #10 (hitbox nhỏ hơn hình vẽ 20%). Rủi ro đổi độ khó mà không ai biết.                                |
| Tăng `SHIP.drawRadius` cho tàu to hơn | Bất biến #10: hitbox suy từ hình vẽ, nên tàu to lên là hitbox to lên là game khó lên. Đúng cái mà bất biến đó tồn tại để chặn.                                           |
| Gợi ý tắt sau N giây bằng timer       | Thêm state và một `setTimeout` phải dọn. `score === 0 && wave === 1` cho cùng kết quả, suy từ dữ liệu đã có, và biến mất đúng lúc người chơi chứng minh là đã biết chơi. |
| Hiện gợi ý cả trên thiết bị cảm ứng   | Ở đó đã có năm nút thật nhìn thấy được; thêm chữ là thêm nhiễu đúng chỗ màn hình hẹp nhất.                                                                               |
| Đưa gợi ý vào `aria-live`             | Nó chen ngang các công bố thật của `NFR-A11Y-06` (mất mạng, đổi wave, hết lượt). Nội dung này đã nằm trong `aria-label` của canvas.                                      |

## 4. Hệ quả

**Được:**

- Người dùng chuột/bàn phím thấy phím cần bấm ngay trong ván đầu, không phải đoán.
- Tàu đọc được đầu tiên trên canvas, kể cả lúc đang bất tử.
- Không thêm state, không thêm re-render nào ngoài những lần HUD vốn đã đổi.

**Mất / phải chấp nhận:**

- Gợi ý **không** biến mất nếu người chơi bay vòng vòng mà chưa ghi điểm. Chấp nhận: nó là một dòng chữ mờ, và người chưa ghi điểm đúng là người còn cần nó.
- Đáy nhấp nháy 0.55 làm hiệu ứng bất tử **bớt rõ** — tín hiệu "đang bất tử" yếu đi một chút để tín hiệu "tàu tôi ở đây" mạnh lên. Đây là một đánh đổi, không phải cải thiện thuần.
- `lw(3.6)` khoá trong test theo **tỉ lệ** so với nét thiên thạch (≥ 1.25×), không theo con số. Lần cân bằng thị giác sau đổi con số được mà không phải sửa test.

**Điều kiện xem lại quyết định này:** khi có người chơi thật nói tàu trông quá dày, hoặc khi hiệu ứng bất tử ở 0.55 không còn đọc ra là đang nhấp nháy. Cả hai đều cần mắt người, không test nào bắt được.
