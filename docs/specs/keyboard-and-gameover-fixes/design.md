# Thiết kế · `keyboard-and-gameover-fixes`

**Liên quan:** FR-12 · FR-20 · FR-21 · FR-22 · US-02 · US-07 · US-08 · NFR-A11Y-02 · NFR-A11Y-06 · NFR-PERF-03 · NFR-ROB-04 · ADR-0010 · ADR-0011 · ADR-0015 · ADR-0016 · ADR-0017

Pass 1 trong bốn pass sửa feedback của `docs/ux-reviews/2026-09-11-lop-vo-7-red-route.md`. Đây là pass **thuần sửa lỗi**: không thêm màn nào, không thêm nút nào, không đổi bố cục — nên nó **không đi qua cổng mockup** của `feature-flow`. Ba pass còn lại (thấy được cách điều khiển · không mất điểm oan · nói đúng kỳ vọng) có UI mới và sẽ qua cổng đó.

Không lặp lại tài liệu tier-1: bất biến ở `03-design/invariants.md`, ranh giới module ở `03-design/architecture.md` §3, ngưỡng ở `02-requirements/nfr.md`, tên gọi ở `01-product/glossary.md`.

## 0. Báo cáo UX nói sai hai chỗ — sửa lại ở đây trước khi sửa code

Báo cáo được viết từ log persona, và ở hai phát hiện thì persona đã suy luận sai nguyên nhân. `design.md` là chỗ chốt lại sự thật đo được, không phải chỗ nhắc lại báo cáo.

| Báo cáo nói                                                                              | Sự thật đo được                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F-06:** thanh `UFO từ wave` "không có lựa chọn tắt hẳn UFO", max là 5                  | Mốc "tắt" **có tồn tại**: `TUNING_LIMITS.ufoFirstWave.max = UFO_NEVER = 10`, và `CustomScreen` hiện `vi.custom.ufoOff` khi giá trị ≥ 10. Persona không với tới được vì **phím mũi tên chết**, không phải vì thiếu giá trị.                                                                                                                                             |
| **F-09:** "chỉ riêng thanh Số mạng không phản hồi phím mũi tên, 3 thanh kia bình thường" | Mũi tên chết trên **cả 4 thanh**. Những lần persona thấy giá trị tăng là do **cú click vào thanh** (click trên `input[type=range]` đặt giá trị theo vị trí bấm) — chính cậu ấy cũng đoán vậy ở phiên mù #2. `Home`/`End` sống vì chúng rơi vào nhánh `return` trước `preventDefault`. Chuyện "ArrowLeft làm giá trị tăng" cũng từ đó: đó là cú click, không phải phím. |

Cách đo, tái lập được trên bản build ở `:4173`, màn Tuỳ chỉnh:

```js
document.getElementById('tuning-startLives').focus() // tiêu điểm đúng chỗ
// ArrowRight → value không đổi, e.defaultPrevented === true
// Home       → value về min,   e.defaultPrevented === false
```

## 1. Ba lỗi, và cái thứ ba chưa có trong báo cáo

### Lỗi A · Hạng ở màn Hết lượt đọc từ một `ref` không kích hoạt re-render

**F-01, Critical.** `rankRef` là `useRef` (`views/Home/index.tsx:50`) nhưng được **đọc lúc render** để truyền vào `GameOverOverlay` (`:211`), còn `FreezeRankAtGameOver` chỉ gán `rankRef.current` trong `useEffect`. Gán vào `.current` không lên lịch render, nên cái người chơi thấy là giá trị của **lần render trước**:

| Ván                       | `rankRef.current` lúc overlay render    | Người chơi thấy                                                        |
| ------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| ván đầu sau khi tải trang | `null` (giá trị khởi tạo)               | "Không lọt bảng", không có form nhập tên — dù bảng trống và điểm dương |
| ván sau, bấm "Chơi lại"   | hạng mà effect của **ván trước** đã gán | `#1` cho một ván điểm thấp hơn                                         |

`rankIn()` ở `storage/scoreStore.ts:72` **không sai** — nó chỉ không bao giờ được đọc đúng lúc. Đây là lý do nghịch lý 40/20 tái hiện được 3/3 lần trên profile sạch.

