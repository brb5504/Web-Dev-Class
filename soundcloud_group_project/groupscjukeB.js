var playlistHappy;
var playlistNotSo;

var playlistHappyObjects = [];
var playlistNotSoObjects = [];

var playlists = [playlistHappy,playlistNotSo];
var tracks = document.getElementsByClassName('track');
var trackObjects = [];
var chosenPlaylist;
// this will be set on click of playlist option
// var chosenPlaylist = playlistHappy;

// song controllers
var currentlyPlaying;
var currentIndex;


// Step 1 initialize our sc key -----------------------------------------------------/

SC.initialize ({
 client_id: 'ebe2d1362a92fc057ac484fcfb265049'
});

// Step 2 write constructor -----------------------------------------------------/



var Song = function(html,individualTrackData,index){
  this.html = html;
  if (individualTrackData['user']['username']) {
    this.artist = individualTrackData['user']['username'];
  };
  if (individualTrackData['user']['permalink_url']) {
    this.artistUrl = individualTrackData['user']['permalink_url'];
  };
  if (individualTrackData["description"]) {
    this.description = individualTrackData["description"];
  };
  if (individualTrackData["genre"]) {
    this.genre = individualTrackData["genre"];
  };
  if (individualTrackData["artwork_url"]) {
    this.link = individualTrackData["artwork_url"];
  };

  this.title = individualTrackData["title"];
  this.id = individualTrackData["id"];
  this.duration = (individualTrackData["duration"]).toString();
  this.index = index;
  // console.log('hey im not special! im just a function!');

}

// Step 3 get data -----------------------------------------------------/

$.getJSON('http://api.soundcloud.com/playlists/468828561?client_id=ebe2d1362a92fc057ac484fcfb265049',function(data){
  playlistHappy = data['tracks'];
  // console.log(playlistHappy);
})

$.getJSON('http://api.soundcloud.com/playlists/468763257?client_id=ebe2d1362a92fc057ac484fcfb265049',function(data){
  playlistNotSo = data['tracks'];
  // console.log(playlistNotSo);
})

var promise = new Promise(function(resolve, reject) {

  let check1 = setInterval(function(){
  if (playlistHappy && playlistNotSo) {
    clearInterval(check1);
    resolve();
  } else {
  console.log("Error getting playlist.");
  }
  },250);

}).then(function(x){

  // Step 4 create custom objects -----------------------------------------------------/

  for (let i=0;i<playlistHappy.length;i++) {
    window['song'+i] = new Song(tracks[i],playlistHappy[i],i);
    window['song'+i].playlist = 'playlistHappy';
    console.log(window['song'+i]);
    trackObjects.push(window['song'+i]);
    playlistHappyObjects.push(window['song'+i]);
  }

  for (let i=0; i<playlistNotSo.length;i++) {
    window['song'+(i+playlistHappy.length)] = new Song(tracks[(i+playlistHappy.length)],playlistNotSo[i],(i+playlistHappy.length));
    window['song'+(i+playlistHappy.length)].playlist = 'playlistNotSo';
    console.log(window['song'+(i+playlistHappy.length)]);
    trackObjects.push(window['song'+(i+playlistHappy.length)]);
    playlistNotSoObjects.push(window['song'+(i+playlistHappy.length)]);
  }

}).then(function(){
  console.log(trackObjects.length);

  // Step 5 manipulate objects -----------------------------------------------------/

  for (let i=0;i<trackObjects.length;i++) {
    // console.log(trackObjects)
    let curr = window['song' + i]; // let curr = song0,song1,song2...
    if (curr.genre) {
      let currGenre = curr.genre;
    } else {
      let currGenre = '';
    }
    console.log(curr.duration);
    if (curr.duration) {
      let currDuration = curr.duration;
    } else {
      let currDuration = 0;
    }
    if (curr.link) {
      let currLink = curr.link;
    } else {
      let currLink = '';
    }
    if (curr.genre) {
      let currGenre = curr.genre;
    } else {
      let currGenre = '';
    }
    let currentArtistUrl = curr.artistUrl;
    let currentHTML = curr.html;
    let currentTitle = curr.title;
    let currArtist = curr.artist;

    let trackDetails = `<span class="songTitle">${currentTitle}</span><a class="currentArtistUrl" href="${currentArtistUrl}"> <span class="songArtist">${currArtist}</span></a> <span class="currDuration">${curr.duration}</span> <span class="currGenre">${curr.genre}</span>`;

    // end html prep
    // add click event

    curr.html.addEventListener('click',function(){
      // something is playing
        currentlyPlaying = curr;
        currentIndex = curr.index;

        queue(currentlyPlaying);

      // console.log(currentIndex)

      // nothing is playing
    })



    $(currentHTML).append(trackDetails);
  }


}).then(function(){
// joe's fix
$('.currGenre').each(function(){
  if ($(this).text()=='undefined'){
    $(this).text('');
  }

chosenPlaylist = playlistHappy;


});

});

