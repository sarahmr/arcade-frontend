// ---------- VARIABLES ----------------------------

let loginButton = document.querySelector("button.login")
let registerButton = document.querySelector("button.register")
let buttonArea = document.querySelector("div.button-area")
let loginView = document.querySelector(".login-view")

let mainContainer = document.querySelector(".main-container")
let sidebar = document.querySelector(".sidebar")
let gameContainer = document.querySelector(".game-container")
let gameArr = []
let currentUser = {}

let block = document.querySelectorAll(".block")
let userToken = "O"
let computerToken = "X"
let activePlayer = "O"
let blockArr = []
let gameStatus = "in progress"
let tttContainer = document.querySelector("#tictactoe")
let tttName = document.querySelector(".ttt-name")

let wordArea = document.querySelector(".word-display")
let userGuess = document.querySelector(".user-guess")
let sharkGameDisplay = document.querySelector(".shark-game-display")
let escapeName = document.querySelector(".escape-name")
let escapeContainer = document.querySelector(".escape-container")

// ---------------- LOG IN VIEW -------------------------

loginButton.addEventListener("click", (evt) => {
  buttonArea.innerHTML = ""

  let loginForm = document.createElement("form")

  let nameLabel = document.createElement("label")
  nameLabel.innerText = "Please enter your name:"

  let nameInput = document.createElement("input")
  nameInput.name = "username"

  let nameSubmit = document.createElement("button")
  nameSubmit.innerText = "Sign In"

  loginForm.append(nameLabel, nameInput, nameSubmit)
  buttonArea.append(loginForm)

  loginForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    fetch("http://localhost:3000/users/login",{
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        username: evt.target.username.value
      })
    })
    .then(res => res.json())
    .then((user) => {
      if (user.id) {
        currentUser = user
        renderSidebar(user)
        gamesFetch()
      } else {
        buttonArea.innerHTML = ""

        let errorMessage = document.createElement("h3")
        errorMessage.innerText = user.error

        buttonArea.append(errorMessage, registerButton)
      }
    })
    evt.target.reset()
  })
})

registerButton.addEventListener("click", (evt) => {
  buttonArea.innerHTML = ""

  let registerForm = document.createElement("form")

  let nameLabel = document.createElement("label")
  nameLabel.innerText = "Please enter your name:"

  let nameInput = document.createElement("input")
  nameInput.name = "username"

  let nameSubmit = document.createElement("button")
  nameSubmit.innerText = "Register"

  registerForm.append(nameLabel, nameInput, nameSubmit)
  buttonArea.append(registerForm)

  registerForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: evt.target.username.value
      })
    })
    .then(res => res.json())
    .then((user) => {
      if (user.id) {
        renderSidebar(user)
        gamesFetch()
      } 
      // else {

      //   let errorMessage = document.createElement("h3")
      //   errorMessage.innerText = user.error

      //   buttonArea.append(errorMessage)
      // }
    })
    evt.target.reset()
  })
})

// ------- SIDEBAR ------------------------------------

let renderSidebar = (userObj) => {
  loginView.style.display = "none"

  mainContainer.style.display = "grid"

  let appName = document.createElement("h1")
  appName.innerText = "Arcade"

  let userWelcome = document.createElement("h2")
  userWelcome.innerText = `Welcome ${userObj.name}`

  let statsButton = document.createElement("button")
  statsButton.innerText = "View Your Stats"

  let leaderboardButton = document.createElement("button")
  leaderboardButton.innerText = "Leaderboard"

  let favoritesButton = document.createElement("button")
  favoritesButton.innerText = "Your Favorites"

  let logoutButton = document.createElement("button")
  logoutButton.innerText = "Log Out"

  sidebar.append(appName, userWelcome, statsButton, leaderboardButton, favoritesButton, logoutButton)
}


// ------- Game Card View ------------------------------------

let gamesFetch = (user) => {
  fetch("http://localhost:3000/games")
  .then(res => res.json())
  .then((gameObjArr) => {
    gameArr = gameObjArr
    renderGameCards()
  })
}

let renderGameCards = () => {
  gameArr.forEach((gameObj) => {
    gameCardsHTML(gameObj)
  })
}


let gameCardsHTML = (gameObj) => {
  let gameCard = document.createElement("div")
  gameCard.className = "card"

  let gameName = document.createElement("h2")
  gameName.innerText = `${gameObj.name}`

  let gameImage = document.createElement("img")
  gameImage.src = `${gameObj.image}`

  let playButton = document.createElement("button")
  playButton.innerText = "Play!"
  playButton.id = `play-${gameObj.name.split(" ")[0]}`

  let gameLeaderboardButton = document.createElement("button")
  gameLeaderboardButton.innerText = "View Top Players"
  playButton.id = `leader-${gameObj.name.split(" ")[0]}`

  let faveGameButton = document.createElement("button")
  faveGameButton.innerText = "Add to Your Favorites"
  playButton.id = `fave-${gameObj.name.split(" ")[0]}`

  gameCard.append(gameName, gameImage, playButton, gameLeaderboardButton, faveGameButton)

  gameContainer.append(gameCard)

  playButton.addEventListener("click", (evt) => {
    gameContainer.innerHTML = ""

    if (gameObj.name === "Escape the Shark! (A Word Game)") {
      // render escape
      escapeContainer.style.display = "flex"
      gameContainer.append(escapeContainer)
    } else {
      // render tic tac toe
      tttContainer.style.display = "flex"
      gameContainer.append(tttContainer)
    }
  })

}

// ---------------- RENDER LEADERBOARD ---------------------------

// clear game container
// render leaderboard area (ordered list of users)
// fetch top ten users
// serializer here, need play sessions and user name
// display user name and number of games won








// ---------------- RENDER USER STATS ---------------------------









// -------------- RENDER GAME LEADERBOARD ------------------









// ------------- RENDER USER FAVORITES --------------------------









// ------- TIC TAC TOE ------------------------------

let moveEvent = (evt) => {
  if (gameStatus === "in progress" && evt.target.innerText === "") {
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
  let gameId = gameArr.find((g) => {return g.name === tttName.innerText}).id

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

      // FETCH
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
        console.log(psObj)
      })
    } else {
      message = "The computer has won."

      // FETCH
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
        console.log(psObj)
      })
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

    // FETCH
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
      console.log(psObj)
    })
  }
}



// ---------------------- Escape the Shark -------------------------

// 7. work on shark escape display
// 8. word library


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
  sharkGameDisplay.innerHTML = ''
  let userStrikes = document.createElement("p")
  userStrikes.innerText = `Guesses remaining: ${strikes}`

  let previousGuesses = document.createElement("p")
  previousGuesses.className = "wrong-guesses"
  previousGuesses.innerText = `You have guessed: ${wrongGuesses}`

  sharkGameDisplay.append(userStrikes, previousGuesses)
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

    let gameId = gameArr.find((g) => {return g.name === escapeName.innerText}).id

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
      if (strikes === 0) {
        let winDisplay = document.createElement("h2")
        winDisplay.innerText = "You've lost!"
        sharkGameDisplay.append(winDisplay)

        // FETCH
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
          console.log(psObj)
        })
      } else if (!dashes.includes("_")) {
        let winDisplay = document.createElement("h2")
        winDisplay.innerText = "You've won!"
        sharkGameDisplay.append(winDisplay)

        // FETCH 
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
          console.log(psObj)
        })
      }
    }
  })  
}

let chosenWord = chooseWord()
let dashes = turnWordToDashes()
renderGameDisplay()
renderDashes()
userGuessHTML()