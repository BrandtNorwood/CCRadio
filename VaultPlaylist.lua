local speakers = {peripheral.find("speaker")}

if (#speakers > 0) then
    local i = 1

    while true do
        local url = "https://github.com/BrandtNorwood/CCRadio/raw/main/VaultPlaylist/Song"..i..".dfpwm"
        local exists = http.get(url)
        
        if exists then
            exists.close()
            shell.run("speaker play " .. url)
            
            i = i + 1
            print("Playing next song.. ")
        else
            i = 1
            print("Hit end of Playlist. Restarting Playlist..")
        end
        
        speakers[1].stop()
        os.sleep(2)
    end
else
    print ("Attach a speaker with 'attach <side> speaker' first")
end
