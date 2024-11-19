// Log to confirm the script is running
console.log("Content script is running");

let passwordButtons = new Map(); // Store references to buttons

// Create a MutationObserver to watch for DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    handleDOMChanges();
  });
});

// Function to handle DOM changes
function handleDOMChanges() {
  const passwordFields = document.querySelectorAll('input[type="password"]');
  
  // Remove buttons for fields that no longer exist or are hidden
  passwordButtons.forEach((buttons, field) => {
    if (!document.contains(field) || !isVisible(field)) {
      buttons.toggleButton.remove();
      buttons.copyButton.remove();
      buttons.notificationSpan.remove();
      passwordButtons.delete(field);
    }
  });

  // Add buttons for new visible password fields
  passwordFields.forEach(field => {
    if (!passwordButtons.has(field) && isVisible(field)) {
      initializeFieldButtons(field);
    }
  });
}

// Check if an element is visible
function isVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length) &&
    window.getComputedStyle(element).visibility !== 'hidden' &&
    window.getComputedStyle(element).display !== 'none';
}

function initializeFieldButtons(passwordField) {
  if (!isVisible(passwordField)) return;

  const toggleButton = createToggleButton(passwordField);
  const copyButton = createCopyButton(passwordField);
  const notificationSpan = createNotificationSpan();
  
  // Store references
  passwordButtons.set(passwordField, {
    toggleButton,
    copyButton,
    notificationSpan
  });
  
  // Insert elements
  passwordField.insertAdjacentElement('afterend', toggleButton);
  toggleButton.insertAdjacentElement('afterend', copyButton);
  copyButton.insertAdjacentElement('afterend', notificationSpan);
}

// Initialize observer
function initializeObserver() {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'hidden']
  });
}

// Initial setup
function initializePasswordFeatures() {
  handleDOMChanges();
  initializeObserver();
}

function createToggleButton(passwordField) {
  const toggleButton = document.createElement('button');
  toggleButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
  toggleButton.style.marginLeft = '10px';
  toggleButton.style.border = 'none';
  toggleButton.style.background = 'none';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.padding = '5px';

  // Add event listeners
  toggleButton.addEventListener('mousedown', (event) => {
    event.preventDefault();
    passwordField.setAttribute('type', 'text');
    toggleButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>`;
  });

  toggleButton.addEventListener('mouseup', (event) => {
    event.preventDefault();
    passwordField.setAttribute('type', 'password');
    toggleButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`;
  });

  return toggleButton;
}

function createCopyButton(passwordField) {
  const copyButton = document.createElement('button');
  copyButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`;
  copyButton.style.marginLeft = '10px';
  copyButton.style.border = 'none';
  copyButton.style.background = 'none';
  copyButton.style.cursor = 'pointer';
  copyButton.style.padding = '5px';
  
  // Add type="button" to prevent form submission
  copyButton.setAttribute('type', 'button');
  
  // Add click event listener for copy functionality
  copyButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    navigator.clipboard.writeText(passwordField.value)
      .then(() => {
        const notificationSpan = passwordButtons.get(passwordField).notificationSpan;
        notificationSpan.textContent = 'Copied!';
        notificationSpan.style.opacity = '1';
        
        setTimeout(() => {
          notificationSpan.style.opacity = '0';
        }, 2000);
      })
      .catch((error) => {
        const notificationSpan = passwordButtons.get(passwordField).notificationSpan;
        notificationSpan.textContent = 'Failed to copy';
        notificationSpan.style.color = '#F44336';
        notificationSpan.style.opacity = '1';
        
        setTimeout(() => {
          notificationSpan.style.opacity = '0';
        }, 2000);
      });
  });
  
  return copyButton;
}

function createNotificationSpan() {
  const notificationSpan = document.createElement('span');
  notificationSpan.style.marginLeft = '5px';
  notificationSpan.style.color = '#4CAF50';
  notificationSpan.style.fontSize = '12px';
  notificationSpan.style.opacity = '0';
  notificationSpan.style.transition = 'opacity 0.3s ease';
  return notificationSpan;
}

// Check initial state and initialize if enabled
chrome.storage.sync.get({ enabled: true }, function(data) {
  if (data.enabled) {
    initializePasswordFeatures();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleExtension') {
    if (message.enabled) {
      initializePasswordFeatures();
    } else {
      // Remove all buttons
      passwordButtons.forEach((buttons, field) => {
        buttons.toggleButton.remove();
        buttons.copyButton.remove();
        buttons.notificationSpan.remove();
      });
      passwordButtons.clear();
      observer.disconnect();
    }
  }
});
