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
    let timerInterval;
    let timerStartTime;
    let isInitial = true;

    // Function to shuffle the cards

    function shuffle(array) {
        console.log('shuffle');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        isInitial = false;
    }

    // Function to select random cards for the game(only select carrots and traps & only select half number of total cards)

    function selectCards(totalCount) {
        console.log('selectCards');
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
        console.log('assignRandomImages');
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
                        displayFeedback(reason);
                        stopTimer();
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
        console.log('flipCard');
        if (isInitial) {
            return;
        }
        canClick = true;
        if (!cardElement.classList.contains("flipped") && flippedCards.length < 2 && canClick) {
            cardElement.classList.add("flipped");
            cardElement.style.transform = 'rotateY(0deg)'; // Corrected
            cardElement.style.transition = 'transform 0.3s ease'; // Corrected
            cardElement.style.backgroundImage = `url('./assets/images/${card.image}')`;
            cardElement.style.backgroundColor = '#8BA799';
            flippedCards.push({ element: cardElement, card: card });

            if (flippedCards.length === 2) {
                setTimeout(() => {
                    canClick = false;
                    checkForMatch();
                }, 1000);
            }
        }
    }

    // Function to check for match 

    function checkForMatch() {
        console.log('checkForMatch');
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
        console.log('checkAllCarrotCardsFlipped');
        let allCarrotCardsFlipped = carrotMatchCount === numCarrotCards;
        return allCarrotCardsFlipped;
    }


    // Function to move to the next level
    function moveToNextLevel() {
        console.log('moveToNextLevel');
        level++;
        if (level <= maxLevel) {
            displayFeedback(`Level ${level}`);
            hideModalButtons();
            setTimeout(() => {
                hideModal();
                showModalButtons();
            }, 700);

        } else {
            // Game completed
            updateRabbitPosition(level);
            gameOver('Congratulations! You completed all levels.');
            stopTimer();

        }
    }

    // Function to update the level
    function updateLevel() {
        console.log('updateLevel');
        const levelDisplay = document.querySelector('.level span');
        levelDisplay.textContent = level;
        // updateRabbitPosition(level);
    }

    // Function to update the score
    function updateScore() {
        console.log('updateScore');
        const scoreDisplay = document.querySelector('.score span');

        if (score < 0) {

            let reason = "You Lose!!! Your score went negative.";
            displayFeedback(reason);
            stopTimer();
            // gameOver(reason);
        } else {
            scoreDisplay.textContent = score;
        }
    }

    // Function to start in next level 

    function restartWithDelay() {
        console.log('restartWithDelay');
        moveToNextLevel();
        setTimeout(() => {
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
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        $(modal).modal('hide');
    }

    // Function to show or reappear all buttons in the modal
    function showModalButtons() {
        const modalFooter = document.querySelector('.modal-footer');
        modalFooter.style.display = 'block';
    }




    // Function to start the game

    function startGame() {
        console.log('startGame');
        startTimer();
        assignRandomImages(level);
        updateRabbitPosition(level);
        console.log(level);
    }



    // Function to display the modal with feedback
    function displayFeedback(message) {
        console.log('displayFeedback');
        showRestart();
        const modalBody = document.querySelector('#feedback .modal-body');
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        modalBody.textContent = message; // Set modal body text
        $('#feedback').modal('show');
    }

    // Game over function

    function gameOver(message) {
        console.log('gameOver');
        displayFeedback(message);
        setTimeout(() => {
            score = 0;
            level = 1;
            canClick = false;
            carrotMatchCount = 0;
            startGame();
            updateScore();
            updateLevel();
        }, 1500);
    }

    //show restart
    function showRestart() {
        const additionalButtonsContainer = document.querySelector('#additionalButtons');
        const restartButton = document.querySelector('#restart');

        // Show the restart button
        restartButton.style.display = 'block';

        // Hide the "Start" and "Help" buttons
        additionalButtonsContainer.style.display = 'none';
    }

    //initialization

    function addStartAndHelpButtons() {
        const restartButton = document.querySelector('#restart');
        restartButton.style.display = 'none';
        const additionalButtonsContainer = document.querySelector('#additionalButtons');

        // Create the Start button
        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.classList.add('btn', 'btn-primary');

        // Create the Help button
        const helpButton = document.createElement('button');
        helpButton.textContent = 'Help';
        helpButton.classList.add('btn', 'btn-info');

        // Add event listeners to the buttons
        startButton.addEventListener('click', () => {
            // Start the game when the "Start" button is clicked
            startGame();
            const feedbackModal = document.querySelector('#feedback');
            $(feedbackModal).modal('hide');
        });

        helpButton.addEventListener('click', () => {
            // Show the help content when the "Help" button is clicked
            $('#helpModal').modal('show');
        });

        // Append the buttons to the container
        additionalButtonsContainer.appendChild(startButton);
        additionalButtonsContainer.appendChild(helpButton);
        $('#feedback').modal('show');
    }

    // Call the function to add Start and Help buttons
    addStartAndHelpButtons();


    // startGame();


    // Add an event listener to the reset button
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => {
        hideModalButtons();
        gameOver("Restarting the game");
        setTimeout(() => {
            hideModal();
            showModalButtons();
        }, 1500);
    });

    // Add an event listener to the restart button in feedback modal
    const feedbackModal = document.querySelector('#feedback');
    const restartButton = feedbackModal.querySelector('#restart');
    const exitButton = feedbackModal.querySelector('.modal-footer .btn-secondary');

    restartButton.addEventListener('click', () => {
        hideModalButtons();
        gameOver("Restarting the game");
        setTimeout(() => {
            hideModal();
            showModalButtons();
        }, 1500);
    });

    // Close the browser window

    exitButton.addEventListener('click', () => {
        window.close();
    });


    // Function to start the timer
    function startTimer() {
        timerStartTime = moment();
        timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
    }

    // Function to update the timer
    function updateTimer() {
        const currentTime = moment();
        const duration = moment.duration(currentTime.diff(timerStartTime));
        const displayTime = moment(duration.asMilliseconds()).format('mm:ss');
        document.getElementById('timerId').textContent = displayTime;
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

});

