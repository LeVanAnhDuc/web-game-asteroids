# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-04 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

## Đang làm

Feature `asteroids-core` trên branch `feat/asteroids-core`: dựng toàn bộ game từ đầu theo `docs/specs/asteroids-core/plan.md`. Tài liệu tier-1 và bảy ADR đã xong; tiếp theo là scaffold dự án rồi dựng lõi game theo TDD. Không có gì đang chặn.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Chơi thật rồi tinh chỉnh số cân bằng trong `constants.ts` | FR-06 · FR-09 | cao | Các con số hiện tại (8% rơi power-up, 12 giây hiệu lực, `2 + n` thiên thạch) là điểm khởi đầu suy ra trên giấy. Cân bằng game không chốt được nếu chưa chơi |
| Đo frame rate trên điện thoại thật | NFR-PERF-01 | cao | Ngưỡng 50fps hiện chưa được đo trên thiết bị nào; máy dev không đại diện |
| Âm thanh: bắn, vỡ, nhặt power-up, mất mạng | — | trung bình | Nằm trong Non-Goals của bản đầu, nhưng là thứ thêm sau được mà không đụng gameplay |
| Bảng xếp hạng online | FR-12 · ADR-0006 | thấp | Cần backend nên vi phạm trần chi phí 0 đồng. Interface `ScoreStore` đã mở sẵn đường |
| Chế độ chơi thêm: Time Attack, Daily seed | — | thấp | RNG đã có seed nên Daily seed gần như miễn phí về kỹ thuật; cái đắt là thêm màn hình chọn chế độ và bảng điểm tách theo chế độ |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| Quy trình `feature-flow` bước 1 | Bỏ qua bước dựng canvas mockup trên Artifact và cổng duyệt của nó; chỉ có wireframe ASCII đã duyệt trong hội thoại và `MASTER.md` | Người dùng uỷ quyền chạy hết không hỏi lại, mà cổng đó về bản chất là chờ người xem duyệt | Feature UI tiếp theo có màn hình mới — lúc đó dựng canvas như quy trình |
| Quy trình `feature-flow` bước 3 | Làm trên branch tại chỗ thay vì worktree riêng | Repo vừa tạo, không có việc song song, không có gì để cách ly khỏi | Khi có hai feature chạy cùng lúc |
| `src/game/core/constants.ts` | Toàn bộ số cân bằng là ước lượng trên giấy, chưa qua chơi thử | Chốt số trên giấy nhanh hơn và đủ để dựng xong hệ thống; số sai không làm sai kiến trúc | Ngay sau khi chơi được ván đầu — xem mục "Việc tiếp theo" |
