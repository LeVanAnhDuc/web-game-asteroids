# Thiết kế · `expectations-and-contrast`

**Liên quan:** FR-20 · FR-22 · US-07 · NFR-A11Y-01 · NFR-A11Y-02 · NFR-A11Y-04 · NFR-I18N-01 · ADR-0011 · ADR-0020

Pass 4/4 sửa feedback của `docs/ux-reviews/2026-09-11-lop-vo-7-red-route.md`: **F-07**, **F-08**, **F-10**, và việc đo tương phản mà báo cáo để ngỏ.

## 1. F-07 — người chơi đổi mức rồi không tin là đã đổi

p04 Dũng, RR-03: _"tôi bấm vào chữ 'Dễ'… cái nút đổi màu, **hình như** chọn được rồi, **nhưng tôi không chắc lắm nên bấm lại thêm một lần cho chắc ăn**."_ Và bác **không nhắc tới dòng điểm cao nhất một lần nào** trong cả phiên.

Hai nguyên nhân, hai chỗ sửa:

**Trạng thái "đang chọn" chỉ khác ở sắc nền.** `Segmented` phân biệt bằng `bg-primary/15` với viền `border-primary/60` — đều là biến thể mờ của cùng một màu. Nay thêm viền đặc, chữ đậm, và một chấm chỉ thị dưới nhãn. Ba tín hiệu thay vì một, và **không** mã hoá thông tin chỉ bằng màu (`NFR-A11Y-04`). `aria-pressed` đã có từ trước, test khoá lại để không mất.

**Dòng điểm cao nhất im lặng đúng lúc cần nói.** Khi bảng trống nó chỉ ghi "Chưa có điểm nào", không nêu mức — nên ở đúng thời điểm người chơi vừa đổi mức, menu không có chỗ nào xác nhận họ vừa đổi **bảng điểm nào**. Đối chiếu hai ảnh của lần chạy: `p04-RR03-01-mo-trang-lan-dau.png` (mức Thường) và `p04-RR03-02-bam-de.png` (mức Dễ) có dòng dưới **y nguyên**. Nay luôn nêu mức: `Chưa có điểm nào — Dễ`.

Đây là chỗ `why_red` của RR-03 đặt cược: _"nếu người chơi không nhận ra mình đang đổi mức, họ sẽ tưởng mình phá kỷ lục ở bảng khác — hỏng âm thầm, không báo lỗi."_

## 2. F-08 — chữ "Bảng điểm" hứa nhiều hơn sản phẩm có

p02 Khoa vào với đúng kỳ vọng của chữ đó: _"Bảng điểm chắc là bảng xếp hạng, để coi mình đứng thứ mấy so với người khác trước đã"_ → rồi _"à... vậy là không so được với ai hết à?"_ → và cuối phiên: _"Chắc không [quay lại]… vì bảng điểm này chỉ lưu trên máy tôi thôi."_ Đây là persona duy nhất của lần chạy nói sẽ không quay lại vì một lý do thuộc về sản phẩm.

**Bảng xếp hạng online là Non-Goal** (`overview.md` §4: _"Không có bảng xếp hạng online ở bản này"_). Nên không thể đáp ứng nhu cầu của cậu ấy, và việc làm được là **chỉnh kỳ vọng trước cú bấm**, không phải sửa dòng giải thích trong bảng — dòng đó đang làm tốt việc của nó, và chính nó đã chặn được hiểu nhầm đắt nhất ngay lần đầu mở màn.

Thêm một dòng ở menu, ngay dưới dòng điểm cao nhất: **"Điểm chỉ lưu trên máy này"**. Nó nằm cạnh nút Bảng điểm, đọc được trước khi bấm.

## 3. F-10 — tiêu điểm biến mất sau khi Tab qua nút cuối: **không sửa**, và đây là lý do

