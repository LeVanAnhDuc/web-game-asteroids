# ADR-0017 · Câu thông báo hết lượt phát ở cuối `step()`, không phát trong `killShip`

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-12 · NFR-A11Y-06 · NFR-I18N-01 · ADR-0003

## 1. Bối cảnh

`killShip` đặt `phase = 'gameover'` rồi phát ngay `ANNOUNCE.gameOver(state.score)`. Nhưng chỗ gọi nó là `shipVsAsteroids`, và hàm đó còn một việc nữa **sau** cú chết: `breakAsteroid` chính viên đá vừa giết tàu — mà phá thiên thạch thì được điểm.

Kết quả là cùng một ván, ba nguồn nói hai số. Đo được ở bước kiểm chứng của UX review 2026-09-11, và tái lập bằng test đơn vị với seed của app (`20260904`, mức Khó):

```
vùng aria-live:  "Hết lượt. Tổng điểm 20."   ← chốt giữa step
HUD:             "Điểm: 40"
panel Hết lượt:  Điểm 40                      ← và đây là số được ghi vào bảng điểm
```

Người dùng trình đọc màn hình nghe một số, bảng điểm lưu một số khác. `NFR-A11Y-06` yêu cầu hết lượt được công bố qua `aria-live`; công bố sai số thì coi như chưa đạt. Không persona nào vấp phải vì persona dùng trình đọc màn hình không đi tới màn Hết lượt trong lần chạy đó.

## 2. Quyết định

`killShip` chỉ đặt pha. Câu thông báo hết lượt phát ở **bước 9, cuối `step()`**, khi pha là `gameover` — tới được cuối hàm mà pha là `gameover` thì nó vừa đổi trong step này, vì `step()` đã return sớm nếu pha đầu step không phải `playing`.

Câu `lifeLost` **không** dời: mất một mạng thì số mạng không đổi thêm trong cùng step, nên phát tại chỗ là đúng.

Bước 9 phải là bước cuối. Nó ghi đè câu `wave`/`extraLife` của cùng step, và đó là chủ ý: vùng `aria-live` chỉ đọc được một câu, và hết lượt là tin quan trọng nhất.

## 3. Phương án đã loại

| Phương án                                                  | Vì sao loại                                                                                                                                                                              |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Đổi thứ tự trong `shipVsAsteroids`: phá đá trước, chết sau | Sửa đúng một đường trong bốn đường dẫn tới `killShip` (`shipVsAsteroids`, `shipVsUfos`, `ufoBulletsVsShip`, và mọi đường thêm sau). Lần sau có ai cộng điểm sau cú chết là lỗi quay lại. |
| Cho `killShip` nhận điểm cuối như tham số                  | Người gọi phải biết trước điểm cuối cùng của step — chưa ai biết được ở thời điểm đó.                                                                                                    |
| Để tầng React tự dựng câu từ `hud.score`                   | Lõi phát khoá, React dịch khoá (`NFR-I18N-01` + bất biến #1). Nếu React tự quyết nội dung thì hai tầng cùng nắm một luật, và `hud.score` cũng không nói được đây là lần hết lượt nào.    |
| Không phát câu hết lượt nữa, để panel tự nói               | `NFR-A11Y-06` yêu cầu công bố. Panel là thứ nhìn thấy, không phải thứ đọc lên.                                                                                                           |

## 4. Hệ quả

**Được:**

- Câu đọc lên, HUD, panel và số ghi vào bảng điểm là **cùng một số**.
- Đúng một chỗ trong lõi quyết định thời điểm công bố hết lượt, bất kể tàu chết bằng đường nào.

**Mất / phải chấp nhận:**

- `step()` từ tám bước thành chín, và **thứ tự bước 9 là chịu lực** — ai chèn thêm gì cộng điểm sau nó là làm lỗi này sống lại. Header của `step.ts` ghi rõ điều đó.
- Bước 9 chạy mỗi step (một so sánh chuỗi), kể cả các step không có gì xảy ra. Không đáng kể so với `NFR-PERF-02` (< 4ms), đã chạy lại benchmark.
- `killShip` giờ không còn tự công bố gì ở nhánh hết lượt. Đọc riêng hàm đó sẽ tưởng là thiếu — comment tại chỗ nói vì sao.

**Điều kiện xem lại quyết định này:** khi `state.announce` không còn là một ô chứa đúng một câu. Nếu sau này cần xếp hàng nhiều thông báo (`wave` **và** `extraLife` **và** hết lượt trong cùng một step đều phải đọc), thì việc ghi đè ở bước 9 thành sai, và cả cơ chế `announce` phải đổi sang hàng đợi.
