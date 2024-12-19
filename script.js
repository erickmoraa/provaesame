let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 30; // Numero totale di domande da mostrare
let wrongQuestions = []; // Array per memorizzare le domande sbagliate

// Funzione per mescolare un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Carica tutte le domande in ordine casuale e limita a 30
fetch('question.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffle(data).slice(0, totalQuestions); // Prendi solo 30 domande
        startQuiz();
    })
    .catch(error => console.error('Errore nel caricamento del file JSON:', error));

// Avvia il quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    wrongQuestions = [];
    document.getElementById('final-score').textContent = '';
    document.getElementById('result').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('feedback').textContent = '';
    showQuestion();
}

// Mostra la domanda corrente
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const answersElement = document.getElementById('answers');
    answersElement.innerHTML = ''; // Reset delle risposte
    document.getElementById('feedback').textContent = '';

    Object.entries(question.options).forEach(([key, answer]) => {
        const button = document.createElement('button');
        button.textContent = answer; // Mostra solo la risposta
        button.addEventListener('click', () => checkAnswer(key, question));
        answersElement.appendChild(button);
    });

    document.getElementById('question-counter').textContent = `PREGUNTA ${currentQuestionIndex + 1} DE ${totalQuestions}`;
}

// Controlla se la risposta selezionata è corretta
function checkAnswer(selectedKey, question) {
    const answers = document.querySelectorAll('.answers button');
    answers.forEach(button => {
        button.disabled = true;
        if (button.textContent === question.options[question.correctAnswer]) {
            button.classList.add('correct');
        } else if (button.textContent === question.options[selectedKey]) {
            button.classList.add('incorrect');
        }
    });

    if (selectedKey === question.correctAnswer) {
        score++;
    } else {
        wrongQuestions.push(question.question); // Aggiungi la domanda sbagliata
    }

    document.getElementById('feedback').textContent = question.explanation || '';
    document.getElementById('next-question').classList.remove('hidden');
}

// Passa alla domanda successiva
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    document.getElementById('next-question').classList.add('hidden');
    showQuestion();
});

// Mostra i risultati finali
function endGame() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('final-score').textContent = `TOTAL ${score} PUNTOS SOBRE ${totalQuestions}!`;

    // Mostra le domande sbagliate
    const wrongQuestionsContainer = document.createElement('div');
    wrongQuestionsContainer.innerHTML = `
        <h3>EQUIVOCADAS:</h3>
        <ul>
            ${wrongQuestions.map(q => `<li>${q}</li>`).join('')}
        </ul>
    `;
    document.getElementById('result').appendChild(wrongQuestionsContainer);
}
