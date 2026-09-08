// Lai game vao khung hinh dung de chup anh README.
// Chay boi web-game/.claude/skills/readme-game/scripts/capture-screenshots.mjs.
// Khong co file nay thi anh chup ra menu title, khong thay tau, khong thay da.
//
// Hop dong: export default async (page) => {...}. Viewport la 1280x720.

export default async function setup(page) {
  // exact: menu con co "Cách chơi", nen 'Chơi' khong exact khop 2 nut.
  await page.getByRole('button', { name: 'Chơi', exact: true }).click();
  await page.waitForTimeout(600);

  // Xoay va day mot chut de tau khong dung im giua man, va de da kip troi ra
  // thanh mot the tran co gi de nhin.
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(180);
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(420);
  await page.keyboard.up('ArrowUp');
  await page.waitForTimeout(500);
}
