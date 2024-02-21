// Pull in all the elements
const startElement = $('#start');
const gameElement = $('#game');
const resultElement = $('#result');

const stationCountSpan = $('#stationCount');

const questionNumber = $('#questionNumber');
const totalQuestions = $('#questionCount');
const scoreText = $('#score');
const questionText = $('#questionText');

const answerInput = $('#crsInput');

const resultText = $('#resultText');

var currentQuestion = 0;
var currentQuestionIndex = 0;
var currentScore = 0;
var stations = [];

var questionsToDo = 0;
var coveredIndexes = [];

function getNextQuestionIndex() {
    var index = Math.floor(Math.random() * stations.length);

    while (coveredIndexes.includes(index)) {
        index = Math.floor(Math.random() * stations.length);
    }

    coveredIndexes.push(index);

    return index;
}

function reset() {
    gameElement.hide();
    resultElement.hide();
    startElement.show();
}

function startGame(qCount) {
    // Hide the start button
    startElement.hide();

    // Set the number of questions to do
    questionsToDo = qCount || stations.length;

    // Set the game's initial state
    currentQuestion = 0;
    currentScore = 0;
    coveredIndexes = [];

    currentQuestionIndex = getNextQuestionIndex();

    questionNumber.html(currentQuestion + 1);
    totalQuestions.html(questionsToDo.toLocaleString());

    scoreText.html(currentScore);

    questionText.html(stations[currentQuestionIndex].name);

    // Show the game
    gameElement.show();
}

function checkAnswer() {
    var answer = answerInput.val().toLowerCase();

    if (answer.length < 3) {
        alert('Please enter a station code')
        return false;
    }

    if (answer === stations[currentQuestionIndex].crs.toLowerCase()) {
        currentScore++;
        scoreText.html(currentScore);
    }

    answerInput.val('');
    currentQuestion++;

    if (currentQuestion < questionsToDo && currentQuestion < stations.length) {
        currentQuestionIndex = getNextQuestionIndex();

        questionNumber.html(currentQuestion + 1);
        questionText.html(stations[currentQuestionIndex].name);
    } else {
        gameElement.hide();

        resultText.html('You scored ' + currentScore + ' out of ' + questionsToDo + ' (' + ((currentScore / questionsToDo) * 100).toFixed(2) + '%)');
        resultElement.show();
    }

    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Set the initial state
    //startElement.hide();
    gameElement.hide();
    resultElement.hide();

    // Get stations.json
    $.getJSON('stations.json', function(data) {
        stations = data.stations;

        // Set number
        stationCountSpan.html(stations.length.toLocaleString());

        startGame(5);
    });
});