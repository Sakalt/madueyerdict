let dictionaryData;
let currentPage = 1;
const itemsPerPage = 20;

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
