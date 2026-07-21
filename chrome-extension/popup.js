let currentJob = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  const result = await chrome.storage.sync.get(['trackrai_token', 'trackrai_api_url']);
  if (result.trackrai_token) {
    document.getElementById('token-input').value = result.trackrai_token;
  }
  if (result.trackrai_api_url) {
    document.getElementById('api-url-input').value = result.trackrai_api_url;
  }

  // View toggles
  document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('settings-view').classList.remove('hidden');
  });

  document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('settings-view').classList.add('hidden');
    document.getElementById('main-view').classList.remove('hidden');
  });

  // Save settings
  document.getElementById('save-settings-btn').addEventListener('click', async () => {
    const token = document.getElementById('token-input').value.trim();
    const apiUrl = document.getElementById('api-url-input').value.trim();
    await chrome.storage.sync.set({ 
      trackrai_token: token,
      trackrai_api_url: apiUrl || 'https://trackrai-api.onrender.com'
    });
    
    const btn = document.getElementById('save-settings-btn');
    btn.textContent = 'Saved!';
    setTimeout(() => { btn.textContent = 'Save Settings'; }, 2000);
  });

  // Execute content script to scrape the page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url.includes('linkedin.com/jobs') || tab.url.includes('indeed.com/viewjob')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        // After script is injected, send a message to it
        chrome.tabs.sendMessage(tab.id, { action: "scrape_job" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }
          if (response && response.success) {
            currentJob = response.data;
            document.getElementById('job-title').textContent = currentJob.role;
            document.getElementById('job-company').textContent = currentJob.company;
            document.getElementById('save-btn').disabled = false;
          }
        });
      });
    } else {
      document.getElementById('job-title').textContent = 'Not a job page';
      document.getElementById('job-company').textContent = 'Please navigate to a LinkedIn or Indeed job posting.';
    }
  });

  // Save Job Button
  document.getElementById('save-btn').addEventListener('click', async () => {
    if (!currentJob) return;
    
    const btn = document.getElementById('save-btn');
    const msg = document.getElementById('status-msg');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    const settings = await chrome.storage.sync.get(['trackrai_token', 'trackrai_api_url']);
    if (!settings.trackrai_token) {
      msg.textContent = 'Error: Please set your Extension Token in Settings.';
      msg.style.color = '#f87171';
      btn.textContent = 'Save to TrackrAI';
      btn.disabled = false;
      return;
    }

    const apiUrl = settings.trackrai_api_url || 'https://trackrai-api.onrender.com';
    
    try {
      const response = await fetch(`${apiUrl}/applications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.trackrai_token}`
        },
        body: JSON.stringify({
          company: currentJob.company,
          role: currentJob.role,
          link: currentJob.link,
          status: 'Applied'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save. Check token.');
      }

      btn.textContent = 'Saved!';
      btn.style.background = 'linear-gradient(to right, #10b981, #059669)';
      msg.textContent = 'Successfully saved to TrackrAI!';
      msg.style.color = '#34d399';
    } catch (err) {
      console.error(err);
      msg.textContent = 'Error: Could not save job.';
      msg.style.color = '#f87171';
      btn.textContent = 'Try Again';
      btn.disabled = false;
    }
  });
});
