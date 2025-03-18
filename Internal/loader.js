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
