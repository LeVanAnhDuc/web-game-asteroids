import { describe, expect, it } from 'vitest'
import { DIFFICULTY, POWERUP, SCORING, TUNING_LIMITS, UFO, UFO_NEVER } from './constants'
import { createGameState, hudEquals, hudOf, resetForNewGame } from './state'
import type { Tuning } from './types'

describe('bộ núm của ba mức sẵn — FR-20', () => {
  // Test này là thứ chặn việc âm thầm đổi cân bằng của những ván đã ghi điểm
  // vào `asteroids.highscores.v1`. Mức Thường PHẢI bằng đúng game trước đây.
  it('mức Thường bằng đúng bộ hằng số hiện có', () => {
    expect(DIFFICULTY.normal).toEqual({
      startLives: SCORING.startLives,
      asteroidSpeed: 1,
      dropChance: POWERUP.dropChance,
      ufoFirstWave: UFO.firstWave,
    })
  })

  it('Dễ dễ hơn Thường và Khó khó hơn Thường, ở cả bốn núm', () => {
    expect(DIFFICULTY.easy.startLives).toBeGreaterThan(DIFFICULTY.normal.startLives)
    expect(DIFFICULTY.easy.asteroidSpeed).toBeLessThan(DIFFICULTY.normal.asteroidSpeed)
    expect(DIFFICULTY.easy.dropChance).toBeGreaterThan(DIFFICULTY.normal.dropChance)
    expect(DIFFICULTY.easy.ufoFirstWave).toBeGreaterThan(DIFFICULTY.normal.ufoFirstWave)

    expect(DIFFICULTY.hard.startLives).toBeLessThan(DIFFICULTY.normal.startLives)
    expect(DIFFICULTY.hard.asteroidSpeed).toBeGreaterThan(DIFFICULTY.normal.asteroidSpeed)
    expect(DIFFICULTY.hard.dropChance).toBeLessThan(DIFFICULTY.normal.dropChance)
    expect(DIFFICULTY.hard.ufoFirstWave).toBeLessThan(DIFFICULTY.normal.ufoFirstWave)
  })

  it('mọi mức sẵn nằm trong biên của thanh trượt Tuỳ chỉnh', () => {
    for (const tuning of Object.values(DIFFICULTY)) {
      for (const key of Object.keys(TUNING_LIMITS) as (keyof Tuning)[]) {
        expect(tuning[key]).toBeGreaterThanOrEqual(TUNING_LIMITS[key].min)
        expect(tuning[key]).toBeLessThanOrEqual(TUNING_LIMITS[key].max)
      }
    }
  })

  it('không mức sẵn nào tắt UFO — nhánh đó chỉ tới được qua Tuỳ chỉnh', () => {
    for (const tuning of Object.values(DIFFICULTY)) {
      expect(tuning.ufoFirstWave).toBeLessThan(UFO_NEVER)
    }
  })
})

describe('tuning trong GameState — ADR-0010', () => {
  it('ván mới mặc định là mức Thường', () => {
    const state = createGameState(1)
    expect(state.difficulty).toBe('normal')
    expect(state.tuning).toEqual(DIFFICULTY.normal)
  })

  it('resetForNewGame nhận mức và bộ núm, và dùng số mạng của bộ núm đó', () => {
    const state = createGameState(1)
    resetForNewGame(state, { difficulty: 'easy', tuning: DIFFICULTY.easy })
    expect(state.difficulty).toBe('easy')
    expect(state.lives).toBe(DIFFICULTY.easy.startLives)
  })

  it('resetForNewGame không có tham số thì GIỮ mức của ván trước', () => {
    const state = createGameState(1)
    resetForNewGame(state, { difficulty: 'hard', tuning: DIFFICULTY.hard })
    resetForNewGame(state)
    expect(state.difficulty).toBe('hard')
    expect(state.lives).toBe(DIFFICULTY.hard.startLives)
  })

  it('hudOf mang theo mức, và hudEquals nhận ra khi mức đổi', () => {
    const state = createGameState(1)
    const before = hudOf(state)
    expect(before.difficulty).toBe('normal')

    resetForNewGame(state, { difficulty: 'hard', tuning: DIFFICULTY.hard })
    expect(hudEquals(before, hudOf(state))).toBe(false)
  })
})
