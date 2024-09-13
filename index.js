// Fetch the list of draft URLs from drafts.json
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

// Fetch the HTML content of a specific draft
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

// Extract the title from the HTML content
function extractTitleFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const titleElement = doc.querySelector('.page-title');
  return titleElement ? titleElement.textContent.trim() : 'Untitled Draft';
}

// Extract the date from the HTML content
function extractDateFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const dateElement = doc.querySelector('.draft-date');
  return dateElement ? dateElement.textContent.trim() : 'No date';
}

// Extract the summary from the HTML content
function extractSummaryFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const contentElement = doc.querySelector('.draft-content');
  if (contentElement) {
    const paragraphs = contentElement.querySelectorAll('p');
    for (let p of paragraphs) {
      if (p.textContent.trim() && !p.classList.contains('draft-date') && !p.classList.contains('page-tags')) {
        return p.textContent.trim().slice(0, 250) + '...';
      }
    }
  }
  return 'No summary available.';
}

// Extract tags from the HTML content
function extractTagsFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const tagElements = doc.querySelectorAll('.page-tags'); // Get all elements with class 'page-tags'
  const tags = [];

  tagElements.forEach(tagElement => {
    const tagText = tagElement.textContent.trim();
    if (tagText) {
      tags.push(tagText);
      console.log(tagText); // Logs each tag
    }
  });

  return tags;
}

// Get all necessary info for a draft
async function getDraftInfo(url) {
  const content = await fetchDraftContent(url);
  if (content) {
    const title = extractTitleFromHTML(content);
    const date = extractDateFromHTML(content);
    const summary = extractSummaryFromHTML(content);
    const tags = extractTagsFromHTML(content); // Extract tags using the existing function
    return { title, summary, date, link: url, tags };
  }
  return null;
}

// Sort drafts by date in descending order
function sortDraftsByDate(drafts) {
  return drafts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // For descending order (most recent first)
  });
}

// Render all drafts into the page
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
const tagColors = ['red', 'orange', 'yellow', 'blue', 'purple', 'aqua'];
    // Create tags HTMLconst tagColors = ['green', 'yellow', 'blue', 'purple', 'aqua', 'orange'];
   const tagsHTML = draftInfo.tags.map((tag, index) => {
      const colorName = tagColors[index % tagColors.length];
      return `<span class="page-tags" style="background-color: var(--${colorName});">${tag}</span>`;
    }).join(' ');

    article.innerHTML = `
      <div class="title-date-container">
        <h2 class="page-title"><a href="${draftInfo.link}">${draftInfo.title}</a></h2>
      <div class="tag-container">
        ${tagsHTML}
        <p2 class="draft-date">${draftInfo.date}</p2>
      </div>
      </div>
      <p>${draftInfo.summary}</p>
    `;
    draftsContainer.appendChild(article);
  }

  // Optional: Log the first link element for debugging
  const linkElement = document.querySelector('.page-title a');
  if (linkElement) {
    console.log(linkElement); // Logs the <a> element
    console.log(linkElement.href); // Logs the href value
    console.log(linkElement.textContent); // Logs the text content of the link
  }
}

// Initialize rendering on DOM content loaded
document.addEventListener('DOMContentLoaded', renderDrafts);
const hamburger = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    console.log("hello"); // Logs the text content of the link
});
