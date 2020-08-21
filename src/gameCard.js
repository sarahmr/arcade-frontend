// ------- Game Card View ------------------------------
let gameContainer = document.querySelector(".game-container")
let gameArr = []
let allFavesArr = []
let cardsView = document.querySelector(".cards-view")


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
  gameImage.id = `image-${gameObj.name.split(" ")[0]}`

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

  cardsView.append(gameCard)

  playButton.addEventListener("click", (evt) => {
    clearGameContainer()

    if (gameObj.name === "Escape the Shark! (A Word Game)") {
      // render escape
      escapeContainer.style.display = "flex"
      playEscape()
      currentView = "Play Escape View"
    } else {
      // render tic tac toe
      tttContainer.style.display = "flex"
      newTTTGame()
      currentView = "Play TTT View"
    }
  })

  let game = gameObj

  gameLeaderboardButton.addEventListener("click", (evt) => {
    clearGameContainer()

    let gameLeadersTitle = document.querySelector("h2.game-table-title")
    gameLeadersTitle.innerText = `Top Players: ${game.name}`

    renderGameLeaders(game)
    gameLeaderBoard.style.display = "flex"
    currentView = `${game.name} View`
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

        if (currentView === "Favorites View") {
          cardsView.innerHTML = ""

          gameArr.forEach((game) => {
            if (allFavesArr.find((fave) => { return fave.game_id === game.id && fave.user_id === currentUser.id })) {
              gameCardsHTML(game)
            }
          })
        }
      })
      faveGameButton.innerText = "Add to Your Favorites"
    }


  })
}