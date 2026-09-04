# Asteroids

Game bắn thiên thạch kiểu arcade, thêm hệ power-up, chơi ngay trong trình duyệt bằng bàn phím hoặc bằng ngón tay. Không cài đặt, không đăng nhập, không backend.

## Features

- Classic Asteroids flight model: rotation, inertial thrust, friction and screen wrap on a fixed 1600×1200 world.
- Asteroids split large → medium → small, scoring 20 / 50 / 100 per hit.
- Endless waves that grow in size and speed, with two UFO types appearing from wave 3.
- Five power-ups — shield, rapid fire, spread shot, piercing rounds and an extra life — where the three weapons share one slot.
- Hyperspace on a 5-second cooldown, with no random self-destruct.
- Keyboard controls on desktop and real hold-to-act touch controls on phones and tablets.
- Local top-10 high scores with arcade-style three-letter initials, kept in the browser.
- Respects `prefers-reduced-motion`, announces game events to screen readers, and encodes every power-up with a shape as well as a colour.

## Chạy dự án

```bash
yarn install
yarn dev          # http://localhost:3000
```

Không cần biến môi trường nào — xem [`.env.example`](.env.example).

| Lệnh              | Việc                                                  |
| ----------------- | ----------------------------------------------------- |
| `yarn dev`        | chạy dev server                                       |
| `yarn build`      | build tĩnh ra `out/`                                  |
| `yarn test`       | chạy toàn bộ test (vitest)                            |
| `yarn test:watch` | chạy test ở chế độ watch                              |
| `yarn typecheck`  | `tsc --noEmit`                                        |
| `yarn lint`       | ESLint, gồm cả rule chặn `Math.random` trong lõi game |

## Điều khiển

| Hành động   | Phím                 |
| ----------- | -------------------- |
| Xoay        | `←` `→` hoặc `A` `D` |
| Đẩy         | `↑` hoặc `W`         |
| Bắn         | `Space`              |
| Dịch chuyển | `Shift`              |
| Tạm dừng    | `Esc` hoặc `P`       |

Trên thiết bị cảm ứng, các nút hiện ở nửa dưới màn hình.

## Cấu trúc

```
src/
  game/core/     luật chơi — TypeScript thuần, không React, không DOM
  game/render/   vẽ Canvas 2D, chỉ đọc state
  game/loop.ts   fixed timestep 60Hz
  input/         bàn phím và cảm ứng, cùng đổ về một InputState
  storage/       bảng điểm sau interface ScoreStore
  components/    giao diện React ngoài canvas
```

Tài liệu đầy đủ ở [`docs/`](docs/README.md): [kiến trúc](docs/03-design/architecture.md), [bất biến](docs/03-design/invariants.md) (đọc trước khi sửa code), và [các quyết định kỹ thuật](docs/decisions/README.md).
