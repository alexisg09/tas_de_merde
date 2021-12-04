const getDeckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?cards="

let deckId = null;
const threePlayerDeck = "JS,JD,JC,JH,QS,QD,QC,QH,KS,KD,KC,KH";
const fourPlayerDeck = "JS,JD,JC,JH,QS,QD,QC,QH,KS,KD,KC,KH,AS,AD,AC,AH";
const fivePlayerDeck = "JS,JD,JC,JH,QS,QD,QC,QH,KS,KD,KC,KH,AS,AD,AC,AH,0S,0D,0C,0H";
// SDCH --> colors
// JQK --> heads
// 1 - 10 --> nbs
let nbPlayer = null;
let cardsRemaining = null;

let gameInitialized = false;
let timer = null;


async function getDeck(playerNumber) {
  nbPlayer = playerNumber;
  let nbPlayerDeck = 0;
  switch (nbPlayer) {
    case 3:
      nbPlayerDeck = threePlayerDeck;
      cardsRemaining = 12;
      break;
    case 4:
      nbPlayerDeck = fourPlayerDeck;
      cardsRemaining = 16;
      break;
    case 5:
      nbPlayerDeck = fivePlayerDeck;
      cardsRemaining = 20;
      break;
    default:
      console.log('Quelque chose de mauvais s est passé dans le choix du nombre de joueurs');
  }

  await fetch(getDeckUrl + nbPlayerDeck, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      console.error('error');
    }
  }).then(async function (response) {
    deckId = response.deck_id;
    await distributeCards(nbPlayer);
    showHand('Player_1')
    showHand('Player_2')
    showHand('Player_3')
    gameInitialized = true;
    return response;

  }).catch(function (error) {
    console.error(error);
  })
}

async function addCardToHand(deckId, handName, cardName) {
  await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + handName + "/add/?cards=" + cardName, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      console.error('error');
    }
  }).then(function (response) {
  }).catch(function (error) {
    console.error(error);
  })
}

async function drawCard(deckId, playerName) {
  return await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1", {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      console.error('error');
    }
  }).then(async function (response) {
    await addCardToHand(deckId, playerName, response.cards[0].code)
  }).catch(function (error) {
    console.error(error);
  })
}

async function distributeCards(nbPlayer) {
  let i = 0;
  let j = 1;
  while (i < 4) {
    while (j <= nbPlayer) {
      await drawCard(deckId, "Player_" + j);
      j++;
    }
    i++;
    j = 1;
  }

}

function showHand(handName) {
  return fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + handName + "/list/"
    , {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      console.error('error');
    }
  }).then(function (response) {
    let hand = response.piles[handName].cards;
    return hand;
  }).catch(function (error) {
    console.error(error);
  })
}

function showDeck() {
  fetch("https://deckofcardsapi.com/api/deck/" + deckId, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      console.error('error');
    }
  }).then(function (response) {
    return response;

  }).catch(function (error) {
    console.error(error);
  })
}

function giveCard(cardName, playerFrom, playerTo) {
  fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerFrom + "/draw/?cards= " + cardName, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      console.error('error');
    }
  }).then(function (response) {
    addCardToHand(deckId, playerTo, cardName);
  }).catch(function (error) {
    console.error(error);
  })
}

function allEqual(arr) {
  return arr.every(val => val === arr[0]);
}

function strayValues(arr) {
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[0]) {
      arr.splice(i, 1);
      return allEqual(arr);
    }
  }
  return allEqual(arr);
}

async function checkIfWin(playerName) {
  let currentHand = showHand(playerName);
  let checker = [];
  await currentHand.then(function (response) {
    response.forEach((element) => {
      checker.push(element.code.charAt(0));
    })
  })
  if (strayValues(checker) && checker.length === 4) {
    if (window.confirm(playerName + " a remporté la partie !")) {
      location.reload();
    }
  }
}


