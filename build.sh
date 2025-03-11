if [[ $1 == "install" ]]; then
	wails build
	sudo cp build/bin/lilspot /usr/bin/
	touch ~/.local/share/applications/lilspot.desktop
	echo "
[Desktop Entry]
Type=Application
Name=lilspot
GenericName=Music Player
Exec=lilspot
Terminal=false
StartupWMClass=lilspot
" > ~/.local/share/applications/lilspot.desktop

fi
