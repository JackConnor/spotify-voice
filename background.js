var MAIN_URL = 'https://play.spotify.com/*';
var bBlock = true;
var bInProgress = false;
var windowTO;
function nextSong(){
  var runtimer = chrome.runtime
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: "var nxt = document.getElementById('app-player').contentDocument.querySelector('#next');"+ "console.log(nxt); "+
      "nxt.click();"
    }, function() {
      setTimeout(function(){
        playSong();
        _gaq.push(['_trackEvent', 'next-song', 'clicked']);
      }, 500);
    });
  });
}

function lastSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: "var nxt = document.getElementById('app-player').contentDocument.querySelector('#previous');"+ "console.log(nxt); "+
      "nxt.click(); console.log('first');"+
      "var timeDist = document.getElementById('app-player').contentDocument.querySelector('#time-marker-arrow');"+
      "console.log(timeDist);"+
      "var a = timeDist.style.left;"+
      "if (a == '7px' || a == '8px' || a == '9px') {"+
      "console.log('before 3')}"+
      "else { console.log('after');"+
      "setTimeout(function(){nxt.click(); console.log('second')"+
      "}, 500)}"
      // "setTimeout(function(){nxt.click(); console.log('second')}, 400)"
    }, function() {
      setTimeout(function(){
        playSong();
        _gaq.push(['_trackEvent', 'last-song', 'clicked']);
      }, 500);
    });
  });
}

function restartSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: "var nxt = document.getElementById('app-player').contentDocument.querySelector('#previous');"+ "console.log(nxt); "+
      "nxt.click();"
    }, function() {
      setTimeout(function(){
        playSong();
        _gaq.push(['_trackEvent', 'restart-song', 'clicked']);
      }, 500);
    });
  });
}

function pauseSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: "var nxt = document.getElementById('app-player').contentDocument.querySelector('#play-pause');"+ "if(nxt.classList.contains('playing')){nxt.click()}"
    }, function() {
      stopWindowTO();
      startWindowTO(300000);
      _gaq.push(['_trackEvent', 'pause-song', 'clicked']);
    });
  });
}

function playSong(){
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: "var nxt = document.getElementById('app-player').contentDocument.querySelector('#play-pause');"+ "var isPlaying = nxt.classList.contains('playing'); if(!isPlaying){nxt.click();}"
    }, function() {
      stopWindowTO();
      startWindowTO(25000);
    });
  });
}

function startWindowTO(msDelay) {
  windowTO = setTimeout(function() {
    window.close();
  }, msDelay);
}

function stopWindowTO() {
  clearTimeout(windowTO);
}

function startRec() {
  var speech = new webkitSpeechRecognition();
  // speech.continuous = true;
  // speech.interimResults = true;
  // ////////if user is not authorized, this opens up a new tab which asks them to use their mic
  speech.onerror = function(err) {
    if (err.error === 'not-allowed') {
      chrome.tabs.create({url: "auth.html"});
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
          bInProgress = true;
          nextSong();
          flashCommand('Next', 'next.png');
        }
        else if (wordsArr[i] === 'last' || wordsArr[i] === 'lass' || wordsArr[i] === 'las' || wordsArr[i] === 'previous') {
          bInProgress = true;
          lastSong();
          flashCommand('Last', 'last.png');
        }
        else if (wordsArr[i] === 'restart' || wordsArr[i] === 'startover' || wordsArr[i] === 'redo' || wordsArr[i] === 'again') {
          flashCommand('Restart', 'last.png');
          bInProgress = true;
          restartSong();
        }
        else if(wordsArr[i] === 'stop' ||wordsArr[i] === 'pause' || wordsArr[i] === 'paws') {
          pauseSong();
          document.getElementsByClassName('ext-headline')[0].innerText = 'Pause';
          document.getElementById('icon-photo').src = 'pause.png';
        }
        else if(wordsArr[i] === 'go' || wordsArr[i] === 'goal' ||wordsArr[i] === 'played' || wordsArr[i] === 'play' || wordsArr[i] === 'plays') {
          bInProgress = true;
          playSong();
          flashCommand('Play', 'play.png');
          _gaq.push(['_trackEvent', 'play-song', 'clicked']);
        }
      }
    }
  }
  speech.start();
}

function flashCommand(sTitle, src) {
  document.getElementsByClassName('ext-headline')[0].innerText = sTitle;
  document.getElementById('icon-photo').src = src;
  var iBeginFade = 100;
  var fadeInt = setInterval(function() {
    iBeginFade = iBeginFade-10;
    if (iBeginFade > 0) {
      document.getElementsByClassName('ext-headline')[0].style.opacity = parseFloat(iBeginFade*0.01);
    }
    else {
      clearInterval(fadeInt);
      document.getElementsByClassName('ext-headline')[0].style.opacity = 1;
      document.getElementsByClassName('ext-headline')[0].innerText = 'Spotify Voice';
      document.getElementById('icon-photo').src = 'logo.png'
      bInProgress = false;
    }
  }, 100);
}

/////begin function
startRec();
startWindowTO(60000);
