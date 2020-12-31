
var highscoreContentEl = document.querySelector("#highscore");
var quizContentEl = document.querySelector("#quiz");
var timerContentEl = document.querySelector("#timer");
var contentObjArray = [];
var questionTotalCount = 0;
var endIndex = 0;
var highscore = [];
var answer = 0;
var currentState = 0;
var correctCount = 0;
var buttonActive = true;
var timeRemaining = 0;
var myTimer;
var totalTimeUsed = 0;

// settings
var quizTimeMultiplier = 30;    // seconds

/**
 * To add questions, 
 * 1. copy object, 
 * 2. Leave h1 blank, 
 * 3. change question in h2, 
 * 4. add answers in answerPair, mark the answer to true. Only one answer true allowed
 * 
 * Leave inputField false.
 */
var addContents = function (){
    contentObjArray = [];

    contentObjArray.push(contentObj = {
        h1: "",
        h2: "Value in a variable cannot be changed.",
        answerPair: [["False", true], ["True", false]],
        inputField: false
    });

    contentObjArray.push(contentObj = {
        h1: "",
        h2: "Math.random() returns a value between 0 and 1.",
        answerPair: [["True", true], ["false", false]],
        inputField: false
    });

    contentObjArray.push(contentObj = {
        h1: "",
        h2: "Which one is not a JavaScript data type?",
        answerPair: [["Header", true], ["Number", false], ["Boolean", false], ["String", false]],
        inputField: false
    });

    contentObjArray.push(contentObj = {
        h1: "",
        h2: "Which symbol is used to comment a single line in JavaScript?",
        answerPair: [["//", true], ["{}", false], ["<>", false], ["??", false]],
        inputField: false
    });

    contentObjArray.push(contentObj = {
        h1: "",
        h2: "JavaScript is case sensitive.",
        answerPair: [["True", true], ["False", false]],
        inputField: false
    });

    contentObjArray.push(contentObj = {
        h1: "",
        h2: "What is the result of 4+3+\"7\"",
        answerPair: [["77", true], ["14", false], ["17", false], ["437", false], ["9000", false]],
        inputField: false
    });
}

var addStartAndEndPage = function() {
    // main page
    contentObjArray.unshift(contentObj = {
        h1: "Quiz main page",
        h2: "Are you ready???",
        answerPair: [["Start", true]],
        inputField: false
    });

    // finish page
    contentObjArray.push(contentObj = {
        h1: "Finish",
        h2: "Please enter initial",
        answerPair: [["Submit", true]],
        inputField: true
    });
}

// Fisher–Yates shuffle
var shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

var updateCountAndIndex = function() {
    endIndex = contentObjArray.length - 1;
    questionTotalCount = contentObjArray.length - 2;
}

var saveScoresToLocal = function() {
    localStorage.setItem("code-quiz-highscore", JSON.stringify(highscore));
}

var loadScoresFromLocal = function(){
    var savedScores = localStorage.getItem("code-quiz-highscore");

    if (!savedScores) {
      return false;
    }
  
    highscore = JSON.parse(savedScores);
}

var removeElement = function (pageSectionEl, element){
    var selectedEl = pageSectionEl.querySelector(element);
    while(selectedEl !== null){
        selectedEl.remove();
        selectedEl = pageSectionEl.querySelector(element);
    }
}

