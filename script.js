// let nouns = [
//   "book",
//   "time",
//   "girl",
//   "word",
//   "house",
//   "heart",
//   "money",
//   "water",
//   "music",
//   "light",
//   "chair",
//   "apple",
//   "cloud",
//   "dream",
//   "earth",
//   "smile",
//   "party",
//   "snake",
//   "flower",
//   "bread",
//   "stone",
//   "peace",
//   "space",
//   "ghost",
//   "queen",
//   "river",
//   "dream",
//   "brain",
//   "fruit",
//   "honey",
//   "tiger",
//   "lemon",
//   "piano",
//   "ocean",
//   "laugh",
//   "faith",
//   "sugar",
//   "beach",
//   "rover",
//   "mouse",
//   "dream",
//   "fairy",
//   "sword",
//   "grape",
//   "robot",
//   "ghost",
//   "cloud",
//   "shoes",
//   "horse",
//   "storm",
//   "chalk",
//   "watch",
//   "whale",
//   "night",
//   "beard",
//   "dream",
//   "music",
//   "space",
//   "soul",
//   "guide",
//   "dream",
//   "globe",
//   "happy",
//   "honor",
//   "dream",
//   "power",
//   "light",
//   "heart",
//   "peace",
//   "dream",
//   "beast",
//   "grace",
//   "storm",
//   "voice",
//   "fruit",
//   "glass",
//   "faith",
//   "dream",
//   "charm",
//   "child",
//   "stone",
//   "mouse",
//   "heart",
//   "dance",
//   "dream",
//   "flower",
//   "ocean",
//   "spark",
//   "beach",
//   "dream",
//   "smile",
//   "child",
//   "faith",
//   "music",
//   "dream",
//   "flame",
//   "cloud",
//   "night",
//   "dream",
//   "magic",
//   "angel",
//   "peace",
//   "dream",
// ];

let nouns = [
  "library",
  "justice",
  "exhibit",
  "freight",
  "monarch",
  "foreman",
  "network",
  "context",
  "support",
  "monster",
  "victory",
  "journey",
  "paradox",
  "tribute",
  "justice",
  "foreman",
  "keyword",
  "insight",
  "monarch",
  "freight",
  "journal",
  "diamond",
  "control",
  "champion",
  "element",
  "harvest",
  "captain",
  "command",
  "fantasy",
  "whisper",
  "freight",
  "partner",
  "vagabond",
  "mystery",
  "tribute",
  "organize",
  "forever",
  "silence",
  "majestic",
  "stimulus",
  "stronger",
  "capture",
  "whisper",
  "champion",
  "perfect",
  "element",
  "forgive",
  "flexible",
  "disaster",
  "fantasy",
  "original",
  "division",
  "journey",
  "harvest",
  "creative",
  "organize",
  "freight",
  "diamond",
  "stimulus",
  "tribute",
  "paradox",
  "strategy",
  "monarch",
  "captain",
  "majestic",
  "perfect",
  "whisper",
  "journey",
  "organize",
  "stimulus",
  "flexible",
  "silence",
  "forever",
  "champion",
  "original",
  "element",
  "strategy",
  "freight",
  "paradox",
  "tribute",
  "diamond",
  "harvest",
  "justice",
  "captain",
  "monster",
  "majestic",
  "perfect",
  "network",
  "context",
  "champion",
  "element",
  "strategy",
  "freight",
  "original",
  "captain",
  "monster",
  "tribute",
  "majestic",
  "paradox",
  "journey",
  "justice",
  "diamond",
  "foreman",
  "organize",
  "stimulus",
];

nouns = Array.from(new Set(nouns));

const newWordBtn = document.querySelector("#new-word");
const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const choiceContainer = document.querySelector("#choices");
let randomWord;

// Generate new word on click
newWordBtn.addEventListener("click", () => {
  // Empty choice div
  choiceContainer.innerHTML = "";
  const randomIndex = Math.floor(Math.random() * nouns.length);
  randomWord = nouns[randomIndex];
  console.log(randomWord);
  // Remove random word from nouns array (at position randomIndex, remove one item)
  nouns.splice(randomIndex, 1);
  // Get definition of random word from Free Dictionary API
  const getDefinition = async () => {
    const response = await fetch(baseUrl + randomWord);
    const results = await response.json();
    const definitions = results[0].meanings;

    // Save first definition to variable and display
    const definition = definitions[0].definitions[0].definition;
    const definitionDisplay = document.querySelector("#definition");
    definitionDisplay.innerHTML = definition;

    // Generate array with ten words, including our current randomWord
    let multipleChoices = [];
    // Push current randomWord to array
    multipleChoices.push(randomWord);
    // Shuffle noun array
    shuffleArray(nouns);
    // Add first 9 strings to multipleChoices array
    for (let i = 0; i < 9; i++) {
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
