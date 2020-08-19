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
let allFavesArr = []

let leaderBoard = document.querySelector(".leaderboard")
let leadersArr =[]
let leaderTable = document.querySelector(".site-leaders")

let userStats = document.querySelector(".user-stats")
let statsTable = document.querySelector(".stats-table")

let gameLeaderBoard = document.querySelector(".game-leaderboard")
let gameLeaderTable = document.querySelector(".game-leaders")
let gameLeaders = []

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

let nameChangeForm = document.querySelector(".name-change")

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
        favoritesFetch()
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
        currentUser = user
        renderSidebar(user)
        favoritesFetch()
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
  userWelcome.innerText = `Welcome, ${userObj.name}`
  userWelcome.id = "current-user"

  let statsButton = document.createElement("button")
  statsButton.innerText = "View Your Stats"

  let leaderboardButton = document.createElement("button")
  leaderboardButton.innerText = "Leaderboard"

  let favoritesButton = document.createElement("button")
  favoritesButton.innerText = "Your Favorites"

  let changeNameButton = document.createElement("button")
  changeNameButton.innerText = "Change Name"

  let logoutButton = document.createElement("button")
  logoutButton.innerText = "Log Out"

  let deleteAccountButton = document.createElement("button")
  deleteAccountButton.innerText = "Delete Account"

  sidebar.append(appName, userWelcome, statsButton, leaderboardButton, favoritesButton, changeNameButton, logoutButton, deleteAccountButton)

  leaderboardButton.addEventListener("click", (evt) => {
    gameContainer.innerHTML = ""

    renderLeaderboard()
    gameContainer.append(leaderBoard)
    leaderBoard.style.display = "flex"
  })

  appName.addEventListener("click", (evt) => {
    gameContainer.innerHTML = ""
    gamesFetch()
  })


  statsButton.addEventListener("click", (evt) => {
    gameContainer.innerHTML = ""

    gameContainer.append(userStats)

    let tableTitle = document.createElement("h2")
    tableTitle.innerText = `${currentUser.name}'s Stats`
    userStats.prepend(tableTitle)

    userStats.style.display = "flex"
    renderStats()
  })

  favoritesButton.addEventListener("click", (evt) => {
    gameContainer.innerHTML = ""

    gameArr.forEach((game) => {
      if (allFavesArr.find((fave) => { return fave.game_id === game.id && fave.user_id === currentUser.id })) {
        gameCardsHTML(game)
      }
    })
  })

  changeNameButton.addEventListener("click", (evt) => {
    gameContainer.innerHTML = ""

    nameChangeForm.style.display = "flex"
    gameContainer.append(nameChangeForm)
  })

  logoutButton.addEventListener("click", (evt) => {
    sidebar.innerHTML = ""
    gameContainer.innerHTML = ""
    currentUser = {}
    loginView.style.display = "flex"
  })

  deleteAccountButton.addEventListener("click", (evt) => {
    // delete in memory, delete from database
    fetch(`http://localhost:3000/users/${currentUser.id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then((userObj) => {
      currentUser = {}
      console.log(userObj)
      sidebar.innerHTML = ""
      gameContainer.innerHTML = ""
      loginView.style.display = "flex"
    })
  })
}


// ------- Game Card View ------------------------------------

let gamesFetch = () => {
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
  gameLeaderboardButton.id = `leader-${gameObj.name.split(" ")[0]}`

  let faveGameButton = document.createElement("button")

  if (allFavesArr.filter((fave) => { return currentUser.id === fave.user_id && fave.game_id === gameObj.id }).length > 0) {
    faveGameButton.innerText = "Remove from Your Favorites"
  } else {
    faveGameButton.innerText = "Add to Your Favorites"
  }

  faveGameButton.id = `fave-${gameObj.name.split(" ")[0]}`

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

  let game = gameObj

  gameLeaderboardButton.addEventListener("click", (evt) => {
    gameContainer.innerHTML = ""

    gameContainer.append(gameLeaderBoard)
    renderGameLeaders(game)
    gameLeaderBoard.style.display = "flex"
  })

  faveGameButton.addEventListener("click", (evt) => {
    if (faveGameButton.innerText === "Add to Your Favorites") {

      fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          game_id: game.id
        })
      })
      .then(res => res.json())
      .then((faveObj) => {
        allFavesArr.push(faveObj)
      })

      faveGameButton.innerText = "Remove from Your Favorites"
    } else {
      let faveid = allFavesArr.find((fave) => { return currentUser.id === fave.user_id && fave.game_id === game.id }).id

      fetch(`http://localhost:3000/favorites/${faveid}`, {
        method: "DELETE"
      })
      .then(res => res.json())
      .then((obj) => {
        allFavesArr = allFavesArr.filter((fave) => { return fave.id !== obj.id} )
      })

      faveGameButton.innerText = "Add to Your Favorites"
    }


  })
}

