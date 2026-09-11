# Thiết kế · `visible-controls`

**Liên quan:** FR-11 · FR-14 · US-01 · US-03 · US-06 · NFR-A11Y-03 · NFR-A11Y-05 · NFR-I18N-01 · NFR-PERF-03 · NFR-PERF-05 · ADR-0007 · ADR-0018

Pass 2/4 sửa feedback của `docs/ux-reviews/2026-09-11-lop-vo-7-red-route.md`: **F-02 (Critical)** và **F-03 (High)**.

Không lặp lại tài liệu tier-1: bất biến ở `03-design/invariants.md`, token ở `design-system/asteroids/MASTER.md`, ngưỡng ở `02-requirements/nfr.md`.

## 0. Báo cáo UX nói quá ở F-02 — một nửa phát hiện đó không phải lỗi sản phẩm

Báo cáo viết: _"ở 375px không có một nút điều khiển nào trong tầm nhìn"_, và xếp nó là Critical.

Đo lại thì **một nửa câu đó là lỗi công cụ**. `isCoarsePointer()` quyết định hiện nút cảm ứng bằng `(pointer: coarse)`, **không** bằng chiều rộng màn hình — chủ ý, và comment trong `src/input/touch.ts` nói rõ vì sao: máy tính bảng rộng 1024 vẫn cần nút, còn cửa sổ desktop kéo hẹp thì không. Persona chạy **Desktop Chrome ở viewport 375×720**, tức con trỏ `fine`, nên nút **đúng ra là không được hiện**.

Trên thiết bị cảm ứng thật thì nút có đủ. Chạy lại suite e2e trên profile Pixel 5, 2026-09-11:

```
✓ nút cảm ứng — US-03 › chỉ xuất hiện trên thiết bị cảm ứng
✓ nút cảm ứng — US-03 › năm nút, không nút nào nhỏ hơn 44px — NFR-A11Y-03
✓ nút cảm ứng — US-03 › nút cảm ứng không làm trang cuộn hay phóng to khi chạm
```

Vậy phần **thật** của F-02 là phần còn lại, và nó không phụ thuộc thiết bị: **vào ván rồi thì trên màn không còn chữ nào nói điều khiển bằng cách gì.** Đó là chỗ cả hai persona vấp, và nó đúng với người dùng chuột lẫn bàn phím ở mọi khổ màn:

- p01 Trang (1440, chuột), mục 2 gạch 6: _"Tôi thử bấm chuột vào giữa khung chơi — không thấy gì đổi"_ → _"Chắc con chuột không điều khiển được, chắc phải dùng phím."_
- p04 Dũng (375, con trỏ `fine`), phiên mù #1: _"Vậy chơi kiểu gì đây, đâu có nút nào để bấm."_

Nhãn của canvas **có** nói "Điều khiển bằng bàn phím hoặc bằng các nút bên dưới", nhưng nhãn `aria-label` chỉ tới tai trình đọc màn hình, không tới mắt người dùng chuột.

## 1. F-02 — một dòng gợi ý điều khiển, chỉ ở lúc người chơi chưa làm gì

Thêm `ControlsHint`: một dòng DOM dưới HUD, liệt kê phím, chỉ hiện khi **cả ba** điều sau đúng:

| Điều kiện | Vì sao |
| --- | --- |
| `phase === 'playing'` | chỉ trong ván |
| `!coarse` | thiết bị cảm ứng đã có năm nút thật; thêm chữ là thêm nhiễu |
| `wave === 1` | qua được wave đầu thì đã biết chơi |

Điều kiện suy **thuần từ `HudSnapshot` đang có** (`wave`, `phase`). Không thêm state, không thêm timer, không thêm trường vào `GameState` — nên không đụng bất biến #7, #8, và không thêm re-render nào ngoài những lần HUD vốn đã đổi (`NFR-PERF-03`).

> **Một điều kiện đã bị loại sau khi nhìn app thật.** Bản đầu còn thêm `score === 0`, với lý lẽ "ghi được điểm là đã biết chơi". Chạy trên bản build mới thấy nó sai về bản chất: **viên đá giết tàu cũng vỡ, và vỡ thì được điểm**, nên điểm nhảy lên 20 ngay ở cú chết đầu tiên — lúc người chơi chưa hề làm gì. Gợi ý biến mất trước khi đọc kịp, đúng với người cần nó nhất. Test đơn vị và e2e đều xanh với điều kiện sai đó; chỉ có ảnh chụp app thật mới bắt được. Mốc bây giờ là **wave**.

Chuỗi lấy từ `vi.help.keyboard` đang có, không viết chuỗi mới cho cùng một nội dung (`NFR-I18N-01`). Gợi ý chỉ nêu ba phím cần để **sống sót** — xoay, đẩy, bắn; `Cách chơi` vẫn là chỗ nói đủ.

