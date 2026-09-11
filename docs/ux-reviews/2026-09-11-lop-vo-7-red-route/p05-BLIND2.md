# p05 Minh Anh · Phiên mù #2 — không mục tiêu, power user

- viewport 1440x900 · negative persona · playwright MCP
- 39 tool calls · ~266s wall clock · persona self-reported ~30 thao tác
- **profile đã xoá sạch `localStorage`** trước phiên này (phiên duy nhất ngoài phiên 1 có
  trạng thái sạch) · **không có DevTools** trong phiên

## 1. Ấn tượng 5 giây

- Đây là trang gì? Nó làm được gì cho tôi? — Một game tên "DUCK DRIFT", kiểu game né/bắn (asteroids-style), có menu chọn độ khó và một nút "Tuỳ chỉnh" riêng.
- Trang này dành cho người như tôi hay dành cho ai khác? — Nhìn layout đơn giản, chắc dành cho người chơi giải trí bình thường, nhưng có "Tuỳ chỉnh" nên có vẻ ai đó nghĩ tới việc để người dùng chỉnh thông số như tôi.
- Tôi có tin đủ để nhập email/số điện thoại không? — Không có ô nào để nhập cả, nên câu hỏi này không áp dụng ngay từ đầu.
- Ba từ tả cảm giác: đơn giản, tò mò, hơi nghi ngờ (vì thấy 1 lỗi console ngay khi vừa mở).

## 2. Chuyện đã xảy ra

- Tôi thấy trang menu chính: tiêu đề DUCK DRIFT, 3 nút độ khó (Dễ/Thường/Khó, đang chọn "Thường"), nút Chơi, Bảng điểm, Cách chơi, Tuỳ chỉnh. Tôi tưởng đây là game canvas đơn giản kiểu asteroids.
- Việc đầu tiên tôi làm là kiểm tra lỗi console — chỉ là 404 thiếu favicon.ico, không liên quan gì tới game, bỏ qua.
- Tôi bấm "Tuỳ chỉnh" ngay vì đúng phản xạ của mình. Hiện ra 4 thanh trượt: Số mạng (3), Tốc độ thiên thạch (1.0×), Tỉ lệ rơi vật phẩm (8%), UFO từ wave (3). Có ghi chú "Ván tuỳ chỉnh không được ghi vào bảng điểm" — tôi hiểu ngay: đây là sandbox test, không tính vào high score, hợp lý.
- Tôi đoán từng số ảnh hưởng gì:
  - **Số mạng**: số lần được chết trước khi thua hẳn — càng cao càng dễ sống lâu.
  - **Tốc độ thiên thạch**: hệ số nhân tốc độ đá bay — cao hơn thì né khó hơn.
  - **Tỉ lệ rơi vật phẩm**: xác suất mỗi lần phá đá (hay theo thời gian?) rơi ra vật phẩm hỗ trợ.
  - **UFO từ wave**: UFO (quái đặc biệt) bắt đầu xuất hiện từ đợt (wave) số mấy.
  - Tôi không kiểm chứng được ý nghĩa chính xác của "Tỉ lệ rơi vật phẩm" và "UFO từ wave" trong lúc chơi thật, vì chơi không kịp bấm — chỉ kiểm chứng được cơ chế min/max của các thanh trượt.
- Tôi click vào slider "Số mạng" rồi bấm mũi tên phải để tăng — không có gì đổi cả, vẫn "3". Trong đầu tôi nghĩ: *"Ơ, sao không tăng? Slider này chết à?"* Bấm mũi tên trái — cũng không đổi. Bấm `End` — nhảy thẳng lên 6 (max). Bấm `Home` — nhảy về 1 (min). Vậy tôi xác nhận được range là 1-6, nhưng mũi tên trái/phải/lên hoàn toàn không phản hồi trên riêng slider này.
- Tôi nghi có gì đó "nuốt" phím mũi tên (ví dụ game dùng mũi tên để lái thuyền, có global listener chặn trước khi tới slider) — nên tôi đi kiểm tra 3 slider còn lại xem có bị y hệt không.
- Slider "Tốc độ thiên thạch": click vào rồi bấm mũi tên phải → tăng bình thường từ 1.0× lên 1.1×. Slider "Tỉ lệ rơi vật phẩm": click + mũi tên phải → từ 8% nhảy lên 15% (nhảy khá to, chắc vì cú click đã tự đặt lại giá trị theo vị trí bấm trên thanh, rồi phím cộng thêm). Slider "UFO từ wave": tương tự, cũng đổi được (3 → 5).
- Kết luận: chỉ riêng "Số mạng" là slider duy nhất không phản hồi phím mũi tên trái/phải/lên — 3 slider kia thì bình thường. Đây đúng kiểu bug lặt vặt mà tôi (dân code) sẽ để ý ngay và thấy khó chịu, vì tôi không set được số mạng chính xác mình muốn (ví dụ muốn để 5 mạng để test lâu hơn) — chỉ set được 1 hoặc 6 bằng phím, còn 2/4/5 thì phải kéo chuột đúng vị trí (mà công cụ tôi đang dùng không kéo chuột tới toạ độ chính xác được).
- Tôi bấm "Chơi" để xem màn chơi có phản ánh đúng cấu hình không. Vào game thì thấy dòng "Mất một mạng. Còn 2 mạng." và HUD hiện "Mạng: 2" — đúng logic: tôi để Số mạng = 3, mất 1 mạng ngay do không bấm kịp (giới hạn công cụ, không phải lỗi trang), còn lại 2. Ít nhất phần này khớp đúng giữa màn Tuỳ chỉnh và màn chơi thật.
- Tôi dừng lại ở đây, không cố chơi tiếp vì biết chắc sẽ chết ngay do độ trễ công cụ.

