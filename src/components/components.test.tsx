import { describe, expect, it, vi as vitestVi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { HighScoresScreen } from './HighScoresScreen'
import { InitialsInput } from './InitialsInput'
import { translateAnnouncement } from './LiveRegion'
import { GameOverOverlay } from './Overlays'
import { Segmented, TuningSlider } from './ui'
import { vi as strings } from '@/i18n/vi'
import type { ScoreEntry } from '@/game/core/types'

describe('translateAnnouncement — NFR-A11Y-06', () => {
  it('dịch khoá của lõi sang chuỗi tiếng Việt', () => {
    expect(translateAnnouncement('wave:3')).toBe(strings.announce.waveStart(3))
    expect(translateAnnouncement('lifeLost:2')).toBe(strings.announce.lifeLost(2))
    expect(translateAnnouncement('extraLife')).toBe(strings.announce.extraLife)
  })

  it('khoá lạ hoặc null trả về chuỗi rỗng, không ném lỗi', () => {
    expect(translateAnnouncement(null)).toBe('')
    expect(translateAnnouncement('không-biết')).toBe('')
  })
})

describe('InitialsInput', () => {
  it('mũi tên lên đổi ký tự đang chọn', () => {
    const onChange = vitestVi.fn()
    render(<InitialsInput value="AAA" onChange={onChange} label="Tên" />)

    fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith('BAA')
  })

  it('gõ chữ ghi thẳng vào ô đang chọn rồi nhảy sang ô sau', () => {
    const onChange = vitestVi.fn()
    render(<InitialsInput value="AAA" onChange={onChange} label="Tên" />)

    const group = screen.getByRole('group')
    fireEvent.keyDown(group, { key: 'z' })
    expect(onChange).toHaveBeenCalledWith('ZAA')
  })

  it('quay vòng từ A xuống Z', () => {
    const onChange = vitestVi.fn()
    render(<InitialsInput value="AAA" onChange={onChange} label="Tên" />)

    fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledWith('ZAA')
  })

  it('có nút tăng giảm cho cả ba ký tự — dùng được bằng ngón tay', () => {
    render(<InitialsInput value="AAA" onChange={() => {}} label="Tên" />)
    expect(screen.getAllByRole('button')).toHaveLength(6)
  })
})

describe('HighScoresScreen', () => {
  const entry = (score: number, at: number): ScoreEntry => ({ initials: 'ABC', score, wave: 2, at })

  it('bảng trống thì nói rõ, không hiện bảng rỗng — US-06', () => {
    render(<HighScoresScreen entries={[]} onBack={() => {}} onClear={() => {}} />)
    expect(screen.getByText(strings.highScores.empty)).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('bảng trống thì không hiện nút xoá', () => {
    render(<HighScoresScreen entries={[]} onBack={() => {}} onClear={() => {}} />)
    expect(screen.queryByText(strings.highScores.clear)).toBeNull()
  })

  it('làm nổi đúng dòng vừa thêm', () => {
    const rows = [entry(300, 111), entry(100, 222)]
    const { container } = render(
      <HighScoresScreen entries={rows} highlightAt={222} onBack={() => {}} onClear={() => {}} />,
    )
    const highlighted = container.querySelectorAll('tr.bg-primary\\/15')
    expect(highlighted).toHaveLength(1)
  })
})

describe('GameOverOverlay — US-02', () => {
  it('không lọt bảng thì KHÔNG hỏi tên', () => {
    render(
      <GameOverOverlay
        score={120}
        wave={2}
        rank={null}
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
        onSubmit={() => {}}
        onPlayAgain={() => {}}
        onMenu={() => {}}
      />,
    )

    fireEvent.click(screen.getByText(strings.gameOver.save))
    expect(screen.queryByText(strings.gameOver.save)).toBeNull()
  })
})

describe('Segmented — FR-20 · FR-22', () => {
  const options = [
    { id: 'easy' as const, label: 'Dễ' },
    { id: 'normal' as const, label: 'Thường' },
    { id: 'hard' as const, label: 'Khó' },
  ]

  it('ở menu là nhóm nút bật/tắt: đúng một cái aria-pressed=true', () => {
    render(<Segmented options={options} value="normal" onChange={() => {}} label="Độ khó" />)
    expect(screen.getByRole('button', { name: 'Thường' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Dễ' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('ở bảng điểm là tab thật, không phải nút bật/tắt', () => {
    // Cùng một hình, hai ngữ nghĩa: ở menu là lựa chọn để dùng SAU khi bấm Chơi,
    // ở bảng điểm nó lọc ngay cái bảng bên dưới.
    render(
      <Segmented
        options={options}
        value="easy"
        onChange={() => {}}
        label="Bảng điểm"
        variant="tablist"
        controls="scores-panel"
      />,
    )
    expect(screen.getByRole('tablist')).toBeTruthy()
    expect(screen.getByRole('tab', { selected: true }).textContent).toBe('Dễ')
    expect(screen.getByRole('tab', { name: 'Dễ' }).getAttribute('aria-controls')).toBe('scores-panel')
  })

  it('bấm một lựa chọn gọi onChange với id của nó', () => {
    const onChange = vitestVi.fn()
    render(<Segmented options={options} value="normal" onChange={onChange} label="Độ khó" />)
    fireEvent.click(screen.getByRole('button', { name: 'Dễ' }))
    expect(onChange).toHaveBeenCalledWith('easy')
  })
})

describe('TuningSlider — FR-21 · NFR-A11Y-03', () => {
  const base = { min: 1, max: 10, step: 1, onChange: () => {} }

  it('giá trị hiện ra cũng đọc được cho trình đọc màn hình', () => {
    // `valueText` nằm ở <span> bên cạnh nên AT không thấy. Không có
    // aria-valuetext thì thanh UFO đọc là "10" — mà 10 nghĩa là TẮT.
    render(<TuningSlider id="ufo" label="UFO từ wave" value={10} valueText="tắt" {...base} />)
    expect(screen.getByRole('slider', { name: 'UFO từ wave' }).getAttribute('aria-valuetext')).toBe('tắt')
    expect(screen.getByText('tắt')).toBeTruthy()
  })

  it('nhãn trỏ đúng vào thanh trượt', () => {
    render(<TuningSlider id="lives" label="Số mạng" value={3} valueText="3" {...base} />)
    expect(screen.getByLabelText('Số mạng').getAttribute('id')).toBe('lives')
  })

  it('kéo thanh trượt gọi onChange với SỐ, không phải chuỗi', () => {
    const onChange = vitestVi.fn()
    render(<TuningSlider id="lives" label="Số mạng" value={3} valueText="3" min={1} max={6} step={1} onChange={onChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '5' } })
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
