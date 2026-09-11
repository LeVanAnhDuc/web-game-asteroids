# Sáu lăng kính, bảng điểm, và luật xếp hạng

## Luật chống bịa

Mỗi phát hiện bắt buộc kèm **dẫn chứng**: persona nào, bước thứ mấy, câu nói nguyên văn,
ảnh nào. Không dẫn chứng thì không được thành phát hiện. Không có ngoại lệ.

## Sáu lăng kính

| Lăng kính | Đi tìm gì trong log |
| --- | --- |
| ISO 9241-11 | xong việc không / tốn bao nhiêu / cảm giác ra sao, đặt trong bối cảnh dùng thật của persona |
| LATCH | thông tin đang xếp theo trục nào (Location, Alphabet, Time, Category, Hierarchy), persona đi tìm theo trục nào — lệch nhau ở đâu |
| Trigger words | chữ trên nút/nhãn có khớp từ persona tự nghĩ ra không; chỗ nào persona đọc mà không dám bấm |
| Interaction Design | phản hồi, trạng thái chờ, khả năng quay lui, hậu quả của thao tác sai |
| Visual hierarchy | thứ quan trọng nhất có được nhìn thấy trước không; persona nhìn nhầm thứ gì thành thứ gì |
| Form design | nhãn, thứ tự trường, báo lỗi, chỗ persona nhập sai rồi phải sửa |

Một phát hiện gắn được nhiều lăng kính cùng lúc. Đừng nhân bản nó ra thành nhiều phát hiện.

## Bảng điểm từng Red Route

- **Hiệu quả** = số persona đạt `done_when` / số persona đã thử.
- **Hiệu suất** = trung vị số bước thực tế / `min_steps` của Red Route đó.
- **Hài lòng** = phân loại từ chính ngôn ngữ persona dùng, không tự cho điểm số.

## Luật mức nghiêm trọng

| Điều kiện | Mức |
| --- | --- |
| chặn hoàn thành `done_when` | Critical / High |
| chỉ tốn thêm bước | Medium |
| gây khó chịu, không cản trở | Low |

Rồi **nâng một bậc nếu từ 2 persona trở lên cùng vấp**. Số persona vấp là bằng chứng đây
không phải chuyện cá biệt của một người.

## Cái không được làm

- Không đề xuất giải pháp thiết kế chi tiết. Chỉ ra hướng, để người làm sản phẩm quyết.
- Không chấm điểm tổng thể kiểu "7/10". Bảng điểm ở trên đã đủ.
- Không nhận xét về code, kiến trúc, hay công nghệ. Bạn chưa từng thấy code.
