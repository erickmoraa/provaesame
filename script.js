let questions = [];
let currentQuestionIndex = 0;

// Carica le domande dal file JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        // Filtra le domande con id da 1 a 150
        questions = data.filter(question => question.id >= 1 && question.id <= 159);
        showQuestion(); // Mostra la prima domanda
    })
    .catch(error => console.error('Errore nel caricamento del file JSON:', error));

// Mostra la domanda corrente
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const answersElement = document.getElementById('answers');
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
    if (selectedKey === question.correct_answer) {
        alert('Risposta corretta!');
    } else {
        alert('Risposta errata!');
    }
    document.getElementById('next-question').classList.remove('hidden');
}

// Passa alla domanda successiva
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        alert('Quiz completato!');
    }
});
