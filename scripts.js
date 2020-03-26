const form = document.querySelector("#bookForm");

function handleForm(event) {
  event.preventDefault();
  render();
}
form.addEventListener("submit", handleForm);

let myLibrary = [];

const book1 = new Book("Harry Potter", "J.R. Tolkien", 55, false);
const book2 = new Book("God of War", "J.K. Rowling", 525, true);
myLibrary.push(book1);
myLibrary.push(book2);

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.listInfo = function() {
    let info = "";
    if (read === true) {
      info = `${title} by ${author}, ${pages} page(s), has been read`;
    } else {
      info = `${title} by ${author}, ${pages} page(s), not read yet`;
    }
    return info;
  };
}

function openNewBookForm() {
  document.querySelector("#newBookFormDiv").style.display = "block";
}

function closeNewBookForm() {
  document.querySelector("#newBookFormDiv").style.display = "none";
}

function addBookToLibrary() {
  const bookTitle = document.querySelector("#bookTitle");
  const bookAuthor = document.querySelector("#bookAuthor");
  const bookPages = document.querySelector("#bookPages");
  const bookRead = document.querySelector("#bookRead");

  let book = new Book(
    bookTitle.value,
    bookAuthor.value,
    bookPages.value,
    bookRead.value
  );
  myLibrary.push(book);
}

function render() {
  const bookDiv = document.querySelector('#bookDiv')
  for (let i = 0; i < myLibrary.length; i++) {
    const div = document.createElement('table');
    const tr1 = document.createElement('tr');
    const tr2 = document.createElement('tr');
    const tr3 = document.createElement('tr');
    const tr4 = document.createElement('tr');

    const bookTitle = document.createElement('td');
    const bookAuthor = document.createElement('td');
    const bookPages = document.createElement('td');
    const bookRead = document.createElement('td');

    div.classList.add('bookRender');

    bookDiv.appendChild(div);
    div.appendChild(tr1);
    tr1.appendChild(bookTitle);
    bookTitle.textContent = myLibrary[i].title;

    div.appendChild(tr2);
    tr2.appendChild(bookAuthor);
    bookAuthor.textContent = `Author: ${myLibrary[i].author}`;

    div.appendChild(tr3);
    tr3.appendChild(bookPages);
    bookPages.textContent = `Pages: ${myLibrary[i].pages}`;

    div.appendChild(tr4);
    tr4.appendChild(bookRead);
    if (myLibrary[i].read == true) {
      bookRead.textContent = "Finished: Yes";
    } else {
      bookRead.textContent = "Finished: No";
    }
    
  }
}

render();