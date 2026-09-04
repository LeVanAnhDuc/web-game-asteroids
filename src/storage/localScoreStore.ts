import type { ScoreEntry } from '@/game/core/types'
import { isValidEntry, rankIn, sortEntries, TOP_N, type ScoreStore } from './scoreStore'

export const STORAGE_KEY = 'asteroids.highscores.v1'

/**
 * Bản localStorage. Mọi lời gọi đều bọc try/catch vì storage có thể bị chặn hoàn
 * toàn (chế độ riêng tư, cấu hình trình duyệt) — NFR-ROB-02: mất tính năng lưu
 * điểm là chấp nhận được, crash thì không.
 */
export function createLocalScoreStore(storage?: Storage): ScoreStore {
  const backing = storage ?? safeStorage()

  const read = (): ScoreEntry[] => {
    if (!backing) return []
    let raw: string | null
    try {
      raw = backing.getItem(STORAGE_KEY)
    } catch {
      return []
    }
    if (!raw) return []

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      // Chuỗi hỏng hoặc bị sửa tay. Bỏ qua, bắt đầu bảng trống.
      return []
    }
    if (!Array.isArray(parsed)) return []

    // Lọc từng dòng: một dòng hỏng không được làm mất cả bảng.
    return sortEntries(parsed.filter(isValidEntry)).slice(0, TOP_N)
  }

  const write = (entries: ScoreEntry[]): void => {
    if (!backing) return
    try {
      backing.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // Hết dung lượng hoặc bị chặn. Ván này không lưu được, game vẫn chạy tiếp.
    }
  }

  return {
    top: (limit = TOP_N) => read().slice(0, limit),
    rankOf: (score) => rankIn(read(), score),
    submit: (entry) => {
      if (!isValidEntry(entry)) return
      write(sortEntries([...read(), entry]).slice(0, TOP_N))
    },
    clear: () => {
      if (!backing) return
      try {
        backing.removeItem(STORAGE_KEY)
      } catch {
        // không làm gì được, và cũng không cần
      }
    },
  }
}

/** Chạm vào `localStorage` cũng có thể ném lỗi, nên phép thử này cũng phải bọc. */
function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const probe = '__asteroids_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}
