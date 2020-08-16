let mainArea = document.querySelector("main")
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
// 8. work on separating winning or losing from event listener


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
    let guesses = document.querySelector(".wrong-guesses")

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
        console.log(dashes)
      }
      else {
        wrongGuesses.push(` ${userInput}`)

        strikes -= 1
      }
      renderGameDisplay()
      renderDashes()
      evt.target.reset()
      return dashes
    }
    else if (strikes === 0) {
      renderGameDisplay()
      renderDashes()
      window.alert("You've lost!")
      // remove event listener and say you've lost the game -- get this outside of the submit event
    }
    else {
      renderGameDisplay()
      renderDashes()
      window.alert("You've won!")
      // remove event listener and say you've won the game -- get this outside of the submit event
    }
  })  
}

let chosenWord = chooseWord()
console.log(chosenWord)
let dashes = turnWordToDashes()
renderGameDisplay()
renderDashes()
userGuessHTML()
