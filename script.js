let words = [];
let correctCounter;
//words = Array.from(new Set(words));
const loadGameBtn = document.querySelector("#load-game");
const currentWordUrl = "https://random-word-api.herokuapp.com/word?lang=en";

// Click #load-game button
loadGameBtn.addEventListener("click", () => {
  // Disable #load-game button until game is over
  const loadGameBtn = document.querySelector("#load-game");
  loadGameBtn.disabled = true;

  // Reset correctCounter
  correctCounter = 0;

  // Hide result container
  const resultContainer = document.querySelector(".result");
  resultContainer.classList.add("hidden");

  // If there is a result button, remove it
  const resultBtn = document.querySelector("#result-btn");
  if (resultBtn) {
    resultBtn.remove();
  }

  // Show #next-word button
  const nextWordBtn = document.querySelector("#next-word");
  nextWordBtn.classList.remove("hidden");
  // Disable #next-word button until user has chosen an answer
  nextWordBtn.disabled = true;

  // Hide init container
  const initContainer = document.querySelector(".init");
  initContainer.classList.add("hidden");

  // Show game container
  const gameContainer = document.querySelector(".game-container");
  gameContainer.classList.remove("hidden");

  // Get word length from input
  const wordLength = document.querySelector("#word-length").value;

  // Fetch 100 words from API
  const getWords = async () => {
    const response = await fetch(
      currentWordUrl + "&number=100&length=" + wordLength
    );
    const results = await response.json();
    words = results;
    console.log(words);
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
let currentWord;
let currentWordJson;
let wordCount = 0;

// Generate new word on click
function nextWord() {
  // Crash counter to prevent infinite loop
  let crashCount = 0;

  // Reset currentWord
  currentWord = undefined;

  // Disable #next-word button until user has chosen an answer
  nextWordBtn.disabled = true;

  // Enable choice buttons
  const choiceButtons = document.querySelectorAll(".choice");
  for (let j = 0; j < choiceButtons.length; j++) {
    choiceButtons[j].disabled = false;
  }
  // Empty choice div
  choiceContainer.innerHTML = "";

  // Get definition of random word from Free Dictionary API
  const getDefinition = async () => {
    crashCount++;
    if (crashCount === 100) {
      alert("Something went wrong, please try again.");
      return;
    }
    console.log("Current word: " + currentWord);

    // If currentWord is undefined, get a new random word from words array
    if (currentWord === undefined) {
      const randomIndex = Math.floor(Math.random() * words.length);
      currentWord = words[randomIndex];
      console.log("Current word: " + currentWord);
      // Remove currentWord from words array (at position randomIndex, remove one item)
      words.splice(randomIndex, 1);
    }

    // If currentWord is still undefined, die
    if (currentWord === undefined) {
      console.log("random word is undefined, will die");
      return;
    }

    // Pass currentWord to function that cleans it up
    currentWord = cleanUpWord(currentWord);

    // Get definition from Free Dictionary API
    const response = await fetch(baseUrl + currentWord);
    const results = await response.json();

    currentWordJson = results;

    //Catch error if no definition is found
    if (results.title === "No Definitions Found") {
      console.log("No definition found, re-calling function");
      // Unset currentWord
      currentWord = undefined;
      // Recursive call to the function
      getDefinition();
      return;
    }

    // To get dictionary form of word,
    // compare strings in sourceUrls array and find the shortest one
    const sourceUrls = results[0].sourceUrls;
    let shortestUrl = sourceUrls.reduce((a, b) =>
      a.length <= b.length ? a : b
    );
    // Extract last word from url to get dictionary form
    let dictionaryForm = shortestUrl.split("/");
    dictionaryForm = dictionaryForm[dictionaryForm.length - 1];
    console.log("Dictionary form: " + dictionaryForm);
    // Check if current currentWord is not the same as dictionaryForm
    if (currentWord !== dictionaryForm) {
      console.log("Random word is not the same as dictionary form");
      // Change currentWord to dictionaryForm
      currentWord = dictionaryForm;

      // Recursive call to the function
      getDefinition();
      return;
    }

    // Get definitions from results
    const definitions = results[0].meanings;

    // Save first definition to variable and display
    let definition = definitions[0].definitions[0].definition;

    // If definition includes beginning or end of word, re-call function
    const defCheck = checkDefinition(currentWord, definition);
    if (defCheck) {
      // Unset currentWord
      currentWord = undefined;
      // Recursive call to the function
      getDefinition();
      return;
    }

    displayDefinitionAndChoices(currentWord, definition);
  };
  getDefinition();
}

// Call nextWord() when #next-word button is clicked
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

// Clean up word
function cleanUpWord(word) {
  // Pass currentWord through a series of checks to make sure it's a viable word
  // If currentWord ends with 'sses', remove 'es'
  if (word.slice(-4) === "sses") {
    word = word.slice(0, -2);
    console.log("Word ends with 'sses', removing 'es'");
  }

  // If word ends with 's', but not 'ss' or 'ous' or 'snes'...
  if (
    word.slice(-1) === "s" &&
    word.slice(-2) !== "ss" &&
    word.slice(-2) !== "us" &&
    word.slice(-3) !== "ous" &&
    word.slice(-4) !== "snes"
  ) {
    // ... remove 's'
    word = word.slice(0, -1);
    console.log("Word ends with 's', removing 's'");
  }

  // If word ends with 'ed', remove 'ed'
  if (word.slice(-2) === "ed" && word.slice(-3) !== "ted") {
    word = word.slice(0, -2);
    console.log("Word ends with 'ed', removing 'ed'");
  } else if (word.slice(-3) === "ted") {
    word = word.slice(0, -1);
    console.log("Word ends with 'ted', removing 'd'");
  }

  // If Word ends with 'ly', remove 'ly'
  if (word.slice(-2) === "ly") {
    word = word.slice(0, -2);
    console.log("Word ends with 'ly', removing 'ly'");
  }

  return word;
}

function checkDefinition(word, definition) {
  // Save first 3 characters (plus 10% of current word length) of word to variable
  let beginningOfWord;
  if (word.length > 3) {
    beginningOfWord = word.slice(0, Math.round(3 + word.length * 0.1));
    console.log("Beginning of word: " + beginningOfWord);
    // If current word is 4 characters or less, use the whole word
  } else {
    beginningOfWord = word;
    console.log("Beginning of word: " + beginningOfWord);
  }

  // Save last 3 characters (plus 10% of current word length) of word to variable
  let endOfWord;
  if (word.length > 3) {
    endOfWord = word.slice(-Math.round(3 + word.length * 0.1));
    console.log("End of word: " + endOfWord);
    // If current word is 4 characters or less, use the whole word
  } else {
    endOfWord = word;
    console.log("End of word: " + endOfWord);
  }

  // Make definition lowercase
  const definitionLower = definition.toLowerCase();

  // Check if definition includes beginning or end of word
  if (
    definitionLower.includes(beginningOfWord) ||
    definitionLower.includes(endOfWord)
  ) {
    console.log("Flagged definition: '" + definition + "'");
    console.log("Definition includes beginning of word");
    return true;
  }
}

function displayDefinitionAndChoices(word, definition) {
  // Remove previous definition-div
  const definitionDivs = document.querySelectorAll(".definition-div");
  for (let i = 0; i < definitionDivs.length; i++) {
    definitionDivs[i].remove();
  }

  // Display definition in html
  const definitionDiv = document.createElement("div");
  definitionDiv.classList.add("definition-div");
  definitionDiv.innerHTML = definition;

  const definitionDisplay = document.querySelector("#definition");
  definitionDisplay.appendChild(definitionDiv);

  // Generate array with four words, including our current currentWord
  let multipleChoices = [];
  // Push current currentWord to array
  multipleChoices.push(word);
  // Shuffle words array
  shuffleArray(words);
  // Add first 3 strings to multipleChoices array
  for (let i = 0; i < 3; i++) {
    multipleChoices.push(words[i]);
  }
  // Shuffle multipleChoices
  shuffleArray(multipleChoices);

  // Display multipleChoices in html
  for (let i = 0; i < multipleChoices.length; i++) {
    const choiceBtn = document.createElement("button");
    choiceBtn.classList.add("choice");
    choiceBtn.innerText = multipleChoices[i];
    choiceContainer.appendChild(choiceBtn);
    // Flag correct answer
    if (multipleChoices[i] === currentWord) {
      choiceBtn.classList.add("correct-answer");
    }
  }
  getChoiceButtons();
}

// Get all multiple choice buttons and make them clickable
function getChoiceButtons() {
  const choiceButtons = document.querySelectorAll(".choice");
  for (let j = 0; j < choiceButtons.length; j++) {
    choiceButtons[j].onclick = function (event) {
      // Make correct answer green
      const correctAnswer = document.querySelector(".correct-answer");
      correctAnswer.classList.add("correct-reveal");

      const clickedAnswer = event.target;
      const clickedAnswerText = event.target.firstChild.textContent
        .trim()
        .replace(/\s+/g, " ");
      // Compare chosen answer with current word
      if (currentWord === clickedAnswerText) {
        console.log("Correct!");
        wordCount++;
        console.log("Word count: " + wordCount);
        correctCounter++;
        makeProgress(true);
      } else {
        console.log("Incorrect!");
        wordCount++;
        console.log("Word count: " + wordCount);
        clickedAnswer.classList.add("incorrect-clicked");
        makeProgress(false);
      }

      // Hide uncorrect, unclicked answers
      const choiceButtons = document.querySelectorAll(".choice");
      for (let j = 0; j < choiceButtons.length; j++) {
        if (
          choiceButtons[j].classList.contains("incorrect-clicked") === false &&
          choiceButtons[j].classList.contains("correct-answer") === false
        ) {
          choiceButtons[j].classList.add("incorrect-hide");
        }
      }

      // Add look-up button to correct answer
      const correctAnswerDiv = document.querySelector(".correct-answer");
      const lookUpBtn = document.createElement("button");
      lookUpBtn.innerText = "?";
      lookUpBtn.classList.add("look-up");
      correctAnswerDiv.appendChild(lookUpBtn);

      // Make look-up button clickable
      const lookUp = document.querySelector(".look-up");
      lookUp.addEventListener("click", (event) => {
        // Get clicked answer
        const clickedAnswer = event.target.parentNode.firstChild.textContent
          .trim()
          .replace(/\s+/g, " ");
        console.log("Clicked answer: " + clickedAnswer);

        // Populate modal with word and definition
        populateModal(currentWordJson);
        // Open modal
        const modal = document.querySelector("#myModal");
        modal.style.display = "block";

        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener("click", (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        });
      });

      // End game and reset word count at 10
      if (wordCount === 10) {
        wordCount = 0;
        console.log("Word count: " + wordCount);
        console.log("Game over!");
        // Hide #next-word button at end of game
        nextWordBtn.classList.add("hidden");
        // Create result button and add to beginning of game container
        const resultBtn = document.createElement("button");
        resultBtn.innerText = "Result";
        resultBtn.id = "result-btn";
        const gameContainer = document.querySelector(".game-container");
        gameContainer.prepend(resultBtn);

        // Make result button clickable
        const resultButton = document.querySelector("#result-btn");
        resultButton.addEventListener("click", (event) => {
          displayResult();
        });
      }

      // Display result at end of game
      function displayResult() {
        // Hide game container at end of game
        const gameContainer = document.querySelector(".game-container");
        gameContainer.classList.add("hidden");
        // Delete choice buttons at end of game
        const choiceButtons = document.querySelectorAll(".choice");
        for (let j = 0; j < choiceButtons.length; j++) {
          choiceButtons[j].remove();
        }
        // Delete definition at end of game
        const definitionDiv = document.querySelector("#definition");
        definitionDiv.innerHTML = "";

        // Enable #load-game button at end of game
        const loadGameBtn = document.querySelector("#load-game");
        loadGameBtn.disabled = false;
        // Display result containter at end of game
        const resultContainer = document.querySelector(".result");
        resultContainer.classList.remove("hidden");
        // Change result h2 depending on score
        const resultHeading = document.querySelector(".result > h2");
        if (correctCounter === 10) {
          resultHeading.innerText = "Flawless!";
        } else if (correctCounter >= 8) {
          resultHeading.innerText = "Almost amazing!";
        } else if (correctCounter >= 4) {
          resultHeading.innerText = "Golf clap!";
        } else if (correctCounter >= 2) {
          resultHeading.innerText = "Just warming up?";
        } else {
          resultHeading.innerText = "Ouch!";
        }

        // Print correct count to result container
        const correctSpan = document.querySelector("#correct");
        correctSpan.innerText = correctCounter;
        // Display init container at end of game
        const initContainer = document.querySelector(".init");
        initContainer.classList.remove("hidden");
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

function populateModal(myWord) {
  // Get the modal
  const modal = document.querySelector("#myModal");

  // Remove previous modal content
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = "";

  // Get the <span> element that closes the modal
  //const span = document.querySelector(".close");

  // Create span element that closes the modal
  const span = document.createElement("span");
  span.classList.add("close");
  span.innerHTML = "&times;";
  modalContent.appendChild(span);

  // When the user clicks on <span> (x), close the modal
  span.addEventListener("click", (event) => {
    modal.style.display = "none";
  });

  // Get sub-word from myWord
  for (let k = 0; k < myWord.length; k++) {
    // Get word from myWord
    const word = myWord[k].word;
    console.log("Word: " + word);

    // Print word and phonetic to modal
    const wordHeading = document.createElement("h2");
    wordHeading.classList.add("word-heading");
    wordHeading.innerHTML = word;
    modalContent.appendChild(wordHeading);

    // Add sub-word number to wordHeading
    const subWord = document.createElement("sup");
    subWord.classList.add("sub-word-number");
    subWord.innerHTML = k + 1;
    wordHeading.appendChild(subWord);

    // Get meanings from myWord
    const meanings = myWord[k].meanings;

    // Loop through meanings array and create divs for each meaning
    for (let i = 0; i < meanings.length; i++) {
      const meaningDiv = document.createElement("div");
      meaningDiv.classList.add("meaning-div");
      modalContent.appendChild(meaningDiv);

      // Get part of speech from meanings
      const partOfSpeech = meanings[i].partOfSpeech;
      // Print part of speech to modal
      const partOfSpeechDiv = document.createElement("div");
      partOfSpeechDiv.classList.add("part-of-speech");
      partOfSpeechDiv.innerHTML = partOfSpeech;
      meaningDiv.appendChild(partOfSpeechDiv);

      // Create ul for definitions
      const definitionUl = document.createElement("ul");
      definitionUl.classList.add("definition-ul");
      meaningDiv.appendChild(definitionUl);

      // Get definitions from meanings
      const definitions = meanings[i].definitions;

      // Print definitions to modal
      for (let j = 0; j < definitions.length; j++) {
        const definitionLi = document.createElement("li");
        definitionLi.classList.add("definition-li");
        definitionLi.innerText = definitions[j].definition;
        definitionUl.appendChild(definitionLi);
      }
    }
  }
}
