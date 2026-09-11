# Duck Drift — UX persona review · 2026-09-11

> 9 phiên · 6 persona · 7 Red Route
> Công cụ trình duyệt: **playwright MCP (hạng 1, không degrade)** — *nhưng lần chạy này bị giảm giá trị bởi ba điều kiện vận hành: không throttle được mạng (không có tool), chạy **tuần tự 1 phiên/lần** thay vì 4 phiên song song (một browser dùng chung), và **`localStorage` rò rỉ giữa cả 9 phiên** vì dùng một profile duy nhất.*
> Red route chốt ngày: 2026-09-11

Nguồn: toàn bộ `runs/2026-09-11-1406/` (9 log persona + 50 ảnh + `00-run-meta.md` + `00-verify-nghich-ly-bang-diem.md`), đã copy sang `2026-09-11-lop-vo-7-red-route/` cạnh file này. Đối chiếu token thị giác với `docs/design-system/asteroids/MASTER.md` (mục 0 — chốt cuối).

---

## Bảng điểm theo Red Route

| Red Route | Hiệu quả (đạt `done_when`/đã thử) | Hiệu suất (bước thực tế / `min_steps`) | Hài lòng (ngôn ngữ của chính persona) |
| --- | --- | --- | --- |
| RR-01 vào ván đầu | **1/1** | 1 / 1 | "hơi rối, tò mò, chưa quen tay" · "Chắc có" quay lại — *trung tính, nghiêng tích cực* |
| RR-02 biết phím trước khi chết | **1/1** | 4 / 2 | "yên tâm, rõ ràng, hơi hồi hộp" · "có" quay lại — *tích cực* |
| RR-03 đổi mức dễ hơn rồi chơi tiếp | **0/1** (1 trong 3 mệnh đề) | 3 / 2 | "rối, nản, chịu thua" · "tôi không quay lại trang này nữa đâu" — **tiêu cực, bỏ cuộc** |
| RR-04 tuỳ chỉnh một ván | **0/1** (3 trong 4 mệnh đề) | ~32 / 4 | "tò mò, hơi lấn cấn, tạm yên tâm" · "Có, tôi sẽ quay lại" — *tích cực có điều kiện* |
| RR-05 bảng điểm của ai | **0/1** (2 trong 3 mệnh đề) | 1 / 3 tới lúc mở bảng (~20 thao tác cả phiên, gần trần 40) | "hụt hẫng, cô đơn, tiếc" · "Chắc không" quay lại — **tiêu cực** |
| RR-06 tạm dừng rồi quay lại | **1/1** | **3 / 3 — đúng min_steps** | "yên tâm, rõ ràng, nhẹ nhõm" · "Có" quay lại — *tích cực nhất của lần chạy* |
| RR-07 ghi tên sau hết lượt | **1/1** (mệnh đề "dòng được làm nổi" không xác nhận được bằng lời persona) | ~20 / 5 **và phải chơi hai ván** | "bất ngờ, hên xui, nhẹ nhõm" · "Chắc có, nhưng lần sau chắc đọc Cách chơi trước" — *tích cực sau khi khựng* |

Mỗi Red Route chỉ có một persona đi, nên "trung vị" = con số của phiên đó. Hai phiên mù (p04 BLIND1, p05 BLIND2) không có `done_when` nên không vào bảng; chúng được dùng làm **kiểm chứng độc lập** cho các phát hiện bên dưới.

---

## Ấn tượng 5 giây — cả 9 phiên

| Persona · viewport | "Đây là trang gì" | Ba từ ban đầu → ba từ sau khi dùng |
| --- | --- | --- |
| p01 Trang · 1440x900 | "Chắc là một cái game nhỏ nào đó… chắc là game vịt trượt gì đó" | tò mò, hơi lạ, ổn thôi → hơi rối, tò mò, chưa quen tay |
| p03 Ngân (chỉ bàn phím) · 720x450 @200% | "Nhìn phát biết ngay là game" | gọn, tò mò, chưa chắc → yên tâm, rõ ràng, hơi hồi hộp |
| p04 Dũng (điện thoại) · 375x720 | "Chắc là cái trò chơi con vịt gì đó… tôi không đọc được chữ Anh, không biết nó là cái gì" | lạ, hơi sợ, tò mò → rối, nản, chịu thua |
| p05 Minh Anh (negative) · 1440x900 | "kiểu né/bắn thiên thạch… có nút Tuỳ chỉnh riêng nên chắc cũng tính tới đứa thích vọc như tôi" | tối giản, gọn, chưa rõ độ sâu → tò mò, hơi lấn cấn, tạm yên tâm |
| p02 Khoa · 1024x768 | "Chắc là game né chướng ngại vật kiểu con vịt gì đó" | đơn giản, hơi trống, tò mò → hụt hẫng, cô đơn, tiếc |
| p06 Hưng (viêm khớp) · 1440x900 | "Có nút Chơi to rõ, chắc bấm vào là chơi được luôn" | đơn giản, gọn, hơi tò mò → yên tâm, rõ ràng, nhẹ nhõm |
| p04 Dũng · phiên mù #1 | "Chắc dành cho tụi trẻ con, nhìn màu mè kiểu game của con tôi hay chơi" | lạ, hơi ngại, tò mò → bối rối, mệt, ngại |
| p05 Minh Anh · phiên mù #2 | "game canvas đơn giản kiểu asteroids" | đơn giản, tò mò, hơi nghi ngờ (vì 1 lỗi console) → thoả mãn một nửa, khó chịu (vì bug), tò mò thêm |

Hai điều **6/6 persona** cùng nói trong 5 giây đầu, không ai được gợi ý:

1. **Không ai lo về dữ liệu cá nhân**, vì không có ô nào để nhập. Nguyên văn p01: "Không thấy chỗ nào đòi nhập gì cả nên khỏi phải lo"; p04: "Không thấy chỗ nào bắt gõ chữ hay số cả, cũng đỡ lo, chắc không mất tiền được"; p05: "Không có ô nào để nhập cả, nên câu hỏi này không áp dụng".
2. **Ba trong sáu persona gọi thứ mình sẽ điều khiển là "con vịt"** ngay trước khi bấm Chơi (p01, p04, p02 — xem F-03).

---

## Phát hiện

Xếp theo mức nghiêm trọng giảm dần. Mức nền theo `lib/frameworks.md`, **nâng một bậc khi từ 2 persona trở lên cùng vấp** — mỗi lần nâng đều ghi rõ.

### F-01 · Critical · Interaction Design + ISO 9241-11 (hiệu quả) + LATCH (Hierarchy)

**Ở đâu:** RR-07 — màn **Hết lượt** ở mức Khó, khi bảng điểm mức đó **đang trống**.

