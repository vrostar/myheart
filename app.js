import {DecisionTree} from "./libraries/decisiontree.js"

const heartbtn = document.querySelector("#heart");
heartbtn.addEventListener("click", () => loadSavedModel());

function loadSavedModel() {
    fetch("./model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    let age= document.getElementById('age').value;
    let cp= document.getElementById('cp').value;
    let thalach= document.getElementById('thalach').value;

    let heartChance = {age: age, cp: cp, thalach: thalach}
    let prediction = decisionTree.predict(heartChance)
    console.log("Predicted: " + prediction)

    if (prediction == 1) {
        let element = document.getElementById("heartAttack")
        element.innerText = `You have a higher chance of having a heart attack! Be careful.`
    } else {
        let element = document.getElementById("heartAttack")
        element.innerText = `You have a healthy heart, low chance of getting a heart attack!`
    }

}