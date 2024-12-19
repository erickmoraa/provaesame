let questions = [];
let currentQuestionIndex = 0;

// Funzione per caricare le domande dal file JSON
fetch('questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Errore nel caricamento del file JSON: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Filtra le domande con id da 1 a 150
        questions = data.filter(question => question.id >= 1 && question.id <= 150);
        if (questions.length === 0) {
            throw new Error('Nessuna domanda trovata nel range 1-150.');
        }
        showQuestion(); // Mostra la prima domanda
    })
    .catch(error => {
        console.error(error.message);
        alert('Errore nel caricamento del quiz. Controlla il file JSON.');
    });

// Mostra la domanda corrente
function showQuestion() {
    // Controlla se ci sono ancora domande
    if (currentQuestionIndex >= questions.length) {
        alert('Quiz completato!');
        return;
    }

    const question = questions[currentQuestionIndex];

    // Aggiorna la domanda
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');

    if (!questionElement || !answersElement) {
        console.error('Elementi HTML mancanti (question o answers).');
        return;
    }

    questionElement.textContent = question.question;
    answersElement.innerHTML = ''; // Svuota le risposte precedenti

    // Crea i pulsanti per le opzioni di risposta
    Object.entries(question.options).forEach(([key, answer]) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(key));
        answersElement.appendChild(button);
    });

    document.getElementById('next-question').classList.add('hidden');
}

// Controlla la risposta selezionata
function checkAnswer(selectedKey) {
    const question = questions[currentQuestionIndex];
    const feedback = selectedKey === question.correct_answer
        ? 'Risposta corretta!'
        : 'Risposta errata!';
    alert(feedback);
    document.getElementById('next-question').classList.remove('hidden');
}

// Passa alla domanda successiva
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});
