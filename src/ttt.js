let block = document.querySelectorAll(".block")
let userToken = "O"
let computerToken = "X"
let activePlayer = "O"
let blockArr = []
let gameStatus = "in progress"
let tttContainer = document.querySelector("#tictactoe")
let tttName = document.querySelector(".ttt-name")
let endTTT = document.querySelector(".end-ttt")
let newTTTButton = document.querySelector(".new-ttt-game")

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
    gameStatus = "over"

    if (activePlayer === userToken) {
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
        let message = "You have won!"
        endTTTGameDisplay(message)
      })
    } else {
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
        let message = "The computer has won."
        endTTTGameDisplay(message)
      })
    }
    
  } else if (!blockArr.find((block) => { return block.innerText === "" })) {
    gameStatus = "over"

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
      let message = "This is a draw!"
      endTTTGameDisplay(message)
    })
  }
}

let newTTTGame = () => {
  endTTT.style.display = "none"
  gameStatus = "in progress"
  blockArr.forEach((block) => { block.innerHTML = "" })
}


let endTTTGameDisplay = (message) => {
  endTTT.style.display = "flex"

  let winTTT = document.querySelector(".win-ttt")
  winTTT.innerText = message
}

newTTTButton.addEventListener("click", (evt) => {
  newTTTGame()
})
