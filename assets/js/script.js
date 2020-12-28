
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

var addContents = function (){
    var contentObjArray = [];

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

    return contentObjArray;
}

var saveScores = function() {
    localStorage.setItem("code-quiz-highscore", JSON.stringify(highscore));
}

var loadScores = function(){
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

    if(contentObj.inputField){
        var initialBoxEl = document.createElement("input");
        initialBoxEl.type = "text";
        initialBoxEl.name = "initial";
        initialBoxEl.placeholder = "Enter initial";
    
        quizContentEl.appendChild(initialBoxEl);
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
    // console.log(pageSectionEl);
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

var buttonClickHandler = async function(event) {
    // debugger;
    
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
            }

            if(currentState == endIndex - 1){
                clearInterval(myTimer);
            }

            buttonActive = false;
            await new Promise(r => setTimeout(r, 2000));
            buttonActive = true;
        }
        else if(currentState == endIndex){
            
            var initial_inputBox = document.querySelector("input[name='initial']").value

            if(!initial_inputBox){
                alert("Please enter initial.")
                return false;
            }

            var score = {
                initial: initial_inputBox,
                score: correctCount
            }

            timerContentEl.querySelector("#timer-value").textContent = "-:--";

            highscore.push(score);
            saveScores();
        }
    }
    
    // change state
    if(currentState < endIndex){
        currentState++;
        if(currentState  == endIndex){
            contentObjArray[currentState].h2 = "You answered " + correctCount + " out of " + (endIndex - 1) + " questions correct. Please enter initial.";
        }
    }
    else{
        currentState = 0;
        correctCount = 0;
    }
    
    updatePage(contentObjArray[currentState]);
};

var timerValueText = function () {
    var minute = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;

    return minute + ":" + (seconds < 10?"0":"") + seconds;;
}

var updateTimer = function () {
    timeRemaining -= 1;
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
    updateTimer(); 
    timerCheck();
}

var startTimer =  function () {
    var multiplier = 5;    // seconds
    timeRemaining = (contentObjArray.length - 2) * multiplier;
    timerContentEl.querySelector("#timer-value").textContent = timerValueText();
    myTimer = setInterval(timerHandle, 1000);
}

loadScores();
contentObjArray = addContents();
updatePage(contentObjArray[0]);

quizContentEl.addEventListener("click", buttonClickHandler);