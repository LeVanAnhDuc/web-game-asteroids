# Thiết kế · `asteroids-core`

**Liên quan:** FR-01 … FR-19 · US-01 … US-06 · NFR-PERF-01 · NFR-PERF-02 · NFR-PERF-03 · NFR-ROB-01 · NFR-ROB-03 · NFR-ROB-04 · NFR-A11Y-03 · NFR-A11Y-04 · NFR-A11Y-05 · NFR-A11Y-06 · ADR-0001 … ADR-0007

Feature này là toàn bộ bản đầu của game. Nó không lặp lại nội dung tài liệu tier-1 — kiến trúc ở `03-design/architecture.md`, bất biến ở `03-design/invariants.md`, token ở `design-system/asteroids/MASTER.md`.

## 1. Mô hình dữ liệu

```ts
type Phase = 'menu' | 'playing' | 'paused' | 'gameover' | 'highscores' | 'help'
type AsteroidSize = 'large' | 'medium' | 'small'
type PowerUpKind = 'shield' | 'rapid' | 'spread' | 'pierce' | 'life'
type WeaponKind = Extract<PowerUpKind, 'rapid' | 'spread' | 'pierce'>

interface Body {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface Ship extends Body {
  angle: number // radian, 0 = hướng lên (-Y), tăng theo chiều kim đồng hồ
  thrusting: boolean
  invulnMs: number // > 0 nghĩa là đang bất tử, tàu nhấp nháy
  cooldownMs: number // giữa hai viên đạn
  hyperMs: number // cooldown hyperspace
  shield: boolean
  weapon: WeaponKind | null
  weaponMs: number // thời gian còn lại của khe vũ khí
}

interface Asteroid extends Body {
  size: AsteroidSize
  spin: number
  angle: number
  shape: number[]
}
interface Bullet extends Body {
  lifeMs: number
  pierce: boolean
  fromUfo: boolean
}
interface Ufo extends Body {
  big: boolean
  fireMs: number
  turnMs: number
}
interface PowerUp extends Body {
  kind: PowerUpKind
  lifeMs: number
}
interface Particle extends Body {
  lifeMs: number
  maxLifeMs: number
  hue: string
}

interface GameState {
  phase: Phase
  rng: Rng // hàm có state riêng, KHÔNG dùng Math.random (bất biến #1, #2)
  ship: Ship
  asteroids: Asteroid[]
  bullets: Bullet[]
  ufos: Ufo[]
  powerUps: PowerUp[]
  particles: Particle[]
  score: number
  lives: number
  wave: number
  nextExtraLifeAt: number // mốc điểm kế tiếp được +1 mạng
  shakeMs: number
  waveClearMs: number // khoảng nghỉ giữa hai wave
  ufoTimerMs: number
  announce: string | null // chuỗi cho aria-live, đọc xong thì xoá (NFR-A11Y-06)
}
```

`shape: number[]` là danh sách hệ số bán kính cho từng đỉnh của đa giác thiên thạch, sinh một lần lúc tạo từ `rng`. Nhờ vậy hình thù thiên thạch không cần tính lại mỗi frame và vẫn tái lập được theo seed (`NFR-ROB-04`).

## 2. Thứ tự trong một bước `step()`

Thứ tự cố định, vì đổi thứ tự là đổi luật chơi mà không ai nhận ra:

1. Áp `input` lên tàu: xoay, đẩy, bắn, hyperspace.
2. Tích phân chuyển động mọi vật thể, rồi wrap toạ độ.
3. Giảm mọi đồng hồ theo `dt`: `invulnMs`, `cooldownMs`, `hyperMs`, `weaponMs`, `lifeMs`, `shakeMs`.
4. UFO: quyết định đổi hướng, quyết định bắn.
5. Va chạm theo thứ tự: đạn↔thiên thạch → đạn↔UFO → đạn UFO↔tàu → tàu↔thiên thạch → tàu↔UFO → tàu↔power-up.
6. Cộng điểm, kiểm mốc `nextExtraLifeAt`.
7. Hết thiên thạch thì đếm `waveClearMs`, hết giờ thì sinh wave sau.
8. Cập nhật particle, loại bỏ vật thể đã chết.