// ---------------- RENDER LEADERBOARD ---------------------------

let renderLeaderboard = () => {
  fetchPS()
}

let fetchPS = () => {
  fetch("http://localhost:3000/users/leaderboard")
  .then(res => res.json())
  .then((leaderObjArr) => {
    leadersArr = leaderObjArr
    leadersArr.forEach((leader) => {
      leadersHTML(leader)
    })
  }) 
}

let leadersHTML = (leaderObj) => {
  let leaderTableRow = document.createElement("tr")

  let placeData = document.createElement("td")
  placeData.innerText = leadersArr.indexOf(leaderObj) + 1

  let nameData = document.createElement("td")
  nameData.innerText = leaderObj.name

  let winData = document.createElement("td")
  winData.innerText = leaderObj.wins

  leaderTableRow.append(placeData, nameData, winData)

  leaderTable.append(leaderTableRow)
}


// ---------------- RENDER USER STATS ---------------------------

let renderStats = () => {
  fetchStats()
}

let fetchStats = () => {
  fetch(`http://localhost:3000/users/${currentUser.id}/stats`)
  .then(res => res.json())
  .then((statObjArr) => {
    statObjArr.forEach((statObj) => {
      statsHTML(statObj)
    })
  })
}

let statsHTML = (statObj) => {
  let statsTableRow = document.createElement("tr")

  let gameName = document.createElement("td")
  gameName.innerText = statObj.game_name

  let playsTotal = document.createElement("td")
  playsTotal.innerText = statObj.total_games

  let winsTotal = document.createElement("td")
  winsTotal.innerText = statObj.total_wins

  statsTableRow.append(gameName, playsTotal, winsTotal)

  statsTable.append(statsTableRow)
}

// -------------- RENDER GAME LEADERBOARD ------------------

let renderGameLeaders = (game) => {
  gameLeaderTable.innerHTML = ""

  let gameLeadersTitle = document.createElement("h2")
  gameLeadersTitle.innerText = `Top Players: ${game.name}`
  gameLeadersTitle.className = "title"
  gameLeaderBoard.prepend(gameLeadersTitle) 

  gameLeaderHeaders()

  gameLeaderfetch(game)
}

let gameLeaderHeaders = () => {
  let tableHeaderRow = document.createElement("tr")

  let placeHeader = document.createElement("th")
  placeHeader.innerText = "Place"

  let playerHeader = document.createElement("th")
  playerHeader.innerText = "Player"

  let winsHeader = document.createElement("th")
  winsHeader.innerText = "Wins"

  tableHeaderRow.append(placeHeader, playerHeader, winsHeader)

  gameLeaderTable.append(tableHeaderRow)
}

let gameLeaderfetch = (game) => {
  fetch(`http://localhost:3000/games/${game.id}/top_players`)
  .then(res => res.json())
  .then((gameLeadersArr) => {
    gameLeaders = gameLeadersArr
    gameLeaders.forEach((gLObj) => {
      gameLeadersHTML(gLObj)
    })
  })
}

let gameLeadersHTML = (gLObj) => {
  let gameLeaderRow = document.createElement("tr")
  
  let userPlace = document.createElement("td")
  userPlace.innerText = gameLeaders.indexOf(gLObj) + 1

  let userName = document.createElement("td")
  userName.innerText = gLObj.user

  let userWins = document.createElement("td")
  userWins.innerText = gLObj.wins

  gameLeaderRow.append(userPlace, userName, userWins)

  gameLeaderTable.append(gameLeaderRow)
}

// ------------- RENDER USER FAVORITES --------------------------

let favoritesFetch = () => {
  fetch(`http://localhost:3000/favorites`)
  .then(res => res.json())
  .then((faveObjArr) => {
    console.log(faveObjArr)
    allFavesArr = faveObjArr
  })
}


// ------------ name change -----------------------------

nameChangeForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  fetch(`http://localhost:3000/users/${currentUser.id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      newName: evt.target["new-name"].value
    })
  })
  .then(res => res.json())
  .then((userObj) => {
    currentUser = userObj
    evt.target.reset()
    let user = document.querySelector("#current-user")
    user.innerText  = `Welcome, ${currentUser.name}`
    gameContainer.innerHTML = ""
    renderGameCards()
  })
})

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