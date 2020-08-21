// ------- SIDEBAR ------------------------------------
let mainContainer = document.querySelector(".main-container")
let sidebar = document.querySelector(".sidebar")
let currentUser = {}
let currentView = "Login View"
let nameChangeForm = document.querySelector(".name-change")
let userWelcome = document.querySelector("h2.user-welcome")
let statsButton = document.querySelector(".stats-button")
let leaderboardButton = document.querySelector(".leaderboard-button")
let favoritesButton = document.querySelector(".favorites-button")
let settingsButton = document.querySelector(".settings-button")
let logoutButton = document.querySelector(".log-out-button")
let deleteAccountButton = document.querySelector(".delete-button")
let gamesButton = document.querySelector(".all-games")
let backButtonColl = document.querySelectorAll(".back-button")
let settingsView = document.querySelector(".settings")
let backButtonDisplay = document.querySelector(".back-button-display")

let renderSidebar = (userObj) => {
  loginView.style.display = "none"
  mainContainer.style.display = "grid"

  userWelcome.innerText = `Welcome, ${userObj.name}`
}

leaderboardButton.addEventListener("click", (evt) => {
  currentView = "Leader View"
  clearGameContainer()
  leaderBoard.style.display = "flex"
  renderLeaderboard()
})

gamesButton.addEventListener("click", (evt) => {
  currentView = "Cards View"

  if (currentView === "Cards View") {
    clearGameContainer()
    cardsView.style.display = "flex"
    if (cardsView.children.length < gameArr.length) {
      cardsView.innerHTML = ""
      renderGameCards()
    }
  }
})

statsButton.addEventListener("click", (evt) => {
  currentView = "Stats View"
  clearGameContainer()
  userStats.style.display = "flex"

  let tableTitle = document.querySelector("h2.user-stats-name")
  tableTitle.innerText = `${currentUser.name}'s Stats`

  renderStats()
})

favoritesButton.addEventListener("click", (evt) => {
  currentView = "Favorites View"
  if (currentView === "Favorites View") {
    clearGameContainer()
    cardsView.style.display = "flex"
    cardsView.innerHTML = ""
    gameArr.forEach((game) => {
      if (allFavesArr.find((fave) => { return fave.game_id === game.id && fave.user_id === currentUser.id })) {
        gameCardsHTML(game)
      } else {
        // a box with a message about having no favorites
      }
    })
  }
})

settingsButton.addEventListener("click", (evt) => {
  currentView = "Settings View"
  clearGameContainer()
  settingsView.style.display = "flex"
  // nameChangeForm.style.display = "flex"
})

logoutButton.addEventListener("click", (evt) => {
  currentView = "Login View"
  mainContainer.style.display = "none"
  currentUser = {}

  loginForm.style.display = "none"
  registerForm.style.display = "none"

  buttonArea.style.display = "flex"
  loginView.style.display = "flex"
})

deleteAccountButton.addEventListener("click", (evt) => {
  currentView = "Login View"
  fetch(`http://localhost:3000/users/${currentUser.id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then((userObj) => {
    currentUser = {}
    mainContainer.style.display = "none"
    loginForm.style.display = "none"
    registerForm.style.display = "none"

    buttonArea.style.display = "flex"
    loginView.style.display = "flex"
  })
})

// ------------- RENDER USER FAVORITES --------------------

let favoritesFetch = () => {
  fetch(`http://localhost:3000/favorites`)
  .then(res => res.json())
  .then((faveObjArr) => {
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
    userWelcome.innerText  = `Welcome, ${currentUser.name}`
    evt.target.reset()
    clearGameContainer()
    cardsView.style.display = "flex"
  })
})

// ----------- display helper function ---------------

let clearGameContainer = () => {
  for (let i = 0; i < gameContainer.children.length; i++) {
    gameContainer.children[i].style.display = "none"
  }
}

// ---------------------------------------------------

for (i = 0; i < backButtonColl.length; i++){
  backButtonColl[i].addEventListener("click", (evt) => {
    currentView = "Cards View"
  
    if (currentView === "Cards View") {
      clearGameContainer()
      cardsView.style.display = "flex"
      if (cardsView.children.length < gameArr.length) {
        cardsView.innerHTML = ""
        renderGameCards()
      }
    }
  })
}