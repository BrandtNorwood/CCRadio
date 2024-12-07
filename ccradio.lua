--set this to a server running ccradio
local url = "http://localhost:3050"

local speakers = {peripheral.find("speaker")}

term.clear()
term.setCursorPos(1,1)
print("Hold CTRL T to quit")

--BUG Does not work as expexted
if (speakers[1] == nil) then
    print("No speakers found!")
    shell.exit()
end

function requestSong()
    --make request for a sync frame
    local syncRequest = http.get(url.."/getSync")

    --make sure the request was valid
    if (syncRequest ~= nil) then

        --split request from json into object
        syncStatus = textutils.unserialiseJSON(syncRequest.readAll())

        if syncStatus.canPlay then

            --request song details
            local detailRequest = http.get(url.."/getSongDetails")
            songDetails = textutils.unserialiseJSON(detailRequest.readAll())
            term.clear()
            term.setCursorPos(1,1)
            print("Hold CTRL T to quit")
            term.setCursorPos(1,3)
            print("Song : "..songDetails.name)
            print("  By : "..songDetails.artist)

            --single shell version
            term.setCursorPos(1,6)
            shell.run("speaker play "..url.."/getCCFile")
            os.sleep(1)
            speakers[1].stop()

            term.clear()
            term.setCursorPos(1,1)
            print("Hold CTRL T to quit")

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
--little loop with a delay to avoid ddosing a host
while true do
    requestSong()
    os.sleep(0.5)
end
