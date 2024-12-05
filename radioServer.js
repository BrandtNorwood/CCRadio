/*  Schedule Server V0.1

    NodeJs script to function as a server for web based scheduling application

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

const port = 3050;

// Middleware to parse JSON bodies
app.use(express.json());

//Cross origin setup since frontend is hosted seperatly                                 (This will need to be changed for Prod)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

//Throw some output to show different sessions in serverLog.txt
bygone.output("\n\n-----CC Radio Server v0.1-----\n");
bygone.output("INITIALIZING...");

//initialize variables for the sync frames
var syncFrameStart = Date.now();
var syncFrameLength = 0.0;

//Loads song list using bygone's cached file feature (overkill but simple)
songLibrary = new bygone.cachedFile("Song_Library/SongList.json")
//keeps track of current song being served.
var songCounter = 0;

//period between songs when clients can still start
var gracePeriod = 3000;



//Returns time remainging in the sync frame
app.get("/getSync", (req, res) => {
    let allowPlay = true;

    let remainingSyncFrame = (Date.now() - (syncFrameStart + syncFrameLength)) * -1;

    if (remainingSyncFrame > gracePeriod && Date.now() > syncFrameStart) {allowPlay = false;}

    res.send({canPlay:allowPlay, timerValue: remainingSyncFrame});
});



//Returns current song file
app.get("/getSongDetails", (req, res) => {
    currentSong = songLibrary.cache[songCounter];
    res.send({name:currentSong.name,artist:currentSong.artist,length:currentSong.length})


});


//Returns Computercraft coded file to client
app.get("/getCCFile",(req, res) =>{
    currentSong = songLibrary.cache[songCounter];

    let remainingSyncFrame = (Date.now() - (syncFrameStart + syncFrameLength)) * -1;

    if (remainingSyncFrame < gracePeriod){
        syncFrameLength = currentSong.length;
        syncFrameStart = Date.now();
        syncFrameStart += gracePeriod;

        songLibrary.updateCache();

        setTimeout(nextSong, gracePeriod);
        function nextSong() {
            songCounter++

            //if we have hit the end of the list head back to 0
            songLibraryPure = songLibrary.cache; //had and issue doing .cache.length
            if (songCounter >= songLibraryPure.length){
                songCounter = 0;
            }
            currentSong = songLibrary.cache[songCounter];
            bygone.debugOutput("Queued Next Song "+currentSong.name);
        }
    }

    //reply with client file
    res.sendFile(
        path.join(__dirname, "Song_Library/CC_Songs/"+currentSong.ccFileName)
    );
});



//start Server
app.listen(port, () =>{bygone.output(`Server Online at port ${port}`)})



// Close the logger when application exits
process.on('exit', () => {
    logger.close();
});