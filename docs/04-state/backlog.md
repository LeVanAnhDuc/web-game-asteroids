# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-10 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

**Sửa feedback UX — pass 4/4 (pass cuối)**, branch `fix/expectations-and-contrast`, worktree
`../wt-keyboard-gameover`. Spec: `docs/specs/expectations-and-contrast/`. Pass 1 đã merge vào `main` (ADR-0015 · 0016 · 0017); pass 2 (ADR-0018), pass 3 (ADR-0019) và pass 4 (ADR-0020) đang chờ MR, mỗi pass một nhánh xếp trên nhánh trước.

Nguồn việc: `docs/ux-reviews/2026-09-11-lop-vo-7-red-route.md` — 10 phát hiện, chia
thành bốn pass. Pass 1 là ba lỗi, không thêm UI nên không qua cổng mockup:

- **Lỗi A** — hạng ở màn Hết lượt đọc từ `useRef` không kích hoạt re-render. Đóng F-01
  (Critical): ván đầu sau khi tải trang luôn hiện "Không lọt bảng" dù bảng trống.
- **Lỗi B** — `attachKeyboard(window, …)` không guard theo pha, `preventDefault` mũi tên
  và `Space` trên mọi màn. Đóng F-06 · F-09, và một vi phạm **NFR-A11Y-02** mà báo cáo
  không có: `Space` không bấm được nút đang có tiêu điểm.
- **Lỗi C** — câu thông báo hết lượt chốt điểm giữa step nên `aria-live` nói một số,
  panel nói số khác. Vi phạm **NFR-A11Y-06**. Không có trong báo cáo.

Ba quyết định đi kèm: ADR-0015 (phím thuộc pha nào) · ADR-0016 (hạng nằm trong state
React) · ADR-0017 (câu thông báo phát ở cuối step). **0012 và 0013 không có trong
index** — ID không tái dùng, nên đánh tiếp từ 0015.

Còn lại sau pass 1: pass 2 thấy được cách điều khiển (F-02 Critical · F-03) · pass 3
không mất điểm oan (F-05 · F-04) · pass 4 nói đúng kỳ vọng (F-07 · F-08 · F-10 + đo
tương phản). Quyết định đã chốt với người dùng: F-03 chỉ làm tàu dễ thấy hơn chứ không
đổi tên, F-05 cảnh báo trước khi thoát chứ không đổi luật ghi điểm, F-08 chỉ chỉnh kỳ
vọng ở menu vì bảng xếp hạng online là Non-Goal.

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

| Chỗ nào                                                     | Đã đánh đổi gì                                                              | Vì sao chấp nhận                                                                                                                                                                                                                                                                                                                                                                                | Khi nào buộc phải trả                                                                                                                                                                                                                    |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/game/core/constants.ts`                                | Toàn bộ số cân bằng là ước lượng trên giấy, chưa qua chơi thử               | Chốt số trên giấy nhanh hơn và đủ để dựng xong hệ thống; số sai không làm sai kiến trúc                                                                                                                                                                                                                                                                                                         | Ngay sau khi chơi được ván đầu — xem mục "Việc tiếp theo"                                                                                                                                                                                |
| `constants.ts` — `DIFFICULTY.easy` và `DIFFICULTY.hard`     | Bốn số của mức Dễ và bốn số của mức Khó cũng là ước lượng trên giấy         | Cùng loại nợ với dòng trên, và rẻ hơn: ba mức chỉ khác nhau ở dữ liệu, không ở luật, nên sửa số không sửa code                                                                                                                                                                                                                                                                                  | Cùng lúc với dòng trên. Mức Thường thì **không** được sửa tự do — ADR-0011                                                                                                                                                               |
| `docs/README.md` · `docs/decisions/README.md` (khối `auto`) | `docs-regen.sh` viết vạch bảng dạng `\| --- \|`, Prettier viết dạng căn đều | Nội dung không đổi một chữ, chỉ là định dạng; hai script luân phiên sửa lẫn nhau                                                                                                                                                                                                                                                                                                                | Khi nó gây nhiễu review thật — sửa `docs-regen.sh` để nó xuất đúng dạng Prettier                                                                                                                                                         |
| `e2e/game.spec.ts` — helper `startGame`                     | Click "Chơi" với `timeout: 2000` bọc trong `toPass({ timeout: 15_000 })`    | **Nợ có sẵn, không phải của pass này.** Đo 2026-09-11: chạy cả suite trên `main` chưa sửa gì cũng đỏ ngẫu nhiên 1 test ở đúng helper này (`121 passed, 1 failed`); cùng spec đó với `--workers=1` thì 10/10 xanh trong 22 giây. Tức nó đỏ vì đói CPU khi 5 project chạy song song, không vì sản phẩm sai. Ghi lại vì `backlog.md` đang nói "122 test e2e xanh" — câu đó không đúng trên máy này | Khi CI đỏ vì nó, hoặc khi có thêm test dài. Hướng: nới `toPass` cho helper, hoặc chờ một tín hiệu "đã hydrate" thay vì thử-lại-click. Pass 1 đã tự giảm phần mình bằng cách gộp hai test hết lượt (mỗi cái ~22s mô phỏng thật) thành một |
