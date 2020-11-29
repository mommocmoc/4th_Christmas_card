 //snowflakes setup
    var option = {
        // container: document.querySelector(".christmas-card"),
        // color: "#121eba",
        count: 550,
        speed: 8,
        maxOpacity: 2,
        minSize: 20,
        maxSize: 50,
        zIndex: 10
    }
    var sf;
$(function () {
    //SOCKET IO
    var socket = io();
    // Initialize variables
    let isUserNumAdded = false;
    let isMessageOpened = false;
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $inputMessage = $('.inputMessage'); // Input message input box
    var $loginPage = $('.login.page'); // The login page
    var $overlayPage = $('.overlay.page'); // The overlay page
    var $overlayContent = $('.overlay.content'); // The overlay page
    var $cardPage = $('.card.page'); // The overlay page
    //hide pages
    $overlayContent.hide();
    $overlayPage.hide();
    $cardPage.hide();
    // Prompt for setting a username
    var username;
    var $currentInput = $usernameInput.focus();

    // First User Connect
    socket.on('user added', (data) => {
        if (isUserNumAdded) return
        let userNum = data.userNum;
        isUserNumAdded = true;
        if (userNum < 3) {
            makeMessage(userNum);
            makeSnowFlakes(userNum);
        } else {
            //3명 이상 됐을 때 메시지 보이기!
        }
    })

    // Another User Connect
    socket.on('new user added', (data) => {
        // if (isMessageOpened) return
        let userNum = data.userNum;
        console.log(userNum);
        if (userNum < 3) {
            makeMessage(userNum);
            makeSnowFlakes(userNum);
        } else {
            //3명 이상 됐을 때 메시지 보이기!
        }
    })

    // Another User Disconnect
    socket.on('user left', (data) => {
        if (isMessageOpened) return
        let userNum = data.userNum;
        // let pElem = document.getElementById('counter');
        if (userNum < 3) {
            makeMessage(userNum);
            makeSnowFlakes(userNum);
        } else {
            //3명 이상 됐을 때 메시지 보이기!
        }
    })

    //Function 설정
    //nickname 설정 Function
    const setUsername = () => {
        username = cleanInput($usernameInput.val().trim());
        // If the username is valid
        if (username) {
            $loginPage.fadeOut();
            $overlayPage.show();
            $overlayContent.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();
            //make snow flake
            sf = new Snowflakes(option)
            // Tell the server your username
            socket.emit('add user', username);
        }
    }
    // pElement 만들기 Function
    const makeMessage = (userNum) => {
        let pElem = document.getElementById('counter');
        let maxNum = 3;
        if (userNum > 1) {
            pElem.style.color = "black";
            pElem.innerText = `${userNum} people here :) Invite ${maxNum-userNum} more friends here`;
        } else {
            pElem.style.color = "coral";
            pElem.innerText = `Just you alone here :( Invite your friends and read this card together :)`;
        }
    }
    // snowflakes controller Function
    const makeSnowFlakes = (userNum) => {
        sf.destroy();
        if (userNum > 1) {
            option.count = 50;
            option.speed = 1;
        } else {
            option.count = 550;
            option.speed = 8;
        }
        sf.constructor(option)
    }

    // Prevents input from having injected markup Function
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

    // Keyboard events
    $window.keydown(event => {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) return
            setUsername();
        }
    });

    // Click events
    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
        $currentInput.focus();
    });

});