Mọi khoảng cách ở bước 5 dùng khoảng cách ngắn nhất **có wrap** (bất biến #5).

## 3. Số cân bằng khởi điểm

Đơn vị: thế giới 1600×1200, thời gian tính bằng giây.

| Nhóm        | Giá trị                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tàu         | xoay 3.6 rad/s · đẩy 520 đv/s² · ma sát 0.6/s · trần tốc độ 620 đv/s · bán kính vẽ 18, hitbox 14 (≈ 78%, bất biến #10)                                 |
| Đạn         | tốc độ 780 đv/s · sống 1.2s · tối đa 4 viên · nhịp bắn 0.28s                                                                                           |
| Thiên thạch | bán kính 76 / 40 / 20 · tốc độ nền 60–130 đv/s · điểm 20 / 50 / 100 · vỡ thành 2 mảnh                                                                  |
| Wave        | `min(2 + wave, 11)` thiên thạch to · hệ số tốc độ `1 + 0.06 × (wave − 1)`, trần 1.8 · nghỉ 1.5s giữa hai wave                                          |
| UFO         | từ wave 3 · mỗi 18–28s · to: bán kính 26, bắn lệch ±0.4 rad, 200đ · nhỏ: bán kính 16, ngắm chuẩn, 1000đ, tỉ lệ xuất hiện tăng theo điểm tới tối đa 60% |
| Mạng        | bắt đầu 3 · +1 mỗi 10.000 điểm · bất tử sau hồi sinh 2.0s                                                                                              |
| Hyperspace  | cooldown 5.0s                                                                                                                                          |
| Power-up    | rơi 8% mỗi thiên thạch vỡ · tối đa 2 trên màn · sống 10s, nhấp nháy 3s cuối · hiệu lực 12s, cộng dồn trần 20s · `life` chiếm 1/12 số lần rơi           |

Tất cả nằm trong `src/game/core/constants.ts`. Chúng là ước lượng trên giấy — mục "Việc tiếp theo" của `backlog.md` ghi việc chỉnh lại sau khi chơi thật.

## 4. Vòng lặp và hiển thị

`loop.ts` giữ accumulator, clamp `0.25s` mỗi frame (`NFR-ROB-03`), gọi `step` nhiều lần nếu cần, `draw` một lần. Sau mỗi frame nó dựng `HudSnapshot { lives, score, wave, weapon, weaponMs, shield, hyperReady }`, so sánh nông với snapshot trước, chỉ khác mới báo cho React (`NFR-PERF-03`).

`draw.ts` vẽ theo lớp: sao nền tĩnh → particle → thiên thạch → power-up → UFO → đạn → tàu → hiệu ứng rung. Mọi nét dùng `stroke`, không `fill`, theo `MASTER.md` §0. Độ dày nét và cỡ chữ HUD nhân theo hệ số scale của canvas để ở khổ 375 nét không mảnh đến mức mất.

## 5. Tầng React

| Thành phần                                       | Việc                                                                                    |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `GameShell`                                      | Máy trạng thái `Phase`, quyết định overlay nào hiện                                     |
| `GameCanvas`                                     | Giữ `<canvas>`, dựng loop qua `useGame`, xử lý resize                                   |
| `Hud`                                            | Mạng, điểm, wave, thanh power-up, nút tạm dừng                                          |
| `TouchControls`                                  | Chỉ hiện trên thiết bị có `pointer: coarse`; nút giữ được, ≥ 44px, `touch-action: none` |
| `MenuScreen` · `HelpScreen` · `HighScoresScreen` | Ba màn tĩnh                                                                             |
| `PauseOverlay` · `GameOverOverlay`               | Hai overlay, có `InitialsInput` ba ký tự                                                |
| `LiveRegion`                                     | `aria-live="polite"`, phát `state.announce` (`NFR-A11Y-06`)                             |

Chuỗi hiển thị tập trung ở `src/i18n/vi.ts` (`NFR-I18N-01`).

## 6. Chiến lược test

- **Lõi (phần lớn số test):** gọi `step()` trực tiếp. Mỗi luật một test — vỡ thiên thạch, wrap, va chạm có wrap, khiên hấp thụ đúng một lần, thay khe vũ khí, cộng dồn thời gian có trần, hyperspace cooldown, mốc +1 mạng, sinh wave, xuất hiện UFO.
- **Tái lập (`NFR-ROB-04`):** hai state cùng seed, cùng chuỗi 1000 input, so sánh sâu kết quả.
- **Vòng lặp:** `dt` khổng lồ chỉ chạy tối đa 15 bước; snapshot HUD không đổi thì không phát callback.
- **Storage:** dữ liệu rác, thiếu trường, sai kiểu, và `localStorage` ném lỗi.
- **React:** render menu, bấm Chơi, kiểm chuyển pha; `TouchControls` nhả nút khi con trỏ rời vùng.
- Không test hình ảnh của canvas — `draw` chỉ đọc và không chứa luật chơi.
