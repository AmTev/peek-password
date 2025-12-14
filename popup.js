document.addEventListener('DOMContentLoaded', async function() {
  const globalToggle = document.getElementById('enableToggle');
  const siteToggle = document.getElementById('siteToggle');
  const sitesList = document.getElementById('sitesList');
  const removeAllBtn = document.getElementById('removeAll');
  
  // Get current tab URL
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  const hostname = new URL(tab.url).hostname;
  
  // Load current state and update UI
  function loadAndDisplaySites() {
    chrome.storage.sync.get({ 
      enabled: true,
      restrictedSites: []
    }, function(data) {
      globalToggle.checked = data.enabled;
      siteToggle.checked = !data.restrictedSites.includes(hostname);
      siteToggle.disabled = !data.enabled;
      
      // Update header with count
      const sitesCount = data.restrictedSites.length;
      document.querySelector('.whitelisted-sites h3').textContent =
        `Disabled Sites (${sitesCount})`;
      
      // Show/hide remove all button
      removeAllBtn.classList.toggle('hidden', sitesCount === 0);
      
      // Display whitelisted sites
      sitesList.innerHTML = '';
      const allSites = new Set(data.restrictedSites);
      
      if (allSites.size === 0) {
        sitesList.innerHTML = '<div class="site-item">No sites disabled</div>';
        return;
      }
      
      allSites.forEach(site => {
        const siteDiv = document.createElement('div');
        siteDiv.className = 'site-item';
        siteDiv.innerHTML = `
          <span>${site}</span>
          <button class="remove-site">Remove</button>
        `;
        
        siteDiv.querySelector('.remove-site').addEventListener('click', () => {
          if (confirm(`Are you sure you want to remove ${site} from the disabled list?`)) {
            chrome.storage.sync.get({ restrictedSites: [] }, (currentData) => {
              const updatedSites = currentData.restrictedSites.filter(s => s !== site);
              chrome.storage.sync.set({ restrictedSites: updatedSites }, () => {
                loadAndDisplaySites();
                if (site === hostname) {
                  siteToggle.checked = true;
                  chrome.tabs.sendMessage(tab.id, {
                    action: 'toggleExtension',
                    enabled: globalToggle.checked && true
                  });
                }
              });
            });
          }
        });
        
        sitesList.appendChild(siteDiv);
      });
    });
  }
  
  // Initial load
  loadAndDisplaySites();
  
  // Global toggle handler
  globalToggle.addEventListener('change', function() {
    const isEnabled = globalToggle.checked;
    siteToggle.disabled = !isEnabled;
    
    chrome.storage.sync.set({ enabled: isEnabled }, function() {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'toggleExtension',
        enabled: isEnabled && siteToggle.checked
      });
    });
  });

  // Site toggle handler
  siteToggle.addEventListener('change', function() {
    chrome.storage.sync.get({ restrictedSites: [] }, function(data) {
      let sites = data.restrictedSites;
      if (siteToggle.checked) {
        sites = sites.filter(site => site !== hostname);
      } else {
        if (!sites.includes(hostname)) {
          sites.push(hostname);
        }
      }
      
      chrome.storage.sync.set({ restrictedSites: sites }, function() {
        loadAndDisplaySites();
        chrome.tabs.sendMessage(tab.id, { 
          action: 'toggleExtension',
          enabled: globalToggle.checked && siteToggle.checked 
        });
      });
    });
  });

  // Add Remove All handler
  removeAllBtn.addEventListener('click', function() {
    chrome.storage.sync.get({ restrictedSites: [] }, function(data) {
      if (data.restrictedSites.length === 0) return;
      
      if (confirm('Are you sure you want to remove all disabled sites?')) {
        chrome.storage.sync.set({ restrictedSites: [] }, () => {
          loadAndDisplaySites();
          if (data.restrictedSites.includes(hostname)) {
            siteToggle.checked = true;
            chrome.tabs.sendMessage(tab.id, { 
              action: 'toggleExtension',
              enabled: globalToggle.checked && true
            });
          }
        });
      }
    });
  });
}); 