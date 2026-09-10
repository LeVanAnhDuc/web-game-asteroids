'use client'

import type { DifficultyId } from '@/game/core/types'
import { vi } from '@/i18n/vi'
import { Button, formatScore, ScreenTitle, Segmented } from './ui'

/** Mức có bảng điểm riêng. `custom` không nằm đây — nó là NÚT, không phải lựa chọn. */
export type PresetId = Exclude<DifficultyId, 'custom'>

export const PRESETS: readonly { id: PresetId; label: string }[] = [
  { id: 'easy', label: vi.difficulty.easy },
  { id: 'normal', label: vi.difficulty.normal },
  { id: 'hard', label: vi.difficulty.hard },
]

export function MenuScreen({
  best,
  difficulty,
  onDifficulty,
  onPlay,
  onHighScores,
  onHelp,
  onCustom,
}: {
  best: number | null
  difficulty: PresetId
  onDifficulty: (id: PresetId) => void
  onPlay: () => void
  onHighScores: () => void
  onHelp: () => void
  onCustom: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
      <ScreenTitle>{vi.menu.title}</ScreenTitle>

      <div className="flex w-full max-w-xs flex-col gap-3">
        {/* Dãy mức ngay trên nút Chơi: bấm Chơi là vào ván, không thêm cú bấm
            nào cho người không quan tâm — overview.md §4, Non-Goal đầu tiên. */}
        <Segmented
          options={PRESETS}
          value={difficulty}
          onChange={onDifficulty}
          label={vi.difficulty.label}
        />
        <Button variant="primary" onClick={onPlay} autoFocus>
          {vi.menu.play}
        </Button>

        <Button className="mt-2" onClick={onHighScores}>
          {vi.menu.highScores}
        </Button>
        <Button onClick={onHelp}>{vi.menu.help}</Button>
        <Button onClick={onCustom}>{vi.menu.custom}</Button>
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {best === null ? vi.menu.noBest : `${vi.menu.bestOf(vi.difficulty[difficulty])}  ${formatScore(best)}`}
      </p>
    </div>
  )
}
