'use client'

import type { ScoreEntry } from '@/game/core/types'
import { vi } from '@/i18n/vi'
import { Button, formatScore, Panel, ScreenTitle } from './ui'

const dateFmt = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function HighScoresScreen({
  entries,
  highlightAt,
  onBack,
  onClear,
}: {
  entries: ScoreEntry[]
  highlightAt?: number | null
  onBack: () => void
  onClear: () => void
}) {
  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <ScreenTitle>{vi.highScores.title}</ScreenTitle>

        {entries.length === 0 ? (
          <Panel className="p-6">
            <p className="text-center text-sm text-muted">{vi.highScores.empty}</p>
          </Panel>
        ) : (
          <Panel className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-widest text-muted">
                  <th className="px-3 py-2 font-normal">{vi.highScores.rank}</th>
                  <th className="px-3 py-2 font-normal">{vi.highScores.name}</th>
                  <th className="px-3 py-2 text-right font-normal">{vi.highScores.score}</th>
                  <th className="px-3 py-2 text-right font-normal">{vi.highScores.wave}</th>
                  <th className="hidden px-3 py-2 text-right font-normal sm:table-cell">
                    {vi.highScores.date}
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {entries.map((e, i) => (
                  <tr
                    key={`${e.at}-${i}`}
                    className={`border-b border-hairline/60 last:border-0 ${
                      highlightAt === e.at ? 'bg-primary/15 text-accent' : ''
                    }`}
                  >
                    <td className="px-3 py-2 text-muted">{i + 1}</td>
                    <td className="px-3 py-2 tracking-[0.2em]">{e.initials}</td>
                    <td className="px-3 py-2 text-right">{formatScore(e.score)}</td>
                    <td className="px-3 py-2 text-right text-muted">{e.wave}</td>
                    <td className="hidden px-3 py-2 text-right text-muted sm:table-cell">
                      {dateFmt.format(new Date(e.at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        )}

        <p className="text-center text-xs text-muted">{vi.highScores.localOnly}</p>

        <div className="flex justify-center gap-3">
          <Button onClick={onBack} autoFocus>
            {vi.highScores.back}
          </Button>
          {entries.length > 0 ? <Button onClick={onClear}>{vi.highScores.clear}</Button> : null}
        </div>
      </div>
    </div>
  )
}