**Chuyện gì xảy ra:** Ván hiện **40 điểm** bị màn Hết lượt ghi **"Không lọt bảng"**, không hiện form nhập tên, chỉ còn "Chơi lại" và "Về menu" — điểm mất hẳn. Ván kế tiếp, cùng mức, hiện **20 điểm** thì được **"#1"** và được nhập tên. Đây là kiểu hỏng âm thầm: không báo lỗi, không crash, người chơi chỉ mất thành tích rồi tự dựng một lời giải thích sai cho mình.

**Dẫn chứng:**
- p02 Khoa, RR-07, mục 2 đoạn 1 → mục 4: *"Ủa điểm đâu, sao không có chỗ ghi tên mình vậy ta, chắc phải ở đâu khác."* rồi *"Lúc đó hơi khựng lại, kiểu 'vậy điểm 40 hồi nãy biến đi đâu rồi?'"*. Và kết luận tự dựng của cậu ấy ở mục 4: *"thấy lạ là lần đầu điểm cao (40) lại 'Không lọt bảng' mà lần sau điểm thấp (20) lại 'Hạng #1' — cái đó làm hoang mang một chút, không hiểu sao vậy, chắc do lần đầu bảng trống nên bất kỳ ai chơi xong đều tự động là hạng 1 hay gì đó."*
- p04 Dũng, phiên mù #1, mục 2 gạch đầu dòng 3-5 — **cùng chuỗi đó, viewport khác, persona khác, không hề biết phiên của Khoa**: *"màn hình đổi qua 'HẾT LƯỢT', điểm 40, có nút 'Chơi lại' với 'Về menu'"*; rồi ván 2: *"Lần này sau khi hết lượt, màn hình hiện thêm chữ 'Hạng #1'"*.
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p02-RR07-03-het-luot.png` (ĐIỂM 40 · HẠNG "Không lọt bảng", không có form) so với `2026-09-11-lop-vo-7-red-route/shots/p02-RR07-04-o-nhap-ten.png` (ĐIỂM 20 · HẠNG #1, có form). Trên 375px lặp lại y hệt: `2026-09-11-lop-vo-7-red-route/shots/p04-BLIND1-04-het-luot.png` so với `2026-09-11-lop-vo-7-red-route/shots/p04-BLIND1-06-nhap-ten-hang-1.png`.
- Đã loại trừ rò rỉ `localStorage`: `00-verify-nghich-ly-bang-diem.md` tái hiện trên profile sạch 2/2 lần (lần 1 và lần 3 trong bảng của file đó).

**Bao nhiêu người vấp:** **2/2 persona** đã tới được màn Hết lượt. Khoa nhận ra và hoang mang; Dũng đi qua nó mà không nhận ra — điều này còn tệ hơn, vì anh ấy không có gì để báo lại. Mức nền High (chặn `done_when` của RR-07 ở ván đầu) → **nâng lên Critical** vì hai persona cùng vấp.

**Hướng xử lý:** Vấn đề nằm ở chỗ con số mà panel Hết lượt **hiển thị** và con số mà cơ chế xếp hạng **dùng** không phải một thứ; `00-verify-nghich-ly-bang-diem.md` cho thấy ở đúng hai ván bị từ chối, vùng thông báo đọc "Tổng điểm 20" trong khi HUD và panel ghi 40. Hướng đi là chốt lại **một nguồn duy nhất cho điểm của ván** rồi làm cho quyết định "lọt bảng / không lọt bảng" tự giải thích được bằng chính con số người chơi vừa thấy. Nó nhắm đúng nỗi sợ đã khai của p02 ("mất công chơi rồi thành tích bay mất"), nên nó phải được sửa trước mọi thứ khác trong báo cáo này.

---

### F-02 · Critical · Trigger words + Interaction Design + Visual hierarchy

**Ở đâu:** RR-01 và RR-03 — **màn đang chơi**, ngay sau khi bấm Chơi.

**Chuyện gì xảy ra:** Vào ván rồi, trên màn không còn chữ nào nói điều khiển bằng cách gì. Người dùng chuột thử bấm vào khung chơi; người dùng cảm ứng ở 375px đi tìm nút mũi tên và **không thấy nút nào ngoài nút tạm dừng**. Cả hai đều tự kết luận sai và một người bỏ cuộc.

**Dẫn chứng:**
- p01 Trang, RR-01, mục 2 gạch 6-7: *"Tôi thử bấm chuột vào giữa khung chơi (vì tôi hay làm vậy trước khi nghĩ tới bàn phím) — không thấy gì đổi"* → *"Chắc con chuột không điều khiển được, chắc phải dùng phím."* Ảnh `2026-09-11-lop-vo-7-red-route/shots/p01-RR01-03-click-canvas.png`.
- p04 Dũng, RR-03, mục 2 gạch 3: *"khoảng chơi thì to nhưng tôi không thấy nút mũi tên trái phải hay nút gì để điều khiển con vịt cả"* → mục 2 gạch 4: *"thôi chắc cái này không phải chỗ bấm, mà tôi cũng không biết bấm ở đâu khác"* → **bỏ cuộc đúng `patience_threshold` = 3**. Ảnh `2026-09-11-lop-vo-7-red-route/shots/p04-RR03-04-dang-choi.png` và `2026-09-11-lop-vo-7-red-route/shots/p04-RR03-05-bi-khong-dieu-khien-duoc.png`: toàn bộ 375x720 chỉ có HUD trên cùng và canvas, **không có một nút điều khiển nào trong tầm nhìn**.
- p04 Dũng, phiên mù #1, mục 2 gạch 3 — **lần thứ hai, phiên độc lập**: *"Tôi nhìn quanh tìm nút để điều khiển con vịt — chỉ thấy có mỗi cái nút 'Tạm dừng'… Vậy chơi kiểu gì đây, đâu có nút nào để bấm."* Bác **không cuộn trang** lần nào ở cả hai phiên.

**Bao nhiêu người vấp:** **2/6 persona, 3/9 phiên**. Mức nền High (dẫn tới bỏ cuộc, không chỉ tốn bước) → **nâng lên Critical** vì hai persona cùng vấp, một người vấp hai lần.

**Hướng xử lý:** Ghi chú của người điều phối cho biết nhãn của khu vực chơi **có** nói "Điều khiển bằng bàn phím hoặc bằng các nút bên dưới" — nghĩa là câu đó tồn tại nhưng không đến được mắt ai: nó không nằm trong khung nhìn của người đang chơi trên 375px, và người dùng chuột thì không đọc nhãn, họ thử bấm. Hướng đi là làm cho **cách điều khiển hiện diện ngay trong màn chơi ở lần chơi đầu**, và trên viewport hẹp thì cách điều khiển phải nằm trong cùng khung nhìn với canvas — chứ không phải "bên dưới" một đoạn cuộn mà người chơi không biết là có. Lưu ý phạm vi: giữ-nút cảm ứng đã có suite e2e riêng (`red-routes.md`, bảng "Không phải Red Route"), nên phát hiện này nói về **việc nhìn thấy**, không nói về việc nút hoạt động.

---

### F-03 · High · Trigger words + Visual hierarchy

**Ở đâu:** Toàn bộ màn đang chơi, ở cả ba viewport 375 · 1024 · 1440.

**Chuyện gì xảy ra:** Tên sản phẩm và cách persona tự gọi vật thể của mình là **"con vịt"**, nhưng thứ được vẽ là một tam giác nét trắng cao chừng bằng một ký tự, cùng ngôn ngữ nét với thiên thạch và nhỏ hơn chúng nhiều lần. Persona đi tìm "con vịt" của mình và không tìm thấy — nên không biết mình vừa làm gì có tác dụng hay không.

**Dẫn chứng:**
- p01 Trang, RR-01, mục 2 gạch 7: *"tôi hiểu lơ mơ là mũi tên trái/phải chắc để né hay di chuyển gì đó, nhưng không chắc mình đang né đúng hướng hay sai hướng vì **con vịt đâu tôi cũng không thấy rõ trên canvas**."*
- p04 Dũng, RR-03, mục 2 gạch 3: *"chả thấy gì đổi khác… ơ vậy mình bấm có ăn thua gì không đây, **sao không thấy con vịt nhúc nhích**."*
- p06 Hưng, RR-06, mục 2 gạch 3 kể lại chuyện xảy ra: *"trong lúc tôi còn đang lóng ngóng tìm nút dừng thì **con vịt** đã va vào gì đó và mất một mạng"* — nghĩa là ngay cả persona hài lòng nhất cũng gọi tàu là con vịt.
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p01-RR01-02-after-play.png` — ở khung này **không tìm được tàu trên màn** (đang nhấp nháy bất tử theo `MASTER.md`: `#F2F5F9` @ 40%); `2026-09-11-lop-vo-7-red-route/shots/p01-RR01-03-click-canvas.png` — tàu là hình tam giác nhỏ nhất trên màn, trong khi các thiên thạch to gấp nhiều lần chiếm hết chú ý; `2026-09-11-lop-vo-7-red-route/shots/p04-RR03-04-dang-choi.png` — cùng chuyện ở 375px.

