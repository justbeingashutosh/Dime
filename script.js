const cards = document.querySelectorAll(".card");
let songData = {};
let currentAudio = null;
let currentPlay = null;
let currentPause = null;
let progressInterval = null;
let currentSongName = null;

// External play history to track the order of played songs
// Each history entry stores playButton and pauseButton if available.
let playHistory = [];
let currentHistoryIndex = -1;

const player = document.querySelector("#player");
let thumbnail = document.querySelector("#thumb");
let likedContainer = document.querySelector(".likedcontainer");
let likeBtn = document.querySelector(".like");
let fullscrcanvas = document.querySelector(".fullscr-canvas");
let progressbar = document.querySelector("#progressbar");
let progressbarContainer = document.querySelector("#progress");
let hide = document.querySelector("#hide");
let sidebar = document.querySelector("#sidebar");
const navels = document.querySelectorAll(".navels");
const nav = document.querySelector(".nav");
let historyContainer = document.querySelector(".historycontainer");
const searchBox = document.querySelector(".searchbox");
let globalplay = document.querySelector("#barplay");
let searchList = document.querySelector(".searchlistcontainer");
let matchingsongslist = document.querySelector(".matchingsongslist");
let fullscrbtn = document.querySelector(".expand");

// Fetch song data and update cards
fetch("./database/audios.json")
  .then(response => response.json())
  .then(data => {
    songData = data;
    updateCards();
  });

function updateCards() {
  cards.forEach(card => {
    const songEl = card.querySelector(".songname");
    const songName = songEl ? songEl.textContent.trim() : "";
    if (songData[songName]) {
      card.getElementsByTagName("img")[0].setAttribute("src", songData[songName]["cover_image_link"]);
    }
  });
}

// Attach progress bar listener once
progressbarContainer.addEventListener("mousedown", (e) => {
  if (currentAudio) {
    const containerWidth = progressbarContainer.offsetWidth;
    const clickPosition = e.offsetX;
    const newTime = (clickPosition / containerWidth) * currentAudio.duration;
    currentAudio.currentTime = newTime;
  }
});

// Clears any currently playing audio if it is different from newAudio
function resetCurrentAudio(newAudio) {
  if (currentAudio && currentAudio !== newAudio) {
    if (currentPlay && currentPause) {
      currentPlay.style.display = "block";
      currentPause.style.display = "none";
    }
    currentAudio.pause();
    currentAudio.currentTime = 0;
    clearInterval(progressInterval);
  }
}

// Starts the progress interval that updates the progress bar
function startProgressInterval() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (currentAudio && currentAudio.duration) {
      progressbar.style.width = `${(currentAudio.currentTime / currentAudio.duration) * 100}%`;
      if (currentAudio.currentTime >= currentAudio.duration) {
        globalplay.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    }
  }, 1000);
}

// Common function to play a song.
// The flag skipHistoryUpdate prevents duplicate entry in playHistory when playing from history.
function playSong({ audio, title, coverImage, mediaUrl, playButton = null, pauseButton = null, skipHistoryUpdate = false }) {
  resetCurrentAudio(audio);
  updateDownloadLink(mediaUrl, title);
  audio.play();
  thumbnail.setAttribute("src", coverImage);
  addToHistory(title, coverImage, mediaUrl);
  if (!skipHistoryUpdate) {
    playHistory.push({ title, coverImage, mediaUrl, audio, playButton, pauseButton });
    currentHistoryIndex = playHistory.length - 1;
  }
  player.style.display = "flex";
  currentSongName = title;

  const existingBanner = [...likedContainer.children].find(banner =>
    banner.querySelector(".songname").textContent.trim() === title
  );
  document.getElementById("like-checkbox").checked = !!existingBanner;

  currentAudio = audio;
  currentPlay = playButton;
  currentPause = pauseButton;
  if (playButton && pauseButton) {
    playButton.style.display = "none";
    pauseButton.style.display = "block";
  }
  globalplay.innerHTML = '<i class="fa-solid fa-pause"></i>';
  startProgressInterval();
}

