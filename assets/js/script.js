const cards = [
    { type: 'carrot', image: 'carrot.png', score: 10 },
    { type: 'trap', image: 'trap.png', score: -5 },
    { type: 'dog', image: 'dog.png', score: 0 }
];

const maxLevel = 15;
const cardsEachLevel = [6, 6, 6, 9, 9, 9, 9, 9, 12, 12, 12, 12, 12, 15, 15];

let score = 0;
let Level = 1;
let flippedCards = [];

// Function to shuffle the cards

// Function to select random cards for the game(only select carrots and traps & only select half number of total cards)

function selectCards(totalCount) {
    const selectedCards = [];

    // Ensure each card type is selected at least once
    cards.forEach(card => {
        selectedCards.push(card);
    });

    let remainingCount = totalCount - selectedCards.length * 2;

    // allocate a place from the array for dog cards

    if (count === 9) {
        remainingCount -= 1;
    } else if (count === 12) {
        remainingCount -= 2;
    } else if (count === 15) {
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


// Function to flip a card

// Function to check for match 

// Function to start the game

function startGame() {
    assigImages(currentLevel);
}