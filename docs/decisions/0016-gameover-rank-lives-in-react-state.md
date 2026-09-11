# ADR-0016 · Hạng lúc hết lượt nằm trong state React, chốt trong layout effect

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-12 · FR-21 · US-02 · NFR-PERF-03 · ADR-0006 · ADR-0011

## 1. Bối cảnh

Hạng của ván vừa xong phải được chốt **trước** khi điểm mới được ghi vào bảng — sau khi ghi thì bảng đã có dòng mới và hạng tính lại sẽ sai. `FreezeRankAtGameOver` tồn tại để giữ đúng thứ tự đó.

Nhưng hạng được giữ trong `useRef` rồi **đọc lúc render** để truyền vào `GameOverOverlay`. Gán vào `.current` không lên lịch render, nên cái người chơi thấy là giá trị của lần render trước:

| Ván                       | `rankRef.current` lúc overlay render    | Người chơi thấy                                                        |
| ------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| ván đầu sau khi tải trang | `null` (giá trị khởi tạo)               | "Không lọt bảng", không có form nhập tên — dù bảng trống và điểm dương |
| ván sau, bấm "Chơi lại"   | hạng mà effect của ván **trước** đã gán | `#1` cho một ván điểm thấp hơn                                         |

Đây là F-01 (Critical) của UX review 2026-09-11, tái hiện 3/3 lần trên profile `localStorage` sạch. `rankIn()` ở `storage/scoreStore.ts` không sai — nó chỉ không bao giờ được đọc đúng lúc. Một persona mất điểm vừa kiếm được rồi tự dựng một lời giải thích sai; một persona khác đi qua nó mà không nhận ra.

## 2. Quyết định

Hạng chuyển từ `useRef` sang `useState` ở `views/Home`, và `FreezeRankAtGameOver` dùng `useLayoutEffect` thay `useEffect`.

`useState` là phần sửa lỗi: nó làm overlay render lại với hạng đúng. `useLayoutEffect` là phần chất lượng: nó chạy sau khi DOM đổi nhưng **trước khi paint**, nên hạng đúng xuất hiện trong cùng một frame với overlay.

Tính chất mà ghost này tồn tại để bảo vệ được giữ nguyên: hạng vẫn chốt trước khi `submit()` ghi điểm mới.

## 3. Phương án đã loại

| Phương án                                                  | Vì sao loại                                                                                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tính hạng bằng `useMemo` lúc render, bỏ ghost đi           | Sau khi người chơi bấm "Lưu điểm", bảng đã có dòng mới; hạng tính lại từ bảng đó là hạng **sau khi ghi**, không phải hạng của ván. Đúng cái mà ghost được dựng để tránh.       |
| Giữ `useRef`, thêm một `useState` khác để cưỡng bức render | Hai nguồn cho một giá trị. Người đọc sau phải biết cái nào là thật, và không có gì nói cho họ biết.                                                                            |
| `useEffect` thay vì `useLayoutEffect`                      | Đúng về dữ liệu nhưng người chơi thấy "Không lọt bảng" nhấp một nhịp rồi mới đổi thành `#1`. Ở đúng cái màn mà persona đã mất điểm oan, một nhịp nhấp như vậy đọc ra là "lỗi". |
| Chốt hạng trong lõi, để `GameState` mang sẵn hạng          | Lõi không được biết `localStorage` (bất biến #1) và không được biết bảng điểm nào đang dùng (ADR-0011). Hạng là chuyện của tầng lưu, không phải của luật chơi.                 |

## 4. Hệ quả

**Được:**

- Ván đầu tiên sau khi tải trang hiện đúng hạng và đúng form nhập tên. F-01 đóng.
- Hạng không còn rò từ ván trước sang ván sau.
- Không còn giá trị nào được đọc lúc render mà chỉ được ghi trong effect — một lớp lỗi biến mất khỏi file này.

**Mất / phải chấp nhận:**

- **Thêm một lần render mỗi lần hết lượt.** Không đụng `NFR-PERF-03`: ngưỡng đó nói về render **mỗi frame** trong lúc chơi, không phải một lần lúc chuyển pha.
- `useLayoutEffect` chạy đồng bộ trước paint, nên `resolveRank` (một lần `JSON.parse` cả bảng) nằm trên đường tới frame đầu của overlay. Bảng tối đa `TOP_N` dòng nên chi phí không đáng kể — nhưng nếu bảng lớn lên thì chỗ này là chỗ phải xem lại.
- `useLayoutEffect` cảnh báo khi render ở server. Component đã `'use client'` và chỉ chạy ở pha `gameover`, nên không gặp; ai bỏ `'use client'` đi sẽ gặp.

**Điều kiện xem lại quyết định này:** bảng điểm không còn là `localStorage` đồng bộ (ADR-0006 dự trù đường ra online). Đọc hạng qua mạng thì không thể nằm trong layout effect, và cả mô hình "chốt trước khi ghi" phải làm lại.
