const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const OUT_DIR = "/tmp/site_study";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1440,900"
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("wa-seen-intro", "1");
    localStorage.setItem("wa-landed", "1");
    localStorage.setItem("wa-e2e", "1"); // E2E MODE!
  });

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("header", { timeout: 60000 });
  await sleep(1500);

  // Initial state before click
  await page.screenshot({ path: path.join(OUT_DIR, "10_interactive_home_before.png") });

  // Find the plus button on Water card (first 'More' button)
  const plusButtons = await page.$$("button[aria-label^='More']");
  if (plusButtons.length > 0) {
    console.log("Clicking plus on Water...");
    await plusButtons[0].click();
    await sleep(600);
    await page.screenshot({ path: path.join(OUT_DIR, "11_interactive_home_water_incremented.png") });
    
    // Click plus again
    await plusButtons[0].click();
    await sleep(600);
    await page.screenshot({ path: path.join(OUT_DIR, "12_interactive_home_water_goal_reached.png") });
  }

  // Now click on Study plus button (second 'More' button)
  if (plusButtons.length > 1) {
    console.log("Clicking plus on Study...");
    await plusButtons[1].click();
    await sleep(600);
    await page.screenshot({ path: path.join(OUT_DIR, "13_interactive_home_study_incremented.png") });
  }

  // Now click on a "Mark Done" button (if not already completed, e.g. Workout or let's find one)
  const buttons = await page.$$("button");
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes("Mark Done")) {
      console.log("Clicking Mark Done button...");
      await btn.click();
      await sleep(600);
      await page.screenshot({ path: path.join(OUT_DIR, "14_interactive_home_marked_done.png") });
      break;
    }
  }

  // Also let's click on the Sleep card's "+ Add / Edit" button to see the Sheet modal
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes("Add / Edit")) {
      console.log("Clicking Add / Edit button on Sleep...");
      await btn.click();
      await sleep(600);
      await page.screenshot({ path: path.join(OUT_DIR, "15_interactive_sleep_sheet.png") });
      break;
    }
  }

  await browser.close();
  console.log("Interactive screenshots captured successfully!");
}

run().catch(console.error);
