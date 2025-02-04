const cards = document.querySelectorAll(".card")
let songData = {}
let currentAudio = null
let currentPause = null
let currentPlay = null
const player = document.querySelector("#player")
let thumbnail = document.querySelector("#thumb")
let progressbar = document.querySelector("#progressbar")
fetch("./database/audios.json")
    .then(response => response.json())
    .then(data => {
        songData = data; // Store JSON in a global variable
    })
// let title = null
cards.forEach(card => {
    let audio = null
    let titleElement = card.querySelector(".songname"); 
    let title = titleElement ? titleElement.textContent.trim() : "";
    let playbutton = card.querySelector(".play")
    let pausebutton = card.querySelector(".pause")
    setTimeout(() => {
        if (songData[title]) {
            audio = new Audio(songData[title]);
        }
    }, 1000);
    if(title){playbutton.addEventListener('click', ()=>{
            if(currentAudio && currentAudio!=audio){
            currentAudio.pause()
            if(currentPause&&currentPlay){currentPlay.style.display = "block"
            currentPause.style.display = "none"}
        }
        audio.play()
        thumbnail.setAttribute("src", card.getElementsByTagName("img")[0].getAttribute("src"))
        player.style.display = "flex"
        currentAudio = audio
        currentPlay = playbutton
        currentPause = pausebutton
        playbutton.style.display = "none"
        pausebutton.style.display = "block"
        
    })}
    pausebutton.addEventListener('click', ()=>{
        audio.pause()
        currentAudio = null
        currentPause = null
        currentPlay = null
        pausebutton.style.display = "none"
        playbutton.style.display = "block"
    })
})