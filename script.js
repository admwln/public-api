const nouns = [
  "book",
  "time",
  "girl",
  "word",
  "house",
  "heart",
  "money",
  "water",
  "music",
  "light",
  "chair",
  "apple",
  "cloud",
  "dream",
  "earth",
  "smile",
  "party",
  "snake",
  "flower",
  "bread",
  "stone",
  "peace",
  "space",
  "ghost",
  "queen",
  "river",
  "dream",
  "brain",
  "fruit",
  "honey",
  "tiger",
  "lemon",
  "piano",
  "ocean",
  "laugh",
  "faith",
  "sugar",
  "beach",
  "rover",
  "mouse",
  "dream",
  "fairy",
  "sword",
  "grape",
  "robot",
  "ghost",
  "cloud",
  "shoes",
  "horse",
  "storm",
  "chalk",
  "watch",
  "whale",
  "night",
  "beard",
  "dream",
  "music",
  "space",
  "soul",
  "guide",
  "dream",
  "globe",
  "happy",
  "honor",
  "dream",
  "power",
  "light",
  "heart",
  "peace",
  "dream",
  "beast",
  "grace",
  "storm",
  "voice",
  "fruit",
  "glass",
  "faith",
  "dream",
  "charm",
  "child",
  "stone",
  "mouse",
  "heart",
  "dance",
  "dream",
  "flower",
  "ocean",
  "spark",
  "beach",
  "dream",
  "smile",
  "child",
  "faith",
  "music",
  "dream",
  "flame",
  "cloud",
  "night",
  "dream",
  "magic",
  "angel",
  "peace",
  "dream",
];

const newWordBtn = document.querySelector("#new-word");
const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
newWordBtn.addEventListener("click", () => {
  const randomWord = nouns[Math.floor(Math.random() * nouns.length)];
  console.log(randomWord);
  // Get definition of random word from Free Dictionary API
  const getDefinition = async () => {
    const response = await fetch(baseUrl + randomWord);

    const results = await response.json();
    const definitions = results[0].meanings;
    console.log(definitions);
    // Loop through definitions and display
    //for (let i = 0; i < definitions.length; i++) {
    const definition = definitions[0].definitions[0].definition;
    const initalLetter = randomWord.charAt(0).toUpperCase();
    const initialDisplay = document.querySelector("#initial");
    initialDisplay.innerHTML = initalLetter;
    const definitionDisplay = document.querySelector("#definition");

    definitionDisplay.innerHTML = definition;
    //}
  };
  getDefinition();
});
