chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape_job") {
    let company = "Unknown Company";
    let role = "Unknown Role";
    let link = window.location.href;

    // Remove query params from link for cleanliness if it's linkedin
    if (link.includes('linkedin.com')) {
      link = link.split('?')[0];
    }

    try {
      if (window.location.hostname.includes("linkedin.com")) {
        // LinkedIn job posting page
        const titleElement = document.querySelector('.job-details-jobs-unified-top-card__job-title h1') 
                          || document.querySelector('.top-card-layout__title');
        
        const companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name a') 
                            || document.querySelector('.topcard__org-name-link');

        if (titleElement) role = titleElement.innerText.trim();
        if (companyElement) company = companyElement.innerText.trim();
        
      } else if (window.location.hostname.includes("indeed.com")) {
        // Indeed job posting page
        const titleElement = document.querySelector('h1[data-testid="jobsearch-JobInfoHeader-title"]') 
                          || document.querySelector('.jobsearch-JobInfoHeader-title');
                          
        const companyElement = document.querySelector('div[data-testid="inlineHeader-companyName"]') 
                            || document.querySelector('.jobsearch-InlineCompanyRating-companyHeader');

        if (titleElement) role = titleElement.innerText.trim();
        if (companyElement) company = companyElement.innerText.trim();
      }
    } catch (err) {
      console.error("TrackrAI Scraper Error:", err);
    }

    sendResponse({ 
      success: true, 
      data: { company, role, link } 
    });
  }
  return true;
});
