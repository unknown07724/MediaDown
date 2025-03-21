document.addEventListener("DOMContentLoaded", () => {
    loadWikiPage();
    window.addEventListener("popstate", loadWikiPage);
});

function loadWikiPage() {
    const params = new URLSearchParams(window.location.search);
    const wiki = params.get("wiki") || "examplewiki";
    const page = params.get("page") || "Home";

    document.getElementById("wiki-title").innerText = decodeURIComponent(wiki);

    fetch(`wikis/${wiki}/${page}.md`)
        .then(response => response.ok ? response.text() : "Page not found.")
        .then(markdown => {
            document.getElementById("content").innerHTML = marked.parse(markdown);
            convertWikiLinks(wiki);
        })
        .catch(() => document.getElementById("content").innerHTML = "Error loading page.");
}

function convertWikiLinks(wiki) {
    document.querySelectorAll("#content a").forEach(link => {
        if (link.innerText.startsWith("[[") && link.innerText.endsWith("]]")) {
            let pageName = link.innerText.slice(2, -2).trim();
            link.href = `?wiki=${wiki}&page=${encodeURIComponent(pageName)}`;
            link.addEventListener("click", event => {
                event.preventDefault();
                history.pushState(null, "", link.href);
                loadWikiPage();
            });
        }
    });
}
 // Function to fetch and load the correct wiki content based on the URL parameters
        document.addEventListener("DOMContentLoaded", () => {
            loadWikiPage();
            window.addEventListener("popstate", loadWikiPage);
        });

      

        // Function to convert Wiki links within the content

        // Function to convert infoboxes in the Markdown content to HTML
        function convertInfoboxes(htmlContent) {
            // Regular expression to find Infobox blocks
            const infoboxRegex = /::: Infobox([\s\S]*?):::/g;
            let match;
            while ((match = infoboxRegex.exec(htmlContent)) !== null) {
                const infoboxContent = match[1].trim();
                const infoboxHtml = generateInfoboxHtml(infoboxContent);
                htmlContent = htmlContent.replace(match[0], infoboxHtml);
            }
            return htmlContent;
        }

        // Function to generate HTML for an infobox
        function generateInfoboxHtml(content) {
            const rows = content.split('\n').filter(line => line.trim().length > 0);
            let infoboxHtml = '<div class="infobox"><div class="infobox-title">Infobox</div><div class="infobox-content">';
            
            rows.forEach(row => {
                const parts = row.split('=').map(part => part.trim());
                if (parts.length === 2) {
                    infoboxHtml += `<p><strong>${parts[0]}:</strong> ${parts[1]}</p>`;
                }
            });

            infoboxHtml += '</div></div>';
            return infoboxHtml;
        }
