local speakers = {peripheral.find("speaker")}

if (#speakers > 0) then
    local i = 1
    local playlistLength = 6

    while true do
        shell.run("speaker play https://github.com/BrandtNorwood/CCRadio/raw/main/VaultPlaylist/Song"..i..".dfpwm")
        os.sleep(2)
        i = i + 1
        if (i > playlistLength) then
            i = 1
        end
    end
else
    write ("Attach a speaker with 'attach <side> speaker' first")
end
