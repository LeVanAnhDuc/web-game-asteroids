'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { DIFFICULTY } from '@/game/core/constants'
import type { ScoreEntry, Tuning } from '@/game/core/types'
import { vi } from '@/i18n/vi'
import { isCoarsePointer } from '@/input/touch'
import { createLocalScoreStore, SCORE_KEYS } from '@/storage/localScoreStore'
import { createSettingsStore } from '@/storage/settingsStore'
import { CustomScreen } from './CustomScreen'
import { Hud } from './Hud'
import { HelpScreen } from './HelpScreen'
import { HighScoresScreen } from './HighScoresScreen'
import { LiveRegion, translateAnnouncement } from './LiveRegion'
import { MenuScreen, type PresetId } from './MenuScreen'
import { GameOverOverlay, PauseOverlay } from './Overlays'
import { TouchControls } from './TouchControls'

/** Mức lưu trong máy có thể là `custom`; menu chỉ chọn được ba mức sẵn. */
function presetOf(id: string): PresetId {
  return id === 'easy' || id === 'hard' ? id : 'normal'
}

export function GameShell() {
  // Seed cố định ở lần dựng đầu để server và client render giống nhau; mỗi ván
  // mới dùng lại state đó nên không cần seed ngẫu nhiên ở đây.
  const { canvasRef, hud, announce, touch, actions } = useGame(20260904)

  const settings = useMemo(() => createSettingsStore(), [])
  const storeOf = useCallback((id: PresetId) => createLocalScoreStore(undefined, SCORE_KEYS[id]), [])

  /** Mức sẽ chơi khi bấm Chơi ở menu. */
  const [preset, setPreset] = useState<PresetId>('normal')
  /** Bốn số của chế độ Tuỳ chỉnh. Tách khỏi `preset` — chúng độc lập. */
  const [tuning, setTuning] = useState<Tuning>(DIFFICULTY.normal)
  /**
   * Mức của bảng ĐANG XEM. Tách khỏi `preset` vì xem bảng mức khác không có
   * nghĩa là đổi mức sẽ chơi.
   */
  const [table, setTable] = useState<PresetId>('normal')
  const [entries, setEntries] = useState<ScoreEntry[]>([])
  const [best, setBest] = useState<number | null>(null)
  const [highlightAt, setHighlightAt] = useState<number | null>(null)
  const [coarse, setCoarse] = useState(false)
  const rankRef = useRef<number | null>(null)

  /** Ván tuỳ chỉnh không ghi bảng nào — FR-21. */
  const canSave = hud.difficulty !== 'custom'

  // localStorage và `pointer: coarse` chỉ có ở client — đọc sau khi mount để
  // không lệch HTML giữa server và client.
  useEffect(() => {
    const saved = presetOf(settings.difficulty())
    setPreset(saved)
    setTable(saved)
    setTuning(settings.tuning())
    setEntries(storeOf(saved).top())
    setCoarse(isCoarsePointer())
  }, [settings, storeOf])

  // Điểm cao nhất ở menu là của mức SẼ chơi, không phải bảng đang xem. Đọc lại
  // khi về menu chứ không mỗi lần render: trong lúc chơi HUD đổi liên tục, mà
  // mỗi lần đọc là một lần JSON.parse.
  useEffect(() => {
    if (hud.phase !== 'menu') return
    setBest(storeOf(preset).top(1)[0]?.score ?? null)
  }, [hud.phase, preset, storeOf])

  // Chốt thứ hạng đúng lúc ván kết thúc, trước khi điểm mới được ghi vào bảng.
  useEffect(() => {
    if (hud.phase !== 'gameover') return
    rankRef.current = canSave ? storeOf(presetOf(hud.difficulty)).rankOf(hud.score) : null
  }, [hud.phase, hud.score, hud.difficulty, canSave, storeOf])

  const showTable = (id: PresetId) => {
    setTable(id)
    setEntries(storeOf(id).top())
    setHighlightAt(null)
  }

  const choosePreset = (id: PresetId) => {
    setPreset(id)
    settings.setDifficulty(id)
    setTable(id)
    setEntries(storeOf(id).top())
  }

  // Ghi vào bảng của mức VỪA CHƠI, không phải mức đang chọn ở menu — người chơi
  // đổi mức ở menu trong lúc màn Hết lượt còn mở thì điểm vẫn phải về đúng bảng.
  const submit = (initials: string) => {
    const id = presetOf(hud.difficulty)
    const entry: ScoreEntry = { initials, score: hud.score, wave: hud.wave, at: Date.now() }
    const store = storeOf(id)
    store.submit(entry)
    setTable(id)
    setEntries(store.top())
    setHighlightAt(entry.at)
    actions.show('highscores')
  }

  const playing = hud.phase === 'playing' || hud.phase === 'paused' || hud.phase === 'gameover'

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-bg">
      <LiveRegion message={translateAnnouncement(announce)} />

      {/* Canvas luôn tồn tại: gỡ nó ra khỏi DOM sẽ phá renderer và loop. Khi
          không chơi thì nó lùi xuống làm nền. */}
      <div
        className={
          playing ? 'flex min-h-0 flex-1 flex-col' : 'pointer-events-none absolute inset-0 opacity-25'
        }
      >
        {playing ? (
          <div className="px-2 pt-2">
            <Hud hud={hud} onPause={actions.pause} />
          </div>
        ) : null}

        <div className="relative min-h-0 flex-1">
          <canvas
            ref={canvasRef}
            aria-label={vi.a11y.canvasLabel}
            role="img"
            className="block h-full w-full"
          />
        </div>

        {playing && coarse ? <TouchControls touch={touch} /> : null}
      </div>

      {hud.phase === 'menu' ? (
        <div className="relative z-10 h-full">
          <MenuScreen
            best={best}
            difficulty={preset}
            onDifficulty={choosePreset}
            onPlay={() => actions.start({ difficulty: preset, tuning: DIFFICULTY[preset] })}
            onHighScores={() => {
              showTable(table)
              actions.show('highscores')
            }}
            onHelp={() => actions.show('help')}
            onCustom={() => actions.show('custom')}
          />
        </div>
      ) : null}

      {hud.phase === 'custom' ? (
        <div className="relative z-10 h-full">
          <CustomScreen
            tuning={tuning}
            onChange={(next) => {
              setTuning(next)
              settings.setTuning(next)
            }}
            onPlay={() => actions.start({ difficulty: 'custom', tuning })}
            onBack={actions.toMenu}
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
            difficulty={table}
            onDifficulty={showTable}
            highlightAt={highlightAt}
            onBack={actions.toMenu}
            onClear={() => {
              storeOf(table).clear()
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
          canSave={canSave}
          onSubmit={submit}
          onPlayAgain={actions.start}
          onMenu={actions.toMenu}
        />
      ) : null}
    </main>
  )
}
