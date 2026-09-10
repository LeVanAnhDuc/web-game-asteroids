import { describe, expect, it, vi as vitestVi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { CustomScreen } from './CustomScreen'
import { HighScoresScreen } from './HighScoresScreen'
import { InitialsInput } from './InitialsInput'
import { translateAnnouncement } from './LiveRegion'
import { MenuScreen } from './MenuScreen'
import { GameOverOverlay } from './Overlays'
import { Segmented, TuningSlider } from './ui'
import { vi as strings } from '@/i18n/vi'
import { DIFFICULTY, UFO_NEVER } from '@/game/core/constants'
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
    render(
      <HighScoresScreen
        entries={[]}
        difficulty="normal"
        onDifficulty={() => {}}
        onBack={() => {}}
        onClear={() => {}}
      />,
    )
    expect(screen.getByText(strings.highScores.emptyOf(strings.difficulty.normal))).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('bảng trống thì không hiện nút xoá', () => {
    render(
      <HighScoresScreen
        entries={[]}
        difficulty="normal"
        onDifficulty={() => {}}
        onBack={() => {}}
        onClear={() => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: /Xoá bảng/ })).toBeNull()
  })

  it('làm nổi đúng dòng vừa thêm', () => {
    const rows = [entry(300, 111), entry(100, 222)]
    const { container } = render(
      <HighScoresScreen
        entries={rows}
        difficulty="normal"
        onDifficulty={() => {}}
        highlightAt={222}
        onBack={() => {}}
        onClear={() => {}}
      />,
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
    render(
      <TuningSlider
        id="lives"
        label="Số mạng"
        value={3}
        valueText="3"
        min={1}
        max={6}
        step={1}
        onChange={onChange}
      />,
    )
    fireEvent.change(screen.getByRole('slider'), { target: { value: '5' } })
    expect(onChange).toHaveBeenCalledWith(5)
  })
})

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

describe('CustomScreen — FR-21', () => {
  const custom = (tuning = DIFFICULTY.normal) => (
    <CustomScreen tuning={tuning} onChange={noop} onPlay={noop} onBack={noop} />
  )

  it('bốn thanh trượt, không ba không năm', () => {
    render(custom())
    expect(screen.getAllByRole('slider')).toHaveLength(4)
  })

  it('nói TRƯỚC khi chơi rằng ván này không ghi bảng điểm', () => {
    render(custom())
    expect(screen.getByText(strings.custom.notSaved)).toBeTruthy()
  })

  it('mốc cuối của núm UFO hiện là "tắt", không phải số 10', () => {
    render(custom({ ...DIFFICULTY.normal, ufoFirstWave: UFO_NEVER }))
    expect(
      screen.getByRole('slider', { name: strings.custom.ufoFirstWave }).getAttribute('aria-valuetext'),
    ).toBe(strings.custom.ufoOff)
  })

  it('tỉ lệ rơi hiện theo phần trăm, không phải 0.08', () => {
    render(custom())
    expect(
      screen.getByRole('slider', { name: strings.custom.dropChance }).getAttribute('aria-valuetext'),
    ).toBe('8%')
  })

  it('kéo một núm gọi onChange với cả bốn số, ba núm kia không đổi', () => {
    const onChange = vitestVi.fn()
    render(<CustomScreen tuning={DIFFICULTY.normal} onChange={onChange} onPlay={noop} onBack={noop} />)
    fireEvent.change(screen.getByRole('slider', { name: strings.custom.startLives }), {
      target: { value: '6' },
    })
    expect(onChange).toHaveBeenCalledWith({ ...DIFFICULTY.normal, startLives: 6 })
  })
})

describe('bảng điểm ba tab — FR-22', () => {
  const rows: ScoreEntry[] = [{ initials: 'DUC', score: 12400, wave: 7, at: 1_757_000_000_000 }]
  const table = (difficulty: 'easy' | 'normal' | 'hard', entries = rows, onDifficulty = noop) => (
    <HighScoresScreen
      entries={entries}
      difficulty={difficulty}
      onDifficulty={onDifficulty}
      highlightAt={null}
      onBack={noop}
      onClear={noop}
    />
  )

  it('ba tab, tab của mức đang xem được chọn', () => {
    render(table('hard'))
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { selected: true }).textContent).toBe(strings.difficulty.hard)
  })

  it('nút xoá ghi rõ nó xoá bảng nào — nó chỉ xoá tab đang mở', () => {
    render(table('easy'))
    expect(
      screen.getByRole('button', { name: strings.highScores.clearOf(strings.difficulty.easy) }),
    ).toBeTruthy()
  })

  it('bảng trống thì nói rõ mức nào trống, và nút xoá biến mất hẳn', () => {
    render(table('hard', []))
    expect(screen.getByText(strings.highScores.emptyOf(strings.difficulty.hard))).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Xoá bảng/ })).toBeNull()
  })

  it('bấm tab khác gọi onDifficulty', () => {
    const onDifficulty = vitestVi.fn()
    render(table('normal', rows, onDifficulty))
    fireEvent.click(screen.getByRole('tab', { name: strings.difficulty.hard }))
    expect(onDifficulty).toHaveBeenCalledWith('hard')
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
