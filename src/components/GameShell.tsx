'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '@/hooks/useGame'
import type { ScoreEntry } from '@/game/core/types'
import { vi } from '@/i18n/vi'
import { isCoarsePointer } from '@/input/touch'
import { createLocalScoreStore } from '@/storage/localScoreStore'
import { Hud } from './Hud'
import { HelpScreen } from './HelpScreen'
import { HighScoresScreen } from './HighScoresScreen'
import { LiveRegion, translateAnnouncement } from './LiveRegion'
import { MenuScreen } from './MenuScreen'
import { GameOverOverlay, PauseOverlay } from './Overlays'
import { TouchControls } from './TouchControls'

export function GameShell() {
  // Seed cố định ở lần dựng đầu để server và client render giống nhau; mỗi ván
  // mới dùng lại state đó nên không cần seed ngẫu nhiên ở đây.
  const { canvasRef, hud, announce, touch, actions } = useGame(20260904)

  const store = useMemo(() => createLocalScoreStore(), [])
  const [entries, setEntries] = useState<ScoreEntry[]>([])
  const [highlightAt, setHighlightAt] = useState<number | null>(null)
  const [coarse, setCoarse] = useState(false)
  const rankRef = useRef<number | null>(null)

  // localStorage và `pointer: coarse` chỉ có ở client — đọc sau khi mount để
  // không lệch HTML giữa server và client.
  useEffect(() => {
    setEntries(store.top())
    setCoarse(isCoarsePointer())
  }, [store])

  // Chốt thứ hạng đúng lúc ván kết thúc, trước khi điểm mới được ghi vào bảng.
  useEffect(() => {
    if (hud.phase === 'gameover') rankRef.current = store.rankOf(hud.score)
  }, [hud.phase, hud.score, store])

  const submit = (initials: string) => {
    const entry: ScoreEntry = { initials, score: hud.score, wave: hud.wave, at: Date.now() }
    store.submit(entry)
    setEntries(store.top())
    setHighlightAt(entry.at)
    actions.show('highscores')
  }

  const best = entries[0]?.score ?? null
  const playing = hud.phase === 'playing' || hud.phase === 'paused' || hud.phase === 'gameover'

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-bg">
      <LiveRegion message={translateAnnouncement(announce)} />

      {/* Canvas luôn tồn tại: gỡ nó ra khỏi DOM sẽ phá renderer và loop. Khi
          không chơi thì nó lùi xuống làm nền. */}
      <div className={playing ? 'flex min-h-0 flex-1 flex-col' : 'pointer-events-none absolute inset-0 opacity-25'}>
        {playing ? (
          <div className="px-2 pt-2">
            <Hud hud={hud} onPause={actions.pause} />
          </div>
        ) : null}

        <div className="relative min-h-0 flex-1">
          <canvas ref={canvasRef} aria-label={vi.a11y.canvasLabel} role="img" className="block h-full w-full" />
        </div>

        {playing && coarse ? <TouchControls touch={touch} /> : null}
      </div>

      {hud.phase === 'menu' ? (
        <div className="relative z-10 h-full">
          <MenuScreen
            best={best}
            onPlay={actions.start}
            onHighScores={() => {
              setEntries(store.top())
              actions.show('highscores')
            }}
            onHelp={() => actions.show('help')}
          />
        </div>
      ) : null}

      {hud.phase === 'help' ? (
        <div className="relative z-10 h-full">
          <HelpScreen onBack={actions.toMenu} />
        </div>
      ) : null}

      {hud.phase === 'highscores' ? (
        <div className="relative z-10 h-full">
          <HighScoresScreen
            entries={entries}
            highlightAt={highlightAt}
            onBack={actions.toMenu}
            onClear={() => {
              store.clear()
              setEntries([])
              setHighlightAt(null)
            }}
          />
        </div>
      ) : null}

      {hud.phase === 'paused' ? <PauseOverlay onResume={actions.resume} onMenu={actions.toMenu} /> : null}

      {hud.phase === 'gameover' ? (
        <GameOverOverlay
          score={hud.score}
          wave={hud.wave}
          rank={rankRef.current}
          onSubmit={submit}
          onPlayAgain={actions.start}
          onMenu={actions.toMenu}
        />
      ) : null}
    </main>
  )
}