function pauseSong({ audio, playButton = null, pauseButton = null }) {
  audio.pause();
  if (playButton && pauseButton) {
    pauseButton.style.display = "none";
    playButton.style.display = "block";
  }
  globalplay.innerHTML = '<i class="fa-solid fa-play"></i>';
}

function createBanner(hd, img, audioSrc) {
  let banner = document.createElement("div");
  banner.classList.add("banner");

  let bannerHead = document.createElement("div");
  bannerHead.classList.add("songname", "bannerhead");
  bannerHead.textContent = hd;

  let bannerImgContainer = document.createElement("div");
  bannerImgContainer.classList.add("bannerimg");

  let bannerThumb = document.createElement("img");
  bannerThumb.setAttribute("src", img);
  bannerThumb.classList.add("bannerthumb");

  bannerImgContainer.appendChild(bannerThumb);
  banner.appendChild(bannerImgContainer);
  banner.appendChild(bannerHead);

  banner.addEventListener("click", () => {
    const audio = new Audio(audioSrc);
    playSong({ audio, title: hd, coverImage: img, mediaUrl: audioSrc });
  });

  return banner;
}

function addToHistory(songName, imgSrc, audioSrc) {
  let existingBanner = [...historyContainer.children].find(banner =>
    banner.querySelector(".songname").textContent.trim() === songName
  );
  if (existingBanner) {
    historyContainer.prepend(existingBanner);
  } else {
    historyContainer.prepend(createBanner(songName, imgSrc, audioSrc));
  }
}

function addToLiked(songName, imgSrc, audioSrc) {
  let existingBanner = [...likedContainer.children].find(banner =>
    banner.querySelector(".songname").textContent.trim() === songName
  );
  if (existingBanner) {
    likedContainer.removeChild(existingBanner);
  } else {
    likedContainer.prepend(createBanner(songName, imgSrc, audioSrc));
  }
}

document.querySelector(".like").addEventListener('click', () => {
  addToLiked(currentSongName, thumbnail.getAttribute("src"), currentAudio.src);
});

// Updates the download link for the current song
function updateDownloadLink(songUrl, name) {
  const downloadBtn = document.querySelector(".download");
  if (downloadBtn) {
    // Remove previous event listeners by replacing the node
    downloadBtn.replaceWith(downloadBtn.cloneNode(true));
    const newDownloadBtn = document.querySelector(".download");
    newDownloadBtn.addEventListener('click', () => {
      fetch(songUrl, { mode: "cors" })
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = name + ".mp3";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error("Download failed:", error));
    });
  }
}

// Process each card (for initial display)
cards.forEach(card => {
  let audio = null;
  let titleElement = card.querySelector(".songname");
  let title = titleElement ? titleElement.textContent.trim() : "";
  let playButton = card.querySelector(".play");
  let pauseButton = card.querySelector(".pause");
  // Initialize audio after a short delay to ensure songData is loaded
  setTimeout(() => {
    if (songData[title]) {
      audio = new Audio(songData[title]["song_link"]);
    }
  }, 1000);

  if (title) {
    // Set cover image if available in songData
    if (songData[title] && songData[title]["cover_image_link"]) {
      card.getElementsByTagName("img")[0].setAttribute("src", songData[title]["cover_image_link"]);
    }
    playButton.addEventListener('click', () => {
      playSong({
        audio,
        title,
        coverImage: card.getElementsByTagName("img")[0].getAttribute("src"),
        mediaUrl: songData[title]["song_link"],
        playButton,
        pauseButton
      });
    });
    pauseButton.addEventListener('click', () => {
      pauseSong({ audio, playButton, pauseButton });
    });
  }
});

fullscrbtn.addEventListener('click', () => {
  openFullscreen(fullscrcanvas, thumbnail.getAttribute("src"));
});

function openFullscreen(elem, imgsrc) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
  fullscrcanvas.getElementsByTagName("img")[0].setAttribute("src", imgsrc);
}

