# ADR-0019 · Hậu quả phá huỷ nói trước cú bấm, và nhãn phải nhìn thấy được

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-12 · FR-15 · FR-21 · US-02 · US-04 · NFR-I18N-01 · ADR-0006

## 1. Bối cảnh

Hai phát hiện High của UX review 2026-09-11, cùng một nguyên nhân: màn hình biết một điều quan trọng mà không nói ra cho mắt người dùng.

**F-05.** Hai persona bấm "Về menu" **vì tin nó an toàn**, rồi mất điểm. p02: _"nghĩ chắc điểm 40 vẫn được lưu lại vì mình chơi được rồi mà"_ → _"bay mất sạch… phí công quá"_. p04: _"tôi bấm 'Về menu' cho chắc ăn"_ — và điểm hạng #1 vừa đạt không được lưu. Nút đứng ngang hàng lối đi chính, cùng cỡ, cùng kiểu, không một chữ nào nói nó phá huỷ.

**F-04.** Khối ba ký tự kiểu arcade **không có nhãn chữ nào nhìn thấy được**. Chuỗi `enterName` tồn tại nhưng chỉ vào `aria-label`. Trên màn chỉ có ba chữ `A` và sáu chevron — đúng hình dạng một ô nhập mã. p04 đọc nó thành _"giống kiểu nhập mã bí mật gì đó"_, _"sợ lỡ đâu nó tính tiền hay đăng ký gì đó"_, rồi bỏ luôn và mất điểm.

## 2. Quyết định

**Hậu quả nói trước cú bấm, bằng một dòng chữ đặt ngay trên nút** — không phải hộp xác nhận hai bước, không phải `confirm()`.

Dùng lại khuôn đã có và đã thắng: `journeys.md:179` đặt cược rằng dòng cảnh báo trên nút Chơi ở màn Tuỳ chỉnh là đủ để người chơi đọc trước khi bấm, và cược đó thắng ở **cả hai** phiên của p05 — _"tôi đọc dòng này trước khi bấm Chơi"_. Sản phẩm đã có một khuôn cảnh báo hoạt động được với người thật; việc cần làm là dùng nó ở hai chỗ còn thiếu.

Ở màn Hết lượt, cảnh báo **chỉ** hiện khi có hạng và chưa lưu. Không có gì để mất thì không cảnh báo.

**Nhãn của khối ba ký tự hiện ra thành chữ**, kèm một dòng nói đây là tên viết tắt ba chữ và gõ bàn phím được.

Luật ghi điểm **không đổi**: chỉ ghi khi hết mạng.

## 3. Phương án đã loại

| Phương án                               | Vì sao loại                                                                                                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cho ghi điểm cả khi thoát ngang         | Đúng kỳ vọng của cả hai persona, nhưng đổi bản chất US-02/FR-12 và mở đường cày điểm bằng cách thoát đúng lúc điểm cao. Người dùng đã chọn phương án cảnh báo.                           |
| Hộp xác nhận hai bước cho "Về menu"     | Thêm một lớp bấm vào đúng lối thoát, và p06 (viêm khớp) là persona mà mỗi cú bấm đều tốn sức. Dòng chữ không thêm cú bấm nào.                                                            |
| `confirm()` của trình duyệt             | Chặn toàn bộ vòng lặp game, và trông không phải của sản phẩm.                                                                                                                            |
| Tự lưu nháp điểm rồi hỏi sau            | Một trạng thái "điểm chưa chốt" mới trong `localStorage`, phải validate (NFR-ROB-01), phải xử lý khi người chơi không bao giờ quay lại. Đắt hơn nhiều so với một dòng chữ.               |
| Chỉ đổi nhãn nút thành "Bỏ ván này"     | Nói được là bỏ ván, nhưng không nói được **điểm mất**. Persona mất chính là điểm, không phải ván.                                                                                        |
| Đổi ba ô thành một ô text gõ tên đầy đủ | Comment trong `InitialsInput` đã chốt: bàn phím ảo trên điện thoại che nửa màn hình. Và US-02 chốt quy ước arcade. Cái giá (tên cụt) persona đã chấp nhận: _"hơi tiếc nhưng đành chịu"_. |

## 4. Hệ quả

**Được:**

- Người chơi biết mình đang mất gì trước khi mất, ở cả overlay Tạm dừng và màn Hết lượt.
- Khối ba ký tự tự nói nó là gì, nên nó không còn đọc ra thành ô nhập mã — gỡ luôn nỗi sợ "nó tính tiền".
- Không thêm cú bấm nào, không thêm trạng thái lưu trữ nào.

**Mất / phải chấp nhận:**

- Hai overlay dày thêm mỗi cái một dòng chữ. Ở 375px đó là không gian thật.
- Cảnh báo là **chữ**, nên nó chỉ hiệu quả với người đọc nó. p04 là persona đọc chữ nhỏ khó; dòng này dùng cỡ chữ nhỏ nhất của hệ token. Nếu lần chạy persona sau vẫn có người bấm "Về menu" rồi ngạc nhiên, thì kết luận là khuôn cảnh báo không đủ và phải quay lại hai phương án đã loại ở trên.
- Luật "chỉ ghi điểm khi hết mạng" vẫn trái kỳ vọng của hai persona. Cảnh báo làm nó **không còn âm thầm**, chứ không làm nó hết trái kỳ vọng.

**Điều kiện xem lại quyết định này:** lần chạy persona sau, nếu vẫn có người mất điểm ở "Về menu" dù đã có cảnh báo. Lúc đó vấn đề không phải là nói chưa rõ, mà là luật ghi điểm — và phương án "cho ghi điểm khi thoát ngang" phải được cân lại cùng một ADR mới.
