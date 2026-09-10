# Thiết kế · `game-modes`

**Liên quan:** FR-20 · FR-21 · FR-22 · US-07 · US-08 · NFR-ROB-01 · NFR-ROB-02 · NFR-ROB-04 · NFR-PERF-03 · NFR-A11Y-02 · NFR-A11Y-03 · NFR-I18N-01 · ADR-0006 · ADR-0010 · ADR-0011

Game hiện có đúng một độ khó. Feature này thêm ba mức sẵn cộng một chế độ tự tinh chỉnh. Nó **không** lặp lại tài liệu tier-1: bất biến ở `03-design/invariants.md`, ranh giới module ở `03-design/architecture.md` §3, token ở `design-system/asteroids/MASTER.md`, tên gọi ở `01-product/glossary.md`.

Mockup đã duyệt sống trên canvas Claude, không có bản nào trong repo — đúng quy ước ở `.claude/CLAUDE.md`.

## 1. Mô hình dữ liệu

```ts
type DifficultyId = 'easy' | 'normal' | 'hard' | 'custom'

/** Bốn số quyết định độ khó. KHÔNG thêm núm thứ năm mà không sửa ADR-0010. */
interface Tuning {
  /** Mạng lúc bắt đầu ván. Thay `SCORING.startLives`. */
  startLives: number
  /** Nhân vào hệ số tốc độ thiên thạch của wave. 1 = như hiện tại. */
  asteroidSpeed: number
  /** Xác suất rơi power-up mỗi lần thiên thạch vỡ, 0..1. Thay `POWERUP.dropChance`. */
  dropChance: number
  /** Wave đầu tiên UFO xuất hiện. `UFO_NEVER` (= 10) nghĩa là không bao giờ. */
  ufoFirstWave: number
}
```

`GameState` thêm hai trường, `HudSnapshot` thêm một:

```ts
interface GameState {
  // …như cũ
  difficulty: DifficultyId
  tuning: Tuning
}

interface HudSnapshot {
  // …như cũ
  difficulty: DifficultyId
}
```

`difficulty` nằm trong state chứ không chỉ ở tầng React vì màn Hết lượt phải biết ván vừa rồi là chế độ nào để quyết định **có hỏi tên hay không** (FR-21: ván tuỳ chỉnh không ghi bảng). `tuning` nằm trong state vì `NFR-ROB-04` — xem ADR-0010.

`hudEquals` phải so thêm `difficulty`, nếu không React không re-render khi đổi ván sang mức khác (`NFR-PERF-03` bảo vệ chiều ngược lại, nhưng bỏ sót một trường thì HUD đứng yên sai).

## 2. Ba mức sẵn

`constants.ts` giữ `DIFFICULTY: Record<'easy' | 'normal' | 'hard', Tuning>`:

| Mức    | `startLives` | `asteroidSpeed` | `dropChance` | `ufoFirstWave` |
| ------ | ------------ | --------------- | ------------ | -------------- |
| Dễ     | 5            | 0.75            | 0.16         | 6              |
| Thường | 3            | 1.0             | 0.08         | 3              |
| Khó    | 2            | 1.3             | 0.05         | 1              |

**Mức Thường bằng đúng game hiện tại** — đó là điều kiện để bảng điểm cũ (`asteroids.highscores.v1`) còn so sánh được với điểm mới. Test phải khoá điều này lại, không phải tin vào việc đọc bảng.

Số của Dễ và Khó là ước lượng trên giấy, cùng loại nợ với `constants.ts` hiện có — đã ghi vào `04-state/backlog.md` §Nợ kỹ thuật.

## 3. Chế độ Tuỳ chỉnh

Bốn thanh trượt, biên và bước:

| Núm             | Biên      | Bước | Mặc định | Hiện ra              |
| --------------- | --------- | ---- | -------- | -------------------- |
| `startLives`    | 1 … 6     | 1    | 3        | `3`                  |
| `asteroidSpeed` | 0.6 … 1.6 | 0.1  | 1.0      | `1.0×`               |
| `dropChance`    | 0 … 0.30  | 0.01 | 0.08     | `8%`                 |
| `ufoFirstWave`  | 1 … 10    | 1    | 3        | `3` · `tắt` ở mốc 10 |

`UFO_NEVER = 10` là hằng số có tên, không phải số 10 rải trong `ufo.ts`. Điều kiện sinh UFO thành:

