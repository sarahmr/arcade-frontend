// ---------------- Escape the Shark -----------------------

// 7. work on shark escape display
// 8. word library

let wordArea = document.querySelector(".word-display")
let userGuess = document.querySelector(".user-guess")
let sharkGameDisplay = document.querySelector(".shark-game-display")
let escapeName = document.querySelector(".escape-name")
let escapeContainer = document.querySelector(".escape-container")
let endPlayEscape = document.querySelector(".end-play-escape")
let newEscapeButton = document.querySelector(".new-escape-game")

let words = ["hunger", "dangerous", "happy", "cat", "dictionary"]
let strikes = 6
let wrongGuesses = []

let chooseWord = () => {
  let wordToGuess = words[Math.floor(Math.random() * words.length)] 
  return wordToGuess
}

let turnWordToDashes = (chosenWord) => {
  let lettersArr = chosenWord.split('')
  let dashes = []

  lettersArr.forEach((letter) => { dashes.push(letter.replace(letter, '_')) })

  dashes = dashes.join(' ')

  return dashes
}

let renderDashes = (dashes) => {
  wordArea.innerHTML = ""
  let wordP = document.createElement("p")
  wordP.innerText = dashes

  wordArea.append(wordP)
}

let renderGameDisplay = () => {
  sharkGameDisplay.innerHTML = ''
  let userStrikes = document.createElement("p")
  userStrikes.innerText = `Guesses remaining: ${strikes}`

  let previousGuesses = document.createElement("p")
  previousGuesses.className = "wrong-guesses"
  previousGuesses.innerText = `You have guessed: ${wrongGuesses}`

  sharkGameDisplay.append(userStrikes, previousGuesses)
}

let userGuessHTML = (chosenWord, dashes) => {
  userGuess.innerHTML = ""

  let dashes1 = dashes

  let chosenWord1 = chosenWord

  let userGuessForm = document.createElement("form")

  let userInputLabel = document.createElement("label")
  userInputLabel.innerText = "Enter a letter: "

  let userInputField = document.createElement("input")
  userInputField.name = "guess"
  userInputField.maxLength = 1

  let submitButtonDiv = document.createElement("div")

  let submitButton = document.createElement("button")
  submitButton.innerText = "Guess!"

  userGuessForm.append(userInputLabel, userInputField, submitButton)

  userGuess.append(userGuessForm)

  userGuessForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    let gameId = gameArr.find((g) => {return g.name === escapeName.innerText}).id

    if (strikes > 0 && dashes1.includes("_")) {
      let userInput = evt.target.guess.value

      if ( chosenWord1.toLowerCase().includes(userInput) ) {
        let arr = chosenWord.split("")
        let indexArr = []
        arr.forEach((letter, index) => { 
          if (letter === userInput) { 
            indexArr.push(index) 
          } 
        })

        let newDashes = dashes1.split(" ")

        indexArr.forEach((index) => { newDashes[index] = userInput })

        dashes1 = newDashes.join(" ")
      }
      else {
        wrongGuesses.push(` ${userInput}`)

        strikes -= 1
      }
      renderGameDisplay()
      renderDashes(dashes1)
      evt.target.reset()
      if (strikes === 0) {
        fetch("http://localhost:3000/play_sessions", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            game_id: gameId,
            user_win: false
          })
        })
        .then(res => res.json())
        .then((psObj) => {
          userGuess.style.display = "none"
          let message = "You were eaten!"
          endEscapeGameDisplay(message)

        })
      } else if (!dashes1.includes("_")) {
        fetch("http://localhost:3000/play_sessions", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            game_id: gameId,
            user_win: true
          })
        })
        .then(res => res.json())
        .then((psObj) => {
          userGuess.style.display = "none"
          let message = "You got away!"
          endEscapeGameDisplay(message)
        })
      }
    }
  })  
}

let playEscape = () => {
  userGuess.style.display = "flex"
  endPlayEscape.style.display = "none"
  let chosenWord = chooseWord()
  let dashes = turnWordToDashes(chosenWord)
  strikes = 6
  wrongGuesses = []
  renderGameDisplay()
  renderDashes(dashes)
  userGuessHTML(chosenWord, dashes)
}


let endEscapeGameDisplay = (message) => {
  endPlayEscape.style.display = "flex"

  let winDisplay = document.querySelector(".win-escape")
  winDisplay.innerText = message
}

newEscapeButton.addEventListener("click", (evt) => {
  playEscape()
})