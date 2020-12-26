
var pageContentEl = document.querySelector("#quiz");
var contentObjArray = [];
var highscore = [];
var answer = 0;
var currentState = 0;
var correctCount = 0;
var buttonActive = true;


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
    
        pageContentEl.appendChild(initialBoxEl);
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
        // alert("Correct");
    }
    else{
        feedbackParagraphEl.textContent = "Wrong";
        // alert("Wrong");
    }

    pageContentEl.appendChild(feedbackParagraphEl);
}

var taskButtonHandler = async function(event) {
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
        if(currentState != 0 && currentState != endIndex){
            if(choiceId == answer){
                updateFeedback(true);
            }
            else{
                updateFeedback(false);
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

loadScores();
contentObjArray = addContents();
updatePage(contentObjArray[currentState]);

pageContentEl.addEventListener("click", taskButtonHandler);