```ts
if (state.tuning.ufoFirstWave < UFO_NEVER && state.wave >= state.tuning.ufoFirstWave && state.ufos.length === 0)
```

Không có mức nào trong §2 dùng giá trị 10, nên nhánh "tắt" chỉ tới được qua Tuỳ chỉnh.

Ván Tuỳ chỉnh **không ghi bảng điểm và không hỏi tên**. Đây là cách rẻ nhất để bảng điểm còn nghĩa mà không cần cột đánh dấu hay bảng thứ tư — người chơi tự đặt 6 mạng và tốc độ 0.6× thì điểm không so được với ai.

## 4. Bốn chỗ lõi đọc tuning

Chỉ bốn chỗ, mỗi chỗ một dòng. Không chỗ nào khác được đọc `state.tuning`.

| Núm             | File                | Hàm                                   | Đang đọc             |
| --------------- | ------------------- | ------------------------------------- | -------------------- |
| `startLives`    | `core/state.ts`     | `createGameState` · `resetForNewGame` | `SCORING.startLives` |
| `asteroidSpeed` | `core/asteroids.ts` | `waveSpeedFactor`                     | `WAVE.speedStep`     |
| `dropChance`    | `core/powerups.ts`  | `rollDrop`                            | `POWERUP.dropChance` |
| `ufoFirstWave`  | `core/ufo.ts`       | `updateUfos`                          | `UFO.firstWave`      |

`waveSpeedFactor` nhận thêm tham số thứ hai và **chặn trần trước, nhân hệ số sau**:

```ts
export function waveSpeedFactor(wave: number, speedMul: number): number {
  const ramp = 1 + WAVE.speedStep * (wave - 1)
  return (ramp > WAVE.maxSpeedFactor ? WAVE.maxSpeedFactor : ramp) * speedMul
}
```

Thứ tự này là chủ ý: trần `maxSpeedFactor` giới hạn phần _tăng theo wave_, còn hệ số độ khó nhân lên trên đó — nên mức Khó ở wave cao đạt 1.8 × 1.3 = 2.34, vẫn khó hơn Thường. Nếu chặn trần sau khi nhân thì Khó và Thường **hội tụ về cùng một tốc độ** ở wave cao, tức là mức Khó tự biến mất đúng lúc nó cần có ý nghĩa nhất.

`SCORING.startLives`, `POWERUP.dropChance`, `UFO.firstWave` và `WAVE.speedStep` vẫn ở lại `constants.ts` — chúng là giá trị của mức Thường và là nơi `DIFFICULTY.normal` lấy số từ đó, không phải hằng số chết.

## 5. Lưu trữ

Năm khoá `localStorage`, tất cả giữ tiền tố `asteroids.` đang có:

| Khoá                           | Giữ gì                | Ghi chú                                         |
| ------------------------------ | --------------------- | ----------------------------------------------- |
| `asteroids.highscores.v1`      | top 10 mức **Thường** | **Không đổi** — đổi là xoá điểm người đang chơi |
| `asteroids.highscores.easy.v1` | top 10 mức Dễ         | mới                                             |
| `asteroids.highscores.hard.v1` | top 10 mức Khó        | mới                                             |
| `asteroids.difficulty.v1`      | mức đang chọn ở menu  | mới                                             |
| `asteroids.tuning.v1`          | bốn số của Tuỳ chỉnh  | mới                                             |

Ba khoá điểm độc lập, mỗi khoá top 10 riêng — ADR-0011. `isValidEntry`, `rankIn`, `sortEntries` và interface `ScoreStore` (ADR-0006) **không đổi một dòng**; `createLocalScoreStore` chỉ nhận thêm tham số khoá.

