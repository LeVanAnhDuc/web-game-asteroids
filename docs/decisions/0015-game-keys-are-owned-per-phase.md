# ADR-0015 · Bàn phím của game chỉ sở hữu phím ở pha `playing`, `paused` chỉ giữ phím tạm dừng

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-11 · FR-15 · FR-21 · NFR-A11Y-02 · ADR-0010

## 1. Bối cảnh

`attachKeyboard(window, …)` được gắn một lần cho cả đời component và không hỏi pha nào cả. `onKeyDown` nhận phím của game rồi gọi `preventDefault()` — cần thiết vì `Space` và mũi tên cuộn trang. Nhưng listener nằm ở `window` và chạy ở pha bubble, nên `preventDefault()` của nó huỷ luôn hành vi mặc định của phần tử đang có tiêu điểm, trên **mọi màn**.

Đo được trên bản build `:4173`, màn Tuỳ chỉnh, tiêu điểm đặt đúng vào thanh trượt:

```
ArrowRight → value không đổi, e.defaultPrevented === true
Home       → value về min,   e.defaultPrevented === false
Space (trên nút "Về menu") → 0 click, màn hình không đổi, defaultPrevented === true
```

Hai hệ quả. Một: người chơi không chỉnh được thanh trượt bằng mũi tên — đúng F-09 của UX review 2026-09-11, và vì thế không với tới được mốc `UFO_NEVER` để tắt UFO (F-06). Hai, nặng hơn và không persona nào chạm tới: **`Space` không bấm được nút đang có tiêu điểm**, tức vi phạm trực tiếp `NFR-A11Y-02`. Persona dùng bàn phím trong lần chạy đó thoát được chỉ vì cô ấy dùng `Enter`.

## 2. Quyết định

`KeyboardOptions` thêm một trường **bắt buộc** `getPhase: () => Phase | null`, và bàn phím game sở hữu phím theo đúng bảng này:

| Pha                                                    | Xử lý gì                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `playing`                                              | tất cả phím game (xoay · đẩy · bắn · dịch chuyển · tạm dừng), `preventDefault` như cũ |
| `paused`                                               | **chỉ** phím tạm dừng (`Escape` · `KeyP`), để chơi tiếp được bằng bàn phím            |
| `menu` · `help` · `highscores` · `custom` · `gameover` | **không gì cả**                                                                       |

Rời pha `playing` thì `input` được dọn ngay trong handler: trình duyệt không gửi `keyup` cho phím đang giữ sau khi màn hình đã đổi, và không dọn thì trạng thái "đang đẩy" dính sang ván sau.

`getPhase` là hàm chứ không phải giá trị, và nó **không** nằm trong dependency của effect ở `useGame` — đưa pha vào dependency là gắn lại listener mỗi lần đổi màn.

## 3. Phương án đã loại

| Phương án                                                                                   | Vì sao loại                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Guard theo tiêu điểm: bỏ qua sự kiện nếu `e.target` là `input`/`button`/`select`/`textarea` | Ở pha `playing`, người chơi bấm chuột vào nút "Tạm dừng" rồi chơi tiếp thì tiêu điểm **vẫn ở cái nút đó**. `Space` sẽ bấm lại nút thay vì bắn — đổi một lỗi a11y thành một lỗi gameplay. Guard theo pha không có chỗ mơ hồ đó. |
| Gắn listener vào canvas thay vì `window`                                                    | Người chơi phải bấm vào canvas trước mới chơi được — mất đúng cái mà comment ở `useGame` nói là lý do gắn vào `window`. Và F-02 đã cho thấy người mới không biết phải bấm vào đâu.                                             |
| Gắn/gỡ listener theo pha trong `useEffect`                                                  | Gắn lại giữa lúc đang giữ phím là mất `keyup`, tàu kẹt trạng thái đẩy. Cũng thêm một nguồn lỗi vòng đời mà không mua thêm gì so với việc hỏi pha trong handler.                                                                |
| Để `getPhase` optional cho khỏi sửa test cũ                                                 | Người gọi sau quên nó là lỗi này quay lại **âm thầm** — không test gameplay nào đỏ, vì gameplay vẫn đúng. Bắt buộc thì trình biên dịch hỏi.                                                                                    |

## 4. Hệ quả

**Được:**

- Mũi tên chỉnh được cả bốn thanh trượt; mốc "tắt" của UFO với tới được bằng bàn phím.
- `Space` bấm được nút — `NFR-A11Y-02` trở lại đúng.
- Gameplay không đổi: ở `playing` mọi thứ y như trước, có test chống hồi quy riêng.

**Mất / phải chấp nhận:**

- `attachKeyboard` không còn dùng được mà không biết pha — mọi chỗ gọi phải truyền `getPhase`, kể cả test.
- Handler gọi `getPhase()` mỗi `keydown`. Không đáng kể, nhưng nó là một lần gọi hàm trên đường đi của input.
- Bảng ở mục 2 là thứ phải nhớ khi thêm pha mới: thêm pha mà không xếp nó vào bảng thì nó rơi vào nhánh "không gì cả" — im lặng và thường là đúng, nhưng không phải luôn luôn.

**Điều kiện xem lại quyết định này:** thêm một pha mà người chơi vừa cần điều khiển tàu vừa cần thao tác phần tử DOM cùng lúc (ví dụ HUD có ô nhập liệu trong lúc đang chơi). Lúc đó bảng theo pha không đủ, và phải quay lại bài toán tranh chấp tiêu điểm mà mục 3 đã loại.
