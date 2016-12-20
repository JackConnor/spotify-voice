var MAIN_URL = 'https://www.youtube.com/*';
var bBlock = true;
var bInProgress = false;
function nextSong(){
  var runtimer = chrome.runtime
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a= document.getElementsByClassName("ytp-next-button ytp-button")[0]; console.log("next song"); a.click();'
    }, function() {
      //
    });
  });
}


function lastSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a= document.getElementsByClassName("ytp-prev-button ytp-button")[0]; console.log(a); console.log("last song"); a.click(); setTimeout(function(){a.click(); console.log("reclicked baby")}, 100)'
    }, function() {
      //
    });
  });
}

function pauseSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a = document.getElementsByClassName("html5-video-player")[0]; if(a.classList.contains("playing-mode")){var b = document.getElementsByClassName("ytp-play-button ytp-button")[0]; b.click()} else{console.log("already paused")};'
    }, function() {
      //
    });
  });
}

function playSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a = document.getElementsByClassName("html5-video-player")[0]; if(a.classList.contains("paused-mode")){var b = document.getElementsByClassName("ytp-play-button ytp-button")[0]; b.click()} else{console.log("already playing")};'
    }, function() {
      //
    });
  });
}

function startRec() {
  var speech = new webkitSpeechRecognition();
  // speech.continuous = true;
  // speech.interimResults = true;
  // ////////if user is not authorized, this opens up a new tab which asks them to use their mic
  speech.onerror = function(err) {
    if (err.error === 'not-allowed') {
      chrome.tabs.create({url: "auth.html"})
    }
  }

  speech.onend = function() {
    startRec();
  }

  speech.onresult = function(data) {
    var wordsArr = data.results[data.results.length-1][0].transcript.split(' ');
    if (!bInProgress) {
      for (var i = 0; i < wordsArr.length; i++) {
        if (wordsArr[i] === 'next' || wordsArr[i] === 'necks' || wordsArr[i] === 'neck') {
          flashCommand('Next Song');
          bInProgress = true;
          nextSong();
          if (document.getElementsByClassName('ext-headline')[0].innerText === 'paused song') {
            playSong();
          }
        }
        else if (wordsArr[i] === 'last' || wordsArr[i] === 'previous') {
          flashCommand('Last Song');
          bInProgress = true;
          lastSong();
          if (document.getElementsByClassName('ext-headline')[0].innerText === 'paused song') {
            playSong();
          }
        }
        else if(wordsArr[i] === 'stop' ||wordsArr[i] === 'pause' || wordsArr[i] === 'paws') {
          document.getElementsByClassName('ext-headline')[0].innerText = 'Paused Song';
          pauseSong();
        }
        else if(wordsArr[i] === 'go' || wordsArr[i] === 'goal' ||wordsArr[i] === 'played' || wordsArr[i] === 'play' || wordsArr[i] === 'plays') {
          flashCommand('Playing Song');
          bInProgress = true;
          playSong();
        }
      }
    }
  }
  speech.start();
}

function flashCommand(sTitle) {
  document.getElementsByClassName('ext-headline')[0].innerText = sTitle;
  var iBeginFade = 100;
  var fadeInt = setInterval(function() {
    iBeginFade = iBeginFade-10;
    if (iBeginFade > 0) {
      document.getElementsByClassName('ext-headline')[0].style.opacity = parseFloat(iBeginFade*0.01);
    }
    else {
      clearInterval(fadeInt);
      document.getElementsByClassName('ext-headline')[0].style.opacity = 1;
      document.getElementsByClassName('ext-headline')[0].innerText = 'Youtube Voice';
      bInProgress = false;
    }
  }, 100);
}

/////begin function
startRec();
