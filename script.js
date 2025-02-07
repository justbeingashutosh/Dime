const cards = document.querySelectorAll(".card")
let songData = {}
let currentAudio = null
let currentPause = null
let currentPlay = null
// let title = null
// let titleElement = null
let keys = []
const player = document.querySelector("#player")
let thumbnail = document.querySelector("#thumb")
let progressbar = document.querySelector("#progressbar")
let hide = document.querySelector("#hide")
let sidebar = document.querySelector("#sidebar")
const navels = document.querySelectorAll(".navels")
const nav =  document.querySelector(".nav")
const searchBox = document.querySelector(".searchbox")
// let history = new set()
let globalplay = document.querySelector("#barplay")
let searchList = document.querySelector(".searchlistcontainer")
let matchingsongslist = document.querySelector(".matchingsongslist")
fetch("./database/audios.json")
    .then(response => response.json())
    .then(data => {
        songData = data;
        updateCards()
    })

function updateCards(){
cards.forEach(card=>{
    let song = card.querySelector(".songname"); 
    let song_name = song? song.textContent.trim() : "";
    if(songData[song_name]){
        card.getElementsByTagName("img")[0].setAttribute("src", songData[song_name]["cover_image_link"])
    }
})}

cards.forEach(card => {
    let audio = null
    let image = null
    let titleElement = card.querySelector(".songname"); 
    let title = titleElement ? titleElement.textContent.trim() : "";
    let playbutton = card.querySelector(".play")
    let pausebutton = card.querySelector(".pause")
    setTimeout(() => {
        if (songData[title]) {
            audio = new Audio(songData[title]["song_link"]);
        }
    }, 1000);
    if(title){
            card.getElementsByTagName("img")[0].setAttribute("src", image)
            playbutton.addEventListener('click', ()=>{
            if(currentAudio && currentAudio!=audio){
            currentAudio.currentTime = 0
            currentAudio.pause()
            // if(currentPause&&currentPlay){currentPlay.style.display = "block"
            // currentPause.style.display = "none"}
        }
        audio.play()
        thumbnail.setAttribute("src", card.getElementsByTagName("img")[0].getAttribute("src"))
        player.style.display = "flex"
        currentAudio = audio
        progressbar.max = currentAudio.duration
        // currentPlay = playbutton
        // currentPause = pausebutton
        playbutton.style.display = "none"
        globalplay.innerHTML = '<i class="fa-solid fa-pause"></i>'
        pausebutton.style.display = "block"
        progressbar.onchange = ()=>{
            currentAudio.currentTime = progressbar.value
        }
        if(currentAudio&&currentAudio.play()){
            setInterval(()=>{
                progressbar.value = currentAudio.currentTime
            }, 1000)
        }
        
    })}
    pausebutton.addEventListener('click', ()=>{
        audio.pause()
        pausebutton.style.display = "none"
        playbutton.style.display = "block"
        globalplay.innerHTML = '<i class="fa-solid fa-play"></i>'

    })
})

hide.addEventListener('click', ()=>{
    if(sidebar.style.width!="72px"){
    logo.style.display = "none"
    sidebar.style.width="72px"
    hide.innerHTML = '<i class="fa-solid fa-circle-chevron-right"></i>'
    navels.forEach(navel =>{
        navel.querySelector(".text").style.display = "none"
    })
    nav.style.marginTop = "100%"
    }else{
        sidebar.style.width = "20vw"
        logo.style.display = "block"
        hide.innerHTML = '<i class="fa-solid fa-circle-chevron-left"></i>'
        navels.forEach(navel =>{
            navel.querySelector(".text").style.display = "block"
        })
    nav.style.marginTop = "20%"

    }
})

navels.forEach(navel => {
    navel.addEventListener('click', ()=>{
        for(navel1 of navels){
            navel1.classList.remove("active")
        }
        navel.classList.add("active")


        if(navel.classList.contains("search")){
            searchBox.focus()
            document.querySelectorAll(".platteritem").forEach(platteritem=>{
                platteritem.style.display = "none"
            })
            document.querySelector(".historycontainer").style.display = "none"

            document.querySelector(".searchlistcontainer").style.display = "flex"
            matchingsongslist.style.display = "flex"

        }else if(navel.classList.contains("history")){
            document.querySelectorAll(".platteritem").forEach(platteritem=>{
                platteritem.style.display = "none"
            })
            document.querySelector(".searchlistcontainer").style.display = "none"
            matchingsongslist.style.display = "none"

            document.querySelector(".historycontainer").style.display = "block"
        }
        else{
            document.querySelectorAll(".platteritem").forEach(platteritem=>{
                platteritem.style.display = "block"
            })
            document.querySelector(".searchlistcontainer").style.display = "none"
            document.querySelector(".historycontainer").style.display = "none"
            matchingsongslist.style.display = "none"

        }
    })
    
})

