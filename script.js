let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 30; // Numero di domande da mostrare

// Funzione per mescolare un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Carica il file JSON e prepara le domande
fetch('question.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffle(data).slice(0, totalQuestions); // Seleziona 30 domande casuali
        startQuiz();
    })
    .catch(error => console.error('Errore nel caricamento del file JSON:', error));

// Avvia il quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('final-score').textContent = '';
    document.getElementById('result').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('feedback').textContent = ''; // Resetta il feedback
    showQuestion();
}

// Mostra la domanda corrente
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const answersElement = document.getElementById('answers');
    answersElement.innerHTML = ''; // Reset delle risposte

    if (question.correct_answers) {
        // Domanda a risposta multipla
        Object.entries(question.options).forEach(([key, answer]) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = key;
            checkbox.name = 'answer';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(answer));
            answersElement.appendChild(label);
        });
    } else {
        // Domanda a risposta singola
        Object.entries(question.options).forEach(([key, answer]) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => checkAnswer(key));
            answersElement.appendChild(button);
        });
    }

    document.getElementById('question-counter').textContent = `Domanda ${currentQuestionIndex + 1} di ${totalQuestions}`;
}

// Controlla se la risposta selezionata è corretta
function checkAnswer(selectedKey) {
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedKey === question.correct_answer;
    document.getElementById('feedback').textContent = question.feedback;

    if (isCorrect) {
        score++;
    }

    document.getElementById('next-question').classList.remove('hidden');
}

// Mostra i risultati finali
function endGame() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('final-score').textContent = `${score} punti!`;
}
