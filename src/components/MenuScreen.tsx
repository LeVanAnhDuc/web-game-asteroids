'use client'

import { vi } from '@/i18n/vi'
import { Button, formatScore, ScreenTitle } from './ui'

export function MenuScreen({
  best,
  onPlay,
  onHighScores,
  onHelp,
}: {
  best: number | null
  onPlay: () => void
  onHighScores: () => void
  onHelp: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
      <ScreenTitle>{vi.menu.title}</ScreenTitle>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button variant="primary" onClick={onPlay} autoFocus>
          {vi.menu.play}
        </Button>
        <Button onClick={onHighScores}>{vi.menu.highScores}</Button>
        <Button onClick={onHelp}>{vi.menu.help}</Button>
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {best === null ? vi.menu.noBest : `${vi.menu.best}  ${formatScore(best)}`}
      </p>
    </div>
  )
}
