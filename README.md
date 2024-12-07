# CC Radio
*A fun way to blast music within minecraft!*
*By Niko Norwood*

This was writen and tested in the CC:Tweaked minecraft mod and is intended to be used with the mods Speaker blocks. The contained lua script will reach out to a server run with the nodejs server contained within the Server directory.

## Usage
In minecraft copy the ccradio.lua file into the computer, change the url value to your server, and you are ready to go!

## Server Setup
The server defaults to port 3050 however this can be changed at the top of the `radioServer.js` file. The server requires the express library so you will need to import it using NPM as well as install NodeJS. Once these requirements are met simply run with `node radioServer.js` and the server should read the included song list and play!. If you would like to add songs that can be done by adding an entry to the SongList.json file and copying the .dfpwm file to the `CC_Songs` directory.

Server Requirements
* NodeJS (tested with v23.0.0)
* Express (tested with 4.21.1)
* Bygone Backend (Included)


