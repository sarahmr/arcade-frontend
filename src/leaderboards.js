// ---------------- RENDER LEADERBOARD ---------------------
let leaderBoard = document.querySelector(".leaderboard")
let leadersArr =[]
let leaderTable = document.querySelector(".site-leaders")

let userStats = document.querySelector(".user-stats")
let statsTable = document.querySelector(".stats-table")

let gameLeaderBoard = document.querySelector(".game-leaderboard")
let gameLeaderTable = document.querySelector(".game-leaders")
let gameLeaders = []

// ---------- site leaderboard ---------------------

let renderLeaderboard = () => {
  leaderTable.innerHTML = ""
  leaderHeaders()
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

let leaderHeaders = () => {
  let tableHeaderRow = document.createElement("tr")

  let placeHeader = document.createElement("th")
  placeHeader.innerText = "Place"

  let playerHeader = document.createElement("th")
  playerHeader.innerText = "Player"

  let winsHeader = document.createElement("th")
  winsHeader.innerText = "Wins"

  tableHeaderRow.append(placeHeader, playerHeader, winsHeader)

  leaderTable.append(tableHeaderRow)
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


// ---------------- RENDER USER STATS ---------------------

let renderStats = () => {
  statsTable.innerHTML = ""
  statsHeaders()
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

let statsHeaders = () => {
  let tableHeaderRow = document.createElement("tr")

  let placeHeader = document.createElement("th")
  placeHeader.innerText = "Game"

  let playerHeader = document.createElement("th")
  playerHeader.innerText = "Games Played"

  let winsHeader = document.createElement("th")
  winsHeader.innerText = "Total Wins"

  tableHeaderRow.append(placeHeader, playerHeader, winsHeader)

  statsTable.append(tableHeaderRow)
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