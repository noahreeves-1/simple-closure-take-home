# LinkedIn Profile to PDF Resume

Takes a LinkedIn profile URL and returns a generated PDF resume. Scrapes basic profile info (name, photo, experience, education) using Playwright, then renders it into a downloadable PDF using @react-pdf/renderer.

## Submission Notes

I built the core MVP — public LinkedIn scraping, frontend integration, and PDF generation — within the first 1.5 hours.

When LinkedIn began blocking public scraping via Playwright, I pivoted to authenticated scraping using credentials stored in a `.env` file. This required rebuilding selectors for the more complex, deeply nested logged-in DOM, which took additional time.

Once the scraper was functional, I polished the frontend using a modern stack and modular components.

I tried implementing dynamic page numbers in the PDF footer, but the solution from the documentation didn’t work as expected.

To mitigate scraping delays, I mocked API responses on the frontend, which helped decouple UI testing from manual login steps. These mock responses are now commented out in the code.

For full transparency, I went slightly over the 4-hour time limit due to the unexpected scraper rebuild. The repo includes both the original (logged-out) and final (logged-in) scraper logic, with the original commented out for context.

## Overview

- **Backend (Node.js + Express + Playwright):** Exposes an API endpoint (/api/scrape) that accepts a LinkedIn URL, logs in, scrapes profile data (name, photo, experience, education), and returns structured JSON.
- **Frontend (React + TypeScript):** Accepts a LinkedIn URL, calls the backend API, and renders a downloadable resume using @react-pdf/renderer. Built with modern React tooling for forms, validation, and async data.

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind
  - Shadcn
  - React Hook Form
  - Zod
  - TanStack Query
  - `@react-pdf/renderer`
  - Vite
- **Backend:**
  - Node.js
  - Express
  - Playwright
  - TypeScript
  - `ts-node`
  - `dotenv`
  - `cors`
- **Development:**
  - Git
  - npm

**Note on Scraping:** Login credentials are required. Anonymous scraping will be quickly blocked by LinkedIn.

## Setup and Running

**Prerequisites:**

- Node.js (v18+)
- npm
- Git

**Steps:**

1.  **Clone repo:**
    ```bash
    git clone <repository_url>
    cd linkedin-to-resume
    ```
2.  **Install Backend:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install Playwright Browsers:** (In `backend` dir)
    ```bash
    npx playwright install
    ```
4.  **Install Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
5.  **Configure Backend Env:**

    - Go to `backend` directory.
    - Run the setup script to copy the example environment file:
      ```bash
      npm run setup:env
      ```
    - Edit the newly created `.env` file with your LinkedIn email and password:
      ```dotenv
      LINKEDIN_EMAIL=your_email@domain.com
      LINKEDIN_PASSWORD=your_password
      ```

    * **Credentials:** Required for the scraper to work.
    * **Headless:** Set to `false` (visible browser) by default because LinkedIn login often fails in true headless mode. **A browser window will open when the backend receives a request to scrape a LinkedIn URL.**
    * **Manual Intervention May Be Needed:** During the initial login attempt in the browser window opened by the backend:
      - If a **CAPTCHA** appears, you must solve it manually in the browser window.
      - If LinkedIn prompts for an **email verification code**, check your email, retrieve the code, and enter it manually in the browser window.
      - The scraper has a timeout (currently ~120 seconds) to allow time for these manual steps during login. After successful login and potential verification, the scraping should proceed automatically.
    * **Security Checks Post-Login:** Even after login, other CAPTCHAs or checks might appear during navigation. These will block the scraper. It doesn't handle them automatically.

6.  **Run Backend:** (In `backend` dir)

    ```bash
    npm start
    ```

    - Server runs on `http://localhost:3001`.

7.  **Run Frontend:** (In `frontend` dir, new terminal)
    ```bash
    npm start
    ```
    - App runs on `http://localhost:3000`.

## How to Use

> ⚠️ Note: The backend will open a browser window to handle LinkedIn login. You may need to solve CAPTCHA or enter a code manually.

1.  Go to `http://localhost:3000`.
2.  Enter a LinkedIn profile URL.
3.  Click "Generate Resume".
4.  Wait for scraping.
5.  Click "Download Resume PDF".

## Assumptions & Tradeoffs

- **Selectors:** LinkedIn UI changes will break scraping.
- **Login:** Credentials in `.env` are necessary.
- **Security Checks:** Not handled; will cause failure.
- **PDF Styling:** Basic layout via `@react-pdf/renderer`.
- **Data Scope:** Only scrapes Name, Photo, Experience, Education.

## Development Process Notes

- Phase 1: Standard project setup (frontend, backend, Playwright config)
- Phase 2: Built MVP scraper and integrated end-to-end flow with PDF rendering
- Phase 3: Pivoted to authenticated scraping after LinkedIn blocked anonymous requests
- Phase 4: Rebuilt selectors for logged-in DOM and restored full scraping functionality
- Phase 5: Added frontend polish: React Query, React Hook Form, Zod, modular components
- Phase 6: Cleanup pass — updated README, commented unused code, clarified logic  
  (Final polishing — README + comments — was done shortly after the main build. No functional changes were made.)

## Known Issues

- **LinkedIn Security Checks:** The main issue. Scraper fails if CAPTCHA or email verification aren't manually resolved.
- **Selector Breakage:** Expected when LinkedIn updates UI.
- **Inconsistent Data:** Missing profile fields result in missing data in the PDF.
- **PDF Page Numbers:** Removed dynamic `X of Y` due to unreliability.

## Future Improvements

- Use session cookies instead of login to bypass repeated CAPTCHA challenges (requires manual setup or auth automation).
- Rotate proxy IPs to reduce scraping blocks and avoid rate limits (e.g. residential proxy pool or headless browser proxying)
- Add CAPTCHA solving service (e.g. 2Captcha or Anti-Captcha), though costly and brittle.
- Persist session state (e.g. cache local storage/cookies) to reduce login friction across scraping sessions.
- Add better error handling & retries for scraping failures and page navigation issues.
- Improve PDF layout and visual design, including true dynamic page numbers and better formatting.
- Scrape additional sections like About, Skills, Certifications, Volunteer, etc.
- Refactor date parsing (e.g. normalize date ranges, detect current job, sort experience chronologically).
- Add TailwindCSS for better frontend polish.
- Write integration and unit tests for scraper logic, API contract, and PDF rendering components.
