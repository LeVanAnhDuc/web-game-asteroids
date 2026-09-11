import { describe, expect, it, vi as vitestVi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { GameOverOverlay } from './index'
import { vi as strings } from '@/i18n/vi'

const noop = () => {}

describe('GameOverOverlay — US-02', () => {
  it('không lọt bảng thì KHÔNG hỏi tên', () => {
    render(
      <GameOverOverlay
        score={120}
        wave={2}
        rank={null}
        canSave
        onSubmit={() => {}}
        onPlayAgain={() => {}}
        onMenu={() => {}}
      />,
    )
    expect(screen.queryByRole('group')).toBeNull()
    expect(screen.getByText(strings.gameOver.noRank)).toBeTruthy()
  })

  it('lọt bảng thì hỏi tên và gửi đúng ba ký tự in hoa', () => {
    const onSubmit = vitestVi.fn()
    render(
      <GameOverOverlay
        score={5000}
        wave={4}
        rank={2}
        canSave
        onSubmit={onSubmit}
        onPlayAgain={() => {}}
        onMenu={() => {}}
      />,
    )

    fireEvent.click(screen.getByText(strings.gameOver.save))
    expect(onSubmit).toHaveBeenCalledWith('AAA')
  })

  it('lưu xong thì ô nhập tên biến mất — không lưu được hai lần', () => {
    render(
      <GameOverOverlay
        score={5000}
        wave={4}
        rank={2}
        canSave
        onSubmit={() => {}}
        onPlayAgain={() => {}}
        onMenu={() => {}}
      />,
    )

    fireEvent.click(screen.getByText(strings.gameOver.save))
    expect(screen.queryByText(strings.gameOver.save)).toBeNull()
  })
})

describe('màn Hết lượt ở ván tuỳ chỉnh — FR-21', () => {
  it('không hỏi tên và không hiện thứ hạng khi ván không ghi bảng', () => {
    render(
      <GameOverOverlay
        score={5000}
        wave={4}
        rank={1}
        canSave={false}
        onSubmit={noop}
        onPlayAgain={noop}
        onMenu={noop}
      />,
    )
    expect(screen.queryByRole('button', { name: strings.gameOver.save })).toBeNull()
    expect(screen.getByText(strings.gameOver.customNoSave)).toBeTruthy()
    expect(screen.queryByText(strings.gameOver.rank)).toBeNull()
  })

  it('ván mức sẵn thì vẫn hỏi tên như trước', () => {
    render(
      <GameOverOverlay
        score={5000}
        wave={4}
        rank={1}
        canSave
        onSubmit={noop}
        onPlayAgain={noop}
        onMenu={noop}
      />,
    )
    expect(screen.getByRole('button', { name: strings.gameOver.save })).toBeTruthy()
  })
})
