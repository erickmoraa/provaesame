let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let finalScore = 0;

let normalQuestions = []; // Array per le domande normali
let multiQuestions = []; // Array per le domande multiple

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
        const allNormalQuestions = data.filter(q => q.id >= 1 && q.id <= 159);
        const allMultiQuestions = data.filter(q => q.id >= 160 && q.id <= 175);

        normalQuestions = shuffle(allNormalQuestions).slice(0, 27);
        multiQuestions = shuffle(allMultiQuestions).slice(0, 3);

        questions = [...normalQuestions];
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
    if (currentQuestionIndex >= questions.length) {
        showMultiQuestions();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const answersElement = document.getElementById('answers');
    answersElement.innerHTML = '';

    if (!question.correct_answers) {
        Object.entries(question.options).forEach(([key, answer]) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => checkAnswer(key));
            answersElement.appendChild(button);
        });
    } else {
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
    }
}

// Resetta le risposte delle domande multiple
function resetMultiQuestion() {
    const checkboxes = document.querySelectorAll('input[name="answer"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Verifica le domande multiple e consente nuovi tentativi
document.getElementById('check-final').addEventListener('click', () => {
    const question = multiQuestions[currentQuestionIndex];
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
        .map(input => input.value);
    const correctAnswers = question.correct_answers;

    if (selectedAnswers.sort().join(',') === correctAnswers.sort().join(',')) {
        finalScore++;
        currentQuestionIndex++;
        if (currentQuestionIndex < multiQuestions.length) {
            resetMultiQuestion();
            showQuestion();
        } else {
            document.getElementById('feedback').textContent = 'Hai completato le domande multiple!';
        }
    } else {
        document.getElementById('feedback').textContent = 'Risposta errata! Riprova.';
        resetMultiQuestion();
    }
});
