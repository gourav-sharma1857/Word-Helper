// Toggle between Light and Dark mode
let isDarkMode = false;

function toggleMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode");
    document.getElementById("mode-toggle").textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
}

// Voice-to-Text functionality
const voiceBtn = document.getElementById("voice-btn");
const spokenWordElement = document.getElementById("spoken-word");

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.onresult = function(event) {
    const spokenWord = event.results[0][0].transcript;
    document.getElementById("word-input").value = spokenWord;
    spokenWordElement.textContent = `You said: ${spokenWord}`;
};

voiceBtn.addEventListener("click", () => {
    recognition.start();
});

// Fetch synonyms, antonyms, rhyming words, and meanings
function getWordDetails() {
    const word = document.getElementById("word-input").value.trim();

    if (!word) {
        alert("Please enter a word!");
        return;
    }

    // Clear previous results
    document.getElementById("synonyms-list").innerHTML = "";
    document.getElementById("antonyms-list").innerHTML = "";
    document.getElementById("rhymes-list").innerHTML = "";
    document.getElementById("meaning").textContent = "";

    // Datamuse API for synonyms, antonyms, and rhymes
    fetch(`https://api.datamuse.com/words?rel_syn=${word}&max=5`)
        .then(response => response.json())
        .then(data => displayResults(data, "synonyms"));

    fetch(`https://api.datamuse.com/words?rel_ant=${word}&max=5`)
        .then(response => response.json())
        .then(data => displayResults(data, "antonyms"));

    fetch(`https://api.datamuse.com/words?rel_rhy=${word}&max=5`)
        .then(response => response.json())
        .then(data => displayResults(data, "rhymes"));

    // Wordnik API for meaning
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(data => {
        if (data && data[0] && data[0].meanings) {
            document.getElementById("meaning").textContent = data[0].meanings[0].definitions[0].definition;
        } else {
            document.getElementById("meaning").textContent = "No meaning found.";
        }
    })
    .catch(error => {
        console.error("Error fetching meaning:", error);
        document.getElementById("meaning").textContent = "Sorry, we couldn't fetch the meaning.";
    });
}

function displayResults(data, type) {
    const list = document.getElementById(`${type}-list`);
    data.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item.word;
        list.appendChild(listItem);
    });
}

function displayMeaning(data) {
    if (data.length > 0) {
        document.getElementById("meaning").textContent = data[0].text;
    } else {
        document.getElementById("meaning").textContent = "No meaning found.";
    }
}