**Bao nhiêu người vấp:** **3/6 persona** dùng từ "con vịt", **2/6** nói thẳng là không thấy nó. Mức nền Medium (không chặn `done_when`, nhưng tốn bước và làm mất khả năng tự đánh giá thao tác) → **nâng lên High** vì ≥2 persona cùng vấp.

**Hướng xử lý:** Có hai lệch nhau, nên tách ra mà quyết. Thứ nhất là **lệch từ ngữ**: nhãn sản phẩm hứa một con vịt, canvas trả về một tàu hình học — `docs/01-product/glossary.md` là chỗ chốt việc này, không phải chỗ để một màn hình tự quyết. Thứ hai là **lệch thứ bậc thị giác**: `MASTER.md` mục "Màu vật thể trong canvas" đã có chủ ý tách tàu (`#F2F5F9`) khỏi thiên thạch (`#8B94A7`), nhưng trên màn thật thì thứ nhỏ nhất lại là thứ người chơi cần theo dõi, và trạng thái bất tử 40% làm nó biến mất đúng lúc người mới cần thấy nó nhất. Hướng đi: làm cho "vật của tôi" luôn là thứ **đọc được đầu tiên** trên canvas, nhất là ở lần hồi sinh.

---

### F-04 · High · Form design + Trigger words

**Ở đâu:** RR-07 và phiên mù #1 — form ba ký tự trên màn **Hết lượt**.

**Chuyện gì xảy ra:** Form duy nhất của sản phẩm là ba ô ký tự kiểu máy thùng với chevron lên/xuống. Không persona nào hiểu ngay nó là gì. Người dùng desktop **tự mò ra trong một bước** nhờ gõ được bàn phím; người dùng cảm ứng **không có đường đó**, chỉ còn chevron, và đã bỏ — điểm không được lưu.