searchBox.addEventListener('focus', ()=>{
    for(navel1 of navels){
        navel1.classList.remove("active")
    }
    document.querySelector(".search").classList.add("active")
    
    document.querySelectorAll(".platteritem").forEach(platteritem=>{
        platteritem.style.display = "none"
    })
    document.querySelector(".historycontainer").style.display = "none"

    document.querySelector(".searchlistcontainer").style.display = "flex"
    matchingsongslist.style.display = "flex"

})


function createCard(coverImage, mediaUrl, songName) {
    let searchCard = document.createElement("div");
    searchCard.classList.add("card");

    let cardImage = document.createElement("img");
    cardImage.setAttribute("src", coverImage);

    let head = document.createElement("div");
    head.classList.add("songname");
    head.textContent = songName;  // <-- Fix applied here

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
        if (currentAudio && currentAudio !== audio) {
            currentAudio.currentTime = 0;
            currentAudio.pause();
            if (currentPause && currentPlay) {
                currentPlay.style.display = "block";
                currentPause.style.display = "none";
            }
        }

        audio.play();
        player.style.display = "flex";
        thumbnail.setAttribute("src", coverImage);

        currentAudio = audio;
        progressbar.max = currentAudio.duration;
        currentPlay = playButton;
        currentPause = pauseButton;

        playButton.style.display = "none";
        globalplay.innerHTML = '<i class="fa-solid fa-pause"></i>';
        pauseButton.style.display = "block";

        progressbar.onchange = () => {
            currentAudio.currentTime = progressbar.value;
        };

        if (currentAudio && currentAudio.play()) {
            setInterval(() => {
                progressbar.value = currentAudio.currentTime;
            }, 1000);
        }
    });

    pauseButton.addEventListener('click', () => {
        audio.pause();
        pauseButton.style.display = "none";
        playButton.style.display = "block";
        globalplay.innerHTML = '<i class="fa-solid fa-play"></i>';
    });

    return searchCard;
}



searchBox.addEventListener('input', async () => {
    const songName = searchBox.value.trim();
    if (songName === "") {
        searchList.textContent = "";
        matchingsongslist.innerHTML = ""; // Clear previous matches
        return;
    }

    try {
        const searchResponse = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(songName)}`, {
            headers: { Accept: '*/*' }
        });

        const searchData = await searchResponse.json();

        if (!searchData.success || searchData.data.results.length === 0) {
            searchList.innerHTML = "Song Not Found!";
            matchingsongslist.innerHTML = ""; // Clear previous matches
            return;
        }

        const song = searchData.data.results[0]; // First search result
        const coverImage = song.image[2].url; // 3rd quality image
        const mediaUrl = song.downloadUrl[4].url; // High-quality MP4 URL

        // Clear previous matching songs
        matchingsongslist.innerHTML = "";

        // Extract top 5 suggestions (excluding first one)
        const matchingsongs = searchData.data.results.length >= 5
            ? searchData.data.results.slice(1, 5)
            : searchData.data.results.slice(1);

        // Append matching songs to `matchingsongslist`
        matchingsongs.forEach(song1 => {
            matchingsongslist.appendChild(createCard(song1.image[2].url, song1.downloadUrl[4].url, song1.name));
        });

        searchList.textContent = "";

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
            if (currentAudio && currentAudio !== audio) {
                currentAudio.currentTime = 0;
                currentAudio.pause();
                if (currentPause && currentPlay) {
                    currentPlay.style.display = "block";
                    currentPause.style.display = "none";
                }
            }

            audio.play();
            player.style.display = "flex"
            thumbnail.setAttribute("src", coverImage)

            currentAudio = audio;
            progressbar.max = currentAudio.duration;
            currentPlay = playButton;
            currentPause = pauseButton;

            playButton.style.display = "none";
            globalplay.innerHTML = '<i class="fa-solid fa-pause"></i>';
            pauseButton.style.display = "block";

            progressbar.onchange = () => {
                currentAudio.currentTime = progressbar.value;
            };

            if (currentAudio && currentAudio.play()) {
                setInterval(() => {
                    progressbar.value = currentAudio.currentTime;
                }, 1000);
            }
        });

        pauseButton.addEventListener('click', () => {
            audio.pause();
            pauseButton.style.display = "none";
            playButton.style.display = "block";
            globalplay.innerHTML = '<i class="fa-solid fa-play"></i>';
        });

    } catch (error) {
        console.error("Error fetching song:", error);
        searchList.innerHTML = "Some error occurred while loading the song!";
    }
});

globalplay.addEventListener("click", () => {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
            globalplay.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Change icon to pause
            if (currentPlay && currentPause) {
                currentPlay.style.display = "none";
                currentPause.style.display = "block";
            }
        } else {
            currentAudio.pause();
            globalplay.innerHTML = '<i class="fa-solid fa-play"></i>'; // Change icon to play
            if (currentPlay && currentPause) {
                currentPause.style.display = "none";
                currentPlay.style.display = "block";
            }
        }
    }
});