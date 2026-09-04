# ADR-0006 · Lưu điểm qua interface `ScoreStore`, bản duy nhất là localStorage

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-12 · NFR-ROB-01 · NFR-ROB-02

## 1. Bối cảnh

Bảng xếp hạng online nằm ngoài phạm vi (`overview.md` §4) vì trần chi phí hạ tầng là 0 đồng và vì nó cần chống gian lận điểm. Nhưng nó là thứ có khả năng cao sẽ được làm sau, và nếu lúc đó lõi game đang gọi trực tiếp `localStorage` thì việc thêm nó sẽ đụng vào chỗ không liên quan.

## 2. Quyết định

Một interface hẹp:

```ts
interface ScoreStore {
  top(limit?: number): ScoreEntry[]
  rankOf(score: number): number | null // null = không lọt bảng
  submit(entry: ScoreEntry): void
  clear(): void
}
```

Bản hiện thực duy nhất tồn tại lúc này là `localScoreStore` dùng `localStorage`. `game/core` **không** biết interface này tồn tại; chỉ tầng React gọi nó, sau khi ván kết thúc. Mọi dữ liệu đọc ra đều được validate từng trường trước khi dùng, và mọi lời gọi `localStorage` đều nằm trong `try/catch`.

## 3. Phương án đã loại

| Phương án                                             | Vì sao loại                                                                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gọi `localStorage` trực tiếp ở component              | Ít hơn một file, nhưng khi thêm bản online phải sửa rải rác, và test phải giả lập `localStorage` toàn cục thay vì truyền một bản giả                    |
| Dựng luôn cả hai bản, một local một HTTP, ngay từ đầu | Tưởng là chuẩn bị trước, thực tế là viết code cho một API chưa tồn tại và chưa biết hình dạng. YAGNI                                                    |
| `IndexedDB` thay `localStorage`                       | Đúng công cụ nếu dữ liệu lớn hoặc cần truy vấn, nhưng đây là 10 dòng dữ liệu, và API bất đồng bộ của nó làm phức tạp đường ghi điểm mà không đổi lấy gì |

## 4. Hệ quả

**Được:**

- Thêm bản online sau này là thêm một file hiện thực interface, không sửa lõi game (`ADR-0002` giữ được).
- Test bảng điểm dùng một bản giả trong bộ nhớ, không cần DOM.
- `NFR-ROB-02` thoả tự nhiên: bản localStorage bắt lỗi và trả về bảng trống, game vẫn chơi được.

**Mất / phải chấp nhận:**

- Một lớp trừu tượng cho đúng một bản hiện thực — chi phí có thật, nhận vì interface chỉ có bốn phương thức.
- Điểm là dữ liệu client nên người dùng sửa được. Chấp nhận: bảng điểm này là _của máy đó_, không có ý nghĩa thi đấu. Đây chính là vấn đề mà bản online sau này sẽ phải giải, và là một trong những lý do nó chưa được làm.

**Điều kiện xem lại quyết định này:** khi bảng xếp hạng online được đưa vào phạm vi — lúc đó viết ADR mới, `supersedes ADR-0006`.