**Dẫn chứng:**
- p02 Khoa, RR-07, mục 2 đoạn 2: *"Nhìn cái ba ô đó là không hiểu ngay là cái gì, phản xạ đầu tiên là bấm thử vào ô đầu tiên coi có gõ được không, rồi thử gõ hẳn 'KHOA' vào"*. Cái giá cuối cùng: *"tên đầy đủ 'Khoa' bị cụt vì chỉ có đúng 3 ô, không đủ chỗ gõ hết tên mình, hơi tiếc nhưng đành chịu."*
- p04 Dũng, phiên mù #1, mục 2 gạch 6-8: *"Cái này là cái gì vậy, sao có chữ A với dấu cộng trừ, **giống kiểu nhập mã bí mật gì đó**."* → *"tôi hơi ngại bấm vì **sợ lỡ đâu nó tính tiền hay đăng ký gì đó**"* → *"sao không có bàn phím cho gõ luôn cho lẹ"*, *"bấm từng dấu cộng để ra hết tên chắc lâu lắm"* → *"Thấy rắc rối quá, tôi bấm 'Về menu' cho chắc ăn, không dám đụng vào cái ô tên đó nữa."*
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p02-RR07-04-o-nhap-ten.png` và `2026-09-11-lop-vo-7-red-route/shots/p04-BLIND1-06-nhap-ten-hang-1.png`. Trên ảnh, khối ba ô **không có nhãn nhìn thấy được** — chỉ ba chữ A và sáu chevron; chữ "Tên của bạn" mà cả hai persona nhắc tới không xuất hiện trên màn (họ đọc được nó từ cây trợ năng, xem §Ghi chú về chính lần chạy này).

**Bao nhiêu người vấp:** **2/2 persona** gặp form. Mức nền Medium (Khoa mò ra trong một bước, sửa lại được, chỉ mất phần tên bị cụt) → **nâng lên High** vì hai persona cùng vấp, và vì với persona cảm ứng nó là chỗ **bỏ hẳn**, kèm hiểu nhầm về tiền.

**Hướng xử lý:** Ba chỗ tách biệt để cân: (1) khối ba ô cần **tự nói nó là gì** ngay trên màn, không chỉ nói với trình đọc màn hình; (2) trên thiết bị cảm ứng phải có một đường nhập nhanh tương đương đường bàn phím của desktop, vì chevron là đường duy nhất còn lại ở đó; (3) quyết định "ba ký tự" là một quyết định di sản arcade (`persona-rules.md` §3) — nếu giữ, nó phải giải thích được cho người chưa từng thấy máy thùng rằng đây là **tên viết tắt**, không phải mã bí mật.

---

### F-05 · High · Interaction Design (khả năng quay lui, hậu quả thao tác)

**Ở đâu:** RR-05 — nút **"Về menu"** trên overlay Tạm dừng; và phiên mù #1 — nút **"Về menu"** trên màn Hết lượt có form.

**Chuyện gì xảy ra:** "Về menu" nằm ngay dưới hành động chính, cùng cỡ, cùng ngôn ngữ nét, và **xoá sạch điểm của ván đang chơi / vừa chơi mà không nói trước một chữ nào**. Không hoàn tác được.

**Dẫn chứng:**
- p02 Khoa, RR-05, mục 2 gạch 4-5: *"Tôi bấm 'Về menu' — nghĩ chắc điểm 40 vẫn được lưu lại vì mình chơi được rồi mà."* → *"cái điểm 40 tôi vừa chơi được đã bay mất sạch… Ơ, vậy chơi xong phải để chết hẳn thì mới được tính điểm à? Sao không lưu tạm luôn nhỉ, phí công quá."* Ảnh `2026-09-11-lop-vo-7-red-route/shots/p02-RR05-07-tam-dung.png` (hộp TẠM DỪNG: "Tiếp tục" và "Về menu", không có cảnh báo nào) và `2026-09-11-lop-vo-7-red-route/shots/p02-RR05-08-bang-diem-van-trong.png` (bảng vẫn trống sau đó).
- p04 Dũng, phiên mù #1, mục 2 gạch 8: *"tôi bấm 'Về menu' cho chắc ăn"* — trong đầu bác đó là **nút an toàn**, và hệ quả thật là điểm #1 vừa đạt không được lưu. Ảnh `2026-09-11-lop-vo-7-red-route/shots/p04-BLIND1-06-nhap-ten-hang-1.png` (Lưu điểm · Chơi lại · Về menu xếp liền nhau) → `2026-09-11-lop-vo-7-red-route/shots/p04-BLIND1-08-ve-menu.png`.

**Bao nhiêu người vấp:** **2/6 persona**. Mức nền Medium (không chặn `done_when` nào, nhưng gây mất mát không hoàn tác được) → **nâng lên High** vì hai persona cùng vấp, ở hai màn khác nhau, và vì cả hai đều bấm nó **với kỳ vọng rằng nó an toàn**.

**Hướng xử lý:** Hai màn này đang để một lối thoát mang tính phá huỷ đứng ngang hàng với lối đi chính. Hướng đi là làm cho **hậu quả nói trước khi thao tác xảy ra**, và xem lại một kỳ vọng mà cả hai persona đều có: người chơi tin rằng điểm đã kiếm được thì thuộc về họ, dù họ dừng bằng cách nào. Đây là chỗ cần một quyết định sản phẩm (ghi vào `journeys.md`/ADR), không phải một chỗ để chỉnh nhãn nút.

---

### F-06 · High · Trigger words + Form design + Interaction Design

**Ở đâu:** RR-04 — thanh trượt **"UFO từ wave"** ở màn Tuỳ chỉnh.

**Chuyện gì xảy ra:** `done_when` của RR-04 đòi thanh này kéo tới **mốc hiện chữ "tắt"**. Người chỉnh số kiên nhẫn nhất của dàn đẩy thanh tới 5, thấy nó dừng, và **kết thúc phiên với thắc mắc chưa được trả lời**. Thanh trượt không cho biết dải giá trị của nó, cũng không cho biết mốc "tắt" có tồn tại hay không.

**Dẫn chứng:**
- p05 Minh Anh, RR-04, mục 2 gạch 5: *"số tăng dần từ 3 lên 5 rồi dừng hẳn ở 5 dù bấm thêm — vậy max của thanh này là 5. Tôi mừng vì tăng được, nhưng **không có lựa chọn 'tắt hẳn UFO'** — chỉ trì hoãn xa nhất tới wave 5."*
- Mục 4, nguyên văn câu hỏi treo lại sau khi phiên kết thúc: *"tôi vẫn còn thắc mắc treo lơ lửng: có thật sự tắt được UFO hoàn toàn không, hay chỉ trì hoãn tối đa tới wave 5? **Cái đó tôi chưa trả lời được cho chính mình.**"*
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p05-RR04-02-man-tuy-chinh.png` và `2026-09-11-lop-vo-7-red-route/shots/p05-RR04-03-cau-hinh-xong.png` — bốn thanh trượt chỉ hiện **giá trị hiện tại**, không hiện min/max, không hiện nhãn mốc nào.

**Bao nhiêu người vấp:** 1/1 persona đã thử. Mức nền **High** vì nó chặn thẳng một mệnh đề `done_when`; **không nâng bậc** (chỉ một persona).

**Hướng xử lý:** Trung thực về giới hạn phương pháp trước: người điều phối ghi rõ cậu ấy dùng mũi tên trên thanh này và **không** thử Home/End ở đó, nên **chưa chứng minh được mốc "tắt" không tồn tại** — chỉ chứng minh được rằng người chỉnh số kiên nhẫn nhất trong dàn vẫn không tới được nó. Vì vậy phát hiện này là về **việc thanh trượt không nói ra dải giá trị và các mốc đặc biệt của nó**, chứ không phải về một giá trị thiếu. Hướng đi: cho biên và mốc đặc biệt của mỗi thanh **đọc được mà không cần thử** — đây cũng là điều kiện để mệnh đề "tắt" của RR-04 có thể đo được ở lần chạy sau.

---

### F-07 · Medium · LATCH (Category) + Visual hierarchy + Interaction Design

**Ở đâu:** RR-03 — dãy `Dễ · Thường · Khó` và dòng điểm cao nhất dưới cùng ở **menu chính**.

**Chuyện gì xảy ra:** Sau khi bấm đổi mức, persona **không tin là mình đã đổi được** nên bấm lại lần nữa (tốn 1 bước trên `min_steps` = 2). Và mệnh đề thứ hai của `done_when` — "dòng Điểm cao nhất dưới cùng đã đổi sang mức đó" — không xảy ra được ở lần chơi đầu, vì khi bảng trống thì dòng đó chỉ ghi "CHƯA CÓ ĐIỂM NÀO" và **không nêu tên mức nào cả**. Nghĩa là ở đúng thời điểm người chơi mới đổi mức, menu không có chỗ nào xác nhận họ vừa đổi bảng điểm.

