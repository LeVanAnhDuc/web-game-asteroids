# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-10 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

Không có việc nào đang dở.

**Chế độ chơi & độ khó** đã xong (2026-09-10) trên branch `feat/game-modes`. FR-20 ·
FR-21 · FR-22 đóng; US-07 và US-08 là hai luồng mới; ADR-0010 và ADR-0011 ghi hai
quyết định chịu lực. 202 test đơn vị và 122 test e2e xanh, `typecheck` / `lint` /
`build` sạch, bundle 115.9 kB gzip trên trần 200 kB.

Ba điều còn ràng buộc mọi việc sau, giữ lại vì chúng không hiển nhiên khi đọc code:

- **Khoá `asteroids.highscores.v1` là bảng mức Thường**, và tên khoá không có chữ
  `normal`. Bất đối xứng đó là chủ ý — ADR-0011. Đổi nó là xoá bảng điểm của người
  đang chơi.
- **`DIFFICULTY.normal` bị test khoá vào đúng bộ hằng số gốc.** Muốn chỉnh cân bằng
  chung cho mọi mức thì sửa hằng số gốc (`SCORING.startLives`, `POWERUP.dropChance`,
  `UFO.firstWave`, `WAVE.speedStep`), đừng sửa `DIFFICULTY.normal`;
  `difficulty.test.ts` sẽ đỏ nếu hai bên lệch nhau, và đó chính là việc của nó.
- **`UFO_NEVER` = 10 là "không có UFO", không phải "từ wave 10".** Điều kiện trong
  `ufo.ts` so sánh nó trước điều kiện wave; đọc riêng `wave >= 10` sẽ hiểu ngược.

**Đổi thương hiệu sang `Duck Drift`** — đã xong, merge qua PR #10 (`7e8a753`). Thư mục
local vẫn là `web-game-asteroids` (thương hiệu đổi, đường dẫn không); địa chỉ chơi là
<https://levananhduc.github.io/web-game-duck-drift/> — trang cũ **không** được
redirect. Từ "asteroid" trong code **không** đổi: đó là tên đối tượng trong game.

## Việc tiếp theo

| Việc                                                      | Liên quan                   | Ưu tiên    | Vì sao ưu tiên đó                                                                                                                                                                                                                                      |
| --------------------------------------------------------- | --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chơi thật rồi tinh chỉnh số cân bằng trong `constants.ts` | FR-06 · FR-09 · FR-20       | cao        | Các con số hiện tại (8% rơi power-up, 12 giây hiệu lực, `2 + n` thiên thạch) là điểm khởi đầu suy ra trên giấy — và giờ có thêm bốn số của mức Dễ và bốn số của mức Khó cùng loại. Cân bằng game không chốt được nếu chưa chơi                         |
| Đo frame rate trên điện thoại thật                        | NFR-PERF-01                 | cao        | Ngưỡng 50fps hiện chưa được đo trên thiết bị nào; máy dev không đại diện                                                                                                                                                                               |
| Nhìn ba khổ 375 / 768 / 1024 bằng mắt                     | FR-17 · NFR-A11Y-03         | trung bình | E2E Playwright (ADR-0008) đã kiểm tự động ở đúng ba khổ đó: không tràn ngang, canvas nằm trong khung nhìn, vùng bấm ≥ 44px trên Pixel 5. Còn lại là phần assert không nói được — cân đối, khoảng trống, cảm giác chật — nên đã hạ ưu tiên chứ chưa xoá |
| Âm thanh: bắn, vỡ, nhặt power-up, mất mạng                | —                           | trung bình | Nằm trong Non-Goals của bản đầu, nhưng là thứ thêm sau được mà không đụng gameplay                                                                                                                                                                     |
| Bảng xếp hạng online                                      | FR-12 · ADR-0006 · ADR-0011 | thấp       | Cần backend nên vi phạm trần chi phí 0 đồng. Interface `ScoreStore` đã mở sẵn đường, nhưng ADR-0011 nói rõ: ở biên giới mạng thì trường `mode` trên từng dòng điểm sẽ quay lại, vì ba khoá riêng không gửi lên server được                             |
| Chế độ chơi thêm: Time Attack, Daily seed                 | —                           | thấp       | RNG đã có seed nên Daily seed gần như miễn phí về kỹ thuật. Phần đắt — màn chọn chế độ và bảng điểm tách theo chế độ — giờ đã có sẵn từ feature độ khó, nên giá của việc này vừa giảm đáng kể                                                          |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào                                                     | Đã đánh đổi gì                                                              | Vì sao chấp nhận                                                                                               | Khi nào buộc phải trả                                                            |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/game/core/constants.ts`                                | Toàn bộ số cân bằng là ước lượng trên giấy, chưa qua chơi thử               | Chốt số trên giấy nhanh hơn và đủ để dựng xong hệ thống; số sai không làm sai kiến trúc                        | Ngay sau khi chơi được ván đầu — xem mục "Việc tiếp theo"                        |
| `constants.ts` — `DIFFICULTY.easy` và `DIFFICULTY.hard`     | Bốn số của mức Dễ và bốn số của mức Khó cũng là ước lượng trên giấy         | Cùng loại nợ với dòng trên, và rẻ hơn: ba mức chỉ khác nhau ở dữ liệu, không ở luật, nên sửa số không sửa code | Cùng lúc với dòng trên. Mức Thường thì **không** được sửa tự do — ADR-0011       |
| `docs/README.md` · `docs/decisions/README.md` (khối `auto`) | `docs-regen.sh` viết vạch bảng dạng `\| --- \|`, Prettier viết dạng căn đều | Nội dung không đổi một chữ, chỉ là định dạng; hai script luân phiên sửa lẫn nhau                               | Khi nó gây nhiễu review thật — sửa `docs-regen.sh` để nó xuất đúng dạng Prettier |