var updatePage = function(contentObj) {
    debugger;

    if(contentObj === null){
        console.log("contentObj is null");
        return false;
    }
    var pageSectionEl = document.querySelector("#quiz");

    // remove previous addon elements
    removeElement(pageSectionEl, ".p-btn");
    removeElement(pageSectionEl, "#feedbackMessage");
    removeElement(pageSectionEl, "input");

    // update messages
    pageSectionEl.querySelector("h1").textContent = contentObj.h1;
    pageSectionEl.querySelector("h2").textContent = contentObj.h2;

    // add input field
    if(contentObj.inputField){
        var formEl = document.createElement("form");
        formEl.action = "";
        formEl.id = "initial-form";
        var initialBoxEl = document.createElement("input");
        initialBoxEl.type = "text";
        initialBoxEl.name = "initial";
        initialBoxEl.id = "initial-input"
        initialBoxEl.placeholder = "Enter initial";
    
        formEl.appendChild(initialBoxEl);
        quizContentEl.appendChild(formEl);
        document.getElementById("initial-input").focus();
    }

    if(currentState != 0 && currentState != endIndex){
        // randomize answer order
        shuffle(contentObj.answerPair);
    }    

    // add buttons of choices
    for(var i = 0; i < contentObj.answerPair.length; i++){
        var pEl = document.createElement("p");
        pEl.className = "p-btn"
        var buttonEl = document.createElement("button");
        buttonEl.textContent = contentObj.answerPair[i][0];
        buttonEl.className = "choice btn";
        buttonEl.setAttribute("choice-id", i);

        pEl.appendChild(buttonEl);
        pageSectionEl.appendChild(pEl);

        if(contentObj.answerPair[i][1] == true){
            answer = i;
        }
        // debugger;
    }   
}

var updateFeedback = function(feedback) {
    var feedbackParagraphEl = document.createElement("p");
    feedbackParagraphEl.id = "feedbackMessage";

    if(feedback){
        correctCount++;
        feedbackParagraphEl.textContent = "Correct";
    }
    else{
        feedbackParagraphEl.textContent = "Wrong";
    }

    quizContentEl.appendChild(feedbackParagraphEl);
}

var saveHighscore = function () {
    // debugger;

    var initial_inputBox = document.querySelector("input[name='initial']").value

    if(!initial_inputBox){
        alert("Please enter initial.")
        return false;
    }
    else if(initial_inputBox.length > 15){
        alert("Please enter initial in shorter format.")
        return false;
    }

    var currentAttempt = {
        timeStamp: Date.now(),
        timeUsed: totalTimeUsed,
        initial: initial_inputBox,
        score: correctCount
    }

    if(highscore.length == 0){
        highscore.push(currentAttempt);
    }
    else{
        for(var i = 0; i <= highscore.length; i++){
             // push score when reaching the end
            if(i == highscore.length){ 
                highscore.push(currentAttempt);
                break;
            }
            // splice score if lower score in middle is found
            else if(highscore[i].score < currentAttempt.score){ 
                highscore.splice(i, 0, currentAttempt);
                break;
            }
            // splice score if same score is found and timestamp is larger
            else if(highscore[i].score == currentAttempt.score && highscore[i].timeUsed > currentAttempt.timeUsed){   
                highscore.splice(i, 0, currentAttempt);
                break;
            }
            // splice score if same score is found and timestamp is larger
            else if(highscore[i].score == currentAttempt.score && highscore[i].timeUsed == currentAttempt.timeUsed && highscore[i].timeStamp > currentAttempt.timeStamp){   
                highscore.splice(i, 0, currentAttempt);
                break;
            }
        }
    }

    // maintain maximum highscore list length
    if(highscore.length > 10){
        highscore.pop();
    }

    saveScoresToLocal();
    return true;
}

var updateHighscoreTable = function () {
    // debugger;
    removeElement(highscoreContentEl, ".highscore-item");

    for(var i = 0; i < highscore.length; i++){
        var highscoreItemEl = document.createElement("p");
        var place = i + 1;
        highscoreItemEl.textContent = place + " - " + highscore[i].initial + ": " + highscore[i].score;
        highscoreItemEl.className = "highscore-item";
        highscoreContentEl.appendChild(highscoreItemEl);
    }
}

var validateChoice = function (choiceId) {
    if(choiceId == answer){
        updateFeedback(true);
    }
    else{
        updateFeedback(false);
        timeRemaining -= quizTimeMultiplier;
        updateTimer();
    }
}

var stopTimerWhenFinished = function () {
    if(currentState == endIndex - 1){
        totalTimeUsed = questionTotalCount * quizTimeMultiplier - timeRemaining;
        clearInterval(myTimer);
    }
}

