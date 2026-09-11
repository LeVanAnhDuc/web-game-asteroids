'use client'

// components
import { Button } from '@/components/Button'
import { Panel } from '@/components/Panel'
import { Backdrop } from '../Backdrop'

// others
import { vi } from '@/i18n/vi'

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
