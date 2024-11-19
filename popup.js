document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('enableToggle');
  
  // Load current state
  chrome.storage.sync.get({ enabled: true }, function(data) {
    toggle.checked = data.enabled;
  });
  
  // Save state changes
  toggle.addEventListener('change', function() {
    chrome.storage.sync.set({ enabled: toggle.checked }, function() {
      // Send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'toggleExtension',
            enabled: toggle.checked 
          });
        }
      });
    });
  });
}); 