var displayEndMessage = function (){
    contentObjArray[currentState].h2 = "You answered " 
    + correctCount 
    + " out of " 
    + questionTotalCount
    + " questions correct. Please enter initial.";
}

var resetQuiz = function () {
    currentState = 0;
    correctCount = 0;
}

var finishQuiz = function () {
    timerContentEl.querySelector("#timer-value").textContent = "-:--";
    var scoreSaved = saveHighscore();
    updateHighscoreTable();
    
    return scoreSaved;
}

var changeState = function() {
    if(currentState < endIndex){
        currentState++;
        if(currentState  == endIndex){
            displayEndMessage();
        }
    }
    else{
        resetQuiz();
    }
}

var randomizeQuestionOrder = function() {
    shuffle(contentObjArray);

    // add question numbering to h1
    for(var i = 0; i < contentObjArray.length; i++){
        contentObjArray[i].h1 = "Question " + (i+1) + ":";
    }
}

var quizButtonClickHandler = async function(event) {
    debugger;
    
    if(!buttonActive){
        return false;
    }

    var targetEl = event.target;
    var choiceId = targetEl.getAttribute("choice-id");
    // var endIndex = contentObjArray.length - 1;

    if(choiceId === null){
        return false;
    }

    // check clicked choice
    if(targetEl.matches(".choice")){
        if(currentState == 0){
            startTimer();
            changeState();
            updatePage(contentObjArray[currentState]);
        }
        else if(currentState != 0 && currentState != endIndex){
            validateChoice(choiceId);
            stopTimerWhenFinished();
            
            buttonActive = false;
            await new Promise(r => setTimeout(r, 1500));
            buttonActive = true;

            changeState();
            updatePage(contentObjArray[currentState]);
        }
        else if(currentState == endIndex){
            if(finishQuiz()){
                changeState();
                updatePage(contentObjArray[currentState]);
            }
        }
    }
}

var submitHandler = function () {
    // debugger;
    event.preventDefault();
    if(currentState == endIndex){
        if(finishQuiz()){
            changeState();
            updatePage(contentObjArray[currentState]);
        }
    }
}

var highscoreButtonClickHandler = function(event){
    var targetEl = event.target;

    if(targetEl.matches("#clear-highscore")){
        if(confirm('This will delete all history of highscores. Confirm?')){
            highscore = [];
            localStorage.clear("code-quiz-highscore");
            updateHighscoreTable();
        }
    }
}

var timerValueText = function () {
    timeRemaining = timeRemaining < 0 ? 0 : timeRemaining; 
    var minute = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;

    return minute + ":" + (seconds < 10 ? "0" : "") + seconds;
}

var updateTimer = function () {
    timerContentEl.querySelector("#timer-value").textContent = timerValueText();
}

var timerCheck = function () {
    if(timeRemaining == 0){
        clearInterval(myTimer);
        currentState = contentObjArray.length - 1;
        contentObjArray[currentState].h2 = "Timer is up. You answered " + correctCount + " out of " + (currentState - 1) + " questions correct. Please enter initial.";
        updatePage(contentObjArray[endIndex]);
    }
}

var timerHandle = function () {
    timeRemaining -= 1;
    updateTimer(); 
    timerCheck();
}

var startTimer =  function () {
    timeRemaining = (contentObjArray.length - 2) * quizTimeMultiplier;
    timerContentEl.querySelector("#timer-value").textContent = timerValueText();
    myTimer = setInterval(timerHandle, 1000);
}

var showQuizStartPage = function() {
    updatePage(contentObjArray[0]); // show quiz start page
}

loadScoresFromLocal();
updateHighscoreTable();
addContents();
randomizeQuestionOrder();
addStartAndEndPage();
updateCountAndIndex();
showQuizStartPage();

// event listeners
quizContentEl.addEventListener("click", quizButtonClickHandler);
quizContentEl.addEventListener("submit", submitHandler);
highscoreContentEl.addEventListener("click", highscoreButtonClickHandler);