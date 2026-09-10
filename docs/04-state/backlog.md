# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-10 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

**Chế độ chơi & độ khó** (2026-09-10) — đang ở **bước 1 của `feature-flow`**, chờ cổng
duyệt. Phạm vi đã chốt với người dùng: ba mức sẵn Dễ · Thường · Khó **cộng** một chế độ
Tuỳ chỉnh với thanh trượt, và **ván Tuỳ chỉnh không ghi vào bảng điểm** — đó là cách
tránh việc điểm ở hai mức khác nhau đứng chung một hạng.

Bốn quyết định đã chốt trong hội thoại, chưa có file nào ghi lại:

1. **Bộ núm đúng 4 số**: `startLives` · hệ số tốc độ thiên thạch · tỉ lệ rơi power-up ·
   wave UFO bắt đầu. Bốn chỗ đọc tương ứng: `core/state.ts`, `core/asteroids.ts`
   (`waveSpeedFactor`), `core/powerups.ts` (`rollDrop`), `core/ufo.ts` (`updateUfos`).
2. **Tuning nằm trong `GameState`** (`state.tuning`), đặt một lần ở `resetForNewGame`.
   Lý do không truyền theo tham số: `NFR-ROB-04` chỉ còn đúng nếu ván dựng lại được từ
   seed **và** tuning cùng nằm trong state. Sẽ thành ADR khi bắt đầu viết `design.md`.
3. **Bảng điểm: ba khoá localStorage riêng**, mỗi mức top 10 độc lập. Khoá hiện có
   `asteroids.highscores.v1` giữ nguyên làm bảng mức Thường — không migration, không
   sửa `isValidEntry`/`rankOf`/`sortEntries`, và **không xoá điểm của người đang chơi**.
4. **Chọn mức inline ở menu**, mặc định Thường, nhớ vào localStorage; chỉ Tuỳ chỉnh mở
   màn riêng. Lý do: Non-Goal đầu của `overview.md` §4 (chơi được trong 2 giây) loại bỏ
   một màn chọn chế độ bắt buộc trước mọi ván.

**Đang chặn:** wireframe ASCII của ba màn (menu · tuỳ chỉnh · bảng điểm) đã trình trong
hội thoại, đang chờ duyệt. Duyệt xong mới dựng canvas ba khổ 375/768/1440, rồi mới viết
`docs/specs/game-modes/design.md` + `plan.md`. Chưa có FR/US/ADR nào được cấp số, chưa
tạo branch, chưa sửa một dòng code nào.

---

**Đổi thương hiệu sang `Duck Drift`** — đã xong, merge qua PR #10 (`7e8a753`). Giữ lại ở
đây vì hai điều còn ràng buộc mọi việc sau: **thư mục local vẫn là**
`web-game-asteroids` (thương hiệu đổi, đường dẫn không), địa chỉ chơi là
<https://levananhduc.github.io/web-game-duck-drift/> — GitHub redirect URL *repo* cũ
nhưng **không** redirect đường dẫn Pages cũ.

Từ "asteroid" trong code **không** đổi: đó là tên *đối tượng trong game* (viên thiên
thạch) — `integrateAsteroids`, `bulletsVsAsteroids`, `state.asteroids`. Khoá
`localStorage` `asteroids.highscores.v1` **không** đổi: đổi là xoá bảng điểm của người
đang chơi.

CI/CD đã xong: ba workflow (CI, deploy GitHub Pages, release tự động), e2e Playwright ở
năm cấu hình, hai gate ngưỡng. Feature `asteroids-core` đã xong toàn bộ 10 task của
`docs/specs/asteroids-core/plan.md`.

## Việc tiếp theo

| Việc                                                      | Liên quan           | Ưu tiên    | Vì sao ưu tiên đó                                                                                                                                                                                                                                      |
| --------------------------------------------------------- | ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chơi thật rồi tinh chỉnh số cân bằng trong `constants.ts` | FR-06 · FR-09       | cao        | Các con số hiện tại (8% rơi power-up, 12 giây hiệu lực, `2 + n` thiên thạch) là điểm khởi đầu suy ra trên giấy. Cân bằng game không chốt được nếu chưa chơi                                                                                            |
| Nhìn ba khổ 375 / 768 / 1024 bằng mắt                     | FR-17 · NFR-A11Y-03 | trung bình | E2E Playwright (ADR-0008) đã kiểm tự động ở đúng ba khổ đó: không tràn ngang, canvas nằm trong khung nhìn, vùng bấm ≥ 44px trên Pixel 5. Còn lại là phần assert không nói được — cân đối, khoảng trống, cảm giác chật — nên đã hạ ưu tiên chứ chưa xoá |
| Đo frame rate trên điện thoại thật                        | NFR-PERF-01         | cao        | Ngưỡng 50fps hiện chưa được đo trên thiết bị nào; máy dev không đại diện                                                                                                                                                                               |
| Âm thanh: bắn, vỡ, nhặt power-up, mất mạng                | —                   | trung bình | Nằm trong Non-Goals của bản đầu, nhưng là thứ thêm sau được mà không đụng gameplay                                                                                                                                                                     |
| Bảng xếp hạng online                                      | FR-12 · ADR-0006    | thấp       | Cần backend nên vi phạm trần chi phí 0 đồng. Interface `ScoreStore` đã mở sẵn đường                                                                                                                                                                    |
| Chế độ chơi thêm: Time Attack, Daily seed                 | —                   | thấp       | RNG đã có seed nên Daily seed gần như miễn phí về kỹ thuật; cái đắt là thêm màn hình chọn chế độ và bảng điểm tách theo chế độ                                                                                                                         |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào                         | Đã đánh đổi gì                                                                                                                    | Vì sao chấp nhận                                                                          | Khi nào buộc phải trả                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Quy trình `feature-flow` bước 1 | Bỏ qua bước dựng canvas mockup trên Artifact và cổng duyệt của nó; chỉ có wireframe ASCII đã duyệt trong hội thoại và `MASTER.md` | Người dùng uỷ quyền chạy hết không hỏi lại, mà cổng đó về bản chất là chờ người xem duyệt | Feature UI tiếp theo có màn hình mới — lúc đó dựng canvas như quy trình |
| Quy trình `feature-flow` bước 3 | Làm trên branch tại chỗ thay vì worktree riêng                                                                                    | Repo vừa tạo, không có việc song song, không có gì để cách ly khỏi                        | Khi có hai feature chạy cùng lúc                                        |
| `src/game/core/constants.ts`    | Toàn bộ số cân bằng là ước lượng trên giấy, chưa qua chơi thử                                                                     | Chốt số trên giấy nhanh hơn và đủ để dựng xong hệ thống; số sai không làm sai kiến trúc   | Ngay sau khi chơi được ván đầu — xem mục "Việc tiếp theo"               |
