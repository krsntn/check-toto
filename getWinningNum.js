const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function getWinningNum({ browser, page, drawno }) {
  await page.goto("https://www.sportstoto.com.my/results_past_drawno.asp");
  await page.type("#drawno", drawno);
  await delay(100);
  await page.keyboard.press("Enter");
  const newWindowTarget = await browser.waitForTarget(
    (target) =>
      target.url() ===
      "https://www.sportstoto.com.my/results_past_drawno_popup.asp",
  );
  const newPage = await newWindowTarget.page();
  const power = await getNums("power", newPage);
  const star = await getNums("star", newPage);
  const supreme = await getNums("supreme", newPage);
  await newPage.close();
  return { power, star, supreme };
}

async function getNums(type, page) {
  let selector = "";
  if (type === "power") {
    selector =
      "#popup_container > div > div > div:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(1) > td.txt_black2";
  } else if (type === "star") {
    selector =
      "#popup_container > div > div > div:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td.txt_black2";
  } else if (type === "supreme") {
    selector =
      "#popup_container > div > div > div:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(1) > td.txt_black2";
  }
  await page.waitForSelector(selector, { timeout: 1000 });
  const nums = await page.$$eval(selector, (elements) =>
    elements.map((el) => el.textContent),
  );
  return nums;
}
