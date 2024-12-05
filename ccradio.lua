local speakers = {peripheral.find("speaker")}
local url = "http://localhost:3050"

term.clear()
term.setCursorPos(1,1)
print("Hold CTRL T to quit")

function requestSong()
    local syncRequest = http.get(url.."/getSync")

    if (syncRequest ~= nil) then

        syncStatus = textutils.unserialiseJSON(syncRequest.readAll())

        if syncStatus.canPlay then

            local detailRequest = http.get(url.."/getSongDetails")
            songDetails = textutils.unserialiseJSON(detailRequest.readAll())
            term.clear()
            term.setCursorPos(1,1)
            print("Hold CTRL T to quit")
            term.setCursorPos(1,4)
            print("Song : "..songDetails.name)
            print("  By : "..songDetails.artist)
            shell.openTab("player.lua", url)
            os.sleep(10)

        else
            term.setCursorPos(1,2)
            term.clearLine()
            print("in-between songs. "..math.floor(syncStatus.timerValue/1000).." seconds remaining")
        end
    else
        term.setCursorPos(1,2)
        term.clearLine()
        print ("Invalid Server Connection")
    end
end
while true do
    requestSong()
    os.sleep(0.5)
end