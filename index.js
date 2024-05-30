import puppeteer from "puppeteer";
import { checkResult } from "./checkResult.js";
import { getWinningNum } from "./getWinningNum.js";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const FIRST_DRAW = 5807;

  try {
    for (let draw = FIRST_DRAW; true; draw++) {
      console.log("===========================================");
      console.log("");
      const { power, star, supreme } = await getWinningNum({
        browser,
        page,
        drawno: draw.toString(),
      });

      await checkResult({
        winNums: supreme,
        page,
        drawno: draw.toString(),
        gameType: "658",
      });

      await checkResult({
        winNums: power,
        page,
        drawno: draw.toString(),
        gameType: "655",
      });

      await checkResult({
        winNums: star,
        page,
        drawno: draw.toString(),
        gameType: "650",
      });
    }
  } catch (e) {
    console.log(e);
    await browser.close();
  }

  // Close the browser
  await browser.close();
})();
