document.addEventListener("DOMContentLoaded", function () {
    let searchSection = document.getElementById("searchSection");
    let translationSection = document.getElementById("translationSection");
    let searchForm = document.getElementById("searchForm");
    let backButton = document.getElementById("backButton");
    let historyList = document.getElementById("historyList");
    let clearHistoryBtn = document.getElementById("clearHistory");

    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function searchWord(event) {
        if (event) event.preventDefault();

        let inputWord = document.getElementById("searchInput").value.trim().toLowerCase();
        if (!inputWord) return;

        fetch("data.json")
            .then(response => response.json())
            .then(data => {
                let found = data.find(entry =>
                    entry.english.toLowerCase() === inputWord ||
                    entry.tagalog.toLowerCase() === inputWord ||
                    entry.cebuano.toLowerCase() === inputWord ||
                    entry.hiligaynon.toLowerCase() === inputWord
                );

                // Save the word to history even if it's not found
                saveSearchHistory(inputWord);

                if (found) {
                    updateOutput("outputEnglish", found.english);
                    updateOutput("meaningEnglish", found.meaning_english);
                    updateOutput("exampleEnglish", found.example_english);

                    updateOutput("outputTagalog", found.tagalog);
                    updateOutput("meaningTagalog", found.meaning_tagalog);
                    updateOutput("exampleTagalog", found.example_tagalog);

                    updateOutput("outputCebuano", found.cebuano);
                    updateOutput("meaningCebuano", found.meaning_cebuano);
                    updateOutput("exampleCebuano", found.example_cebuano);

                    updateOutput("outputHiligaynon", found.hiligaynon);
                    updateOutput("meaningHiligaynon", found.meaning_hiligaynon);
                    updateOutput("exampleHiligaynon", found.example_hiligaynon);
                } else {
                    displayNotFound(inputWord);
                }

                // Show results and hide search
                searchSection.style.display = "none";
                translationSection.style.display = "block";

                // Add the class to adjust layout when showing translation
                document.body.classList.add('results-page');
            })
            .catch(error => console.error("Error loading data:", error));
    }

    function updateOutput(id, text) {
        let element = document.getElementById(id).querySelector("span");
        if (element) {
            element.innerText = text;
        }
    }

    function displayNotFound(inputWord) {
        updateOutput("outputEnglish", inputWord);
        updateOutput("meaningEnglish", "Not found");
        updateOutput("exampleEnglish", "Not found");

        updateOutput("outputTagalog", inputWord);
        updateOutput("meaningTagalog", "Not found");
        updateOutput("exampleTagalog", "Not found");

        updateOutput("outputCebuano", inputWord);
        updateOutput("meaningCebuano", "Not found");
        updateOutput("exampleCebuano", "Not found");

        updateOutput("outputHiligaynon", inputWord);
        updateOutput("meaningHiligaynon", "Not found");
        updateOutput("exampleHiligaynon", "Not found");
    }

    function saveSearchHistory(word) {
        let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
        let timestamp = new Date().toLocaleString();
        history.push({ word, timestamp });

        localStorage.setItem("searchHistory", JSON.stringify(history));
        displaySearchHistory();
    }

    function displaySearchHistory() {
        let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
        // Sort the history array so that the latest search is on top
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        historyList.innerHTML = "";

        history.forEach(entry => {
            let listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between";
            listItem.innerHTML = `<span>${entry.word}</span> <small class="text-muted">${entry.timestamp}</small>`;
            historyList.appendChild(listItem);
        });
    }

    function clearSearchHistory() {
        localStorage.removeItem("searchHistory");
        displaySearchHistory();
    }

    function searchFromURL() {
        let word = getQueryParam("word");
        if (word) {
            document.getElementById("searchInput").value = word;
            searchWord();
        }
    }

    // Handle form submission
    searchForm.addEventListener("submit", searchWord);

    // Handle back button
    backButton.addEventListener("click", function () {
        searchSection.style.display = "flex"; // Show search again
        translationSection.style.display = "none"; // Hide results
        document.getElementById("searchInput").value = ""; // Clear input

        // Remove the class when going back to the search page
        document.body.classList.remove('results-page');
    });

    // Handle clear history button
    clearHistoryBtn.addEventListener("click", clearSearchHistory);

    // Auto search if word is in URL
    searchFromURL();

    // Display history on page load
    displaySearchHistory();
});
