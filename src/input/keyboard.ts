import type { InputState } from '@/game/core/types'

/**
 * Bàn phím ghi thẳng vào một `InputState` dùng lại — không tạo object mới mỗi sự
 * kiện (NFR-PERF-05). Bàn phím và cảm ứng chia nhau đúng một kiểu dữ liệu này,
 * nên lõi game không biết người chơi đang dùng gì.
 */
export interface KeyboardOptions {
  input: InputState
  onPause?: () => void
}

const LEFT = new Set(['ArrowLeft', 'KeyA'])
const RIGHT = new Set(['ArrowRight', 'KeyD'])
const THRUST = new Set(['ArrowUp', 'KeyW'])
const FIRE = new Set(['Space'])
const HYPER = new Set(['ShiftLeft', 'ShiftRight'])
const PAUSE = new Set(['Escape', 'KeyP'])

/** Trả về hàm gỡ listener. */
export function attachKeyboard(target: Window | HTMLElement, opts: KeyboardOptions): () => void {
  const { input, onPause } = opts
  // Giữ riêng hai phím xoay: thả phím phải trong khi vẫn giữ phím trái thì phải
  // quay lại xoay trái, chứ không phải dừng hẳn.
  let left = false
  let right = false

  const applyRotate = () => {
    input.rotate = left === right ? 0 : left ? -1 : 1
  }

  const onKeyDown = (e: Event) => {
    const ev = e as KeyboardEvent
    if (ev.repeat) return
    const code = ev.code

    if (LEFT.has(code)) left = true
    else if (RIGHT.has(code)) right = true
    else if (THRUST.has(code)) input.thrust = true
    else if (FIRE.has(code)) input.fire = true
    else if (HYPER.has(code)) input.hyperspace = true
    else if (PAUSE.has(code)) onPause?.()
    else return

    applyRotate()
    // Space và mũi tên cuộn trang; chặn sau khi đã biết phím này là của game.
    ev.preventDefault()
  }

  const onKeyUp = (e: Event) => {
    const ev = e as KeyboardEvent
    const code = ev.code

    if (LEFT.has(code)) left = false
    else if (RIGHT.has(code)) right = false
    else if (THRUST.has(code)) input.thrust = false
    else if (FIRE.has(code)) input.fire = false
    else if (HYPER.has(code)) input.hyperspace = false
    else return

    applyRotate()
    ev.preventDefault()
  }

  // Mất focus giữa lúc đang giữ phím thì trình duyệt không gửi keyup — không dọn
  // thì tàu kẹt ở trạng thái đang đẩy cho tới hết ván.
  const onBlur = () => {
    left = false
    right = false
    resetInput(input)
  }

  target.addEventListener('keydown', onKeyDown)
  target.addEventListener('keyup', onKeyUp)
  target.addEventListener('blur', onBlur)

  return () => {
    target.removeEventListener('keydown', onKeyDown)
    target.removeEventListener('keyup', onKeyUp)
    target.removeEventListener('blur', onBlur)
  }
}

export function createInput(): InputState {
  return { rotate: 0, thrust: false, fire: false, hyperspace: false }
}

export function resetInput(input: InputState): void {
  input.rotate = 0
  input.thrust = false
  input.fire = false
  input.hyperspace = false
}
