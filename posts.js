async function getPostList() {
    try {
        const response = await fetch('./posts.json');
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error('Error fetching drafts list:', error);
        return [];
    }
}

async function getFileHtml(path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    } catch (error) {
        console.error(`Error fetching draft content from ${path}:`, error);
        return null;
    }
}

async function renderPosts() {
    const posts = await getPostList();
    const postsGrid = document.querySelector('.post-grid');

    if (postsGrid) {
        postsGrid.innerHTML = ''; // Clear existing content

        for (const postPath of posts) {
            const postGridEntry = document.createElement('div');
            postGridEntry.className = 'post-grid-entry';

            const doc = await getFileHtml(postPath);  // Fetch HTML for each post

            if (doc) {
                // Select title, date, body, and tags elements from the fetched document
                const titleElement = doc.querySelector('.post h1');
                const dateElement = doc.querySelector('.date');
                const bodyElement = doc.querySelector('.post p:not(.date)');
                const tagsElement = doc.querySelector('.tags');  // Select the tags list

                // Extract text content with safe fallback
                const titleText = titleElement ? titleElement.textContent : 'Untitled';
                const dateText = dateElement ? dateElement.textContent : 'No Date';
                const bodyText = bodyElement ? bodyElement.textContent.slice(0, 130) + '...' : 'No content available';

                // Extract tags if they exist
                const tags = tagsElement ? Array.from(tagsElement.querySelectorAll('li')).map(tag => tag.textContent) : ["fuck off"];

                // Create elements to display post information
                const postTitle = document.createElement('h1');

                const postLink = document.createElement('a');
                postLink.href = postPath;
                postLink.textContent = titleText;

                postLink.target = '_blank';

                const dateParagraph = document.createElement('p');
                dateParagraph.textContent = dateText;

                const summary = document.createElement('p');
                summary.textContent = bodyText;

                const tagsList = document.createElement('ul');  // Create a new UL element for displaying tags
                tagsList.className = 'tags';
                tags.forEach(tag => {
                    const tagItem = document.createElement('li');
                    tagItem.textContent = tag;
                    tagsList.appendChild(tagItem);
                });

                // Append elements to post entry and post grid

                postTitle.appendChild(postLink);

                postGridEntry.appendChild(postTitle);
                postGridEntry.appendChild(dateParagraph);
                postGridEntry.appendChild(tagsList);  // Append the tags list

                postGridEntry.appendChild(summary);

                postsGrid.appendChild(postGridEntry);
            } else {
                console.error(`Failed to fetch HTML for ${postPath}`);
            }
        }
    } else {
        console.error('Posts grid container not found');
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await renderPosts();
});

