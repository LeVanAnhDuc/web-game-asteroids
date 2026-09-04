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