p03 Ngân, RR-02: _"tiêu điểm biến mất… Ơ, giờ mình đang ở đâu vậy?"_ — rồi chính cô ấy đoán đúng nguyên nhân: _"hết phần tử để Tab trong trang thì tiêu điểm chạy ra ngoài (kiểu chạy ra thanh trình duyệt) một nhịp rồi quay lại, không phải trang bị hỏng."_

Cô ấy đoán đúng. Đó là **hành vi bình thường của trình duyệt** ở cuối một trang ngắn: sau phần tử focus được cuối cùng, tiêu điểm sang UI của trình duyệt. Không phải lỗi của sản phẩm, và không sửa được từ trong trang mà không làm điều tệ hơn:

| Cách "sửa"                                     | Vì sao tệ hơn                                                                                                                                                                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bẫy tiêu điểm (focus trap) trong màn Cách chơi | Màn đó **không phải modal** — nó là một trang. Bẫy tiêu điểm ở trang thường là chống lại người dùng bàn phím: họ không ra được thanh địa chỉ, không sang được tab khác bằng bàn phím. Đổi một nhịp hồi hộp thành một cái bẫy. |
| Cho tiêu điểm vòng lại phần tử đầu             | Cũng là bẫy, chỉ là bẫy vòng tròn. Và nó phá quy ước mà chính người dùng bàn phím dựa vào để biết mình đã đi hết trang.                                                                                                       |

Thứ đáng làm là **mỗi màn có tiêu đề rõ để biết mình đang ở đâu** — và điều đó đã có: `Cách chơi`, `Bảng điểm`, `TUỲ CHỈNH` đều là heading thật. Phát hiện này xếp **Low** vì chi phí thật là một nhịp hồi hộp, và phiên của cô ấy vẫn **đạt đủ** `done_when`.

Vậy F-10 đóng bằng **quyết định không sửa, có lý do**, không phải bằng im lặng.

## 4. Tương phản — đo rồi, **đạt hết**, không phải lỗi

Báo cáo để ngỏ: _"anti-pattern 'Low contrast text — 4.5:1' không kiểm được ở lần chạy này… Nó cần một lượt đo, không phải một phát hiện."_

Đo theo WCAG 2.1 trên token ở `src/app/globals.css`:

| Cặp màu                              | Tỉ lệ      | Ngưỡng 4.5:1 |
| ------------------------------------ | ---------- | ------------ |
| muted `#98A2B3` trên nền `#08090F`   | **7.72:1** | đạt          |
| muted `#98A2B3` trên panel `#13151D` | **7.07:1** | đạt          |
| fg `#F2F5F9` trên nền                | 18.18:1    | đạt          |
| fg `#F2F5F9` trên panel              | 16.66:1    | đạt          |
| accent `#FFD166` trên nền            | 13.79:1    | đạt          |
| accent `#FFD166` trên panel          | 12.63:1    | đạt          |
| primary `#4F7CFF` trên nền           | 5.36:1     | đạt          |

Không cặp nào dưới ngưỡng. Cảm giác "chữ này mờ hơn hẳn mọi chữ khác" trong báo cáo là **đúng về tương đối** (muted mờ hơn fg, đó là chủ ý của hệ token) nhưng **không phải vi phạm** `NFR-A11Y-01`. Câu hỏi treo đóng lại bằng số, không bằng phán đoán.

Đáng chú ý: phép đo này cũng giải thích vì sao không persona nào — kể cả p03 Ngân, người làm việc ở zoom 200% — khiếu nại về cỡ chữ hay tương phản.

## 5. Phạm vi — cái pass này KHÔNG làm

- Không thêm bảng xếp hạng online. Non-Goal.
- Không bẫy tiêu điểm. Xem §3.
- Không đổi màu token nào. Xem §4.
- **Không qua cổng mockup.** Như pass 2 và 3: thay đổi là hai dòng chữ và ba tín hiệu trạng thái trên một component đã có, dùng token sẵn có.
