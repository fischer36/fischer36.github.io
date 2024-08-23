async function fetchDraftsList() {
  try {
    const response = await fetch('drafts.json');
    const data = await response.json();
    return data.drafts;
  } catch (error) {
    console.error('Error fetching drafts list:', error);
    return [];
  }
}

async function fetchDraftContent(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error fetching draft content from ${url}:`, error);
    return null;
  }
}

function extractTitleFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const titleElement = doc.querySelector('.page-title');
  return titleElement ? titleElement.textContent.trim() : 'Untitled Draft';
}

function extractDateFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const dateElement = doc.querySelector('.draft-date');
  return dateElement ? dateElement.textContent.trim() : 'No date';
}

function extractSummaryFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const contentElement = doc.querySelector('.draft-content');
  if (contentElement) {
    const paragraphs = contentElement.querySelectorAll('p');
    for (let p of paragraphs) {
      if (p.textContent.trim() && !p.classList.contains('draft-date')) {
        return p.textContent.trim().slice(0, 150) + '...';
      }
    }
  }
  return 'No summary available.';
}

async function getDraftInfo(url) {
  const content = await fetchDraftContent(url);
  if (content) {
    const title = extractTitleFromHTML(content);
    const date = extractDateFromHTML(content);
    const summary = extractSummaryFromHTML(content);
    return { title, summary, date, link: url };
  }
  return null;
}

function sortDraftsByDate(drafts) {
  return drafts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // For descending order (most recent first)
  });
}

async function renderDrafts() {
  const draftsContainer = document.getElementById('drafts-container');
  draftsContainer.innerHTML = ''; 
  const draftUrls = await fetchDraftsList();
  
  // Fetch all draft info
  const draftsInfo = await Promise.all(draftUrls.map(getDraftInfo));
  
  // Filter out null values and sort
  const sortedDrafts = sortDraftsByDate(draftsInfo.filter(Boolean));

  for (const draftInfo of sortedDrafts) {
    const article = document.createElement('article');
    article.className = 'draft-entry';
    article.innerHTML = `
      <div class="title-date-container">
        <h2 class="page-title"><a href="${draftInfo.link}">${draftInfo.title}</a></h2>
        <p class="draft-date">${draftInfo.date}</p>
      </div>
      <p>${draftInfo.summary}</p>
    `;
    draftsContainer.appendChild(article);
  }
}

document.addEventListener('DOMContentLoaded', renderDrafts);
