import {DecisionTree} from "./libraries/decisiontree.js"
import {VegaTree} from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/heart.csv"
const trainingLabel = "target"
const ignored = ["sex", "trestbps", "chol", "fbs",
    "restecg", "exang", "oldpeak", "slope", "ca", "thal", "target"]
// ignored: age, cp and thalach

//
// load csv data as json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// Machine Learning and decision tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5));
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // Create Decision Tree algorithm
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet:data,
        categoryAttr: trainingLabel
    })

    // Draw the decision tree
    let visual = new VegaTree('#view', 1800, 800, decisionTree.toJSON())

    // Make prediction with test data
    let heartChance = testData[9]

    let heartAttack = decisionTree.predict(heartChance)

    if (heartAttack === 0) {
        console.log(`You have a lower chance of heart attack`)
    } else {
        console.log('You have a higher chance of heart attack')
    }


    // Confusion Matrix
    let amountCorrect = 0;

    let goodBad = 0;
    let badGood = 0;
    let badBad = 0;
    let goodGood = 0;

    // Loop for Accuracy and Confusion Matrix
    for (const row of data) {

        if (row.target == decisionTree.predict(row)) {

            amountCorrect++

        }
        if (row.target == 0 && decisionTree.predict(row) == 1) {

            goodBad++

        }
        if (row.target == 1 && decisionTree.predict(row) == 0) {

            badGood++

        }
        if (row.target == 1 && decisionTree.predict(row) == 1) {

            badBad++

        }
        if (row.target == 0 && decisionTree.predict(row) == 0) {

            goodGood++

        }
    }

    //Calculate accuracy

    let accuracy = amountCorrect / data.length
    console.log(accuracy)

    let element = document.getElementById("accuracy")
    element.innerText = `Accuracy: ${accuracy}`;

    // Confusion Matrix

    let goodHeart = document.getElementById("goodGood")
    goodHeart.innerHTML = goodGood.toString();

    let wrongHeart = document.getElementById("badGood")
    wrongHeart.innerHTML = badGood.toString();

    let heartWrong = document.getElementById("goodBad")
    heartWrong.innerHTML = goodBad.toString();

    let badHeart = document.getElementById("badBad")
    badHeart.innerHTML = badBad.toString();

    // Create model

    let jsonmodel = decisionTree.stringify()
    console.log(`JSON: ${jsonmodel}`)

}


loadData()