hide.addEventListener('click', () => {
  if (sidebar.style.width !== "72px") {
    logo.style.display = "none";
    sidebar.style.width = "72px";
    hide.innerHTML = '<i class="fa-solid fa-circle-chevron-right"></i>';
    navels.forEach(navel => {
      navel.querySelector(".text").style.display = "none";
    });
    nav.style.marginTop = "100%";
  } else {
    sidebar.style.width = "20vw";
    logo.style.display = "block";
    hide.innerHTML = '<i class="fa-solid fa-circle-chevron-left"></i>';
    navels.forEach(navel => {
      navel.querySelector(".text").style.display = "block";
    });
    nav.style.marginTop = "20%";
  }
});

navels.forEach(navel => {
  navel.addEventListener('click', () => {
    navels.forEach(n => n.classList.remove("active"));
    navel.classList.add("active");

    if (navel.classList.contains("search")) {
      searchBox.focus();
      document.querySelectorAll(".platteritem").forEach(item => item.style.display = "none");
      document.querySelector(".historycontainer").style.display = "none";
      document.querySelector(".likedcontainer").style.display = "none";
      document.querySelector(".searchlistcontainer").style.display = "flex";
      matchingsongslist.style.display = "flex";
    } else if (navel.classList.contains("history")) {
      document.querySelectorAll(".platteritem").forEach(item => item.style.display = "none");
      document.querySelector(".searchlistcontainer").style.display = "none";
      document.querySelector(".likedcontainer").style.display = "none";
      matchingsongslist.style.display = "none";
      document.querySelector(".historycontainer").style.display = "flex";
    } else if (navel.classList.contains("liked")) {
      document.querySelectorAll(".platteritem").forEach(item => item.style.display = "none");
      document.querySelector(".searchlistcontainer").style.display = "none";
      document.querySelector(".historycontainer").style.display = "none";
      matchingsongslist.style.display = "none";
      document.querySelector(".likedcontainer").style.display = "flex";
    } else {
      document.querySelectorAll(".platteritem").forEach(item => item.style.display = "block");
      document.querySelector(".searchlistcontainer").style.display = "none";
      document.querySelector(".likedcontainer").style.display = "none";
      document.querySelector(".historycontainer").style.display = "none";
      matchingsongslist.style.display = "none";
    }
  });
});

searchBox.addEventListener('focus', () => {
  navels.forEach(n => n.classList.remove("active"));
  document.querySelector(".search").classList.add("active");
  document.querySelectorAll(".platteritem").forEach(item => item.style.display = "none");
  document.querySelector(".historycontainer").style.display = "none";
  document.querySelector(".searchlistcontainer").style.display = "flex";
  matchingsongslist.style.display = "flex";
});

// Creates a card element (used for search results)
function createCard(coverImage, mediaUrl, songName) {
  let searchCard = document.createElement("div");
  searchCard.classList.add("card");

  let cardImage = document.createElement("img");
  cardImage.setAttribute("src", coverImage);

  let head = document.createElement("div");
  head.classList.add("songname");
  head.textContent = songName;

  let playButton = document.createElement("button");
  let pauseButton = document.createElement("button");
  playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
  pauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
  playButton.classList.add("play");
  pauseButton.classList.add("pause");

  searchCard.appendChild(cardImage);
  searchCard.appendChild(playButton);
  searchCard.appendChild(pauseButton);
  searchCard.appendChild(head);

  let audio = new Audio(mediaUrl);
  playButton.addEventListener('click', () => {
    playSong({
      audio,
      title: songName,
      coverImage,
      mediaUrl,
      playButton,
      pauseButton
    });
  });
  pauseButton.addEventListener('click', () => {
    pauseSong({ audio, playButton, pauseButton });
  });
  return searchCard;
}

