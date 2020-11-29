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
 //after page loaded
 $(function () {
     //SOCKET IO
     var socket = io();
     //BGM
     var windSound = new Howl({
         src: ['wind.mp3'],
         loop: true
     })
     var christmasSound = new Howl({
         src: ['christmas.mp3'],
         loop: true
     })
     // Initialize variables
     var t;
     let isUserNumAdded = false;
     let isMessageOpened = false;
     var $window = $(window);
     var $usernameInput = $('.usernameInput'); // Input for username
     var $inputMessage = $('.inputMessage'); // Input message input box
     var $loginPage = $('.login.page'); // The login page
     var $overlayPage = $('.overlay.page'); // The overlay page
     var $overlayContent = $('.overlay.content'); // The overlay page
     var $cardPage = $('.card.page'); // The overlay page
     var $cardContent = $('#typed-strings');
     //hide pages
     $overlayContent.hide();
     $overlayPage.hide();
     $cardPage.hide();
     // Prompt for setting a username
     var username;
     var $currentInput = $usernameInput.focus();

     // First User Connect
     socket.on('user added', (data) => {
         if (isUserNumAdded) return;
         if (isMessageOpened) return;
         let userNum = data.userNum;
         let userNameList = data.userNameList;
         isUserNumAdded = true;
         makeSnowFlakes(userNum);
         makeMessage(userNum, userNameList);
         if (userNum >= 3) {
             //3명 이상 됐을 때 메시지 보이기!
             $overlayContent.hide();
             $overlayPage.fadeOut();
             $cardPage.show();
             $cardContent.hide();
             windSound.fade(1, 0, 1000);
             christmasSound.play();
             var t = new Typed('#dear', {
                 stringsElement: '#users-strings',
                 showCursor: false,
                 typeSpeed: 100,
                 backDelay: 200,
                 contentType: 'html',
                 onComplete: () => {
                     var t2 = new Typed('#typed', {
                         stringsElement: '#typed-strings',
                         typeSpeed: 100,
                         showCursor: false
                     })
                 }
             })
         }
     })

     // Another User Connect
     socket.on('new user added', (data) => {
         if (isUserNumAdded) return;
         if (isMessageOpened) return;
         let userNum = data.userNum;
         let userNameList = data.userNameList;
         console.log(userNum);
         makeSnowFlakes(userNum);
         makeMessage(userNum, userNameList);
         if (userNum >= 3) {
             //3명 이상 됐을 때 메시지 보이기!
             isMessageOpened = true;
             windSound.fade(1, 0, 1000);
             christmasSound.play();
             $overlayContent.hide();
             $overlayPage.fadeOut();
             $cardPage.show();
             $cardContent.hide();
             t = new Typed('#dear', {
                 stringsElement: '#users-strings',
                 showCursor: false,
                 typeSpeed: 100,
                 backDelay: 200,
                 contentType: 'html',
                 onComplete: () => {
                     var t2 = new Typed('#typed', {
                         stringsElement: '#typed-strings',
                         typeSpeed: 100,
                         showCursor: false
                     })
                 }
             })
         }
     })

     // Another User Disconnect
     socket.on('user left', (data) => {
         if (isMessageOpened) return
         let userNum = data.userNum;
         let userNameList = data.userNameList;
         // let pElem = document.getElementById('counter');
         makeMessage(userNum, userNameList);
         makeSnowFlakes(userNum);
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
             //
             windSound.play();
             // Tell the server your username
             socket.emit('add user', username);
         }
     }
     // pElement 만들기 Function
     const makeMessage = (userNum, userList) => {
         let pElem = document.querySelector('#counter');
         let users = document.querySelector('#users');
         let maxNum = 3;
         if (userNum > 1) {
             users.innerText = `Dear ${userList} 😄`;
             pElem.style.color = "black";
             pElem.innerText = `${userNum} people here :) Invite ${maxNum-userNum} more friends here \n Current Users : ${userList}`;
         } else {
             pElem.style.color = "coral";
             pElem.innerText = `Just you alone here :( Invite your friends and read this card together :)`;
         }
     }
     // snowflakes controller Function
     const makeSnowFlakes = (userNum) => {
         sf.destroy();
         let speed = 8;
         let count = 550;
         if (userNum > 1) {
             option.count = count / (userNum * 2);
             option.speed = speed / (userNum * 2);
         } else {
             option.count = count;
             option.speed = speed;
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