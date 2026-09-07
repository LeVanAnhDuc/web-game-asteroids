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

Không cần biến môi trường nào để chạy ở máy — xem [`.env.example`](.env.example).

| Lệnh              | Việc                                                  |
| ----------------- | ----------------------------------------------------- |
| `yarn dev`        | chạy dev server                                       |
| `yarn build`      | build tĩnh ra `out/`                                  |
| `yarn test`       | chạy toàn bộ test (vitest)                            |
| `yarn test:watch` | chạy test ở chế độ watch                              |
| `yarn test:e2e`   | Playwright, chạy trên bản export tĩnh trong `out/`    |
| `yarn typecheck`  | `tsc --noEmit`                                        |
| `yarn lint`       | ESLint, gồm cả rule chặn `Math.random` trong lõi game |

`yarn test:e2e` cần build trước (`yarn build`) và cần Chromium (`npx playwright install chromium`).

Hai ngưỡng dưới đây nếu không có script thì sẽ chỉ nằm trên giấy:

```bash
yarn check:bundle   # NFR-PERF-04: JS lần tải đầu, đo từ HTML đã export
yarn check:audit    # NFR-SEC-02: chỉ đỏ ở mức high/critical
```

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
e2e/             Playwright, chạy trên bản export tĩnh
scripts/         gate ngân sách bundle, gate audit, server tĩnh, hai script release
```

## Chạy trên GitHub

| Workflow      | Khi nào                                 | Làm gì                                                                                                                                          |
| ------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`      | mọi pull request và mọi push vào `main` | Hai job song song: lint + typecheck + unit test + audit dependency; và build + ngân sách JS lần tải đầu + e2e ở năm cấu hình                    |
| `deploy.yml`  | push vào `main`                         | Build lại với `GITHUB_PAGES=true` rồi publish `out/` lên GitHub Pages. Nó chạy lại test thay vì tin vào một lần chạy xanh mà nó không nhìn thấy |
| `release.yml` | push vào `main`                         | Tính số phiên bản kế tiếp, soạn note, tạo GitHub release                                                                                        |

Chi tiết và các phương án đã loại: [ADR-0008](docs/decisions/0008-ci-and-github-pages-deploy.md).

E2E chạy trên **bản export tĩnh** — đúng thứ Pages phục vụ — ở `375 / 768 / 1024 / 1440` và trên một Pixel 5 cảm ứng. Đó là chỗ duy nhất kiểm tự động được bố cục ở các khổ hẹp và ngưỡng vùng bấm 44px.

`deploy.yml` truyền `enablement: true` cho `actions/configure-pages`, nên **workflow tự tạo Pages site** ở lần chạy đầu — không cần vào Settings bấm gì. Site lên tại <https://levananhduc.github.io/web-game-asteroids/>.

## Phát hành

Số phiên bản và nội dung release note **suy ra từ lịch sử commit**, nên không thứ nào phụ thuộc vào việc ai đó nhớ làm một bước. Cả hai nằm trong script chạy được ở máy — một quy trình release chỉ kiểm được bằng cách đẩy lên `main` là quy trình không ai kiểm:

```bash
yarn release:next            # tag kế tiếp sẽ là gì, và vì sao
yarn release:notes v1.1.0    # note của nó sẽ viết gì
```

**Số phiên bản được quyết thế nào**, so với tag `v*` gần nhất:

| Kể từ tag trước                                                 | Bump  |
| --------------------------------------------------------------- | ----- |
| có commit `feat!:` / `fix!:` …, hoặc body có `BREAKING CHANGE:` | major |
| có bất kỳ commit `feat:`                                        | minor |
| còn lại                                                         | patch |

**Subject** của commit HEAD ghi đè được: `[release major]`, `[release minor]`, hoặc `[skip release]` để không phát hành gì. Chỉ subject được đọc — một body chỉ _nhắc đến_ marker (chính dòng README này, chẳng hạn) không được phép kích hoạt release.

**Note được soạn thế nào:** subject của các commit kể từ tag trước, nhóm theo tiền tố Conventional Commit — breaking trước, rồi What's new (`feat`), Fixes (`fix`), Performance, Internals, Tests, Documentation, Build and tooling. Scope giữ làm nhãn, nên `feat(game): …` đọc thành **game**: …

Commit không phải Conventional Commit vào mục "Other" chứ không bị bỏ: một release note âm thầm nuốt commit là release note đã bắt đầu nói sai.

Không dùng `--generate-notes` của GitHub: nó nhóm theo nhãn pull request, mà repo này không gắn nhãn PR. Xem [ADR-0009](docs/decisions/0009-releases-derived-from-commits.md).

## Giữ README này không nói sai

`## Features` là cam kết với người chơi, nên nó đổi **trong cùng branch** với code làm đổi hành vi, không phải trong một lượt dọn về sau:

- một `feat:` mà người chơi nhận ra được thì thêm **một bullet ngắn**, bằng tiếng Anh, theo đúng giọng đang có: người chơi giờ làm được gì, không phải component nào vừa được thêm
- bullet mô tả hành vi **đang có hôm nay**. Không có gì ở đây là dự định — nằm trong danh sách nghĩa là nó chạy
- thay đổi chỉ người phát triển thấy (refactor, tooling, test) thì **không** thuộc `## Features`
- commit chỉ sửa README là `docs:`, và tự nó phát hành một bản patch

## Tài liệu

Bản đồ ở [`docs/README.md`](docs/README.md). Ngắn gọn: [kiến trúc](docs/03-design/architecture.md), [bất biến](docs/03-design/invariants.md) (đọc trước khi sửa code), [ngưỡng phi chức năng](docs/02-requirements/nfr.md), và [các quyết định kỹ thuật](docs/decisions/README.md).
