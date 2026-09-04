# Thuật ngữ

> **Trả lời:** Khái niệm này gọi là gì trong code, và hiện ra sao trên UI?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-04 · commit —
> **Cập nhật khi:** xuất hiện một khái niệm nghiệp vụ mới trong code hoặc UI

| Thuật ngữ       | Định nghĩa một câu                                             | Tên trong code                                                                      | Tên trên UI (VI)                                    | Tên trên UI (EN)       |
| --------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------- |
| Tàu             | Vật thể người chơi điều khiển                                  | `Ship`                                                                              | Tàu                                                 | Ship                   |
| Thiên thạch     | Vật thể trôi tự do, bắn vỡ được, có ba cấp kích thước          | `Asteroid`                                                                          | Thiên thạch                                         | Asteroid               |
| Cấp kích thước  | Ba mức của thiên thạch: to, vừa, nhỏ                           | `AsteroidSize` = `'large' \| 'medium' \| 'small'`                                   | to · vừa · nhỏ                                      | large · medium · small |
| Đạn             | Viên đạn tàu bắn ra, có tuổi thọ                               | `Bullet`                                                                            | Đạn                                                 | Bullet                 |
| UFO             | Đĩa bay bắn trả người chơi                                     | `Ufo`                                                                               | UFO                                                 | UFO                    |
| Wave            | Một đợt thiên thạch; hết đợt thì sang đợt sau                  | `wave` (số nguyên ≥ 1)                                                              | Wave                                                | Wave                   |
| Power-up        | Vật phẩm rơi ra khi bắn vỡ thiên thạch, nhặt bằng cách bay vào | `PowerUp`                                                                           | Vật phẩm                                            | Power-up               |
| Loại power-up   | Một trong năm loại                                             | `PowerUpKind` = `'shield' \| 'rapid' \| 'spread' \| 'pierce' \| 'life'`             | Khiên · Bắn nhanh · Bắn toả · Đạn xuyên · Thêm mạng | —                      |
| Khe vũ khí      | Chỗ giữ đúng một power-up loại vũ khí đang hiệu lực            | `state.ship.weapon`                                                                 | (thanh HUD)                                         | —                      |
| Hyperspace      | Dịch chuyển tàu tới điểm ngẫu nhiên, có cooldown               | `hyperspace`                                                                        | Dịch chuyển                                         | Hyperspace             |
| Bất tử          | Khoảng thời gian ngay sau khi hồi sinh, không nhận va chạm     | `invulnMs`                                                                          | (tàu nhấp nháy)                                     | —                      |
| Bước mô phỏng   | Một lần chạy luật chơi, luôn ứng với 1/60 giây                 | `step()`                                                                            | —                                                   | —                      |
| Trạng thái ván  | Toàn bộ dữ liệu một ván tại một thời điểm                      | `GameState`                                                                         | —                                                   | —                      |
| Pha             | Màn hình hiện tại của máy trạng thái                           | `Phase` = `'menu' \| 'playing' \| 'paused' \| 'gameover' \| 'highscores' \| 'help'` | —                                                   | —                      |
| Snapshot HUD    | Bản rút gọn chỉ chứa số React cần vẽ                           | `HudSnapshot`                                                                       | —                                                   | —                      |
| Bảng điểm       | Top 10 điểm cao của máy này                                    | `ScoreEntry[]`, `ScoreStore`                                                        | Bảng điểm                                           | High scores            |
| Đơn vị thế giới | Hệ toạ độ cố định 1600×1200 của lõi game                       | `WORLD_W`, `WORLD_H`                                                                | —                                                   | —                      |

**Tên bị cấm:**

- Dùng `Asteroid`, **không** dùng `Rock` / `Meteor` / `Stone`.
- Dùng `PowerUp`, **không** dùng `Item` / `Pickup` / `Buff`.
- Dùng `wave`, **không** dùng `level` / `stage` / `round`.
- Dùng `Ship`, **không** dùng `Player` / `Rocket` / `Shuttle`.
- Dùng `step`, **không** dùng `update` / `tick` cho luật chơi (`tick` dành riêng cho `loop`).