### Lỗi B · Bàn phím của game chiếm phím trên mọi màn

**F-06 + F-09 + một vi phạm NFR-A11Y-02 chưa persona nào chạm tới.** `attachKeyboard(window, …)` gắn một lần cho cả đời component, **không có guard theo phase** (`hooks/useGame.ts:148-160`), và `onKeyDown` gọi `preventDefault()` sau khi nhận phím của game (`input/keyboard.ts:47`). Listener ở `window` chạy ở pha bubble, vẫn kịp huỷ hành vi mặc định của phần tử đang có tiêu điểm.

Hệ quả đo được, trên mọi màn kể cả menu:

- Mũi tên không đổi được giá trị thanh trượt nào → F-09, và kéo theo F-06.
- **`Space` không bấm được nút đang có tiêu điểm** — đo trên nút "Về menu" ở màn Tuỳ chỉnh: `defaultPrevented: true`, 0 click, màn hình không đổi. Đây là vi phạm trực tiếp **NFR-A11Y-02**. Ngân (p03) không vấp vì cô ấy dùng `Enter`; nếu cô ấy dùng `Space` — thói quen phổ biến không kém — phiên RR-02 đã bỏ cuộc ngay ở menu.

### Lỗi C · Câu thông báo hết lượt chốt số điểm giữa step

**Không có trong báo cáo** — tôi đo được ở bước kiểm chứng (`00-verify-nghich-ly-bang-diem.md`), và không persona nào vấp vì Ngân không đi tới màn Hết lượt.

`step()` return sớm khi `phase !== 'playing'` (`core/step.ts:52`), nhưng kiểm tra đó chạy **một lần ở đầu step**. Trong đúng cái step giết tàu: `killShip` đặt `phase = 'gameover'` rồi chốt `ANNOUNCE.gameOver(state.score)` với điểm **tại thời điểm đó** (`core/ship.ts:144-146`); phần còn lại của cùng step ấy vẫn giải quyết va chạm và vẫn cộng điểm.

Kết quả: cùng một ván, ba nguồn nói hai số.

```
vùng aria-live:  "Hết lượt. Tổng điểm 20."   ← chốt giữa step
HUD:             "Điểm: 40"                  ← cuối step
panel Hết lượt:  Điểm 40                      ← cuối step, và đây là số được ghi vào bảng
```

Người dùng trình đọc màn hình nghe một số, bảng điểm lưu một số khác. Vi phạm **NFR-A11Y-06** ở phần "hết lượt được công bố".

## 2. Ba quyết định

### ADR-0015 · Bàn phím của game chỉ sở hữu phím ở pha `playing`, và `paused` chỉ sở hữu phím tạm dừng

Luật:

| Pha                                                    | Bàn phím game xử lý gì                                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `playing`                                              | tất cả phím game (xoay · đẩy · bắn · dịch chuyển · tạm dừng), `preventDefault` như hiện tại |
| `paused`                                               | **chỉ** phím tạm dừng (`Esc` · `P`) để chơi tiếp. Mũi tên và `Space` để nguyên cho overlay  |
| `menu` · `help` · `highscores` · `custom` · `gameover` | **không gì cả**                                                                             |

Vì sao không guard theo "tiêu điểm đang ở phần tử nhập liệu" thay vì theo pha: ở pha `playing`, người chơi vừa bấm chuột vào nút "Tạm dừng" rồi chơi tiếp thì tiêu điểm **vẫn nằm trên cái nút đó**. Guard theo tiêu điểm sẽ biến `Space` thành "bấm lại nút tạm dừng" thay vì "bắn" — đổi một lỗi a11y thành một lỗi gameplay. Guard theo pha không có chỗ mơ hồ đó.

