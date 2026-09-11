# ADR-0020 · Chỉnh kỳ vọng về bảng điểm ngay ở menu, và trạng thái chọn không mã hoá chỉ bằng màu

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-20 · FR-22 · US-07 · NFR-A11Y-01 · NFR-A11Y-04 · ADR-0011

## 1. Bối cảnh

**F-08.** Chữ "Bảng điểm" ở menu gợi một bảng xếp hạng có người khác trong đó. p02 Khoa vào với đúng kỳ vọng đó và hụt hẫng khi biết sự thật, rồi nói sẽ không quay lại — persona duy nhất của lần chạy rời đi vì một lý do thuộc về sản phẩm, không phải vì bế tắc thao tác. Nhưng **bảng xếp hạng online là Non-Goal** (`overview.md` §4), nên nhu cầu của cậu ấy không thể đáp ứng ở bản này.

**F-07.** p04 Dũng đổi mức rồi không tin là đã đổi: _"hình như chọn được rồi, nhưng tôi không chắc lắm nên bấm lại thêm một lần cho chắc ăn."_ `Segmented` phân biệt trạng thái chọn bằng `bg-primary/15` và viền `border-primary/60` — cả hai là biến thể mờ của cùng một màu. Và dòng điểm cao nhất khi bảng trống chỉ ghi "Chưa có điểm nào", không nêu mức, nên menu không xác nhận việc vừa đổi bảng điểm.

## 2. Quyết định

**Kỳ vọng chỉnh ở menu, trước cú bấm.** Thêm một dòng dưới dòng điểm cao nhất: "Điểm chỉ lưu trên máy này". Không sửa dòng giải thích trong màn Bảng điểm — dòng đó đang làm tốt việc của nó và đã chặn được hiểu nhầm đắt nhất ngay lần đầu mở màn.

**Trạng thái "đang chọn" mang ba tín hiệu, không phải một:** viền đặc, chữ đậm, và một chấm chỉ thị. `aria-pressed` giữ nguyên. Đây cũng là điều `NFR-A11Y-04` đòi — không mã hoá thông tin **chỉ** bằng màu.

**Dòng điểm cao nhất luôn nêu mức**, kể cả khi chưa có điểm nào.

## 3. Phương án đã loại

| Phương án                                      | Vì sao loại                                                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Thêm bảng xếp hạng online                      | Non-Goal dứt khoát: cần backend, database, chống gian lận điểm. `overview.md` §4 đã chốt và ADR-0006 để sẵn interface cho ngày khác. |
| Đổi nhãn nút thành "Điểm trên máy này"         | Dài, và nó đánh đổi sự gọn của menu cho một thông tin chỉ cần nói một lần. Một dòng phụ nói được cùng điều mà không làm nút dài ra.  |
| Chỉ dựa vào `aria-pressed` cho trạng thái chọn | Nó đã có sẵn, và persona vẫn không tin. `aria-pressed` nói với trình đọc màn hình, không nói với mắt.                                |
| Đổi màu nền đậm hơn cho nút đang chọn          | Vẫn là một tín hiệu duy nhất, và vẫn là màu. `NFR-A11Y-04` tồn tại để chặn đúng cách nghĩ đó.                                        |

## 4. Hệ quả

**Được:**

- Người chơi biết bảng điểm là của máy mình **trước** khi bấm vào nó, nên không còn cú hụt hẫng ở giữa.
- Đổi mức thì thấy hai thứ đổi theo: chip mức và dòng nêu mức. Không phải bấm lại "cho chắc ăn".
- Trạng thái chọn đọc được mà không cần phân biệt màu.

**Mất / phải chấp nhận:**

- Menu thêm một dòng chữ. Ở 375px đó là không gian thật, và menu vốn được giữ gọn có chủ ý.
- Dòng "Điểm chỉ lưu trên máy này" nói ra một **hạn chế** ngay ở màn đầu. Nó đánh đổi một chút háo hức cho việc không ai bị hụt hẫng về sau. Với persona đến vì so điểm, biết sớm vẫn tốt hơn biết muộn — nhưng nó không làm họ ở lại.
- Chấm chỉ thị là một chi tiết thị giác mới không có trong `MASTER.md`. Nó dùng `--color-primary` và không thêm token nào, nhưng nếu hệ thiết kế muốn một ngôn ngữ khác cho "đang chọn" thì đây là chỗ sửa.

**Điều kiện xem lại quyết định này:** khi Non-Goal "không có bảng xếp hạng online" được bỏ. Lúc đó cả dòng "chỉ lưu trên máy này" và toàn bộ khung kỳ vọng quanh chữ "Bảng điểm" phải làm lại, và ADR-0006 là chỗ bắt đầu.
