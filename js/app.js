/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//var cards;
//var score;
var stars = 5;
var currentStars = 5;
var moves = 0;
var actualTime;
var cardsFlipped = [];
var cardsMatched = 0;
var clockID = null;
var firstClick = true;
var timer = [0, 0, 0, 0];
var interval;
var timerRunning = false;

const CLOCK = document.querySelector(".clock");
const MOVES = document.querySelector(".moves");
const STARSET = document.querySelectorAll(".stars li");
const DECK = document.querySelector(".deck");
const RESTART = document.querySelector(".restart");
const SUCCESS = document.querySelector(".success");
const FINAL = document.querySelector(".final-score");
const PLAYAGAIN = document.querySelector(".play-again");
const CARDSET = [
	"diamond",
	"diamond",
	"paper-plane-o",
	"paper-plane-o",
	"anchor",
	"anchor",
	"bolt",
	"bolt",
	"cube",
	"cube",
	"leaf",
	"leaf",
	"bicycle",
	"bicycle",
	"bomb",
	"bomb"
];

function updateStars() {
	if (moves > 12 && moves <= 16) {
		currentStars = 4;
		if (currentStars != stars) {
			STARSET[currentStars].classList.add("hide");
		}
	}
	if (moves > 16 && moves <= 20) {
		currentStars = 3;
		if (currentStars != stars) {
			STARSET[currentStars].classList.add("hide");
		}
	}
	if (moves > 20 && moves <= 24) {
		currentStars = 2;
		if (currentStars != stars) {
			STARSET[currentStars].classList.add("hide");
		}
	}
	if (moves > 24) {
		currentStars = 2;
		if (currentStars != stars) {
			STARSET[currentStars].classList.add("hide");
		}
	}
	if (moves > 30) {
		currentStars = 1;
		if (currentStars != stars) {
			STARSET[currentStars].classList.add("hide");
		}
	}
}

// Add a leading zero to single digit numbers for nicely formatted display.
function leadingZero(time) {
	if (time <= 9) {
		time = "0" + time;
	}
	return time;
}

// Run a timer with mins, secs and hundredths of secs.
function runClock() {
	let currentTime =
		leadingZero(timer[0]) +
		":" +
		leadingZero(timer[1]) +
		":" +
		leadingZero(timer[2]);
	CLOCK.innerHTML = currentTime;

	/* We are running this 100 times per second.
	so 100cs = 1000ms and 1cs = 10ms
	Example:
	60000ms * (100cs / 1000ms)= 6000cs or  1 min
	6000cs * (1m / 6000cs) = 60secs or 1 min
	use Math.floor to drop any remainder in division.
	timer[3] keeps the total number of cs counted
	*/

	timer[3]++;

	// timer[0] is number of minutes - so 1 minute is 6000cs
	timer[0] = Math.floor(timer[3] / 6000);

	// timer[1] is number of seconds
	// 6000cs / 100 = 60 - 60 = 0
	timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);

	// timer[2] is number of 100th seconds.

	timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
}

function showMoves() {
	MOVES.innerHTML = moves;
	updateStars();
}