// Search box input event for fetching and displaying song results
searchBox.addEventListener('input', async () => {
  const songName = searchBox.value.trim();
  if (songName === "") {
    searchList.textContent = "";
    matchingsongslist.innerHTML = "";
    return;
  }

  try {
    const searchResponse = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(songName)}`, {
      headers: { Accept: '*/*' }
    });
    const searchData = await searchResponse.json();
    if (!searchData.success || searchData.data.results.length === 0) {
      searchList.innerHTML = "Song Not Found!";
      matchingsongslist.innerHTML = "";
      return;
    }

    const song = searchData.data.results[0];
    const coverImage = song.image[2].url;
    const mediaUrl = song.downloadUrl[4].url;

    matchingsongslist.innerHTML = "";
    const matchingsongs = searchData.data.results.length >= 8
      ? searchData.data.results.slice(1, 8)
      : searchData.data.results.slice(1);
    matchingsongs.forEach(song1 => {
      matchingsongslist.appendChild(createCard(song1.image[2].url, song1.downloadUrl[4].url, song1.name));
    });
    searchList.textContent = "";

    // Create and display the main search card
    let searchCard = document.createElement("div");
    searchCard.classList.add("card");

    let cardImage = document.createElement("img");
    cardImage.setAttribute("src", coverImage);

    let head = document.createElement("div");
    head.classList.add("songname");
    head.textContent = song.name;

    let playButton = document.createElement("button");
    let pauseButton = document.createElement("button");
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    pauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    playButton.classList.add("play");
    pauseButton.classList.add("pause");

    searchCard.appendChild(cardImage);
    searchCard.appendChild(playButton);
    searchCard.appendChild(pauseButton);
    searchCard.appendChild(head);
    searchList.appendChild(searchCard);

    let audio = new Audio(mediaUrl);
    playButton.addEventListener('click', () => {
      playSong({
        audio,
        title: song.name,
        coverImage,
        mediaUrl,
        playButton,
        pauseButton
      });
    });
    pauseButton.addEventListener('click', () => {
      pauseSong({ audio, playButton, pauseButton });
    });

  } catch (error) {
    console.error("Error fetching song:", error);
    searchList.innerHTML = "Some error occurred while loading the song!";
  }
});

// Global play/pause button event
globalplay.addEventListener("click", () => {
  if (currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
      globalplay.innerHTML = '<i class="fa-solid fa-pause"></i>';
      if (currentPlay && currentPause) {
        currentPlay.style.display = "none";
        currentPause.style.display = "block";
      }
    } else {
      currentAudio.pause();
      globalplay.innerHTML = '<i class="fa-solid fa-play"></i>';
      if (currentPlay && currentPause) {
        currentPause.style.display = "none";
        currentPlay.style.display = "block";
      }
    }
  }
});

function toggleSongOrder(toggle){
    if (!currentAudio) return;
  if (playHistory.length <= 1 || (currentHistoryIndex <= 0 && toggle == "prev") || (currentHistoryIndex >= playHistory.length - 1 && toggle == "next")) {
    currentAudio.currentTime = 0;
    currentAudio.play();
    globalplay.innerHTML = '<i class="fa-solid fa-pause"></i>';
    if (currentPlay && currentPause) {
      currentPlay.style.display = "none";
      currentPause.style.display = "block";
    }
  } else {
    if(toggle=="prev"){
    currentHistoryIndex--
}else if(toggle=="next"){
    currentHistoryIndex++
}
    const prevSong = playHistory[currentHistoryIndex];
    playSong({ 
      audio: prevSong.audio, 
      title: prevSong.title, 
      coverImage: prevSong.coverImage, 
      mediaUrl: prevSong.mediaUrl, 
      playButton: prevSong.playButton || null,
      pauseButton: prevSong.pauseButton || null,
      skipHistoryUpdate: true 
    });
  }
}

// Previous button event: plays the previous song in the playHistory array.
// If there is only one song, the current song is restarted.
// This implementation uses the stored card buttons (if available) to sync their state.
document.getElementById("prev").addEventListener("click", () => {
  toggleSongOrder("prev");
});
document.getElementById("next").addEventListener("click", () => {
  toggleSongOrder("next");
});