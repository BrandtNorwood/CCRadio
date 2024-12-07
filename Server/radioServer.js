/*  CC Radio Server V0.5

    NodeJs script to function as a server computercraft ccradio clients

    Dependancies
        * NodeJS
        * Express
        * bygoneBackend.js

    Created by Niko Norwood on 12/04/2024
*/


const express = require('express');
const app = express();
const bygone = require ('./bygoneBackend');
const path = require('path');
const { start } = require('repl');

//port the server will operate on
const port = 3050;

//enables randomizing songs on the list
const shuffle = true;

//period after song start when clients can still start playback
var gracePeriod = 3000;



// Middleware to parse JSON bodies
app.use(express.json());

//Cross origin setup since frontend is hosted seperatly                                 (This will need to be changed for Prod)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
//period after song start when clients can still start playback
var gracePeriod = 3000;mes
var syncFrameStart = Date.now();
var syncFrameLength = 0.0;

//Loads song list using bygone's cached file feature (overkill but simple)
var songLibraryFile = new bygone.cachedFile("Song_Library/SongList.json")
var songLibrary = {};



//condensed into a function
function updateSongLibrary(){
    songLibraryFile.updateCache().then(()=>{
        songLibrary = songLibraryFile.cache
        if(shuffle){
            shuffleArray(songLibrary);
        }
    });
}
updateSongLibrary();


//keeps track of current song being served.
var songCounter = 0;
var currentSong = null;



//stole from geeksforgeeks to shuffle the playlist array
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    bygone.debugOutput("Shuffled "+arr.length+" songs")
}



//queues next song or preroll
function nextSong() {
    //check if song is null in case its being called after program load
    if (currentSong != null){
        if (currentSong.isPreroll == null){
            //if song is not a preroll we can advance to the next one
            songCounter++;
        }
    }

    //if we have hit the end of the list head back to 0
    if (songCounter >= songLibrary.length){
        songCounter = 0;

        //reload and reshuffle (if enabled) song library in case anything was added
        updateSongLibrary();
    }

    //if the next song contains a preroll and we are not currently in one load the preload into the queue
    if (songLibrary[songCounter].preroll != null && currentSong.isPreroll == null){
        //creating an object for the preroll to live in
        currentSong = {};
        currentSong.ccFileName = songLibrary[songCounter].preroll.ccFileName;
        currentSong.length = songLibrary[songCounter].preroll.length
        currentSong.name = "preroll"
        currentSong.artist = "preroll"
        currentSong.isPreroll = true;

        bygone.debugOutput("Queued Preroll for Next Song "+currentSong.name);
    } else {
        currentSong = songLibrary[songCounter];
        bygone.debugOutput("Queued Next Song "+currentSong.name); 
    }
}



//Returns time remainging in the sync frame
app.get("/getSync", (req, res) => {
    let allowPlay = false;

    let remainingSyncFrame = (Date.now() - (syncFrameStart + syncFrameLength)) * -1;

    //if the sync frame is not over then dont allow play but do allow if less then 3 seconds has passed since start of sync frame
    if (remainingSyncFrame < 0 || Date.now() < syncFrameStart + gracePeriod) {allowPlay = true;}

    res.send({canPlay:allowPlay, timerValue: remainingSyncFrame});
});



//Returns current song file details
app.get("/getSongDetails", (req, res) => {
    if (currentSong == null){nextSong();}
    res.send({name:currentSong.name,artist:currentSong.artist,length:currentSong.length})
});


//Returns Computercraft coded file to client
app.get("/getCCFile",(req, res) =>{
    let remainingSyncFrame = (Date.now() - (syncFrameStart + syncFrameLength)) * -1;

    //If this is the first time a file is being requested on this loop then 
    if (remainingSyncFrame < gracePeriod){
        //define syncFrame start as now and offset it by the grace period for other clients to still be able to join
        syncFrameLength = currentSong.length;
        syncFrameStart = Date.now();

        //we use a timeout so that the song switch does not happen till after the grace period is over
        setTimeout(nextSong, gracePeriod*2);
    }

    //reply with client file
    res.sendFile(
        path.join(__dirname, "Song_Library/CC_Songs/"+currentSong.ccFileName)
    );
});



//start Server
app.listen(port, () =>{bygone.output(`Server Online at port ${port}`)})

// gonna be honest... no clue if this function is nessesary anymore ¯\_(ツ)_/¯
// Close the logger when application exits
process.on('exit', () => {
    logger.close();
});
