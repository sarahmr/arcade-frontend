let mainArea = document.querySelector("main")
let block = document.querySelectorAll(".block")
let userToken = "O"
let computerToken = "X"
let activePlayer = "O"
let blockArr = []
let gameStatus = "in progress"
let tttContainer = document.querySelector("#tictactoe")

let moveEvent = (evt) => {
  if (gameStatus === "in progress") {
    evt.target.innerText = "O"
    wins()
    activePlayer = computerToken
  }
  if (gameStatus === "in progress") {
    window.setTimeout(() => {
      computerMove()
      wins()
      activePlayer = userToken
    }, 500)
  }
}

block.forEach((b) => {
  blockArr.push(b)
  b.addEventListener("click", moveEvent)
})

let computerMove = () => {
  let randomBlock = block[Math.floor(Math.random() * block.length )]
  if (randomBlock.innerText === "") {
    randomBlock.innerText = "X"
  }
  else {
    computerMove()
  }
}

let winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

let checkWin = (b1, b2, b3) => {
  if (b1 !== "" && b1 === b2 && b1 === b3) {
    return true
  } else {
    return false
  }
}

let wins = () => {
  let foundWinner = false
  winCombos.forEach((win) => {
    if (checkWin(blockArr[win[0]].innerText, blockArr[win[1]].innerText, blockArr[win[2]].innerText)) {
      foundWinner = true
    } 
  })
  if (foundWinner) {
    let message = ''
    gameStatus = "over"

    if (activePlayer === userToken) {
      message = "You have won!"
    } else {
      message = "The computer has won."
    }

    let winDisplay = document.createElement("h2")
    winDisplay.innerText = message
    tttContainer.append(winDisplay)
  } else if (!blockArr.find((block) => { return block.innerText === "" })) {
    message = "This is a draw!"
    gameStatus = "over"

    let winDisplay = document.createElement("h2")
    winDisplay.innerText = `${message}`
    tttContainer.append(winDisplay)
  }
}



// -------------------------------------------------------




let wordArea = document.querySelector(".word-display")
let userGuess = document.querySelector(".user-guess")
let gameDisplay = document.querySelector(".game-display")

// for hangman: 1. computer chooses word -- check
// 2. word is displayed as _ instead of letters -- check
// 3. user is asked to enter a letter -- check 
// 4a. if letter is in word _ is replaced by the letter -- check 
// 4b. if the letter is not in the word get a strike -- check 
// 5. repeat until strikes count down or full word -- check
// 6. display letters previously chosen -- check
// 7. work on hangman display
// 8. work on separating winning or losing from event listener -- make a gameplay function


let words = ["hunger", "dangerous", "happy", "cat", "dictionary"]
let strikes = 6
let wrongGuesses = []

let chooseWord = () => {
  let wordToGuess = words[Math.floor(Math.random() * words.length)] 
  return wordToGuess
}

let turnWordToDashes = () => {
  let lettersArr = chosenWord.split('')
  let dashes = []

  lettersArr.forEach((letter) => { dashes.push(letter.replace(letter, '_')) })

  dashes = dashes.join(' ')

  return dashes
}

let renderDashes = () => {
  wordArea.innerHTML = ""
  let wordP = document.createElement("p")
  wordP.innerText = dashes

  wordArea.append(wordP)
}

let renderGameDisplay = () => {
  gameDisplay.innerHTML = ''
  let userStrikes = document.createElement("p")
  userStrikes.innerText = `Guesses remaining: ${strikes}`

  let previousGuesses = document.createElement("p")
  previousGuesses.className = "wrong-guesses"
  previousGuesses.innerText = `You have guessed: ${wrongGuesses}`

  gameDisplay.append(userStrikes, previousGuesses)
}

let userGuessHTML = () => {
  let userGuessForm = document.createElement("form")

  let userInputLabel = document.createElement("label")
  userInputLabel.innerText = "Enter a letter: "

  let userInputField = document.createElement("input")
  userInputField.name = "guess"

  let submitButton = document.createElement("button")
  submitButton.innerText = "Guess!"

  userGuessForm.append(userInputLabel, userInputField, submitButton)

  userGuess.append(userGuessForm)

  userGuessForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    if (strikes > 0 && dashes.includes("_")) {
      let userInput = evt.target.guess.value

      if ( chosenWord.toLowerCase().includes(userInput) ) {
        let arr = chosenWord.split("")
        let indexArr = []
        arr.forEach((letter, index) => { 
          if (letter === userInput) { 
            indexArr.push(index) 
          } 
        })

        let newDashes = dashes.split(" ")

        indexArr.forEach((index) => { newDashes[index] = userInput })

        dashes = newDashes.join(" ")
      }
      else {
        wrongGuesses.push(` ${userInput}`)

        strikes -= 1
      }
      renderGameDisplay()
      renderDashes()
      evt.target.reset()
      // change strikes/word before dropdown
      // set timer for windowalert
      if (strikes === 0) {
        let winDisplay = document.createElement("h2")
        winDisplay.innerText = "You've lost!"
        gameDisplay.append(winDisplay)
      } else if (!dashes.includes("_")) {
        let winDisplay = document.createElement("h2")
        winDisplay.innerText = "You've won!"
        gameDisplay.append(winDisplay)
      }
    }
  })  
}

let chosenWord = chooseWord()
let dashes = turnWordToDashes()
renderGameDisplay()
renderDashes()
userGuessHTML()