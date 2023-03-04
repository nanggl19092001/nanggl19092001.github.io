import render from "./main.js"

const commandText = document.getElementById('command-text')
const loadingScreen = document.getElementById('loading-screen')
const aboutMeText = document.getElementById('about-me-text')

loadingScreen.style.display = "none"

let displayCommand = 'Welcome'
let introduceText = ' Hi, my name is Nang.'
let introduceText2 = ' A Computer Science student at Ton Duc Thang University'
let countCommand = 0
let countIntroduceText1 = 0

function printCommand(){
    
    setTimeout(() => {
        commandText.innerHTML += displayCommand[countCommand]
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
        aboutMeText.innerHTML += introduceText[countIntroduceText1]
        countIntroduceText1++
        if(countIntroduceText1 < introduceText.length){
            printIntroduceText1()
        }
    }, 200)
}

printCommand()
printIntroduceText1()

render()

