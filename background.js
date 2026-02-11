// Listen for tab updates (when URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process when URL actually changes and page is complete
  if (changeInfo.status === 'complete' && tab.url) {
    checkAndUpdateBookmark(tab.url);
  }
});

// Check if this URL should update a bookmark
async function checkAndUpdateBookmark(url) {
  try {
    // Get tracked paths from storage
    const result = await chrome.storage.sync.get(['trackedPaths']);
    const trackedEntries = result.trackedPaths || [];

    if (trackedEntries.length === 0) {
      return; // No paths to track
    }

    const urlObj = new URL(url);
    const currentHost = normalizeHost(urlObj.hostname);
    const currentPath = normalizePath(urlObj.pathname);

    // Find the most specific tracked entry that matches this URL
    const matchedEntry = findBestMatchingEntry(trackedEntries, currentHost, currentPath);

    if (!matchedEntry) {
      return; // This path is not being tracked
    }

    // Find all bookmarks
    const bookmarks = await chrome.bookmarks.getTree();

    // Search for a bookmark that matches this path
    const matchingBookmark = findBookmarkByPath(bookmarks, matchedEntry);

    if (matchingBookmark) {
      // Update the bookmark with the new URL
      await chrome.bookmarks.update(matchingBookmark.id, {
        url: url
      });
      console.log(`Updated bookmark "${matchingBookmark.title}" to: ${url}`);
    }
  } catch (error) {
    console.error('Error updating bookmark:', error);
  }
}

function normalizeHost(hostname) {
  return hostname.replace(/^www\./, '').toLowerCase();
}

function normalizePath(pathname) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed.length === 0 ? '/' : trimmed.toLowerCase();
}

function normalizeEntry(entry) {
  const withScheme = entry.match(/^https?:\/\//i) ? entry : `https://${entry}`;
  const url = new URL(withScheme);
  return {
    raw: entry,
    host: normalizeHost(url.hostname),
    path: normalizePath(url.pathname)
  };
}

function matchesEntry(entry, currentHost, currentPath) {
  if (currentHost !== entry.host) {
    return false;
  }
  if (entry.path === '/') {
    return true;
  }
  return currentPath === entry.path || currentPath.startsWith(entry.path + '/');
}

function findBestMatchingEntry(entries, currentHost, currentPath) {
  const normalized = [];
  for (const entry of entries) {
    try {
      const normalizedEntry = normalizeEntry(entry);
      if (matchesEntry(normalizedEntry, currentHost, currentPath)) {
        normalized.push(normalizedEntry);
      }
    } catch (e) {
      // Skip invalid entry
    }
  }

  if (normalized.length === 0) {
    return null;
  }

  normalized.sort((a, b) => b.path.length - a.path.length);
  return normalized[0];
}

// Recursively search bookmarks for one matching the path
function findBookmarkByPath(bookmarkNodes, targetEntry) {
  let bestMatch = null;
  let bestPathLength = -1;

  for (let node of bookmarkNodes) {
    if (node.url) {
      try {
        const bookmarkUrl = new URL(node.url);
        const bookmarkHost = normalizeHost(bookmarkUrl.hostname);
        const bookmarkPath = normalizePath(bookmarkUrl.pathname);

        if (bookmarkHost === targetEntry.host) {
          const matchesPath =
            targetEntry.path === '/' ||
            bookmarkPath === targetEntry.path ||
            bookmarkPath.startsWith(targetEntry.path + '/');

          if (matchesPath && targetEntry.path.length > bestPathLength) {
            bestMatch = node;
            bestPathLength = targetEntry.path.length;
          }
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }

    if (node.children) {
      const found = findBookmarkByPath(node.children, targetEntry);
      if (found && targetEntry.path.length > bestPathLength) {
        bestMatch = found;
        bestPathLength = targetEntry.path.length;
      }
    }
  }

  return bestMatch;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTrackedDomains') {
    chrome.storage.sync.get(['trackedPaths'], (result) => {
      sendResponse({ domains: result.trackedPaths || [] });
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'saveTrackedDomains') {
    chrome.storage.sync.set({ trackedPaths: request.domains }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
