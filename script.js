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
        // Dividi le domande in normali e multiple
        const allNormalQuestions = data.filter(q => q.id >= 1 && q.id <= 159);
        const allMultiQuestions = data.filter(q => q.id >= 160 && q.id <= 175);

        // Seleziona 27 domande casuali normali e 3 multiple
        normalQuestions = shuffle(allNormalQuestions).slice(0, 27);
        multiQuestions = shuffle(allMultiQuestions).slice(0, 3);

        // Combina le domande normali in ordine e salva
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
        showMultiQuestions(); // Passa alle domande multiple alla fine
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    const answersElement = document.getElementById('answers');
    answersElement.innerHTML = ''; // Reset delle risposte
    document.getElementById('feedback').textContent = ''; // Nasconde feedback precedente

    // Se la domanda è normale (singola risposta)
    if (!question.correct_answers) {
        Object.entries(question.options).forEach(([key, answer]) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => checkAnswer(key));
            answersElement.appendChild(button);
        });
    } else {
        // Se la domanda è multipla (checkbox)
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

    document.getElementById('question-counter').textContent = `Domanda ${currentQuestionIndex + 1} di ${questions.length + multiQuestions.length}`;
}

// Controlla se la risposta selezionata è corretta (domande normali)
function checkAnswer(selectedKey) {
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedKey === question.correct_answer;
    document.getElementById('feedback').textContent = question.feedback;

    if (isCorrect) {
        score++;
    }

    document.getElementById('next-question').classList.remove('hidden');
}

// Passa alla domanda successiva
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    document.getElementById('next-question').classList.add('hidden');
    showQuestion();
});

// Mostra le domande multiple alla fine
function showMultiQuestions() {
    questions = multiQuestions;
    currentQuestionIndex = 0;
    document.getElementById('next-question').classList.add('hidden');
    document.getElementById('check-final').classList.remove('hidden');
    showQuestion();
}

// Verifica le risposte delle domande multiple
document.getElementById('check-final').addEventListener('click', () => {
    let allCorrect = true;

    multiQuestions.forEach((question, index) => {
        const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
            .map(input => input.value);
        const correctAnswers = question.correct_answers;

        if (selectedAnswers.sort().join(',') !== correctAnswers.sort().join(',')) {
            allCorrect = false;
        } else {
            finalScore++;
        }
    });

    if (allCorrect) {
        document.getElementById('feedback').textContent = 'Hai risposto correttamente a tutte le domande finali!';
    } else {
        document.getElementById('feedback').textContent = 'Alcune risposte sono errate. Riprovaci!';
    }

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('final-score').textContent = `${score + finalScore} punti!`;
});
