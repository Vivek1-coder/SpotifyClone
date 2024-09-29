console.log("Let's write java")
let currentsong = new Audio();
let songs;
let currfolder;
async function getSongs(folder){
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    
    let response = await a.text()
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
              <img src="img/music.svg" alt="h"class = "invert" >
              <div class="info">
                <div>${song.replaceAll("%20"," ")}</div>
                
                <div>Mr. Unknown</div>

              </div>
              <div class="playnow">

                <span>Play Now</span>
                <img src="img/play.svg" alt="" class = "invert">
              </div>
            </li>`;


    }

    // var audio = new Audio(songs[0]);
    // audio.play();



    // audio.addEventListener("loadeddata",()=>{
    //     let duration = audio.duration;
    //     console.log(duration,audio.currentSrc,audio.currentTime)


    // });

    // Attach an Event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element =>{
           
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })

  return songs;
}


const playmusic = (track,pause = false)=>{
    
   currentsong.src = `/${currfolder}/` + track
   currentsong.play()
   play.src= "img/pause.svg"
   document.querySelector(".songinfo").innerHTML = track.split("-")[0]+ "...."
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
   if(pause == true){
        currentsong.pause()
        play.src= "img/play.svg"
   }

}

function formatTime(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);  // Calculate the number of minutes
    const remainingSeconds = Math.floor(seconds % 60);  // Calculate the remaining seconds

    const formattedMinutes = String(minutes).padStart(2, '0');  // Format minutes to be 2 digits
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');  // Format seconds to be 2 digits

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayALbums(){
    let a = await fetch(`/songs/`)
    
    let response = await a.text()
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors);
    
    for(let index = 0;index < array.length;index++){
            const e = array[index]
            
        


        if(e.href.includes("/songs/")){
            // console.log("e.href")
            // console.log(e.href.split("/").slice(-2)[1])
            let folder = e.href.split("/").slice(-2)[1]
            // console.log(folder)
            // Get the metadata of folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + 
            `<div class="card" data-folder= ${folder} >
            <div class="play" >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                <!-- Green circular shape -->
                <circle cx="25" cy="25" r="25" fill="green" />
                <!-- Smaller black play triangle -->
                <polygon points="20,15 35,25 20,35" fill="black" />
              </svg>
              </div>
            <img src="/songs/${folder}/cover.png" alt="animal">
            <h2>${response.title}</h2>
            <p>
            ${response.description}
            </p>
          </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",async item=> {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })

}




async function main(){

    
    // Get the list of songs
    await getSongs("songs/ncs")
    playmusic(songs[0].replaceAll("%20"," "),true)

    // Show all the songs in the playlist

    // Display all the albums on the page
    displayALbums()


    // Add a event listener to play prev and next
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src= "img/pause.svg"
        }
        else{
            currentsong.pause()
            play.src= "img/play.svg"

        }
    })


    // Listen for time update 
    currentsong.addEventListener("timeupdate",()=>{
        // console.log(formatTime(currentsong.currentTime),formatTime(currentsong.duration));
        document.querySelector(".songtime").innerHTML =  `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",e => {
       document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + '%'
        currentsong.currentTime = currentsong.duration * (e.offsetX/e.target.getBoundingClientRect().width)
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="-110%" ;
    })

    previous.addEventListener("click",()=>{
        
       let songl =  currentsong.src.split("/").slice(-1)[0];
       let index;
       for (let i = 0;i<songs.length ;i++) {
        if(songs[i] == songl){
            if(i == 0){
                index = songs.length-1;
            }
            else{
                index = i-1;
            }
            break;
        }

       }
       playmusic(songs[index].replaceAll("%20"," "))
       
    })
    nxt.addEventListener("click",()=>{
        
        let songl =  currentsong.src.split("/").slice(-1)[0];
       let index;
       for (let i = 0;i<songs.length ;i++) {
        if(songs[i] == songl){
            if(i == songs.length - 1){
                index = 0;
            }
            else{
                index = i+1;
            }
            break;
        }

       }
       playmusic(songs[index].replaceAll("%20"," "))
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e => {
        currentsong.volume = parseInt(e.target.value) / 100
        if(currentsong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
    })



    document.querySelector(".volume>img").addEventListener("click",e => {
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume = 0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })
    
}
main()