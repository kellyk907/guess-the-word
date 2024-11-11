//step 1 project description
//step 2 select elements and add placeholders
//The unordered list where the player’s guessed letters will appear.
const guessedLettersElement = document.querySelector(".guessed-letters");
//The button with the text “Guess!” in it.
const guessLetterButton = document.querySelector(".guess");
//The text input where the player will guess a letter.
const letterInput = document.querySelector(".letter");
//The empty paragraph where the word in progress will appear.
const wordInProgress = document.querySelector(".word-in-progress");
//The paragraph where the remaining guesses will display.
const remainingGuessesElement = document.querySelector(".remaining");
//The span inside the paragraph where the remaining guesses will display.
const remainingGuessesSpan = document.querySelector(".remaining span");
//The empty paragraph where messages will appear when the player guesses a letter.
const message = document.querySelector(".message");
//The hidden button that will appear prompting the player to play again.
const playAgainButton = document.querySelector(".play-again");

//starting word
const word = "magnolia";
const guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function () {
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
  };
  
  // Fire off the game
  getWord();

//display symbols while waiting for letter guesses
const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
      console.log(letter);
      placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
  }

  placeholder(word);

  //Event listener for the button

  guessLetterButton.addEventListener("click", function (e) {
    e.preventDefault();
    // Empty message paragraph
    message.innerText = "";
    // Let's grab what was entered in the input
    const guess = letterInput.value;
    // Let's make sure that it is a single letter
    const goodGuess = validateInput(guess);
  
    if (goodGuess) {
      // We've got a letter! Let's guess!
      makeGuess(guess);
    }
    letterInput.value = "";
  });

  //start step 3 accept and validate guesses
  const validateInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
      // Is the input empty?
      message.innerText = "Please enter a letter.";
    } else if (input.length > 1) {
      // Did you type more than one letter?
      message.innerText = "Please enter a single letter.";
    } else if (!input.match(acceptedLetter)) {
      // Did you type a number, a special character or some other non letter thing?
      message.innerText = "Please enter a letter from A to Z.";
    } else {
      // We finally got a single letter, omg yay
      return input;
    }
  };
  
  const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
      message.innerText = "You already guessed that letter, silly. Try again.";
    } else {
      guessedLetters.push(guess);
      console.log(guessedLetters);
      updateGuessesRemaining(guess);
      showGuessedLetters();
      updateWordInProgress(guessedLetters);
    }
  };
  //step 4 display word and guessed letters
  //function to show the guessed letters
  const showGuessedLetters = function () {
    // Clear the list first
    guessedLettersElement.innerHTML = "";
    for (const letter of guessedLetters) {
      const li = document.createElement("li");
      li.innerText = letter;
      guessedLettersElement.append(li);
    }
  };
//function to update word in progress
const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
      if (guessedLetters.includes(letter)) {
        revealWord.push(letter.toUpperCase());
      } else {
        revealWord.push("●");
      }
    }
    // console.log(revealWord);
    wordInProgress.innerText = revealWord.join("");
    checkIfWin();
  };
  
    //step 5 Fetch Words and Remaining Guesses
    const updateGuessesRemaining = function (guess) {
        const upperWord = word.toUpperCase();
        if (!upperWord.includes(guess)) {
          // womp womp - bad guess, lose a chance
          message.innerText = `Sorry, the word has no ${guess}.`;
          remainingGuesses -= 1;
        } else {
          message.innerText = `Good guess! The word has the letter ${guess}.`;
        }
      
        if (remainingGuesses === 0) {
          message.innerHTML = `Game over! The word was <span class="highlight">${word}</span>.`;
        } else if (remainingGuesses === 1) {
          remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
        } else {
          remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
        }
      };
      
      const checkIfWin = function () {
        if (word.toUpperCase() === wordInProgress.innerText) {
          message.classList.add("win");
          message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
        }
      };