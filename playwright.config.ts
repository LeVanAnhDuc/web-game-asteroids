import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const BASE_URL = `http://127.0.0.1:${PORT}`

/**
 * Chạy trên BẢN EXPORT TĨNH, không phải dev server: đó mới là thứ GitHub Pages
 * phục vụ, nên đó là thứ đáng kiểm. `next start` không phục vụ được bản export,
 * nên dùng `scripts/serve.mjs` trên `out/`.
 *
 * Năm project ứng với đúng những khổ mà thiết kế cam kết (design.md §5, wireframe
 * đã duyệt). Đây là chỗ duy nhất kiểm được bố cục ở 375 / 768 / 1024 một cách tự
 * động — `backlog.md` có một mục riêng cho việc này vì trước đó chưa ai nhìn thấy
 * ba khổ đó chạy thật.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'mobile-375', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 720 } } },
    { name: 'tablet-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 900 } } },
    { name: 'laptop-1024', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // Màn hình cảm ứng thật: nút giữ-được rẽ nhánh theo pointer capture và theo
    // `pointer: coarse`, hai thứ không dựng lại được bằng chuột (US-03).
    { name: 'touch-phone', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: `node scripts/serve.mjs ${PORT} out`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
