
var pageContentEl = document.querySelector("#quiz");
var contentObjArray = [];
var answer = 0;
var currentState = 0;
var correctCount = 0;
var buttonActive = true;


var updatePage = function(contentObj) {
    var pageSectionEl = document.querySelector("#quiz");

    pageSectionEl.querySelector("h1").textContent = contentObj.h1;
    pageSectionEl.querySelector("h2").textContent = contentObj.h2;

    var buttons = document.querySelector("button");
    console.log(buttons);

    // remove previous buttons
    while(buttons !== null){
        buttons.remove();
        buttons = document.querySelector("button");
    }

    var feedbackMessage = document.querySelector("#feedbackMessage");

    if(feedbackMessage !== null){
        feedbackMessage.remove();
    }
 
    for(var i = 0; i < contentObj.choices.length; i++){
        var editButtonEl = document.createElement("button");
        editButtonEl.textContent = contentObj.choices[i];
        editButtonEl.className = "choice";
        editButtonEl.setAttribute("choice-id", i);

        pageSectionEl.appendChild(editButtonEl);
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

    // console.log(targetEl);
    // console.log(choiceId);
    if(choiceId === null){
        return false;
    }
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

    }
    
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

var main = function (){
    contentObjArray = addContents();
    updatePage(contentObjArray[currentState]);
}

main();

pageContentEl.addEventListener("click", taskButtonHandler);