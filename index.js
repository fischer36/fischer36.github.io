async function getPosts() {
    console.log("Fetching post count...");
    try {
        const response = await fetch('./posts/posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.posts; // Returns the array of post paths
    } catch (error) {
        console.error('Error fetching drafts list:', error);
        return []; // Return an empty array if an error occurs
    }
}

async function getFileHtml(path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc; // Return the parsed HTML document
    } catch (error) {
        console.error(`Error fetching draft content from ${path}:`, error);
        return null; // Return null if an error occurs
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const posts = await getPosts(); // Fetch the posts dynamically
    console.log(`Post count: ${posts.length}`); // Informative log for debugging

    const main = document.querySelector('.mainxd'); // Select the main container
    if (main) {
        console.log('Found main element');
        for (const postPath of posts) {
            const doc = await getFileHtml(postPath);  // Load the HTML content of each post

            if (doc) {
                // Extract content from the loaded post
                const titleElement = doc.querySelector('.post h1');
                const dateElement = doc.querySelector('.date');
                const bodyElement = doc.querySelector('.post p:not(.date)');
                const tagsElement = doc.querySelector('.tags');  // Select the tags list

                const titleText = titleElement ? titleElement.textContent : 'Untitled';
                const dateText = dateElement ? dateElement.textContent : 'No Date';
                const bodyText = bodyElement ? bodyElement.textContent.slice(0, 160) + '...' : 'No content available';

                // Create the post element structure
                const postElement = document.createElement('section');
                postElement.className = 'list-item';

                const title = document.createElement('h1');
                title.className = 'title';
                const titleA = document.createElement('a');
                titleA.href = postPath;
                titleA.textContent = titleText;
                title.appendChild(titleA);
                postElement.appendChild(title); // Append title to postElement

                // Create and append the date element
                const date = document.createElement('time');
                date.className = 'date';
                date.textContent = dateText;
                postElement.appendChild(date); // Append date to postElement
const br = document.createElement('br');
postElement.appendChild(br);
                // Create and append the body text element
                const body = document.createElement('a');
              body.className = 'readmore';
              body.textContent = 'Read more';
              body.href = postPath;
                postElement.appendChild(body); // Append body to postElement


                // Append the entire postElement to the main container
                main.appendChild(postElement);
            }
        }
    }
});