Hai khoá cài đặt đọc qua validate như mọi thứ khác (`NFR-ROB-01`, bất biến #9), và storage bị chặn thì vẫn chơi được, chỉ không nhớ lựa chọn (`NFR-ROB-02`):

- `difficulty`: phải là một trong bốn chuỗi; sai hoặc thiếu → `'normal'`.
- `tuning`: bốn trường phải là số hữu hạn, rồi **clamp về biên ở §3**; trường sai → lấy mặc định của trường đó, không bỏ cả object. Người dùng sửa tay `speed: 99` phải ra 1.6, không phải ra một ván không chơi được.

## 6. UI

Ba màn đổi, một pha mới. `Phase` thêm `'custom'` (FR-11 mở rộng).

**Menu** — dãy 3 mức đặt ngay trên nút Chơi, trong cùng cột 320px. Bấm Chơi là vào ván ngay: không thêm cú bấm nào, vì Non-Goal đầu của `overview.md` §4 (chơi được trong 2 giây) loại bỏ một màn chọn chế độ bắt buộc. "Tuỳ chỉnh" là **nút thứ tư trong nhóm nút**, không phải mức thứ tư trong dãy — nó dẫn sang màn khác nên nó không cùng loại với ba mức kia. Dòng "Điểm cao nhất" đọc bảng của mức đang chọn.

**Màn Tuỳ chỉnh** — bốn thanh trượt trong một `Panel`; 375 xếp dọc, từ 640px trở lên xếp 2×2 trong cùng khung 576px. Dòng cảnh báo "không ghi vào bảng điểm" nằm ngay trên hai nút, không nằm ở đáy màn.

**Bảng điểm** — 3 tab, mở đúng tab của mức đang chọn. Nút xoá ghi rõ tên bảng (`Xoá bảng Khó`) vì nó **chỉ xoá tab đang mở**; bảng trống thì nút xoá biến mất hẳn, như hiện tại. Sau khi lưu điểm, mở tab của mức vừa chơi và làm nổi dòng vừa thêm — cùng cơ chế `highlightAt` đang có, chỉ thêm việc chọn tab.

Ràng buộc a11y, tất cả đều là ngưỡng đã có chứ không phải mới:

- Dãy mức ở menu là **nhóm nút bật/tắt**: `role="group"` + `aria-pressed`. Dãy ở bảng điểm là **tab thật**: `role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls` trỏ vào panel. Cùng một hình, hai ngữ nghĩa khác nhau — nó lọc bảng bên dưới chứ không phải chọn một lựa chọn để dùng sau.
- Mỗi thanh trượt cần `aria-valuetext`: giá trị hiện ra (`1.0×`, `8%`, `tắt`) nằm ở `<span>` bên cạnh nên trình đọc màn hình không thấy. Không có nó, thanh UFO đọc là "10" — mà 10 nghĩa là **tắt**, không phải wave 10.
- Vùng bấm ≥ 44px cho cả chip mức và thanh trượt (`NFR-A11Y-03`).
- Mọi chuỗi vào `i18n/vi.ts` (`NFR-I18N-01`). Nhãn nút xoá thành hàm nhận tên mức, không còn là chuỗi tĩnh.

## 7. Test

- **Lõi:** mỗi núm một test chứng minh nó thật sự đổi hành vi — 5 mạng khi `startLives: 5`; thiên thạch wave 1 nhanh hơn khi `asteroidSpeed` cao hơn; `dropChance: 0` không bao giờ rơi và `1` luôn rơi; `ufoFirstWave: UFO_NEVER` không sinh UFO dù chạy qua wave 10.
- **Khoá mức Thường:** `DIFFICULTY.normal` phải bằng đúng bộ hằng số hiện tại. Test này là thứ chặn việc âm thầm đổi cân bằng của những ván đã ghi điểm.
- **Tái lập (`NFR-ROB-04`):** cùng seed **và** cùng tuning → cùng state sau 1000 bước. Test tái lập hiện có phải nói rõ tuning nó dùng.
- **Storage:** dữ liệu rác, thiếu trường, sai kiểu, ngoài biên → ra mặc định đã clamp, không ném lỗi; storage ném lỗi → vẫn chạy.
- **Ba bảng độc lập:** ghi điểm mức Dễ không đụng bảng Thường; xoá bảng Khó không đụng hai bảng kia.
- **E2E:** menu có dãy mức và nút Tuỳ chỉnh; `startGame()` trong `e2e/game.spec.ts` vẫn bấm đúng nút Chơi.

## 8. Không làm trong feature này

- Không có Time Attack, không có Daily seed. Chúng vẫn nằm ở `04-state/backlog.md` §Việc tiếp theo.
- Không nhân hệ số điểm theo độ khó. Ba bảng riêng đã giải quyết việc so sánh; hệ số nhân chỉ tạo thêm một con số phải cân bằng.
- Không đổi khoá `asteroids.highscores.v1`, không migration, không đụng `ScoreStore`.
- Không thêm núm thứ năm.
