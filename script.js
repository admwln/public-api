let nouns = [];
//nouns = Array.from(new Set(nouns));

//Get words from Random word api
// https://random-word-api.herokuapp.com/word?number=1&lang=en&length=6
const loadGameBtn = document.querySelector("#load-game");
const randomWordUrl = "https://random-word-api.herokuapp.com/word?lang=en";
//Get words on click
loadGameBtn.addEventListener("click", () => {
  // Show game container
  const gameContainer = document.querySelector(".game-container");
  gameContainer.classList.remove("hidden");

  const wordLength = document.querySelector("#word-length").value;
  const getWords = async () => {
    const response = await fetch(
      randomWordUrl + "&number=50&length=" + wordLength
    );
    const results = await response.json();
    nouns = results;
    console.log(nouns);
    nextWord();
  };
  getWords();

  // Reset progress squares
  const progressSquares = document.querySelectorAll(".progress-square");
  for (let i = 0; i < progressSquares.length; i++) {
    progressSquares[i].classList.remove("correct");
    progressSquares[i].classList.remove("incorrect");
  }
});

const nextWordBtn = document.querySelector("#next-word");
const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const choiceContainer = document.querySelector("#choices");
let randomWord;
let wordCount = 0;

// Generate new word on click
function nextWord() {
  // Disable #load-game button until game is over
  const loadGameBtn = document.querySelector("#load-game");
  loadGameBtn.disabled = true;

  // Disable #next-word button until user has chosen an answer
  nextWordBtn.disabled = true;

  // Enable choice buttons
  const choiceButtons = document.querySelectorAll(".choice");
  for (let j = 0; j < choiceButtons.length; j++) {
    choiceButtons[j].disabled = false;
  }

  // Get definition of random word from Free Dictionary API
  const getDefinition = async () => {
    // Empty choice div
    choiceContainer.innerHTML = "";
    const randomIndex = Math.floor(Math.random() * nouns.length);
    randomWord = nouns[randomIndex];
    console.log(randomWord);

    // Remove random word from nouns array (at position randomIndex, remove one item)
    nouns.splice(randomIndex, 1);

    // If randomWord ends with 'sses', remove 'es'
    if (randomWord.slice(-4) === "sses") {
      randomWord = randomWord.slice(0, -2);
      console.log("Random word ends with 'sses', removing 'es'");
    }

    // If randomWord ends with 's', but not 'ss' or 'ous' or 'snes'...
    if (
      randomWord.slice(-1) === "s" &&
      randomWord.slice(-2) !== "ss" &&
      randomWord.slice(-3) !== "ous" &&
      randomWord.slice(-4) !== "snes"
    ) {
      // ... remove 's'
      randomWord = randomWord.slice(0, -1);
      console.log("Random word ends with 's', removing 's'");
    }

    // If randomWord ends with 'ed', remove 'ed'
    if (randomWord.slice(-2) === "ed" && randomWord.slice(-3) !== "ted") {
      randomWord = randomWord.slice(0, -2);
      console.log("Random word ends with 'ed', removing 'ed'");
    } else if (randomWord.slice(-3) === "ted") {
      randomWord = randomWord.slice(0, -1);
      console.log("Random word ends with 'ted', removing 'd'");
    }

    // Get definition from API
    const response = await fetch(baseUrl + randomWord);
    const results = await response.json();
    //Catch error if no definition is found
    if (results.title === "No Definitions Found") {
      console.log("No definition found, re-calling function");
      // Recursive call to the function
      getDefinition();
      return;
    }

    // Get dictionary form of word
    const sourceUrls = results[0].sourceUrls;
    // console.log("source urls: " + sourceUrls);
    // Compare strings in sourceUrls array to find the shortest one
    let shortestUrl = sourceUrls.reduce((a, b) =>
      a.length <= b.length ? a : b
    );

    // // Get dictionary form by splitting url of last item in array
    // let lastUrl = sourceUrls[sourceUrls.length - 1];

    let dictionaryForm = shortestUrl.split("/");
    dictionaryForm = dictionaryForm[dictionaryForm.length - 1];
    console.log("Dictionary form: " + dictionaryForm);
    randomWord = dictionaryForm;

    // Get definitions from results
    const definitions = results[0].meanings;

    // Save first definition to variable and display
    let definition = definitions[0].definitions[0].definition;

    // Save first 3 characters of randomWord to variable
    let beginningOfWord;
    if (randomWord.length > 3) {
      beginningOfWord = randomWord.slice(
        0,
        Math.round(3 + randomWord.length * 0.15)
      );
      console.log("Beginning of word: " + beginningOfWord);
      // If current word is 4 characters or less, use the whole word
    } else {
      beginningOfWord = randomWord;
      console.log("Beginning of word: " + beginningOfWord);
    }

    // Save last 4 characters of randomWord to variable
    let endOfWord;
    if (randomWord.length > 3) {
      endOfWord = randomWord.slice(-Math.round(3 + randomWord.length * 0.15));
      console.log("End of word: " + endOfWord);
      // If current word is 4 characters or less, use the whole word
    } else {
      endOfWord = randomWord;
      console.log("End of word: " + endOfWord);
    }

    if (
      definition.includes(beginningOfWord) ||
      definition.includes(endOfWord)
    ) {
      console.log("Flagged definition: '" + definition + "'");
      console.log("Definition includes beginning of word, re-calling function");
      // Recursive call to the function
      getDefinition();
      return;
    }

    const definitionDisplay = document.querySelector("#definition");
    definitionDisplay.innerHTML = definition;

    // Generate array with four words, including our current randomWord
    let multipleChoices = [];
    // Push current randomWord to array
    multipleChoices.push(randomWord);
    // Shuffle noun array
    shuffleArray(nouns);
    // Add first 9 strings to multipleChoices array
    for (let i = 0; i < 3; i++) {
      multipleChoices.push(nouns[i]);
    }
    // Shuffle multipleChoices
    shuffleArray(multipleChoices);

    // Display multipleChoices in html
    for (let i = 0; i < multipleChoices.length; i++) {
      const choiceBtn = document.createElement("button");
      choiceBtn.classList.add("choice");
      choiceBtn.innerText = multipleChoices[i];
      choiceContainer.appendChild(choiceBtn);
    }

    getChoiceButtons();
  };
  getDefinition();
}

