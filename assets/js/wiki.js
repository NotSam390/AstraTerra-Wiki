async function loadWikiPage() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const contentEl = document.getElementById('article-content');
    const tocEl = document.getElementById('article-toc');

    if (!page) {
        contentEl.innerHTML = '<h1>No article selected</h1><p>Choose an entry from the navigation bar.</p>';
        return;
    }

    try {
        const response = await fetch(`pages/${page}.md`);
        if (!response.ok) throw new Error('Page not found');

        const markdown = await response.text();

        // Build breadcrumb eyebrow from folder path (e.g., "ASTRATERRA WIKI / PLANETS")
        const category = page.includes('/') ? page.split('/')[0].toUpperCase() : 'ARCHIVE';
        const eyebrowHTML = `<p class="eyebrow">ASTRATERRA WIKI / ${category}</p>`;

        // Render Markdown inside your .content container
        contentEl.innerHTML = eyebrowHTML + marked.parse(markdown);

        // Update browser tab title using the article's H1
        const h1 = contentEl.querySelector('h1');
        if (h1) {
            document.title = `${h1.textContent} | AstraTerra Wiki`;
        }

        // Automatically generate sidebar links from every H2 in the article
        const headings = contentEl.querySelectorAll('h2');
        headings.forEach((heading, index) => {
            const id = heading.id || `section-${index}`;
            heading.id = id;

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            tocEl.appendChild(link);
        });

    } catch (err) {
        contentEl.innerHTML = `
            <p class="eyebrow">404 ERROR</p>
            <h1>Entry Not Found</h1>
            <p class="intro">The archive entry for <strong>${page}</strong> has not been written yet.</p>
        `;
    }
}

loadWikiPage();