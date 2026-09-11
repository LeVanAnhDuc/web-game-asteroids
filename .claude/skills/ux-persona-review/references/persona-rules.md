# Rule tạo persona — Duck Drift

> Chưng ngày 2026-09-11. Fetch **thành công** (4/5 nguồn); `userfocus.co.uk` trả 403 nên phần
> Red Routes lấy từ nguồn thứ cấp, đã ghi rõ bên dưới. Bản seed offline đã bị thay hoàn toàn.

## Phân loại (Cooper)

| Loại | Nghĩa |
| --- | --- |
| primary | người mà sản phẩm được thiết kế cho. Không phục vụ được họ là hỏng. |
| secondary | dùng được sản phẩm nhưng cần thêm vài thứ |
| served | chịu ảnh hưởng bởi sản phẩm nhưng không trực tiếp dùng |
| negative | người sản phẩm **không** nhắm tới. Có mặt để phát hiện đang phục vụ nhầm ai. |

## Persona phải bám hành vi, không bám nhân khẩu học

NN/g nói thẳng: **"don't add details that are irrelevant to the design"** — tiêu chí là *"if it
would not affect the final design or help make any decision easier, remove it."* Tuổi và nghề
chỉ có ích khi chúng **đổi cách người đó dùng sản phẩm**.

"Nữ, 28 tuổi, thích du lịch" không dự đoán được hành vi nào. "Quen bấm nút Back của trình duyệt
thay vì nút quay lại trong trang" thì có.

NN/g cũng cảnh báo persona phải **"based on user research"**. Ở đây không có nghiên cứu người
dùng thật — dàn persona này là **proto-persona**, dựng từ `journeys.md` cộng nghiên cứu ngành
dưới đây. Phải gọi đúng tên nó như vậy trong báo cáo, đừng để nó đội lốt dữ liệu thật.
Nguồn: <https://www.nngroup.com/articles/persona/>

## Trường bắt buộc

| Trường | Vì sao bắt buộc |
| --- | --- |
| bối cảnh, nghề nghiệp | để nội dung persona nhập vào form nghe như thật |
| trình độ số | quyết định mức chịu đựng với thuật ngữ |
| thiết bị + điều kiện mạng | đổi thẳng thành viewport và network throttle |
| nhu cầu tiếp cận | dàn **bắt buộc** có ít nhất một người chỉ dùng bàn phím hoặc thị lực kém |
| động cơ, nỗi sợ | định hướng cái persona chú ý tới |
| `patience_threshold` | 2–6 bước bế tắc liên tiếp thì bỏ cuộc — điều kiện dừng thật của phiên |
| ngôn ngữ | **tiếng Việt** — UI của game không có bản tiếng Anh (NFR-I18N-01) |

## Kích thước dàn

5–7 người, **cố định giữa các lần chạy**. Đẻ persona mới mỗi lần chạy là tự tay phá bỏ thứ
đắt nhất mà skill này tạo ra: khả năng so sánh trước và sau khi sửa.

Trong dàn bắt buộc có: ít nhất một persona tiếp cận (a11y), đúng một negative persona, và ít
nhất một người dùng điện thoại trên mạng chậm.

## Jobs-To-Be-Done

Với mỗi persona, viết được một câu dạng: *khi \_\_\_, tôi muốn \_\_\_, để \_\_\_.*
Câu này chính là nguyên liệu để sinh `goal_in_user_words` cho mỗi Red Route —
diễn đạt bằng từ ngữ của người dùng, không dùng từ ngữ của sản phẩm.

## Persona tiếp cận — lấy theo bộ của GOV.UK

Bộ chuẩn gồm bảy hồ sơ: **Claudia** (thị lực kém, phóng to màn hình), **Ashleigh** (khiếm thị
nặng, dùng trình đọc màn hình + bàn phím), **Ron** (người già, nhiều bệnh cùng lúc), **Chris**
(viêm khớp dạng thấp — điều khiển chính xác khó), **Pawel** (tự kỷ), **Simone** (khó đọc),
**Saleem** (điếc sâu).

Hai hồ sơ đáng lấy nhất cho một game canvas:

- **Ashleigh** — *"uses a keyboard instead of a mouse or trackpad"*, *"gets annoyed when forced
  to tab through lots of things"*, *"finds it hard to tell quickly what's on a page if there
  aren't good headings"*. Đúng người để soi FR-19 (`aria-live`) và thứ tự tab của bốn nút menu.
- **Chris** — điều khiển chính xác khó. Đúng người để soi vùng bấm 44px (FR-13) và bốn thanh
  trượt của màn Tuỳ chỉnh, thứ đòi kéo chính xác.

Saleem (điếc) **không** đưa vào dàn: game không phát tiếng nào và không có thông tin nào chỉ
truyền bằng âm thanh, nên hồ sơ đó không sinh ra hành vi khác biệt nào — đúng tiêu chí "remove
it" của NN/g.
Nguồn: <https://alphagov.github.io/accessibility-personas/> · <https://accessibility.blog.gov.uk/2019/02/11/using-persona-profiles-to-test-accessibility/>

