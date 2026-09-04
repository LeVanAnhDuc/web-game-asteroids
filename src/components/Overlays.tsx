'use client'

import { useState } from 'react'
import { vi } from '@/i18n/vi'
import { normalizeInitials } from '@/storage/scoreStore'
import { InitialsInput } from './InitialsInput'
import { Button, formatScore, Panel, Stat } from './ui'

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/80 px-4 backdrop-blur-[2px]">
      {children}
    </div>
  )
}

export function PauseOverlay({ onResume, onMenu }: { onResume: () => void; onMenu: () => void }) {
  return (
    <Backdrop>
      <Panel className="flex w-full max-w-xs flex-col gap-4 p-6">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-muted">{vi.pause.title}</h2>
        <Button variant="primary" onClick={onResume} autoFocus>
          {vi.pause.resume}
        </Button>
        <Button onClick={onMenu}>{vi.pause.toMenu}</Button>
      </Panel>
    </Backdrop>
  )
}

export function GameOverOverlay({
  score,
  wave,
  rank,
  onSubmit,
  onPlayAgain,
  onMenu,
}: {
  score: number
  wave: number
  /** `null` nghĩa là không lọt top 10 — khi đó KHÔNG hỏi tên (US-02). */
  rank: number | null
  onSubmit: (initials: string) => void
  onPlayAgain: () => void
  onMenu: () => void
}) {
  const [initials, setInitials] = useState('AAA')
  const [saved, setSaved] = useState(false)

  const save = () => {
    onSubmit(normalizeInitials(initials))
    setSaved(true)
  }

  return (
    <Backdrop>
      <Panel className="flex w-full max-w-sm flex-col gap-5 p-6">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-muted">{vi.gameOver.title}</h2>

        <div className="flex flex-col gap-2">
          <Stat label={vi.gameOver.score} value={formatScore(score)} />
          <Stat label={vi.gameOver.wave} value={wave} />
          <Stat label={vi.gameOver.rank} value={rank === null ? vi.gameOver.noRank : `#${rank}`} />
        </div>

        {rank !== null && !saved ? (
          <div className="flex flex-col gap-3">
            <InitialsInput value={initials} onChange={setInitials} label={vi.gameOver.enterName} />
            <Button variant="primary" onClick={save}>
              {vi.gameOver.save}
            </Button>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={onPlayAgain} autoFocus={rank === null}>
            {vi.gameOver.playAgain}
          </Button>
          <Button onClick={onMenu}>{vi.gameOver.toMenu}</Button>
        </div>
      </Panel>
    </Backdrop>
  )
}
