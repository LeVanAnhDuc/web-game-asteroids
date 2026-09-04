# Kế hoạch thực hiện · `asteroids-core`

Thiết kế: [`design.md`](design.md). Branch: `feat/asteroids-core`.

Đánh dấu `[x]` **ngay khi task xong**, không để cuối phiên — đây là thứ duy nhất cho biết đang ở đâu sau khi context bị nén.

## Giai đoạn 1 — Nền móng (làm tuần tự, mọi thứ khác phụ thuộc vào đây)

- [ ] **T1 · Scaffold dự án**
  `package.json` · `tsconfig.json` · `next.config.ts` (`output: 'export'`) · `tailwind.config.ts` · `postcss.config.mjs` · `vitest.config.mts` · `.eslintrc.json` · `src/app/layout.tsx` · `src/app/globals.css`
  Token của `MASTER.md` §0 vào `globals.css` dạng biến CSS và vào `tailwind.config.ts`. Font qua `next/font/google` (tải kèm build, `NFR-SEC-03`).
  ESLint `no-restricted-globals` + `no-restricted-imports` cho `src/game/core/**` (bất biến #1).
  *Xong khi:* `yarn typecheck` và `yarn test` chạy được (kể cả khi chưa có test nào).

- [ ] **T2 · Kiểu dữ liệu, hằng số, RNG, toán vector**
  `src/game/core/types.ts` · `constants.ts` · `rng.ts` · `vector.ts`
  `rng.ts`: mulberry32, có state, tạo từ seed. `vector.ts`: `wrap`, `shortestDelta` (khoảng cách có wrap — bất biến #5), `angleToVec` với quy ước 0 = lên.
  *Test:* RNG cùng seed cho cùng dãy · `wrap` ở cả bốn mép · `shortestDelta` đúng khi hai điểm ở hai mép đối diện · `angleToVec(0)` trả về `(0, -1)`.

## Giai đoạn 2 — Ba nhánh song song (chỉ phụ thuộc T2)

- [ ] **T3 · Lõi luật chơi**
  `src/game/core/step.ts` · `ship.ts` · `bullets.ts` · `asteroids.ts` · `ufo.ts` · `powerups.ts` · `collision.ts` · `spawn.ts` · `score.ts` · `particles.ts`
  Thứ tự trong `step()` theo `design.md` §2, số theo §3.
  *Test:* vỡ thiên thạch ba cấp · trần 4 viên đạn · đạn hết tuổi thọ · va chạm có wrap · mất mạng + bất tử · khiên hấp thụ đúng một va chạm · thay khe vũ khí · cộng dồn thời gian có trần 20s · chết thì mất power-up · hyperspace cooldown · +1 mạng ở mốc 10.000 · sinh wave · UFO từ wave 3 · **tái lập 1000 bước cùng seed** (`NFR-ROB-04`) · **benchmark `step()` < 4ms** với 60 vật thể (`NFR-PERF-02`).

- [ ] **T4 · Vẽ và vòng lặp**
  `src/game/render/draw.ts` · `src/game/loop.ts`
  `draw` chỉ đọc state, vẽ theo lớp ở `design.md` §4, nét scale theo kích thước canvas. `loop` giữ accumulator, clamp 0.25s, dựng `HudSnapshot` và chỉ phát khi giá trị đổi.
  *Test:* `dt` 10 giây chỉ chạy tối đa 15 bước (`NFR-ROB-03`) · snapshot không đổi thì không gọi callback (`NFR-PERF-03`) · `draw` không sửa state (so sánh sâu trước/sau).

- [ ] **T5 · Lưu điểm và chuỗi hiển thị**
  `src/storage/scoreStore.ts` · `localScoreStore.ts` · `src/i18n/vi.ts`
  Interface theo ADR-0006. Validate từng trường khi đọc, `try/catch` quanh mọi lời gọi `localStorage`.
  *Test:* JSON hỏng → bảng trống · thiếu trường → bỏ dòng đó · `localStorage` ném lỗi → không crash, `submit` im lặng bỏ qua · `rankOf` trả `null` khi không lọt top 10 · giữ đúng 10 dòng, sắp xếp giảm dần.

## Giai đoạn 3 — Giao diện (cần T2, T4, T5)

- [ ] **T6 · Vỏ React và các màn hình**
  `src/hooks/useGame.ts` · `src/components/GameShell.tsx` · `GameCanvas.tsx` · `Hud.tsx` · `MenuScreen.tsx` · `HelpScreen.tsx` · `HighScoresScreen.tsx` · `PauseOverlay.tsx` · `GameOverOverlay.tsx` · `InitialsInput.tsx` · `LiveRegion.tsx` · `src/app/page.tsx`
  React không giữ `GameState` (bất biến #8). Signature element khung vạch góc dùng cho mọi panel.
  *Test:* bấm Chơi thì chuyển pha · Esc tạm dừng · điểm lọt top 10 mới hiện ô nhập tên · bảng điểm trống có thông báo riêng.

- [ ] **T7 · Cảm ứng, bố cục co giãn, a11y**
  `src/components/TouchControls.tsx` · `src/input/keyboard.ts` · `touch.ts` · cập nhật `globals.css`
  Nút giữ được, ≥ 44px, `touch-action: none`, nhả khi con trỏ rời vùng hoặc khi mất `pointercapture`. Bố cục 375 / 768 / 1440 theo wireframe đã duyệt. `prefers-reduced-motion` tắt particle, rung màn, vệt đẩy, transition.
  *Test:* `pointerdown` rồi `pointerleave` thì nhả nút · hai nút bấm cùng lúc đều nhận · bàn phím và cảm ứng cho ra cùng `InputState`.

## Giai đoạn 4 — Chốt

- [ ] **T8 · Kiểm chứng**
  `yarn typecheck` · `yarn lint` · `yarn test` · `yarn build` · kiểm kích thước bundle so với `NFR-PERF-04`.

- [ ] **T9 · Nhìn app chạy thật**
  Mở app, chụp ở 375 / 768 / 1024 / 1440, thử bàn phím, thử một ván tới lúc hết lượt. Lệch so với wireframe đã duyệt thì nói rõ lệch ở đâu.

- [ ] **T10 · Tài liệu và commit**
  `README.md` với `## Features` · đổi trạng thái FR trong `scope.md` sang `xong` · cập nhật `backlog.md` §Đang làm · commit theo Conventional Commits · đẩy branch · mở PR.
