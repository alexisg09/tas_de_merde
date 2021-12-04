function initGame(playerNumber) {
  getDeck(playerNumber);
  document.getElementById("game").innerHTML = '<div id="loader"></div><p>Distribution des cartes...</p>'
  timer = setInterval(loadingChecker, 500);
}

function loadingChecker() {
  if (gameInitialized) {
    document.getElementById("loader").remove();
    clearInterval(timer);
    document.getElementById("modal").remove();
    displayTurn('Player_1');
  }
}


function displayHand(playerName) {
  let buttonChecker = document.getElementById('okButton')

  if (buttonChecker) {
    buttonChecker.style.visibility = 'hidden';
  }

  let hand = showHand(playerName);
  hand.then(function (response) {
    var cardsZone = document.getElementById("cards")

    for (let i = 0; i < response.length; i++) {
      let myCard = document.createElement('img')
      myCard.id = response[i].code;
      myCard.src = response[i].images.png;
      let x = i;
      myCard.addEventListener("click", function () {
        onClickCard(playerName, response[x]);
        for (var i = document.images.length; i-- > 0;)
          document.images[i].parentNode.removeChild(document.images[i]);
      })
      cardsZone.appendChild(myCard);
    }
    checkIfWin(playerName);

  })
}

function onClickCard(playerName, card) {
  let indexNextPlayer;
  let index = parseInt(playerName.charAt(playerName.length - 1))
  if (index === nbPlayer) {
    indexNextPlayer = 1;
  } else {
    indexNextPlayer = index + 1
  }
  giveCard(card.code, playerName, playerName.replace(index, indexNextPlayer)) // cardName to give, playerFrom, playerTo
  checkIfWin(playerName);

  displayTurn(playerName.replace(index, indexNextPlayer))
  checkIfWin(playerName);
  checkIfWin(indexNextPlayer);


}

function displayTurn(player) {

  document.getElementById("game").innerHTML =
    '<h1>' + player + '</h1><h2>Ne laissez pas les autres joueurs regarder l écran</h2><p>Votre tour ! Choisissez une carte à donner à votre voisin</p>  <button id="okButton"">Ok !</button>'
  let btn = document.getElementById('okButton');
  if (btn) {
    btn.addEventListener("click", function () {
        displayHand(player);
      }
    )
  }
}


let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementById("close");

// When the user clicks the button, open the modal
if (btn) {
  btn.addEventListener("click", function () {
    modal.style.display = "block";
  })
}

// When the user clicks on <span> (x), close the modal
if (span) {
  span.addEventListener("click", function () {
    modal.style.display = "none";
  })
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