Nó là DOM, không vẽ vào canvas: canvas do `draw.ts` vẽ mỗi frame và `NFR-PERF-05` cấm cấp phát mỗi frame — vẽ chữ động vào đó là đi ngược cả hai.

## 2. F-03 — tàu phải là thứ đọc được đầu tiên trên canvas

Persona đi tìm "con vịt" của mình và không thấy. Hai nguyên nhân đo được từ ảnh và từ code:

**Nét tàu gần như không khác nét thiên thạch.** Đo trong `draw.ts`: tàu `lw(2.8)`, thiên thạch `lw(2.6)`, UFO `lw(2.6)`, power-up `lw(2.4)`, đạn `lw(3)`. Chênh 0.2 là chênh không nhìn ra được — mà thiên thạch thì lớn hơn tàu nhiều lần về diện tích, nên chúng chiếm hết chú ý.

> Ghi lại một chỗ tôi đã đoán sai: bản đầu của mục này viết "UFO ở `lw(3)`, tàu mảnh hơn". Không đúng — UFO là `lw(2.6)`. Test viết theo giả thiết đó xanh ngay từ đầu, và đó là cách phát hiện ra. Con số ở bảng trên là số đọc từ code.

**Lúc bất tử tàu mờ tới mức mất hẳn.** `blinkAlpha` đáy là `0.4` (đúng `MASTER.md`), và trạng thái bất tử xảy ra **ngay khi vào ván và ngay sau mỗi lần hồi sinh** — đúng hai thời điểm người mới cần thấy tàu nhất. Ảnh `p01-RR01-02-after-play.png` của lần chạy là một khung không tìm được tàu trên màn.

Sửa, giữ trong hệ token của `MASTER.md`:

| Chỗ                      | Trước     | Sau       | Vì sao                                                                        |
| ------------------------ | --------- | --------- | ----------------------------------------------------------------------------- |
| nét tàu                  | `lw(2.8)` | `lw(3.6)` | ≥ 1.35× nét thiên thạch — chênh lệch đủ để mắt thấy, và nặng nhất trên canvas |
| đáy nhấp nháy khi bất tử | `0.4`     | `0.55`    | vẫn đọc ra là "đang nhấp nháy", nhưng không còn biến mất                      |

Test khoá **tỉ lệ**, không khoá con số tuyệt đối: `3.6` là một lựa chọn, còn "nét tàu phải hơn nét thiên thạch một khoảng nhìn ra được" là yêu cầu. Khoá con số thì lần cân bằng thị giác sau sẽ phải sửa test mà không học được gì.

Không đổi màu, không đổi hình, không thêm vật thể. Đặc biệt **không** đụng `SHIP.drawRadius` — bất biến #10 chốt hitbox nhỏ hơn hình vẽ 20% là chủ ý, và đổi bán kính vẽ là đổi độ khó mà không ai biết.

`MASTER.md` phải sửa theo, vì nó là nguồn đúng của token: dòng "Bất tử (nhấp nháy) `#F2F5F9` @ 40%" thành 55%. Đó là một quyết định thiết kế, nên nó cũng vào ADR-0018.

## 3. Phạm vi — cái pass này KHÔNG làm

- Không đổi tên "con vịt". Quyết định đã chốt: chỉ làm tàu dễ thấy hơn. Lệch từ ngữ giữa tên sản phẩm và hình tam giác vẫn còn, và vẫn là chuyện của `glossary.md` chứ không của một màn hình.
- Không vẽ siêu hình con vịt — Non-Goal cấm sprite, và nó đụng bất biến #6 và #10.
- Không thêm nút cảm ứng, không đổi `isCoarsePointer()`. Xem §0.
- F-04 · F-05 (pass 3) · F-07 · F-08 · F-10 (pass 4) không thuộc pass này.
- **Không qua cổng mockup của `feature-flow`.** Người dùng đã yêu cầu chạy tới xong, không hỏi lại. Vì vậy thay đổi ở đây được giữ ở mức bảo thủ nhất có thể: một dòng chữ dùng token sẵn có và hai con số trong `draw.ts`. Không màn mới, không bố cục mới, không token mới. Đây là một **sai lệch có chủ ý so với flow**, ghi lại ở đây để người review biết mà soi kỹ phần thị giác.

## 4. Cách biết là đã sửa

| Việc          | Bằng chứng phải có                                                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-02          | Test: gợi ý hiện khi `phase='playing' · score=0 · wave=1 · coarse=false`; ẩn khi bất kỳ điều kiện nào sai. E2E: vào ván ở 1440 thì thấy chữ gợi ý; sau khi có điểm thì không còn. |
| F-03          | Test `draw.ts`: nét tàu ≥ 1.25× nét thiên thạch; `globalAlpha` lúc bất tử ≥ 0.55.                                                                                                               |
| Không hồi quy | Trên profile cảm ứng, gợi ý **không** hiện và năm nút vẫn đủ.                                                                                                                     |
