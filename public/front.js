var socket = io();
var counter = document.getElementById('counter');
let isUserNumAdded = false;

socket.on('user added', (data) => {
    if (isUserNumAdded) return
    let userNum = data;
    let pElem = document.createElement("p")
    pElem.id = "counter"
    if (userNum > 1) {
        pElem.innerText = `${userNum} people here :)`;
    } else {
        pElem.innerText = `${userNum} people here :( Invite your friends and read this card together :)`;
    }
    counter.appendChild(pElem)
    isUserNumAdded = true;
})

socket.on('new user added', (data) => {
    let userNum = data;
    let pElem = document.getElementById('counter');
    pElem.innerText = `${userNum} people here :)`
})

socket.on('user left', (data) => {
    let userNum = data;
    let pElem = document.getElementById('counter');
    if (userNum > 1) {
        pElem.innerText = `${userNum} people here :)`;
    } else {
        pElem.innerText = `${userNum} people here :( Invite your friends and read this card together :)`;
    }
})