nextWordBtn.addEventListener("click", () => {
  nextWord();
});

function shuffleArray(array) {
  let len = array.length,
    currentIndex;
  for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
    let randIndex = Math.floor(Math.random() * (currentIndex + 1));
    var temp = array[currentIndex];
    array[currentIndex] = array[randIndex];
    array[randIndex] = temp;
  }
}

// Get all multiple choice buttons and make them clickable
function getChoiceButtons() {
  const choiceButtons = document.querySelectorAll(".choice");
  for (let j = 0; j < choiceButtons.length; j++) {
    choiceButtons[j].onclick = function (event) {
      const chosenAnswer = event.target.firstChild.textContent
        .trim()
        .replace(/\s+/g, " ");
      // Compare chosen answer with current word
      if (randomWord === chosenAnswer) {
        console.log("Correct!");
        wordCount++;
        console.log("Word count: " + wordCount);

        makeProgress(true);
      } else {
        console.log("Incorrect!");
        wordCount++;
        console.log("Word count: " + wordCount);

        makeProgress(false);
      }
      // End game and reset word count at 10
      if (wordCount === 10) {
        alert("Game over!");
        wordCount = 0;
        console.log("Word count: " + wordCount);
        // Disable #next-word button at end of game
        nextWordBtn.disabled = true;
        // Enable #load-game button at end of game
        const loadGameBtn = document.querySelector("#load-game");
        loadGameBtn.disabled = false;
      }
    };
  }
}

function makeProgress(myBool) {
  // Enable #next-word button
  nextWordBtn.disabled = false;
  // Disable choice buttons
  const choiceButtons = document.querySelectorAll(".choice");
  for (let j = 0; j < choiceButtons.length; j++) {
    choiceButtons[j].disabled = true;
  }
  const progressSquares = document.querySelectorAll(".progress-square");
  // If answer is correct, make square green
  if (myBool) {
    progressSquares[wordCount - 1].classList.add("correct");
  } else {
    progressSquares[wordCount - 1].classList.add("incorrect");
  }
}
