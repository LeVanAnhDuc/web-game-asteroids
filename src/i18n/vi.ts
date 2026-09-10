// Toàn bộ chuỗi hiển thị nằm ở đây — NFR-I18N-01. Component không được viết
// chuỗi tiếng Việt trực tiếp.

export const vi = {
  meta: {
    title: 'Duck Drift',
    description: 'Game bắn thiên thạch kiểu arcade, chơi ngay trong trình duyệt.',
  },

  menu: {
    title: 'DUCK DRIFT',
    play: 'Chơi',
    highScores: 'Bảng điểm',
    help: 'Cách chơi',
    custom: 'Tuỳ chỉnh',
    best: 'Điểm cao nhất',
    bestOf: (name: string) => `Điểm cao nhất — ${name}`,
    noBest: 'Chưa có điểm nào',
  },

  difficulty: {
    label: 'Độ khó',
    easy: 'Dễ',
    normal: 'Thường',
    hard: 'Khó',
    custom: 'Tuỳ chỉnh',
  },

  custom: {
    title: 'TUỲ CHỈNH',
    startLives: 'Số mạng',
    asteroidSpeed: 'Tốc độ thiên thạch',
    dropChance: 'Tỉ lệ rơi vật phẩm',
    ufoFirstWave: 'UFO từ wave',
    ufoOff: 'tắt',
    notSaved: 'Ván tuỳ chỉnh không được ghi vào bảng điểm.',
    play: 'Chơi',
    back: 'Về menu',
  },

  hud: {
    score: 'Điểm',
    wave: 'Wave',
    lives: 'Mạng',
    pause: 'Tạm dừng',
    hyperspace: 'Dịch chuyển',
  },

  pause: {
    title: 'TẠM DỪNG',
    resume: 'Tiếp tục',
    toMenu: 'Về menu',
  },

  gameOver: {
    title: 'HẾT LƯỢT',
    score: 'Điểm',
    wave: 'Wave',
    rank: 'Hạng',
    noRank: 'Không lọt bảng',
    enterName: 'Tên của bạn',
    save: 'Lưu điểm',
    playAgain: 'Chơi lại',
    toMenu: 'Về menu',
    customNoSave: 'Ván tuỳ chỉnh không ghi vào bảng điểm.',
  },

  highScores: {
    title: 'Bảng điểm',
    empty: 'Chưa có điểm nào. Chơi một ván đi.',
    rank: 'Hạng',
    name: 'Tên',
    score: 'Điểm',
    wave: 'Wave',
    date: 'Ngày',
    clear: 'Xoá bảng điểm',
    clearOf: (name: string) => `Xoá bảng ${name}`,
    emptyOf: (name: string) => `Chưa có điểm nào ở mức ${name}. Chơi một ván đi.`,
    tabsLabel: 'Bảng điểm theo mức',
    back: 'Quay lại',
    localOnly: 'Bảng điểm này chỉ lưu trên máy bạn.',
  },

  help: {
    title: 'Cách chơi',
    back: 'Quay lại',
    controlsTitle: 'Điều khiển',
    keyboard: {
      rotate: 'Xoay trái / phải',
      rotateKeys: '← →  hoặc  A D',
      thrust: 'Đẩy',
      thrustKeys: '↑  hoặc  W',
      fire: 'Bắn',
      fireKeys: 'Space',
      hyperspace: 'Dịch chuyển',
      hyperspaceKeys: 'Shift',
      pause: 'Tạm dừng',
      pauseKeys: 'Esc  hoặc  P',
    },
    touchNote: 'Trên điện thoại: hai cụm nút ở nửa dưới màn hình. Nút giữa là dịch chuyển.',
    scoringTitle: 'Điểm',
    scoring: {
      large: 'Thiên thạch to',
      medium: 'Thiên thạch vừa',
      small: 'Thiên thạch nhỏ',
      ufoBig: 'UFO to',
      ufoSmall: 'UFO nhỏ',
      extraLife: 'Thêm một mạng mỗi 10.000 điểm',
    },
    powerUpsTitle: 'Vật phẩm',
    powerUpNote: 'Ba loại vũ khí dùng chung một khe — nhặt cái mới thì thay cái cũ.',
  },

  powerUps: {
    shield: { name: 'Khiên', desc: 'Chặn một lần va chạm' },
    rapid: { name: 'Bắn nhanh', desc: 'Nhịp bắn gấp đôi' },
    spread: { name: 'Bắn toả', desc: 'Ba viên hình quạt' },
    pierce: { name: 'Đạn xuyên', desc: 'Đạn không mất khi trúng' },
    life: { name: 'Thêm mạng', desc: 'Cộng ngay một mạng' },
  },

  announce: {
    waveStart: (n: number) => `Wave ${n}`,
    lifeLost: (left: number) => `Mất một mạng. Còn ${left} mạng.`,
    extraLife: 'Được thêm một mạng',
    gameOver: (score: number) => `Hết lượt. Tổng điểm ${score}.`,
    powerUp: (name: string) => `Nhặt được ${name}`,
  },

  a11y: {
    canvasLabel: 'Khu vực chơi. Điều khiển bằng bàn phím hoặc bằng các nút bên dưới.',
    rotateLeft: 'Xoay trái',
    rotateRight: 'Xoay phải',
    thrust: 'Đẩy',
    fire: 'Bắn',
    hyperspace: 'Dịch chuyển',
  },
} as const

export type Strings = typeof vi
