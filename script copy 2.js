const form = document.querySelector("form");
const baseUrl = "https://openlibrary.org/search/authors.json?q=";
let authorWorks;
let authorName;
let authorKey;
let myBooks = [];

form.addEventListener("submit", (event) => {
  event.preventDefault();

  //Search for author
  const searchQuery = document.querySelector("#author-search").value;

  const searchAuthor = async () => {
    const response = await fetch(baseUrl + searchQuery);

    const authorSearchResult = await response.json();
    authorKey = authorSearchResult.docs[0].key;
    authorName = authorSearchResult.docs[0].name;
    console.log(authorName);
    console.log(authorKey);
    getAuthorWorks(authorKey);
  };

  searchAuthor();
});

const authorsUrl = "https://openlibrary.org/authors/";

const getAuthorWorks = async (authorKey) => {
  const response = await fetch(
    authorsUrl + authorKey + "/works.json?limit=100"
  );

  authorWorks = await response.json();
  authorWorks = authorWorks.entries;
  // console.log(authorWorks);

  // Loop thru to get workKey for each work
  for (let i = 0; i < authorWorks.length; i++) {
    const workKey = authorWorks[i].key;
    // console.log(workKey);
    await getEditions(workKey);
  }
  console.log(myBooks);

  // Get 20 covers from myBooks and display
  const shelf = document.querySelector("#bookshelf");
  const coversUrl = "https://covers.openlibrary.org/b/id/"; // + "-L.jpg"

  //Loop tru 10 first books in myBooks and pass book key to populateBookshelf();
  for (let j = 0; j < 15; j++) {
    const coverKey = myBooks[j].coverKey;
    //console.log(book.coverKey);
    if (coverKey > 0) {
      const myBookCover = document.createElement("img");
      myBookCover.src = coversUrl + coverKey + "-L.jpg";
      console.log(myBookCover);
      shelf.appendChild(myBookCover);
    }
  }
};

const getEditions = async (workKey) => {
  const response = await fetch(
    "https://openlibrary.org" + workKey + "/editions.json"
  );
  let editions = await response.json();
  editions = editions.entries;

  //   const result = await Promise.all([
  //     fetch("https://openlibrary.org" + 1 + "/editions.json"),
  //     fetch("https://openlibrary.org" + 2 + "/editions.json"),
  //     fetch("https://openlibrary.org" + 3 + "/editions.json")
  //   ])

  for (let i = 0; i < editions.length; i++) {
    const myEdition = editions[i];
    if (myEdition.languages) {
      if (
        myEdition.languages[0].key == "/languages/eng" &&
        Array.isArray(myEdition.covers)
      ) {
        let myBook;
        const cover = myEdition.covers[0];
        const title = myEdition.title;
        const work = myEdition.key;

        myBook = {
          authorKey: authorKey,
          authorName: authorName,
          bookTitle: title,
          coverKey: cover,
          workKey: work,
        };
        myBooks.push(myBook);
      }
    }
  }
};
