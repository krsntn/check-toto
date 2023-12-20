import puppeteer from "puppeteer";
import { checkResult } from "./checkResult.js";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const FIRST_DRAW = 5733;

  try {
    for (let draw = FIRST_DRAW; true; draw--) {
      console.log("===========================================");
      console.log("");
      await checkResult({ page, drawno: draw.toString(), gameType: "655" });
      await checkResult({ page, drawno: draw.toString(), gameType: "650" });
    }
  } catch (e) {
    await browser.close();
  }

  // Close the browser
  await browser.close();
})();
