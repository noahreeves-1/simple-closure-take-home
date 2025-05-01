import express, { Request, Response } from "express";
import cors from "cors";
import { chromium, ElementHandle } from "playwright";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req: Request, res: Response): Promise<void> => {
  const { url } = req.query;

  if (!url || typeof url !== "string" || !url.includes("linkedin.com/in/")) {
    res.status(400).json({ error: "Missing or invalid LinkedIn profile URL" });
    return;
  }

  let browser = null;

  //* Get Credentials
  const email = process.env.LINKEDIN_EMAIL;
  const password = process.env.LINKEDIN_PASSWORD;

  if (!email || !password) {
    res.status(500).json({
      error: "Server configuration error: Missing LinkedIn credentials.",
    });
    return;
  }

  //* Launch Browser
  try {
    browser = await chromium.launch({ headless: false }); // Set headless false for verification
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    //* Login to LinkedIn
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "domcontentloaded",
    });

    // Wait for login form fields
    await page.waitForSelector("#username", { timeout: 10000 });
    await page.waitForSelector("#password", { timeout: 5000 });

    // Fill credentials
    await page.fill("#username", email);
    await page.fill("#password", password);

    // Click sign in using a more specific selector
    await page.click('button[data-litms-control-urn="login-submit"]');

    // Wait for the profile picture/icon in the header
    await page.waitForSelector("img.global-nav__me-photo", { timeout: 120000 });

    //* Navigate to Target Profile URL
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForSelector("main", { timeout: 15000 });

    // Wait for Experience section header
    const experienceHeaderSelector =
      'section:has(h2 span:has-text("Experience"))';
    await page.waitForSelector(experienceHeaderSelector, { timeout: 15000 });

    // Wait for Education section header (handle if missing)
    const educationHeaderSelector =
      'section:has(h2 span:has-text("Education"))';
    let educationSectionExists = false;
    try {
      await page.waitForSelector(educationHeaderSelector, { timeout: 10000 });

      educationSectionExists = true;
    } catch {
      console.warn(
        "Education section header not found within timeout (likely missing from profile). Skipping education scrape."
      );
    }

    //* --- SCRAPING LOGIC ---

    //* Scrape NAME
    const nameElement = await page.$("h1");
    const name = nameElement ? await nameElement.innerText() : "Name not found";

    //* Scrape PROFILE PICTURE URL
    const loggedInPhotoSelector =
      'button[aria-label="open profile picture"] img';

    /*
    ? No longer needed as we are logged in.
    const loggedOutPhotoSelector = "img.top-card__profile-image--real-image";
    */

    let photoUrl = "Photo URL not found";

    try {
      const photoElementHandle = await page.waitForSelector(
        loggedInPhotoSelector,
        {
          state: "visible",
          timeout: 5000,
        }
      );

      if (photoElementHandle) {
        photoUrl =
          (await photoElementHandle.getAttribute("src")) ||
          "Photo URL attribute empty";
      }
    } catch (loggedInError: unknown) {
      if (loggedInError instanceof Error) {
        console.warn(
          `Logged-in photo selector failed (${loggedInError.message}). Assuming photo not found as we require login now.`
        );
      } else {
        console.warn(
          `Logged-in photo selector failed. Assuming photo not found as we require login now.`
        );
      }

      /*
      ? Fallback logic for logged-out state is commented out as login is required
      console.log(
        `Logged-in photo selector failed (${loggedInError.message}). Trying logged-out selector...`
      );

      try {
        console.log(
          `Attempting to find photo with logged-out selector: ${loggedOutPhotoSelector}`
        );
        const photoElementHandle = await page.waitForSelector(
          loggedOutPhotoSelector,
          {
            state: "visible",
            timeout: 7000, // Slightly longer timeout for fallback
          }
        );

        if (photoElementHandle) {
          photoUrl =
            (await photoElementHandle.getAttribute("src")) ||
            "Photo URL attribute empty";
          console.log("Found photo using logged-out selector.");
        }
      } catch (loggedOutError: any) {
        console.log(
          `Both photo selectors failed. Logged-out selector error: ${loggedOutError.message}`
        );
        // Keep photoUrl as the default "Photo URL not found"
      }
      */
    }

    //* Helper function to get text content or return default
    const getText = async (
      element: ElementHandle<HTMLElement | SVGElement>,
      selector: string,
      defaultVal = ""
    ) => {
      const el = await element.$(selector);
      return el ? (await el.innerText()).trim() : defaultVal;
    };

    //* Scrape WORK EXPERIENCE
    const workExperience: any[] = [];
    const experienceSection = await page.$(experienceHeaderSelector);
    if (experienceSection) {
      const experienceItems = await experienceSection.$$(
        "li.artdeco-list__item"
      );

      if (experienceItems.length === 0) {
        console.warn(
          "No items found with 'li.artdeco-list__item', checking potential alternative structure..."
        );
      }

      for (const item of experienceItems) {
        const loggedInTitleSelector =
          'div >> nth=0 >> span[aria-hidden="true"] >> nth=0';
        const loggedInCompanySelector =
          'a[data-field="experience_company_logo"] > span:nth-of-type(1) > span[aria-hidden="true"]';
        const loggedInDateRangeSelector =
          'a[data-field="experience_company_logo"] > span:nth-of-type(2) > span[aria-hidden="true"]';
        const loggedInLocationSelector =
          'a[data-field="experience_company_logo"] > span:nth-of-type(3) > span[aria-hidden="true"]';
        const loggedInDescriptionSelector =
          'div.inline-show-more-text--is-collapsed span[aria-hidden="true"]';

        /*
        ? Logged-out selectors are commented out as login is now required
        const loggedOutTitleSelector = "h3 span.experience-item__title";
        const loggedOutCompanySelector = "h4 span.experience-item__subtitle";
        const loggedOutDateRangeSelector =
          "p.experience-item__meta-item span.date-range";
        const loggedOutLocationSelector =
          "p.experience-item__meta-item:not(:has(span.date-range))";
        const loggedOutDescriptionSelector =
          "p.show-more-less-text__text--more";
        const loggedOutDescriptionButtonSelector =
          "button.show-more-less-text__button";
        */

        // --- Get Data with Fallback Logic ---

        //* Scrape TITLE
        let title = await getText(item, loggedInTitleSelector, "N/A"); // Default to N/A if not found
        /*
        ? Fallback to logged-out selectors is commented out
        if (!title || title === "N/A") {
          console.log(
            `Falling back to logged-out selector for title in item: ${await item.innerText()}`
          );
          title = await getText(item, loggedOutTitleSelector);
        }
        */

        //* Scrape COMPANY
        let company = await getText(item, loggedInCompanySelector, "N/A"); // Default to N/A
        /*
        ? Fallback to logged-out selectors is commented out
        if (!company || company === "N/A") {
          console.log(
            `Falling back to logged-out selector for company in item: ${await item.innerText()}`
          );
          company = await getText(item, loggedOutCompanySelector);
        }
        */

        //* Scrape DATE RANGE
        let dateRange = await getText(item, loggedInDateRangeSelector, "N/A"); // Default to N/A
        /*
        ? Fallback to logged-out selectors is commented out
        if (!dateRange || dateRange === "N/A") {
          console.log(
            `Falling back to logged-out selector for dateRange in item: ${await item.innerText()}`
          );
          dateRange = await getText(item, loggedOutDateRangeSelector);
        }
        */

        //* Scrape LOCATION
        let location = await getText(item, loggedInLocationSelector, "N/A"); // Default to N/A
        /*
        ? Fallback to logged-out selectors is commented out
        if (!location || location === "N/A") {
          console.log(
            `Falling back to logged-out selector logic for location in item: ${await item.innerText()}`
          );
          const metaItemParagraphs = await item.$$(
            "p.experience-item__meta-item"
          );
          location = "N/A"; // Reset location before loop
          for (const p of metaItemParagraphs) {
            const hasDateRangeSpan = await p.$("span.date-range");
            if (!hasDateRangeSpan) {
              location = (await p.innerText()).trim();
              break;
            }
          }
        }
        */

        //* Scrape DESCRIPTION
        let description = await getText(
          item,
          loggedInDescriptionSelector,
          "N/A"
        ); // Default to N/A
        /*
        ? Fallback to logged-out selectors is commented out
        if (!description || description === "N/A") {
          console.log(
            `Falling back to logged-out selector/logic for description in item: ${await item.innerText()}`
          );
          const descriptionElement = await item.$(loggedOutDescriptionSelector);
          if (descriptionElement) {
            description = await descriptionElement.evaluate(
              (node, buttonSelector) => {
                const clonedNode = node.cloneNode(true) as HTMLElement;
                const button = clonedNode.querySelector(buttonSelector); // Use variable passed to evaluate
                if (button) {
                  button.parentNode?.removeChild(button);
                }
                return clonedNode.textContent?.trim() || "N/A";
              },
              loggedOutDescriptionButtonSelector
            ); // Pass the variable here
            if (!description) description = "N/A";
          } else {
            description = "N/A"; // Default if element not found
          }
        }
        */

        if (title || company) {
          workExperience.push({
            title: title || "N/A",
            company: company || "N/A",
            dateRange: dateRange || "N/A",
            location: location || "N/A",
            description: description,
          });
        }
      }
      if (workExperience.length === 0 && experienceItems.length > 0) {
        console.warn(
          "Found Experience list items but couldn't parse details with current *internal* selectors."
        );
      }
    } else {
      console.warn(
        "Could not find Experience section (this shouldn't happen after waiting)."
      );
    }

    //* Scrape Education
    const education: any[] = [];
    let educationSection = null;
    if (educationSectionExists) {
      educationSection = await page.$(educationHeaderSelector);
    }

    if (educationSection) {
      const educationItems = await educationSection.$$("li.artdeco-list__item");

      for (const item of educationItems) {
        const containerBase =
          'div[data-view-name="profile-component-entity"] > div:nth-of-type(2)';
        const firstDivInContainer = containerBase + " > div:nth-of-type(1)";
        const anchorTagInFirstDiv = firstDivInContainer + " > a";

        // Updated Logged-in selectors based on detailed structure
        const loggedInSchoolSelector =
          anchorTagInFirstDiv + ' > div span[aria-hidden="true"]';
        const loggedInDegreeSelector =
          anchorTagInFirstDiv +
          ' > span:nth-of-type(1) > span[aria-hidden="true"]';
        const loggedInEduDateRangeSelector =
          anchorTagInFirstDiv +
          ' > span:nth-of-type(2) > span.pvs-entity__caption-wrapper[aria-hidden="true"]';
        const loggedInEduDescriptionSelector =
          containerBase + ' > div:nth-of-type(2) li span[aria-hidden="true"]';

        /*
        ? Logged-out selectors are commented out as login is now required
        const loggedOutSchoolSelector = "h3";
        const loggedOutDegreeSelector = "h4 span >> nth=0"; // Might need better parsing
        const loggedOutEduDateRangeSelector = "p span.date-range";
        const loggedOutEduDescriptionSelector =
          "p.show-more-less-text__text--less";
        */

        let school = await getText(item, loggedInSchoolSelector, "N/A");

        /*
        ? Fallback to logged-out selectors is commented out
        if (!school || school === "N/A") {
          console.log(
            `Falling back to logged-out selector for school in item: ${await item.innerText()}`
          );
          school = await getText(item, loggedOutSchoolSelector);
        }
        */

        let degree = await getText(item, loggedInDegreeSelector, "N/A");

        /*
        ? Fallback to logged-out selectors is commented out
        if (!degree || degree === "N/A") {
          console.log(
            `Falling back to logged-out selector for degree in item: ${await item.innerText()}`
          );
          // Original logged-out logic was complex, just trying basic selector for now
          const degreeSpan1 = await getText(item, "h4 span >> nth=0");
          const degreeSpan2 = await getText(item, "h4 span >> nth=1");
          if (
            degreeSpan1 &&
            degreeSpan2 &&
            degreeSpan1 !== "N/A" &&
            degreeSpan2 !== "N/A"
          ) {
            degree = `${degreeSpan1}, ${degreeSpan2}`;
          } else if (degreeSpan1 && degreeSpan1 !== "N/A") {
            degree = degreeSpan1;
          } else {
            degree = "N/A"; // Ensure default if spans fail
          }
        }
        */

        let dateRange = await getText(
          item,
          loggedInEduDateRangeSelector,
          "N/A"
        );

        /*
        ? Fallback to logged-out selectors is commented out
        if (!dateRange || dateRange === "N/A") {
          console.log(
            `Falling back to logged-out selector for edu dateRange in item: ${await item.innerText()}`
          );
          // Original logged-out logic
          const dateRangeSpan = await item.$(loggedOutEduDateRangeSelector);
          if (dateRangeSpan) {
            const startTime = await getText(dateRangeSpan, "time >> nth=0");
            const endTime = await getText(dateRangeSpan, "time >> nth=1");
            if (
              startTime &&
              startTime !== "N/A" &&
              endTime &&
              endTime !== "N/A"
            ) {
              dateRange = `${startTime} - ${endTime}`;
            } else if (startTime && startTime !== "N/A") {
              dateRange = startTime;
            } else {
              dateRange = "N/A";
            }
          } else {
            dateRange = "N/A";
          }
        }
        */

        let description = await getText(
          item,
          loggedInEduDescriptionSelector,
          "N/A"
        );

        /*
        ? Fallback to logged-out selectors is commented out
        if (!description || description === "N/A") {
          console.log(
            `Falling back to logged-out selector for edu description in item: ${await item.innerText()}`
          );
          description = await getText(item, loggedOutEduDescriptionSelector);
        }
        */

        // console.log(
        //   `Edu Item Data: S='${school}', Deg='${degree}', DR='${dateRange}', Desc='${description}'`
        // );

        if (school || degree !== "N/A") {
          education.push({
            degree: degree,
            school: school || "N/A",
            dateRange: dateRange || "N/A",
            description: description || "N/A",
          });
        }
      }
      if (education.length === 0 && educationItems.length > 0) {
        console.warn(
          "Found Education list items but couldn't parse details with current *internal* selectors."
        );
      }
    } else {
      console.warn(
        "Could not find Education section (this shouldn't happen after waiting)."
      );
    }

    // console.log("Scraped Data:", { name, photoUrl, education });
    //* --- End SCRAPING LOGIC ---

    res.json({
      name: name.trim(),
      photoUrl: photoUrl,
      workExperience: workExperience,
      education: education,
    });
  } catch (error: unknown) {
    console.error("Error during scraping:", error);
    let errorMessage = "Failed to scrape LinkedIn profile.";
    if (error instanceof Error) {
      if (error.message.includes("Timeout")) {
        errorMessage =
          "Scraping timed out. The page might be too slow, require login, or the structure changed.";
      } else if (
        error.message?.includes(
          "Target page, context or browser has been closed"
        )
      ) {
        errorMessage = "Browser context closed unexpectedly during scraping.";
      } else if (error.message?.includes("selector")) {
        errorMessage =
          "Could not find expected elements on the page. LinkedIn structure might have changed.";
      }
    }
    res.status(500).json({
      error: errorMessage,
      details: error instanceof Error ? error.message : String(error),
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
