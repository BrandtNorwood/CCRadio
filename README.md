# CC Radio
*A fun way to blast music within minecraft!*
*By Niko Norwood*

This was writen and tested in the CC:Tweaked minecraft mod and is intended to be used with the mods Speaker blocks. The contained lua script will reach out to a server run with the nodejs server contained within the Server directory. ccradio.lua fires off player.lua in a seperate shell so both files are required on each client.

Usage
 In minecraft copy the ccradio.lua file into the computer, change the url value to your server, and you are ready to go!

Server Requirements
* NodeJS (tested with v23.0.0)
* Express (tested with 4.21.1)

once these requirements are met simply run with `node radioServer.js`
