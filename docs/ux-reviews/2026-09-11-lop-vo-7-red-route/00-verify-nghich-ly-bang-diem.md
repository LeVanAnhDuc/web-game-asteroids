# Kiểm chứng nghịch lý bảng điểm — do người điều phối chạy, KHÔNG phải phiên persona

Đây **không** phải log persona. Đây là bước kiểm chứng một phát hiện nặng từ phiên
`p02-RR07`, chạy trên **profile đã xoá sạch `localStorage`**, để loại trừ khả năng phát hiện
đó chỉ là hậu quả của việc 9 phiên dùng chung một profile trình duyệt.

`ux-expert` được phép dùng file này để **xác nhận** phát hiện, nhưng dẫn chứng cho phát hiện
vẫn phải là lời của persona trong `p02-RR07.md`.

## Trạng thái `localStorage` trước khi xoá

Chụp lúc 07:53, sau 8 phiên persona:

```
asteroids.tuning.v1 = {"startLives":6,"asteroidSpeed":0.6,"dropChance":0.08,"ufoFirstWave":5}
asteroids.difficulty.v1 = "hard"
asteroids.highscores.hard.v1 = [{"initials":"KHO","score":20,"wave":1,"at":1789112765170}]
```

Xác nhận đúng ba thứ bị rò rỉ giữa các phiên: cấu hình tuỳ chỉnh của Minh Anh (RR-04), mức
độ khó Khoa chọn (RR-07), và dòng điểm "KHO" Khoa vừa lưu. Đã `localStorage.clear()`.

## Giả thuyết cần loại trừ

Ván tuỳ chỉnh **không được ghi vào bảng điểm** theo đúng thiết kế. Nếu `asteroids.tuning.v1`
mà Minh Anh để lại vẫn còn hiệu lực lúc Khoa bấm Chơi, thì "Không lọt bảng" ở ván 40 điểm của
Khoa là **lỗi của người điều phối**, không phải của sản phẩm.

## Cách kiểm

Profile sạch, không có key nào trong `localStorage`, không vào màn Tuỳ chỉnh lần nào.

| Lần | Cách bắt đầu | Điểm hiện ở panel | Hạng | Form nhập tên |
| --- | --- | --- | --- | --- |
| 1 | tải trang → Khó → Chơi | **40** | **Không lọt bảng** | không hiện |
| 2 | "Chơi lại" từ màn Hết lượt | **20** | **#1** | hiện |
| 3 | tải lại trang → Chơi | **40** | **Không lọt bảng** | không hiện |

Bảng điểm mức Khó **trống** ở cả ba lần — trước lần 1 `localStorage` rỗng hoàn toàn, và
không lần nào bấm "Lưu điểm", nên không có key `asteroids.highscores.*` nào được tạo.

Cách chết ở cả ba lần giống nhau: bấm Chơi rồi **không bấm gì nữa**, để tàu đứng giữa màn
cho tới khi hết mạng.

## Kết luận

**Giả thuyết bị loại trừ. Nghịch lý tái hiện được trên profile sạch, không liên quan tới rò
rỉ trạng thái.**

Một ván hiện **40 điểm** bị từ chối khỏi một bảng điểm **đang trống** — không có form nhập
tên, điểm mất hẳn. Một ván sau đó hiện **20 điểm** thì được **#1** và được nhập tên. Tái hiện
3 lần: 1 lần trong phiên của Khoa, 2 lần trong bước kiểm này.

## Một chi tiết thứ hai, phát hiện trong lúc kiểm

Ở **cả hai** ván bị từ chối, vùng thông báo cho trình đọc màn hình và panel nhìn thấy được
**báo hai con số khác nhau cho cùng một ván**:

```
vùng thông báo:  "Hết lượt. Tổng điểm 20."
HUD:             "Điểm: 40"
panel Hết lượt:  Điểm  40
```

Ở ván được nhận (#1) thì hai nguồn khớp nhau — cả hai đều 20.

Người dùng chỉ nghe thông báo, không nhìn panel, sẽ nghe một con số khác hẳn con số trên màn.
Đây là quan sát của người điều phối, **chưa persona nào vấp phải nó** (Ngân — persona dùng
trình đọc màn hình — không đi tới màn Hết lượt trong phiên của cô ấy), nên theo luật
"không dẫn chứng thì không có phát hiện" nó **không đủ tư cách thành một phát hiện persona**.
Ghi lại ở đây để người làm sản phẩm biết, và để lần chạy sau giao hẳn một phiên cho nó.
