let nouns = [];
let currentWordJson;
let correctCounter;
//nouns = Array.from(new Set(nouns));

//Get words from Random word api
// https://random-word-api.herokuapp.com/word?number=1&lang=en&length=6
const loadGameBtn = document.querySelector("#load-game");
const randomWordUrl = "https://random-word-api.herokuapp.com/word?lang=en";
//Get words on click
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

  const wordLength = document.querySelector("#word-length").value;
  const getWords = async () => {
    const response = await fetch(
      randomWordUrl + "&number=100&length=" + wordLength
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
  let crashCount = 0;

  // Reset randomWord
  randomWord = undefined;

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
    if (crashCount === 10) {
      alert("Something went wrong, please try again.");
      return;
    }
    console.log("random word: " + randomWord);

    if (randomWord === undefined) {
      //randomWord = "blue";
      const randomIndex = Math.floor(Math.random() * nouns.length);
      randomWord = nouns[randomIndex];
      console.log(randomWord);
      // Remove random word from nouns array (at position randomIndex, remove one item)
      nouns.splice(randomIndex, 1);
    }

    if (randomWord === undefined) {
      console.log("random word is undefined, will die");

      return;
    }

    // If randomWord ends with 'sses', remove 'es'
    if (randomWord.slice(-4) === "sses") {
      randomWord = randomWord.slice(0, -2);
      console.log("Random word ends with 'sses', removing 'es'");
    }

    // If randomWord ends with 's', but not 'ss' or 'ous' or 'snes'...
    if (
      randomWord.slice(-1) === "s" &&
      randomWord.slice(-2) !== "ss" &&
      randomWord.slice(-2) !== "us" &&
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
    currentWordJson = results;

    //Catch error if no definition is found
    if (results.title === "No Definitions Found") {
      console.log("No definition found, re-calling function");
      // Unset randomWord
      randomWord = undefined;
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
    // Check if current randomWord is not the same as dictionaryForm
    if (randomWord !== dictionaryForm) {
      console.log("Random word is not the same as dictionary form");
      // Change randomWord to dictionaryForm
      randomWord = dictionaryForm;

      // Recursive call to the function
      // !!! getDefinition() also gets a whole new radom word.
      getDefinition();
      return;
    }

    // Get definitions from results
    const definitions = results[0].meanings;

    // Save first definition to variable and display
    let definition = definitions[0].definitions[0].definition;

    // Save first 3 characters of randomWord to variable
    let beginningOfWord;
    if (randomWord.length > 3) {
      beginningOfWord = randomWord.slice(
        0,
        Math.round(3 + randomWord.length * 0.1)
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
      endOfWord = randomWord.slice(-Math.round(3 + randomWord.length * 0.1));
      console.log("End of word: " + endOfWord);
      // If current word is 4 characters or less, use the whole word
    } else {
      endOfWord = randomWord;
      console.log("End of word: " + endOfWord);
    }

    // Make definition lowercase
    let definitionLower = definition.toLowerCase();

    if (
      definitionLower.includes(beginningOfWord) ||
      definitionLower.includes(endOfWord)
    ) {
      console.log("Flagged definition: '" + definition + "'");
      console.log("Definition includes beginning of word, re-calling function");
      // Unset randomWord
      randomWord = undefined;
      // Recursive call to the function
      getDefinition();
      return;
    }

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

    // Generate array with four words, including our current randomWord
    let multipleChoices = [];
    // Push current randomWord to array
    multipleChoices.push(randomWord);
    // Shuffle noun array
    shuffleArray(nouns);
    // Add first 3 strings to multipleChoices array
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
      // Flag correct answer
      if (multipleChoices[i] === randomWord) {
        choiceBtn.classList.add("correct-answer");
      }
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
      // Make correct answer green
      const correctAnswer = document.querySelector(".correct-answer");
      correctAnswer.classList.add("correct-reveal");

      const clickedAnswer = event.target;
      const clickedAnswerText = event.target.firstChild.textContent
        .trim()
        .replace(/\s+/g, " ");
      // Compare chosen answer with current word
      if (randomWord === clickedAnswerText) {
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
        // Enable #load-game button at end of game
        const loadGameBtn = document.querySelector("#load-game");
        loadGameBtn.disabled = false;
        // Display result containter at end of game
        const resultContainer = document.querySelector(".result");
        resultContainer.classList.remove("hidden");
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
