let currentQuestionIndex = 0;
let quizData = [];
let correctAnswers = 0;
let selectedOptionElement = null;
let timer;
let timeLeft = 20;
let startTime;

function startQuiz(category) {
    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            quizData = data.results;
            showQuestion();
            document.getElementById('quizContainer').style.display = 'block';
            document.querySelector('.categories').style.display = 'none';
            startTime = new Date();
        })
        .catch(error => console.error('Error fetching quiz data:', error));
}

function showQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const timerElement = document.getElementById('timer');
    const question = quizData[currentQuestionIndex];

    questionElement.innerHTML = `${currentQuestionIndex + 1}. ${question.question}`;
    optionsElement.innerHTML = '';

    const options = [...question.incorrect_answers];
    options.splice(Math.floor(Math.random() * 4), 0, question.correct_answer);

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => selectAnswer(button, option);
        optionsElement.appendChild(button);
    });

    selectedOptionElement = null;
    timeLeft = 20;
    timerElement.innerText = `Time Left: ${timeLeft}s`;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    const nextButton = document.getElementById('nextButton');
    nextButton.innerText = currentQuestionIndex === quizData.length - 1 ? 'Submit' : 'Next';
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    timeLeft--;
    timerElement.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        nextQuestion();
    }
}

function selectAnswer(button, selectedOption) {
    if (selectedOptionElement) {
        selectedOptionElement.style.backgroundColor = ''; 
    }
    selectedOptionElement = button;
    selectedOptionElement.style.backgroundColor = '#4CAF50';
    quizData[currentQuestionIndex].selectedOption = selectedOption;
}

function nextQuestion() {
    clearInterval(timer);

    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        submitQuiz();
    }
}

function submitQuiz() {
    clearInterval(timer);

    const endTime = new Date();
    const totalTimeSpent = Math.round((endTime - startTime) / 1000);

    quizData.forEach(question => {
        if (question.selectedOption === question.correct_answer) {
            correctAnswers++;
        }
    });

    const wrongAnswers = quizData.length - correctAnswers;
    document.getElementById('resultText').innerHTML = `Correct: ${correctAnswers}, Wrong: ${wrongAnswers}<br>Total Time Spent: ${totalTimeSpent} seconds`;
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';

    saveQuizResults(correctAnswers, wrongAnswers, totalTimeSpent);
}

function saveQuizResults(correctAnswers, wrongAnswers, totalTimeSpent) {
    fetch('http://localhost:4000/save-results', { // Adjust URL as needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            correctAnswers,
            wrongAnswers,
            totalTimeSpent
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
