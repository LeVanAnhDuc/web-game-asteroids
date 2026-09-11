import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MenuScreen } from './index'
import { vi as strings } from '@/i18n/vi'

const noop = () => {}

describe('MenuScreen — FR-20', () => {
  const menu = (difficulty: 'easy' | 'normal' | 'hard', best: number | null = 100) => (
    <MenuScreen
      best={best}
      difficulty={difficulty}
      onDifficulty={noop}
      onPlay={noop}
      onHighScores={noop}
      onHelp={noop}
      onCustom={noop}
    />
  )

  it('dãy ba mức nằm ở menu và mức đang chọn được đánh dấu', () => {
    render(menu('hard'))
    expect(screen.getByRole('button', { name: strings.difficulty.hard }).getAttribute('aria-pressed')).toBe(
      'true',
    )
  })

  it('có nút Tuỳ chỉnh, và nó KHÔNG nằm trong dãy ba mức', () => {
    // Nó dẫn sang màn khác nên nó không cùng loại với ba mức kia.
    render(menu('normal', null))
    const custom = screen.getByRole('button', { name: strings.menu.custom })
    expect(custom.getAttribute('aria-pressed')).toBeNull()
    expect(screen.getByRole('group', { name: strings.difficulty.label }).contains(custom)).toBe(false)
  })

  it('dòng điểm cao nhất nói rõ nó là của mức nào', () => {
    render(menu('easy', 12400))
    // Khớp cả dòng, không chỉ tên mức: `/Dễ/` một mình còn khớp cả chip mức.
    expect(screen.getByText(new RegExp(`^${strings.menu.bestOf(strings.difficulty.easy)}`))).toBeTruthy()
  })
})
