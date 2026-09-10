# ADR-0010 · Bốn số độ khó nằm trong `GameState`, không truyền theo tham số

> **Ngày:** 2026-09-10
> **Trạng thái:** accepted
> **Liên quan:** FR-20 · FR-21 · NFR-ROB-04 · NFR-PERF-03

## 1. Bối cảnh

Game cần nhiều độ khó. Bốn số quyết định độ khó — số mạng, hệ số tốc độ thiên thạch, tỉ lệ rơi power-up, wave UFO xuất hiện — hiện là hằng số import trực tiếp từ `core/constants.ts` tại bốn chỗ trong lõi (`state.ts`, `asteroids.ts`, `powerups.ts`, `ufo.ts`).

Hai bất biến chặn đường: #1 cấm lõi đọc bất cứ thứ gì ngoài `dt` và `state.rng` — không có `window`, không `localStorage`, nên lõi không thể tự đi hỏi xem người chơi chọn mức nào; #7 chỉ cho `step()` và các hàm chuyển pha trong `state.ts` ghi vào `GameState`.

## 2. Quyết định

`GameState` thêm hai trường: `difficulty: DifficultyId` và `tuning: Tuning` (bốn số). Chúng được đặt **một lần** ở `resetForNewGame`, khi ván bắt đầu, rồi không ai sửa nữa trong suốt ván. Bốn chỗ trong lõi đọc `state.tuning.*` thay cho hằng số import. `constants.ts` giữ `DIFFICULTY: Record<'easy' | 'normal' | 'hard', Tuning>`; các hằng số cũ ở lại nguyên vẹn vì chúng chính là giá trị của mức Thường.

## 3. Phương án đã loại

| Phương án                                                                                           | Vì sao loại                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Truyền tuning xuống theo tham số: `step(state, input, dt, tuning)`                                  | Tuning khi đó không thuộc state, nên một ván đã lỗi **không dựng lại được chỉ từ state** — `NFR-ROB-04` chết âm thầm: cùng seed cho hai kết quả khác nhau tuỳ mức đang chọn ở menu. Và mọi hàm trong chuỗi gọi phải thêm một tham số chỉ để chuyển tiếp |
| Một biến "mức hiện tại" ở cấp module trong `constants.ts`                                           | Đúng thứ bất biến #2 cấm với RNG, vì cùng lý do: state toàn cục làm test không tái lập được và hai ván chạy song song trong cùng một suite ảnh hưởng lẫn nhau                                                                                           |
| Giải ra một bảng `Balance` đầy đủ (mọi hằng số, mức chỉ ghi đè phần của nó) rồi đóng băng vào state | Thêm núm sau này miễn phí, nhưng phải viết lại chỗ đọc hằng số ở cả 12 file lõi và mọi test đang import từ `constants`, cho một khả năng mở rộng chưa ai cần                                                                                            |

## 4. Hệ quả

**Được:**

- `NFR-ROB-04` còn nguyên nghĩa và mạnh hơn: một ván tái lập được từ **seed + tuning + chuỗi input**, cả ba đều nằm trong state.
- Bốn chỗ đọc, mỗi chỗ một dòng — bề mặt thay đổi nhỏ và đọc hết được trong một lần.
- Màn Hết lượt biết ván vừa rồi là chế độ nào mà không cần tầng React tự ghi nhớ song song, nên nó quyết định đúng việc có hỏi tên hay không.

**Mất / phải chấp nhận:**

- `GameState` to thêm hai trường, và `resetForNewGame` đổi chữ ký — mọi chỗ gọi nó phải sửa theo (chữ ký mới nhận object tuỳ chọn, nên chỗ gọi cũ không đụng đến vẫn đúng).
- `HudSnapshot` thêm `difficulty`, nên `hudEquals` phải so thêm một trường. Bỏ sót trường trong hàm so sánh nông là đúng loại lỗi âm thầm mà `NFR-PERF-03` không bắt được — nó chỉ đo React re-render quá nhiều, không đo re-render quá ít.
- Đổi độ khó giữa ván là không thể. Đó là chủ ý, không phải hạn chế: đổi giữa ván thì điểm của ván đó thuộc mức nào.

**Điều kiện xem lại quyết định này:** khi cần núm thứ năm trở lên, hoặc khi một chế độ chơi mới (Time Attack) cần đổi luật chứ không chỉ đổi số — lúc đó bảng `Balance` đầy đủ có thể rẻ hơn.
