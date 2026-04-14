# Clearance & Citizenship Check - Chrome Extension

A Chrome extension that automatically scans job postings for US citizenship requirements, security clearance demands, and visa sponsorship restrictions. It highlights flagged phrases directly on the page and shows a warning banner so you can quickly skip jobs you're not eligible for.

## What It Detects

**Citizenship & Work Authorization**
- US citizenship requirements ("must be a U.S. citizen", "United States citizenship required")
- Green card / permanent resident requirements
- Work authorization requirements
- No visa sponsorship statements ("will not sponsor", "no sponsorship", "cannot sponsor")

**Security Clearance**
- Secret, Top Secret, TS/SCI clearance
- Active clearance requirements
- DoD clearance, SCI access, Public Trust positions
- Polygraph requirements (CI Poly, Full Scope)
- Eligibility for clearance

**Government & Export Controls**
- ITAR / EAR export control restrictions
- Government and federal contract requirements

## Supported Job Sites

The extension only activates on known job board domains — it stays completely idle on all other websites.

| Platform | Domain |
|---|---|
| Greenhouse | greenhouse.io |
| Workday | myworkdayjobs.com, myworkday.com |
| Ashby | ashbyhq.com |
| Lever | lever.co |
| SmartRecruiters | smartrecruiters.com |
| Jobvite | jobvite.com |
| iCIMS | icims.com |
| UltiPro | ultipro.com |
| Breezy HR | breezy.hr |
| ApplyToJob | applytojob.com |
| Recruitee | recruitee.com |
| Workable | workable.com |
| BambooHR | bamboohr.com |
| Paylocity | paylocity.com |
| Paycom | paycomonline.net |
| Taleo | taleo.net |
| SuccessFactors | successfactors.com |
| JazzHR | jazz.co, jazzhr.com |
| Dover | dover.com |
| Rippling | rippling.com |
| YC Jobs | ycombinator.com/companies/*/jobs |

## How It Works

1. When you open a job posting on any supported site, the extension scans all visible text on the page.
2. Matched phrases are highlighted in red inline.
3. A red warning banner appears at the top of the page showing the count and list of flagged phrases.
4. The banner can be dismissed with the close button.
5. On single-page apps (like Workday), it automatically re-scans when page content changes.

## Installation

### Download the extension

Clone this repository or download and extract the ZIP:

```bash
git clone https://github.com/your-username/sec-clearance-check-ext.git
```

Or click **Code > Download ZIP** on GitHub and extract it to a folder.

### Chrome / Edge / Brave

1. Navigate to `chrome://extensions/` (or `edge://extensions/` / `brave://extensions/`)
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `sec-clearance-check-ext` folder (the one containing `manifest.json`)
5. (Optional) Click the puzzle piece icon in the toolbar and pin the extension

### Firefox

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select the `manifest.json` file inside the `sec-clearance-check-ext` folder
4. The extension will be active until you restart Firefox

> **Note:** Temporary add-ons are removed on restart. For permanent installation, the extension needs to be signed via [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/) (free).

## Usage

No configuration needed. Just browse job postings on any supported site:

- **Red highlights** appear inline on flagged phrases.
- **Red banner** at the top shows a summary of all flags found.
- **Click the extension icon** to see the current page status in the popup.
- **Dismiss the banner** by clicking the X button.

## Project Structure

```
sec-clearance-check-ext/
├── manifest.json    # Extension config and site permissions
├── content.js       # Page scanner and highlighter
├── styles.css       # Highlight and banner styles
├── popup.html       # Extension popup UI
├── popup.js         # Popup logic
└── icons/
    ├── icon48.png
    └── icon128.png
```

## Privacy

This extension:
- Requires only **activeTab** permission — no background access, no data leaves your browser
- Runs only on the listed job board domains
- Does all processing locally with simple regex pattern matching
- Does not collect, store, or transmit any data
