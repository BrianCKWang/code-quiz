
var highscoreContentEl = document.querySelector("#highscore");
var quizContentEl = document.querySelector("#quiz");
var timerContentEl = document.querySelector("#timer");
var contentObjArray = [];
var highscore = [];
var answer = 0;
var currentState = 0;
var correctCount = 0;
var buttonActive = true;
var timeRemaining = 0;
var myTimer;
var quizTimeMultiplier = 30;    // seconds

/**
 * To add questions, 
 * 1. copy object, 
 * 2. change title in h1, 
 * 3. change question in h2, 
 * 4. add answers, 
 * 5. and update answer index. 
 * 
 * Leave inputField false.
 */
var addContents = function (){
    contentObjArray = [];

    // main page
    contentObjArray.push(contentObj = {
        h1: "Quiz main page",
        h2: "Are you ready???",
        choices: ["Start"],
        answer: 0,
        inputField: false
    });

    // question 1
    contentObjArray.push(contentObj = {
        h1: "Question 1:",
        h2: "Are you bastion?",
        choices: ["beep", "boop"],
        answer: 1,
        inputField: false
    });

    // question 2
    contentObjArray.push(contentObj = {
        h1: "Question 2:",
        h2: "Are you bastion?",
        choices: ["beep", "boop"],
        answer: 1,
        inputField: false
    });

    // question 3
    contentObjArray.push(contentObj = {
        h1: "Question 3:",
        h2: "Are you bastion?",
        choices: ["beep", "boop"],
        answer: 1,
        inputField: false
    });

    // finish page
    contentObjArray.push(contentObj = {
        h1: "Finish",
        h2: "Please enter initial",
        choices: ["Submit"],
        answer: 0,
        inputField: true
    });

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
    var pageSectionEl = document.querySelector("#quiz");

    // remove previous addon elements
    removeElement(pageSectionEl, "button");
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

    // add buttons of choices
    for(var i = 0; i < contentObj.choices.length; i++){
        var buttonEl = document.createElement("button");
        buttonEl.textContent = contentObj.choices[i];
        buttonEl.className = "choice";
        buttonEl.setAttribute("choice-id", i);

        pageSectionEl.appendChild(buttonEl);
    }

    answer = contentObj.answer;
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

    var currentAttempt = {
        timeStamp: Date.now(),
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
            else if(highscore[i].score == currentAttempt.score && highscore[i].timeStamp > currentAttempt.timeStamp){   
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



var quizButtonClickHandler = async function(event) {
    debugger;
    
    if(!buttonActive){
        return false;
    }

    var targetEl = event.target;
    var choiceId = targetEl.getAttribute("choice-id");
    var endIndex = contentObjArray.length - 1;

    if(choiceId === null){
        return false;
    }

    // check clicked choice
    if(targetEl.matches(".choice")){
        if(currentState == 0){
            startTimer();
        }
        else if(currentState != 0 && currentState != endIndex){
            if(choiceId == answer){
                updateFeedback(true);
            }
            else{
                updateFeedback(false);
                timeRemaining -= quizTimeMultiplier;
                updateTimer();
            }

            if(currentState == endIndex - 1){
                clearInterval(myTimer);
            }

            buttonActive = false;
            await new Promise(r => setTimeout(r, 1500));
            buttonActive = true;
        }
        else if(currentState == endIndex){
            timerContentEl.querySelector("#timer-value").textContent = "-:--";
            saveHighscore();
            updateHighscoreTable();
        }
    }
 
    // change state
    if(currentState < endIndex){
        currentState++;
        if(currentState  == endIndex){
            contentObjArray[currentState].h2 = "You answered " 
            + correctCount 
            + " out of " 
            + (endIndex - 1) 
            + " questions correct. Please enter initial.";
        }
    }
    else{
        currentState = 0;
        correctCount = 0;
    }
    
    updatePage(contentObjArray[currentState]);
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
        updatePage(contentObjArray[currentState]);
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

loadScoresFromLocal();
updateHighscoreTable();
addContents();
updatePage(contentObjArray[0]); // show quiz start page

// event listeners
quizContentEl.addEventListener("click", quizButtonClickHandler);
quizContentEl.addEventListener("submit", quizButtonClickHandler);
highscoreContentEl.addEventListener("click", highscoreButtonClickHandler);
