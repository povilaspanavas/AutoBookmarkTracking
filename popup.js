// Load saved paths when popup opens
document.addEventListener('DOMContentLoaded', () => {
  loadPaths();
  
  // Save button click handler
  document.getElementById('saveBtn').addEventListener('click', savePaths);
});

// Load paths from storage
function loadPaths() {
  chrome.storage.sync.get(['trackedPaths'], (result) => {
    if (chrome.runtime.lastError) {
      showStatus('Error loading paths', 'error');
      return;
    }
    const paths = result.trackedPaths || [];
    document.getElementById('domains').value = paths.join('\n');
  });
}

// Save paths to storage
function savePaths() {
  const textarea = document.getElementById('domains');
  const pathsText = textarea.value;
  
  // Parse entries (split by newline, trim, remove empty lines)
  const paths = pathsText
    .split('\n')
    .map(d => normalizeEntry(d))
    .filter(d => d.length > 0)
    .filter(d => isValidEntry(d));
  
  if (paths.length === 0 && pathsText.trim().length > 0) {
    showStatus('No valid paths found', 'error');
    return;
  }

  // Save to storage
  chrome.storage.sync.set({ trackedPaths: paths }, () => {
    if (chrome.runtime.lastError) {
      showStatus('Error saving paths', 'error');
      return;
    }
    showStatus('Paths saved successfully!', 'success');

    // Update textarea with cleaned paths
    textarea.value = paths.join('\n');
  });
}

function normalizeEntry(entry) {
  let cleaned = entry.trim();
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^www\./i, '');
  cleaned = cleaned.split('#')[0].split('?')[0];
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

// Basic host + optional path validation
function isValidEntry(entry) {
  const entryRegex = /^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return entryRegex.test(entry);
}

// Show status message
function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  // Hide after 3 seconds
  setTimeout(() => {
    statusDiv.className = 'status';
  }, 3000);
}
