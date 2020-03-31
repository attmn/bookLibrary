// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCzmYBXbVEpWZb3DoW-pxAmAoZjT5KnW-k",
  authDomain: "libraryapp-99655.firebaseapp.com",
  databaseURL: "https://libraryapp-99655.firebaseio.com",
  projectId: "libraryapp-99655",
  storageBucket: "libraryapp-99655.appspot.com",
  messagingSenderId: "614181872943",
  appId: "1:614181872943:web:1bbacf87bf486f6fc76dda"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Get elements
const preObject = document.getElementById("object");
const ulList = document.getElementById("list");

//Create references
const dbRefObject = firebase
  .database()
  .ref()
  .child("object");
const dbRefList = dbRefObject.child("hobbies");

//Sync object changes
//dbRefObject.on('value', snap => console.log(snap.val()));

//Sync list changes
dbRefList.on("child_added", snap => {
  const li = document.createElement("li");
  li.innerText = snap.val();
  li.id = snap.key;
  ulList.appendChild(li);
});

dbRefList.on("child_changed", snap => {
  const liChanged = document.getElementById(snap.key);
  liChanged.innerText = snap.val();
});

dbRefList.on("child_removed", snap => {
  const liToRemove = document.getElementById(snap.key);
  liToRemove.remove();
});