## Red Routes (Travis 2006)

Red Route = việc **thường xuyên hoặc sống còn**. Travis nhấn mạnh chỉ đếm tần suất là chưa đủ,
phải nhân với **mức sống còn** — ma trận frequency × criticality. Dấu hiệu của một Red Route
đúng nghĩa: nhiều bước, kết thúc bằng một thứ **cầm nắm được**, và có **thước đo thành công rõ
ràng**. Ví von gốc là làn đường đỏ của xe buýt London: trên làn đó, mọi vật cản bị dẹp không
thương tiếc.

Đây là lý do `done_when` trong `red-routes.md` luôn là thứ **người dùng nhìn thấy**, không phải
trạng thái trong code.
(`userfocus.co.uk/articles/redroutes.html` trả HTTP 403 lúc fetch; tóm tắt trên lấy từ
<https://thedecisionlab.com/reference-guide/design/red-route-usability> và
<https://rikwilliams.net/resources/red-route-flowchart-matrix/>.)

---

## Nghiên cứu riêng ngành: người chơi game arcade trên web

Năm điều dưới đây đổi thẳng thành hành vi của persona. Không có điều nào rút ra được từ
`journeys.md` — đó là lý do chúng ở đây.

### 1. Người cần hướng dẫn nhất là người bỏ qua hướng dẫn

Mẫu hành vi được ghi nhận rộng rãi: người chơi bỏ qua tutorial rồi kết luận game dở vì *"nó
không dạy gì cả"*. Một nghiên cứu ghi nhận giữ chân tăng từ 60% lên 95% khi tutorial không bỏ
qua được. Duck Drift để **Cách chơi** là một nút ngang hàng với ba nút khác, hoàn toàn tự chọn.

→ Dàn persona phải có **ít nhất hai người không bấm vào Cách chơi**, kể cả khi đang bí. Persona
nào cũng ngoan ngoãn đọc hướng dẫn trước là một dàn nói dối.

### 2. Ba mươi giây đầu quyết định

Người vấp phải khó hiểu ngay phiên đầu thường **không quay lại**, và không báo cho ai. Ở game
này, 30 giây đầu là: đọc bốn nút, chọn hoặc không chọn độ khó, bấm Chơi, không biết phím nào.

→ `patience_threshold` của persona giải trí phải **thấp** (2–3). Kiên nhẫn cao là đặc quyền của
người đang phải làm việc, không phải của người đang giải trí.

### 3. Ô nhập ba ký tự là di sản 1979, không phải quy ước hiện hành

Bảng điểm cho người chơi gõ tên viết tắt bắt đầu từ *Star Fire* (1979) — cùng thời với bản
Asteroids gốc mà game này mô phỏng. Người lớn lên cùng máy thùng đọc `AAA` là hiểu ngay. Người
chỉ biết game điện thoại thì **chưa từng thấy** thứ này: họ tìm một ô `input` để gõ tên đầy đủ.

→ Dàn bắt buộc có **ít nhất một người dưới 30 tuổi chưa từng thấy máy thùng**, và người đó phải
đi RR-07.

### 4. "Bảng điểm" mặc định bị hiểu là bảng xếp hạng toàn cầu

Người chơi web hiện đại đọc chữ "Bảng điểm" và tự động cho rằng mình đang so với người khác.
Duck Drift hoàn toàn cục bộ (ADR-0001, ADR-0006): không server, không tài khoản, xoá dữ liệu
trình duyệt là mất sạch.

→ Ít nhất một persona phải **kỳ vọng có bảng xếp hạng toàn cầu** khi đi RR-05. Chỗ họ nhận ra
sự thật — hoặc không nhận ra — chính là phát hiện.

### 5. Người chơi giải trí đổi độ khó bằng cảm giác, không bằng con số

Người chơi casual không đọc "5 mạng, tốc độ 0.75×". Họ bấm "Dễ" vì họ vừa thua. Bốn thanh trượt
của màn Tuỳ chỉnh nói bằng ngôn ngữ con số — ngôn ngữ của người chỉnh máy, không phải người chơi.

→ Negative persona của dàn này là **người chỉnh số**: người coi màn Tuỳ chỉnh là sản phẩm chính.
Họ có mặt để lộ ra chỗ nào sản phẩm đang chiều nhầm người đó thay vì chiều người muốn bấm Chơi
rồi chơi luôn.

Nguồn ngành: <https://arcadeblogger.com/2021/01/31/anatomy-of-arcade-high-score-tables/> ·
<https://vgm.co/blog/playtest-retention-metrics-what-early-session-data-tells-you-before-launch> ·
<https://pageflows.com/resources/game-ux-reaching-the-high-score/>
