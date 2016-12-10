// console.log('where am iiiiiiiii')
//
// console.log(window.location);
// console.log(chrome);
// console.log(chrome.tabs);
//
//
function nextSong(){
  console.log(chrome.tabs);
  var MAIN_URL = 'https://www.youtube.com/*';
  chrome.tabs.query({active: true, url: MAIN_URL}, function(data) {
    console.log(data);
    chrome.tabs.update(data.id,{"active":true,"highlighted":true}, function (tab){
      console.log("Completed updating tab .." + JSON.stringify(tab));
      chrome.tabs.executeScript(data.id, {
        code: 'var a= document.getElementsByClassName("ytp-next-button ytp-button")[0]; console.log(a); console.log("heyyaaa"); a.click();'
      });
    });
  });
}

function startRec() {
  console.log('in here');
  navigator.webkitGetUserMedia({
    audio: true,
  }, function(stream) {
    console.log('nailed it');
      stream.stop();
      console.log(stream);
      // var speech = new webkitSpeechRecognition();
      // speech.continuous = true;
      // speech.interimResults = true;
      // speech.onerr = function(err) {
      //   console.log('er  red');
      //   console.log(err);
      // }
      // speech.onerror = function(err) {
      //   console.log('er  red');
      //   console.log(err);
      // }
      // speech.onstart = function(data) {
      //   console.log(data);
      // }
      // speech.onresult = function(data) {
      //   console.log('resulted');
      //   console.log(data.results[0][0].transcript);
      //   var wordsArr = data.results[data.results.length-1][0].transcript.split(' ');
      //   for (var i = 0; i < wordsArr.length; i++) {
      //     if (wordsArr[i] === 'next') {
      //       nextSong();
      //     }
      //   }
      // }
      // console.log(speech);
      // speech.start();
      // Now you know that you have audio permission. Do whatever you want...
    }, function(err) {
      console.log(err);
      console.log('rr');
        // Aw. No permission (or no microphone available).
    });
    // speech.onend = function(data){
    //   console.log(data);
    //   console.log('yo');
    // }
    // speech.onaudiostart = function() {
    //   console.log('oka');
    // }
}
//   var isFDString = new webkitSpeechRecognition();
//   isFDString.continuous = true;
//   isFDString.interimResults = true;
//   console.log(isFDString);
//   isFDString.onstart = function() {
//     console.log('starting');
//   }
//   isFDString.onerror = function(err) {
//     console.log('err');
//     console.log(err);
//     console.log(err.error);
//     if (err.error === 'not-allowed') {
//       chrome.tabs.create({url: 'page.html'});
//     }
//   }
//   isFDString.onresult = function(data) {
//     console.log('resulted');
//     console.log(data);
//     console.log(data.results[0][0].transcript);
//     var wordsArr = data.results[data.results.length-1][0].transcript.split(' ');
//     var isFD = false;
//     for (var i = 0; i < wordsArr.length; i++) {
//       console.log('i is: ', i);
//       if (wordsArr[i] === 'film') {
//         chrome.tabs.create({url: 'http://www.filmdrunk.com'}, function(data) {
//           console.log(data);
//         });
//       }
//     }
//
//     // chrome.tabs.create({url: 'www.filmdrunk.com'}, function(data) {
//     //   console.log(data);
//     // });
//   }
//   isFDString.start();
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
