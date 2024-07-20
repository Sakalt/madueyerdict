let dictionaryData;
let currentPage = 1;
const itemsPerPage = 20;
let isFontToggled = false;

window.onload = function() {
    loadDictionaryData();
};

function loadDictionaryData() {
    fetch('マジェール語辞書.json')
        .then(response => response.json())
        .then(data => {
            dictionaryData = data.words;
            renderWordList();
            renderPagination();
        });
}

function renderWordList() {
    const wordListElement = document.getElementById('word-list');
    wordListElement.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, dictionaryData.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const word = dictionaryData[i];
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.textContent = word.entry.form;
        wordItem.onclick = () => showWordDetails(word);
        wordListElement.appendChild(wordItem);
    }
}

function renderPagination() {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    const totalPages = Math.ceil(dictionaryData.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.className = 'page-link';
        pageLink.textContent = i;
        pageLink.onclick = () => {
            currentPage = i;
            renderWordList();
            renderPagination();
        };
        paginationElement.appendChild(pageLink);
    }
}

function showWordDetails(word) {
    const wordDetailsElement = document.getElementById('word-details');
    wordDetailsElement.innerHTML = `
        <h2>${word.entry.form}</h2>
        <p>ID: ${word.entry.id}</p>
        <h3>Translations:</h3>
        <ul>
            ${word.translations.map(t => `<li>${t.title}: ${t.forms.join(', ')}</li>`).join('')}
        </ul>
        <h3>Contents:</h3>
        <ul>
            ${word.contents.map(c => `<li>${c.title}: ${c.text}</li>`).join('')}
        </ul>
        <h3>Pronunciation:</h3>
        <p>${generatePronunciation(word.entry.form)}</p>
    `;
}

function search() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredWords = dictionaryData.filter(word => word.entry.form.toLowerCase().includes(searchInput));
    renderFilteredWords(filteredWords);
}

function renderFilteredWords(filteredWords) {
    const wordListElement = document.getElementById('word-list');
    wordListElement.innerHTML = '';

    for (let word of filteredWords) {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.textContent = word.entry.form;
        wordItem.onclick = () => showWordDetails(word);
        wordListElement.appendChild(wordItem);
    }
}

function toggleFont() {
    const wordListElement = document.getElementById('word-list');
    if (isFontToggled) {
        wordListElement.style.fontFamily = 'Arial, sans-serif';
    } else {
        wordListElement.style.fontFamily = 'Madueyer';
    }
    isFontToggled = !isFontToggled;
}

function generatePronunciation(word) {
    const pronunciationRules = [
        { from: "ts", to: "t͡s" },
        { from: "q", to: "q" },
        { from: "e", to: "e" },
        { from: "ei", to: "ɜ" },
        { from: "ae", to: "ə" },
        { from: "j", to: "ʒ" },
        { from: "kh", to: "χ" },
        { from: "x", to: "ɕ" },
        { from: "ny", to: "ɳ" },
        { from: "ng", to: "ŋ" },
        { from: "my", to: "ɱ" },
        { from: "hh", to: "ʡ͡ħ" },
        { from: "qh", to: "q͡χ" },
        { from: "'", to: "ʔ" },
        { from: "k", to: "k" },
        { from: "c", to: "c" },
        { from: "d", to: "d" },
        { from: "g", to: "g" },
        { from: "s", to: "s" },
        { from: "t", to: "t" },
        { from: "n", to: "n" },
        { from: "h", to: "h" },
        { from: "m", to: "m" },
        { from: "y", to: "j" },
        { from: "r", to: "r" },
        { from: "l", to: "l" },
        { from: "v", to: "v" },
        { from: "b", to: "p" },
        { from: "b", to: "p" },
        { from: "z", to: "z" }
    ];

    let pronunciation = word;
    pronunciationRules.forEach(rule => {
        pronunciation = pronunciation.replace(new RegExp(rule.from, 'g'), rule.to);
    });

    return pronunciation;
}
