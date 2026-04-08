chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const statusEl = document.getElementById("status");

  if (!tab?.url) {
    statusEl.textContent = "Cannot access this page.";
    statusEl.className = "status inactive";
    return;
  }

  const jobSiteDomains = [
    "greenhouse.io",
    "myworkdayjobs.com",
    "myworkday.com",
    "ashbyhq.com",
    "lever.co",
    "smartrecruiters.com",
    "jobvite.com",
    "icims.com",
    "ultipro.com",
    "breezy.hr",
    "applytojob.com",
    "recruitee.com",
    "workable.com",
    "bamboohr.com",
    "paylocity.com",
    "paycomonline.net",
    "taleo.net",
    "successfactors.com",
    "jazz.co",
    "jazzhr.com",
    "rippling.com",
    "ycombinator.com",
  ];

  const url = new URL(tab.url);
  const isJobSite = jobSiteDomains.some((d) => url.hostname.endsWith(d));

  if (!isJobSite) {
    statusEl.textContent = "Not a tracked job site. Extension is idle.";
    statusEl.className = "status inactive";
    return;
  }

  // Try to get results from content script
  chrome.tabs.sendMessage(tab.id, { type: "getResults" }, (response) => {
    if (chrome.runtime.lastError || !response) {
      statusEl.textContent = "Scanning active on this site. Refresh to re-scan.";
      statusEl.className = "status active";
      return;
    }

    if (response.matchCount > 0) {
      statusEl.textContent = `Found ${response.matchCount} restriction flag(s): ${[...response.phrases].join(", ")}`;
      statusEl.className = "status alert";
    } else {
      statusEl.textContent = "No restriction flags found on this page.";
      statusEl.className = "status active";
    }
  });
});
