'use client'

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
