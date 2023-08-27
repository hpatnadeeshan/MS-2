document.addEventListener("DOMContentLoaded", () => {

    const cards = [
        { type: 'carrot', image: 'carrot.png', score: 10 },
        { type: 'trap', image: 'trap.png', score: -5 },
    ];
    const loseCard = { type: "dog", image: "dog.png", score: 0 };
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
    let checkingForMatch = false;
    let gameStatus;

    // Function to shuffle the cards

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        isInitial = false;
        checkingForMatch = false;
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
            const randomNum = Math.random() * cards.length;
            const randomIndex = Math.floor(randomNum);
            selectedCards.push(cards[randomIndex]);
        }
        //Number of carrot cards

        numCarrotCards = selectedCards.filter(card => card.type === 'carrot').length;
        return selectedCards;
    }
    // Function to assign random images to cards
    function assignRandomImages(level) {
        const levelCards = cardsEachLevel[level - 1];

        //  Select random cards
        const selectedRandomCards = selectCards(levelCards);
        const allCards = selectedRandomCards.concat(selectedRandomCards); // Duplicate to create pairs
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
        allCards.forEach((card) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.style.backgroundImage = `url('./assets/images/${card.image}')`;
            cardElement.style.backgroundRepeat = 'no-repeat';
            cardElement.style.backgroundPosition = 'center';
            cardElement.style.backgroundColor = '#8BA799';
            if (level >= 12) {
                cardElement.style.backgroundSize = '25% auto';
            } else if (level >= 9) {
                cardElement.style.backgroundSize = '35% auto';
            } else {
                cardElement.style.backgroundSize = '50% auto';
            }

            cardElement.addEventListener("click", () => {
                if (canClick) {
                    flipCard(cardElement, card);
                    if (card.image === 'dog.png') {
                        let reason = `<p>You Lose!!! clicked a dog card.</p>
            <p>Your Score is: ${score}</p>`;
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

        try {
            if (isInitial || checkingForMatch) {
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
                    checkingForMatch = true; // Set the flag to true
                    setTimeout(() => {
                        canClick = false;
                        checkForMatch();
                    }, 1200);
                }
            }

        } catch (error) {
            document.getElementById("demo").innerHTML = err.message;
            console.error("An error occurred:", error);
        }

    }

    // Function to check for match 

    function checkForMatch() {
        try {
            const [card1, card2] = flippedCards;

            if (card1.card.type === card2.card.type) {
                if (card1.card.type === 'carrot') {
                    score += 10;
                    ++carrotMatchCount;
                } else if (card1.card.type === 'trap') {
                    score -= 5;
                }
                flippedCards = [];
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
                    checkingForMatch = false;
                }, 1000); // Delay for better visibility
            }

            if (checkAllCarrotCardsFlipped()) {
                carrotMatchCount = 0;
                restartWithDelay();
            } else {
                checkingForMatch = false;//Reset the flag if there are more cards to check
            }
            canClick = true;

        } catch (error) {
            document.getElementById("demo").innerHTML = err.message;
            console.error("An error occurred:", error);
        }
    }

    // Function to check if all carrot cards are flipped
    function checkAllCarrotCardsFlipped() {
        let allCarrotCardsFlipped = carrotMatchCount === numCarrotCards;
        return allCarrotCardsFlipped;
    }


    // Function to move to the next level
    function moveToNextLevel() {
        try {
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
                gameStatus = 'Won';
                updateRabbitPosition(level);
                let reason = `<p>Congratulations! You completed all levels.</p>
            <p>Your Score is: ${score}</p>`;
                gameOver(reason);
                stopTimer();
            }

        } catch (error) {
            document.getElementById("demo").innerHTML = err.message;
            console.error("An error occurred:", error);
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

            let reason = `<p>You Lose!!! Your score went negative.</p>
            <p>Your Score is: 0</p>`;
            displayFeedback(reason);
            stopTimer();
            // gameOver(reason);
        } else {
            scoreDisplay.textContent = score;
        }
    }

    // Function to start in next level 

    function restartWithDelay() {
        moveToNextLevel();
        if (gameStatus === 'Won') {
            return;
        }
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
        const position = ((level - 1) / (maxLevel + 1)) * (rabbitPath.offsetWidth - rabbitProgress.offsetWidth);

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
        startTimer();
        assignRandomImages(level);
        updateRabbitPosition(level);
    }


    // Function to display the modal with feedback
    function displayFeedback(message) {
        showRestart();
        const modalBody = document.querySelector('#feedback .modal-body');
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        modalBody.innerHTML = message; // Set modal body text
        $('#feedback').modal('show');
    }

    // Game over function

    function gameOver(message) {
        displayFeedback(message);
        hideModalButtons();
        if (gameStatus === 'Won') {
            setTimeout(() => {
                hideModal();
                gameStatus = 'progressing';
                score = 0;
                level = 1;
                canClick = false;
                carrotMatchCount = 0;
                startGame();
                updateScore();
                updateLevel();
            }, 5000);
        } else {
            setTimeout(() => {
                hideModal();
                score = 0;
                level = 1;
                canClick = false;
                carrotMatchCount = 0;
                startGame();
                updateScore();
                updateLevel();
            }, 1500);
        }

    }

    //show restart
    function showRestart() {
        const modalFooter = document.querySelector('#feedback .modal-footer');

        // Set the inner HTML of the modal footer to include the icons
        modalFooter.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-auto">
                <i class="fa-solid fa-rotate-right fa-beat fa-4x" id="restart" style="color: #215bc0; cursor: pointer; margin-right: 20px;"></i>
            </div>

            <div class="col-auto">
                <i class="fas fa-times-circle fa-4x" id="exit" style="color: #1f5141; cursor: pointer;"></i>
            </div>
        </div>
    `;

        // Show the modal footer
        modalFooter.style.display = 'block';

        // Get references to the start and exit icons
        const restartIcon = document.querySelector('#restart');
        const exitIcon = document.querySelector('#exit');

        // Add event listeners to the icons
        restartIcon.addEventListener('click', () => {
            modalFooter.style.display = 'none'; // Hide the modal footer
            gameOver("Restarting the game");
            setTimeout(() => {
                const feedbackModal = document.querySelector('#feedback');
                $(feedbackModal).modal('hide');
            }, 1500);
        });

        exitIcon.addEventListener('click', () => {
            window.close();
        });
    }


    //initialization
    function addStartAndHelpButtons() {
        // Remove the modal footer
        const modalFooter = document.querySelector('#feedback .modal-footer');
        modalFooter.style.display = 'none';
        const modalBody = document.querySelector('#feedback .modal-body');
        modalBody.innerHTML = `
    <div class="row justify-content-center">
        <div class="col-auto">
            <i class="fa-solid fa-circle-play fa-beat fa-5x" id="start" style="color: #215bc0; cursor: pointer; margin-right: 20px;"></i>
        </div>
        <div class="col-auto">
            <i class="fas fa-info-circle fa-5x" id="help" style="color: #e6d4c3; cursor: pointer; margin-right: 20px;"></i>
        </div>
        <div class="col-auto">
            <i class="fas fa-times-circle fa-5x" id="exit" style="color: #1f5141; cursor: pointer;"></i>
        </div>
    </div>
`;


        const startIcon = document.getElementById('start');
        const helpIcon = document.getElementById('help');
        const exitIcon = document.getElementById('exit');

        startIcon.addEventListener('click', () => {
            // Start the game when the "Start" icon is clicked
            startGame();
            const feedbackModal = document.querySelector('#feedback');
            $(feedbackModal).modal('hide');
        });

        helpIcon.addEventListener('click', () => {
            // Show the help content when the "Help" icon is clicked
            $('#helpModal').modal('show');
        });

        exitIcon.addEventListener('click', () => {
            window.close();
        });

        $('#feedback').modal('show');
    }


    function clickHome() {
        // Remove the modal footer
        const modalFooter = document.querySelector('#feedback .modal-footer');
        modalFooter.style.display = 'none';
        const modalBody = document.querySelector('#feedback .modal-body');
        modalBody.innerHTML = `
    <div class="row justify-content-center">
        <div class="col-auto">
             <i class="fa-solid fa-rotate-right fa-5x" id="restart" style="color: #215bc0; cursor: pointer; margin-right: 20px;"></i>
        </div>
        <div class="col-auto">
            <i class="fa-solid fa-eject fa-rotate-90 fa-5x" id="resume" style="color: #215bc0; cursor: pointer; margin-right: 20px;"></i>

        </div>
        <div class="col-auto">
            <i class="fas fa-times-circle fa-5x" id="exit" style="color: #1f5141; cursor: pointer;"></i>
        </div>
    </div>
`;


        const restartIcon = document.getElementById('restart');
        const resumeIcon = document.getElementById('resume');
        const exitIcon = document.getElementById('exit');

        // Add event listeners to the icons
        restartIcon.addEventListener('click', () => {
            modalFooter.style.display = 'none'; // Hide the modal footer
            gameOver("Restarting the game");
            setTimeout(() => {
                const feedbackModal = document.querySelector('#feedback');
                $(feedbackModal).modal('hide');
            }, 1500);
        });

        resumeIcon.addEventListener('click', () => {
            // Close the feedback modal when the "Exit" icon is clicked
            const feedbackModal = document.querySelector('#feedback');
            $(feedbackModal).modal('hide');
        });

        exitIcon.addEventListener('click', () => {
            window.close();
        });

        $('#feedback').modal('show');

    }
    // Call the function to add Start and Help buttons
    addStartAndHelpButtons();


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

    // Add an event listener to the reset button
    const homeButton = document.getElementById('homeButton');
    homeButton.addEventListener('click', () => {
        clickHome();

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


    const soundButton = document.getElementById('soundButton');
    const muteButton = document.getElementById('muteButton');
    const soundIcon = soundButton.querySelector('i');
    const muteIcon = muteButton.querySelector('i');
    const backgroundMusic = new Audio('./assets/audio/background.mp3');
    backgroundMusic.loop = true;
    let isSoundOn = false;

    // Event listener for the "Sound" button
    soundButton.addEventListener('click', () => {
        if (isSoundOn) {
            backgroundMusic.pause();

        } else {

            backgroundMusic.play();
            isSoundOn = true;

        }
        backgroundMusic.play();
        soundButton.style.display = 'none';
        muteButton.style.display = 'inline';

        // Toggle classes to change the icon
        soundIcon.classList.remove('fa-volume-low');
        soundIcon.classList.add('fa-volume-xmark');
    });

    // Event listener for the "Mute" button
    muteButton.addEventListener('click', () => {
        if (isSoundOn) {
            backgroundMusic.pause();

        } else {

            backgroundMusic.play();
            isSoundOn = true;

        }
        soundButton.style.display = 'inline';
        muteButton.style.display = 'none';

        // Toggle classes to change the icon
        muteIcon.classList.remove('fa-volume-xmark');
        muteIcon.classList.add('fa-volume-low');
    });





});
