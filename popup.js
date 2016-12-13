var MAIN_URL = 'https://www.youtube.com/*';

function nextSong(){
  var runtimer = chrome.runtime
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a= document.getElementsByClassName("ytp-next-button ytp-button")[0]; console.log("next song"); a.click();'
    }, function() {
      startRec();
    });
  });
}


function lastSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a= document.getElementsByClassName("ytp-prev-button ytp-button")[0]; console.log(a); console.log("last song"); a.click();'
    }, function() {
      startRec();
    });
  });
}

function pauseSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a = document.getElementsByClassName("html5-video-player")[0]; if(a.classList.contains("playing-mode")){var b = document.getElementsByClassName("ytp-play-button ytp-button")[0]; b.click()} else{console.log("already paused")};'
    }, function() {
      startRec();
    });
  });
}

function playSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a = document.getElementsByClassName("html5-video-player")[0]; if(a.classList.contains("paused-mode")){var b = document.getElementsByClassName("ytp-play-button ytp-button")[0]; b.click()} else{console.log("already playing")};'
    }, function() {
      startRec();
    });
  });
}

function startRec() {
  var speech = new webkitSpeechRecognition();
  speech.continuous = true;
  speech.interimResults = true;
  // ////////if user is not authorized, this opens up a new tab which asks them to use their mic
  speech.onerror = function(err) {
    if (err.error === 'not-allowed') {
      chrome.tabs.create({url: "auth.html"})
    }
  }

  speech.onresult = function(data) {
    var wordsArr = data.results[data.results.length-1][0].transcript.split(' ');
    for (var i = 0; i < wordsArr.length; i++) {
      if (wordsArr[i] === 'next' || wordsArr[i] === 'necks' || wordsArr[i] === 'neck') {
        nextSong();
      }
      else if (wordsArr[i] === 'last' || wordsArr[i] === 'previous') {
        lastSong();
      }
      else if(wordsArr[i] === 'stop' ||wordsArr[i] === 'pause' || wordsArr[i] === 'paws') {
        pauseSong();
      }
      else if(wordsArr[i] === 'go' ||wordsArr[i] === 'played' || wordsArr[i] === 'play' || wordsArr[i] === 'plays') {
        playSong();
      }
    }
  }
  speech.start();
}
chrome.tabs.onActivated.addListener(function(tab) {
  startRec();
})
