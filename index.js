
async function getPostCount() {
    try {
        const response = await fetch('./posts.json');
        const data = await response.json();
        return data.posts.length;
    } catch (error) {
        console.error('Error fetching drafts list:', error);
        return 0;
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    count = await getPostCount();

});

