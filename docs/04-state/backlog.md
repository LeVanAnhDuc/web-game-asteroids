# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-07 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

Không có việc nào đang dở. CI/CD đã xong trên branch `feat/ci-cd-and-releases`: ba workflow (CI, deploy GitHub Pages, release tự động), e2e Playwright ở năm cấu hình, hai gate ngưỡng. Feature `asteroids-core` đã xong toàn bộ 10 task của `docs/specs/asteroids-core/plan.md` trên branch `feat/asteroids-core`: 151 test xanh, `typecheck`/`lint`/`build` sạch, bundle 117 kB. Việc còn lại đều là việc mới, nằm ở mục dưới.

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
