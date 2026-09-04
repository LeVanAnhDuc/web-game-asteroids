# ADR-0004 · Ba power-up vũ khí dùng chung một khe, khiên và mạng có khe riêng

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-09 · FR-10 · NFR-A11Y-04

## 1. Bối cảnh

Hệ power-up có năm loại: khiên, bắn nhanh, bắn toả, đạn xuyên, thêm mạng. Ba loại giữa đều sửa cách bắn. Nếu cho chúng chạy đồng thời thì số tổ hợp phải cân bằng và phải test là 2³ = 8, HUD phải hiện tới ba đồng hồ cùng lúc, và "bắn nhanh + toả + xuyên" mạnh đến mức những phần còn lại của game mất ý nghĩa.

## 2. Quyết định

Ba loại vũ khí dùng **một khe duy nhất**: nhặt loại mới thì thay loại đang có và đặt lại đồng hồ. Nhặt trùng loại đang chạy thì cộng dồn thời gian, trần 20 giây. Khiên là khe riêng, hấp thụ đúng một va chạm và không hết hạn theo thời gian. Thêm mạng có hiệu lực tức thì, không chiếm khe. Chết thì mất cả khe vũ khí và khe khiên; điểm và mạng giữ nguyên.

## 3. Phương án đã loại

| Phương án                                            | Vì sao loại                                                                                                                                           |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cho ba loại vũ khí chồng nhau                        | Vui hơn trong 30 giây đầu, nhưng 8 tổ hợp phải cân bằng, HUD ba đồng hồ trên màn 375px, và tổ hợp đủ ba thứ làm game hết thách thức                   |
| Cho chồng nhau nhưng giới hạn hai loại cùng lúc      | Vẫn 4 tổ hợp, và thêm một luật "cái nào bị đẩy ra" mà người chơi không đoán được từ những gì thấy trên màn hình                                       |
| Power-up là vật phẩm giữ trong túi, bấm nút mới dùng | Cho người chơi quyền chủ động, nhưng cần thêm một nút trên màn hình cảm ứng vốn đã có bốn nút, và biến một game phản xạ thành game quản lý tài nguyên |

## 4. Hệ quả

**Được:**

- Chỉ ba trường hợp vũ khí phải cân bằng và phải test, thay vì tám.
- HUD chỉ cần một biểu tượng kèm một thanh thời gian, vừa với chiều rộng 375px, và luôn trả lời được câu "tôi đang có gì".
- Người chơi luôn biết hậu quả của việc nhặt: nó thay cái đang có, không có luật ẩn.

**Mất / phải chấp nhận:**

- Mất khoảnh khắc "tổ hợp mạnh khủng khiếp" mà người chơi game arcade thích.
- Nhặt trúng loại vũ khí kém hơn cái đang có sẽ gây tiếc — giảm bằng cách để power-up nhấp nháy đủ lâu trước khi biến mất, và bằng việc hình và màu phân biệt rõ từ xa (`NFR-A11Y-04`).

**Điều kiện xem lại quyết định này:** sau khi chơi thật và đo được thời lượng ván trung bình; nếu game bị đánh giá quá đơn điệu thì mở khe thứ hai là bước nhỏ nhất tiếp theo.
