// ---------------- LOG IN VIEW -------------------------
let loginButton = document.querySelector("button.login")
let registerButton = document.querySelector("button.register")
let buttonArea = document.querySelector("div.button-area")
let loginView = document.querySelector(".login-view")
let loginForm = document.querySelector(".login-form")
let registerForm = document.querySelector(".register-form")
let errorArea = document.querySelector("div.register-error")

loginButton.addEventListener("click", (evt) => {
  buttonArea.style.display = "none"
  loginForm.style.display = "flex"
})

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
      clearGameContainer()
      cardsView.style.display = "flex"
      favoritesFetch()
      cardsView.innerHTML = ""
      gamesFetch()
      currentView = "Cards View"
    } else {
      loginForm.style.display = "none"

      let errorMessage = document.createElement("h3")
      errorMessage.innerText = user.error

      errorArea.append(errorMessage, registerButton)
      errorArea.style.display = "flex"
    }
  })
  evt.target.reset()
})

registerButton.addEventListener("click", (evt) => {
  buttonArea.style.display = "none"
  errorArea.style.display = "none"
  registerForm.style.display = "flex"
})

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
      clearGameContainer()
      favoritesFetch()

      cardsView.style.display = "flex"
      cardsView.innerHTML = ""
      gamesFetch()
      currentView = "Cards View"
    } 
    // else {

    //   let errorMessage = document.createElement("h3")
    //   errorMessage.innerText = user.error

    //   buttonArea.append(errorMessage)
    // }
  })
  evt.target.reset()
})