// Step 6 write play controller --------------------------------------------------/

function queue(x){

  var queuePromise = new Promise(function(resolve,reject){

  // set up a system that will play the next song in the Index
  // check if have the next song.
  // if no next song, lets loop our playlist

  SC.stream("/tracks/" + x.id).then(function(player) {

  myPlayer = player;
  myPlayer.play();

  });

  let currPlaylist = window[currentlyPlaying.playlist];

  var isDone = setInterval(function(){

    if(myPlayer.isEnded()) {
      resolve(currPlaylist);
    } else {
      // console.log('not done yet');
    }

  },1000);



}).then(x=>{
  console.log('resolved again');



  // console.log(x);
  // console.log(currentIndex);

  currentIndex++;
  // if nextSong is in this playlist
  // console.log(window['song'+currentIndex]);
  // console.log(`${window['song'+currentIndex].playlist} and ${currentlyPlaying.playlist}`);

  // if index of the next song is longer then the index of the playlist
  if (window['song'+currentIndex] && window['song'+currentIndex].playlist == currentlyPlaying.playlist) {
    // loop playlist
    // get currently playing, change it to next song
    currentlyPlaying = window['song'+currentIndex];
    queue(currentlyPlaying);
  } else {
    currentIndex = x[0].index;
    currentlyPlaying = x[0];
    queue(currentlyPlaying);

  }

  clearInterval(isDone);

});

};

// Step 7 write interface links -------------------------------------/

var btnPlay = document.getElementById('play');
var btnPause = document.getElementById('pause');
var btnNext = document.getElementById('next');
var btnPrev = document.getElementById('prev');
var btnShuf = document.getElementById('shuf');


btnPlay.addEventListener('click',function() {
  // console.log('play button clicked!');
  if (currentlyPlaying) {
    myPlayer.play();
  } else {
    // console.log(song0);
    currentlyPlaying = song0;
    currentIndex = song0.index;

    queue(currentlyPlaying);
  }
});

btnPause.addEventListener('click',function() {
  myPlayer.pause();
});


btnNext.addEventListener('click',function(){
  console.log(`${currentlyPlaying} with index ${currentIndex}`);
  currentIndex++;
  let rightPlaylist;

  if (currentlyPlaying.playlist == 'playlistHappy') {
    rightPlaylist = playlistHappyObjects;
  } else {
    rightPlaylist = playlistNotSoObjects;
  }

  if (window['song'+currentIndex] && window['song'+currentIndex].playlist == currentlyPlaying.playlist) {
    // loop playlist
    // get currently playing, change it to next song
    currentlyPlaying = window['song'+currentIndex];
    // currentlyPlaying =trackObjects[currentIndex]);

    queue(currentlyPlaying);
  } else {
    currentIndex = rightPlaylist[0].index;
    currentlyPlaying = rightPlaylist[0];
    queue(currentlyPlaying);
  }
  // queue()
});

btnPrev.addEventListener('click',function(){
  console.log(`${currentlyPlaying} with index ${currentIndex}`);
  currentIndex--;

  let rightPlaylist;

  if (currentlyPlaying.playlist == 'playlistHappy') {
    rightPlaylist = playlistHappyObjects;
  } else {
    rightPlaylist = playlistNotSoObjects;
  }

  if (window['song'+currentIndex] && window['song'+currentIndex].playlist == currentlyPlaying.playlist) {
    // loop playlist
    // get currently playing, change it to next song
    currentlyPlaying = window['song'+currentIndex];
    // currentlyPlaying =trackObjects[currentIndex]);

    queue(currentlyPlaying);
  } else {
    currentIndex = rightPlaylist[chosenPlaylist.length - 1].index;
    currentlyPlaying = rightPlaylist[chosenPlaylist.length - 1];
    queue(currentlyPlaying);

  }
  // queue()
});