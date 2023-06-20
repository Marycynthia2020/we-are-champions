import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://playground-46f58-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsmentListInDB = ref(database, "endorsment");

const inputField = document.getElementById("input-field");
const inputFrom = document.getElementById("input-from");
const inputTo = document.getElementById("input-to");
let endorsementContainer = document.querySelector('.container-2')
let publishButton = document.getElementById("publish-button");

onValue(endorsmentListInDB, function(snapshot) {
    if(snapshot.exists()) {
        let messageArrayfromDB = Object.entries(snapshot.val())
        clearDB()
        for(let i = 0; i <  messageArrayfromDB.length; i++){
            let currentItem = messageArrayfromDB[i]
            let itemID = currentItem[0]
            let itemValue = currentItem[1]
            appendItems(itemValue, itemID)
        }
    }else {
        endorsementContainer.innerHTML = `<p style = 'color:white' >Nothing is here... enter an endorsement</p>`
    }
})

publishButton.addEventListener("click", addEndorsement);

function addEndorsement() {
  let inputFieldmessage = inputField.value;
  let senderName = inputFrom.value;
  let receiverName = inputTo.value;
  let objectSentToDB = {
    sender: senderName,
    content: inputFieldmessage,
    receiver: receiverName,
  };
  push(endorsmentListInDB, objectSentToDB);
  clearInputs()
}

function appendItems(item, itemID) {
  let newDiv = document.createElement("div");
  newDiv.classList.add("endorsement-container");
  let receiverP = document.createElement("p");
  receiverP.classList.add("message-to");
  receiverP.textContent = `to ${item.receiver}`;

  let contentP = document.createElement("p");
  contentP.classList.add("message-content");
  contentP.textContent = `${item.content}`;

  let senderP = document.createElement("p");
  senderP.classList.add("message-from");
  senderP.textContent = `from ${item.sender}`;

  let fromDiv = document.createElement('div')
  fromDiv.classList.add('from-div')
  let loveEmojiDiv =document.createElement('div')
  loveEmojiDiv.classList.add('love-emoji-div')

  let loveEmoji = document.createElement('p')
  loveEmoji.textContent = '🖤'

  let emojiCount = document.createElement('p')

  loveEmojiDiv.append(loveEmoji, emojiCount)
  fromDiv.append(senderP, loveEmojiDiv)

  newDiv.append(receiverP, contentP, fromDiv);
  endorsementContainer.prepend(newDiv);

  newDiv.addEventListener('click', function() {
    let exactLocation = ref(database, `endorsment/${itemID}`)  
    remove(exactLocation)   
  })
}

function clearInputs() {
    inputField.value = ''
    inputFrom.value = ''
    inputTo.value = ''
}
function clearDB() {
    endorsementContainer.innerHTML = ''
}