## 3. Con số

- Số hành động đã làm: khoảng 30 thao tác công cụ (bao gồm click, phím, screenshot, snapshot), không tính 1 lần load tool.
- Thời gian: không đo chính xác nhưng cỡ vài phút thao tác liên tục.
- Số lần phải quay lui: 0 (không có trang nào cần back), nhưng có "thử lại" cùng một thao tác 2 lần trên slider Số mạng để xác nhận bug (không tính là quay lui, tính là kiểm chứng lại).
- Số lần bấm vào chỗ không phản hồi: 3 lần rõ ràng — ArrowRight, ArrowLeft, ArrowUp trên slider "Số mạng" đều không có tác dụng.
- Kết quả: xong việc "chỉnh cấu hình rồi vào chơi" — tôi đã set được cấu hình (dù không set chính xác số mạng mình muốn), bấm Chơi thành công, xác nhận số mạng khớp giữa hai màn. Không bỏ cuộc, dừng chủ động sau khi đạt mục đích chính (hiểu tuỳ chỉnh ảnh hưởng gì, phát hiện bug).

## 4. Ba từ sau khi dùng

Ba từ: **thoả mãn một nửa, khó chịu (vì bug), tò mò thêm**.

Có quay lại không: Có, tôi sẽ quay lại — vì màn Tuỳ chỉnh đúng thứ tôi thích (4 thông số rõ ràng, có đơn vị %, ×, số nguyên), nhưng tôi sẽ mở bằng chuột thật (không qua công cụ tự động) để kéo chính xác slider "Số mạng", và tôi muốn báo lại chuyện phím mũi tên không ăn trên riêng slider đó — nó làm tôi nghi ngờ có global keydown handler đang tranh chấp với slider.

So với ba từ lúc đầu (đơn giản, tò mò, nghi ngờ) — cảm giác nghi ngờ ban đầu (về lỗi console) đã được giải toả (chỉ là favicon, vô hại), nhưng lại xuất hiện một sự khó chịu cụ thể hơn: bug thật trên slider "Số mạng". Tò mò thì vẫn còn, thậm chí tăng lên vì tôi muốn hiểu vì sao chỉ đúng 1 trong 4 slider bị vậy.

## 5. Đính kèm thô

- `shots/p05-BLIND2-01-first-look.png` — màn hình lúc mới mở, menu chính
- `shots/p05-BLIND2-02-tuychinh-panel.png` — panel Tuỳ chỉnh với 4 slider, giá trị mặc định
- `shots/p05-BLIND2-03-sliders-final-state.png` — panel sau khi dò bug, các giá trị đã đổi
- `shots/p05-BLIND2-04-ingame.png` — màn hình trong game, ngay sau khi mất mạng đầu

Console log (dán nguyên trạng):
```
[ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) @ http://127.0.0.1:4173/favicon.ico:0
```

Không có log network chi tiết nào khác được thu thập trong phiên này (không dùng tool đọc network request).

---

## Ghi chú của người điều phối (không phải lời persona)

- Phiên mù, không có `done_when`. Kết cục: **dừng chủ động**, không bỏ cuộc.
- Phiên này **kiểm chứng lại độc lập** chuyện thanh trượt "Số mạng" không ăn phím mũi tên,
  ở một phiên khác, trên profile sạch, mà persona **không** được nhắc gì về phiên RR-04 trước
  đó. Lần này cậu ấy đi xa hơn: thử cả 4 thanh và xác nhận **chỉ đúng 1 trong 4 thanh bị**.
  Range của thanh đó là 1-6 (Home = 1, End = 6).
- **Sửa lại một điều cậu ấy nói ở phiên RR-04:** ở RR-04 cậu ấy tin phím mũi tên bị đảo hướng
  ("ArrowLeft làm giá trị tăng 1.0 → 1.1×"). Ở phiên này, trên cùng thanh "Tốc độ thiên thạch",
  **ArrowRight tăng bình thường** 1.0 → 1.1×. Nên chuyện "đảo hướng" ở RR-04 nhiều khả năng là
  cậu ấy đọc nhầm, **không phải** một phát hiện. Expert cần đọc hai log cạnh nhau và không
  dựng phát hiện nào lên chuyện đảo hướng đó.
- Hệ quả thật của thanh trượt kẹt phím, theo đúng lời cậu ấy: bằng bàn phím **chỉ đặt được 1
  hoặc 6**, các giá trị 2/4/5 ở giữa thì phải kéo chuột. Đây là chỗ giao với nhu cầu tiếp cận
  của Hưng (p06) — người mà kéo thanh trượt là việc đau tay — nhưng **Hưng không đi tới màn
  Tuỳ chỉnh**, nên không có dẫn chứng nào từ Hưng để nối hai chuyện này lại.
- Lỗi console `404 favicon.ico` xuất hiện ở **cả 9 phiên**. Cậu ấy là persona duy nhất chủ
  động mở console, và tự kết luận nó vô hại: "chỉ là favicon, vô hại".