**Dẫn chứng:**
- p04 Dũng, RR-03, mục 2 gạch 1: *"tôi bấm vào chữ 'Dễ'… cái nút đổi màu, **hình như** chọn được rồi, **nhưng tôi không chắc lắm nên bấm lại thêm một lần cho chắc ăn**."*
- Bác **không nhắc tới dòng điểm cao nhất một lần nào** trong cả phiên (ghi chú người điều phối xác nhận: "không nhận ra nó tồn tại").
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p04-RR03-01-mo-trang-lan-dau.png` (mức Thường, dòng dưới: "CHƯA CÓ ĐIỂM NÀO") so với `2026-09-11-lop-vo-7-red-route/shots/p04-RR03-02-bam-de.png` (mức Dễ, dòng dưới: **"CHƯA CÓ ĐIỂM NÀO"** — y nguyên). Đối chiếu `2026-09-11-lop-vo-7-red-route/shots/p04-BLIND1-01-mo-trang.png`, nơi dòng đó **có** nêu mức: "ĐIỂM CAO NHẤT — KHÓ 20". Vậy dòng này chỉ nói ra mức khi đã có điểm; đúng lần chơi đầu thì nó im lặng.

**Bao nhiêu người vấp:** 1/1 persona đã đi RR-03; mức nền Medium (tốn thêm bước và làm hụt một mệnh đề `done_when`), **không nâng bậc**.

**Hướng xử lý:** `why_red` của RR-03 đặt cược đúng chỗ: "nếu người chơi không nhận ra mình đang đổi mức, họ sẽ tưởng mình phá kỷ lục ở bảng khác — hỏng âm thầm, không báo lỗi." Cược này hiện chưa thắng. Hai hướng để cân: làm trạng thái "đang chọn" của chip mức **khác biệt đủ để tin**, và để dòng điểm cao nhất **luôn nói nó đang nói về mức nào**, kể cả khi chưa có điểm. Cần nhắc kèm: mọi kết luận về *mức nào được chọn sẵn* ở lần chạy này không dùng được (xem §Ghi chú), nhưng phát hiện này không dựa vào mức mặc định — nó dựa vào chỗ *không có gì đổi sau khi người chơi tự đổi*.

---

### F-08 · Medium · Trigger words + LATCH (trục người chơi đi tìm)

**Ở đâu:** RR-05 — nhãn nút **"Bảng điểm"** ở menu chính.

**Chuyện gì xảy ra:** Chữ "Bảng điểm" gợi một bảng xếp hạng có người khác trong đó. Persona vào với đúng kỳ vọng ấy, tìm theo trục "tôi đứng đâu so với ai" — trong khi bảng được tổ chức theo trục Category (Dễ/Thường/Khó) của một máy duy nhất. Sự thật được nói ra ngay khi mở bảng (và đó là một lời hứa đứng vững, xem §Không phát hiện được gì ở), nhưng nó chỉ đến **sau** khi persona đã bấm, đã chơi một ván, đã thoát ngang, và đã quay lại kiểm tra.

**Dẫn chứng:**
- p02 Khoa, RR-05, mục 2 gạch 1: *"Trong đầu nghĩ 'Bảng điểm chắc là bảng xếp hạng, để coi mình đứng thứ mấy so với người khác trước đã.'"*
- Mục 2 gạch 2: *"một dòng chữ nhỏ 'Bảng điểm này chỉ lưu trên máy bạn.' — đọc tới đây tôi hơi khựng lại, kiểu 'à... vậy là không so được với ai hết à?'"*
- Mục 4: *"Chắc không [quay lại], hoặc nếu quay lại thì chỉ để chơi giải trí lúc rảnh chứ không phải để 'khoe điểm' như tôi tưởng ban đầu"* — **persona duy nhất của lần chạy nói sẽ không quay lại vì một lý do thuộc về sản phẩm**, không phải vì bế tắc thao tác.
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p02-RR05-01-mo-trang-lan-dau.png` (nút "Bảng điểm" ở menu, không có chữ nào gợi rằng nó là cục bộ) và `2026-09-11-lop-vo-7-red-route/shots/p02-RR05-02-bang-diem.png` (ba tab mức + dòng "chỉ lưu trên máy bạn" cỡ nhỏ, đặt dưới panel).

**Bao nhiêu người vấp:** 1/6 persona — nhưng đúng persona mà `persona-rules.md` §4 dựng riêng cho chuyện này. Mức nền Medium (tốn thêm bước để đi tìm một thứ không tồn tại), **không nâng bậc**. Ghi chú thêm: cậu ấy thấy ba tab Dễ/Thường/Khó mà **không bấm thử tab nào**, dù mục tiêu là so sánh — dấu hiệu rằng trục Category không phải trục cậu ấy đang tìm.

**Hướng xử lý:** Đây là quyết định định vị, không phải lỗi giao diện: sản phẩm là bản cục bộ hoàn toàn theo ADR-0001/ADR-0006, và nhãn ở menu đang hứa nhiều hơn thế. Hướng đi là để **kỳ vọng được chỉnh ở menu**, trước cú bấm — chứ không phải sửa dòng giải thích trong bảng, vì dòng đó đang làm tốt việc của nó.

---

### F-09 · Medium · Interaction Design + Form design

**Ở đâu:** RR-04 và phiên mù #2 — thanh trượt **"Số mạng"** ở màn Tuỳ chỉnh.

**Chuyện gì xảy ra:** Riêng thanh "Số mạng" không phản hồi phím mũi tên, trong khi ba thanh còn lại phản hồi bình thường. Bằng bàn phím, người dùng chỉ đặt được giá trị biên (Home/End); các giá trị ở giữa buộc phải kéo chuột chính xác.

