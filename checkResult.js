import fs from "fs";

// Constants
const WAIT_TIME = 500; // Adjust the wait time as needed

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function checkResult({ page, drawno, gameType }) {
  const readFileAsync = (fileName) => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  try {
    const fileData = await readFileAsync(`${gameType}.txt`);
    const rows = fileData
      .trim()
      .split("\n")
      .map((row) => row.split(",").map(Number));

    const input = rows.map((row) => row.map(Number));

    await page.goto(
      `https://www.sportstoto.com.my/results_prizecal_${gameType}.asp`,
    );
    await page.waitForSelector("#game");
    await page.select("#game", `results_prizecal_${gameType}.asp`);
    await page.waitForSelector("#drawno");
    await page.type("#drawno", drawno);

    const row = ["A", "B", "C", "D", "E"];

    const result = input.map((numbers, index) => {
      const transformedObj = {};
      numbers.forEach((num, i) => {
        transformedObj[`${row[index]}${i + 1}`] = num;
      });
      return transformedObj;
    });

    for (const obj of result) {
      for (const [key, value] of Object.entries(obj)) {
        await page.type(`#num${key}`, `${value}`);
        await delay(5);
      }
    }

    await delay(500);
    await page.click("#calculate");

    await page.waitForSelector("#resultTable");
    await delay(WAIT_TIME);

    // Capture screenshot if necessary
    // await page.screenshot({ path: `result_${gameType}.png` });

    const txt_grey = await page.$$eval(".txt_grey1", (elements) =>
      elements.map((el) => el.textContent),
    );

    const fonts = await page.$$eval("font", (elements) =>
      elements
        .slice(0, -1)
        .map((el) => el.textContent)
        .reduce(
          (acc, cur, index, array) =>
            index % 3 === 0 ? acc.concat([array.slice(index, index + 3)]) : acc,
          [],
        ),
    );

    if (!txt_grey[1]) {
      throw new Error("Draw No not found");
    }

    const date = new Date(txt_grey[1].split("/").reverse().join("-"));
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      weekday: "long",
    };

    const dateTimeFormat = new Intl.DateTimeFormat("en-GB", options).format(
      date,
    );

    console.log("Draw No: " + txt_grey[0]);
    console.log("Date: " + dateTimeFormat);
    console.log("Game Type: " + gameType);
    console.log("---");

    for (const item of fonts) {
      console.log(item[0], "\t", "|", "\t", item[1], "\t", "|", "\t", item[2]);
    }
    console.log("---");
    console.log("");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
