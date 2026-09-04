import { beforeEach, describe, expect, it, vi } from 'vitest'
import { attachKeyboard, createInput, resetInput } from './keyboard'

const press = (el: HTMLElement, code: string, repeat = false) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { code, repeat, bubbles: true, cancelable: true }))

const release = (el: HTMLElement, code: string) =>
  el.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true, cancelable: true }))

describe('attachKeyboard', () => {
  let el: HTMLElement
  let input = createInput()

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
    input = createInput()
  })

  it('ánh xạ cả mũi tên lẫn WASD', () => {
    attachKeyboard(el, { input })

    press(el, 'ArrowLeft')
    expect(input.rotate).toBe(-1)
    release(el, 'ArrowLeft')

    press(el, 'KeyD')
    expect(input.rotate).toBe(1)
  })

  it('giữ hai phím xoay cùng lúc thì đứng yên, thả một phím thì quay lại phím còn lại', () => {
    attachKeyboard(el, { input })

    press(el, 'ArrowLeft')
    press(el, 'ArrowRight')
    expect(input.rotate).toBe(0)

    release(el, 'ArrowRight')
    expect(input.rotate).toBe(-1)
  })

  it('nhận đẩy và bắn cùng lúc', () => {
    attachKeyboard(el, { input })

    press(el, 'ArrowUp')
    press(el, 'Space')
    expect(input.thrust).toBe(true)
    expect(input.fire).toBe(true)
  })

  it('bỏ qua sự kiện lặp do giữ phím', () => {
    attachKeyboard(el, { input })
    press(el, 'Space')
    input.fire = false
    press(el, 'Space', true)
    expect(input.fire).toBe(false)
  })

  it('gọi onPause với Esc và P, và không đụng vào input', () => {
    const onPause = vi.fn()
    attachKeyboard(el, { input, onPause })

    press(el, 'Escape')
    press(el, 'KeyP')
    expect(onPause).toHaveBeenCalledTimes(2)
    expect(input).toEqual(createInput())
  })

  it('mất focus thì nhả hết phím — nếu không thì tàu kẹt ở trạng thái đang đẩy', () => {
    attachKeyboard(el, { input })
    press(el, 'ArrowUp')
    press(el, 'ArrowLeft')

    el.dispatchEvent(new Event('blur'))
    expect(input).toEqual(createInput())
  })

  it('gỡ listener thì không nhận phím nữa', () => {
    const detach = attachKeyboard(el, { input })
    detach()
    press(el, 'ArrowUp')
    expect(input.thrust).toBe(false)
  })

  it('chặn hành vi mặc định của phím game, bỏ qua phím khác', () => {
    attachKeyboard(el, { input })

    const space = new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true })
    el.dispatchEvent(space)
    expect(space.defaultPrevented).toBe(true)

    const tab = new KeyboardEvent('keydown', { code: 'Tab', bubbles: true, cancelable: true })
    el.dispatchEvent(tab)
    expect(tab.defaultPrevented).toBe(false)
  })
})

describe('resetInput', () => {
  it('đưa mọi thứ về trung tính', () => {
    const input = { rotate: 1 as const, thrust: true, fire: true, hyperspace: true }
    resetInput(input)
    expect(input).toEqual(createInput())
  })
})
