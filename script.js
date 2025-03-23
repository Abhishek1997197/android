document.addEventListener("DOMContentLoaded", function () {
    const toggleScript = document.getElementById("toggleScript");
    const statusText = document.getElementById("status");

    toggleScript.addEventListener("change", function () {
        if (toggleScript.checked) {
            statusText.textContent = "Turn On";
            enableBlocker();
        } else {
            statusText.textContent = "Turn Off";
            disableBlocker();
        }
    });

    function enableBlocker() {
        document.body.addEventListener("click", handleClicks, true);
        document.body.addEventListener("DOMNodeInserted", handlePopups, true);
        window.open = function () { return null; }; // Blocks window.open()
        document.addEventListener("keydown", preventShortcuts, true);
        interceptNewTabs();
    }

    function disableBlocker() {
        document.body.removeEventListener("click", handleClicks, true);
        document.body.removeEventListener("DOMNodeInserted", handlePopups, true);
        document.removeEventListener("keydown", preventShortcuts, true);
    }

    function handleClicks(event) {
        const blockedWords = ["Genre", "Movies", "Play Button", "Pause Button", "HD Movies", "MP4 Movies", "Cast", "Director", "TV Shows", "TV Series", "Genres", "10000 Movies", "news"];
        const targetText = event.target.innerText || "";
        
        if (blockedWords.some(word => targetText.includes(word))) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (event.target.tagName === "A" && event.target.href) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function handlePopups() {
        const popups = document.querySelectorAll("[class*='popup'], [id*='popup'], [class*='ad'], [id*='ad']");
        popups.forEach(popup => popup.remove());
    }

    function preventShortcuts(event) {
        if (event.ctrlKey && (event.key === 't' || event.key === 'T' || event.key === 'n' || event.key === 'N')) {
            event.preventDefault();
        }
    }

    function interceptNewTabs() {
        const originalWindowOpen = window.open;
        window.open = function (url, name, specs) {
            console.warn("Blocked new tab attempt: ", url);
            return null;
        };

        document.addEventListener("click", function (event) {
            if (event.target.tagName === "A" && event.target.target === "_blank") {
                event.preventDefault();
                console.warn("Blocked a new tab from opening.");
            }
        }, true);
    }

    window.addEventListener("beforeunload", function () {
        disableBlocker();
    });
});