**Dẫn chứng:**
- p05 Minh Anh, RR-04, mục 2 gạch 4: *"bấm ArrowRight/ArrowLeft/ArrowUp/ArrowDown liên tục — số không nhúc nhích, vẫn giữ nguyên '3'. Trong đầu tôi nghĩ: 'Ơ, cái này bị gì vậy, hay đây là hằng số không chỉnh được?'"* (mục 3 đếm: ~12 lần bấm không có phản hồi.)
- p05 Minh Anh, phiên mù #2 — **kiểm chứng độc lập, profile sạch, không được nhắc gì về phiên trước**, mục 2 gạch 4-6: *"Ơ, sao không tăng? Slider này chết à?"* → *"chỉ riêng 'Số mạng' là slider duy nhất không phản hồi phím mũi tên trái/phải/lên — 3 slider kia thì bình thường"* → hệ quả bằng lời cậu ấy: *"chỉ set được 1 hoặc 6 bằng phím, còn 2/4/5 thì phải kéo chuột đúng vị trí"*.
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p05-BLIND2-02-tuychinh-panel.png`, `2026-09-11-lop-vo-7-red-route/shots/p05-BLIND2-03-sliders-final-state.png`.

**Bao nhiêu người vấp:** 1 persona, **2 phiên độc lập**. Mức nền Medium (tốn thêm bước, có đường đi vòng), **không nâng bậc** — luật đòi **2 persona**, không phải 2 phiên của một người. Không nâng là cố ý.

**Hướng xử lý:** Cần nói rõ một chuyện để không dựng phát hiện sai: ở RR-04 cậu ấy tin phím mũi tên **bị đảo hướng** trên thanh "Tốc độ thiên thạch"; ở phiên mù #2 chính cậu ấy thấy ArrowRight tăng bình thường trên đúng thanh đó. **"Đảo hướng" là đọc nhầm, không phải phát hiện** — đừng sửa gì theo nó. Điều còn lại là thật và đã lặp: một thanh trượt không nhận phím mũi tên. Chỗ này giao thẳng với nhu cầu tiếp cận của p06 Hưng — người mà kéo thanh trượt chính xác là việc đau tay — **nhưng Hưng không đi tới màn Tuỳ chỉnh trong lần chạy này, nên không có dẫn chứng nào từ anh ấy**; mối giao đó là giả thuyết cần một phiên riêng, không phải một phát hiện.

---

### F-10 · Low · Interaction Design (trạng thái, khả năng định vị)

**Ở đâu:** RR-02 — Tab từ nút **"Quay lại"** ở cuối màn Cách chơi.

**Chuyện gì xảy ra:** Tiêu điểm rời khỏi trang một nhịp và **không còn dấu tiêu điểm nào trên màn**; nhịp sau nó quay lại đúng "Quay lại". Persona chỉ dùng bàn phím tự giải thích được và không bị chặn, nhưng đó đúng là khoảnh khắc cô ấy sợ nhất.

**Dẫn chứng:**
- p03 Ngân, RR-02, mục 2 gạch 5: *"tiêu điểm biến mất, không còn thấy dấu tiêu điểm ở đâu trên trang nữa. Trong đầu tôi nghĩ: 'Ơ, giờ mình đang ở đâu vậy? Có phải nó nhảy ra ngoài trang không?'"* → *"**cái khoảnh khắc 'mất dấu' đó đúng là cảm giác tôi sợ nhất — tự hỏi không biết mình đang ở đâu**."*
- Mục 4, ba từ sau khi dùng: *"yên tâm, rõ ràng, **hơi hồi hộp** (vì cái lúc tiêu điểm biến mất)"* — chi phí duy nhất của phiên này nằm đúng ở đó.
- Ảnh: `2026-09-11-lop-vo-7-red-route/shots/p03-RR02-03-man-cach-choi.png` (vòng tiêu điểm xanh trên "Quay lại") so với `2026-09-11-lop-vo-7-red-route/shots/p03-RR02-04-mat-tieu-diem.png` (**cùng khung, không còn vòng tiêu điểm ở đâu**).

**Bao nhiêu người vấp:** 1/1 persona chỉ dùng bàn phím. Mức nền **Low** (gây khó chịu, không cản trở — cô ấy tự thoát ra trong một nhịp Tab), **không nâng bậc**.

**Hướng xử lý:** Cô ấy tự đoán đúng nguyên nhân ("hết phần tử để Tab trong trang thì tiêu điểm chạy ra ngoài… một nhịp rồi quay lại"), nên đây là hành vi bình thường của trình duyệt ở cuối một trang ngắn. Hướng đi không phải là bắt tiêu điểm vòng lại, mà là **người dùng bàn phím luôn biết mình đang ở đâu trong màn hiện tại** — kể cả khi tiêu điểm vừa rời khỏi vùng nội dung. Xếp Low vì chi phí thực tế là một nhịp hồi hộp, và phiên vẫn "đạt đủ".

---

## Không phát hiện được gì ở

### Red Route sạch

- **RR-06 · Tạm dừng giữa ván rồi quay lại đúng chỗ — sạch, và là Red Route duy nhất chạy đúng `min_steps`.** 3/3 bước, 0 lần quay lui, 0 lần bấm không phản hồi, 0 lần bấm trượt — do một persona có nhu cầu tiếp cận về vận động (viêm khớp) thực hiện. Không rút được phát hiện nào ở đây, và điều đó là kết quả.

### Lời hứa của sản phẩm đã đứng vững

Bốn lời hứa được kiểm bằng người thật trong lần chạy này và **không bị bẻ**. Chúng quan trọng không kém các phát hiện ở trên, vì đây là những chỗ dễ hỏng nhất mà đã không hỏng.

1. **US-04 — "không mất mạng nào vì việc tạm dừng".** p06 Hưng, RR-06, mục 2 gạch 5: *"Tôi bấm 'Tiếp tục'. Trang quay lại y chang màn chơi, và số ở trên vẫn là **Mạng: 4, Điểm: 20** — không bị reset, không bị nhảy số linh tinh. Đúng cái tôi cần kiểm tra."* Mục 2 gạch cuối: *"Không có chỗ nào tôi bị bối rối thật sự."* Ảnh `2026-09-11-lop-vo-7-red-route/shots/p06-RR06-03-tam-dung.png` → `2026-09-11-lop-vo-7-red-route/shots/p06-RR06-04-tiep-tuc.png`. Lời tổng của anh ấy: *"cảm giác đổi từ 'tò mò xem thử' sang 'yên tâm vì nó làm đúng như hứa'."*

2. **`journeys.md:136` — bảng điểm phải tự giải thích; và hiểu nhầm "bảng xếp hạng toàn cầu" phải không xảy ra.** p02 Khoa vào RR-05 với đúng niềm tin mặc định ấy, và bị bác bỏ **ngay lần đầu mở màn**, không phải tới cuối phiên. Mục 2 gạch 2: *"một dòng chữ nhỏ 'Bảng điểm này chỉ lưu trên máy bạn.'"*; mục "Lưu ý riêng": *"ngay khi mở nút Bảng điểm ra thì màn hình đã nói ngược lại luôn ('chỉ lưu trên máy bạn'), nên niềm tin ban đầu của tôi bị bác bỏ sớm, không phải đợi tới cuối phiên."* Ảnh `2026-09-11-lop-vo-7-red-route/shots/p02-RR05-02-bang-diem.png`. Hiểu nhầm đắt nhất mà sản phẩm này có thể gây ra **đã không xảy ra**. (Cái giá còn lại của chữ "Bảng điểm" nằm ở F-08 — hai chuyện khác nhau: dòng giải thích làm đúng việc của nó, nhãn ở menu thì chưa.)

3. **`journeys.md:179` — dòng cảnh báo nằm trên nút Chơi là đủ để người chơi đọc trước khi bấm.** Cược này thắng ở cả hai phiên của p05. RR-04, mục 2 gạch 2: *"Ngay dưới có dòng 'Ván tuỳ chỉnh không được ghi vào bảng điểm.' — **tôi đọc dòng này trước khi bấm Chơi, đọc ngay khi vừa mở màn tuỳ chỉnh** chứ không phải lúc đã chỉnh xong."* Mục 4: *"dòng cảnh báo 'không ghi bảng điểm' hiện đúng lúc tôi cần thấy nó (trước khi bấm Chơi)."* Phiên mù #2, mục 2 gạch 3 — độc lập, profile sạch: *"Có ghi chú 'Ván tuỳ chỉnh không được ghi vào bảng điểm' — tôi hiểu ngay: đây là sandbox test, không tính vào high score, hợp lý."* Ảnh `2026-09-11-lop-vo-7-red-route/shots/p05-RR04-02-man-tuy-chinh.png`. Đây là cái giá ẩn duy nhất của sản phẩm, và nó **không còn ẩn**.

4. **`journeys.md:132` — "biết luật chơi mà không phải chết vài lần để đoán ra", đo bằng một persona chỉ dùng bàn phím ở zoom 200%.** p03 Ngân, RR-02: tiêu điểm **đã sẵn ở nút "Chơi"** khi trang vừa mở (*"À hay, ít ra nó không bắt mình Tab từ đầu trang xuống"*), hai nhịp Tab tới đúng "Cách chơi", và *"điều tôi thích nhất: tiêu điểm tự nhảy luôn tới nút 'Quay lại' ở cuối trang, không bị đá về đầu trang hay biến mất"*. Cô ấy đọc lại được cả bảng phím: *"Bắn là Space… Tạm dừng là Esc hoặc P. Đây chính xác là cái tôi đang tìm."* Ảnh `2026-09-11-lop-vo-7-red-route/shots/p03-RR02-01-vua-mo-trang.png`, `2026-09-11-lop-vo-7-red-route/shots/p03-RR02-03-man-cach-choi.png`, `2026-09-11-lop-vo-7-red-route/shots/p03-RR02-05-quay-lai-man-chinh.png`. Người điều phối ghi thêm điều **cô ấy không báo, và đó cũng là dữ liệu**: ở 720x450 **không phải cuộn ngang**, không có gì tràn ra ngoài màn, **không một khiếu nại nào về cỡ chữ hay tương phản**.

### Ba chi tiết nhỏ cũng đã đứng vững

- **Không ai lo về dữ liệu cá nhân, ở cả 6 persona** (xem bảng ấn tượng 5 giây). Với p04 — persona sợ mất tiền nhất — nguyên văn: *"Không thấy chỗ nào bắt gõ chữ hay số cả, cũng đỡ lo, chắc không mất tiền được."* Lăng kính tin cậy sạch ở lớp menu. (Nỗi sợ tính tiền của bác chỉ bật lên đúng một chỗ: khối ba ô ký tự — F-04.)
- **Form ba ký tự sửa lại được, và tự dạy được người dùng bàn phím.** p02 Khoa, RR-07: *"gõ chữ K thì ký tự trong ô đầu đổi từ A thành K thiệt, rồi gõ tiếp H thì nó tự nhảy qua ô thứ hai"*; và *"Thử bấm nút trừ ở ô ba coi có sửa lại được không — bấm thì chữ đổi từ O qua N, rồi bấm cộng lại thì về O như cũ, **vậy là sửa được, yên tâm**."*
- **Dòng vừa lưu có được làm nổi**, dù persona không nói ra điều đó bằng lời (cậu ấy chỉ nói *"thấy ngay dòng của mình"*, và bảng lúc đó chỉ có một dòng nên không có gì để so sánh). Ảnh `2026-09-11-lop-vo-7-red-route/shots/p02-RR07-05-bang-diem-ket-qua.png` cho thấy hàng KHO được tô nền và tên ở màu nhấn. Vì thiếu lời persona, mệnh đề `done_when` này **vẫn tính là không xác nhận được** — nó cần một lần chạy sau với bảng đã có nhiều dòng.

### Hai lăng kính chỉ đọc được từ ảnh — và giới hạn của chúng ở lần chạy này

Đối chiếu với `docs/design-system/asteroids/MASTER.md` §0 (bản chốt, ghi đè catalog):

- **Nghề thị giác giữ được sự nhất quán mà MASTER đặt ra.** Nền gần-đen `#08090F`, panel `#13151D` viền hairline có bốn vạch góc, nét mảnh không tô đặc, số dùng chữ mono, điểm dùng màu nhấn vàng `#FFD166` — thấy đúng như chốt ở mọi màn: menu (`2026-09-11-lop-vo-7-red-route/shots/p01-RR01-01-first-look.png`), Tuỳ chỉnh (`2026-09-11-lop-vo-7-red-route/shots/p05-BLIND2-02-tuychinh-panel.png`), Tạm dừng (`2026-09-11-lop-vo-7-red-route/shots/p06-RR06-03-tam-dung.png`), Hết lượt (`2026-09-11-lop-vo-7-red-route/shots/p02-RR07-04-o-nhap-ten.png`), Bảng điểm (`2026-09-11-lop-vo-7-red-route/shots/p02-RR07-05-bang-diem-ket-qua.png`). Một ngôn ngữ nét duy nhất cho cả canvas và DOM — đúng thứ MASTER gọi là "thứ giữ hai thế giới render nhìn như một". Không persona nào phàn nàn về thẩm mỹ; ba người tự dùng chữ "gọn" hoặc "tối giản" ngay ở 5 giây đầu.
- **Chỗ thứ bậc thị giác đi lệch khỏi chính ý định của MASTER** đã thành F-03 (vật người chơi điều khiển là vật nhỏ nhất và mờ nhất trên canvas) và một phần của F-07 (dòng điểm cao nhất là chữ mờ nhất trên menu, trong khi nó là chỗ duy nhất ở menu nói về bảng điểm của mức đang chọn).
- **Giới hạn phải khai:** anti-pattern "Low contrast text — 4.5:1" trong MASTER **không kiểm được ở lần chạy này**. Dòng "CHƯA CÓ ĐIỂM NÀO" và dòng "Bảng điểm này chỉ lưu trên máy bạn." trông mờ hơn hẳn mọi chữ khác trên ảnh, nhưng **không phiên nào đo tương phản**, và tôi không viết ra con số mình không tự sinh. Nó cần một lượt đo, không phải một phát hiện.

