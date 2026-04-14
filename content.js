(() => {
  "use strict";

  const PATTERNS = [
    // Citizenship requirements
    /\bU\.?S\.?\s*citizen(?:ship)?\b/gi,
    /\bUnited\s+States\s+citizen(?:ship)?\b/gi,
    /\bcitizen(?:ship)?\s+(?:is\s+)?required\b/gi,
    /\bmust\s+be\s+a?\s*(?:U\.?S\.?|United\s+States)\s+citizen\b/gi,
    /\bpermanent\s+resident\b/gi,
    /\bgreen\s*card\s+(?:holder|required)\b/gi,
    /\bauthori[sz]ed\s+to\s+work\s+in\s+the\s+(?:U\.?S\.?|United\s+States)\b/gi,
    /\bwork\s+authori[sz]ation\b/gi,
    /\bno\s+(?:visa\s+)?sponsorship\b/gi,
    /\bunable\s+to\s+(?:provide\s+)?sponsor\b/gi,
    /\bwill\s+not\s+(?:provide\s+)?sponsor\b/gi,
    /\bcannot\s+sponsor\b/gi,
    /\bwithout\s+(?:visa\s+)?sponsorship\b/gi,
    /\bnot\s+(?:offer|provide)\s+(?:visa\s+)?sponsorship\b/gi,
    /\bUS\s+persons?\s+only\b/gi,
    /\bU\.?S\.?\s+person\b/gi,

    // Security clearance
    /\bsecret\s+clearance\b/gi,
    /\btop\s+secret(?:\s+clearance|\s+\/\s*SCI|\/SCI)?\b/gi,
    /\bTS[\s/]SCI\b/gi,
    /\bsecurity\s+clearance\b/gi,
    /\bactive\s+clearance\b/gi,
    /\bclearance\s+(?:is\s+)?required\b/gi,
    /\bmust\s+(?:hold|have|possess|maintain|obtain)\s+(?:a\s+)?(?:active\s+)?(?:security\s+)?clearance\b/gi,
    /\beligibl[ey]\s+(?:for|to\s+obtain)\s+(?:a\s+)?(?:security\s+)?clearance\b/gi,
    /\bDoD\s+clearance\b/gi,
    /\bSCI\s+access\b/gi,
    /\bpublic\s+trust\s+(?:clearance|investigation|determination|position)\b/gi,
    /\bsensitive\s+compartmented\s+information\b/gi,
    /\bconfidential\s+clearance\b/gi,
    /\bPolygraph\s+(?:required|clearance)\b/gi,
    /\bCI\s+poly(?:graph)?\b/gi,
    /\bFull\s+Scope\s+Poly(?:graph)?\b/gi,

    // Government / ITAR / EAR / Export
    /\bITAR\b/g,
    /\bEAR\s+(?:regulat|restrict|compli|controlled)\b/gi,
    /\bexport[\s-]?control(?:led|s)?\b/gi,
    /\bgovernment\s+contract\b/gi,
    /\bfederal\s+contract\b/gi,
  ];

  const BANNER_ID = "clearance-check-ext-banner";
  const HIGHLIGHT_CLASS = "clearance-check-ext-highlight";

  let latestResults = { matchCount: 0, matchedPhrases: new Set() };

  function getTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentElement?.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
          return NodeFilter.FILTER_REJECT;
        }
        if (node.parentElement?.closest("#" + BANNER_ID)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (node.parentElement?.classList.contains(HIGHLIGHT_CLASS)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function highlightMatch(textNode, pattern) {
    const text = textNode.nodeValue;
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (!match) return false;

    const mark = document.createElement("mark");
    mark.className = HIGHLIGHT_CLASS;
    mark.title = "Restriction flag detected by Clearance Check";

    const before = text.substring(0, match.index);
    const matched = text.substring(match.index, match.index + match[0].length);
    const after = text.substring(match.index + match[0].length);

    const parent = textNode.parentNode;
    if (before) parent.insertBefore(document.createTextNode(before), textNode);
    mark.textContent = matched;
    parent.insertBefore(mark, textNode);
    if (after) parent.insertBefore(document.createTextNode(after), textNode);
    parent.removeChild(textNode);

    return true;
  }

  function clearPreviousResults() {
    document.querySelectorAll("." + HIGHLIGHT_CLASS).forEach((el) => {
      const text = document.createTextNode(el.textContent);
      el.parentNode.replaceChild(text, el);
    });
    document.getElementById(BANNER_ID)?.remove();
  }

  function scan() {
    if (!document.body) return;

    clearPreviousResults();

    // Normalize the DOM after clearing highlights (merge adjacent text nodes)
    document.body.normalize();

    const matchedPhrases = new Set();
    let matchCount = 0;

    const textNodes = getTextNodes(document.body);
    for (const node of textNodes) {
      for (const pattern of PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(node.nodeValue || "")) {
          pattern.lastIndex = 0;
          const matched = pattern.exec(node.nodeValue)?.[0];
          if (matched) {
            matchedPhrases.add(matched);
            matchCount++;
            highlightMatch(node, pattern);
            break; // node was split — move to next node
          }
        }
      }
    }

    latestResults = { matchCount, matchedPhrases };
    showBanner(matchCount, matchedPhrases);
  }

  function showBanner(count, phrases) {
    if (count === 0) return;

    const banner = document.createElement("div");
    banner.id = BANNER_ID;

    const header = document.createElement("div");
    header.className = "clearance-check-ext-banner-header";

    const icon = document.createElement("span");
    icon.className = "clearance-check-ext-banner-icon";
    icon.textContent = "\u26A0";

    const title = document.createElement("span");
    title.textContent = " Restriction flags found: " + count;

    const closeBtn = document.createElement("button");
    closeBtn.className = "clearance-check-ext-close";
    closeBtn.textContent = "\u00d7";
    closeBtn.setAttribute("aria-label", "Dismiss banner");
    closeBtn.addEventListener("click", () => banner.remove());

    header.appendChild(icon);
    header.appendChild(title);
    header.appendChild(closeBtn);
    banner.appendChild(header);

    if (phrases.size > 0) {
      const details = document.createElement("div");
      details.className = "clearance-check-ext-banner-details";
      details.textContent = [...phrases].join("  \u2022  ");
      banner.appendChild(details);
    }

    document.body.prepend(banner);
  }

  // Initial scan
  scan();

  // Re-scan on SPA navigation / dynamic content loads
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      observer.disconnect();
      scan();
      observer.observe(document.body, { childList: true, subtree: true });
    }, 1500);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Respond to popup queries
  const api = typeof browser !== "undefined" ? browser : chrome;
  api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "getResults") {
      sendResponse({
        matchCount: latestResults.matchCount,
        phrases: [...latestResults.matchedPhrases],
      });
    }
  });
})();
