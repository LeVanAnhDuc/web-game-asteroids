// Toàn bộ số cân bằng nằm ở một chỗ. Đây là ước lượng trên giấy (design.md §3);
// việc chỉnh lại sau khi chơi thật nằm trong backlog.md §Việc tiếp theo.
//
// Đơn vị: toạ độ là đơn vị thế giới (bất biến #4), thời gian là GIÂY trong tên
// hằng số nhưng mọi đồng hồ trong state đếm bằng MS.

import type { AsteroidSize, PowerUpKind } from './types'

/** Thế giới cố định 4:3 — ADR-0003. */
export const WORLD_W = 1600
export const WORLD_H = 1200

/** Một bước mô phỏng luôn ứng với đúng ngần này giây — ADR-0003. */
export const FIXED_DT = 1 / 60
/** Không bao giờ mô phỏng bù quá ngần này trong một frame — NFR-ROB-03. */
export const MAX_FRAME_S = 0.25

export const SHIP = {
  rotateSpeed: 3.6, // rad/s
  thrust: 520, // đv/s²
  friction: 0.6, // hệ số giảm tốc mỗi giây
  maxSpeed: 620, // đv/s
  drawRadius: 18,
  hitRadius: 14, // ≈ 78% bán kính vẽ — bất biến #10
  invulnMs: 2000,
  respawnMs: 900,
  hyperCooldownMs: 5000,
} as const

export const BULLET = {
  speed: 780,
  lifeMs: 1200,
  radius: 3,
  maxOnScreen: 4,
  cooldownMs: 280,
  /** Nhân với cooldown khi đang có power-up bắn nhanh. */
  rapidFactor: 0.5,
  /** Nới trần số đạn khi đang có power-up bắn nhanh hoặc bắn toả. */
  maxOnScreenBoosted: 9,
  /** Nửa góc quạt của bắn toả, radian. */
  spreadAngle: 0.22,
} as const

export const UFO_BULLET = {
  speed: 420,
  lifeMs: 2400,
  radius: 3,
} as const

export const ASTEROID_RADIUS: Record<AsteroidSize, number> = {
  large: 76,
  medium: 40,
  small: 20,
}

export const ASTEROID_SCORE: Record<AsteroidSize, number> = {
  large: 20,
  medium: 50,
  small: 100,
}

/** Cấp vỡ ra. `null` nghĩa là biến mất. */
export const ASTEROID_CHILD: Record<AsteroidSize, AsteroidSize | null> = {
  large: 'medium',
  medium: 'small',
  small: null,
}

export const ASTEROID = {
  childCount: 2,
  minSpeed: 60,
  maxSpeed: 130,
  maxSpin: 1.2, // rad/s
  minVertices: 9,
  maxVertices: 13,
  /** Biên độ méo của đa giác: bán kính mỗi đỉnh nằm trong [1 − j, 1 + j]. */
  jitter: 0.34,
} as const

export const WAVE = {
  baseCount: 2,
  maxCount: 11,
  speedStep: 0.06,
  maxSpeedFactor: 1.8,
  clearDelayMs: 1500,
  /** Banner "WAVE n" hiện rồi mờ hẳn trong ngần này. */
  bannerMs: 1800,
  /** Wave 1 không sinh thiên thạch trong bán kính này quanh tàu. */
  safeRadius: 260,
} as const

export const UFO = {
  firstWave: 3,
  minDelayMs: 18000,
  maxDelayMs: 28000,
  bigRadius: 26,
  smallRadius: 16,
  bigScore: 200,
  smallScore: 1000,
  speed: 170,
  turnMinMs: 700,
  turnMaxMs: 1600,
  fireMinMs: 900,
  fireMaxMs: 1800,
  /** Độ lệch khi UFO to bắn, radian. UFO nhỏ ngắm chuẩn. */
  bigAimError: 0.4,
  /** Tỉ lệ ra UFO nhỏ tăng theo điểm, tới trần này. */
  smallChanceMax: 0.6,
  smallChancePerPoint: 0.6 / 40000,
} as const

export const POWERUP = {
  dropChance: 0.08,
  maxOnScreen: 2,
  lifeMs: 10000,
  blinkMs: 3000,
  radius: 16,
  driftSpeed: 40,
  effectMs: 12000,
  maxEffectMs: 20000,
  /** Trọng số khi chọn loại rơi ra. `life` hiếm — 1/12. */
  weights: { shield: 3, rapid: 3, spread: 3, pierce: 2, life: 1 } as Record<PowerUpKind, number>,
} as const

export const SCORING = {
  startLives: 3,
  extraLifeEvery: 10000,
} as const

export const EFFECTS = {
  shakeOnDeathMs: 420,
  shakeMaxOffset: 14,
  particlesPerBreak: 10,
  particleLifeMinMs: 260,
  particleLifeMaxMs: 620,
  particleSpeedMin: 60,
  particleSpeedMax: 220,
  maxParticles: 240,
} as const

export const POWERUP_COLOR: Record<PowerUpKind, string> = {
  shield: '#22D3EE',
  rapid: '#FFD166',
  spread: '#A78BFA',
  pierce: '#FB7185',
  life: '#34D399',
}

export const COLOR = {
  fg: '#F2F5F9',
  primary: '#4F7CFF',
  accent: '#FFD166',
  asteroid: '#8B94A7',
  ufo: '#FF5D8F',
} as const

/**
 * Khoá cho `state.announce` (NFR-A11Y-06). Lõi phát KHOÁ chứ không phát chuỗi
 * tiếng Việt: chuỗi hiển thị chỉ được nằm ở một module duy nhất (`NFR-I18N-01`),
 * mà lõi thì không được import ra ngoài (bất biến #1). Tầng React dịch khoá này.
 */
export const ANNOUNCE = {
  extraLife: 'extraLife',
  gameOver: (score: number) => `gameOver:${score}`,
  wave: (wave: number) => `wave:${wave}`,
  lifeLost: (lives: number) => `lifeLost:${lives}`,
} as const
