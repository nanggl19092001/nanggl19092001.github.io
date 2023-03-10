import renderSphere from "./src/spinningSphere.js"
import renderMainCanvas from "./src/main.js"


const commandText = document.getElementById('command-text')
const loadingScreen = document.getElementById('loading-screen')
const aboutMeText = document.getElementById('about-me-text')
const introduceMeText = document.getElementById('introduce-me-text')

renderSphere()
renderMainCanvas()
loadingScreen.style.display = "none"

let displayCommand = 'Welcome'
let introduceText = ' Hi, my name is Nang.'
let introduceText2 = ' A Computer Science student at Ton Duc Thang University, my main interest focusing on back-end development, computer graphics and programming in general'
let countCommand = 0
let countIntroduceText1 = 0
let countIntroduceText2 = 0

function printCommand(){
    
    setTimeout(() => {
        commandText.textContent += displayCommand[countCommand]
        countCommand++
        if(countCommand < displayCommand.length){
            printCommand()
        }
        if(countCommand == displayCommand.length)
            document.getElementById('command-cursor-1').style.display = 'none'
    }, 200)
}

function printIntroduceText1(){
    setTimeout(() => {
        if(countIntroduceText1 < introduceText.length){
            aboutMeText.textContent += introduceText[countIntroduceText1]
            countIntroduceText1++
            printIntroduceText1()
        }
        if(countIntroduceText1 == introduceText.length && countIntroduceText2 < introduceText2.length){
            introduceMeText.textContent += introduceText2[countIntroduceText2]
            countIntroduceText2++
            printIntroduceText1()
        }
    }, 100)
}

printCommand()
printIntroduceText1()

