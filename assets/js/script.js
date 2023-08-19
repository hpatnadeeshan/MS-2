document.addEventListener("DOMContentLoaded", () => {
    const cards = [
        { type: 'carrot', image: 'carrot.png', score: 10 },
        { type: 'trap', image: 'trap.png', score: -5 },
        { type: 'dog', image: 'dog.png', score: 0 }
    ];

    const maxLevel = 15;
    const cardsEachLevel = [6, 6, 6, 9, 9, 9, 9, 9, 12, 12, 12, 12, 12, 15, 15];

    let score = 0;
    let level = 1;
    let flippedCards = [];

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

        // Example: Select 3 random cards
        const selectedRandomCards = selectCards(levelCards);
        console.log(selectedRandomCards);

        const allCards = selectedRandomCards.concat(selectedRandomCards); // Duplicate to create pairs
        console.log(allCards);
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
            if (level >= 16) {
                cardElement.style.backgroundSize = '30% auto';
            } else {
                cardElement.style.backgroundSize = '50% auto';
            }

            cardElement.addEventListener("click", () => {
                if (canClick) {
                    flipCard(cardElement, card);
                }
            });

            cardGrid.appendChild(cardElement);
        });

        setTimeout(() => {
            const cardElements = document.querySelectorAll(".card");
            cardElements.forEach((card) => {
                card.style.backgroundImage = ""; // Clear images after 1.5s
                card.style.backgroundColor = "grey";
            });
            canClick = true; // Enable clicking after 1.5s
        }, 1500);
    }



    // Function to flip a card

    function flipCard(cardElement, card) {
        if (!cardElement.classList.contains("flipped") && flippedCards.length < 2) {
            cardElement.classList.add("flipped");
            cardElement.style.backgroundImage = `url('./assets/images/${card.image}')`;
            flippedCards.push({ element: cardElement, card: card });

            if (flippedCards.length === 2) {
                setTimeout(checkForMatch, 1000);
            }
        }
    }

    // Function to check for match 

    // Function to start the game

    function startGame() {
        assignRandomImages(level);
    }

    startGame();
});
