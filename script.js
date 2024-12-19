/// Domanda caricata da JSON
const questionData = {
    "title": "Quali sono gli elementi e i concetti che definiscono il tema del “concetto di sviluppo nella globalizzazione”?",
    "type": "drag-drop",
    "reference_text": "Nel corso degli anni Novanta un insieme di elementi tra loro intrecciati sposta l’attenzione dei sociologi sulle dimensioni socioculturali della modernizzazione. Tra questi elementi compaiono [lo sviluppo del capitalismo asiatico], [la transizione economica in atto nei paesi dell’Europa orientale iniziata dopo il crollo dei regimi comunisti], e [la critica generalizzata ai limiti dell’intervento dello Stato]. Si tratta dunque di processi che incoraggiano la focalizzazione sulle variabili socioculturali alla base dei processi di modernizzazione. Tali variabili vengono sintetizzate nel concetto di [capitale sociale], ovvero quell’insieme di valori e relazioni che un individuo costruisce nel corso della propria vita all’interno di una determinata società.",
    "blanks": [
        "lo sviluppo del capitalismo asiatico",
        "la transizione economica in atto nei paesi dell’Europa orientale iniziata dopo il crollo dei regimi comunisti",
        "la critica generalizzata ai limiti dell’intervento dello Stato",
        "capitale sociale"
    ],
    "options": [
        "lo sviluppo del capitalismo asiatico",
        "la transizione economica in atto nei paesi dell’Europa orientale iniziata dopo il crollo dei regimi comunisti",
        "la critica generalizzata ai limiti dell’intervento dello Stato",
        "capitale sociale",
        "globalizzazione" // Una sola opzione sbagliata
    ]
};

// Elementi DOM
const questionTitle = document.getElementById('question-title');
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const submitButton = document.getElementById('submit-button');
const feedback = document.getElementById('feedback');

// Carica la domanda
function loadQuestion() {
    // Imposta il titolo
    questionTitle.textContent = questionData.title;

    // Mostra il testo con spazi vuoti
    questionContainer.innerHTML = questionData.reference_text.split(" ").map(word => {
        if (questionData.blanks.includes(word)) {
            return `<span class="droppable" data-word="${word}"></span>`;
        }
        return word;
    }).join(" ");

    // Aggiungi opzioni
    optionsContainer.innerHTML = '';
    questionData.options.forEach(option => {
        const draggable = document.createElement('div');
        draggable.textContent = option;
        draggable.className = 'draggable';
        draggable.draggable = true;
        draggable.ondragstart = (e) => e.dataTransfer.setData('text', option);
        optionsContainer.appendChild(draggable);
    });

    // Configura i droppable
    document.querySelectorAll('.droppable').forEach(droppable => {
        droppable.ondragover = (e) => e.preventDefault();
        droppable.ondrop = (e) => {
            const droppedText = e.dataTransfer.getData('text');
            droppable.textContent = droppedText;
        };
    });
}

// Verifica la risposta
function checkAnswers() {
    const droppables = document.querySelectorAll('.droppable');
    let isCorrect = true;

    droppables.forEach(droppable => {
        const expected = droppable.getAttribute('data-word');
        const actual = droppable.textContent.trim();
        if (expected !== actual) {
            isCorrect = false;
            droppable.style.backgroundColor = '#f44336'; // Rosso per errore
        } else {
            droppable.style.backgroundColor = '#4caf50'; // Verde per corretto
        }
    });

    feedback.textContent = isCorrect ? 'Tutte le risposte sono corrette! 🎉' : 'Alcune risposte sono errate. ❌';
    feedback.classList.remove('hidden');
}

// Eventi
submitButton.addEventListener('click', checkAnswers);

// Carica la prima domanda
loadQuestion();
