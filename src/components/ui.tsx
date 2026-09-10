'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Signature element của dự án: khung hairline có bốn vạch góc (MASTER.md §0).
 * Lớp `.panel` định nghĩa ở globals.css để cả hai pseudo-element vẽ được vạch góc.
 */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`panel ${className}`}>{children}</div>
}

type Variant = 'primary' | 'ghost'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-primary/15 text-fg border-primary/60 hover:bg-primary/25 hover:shadow-glow-md',
  ghost: 'bg-transparent text-muted border-hairline hover:text-fg hover:border-fg/40',
}

export function Button({
  variant = 'ghost',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      // min-h-11 = 44px — NFR-A11Y-03, áp cho cả nút trên desktop cho nhất quán.
      className={`min-h-11 cursor-pointer rounded-lg border px-5 text-sm font-medium tracking-wide transition-colors ${VARIANT[variant]} ${className}`}
    />
  )
}

/** Tiêu đề màn hình. Chữ số ở mọi nơi khác dùng font mono, tiêu đề thì không. */
export function ScreenTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-center text-2xl font-semibold tracking-[0.3em] sm:text-3xl">{children}</h1>
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
      <span className="font-mono text-lg tabular-nums">{value}</span>
    </div>
  )
}

export const formatScore = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

/**
 * Dãy lựa chọn dùng ở hai chỗ có HAI ngữ nghĩa khác nhau:
 *
 * - `group` (menu): nhóm nút bật/tắt — một lựa chọn để dùng SAU, khi bấm Chơi.
 * - `tablist` (bảng điểm): tab thật — nó lọc ngay cái bảng ngay bên dưới.
 *
 * Cùng một hình, khác ngữ nghĩa, nên khác role. Đừng gộp thành một role duy nhất.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  variant = 'group',
  controls,
}: {
  options: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  label: string
  variant?: 'group' | 'tablist'
  controls?: string
}) {
  const tabs = variant === 'tablist'
  return (
    <div
      role={tabs ? 'tablist' : 'group'}
      aria-label={label}
      className="grid grid-cols-3 gap-1 rounded-[10px] border border-hairline bg-surface p-1"
    >
      {options.map((option) => {
        const on = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role={tabs ? 'tab' : undefined}
            aria-selected={tabs ? on : undefined}
            aria-pressed={tabs ? undefined : on}
            aria-controls={tabs ? controls : undefined}
            onClick={() => onChange(option.id)}
            // min-h-11 = 44px — NFR-A11Y-03
            className={`min-h-11 cursor-pointer rounded-lg border text-sm font-medium tracking-wide transition-colors ${
              on
                ? 'border-primary/60 bg-primary/15 text-fg'
                : 'border-transparent bg-transparent text-muted hover:text-fg'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Một núm cân bằng. `valueText` là giá trị đọc được cho người ("1.0×", "8%",
 * "tắt") và nó phải vào CẢ `aria-valuetext`: con số thô của thanh trượt nói sai —
 * 10 ở núm UFO nghĩa là TẮT, không phải wave 10.
 */
export function TuningSlider({
  id,
  label,
  value,
  valueText,
  min,
  max,
  step,
  onChange,
}: {
  id: string
  label: string
  value: number
  valueText: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-6">
        <label htmlFor={id} className="text-xs uppercase tracking-widest text-muted">
          {label}
        </label>
        <span className="font-mono text-lg tabular-nums text-accent">{valueText}</span>
      </div>
      {/* h-11 = 44px vùng bấm — NFR-A11Y-03. Thanh vẽ mảnh, vùng chạm thì không. */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full cursor-pointer accent-primary"
      />
    </div>
  )
}
