# ADR-0011 · Mỗi mức độ khó một khoá `localStorage` riêng cho bảng điểm

> **Ngày:** 2026-09-10
> **Trạng thái:** accepted
> **Liên quan:** FR-22 · US-07 · NFR-ROB-01 · ADR-0006

## 1. Bối cảnh

Bảng điểm hiện dùng đúng một khoá `asteroids.highscores.v1` cho mọi ván. Thêm độ khó mà giữ nguyên một bảng thì điểm ở mức Dễ đứng chung hạng với mức Khó, và bảng điểm mất nghĩa ngay ván đầu.

Có điểm thật của người đang chơi trong khoá đó. Bất cứ phương án nào làm mất chúng đều tệ hơn việc không có tính năng này.

## 2. Quyết định

Ba mức sẵn dùng ba khoá độc lập, mỗi khoá top 10 riêng: `asteroids.highscores.v1` (**giữ nguyên**, thành bảng mức Thường), `asteroids.highscores.easy.v1`, `asteroids.highscores.hard.v1`. `createLocalScoreStore` nhận thêm tham số khoá; interface `ScoreStore` (ADR-0006), `isValidEntry`, `rankIn` và `sortEntries` không đổi. Ván chế độ Tuỳ chỉnh không ghi bảng nào. Màn bảng điểm hiện ba tab, và nút xoá chỉ xoá bảng của tab đang mở.

## 3. Phương án đã loại

| Phương án                                                 | Vì sao loại                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Một khoá, mỗi dòng thêm trường `mode`                     | Gọn hơn cho bảng xếp hạng online sau này, nhưng cần migration cho điểm cũ (thiếu `mode` → coi là Thường), và `submit` phải cắt top 10 **theo từng nhóm** thay vì cắt toàn mảng. Làm sai chỗ cắt thì điểm mức Khó cao sẽ đẩy bay bảng mức Dễ — mất dữ liệu, và mất âm thầm vì bảng vẫn hiện ra bình thường |
| Chỉ mức Thường được lưu điểm                              | Rẻ nhất, nhưng người chơi mức Khó — nhóm muốn ghi điểm nhất — lại không có gì để ghi                                                                                                                                                                                                                      |
| Một khoá chứa object `{ easy: [], normal: [], hard: [] }` | Vẫn phải migration từ mảng phẳng sang object, và một dòng hỏng ở nhánh này làm `JSON.parse` trả về thứ phải kiểm sâu hơn, trong khi ba khoá thì một khoá hỏng chỉ mất một bảng                                                                                                                            |

## 4. Hệ quả

**Được:**

- Điểm đang có của người chơi không mất và không cần migration nào.
- Toàn bộ code lưu trữ đã được test giữ nguyên; phần thêm mới chỉ là một tham số khoá và một hàm map mức → khoá.
- Một khoá bị sửa tay hoặc hỏng chỉ làm trống một bảng, hai bảng kia không việc gì (`NFR-ROB-01`).
- Top 10 của mỗi mức thật sự là top 10 của mức đó, không phụ thuộc vào việc người chơi có chơi mức khác hay không.

**Mất / phải chấp nhận:**

- Ba lần đọc `localStorage` khi mở màn bảng điểm thay vì một. Không đáng kể — ba mảng tối đa 10 dòng, và chỉ đọc lúc mở màn chứ không phải mỗi frame.
- Không có bảng "tổng hợp mọi mức", và không trả lời được câu "điểm cao nhất của tôi ở mọi chế độ là bao nhiêu" mà không đọc cả ba khoá.
- Nếu sau này làm bảng xếp hạng online thì trường `mode` vẫn phải xuất hiện ở tầng đó, tức là phương án bị loại sẽ quay lại ở biên giới mạng. Chấp nhận: bảng online đang nằm ngoài phạm vi vì trần chi phí 0 đồng (`overview.md` §5).
- Tên khoá không đối xứng — mức Thường không có chữ `normal` trong khoá. Đó là cái giá của việc không xoá điểm ai cả, và nó phải được ghi lại ở chỗ nào người ta sẽ đọc, tức là ADR này.

**Điều kiện xem lại quyết định này:** khi làm bảng xếp hạng online, hoặc khi số chế độ vượt quá bốn năm cái — lúc đó một khoá có trường `mode` rẻ hơn là mỗi chế độ một khoá.
