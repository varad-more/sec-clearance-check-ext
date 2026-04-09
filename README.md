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

### Step 1: Download the extension

Clone this repository or download and extract the ZIP:

```bash
git clone https://github.com/your-username/sec-clearance-check-ext.git
```

Or click **Code > Download ZIP** on GitHub and extract it to a folder.

### Step 2: Open Chrome Extensions page

Open Chrome and navigate to:

```
chrome://extensions/
```

### Step 3: Enable Developer Mode

Toggle the **Developer mode** switch in the top-right corner of the extensions page.

### Step 4: Load the extension

1. Click the **Load unpacked** button that appears after enabling developer mode.
2. In the file picker, select the `sec-clearance-check-ext` folder (the one containing `manifest.json`).
3. The extension will appear in your extensions list.

### Step 5: Pin the extension (optional)

Click the puzzle piece icon in the Chrome toolbar and pin **Clearance & Citizenship Check** for easy access to the popup status panel.

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
