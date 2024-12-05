local speakers = {peripheral.find("speaker")}
if multishell.getCount() > 10 then
    os.reboot()
end
shell.run("speaker play "..(arg[1]).."/getCCFile")
speakers[1].stop()
os.sleep(2)
shell.exit()