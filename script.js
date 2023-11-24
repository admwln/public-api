//nouns = Array.from(new Set(nouns));

//Get words from Random word api
// https://random-word-api.herokuapp.com/word?number=1&lang=en&length=6
const newGameBtn = document.querySelector("#load-game");
const randomWordUrl = "https://random-word-api.herokuapp.com/word?lang=en";
//Get words on click
newGameBtn.addEventListener("click", () => {
  const wordLength = document.querySelector("#word-length").value;
  const getWords = async () => {
    const response = await fetch(
      randomWordUrl + "&number=50&length=" + wordLength
    );
    const results = await response.json();
    nouns = results;
    console.log(nouns);
  };
  getWords();
  startGame();
});

const newWordBtn = document.querySelector("#new-word");
const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const choiceContainer = document.querySelector("#choices");
let randomWord;

// Generate new word on click
function startGame() {
  // Get definition of random word from Free Dictionary API
  const getDefinition = async () => {
    // Empty choice div
    choiceContainer.innerHTML = "";
    const randomIndex = Math.floor(Math.random() * nouns.length);
    randomWord = nouns[randomIndex];
    console.log(randomWord);
    // Remove random word from nouns array (at position randomIndex, remove one item)
    nouns.splice(randomIndex, 1);
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

    // Compare strings in sourceUrls array to find the shortest one
    let shortestUrl = sourceUrls.reduce((a, b) =>
      a.length <= b.length ? a : b
    );

    let dictionaryForm = shortestUrl.split("/");
    dictionaryForm = dictionaryForm[dictionaryForm.length - 1];
    console.log(dictionaryForm);
    randomWord = dictionaryForm;

    const definitions = results[0].meanings;

    // Save first definition to variable and display
    let definition = definitions[0].definitions[0].definition;

    // Save first 2/3 of randomWord to variable
    let beginningOfWord;
    if (randomWord.length > 4) {
      beginningOfWord = randomWord.slice(
        0,
        Math.round((-1 * randomWord.length) / 2)
      );
      console.log("Beginning of word: " + beginningOfWord);
      // If current word is 4 characters or less, use the whole word
    } else {
      beginningOfWord = randomWord;
      console.log("Beginning of word: " + beginningOfWord);
    }

    // Save last 2/3 of randomWord to variable
    let endOfWord;
    if (randomWord.length > 4) {
      endOfWord = randomWord.slice(
        Math.round((-1 * randomWord.length) / 2),
        randomWord.length
      );
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
      const choiceSpan = document.createElement("span");
      choiceSpan.classList.add("choice");
      choiceSpan.innerText = multipleChoices[i];
      choiceContainer.appendChild(choiceSpan);
    }

    getChoiceSpans();
  };
  getDefinition();
}

newWordBtn.addEventListener("click", () => {
  startGame();
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

// Get all multiple choice spans and make them clickable
function getChoiceSpans() {
  const choiceSpans = document.querySelectorAll(".choice");
  for (let j = 0; j < choiceSpans.length; j++) {
    choiceSpans[j].onclick = function (event) {
      const chosenAnswer = event.target.firstChild.textContent
        .trim()
        .replace(/\s+/g, " ");
      // Compare chosen answer with current word
      if (randomWord === chosenAnswer) {
        alert("Correct!");
      } else {
        alert("Try again!");
      }
    };
  }
}
