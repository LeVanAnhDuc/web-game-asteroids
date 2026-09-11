# Thiết kế · `no-silent-score-loss`

**Liên quan:** FR-12 · FR-15 · FR-21 · US-02 · US-04 · NFR-A11Y-03 · NFR-I18N-01 · ADR-0006 · ADR-0019

Pass 3/4 sửa feedback của `docs/ux-reviews/2026-09-11-lop-vo-7-red-route.md`: **F-05 (High)** và **F-04 (High)**.

## 1. F-05 — "Về menu" xoá điểm mà không nói trước

Hai persona bấm "Về menu" **vì tin nó an toàn**, rồi mất điểm:

- p02 Khoa, RR-05: _"Tôi bấm 'Về menu' — nghĩ chắc điểm 40 vẫn được lưu lại vì mình chơi được rồi mà."_ → _"cái điểm 40 tôi vừa chơi được đã bay mất sạch… Sao không lưu tạm luôn nhỉ, phí công quá."_
- p04 Dũng, phiên mù #1: _"tôi bấm 'Về menu' cho chắc ăn"_ — trong đầu bác đó là **nút an toàn**, và hệ quả thật là điểm hạng #1 vừa đạt không được lưu.

Quyết định đã chốt với người dùng: **cảnh báo trước khi thoát**, giữ nguyên luật "chỉ ghi điểm khi hết mạng". Không đổi US-02/FR-12, không mở đường cày điểm bằng cách thoát đúng lúc điểm cao.

Cách nói: **một dòng chữ nêu hậu quả, đặt ngay trên nút**, đúng khuôn mà sản phẩm đã có và đã được kiểm bằng người thật — `journeys.md:179` đặt cược rằng dòng cảnh báo trên nút Chơi ở màn Tuỳ chỉnh là đủ, và cược đó **thắng** ở cả hai phiên của p05: _"tôi đọc dòng này trước khi bấm Chơi"_. Dùng lại khuôn đã thắng, không phát minh hộp xác nhận hai bước.

Hai chỗ, hai câu khác nhau vì hậu quả khác nhau:

| Ở đâu                                | Khi nào hiện                    | Nói gì                                           |
| ------------------------------------ | ------------------------------- | ------------------------------------------------ |
| overlay Tạm dừng, trên nút "Về menu" | luôn, khi đang có ván dở        | ván này bỏ, và điểm đang có không được ghi       |
| màn Hết lượt, trên nút "Về menu"     | chỉ khi **có hạng và chưa lưu** | điểm này lọt bảng nhưng chưa lưu; về menu là mất |

Ở màn Hết lượt, khi không có hạng (`rank === null`) hoặc đã lưu thì **không** hiện gì: không có gì để mất, và một cảnh báo sai chỗ dạy người ta bỏ qua cảnh báo.

## 2. F-04 — khối ba ký tự không tự nói nó là gì

Không persona nào hiểu ngay ba ô đó là gì.

- p02 Khoa (desktop) mò ra được vì **gõ bàn phím ăn**, nhưng phản xạ đầu là đi tìm ô gõ tên đầy đủ: _"Nhìn cái ba ô đó là không hiểu ngay là cái gì."_
- p04 Dũng (cảm ứng) **không có đường bàn phím**, chỉ còn chevron, và bỏ hẳn: _"sao có chữ A với dấu cộng trừ, giống kiểu nhập mã bí mật gì đó"_ → _"tôi hơi ngại bấm vì sợ lỡ đâu nó tính tiền hay đăng ký gì đó"_ → bấm "Về menu", điểm không được lưu.

Ảnh `p02-RR07-04-o-nhap-ten.png` cho thấy gốc rễ: **khối đó không có nhãn chữ nào nhìn thấy được.** Chuỗi `vi.gameOver.enterName` tồn tại nhưng chỉ vào `aria-label`, tức chỉ tới tai trình đọc màn hình. Trên màn chỉ có ba chữ `A` và sáu chevron — và "ba ký tự với mũi tên lên xuống" đúng là hình dạng của một ô nhập mã, nếu không có gì nói ngược lại.

Sửa: **nhãn hiện ra**, cộng một dòng nói ngắn rằng đây là tên viết tắt ba chữ và gõ bàn phím được. Hai câu đó giải quyết cả ba chuyện persona vấp: không hiểu là gì, không biết gõ được, và sợ nó tính tiền.

Không đổi số ô. Ba ký tự là quy ước arcade đã chốt ở US-02 và comment trong `InitialsInput` nói rõ vì sao (bàn phím ảo trên điện thoại che nửa màn hình). Cái giá — tên bị cụt, "KHOA" → "KHO" — vẫn còn, và persona đã chấp nhận nó: _"hơi tiếc nhưng đành chịu"_.

## 3. Phạm vi — cái pass này KHÔNG làm

- Không cho ghi điểm khi thoát ngang. Đã chốt: chỉ cảnh báo.
- Không thêm hộp xác nhận hai bước, không thêm `confirm()` của trình duyệt.
- Không đổi số ô nhập tên, không thêm ô gõ tên đầy đủ.
- F-07 · F-08 · F-10 và đo tương phản là pass 4.
- **Không qua cổng mockup.** Như pass 2: người dùng yêu cầu chạy tới xong. Thay đổi ở đây là hai dòng chữ và một nhãn, dùng token sẵn có, không màn mới và không bố cục mới.

## 4. Cách biết là đã sửa

| Việc          | Bằng chứng phải có                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| F-05 tạm dừng | Test: overlay Tạm dừng hiện câu cảnh báo kèm số điểm đang có.                                                                      |
| F-05 hết lượt | Test: có hạng + chưa lưu ⇒ hiện cảnh báo; `rank === null` ⇒ không hiện; đã lưu ⇒ không hiện.                                       |
| F-04          | Test: nhãn "Tên của bạn" **nhìn thấy được**, không chỉ là `aria-label`; dòng hướng dẫn có mặt. E2E: đọc được cả hai trên app thật. |
