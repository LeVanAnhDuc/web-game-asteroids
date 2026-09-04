# ADR-0003 · Fixed timestep 60Hz và thế giới cố định 1600×1200, canvas chỉ scale-to-fit

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-01 · FR-17 · NFR-ROB-03 · NFR-ROB-04

## 1. Bối cảnh

Game chạy trên màn hình từ 375px đến 1440px trở lên, và trên màn hình có tần số quét từ 60Hz đến 144Hz. Hai thứ đó, nếu để ảnh hưởng trực tiếp vào luật chơi, sẽ làm cùng một game khó dễ khác nhau theo thiết bị và cho kết quả khác nhau giữa hai lần chạy — trong khi `NFR-ROB-04` đòi cùng seed cùng input phải cho cùng kết quả.

## 2. Quyết định

Luật chơi chạy ở **bước cố định 1/60 giây**. Vòng lặp gom thời gian thật vào một accumulator, clamp mỗi frame ở **0.25 giây**, rồi gọi `step()` đúng số lần cần; render một lần mỗi frame. Không gian chơi luôn là **1600×1200 đơn vị thế giới (4:3)**; canvas chỉ *scale-to-fit* vào khung có sẵn, thêm viền letterbox khi tỉ lệ khung không khớp. Trên mobile dọc, canvas nằm nửa trên và nút cảm ứng nửa dưới; không bắt người chơi xoay ngang máy.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Dùng thẳng `dt` biến thiên của `requestAnimationFrame` | Ít code hơn, nhưng cùng một chuỗi phím cho kết quả khác nhau giữa máy 60Hz và 144Hz, và test không tái lập được |
| Thế giới bằng đúng kích thước viewport (pixel màn hình) | Dùng hết màn hình to, nhưng màn hình càng lớn càng nhiều chỗ né, nên điện thoại khó hơn desktop và điểm giữa hai thiết bị không so được — mà điểm số là cơ chế động lực duy nhất của game |
| Bắt buộc xoay ngang trên mobile | Cho canvas to hơn, nhưng chặn người chơi ngay giây đầu tiên bằng một màn hình yêu cầu thao tác — mâu thuẫn với Non-Goal "chơi được trong 2 giây" |
| Thế giới đổi tỉ lệ theo hướng máy (dọc thì 3:4) | Không loại vì kỹ thuật mà vì gameplay: khoảng cách tới mép đổi thì cảm giác né đổi, tức là hai game khác nhau |

## 4. Hệ quả

**Được:**

- Cùng seed và cùng input luôn cho cùng trạng thái, nên bug tái hiện được và test không giòn.
- Độ khó không phụ thuộc thiết bị.
- Tab bị ẩn nhiều phút rồi quay lại không làm treo máy vì mô phỏng bù (`NFR-ROB-03`).

**Mất / phải chấp nhận:**

- Trên màn hình rất rộng có dải letterbox hai bên; đây là lựa chọn chủ động, không phải bug.
- Canvas trên mobile dọc chỉ khoảng 375×281, khá nhỏ — bù lại bằng cách vẽ nét dày hơn và vật thể to hơn theo tỉ lệ ở khổ đó.
- Vòng lặp có thể chạy nhiều `step()` trong một frame, nên `step()` buộc phải rẻ (`NFR-PERF-02`).

**Điều kiện xem lại quyết định này:** nếu thêm chế độ chơi cần không gian rộng hơn hẳn, hoặc nếu đo được rằng letterbox làm người chơi mobile bỏ game.