function addListeners() {
	DECK.addEventListener("click", function(e) {
		//	e.preventDefault();
		// if (e.target && e.target.classList !== "front") {
		// 	console.log("Click Other Target:", e.target);
		// }
		// if our target is front and we have less than 2 cards flipped.
		if (
			// e.target &&
			e.target.classList == "front" &&
			cardsFlipped.length < 2
		) {
			// first click of the game - start the timer.
			if (firstClick) {
				startTimer();
				firstClick = false;
			}
			// set card to be target parent.
			card = e.target.parentElement;
			//console.log("Click Parent:", card);

			if (!card.classList.contains("match") && cardsFlipped.length < 2) {
				if (!card.classList.contains("flipped")) {
					cardsFlipped.push(card);
					card.classList.add("flipped");
				}
			}
			// Ok - we have two cards flipped - so let's check for a match.
			if (cardsFlipped.length == 2) {
				// increment moves and show them.
				moves++;
				showMoves();

				if (
					cardsFlipped[0].getAttribute("data-card") ==
					cardsFlipped[1].getAttribute("data-card")
				) {
					// cards match so add match class.
					cardsFlipped[0].classList.add("match");
					cardsFlipped[1].classList.add("match");
					setTimeout(function() {
						cardsFlipped[0].classList.add("animated", "rubberBand");
						cardsFlipped[1].classList.add("animated", "rubberBand");
					}, 100);
					// Keep track of number of cards matched. 16 is a win.
					cardsMatched = cardsMatched + 2;

					setTimeout(function() {
						cardsFlipped[0].classList.remove(
							"flipped",
							"animated",
							"rubberBand"
						);
						cardsFlipped[1].classList.remove(
							"flipped",
							"animated",
							"rubberBand"
						);
						cardsFlipped = [];
						if (cardsMatched == 16) {
							// Winner!
							endGame();
						}
					}, 1000);
				} else {
					// not a match
					cardsFlipped[0].classList.add("mismatched");
					cardsFlipped[1].classList.add("mismatched");
					setTimeout(function() {
						cardsFlipped[0].classList.add("animated", "wobble");
						cardsFlipped[1].classList.add("animated", "wobble");
					}, 100);

					setTimeout(function() {
						if (cardsFlipped.length == 2) {
							cardsFlipped[0].classList.remove(
								"flipped",
								"animated",
								"wobble",
								"mismatched"
							);
							cardsFlipped[1].classList.remove(
								"flipped",
								"animated",
								"wobble",
								"mismatched"
							);
							cardsFlipped = [];
						}
					}, 1000);
				}
			}
		}
	});
}

// Timer functions
function startTimer() {
	// Run this 100 times per second
	clockID = setInterval(runClock, 10);
}

function stopTimer() {
	timerRunning = false;
	clearInterval(clockID);
	actualTime = CLOCK.innerHTML;
}

function resetTimer() {
	time = 0;
	CLOCK.innerHTML = "00:00:00";
}

// Game functions

function resetGame() {
	// reset cards, score and timer.
	stopTimer();
	resetTimer();
	resetStars();
	moves = 0;
	timer = [0, 0, 0, 0];
	timerRunning = false;
	cardsFlipped = [];
	cardsMatched = 0;
	firstClick = true;
	DECK.classList.remove("hide");
	SUCCESS.classList.remove("show");
	showMoves();
	loadCards();
	//addListeners();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
// Card functions
function generateCard(card) {
	return `<li data-card="${card}" class="card"><div class="front"></div><div class="back"><i class="fa fa-${card}"></div></i></li>`;
}

function loadCards() {
	var cardsHTML = shuffle(
		CARDSET.map(function(card) {
			return generateCard(card);
		})
	);

	DECK.innerHTML = cardsHTML.join(" ");

	cards = DECK.querySelectorAll(".card");
	cards.forEach(function(card) {
		card.classList.add("animated", "bounceInDown");
	});
	setTimeout(function() {
		cards.forEach(function(card) {
			card.classList.remove("animated", "bounceInDown");
		});
	}, 3000);
}

function resetStars() {
	for (var i = 0; i < 5; i++) {
		STARSET[i].classList.remove("hide");
	}
}

function endGame() {
	stopTimer();
	FINAL.innerHTML = `<span>Time elapsed ${actualTime}</span>
	<span>in ${moves} Moves and earning ${currentStars} Stars</span>`;
	DECK.classList.add("hide");
	PLAYAGAIN.classList.toggle("hide");
	PLAYAGAIN.classList.add("animated", "fadeInUp");
	SUCCESS.classList.add("show");
	playAgain = setTimeout(function() {
		PLAYAGAIN.classList.toggle("hide");
	}, 2000);
	playAgain = setTimeout(function() {
		PLAYAGAIN.classList.remove("animated", "fadeInUp");
	}, 4000);
}

// Initialize Game
function initGame() {
	// load game to start over.

	RESTART.addEventListener("click", function(e) {
		resetGame();
	});
	PLAYAGAIN.addEventListener("click", function(e) {
		resetGame();
	});
	resetGame();
	addListeners();
}

initGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "flipped" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the flipped position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