---

## Ghi chú về chính lần chạy này

### Bốn điều làm giảm giá trị của lần chạy — nói thẳng, không giảm nhẹ

1. **Không throttle được mạng.** playwright MCP không có tool throttle; chrome-devtools MCP không nạp được ở phiên này. Hai phiên của p04 Dũng (RR-03 và phiên mù #1) chạy ở **tốc độ LAN thay vì 3G chậm**, đúng ngược với điều kiện đã khai của persona đó. Hệ quả: **mọi kết luận về thời gian tải, về trạng thái chờ, về việc "bác ấy tưởng trang đang tải" đều không có dữ liệu đỡ lưng** — và báo cáo này không đưa ra kết luận nào thuộc loại đó. Một Red Route cả dàn chưa hề chạm tới là hành vi của sản phẩm trên mạng chậm.

2. **Chạy tuần tự, không phải 4 phiên song song** như `lib/orchestration.md` mặc định, vì playwright MCP ở máy này là một browser dùng chung và persona song song sẽ ghi đè viewport của nhau. Điều này chỉ giãn thời gian, **không cắt phạm vi** — vẫn phủ hết 7 Red Route `live` cộng 2 phiên mù. Nhưng nó là lý do trực tiếp của hạn chế số 3.

3. **`localStorage` rò rỉ giữa cả 9 phiên — lỗi của người điều phối, không phải của sản phẩm.** Một profile duy nhất, storage không được xoá giữa các phiên. Chỉ **phiên 1 (p01/RR-01)** và **phiên 9 (p05/phiên mù #2)** có trạng thái sạch thật. Bằng chứng nằm trong chính log: p04 thấy "nút Khó đang bôi màu sẵn" ở phiên mù #1 — thứ p02 Khoa để lại từ RR-07 — trong khi cùng bác đó ở RR-03 thấy "Thường", còn p05/p06 thấy "Dễ"; ảnh chụp `localStorage` lúc 07:53 trong `00-verify-nghich-ly-bang-diem.md` xác nhận cả ba key bị rò (`asteroids.tuning.v1`, `asteroids.difficulty.v1`, `asteroids.highscores.hard.v1`). Hệ quả bắt buộc: **mọi kết luận về trạng thái mặc định của lần chơi đầu, về mức khó nào được chọn sẵn ở các phiên 2-8, và về việc bảng điểm có trống hay không ở các phiên đó đều không đáng tin.** Các mức chọn sẵn khác nhau mà persona báo lại là **dấu vết của nhau, không phải hành vi sản phẩm** — và báo cáo này không dựng phát hiện nào lên chúng. Riêng phát hiện nặng nhất (F-01) đã được kiểm lại trên profile sạch và **không** do rò rỉ này gây ra.

4. **Trần của phương pháp trên một game 60Hz.** Subagent qua MCP mất hàng giây mỗi thao tác, nên **không phiên nào chơi được phần gameplay** — không né, không bắn trúng gì; mọi `done_when` đều nằm ở lớp vỏ. **"Persona chết nhanh" không phải phát hiện UX**, nó là giới hạn công cụ. Mọi đoạn "mới vào đã mất mạng", "mạng tự giảm trong lúc tôi ngồi yên", "bấm phím mà điểm không nhúc nhích" đã bị **loại hết** khỏi phần Phát hiện, kể cả khi persona nói về chúng rất nhiều. Chỉ những chỗ persona *không hiểu phải làm gì* mới được rút thành phát hiện. Đồng thời: US-05 (bắn vỡ thiên thạch, ăn power-up) và cảm giác điều khiển thật **chưa từng được lần chạy này chạm tới** — đừng đọc báo cáo này như một đánh giá về gameplay.

### Ba giới hạn nữa của lần chạy, do tôi ghi thêm khi đọc log cạnh ảnh

- **Persona đọc được nhiều nhãn hơn thứ hiện trên màn.** Cả 6 persona thuật lại HUD là "Mạng: 4", "Điểm: 20" và khối ký tự có nhãn "Tên của bạn" — nhưng ảnh cho thấy HUD chỉ có mấy hình chevron nhỏ, một số vàng, chữ "Wave 1", và khối ba ô **không có nhãn nhìn thấy được** (`2026-09-11-lop-vo-7-red-route/shots/p06-RR06-02-dang-choi.png`, `2026-09-11-lop-vo-7-red-route/shots/p02-RR07-04-o-nhap-ten.png`). Họ đọc các nhãn đó từ cây trợ năng qua công cụ. Nghĩa là **"HUD không có nhãn chữ" chưa từng bị một con mắt người kiểm**, và tôi không dựng nó thành phát hiện. Nó là ứng viên hàng đầu cho một phiên chuyên soi HUD ở lần chạy sau.
- **Dàn persona là proto-persona, không phải dữ liệu người dùng thật** (`references/persona-rules.md`: "Ở đây không có nghiên cứu người dùng thật… phải gọi đúng tên nó như vậy trong báo cáo"). Sáu người này dựng từ `journeys.md` cộng nghiên cứu ngành. Số "x/6 persona vấp" vì vậy là **mức độ đồng thuận giữa các proto-persona**, không phải tỉ lệ dân số.
- **Ba chỗ có dữ liệu mỏng, nói rõ để không ai đọc quá:** (a) không persona nào **đổi tab mức** trong bảng điểm, nên mệnh đề đó của RR-05 chưa được kiểm; (b) p06 Hưng được yêu cầu đo vùng bấm bằng `boxes: true` nhưng **không báo số pixel nào** — anh ấy chỉ nói nút Chơi "to đùng", hai nút Tiếp tục/Về menu "đều dài và dễ bấm", và nút tạm dừng trong ván là "một nút vuông **nhỏ**"; **không có số đo nên không có phát hiện về kích thước**, chỉ ghi nhận rằng nút tạm dừng là thứ duy nhất anh ấy gọi là nhỏ; (c) p06 **không đi tới màn Tuỳ chỉnh**, nên hành vi "gặp thanh trượt thì thử bàn phím trước" — mối nối tự nhiên với F-09 — không có cơ hội xảy ra.

### Hai quan sát của người điều phối, **không** đủ tư cách thành phát hiện

Ghi lại để người làm sản phẩm biết, đúng luật "không dẫn chứng thì không có phát hiện":

- **Vùng thông báo và panel báo hai con số khác nhau cho cùng một ván.** Ở cả hai ván bị từ chối trong bước kiểm chứng: vùng thông báo đọc "Hết lượt. Tổng điểm 20." trong khi HUD và panel ghi "40". Ở ván được nhận thì hai nguồn khớp. **Chưa persona nào vấp phải nó** — p03 Ngân, người duy nhất dùng trình đọc màn hình, không đi tới màn Hết lượt trong phiên của cô ấy. Nguồn: `00-verify-nghich-ly-bang-diem.md`. Đây gần như chắc chắn là cùng một gốc với F-01 và nên được soi cùng lúc; lần chạy sau nên giao hẳn một phiên cho nó.
- **Nút "Xoá bảng Khó" đứng cạnh "Quay lại" ở màn Bảng điểm, cùng cỡ, cùng kiểu, không có dấu hiệu phá huỷ nào** — trong khi `MASTER.md` có sẵn token `--color-destructive`. Ảnh `2026-09-11-lop-vo-7-red-route/shots/p02-RR07-05-bang-diem-ket-qua.png`. **Không persona nào bấm vào nó**, nên không thành phát hiện. Nó cùng họ với F-05 (lối thoát phá huỷ đứng ngang hàng lối đi chính) và nên được xem cùng.

Lỗi console duy nhất ở **cả 9 phiên** là `404 Not Found @ /favicon.ico`, không liên quan tới UX. Chỉ p05 chủ động mở console và tự kết luận: *"chỉ là favicon, vô hại."* Không phiên nào chạm trần 40 hành động của chính nó (phiên 5 gần chạm, ~20 thao tác thật cộng các lần soi màn hình).
