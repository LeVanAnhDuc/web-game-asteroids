# Bất biến chịu lực

> **Trả lời:** Sửa gì thì hệ thống sai **âm thầm** — test vẫn xanh mà kết quả vẫn sai?
> **Trạng thái:** 🟢 đủ — đã rà theo dự án
> **Cập nhật:** 2026-09-04 · commit —
> **Cập nhật khi:** phát hiện một bất biến mới — thường là ngay sau khi ai đó vừa phá nó

Bản mặc định của template nói về múi giờ, quyền ở server, ORM, migration, soft-delete. Dự án không có server và không có database, nên toàn bộ đã bị thay bằng bất biến của một game canvas deterministic.

| #   | Bất biến                                                                                                                                                      | Vi phạm thì sao                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/game/core/**` không gọi `Math.random`, `Date.now`, `performance.now`, `window`, `document`. Ngẫu nhiên vào qua `state.rng`, thời gian vào qua `dt`       | Test hết tái lập được: chạy 100 lần xanh, lần 101 đỏ, và không dựng lại được ván đã lỗi. Có ESLint chặn, đừng tắt rule                |
| 2   | RNG chỉ lấy từ `state.rng`. Không có instance RNG toàn cục, không import chéo                                                                                 | Hai ván cùng seed cho kết quả khác nhau. `NFR-ROB-04` chết âm thầm                                                                    |
| 3   | Mọi vận tốc, gia tốc, đồng hồ đếm ghi theo **đơn vị/giây** rồi nhân `dt`. Không có hằng số nào tính theo "mỗi frame"                                          | Máy 144Hz chạy nhanh gấp 2.4 lần máy 60Hz. Trên máy dev thấy bình thường                                                              |
| 4   | Toạ độ trong lõi luôn là đơn vị thế giới 1600×1200. Chỉ tầng vẽ mới đổi sang pixel màn hình                                                                   | Màn hình to có nhiều chỗ né hơn màn hình nhỏ; cùng một game mà điện thoại khó hơn desktop, và điểm số giữa hai thiết bị không so được |
| 5   | Khoảng cách giữa hai vật thể tính theo **khoảng cách ngắn nhất trên hình xuyến** (có wrap), không phải hiệu toạ độ thẳng                                      | Đạn bay qua mép không trúng thiên thạch dù trên màn hình nhìn rõ là chạm. Chỉ sai ở rìa nên rất khó tái hiện                          |
| 6   | Góc tính bằng radian, `0` là hướng **lên** (−Y), tăng theo chiều kim đồng hồ                                                                                  | Tàu bay ngang khi bấm đẩy, hoặc đạn ra khỏi hông tàu. Sai 90° nhìn giống lỗi vật lý hơn là lỗi quy ước                                |
| 7   | Chỉ `step()` và các hàm chuyển pha có tên trong `core/state.ts` được sửa `GameState`. Tầng vẽ, React và input chỉ đọc, không bao giờ gán thẳng vào một trường | Logic game phụ thuộc vào việc có vẽ hay không; mọi thứ lệch khi tab chạy nền hoặc khi bật dev overlay                                 |
| 8   | React không giữ `GameState` trong `useState`/`useRef` để render. Chỉ nhận snapshot HUD và chỉ re-render khi giá trị đổi                                       | 60 lần reconciliation mỗi giây, tụt frame trên điện thoại. Trên máy dev không thấy                                                    |
| 9   | Mọi thứ đọc từ `localStorage` phải qua validate rồi mới dùng                                                                                                  | Một chuỗi JSON bị sửa tay làm trắng màn hình toàn bộ game, ngay ở lần tải trang                                                       |
| 10  | Hitbox của tàu nhỏ hơn hình vẽ **20%**. Đây là chủ ý, không phải sai số                                                                                       | "Sửa cho khớp hình" làm game khó lên rõ rệt mà không ai biết vì sao                                                                   |
