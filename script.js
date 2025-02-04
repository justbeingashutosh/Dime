const cards = document.querySelectorAll(".card")
let songData = {}
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
            audio.play()
            playbutton.style.display = "none"
            pausebutton.style.display = "block"
        
    })}
    pausebutton.addEventListener('click', ()=>{
        audio.pause()
        pausebutton.style.display = "none"
        playbutton.style.display = "block"
    })
})