const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const activeSong = $(".song");
const playList = document.querySelector(".playlist");
const PLAYER_STORAGE = "minh player";
let isPlaying = false;
let isRandom = false;
let isRepeat = false;

const app = {
  currentIndex: 0,
  setting: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
  songs: [
    {
      name: "At My Worst",
      single: "Pink Sweat",
      path: "./Song/At My Worst - Pink Sweat_.mp3",
      image: "./Image/anh 3.jpg",
    },
    {
      name: "Enemy",
      single: "Imagine Dragons",
      path: "./Song/Enemy - Imagine Dragons_ JID.mp3",
      image: "./Image/anh 2.jpg",
    },
    {
      name: "It Will Rain",
      single: "Bruno Mar",
      path: "./Song/It Will Rain - Bruno Mars.mp3",
      image: "./Image/anh 4.jpg",
    },
    {
      name: "Fool For You",
      single: "Zayn",
      path: "./Song/Fool For You - Zayn.mp3",
      image: "./Image/anh 5.jpg",
    },
    {
      name: "The Days",
      single: "Avici",
      path: "./Song/The Days - Avicii_ Robbie Williams.mp3",
      image: "./Image/anh 6.jpg",
    },
  ],
  config: function (key, value) {
    this.config[key] = value;
  },
  render: function () {
    const html = this.songs.map((songs, index) => {
      return `
            <div class="song ${
              index == this.currentIndex ? "active" : ""
            }" id="${index}" >
                <div class="thumb" style="background-image: url('${
                  songs.image
                }')">
                </div>
                <div class="body">
                    <h3 class="title">${songs.name}</h3>
                    <p class="author">${songs.single}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });
    playList.innerHTML = html.join("");
  },
  //xy ly event
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDWidth = cdWidth - scrollTop;
      if (newCDWidth > 0) {
        cd.style.width = newCDWidth + "px";
      } else {
        newCDWidth == 0;
      }
      cd.style.opacity = newCDWidth / cdWidth;
    };
    //xu ly cd quay va dung
    const cdAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10 seconds
      iterations: Infinity,
    });
    cdAnimate.pause();

    // play music
    playBtn.onclick = () => {
      if (isPlaying) {
        audio.pause();
        cdAnimate.pause();
      } else {
        audio.play();
        cdAnimate.play();
      }
    };
    audio.onplay = () => {
      isPlaying = true;
      player.classList.add("playing");
    };
    audio.onpause = () => {
      isPlaying = false;
      player.classList.remove("playing");
    };
    // khi bai hat duoc play
    audio.ontimeupdate = () => {
      if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
      }
    };
    progress.oninput = (e) => {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    };
    nextBtn.onclick = () => {
      if (isRandom) {
        app.randomSong();
        audio.play();
      } else {
        app.nextSong();
        audio.play();
      }
      app.activesong();
      app.scrollintoActive();
    };
    prevBtn.onclick = () => {
      app.prevSong();
      audio.play();
      app.activesong();
      app.scrollintoActive();
    };
    randomBtn.onclick = function () {
      isRandom = !isRandom;
      randomBtn.classList.toggle("active", isRandom);
      app.config("isRandom", app.isRandom);
    };
    //xu ly bai hat khi het
    audio.onended = function () {
      if (isRepeat) {
        // audio.load();
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // xu ly repeat
    repeatBtn.onclick = function () {
      isRepeat = !isRepeat;
      repeatBtn.classList.toggle("active", isRepeat);
    };
    //Active song
    playList.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          app.currentIndex = songNode.getAttribute("id");
          app.activesong();
          app.loadCurrentSong();
          audio.play();
        }
      }
    };
  },
  // lay bai hat
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  // tai bai hat len cd
  loadCurrentSong: function () {
    heading.innerHTML = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  //Next song button
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  // xu ly random
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  //xu ly scrolltoactive
  scrollintoActive: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },
  //xu ly active song
  activesong: function () {
    const songList = $$(".song");
    for (var i = 0; i < songList.length; i++) {
      if (i == app.currentIndex) {
        songList[i].classList.add("active");
      } else {
        songList[i].classList.remove("active");
      }
    }
  },
  start: function () {
    this.render();
    this.handleEvents();
    this.defineProperties();
    this.loadCurrentSong();
  },
};
app.start();
