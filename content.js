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

    // Security clearance
    /\bsecret\s+clearance\b/gi,
    /\btop\s+secret\b/gi,
    /\bTS[\s/]SCI\b/gi,
    /\bsecurity\s+clearance\b/gi,
    /\bactive\s+clearance\b/gi,
    /\bclearance\s+required\b/gi,
    /\bmust\s+(?:hold|have|possess|maintain|obtain)\s+(?:a\s+)?(?:active\s+)?(?:security\s+)?clearance\b/gi,
    /\beligibl[ey]\s+(?:for|to\s+obtain)\s+(?:a\s+)?(?:security\s+)?clearance\b/gi,
    /\bDoD\s+clearance\b/gi,
    /\bSCI\s+access\b/gi,
    /\bpublic\s+trust\b/gi,
    /\bsensitive\s+compartmented\s+information\b/gi,
    /\bconfidential\s+clearance\b/gi,

    // Government / ITAR / EAR
    /\bITAR\b/g,
    /\bEAR\b/g,
    /\bexport[\s-]?control(?:led)?\b/gi,
    /\bgovernment\s+contract\b/gi,
    /\bfederal\s+contract\b/gi,
    /\bNational\s+security\b/gi,
  ];

  const BANNER_ID = "clearance-check-banner";
  const HIGHLIGHT_CLASS = "clearance-check-highlight";

  // Walk all text nodes in the body
  function getTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentElement?.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
          return NodeFilter.FILTER_REJECT;
        }
        if (node.parentElement?.closest(`#${BANNER_ID}`)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function highlightMatches(textNode, pattern) {
    const text = textNode.nodeValue;
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (!match) return false;

    const span = document.createElement("mark");
    span.className = HIGHLIGHT_CLASS;
    span.title = "Potential restriction flag";

    const before = text.substring(0, match.index);
    const matched = text.substring(match.index, match.index + match[0].length);
    const after = text.substring(match.index + match[0].length);

    const parent = textNode.parentNode;
    if (before) parent.insertBefore(document.createTextNode(before), textNode);
    span.textContent = matched;
    parent.insertBefore(span, textNode);
    if (after) parent.insertBefore(document.createTextNode(after), textNode);
    parent.removeChild(textNode);

    return true;
  }

  function scan() {
    // Remove previous results
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
      const text = document.createTextNode(el.textContent);
      el.parentNode.replaceChild(text, el);
    });
    document.getElementById(BANNER_ID)?.remove();

    const matchedPhrases = new Set();
    let matchCount = 0;

    const textNodes = getTextNodes(document.body);
    for (const node of textNodes) {
      for (const pattern of PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(node.nodeValue || "")) {
          // Reset and do the highlight (which splits the node, so break inner loop)
          pattern.lastIndex = 0;
          const matched = pattern.exec(node.nodeValue)?.[0];
          if (matched) {
            matchedPhrases.add(matched);
            matchCount++;
            highlightMatches(node, pattern);
            break; // node was split, move to next
          }
        }
      }
    }

    showBanner(matchCount, matchedPhrases);
    return { matchCount, matchedPhrases };
  }

  function showBanner(count, phrases) {
    if (count === 0) return;

    const banner = document.createElement("div");
    banner.id = BANNER_ID;

    const header = document.createElement("div");
    header.className = "clearance-check-banner-header";

    const title = document.createElement("span");
    title.textContent = `Restriction flags found: ${count}`;

    const closeBtn = document.createElement("button");
    closeBtn.className = "clearance-check-close";
    closeBtn.textContent = "\u00d7";
    closeBtn.addEventListener("click", () => banner.remove());

    header.appendChild(title);
    header.appendChild(closeBtn);
    banner.appendChild(header);

    if (phrases.size > 0) {
      const details = document.createElement("div");
      details.className = "clearance-check-banner-details";
      details.textContent = [...phrases].join(", ");
      banner.appendChild(details);
    }

    document.body.appendChild(banner);
  }

  // Run the scan
  const results = scan();

  // Re-scan when page content changes (SPAs like Workday)
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(scan, 1500);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Listen for popup messages
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "getResults") {
      sendResponse({
        matchCount: results.matchCount,
        phrases: [...results.matchedPhrases],
      });
    }
  });
})();
