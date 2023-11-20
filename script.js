const form = document.querySelector("form");
const baseUrl = "https://openlibrary.org/search/authors.json?q=";
let authorWorks;
let authorName;
let myBooks = [];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let authorKey;
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

// const authorsUrl = "https://openlibrary.org/authors/";
const authorsUrl = "https://openlibrary.org/books/";

const getAuthorWorks = async (authorKey) => {
  //const response = await fetch(authorsUrl + authorKey + "/works.json");
  const response = await fetch(authorsUrl + authorKey + ".json");

  authorWorks = await response.json();
  authorWorks = authorWorks.entries;
  console.log(authorWorks);
  // Loop through the covers of each work
  for (let i = 0; i < authorWorks.length; i++) {
    let myBook;
    const covers = authorWorks[i].covers;
    const title = authorWorks[i].title;
    if (Array.isArray(covers)) {
      myBook = {
        authorKey: authorKey,
        authorName: authorName,
        bookTitle: title,
        coverKey: covers[0],
      };
      myBooks.push(myBook);
    }
  }
  // Loop tru 10 first books in myBooks and pass book key to populateBookshelf();
  for (let i = 0; i < 10; i++) {
    const book = myBooks[i];
    populateBookshelf(book.coverKey);
  }
};

// Get 20 covers from myBooks and display
const shelf = document.querySelector("#bookshelf");
const coversUrl = "https://covers.openlibrary.org/b/id/"; // + "-L.jpg"

function populateBookshelf(bookKey) {
  const myBookCover = document.createElement("img");
  myBookCover.src = coversUrl + bookKey + "-L.jpg";
  //console.log(myBookCover);
  shelf.appendChild(myBookCover);
}
