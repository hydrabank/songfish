@echo off
cls
color a
echo [+] Starting Lavalink..
start wsl bash -c "cd lavalink; java -jar Lavalink.jar; exit"
wsl sleep 10
echo [+] Starting Songfish..
node src/index.js
wsl killall java