Việc `attachKeyboard` cần biết pha mà không được giữ `GameState` trong React (bất biến #8): truyền vào một hàm `getPhase: () => Phase | null` đọc `stateRef.current?.phase`. Input không phải `core/**` nên không vướng bất biến #1.

Phải dọn `input` khi rời pha `playing`: rời màn lúc đang giữ phím đẩy thì không có `keyup` nào tới, và trạng thái "đang đẩy" sẽ dính sang ván sau. Đã có `onBlur` làm việc này cho trường hợp mất focus; cần thêm cho trường hợp đổi pha.

### ADR-0016 · Hạng lúc hết lượt nằm trong state React, chốt trước khi ghi bảng, trong layout effect

Đổi `rankRef` (`useRef`) thành `useState`, và `FreezeRankAtGameOver` dùng `useLayoutEffect` thay `useEffect`.

- `useState` là thứ làm overlay render lại với hạng đúng — đây là phần sửa lỗi.
- `useLayoutEffect` chạy sau khi DOM đổi nhưng **trước khi paint**, nên hạng đúng xuất hiện trong cùng một frame. Dùng `useEffect` thì người chơi thấy "Không lọt bảng" nhấp một nhịp rồi mới đổi thành `#1` — đúng về dữ liệu nhưng nhìn như lỗi.
- Giữ nguyên tính chất mà ghost này tồn tại để bảo vệ: hạng được chốt **trước** khi điểm mới được `submit()` vào bảng. Đó vẫn là lý do không tính hạng bằng `useMemo` lúc render — sau khi lưu, bảng đã có dòng mới và hạng tính lại sẽ sai.

Một lần render thêm cho mỗi lần hết lượt không đụng **NFR-PERF-03**: ngưỡng đó nói về render **mỗi frame** trong lúc chơi, không phải một lần lúc chuyển pha.

### ADR-0017 · Câu thông báo hết lượt phát ở cuối step, không phát giữa step

`killShip` chỉ đặt `phase = 'gameover'`. Câu thông báo hết lượt được phát ở **cuối** `step()`, khi phát hiện pha vừa chuyển sang `gameover` trong step này, và lúc đó `state.score` đã là số cuối cùng.

Giữ đúng bất biến #7 (chỉ `step()` và các hàm chuyển pha có tên trong `core/state.ts` được sửa `GameState`) và #1 (lõi không gọi gì ngoài `dt`/`state.rng`). Không đụng `ANNOUNCE.lifeLost` — mất một mạng thì số mạng không đổi thêm trong cùng step, nên nó đang đúng.

## 3. Phạm vi — cái pass này KHÔNG làm

- Không đụng `TUNING_LIMITS`, không đổi biên thanh trượt nào. Mốc "tắt" đã tồn tại; sửa lỗi B là đủ để với tới nó. Việc **thanh trượt không nói ra biên và mốc đặc biệt của nó** (phần còn thật của F-06) là việc của pass 4.
- Không thêm nút điều khiển cảm ứng, không đổi cách vẽ tàu (F-02 · F-03 → pass 2).
- Không đổi luật ghi điểm, không thêm cảnh báo trước khi thoát (F-05 · F-04 → pass 3).
- Không đổi nhãn "Bảng điểm", không đo tương phản (F-07 · F-08 · F-10 → pass 4).
- Không thêm `FR` mới: cả ba lỗi đều là chức năng đã có trong `scope.md` chạy sai, không phải chức năng mới.

## 4. Cách biết là đã sửa

| Lỗi | Bằng chứng phải có                                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A   | Test: ván đầu tiên sau khi mount, bảng trống, điểm dương → overlay hiện `#1` **và** form nhập tên. Ván thứ hai điểm thấp hơn → hạng đúng theo bảng lúc đó, không phải hạng ván trước.                                                                                                            |
| B   | Test: ở mỗi pha không phải `playing`, `keydown` mũi tên và `Space` có `defaultPrevented === false`. Ở `playing` thì vẫn `true`. E2E: Tab tới nút rồi bấm `Space` thì nút chạy; Tab tới thanh trượt rồi bấm mũi tên thì giá trị đổi; kéo `UFO từ wave` tới max bằng bàn phím thì nhãn hiện "tắt". |
| C   | Test: trong một step vừa giết tàu vừa cộng điểm, `state.announce` chứa **điểm cuối step**. E2E: chuỗi trong vùng `aria-live` và số trên panel Hết lượt khớp nhau.                                                                                                                                |

Và bước 5 của `feature-flow`: xem trên app thật ở 375 · 768 · 1024 · 1440, có thao tác bàn phím thật.
