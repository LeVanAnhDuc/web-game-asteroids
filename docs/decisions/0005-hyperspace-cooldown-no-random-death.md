# ADR-0005 · Hyperspace có cooldown và không có rủi ro nổ ngẫu nhiên

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-08

## 1. Bối cảnh

Máy arcade 1979 cho hyperspace một xác suất tự nổ khi dịch chuyển, và không giới hạn số lần dùng. Cơ chế đó tồn tại vì máy thời đó cần một cách để phạt người chơi lạm dụng nút thoát hiểm, khi mà không có cách nào khác để giới hạn.

## 2. Quyết định

Hyperspace dịch chuyển tàu tới một điểm ngẫu nhiên trong thế giới, đặt vận tốc về 0, và vào **cooldown 5 giây**. Không có xác suất nổ. Điểm đến ngẫu nhiên vẫn có thể ngay cạnh một thiên thạch — rủi ro của hyperspace là *vị trí xấu*, không phải xúc xắc chết.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ nguyên xác suất tự nổ như bản gốc | Trung thành tuyệt đối, nhưng chết vì tung xúc xắc là kiểu bất công mà người chơi bây giờ đọc thành lỗi game, không đọc thành luật |
| Giới hạn số lần dùng mỗi mạng (ví dụ 3 lần) | Cũng chặn được lạm dụng, nhưng thêm một con số nữa phải hiện lên HUD vốn đã chật, và người chơi phải nhớ mình còn mấy lần |
| Không giới hạn gì cả | Hyperspace thành nút "thoát mọi tình huống", và cách chơi tối ưu là spam nó — mất luôn phần né tránh, tức là mất phần cốt lõi của game |

## 4. Hệ quả

**Được:**

- Người chơi không bao giờ mất mạng vì một sự kiện họ không tác động được, nên không có cảm giác bị game xử ép.
- Chỉ thêm một trạng thái vào HUD: cooldown còn lại, hiện ngay trên nút hyperspace.
- Bỏ được một nhánh ngẫu nhiên khỏi lõi, nên `step()` ít nhánh khó test hơn.

**Mất / phải chấp nhận:**

- Lệch bản gốc; người chơi biết Asteroids 1979 có thể thấy thiếu.
- Hyperspace trở thành lựa chọn khá an toàn, nên có thể bị dùng như phản xạ mặc định mỗi 5 giây. Nếu đo thấy vậy thì hoặc kéo cooldown dài hơn, hoặc cho điểm đến ưu tiên vùng trống ít hơn — cả hai đều là chỉnh số, không phải chỉnh cơ chế.

**Điều kiện xem lại quyết định này:** nếu chơi thật cho thấy hyperspace bị spam thay cho việc né.
