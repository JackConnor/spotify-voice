// console.log('where am iiiiiiiii')
//
// console.log(window.location);
// console.log(chrome);
// console.log(chrome.tabs);
//
//
function nextSong(){
  var MAIN_URL = 'https://www.youtube.com/*';
  chrome.tabs.query({url: MAIN_URL}, function(data) {
    chrome.tabs.executeScript(data[0].id, {
      code: 'var a= document.getElementsByClassName("ytp-next-button ytp-button")[0]; console.log(a); console.log("heyyaaa"); a.click();'
    }, function() {
      console.log('changed that fucker');
    });
  });
}

function startRec() {
  var speech = new webkitSpeechRecognition();
  speech.continuous = true;
  speech.interimResults = true;
  speech.onerror = function(err) {
    console.log('er  red');
    console.log(err);
    if (err.error === 'not-allowed') {
      chrome.tabs.create({url: "auth.html"})
    }
  }
  speech.onresult = function(data) {
    console.log('resulted');
    console.log(data.results[0][0].transcript);
    var wordsArr = data.results[data.results.length-1][0].transcript.split(' ');
    for (var i = 0; i < wordsArr.length; i++) {
      if (wordsArr[i] === 'next') {
        nextSong();
      }
    }
  }
  console.log(speech);
  speech.start();
}
// }
setTimeout(function() {
  console.log('beginning');
  startRec();
}, 2000);

// window.navigator.mediaDevices.getUserMedia({audio: true})
// .then(function(stream) {
//   var ctx = new AudioContext();
//   var analyzer = ctx.createAnalyser();
//   console.log(analyzer);
//   var streamSource = ctx.createMediaStreamSource(stream);
//   streamSource.connect(analyzer);
//   console.log(analyzer);
//   // console.log(stream);
//   // var ctx = new AudioContext();
//   // console.log(ctx);
//   // var streamCtx = ctx.createMediaStreamSource(stream);
//   // console.log(streamCtx);
//   // streamCtx.connect(ctx.destination);
//   // stream.onactive = function(){
//   //   console.log('active');
//   // }
// })
// .catch(function(err) {
//   console.log(err);
// });
