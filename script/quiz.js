document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  const nextButton = document.getElementById("next-question");
  const scoreDisplay = document.getElementById("score-display");
  const highscoreDisplay = document.getElementById("highscore-display");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let currentUser = localStorage.getItem('currentUser');
  
  let highscores = JSON.parse(localStorage.getItem('quizHighscores')) || {};
  updateHighscoreDisplay();

  function updateHighscoreDisplay() {
    if (currentUser && highscores[currentUser]) {
      highscoreDisplay.textContent = highscores[currentUser];
    } else {
      highscoreDisplay.textContent = '0';
    }
  }

  fetch("data/quiz.json")
    .then((response) => response.json())
    .then((data) => {
      questions = data.questions;
      loadQuestion();
    })
    .catch((error) => console.error("Error fetching quiz data:", error));

  function loadQuestion() {
    quizContainer.innerHTML = ""; 
    const question = questions[currentQuestionIndex];

    const questionCounter = document.createElement("div");
    questionCounter.className = "question-counter";
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    quizContainer.appendChild(questionCounter);

    const questionText = document.createElement("h3");
    questionText.textContent = question.text;
    quizContainer.appendChild(questionText);

    question.choices.forEach((choice, index) => {
      const choiceButton = document.createElement("button");
      choiceButton.className = "choice-btn";
      choiceButton.textContent = choice;
      choiceButton.addEventListener("click", () => handleAnswer(index, question.correct));
      quizContainer.appendChild(choiceButton);
    });
  }

  function handleAnswer(selectedIndex, correctIndex) {
    const buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach((button, index) => {
      if (index === correctIndex) {
        button.classList.add("correct");
      } else if (index === selectedIndex) {
        button.classList.add("incorrect");
      }
      button.disabled = true;
    });

    if (selectedIndex === correctIndex) {
      score++;
      scoreDisplay.textContent = score;
    }

    nextButton.disabled = false;
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
      nextButton.disabled = true;
    } else {
      showFinalScore();
    }
  });

  function showFinalScore() {
    const percentage = (score / questions.length) * 100;
    const message = percentage >= 70 ? "Great job!" : "Keep practicing!";
    const emoji = percentage >= 70 ? "🏆" : "💪";
    
    if (currentUser) {
      if (!highscores[currentUser] || score > highscores[currentUser]) {
        highscores[currentUser] = score;
        localStorage.setItem('quizHighscores', JSON.stringify(highscores));
        updateHighscoreDisplay();
      }
    }

    quizContainer.innerHTML = `
        <div class="final-score-container">
            <h2 class="final-score-title">Quiz Complete! ${emoji}</h2>
            <div class="score-circle">
                <span class="percentage">${Math.round(percentage)}%</span>
                <span class="score-details">${score}/${questions.length}</span>
            </div>
            <p class="final-message">${message}</p>
            ${currentUser && score > (highscores[currentUser] || 0) - score ? 
              '<p class="new-highscore">New Highscore! 🎉</p>' : ''}
            <button onclick="location.reload()" class="retry-btn">Try Again</button>
        </div>
    `;
    nextButton.style.display = "none";
  }
});
