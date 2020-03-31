//Setup
let myLibrary = [];
const dbRef = firebase.database();

//Check if storage is available
function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
}

Book.prototype.status = false;

function openNewBookForm() {
  document.querySelector("#newBookFormDiv").style.display = "block";
}

function closeNewBookForm() {
  document.querySelector("#newBookFormDiv").style.display = "none";
}

function addBookToLibrary() {
  let book = new Book(bookTitle.value, bookAuthor.value, bookPages.value);
  myLibrary.push(book);
  writeToDb();
  render();
}

function deleteBook(i) {
  console.log("deleting");
  myLibrary.splice(i, 1);
  writeToDb();
  let booksInLibrary = myLibrary.length;
  dbRef.ref("books").once("value", snap => {
    bookEntriesInDb = snap.val();
    console.log(Object.keys(bookEntriesInDb).length);
    for (let j = Object.keys(bookEntriesInDb).length; j > booksInLibrary; j--) {
      dbRef.ref("books/book" + j).remove();
    }
  });

  dbRef.ref("libraryData").set({
    booksInLibrary: booksInLibrary
  });
  render();
}

function readBook(i) {
  if (myLibrary[i].status == true) {
    myLibrary[i].status = false;
  } else {
    myLibrary[i].status = true;
  }
  writeToDb();
  render();
}

// Write books to firebase database or local storage
function writeToDb() {
  try {
    for (let i = 0; i < myLibrary.length; i++) {
      let book = `book${i + 1}`;
      let title = myLibrary[i].title;
      let author = myLibrary[i].author;
      let pages = myLibrary[i].pages;
      let status = myLibrary[i].status;

      dbRef.ref("books/" + book).set({
        title: title,
        author: author,
        pages: pages,
        status: status
      });
    }
    let booksInLibrary = myLibrary.length;
    dbRef.ref("libraryData").set({
      booksInLibrary: booksInLibrary
    });
  } catch {
    writeToLocal();
  }
}

//Read books from firebase database or local storage
function readFromDb() {
  try {
    myLibrary = [];
    dbRef.ref("libraryData").on("child_added", snap => {
      booksInLibrary = snap.val();
      for (let i = 0; i < booksInLibrary; i++) {
        dbRef.ref("books/book" + (i + 1)).once("value", snap => {
          bookObject = snap.val();
          let title = bookObject.title;
          let author = bookObject.author;
          let pages = bookObject.pages;
          let status = bookObject.status;
          let createdBook = new Book(title, author, pages);
          myLibrary.push(createdBook);
          myLibrary[i].status = status;
          render();
        });
      }
    });
  } catch {
    readFromLocal();
  }
}

//Save books to localstorage
function writeToLocal() {
  if (storageAvailable("localStorage")) {
    localStorage.clear();
    for (let i = 0; i < myLibrary.length; i++) {
      let title = myLibrary[i].title;
      let author = myLibrary[i].author;
      let pages = myLibrary[i].pages;
      let status = myLibrary[i].status;
      localStorage.setItem(`Book${i} Title`, title);
      localStorage.setItem(`Book${i} Author`, author);
      localStorage.setItem(`Book${i} Pages`, pages);
      localStorage.setItem(`Book${i} Status`, status);
    }
  }
}

//Populates the books from localStorage
function readFromLocal() {
  if (storageAvailable("localStorage")) {
    for (let i = 0; i < localStorage.length / 4; i++) {
      let title = localStorage.getItem(`Book${i} Title`);
      let author = localStorage.getItem(`Book${i} Author`);
      let pages = localStorage.getItem(`Book${i} Pages`);
      let status = localStorage.getItem(`Book${i} Status`);
      let createdBook = new Book(title, author, pages);
      myLibrary.push(createdBook);
      myLibrary[i].status = status;
    }
  }
  render();
}

function render() {
  const tableBody = document.querySelector("#tableBody");

  //Clear table
  while (tableBody.rows.length >= 1) {
    tableBody.deleteRow(0);
  }

  //Set rows to odd or even for color coding
  let situation1 = "";
  let situation2 = "";
  if (myLibrary.length % 2 === 0) {
    situation1 = "even";
    situation2 = "odd";
  } else {
    situation1 = "odd";
    situation2 = "even";
  }

  //Append each book
  for (let i = 0; i < myLibrary.length; i++) {
    let row = tableBody.insertRow(0);

    row.setAttribute("id", `row${i}`);

    if (tableBody.rows.length % 2 === 0) {
      row.classList.add(situation1);
    } else {
      row.classList.add(situation2);
    }

    let titleCell = row.insertCell(0);
    let authorCell = row.insertCell(1);
    let pagesCell = row.insertCell(2);
    let statusCell = row.insertCell(3);
    let deleteBtn = row.insertCell(4);

    titleCell.setAttribute("id", `title${i}`);
    titleCell.setAttribute("value", `${myLibrary[i].title}`);

    pagesCell.setAttribute("class", "toCenter");
    statusCell.setAttribute("class", "toCenter");
    deleteBtn.setAttribute("class", "toCenter");

    titleCell.innerHTML = myLibrary[i].title;
    authorCell.innerHTML = myLibrary[i].author;
    pagesCell.innerHTML = myLibrary[i].pages;
    if (myLibrary[i].status) {
      statusCell.innerHTML = "Yes";
    } else {
      statusCell.innerHTML = "No";
    }

    //Create delete button
    deleteBtn.innerHTML = `<button class="deleteBtn" id="delete${i}" onclick="deleteBook(${i})">-</button>`;
    deleteBtn.classList.add("deleteBtnColumn");
    deleteBtn.setAttribute("id", i);

    //Create status cell and add correct classes
    const statusBtn = document.getElementById(`status${i}`);
    if (myLibrary[i].status == true) {
      statusCell.innerHTML = `<button class="statusBtn statusTrue" id="status${i}" onclick="readBook(${i})">COMPLETED</button>`;
    } else {
      statusCell.innerHTML = `<button class="statusBtn statusFalse" id="status${i}" onclick="readBook(${i})">NOT COMPLETED</button>`;

    }
  }
}

//Prevent the form from refreshing page on submit
const form = document.querySelector("#bookForm");

function handleForm(event) {
  event.preventDefault();
  render();
}
form.addEventListener("submit", handleForm);

readFromDb();
