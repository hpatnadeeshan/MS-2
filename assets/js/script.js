document.addEventListener("DOMContentLoaded", () => {
    const cards = [
        { type: 'carrot', image: 'carrot.png', score: 10 },
        { type: 'trap', image: 'trap.png', score: -5 },
    ];
    const loseCard = { type: "dog", score: 0, image: "dog.png" };
    const maxLevel = 15;
    const cardsEachLevel = [6, 6, 6, 9, 9, 9, 9, 9, 12, 12, 12, 12, 12, 15, 15];

    let score = 0;
    let level = 1;
    let flippedCards = [];
    let canClick = false;
    let numCarrotCards;
    let carrotMatchCount = 0;

    // Function to shuffle the cards

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to select random cards for the game(only select carrots and traps & only select half number of total cards)

    function selectCards(totalCount) {
        const selectedCards = [];

        // Ensure each card type is selected at least once
        cards.forEach(card => {
            selectedCards.push(card);
        });

        let remainingCount = totalCount - selectedCards.length * 2;

        // allocate a place from the array for dog cards

        if (totalCount === 9) {
            remainingCount -= 1;
        } else if (totalCount === 12) {
            remainingCount -= 2;
        } else if (totalCount === 15) {
            remainingCount -= 3;
        }

        // Select remaining random cards

        for (let i = 0; i < remainingCount / 2; i++) {
            randomNum = Math.random() * cards.length;
            const randomIndex = Math.floor(randomNum);
            selectedCards.push(cards[randomIndex]);
            // console.log(randomNum);
        }
        //Number of carrot cards

        numCarrotCards = selectedCards.filter(card => card.type === 'carrot').length;

        // console.log(selectedCards);
        return selectedCards;
    }
    // Function to assign random images to cards
    function assignRandomImages(level) {
        const levelCards = cardsEachLevel[level - 1];

        //  Select random cards
        const selectedRandomCards = selectCards(levelCards);
        // console.log(selectedRandomCards);

        const allCards = selectedRandomCards.concat(selectedRandomCards); // Duplicate to create pairs
        // console.log(allCards);
        //push dog cards
        if (levelCards === 9) {
            allCards.push(loseCard);
        } else if (levelCards === 12) {
            for (let i = 0; i < 2; i++) {
                allCards.push(loseCard);
            }
        } else if (levelCards === 15) {
            for (let i = 0; i < 3; i++) {
                allCards.push(loseCard);
            }
        }
        shuffle(allCards);

        const cardGrid = document.querySelector(".card-grid");
        cardGrid.innerHTML = ""; // Clear existing cards
        let a = 0;
        // console.log(allCards);
        allCards.forEach((card) => {
            const cardElement = document.createElement("div");
            // console.log(++a);
            cardElement.classList.add("card");
            cardElement.style.backgroundImage = `url('./assets/images/${card.image}')`;
            cardElement.style.backgroundRepeat = 'no-repeat';
            cardElement.style.backgroundPosition = 'center';
            cardElement.style.backgroundColor = '#8BA799';
            if (level >= 16) {
                cardElement.style.backgroundSize = '30% auto';
            } else {
                cardElement.style.backgroundSize = '50% auto';
            }

            cardElement.addEventListener("click", () => {
                if (canClick) {
                    flipCard(cardElement, card);
                    let reason;
                    if (card.image === 'dog.png') {
                        reason = "You Lose!!! clicked a dog card.";
                        gameOver(reason);
                    }
                }
            });

            cardGrid.appendChild(cardElement);
        });

        setTimeout(() => {
            const cardElements = document.querySelectorAll(".card");
            cardElements.forEach((card) => {
                card.style.transform = 'rotateY(180deg)';
                /* Rotate the card around the Y-axis */
                card.style.transition = 'transform 0.3s ease';
                card.style.backgroundImage = ""; // Clear images after 1.5s
                card.style.backgroundColor = "#514538";
            });
            canClick = true; // Enable clicking after 1.5s
        }, 1500);
    }



    // Function to flip a card

    function flipCard(cardElement, card) {
        if (!cardElement.classList.contains("flipped") && flippedCards.length < 2) {
            cardElement.classList.add("flipped");
            cardElement.style.transform = 'rotateY(0deg)'; // Corrected
            cardElement.style.transition = 'transform 0.3s ease'; // Corrected
            cardElement.style.backgroundImage = `url('./assets/images/${card.image}')`;
            cardElement.style.backgroundColor = '#8BA799';
            flippedCards.push({ element: cardElement, card: card });

            if (flippedCards.length === 2) {
                setTimeout(() => {
                    checkForMatch();
                }, 1000);
            }
        }
    }

    // Function to check for match 

    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.card.type === card2.card.type) {
            if (card1.card.type === 'carrot') {
                score += 10;
                ++carrotMatchCount;
            } else if (card1.card.type === 'trap') {
                score -= 5;
            }
            updateScore();
        } else {
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                card1.element.style.backgroundImage = ""; // Reset background image
                card2.element.style.backgroundImage = ""; // Reset background image
                card1.element.style.backgroundColor = "#514538";
                card2.element.style.backgroundColor = "#514538";
                flippedCards = [];
                canClick = true;
            }, 1000); // Delay for better visibility
        }

        flippedCards = [];
        canClick = true;
        if (checkAllCarrotCardsFlipped()) {
            carrotMatchCount = 0;
            restartWithDelay();
        }

    }

    // Function to check if all carrot cards are flipped
    function checkAllCarrotCardsFlipped() {
        // console.log(carrotMatchCount);
        let allCarrotCardsFlipped = carrotMatchCount === numCarrotCards;
        return allCarrotCardsFlipped;
    }


    // Function to move to the next level
    function moveToNextLevel() {
        level++;
        if (level <= maxLevel) {
            assignRandomImages(level);
        } else {
            // Game completed
            updateRabbitPosition(level);
            gameOver('Congratulations! You completed all levels.');
        }
    }

    // Function to update the level
    function updateLevel() {
        const levelDisplay = document.querySelector('.level span');
        levelDisplay.textContent = level;
        // updateRabbitPosition(level);
    }

    // Function to update the score
    function updateScore() {
        const scoreDisplay = document.querySelector('.score span');

        if (score < 0) {

            let reason = "You Lose!!! Your score went negative.";
            gameOver(reason);
        } else {
            scoreDisplay.textContent = score;
        }
    }

    // Function to start in next level 

    function restartWithDelay() {
        setTimeout(() => {
            moveToNextLevel();
            startGame();
            updateLevel();
        }, 1500); // Delay before restarting the game
    }

    // Add this function to update the rabbit's position
    function updateRabbitPosition(level) {
        const rabbitProgress = document.querySelector(".rabbit-progress img");
        const rabbitPath = document.querySelector(".rabbit-path");
        const maxLevel = 15; // Maximum level

        // Calculate the  position based on the level
        const position = ((level - 1) / maxLevel) * (rabbitPath.offsetWidth - rabbitProgress.offsetWidth);

        // Apply the position
        rabbitProgress.style.right = position + "px";
    }

    // Function to hide or disappear all buttons in the modal
    function hideModalButtons() {
        const modalFooter = document.querySelector('.modal-footer');
        modalFooter.style.display = 'none';
    }

    // Function to hide the modal
    function hideModal() {
        const modal = document.querySelector('#feedback');
        $(modal).modal('hide');
    }




    // Function to start the game

    function startGame() {
        assignRandomImages(level);
        updateRabbitPosition(level);
        console.log(level);
    }



    // Function to display the modal with feedback
    function displayFeedback(message) {
        const modalTitle = document.querySelector('#feedback .modal-title');
        const modalBody = document.querySelector('#feedback .modal-body');

        modalTitle.textContent = 'Feedback'; // Set modal title
        modalBody.textContent = message; // Set modal body text
        $('#feedback').modal('show');
    };

    // Add an event listener to the reset button
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => {
        gameOver("Restarting the game");
    });



    // Game over function

    function gameOver(message) {
        displayFeedback(message);
        setTimeout(() => {
            score = 0;
            level = 1;
            canClick = false;
            carrotMatchCount = 0;
            startGame();
            updateScore();
            updateLevel();
        }, 3000);
    }

    startGame();
});

