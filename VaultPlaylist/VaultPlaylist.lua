-- Program plays music on CC:Tweaked computers with an attached speaker
-- By Niko Norwood

local speakers = {peripheral.find("speaker")}

if (#speakers > 0) then
    local i = 1

    while true do
        -- URL references this repo
        local url = "https://github.com/BrandtNorwood/CCRadio/raw/main/VaultPlaylist/Song"..i..".dfpwm"
        local exists = http.get(url)

        -- Test if valid file and if not reset to begining
        if exists then
            exists.close()
            shell.run("speaker play " .. url)
            
            i = i + 1
            print("Playing next song.. ")
        else
            i = 1
            print("Hit end of Playlist. Restarting Playlist..")
        end

        -- Prevents buffer overflow and speaker screach
        speakers[1].stop()
        os.sleep(2)
    end
else
    print ("Attach a speaker with 'attach <side> speaker' first")
end
